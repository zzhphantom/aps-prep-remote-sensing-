import React, { useState } from 'react';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import callGemini from '../utils/gemini';

const Settings = ({ aiConfig, setAiConfig, showToast }) => {
    const [tempConfig, setTempConfig] = useState(aiConfig);
    const [showApiKey, setShowApiKey] = useState(false);

    const models = [
        { id: 'gemini-3.0-flash', name: 'Gemini 3.0 Flash (Experimental)', provider: 'google' },
        { id: 'gemini-2.5-flash-preview-09-2025', name: 'Gemini 2.5 Flash (最新)', provider: 'google' },
        { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite', provider: 'google' },
        { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'google' },
        { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', provider: 'google' },
        { id: 'gemini-2.5-flash-native-audio-dialog', name: 'Gemini 2.5 Flash Native Audio Dialog', provider: 'google' },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google' },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google' },
        { id: 'gemini-pro', name: 'Gemini Pro', provider: 'google' },
    ];

    const handleSave = () => {
        setAiConfig(tempConfig);
        // 添加保存成功的反馈
        showToast('✅ 设置已保存！AI 配置已更新');
        // 自动刷新页面以确保所有组件使用新的配置
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    };

    const handleTestConnection = async () => {
        if (!tempConfig.apiKey) {
            alert('请先输入 API Key');
            return;
        }

        try {
            const testPrompt = "请回复'连接成功'来测试API连接。";
            const response = await callGemini(testPrompt, tempConfig);
            if (response.includes('连接成功') || response.includes('success')) {
                alert('API 连接测试成功！');
            } else {
                alert('API 连接测试成功！响应：' + response.substring(0, 50) + '...');
            }
        } catch (error) {
            alert('API 连接测试失败：' + error.message);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* API Key 状态提示 */}
            {!tempConfig.apiKey && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 text-amber-600 mt-0.5">⚠️</div>
                        <div>
                            <h3 className="text-sm font-bold text-amber-800 mb-1">需要配置 API Key</h3>
                            <p className="text-sm text-amber-700">
                                请在下方输入您的 Google AI API Key 以启用 AI 功能。未配置 API Key 时，AI 问答功能将无法使用。
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {tempConfig.apiKey && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 text-green-600 mt-0.5">✅</div>
                        <div>
                            <h3 className="text-sm font-bold text-green-800 mb-1">API Key 已配置</h3>
                            <p className="text-sm text-green-700">
                                AI 功能已启用，您可以正常使用 AI 问答功能。
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-teal-600" />
                    AI 设置
                </h2>

                <div className="space-y-6">
                    {/* API Key 设置 */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            API Key
                        </label>
                        <div className="relative">
                            <input
                                type={showApiKey ? "text" : "password"}
                                value={tempConfig.apiKey}
                                onChange={(e) => setTempConfig({ ...tempConfig, apiKey: e.target.value })}
                                placeholder="输入您的 Google AI API Key"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            />
                            <button
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            从 <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Google AI Studio</a> 获取 API Key
                        </p>
                    </div>

                    {/* 模型选择 */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            AI 模型
                        </label>
                        <select
                            value={tempConfig.model}
                            onChange={(e) => setTempConfig({ ...tempConfig, model: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        >
                            {models.map(model => (
                                <option key={model.id} value={model.id}>
                                    {model.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleTestConnection}
                            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
                        >
                            测试连接
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors"
                        >
                            保存设置
                        </button>
                    </div>
                </div>
            </div>

            {/* 使用说明 */}
            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-3">使用说明</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                    <li>• API Key 只会保存在您的浏览器本地，不会上传到服务器</li>
                    <li>• 建议使用 Gemini 2.5 Flash 模型，速度快且功能强大</li>
                    <li>• 测试连接功能可以验证您的 API Key 是否正确配置</li>
                    <li>• 更换模型或 API Key 后需要刷新页面才能生效</li>
                </ul>
            </div>


        </div>
    );
};

export default Settings;
