import React, { useState } from 'react';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import callGemini from '../utils/gemini';
import { migrateDataToFirestore } from '../utils/migrateData';

const Settings = ({ aiConfig, setAiConfig, showToast, onUpdateAllProgress }) => {
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

    const [migrating, setMigrating] = useState(false);

    const handleMigrateData = async () => {
        if (!window.confirm('确定要将本地数据同步到云端吗？这将覆盖云端现有的课程配置。\\n\\nConfirm to sync local data to cloud? This will overwrite existing course configurations.')) return;

        setMigrating(true);
        try {
            const result = await migrateDataToFirestore();
            if (result.success) {
                showToast('✅ 数据已同步到云端！Data synced to cloud.');
            } else {
                alert('同步失败 Sync failed: ' + result.error);
            }
        } catch (e) {
            console.error(e);
            alert('同步出错 Sync error');
        } finally {
            setMigrating(false);
        }
    };

    const [updatingProgress, setUpdatingProgress] = useState(null); // { current, total }

    const handleUpdateProgressClick = () => {
        setUpdatingProgress({ current: 0, total: 0 });
        onUpdateAllProgress((current, total) => {
            setUpdatingProgress({ current, total });
            if (current === total) {
                setTimeout(() => setUpdatingProgress(null), 2000);
            }
        });
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

            {/* 数据维护 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    🛠️ 数据维护
                </h2>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="text-sm text-slate-600 mb-4">
                        如果你手动修改了笔记或更换了 AI 判断标准，可以使用此功能强制重新评估所有课程的掌握度。
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                            onClick={handleUpdateProgressClick}
                            disabled={updatingProgress !== null}
                            className={`w-full sm:w-auto px-6 py-3 font-bold rounded-xl transition-colors shadow-sm ${updatingProgress !== null ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'}`}
                        >
                            {updatingProgress !== null ? '更新中...' : '🔄 一键更新所有课程进度'}
                        </button>
                        {updatingProgress !== null && updatingProgress.total > 0 && (
                            <div className="flex items-center gap-3 text-sm font-medium text-indigo-700 animate-in fade-in">
                                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${(updatingProgress.current / updatingProgress.total) * 100}%` }}></div>
                                </div>
                                <span>{updatingProgress.current} / {updatingProgress.total}</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-600 mb-4">
                            如果你在代码中添加了新课程，点此同步到云端数据库。
                        </p>
                        <button
                            onClick={handleMigrateData}
                            disabled={migrating}
                            className={`w-full sm:w-auto px-6 py-3 font-bold rounded-xl transition-colors shadow-sm ${migrating ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-slate-600 hover:bg-slate-700 text-white shadow-slate-200'}`}
                        >
                            {migrating ? '同步中 Syncing...' : '☁️ 同步本地数据到云端 (Sync Data)'}
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
