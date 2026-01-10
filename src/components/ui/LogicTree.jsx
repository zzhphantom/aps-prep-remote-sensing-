import React, { useState, useEffect } from 'react';
import { Zap, Languages, ChevronDown, Network, RefreshCw } from 'lucide-react';

import HighlightText from './HighlightText';

const LogicNode = ({ node, level = 0, _isLast = false, lang = 'cn', highlightTerm }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [localLang, setLocalLang] = useState(lang);
    const hasChildren = node?.children?.length > 0;

    useEffect(() => { setLocalLang(lang); }, [lang]);
    if (!node) return null;

    const label = node.label ? (node.label[localLang] || node.label.cn) : "Node";
    const desc = node.desc ? (node.desc[localLang] || node.desc.cn) : "";

    const toggleLocalLang = (e) => {
        e.stopPropagation();
        setLocalLang(prev => prev === 'cn' ? 'en' : 'cn');
    };

    return (
        <div className="relative">
            {/* 连接线 - 只在有子节点时显示 */}
            {hasChildren && level > 0 && (
                <div className="absolute left-4 top-6 bottom-0 w-px bg-slate-200" />
            )}

            <div className="mb-4 relative group">
                <div onClick={() => hasChildren && setIsExpanded(!isExpanded)} className={`relative p-3 rounded-xl border transition-all duration-200 w-full ${level === 0 ? 'bg-teal-50 border-teal-200 shadow-sm' : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-md'} ${hasChildren ? 'cursor-pointer' : ''}`}>
                    {node.heavy && <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full z-10 shadow-sm"><Zap className="w-3 h-3 inline mr-0.5" /> Core</div>}
                    <div className="flex justify-between items-start">
                        <div className="pr-8 flex-1 min-w-0">
                            <h4 className={`font-bold text-sm ${level === 0 ? 'text-teal-800' : 'text-slate-800'} break-words whitespace-normal`}>
                                <HighlightText text={label} highlight={highlightTerm} />
                            </h4>
                            {desc && <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words whitespace-normal">
                                <HighlightText text={desc} highlight={highlightTerm} />
                            </p>}
                        </div>
                        <div className="absolute top-3 right-3 flex gap-1 items-center">
                            <button onClick={toggleLocalLang} className="p-1 rounded-full text-slate-300 hover:text-teal-600 hover:bg-slate-100"><Languages className="w-3.5 h-3.5" /></button>
                            {hasChildren && <div className={`p-1 rounded-full text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}><ChevronDown className="w-4 h-4" /></div>}
                        </div>
                    </div>
                </div>

                {/* 子节点容器 - 垂直布局 */}
                {hasChildren && isExpanded && (
                    <div className="mt-2 ml-4 sm:ml-6 md:ml-8 space-y-2">
                        {node.children.map((child, idx) => (
                            <LogicNode
                                key={idx}
                                node={child}
                                level={level + 1}
                                isLast={idx === node.children.length - 1}
                                lang={lang}
                                highlightTerm={highlightTerm}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const LogicTreeContainer = ({ data, highlightTerm }) => {
    const [lang, setLang] = useState('cn');
    if (!data?.children) return <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-xl">暂无导图</div>;
    return (
        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4 px-1">
                <div className="flex items-center text-xs font-bold text-slate-400 uppercase"><Network className="w-3.5 h-3.5 mr-1.5" /> Logic</div>
                <button onClick={() => setLang(l => l === 'cn' ? 'en' : 'cn')} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white border shadow-sm text-xs text-slate-600"><RefreshCw className="w-3.5 h-3.5 mr-1" />{lang === 'cn' ? '全译' : 'All'}</button>
            </div>
            <div className="w-full"><LogicNode node={data} level={0} isLast={true} lang={lang} highlightTerm={highlightTerm} /></div>
        </div>
    );
};

export default LogicTreeContainer;
