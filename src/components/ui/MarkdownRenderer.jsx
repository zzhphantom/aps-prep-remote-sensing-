import React, { useState, useEffect, useRef } from 'react';

const KATEX_CSS = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
const KATEX_JS = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";

const useKatex = () => {
    const [isLoaded, setIsLoaded] = useState(() => !!window.katex);
    useEffect(() => {
        if (isLoaded) return;
        const link = document.createElement("link");
        link.href = KATEX_CSS; link.rel = "stylesheet";
        document.head.appendChild(link);
        const script = document.createElement("script");
        script.src = KATEX_JS; script.onload = () => setIsLoaded(true);
        document.head.appendChild(script);
    }, [isLoaded]);
    return isLoaded;
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
            } catch { containerRef.current.innerText = tex; }
        } else if (containerRef.current) { containerRef.current.innerText = tex; }
    }, [tex, block, katexLoaded]);
    return <span ref={containerRef} className={block ? "block my-2 text-center overflow-x-auto scrollbar-hide" : "inline-block px-0.5"} />;
};

export const InlineRenderer = ({ text }) => {
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
        if (/^[*-]\s|^\d+\.\s/.test(trimmed)) {
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
                if (block.type === 'heading') return <div key={idx} className={`font-bold text-slate-900 ${block.level === 1 ? 'text-xl border-b pb-2 mt-6' : block.level === 2 ? 'text-lg text-teal-800 mt-5' : 'text-base mt-4'}`}><InlineRenderer text={block.content} /></div>;
                if (block.type === 'cn-heading') return <div key={idx} className="font-bold text-indigo-700 mt-5 mb-2 text-base bg-indigo-50/50 p-2 rounded-lg border-l-4 border-indigo-400"><InlineRenderer text={block.content} /></div>;
                if (block.type === 'hr') return <hr key={idx} className="border-t border-slate-200 my-6" />;
                if (block.type === 'table') {
                    const [h, _s, ...b] = block.lines;
                    const parse = r => (r || "").split('|').map(c => c.trim()).filter(c => c);
                    return <div key={idx} className="my-4 overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white"><table className="w-full text-left text-xs sm:text-sm border-collapse"><thead className="bg-slate-50 text-slate-700 font-bold"><tr>{parse(h).map((c, i) => <th key={i} className="p-3 border-b border-slate-200 whitespace-nowrap"><InlineRenderer text={c} /></th>)}</tr></thead><tbody className="bg-white">{b.map((r, i) => <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">{parse(r).map((c, j) => <td key={j} className="p-3 text-slate-600"><InlineRenderer text={c} /></td>)}</tr>)}</tbody></table></div>;
                }
                if (block.type === 'list') return <div key={idx} className="space-y-1 my-2 pl-1">{block.lines.map((it, i) => <div key={i} className="flex items-start">{/^\d+\.\s/.test(it) ? <span className="mr-2 font-bold text-teal-600 text-xs mt-0.5">{it.match(/^\d+\./)[0]}</span> : <div className="mr-2 mt-2 w-1.5 h-1.5 bg-teal-400 rounded-full flex-shrink-0" />}<div className="flex-1 text-slate-600"><InlineRenderer text={it.replace(/^[*-]\s|^\d+\.\s/, '')} /></div></div>)}</div>;
                if (block.type === 'text') return <div key={idx} className="space-y-2">{block.lines.map((l, i) => <div key={i} className="text-justify"><InlineRenderer text={l} /></div>)}</div>;
                return null;
            })}
        </div>
    );
};

export default MarkdownRenderer;
