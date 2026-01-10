import React, { useState } from 'react';
import { RefreshCw, Languages } from 'lucide-react';
import HighlightText from './HighlightText';

const BiText = ({ cn, en, label, highlightTerm }) => {
    const [lang, setLang] = useState('cn');

    // 判断内容如果是React元素，尝试提取其children文本，或者如果内容本身就是文本则直接处理
    const renderContent = (content) => {
        if (!content) return null;
        if (typeof content === 'string') {
            return <HighlightText text={content} highlight={highlightTerm} />;
        }
        // 如果是简单的React元素且只有一个字符串child，尝试高亮
        if (React.isValidElement(content) && typeof content.props.children === 'string') {
            return React.cloneElement(content, {
                children: <HighlightText text={content.props.children} highlight={highlightTerm} />
            });
        }
        // 对于复杂的嵌套（例如term中的desc_cn包含span），递归或简化处理比较危险，这里简单处理：
        // 如果content本身是JSX对象，我们暂时不深入替换，除非它是简单的容器。
        // 为了安全起见，我们只能对纯文本或简单结构高亮。
        // 如果传入的是已经带有样式的div/p，我们可以尝试替换其内部唯一的文本child。
        return content;
    };

    return (
        <div className="relative group">
            {label && <div className="flex justify-between items-center mb-2"><h4 className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</h4><button onClick={() => setLang(l => l === 'cn' ? 'en' : 'cn')} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-mono text-slate-500 hover:text-teal-600 transition-colors border border-slate-200"><RefreshCw className="w-3 h-3" /><span>{lang === 'cn' ? '中' : 'EN'}</span></button></div>}
            {!label && <button onClick={(e) => { e.stopPropagation(); setLang(l => l === 'cn' ? 'en' : 'cn'); }} className="absolute top-2 right-2 p-1.5 rounded-md bg-white text-slate-400 border border-slate-200 shadow-sm z-10"><Languages className="w-3.5 h-3.5" /></button>}
            <div className={`transition-opacity duration-300 ${!label ? 'pr-9' : ''}`}>{lang === 'cn' ? renderContent(cn) : renderContent(en)}</div>
        </div>
    );
};

export default BiText;
