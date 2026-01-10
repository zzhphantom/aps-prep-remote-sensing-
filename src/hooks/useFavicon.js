import { useEffect } from 'react';

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

export default useFavicon;
