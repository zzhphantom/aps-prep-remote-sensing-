import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, CheckCircle, Target, Calendar, ChevronDown, 
  ChevronRight, Award, RefreshCw, Layers, Sparkles, X, 
  Smartphone, GraduationCap, FileText, Globe, Network, 
  Languages, Zap, Activity, Plus, MessageSquare
} from 'lucide-react';

import { QUOTES,COURSE_DATA } from './data';
// ============================================================================
// FILE: src/config.js (全局配置)
// ============================================================================
const apiKey = "AIzaSyCqEmWWUuTuBpOo2JaWZcXIOOnI4k3QOVU"; 

// KaTeX CDN 配置
const KATEX_CSS = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
const KATEX_JS = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";

const callGemini = async (prompt) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "AI 思考超时，请重试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 服务暂时不可用，请检查网络设置。";
  }
};



// ============================================================================
// FILE: src/utils/MarkdownRenderer.jsx
// ============================================================================

// 动态加载 KaTeX 脚本和样式
const useKatex = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.katex) {
      setIsLoaded(true);
      return;
    }

    const link = document.createElement("link");
    link.href = KATEX_CSS;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = KATEX_JS;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);
  }, []);

  return isLoaded;
};

// 数学公式显示组件
const KatexMath = ({ tex, block = false }) => {
  const containerRef = useRef(null);
  const katexLoaded = useKatex();

  useEffect(() => {
    if (katexLoaded && containerRef.current && window.katex) {
      try {
        window.katex.render(tex, containerRef.current, {
          displayMode: block,
          throwOnError: false,
        });
      } catch (e) {
        console.error("KaTeX Render Error:", e);
        containerRef.current.innerText = tex;
      }
    } else if (containerRef.current) {
        containerRef.current.innerText = tex;
    }
  }, [tex, block, katexLoaded]);

  return <span ref={containerRef} className={block ? "block my-2 text-center overflow-x-auto" : "inline-block px-0.5"} />;
};

// 行内解析器
const InlineRenderer = ({ text }) => {
  if (!text) return null;
  const regex = /(\$\$(.*?)\$\$)|(\\\((.*?)\\\))|(\$(.*?)\$)|(\*\*(.*?)\*\*)|(`(.*?)`)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    if (match[1]) {
      parts.push(<KatexMath key={`bm-${match.index}`} tex={match[2]} block={false} />);
    } else if (match[3]) {
      parts.push(<KatexMath key={`im1-${match.index}`} tex={match[4]} block={false} />);
    } else if (match[5]) {
      parts.push(<KatexMath key={`im2-${match.index}`} tex={match[6]} block={false} />);
    } else if (match[7]) {
      parts.push(<strong key={`b-${match.index}`} className="text-slate-900 font-bold">{match[8]}</strong>);
    } else if (match[9]) {
      parts.push(<code key={`c-${match.index}`} className="font-mono text-xs text-amber-600 bg-amber-50 px-1 rounded border border-amber-100">{match[10]}</code>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.substring(lastIndex));
  return <>{parts}</>;
};

// 块级解析器
const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const blocks = [];
  let currentBlock = null;

  lines.forEach(line => {
    const trimmed = line.trim();

    if (trimmed.startsWith('|')) {
      if (currentBlock && currentBlock.type === 'table') {
        currentBlock.lines.push(trimmed);
      } else {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'table', lines: [trimmed] };
      }
      return;
    }

    if (trimmed.startsWith('$$') || trimmed.startsWith('\\[')) {
      if (currentBlock) blocks.push(currentBlock);
      let math = trimmed;
      if (math.startsWith('$$')) math = math.slice(2);
      else if (math.startsWith('\\[')) math = math.slice(2);
      if (math.endsWith('$$')) math = math.slice(0, -2);
      else if (math.endsWith('\\]')) math = math.slice(0, -2);
      blocks.push({ type: 'math', content: math });
      currentBlock = null;
      return;
    }

    if (trimmed === '---' || trimmed === '***') {
      if (currentBlock) blocks.push(currentBlock);
      blocks.push({ type: 'hr' });
      currentBlock = null;
      return;
    }

    if (/^#{1,6}\s/.test(trimmed)) {
      if (currentBlock) blocks.push(currentBlock);
      const level = trimmed.match(/^#+/)[0].length;
      blocks.push({ type: 'heading', level, content: trimmed.replace(/^#+\s/, '') });
      currentBlock = null;
      return;
    }
    
    if (/^([一二三四五六七八九十]+|[0-9]+)、/.test(trimmed)) {
       if (currentBlock) blocks.push(currentBlock);
       blocks.push({ type: 'cn-heading', content: trimmed });
       currentBlock = null;
       return;
    }

    if (/^[\*\-]\s|^\d+\.\s/.test(trimmed)) {
      if (currentBlock && currentBlock.type === 'list') {
        currentBlock.lines.push(trimmed);
      } else {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'list', lines: [trimmed] };
      }
      return;
    }

    if (currentBlock && currentBlock.type === 'text') {
      currentBlock.lines.push(line);
    } else {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = { type: 'text', lines: [line] };
    }
  });
  if (currentBlock) blocks.push(currentBlock);

  return (
    <div className="space-y-4 text-sm leading-relaxed text-slate-700">
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          const styles = block.level === 1 
            ? "font-bold text-xl text-slate-900 border-b border-slate-200 pb-2 mb-3 mt-6"
            : block.level === 2 
              ? "font-bold text-lg text-teal-800 mt-5 mb-2"
              : "font-bold text-base text-slate-800 mt-4 mb-1";
          return <div key={idx} className={styles}><InlineRenderer text={block.content} /></div>;
        }

        if (block.type === 'cn-heading') {
           return (
            <div key={idx} className="font-bold text-indigo-700 mt-5 mb-2 text-base bg-indigo-50/50 p-2 rounded-lg border-l-4 border-indigo-400">
              <InlineRenderer text={block.content} />
            </div>
           );
        }

        if (block.type === 'hr') {
          return <hr key={idx} className="border-t border-slate-200 my-6" />;
        }

        if (block.type === 'math') {
          return (
            <div key={idx} className="my-3 p-3 bg-slate-50 border border-slate-200 rounded-lg overflow-x-auto text-center font-serif text-lg text-purple-800 shadow-sm">
              <KatexMath tex={block.content} block={true} />
            </div>
          );
        }

        if (block.type === 'table') {
          const [header, separator, ...body] = block.lines;
          const parseRow = (row) => (row || "").split('|').map(c => c.trim()).filter(c => c);
          const headers = parseRow(header);
          const rows = body.map(parseRow);

          return (
            <div key={idx} className="my-4 overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold">
                  <tr>
                    {headers.map((h, i) => (
                      <th key={i} className="p-3 border-b border-slate-200 whitespace-nowrap"><InlineRenderer text={h} /></th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {rows.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 text-slate-600"><InlineRenderer text={cell} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === 'list') {
          return (
            <div key={idx} className="space-y-1 my-2 pl-1">
              {block.lines.map((item, i) => {
                const isNum = /^\d+\.\s/.test(item);
                const content = item.replace(/^[\*\-]\s|^\d+\.\s/, '');
                return (
                  <div key={i} className="flex items-start">
                    {isNum 
                      ? <span className="mr-2 font-bold text-slate-500 text-xs mt-0.5">{item.match(/^\d+\./)[0]}</span>
                      : <div className="mr-2 mt-2 w-1.5 h-1.5 bg-teal-400 rounded-full flex-shrink-0" />
                    }
                    <div className="flex-1 text-slate-600"><InlineRenderer text={content} /></div>
                  </div>
                );
              })}
            </div>
          );
        }

        return (
          <div key={idx} className="space-y-2">
             {block.lines.map((l, i) => {
               if(!l.trim()) return <div key={i} className="h-1" />;
               return <div key={i} className="text-justify"><InlineRenderer text={l} /></div>;
             })}
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// FILE: src/components/LogicTree.jsx (逻辑树组件)
// ============================================================================

const BiText = ({ cn, en, label }) => {
  const [lang, setLang] = useState('cn');
  return (
    <div className="relative group">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <h4 className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</h4>
          <button onClick={() => setLang(l => l === 'cn' ? 'en' : 'cn')} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-mono text-slate-500 hover:text-teal-600 transition-colors border border-slate-200">
            <RefreshCw className="w-3 h-3" /><span>{lang === 'cn' ? '中' : 'EN'}</span>
          </button>
        </div>
      )}
      {!label && (
        <button onClick={(e) => { e.stopPropagation(); setLang(l => l === 'cn' ? 'en' : 'cn'); }} className="absolute top-2 right-2 p-1.5 rounded-md bg-white text-slate-400 border border-slate-200 shadow-sm z-10">
          <Languages className="w-3.5 h-3.5" />
        </button>
      )}
      <div className="transition-opacity duration-300">{lang === 'cn' ? cn : en}</div>
    </div>
  );
};

const LogicNode = ({ node, level = 0, isLast = false, lang = 'cn' }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [localLang, setLocalLang] = useState(lang);
  const hasChildren = node?.children?.length > 0;

  useEffect(() => { setLocalLang(lang); }, [lang]);
  if (!node) return null;

  const label = node.label ? (node.label[localLang] || node.label.cn) : "Node";
  const desc = node.desc ? (node.desc[localLang] || node.desc.cn) : "";
  const toggleLocalLang = (e) => { e.stopPropagation(); setLocalLang(prev => prev === 'cn' ? 'en' : 'cn'); };

  return (
    <div className="relative pl-6">
      {!isLast && level > 0 && <div className="absolute left-0 top-6 bottom-0 w-px bg-slate-200" />}
      {level > 0 && <div className={`absolute left-0 top-6 w-4 h-px bg-slate-200 ${isLast ? 'w-4' : ''}`} />}
      <div className="mb-4 relative group">
        <div 
          onClick={() => hasChildren && setIsExpanded(!isExpanded)}
          className={`relative p-3 rounded-xl border transition-all duration-200 ${level === 0 ? 'bg-teal-50 border-teal-200 shadow-sm' : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-md'} ${hasChildren ? 'cursor-pointer' : ''}`}
        >
          {node.heavy && <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full z-10 shadow-sm"><Zap className="w-3 h-3 inline mr-0.5" /> Core</div>}
          <div className="flex justify-between items-start">
            <div className="pr-8">
              <h4 className={`font-bold text-sm ${level === 0 ? 'text-teal-800' : 'text-slate-800'}`}>{label}</h4>
              {desc && <p className="text-xs text-slate-500 mt-1">{desc}</p>}
            </div>
            <div className="absolute top-3 right-3 flex gap-1 items-center">
               <button onClick={toggleLocalLang} className="p-1 rounded-full text-slate-300 hover:text-teal-600 hover:bg-slate-100"><Languages className="w-3.5 h-3.5" /></button>
               {hasChildren && <div className={`p-1 rounded-full text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}><ChevronDown className="w-4 h-4" /></div>}
            </div>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-2">
            {node.children.map((child, idx) => (
              <LogicNode key={idx} node={child} level={level + 1} isLast={idx === node.children.length - 1} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const LogicTreeContainer = ({ data }) => {
  const [lang, setLang] = useState('cn');
  if (!data?.children) return <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-xl">暂无导图</div>;
  return (
    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="flex items-center text-xs font-bold text-slate-400 uppercase"><Network className="w-3.5 h-3.5 mr-1.5" /> Logic</div>
        <button onClick={() => setLang(l => l === 'cn' ? 'en' : 'cn')} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white border shadow-sm text-xs text-slate-600"><RefreshCw className="w-3.5 h-3.5 mr-1" />{lang === 'cn' ? '全译' : 'All'}</button>
      </div>
      <div className="-ml-2"><LogicNode node={data} level={0} isLast={true} lang={lang} /></div>
    </div>
  );
};

// ============================================================================
// FILE: src/App.jsx (主程序)
// ============================================================================

const CourseModal = ({ course, onClose }) => {
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAiAsk = async () => {
    if (!aiQuery.trim()) return;
    setLoading(true);
    const res = await callGemini(`背景：APS审核。课程：${course.name}。问题：${aiQuery}。请用中文回答，术语附带英文，公式用$$格式(独立行)，表格用Markdown格式。`);
    setAiResponse(res);
    setLoading(false);
  };

  if (!course) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg sm:rounded-3xl rounded-t-3xl h-[90vh] flex flex-col shadow-2xl">
        <div className="p-5 border-b flex justify-between items-start bg-white z-20 sm:rounded-t-3xl">
          <div className="flex-1 mr-4">
            <h3 className="font-bold text-lg text-slate-800">{course.name}</h3>
            <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded">APS CORE</span>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-24">
          <BiText label={<><FileText className="w-4 h-4 mr-2" /> 概要 (Summary)</>} cn={<div className="bg-blue-50 text-blue-900 p-4 rounded-xl text-sm border-blue-100">{course.summary.cn}</div>} en={<div className="bg-indigo-50 text-indigo-900 p-4 rounded-xl text-sm border-indigo-100">{course.summary.en}</div>} />
          <BiText label={<><Target className="w-4 h-4 mr-2" /> 目标 (Goals)</>} cn={<p className="text-slate-700 text-sm border-l-4 border-teal-400 pl-3 py-1">{course.goals.cn}</p>} en={<p className="text-slate-700 text-sm border-l-4 border-indigo-400 pl-3 py-1">{course.goals.en}</p>} />
          <LogicTreeContainer data={course.logicTree} />
          {course.terms?.length > 0 && (
            <div>
              <h4 className="flex items-center text-sm font-bold text-slate-500 uppercase mb-4"><Globe className="w-4 h-4 mr-2" /> Terminology</h4>
              <div className="grid gap-3">{course.terms.map((t, i) => <div key={i} className="bg-white p-4 rounded-xl border shadow-sm"><div className="flex justify-between mb-2"><h5 className="font-bold text-teal-700">{t.en}</h5><span className="text-xs bg-slate-100 px-2 py-0.5 rounded">{t.cn}</span></div><BiText cn={<div className="text-xs text-slate-500 pt-2 border-t">{t.desc_cn}</div>} en={<div className="text-xs text-slate-500 pt-2 border-t">{t.desc_en}</div>} /></div>)}</div>
            </div>
          )}
          <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
            <h4 className="flex items-center text-sm font-bold text-purple-700 mb-3"><Sparkles className="w-4 h-4 mr-2" /> AI Tutor</h4>
            <div className="flex gap-2 mb-4"><input className="flex-grow text-sm p-3 rounded-xl border" value={aiQuery} onChange={e => setAiQuery(e.target.value)} placeholder="Ask a question..." /><button onClick={handleAiAsk} disabled={loading} className="bg-purple-600 text-white px-5 rounded-xl text-sm font-bold">{loading ? "..." : "Ask"}</button></div>
            {aiResponse && <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm"><MarkdownRenderer content={aiResponse} /></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseList = ({ setSelectedCourse }) => {
  const [expandedCat, setExpandedCat] = useState("理论基础 (Fundamentals)");
  return (
    <div className="space-y-4">
      {COURSE_DATA.map((cat, idx) => (
        <div key={idx} className="bg-white border rounded-2xl overflow-hidden">
          <button onClick={() => setExpandedCat(expandedCat === cat.category ? null : cat.category)} className="w-full flex justify-between p-4 bg-slate-50 hover:bg-slate-100 font-bold text-sm text-slate-700">{cat.category} {expandedCat === cat.category ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</button>
          {expandedCat === cat.category && <div className="p-2 grid gap-2 bg-slate-50/30">{cat.courses.map(c => <div key={c.id} onClick={() => setSelectedCourse(c)} className="p-4 bg-white border rounded-xl hover:border-teal-400 shadow-sm cursor-pointer flex justify-between"><div className="pr-2"><h4 className="font-bold text-sm text-slate-800">{c.name.split('(')[0]}</h4><p className="text-xs text-slate-400 truncate">{c.summary.cn}</p></div><ChevronRight className="w-4 h-4 text-slate-300" /></div>)}</div>}
        </div>
      ))}
    </div>
  );
};

const DailyCheckIn = ({ streak, setStreak, lastCheckIn, setLastCheckIn }) => {
  const [reflection, setReflection] = useState("");
  const [checked, setChecked] = useState(false);
  
  useEffect(() => { if (lastCheckIn === new Date().toDateString()) setChecked(true); }, [lastCheckIn]);
  const handleCheckIn = () => { if (!reflection.trim()) return; setStreak(s => s + 1); setLastCheckIn(new Date().toDateString()); setChecked(true); };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border relative overflow-hidden">
      <div className="flex justify-between mb-6 relative z-10"><h3 className="text-lg font-bold flex items-center"><Activity className="mr-2 text-teal-600 w-5 h-5" /> 每日复盘</h3><span className="text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full">Day {streak}</span></div>
      {checked ? <div className="text-center py-8 bg-green-50 rounded-xl"><CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" /><p className="text-green-800 font-bold text-sm">已完成</p></div> : <div className="space-y-4"><textarea className="w-full p-4 border rounded-xl text-sm" rows="3" placeholder="今天的感悟..." value={reflection} onChange={e => setReflection(e.target.value)} /><button onClick={handleCheckIn} className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl text-sm">打卡</button></div>}
    </div>
  );
};

const InterviewSim = () => {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(false);
  const qs = [{ q: "Supervised vs Unsupervised?", a: "Training samples vs Statistical clustering." }, { q: "SAR Distortions?", a: "Foreshortening, Layover, Shadow." }];
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between mb-8"><h3 className="font-bold text-lg flex"><RefreshCw className="mr-2 text-purple-600"/> Q&A</h3><span className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full">Q-{idx + 1}</span></div>
      <div className="flex-grow flex flex-col justify-center"><h4 className="text-xl font-bold mb-4">{qs[idx].q}</h4>{show ? <div className="bg-slate-50 p-5 rounded-2xl text-sm border-l-4 border-purple-500">{qs[idx].a}</div> : <div className="h-32 bg-slate-50 rounded-2xl border-dashed border-2 flex items-center justify-center text-xs text-slate-400">Think...</div>}</div>
      <div className="grid grid-cols-2 gap-4 mt-8"><button onClick={() => setShow(!show)} className="py-3 border rounded-xl text-sm font-bold text-slate-600">{show ? "Hide" : "Show"}</button><button onClick={() => { setIdx((idx + 1) % qs.length); setShow(false); }} className="py-3 bg-slate-900 text-white rounded-xl text-sm font-bold">Next</button></div>
    </div>
  );
};

const Dashboard = ({ setActiveTab }) => (
  <div className="space-y-6 animate-in fade-in">
    <div className="bg-gradient-to-r from-teal-700 to-emerald-600 rounded-3xl p-6 text-white shadow-xl relative">
      <h1 className="text-3xl font-bold mb-2">Ready?</h1>
      <p className="text-teal-50 text-sm mb-5 italic">"{QUOTES[0]}"</p>
      <div className="flex items-center text-xs font-mono bg-black/20 px-4 py-1.5 rounded-full"><GraduationCap className="w-3.5 h-3.5 mr-2" /> CUG {'->'} Germany</div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div onClick={() => setActiveTab('courses')} className="bg-white p-5 rounded-2xl border shadow-sm cursor-pointer hover:border-teal-400"><BookOpen className="w-12 h-12 text-blue-600 bg-blue-50 p-3 rounded-2xl mb-4" /><h3 className="font-bold text-slate-700">核心课程</h3><p className="text-xs text-slate-400 mt-1">14门硬核复习</p></div>
      <div onClick={() => setActiveTab('interview')} className="bg-white p-5 rounded-2xl border shadow-sm cursor-pointer hover:border-purple-400"><MessageSquare className="w-12 h-12 text-purple-600 bg-purple-50 p-3 rounded-2xl mb-4" /><h3 className="font-bold text-slate-700">模拟面谈</h3><p className="text-xs text-slate-400 mt-1">AI 考官</p></div>
    </div>
  </div>
);

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const renderContent = () => {
    switch(tab) {
      case 'dashboard': return <Dashboard setActiveTab={setTab} />;
      case 'courses': return <CourseList setSelectedCourse={setSelectedCourse} />;
      case 'interview': return <InterviewSim />;
      default: return null;
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-slate-50 font-sans text-slate-900 max-w-md mx-auto shadow-2xl flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center z-30"><div className="flex items-center space-x-3" onClick={() => setTab('dashboard')}><div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center text-white font-bold">RS</div><span className="font-bold text-slate-800 text-lg">Logic Prep</span></div><Smartphone className="w-5 h-5 text-slate-400" /></header>
      
      <main className="flex-1 overflow-y-auto scrollbar-hide p-6 pb-24">
        {renderContent()}
      </main>

      <nav className="bg-white border-t px-6 py-3 flex justify-between items-center z-30 pb-safe sm:pb-3">
        {['dashboard', 'courses', 'interview'].map(t => <button key={t} onClick={() => setTab(t)} className={`flex flex-col items-center w-16 space-y-1.5 ${tab === t ? 'text-teal-600 scale-105' : 'text-slate-400'}`}>{t === 'dashboard' ? <Layers className="w-6 h-6" /> : t === 'courses' ? <BookOpen className="w-6 h-6" /> : <Award className="w-6 h-6" />}<span className="text-[10px] font-bold uppercase">{t}</span></button>)}
      </nav>

      {selectedCourse && <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
    </div>
  );
}