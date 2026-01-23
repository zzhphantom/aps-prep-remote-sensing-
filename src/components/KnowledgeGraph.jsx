import React, { useState, useMemo } from 'react';
import { COURSE_DATA } from '../data';
import { Network, ArrowRight, Info, ChevronLeft } from 'lucide-react';

const KnowledgeGraph = ({ onCourseClick }) => {
    // Flatten all courses into a single list for easy access
    const allCourses = useMemo(() => {
        return COURSE_DATA.flatMap(category => category.courses);
    }, []);

    const [selectedId, setSelectedId] = useState(allCourses[0]?.id || 'c1');
    const [history, setHistory] = useState([]); // Internal navigation history

    // Handler for selecting from sidebar (clears history)
    const handleSidebarSelect = (targetId) => {
        setSelectedId(targetId);
        setHistory([]); // Clear history when selecting from sidebar
    };

    // Handler for navigating via relation links (adds to history)
    const handleRelationNavigate = (targetId) => {
        if (targetId === selectedId) return;
        setHistory(prev => [...prev, selectedId]);
        setSelectedId(targetId);
    };

    const handleBack = () => {
        if (history.length === 0) return;
        const prevId = history[history.length - 1];
        setHistory(prev => prev.slice(0, -1));
        setSelectedId(prevId);
    };

    // Compute bidirectional relations map
    const bidirectionalRelationsMap = useMemo(() => {
        const relationsMap = {};

        // Initialize with existing relations
        allCourses.forEach(course => {
            relationsMap[course.id] = [...(course.relations || [])];
        });

        // Add reverse relations
        allCourses.forEach(course => {
            (course.relations || []).forEach(rel => {
                // Ensure target course has a relations array
                if (!relationsMap[rel.targetId]) {
                    relationsMap[rel.targetId] = [];
                }

                // Check if reverse relation already exists
                const hasReverse = relationsMap[rel.targetId].some(
                    r => r.targetId === course.id
                );

                if (!hasReverse) {
                    // Create meaningful reverse relation using original context
                    relationsMap[rel.targetId].push({
                        targetId: course.id,
                        targetName: course.name,
                        label: `被${rel.label}`, // e.g., "被理论基础" (Used as foundation by)
                        desc: rel.desc // Keep the original knowledge point description
                    });
                }
            });
        });

        return relationsMap;
    }, [allCourses]);

    // Get the selected course object
    const currentCourse = allCourses.find(c => c.id === selectedId);

    // Get related courses (bidirectional)
    const relations = bidirectionalRelationsMap[selectedId] || [];

    // Simple layout calculation: distribute related nodes in a circle
    const getPosition = (index, total) => {
        const radius = 300; // Distance from center
        const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius
        };
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                    <Network className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">课程知识图谱 (Knowledge Graph)</h2>
                    <p className="text-xs text-slate-500">探索课程间的内在联系与学科交叉点</p>
                </div>
            </div>

            <div className="flex-grow flex gap-6 overflow-hidden">
                {/* Sidebar: Course List */}
                <div className="w-64 flex-shrink-0 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-500 uppercase tracking-wider">
                        Select Focus Course
                    </div>
                    <div className="flex-grow overflow-y-auto p-2 space-y-1">
                        {allCourses.map(course => (
                            <button
                                key={course.id}
                                onClick={() => handleSidebarSelect(course.id)}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${selectedId === course.id
                                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <span className="line-clamp-1">{course.name.split('(')[0]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Visualization Area */}
                <div className="flex-grow bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden flex items-center justify-center p-10">

                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>

                    <div className="relative w-[800px] h-[800px] flex items-center justify-center">

                        {/* Connecting Lines (SVG Layer) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]">
                            {relations.map((rel, i) => {
                                const pos = getPosition(i, relations.length);
                                const center = { x: 400, y: 400 }; // SVG center
                                const target = { x: 400 + pos.x, y: 400 + pos.y };


                                // Calculate label position directly on the line at 40% distance
                                const labelRatio = 0.40;
                                const labelX = center.x + (target.x - center.x) * labelRatio;
                                const labelY = center.y + (target.y - center.y) * labelRatio;


                                // Split label into Chinese and English parts
                                const labelMatch = rel.label.match(/^(.+?)\s*\((.+?)\)$/);
                                const chinesePart = labelMatch ? labelMatch[1] : rel.label;
                                const englishPart = labelMatch ? labelMatch[2] : '';

                                // Calculate dynamic width based on the longer part
                                const maxPartLength = Math.max(chinesePart.length, englishPart.length);
                                const labelWidth = Math.max(80, Math.min(140, maxPartLength * 7 + 20));
                                const labelHeight = englishPart ? 36 : 24; // Taller for two lines

                                return (
                                    <g key={i}>
                                        <line
                                            x1={center.x} y1={center.y}
                                            x2={target.x} y2={target.y}
                                            stroke="#CBD5E1"
                                            strokeWidth="2"
                                            strokeDasharray="5,5"
                                        />
                                        {/* Label on line */}
                                        <rect
                                            x={labelX - labelWidth / 2}
                                            y={labelY - labelHeight / 2}
                                            width={labelWidth}
                                            height={labelHeight}
                                            rx="6"
                                            fill="white"
                                            stroke="#E2E8F0"
                                            className="shadow-sm"
                                        />
                                        {/* Multi-line text */}
                                        {englishPart ? (
                                            <>
                                                <text
                                                    x={labelX}
                                                    y={labelY - 6}
                                                    fill="#64748B"
                                                    fontSize="9"
                                                    fontWeight="600"
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    {chinesePart}
                                                </text>
                                                <text
                                                    x={labelX}
                                                    y={labelY + 7}
                                                    fill="#94A3B8"
                                                    fontSize="8"
                                                    fontWeight="500"
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    {englishPart}
                                                </text>
                                            </>
                                        ) : (
                                            <text
                                                x={labelX}
                                                y={labelY}
                                                fill="#64748B"
                                                fontSize="9"
                                                fontWeight="600"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                {chinesePart}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}
                        </svg>

                        {/* Central Node */}
                        <div className="absolute z-20 w-40 h-40 rounded-full bg-white border-4 border-indigo-500 shadow-xl flex flex-col items-center justify-center p-4 text-center animate-in zoom-in-95 duration-300 group cursor-pointer hover:border-indigo-600 hover:shadow-2xl transition-all"
                            onClick={() => onCourseClick && onCourseClick(selectedId)}
                            title="点击查看课程详情"
                        >
                            <div className="font-bold text-slate-800 text-sm line-clamp-3 leading-tight group-hover:text-indigo-700 transition-colors">{currentCourse?.name.split('(')[0]}</div>
                            <div className="text-[10px] text-slate-400 mt-2 font-mono">{currentCourse?.id.toUpperCase()}</div>
                        </div>

                        {/* Related Nodes */}
                        {relations.length > 0 ? (
                            relations.map((rel, i) => {
                                const pos = getPosition(i, relations.length);
                                return (
                                    <div
                                        key={i}
                                        className="absolute z-20 w-32 p-3 bg-white rounded-xl border border-slate-200 shadow-lg flex flex-col items-center text-center cursor-pointer hover:border-indigo-300 hover:shadow-indigo-100 transition-all group"
                                        style={{
                                            transform: `translate(${pos.x}px, ${pos.y}px)`,
                                        }}
                                        onClick={() => handleRelationNavigate(rel.targetId)}
                                    >
                                        <div className="text-xs font-bold text-slate-700 mb-1 group-hover:text-indigo-600 transition-colors">{rel.targetName.split('(')[0]}</div>
                                        <div className="text-[10px] text-slate-500 leading-tight bg-slate-50 p-1.5 rounded w-full">
                                            {rel.desc}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="absolute top-10 text-slate-400 text-xs flex items-center bg-white/80 px-3 py-1 rounded-full border border-slate-100 backdrop-blur-sm">
                                <Info className="w-3 h-3 mr-1.5" />
                                暂无关联数据，请选择 "Principles of RS" 查看演示
                            </div>
                        )}
                        {/* Back Button (Floating) */}
                        {history.length > 0 && (
                            <button
                                onClick={handleBack}
                                className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-indigo-100 text-indigo-700 font-bold text-sm hover:bg-white hover:scale-105 transition-all animate-in fade-in slide-in-from-left-4"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeGraph;
