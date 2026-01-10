import React, { useState } from 'react';
import { RefreshCw, Languages } from 'lucide-react';

const BiText = ({ cn, en, label }) => {
    const [lang, setLang] = useState('cn');
    return (
        <div className="relative group">
            {label && <div className="flex justify-between items-center mb-2"><h4 className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</h4><button onClick={() => setLang(l => l === 'cn' ? 'en' : 'cn')} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-mono text-slate-500 hover:text-teal-600 transition-colors border border-slate-200"><RefreshCw className="w-3 h-3" /><span>{lang === 'cn' ? '中' : 'EN'}</span></button></div>}
            {!label && <button onClick={(e) => { e.stopPropagation(); setLang(l => l === 'cn' ? 'en' : 'cn'); }} className="absolute top-2 right-2 p-1.5 rounded-md bg-white text-slate-400 border border-slate-200 shadow-sm z-10"><Languages className="w-3.5 h-3.5" /></button>}
            <div className={`transition-opacity duration-300 ${!label ? 'pr-9' : ''}`}>{lang === 'cn' ? cn : en}</div>
        </div>
    );
};

export default BiText;
