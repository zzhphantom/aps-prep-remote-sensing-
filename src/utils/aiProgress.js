import callGemini from './gemini';

export const calculateCourseProgress = async (courseName, courseGoals, notes, currentProgress, aiConfig) => {
    if (!notes || notes.length === 0) return 0;

    // 拼接所有笔记内容
    const notesContent = notes.map(n => `Q: ${n.question}\nA: ${n.answer}`).join('\n\n');

    const prompt = `
    Role: Academic Evaluator
    Task: Estimate the student's mastery percentage (0-100) for the course "${courseName}".
    
    Course Goals:
    ${courseGoals}

    Student's Notes (Evidence of Learning):
    ${notesContent}

    Rules:
    1. Analyze how much of the course goals are covered by the notes.
    2. Be strict but fair. 100% means they have covered ALL specific goals comprehensively.
    3. Return ONLY an integer number (0-100). Do not output anything else.
    `;

    try {
        const response = await callGemini(prompt, aiConfig);
        const aiScore = parseInt(response.match(/\d+/)?.[0] || "0", 10);

        // 返回原始评分，由调用方决定是否允许下降
        return aiScore;
    } catch (error) {
        console.error("AI Progress Calculation Failed:", error);
        return currentProgress || 0;
    }
};
