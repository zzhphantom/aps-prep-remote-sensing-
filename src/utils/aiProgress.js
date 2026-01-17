import callGemini from './gemini';

export const calculateCourseProgress = async (courseName, courseGoals, notes, currentProgress, aiConfig) => {
    if (!notes || notes.length === 0) return 0;

    // 拼接所有笔记内容
    const notesContent = notes.map(n => `Q: ${n.question}\nA: ${n.answer}`).join('\n\n');

    const prompt = `
    Role: Academic Evaluator
    Task: Estimate the student's mastery percentage (0-100) for the course "${courseName}" and provide brief learning suggestions.

    Course Goals:
    ${courseGoals}

    Student's Notes (Evidence of Learning):
    ${notesContent}

    Rules:
    1. Analyze how much of the course goals are covered by the notes.
    2. Be strict but fair. 100% means they have covered ALL specific goals comprehensively.
    3. Return a JSON object with two fields:
       - "score": an integer number (0-100).
       - "suggestion": a brief, actionable suggestion in Chinese (max 30 words) on what specific topics or goals are missing or need more depth to reach 100%. If score is 100, give a congratulatory message in Chinese.
    4. Return ONLY valid JSON.
    `;

    try {
        const response = await callGemini(prompt, aiConfig);

        let aiResult = { score: 0, suggestion: "" };
        try {
            const cleanJson = response.replace(/```json|```/g, '').trim();
            aiResult = JSON.parse(cleanJson);
        } catch (e) {
            // Fallback for non-JSON response (legacy behavior compatible)
            const score = parseInt(response.match(/\d+/)?.[0] || "0", 10);
            aiResult = { score, suggestion: "无法解析建议，请继续复习。" };
        }

        return {
            progress: aiResult.score || 0,
            suggestion: aiResult.suggestion || ""
        };
    } catch (error) {
        console.error("AI Progress Calculation Failed:", error);
        return { progress: currentProgress || 0, suggestion: "" };
    }
};
