import React, { useState } from 'react';
import { Book, Cpu, Layers, CheckCircle, Zap, Target, Languages } from 'lucide-react';

export default function ThesisReview() {
    const [lang, setLang] = useState('cn'); // 'cn' or 'en'

    const content = {
        cn: {
            title: "🎓 毕业论文复习要点",
            subtitle: "基于混合现实平台的街景图像解译",
            desc: "针对 APS 面谈的核心复习资料，涵盖理论基础、算法改进、系统开发及常见问题自测。重点在于展示你对 YOLOv7 轻量化改进和 MR 平台开发的深入理解。",
            basicInfo: {
                title: "一、 论文基本信息 (Basic Information)",
                englishTitleLabel: "English Title:",
                englishTitleValue: "Street View Image Interpretation Based on Mixed Reality Platform",
                goalLabel: "核心目标:",
                goalValue: "在 Meta Quest 3 (MR设备) 上实现高效目标检测。针对移动端算力限制，改进 YOLOv7 进行轻量化。",
                workLabel: "主要工作:",
                workItems: [
                    { label: "算法改进:", text: "用 EfficientNet 替换 YOLOv7 骨干网络 (Backbone)。" },
                    { label: "系统开发:", text: "基于 Unity3D + Meta XR SDK 开发 MR 应用。" },
                    { label: "策略优化:", text: "静态目标用空间锚点，动态目标用实时跟踪。" }
                ]
            },
            theory: {
                title: "二、 核心理论 (APS 必问)",
                cnn: { title: "CNN (卷积神经网络)", text: "核心组件：卷积层(特征提取)、池化层(降维)、全连接层。" },
                yolo: { title: "YOLO (You Only Look Once)", text: "单阶段检测 (One-stage)，将检测视为回归问题。网格划分预测。" },
                efficientnet: { title: "EfficientNet", text: "核心思想：<strong>复合缩放</strong> (平衡深度/宽度/分辨率)。<br/>关键：<strong>MBConv</strong> (深度可分离卷积 + SE注意力)。" }
            },
            algo: {
                title: "三、 算法改进与实现 (Core Innovation)",
                methodTitle: "改进方法",
                originalLabel: "Original",
                originalValue: "YOLOv7 (CSPDarknet53)",
                optimizedLabel: "Optimized",
                optimizedValue: "EfficientNet-B0 Backbone",
                reason: "<strong>Why?</strong> Quest 3 算力有限，CSPDarknet53 参数量过大。EfficientNet 使用 <strong>MBConv</strong> 模块大幅减少计算量。",
                effectTitle: "改进效果 (Data Support)",
                paramsLabel: "Parameters",
                paramsValue: "↓ 80%",
                paramsDetail: "5.22M vs 39.37M",
                mapLabel: "mAP (Accuracy)",
                mapValue: "76.20%",
                mapDetail: "+2% on Cityscapes",
                fpsLabel: "FPS (Speed)",
                fpsValue: "27.3 FPS",
                fpsDetail: "Up from 20.9 FPS"
            },
            system: {
                title: "四、 系统开发与双重检测策略",
                staticLabel: "Static",
                staticTitle: "静态目标 (路灯/标志)",
                staticStrategy: "使用 <strong>空间锚点 (Spatial Anchor)</strong>",
                staticDetail: "检测一次后固定虚拟标识位置。GPU占用仅 <span className=\"font-bold text-green-600\">37.23%</span>。",
                dynamicLabel: "Dynamic",
                dynamicTitle: "动态目标 (行人/车辆)",
                dynamicStrategy: "使用 <strong>实时跟踪 (Real-time)</strong>",
                dynamicDetail: "持续运行检测算法。GPU占用较高 <span className=\"font-bold text-orange-600\">75.65%</span>。"
            },
            qa: {
                title: "APS Quick Check",
                purposeTitle: "PURPOSE",
                purposeText: "Object detection on MR glasses, optimizing YOLOv7 for lightweight.",
                whyTitle: "WHY EFFICIENTNET?",
                whyText: "Compound scaling & depth-wise separable convolutions reduce params heavily.",
                strategyTitle: "STATIC/DYNAMIC STRATEGY?",
                strategyText: "Static = Spatial Anchors (Save GPU).<br/>Dynamic = Real-time Tracking.",
                resultTitle: "RESULT?",
                resultText: "Params -80%, FPS +30%."
            }
        },
        en: {
            title: "🎓 Thesis Review Points",
            subtitle: "Street View Image Interpretation Based on Mixed Reality Platform",
            desc: "Core review materials for APS interview, covering theoretical basis, algorithm optimization, system development, and Q&A. Focus on demonstrating your understanding of YOLOv7 lightweight optimization and MR development.",
            basicInfo: {
                title: "1. Basic Information",
                englishTitleLabel: "Title:",
                englishTitleValue: "Street View Image Interpretation Based on Mixed Reality Platform",
                goalLabel: "Core Goal:",
                goalValue: "Implement efficient object detection on Meta Quest 3. Optimize YOLOv7 for lightweight on mobile hardware.",
                workLabel: "Main Work:",
                workItems: [
                    { label: "Algorithm:", text: "Replaced YOLOv7 backbone with EfficientNet." },
                    { label: "Development:", text: "Developed MR app based on Unity3D + Meta XR SDK." },
                    { label: "Optimization:", text: "Spatial anchors for static objects, real-time tracking for dynamic ones." }
                ]
            },
            theory: {
                title: "2. Theoretical Basis (APS Must-Ask)",
                cnn: { title: "CNN (Convolutional Neural Network)", text: "Core components: Convolutional Layer (Feature Extraction), Pooling Layer (Dim Reduction), Fully Connected Layer." },
                yolo: { title: "YOLO (You Only Look Once)", text: "One-stage detection algorithm. Treats detection as a regression problem using grid division." },
                efficientnet: { title: "EfficientNet", text: "Core Idea: <strong>Compound Scaling</strong> (Balances Depth/Width/Resolution).<br/>Key: <strong>MBConv</strong> (Depth-wise Separable Conv + SE Attention)." }
            },
            algo: {
                title: "3. Algorithm Optimization (Core Innovation)",
                methodTitle: "Methodology",
                originalLabel: "Original",
                originalValue: "YOLOv7 (CSPDarknet53)",
                optimizedLabel: "Optimized",
                optimizedValue: "EfficientNet-B0 Backbone",
                reason: "<strong>Why?</strong> Quest 3 has limited compute. CSPDarknet53 is too heavy. EfficientNet uses <strong>MBConv</strong> to significantly reduce computation.",
                effectTitle: "Results (Data Support)",
                paramsLabel: "Parameters",
                paramsValue: "↓ 80%",
                paramsDetail: "5.22M vs 39.37M",
                mapLabel: "mAP (Accuracy)",
                mapValue: "76.20%",
                mapDetail: "+2% on Cityscapes",
                fpsLabel: "FPS (Speed)",
                fpsValue: "27.3 FPS",
                fpsDetail: "Up from 20.9 FPS"
            },
            system: {
                title: "4. System & Strategies",
                staticLabel: "Static",
                staticTitle: "Static Objects (Lights/Signs)",
                staticStrategy: "Use <strong>Spatial Anchor</strong>",
                staticDetail: "Detect once, lock position. GPU usage only <span className=\"font-bold text-green-600\">37.23%</span>.",
                dynamicLabel: "Dynamic",
                dynamicTitle: "Dynamic Objects (People/Cars)",
                dynamicStrategy: "Use <strong>Real-time Tracking</strong>",
                dynamicDetail: "Continuous detection. High GPU usage <span className=\"font-bold text-orange-600\">75.65%</span>."
            },
            qa: {
                title: "APS Quick Check",
                purposeTitle: "PURPOSE",
                purposeText: "Object detection on MR glasses, optimizing YOLOv7 for lightweight.",
                whyTitle: "WHY EFFICIENTNET?",
                whyText: "Compound scaling & depth-wise separable convolutions reduce params heavily.",
                strategyTitle: "STATIC/DYNAMIC STRATEGY?",
                strategyText: "Static = Spatial Anchors (Save GPU).<br/>Dynamic = Real-time Tracking.",
                resultTitle: "RESULT?",
                resultText: "Params -80%, FPS +30%."
            }
        }
    };

    const t = content[lang];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10 animate-in fade-in duration-500">

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-xl relative">
                <button
                    onClick={() => setLang(l => l === 'cn' ? 'en' : 'cn')}
                    className="absolute top-8 right-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center space-x-2 border border-white/30 cursor-pointer z-10"
                    title="Switch Language / 切换语言"
                >
                    <Languages className="w-4 h-4" />
                    <span>{lang === 'cn' ? 'EN' : ' 中'}</span>
                </button>

                <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
                <h2 className="text-xl opacity-90 font-medium">{t.subtitle}</h2>
                <p className="mt-4 text-indigo-100 max-w-2xl">
                    {t.desc}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Core Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 1. Basic Info */}
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center space-x-3 mb-5 border-b border-slate-100 pb-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Target className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">{t.basicInfo.title}</h3>
                        </div>
                        <ul className="space-y-4 text-slate-700">
                            <li className="flex items-start">
                                <span className="font-bold mr-2 whitespace-nowrap text-slate-900">{t.basicInfo.englishTitleLabel}</span>
                                <span>{t.basicInfo.englishTitleValue}</span>
                            </li>
                            <li className="flex items-start">
                                <span className="font-bold mr-2 whitespace-nowrap text-slate-900">{t.basicInfo.goalLabel}</span>
                                <span>{t.basicInfo.goalValue}</span>
                            </li>
                            <li className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <span className="font-bold block mb-2 text-slate-900">{t.basicInfo.workLabel}</span>
                                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 ml-1">
                                    {t.basicInfo.workItems.map((item, idx) => (
                                        <li key={idx}>
                                            <span className="font-semibold text-indigo-600">{item.label}</span> {item.text}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </section>

                    {/* 3. Algorithm Optimization */}
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center space-x-3 mb-5 border-b border-slate-100 pb-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <Cpu className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">{t.algo.title}</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                                    {t.algo.methodTitle}
                                </h4>
                                <div className="bg-slate-50 p-4 rounded-xl text-sm border border-slate-200">
                                    <div className="grid grid-cols-2 gap-4 mb-2">
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 uppercase">{t.algo.originalLabel}</span>
                                            <div className="font-semibold">{t.algo.originalValue}</div>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 uppercase">{t.algo.optimizedLabel}</span>
                                            <div className="font-semibold text-purple-600">{t.algo.optimizedValue}</div>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 mt-2 pt-2 border-t border-slate-200" dangerouslySetInnerHTML={{ __html: t.algo.reason }}></p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                    {t.algo.effectTitle}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-center">
                                        <div className="text-xs text-green-600 font-bold uppercase mb-1">{t.algo.paramsLabel}</div>
                                        <div className="text-xl font-bold text-green-700">{t.algo.paramsValue}</div>
                                        <div className="text-xs text-green-600 opacity-80">{t.algo.paramsDetail}</div>
                                    </div>
                                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-center">
                                        <div className="text-xs text-blue-600 font-bold uppercase mb-1">{t.algo.mapLabel}</div>
                                        <div className="text-xl font-bold text-blue-700">{t.algo.mapValue}</div>
                                        <div className="text-xs text-blue-600 opacity-80">{t.algo.mapDetail}</div>
                                    </div>
                                    <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg text-center">
                                        <div className="text-xs text-orange-600 font-bold uppercase mb-1">{t.algo.fpsLabel}</div>
                                        <div className="text-xl font-bold text-orange-700">{t.algo.fpsValue}</div>
                                        <div className="text-xs text-orange-600 opacity-80">{t.algo.fpsDetail}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. System & Strategy */}
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center space-x-3 mb-5 border-b border-slate-100 pb-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Layers className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">{t.system.title}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition-colors">
                                <div className="flex items-center mb-2">
                                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded mr-2">{t.system.staticLabel}</span>
                                    <span className="font-bold text-slate-800">{t.system.staticTitle}</span>
                                </div>
                                <p className="text-sm text-slate-600 mb-2" dangerouslySetInnerHTML={{ __html: t.system.staticStrategy }}></p>
                                <div className="text-xs bg-slate-50 p-2 rounded text-slate-500" dangerouslySetInnerHTML={{ __html: t.system.staticDetail }}></div>
                            </div>

                            <div className="border border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition-colors">
                                <div className="flex items-center mb-2">
                                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded mr-2">{t.system.dynamicLabel}</span>
                                    <span className="font-bold text-slate-800">{t.system.dynamicTitle}</span>
                                </div>
                                <p className="text-sm text-slate-600 mb-2" dangerouslySetInnerHTML={{ __html: t.system.dynamicStrategy }}></p>
                                <div className="text-xs bg-slate-50 p-2 rounded text-slate-500" dangerouslySetInnerHTML={{ __html: t.system.dynamicDetail }}></div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Right Column: Theory & FAQ */}
                <div className="space-y-8">

                    {/* 2. Theoretical Basis */}
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center space-x-3 mb-5 border-b border-slate-100 pb-3">
                            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                                <Book className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">{t.theory.title}</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="text-sm">
                                <h4 className="font-bold text-slate-800 mb-1">{t.theory.cnn.title}</h4>
                                <p className="text-slate-600">{t.theory.cnn.text}</p>
                            </div>
                            <div className="text-sm">
                                <h4 className="font-bold text-slate-800 mb-1">{t.theory.yolo.title}</h4>
                                <p className="text-slate-600">{t.theory.yolo.text}</p>
                            </div>
                            <div className="text-sm">
                                <h4 className="font-bold text-slate-800 mb-1">{t.theory.efficientnet.title}</h4>
                                <p className="text-slate-600" dangerouslySetInnerHTML={{ __html: t.theory.efficientnet.text }}></p>
                            </div>
                        </div>
                    </section>

                    {/* 6. Interview Q&A */}
                    <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-lg text-white">
                        <div className="flex items-center space-x-3 mb-5 border-b border-slate-700 pb-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Zap className="w-5 h-5 text-yellow-400" />
                            </div>
                            <h3 className="text-lg font-bold">{t.qa.title}</h3>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="space-y-1">
                                <p className="text-slate-400 font-medium text-xs uppercase">{t.qa.purposeTitle}</p>
                                <p className="font-medium text-white">{t.qa.purposeText}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-slate-400 font-medium text-xs uppercase">{t.qa.whyTitle}</p>
                                <p className="text-slate-200">{t.qa.whyText}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-slate-400 font-medium text-xs uppercase">{t.qa.strategyTitle}</p>
                                <p className="text-slate-200" dangerouslySetInnerHTML={{ __html: t.qa.strategyText }}></p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-slate-400 font-medium text-xs uppercase">{t.qa.resultTitle}</p>
                                <p className="text-green-400 font-bold">{t.qa.resultText}</p>
                            </div>
                        </div>
                    </section>

                </div>

            </div>
        </div>
    );
}
