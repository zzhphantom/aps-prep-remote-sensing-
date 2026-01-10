import React, { useState, useEffect } from 'react';
import { Layers, BookOpen, MessageSquare, GraduationCap, RefreshCw, Sparkles, ChevronLeft, ChevronRight, List, History } from 'lucide-react';
import HighlightText from './ui/HighlightText';
import { QUOTES } from '../data';
import CheckinCalendar from './CheckinCalendar';
import callGemini from '../utils/gemini';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const DEMO_USER_ID = 'demo-user-1';

const InterviewSim = ({ aiConfig }) => {
    // 默认内置题目
    const defaultQs = [
        {
            q_en: "Calculate the range resolution of a Radar system with pulse duration τ?",
            q_cn: "计算脉冲持续时间为 τ 的雷达系统的距离分辨率？",
            a_en: "Range Resolution = (c * τ) / 2",
            a_cn: "距离分辨率 = (光速 c * 脉冲宽度 τ) / 2"
        },
        {
            q_en: "What are the common geometric distortions in SAR images?",
            q_cn: "SAR 图像中常见的几何畸变有哪些？",
            a_en: "Foreshortening, Layover, and Shadow.",
            a_cn: "透视收缩（Foreshortening）、顶底倒置（Layover）和阴影（Shadow）。"
        }
    ];

    const [qs, setQs] = useState(defaultQs); // 题目列表（内置 + 云端）
    const [cloudQs, setCloudQs] = useState([]); // 仅云端题目

    // 监听 Firestore 题目更新
    useEffect(() => {
        const q = query(collection(db, 'interview_questions'), orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => doc.data());
            setCloudQs(fetched);
            // 合并：内置在前，云端在后
            setQs([...defaultQs, ...fetched]);
        }, (err) => {
            console.error("加载云端题库失败:", err);
        });
        return () => unsubscribe();
    }, []);

    const [idx, setIdx] = useState(0); // 当前题目索引
    const [show, setShow] = useState(false); // 显示答案
    const [loading, setLoading] = useState(false); // AI 生成中
    const [showList, setShowList] = useState(false); // 显示列表视图
    const [searchTerm, setSearchTerm] = useState("");

    const jumpTo = (i) => {
        setIdx(i);
        setShow(false);
        setShowList(false);
        setSearchTerm("");
    };



    const handleNext = async () => {
        // 如果不是最后一题，直接跳下一题
        if (idx < qs.length - 1) {
            setIdx(idx + 1);
            setShow(false);
            return;
        }

        // 最后一题：生成新题
        if (!aiConfig?.apiKey) {
            alert("请先在设置中配置 API Key 才能生成新题目！");
            return;
        }

        setLoading(true);
        setShow(false);

        try {
            const prompt = "你是APS审核官。请生成一道关于遥感(Remote Sensing)或GIS的简短面试题。题目类型可以灵活多样，包括具体概念考察，或者不同概念/课程之间的区别与联系（例如：光学与雷达的区别、GIS与RS的关联等）。要求包含中英文对照的问题和答案。请严格按以下JSON格式返回：{\"q_en\": \"English Question\", \"q_cn\": \"中文问题\", \"a_en\": \"English Answer\", \"a_cn\": \"中文答案\"}。不要包含其他文字。";
            const res = await callGemini(prompt, aiConfig);

            // 尝试解析 JSON
            const cleanJson = res.replace(/```json|```/g, '').trim();
            const newQ = JSON.parse(cleanJson);

            // 保存到 Firestore
            await addDoc(collection(db, 'interview_questions'), {
                ...newQ,
                createdAt: serverTimestamp(),
                userId: DEMO_USER_ID // 可选：标记是谁生成的
            });

            // 下方逻辑由 onSnapshot 自动处理更新 UI
            // 我们只需要切换到下一题（稍微延迟一下等待同步？）
            // 由于 onSnapshot 是异步的，我们可以先临时手动加进去提升体验，或者 trusting the cloud speed.
            // 为了最顺滑体验，我们可以在这里手动 setIdx(idx + 1) 
            // 但如果 snapshot 快，idx 可能会越界？
            // 简单做法：等待 snapshot 更新后，如果 idx 指向的是旧的最后一位，需要让用户再点一次吗？
            // 不，我们通过监听 qs 的长度变化来自动跳转？
            // 或者：直接在这里临时 setQs，等 snapshot 覆盖。

            // 简单且稳健的做法：
            setIdx(idx + 1);

        } catch (e) {
            console.error("AI 生成/保存失败:", e);
            alert("AI 生成题目失败，请重试");
        } finally {
            setLoading(false);
        }
    };

    const handlePrev = () => {
        if (idx > 0) {
            setIdx(idx - 1);
            setShow(false);
        }
    };



    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full relative overflow-hidden">
            {/* Header: Title + History Toggle */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center text-slate-800">
                    <RefreshCw className={`mr-2 w-5 h-5 text-purple-600 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? "AI 出题中..." : "模拟面试"}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100">
                        {idx + 1} / {qs.length}
                    </span>
                    <button
                        onClick={() => setShowList(!showList)}
                        className={`p-2 rounded-lg transition-colors ${showList ? 'bg-purple-100 text-purple-700' : 'hover:bg-slate-100 text-slate-500'}`}
                        title="题目列表"
                    >
                        {showList ? <List className="w-5 h-5" /> : <History className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* List View Overlay */}
            {showList && (
                <div className="absolute inset-0 top-[70px] bg-white z-20 overflow-y-auto px-6 pb-6 animate-in slide-in-from-right-10">
                    <h4 className="font-bold text-slate-700 mb-4 flex items-center justify-between">
                        <span className="flex items-center"><List className="w-4 h-4 mr-2" /> 历史题库 ({qs.length})</span>
                    </h4>

                    {/* 搜索框 */}
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="搜索问题或答案..."
                            value={searchTerm}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                    <div className="space-y-3">
                        <div className="space-y-3">
                            {qs.map((item, i) => {
                                const term = searchTerm.toLowerCase();
                                const matches = item.q_en.toLowerCase().includes(term) ||
                                    item.q_cn.includes(term) ||
                                    item.a_en.toLowerCase().includes(term) ||
                                    item.a_cn.includes(term);

                                if (!matches) return null;

                                return (
                                    <div
                                        key={i}
                                        onClick={() => jumpTo(i)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${i === idx ? 'border-purple-500 bg-purple-50 shadow-sm' : 'border-slate-100 hover:border-purple-200 hover:bg-slate-50'}`}
                                    >
                                        <div className="flex justify-between mb-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${i === idx ? 'bg-purple-200 text-purple-800' : 'bg-slate-200 text-slate-600'}`}>Q-{i + 1}</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-800 line-clamp-2">
                                            <HighlightText text={item.q_en} highlight={searchTerm} />
                                        </p>
                                        <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                                            <HighlightText text={item.q_cn} highlight={searchTerm} />
                                        </p>
                                    </div>
                                );
                            })}
                            {qs.filter(item =>
                                item.q_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                item.q_cn.includes(searchTerm) ||
                                item.a_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                item.a_cn.includes(searchTerm)
                            ).length === 0 && (
                                    <div className="text-center text-slate-400 py-8 text-sm">暂无匹配题目</div>
                                )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Question Card */}
            <div className={`flex-grow flex flex-col justify-center transition-opacity duration-300 ${showList ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                {loading ? (
                    <div className="space-y-3 animate-pulse">
                        <div className="h-6 bg-slate-100 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-2 mb-4">
                            <h4 className="text-xl font-bold text-slate-800 leading-snug">{qs[idx].q_en}</h4>
                            <p className="text-base text-slate-500 font-medium">{qs[idx].q_cn}</p>
                        </div>

                        {show ? (
                            <div className="bg-slate-50 p-5 rounded-2xl text-sm text-slate-700 border-l-4 border-purple-500 animate-in fade-in space-y-3 max-h-[40vh] overflow-y-auto scrollbar-hide">
                                <div>
                                    <p className="font-bold text-slate-800 mb-1">English Answer:</p>
                                    <p>{qs[idx].a_en}</p>
                                </div>
                                <div className="border-t border-slate-200 pt-2">
                                    <p className="font-bold text-slate-800 mb-1">中文参考:</p>
                                    <p>{qs[idx].a_cn}</p>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => setShow(true)}
                                className="h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400 cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all"
                            >
                                点击查看中英对照答案
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Control Bar */}
            <div className="flex items-center gap-3 mt-8">
                <button
                    onClick={handlePrev}
                    disabled={idx === 0 || loading}
                    className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-colors flex items-center justify-center gap-2"
                >
                    <ChevronLeft className="w-4 h-4" /> 上一题
                </button>

                <button
                    onClick={() => setShow(!show)}
                    disabled={loading}
                    className="flex-1 py-3 border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    {show ? "隐藏答案" : "查看答案"}
                </button>

                <button
                    onClick={handleNext}
                    disabled={loading}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 ${idx === qs.length - 1
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-teal-600 text-white hover:bg-teal-700'
                        }`}
                >
                    {idx === qs.length - 1 ? <><Sparkles className="w-4 h-4 text-yellow-400" /> AI 生成</> : <>下一题 <ChevronRight className="w-4 h-4" /></>}
                </button>
            </div>
        </div>
    );
};

const Dashboard = ({ setActiveTab, aiConfig }) => {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-gradient-to-r from-teal-700 to-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-teal-100 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Ready?</h1>
                    <p className="text-teal-50 text-sm mb-5 italic">"{QUOTES[0]}"</p>
                    <div className="flex items-center text-xs font-mono font-bold bg-black/20 backdrop-blur-sm w-fit px-4 py-1.5 rounded-full border border-white/10">
                        <GraduationCap className="w-3.5 h-3.5 mr-2" /> CUG {'->'} Germany
                    </div>
                </div>
                <Layers className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 rotate-12" />
            </div>

            {/* Firestore 打卡日历同步 */}
            <CheckinCalendar userId={DEMO_USER_ID} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                    onClick={() => setActiveTab('courses')}
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-teal-400 hover:shadow-md transition-all group active:scale-95"
                >
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-100 text-blue-600 transition-colors">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-700 text-lg">核心课程</h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">14门硬核复习</p>
                </div>
                <div
                    onClick={() => setActiveTab('interview')}
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-purple-400 hover:shadow-md transition-all group active:scale-95"
                >
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors text-purple-600">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-700 text-lg">模拟面谈</h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">AI 考官实时对练</p>
                </div>
            </div>
        </div>
    );
};

export { InterviewSim };
export default Dashboard;
