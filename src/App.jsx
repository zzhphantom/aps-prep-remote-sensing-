import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, CheckCircle, Brain, Target, Calendar, ChevronDown, ChevronUp,
  ChevronRight, Award, RefreshCw, Layers, Sparkles, X, 
  Smartphone, GraduationCap, FileText, Globe, Network, 
  Languages, Zap, Activity, Plus, MessageSquare, StickyNote, 
  Save, Trash2, ChevronLeft, CalendarDays, Check, Maximize2
} from 'lucide-react';

import {QUOTES , COURSE_DATA} from './data';

// ============================================================================
// 1. 全局配置与 API
// ============================================================================
const apiKey = "AIzaSyCADS6fXhqZ_kO_C1TRcx23dijzmbzmPVE"; // 🔴 请在此处填入您的 API Key

const KATEX_CSS = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
const KATEX_JS = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";

// const QUOTES = [
//   "遥感不仅仅是看图片，它是物理世界在数字空间的投影。",
//   "APS考察的不是记忆力，而是你作为工程师的逻辑思维。",
//   "从麦克斯韦方程组到卫星图像，中间贯穿着几何与物理的美。",
//   "宁可慢一点，也要把基本概念彻底吃透。",
//   "误差理论告诉我们：真值不可求，但我们可以无限逼近。",
// ];

// ============================================================================
// 2. 核心数据 (14门 - 完整无删减版)
// ============================================================================
// const COURSE_DATA = [
//   {
//     category: "理论基础 (Fundamentals)",
//     courses: [
//       {
//         id: "c1",
//         name: "Principles and Applications of Remote Sensing (遥感原理与应用)",
//         summary: { cn: "遥感科学的总纲：建立电磁波与地表交互的物理模型及成像基础。", en: "The overarching framework establishing physical models of EM wave-surface interactions." },
//         goals: { cn: "精通电磁波谱、大气传输方程、地物光谱特征及四大分辨率权衡。", en: "Master EM spectrum, RTE, Spectral signatures, 4 Resolutions." },
//         logicTree: {
//           label: { cn: "遥感物理链路", en: "Physical Chain" },
//           children: [
//             {
//               label: { cn: "1. 辐射源", en: "1. Source" },
//               children: [
//                 { label: { cn: "黑体辐射", en: "Blackbody" }, desc: { cn: "普朗克定律描述能量分布；维恩位移定律决定峰值波长。", en: "Planck's Law & Wien's Law." }, heavy: true },
//                 { label: { cn: "大气传输", en: "Atmosphere" }, desc: { cn: "大气窗口：可见光、近红外、热红外、微波。", en: "Windows: VIS, NIR, TIR, Microwave." } }
//               ]
//             },
//             {
//               label: { cn: "2. 地物光谱响应", en: "2. Spectral Response" },
//               children: [
//                 { label: { cn: "植被", en: "Vegetation" }, desc: { cn: "可见光吸收(叶绿素) + 近红外高反(细胞结构) = 红边效应。", en: "Red Edge Effect." }, heavy: true },
//                 { label: { cn: "水体", en: "Water" }, desc: { cn: "近红外/短波红外强吸收；悬浮物增加反射。", en: "NIR/SWIR absorption." } }
//               ]
//             },
//             {
//               label: { cn: "3. 传感器特性", en: "3. Sensor Traits" },
//               children: [
//                 { label: { cn: "四大分辨率", en: "Resolutions" }, desc: { cn: "空间、光谱、辐射、时间。", en: "Spatial, Spectral, Radiometric, Temporal." }, heavy: true }
//               ]
//             }
//           ]
//         },
//         terms: [
//           { cn: "大气窗口", en: "Atmospheric Window", desc_cn: "电磁波通过大气层时透过率较高的波段。", desc_en: "Spectral bands with high transmittance." },
//           { cn: "光谱特征", en: "Spectral Signature", desc_cn: "不同地物在不同波段反射率的独特组合。", desc_en: "Unique variation of reflectance with wavelength." },
//           { cn: "红边", en: "Red Edge", desc_cn: "植被在0.7μm附近反射率急剧上升的特征。", desc_en: "Sharp rise in reflectance near 0.7μm." }
//         ],
//         notes: [] 
//       },
//       {
//         id: "c2",
//         name: "Microwave Remote Sensing (微波遥感)",
//         summary: { cn: "利用微波波段进行全天时、全天候的主动观测，侧重SAR原理。", en: "All-weather active microwave sensing, focusing on SAR principles." },
//         goals: { cn: "理解雷达方程、SAR成像几何、多普勒原理、极化分解及InSAR干涉测量。", en: "Understand Radar Equation, SAR geometry, Doppler, PolSAR, and InSAR." },
//         logicTree: {
//           label: { cn: "SAR 系统", en: "SAR System" },
//           children: [
//             { label: { cn: "成像机理", en: "Imaging" }, desc: { cn: "测距(脉冲压缩)与方位(多普勒合成)。", en: "Ranging & Azimuth synthesis." }, heavy: true },
//             { label: { cn: "几何畸变", en: "Distortions" }, desc: { cn: "透视收缩、叠掩、阴影。", en: "Foreshortening, Layover, Shadow." } },
//             { label: { cn: "InSAR", en: "InSAR" }, desc: { cn: "利用相位差提取高程或形变。", en: "Phase diff for DEM/Deformation." } }
//           ]
//         },
//         terms: [
//           { cn: "后向散射系数", en: "Backscattering Coeff", desc_cn: "单位面积目标的散射强度(dB)。", desc_en: "Normalized radar cross-section." },
//           { cn: "相位解缠", en: "Phase Unwrapping", desc_cn: "将周期性相位恢复为连续绝对相位。", desc_en: "Resolving 2pi ambiguities." }
//         ],
//         notes: []
//       },
//       {
//         id: "c3",
//         name: "Thermal Infrared Remote Sensing (热红外遥感)",
//         summary: { cn: "基于热辐射理论反演地表温度(LST)与发射率。", en: "Retrieving LST and emissivity based on thermal radiation theory." },
//         goals: { cn: "掌握普朗克定律、基尔霍夫定律、分裂窗算法及城市热岛应用。", en: "Master Planck's Law, Kirchhoff's Law, Split-Window, UHI." },
//         logicTree: {
//           label: { cn: "LST 反演体系", en: "LST Retrieval Sys" },
//           children: [
//             { label: { cn: "物理定律", en: "Physics" }, desc: { cn: "普朗克定律与基尔霍夫定律。", en: "Planck & Kirchhoff Laws." }, heavy: true },
//             { label: { cn: "反演算法", en: "Algorithms" }, desc: { cn: "单通道、分裂窗(SW)、TES算法。", en: "Single-Channel, Split-Window, TES." } },
//             { label: { cn: "应用", en: "Apps" }, desc: { cn: "城市热岛(UHI)与土壤水分。", en: "UHI & Soil Moisture." } }
//           ]
//         },
//         terms: [
//           { cn: "热惯量", en: "Thermal Inertia", desc_cn: "物质阻碍温度变化的能力。", desc_en: "Resistance to temperature change." },
//           { cn: "发射率", en: "Emissivity", desc_cn: "物体辐射能力与黑体之比。", desc_en: "Ratio of radiation to blackbody." }
//         ],
//         notes: []
//       },
//       {
//         id: "c4",
//         name: "Remote Sensing of Natural Disasters (自然灾害遥感)",
//         summary: { cn: "利用多源遥感进行灾害预警、评估与应急响应。", en: "Disaster warning, assessment, and response using RS." },
//         goals: { cn: "掌握洪水(SAR)、地震(InSAR)、火灾(MIR)的监测机理。", en: "Mechanisms for Flood, Earthquake, and Fire monitoring." },
//         logicTree: {
//             label: { cn: "灾害响应", en: "Disaster Chain" },
//             children: [
//                 { label: { cn: "洪涝", en: "Flood" }, desc: { cn: "SAR镜面反射(暗)与水体指数。", en: "SAR specular reflection." } },
//                 { label: { cn: "地质", en: "Geo-Hazard" }, desc: { cn: "InSAR监测形变。", en: "InSAR deformation." }, heavy: true },
//                 { label: { cn: "火灾", en: "Fire" }, desc: { cn: "中红外对高温敏感; NBR指数。", en: "MIR sensitivity; NBR index." } }
//             ]
//         },
//         terms: [
//             { cn: "变化检测", en: "Change Detection", desc_cn: "提取不同时相的变化区域。", desc_en: "Identifying differences over time." },
//             { cn: "NDWI", en: "NDWI", desc_cn: "归一化差异水体指数。", desc_en: "Normalized Difference Water Index." }
//         ],
//         notes: []
//       },
//       {
//         id: "c5",
//         name: "Low Altitude UAV Remote Sensing (低空无人机遥感)",
//         summary: { cn: "利用无人机平台获取超高分辨率数据的技术。", en: "High-res data acquisition using UAV." },
//         goals: { cn: "掌握航线规划、SfM建模原理及正射影像生产。", en: "Flight planning, SfM, DOM." },
//         logicTree: {
//             label: { cn: "UAV 作业", en: "UAV Workflow" },
//             children: [
//                 { label: { cn: "航测", en: "Planning" }, desc: { cn: "重叠度与GSD设计。", en: "Overlap & GSD." } },
//                 { label: { cn: "SfM", en: "SfM" }, desc: { cn: "运动恢复结构算法(特征匹配->平差)。", en: "Structure from Motion." }, heavy: true },
//                 { label: { cn: "产出", en: "Products" }, desc: { cn: "点云 -> DSM/DOM。", en: "Point Cloud -> DSM/DOM." } }
//             ]
//         },
//         terms: [
//             { cn: "GSD", en: "Ground Sample Distance", desc_cn: "地面采样距离（像素大小）。", desc_en: "Ground pixel size." },
//             { cn: "正射影像", en: "DOM", desc_cn: "经几何纠正的影像。", desc_en: "Digital Orthophoto Map." }
//         ],
//         notes: []
//       },
//       {
//         id: "c6",
//         name: "Error Theory and Surveying Adjustment B (误差理论与测量平差)",
//         summary: { cn: "处理观测数据误差，求取最优解的数学方法。", en: "Math methods for error handling." },
//         goals: { cn: "掌握误差传播定律及最小二乘法原理。", en: "Error Propagation & Least Squares." },
//         logicTree: {
//             label: { cn: "平差", en: "Adjustment" },
//             children: [
//                 { label: { cn: "误差", en: "Errors" }, desc: { cn: "系统、偶然、粗差。", en: "Systematic, Random, Gross." } },
//                 { label: { cn: "最小二乘", en: "Least Squares" }, desc: { cn: "VTPV最小化 (残差平方和最小)。", en: "Minimizing VTPV." }, heavy: true },
//                 { label: { cn: "精度", en: "Accuracy" }, desc: { cn: "中误差与误差椭圆。", en: "RMSE & Error Ellipse." } }
//             ]
//         },
//         terms: [
//             { cn: "中误差", en: "RMSE", desc_cn: "衡量精度的标准。", desc_en: "Standard error." },
//             { cn: "多余观测", en: "Redundancy", desc_cn: "平差的前提(观测数>未知数)。", desc_en: "More observations than unknowns." }
//         ],
//         notes: []
//       },
//       {
//         id: "c7",
//         name: "Digital Image Processing (数字图像处理)",
//         summary: { cn: "遥感影像的数学运算与自动化分析算法。", en: "Math operations on imagery." },
//         goals: { cn: "掌握增强、滤波、PCA变换及分类。", en: "Enhancement, Filtering, PCA, Classification." },
//         logicTree: {
//             label: { cn: "DIP", en: "DIP" },
//             children: [
//                 { label: { cn: "增强", en: "Enhancement" }, desc: { cn: "直方图均衡、线性拉伸。", en: "Hist Eq, Stretching." } },
//                 { label: { cn: "变换", en: "Transform" }, desc: { cn: "PCA(去相关), 缨帽变换。", en: "PCA, Tasseled Cap." } },
//                 { label: { cn: "分类", en: "Classification" }, desc: { cn: "监督(MLC) vs 非监督(K-means)。", en: "Supervised vs Unsupervised." }, heavy: true }
//             ]
//         },
//         terms: [
//             { cn: "混淆矩阵", en: "Confusion Matrix", desc_cn: "分类精度评价。", desc_en: "Accuracy assessment." },
//             { cn: "直方图", en: "Histogram", desc_cn: "像素频率分布。", desc_en: "Pixel frequency distribution." }
//         ],
//         notes: []
//       },
//       {
//         id: "c8",
//         name: "Remote Sensing Image Interpretation (遥感图像解译)",
//         summary: { cn: "从影像中提取语义信息的理论与方法。", en: "Extracting semantic info." },
//         goals: { cn: "掌握目视解译八大要素及地学分析逻辑。", en: "Visual keys & Geo-analysis." },
//         logicTree: {
//             label: { cn: "解译", en: "Interpretation" },
//             children: [
//                 { label: { cn: "标志", en: "Keys" }, desc: { cn: "色调、形状、纹理、阴影等。", en: "Tone, Shape, Texture." }, heavy: true },
//                 { label: { cn: "分析", en: "Analysis" }, desc: { cn: "水系格局、地貌形态判读。", en: "Drainage, Landform." } },
//                 { label: { cn: "方法", en: "Methods" }, desc: { cn: "目视 vs 计算机(OBIA/CNN)。", en: "Visual vs Computer(OBIA/CNN)." } }
//             ]
//         },
//         terms: [
//             { cn: "纹理", en: "Texture", desc_cn: "色调变化频率。", desc_en: "Tonal variation." },
//             { cn: "二分检索表", en: "Dichotomous Key", desc_cn: "逐步分类工具。", desc_en: "Step-by-step ID tool." }
//         ],
//         notes: []
//       },
//       {
//         id: "c9",
//         name: "Remote Sensing Application Model (遥感应用模型)",
//         summary: { cn: "将遥感数据转化为地学参数的模型(NPP/ET)。", en: "Models converting RS data to parameters." },
//         goals: { cn: "理解经验模型、物理模型及数据同化。", en: "Empirical/Physical models." },
//         logicTree: {
//             label: { cn: "建模", en: "Modeling" },
//             children: [
//                 { label: { cn: "模型类型", en: "Types" }, desc: { cn: "统计(回归) vs 物理(RTE)。", en: "Statistical vs Physical." }, heavy: true },
//                 { label: { cn: "典型模型", en: "Examples" }, desc: { cn: "NPP(CASA), 蒸散发(SEBAL)。", en: "NPP, ET." } },
//                 { label: { cn: "同化", en: "Assimilation" }, desc: { cn: "融合模型与观测(Kalman)。", en: "Merging model & obs." } }
//             ]
//         },
//         terms: [
//             { cn: "反演", en: "Inversion", desc_cn: "信号推导参数。", desc_en: "Deriving parameters." },
//             { cn: "数据同化", en: "Data Assimilation", desc_cn: "融合模拟与观测。", desc_en: "Merging model & observation." }
//         ],
//         notes: []
//       },
//       {
//         id: "c10",
//         name: "Lecture on Frontiers of RS Knowledge",
//         summary: { cn: "探索遥感前沿：高光谱、LiDAR、AI。", en: "Frontiers: Hyperspectral, LiDAR, AI." },
//         goals: { cn: "了解高光谱解混、LiDAR点云、深度学习。", en: "Hyperspectral, LiDAR, DL." },
//         logicTree: {
//             label: { cn: "前沿", en: "Frontiers" },
//             children: [
//                 { label: { cn: "高光谱", en: "Hyperspectral" }, desc: { cn: "图谱合一，维数灾难。", en: "Imaging spectroscopy." }, heavy: true },
//                 { label: { cn: "LiDAR", en: "LiDAR" }, desc: { cn: "三维点云，波形分析。", en: "3D point cloud." } },
//                 { label: { cn: "AI", en: "AI" }, desc: { cn: "深度学习(CNN/Transformer)。", en: "Deep Learning." } }
//             ]
//         },
//         terms: [
//             { cn: "端元", en: "Endmember", desc_cn: "纯净像元光谱。", desc_en: "Pure pixel spectrum." },
//             { cn: "混合像元", en: "Mixed Pixel", desc_cn: "像元含多种地物。", desc_en: "Pixel with multiple classes." }
//         ],
//         notes: []
//       },
//       {
//         id: "c11",
//         name: "Comprehensive Internship in RS Applications (遥感应用综合实习)",
//         summary: { cn: "综合应用全流程实践。", en: "Full workflow practice." },
//         goals: { cn: "选题、处理、分析、报告。", en: "Topic, Process, Analysis, Report." },
//         logicTree: {
//             label: { cn: "流程", en: "Workflow" },
//             children: [
//                 { label: { cn: "准备", en: "Prep" }, desc: { cn: "选题与数据获取。", en: "Topic & Data." } },
//                 { label: { cn: "处理", en: "Process" }, desc: { cn: "预处理(校正)与提取(分类/指数)。", en: "Correction & Extraction." }, heavy: true },
//                 { label: { cn: "产出", en: "Output" }, desc: { cn: "精度验证与制图。", en: "Validation & Mapping." } }
//             ]
//         },
//         terms: [
//             { cn: "专题图", en: "Thematic Map", desc_cn: "特定主题地图。", desc_en: "Theme map." },
//             { cn: "转移矩阵", en: "Transition Matrix", desc_cn: "量化变化面积。", desc_en: "Quantifying change." }
//         ],
//         notes: []
//       },
//       {
//         id: "c12",
//         name: "Practice of RS Principles and Applications (遥感原理与应用实验)",
//         summary: { cn: "软件操作实验(ENVI/ArcGIS)。", en: "Software Labs (ENVI)." },
//         goals: { cn: "几何校正、监督分类操作。", en: "Geo-correction, Classification." },
//         logicTree: {
//             label: { cn: "实验", en: "Labs" },
//             children: [
//                 { label: { cn: "基础", en: "Basic" }, desc: { cn: "波段组合显示。", en: "Band combination." } },
//                 { label: { cn: "校正", en: "Correction" }, desc: { cn: "GCP选取与重采样。", en: "GCP selection." }, heavy: true },
//                 { label: { cn: "分类", en: "Classify" }, desc: { cn: "ROI建立与最大似然法。", en: "ROI & MLC." } }
//             ]
//         },
//         terms: [
//             { cn: "GCP", en: "GCP", desc_cn: "地面控制点。", desc_en: "Ground Control Point." },
//             { cn: "ROI", en: "ROI", desc_cn: "感兴趣区。", desc_en: "Region of Interest." }
//         ],
//         notes: []
//       },
//       {
//         id: "c13",
//         name: "Internship in RS Image Processing (遥感图像处理综合实习)",
//         summary: { cn: "专注编程实现(Python/GDAL)。", en: "Coding (Python/GDAL)." },
//         goals: { cn: "GDAL读写、算法复现。", en: "GDAL I/O, Algo coding." },
//         logicTree: {
//             label: { cn: "编程", en: "Coding" },
//             children: [
//                 { label: { cn: "环境", en: "Env" }, desc: { cn: "Python, GDAL, Numpy。", en: "Libs setup." } },
//                 { label: { cn: "I/O", en: "I/O" }, desc: { cn: "读写GeoTIFF。", en: "Read/Write TIFF." } },
//                 { label: { cn: "算法", en: "Algo" }, desc: { cn: "NDVI计算、K-means。", en: "NDVI, K-means." }, heavy: true }
//             ]
//         },
//         terms: [
//             { cn: "GDAL", en: "GDAL", desc_cn: "栅格数据处理库。", desc_en: "Raster library." },
//             { cn: "Numpy", en: "Numpy", desc_cn: "科学计算库。", desc_en: "Scientific computing lib." }
//         ],
//         notes: []
//       },
//       {
//         id: "c14",
//         name: "RS Application Model Internship (遥感应用模型实习)",
//         summary: { cn: "定量建模实践(估产/水质)。", en: "Quantitative modeling." },
//         goals: { cn: "回归分析、模型构建。", en: "Regression, Modeling." },
//         logicTree: {
//             label: { cn: "建模", en: "Model Flow" },
//             children: [
//                 { label: { cn: "匹配", en: "Match" }, desc: { cn: "影像与地面时空匹配。", en: "Space-time matching." }, heavy: true },
//                 { label: { cn: "回归", en: "Regress" }, desc: { cn: "特征筛选 -> 方程。", en: "Feature sel -> Equation." } },
//                 { label: { cn: "验证", en: "Valid" }, desc: { cn: "R²与RMSE评价。", en: "R2 & RMSE." } }
//             ]
//         },
//         terms: [
//             { cn: "拟合优度", en: "R2", desc_cn: "模型解释程度。", desc_en: "Model fit." },
//             { cn: "留一法", en: "LOOCV", desc_cn: "交叉验证方法。", desc_en: "Cross-validation." }
//         ],
//         notes: []
//       }
//     ]
//   }
// ];

// ============================================================================
// 3. 渲染引擎
// ============================================================================

const callGemini = async (prompt) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
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
    return "AI 服务暂时不可用，请检查网络设置。";
  }
};

const useKatex = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (window.katex) { setIsLoaded(true); return; }
    const link = document.createElement("link");
    link.href = KATEX_CSS; link.rel = "stylesheet";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = KATEX_JS; script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);
  }, []);
  return isLoaded;
};

// 动态注入 App 图标 (Favicon & Apple Touch Icon)
const useFavicon = () => {
  useEffect(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="100" fill="#0d9488"/><text x="50%" y="50%" dy=".35em" font-family="Arial, sans-serif" font-weight="bold" font-size="250" fill="white" text-anchor="middle">RS</text></svg>`;
    const iconUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;

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

const KatexMath = ({ tex, block = false }) => {
  const containerRef = useRef(null);
  const katexLoaded = useKatex();
  useEffect(() => {
    if (katexLoaded && containerRef.current && window.katex) {
      try { 
        window.katex.render(tex, containerRef.current, { 
          displayMode: block, throwOnError: false, strict: false 
        }); 
      } catch (e) { containerRef.current.innerText = tex; }
    } else if (containerRef.current) { containerRef.current.innerText = tex; }
  }, [tex, block, katexLoaded]);
  return <span ref={containerRef} className={block ? "block my-2 text-center overflow-x-auto scrollbar-hide" : "inline-block px-0.5"} />;
};

const InlineRenderer = ({ text }) => {
  if (!text) return null;
  const regex = /(\*\*(.*?)\*\*)|(\$(.*?)\$)|(`(.*?)`)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
    if (match[1]) parts.push(<strong key={match.index} className="text-slate-900 font-bold">{match[2]}</strong>);
    else if (match[3]) parts.push(<KatexMath key={match.index} tex={match[4]} block={false} />);
    else if (match[5]) parts.push(<code key={match.index} className="font-mono text-xs text-amber-600 bg-amber-50 px-1 rounded border border-amber-100">{match[6]}</code>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.substring(lastIndex));
  return <>{parts}</>;
};

const MarkdownRenderer = ({ content }) => {
  if (!content) return null;
  const lines = content.split('\n');
  const blocks = [];
  let currentBlock = null;
  let inMathBlock = false;
  let mathBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const isMathStart = trimmed.startsWith('$$') || trimmed.startsWith('\\[');
    const isMathEnd = trimmed.endsWith('$$') || trimmed.endsWith('\\]');

    if (inMathBlock) {
      if (isMathEnd) {
        let cleanLine = trimmed.replace(/\$\$|\\\]/g, '');
        if (cleanLine) mathBuffer.push(cleanLine);
        blocks.push({ type: 'math', content: mathBuffer.join(' ') }); 
        inMathBlock = false; mathBuffer = [];
      } else { mathBuffer.push(line); }
      continue;
    }

    if (isMathStart) {
      if (currentBlock) { blocks.push(currentBlock); currentBlock = null; }
      if (isMathEnd && trimmed.length > 2) {
        let math = trimmed.replace(/^\$\$|^\\\[|\\\]$|\$\$$/g, '');
        blocks.push({ type: 'math', content: math });
        continue;
      }
      inMathBlock = true;
      let cleanLine = trimmed.replace(/^\$\$|^\\\[/, '');
      if (cleanLine) mathBuffer.push(cleanLine);
      continue;
    }

    if (!trimmed) { if (currentBlock) { blocks.push(currentBlock); currentBlock = null; } continue; }

    if (trimmed.startsWith('|')) {
      if (currentBlock && currentBlock.type === 'table') currentBlock.lines.push(trimmed);
      else { if (currentBlock) blocks.push(currentBlock); currentBlock = { type: 'table', lines: [trimmed] }; }
      continue;
    }
    if (trimmed === '---' || trimmed === '***') {
      if (currentBlock) blocks.push(currentBlock); blocks.push({ type: 'hr' }); continue;
    }
    if (/^#{1,6}\s/.test(trimmed)) {
      if (currentBlock) blocks.push(currentBlock);
      blocks.push({ type: 'heading', level: trimmed.match(/^#+/)[0].length, content: trimmed.replace(/^#+\s/, '') });
      continue;
    }
    if (/^([一二三四五六七八九十]+|[0-9]+)、/.test(trimmed)) {
       if (currentBlock) blocks.push(currentBlock); blocks.push({ type: 'cn-heading', content: trimmed }); continue;
    }
    if (/^[\*\-]\s|^\d+\.\s/.test(trimmed)) {
      if (currentBlock && currentBlock.type === 'list') currentBlock.lines.push(trimmed);
      else { if (currentBlock) blocks.push(currentBlock); currentBlock = { type: 'list', lines: [trimmed] }; }
      continue;
    }
    if (currentBlock && currentBlock.type === 'text') currentBlock.lines.push(line);
    else { if (currentBlock) blocks.push(currentBlock); currentBlock = { type: 'text', lines: [line] }; }
  }
  if (currentBlock) blocks.push(currentBlock);
  if (inMathBlock) blocks.push({ type: 'math', content: mathBuffer.join(' ') });

  return (
    <div className="space-y-4 text-sm leading-relaxed text-slate-700">
      {blocks.map((block, idx) => {
        if (block.type === 'math') return <div key={idx} className="my-4 p-3 bg-slate-50 border border-slate-200 rounded-lg overflow-x-auto shadow-sm text-center"><KatexMath tex={block.content} block={true} /></div>;
        if (block.type === 'heading') {
          const styles = block.level === 1 ? "font-bold text-xl text-slate-900 border-b border-slate-200 pb-2 mb-3 mt-6" : block.level === 2 ? "font-bold text-lg text-teal-800 mt-5 mb-2 border-b border-slate-100 pb-1" : "font-bold text-base text-slate-800 mt-4 mb-1";
          return <div key={idx} className={styles}><InlineRenderer text={block.content} /></div>;
        }
        if (block.type === 'cn-heading') return <div key={idx} className="font-bold text-indigo-700 mt-5 mb-2 text-base bg-indigo-50/50 p-2 rounded-lg border-l-4 border-indigo-400"><InlineRenderer text={block.content} /></div>;
        if (block.type === 'hr') return <hr key={idx} className="border-t border-slate-200 my-6" />;
        if (block.type === 'table') {
          const [header, separator, ...body] = block.lines;
          const parseRow = (row) => (row || "").split('|').map(c => c.trim()).filter(c => c);
          const headers = parseRow(header);
          const rows = body.map(parseRow);
          return (
            <div key={idx} className="my-4 overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold"><tr>{headers.map((h, i) => <th key={i} className="p-3 border-b border-slate-200 whitespace-nowrap"><InlineRenderer text={h} /></th>)}</tr></thead>
                <tbody className="bg-white">{rows.map((row, rIdx) => <tr key={rIdx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">{row.map((cell, cIdx) => <td key={cIdx} className="p-3 text-slate-600"><InlineRenderer text={cell} /></td>)}</tr>)}</tbody>
              </table>
            </div>
          );
        }
        if (block.type === 'list') return <div key={idx} className="space-y-1 my-2 pl-1">{block.lines.map((item, i) => { const isNum = /^\d+\.\s/.test(item); const content = item.replace(/^[\*\-]\s|^\d+\.\s/, ''); return <div key={i} className="flex items-start">{isNum ? <span className="mr-2 font-bold text-teal-600 text-xs mt-0.5">{item.match(/^\d+\./)[0]}</span> : <div className="mr-2 mt-2 w-1.5 h-1.5 bg-teal-400 rounded-full flex-shrink-0" />}<div className="flex-1 text-slate-600"><InlineRenderer text={content} /></div></div>; })}</div>;
        if (block.type === 'text') return <div key={idx} className="space-y-2">{block.lines.map((l, i) => <div key={i} className="text-justify"><InlineRenderer text={l} /></div>)}</div>;
        return null;
      })}
    </div>
  );
};

// ============================================================================
// 4. UI 业务组件
// ============================================================================

const Toast = ({ message, onClose }) => {
  useEffect(() => { const timer = setTimeout(onClose, 2000); return () => clearTimeout(timer); }, [onClose]);
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 z-[100] animate-in fade-in slide-in-from-top-4 backdrop-blur-sm">
      <CheckCircle className="w-5 h-5 text-teal-400" /><span className="text-sm font-medium">{message}</span>
    </div>
  );
};

const BiText = ({ cn, en, label }) => {
  const [lang, setLang] = useState('cn');
  return (
    <div className="relative group">
      {label && <div className="flex justify-between items-center mb-2"><h4 className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</h4><button onClick={() => setLang(l => l==='cn'?'en':'cn')} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-mono text-slate-500 hover:text-teal-600 transition-colors border border-slate-200"><RefreshCw className="w-3 h-3"/><span>{lang==='cn'?'中':'EN'}</span></button></div>}
      {!label && <button onClick={(e) => { e.stopPropagation(); setLang(l => l==='cn'?'en':'cn'); }} className="absolute top-2 right-2 p-1.5 rounded-md bg-white text-slate-400 border border-slate-200 shadow-sm z-10"><Languages className="w-3.5 h-3.5" /></button>}
      <div className={`transition-opacity duration-300 ${!label ? 'pr-9' : ''}`}>{lang === 'cn' ? cn : en}</div>
    </div>
  );
};

const LogicNode = ({ node, level = 0, isLast = false, lang = 'cn' }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [localLang, setLocalLang] = useState(lang);
  const hasChildren = node?.children?.length > 0;

  useEffect(() => { setLocalLang(lang); }, [lang]);
  if (!node) return null;

  const label = node.label ? (node.label[localLang] || node.label.cn) : "Node";
  const desc = node.desc ? (node.desc[localLang] || node.desc.cn) : "";

  const toggleLocalLang = (e) => {
    e.stopPropagation();
    setLocalLang(prev => prev === 'cn' ? 'en' : 'cn');
  };

  return (
    <div className="relative pl-3">
      {!isLast && level > 0 && <div className="absolute left-0 top-6 bottom-0 w-px bg-slate-200" />}
      {level > 0 && <div className={`absolute left-0 top-6 w-3 h-px bg-slate-200 ${isLast ? 'w-3' : ''}`} />}
      <div className="mb-4 relative group">
        <div onClick={() => hasChildren && setIsExpanded(!isExpanded)} className={`relative p-3 rounded-xl border transition-all duration-200 w-full max-w-[90vw] ${level===0?'bg-teal-50 border-teal-200 shadow-sm':'bg-white border-slate-200 hover:border-teal-300 hover:shadow-md'} ${hasChildren?'cursor-pointer':''}`}>
          {node.heavy && <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full z-10 shadow-sm"><Zap className="w-3 h-3 inline mr-0.5" /> Core</div>}
          <div className="flex justify-between items-start">
            <div className="pr-8 flex-1 min-w-0">
              <h4 className={`font-bold text-sm ${level===0?'text-teal-800':'text-slate-800'} break-words whitespace-normal`}>{label}</h4>
              {desc && <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words whitespace-normal">{desc}</p>}
            </div>
            <div className="absolute top-3 right-3 flex gap-1 items-center">
               <button onClick={toggleLocalLang} className="p-1 rounded-full text-slate-300 hover:text-teal-600 hover:bg-slate-100"><Languages className="w-3.5 h-3.5" /></button>
               {hasChildren && <div className={`p-1 rounded-full text-slate-400 transition-transform ${isExpanded?'rotate-180':''}`}><ChevronDown className="w-4 h-4" /></div>}
            </div>
          </div>
        </div>
        {hasChildren && isExpanded && <div className="mt-2">{node.children.map((child, idx) => <LogicNode key={idx} node={child} level={level+1} isLast={idx===node.children.length-1} lang={lang} />)}</div>}
      </div>
    </div>
  );
};

const LogicTreeContainer = ({ data }) => {
  const [lang, setLang] = useState('cn');
  if (!data?.children) return <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-xl">暂无导图</div>;
  return (
    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 overflow-x-auto">
      <div className="flex justify-between items-center mb-4 px-1 min-w-[260px]">
        <div className="flex items-center text-xs font-bold text-slate-400 uppercase"><Network className="w-3.5 h-3.5 mr-1.5" /> Logic</div>
        <button onClick={() => setLang(l => l==='cn'?'en':'cn')} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white border shadow-sm text-xs text-slate-600"><RefreshCw className="w-3.5 h-3.5 mr-1" />{lang==='cn'?'全译':'All'}</button>
      </div>
      <div className="-ml-1 min-w-max"><LogicNode node={data} level={0} isLast={true} lang={lang} /></div>
    </div>
  );
};

const MOCK_HISTORY = {
  "Sun Oct 01 2023": "复习了电磁波谱，重点记忆了可见光和近红外波段范围。",
  "Tue Oct 03 2023": "学习了大气窗口，明白了为什么某些波段无法观测。",
  "Thu Oct 05 2023": "深入理解了瑞利散射和米氏散射的区别，蓝色天空原理解析。",
  "Tue Oct 10 2023": "今日复盘：几何校正的GCP选取原则，分布要均匀。",
  "Thu Oct 12 2023": "攻克了NDVI公式，(NIR-R)/(NIR+R)，范围-1到1。",
};

const CalendarModal = ({ history, onClose }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDateLog, setSelectedDateLog] = useState(null);

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: firstDay }).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const changeMonth = (offset) => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  const handleDayClick = (day) => {
    if (!day) return;
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    setSelectedDateLog({ date: dateStr, content: history[dateStr] || "暂无打卡记录" });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 bg-teal-600 text-white flex justify-between items-center"><h3 className="font-bold flex items-center gap-2"><CalendarDays className="w-5 h-5"/> 学习日历</h3><button onClick={onClose}><X className="w-5 h-5"/></button></div>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-100 rounded"><ChevronLeft className="w-5 h-5 text-slate-500"/></button>
            <span className="font-bold text-slate-700">{currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月</span>
            <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-100 rounded"><ChevronRight className="w-5 h-5 text-slate-500"/></button>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
            {['日','一','二','三','四','五','六'].map(d => <div key={d} className="text-slate-400 text-xs font-bold">{d}</div>)}
            {days.map((day, i) => {
              if (!day) return <div key={i}></div>;
              const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
              const isChecked = !!history[dateStr];
              const isToday = dateStr === today.toDateString();
              return (
                <div key={i} onClick={() => handleDayClick(day)} className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all relative ${isToday ? 'border-2 border-teal-500 text-teal-600 font-bold' : ''} ${isChecked ? 'bg-teal-100 text-teal-800 font-bold' : 'hover:bg-slate-100 text-slate-600'}`}>
                  {day}{isChecked && <div className="absolute bottom-1 w-1 h-1 bg-teal-500 rounded-full"></div>}
                </div>
              );
            })}
          </div>
          {selectedDateLog && <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in slide-in-from-bottom-2"><div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-teal-500"></div><span className="text-xs font-bold text-slate-500">{selectedDateLog.date}</span></div><p className="text-sm text-slate-700 leading-relaxed">{selectedDateLog.content}</p></div>}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 6. 页面组件 (NoteCard, NoteReader, CourseModal, etc.)
// ============================================================================

// 1. 笔记卡片 (点击查看，带删除)
const NoteCard = ({ note, onDelete, onView }) => {
  return (
    <div 
      onClick={() => onView(note)}
      className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-slate-700 shadow-sm relative group cursor-pointer hover:border-yellow-300 transition-all hover:shadow-md active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="font-bold text-yellow-800 text-xs bg-yellow-100 px-2 py-0.5 rounded flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {note.date}
        </div>
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            onDelete(note.id); // 直接调用，参数已在父级绑定
          }} 
          className="text-yellow-600 hover:text-red-500 p-1.5 -mr-1.5 -mt-1.5 rounded-full hover:bg-yellow-100 transition-all z-10"
          title="删除笔记"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="font-bold text-slate-800 mb-1 leading-snug line-clamp-1">Q: {note.question}</div>
      <div className="text-slate-500 text-xs opacity-80 line-clamp-2">{(note.answer || '').replace(/[#*`]/g, '')}</div>
    </div>
  );
};

// 2. 笔记阅读弹窗
const NoteReaderModal = ({ note, onClose }) => {
  if (!note) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 animate-in fade-in backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg h-[80vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-yellow-50/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-yellow-800 font-bold">
            <StickyNote className="w-5 h-5" /> 学习笔记详情
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-yellow-100 transition-colors"><X className="w-5 h-5 text-slate-400 hover:text-slate-600"/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 pb-20">
          <div className="font-bold text-lg text-slate-900 mb-4 border-l-4 border-yellow-400 pl-3 leading-snug">{note.question}</div>
          <div className="prose prose-sm max-w-none text-slate-600">
            <MarkdownRenderer content={note.answer} />
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. 课程详情弹窗
const CourseModal = ({ course, onClose, onSaveNote, onDeleteNote }) => {
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false); // 保存状态反馈
  const [viewingNote, setViewingNote] = useState(null); // 当前查看的笔记

  const handleAiAsk = async () => {
    if (!aiQuery.trim()) return;
    setLoading(true);
    setIsSaved(false); // 重新提问时重置保存状态
    const res = await callGemini(`背景：APS审核。课程：${course.name}。问题：${aiQuery}。请用中文回答，术语附带英文，公式用$$格式(独立行)，表格用Markdown格式。`);
    setAiResponse(res);
    setLoading(false);
  };

  const handleSave = () => {
    onSaveNote(course.id, aiQuery, aiResponse);
    setIsSaved(true); // 设置为已保存
  };

  if (!course) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in backdrop-blur-sm">
      <div className="bg-white w-full h-[90vh] sm:h-auto sm:max-h-[85vh] sm:max-w-3xl rounded-2xl flex flex-col shadow-2xl overflow-hidden min-w-0">
        <div className="flex-none p-5 border-b border-slate-100 flex justify-between items-start bg-white z-20">
          <div className="flex-1 mr-4 min-w-0"> 
            <h3 className="font-bold text-lg text-slate-800 leading-snug break-words pr-2">{course.name}</h3> 
            <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded mt-1.5 inline-block">APS CORE</span>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-500 flex-shrink-0"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-24 sm:pb-5">
          <BiText label={<><FileText className="w-4 h-4 mr-2" /> 概要 (Summary)</>} cn={<div className="bg-blue-50 text-blue-900 p-4 rounded-xl text-sm leading-relaxed border border-blue-100 shadow-sm">{course.summary.cn}</div>} en={<div className="bg-indigo-50 text-indigo-900 p-4 rounded-xl text-sm leading-relaxed border border-indigo-100 shadow-sm font-medium">{course.summary.en}</div>} />
          <BiText label={<><Target className="w-4 h-4 mr-2" /> 目标 (Goals)</>} cn={<p className="text-slate-700 text-sm leading-relaxed pl-3 border-l-4 border-teal-400 py-1">{course.goals.cn}</p>} en={<p className="text-slate-700 text-sm leading-relaxed pl-3 border-l-4 border-indigo-400 py-1 font-medium">{course.goals.en}</p>} />
          <LogicTreeContainer data={course.logicTree} />
          
          {course.terms && (
            <div>
              <h4 className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-wider mb-4"><Globe className="w-4 h-4 mr-2" /> 核心术语库</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.terms.map((term, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
                    <h5 className="font-bold text-teal-700 text-base mb-2 break-words mr-8">{term.en}</h5>
                    <BiText cn={<div className="text-xs text-slate-500 pt-2 border-t border-slate-100"><span className="font-bold">{term.cn}</span>: {term.desc_cn}</div>} en={<div className="text-xs text-slate-600 pt-2 border-t border-slate-100 font-medium"><span className="font-bold">{term.cn}</span>: {term.desc_en}</div>} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 笔记列表 */}
          {course.notes && course.notes.length > 0 && (
            <div>
              <h4 className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-wider mb-4"><StickyNote className="w-4 h-4 mr-2" /> 学习笔记 ({course.notes.length})</h4>
              <div className="grid grid-cols-1 gap-3">
                {course.notes.map((note) => (
                  // ✅ 关键修复：正确传递参数给 onDeleteNote
                  <NoteCard 
                    key={note.id} 
                    note={note} 
                    onDelete={(noteId) => onDeleteNote(course.id, noteId)} 
                    onView={setViewingNote} 
                  />
                ))}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border border-purple-100 shadow-sm">
            <h4 className="flex items-center text-sm font-bold text-purple-700 uppercase tracking-wider mb-3"><Sparkles className="w-4 h-4 mr-2" /> AI 深度追问</h4>
            <div className="flex gap-2 mb-4">
              <input type="text" value={aiQuery} onChange={(e) => {setAiQuery(e.target.value); setIsSaved(false);}} placeholder="例如：为什么SAR会有阴影？" className="flex-grow text-sm p-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white shadow-inner" />
              <button onClick={handleAiAsk} disabled={loading} className="bg-purple-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-md shadow-purple-200 flex-shrink-0">{loading ? "..." : "Ask"}</button>
            </div>
            {aiResponse && (
              <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm animate-in fade-in relative">
                <MarkdownRenderer content={aiResponse} />
                <button 
                  onClick={handleSave} 
                  disabled={isSaved}
                  className={`mt-4 flex items-center justify-center w-full py-2.5 rounded-lg text-xs font-bold transition-all ${isSaved ? 'bg-green-100 text-green-700 cursor-default' : 'bg-purple-100 hover:bg-purple-200 text-purple-700 active:scale-95'}`}
                >
                  {isSaved ? <><Check className="w-4 h-4 mr-1.5" /> 已保存到笔记</> : <><Save className="w-4 h-4 mr-1.5" /> 保存到笔记</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {viewingNote && <NoteReaderModal note={viewingNote} onClose={() => setViewingNote(null)} />}
    </div>
  );
};

const CourseList = ({ courses, setSelectedCourse }) => {
  const [expandedCat, setExpandedCat] = useState("理论基础 (Fundamentals)");
  return (
    <div className="space-y-4">
      {courses.map((cat, idx) => (
        <div key={idx} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <button onClick={() => setExpandedCat(expandedCat === cat.category ? null : cat.category)} className={`w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors font-bold text-sm text-slate-700 ${expandedCat === cat.category ? 'border-b border-slate-100' : ''}`}>
            <span className="flex items-center"><span className={`w-1.5 h-4 rounded-full mr-2 ${expandedCat === cat.category ? 'bg-teal-500' : 'bg-slate-300'}`}></span>{cat.category}</span>
            {expandedCat === cat.category ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>
          {expandedCat === cat.category && (
            <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-50/30">
              {cat.courses.map((course) => (
                <div key={course.id} onClick={() => setSelectedCourse(course)} className="p-4 bg-white border border-slate-100 rounded-xl hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group flex justify-between items-center active:scale-[0.98]">
                  <div className="flex-1 pr-3 min-w-0"> 
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-teal-700 transition-colors leading-tight mb-1 truncate">{course.name.split('(')[0]}</h4>
                    <p className="text-xs text-slate-400 truncate font-medium">{course.summary?.cn || "点击查看详情"}</p>
                  </div>
                  <div className="flex-none flex-shrink-0"><div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teal-50 transition-colors"><ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500" /></div></div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const DailyCheckIn = ({ streak, setStreak, lastCheckIn, setLastCheckIn, history, setHistory }) => {
  const [reflection, setReflection] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (lastCheckIn === new Date().toDateString()) setChecked(true); }, [lastCheckIn]);
  const handleCheckIn = () => { 
    if (!reflection.trim()) return; 
    const today = new Date().toDateString();
    setStreak(s => s + 1); 
    setLastCheckIn(today); 
    setHistory(prev => ({ ...prev, [today]: reflection }));
    setChecked(true); 
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
      <div className="flex justify-between mb-6 relative z-10"><h3 className="text-lg font-bold flex items-center text-slate-800"><Activity className="mr-2 text-teal-600 w-5 h-5" /> 每日复盘</h3><div className="flex gap-2"><button onClick={() => setShowCalendar(true)} className="text-xs font-bold bg-white text-slate-600 border border-slate-200 px-3 py-1.5 rounded-full flex items-center hover:bg-slate-50 transition-colors"><CalendarDays className="w-3.5 h-3.5 mr-1.5 text-teal-600"/> 日历</button><span className="text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full border border-teal-100">Day {streak}</span></div></div>
      {checked ? <div className="text-center py-8 bg-green-50/50 rounded-xl border border-green-100"><CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" /><p className="text-green-800 font-bold text-sm">今日复盘已完成</p></div> : <div className="space-y-4"><textarea className="w-full p-4 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white transition-colors" rows="3" placeholder="今天的感悟..." value={reflection} onChange={e => setReflection(e.target.value)} /><button onClick={handleCheckIn} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-teal-200">提交打卡</button></div>}
      {showCalendar && <CalendarModal history={history} onClose={() => setShowCalendar(false)} />}
    </div>
  );
};

const InterviewSim = () => {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(false);
  const qs = [{ q: "Supervised vs Unsupervised?", a: "Training samples vs Statistical clustering." }, { q: "SAR Distortions?", a: "Foreshortening, Layover, Shadow." }];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full relative overflow-hidden">
      <div className="flex justify-between mb-8"><h3 className="font-bold text-lg flex text-slate-800"><RefreshCw className="mr-2 text-purple-600"/> 快速问答</h3><span className="text-xs font-mono font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100">Q-{idx + 1}</span></div>
      <div className="flex-grow flex flex-col justify-center"><h4 className="text-xl font-bold text-slate-800 mb-4 leading-snug">{qs[idx].q}</h4>{show ? <div className="bg-slate-50 p-5 rounded-2xl text-sm text-slate-700 border-l-4 border-purple-500 animate-in fade-in">{qs[idx].a}</div> : <div className="h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">Think...</div>}</div>
      <div className="grid grid-cols-2 gap-4 mt-8"><button onClick={() => setShow(!show)} className="py-3 border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">{show ? "隐藏答案" : "查看答案"}</button><button onClick={() => { setIdx((idx + 1) % qs.length); setShow(false); }} className="py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-sm font-bold shadow-lg">下一题</button></div>
    </div>
  );
};

const Dashboard = ({ setActiveTab }) => {
  const [history, setHistory] = useState(MOCK_HISTORY);
  const [streak, setStreak] = useState(5);
  const [lastCheckIn, setLastCheckIn] = useState("Thu Oct 12 2023");

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-gradient-to-r from-teal-700 to-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-teal-100 relative overflow-hidden">
        <div className="relative z-10"><h1 className="text-3xl font-bold mb-2">Ready?</h1><p className="text-teal-50 text-sm mb-5 italic">"{QUOTES[0]}"</p><div className="flex items-center text-xs font-mono font-bold bg-black/20 backdrop-blur-sm w-fit px-4 py-1.5 rounded-full border border-white/10"><GraduationCap className="w-3.5 h-3.5 mr-2" /> CUG {'->'} Germany</div></div><Layers className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 rotate-12" />
      </div>
      <DailyCheckIn streak={streak} setStreak={setStreak} lastCheckIn={lastCheckIn} setLastCheckIn={setLastCheckIn} history={history} setHistory={setHistory} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div onClick={() => setActiveTab('courses')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-teal-400 hover:shadow-md transition-all group active:scale-95"><div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-100 text-blue-600 transition-colors"><BookOpen className="w-6 h-6" /></div><h3 className="font-bold text-slate-700 text-lg">核心课程</h3><p className="text-xs text-slate-400 mt-1 font-medium">14门硬核复习</p></div>
        <div onClick={() => setActiveTab('interview')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-purple-400 hover:shadow-md transition-all group active:scale-95"><div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors text-purple-600"><MessageSquare className="w-6 h-6" /></div><h3 className="font-bold text-slate-700 text-lg">模拟面谈</h3><p className="text-xs text-slate-400 mt-1 font-medium">AI 考官实时对练</p></div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 主入口 (App - State Manager)
// -----------------------------------------------------------------------------
export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState(null); // 核心修复：只存 ID
  const [toast, setToast] = useState(null); 
  
  const useFavicon = () => {
    useEffect(() => {
      const link = document.createElement('link');
      link.rel = 'icon';
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#0d9488"/><text x="50" y="65" font-family="Arial" font-size="50" fill="white" text-anchor="middle" font-weight="bold">RS</text></svg>`;
      link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
      document.head.appendChild(link);
      return () => document.head.removeChild(link);
    }, []);
  };
  useFavicon();

  const [coursesData, setCoursesData] = useState(() => {
    try {
      const saved = localStorage.getItem('aps_courses_v8'); // 升级 v8 防止旧数据冲突
      return saved ? JSON.parse(saved) : COURSE_DATA;
    } catch {
      return COURSE_DATA;
    }
  });

  useEffect(() => {
    localStorage.setItem('aps_courses_v8', JSON.stringify(coursesData));
  }, [coursesData]);

  // 根据 ID 实时计算当前选中的课程对象 (Derived State)
  const selectedCourse = selectedCourseId 
    ? coursesData.flatMap(c => c.courses).find(c => c.id === selectedCourseId)
    : null;

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const saveNote = (courseId, question, answer) => {
    setCoursesData(prevData => prevData.map(cat => ({
      ...cat,
      courses: cat.courses.map(c => {
        if (c.id === courseId) {
          const newNote = { id: Date.now(), question, answer, date: new Date().toLocaleDateString() };
          const existingNotes = c.notes || [];
          return { ...c, notes: [newNote, ...existingNotes] };
        }
        return c;
      })
    })));
    showToast("笔记已保存");
  };

  // 修复后的删除逻辑：只依赖 ID，不依赖对象引用
  const deleteNote = (courseId, noteId) => {
    if (!window.confirm("确定要删除这条笔记吗？")) return;
    
    setCoursesData(prevData => prevData.map(cat => ({
      ...cat,
      courses: cat.courses.map(c => {
        if (c.id === courseId) {
           return { ...c, notes: (c.notes || []).filter(n => n.id !== noteId) };
        }
        return c;
      })
    })));
    showToast("笔记已删除");
  };

  const renderContent = () => {
    switch(tab) {
      case 'dashboard': return <Dashboard setActiveTab={setTab} />;
      case 'courses': return <CourseList courses={coursesData} setSelectedCourse={c => setSelectedCourseId(c.id)} />;
      case 'interview': return <InterviewSim />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
      {toast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 z-[100] animate-in fade-in slide-in-from-top-4 backdrop-blur-sm">
          <CheckCircle className="w-5 h-5 text-teal-400" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full p-4 z-20 flex-shrink-0">
        <div className="flex items-center space-x-3 px-4 py-4 mb-6"><div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">RS</div><span className="font-bold text-slate-800 text-lg tracking-tight">Logic Prep</span></div>
        <nav className="space-y-2 flex-1">
          {[{ id: 'dashboard', label: '概览 Dashboard', icon: Layers }, { id: 'courses', label: '课程 Courses', icon: BookOpen }, { id: 'interview', label: '模拟 Interview', icon: Award }].map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${tab === item.id ? 'bg-teal-50 text-teal-700 font-bold shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><item.icon className="w-5 h-5" /><span>{item.label}</span></button>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-slate-100 text-xs text-slate-400 px-4">APS Prep Assistant v2.6</div>
      </aside>
      <div className="flex-1 flex flex-col h-full relative min-w-0">
        <header className="md:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center z-30"><div className="flex items-center space-x-3" onClick={() => setTab('dashboard')}><div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">RS</div><span className="font-bold text-slate-800 text-lg tracking-tight">Logic Prep</span></div><Smartphone className="w-5 h-5 text-slate-400" /></header>
        <main className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-8 max-w-7xl mx-auto w-full">{renderContent()}</main>
        <nav className="md:hidden bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-30 pb-safe sm:pb-3">
          {['dashboard', 'courses', 'interview'].map(t => <button key={t} onClick={() => setTab(t)} className={`flex flex-col items-center w-16 space-y-1.5 ${tab === t ? 'text-teal-600 scale-105' : 'text-slate-400'}`}>{t === 'dashboard' ? <Layers className="w-6 h-6" /> : t === 'courses' ? <BookOpen className="w-6 h-6" /> : <Award className="w-6 h-6" />}<span className="text-[10px] font-bold uppercase">{t}</span></button>)}
        </nav>
      </div>
      
      {/* 始终渲染 Modal，通过 selectedCourseId 控制显示内容 */}
      {selectedCourse && (
        <CourseModal 
          course={selectedCourse} 
          onClose={() => setSelectedCourseId(null)} 
          onSaveNote={saveNote}
          onDeleteNote={deleteNote} 
        />
      )}
    </div>
  );
}