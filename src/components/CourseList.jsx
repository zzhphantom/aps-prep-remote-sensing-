import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const CourseList = ({ courses, setSelectedCourse }) => {
    const [expandedCat, setExpandedCat] = useState("理论基础 (Fundamentals)");
    return (
        <div className="space-y-4">
            {courses.map((cat, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <button onClick={() => setExpandedCat(expandedCat === cat.category ? null : cat.category)} className={`w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors font-bold text-sm text-slate-700 ${expandedCat === cat.category ? 'border-b border-slate-100' : ''}`}>
                        <span className="flex items-center"><span className={`w-1.5 h-4 rounded-full mr-2 ${expandedCat === cat.category ? 'bg-teal-500' : 'bg-slate-300'}`}></span>{cat.category}</span>
                        {expandedCat === cat.category ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    </button>
                    {expandedCat === cat.category && (
                        <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-50/30">
                            {cat.courses.map((course) => (
                                <div key={course.id} onClick={() => setSelectedCourse(course)} className="p-4 bg-white border border-slate-100 rounded-xl hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group flex justify-between items-center active:scale-[0.98]">
                                    <div className="flex-1 pr-3 min-w-0">
                                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-teal-700 transition-colors leading-tight mb-1 truncate">{course.name.split('(')[0]}</h4>
                                        <p className="text-xs text-slate-400 truncate font-medium">{course.summary?.cn || "点击查看详情"}</p>
                                    </div>
                                    <div className="flex-none flex-shrink-0"><div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teal-50 transition-colors"><ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500" /></div></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CourseList;
