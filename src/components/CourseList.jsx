import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';

import HighlightText from './ui/HighlightText';

const CourseList = ({ courses, setSelectedCourse }) => {
    const [expandedCat, setExpandedCat] = useState("理论基础 (Fundamentals)");
    const [searchTerm, setSearchTerm] = useState("");

    // 过滤逻辑
    const filteredCourses = courses.map(cat => {
        const matching = cat.courses.map(c => {
            // 检查名字和简介
            const nameMatch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
            const summaryMatch = c.summary?.cn && c.summary.cn.includes(searchTerm);

            // 检查笔记 (找到第一个匹配的片段)
            let noteMatchSnippet = null;
            if (c.notes && Array.isArray(c.notes)) {
                const matchedNote = c.notes.find(note => {
                    const contentValues = [
                        typeof note === 'string' ? note : '',
                        note.text || '',
                        note.question || '',
                        note.answer || ''
                    ];
                    return contentValues.some(val => val && val.toLowerCase().includes(searchTerm.toLowerCase()));
                });

                if (matchedNote) {
                    const contentValues = [
                        typeof matchedNote === 'string' ? matchedNote : '',
                        matchedNote.text || '',
                        matchedNote.question || '',
                        matchedNote.answer || ''
                    ];
                    // 找到具体是哪段文字匹配，截取一小段显示
                    const fullText = contentValues.find(val => val && val.toLowerCase().includes(searchTerm.toLowerCase())) || "";
                    const matchIndex = fullText.toLowerCase().indexOf(searchTerm.toLowerCase());
                    const start = Math.max(0, matchIndex - 10);
                    const end = Math.min(fullText.length, matchIndex + searchTerm.length + 20);
                    noteMatchSnippet = "..." + fullText.substring(start, end) + "...";

                    // 返回包含ID的元数据
                    return { ...c, noteMatchSnippet, matchedNoteId: matchedNote.id };
                }
            }

            if (nameMatch || summaryMatch || noteMatchSnippet) {
                return { ...c, noteMatchSnippet: undefined }; // 如果只是名字匹配，不要干扰
            }
            return null;
        }).filter(Boolean);

        return { ...cat, courses: matching };
    }).filter(cat => cat.courses.length > 0);

    return (
        <div className="space-y-4">
            {/* 搜索框 */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="搜索课程名称或关键词..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm text-sm"
                />
            </div>

            {filteredCourses.length > 0 ? (
                filteredCourses.map((cat, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                        <button
                            onClick={() => setExpandedCat(expandedCat === cat.category ? null : cat.category)}
                            className={`w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors font-bold text-sm text-slate-700 ${expandedCat === cat.category ? 'border-b border-slate-100' : ''}`}
                        >
                            <span className="flex items-center">
                                <span className={`w-1.5 h-4 rounded-full mr-2 ${expandedCat === cat.category ? 'bg-teal-500' : 'bg-slate-300'}`}></span>
                                {cat.category} <span className="ml-2 text-xs font-normal text-slate-400">({cat.courses.length})</span>
                            </span>
                            {expandedCat === cat.category ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                        </button>

                        {(expandedCat === cat.category || searchTerm) && (
                            <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-50/30">
                                {cat.courses.map((course) => (
                                    <div key={course.id} onClick={() => setSelectedCourse(course, null, searchTerm)} className="p-4 bg-white border border-slate-100 rounded-xl hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between items-start active:scale-[0.98]">
                                        <div className="flex-1 w-full">
                                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-teal-700 transition-colors leading-tight mb-1 truncate">
                                                <HighlightText text={course.name.split('(')[0]} highlight={searchTerm} />
                                            </h4>
                                            <p className="text-xs text-slate-400 line-clamp-2 font-medium mb-1">
                                                <HighlightText text={course.summary?.cn || "点击查看详情"} highlight={searchTerm} />
                                            </p>

                                            {/* 学习进度条 - 始终显示，即使是0% */}
                                            <div className="mt-2 w-full">
                                                <div className="flex justify-between items-end mb-1">
                                                    <span className="text-[10px] font-bold text-slate-500">掌握度</span>
                                                    <span className={`text-[10px] font-bold ${course.progress >= 80 ? 'text-green-600' : course.progress >= 40 ? 'text-yellow-600' : 'text-slate-400'}`}>{course.progress || 0}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${course.progress >= 80 ? 'bg-green-500' : course.progress >= 40 ? 'bg-yellow-500' : 'bg-slate-300'}`}
                                                        style={{ width: `${course.progress || 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* 显示笔记匹配提示 */}
                                            {searchTerm && course.noteMatchSnippet && (
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedCourse(course, course.matchedNoteId, searchTerm);
                                                    }}
                                                    className="mt-2 text-[10px] bg-yellow-50 text-slate-500 p-1.5 rounded border border-yellow-100 flex items-start gap-1 hover:bg-yellow-100 transition-colors"
                                                >
                                                    <span className="flex-shrink-0">📝</span>
                                                    <span className="line-clamp-1 italic">
                                                        <HighlightText text={course.noteMatchSnippet} highlight={searchTerm} />
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full flex justify-end mt-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teal-50 transition-colors"><ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-teal-500" /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-slate-400 text-sm">
                    未找到相关课程
                </div>
            )}
        </div>
    );
};

export default CourseList;
