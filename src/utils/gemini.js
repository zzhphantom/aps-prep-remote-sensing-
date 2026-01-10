const callGemini = async (prompt, config = {}) => {
    const { model = 'gemini-2.5-flash-preview-09-2025', apiKey: customApiKey } = config;

    if (!customApiKey) {
        return "⚠️ 请先配置 API Key！\n\n请前往「设置」页面添加您的 Google AI API Key：\n1. 访问 https://makersuite.google.com/app/apikey\n2. 创建新的 API Key\n3. 在设置页面输入并保存\n\n配置完成后即可使用 AI 功能。";
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${customApiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "AI 思考超时，请重试。";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "AI 服务暂时不可用，请检查网络设置或 API Key 配置。";
    }
};

export default callGemini;
