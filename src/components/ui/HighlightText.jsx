import React from 'react';

const HighlightText = ({ text = "", highlight = "" }) => {
    if (!highlight || !highlight.trim()) return text;
    // 使用正则表达式分割，捕获分组以保留分隔符(即匹配的关键词)
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <span>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ?
                    <span key={i} className="bg-yellow-200 text-slate-900 rounded-sm px-0.5 box-decoration-clone">{part}</span> : part
            )}
        </span>
    );
};

export default HighlightText;
