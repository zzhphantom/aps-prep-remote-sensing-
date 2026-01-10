import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

const Toast = ({ message, onClose }) => {
  useEffect(() => { const timer = setTimeout(onClose, 2000); return () => clearTimeout(timer); }, [onClose]);
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 z-[100] animate-in fade-in slide-in-from-top-4 backdrop-blur-sm">
      <CheckCircle className="w-5 h-5 text-teal-400" /><span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default Toast;
