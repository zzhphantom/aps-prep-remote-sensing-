import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, StickyNote, X, FileText, Target, Globe, Sparkles, Check, Save, ChevronRight, ChevronLeft, Network } from 'lucide-react';
import MarkdownRenderer from './ui/MarkdownRenderer';
import BiText from './ui/BiText';
import HighlightText from './ui/HighlightText'; // Import HighlightText
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
const NoteReaderModal = ({ note, onClose, highlightTerm }) => {
    // 处理高亮闪烁逻辑
    useEffect(() => {
        if (!highlightTerm) return;

        // 给Markdown渲染一点时间后再查找DOM
        const timer = setTimeout(() => {
            // 使用 TreeWalker 遍历文本节点
            const contentContainer = document.getElementById('note-content-container');
            if (!contentContainer) return;

            const treeWalker = document.createTreeWalker(contentContainer, NodeFilter.SHOW_TEXT, null, false);
            const nodeList = [];
            let currentNode;
            while (currentNode = treeWalker.nextNode()) {
                nodeList.push(currentNode);
            }

            // 查找包含关键词的节点
            for (const node of nodeList) {
                const text = node.nodeValue;
                const index = text.toLowerCase().indexOf(highlightTerm.toLowerCase());
                if (index !== -1) {
                    // 找到了！进行替换和高亮 (简单的DOM操作)
                    const range = document.createRange();
                    range.setStart(node, index);
                    range.setEnd(node, index + highlightTerm.length);

                    const span = document.createElement('span');
                    span.className = 'bg-yellow-300 text-slate-900 px-0.5 rounded animate-pulse shadow-sm ring-2 ring-yellow-400/50';
                    span.textContent = text.substring(index, index + highlightTerm.length);

                    // 分割节点
                    range.deleteContents();
                    range.insertNode(span);

                    // 滚动到视图
                    span.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // 3秒后移除动画效果，只保留基本高亮
                    setTimeout(() => {
                        span.className = 'bg-yellow-200 text-slate-800 px-0.5 rounded transition-colors duration-1000';
                    }, 3000);

                    // 咱们只高亮第一个匹配项，避免过多干扰
                    break;
                }
            }
        }, 100); // 100ms should be enough for React to render textual content

        return () => clearTimeout(timer);
    }, [highlightTerm, note]);

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
                    <div id="note-content-container" className="prose prose-sm max-w-none text-slate-600">
                        <MarkdownRenderer content={note.answer} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const CourseModal = ({ course, onClose, onSaveNote, onDeleteNote, aiConfig, setTab, initialNoteId = null, highlightTerm = null, onNavigate, onBack, canGoBack }) => {
    const [aiQuery, setAiQuery] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false); // 保存状态反馈
    const [viewingNote, setViewingNote] = useState(null); // 当前查看的笔记
    const [isComposing, setIsComposing] = useState(false); // 中文输入法状态

    // Auto-open note if ID is provided
    useEffect(() => {
        if (initialNoteId && course.notes) {
            const targetNote = course.notes.find(n => n.id === initialNoteId);
            if (targetNote) {
                setViewingNote(targetNote);
            }
        }
    }, [initialNoteId, course.notes]);

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
                    <div className="flex-1 mr-4 min-w-0 pr-8"> {/* Added padding-right to avoid overlap with close button */}
                        {/* Header Row: Back Button + Title */}
                        <div className="flex items-start gap-3">
                            {canGoBack && (
                                <button
                                    onClick={onBack}
                                    className="mt-1 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex-shrink-0"
                                    title="返回上一门课程"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            )}
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 leading-snug break-words">{course.name}</h3>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded inline-block">APS CORE</span>
                                    {/* 学习进度条 */}
                                    <div className="flex items-center gap-2 flex-1 min-w-[120px] max-w-[200px]">
                                        <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${course.progress >= 80 ? 'bg-green-500' : course.progress >= 40 ? 'bg-yellow-500' : 'bg-slate-300'}`}
                                                style={{ width: `${course.progress || 0}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400">{course.progress || 0}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {course.suggestion && (
                            <div className="mt-3 text-xs bg-amber-50 text-amber-800 p-2.5 rounded-lg border border-amber-100 flex items-start animate-in fade-in ml-9"> {/* Indented to align with title */}
                                <Sparkles className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-amber-600" />
                                <div className="flex-1">
                                    <span className="font-bold block mb-0.5 text-amber-900">下一步建议：</span>
                                    {course.suggestion}
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-500 flex-shrink-0 absolute top-4 right-4"><X className="w-5 h-5" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-24 sm:pb-5">
                    <BiText highlightTerm={highlightTerm} label={<><FileText className="w-4 h-4 mr-2" /> 概要 (Summary)</>} cn={<div className="bg-blue-50 text-blue-900 p-4 rounded-xl text-sm leading-relaxed border border-blue-100 shadow-sm">{course.summary.cn}</div>} en={<div className="bg-indigo-50 text-indigo-900 p-4 rounded-xl text-sm leading-relaxed border border-indigo-100 shadow-sm font-medium">{course.summary.en}</div>} />
                    <BiText highlightTerm={highlightTerm} label={<><Target className="w-4 h-4 mr-2" /> 目标 (Goals)</>} cn={<p className="text-slate-700 text-sm leading-relaxed pl-3 border-l-4 border-teal-400 py-1">{course.goals.cn}</p>} en={<p className="text-slate-700 text-sm leading-relaxed pl-3 border-l-4 border-indigo-400 py-1 font-medium">{course.goals.en}</p>} />
                    <LogicTreeContainer data={course.logicTree} highlightTerm={highlightTerm} />

                    {/* 知识图谱关联 (New) */}
                    {course.relations && course.relations.length > 0 && (
                        <div>
                            <h4 className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-wider mb-4"><Network className="w-4 h-4 mr-2" /> 知识关联 (Relations)</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {course.relations.map((rel, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => onNavigate && onNavigate(rel.targetId)}
                                        className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-teal-400 hover:shadow-md transition-all group active:scale-[0.98]"
                                        title={`跳转到: ${rel.targetName}`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors uppercase">{rel.label || '关联'}</span>
                                            <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-teal-500" />
                                        </div>
                                        <div className="font-bold text-slate-800 text-sm mb-1 line-clamp-1 group-hover:text-teal-700 transition-colors">{rel.targetName}</div>
                                        <div className="text-xs text-slate-500 line-clamp-1">{rel.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {course.terms && (
                        <div>
                            <h4 className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-wider mb-4"><Globe className="w-4 h-4 mr-2" /> 核心术语库</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {course.terms.map((term, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
                                        <h5 className="font-bold text-teal-700 text-base mb-2 break-words mr-8"><HighlightText text={term.en} highlight={highlightTerm} /></h5>
                                        <BiText highlightTerm={highlightTerm} cn={<div className="text-xs text-slate-500 pt-2 border-t border-slate-100"><span className="font-bold"><HighlightText text={term.cn} highlight={highlightTerm} /></span>: <HighlightText text={term.desc_cn} highlight={highlightTerm} /></div>} en={<div className="text-xs text-slate-600 pt-2 border-t border-slate-100 font-medium"><span className="font-bold"><HighlightText text={term.cn} highlight={highlightTerm} /></span>: <HighlightText text={term.desc_en} highlight={highlightTerm} /></div>} />
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
            {viewingNote && <NoteReaderModal note={viewingNote} onClose={() => setViewingNote(null)} highlightTerm={highlightTerm} />}
        </div >
    );
};

export default CourseModal;
