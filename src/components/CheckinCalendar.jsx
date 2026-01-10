
import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import {
  Activity,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  X,
} from 'lucide-react';
import { db } from '../firebase';

// 复用原来 App 里的日历 Modal UI，但数据改为从 Firestore 聚合后的 history
const LocalCalendarModal = ({ history, onClose }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDateLog, setSelectedDateLog] = useState(null);

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: firstDay })
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const changeMonth = (offset) =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1),
    );

  const handleDayClick = (day) => {
    if (!day) return;
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    ).toDateString();
    setSelectedDateLog({
      date: dateStr,
      content: history[dateStr] || '暂无打卡记录',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 bg-teal-600 text-white flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2">
            <CalendarDays className="w-5 h-5" /> 学习日历
          </h3>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <ChevronLeft className="w-5 h-5 text-slate-500" />
            </button>
            <span className="font-bold text-slate-700">
              {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
            {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
              <div
                key={d}
                className="text-slate-400 text-xs font-bold"
              >
                {d}
              </div>
            ))}
            {days.map((day, i) => {
              if (!day) return <div key={i} />;
              const dateStr = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day,
              ).toDateString();
              const isChecked = !!history[dateStr];
              const isToday = dateStr === today.toDateString();
              return (
                <div
                  key={i}
                  onClick={() => handleDayClick(day)}
                  className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all relative ${isToday
                    ? 'border-2 border-teal-500 text-teal-600 font-bold'
                    : ''
                    } ${isChecked
                      ? 'bg-teal-100 text-teal-800 font-bold'
                      : 'hover:bg-slate-100 text-slate-600'
                    }`}
                >
                  {day}
                  {isChecked && (
                    <div className="absolute bottom-1 w-1 h-1 bg-teal-500 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
          {selectedDateLog && (
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-teal-500" />
                <span className="text-xs font-bold text-slate-500">
                  {selectedDateLog.date}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedDateLog.content}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 主组件：UI 与原来的 DailyCheckIn 一致，但数据来源改为 Firestore
const CheckinCalendar = ({ userId }) => {
  const [reflection, setReflection] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [checked, setChecked] = useState(false);

  const [history, setHistory] = useState({});
  const [streak, setStreak] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [loading, setLoading] = useState(true);

  // 计算连续打卡天数（从最近一次打卡那天往前连着算）
  const recomputeStreak = (historyMap, latestDate) => {
    if (!latestDate) return 0;
    let s = 0;
    const cur = new Date(latestDate);
    // 从 latestDate 开始，往前一天一天找，直到遇到断档
    // 例如：有 3 天连续打卡，则返回 3
    while (true) {
      const key = cur.toDateString();
      if (!historyMap[key]) break;
      s += 1;
      cur.setDate(cur.getDate() - 1);
    }
    return s;
  };

  // 从 Firestore 实时监听打卡记录，构建 history（最近 60 天）
  useEffect(() => {

    if (!userId) return;

    // 只按 userId 过滤，避免复合索引问题；实时监听变化
    const q = query(
      collection(db, 'checkins'),
      where('userId', '==', userId),
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const map = {};
        let latest = null;

        snap.forEach((docSnap) => {
          const data = docSnap.data();
          if (!data.date) return;
          const d = data.date.toDate();
          const key = d.toDateString();
          const text = data.notes || '';
          map[key] = map[key]
            ? `${map[key]} | ${text}`
            : text || '已打卡';

          if (!latest || d > latest) latest = d;
        });

        // 只保留最近 60 天以内的记录，避免无穷拉取
        const today = new Date();
        const sixtyAgo = new Date();
        sixtyAgo.setDate(today.getDate() - 60);

        const filteredMap = {};
        Object.entries(map).forEach(([key, value]) => {
          const d = new Date(key);
          if (d >= sixtyAgo && d <= today) {
            filteredMap[key] = value;
          }
        });

        const latestKey = latest ? latest.toDateString() : null;

        setHistory(filteredMap);
        setTotalDays(Object.keys(map).length);
        // 只要今天有记录，就认为“今日复盘已完成”
        setChecked(!!filteredMap[new Date().toDateString()]);

        // 修正 Streak 计算逻辑：如果断签（即最近一次打卡不是今天也不是昨天），则重置为 0
        if (latest) {
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          const lastDate = new Date(latest);
          lastDate.setHours(0, 0, 0, 0);

          const diffTime = Math.abs(now - lastDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays > 1) {
            setStreak(0);
          } else {
            setStreak(recomputeStreak(filteredMap, latest));
          }
        } else {
          setStreak(0);
        }
        setLoading(false);
      },
      (e) => {
        console.error('加载打卡历史失败:', e);
        setLoading(false);
      },
    );

    // 组件卸载或 userId 变化时取消订阅
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [userId]);

  const handleCheckIn = async () => {
    if (!userId) {
      alert('请先登录以进行打卡！');
      return;
    }
    if (!reflection.trim()) return;

    try {
      const now = new Date();
      await addDoc(collection(db, 'checkins'), {
        userId,
        date: Timestamp.fromDate(now),
        type: '学习',
        notes: reflection.trim(),
      });

      const todayKey = now.toDateString();
      const newHistory = {
        ...history,
        [todayKey]: history[todayKey]
          ? `${history[todayKey]} | ${reflection.trim()}`
          : reflection.trim(),
      };

      setHistory(newHistory);
      setTotalDays(prev => prev + 1);
      setReflection('');
      setChecked(true);
      setStreak(recomputeStreak(newHistory));
    } catch (e) {
      console.error('添加打卡失败:', e);
      alert('打卡失败，请稍后再试。');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
      <div className="flex justify-between mb-6 relative z-10">
        <h3 className="text-lg font-bold flex items-center text-slate-800">
          <Activity className="mr-2 text-teal-600 w-5 h-5" /> 每日复盘
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCalendar(true)}
            className="text-xs font-bold bg-white text-slate-600 border border-slate-200 px-3 py-1.5 rounded-full flex items-center hover:bg-slate-50 transition-colors"
          >
            <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-teal-600" /> 日历
          </button>
          <span className="text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full border border-teal-100">
            Day {streak} 🔥 / Total {totalDays}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-slate-500 text-sm">正在从云端同步今日复盘状态…</p>
        </div>
      ) : checked ? (
        <div className="text-center py-8 bg-green-50/50 rounded-xl border border-green-100">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" />
          <p className="text-green-800 font-bold text-sm">
            今日复盘已完成
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            className="w-full p-4 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white transition-colors"
            rows="3"
            placeholder="今天的感悟..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
          <button
            onClick={handleCheckIn}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-teal-200"
          >
            提交打卡
          </button>
        </div>
      )}

      {showCalendar && (
        <LocalCalendarModal
          history={history}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
};

export default CheckinCalendar;

