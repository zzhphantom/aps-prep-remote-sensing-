import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, CheckCircle, Brain, Target, Calendar, ChevronDown, ChevronUp,
  ChevronRight, Award, RefreshCw, Layers, Sparkles, X, 
  Smartphone, GraduationCap, FileText, Globe, Network, 
  Languages, Zap, Activity, Plus, MessageSquare, StickyNote, 
  Save, Trash2, ChevronLeft, CalendarDays, Check, Maximize2, Eye, EyeOff
} from 'lucide-react';

import {QUOTES , COURSE_DATA} from './data';
import CheckinCalendar from './components/CheckinCalendar';
import { db } from './firebase';
import { collection, addDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';

const DEMO_USER_ID = 'demo-user-1';

// ============================================================================
// 1. 全局配置与 API
// ============================================================================
// API Key 现在通过用户设置管理，不再硬编码

const KATEX_CSS = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
const KATEX_JS = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";


// ============================================================================
// 3. 渲染引擎
// ============================================================================

const callGemini = async (prompt, config = {}) => {
  const { model = 'gemini-2.5-flash-preview-09-2025', apiKey: customApiKey } = config;

  if (!customApiKey) {
    return "⚠️ 请先配置 API Key！\n\n请前往「设置」页面添加您的 Google AI API Key：\n1. 访问 https://makersuite.google.com/app/apikey\n2. 创建新的 API Key\n3. 在设置页面输入并保存\n\n配置完成后即可使用 AI 功能。";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${customApiKey}`,
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
    return "AI 服务暂时不可用，请检查网络设置或 API Key 配置。";
  }
};

const useKatex = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (window.katex) { setIsLoaded(true); return; }
    const link = document.createElement("link");
    link.href = KATEX_CSS; link.rel = "stylesheet";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = KATEX_JS; script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);
  }, []);
  return isLoaded;
};

// 🌟 动态注入 App 图标 (Canvas 生成 PNG 方式，兼容 iOS)
const useFavicon = () => {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 192;
    canvas.height = 192;
    const ctx = canvas.getContext('2d');

    // 1. 绘制圆角背景
    ctx.fillStyle = '#0d9488'; // Teal-600
    ctx.beginPath();
    ctx.rect(0, 0, 192, 192); 
    ctx.fill();

    // 2. 绘制文字
    ctx.fillStyle = 'white';
    ctx.font = 'bold 100px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RS', 96, 96);

    const iconUrl = canvas.toDataURL('image/png');

    const setLink = (rel, href) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
    };

    setLink('icon', iconUrl);
    setLink('apple-touch-icon', iconUrl); 
  }, []);
};

const KatexMath = ({ tex, block = false }) => {
  const containerRef = useRef(null);
  const katexLoaded = useKatex();
  useEffect(() => {
    if (katexLoaded && containerRef.current && window.katex) {
      try { 
        window.katex.render(tex, containerRef.current, { 
          displayMode: block, throwOnError: false, strict: false 
        }); 
      } catch (e) { containerRef.current.innerText = tex; }
    } else if (containerRef.current) { containerRef.current.innerText = tex; }
  }, [tex, block, katexLoaded]);
  return <span ref={containerRef} className={block ? "block my-2 text-center overflow-x-auto scrollbar-hide" : "inline-block px-0.5"} />;
};

const InlineRenderer = ({ text }) => {
  if (!text) return null;
  const regex = /(\*\*(.*?)\*\*)|(\$(.*?)\$)|(`(.*?)`)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
    if (match[1]) parts.push(<strong key={match.index} className="text-slate-900 font-bold">{match[2]}</strong>);
    else if (match[3]) parts.push(<KatexMath key={match.index} tex={match[4]} block={false} />);
    else if (match[5]) parts.push(<code key={match.index} className="font-mono text-xs text-amber-600 bg-amber-50 px-1 rounded border border-amber-100">{match[6]}</code>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.substring(lastIndex));
  return <>{parts}</>;
};

const MarkdownRenderer = ({ content }) => {
  if (!content) return null;
  const lines = content.split('\n');
  const blocks = [];
  let currentBlock = null;
  let inMathBlock = false;
  let mathBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const isMathStart = trimmed.startsWith('$$') || trimmed.startsWith('\\[');
    const isMathEnd = trimmed.endsWith('$$') || trimmed.endsWith('\\]');

    if (inMathBlock) {
      if (isMathEnd) {
        let cleanLine = trimmed.replace(/\$\$|\\\]/g, '');
        if (cleanLine) mathBuffer.push(cleanLine);
        blocks.push({ type: 'math', content: mathBuffer.join(' ') }); 
        inMathBlock = false; mathBuffer = [];
      } else { mathBuffer.push(line); }
      continue;
    }

    if (isMathStart) {
      if (currentBlock) { blocks.push(currentBlock); currentBlock = null; }
      if (isMathEnd && trimmed.length > 2) {
        let math = trimmed.replace(/^\$\$|^\\\[|\\\]$|\$\$$/g, '');
        blocks.push({ type: 'math', content: math });
        continue;
      }
      inMathBlock = true;
      let cleanLine = trimmed.replace(/^\$\$|^\\\[/, '');
      if (cleanLine) mathBuffer.push(cleanLine);
      continue;
    }

    if (!trimmed) { if (currentBlock) { blocks.push(currentBlock); currentBlock = null; } continue; }

    if (trimmed.startsWith('|')) {
      if (currentBlock && currentBlock.type === 'table') currentBlock.lines.push(trimmed);
      else { if (currentBlock) blocks.push(currentBlock); currentBlock = { type: 'table', lines: [trimmed] }; }
      continue;
    }
    if (trimmed === '---' || trimmed === '***') {
      if (currentBlock) blocks.push(currentBlock); blocks.push({ type: 'hr' }); continue;
    }
    if (/^#{1,6}\s/.test(trimmed)) {
      if (currentBlock) blocks.push(currentBlock);
      blocks.push({ type: 'heading', level: trimmed.match(/^#+/)[0].length, content: trimmed.replace(/^#+\s/, '') });
      continue;
    }
    if (/^([一二三四五六七八九十]+|[0-9]+)、/.test(trimmed)) {
       if (currentBlock) blocks.push(currentBlock); blocks.push({ type: 'cn-heading', content: trimmed }); continue;
    }
    if (/^[\*\-]\s|^\d+\.\s/.test(trimmed)) {
      if (currentBlock && currentBlock.type === 'list') currentBlock.lines.push(trimmed);
      else { if (currentBlock) blocks.push(currentBlock); currentBlock = { type: 'list', lines: [trimmed] }; }
      continue;
    }
    if (currentBlock && currentBlock.type === 'text') currentBlock.lines.push(line);
    else { if (currentBlock) blocks.push(currentBlock); currentBlock = { type: 'text', lines: [line] }; }
  }
  if (currentBlock) blocks.push(currentBlock);
  if (inMathBlock) blocks.push({ type: 'math', content: mathBuffer.join(' ') });

  return (
    <div className="space-y-4 text-sm leading-relaxed text-slate-700">
      {blocks.map((block, idx) => {
        if (block.type === 'math') return <div key={idx} className="my-4 p-3 bg-slate-50 border border-slate-200 rounded-lg overflow-x-auto shadow-sm text-center"><KatexMath tex={block.content} block={true} /></div>;
        if (block.type === 'heading') return <div key={idx} className={`font-bold text-slate-900 ${block.level===1?'text-xl border-b pb-2 mt-6':block.level===2?'text-lg text-teal-800 mt-5':'text-base mt-4'}`}><InlineRenderer text={block.content} /></div>;
        if (block.type === 'cn-heading') return <div key={idx} className="font-bold text-indigo-700 mt-5 mb-2 text-base bg-indigo-50/50 p-2 rounded-lg border-l-4 border-indigo-400"><InlineRenderer text={block.content} /></div>;
        if (block.type === 'hr') return <hr key={idx} className="border-t border-slate-200 my-6" />;
        if (block.type === 'table') {
          const [h, s, ...b] = block.lines;
          const parse = r => (r||"").split('|').map(c=>c.trim()).filter(c=>c);
          return <div key={idx} className="my-4 overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white"><table className="w-full text-left text-xs sm:text-sm border-collapse"><thead className="bg-slate-50 text-slate-700 font-bold"><tr>{parse(h).map((c,i)=><th key={i} className="p-3 border-b border-slate-200 whitespace-nowrap"><InlineRenderer text={c}/></th>)}</tr></thead><tbody className="bg-white">{b.map((r,i)=><tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">{parse(r).map((c,j)=><td key={j} className="p-3 text-slate-600"><InlineRenderer text={c}/></td>)}</tr>)}</tbody></table></div>;
        }
        if (block.type === 'list') return <div key={idx} className="space-y-1 my-2 pl-1">{block.lines.map((it, i) => <div key={i} className="flex items-start">{/^\d+\.\s/.test(it)?<span className="mr-2 font-bold text-teal-600 text-xs mt-0.5">{it.match(/^\d+\./)[0]}</span>:<div className="mr-2 mt-2 w-1.5 h-1.5 bg-teal-400 rounded-full flex-shrink-0"/>}<div className="flex-1 text-slate-600"><InlineRenderer text={it.replace(/^[\*\-]\s|^\d+\.\s/,'')}/></div></div>)}</div>;
        if (block.type === 'text') return <div key={idx} className="space-y-2">{block.lines.map((l,i)=><div key={i} className="text-justify"><InlineRenderer text={l}/></div>)}</div>;
        return null;
      })}
    </div>
  );
};

// ============================================================================
// 4. UI 业务组件
// ============================================================================

const Toast = ({ message, onClose }) => {
  useEffect(() => { const timer = setTimeout(onClose, 2000); return () => clearTimeout(timer); }, [onClose]);
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 z-[100] animate-in fade-in slide-in-from-top-4 backdrop-blur-sm">
      <CheckCircle className="w-5 h-5 text-teal-400" /><span className="text-sm font-medium">{message}</span>
    </div>
  );
};

const BiText = ({ cn, en, label }) => {
  const [lang, setLang] = useState('cn');
  return (
    <div className="relative group">
      {label && <div className="flex justify-between items-center mb-2"><h4 className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</h4><button onClick={() => setLang(l => l==='cn'?'en':'cn')} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-mono text-slate-500 hover:text-teal-600 transition-colors border border-slate-200"><RefreshCw className="w-3 h-3"/><span>{lang==='cn'?'中':'EN'}</span></button></div>}
      {!label && <button onClick={(e) => { e.stopPropagation(); setLang(l => l==='cn'?'en':'cn'); }} className="absolute top-2 right-2 p-1.5 rounded-md bg-white text-slate-400 border border-slate-200 shadow-sm z-10"><Languages className="w-3.5 h-3.5" /></button>}
      <div className={`transition-opacity duration-300 ${!label ? 'pr-9' : ''}`}>{lang === 'cn' ? cn : en}</div>
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

  const toggleLocalLang = (e) => {
    e.stopPropagation();
    setLocalLang(prev => prev === 'cn' ? 'en' : 'cn');
  };

  return (
    <div className="relative pl-3">
      {!isLast && level > 0 && <div className="absolute left-0 top-6 bottom-0 w-px bg-slate-200" />}
      {level > 0 && <div className={`absolute left-0 top-6 w-3 h-px bg-slate-200 ${isLast ? 'w-3' : ''}`} />}
      <div className="mb-4 relative group">
        <div onClick={() => hasChildren && setIsExpanded(!isExpanded)} className={`relative p-3 rounded-xl border transition-all duration-200 w-full max-w-[90vw] ${level===0?'bg-teal-50 border-teal-200 shadow-sm':'bg-white border-slate-200 hover:border-teal-300 hover:shadow-md'} ${hasChildren?'cursor-pointer':''}`}>
          {node.heavy && <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full z-10 shadow-sm"><Zap className="w-3 h-3 inline mr-0.5" /> Core</div>}
          <div className="flex justify-between items-start">
            <div className="pr-8 flex-1 min-w-0">
              <h4 className={`font-bold text-sm ${level===0?'text-teal-800':'text-slate-800'} break-words whitespace-normal`}>{label}</h4>
              {desc && <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words whitespace-normal">{desc}</p>}
            </div>
            <div className="absolute top-3 right-3 flex gap-1 items-center">
               <button onClick={toggleLocalLang} className="p-1 rounded-full text-slate-300 hover:text-teal-600 hover:bg-slate-100"><Languages className="w-3.5 h-3.5" /></button>
               {hasChildren && <div className={`p-1 rounded-full text-slate-400 transition-transform ${isExpanded?'rotate-180':''}`}><ChevronDown className="w-4 h-4" /></div>}
            </div>
          </div>
        </div>
        {hasChildren && isExpanded && <div className="mt-2">{node.children.map((child, idx) => <LogicNode key={idx} node={child} level={level+1} isLast={idx===node.children.length-1} lang={lang} />)}</div>}
      </div>
    </div>
  );
};

const LogicTreeContainer = ({ data }) => {
  const [lang, setLang] = useState('cn');
  if (!data?.children) return <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-xl">暂无导图</div>;
  return (
    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 overflow-x-auto">
      <div className="flex justify-between items-center mb-4 px-1 min-w-[260px]">
        <div className="flex items-center text-xs font-bold text-slate-400 uppercase"><Network className="w-3.5 h-3.5 mr-1.5" /> Logic</div>
        <button onClick={() => setLang(l => l==='cn'?'en':'cn')} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white border shadow-sm text-xs text-slate-600"><RefreshCw className="w-3.5 h-3.5 mr-1" />{lang==='cn'?'全译':'All'}</button>
      </div>
      <div className="-ml-1 min-w-max"><LogicNode node={data} level={0} isLast={true} lang={lang} /></div>
    </div>
  );
};

const MOCK_HISTORY = {
  "Sun Oct 01 2023": "复习了电磁波谱，重点记忆了可见光和近红外波段范围。",
  "Tue Oct 03 2023": "学习了大气窗口，明白了为什么某些波段无法观测。",
  "Thu Oct 05 2023": "深入理解了瑞利散射和米氏散射的区别，蓝色天空原理解析。",
  "Tue Oct 10 2023": "今日复盘：几何校正的GCP选取原则，分布要均匀。",
  "Thu Oct 12 2023": "攻克了NDVI公式，(NIR-R)/(NIR+R)，范围-1到1。",
};

const CalendarModal = ({ history, onClose }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDateLog, setSelectedDateLog] = useState(null);

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: firstDay }).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const changeMonth = (offset) => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  const handleDayClick = (day) => {
    if (!day) return;
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    setSelectedDateLog({ date: dateStr, content: history[dateStr] || "暂无打卡记录" });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 bg-teal-600 text-white flex justify-between items-center"><h3 className="font-bold flex items-center gap-2"><CalendarDays className="w-5 h-5"/> 学习日历</h3><button onClick={onClose}><X className="w-5 h-5"/></button></div>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-100 rounded"><ChevronLeft className="w-5 h-5 text-slate-500"/></button>
            <span className="font-bold text-slate-700">{currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月</span>
            <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-100 rounded"><ChevronRight className="w-5 h-5 text-slate-500"/></button>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
            {['日','一','二','三','四','五','六'].map(d => <div key={d} className="text-slate-400 text-xs font-bold">{d}</div>)}
            {days.map((day, i) => {
              if (!day) return <div key={i}></div>;
              const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
              const isChecked = !!history[dateStr];
              const isToday = dateStr === today.toDateString();
              return (
                <div key={i} onClick={() => handleDayClick(day)} className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all relative ${isToday ? 'border-2 border-teal-500 text-teal-600 font-bold' : ''} ${isChecked ? 'bg-teal-100 text-teal-800 font-bold' : 'hover:bg-slate-100 text-slate-600'}`}>
                  {day}{isChecked && <div className="absolute bottom-1 w-1 h-1 bg-teal-500 rounded-full"></div>}
                </div>
              );
            })}
          </div>
          {selectedDateLog && <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in slide-in-from-bottom-2"><div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-teal-500"></div><span className="text-xs font-bold text-slate-500">{selectedDateLog.date}</span></div><p className="text-sm text-slate-700 leading-relaxed">{selectedDateLog.content}</p></div>}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 6. 页面组件 (NoteCard, NoteReader, CourseModal, etc.)
// ============================================================================

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
          <button onClick={onClose} className="p-1 rounded-full hover:bg-yellow-100 transition-colors"><X className="w-5 h-5 text-slate-400 hover:text-slate-600"/></button>
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

// 3. 课程详情弹窗
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
                onChange={(e) => {setAiQuery(e.target.value); setIsSaved(false);}}
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

const DailyCheckIn = ({ streak, setStreak, lastCheckIn, setLastCheckIn, history, setHistory }) => {
  const [reflection, setReflection] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (lastCheckIn === new Date().toDateString()) setChecked(true); }, [lastCheckIn]);
  const handleCheckIn = () => { 
    if (!reflection.trim()) return; 
    const today = new Date().toDateString();
    setStreak(s => s + 1); 
    setLastCheckIn(today); 
    setHistory(prev => ({ ...prev, [today]: reflection }));
    setChecked(true); 
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
      <div className="flex justify-between mb-6 relative z-10"><h3 className="text-lg font-bold flex items-center text-slate-800"><Activity className="mr-2 text-teal-600 w-5 h-5" /> 每日复盘</h3><div className="flex gap-2"><button onClick={() => setShowCalendar(true)} className="text-xs font-bold bg-white text-slate-600 border border-slate-200 px-3 py-1.5 rounded-full flex items-center hover:bg-slate-50 transition-colors"><CalendarDays className="w-3.5 h-3.5 mr-1.5 text-teal-600"/> 日历</button><span className="text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full border border-teal-100">Day {streak}</span></div></div>
      {checked ? <div className="text-center py-8 bg-green-50/50 rounded-xl border border-green-100"><CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" /><p className="text-green-800 font-bold text-sm">今日复盘已完成</p></div> : <div className="space-y-4"><textarea className="w-full p-4 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white transition-colors" rows="3" placeholder="今天的感悟..." value={reflection} onChange={e => setReflection(e.target.value)} /><button onClick={handleCheckIn} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-teal-200">提交打卡</button></div>}
      {showCalendar && <CalendarModal history={history} onClose={() => setShowCalendar(false)} />}
    </div>
  );
};

const InterviewSim = () => {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(false);
  const qs = [{ q: "Supervised vs Unsupervised?", a: "Training samples vs Statistical clustering." }, { q: "SAR Distortions?", a: "Foreshortening, Layover, Shadow." }];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full relative overflow-hidden">
      <div className="flex justify-between mb-8"><h3 className="font-bold text-lg flex text-slate-800"><RefreshCw className="mr-2 text-purple-600"/> 快速问答</h3><span className="text-xs font-mono font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100">Q-{idx + 1}</span></div>
      <div className="flex-grow flex flex-col justify-center"><h4 className="text-xl font-bold text-slate-800 mb-4 leading-snug">{qs[idx].q}</h4>{show ? <div className="bg-slate-50 p-5 rounded-2xl text-sm text-slate-700 border-l-4 border-purple-500 animate-in fade-in">{qs[idx].a}</div> : <div className="h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">Think...</div>}</div>
      <div className="grid grid-cols-2 gap-4 mt-8"><button onClick={() => setShow(!show)} className="py-3 border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">{show ? "隐藏答案" : "查看答案"}</button><button onClick={() => { setIdx((idx + 1) % qs.length); setShow(false); }} className="py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-sm font-bold shadow-lg">下一题</button></div>
    </div>
  );
};

const Dashboard = ({ setActiveTab }) => {
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

// -----------------------------------------------------------------------------
// 主入口 (App - State Manager)
// -----------------------------------------------------------------------------
const Settings = ({ aiConfig, setAiConfig, showToast }) => {
  const [tempConfig, setTempConfig] = useState(aiConfig);
  const [showApiKey, setShowApiKey] = useState(false);

  const models = [
    { id: 'gemini-2.5-flash-preview-09-2025', name: 'Gemini 2.5 Flash (最新)', provider: 'google' },
    { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite', provider: 'google' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'google' },
    { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', provider: 'google' },
    { id: 'gemini-2.5-flash-native-audio-dialog', name: 'Gemini 2.5 Flash Native Audio Dialog', provider: 'google' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'google' },
  ];

  const handleSave = () => {
    setAiConfig(tempConfig);
    // 添加保存成功的反馈
    showToast('✅ 设置已保存！AI 配置已更新');
    // 自动刷新页面以确保所有组件使用新的配置
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleTestConnection = async () => {
    if (!tempConfig.apiKey) {
      alert('请先输入 API Key');
      return;
    }
    
    try {
      const testPrompt = "请回复'连接成功'来测试API连接。";
      const response = await callGemini(testPrompt, tempConfig);
      if (response.includes('连接成功') || response.includes('success')) {
        alert('API 连接测试成功！');
      } else {
        alert('API 连接测试成功！响应：' + response.substring(0, 50) + '...');
      }
    } catch (error) {
      alert('API 连接测试失败：' + error.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* API Key 状态提示 */}
      {!tempConfig.apiKey && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-amber-600 mt-0.5">⚠️</div>
            <div>
              <h3 className="text-sm font-bold text-amber-800 mb-1">需要配置 API Key</h3>
              <p className="text-sm text-amber-700">
                请在下方输入您的 Google AI API Key 以启用 AI 功能。未配置 API Key 时，AI 问答功能将无法使用。
              </p>
            </div>
          </div>
        </div>
      )}

      {tempConfig.apiKey && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-green-600 mt-0.5">✅</div>
            <div>
              <h3 className="text-sm font-bold text-green-800 mb-1">API Key 已配置</h3>
              <p className="text-sm text-green-700">
                AI 功能已启用，您可以正常使用 AI 问答功能。
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-teal-600" />
          AI 设置
        </h2>

        <div className="space-y-6">
          {/* API Key 设置 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={tempConfig.apiKey}
                onChange={(e) => setTempConfig({...tempConfig, apiKey: e.target.value})}
                placeholder="输入您的 Google AI API Key"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              从 <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Google AI Studio</a> 获取 API Key
            </p>
          </div>

          {/* 模型选择 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              AI 模型
            </label>
            <select
              value={tempConfig.model}
              onChange={(e) => setTempConfig({...tempConfig, model: e.target.value})}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            >
              {models.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={handleTestConnection}
              className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
            >
              测试连接
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors"
            >
              保存设置
            </button>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-3">使用说明</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• API Key 只会保存在您的浏览器本地，不会上传到服务器</li>
          <li>• 建议使用 Gemini 2.5 Flash 模型，速度快且功能强大</li>
          <li>• 测试连接功能可以验证您的 API Key 是否正确配置</li>
          <li>• 更换模型或 API Key 后需要刷新页面才能生效</li>
        </ul>
      </div>
    </div>
  );
};

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState(null); // 核心修复：只存 ID
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
  
  const useFavicon = () => {
    useEffect(() => {
      const link = document.createElement('link');
      link.rel = 'icon';
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#0d9488"/><text x="50" y="65" font-family="Arial" font-size="50" fill="white" text-anchor="middle" font-weight="bold">RS</text></svg>`;
      link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
      document.head.appendChild(link);
      return () => document.head.removeChild(link);
    }, []);
  };
  useFavicon();

  const [coursesData, setCoursesData] = useState(() => {
    try {
      const saved = localStorage.getItem('aps_courses_v8'); // 升级 v8 清除旧缓存
      return saved ? JSON.parse(saved) : COURSE_DATA;
    } catch {
      return COURSE_DATA;
    }
  });

  useEffect(() => {
    localStorage.setItem('aps_courses_v8', JSON.stringify(coursesData));
  }, [coursesData]);

  // 从 Firestore 加载当前用户的学习笔记并合并到课程数据中
  useEffect(() => {
    const loadNotesFromFirestore = async () => {
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

        setCoursesData(prev =>
          prev.map(cat => ({
            ...cat,
            courses: cat.courses.map(course => {
              const notesForCourse = remoteNotes.filter(
                n => n.courseId === course.id
              );
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

              // 只使用 Firestore 的数据，不合并现有的本地数据
              return {
                ...course,
                notes: formatted,
              };
            }),
          }))
        );
      } catch (e) {
        console.error('加载 Firestore 笔记失败:', e);
      }
    };

    loadNotesFromFirestore();
  }, []);

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
              return { ...c, notes: [newNote, ...existingNotes] };
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
            return { ...c, notes: (c.notes || []).filter(n => n.id !== noteId) };
          }
          return c;
        }),
      }))
    );
    showToast('笔记已删除');
  };

  const renderContent = () => {
    switch(tab) {
      case 'dashboard': return <Dashboard setActiveTab={setTab} />;
      case 'courses': return <CourseList courses={coursesData} setSelectedCourse={c => setSelectedCourseId(c.id)} />;
      case 'interview': return <InterviewSim />;
      case 'settings': return <Settings aiConfig={aiConfig} setAiConfig={setAiConfig} showToast={showToast} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
      {toast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 z-[100] animate-in fade-in slide-in-from-top-4 backdrop-blur-sm">
          <CheckCircle className="w-5 h-5 text-teal-400" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

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
          onClose={() => setSelectedCourseId(null)} 
          onSaveNote={saveNote}
          onDeleteNote={deleteNote}
          aiConfig={aiConfig}
          setTab={setTab}
        />
      )}
    </div>
  );
}