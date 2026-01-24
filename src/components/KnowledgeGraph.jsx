import React, { useState, useMemo } from 'react';
import { COURSE_DATA } from '../data';
import { Network, ArrowRight, Info, ChevronLeft, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const KnowledgeGraph = ({ onCourseClick }) => {
    // Flatten all courses into a single list for easy access
    const allCourses = useMemo(() => {
        return COURSE_DATA.flatMap(category => category.courses);
    }, []);

    const [selectedId, setSelectedId] = useState(allCourses[0]?.id || 'c1');
    const [history, setHistory] = useState([]); // Internal navigation history
    const [scale, setScale] = useState(1); // Zoom scale state

    // Sidebar visibility state
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Initial Auto-fit for mobile & sidebar collapse
    React.useEffect(() => {
        if (window.innerWidth < 800) {
            const fitScale = (window.innerWidth - 32) / 800; // 32px padding
            setScale(Math.max(0.5, Math.min(fitScale, 1))); // Clamp between 0.5 and 1
        }
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false); // Default closed on smaller screens
        }
    }, []);

    // Drag & Pan state
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const isDraggingRef = React.useRef(false);

    // Pointer tracking for multi-touch
    const pointersRef = React.useRef(new Map());
    const prevDistanceRef = React.useRef(null);
    const lastPanRef = React.useRef({ x: 0, y: 0 });

    const startPosRef = React.useRef(null); // Track separate start pos for threshold check

    // Handler for selecting from sidebar (clears history)
    const handleSidebarSelect = (targetId) => {
        setSelectedId(targetId);
        setHistory([]); // Clear history when selecting from sidebar
        setScale(1); // Reset zoom on new selection
        setPan({ x: 0, y: 0 }); // Reset pan
        // Optional: close sidebar on mobile after selection
        if (window.innerWidth < 1024) setIsSidebarOpen(false);
    };



    // Handler for navigating via relation links (adds to history)
    const handleRelationNavigate = (targetId) => {
        if (targetId === selectedId) return;
        setHistory(prev => [...prev, selectedId]);
        setSelectedId(targetId);
        setScale(1); // Reset zoom on navigation
        setPan({ x: 0, y: 0 }); // Reset pan
    };

    const handleBack = () => {
        if (history.length === 0) return;
        const prevId = history[history.length - 1];
        setHistory(prev => prev.slice(0, -1));
        setSelectedId(prevId);
        setScale(1); // Reset zoom on back
        setPan({ x: 0, y: 0 }); // Reset pan
    };

    // Zoom handlers
    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.4));
    const handleResetZoom = () => {
        setScale(1);
        setPan({ x: 0, y: 0 });
    };

    // Helper to calculate distance between two points
    const getDistance = (p1, p2) => {
        return Math.sqrt(Math.pow(p2.clientX - p1.clientX, 2) + Math.pow(p2.clientY - p1.clientY, 2));
    };

    // Helper to get center point between two points
    const getCenter = (p1, p2) => {
        return {
            x: (p1.clientX + p2.clientX) / 2,
            y: (p1.clientY + p2.clientY) / 2
        };
    };

    // Pointer Event Handlers for Drag & Pan & Pinch Zoom
    const handlePointerDown = (e) => {
        // e.preventDefault(); // Removed to allow click events to bubbles
        pointersRef.current.set(e.pointerId, e);

        if (pointersRef.current.size === 1) {
            // Don't set isDragging true yet
            isDraggingRef.current = false;
            lastPanRef.current = { x: e.clientX, y: e.clientY };
            // Track start position for click detection vs drag
            startPosRef.current = { x: e.clientX, y: e.clientY };
        } else if (pointersRef.current.size === 2) {
            // Start pinch
            const pointers = Array.from(pointersRef.current.values()).filter(p => p.pointerId !== undefined);
            if (pointers.length >= 2) {
                prevDistanceRef.current = getDistance(pointers[0], pointers[1]);
            }
        }
    };

    const handlePointerMove = (e) => {
        e.preventDefault();
        if (!pointersRef.current.has(e.pointerId)) return;

        // Update pointer record
        pointersRef.current.set(e.pointerId, e);

        if (pointersRef.current.size === 1) {
            // Single touch drag logic with threshold
            const dx = e.clientX - lastPanRef.current.x;
            const dy = e.clientY - lastPanRef.current.y;

            if (!isDraggingRef.current) {
                const startPos = startPosRef.current;
                if (startPos) {
                    const moveDist = Math.sqrt(Math.pow(e.clientX - startPos.x, 2) + Math.pow(e.clientY - startPos.y, 2));
                    if (moveDist > 5) {
                        isDraggingRef.current = true;
                        setIsDragging(true);
                        try {
                            e.currentTarget.setPointerCapture(e.pointerId);
                        } catch (err) { /* ignore */ }
                    }
                }
            }

            if (isDraggingRef.current) {
                setPan(prev => ({
                    x: prev.x + dx,
                    y: prev.y + dy
                }));
                lastPanRef.current = { x: e.clientX, y: e.clientY };
            }
        } else if (pointersRef.current.size === 2) {
            // Pinch zoom
            const pointers = Array.from(pointersRef.current.values()).filter(p => p.pointerId !== undefined);
            if (pointers.length < 2) return;

            const currentDistance = getDistance(pointers[0], pointers[1]);

            if (prevDistanceRef.current) {
                const delta = currentDistance - prevDistanceRef.current;
                const zoomFactor = delta * 0.005;

                setScale(prev => {
                    const newScale = Math.min(Math.max(prev + zoomFactor, 0.4), 3.0);
                    return newScale;
                });
            }

            prevDistanceRef.current = currentDistance;
        }
    };

    const handlePointerUp = (e) => {
        // e.preventDefault();
        pointersRef.current.delete(e.pointerId);

        if (isDraggingRef.current) {
            try {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                }
            } catch (err) {
                // ignore
            }
        }

        if (pointersRef.current.size < 2) {
            prevDistanceRef.current = null;
        }

        if (pointersRef.current.size === 0) {
            isDraggingRef.current = false;
            setIsDragging(false);
        } else if (pointersRef.current.size === 1) {
            // Switch back to single finger drag continuity
            const remainingPointer = Array.from(pointersRef.current.values()).find(p => p.pointerId !== undefined);
            if (remainingPointer) {
                lastPanRef.current = { x: remainingPointer.clientX, y: remainingPointer.clientY };
                startPosRef.current = { x: remainingPointer.clientX, y: remainingPointer.clientY };
            }
        }
    };

    const handlePointerCancel = (e) => {
        handlePointerUp(e);
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
    // Returns unit coordinates (x, y) on a unit circle (radius = 1)
    const getUnitPosition = (index, total) => {
        const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                        <Network className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">课程知识图谱 (Knowledge Graph)</h2>
                        <p className="text-xs text-slate-500">探索课程间的内在联系与学科交叉点</p>
                    </div>
                </div>

                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors flex items-center gap-2 border border-slate-200"
                    title={isSidebarOpen ? "收起菜单" : "展开菜单"}
                >
                    {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                    <span className="text-sm font-medium hidden sm:inline">{isSidebarOpen ? "Hide List" : "Show List"}</span>
                </button>
            </div>

            <div className="flex-grow flex flex-col lg:flex-row gap-6 overflow-hidden relative">
                {/* Sidebar: Course List */}
                <div className={`
                    flex-shrink-0 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm transition-all duration-300 ease-in-out
                    ${isSidebarOpen ? 'w-full md:w-56 lg:w-64 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full border-0 pointer-events-none'}
                `}>
                    <div className="p-3 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-500 uppercase tracking-wider">
                        Select Focus Course
                    </div>
                    <div className="flex-grow overflow-y-auto p-2 space-y-1 max-h-[200px] lg:max-h-none">
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
                <div className="flex-grow bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden flex items-center justify-center p-4 lg:p-10 h-[60vh] lg:h-auto min-h-[400px]">

                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>

                    {/* Back Button (Fixed in Graph Area - Top Left) */}
                    {history.length > 0 && (
                        <button
                            onClick={handleBack}
                            className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-indigo-100 text-indigo-700 font-bold text-sm hover:bg-white hover:scale-105 transition-all animate-in fade-in slide-in-from-left-4"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </button>
                    )}

                    {/* Zoom Controls */}
                    <div className="absolute bottom-6 right-6 z-30 flex flex-col gap-2 bg-white/90 backdrop-blur shadow-lg border border-slate-200 rounded-lg p-1.5 pointer-events-auto">
                        <button onClick={handleZoomIn} className="p-3 hover:bg-slate-100 rounded-md text-slate-600 active:bg-slate-200 transition-colors" title="Zoom In">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <button onClick={handleResetZoom} className="p-3 hover:bg-slate-100 rounded-md text-xs font-bold text-slate-600 active:bg-slate-200 transition-colors" title="Reset">100%</button>
                        <button onClick={handleZoomOut} className="p-3 hover:bg-slate-100 rounded-md text-slate-600 active:bg-slate-200 transition-colors" title="Zoom Out">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                    </div>

                    {/* Responsive Container for Graph - Fixed Size Canvas */}
                    <div
                        className={`relative w-[800px] h-[800px] flex-shrink-0 flex items-center justify-center transition-transform duration-0 ease-linear origin-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`, touchAction: 'none' }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                        onPointerCancel={handlePointerCancel}
                    >

                        {/* Connecting Lines (SVG Layer) */}
                        <svg
                            className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
                            viewBox="0 0 800 800"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            {relations.map((rel, i) => {
                                const unitPos = getUnitPosition(i, relations.length);
                                const radius = 300; // SVG coordinate system radius
                                const center = { x: 400, y: 400 };
                                const target = {
                                    x: center.x + unitPos.x * radius,
                                    y: center.y + unitPos.y * radius
                                };

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
                            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                            onClick={() => onCourseClick && onCourseClick(selectedId)}
                            title="点击查看课程详情"
                        >
                            <div className="font-bold text-slate-800 text-sm line-clamp-3 leading-tight group-hover:text-indigo-700 transition-colors">{currentCourse?.name.split('(')[0]}</div>
                            <div className="text-[10px] text-slate-400 mt-2 font-mono">{currentCourse?.id.toUpperCase()}</div>
                        </div>

                        {/* Related Nodes */}
                        {relations.length > 0 ? (
                            relations.map((rel, i) => {
                                const unitPos = getUnitPosition(i, relations.length);
                                const percentRadius = 37.5; // 300px / 800px = 37.5%
                                return (
                                    <div
                                        key={i}
                                        className="absolute z-20 w-32 p-3 bg-white rounded-xl border border-slate-200 shadow-lg flex flex-col items-center text-center cursor-pointer hover:border-indigo-300 hover:shadow-indigo-100 transition-all group"
                                        style={{
                                            // Use percentage based positioning to match SVG scaling
                                            left: `${50 + unitPos.x * percentRadius}%`,
                                            top: `${50 + unitPos.y * percentRadius}%`,
                                            transform: 'translate(-50%, -50%)',
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeGraph;
