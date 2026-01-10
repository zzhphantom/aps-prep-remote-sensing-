import { collection, doc, writeBatch, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { COURSE_DATA, QUOTES } from '../data';

export const migrateDataToFirestore = async () => {
    try {
        const batch = writeBatch(db);
        let operationCount = 0;
        const logs = [];

        const log = (msg) => {
            console.log(msg);
            logs.push(msg);
        };

        log('🚀 开始迁移数据...');

        // 1. 迁移 Quotes (Config)
        const quotesRef = doc(db, 'config', 'quotes');
        batch.set(quotesRef, {
            items: QUOTES,
            updatedAt: new Date()
        });
        operationCount++;
        log(`📝而在计划迁移 ${QUOTES.length} 条名言...`);

        // 2. 迁移 Courses
        // 为了保持结构，我们将每个 Category 作为一个文档，或者把所有数据作为一个大文档？
        // 考虑到数据量不大（几百KB），且需要一次性加载，将其按 Category 存储是比较好的平衡。
        // Collection: 'courses' -> Document ID: Category Name (or derived ID)

        for (const cat of COURSE_DATA) {
            // 使用 category 名称作为 ID (去除非法字符)
            const catId = cat.category.split('(')[0].trim().replace(/\s+/g, '_').toLowerCase();
            const catRef = doc(db, 'courses', catId);

            batch.set(catRef, {
                category: cat.category,
                courses: cat.courses,
                updatedAt: new Date(),
                order: COURSE_DATA.indexOf(cat) // 保持排序
            });
            operationCount++;
            log(`📚 计划迁移分类: ${cat.category} (${cat.courses.length} 门课)`);
        }

        // 3. 提交
        log(`💾 正在提交 ${operationCount} 个批量操作...`);
        await batch.commit();

        log('✅ 数据迁移成功！');
        return { success: true, logs };
    } catch (error) {
        console.error('Migration failed:', error);
        return { success: false, error: error.message };
    }
};
