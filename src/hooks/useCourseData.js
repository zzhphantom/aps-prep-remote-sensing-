import { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, orderBy, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { COURSE_DATA } from '../data';

// 缓存 Key
const CACHE_KEY = 'aps_course_data_v5';
const CACHE_TIME_KEY = 'aps_course_data_time';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时缓存

export const useCourseData = () => {
    const [data, setData] = useState(COURSE_DATA); // 默认使用本地数据兜底
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 1. 初始化：优先加载缓存，提升首屏速度
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            setData(JSON.parse(cached));
            setLoading(false);
        }

        // 2. 建立实时监听
        console.log('📡 正在建立 Firestore 实时连接...');
        const q = query(collection(db, 'courses'), orderBy('order'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log('🔄 收到 Firestore 数据更新');

            if (snapshot.empty) {
                if (!cached) setLoading(false);
                return;
            }

            const courses = snapshot.docs.map(doc => {
                const d = doc.data();
                return {
                    category: d.category,
                    courses: d.courses,
                    id: doc.id
                };
            });

            setData(courses);
            setLoading(false);

            // 更新缓存
            localStorage.setItem(CACHE_KEY, JSON.stringify(courses));
            localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
        }, (err) => {
            console.error('❌ 实时监听失败:', err);
            // 如果没有缓存且出错，才暴露错误给 UI，否则静默处理
            if (!cached) setError(err);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return { data, loading, error };
};
