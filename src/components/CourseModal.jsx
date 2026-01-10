import React, { useState } from 'react';
import { Calendar, Trash2, StickyNote, X, FileText, Target, Globe, Sparkles, Check, Save } from 'lucide-react';
import MarkdownRenderer from './ui/MarkdownRenderer';
import BiText from './ui/BiText';
import LogicTreeContainer from './ui/LogicTree';
import callGemini from '../utils/gemini';

// 1. 笔记卡片 (点击查看，带删除)
const NoteCard = ({ note, onDelete, onView }) => {
    return (
        <div
            onClick={() => onView(note)}
            className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-slate-700 shadow-sm relative group cursor-pointer hover:border-yellow-300 transition-all hover:shadow-md active:scale-[0.98]"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-yellow-800 text-xs bg-yellow-100 px-2 py-0.5 rounded flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {note.date}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // 核心修复：直接调用传递下来的 onDelete，参数已由父组件闭包绑定
                        onDelete();
                    }}
                    className="text-yellow-600 hover:text-red-500 p-1.5 -mr-1.5 -mt-1.5 rounded-full hover:bg-yellow-100 transition-all z-10"
                    title="删除笔记"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            <div className="font-bold text-slate-800 mb-1 leading-snug line-clamp-1">Q: {note.question}</div>
            <div className="text-slate-500 text-xs opacity-80 line-clamp-2">{(note.answer || '').replace(/[#*`]/g, '')}</div>
        </div>
    );
};

// 2. 笔记阅读弹窗
const NoteReaderModal = ({ note, onClose }) => {
    if (!note) return null;
    return (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 animate-in fade-in backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg h-[80vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-yellow-50/80 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-yellow-800 font-bold">
                        <StickyNote className="w-5 h-5" /> 学习笔记详情
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-yellow-100 transition-colors"><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 pb-20">
                    <div className="font-bold text-lg text-slate-900 mb-4 border-l-4 border-yellow-400 pl-3 leading-snug">{note.question}</div>
                    <div className="prose prose-sm max-w-none text-slate-600">
                        <MarkdownRenderer content={note.answer} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const CourseModal = ({ course, onClose, onSaveNote, onDeleteNote, aiConfig, setTab }) => {
    const [aiQuery, setAiQuery] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false); // 保存状态反馈
    const [viewingNote, setViewingNote] = useState(null); // 当前查看的笔记
    const [isComposing, setIsComposing] = useState(false); // 中文输入法状态

    const handleAiAsk = async () => {
        if (!aiQuery.trim()) return;

        // 检查是否已配置 API Key
        if (!aiConfig.apiKey) {
            // 显示弹窗提示用户去设置
            const shouldGoToSettings = window.confirm('请先配置 API Key！\n\n需要前往设置页面添加 Google AI API Key 吗？');
            if (shouldGoToSettings) {
                // 关闭当前弹窗并跳转到设置页面
                onClose();
                setTab('settings');
            }
            return;
        }

        setLoading(true);
        setIsSaved(false); // 重新提问时重置保存状态
        const res = await callGemini(`背景：APS审核。课程：${course.name}。问题：${aiQuery}。请用中文回答，术语附带英文，公式用$$格式(独立行)，表格用Markdown格式。`, aiConfig);
        setAiResponse(res);
        setLoading(false);
    };

    const handleSave = () => {
        onSaveNote(course.id, aiQuery, aiResponse);
        setIsSaved(true); // 设置为已保存
    };

    if (!course) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in backdrop-blur-sm">
            <div className="bg-white w-full h-[90vh] sm:h-auto sm:max-h-[85vh] sm:max-w-3xl rounded-2xl flex flex-col shadow-2xl overflow-hidden min-w-0">
                <div className="flex-none p-5 border-b border-slate-100 flex justify-between items-start bg-white z-20">
                    <div className="flex-1 mr-4 min-w-0">
                        <h3 className="font-bold text-lg text-slate-800 leading-snug break-words pr-2">{course.name}</h3>
                        <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded mt-1.5 inline-block">APS CORE</span>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-500 flex-shrink-0"><X className="w-5 h-5" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-24 sm:pb-5">
                    <BiText label={<><FileText className="w-4 h-4 mr-2" /> 概要 (Summary)</>} cn={<div className="bg-blue-50 text-blue-900 p-4 rounded-xl text-sm leading-relaxed border border-blue-100 shadow-sm">{course.summary.cn}</div>} en={<div className="bg-indigo-50 text-indigo-900 p-4 rounded-xl text-sm leading-relaxed border border-indigo-100 shadow-sm font-medium">{course.summary.en}</div>} />
                    <BiText label={<><Target className="w-4 h-4 mr-2" /> 目标 (Goals)</>} cn={<p className="text-slate-700 text-sm leading-relaxed pl-3 border-l-4 border-teal-400 py-1">{course.goals.cn}</p>} en={<p className="text-slate-700 text-sm leading-relaxed pl-3 border-l-4 border-indigo-400 py-1 font-medium">{course.goals.en}</p>} />
                    <LogicTreeContainer data={course.logicTree} />

                    {course.terms && (
                        <div>
                            <h4 className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-wider mb-4"><Globe className="w-4 h-4 mr-2" /> 核心术语库</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {course.terms.map((term, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
                                        <h5 className="font-bold text-teal-700 text-base mb-2 break-words mr-8">{term.en}</h5>
                                        <BiText cn={<div className="text-xs text-slate-500 pt-2 border-t border-slate-100"><span className="font-bold">{term.cn}</span>: {term.desc_cn}</div>} en={<div className="text-xs text-slate-600 pt-2 border-t border-slate-100 font-medium"><span className="font-bold">{term.cn}</span>: {term.desc_en}</div>} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {course.notes && course.notes.length > 0 && (
                        <div>
                            <h4 className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-wider mb-4"><StickyNote className="w-4 h-4 mr-2" /> 学习笔记 ({course.notes.length})</h4>
                            <div className="grid grid-cols-1 gap-3">
                                {course.notes.map((note) => (
                                    // ✅ 关键修复：正确传递删除回调，闭包当前课程ID
                                    <NoteCard
                                        key={note.id}
                                        note={note}
                                        onDelete={() => onDeleteNote(course.id, note.id)}
                                        onView={setViewingNote}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border border-purple-100 shadow-sm">
                        <h4 className="flex items-center text-sm font-bold text-purple-700 uppercase tracking-wider mb-3"><Sparkles className="w-4 h-4 mr-2" /> AI 深度追问</h4>
                        <div className="flex gap-2 mb-4">
                            <textarea
                                value={aiQuery}
                                onChange={(e) => { setAiQuery(e.target.value); setIsSaved(false); }}
                                onCompositionStart={() => setIsComposing(true)}
                                onCompositionEnd={() => setIsComposing(false)}
                                onKeyDown={(e) => {
                                    // Shift+Enter 换行 - 允许默认行为
                                    if (e.key === 'Enter' && e.shiftKey) {
                                        return; // 允许默认换行
                                    }
                                    // 只有单纯的Enter键（无修饰键）且不在中文输入状态时才提交
                                    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && !loading && !isComposing) {
                                        e.preventDefault(); // 阻止默认提交
                                        handleAiAsk();
                                    }
                                }}
                                placeholder="例如：为什么SAR会有阴影？"
                                className="flex-grow text-sm p-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white shadow-inner resize-none overflow-hidden"
                                rows="1"
                                style={{
                                    minHeight: '2.75rem', // 匹配padding
                                    height: 'auto',
                                    maxHeight: '6rem' // 限制最大高度
                                }}
                                onInput={(e) => {
                                    // 自动调整高度
                                    e.target.style.height = 'auto';
                                    e.target.style.height = Math.min(e.target.scrollHeight, 6 * 16) + 'px'; // 6rem = 96px
                                }}
                            />
                            <button onClick={handleAiAsk} disabled={loading} className="bg-purple-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-md shadow-purple-200 flex-shrink-0">{loading ? "..." : "Ask"}</button>
                        </div>
                        {aiResponse && (
                            <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm animate-in fade-in relative">
                                <MarkdownRenderer content={aiResponse} />
                                <button
                                    onClick={handleSave}
                                    disabled={isSaved}
                                    className={`mt-4 flex items-center justify-center w-full py-2.5 rounded-lg text-xs font-bold transition-all ${isSaved ? 'bg-green-100 text-green-700 cursor-default' : 'bg-purple-100 hover:bg-purple-200 text-purple-700 active:scale-95'}`}
                                >
                                    {isSaved ? <><Check className="w-4 h-4 mr-1.5" /> 已保存到笔记</> : <><Save className="w-4 h-4 mr-1.5" /> 保存到笔记</>}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {viewingNote && <NoteReaderModal note={viewingNote} onClose={() => setViewingNote(null)} />}
        </div>
    );
};

export default CourseModal;
