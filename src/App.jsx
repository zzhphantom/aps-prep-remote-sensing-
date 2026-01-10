import React, { useState, useEffect } from 'react';
import { Layers, BookOpen, Award, Sparkles, Smartphone } from 'lucide-react';
import { collection, addDoc, deleteDoc, doc, query, where, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { calculateCourseProgress } from './utils/aiProgress'; // Import Progress Util

// Import refactored components
import Dashboard, { InterviewSim } from './components/Dashboard';
import CourseList from './components/CourseList';
import Settings from './components/Settings';
import CourseModal from './components/CourseModal';
import Toast from './components/ui/Toast';
import useFavicon from './hooks/useFavicon';
import { useCourseData } from './hooks/useCourseData';

const DEMO_USER_ID = 'demo-user-1';

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [toast, setToast] = useState(null);

  // AI 配置状态
  const [aiConfig, setAiConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_config');
      return saved ? JSON.parse(saved) : {
        model: 'gemini-2.5-flash-preview-09-2025',
        apiKey: '',
        provider: 'google'
      };
    } catch {
      return {
        model: 'gemini-2.5-flash-preview-09-2025',
        apiKey: '',
        provider: 'google'
      };
    }
  });

  // 保存 AI 配置到 localStorage
  useEffect(() => {
    localStorage.setItem('ai_config', JSON.stringify(aiConfig));
  }, [aiConfig]);

  useFavicon();

  // 1. 获取基础课程数据 (本地或云端)
  const { data: baseCoursesData } = useCourseData();

  // 2. 本地状态维护最终的课程数据 (合并了笔记的)
  const [coursesData, setCoursesData] = useState([]);

  // 当基础数据变化时，初始化
  useEffect(() => {
    if (baseCoursesData) {
      setCoursesData(baseCoursesData);
    }
  }, [baseCoursesData]);

  // 3. 从 Firestore 加载当前用户的学习笔记并合并到课程数据中
  useEffect(() => {
    const loadNotesFromFirestore = async () => {
      if (!baseCoursesData || baseCoursesData.length === 0) return;

      try {
        const q = query(
          collection(db, 'notes'),
          where('userId', '==', DEMO_USER_ID)
        );
        const snapshot = await getDocs(q);
        const remoteNotes = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        // 加载进度数据
        const progressSnap = await getDocs(collection(db, 'course_progress'));
        const progressMap = {};
        progressSnap.forEach(doc => {
          if (doc.data().userId === DEMO_USER_ID) {
            progressMap[doc.data().courseId] = doc.data().percentage;
          }
        });

        setCoursesData(prev =>
          prev.map(cat => ({
            ...cat,
            courses: cat.courses.map(course => {
              const notesForCourse = remoteNotes.filter(
                n => n.courseId === course.id
              );
              // 如果没有笔记，保留原course
              if (!notesForCourse.length) return course;

              const formatted = notesForCourse
                .map(n => ({
                  id: n.id,
                  question: n.question,
                  answer: n.answer,
                  date: n.createdAt
                    ? new Date(n.createdAt.seconds * 1000).toLocaleDateString()
                    : new Date().toLocaleDateString(),
                }))
                // 新的在前
                .sort((a, b) => (a.date < b.date ? 1 : -1));

              return {
                ...course,
                notes: formatted,
                progress: progressMap[course.id] || 0 // 合并进度
              };
            }),
          }))
        );
      } catch (e) {
        console.error('加载 Firestore 笔记失败:', e);
      }
    };

    loadNotesFromFirestore();
  }, [baseCoursesData]); // 依赖 baseCoursesData，确保由于动态加载滞后时能重新合并

  // 根据 ID 实时计算当前选中的课程对象 (Derived State)
  const selectedCourse = selectedCourseId
    ? coursesData.flatMap(c => c.courses).find(c => c.id === selectedCourseId)
    : null;

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const saveNote = async (courseId, question, answer) => {
    try {
      const createdAt = new Date();
      const docRef = await addDoc(collection(db, 'notes'), {
        userId: DEMO_USER_ID,
        courseId,
        question,
        answer,
        createdAt,
      });

      const newNote = {
        id: docRef.id,
        question,
        answer,
        date: createdAt.toLocaleDateString(),
      };

      setCoursesData(prevData =>
        prevData.map(cat => ({
          ...cat,
          courses: cat.courses.map(c => {
            if (c.id === courseId) {
              const existingNotes = c.notes || [];
              const updatedNotes = [newNote, ...existingNotes];

              // 异步触发进度更新 (即使失败也不阻塞UI)
              (async () => {
                try {
                  // 1. 找到该课程
                  const currentCourse = coursesData.flatMap(cat => cat.courses).find(co => co.id === courseId);
                  const goals = currentCourse?.goals?.cn || "";
                  const name = currentCourse?.name || "";
                  const currentProgress = c.progress || 0;

                  // 2. 调用 AI 计算新进度
                  const newProgress = await calculateCourseProgress(name, goals, updatedNotes, currentProgress, aiConfig);

                  // 3. 保存进度到 Firestore (允许分数波动，不仅是增加)
                  if (newProgress !== currentProgress) {
                    await setDoc(doc(db, 'course_progress', `${DEMO_USER_ID}_${courseId}`), {
                      userId: DEMO_USER_ID,
                      courseId,
                      percentage: newProgress,
                      lastUpdated: new Date(),
                      noteCount: updatedNotes.length // Save note count
                    });

                    // 4. 更新本地状态 (Update UI)
                    setCoursesData(latest => latest.map(category => ({
                      ...category,
                      courses: category.courses.map(co =>
                        co.id === courseId ? { ...co, progress: newProgress } : co
                      )
                    })));

                    if (newProgress > currentProgress) {
                      showToast(`AI 评估：当前掌握度提升至 ${newProgress}%`);
                    } else {
                      showToast(`AI 评估：当前掌握度调整为 ${newProgress}%`);
                    }
                  }
                } catch (err) {
                  console.error("Auto progress update failed", err);
                }
              })();

              return { ...c, notes: updatedNotes };
            }
            return c;
          }),
        }))
      );

      showToast('笔记已保存（已同步到云端）');
    } catch (e) {
      console.error('保存笔记到 Firestore 失败:', e);
      showToast('笔记保存失败，请稍后重试');
    }
  };

  // 删除本地 & Firestore 中的学习笔记
  const deleteNote = async (courseId, noteId) => {
    if (!window.confirm('确定要删除这条笔记吗？')) return;

    try {
      await deleteDoc(doc(db, 'notes', noteId));
    } catch (e) {
      // 如果是本地初始化示例笔记（没有对应云端文档），忽略删除错误
      console.warn('删除 Firestore 笔记时出现问题（可忽略示例数据）:', e);
    }

    setCoursesData(prevData =>
      prevData.map(cat => ({
        ...cat,
        courses: cat.courses.map(c => {
          if (c.id === courseId) {
            const updatedNotes = (c.notes || []).filter(n => n.id !== noteId);

            // ⚠️ 删除笔记时触发重算，允许分数下降
            (async () => {
              try {
                const currentCourse = coursesData.flatMap(cat => cat.courses).find(co => co.id === courseId);
                const goals = currentCourse?.goals?.cn || "";
                const name = currentCourse?.name || "";
                const currentProgress = c.progress || 0;

                // AI 重新评分
                const newProgress = await calculateCourseProgress(name, goals, updatedNotes, currentProgress, aiConfig);

                // 这里的关键：如果新分数不同（哪怕降低），也更新
                if (newProgress !== currentProgress) {
                  await setDoc(doc(db, 'course_progress', `${DEMO_USER_ID}_${courseId}`), {
                    userId: DEMO_USER_ID,
                    courseId,
                    percentage: newProgress,
                    lastUpdated: new Date(),
                    noteCount: updatedNotes.length // Save note count for optimization
                  });

                  setCoursesData(latest => latest.map(category => ({
                    ...category,
                    courses: category.courses.map(co =>
                      co.id === courseId ? { ...co, progress: newProgress } : co
                    )
                  })));

                  // 只有下降时才给提示，让用户知道删笔记会有影响
                  if (newProgress < currentProgress) {
                    showToast(`笔记删除，掌握度调整为 ${newProgress}%`);
                  }
                }
              } catch (e) {
                console.error("Progress recalc on delete failed", e);
              }
            })();

            return { ...c, notes: updatedNotes };
          }
          return c;
        }),
      }))
    );
    showToast('笔记已删除');
  };

  // 一键更新所有课程进度
  const handleUpdateAllProgress = async (onProgress) => {
    if (!aiConfig.apiKey) {
      showToast('❌ 请先配置 API Key');
      return;
    }

    if (!window.confirm('这将使用 AI 重新评估所有有笔记的课程进度，可能需要一些时间。\n\n确定要继续吗？')) return;

    showToast('🚀 开始更新所有课程进度...');
    let updatedCount = 0;

    // 筛选出有笔记的课程
    const coursesWithNotes = coursesData.flatMap(cat => cat.courses).filter(c => c.notes && c.notes.length > 0);
    const total = coursesWithNotes.length;

    // 并行限制处理，避免瞬间触发 API Rate Limit
    // 优化：从course_progress中读取上次评估时的笔记数量，如果数量没变，则跳过
    const progressSnapshot = await getDocs(collection(db, 'course_progress'));
    const progressDataMap = {};
    progressSnapshot.forEach(doc => {
      if (doc.data().userId === DEMO_USER_ID) {
        progressDataMap[doc.data().courseId] = doc.data();
      }
    });

    for (let i = 0; i < total; i++) {
      const course = coursesWithNotes[i];
      const currentNoteCount = course.notes ? course.notes.length : 0;
      const lastProgressData = progressDataMap[course.id];
      const lastNoteCount = lastProgressData?.noteCount || 0;

      // 如果笔记数量没变且上次也没报错（默认有lastUpdated说明成功过），则跳过
      // 注意：这里简单用数量判断。如果用户只是修改了笔记内容但数量没变，这个逻辑会跳过。
      // 但对于"一键更新"这个耗时操作来说，这是一个合理的trade-off。
      // 如果用户真的只改了内容想强制刷新，可以建议他们手动触发或者我们加一个"强制刷新"参数。
      if (lastProgressData && lastNoteCount === currentNoteCount) {
        if (onProgress) onProgress(i + 1, total);
        continue; // Skip
      }

      // 调用回调更新进度 UI
      if (onProgress) {
        onProgress(i + 1, total);
      }

      try {
        const goals = course.goals?.cn || "";
        const name = course.name || "";
        const currentProgress = course.progress || 0;

        const newProgress = await calculateCourseProgress(name, goals, course.notes, currentProgress, aiConfig);

        if (newProgress !== currentProgress) {
          await setDoc(doc(db, 'course_progress', `${DEMO_USER_ID}_${course.id}`), {
            userId: DEMO_USER_ID,
            courseId: course.id,
            percentage: newProgress,
            lastUpdated: new Date(),
            noteCount: course.notes ? course.notes.length : 0 // Save note count for optimization
          });
          updatedCount++;
        }
      } catch (err) {
        console.error(`Failed to update progress for ${course.name}:`, err);
      }
    }

    if (updatedCount > 0) {
      showToast(`✅ 更新完成！${updatedCount} 个课程进度已变更。即将刷新...`);
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showToast('✅ 更新完成！所有课程进度暂无变化。');
    }
  };

  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [highlightTerm, setHighlightTerm] = useState(null); // Highlighting State

  const renderContent = () => {
    switch (tab) {
      case 'dashboard': return <Dashboard setActiveTab={setTab} aiConfig={aiConfig} />;
      case 'courses': return (
        <CourseList
          courses={coursesData}
          setSelectedCourse={(c, noteId, term) => {
            setSelectedCourseId(c.id);
            setSelectedNoteId(noteId || null);
            setHighlightTerm(term || null);
          }}
        />
      );
      case 'interview': return <InterviewSim aiConfig={aiConfig} />;
      case 'settings': return <Settings aiConfig={aiConfig} setAiConfig={setAiConfig} showToast={showToast} onUpdateAllProgress={handleUpdateAllProgress} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full p-4 z-20 flex-shrink-0">
        <div className="flex items-center space-x-3 px-4 py-4 mb-6"><div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">RS</div><span className="font-bold text-slate-800 text-lg tracking-tight">Logic Prep</span></div>
        <nav className="space-y-2 flex-1">
          {[{ id: 'dashboard', label: '概览 Dashboard', icon: Layers }, { id: 'courses', label: '课程 Courses', icon: BookOpen }, { id: 'interview', label: '模拟 Interview', icon: Award }, { id: 'settings', label: '设置 Settings', icon: Sparkles }].map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${tab === item.id ? 'bg-teal-50 text-teal-700 font-bold shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><item.icon className="w-5 h-5" /><span>{item.label}</span></button>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-slate-100 text-xs text-slate-400 px-4">APS Prep Assistant v2.6</div>
      </aside>
      <div className="flex-1 flex flex-col h-full relative min-w-0">
        <header className="md:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center z-30"><div className="flex items-center space-x-3" onClick={() => setTab('dashboard')}><div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">RS</div><span className="font-bold text-slate-800 text-lg tracking-tight">Logic Prep</span></div><Smartphone className="w-5 h-5 text-slate-400" /></header>
        <main className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-8 max-w-7xl mx-auto w-full">{renderContent()}</main>
        <nav className="md:hidden bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-30 pb-safe sm:pb-3">
          {['dashboard', 'courses', 'interview', 'settings'].map(t => <button key={t} onClick={() => setTab(t)} className={`flex flex-col items-center w-16 space-y-1.5 ${tab === t ? 'text-teal-600 scale-105' : 'text-slate-400'}`}>{t === 'dashboard' ? <Layers className="w-6 h-6" /> : t === 'courses' ? <BookOpen className="w-6 h-6" /> : t === 'interview' ? <Award className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}<span className="text-[10px] font-bold uppercase">{t}</span></button>)}
        </nav>
      </div>

      {/* 始终渲染 Modal，通过 selectedCourseId 控制显示内容 */}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => { setSelectedCourseId(null); setSelectedNoteId(null); setHighlightTerm(null); }}
          onSaveNote={saveNote}
          onDeleteNote={deleteNote}
          aiConfig={aiConfig}
          setTab={setTab}
          initialNoteId={selectedNoteId}
          highlightTerm={highlightTerm}
        />
      )}
    </div>
  );
}