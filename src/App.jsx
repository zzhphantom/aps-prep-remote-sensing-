import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, CheckCircle, Brain, Target, Calendar, ChevronDown, ChevronUp,
  ChevronRight, Award, RefreshCw, Layers, Sparkles, X, 
  Smartphone, GraduationCap, FileText, Globe, Network, 
  Languages, Zap, Activity, Plus, MessageSquare, StickyNote, 
  Save, Trash2, ChevronLeft, CalendarDays, Check, Maximize2
} from 'lucide-react';

import {QUOTES,COURSE_DATA} from './data';

// ============================================================================
// 1. 全局配置与 API
// ============================================================================
const apiKey = "AIzaSyCADS6fXhqZ_kO_C1TRcx23dijzmbzmPVE"; 

const KATEX_CSS = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
const KATEX_JS = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";

// const QUOTES = [
//   "遥感不仅仅是看图片，它是物理世界在数字空间的投影。",
//   "APS考察的不是记忆力，而是你作为工程师的逻辑思维。",
//   "从麦克斯韦方程组到卫星图像，中间贯穿着几何与物理的美。",
//   "宁可慢一点，也要把基本概念彻底吃透。",
//   "误差理论告诉我们：真值不可求，但我们可以无限逼近。",
//   "数据本身没有意义，模型和算法赋予了它灵魂。",
// ];

// const COURSE_DATA = [
//   {
//     category: "理论基础 (Fundamentals)",
//     courses: [
//       {
//         id: "c1",
//         name: "Principles and Applications of Remote Sensing (遥感原理与应用)",
//         summary: { cn: "遥感科学的总纲：建立电磁波与地表交互的物理模型及成像基础。", en: "The overarching framework establishing physical models of EM wave-surface interactions." },
//         goals: { cn: "精通电磁波谱、辐射传输方程(RTE)、地物光谱特征及四大分辨率的权衡。", en: "Master EM spectrum, RTE, Spectral signatures, and trade-offs of 4 resolutions." },
//         logicTree: {
//           label: { cn: "遥感物理链路", en: "Physical Chain" },
//           children: [
//             {
//               label: { cn: "1. 辐射源与传输", en: "1. Source & Transfer" },
//               children: [
//                 { label: { cn: "黑体辐射", en: "Blackbody" }, desc: { cn: "普朗克定律(能量分布)；维恩位移定律(T↑ λ↓)；斯蒂芬-玻尔兹曼定律(总能量)。", en: "Planck's Law; Wien's Law; Stefan-Boltzmann Law." }, heavy: true },
//                 { label: { cn: "大气传输", en: "Atmosphere" }, desc: { cn: "大气窗口(透过率>80%) vs 大气屏障(吸收带)。", en: "Windows (High transmittance) vs Absorption bands." },
//                   children: [
//                     { label: { cn: "散射类型", en: "Scattering" }, desc: { cn: "瑞利散射(蓝天, d<<λ)；米氏散射(云雾, d≈λ)；非选择性散射(白云, d>>λ)。", en: "Rayleigh, Mie, Non-selective." } },
//                     { label: { cn: "吸收气体", en: "Absorption" }, desc: { cn: "H2O, CO2, O3 是主要的吸收气体。", en: "H2O, CO2, O3 are main absorbers." } }
//                   ]
//                 }
//               ]
//             },
//             {
//               label: { cn: "2. 地物光谱响应", en: "2. Spectral Response" },
//               children: [
//                 { label: { cn: "植被", en: "Vegetation" }, desc: { cn: "叶绿素吸收(红/蓝) + 细胞结构高反(近红外) = 红边效应。", en: "Chlorophyll absorb + Cell reflect = Red Edge." }, heavy: true },
//                 { label: { cn: "水体", en: "Water" }, desc: { cn: "近红外/短波红外强吸收(呈黑色)；叶绿素/悬浮物增加可见光反射(水色)。", en: "NIR/SWIR absorption; Chl/Sediment reflectance." } },
//                 { label: { cn: "土壤", en: "Soil" }, desc: { cn: "反射率随波长线性增加；含水量越高，全波段反射率越低。", en: "Linear increase; moisture reduces reflectance." } }
//               ]
//             },
//             {
//               label: { cn: "3. 传感器特性", en: "3. Sensor Traits" },
//               children: [
//                 { label: { cn: "四大分辨率", en: "Resolutions" }, desc: { cn: "空间(IFOV)、光谱(波段宽窄)、辐射(量化位数)、时间(重访周期)。", en: "Spatial, Spectral, Radiometric, Temporal." }, heavy: true },
//                 { label: { cn: "扫描方式", en: "Scanning" }, desc: { cn: "推扫式(Pushbroom, 驻留长/信噪比高/畸变小) vs 摆扫式(Whiskbroom)。", en: "Pushbroom (High SNR) vs Whiskbroom." } }
//               ]
//             }
//           ]
//         },
//         terms: [
//           { cn: "大气窗口", en: "Atmospheric Window", desc_cn: "电磁波通过大气层时透过率较高的波段(如0.4-0.7μm, 8-14μm)，是传感器波段设计的依据。", desc_en: "Spectral bands with high transmittance guiding sensor design." },
//           { cn: "光谱特征", en: "Spectral Signature", desc_cn: "不同地物在不同波段反射率的独特组合，如同指纹，是遥感分类的基础。", desc_en: "Unique variation of reflectance with wavelength used for identification." },
//           { cn: "红边", en: "Red Edge", desc_cn: "绿色植被在0.7μm附近反射率急剧上升的特征，斜率与植被健康密切相关。", desc_en: "Sharp rise in reflectance near 0.7μm, indicating plant health." },
//           { cn: "双向反射分布函数", en: "BRDF", desc_cn: "描述地表反射率随入射角和观测角变化的函数，解释了“热点”和“暗点”现象。", desc_en: "Function describing how reflectance changes with view/illumination angles." }
//         ]
//       },
//       {
//         id: "c2",
//         name: "Microwave Remote Sensing (微波遥感)",
//         summary: { cn: "利用微波波段(1mm-1m)进行全天时、全天候的主动观测，侧重SAR原理。", en: "All-weather active microwave sensing, focusing on SAR principles." },
//         goals: { cn: "理解雷达方程、SAR成像几何、多普勒原理、极化分解及InSAR干涉测量。", en: "Understand Radar Equation, SAR geometry, Doppler, PolSAR, and InSAR." },
//         logicTree: {
//           label: { cn: "SAR 系统深度解析", en: "SAR System Deep Dive" },
//           children: [
//             {
//               label: { cn: "1. 成像机理", en: "1. Imaging Physics" },
//               children: [
//                 { label: { cn: "测距原理", en: "Ranging" }, desc: { cn: "距离向分辨率取决于脉冲宽度(τ)，通过Chirp脉冲压缩技术优化。", en: "Range Res depends on pulse width (Chirp compression)." } },
//                 { label: { cn: "方位原理", en: "Azimuth" }, desc: { cn: "利用多普勒频移合成虚拟长孔径(L = λR / L_antenna)。孔径越长，波束越窄，分辨率越高。", en: "Doppler synthesis creates virtual aperture." }, heavy: true },
//                 { label: { cn: "几何畸变", en: "Distortions" }, desc: { cn: "透视收缩(Foreshortening)、叠掩(Layover, 顶底倒置)、阴影(Shadow, 无信号)。", en: "Specific to slant-range geometry." } }
//               ]
//             },
//             {
//               label: { cn: "2. 信号特性", en: "2. Signal Traits" },
//               children: [
//                 { label: { cn: "波段特性", en: "Bands" }, desc: { cn: "L波段(23cm, 穿透树冠)、C波段(5.6cm, 树冠/表面)、X波段(3cm, 表面)。", en: "L (Penetration), C, X (Surface)." } },
//                 { label: { cn: "极化机制", en: "Polarization" }, desc: { cn: "HH/VV(奇次/表面散射)、HV/VH(偶次/体积散射/去极化)。", en: "Surface vs Volume scattering." } }
//               ]
//             },
//             {
//               label: { cn: "3. InSAR干涉", en: "3. InSAR" },
//               children: [
//                 { label: { cn: "基本原理", en: "Basics" }, desc: { cn: "相位差 φ = φ_topo + φ_def + φ_atm + φ_noise。", en: "Phase diff components." }, heavy: true },
//                 { label: { cn: "处理流程", en: "Workflow" }, desc: { cn: "配准 -> 生成干涉图 -> 去平地效应 -> 相位解缠 -> 地理编码。", en: "Coreg -> Interferogram -> Flatten -> Unwrap -> Geocode." } }
//               ]
//             }
//           ]
//         },
//         terms: [
//           { cn: "后向散射系数", en: "Backscattering Coeff (σ0)", desc_cn: "单位面积目标的散射强度(dB)，与地表粗糙度、介电常数和雷达波长有关。", desc_en: "Normalized radar cross-section reflecting roughness/dielectric properties." },
//           { cn: "相位解缠", en: "Phase Unwrapping", desc_cn: "解决2π模糊度问题，将周期性的缠绕相位(-π, π)恢复为连续的绝对相位。", desc_en: "Resolving 2π ambiguities to retrieve continuous phase." },
//           { cn: "基线", en: "Baseline", desc_cn: "两次观测时卫星位置的空间距离。垂直基线影响高程灵敏度，时间基线影响去相关。", desc_en: "Spatial/Temporal separation between satellite tracks." },
//           { cn: "相干斑", en: "Speckle", desc_cn: "由于分辨单元内多个散射体相位干涉产生的椒盐噪声，需多视处理去除。", desc_en: "Granular noise inherent to coherent imaging systems." }
//         ]
//       },
//       {
//         id: "c3",
//         name: "Thermal Infrared Remote Sensing (热红外遥感)",
//         summary: { cn: "基于热辐射理论反演地表温度(LST)与发射率，解决病态方程问题。", en: "Retrieving LST and emissivity based on thermal radiation theory and solving ill-posed problems." },
//         goals: { cn: "掌握普朗克定律、基尔霍夫定律、分裂窗算法及城市热岛应用。", en: "Master Planck's Law, Kirchhoff's Law, Split-Window, UHI." },
//         logicTree: {
//           label: { cn: "LST 反演体系", en: "LST Retrieval Sys" },
//           children: [
//             {
//               label: { cn: "1. 物理定律", en: "1. Physics" },
//               children: [
//                 { label: { cn: "普朗克定律", en: "Planck's" }, desc: { cn: "描述黑体辐射能量随波长和温度的分布，是反演温度的物理基础。", en: "Radiance distribution over wavelength/temp." } },
//                 { label: { cn: "基尔霍夫", en: "Kirchhoff" }, desc: { cn: "热平衡状态下：发射率(ε) = 吸收率(α)。良吸收体也是良辐射体。", en: "Emissivity equals Absorptivity." }, heavy: true }
//               ]
//             },
//             {
//               label: { cn: "2. 反演算法", en: "2. Algorithms" },
//               children: [
//                 { label: { cn: "单通道算法", en: "Single-Channel" }, desc: { cn: "仅利用一个波段，需极其精确的大气廓线数据(探空数据)进行校正。", en: "Requires precise atmospheric profiles." } },
//                 { label: { cn: "分裂窗(SW)", en: "Split-Window" }, desc: { cn: "利用10-12μm双通道对水汽吸收的微小差异来消除大气影响。", en: "Using differential absorption to remove atm." }, heavy: true },
//                 { label: { cn: "TES算法", en: "TES" }, desc: { cn: "温度与发射率分离：利用MMD(最小最大差)经验关系增加约束方程。", en: "Temp-Emissivity Separation using MMD." } }
//               ]
//             },
//             {
//               label: { cn: "3. 典型应用", en: "3. Apps" },
//               children: [
//                 { label: { cn: "城市热岛", en: "UHI" }, desc: { cn: "监测不透水面(IS)导致的高温区，与NDVI呈负相关。", en: "Correlated with impervious surfaces, negative to NDVI." } },
//                 { label: { cn: "土壤水分", en: "Soil Moisture" }, desc: { cn: "利用热惯量(Thermal Inertia)：含水量高 -> 热惯量大 -> 昼夜温差小。", en: "Thermal Inertia: Water dampens temp change." } }
//               ]
//             }
//           ]
//         },
//         terms: [
//           { cn: "热惯量", en: "Thermal Inertia", desc_cn: "物质阻碍温度变化的能力(P = sqrt(Kρc))，是区分岩石、土壤和水体的关键热特性。", desc_en: "Resistance to temperature change, distinguishing rocks/soil/water." },
//           { cn: "亮温", en: "Brightness Temp", desc_cn: "假设物体为黑体(ε=1)时，传感器观测到的辐射能量对应的温度。", desc_en: "Temp assuming object is a blackbody." },
//           { cn: "分裂窗算法", en: "Split-Window", desc_cn: "利用两个相邻热红外波段的大气吸收差异来校正大气影响的反演方法。", desc_en: "Correcting atm effects using dual bands." },
//           { cn: "发射率", en: "Emissivity", desc_cn: "物体辐射能力与同温黑体辐射能力的比值(0-1)，取决于物质成分和表面粗糙度。", desc_en: "Ratio of radiation to blackbody, dependent on material/roughness." }
//         ]
//       },
//       {
//         id: "c4",
//         name: "Remote Sensing of Natural Disasters (自然灾害遥感)",
//         summary: { cn: "利用多源遥感进行灾害预警、评估与应急响应，侧重变化检测。", en: "Disaster warning, assessment, and response using RS, focusing on change detection." },
//         goals: { cn: "掌握洪水(SAR)、地震(InSAR)、火灾(MIR)的监测机理。", en: "Mechanisms for Flood, Earthquake, and Fire monitoring." },
//         logicTree: {
//           label: { cn: "灾害响应链", en: "Disaster Chain" },
//           children: [
//             {
//               label: { cn: "1. 洪涝监测", en: "1. Flood" },
//               children: [
//                 { label: { cn: "原理", en: "Principle" }, desc: { cn: "SAR: 水体发生镜面反射，回波极低(暗区)；光学: NDWI指数提取。", en: "SAR: Specular/Dark; Optical: NDWI." }, heavy: true },
//                 { label: { cn: "方法", en: "Method" }, desc: { cn: "Otsu自适应阈值分割、变化检测法(Change Detection)。", en: "Otsu thresholding, CVA." } }
//               ]
//             },
//             {
//               label: { cn: "2. 地震/滑坡", en: "2. Geo-Hazard" },
//               children: [
//                 { label: { cn: "D-InSAR", en: "D-InSAR" }, desc: { cn: "差分干涉测量提取同震形变场(条纹图)。", en: "Differential InSAR for co-seismic deformation." }, heavy: true },
//                 { label: { cn: "时序分析", en: "Time-Series" }, desc: { cn: "SBAS/PS-InSAR 技术监测毫米级缓慢沉降。", en: "SBAS/PS-InSAR for slow motion." } }
//               ]
//             },
//             {
//               label: { cn: "3. 森林火灾", en: "3. Wildfire" },
//               children: [
//                 { label: { cn: "火点(Active)", en: "Active Fire" }, desc: { cn: "利用普朗克曲线位移，中红外(3-5μm)对高温目标极度敏感。", en: "MIR (3-5μm) highly sensitive to high temp." } },
//                 { label: { cn: "迹地(Scar)", en: "Burn Scar" }, desc: { cn: "NBR (归一化燃烧比率) = (NIR-SWIR)/(NIR+SWIR)。", en: "NBR index using NIR/SWIR." } }
//               ]
//             }
//           ]
//         },
//         terms: [
//           { cn: "变化检测", en: "Change Detection", desc_cn: "通过对比灾前灾后影像的像素值或特征，提取变化区域的技术。", desc_en: "Identifying differences in state by observing at different times." },
//           { cn: "NDWI", en: "Normalized Difference Water Index", desc_cn: "(Green - NIR) / (Green + NIR)，用于突显水体信息，抑制植被背景。", desc_en: "Index used to delineate open water features." },
//           { cn: "Otsu算法", en: "Otsu Method", desc_cn: "最大类间方差法，自动确定图像二值化的最佳阈值，常用于水体提取。", desc_en: "Auto-thresholding maximizing inter-class variance." },
//           { cn: "NBR", en: "Normalized Burn Ratio", desc_cn: "利用近红外和短波红外计算的火灾指数，用于评估过火面积和烈度。", desc_en: "Index to identify burned areas and severity." }
//         ]
//       },
//       {
//         id: "c5",
//         name: "Low Altitude UAV Remote Sensing (低空无人机遥感)",
//         summary: { cn: "利用无人机平台获取超高分辨率数据的技术，侧重SfM建模。", en: "High-res data acquisition using UAV platforms, focusing on SfM modeling." },
//         goals: { cn: "掌握航线规划、像控点布设、SfM建模原理及正射影像生产流程。", en: "Flight planning, GCPs, SfM modeling, DOM production." },
//         logicTree: {
//           label: { cn: "UAV 作业流", en: "UAV Workflow" },
//           children: [
//             {
//               label: { cn: "1. 航测规划", en: "1. Planning" },
//               children: [
//                 { label: { cn: "参数设计", en: "Params" }, desc: { cn: "航高(H)决定地面分辨率(GSD)；重叠度(Overlap)决定建模质量(通常>60%)。", en: "H -> GSD; Overlap -> Quality." }, heavy: true },
//                 { label: { cn: "像控点", en: "GCPs" }, desc: { cn: "均匀分布边缘与中心，用于绝对定向，消除非线性畸变。", en: "Distributed for absolute orientation." } }
//               ]
//             },
//             {
//               label: { cn: "2. SfM 建模", en: "2. SfM Algo" },
//               children: [
//                 { label: { cn: "特征匹配", en: "Matching" }, desc: { cn: "SIFT/SURF算法提取海量同名特征点。", en: "SIFT/SURF feature extraction." } },
//                 { label: { cn: "光束法平差", en: "Bundle Adj" }, desc: { cn: "联合解算相机位姿(外方位元素)和稀疏三维点坐标。", en: "Solving camera pose & sparse cloud." }, heavy: true }
//               ]
//             },
//             {
//               label: { cn: "3. 产品生产", en: "3. Products" },
//               children: [
//                 { label: { cn: "MVS", en: "MVS" }, desc: { cn: "多视图立体匹配(Multi-View Stereo)生成稠密点云。", en: "Dense cloud generation." } },
//                 { label: { cn: "DOM/DSM", en: "DOM/DSM" }, desc: { cn: "基于TIN构建数字表面模型(DSM)与正射影像(DOM)。", en: "TIN-based DSM & Orthophoto." } }
//               ]
//             }
//           ]
//         },
//         terms: [
//           { cn: "GSD", en: "Ground Sample Distance", desc_cn: "地面采样距离，即照片上一个像素代表的实际地面物理尺寸。", desc_en: "Ground physical size of one pixel." },
//           { cn: "SfM", en: "Structure from Motion", desc_cn: "运动恢复结构，从二维图像序列的运动视差恢复三维结构的计算机视觉算法。", desc_en: "Reconstructing 3D structure from 2D image motion." },
//           { cn: "POS数据", en: "Position & Orientation System", desc_cn: "记录无人机拍照时的GPS位置和IMU姿态数据(经纬度/高程/俯仰/翻滚/航向)。", desc_en: "GPS and IMU data recording camera position and attitude." },
//           { cn: "正射影像", en: "DOM", desc_cn: "经过几何纠正，消除了投影差，具有地图几何精度的影像。", desc_en: "Geometrically corrected image with map accuracy." }
//         ]
//       },
//       {
//         id: "c6",
//         name: "Error Theory and Surveying Adjustment B (误差理论与测量平差)",
//         summary: { cn: "处理观测数据误差，求取最优解的数学方法。", en: "Math methods for error handling and optimal estimation." },
//         goals: { cn: "掌握误差传播定律及最小二乘法原理。", en: "Master Error Propagation & Least Squares." },
//         logicTree: {
//           label: { cn: "平差核心", en: "Adjustment Core" },
//           children: [
//             {
//               label: { cn: "1. 误差性质", en: "1. Properties" },
//               children: [
//                 { label: { cn: "分类", en: "Types" }, desc: { cn: "系统误差(函数模型改正)、偶然误差(统计处理)、粗差(剔除)。", en: "Systematic, Random, Gross." } },
//                 { label: { cn: "正态分布", en: "Normal Dist" }, desc: { cn: "偶然误差特性：聚中性、对称性、有界性、抵偿性。", en: "Centrality, Symmetry, Boundedness." } }
//               ]
//             },
//             {
//               label: { cn: "2. 最小二乘法", en: "2. Least Squares" },
//               children: [
//                 { label: { cn: "原理", en: "Principle" }, desc: { cn: "最优估计准则：观测值改正数的平方和最小 (V^T P V = min)。", en: "Minimizing weighted sum of squared residuals." }, heavy: true },
//                 { label: { cn: "模型", en: "Models" }, desc: { cn: "条件平差(几何条件) vs 间接平差(选参数求解)。", en: "Conditional vs Indirect Adjustment." } }
//               ]
//             },
//             {
//               label: { cn: "3. 精度指标", en: "3. Indicators" },
//               children: [
//                 { label: { cn: "中误差", en: "RMSE" }, desc: { cn: "衡量观测值精度的标准。", en: "Standard error." } },
//                 { label: { cn: "误差椭圆", en: "Error Ellipse" }, desc: { cn: "描述点位在二维平面上的精度分布(方向性)。", en: "2D positional accuracy distribution." } }
//               ]
//             }
//           ]
//         },
//         terms: [
//           { cn: "权", en: "Weight (P)", desc_cn: "衡量观测值相对可靠程度的指标，与方差成反比。", desc_en: "Relative reliability, inverse to variance." },
//           { cn: "协方差矩阵", en: "Covariance Matrix", desc_cn: "描述多维随机变量之间相关性和精度的矩阵。", desc_en: "Matrix describing correlation and precision." },
//           { cn: "中误差", en: "RMSE", desc_cn: "均方根误差，衡量观测精度的标准指标。", desc_en: "Root Mean Square Error." },
//           { cn: "多余观测", en: "Redundancy", desc_cn: "观测数量多于确定未知量所需的最少数量，是进行平差的前提。", desc_en: "More observations than unknowns." }
//         ]
//       }
//     ]
//   },
//   {
//     category: "图像处理与解译 (Processing & Interp)",
//     courses: [
//       {
//         id: "c7",
//         name: "Digital Image Processing (数字图像处理)",
//         summary: { cn: "遥感影像的数学运算与自动化分析算法。", en: "Math operations on imagery for enhancement and analysis." },
//         goals: { cn: "掌握增强、滤波、PCA变换及监督/非监督分类。", en: "Enhancement, Filtering, PCA, Classification." },
//         logicTree: {
//           label: { cn: "DIP 算法库", en: "DIP Algorithms" },
//           children: [
//             {
//               label: { cn: "1. 增强与复原", en: "1. Enhancement" },
//               children: [
//                 { label: { cn: "对比度", en: "Contrast" }, desc: { cn: "线性拉伸(2%截断)、直方图均衡化(非线性，最大熵)。", en: "Linear stretch, Histogram Eq." } },
//                 { label: { cn: "滤波", en: "Filtering" }, desc: { cn: "低通(均值/中值)去噪；高通(Sobel/Laplacian)锐化。", en: "Low-pass (Denoise), High-pass (Sharpen)." }, heavy: true }
//               ]
//             },
//             {
//               label: { cn: "2. 特征变换", en: "2. Transform" },
//               children: [
//                 { label: { cn: "PCA", en: "PCA" }, desc: { cn: "K-L变换：基于统计特性的去相关与降维(第一分量包含主要信息)。", en: "K-L Transform: Decorrelation/Compression." }, heavy: true },
//                 { label: { cn: "缨帽变换", en: "Tasseled Cap" }, desc: { cn: "物理意义变换：亮度(Soil)、绿度(Veg)、湿度(Water)。", en: "Brightness, Greenness, Wetness." } }
//               ]
//             },
//             {
//               label: { cn: "3. 图像分类", en: "3. Classification" },
//               children: [
//                 { label: { cn: "监督", en: "Supervised" }, desc: { cn: "最大似然法(MLC, 正态假设)、SVM(小样本, 非线性)。", en: "MLC (Normal dist), SVM (Non-linear)." }, heavy: true },
//                 { label: { cn: "非监督", en: "Unsupervised" }, desc: { cn: "K-means / ISODATA (迭代聚类，数据驱动)。", en: "Iterative clustering." } },
//                 { label: { cn: "精度", en: "Accuracy" }, desc: { cn: "总体精度(OA)、用户/制图精度、Kappa系数。", en: "OA, UA/PA, Kappa." } }
//               ]
//             }
//           ]
//         },
//         terms: [
//           { cn: "直方图", en: "Histogram", desc_cn: "描述图像中各灰度级像素出现频率的统计图。", desc_en: "Frequency distribution of pixel values." },
//           { cn: "卷积", en: "Convolution", desc_cn: "利用滑动窗口(Kernel)对图像进行加权求和的运算，实现滤波。", desc_en: "Sliding window weighted sum operation." },
//           { cn: "混淆矩阵", en: "Confusion Matrix", desc_cn: "通过对比分类结果与地面真值来评价分类精度的矩阵。", desc_en: "Table comparing result vs truth for accuracy." },
//           { cn: "主成分分析", en: "PCA", desc_cn: "通过正交变换将多波段数据压缩为少数几个不相关的分量，去除冗余。", desc_en: "Decorrelation and dimensionality reduction." }
//         ]
//       },
//       {
//         id: "c8",
//         name: "Remote Sensing Image Interpretation (遥感图像解译)",
//         summary: { cn: "从影像中提取语义信息的理论与方法，结合地学知识。", en: "Extracting semantic info from imagery combined with geo-knowledge." },
//         goals: { cn: "掌握目视解译八大要素及地学分析逻辑。", en: "Visual interpretation keys & Geo-analysis logic." },
//         logicTree: {
//           label: { cn: "解译方法论", en: "Interpretation" },
//           children: [
//             {
//               label: { cn: "1. 目视解译", en: "1. Visual Keys" },
//               children: [
//                 { label: { cn: "基础要素", en: "Elements" }, desc: { cn: "色调(Tone)、颜色(Color)是最基本标志；形状(Shape)、大小(Size)。", en: "Tone/Color are fundamental; Shape/Size." }, heavy: true },
//                 { label: { cn: "空间要素", en: "Spatial" }, desc: { cn: "纹理(Texture)、阴影(Shadow)、图型(Pattern)。", en: "Texture, Shadow, Pattern." } },
//                 { label: { cn: "相关要素", en: "Association" }, desc: { cn: "位置(Site)、布局(Association)等逻辑推理。", en: "Contextual reasoning." } }
//               ]
//             },
//             {
//               label: { cn: "2. 地学分析", en: "2. Geo-Analysis" },
//               children: [
//                 { label: { cn: "水系", en: "Drainage" }, desc: { cn: "树枝状(均质岩性) vs 格状(断裂控制)。", en: "Dendritic (Homogeneous) vs Trellis (Faults)." } },
//                 { label: { cn: "地貌", en: "Landform" }, desc: { cn: "冲积扇(扇形)、三角洲(河口)、滑坡体(圈椅状)形态特征。", en: "Alluvial fans, Deltas, Landslides." } }
//               ]
//             },
//             {
//               label: { cn: "3. 计算机视觉", en: "3. CV & AI" },
//               children: [
//                 { label: { cn: "OBIA", en: "OBIA" }, desc: { cn: "面向对象：先分割(Segment)生成对象，再基于形状纹理分类。", en: "Segment first, then classify." }, heavy: true },
//                 { label: { cn: "语义分割", en: "Semantic Seg" }, desc: { cn: "利用U-Net等深度学习网络进行端到端像素级提取。", en: "End-to-end extraction via U-Net." } }
//               ]
//             }
//           ]
//         },
//         terms: [
//           { cn: "二分检索表", en: "Dichotomous Key", desc_cn: "通过一系列二选一的问题逐步缩小范围的分类工具。", desc_en: "Step-by-step identification tool." },
//           { cn: "纹理", en: "Texture", desc_cn: "图像色调变化的频率和空间排列规律，反映地表粗糙度。", desc_en: "Spatial arrangement of tonal variations." },
//           { cn: "面向对象分析", en: "OBIA", desc_cn: "以图像对象而非单个像素为基本单元的分析方法，利用形状和上下文信息。", desc_en: "Object-Based Image Analysis." },
//           { cn: "水系格局", en: "Drainage Pattern", desc_cn: "河流在流域内的空间排列形式，常用于推断地质构造。", desc_en: "Spatial arrangement of streams reflecting geology." }
//         ]
//       },
//       {
//         id: "c9",
//         name: "Remote Sensing Application Model (遥感应用模型)",
//         summary: { cn: "将遥感数据转化为地学参数的数学物理模型，如NPP、ET。", en: "Math/Physical models converting RS data to parameters like NPP, ET." },
//         goals: { cn: "理解经验模型、物理模型及数据同化。", en: "Empirical/Physical models & Data Assimilation." },
//         logicTree: {
//           label: { cn: "建模与反演", en: "Modeling" },
//           children: [
//             {
//               label: { cn: "1. 模型分类", en: "1. Model Types" },
//               children: [
//                 { label: { cn: "统计模型", en: "Statistical" }, desc: { cn: "回归分析(Regression)，简单但在地性强，普适性差。", en: "Simple, local, low generalizability." } },
//                 { label: { cn: "物理模型", en: "Physical" }, desc: { cn: "基于辐射传输方程(RTE)，如PROSAIL(植被)，复杂但通用。", en: "RTE-based (PROSAIL), complex but general." }, heavy: true }
//               ]
//             },
//             {
//               label: { cn: "2. 典型模型", en: "2. Examples" },
//               children: [
//                 { label: { cn: "NPP模型", en: "NPP (CASA)" }, desc: { cn: "光能利用率模型：NPP = PAR × FPAR × ε。", en: "Light Use Efficiency model." } },
//                 { label: { cn: "蒸散发", en: "ET (SEBAL)" }, desc: { cn: "地表能量平衡：Rn - G - H = LE (潜热通量)。", en: "Surface Energy Balance residual." } }
//               ]
//             },
//             {
//               label: { cn: "3. 数据同化", en: "3. Assimilation" },
//               children: [
//                 { label: { cn: "原理", en: "Principle" }, desc: { cn: "结合陆面过程模型与遥感观测，优化状态变量。", en: "Merging Land Model & Observation." }, heavy: true },
//                 { label: { cn: "方法", en: "Methods" }, desc: { cn: "卡尔曼滤波(Kalman Filter)、变分法(3D/4D-Var)。", en: "Kalman Filter, Variational methods." } }
//               ]
//             }
//           ]
//         },
//         terms: [
//           { cn: "反演", en: "Inversion", desc_cn: "从观测信号(如反射率)推导状态参数(如LAI)的过程，通常是病态的。", desc_en: "Deriving parameters from signals." },
//           { cn: "数据同化", en: "Data Assimilation", desc_cn: "融合模型模拟与观测数据，以提高预测精度的技术。", desc_en: "Merging model & observation." },
//           { cn: "净初级生产力", en: "NPP", desc_cn: "绿色植物在单位时间和单位面积上通过光合作用固定的有机碳总量扣除自养呼吸后的剩余部分。", desc_en: "Net Primary Productivity." },
//           { cn: "查找表", en: "LUT", desc_cn: "预先计算好的模型输入输出数据库，用于加速物理模型反演。", desc_en: "Look-Up Table." }
//         ]
//       },
//       {
//         id: "c10",
//         name: "Lecture on Frontiers of RS Knowledge",
//         summary: { cn: "探索遥感技术的最新发展趋势与前沿技术。", en: "Exploring latest trends and frontiers in RS." },
//         goals: { cn: "了解高光谱、激光雷达、大数据及深度学习应用。", en: "Hyperspectral, LiDAR, Big Data, Deep Learning." },
//         logicTree: {
//           label: { cn: "前沿技术", en: "Frontiers" },
//           children: [
//             {
//               label: { cn: "1. 高光谱", en: "1. Hyperspectral" },
//               children: [
//                 { label: { cn: "图谱合一", en: "Imaging Spec" }, desc: { cn: "数百个连续窄波段，能识别矿物成分。", en: "Hundreds of bands for material ID." } },
//                 { label: { cn: "处理难点", en: "Challenges" }, desc: { cn: "维数灾难(Hughes)与混合像元分解(Unmixing)。", en: "Hughes phenomenon & Unmixing." }, heavy: true }
//               ]
//             },
//             {
//               label: { cn: "2. LiDAR", en: "2. LiDAR" },
//               children: [
//                 { label: { cn: "原理", en: "Principle" }, desc: { cn: "主动激光测距，获取三维点云。", en: "Active laser ranging for 3D clouds." } },
//                 { label: { cn: "波形", en: "Waveform" }, desc: { cn: "全波形记录反映植被垂直结构。", en: "Vertical structure of vegetation." } }
//               ]
//             },
//             {
//               label: { cn: "3. 智能计算", en: "3. AI & Cloud" },
//               children: [
//                 { label: { cn: "深度学习", en: "Deep Learning" }, desc: { cn: "CNN提取特征，Transformer处理序列。", en: "CNN/Transformer." } },
//                 { label: { cn: "GEE", en: "Google Earth Engine" }, desc: { cn: "行星级尺度的云计算平台。", en: "Planetary-scale cloud computing." } }
//               ]
//             }
//           ]
//         },
//         terms: [
//           { cn: "端元", en: "Endmember", desc_cn: "组成混合像元的纯净物质光谱。", desc_en: "Pure pixel spectrum." },
//           { cn: "数字孪生", en: "Digital Twin", desc_cn: "现实世界的虚拟数字化镜像，支持模拟与预测。", desc_en: "Virtual replica for simulation." },
//           { cn: "维数灾难", en: "Hughes Phenomenon", desc_cn: "在高光谱分类中，随着波段数增加，若训练样本有限，分类精度反而下降的现象。", desc_en: "Accuracy drop with high dimensions." },
//           { cn: "混合像元", en: "Mixed Pixel", desc_cn: "一个像元内包含多种地物类型的现象。", desc_en: "Pixel containing multiple land covers." }
//         ]
//       }
//     ]
//   },
//   {
//     category: "实践与实习 (Practicals)",
//     courses: [
//       {
//         id: "c11",
//         name: "Comprehensive Internship in RS Applications (遥感应用综合实习)",
//         summary: { cn: "综合运用遥感技术解决具体行业问题的全流程实践。", en: "End-to-end practice solving industry problems." },
//         goals: { cn: "独立完成选题、数据处理、分析及报告撰写。", en: "Project: Topic -> Data -> Analysis -> Report." },
//         logicTree: {
//           label: { cn: "项目全周期", en: "Project Cycle" },
//           children: [
//             {
//               label: { cn: "1. 设计与获取", en: "1. Design" },
//               children: [
//                 { label: { cn: "需求分析", en: "Needs" }, desc: { cn: "明确解决什么问题(如: 某市水体变化)。", en: "Define the problem (e.g. Water change)." } },
//                 { label: { cn: "数据源", en: "Data" }, desc: { cn: "Landsat(历史长), Sentinel(高分), MODIS(高频)。", en: "Select appropriate sensors." } }
//               ]
//             },
//             {
//               label: { cn: "2. 处理与分析", en: "2. Execution" },
//               children: [
//                 { label: { cn: "预处理链", en: "Chain" }, desc: { cn: "辐射定标 -> 大气校正 -> 几何配准 -> 裁剪。", en: "Cal -> Atm -> Reg -> Clip." }, heavy: true },
//                 { label: { cn: "专题提取", en: "Extraction" }, desc: { cn: "指数计算(MNDWI) -> 阈值分割 -> 矢量化。", en: "Indices -> Threshold -> Vector." } }
//               ]
//             },
//             {
//               label: { cn: "3. 成果产出", en: "3. Output" },
//               children: [
//                 { label: { cn: "精度验证", en: "Validation" }, desc: { cn: "利用Google Earth高分影像或野外点验证。", en: "Validate via High-res or Field data." } },
//                 { label: { cn: "制图", en: "Mapping" }, desc: { cn: "添加图例、比例尺、指北针，撰写分析报告。", en: "Cartography & Reporting." } }
//               ]
//             }
//           ]
//         },
//         terms: [
//           { cn: "转移矩阵", en: "Transition Matrix", desc_cn: "量化不同时期土地利用类型之间相互转化的面积。", desc_en: "Quantifying area changes between classes." },
//           { cn: "地面实测", en: "Ground Truth", desc_cn: "用于训练模型或验证结果的真实地面数据。", desc_en: "Real data for training/validation." },
//           { cn: "专题图", en: "Thematic Map", desc_cn: "表现特定主题(如植被分布)的地图。", desc_en: "Theme specific map." },
//           { cn: "投资回报率", en: "ROI", desc_cn: "衡量项目效益的指标(Return on Investment)。", desc_en: "Measure of project profitability." }
//         ]
//       },
//       {
//         id: "c12",
//         name: "Practice of RS Principles and Applications (遥感原理与应用实验)",
//         summary: { cn: "配合理论课的软件操作实验(ENVI/ArcGIS)。", en: "Software lab sessions (ENVI/ArcGIS) supporting theory." },
//         goals: { cn: "熟悉商用软件界面，掌握基础处理流程操作。", en: "Master ENVI/ArcGIS basic workflows." },
//         logicTree: {
//           label: { cn: "实验操作流", en: "Lab Workflow" },
//           children: [
//             {
//               label: { cn: "1. 基础操作", en: "1. Basic Ops" },
//               children: [
//                 { label: { cn: "数据显示", en: "Display" }, desc: { cn: "波段组合(真彩色vs标准假彩色)。", en: "Band Composites (True vs False Color)." } },
//                 { label: { cn: "统计特征", en: "Stats" }, desc: { cn: "查看DN值分布、散点图分析波段相关性。", en: "Histograms & Scatter plots." } }
//               ]
//             },
//             {
//               label: { cn: "2. 核心实验", en: "2. Core Labs" },
//               children: [
//                 { label: { cn: "几何校正", en: "Geo Corr" }, desc: { cn: "选取地面控制点(GCP)进行配准。", en: "Registration using GCPs." }, heavy: true },
//                 { label: { cn: "图像融合", en: "Fusion" }, desc: { cn: "全色与多光谱融合(Gram-Schmidt)。", en: "Pan-sharpening." } },
//                 { label: { cn: "分类实验", en: "Class Lab" }, desc: { cn: "建立ROI，执行最大似然分类。", en: "ROI & MLC Classification." } }
//               ]
//             }
//           ]
//         },
//         terms: [
//           { cn: "GCP", en: "Ground Control Point", desc_cn: "地面控制点，用于几何校正的已知坐标点。", desc_en: "Known points used for geo-correction." },
//           { cn: "ROI", en: "Region of Interest", desc_cn: "感兴趣区，常用于训练样本选取。", desc_en: "Selected samples for training." },
//           { cn: "假彩色", en: "False Color", desc_cn: "将不可见光波段(如NIR)赋予红/绿/蓝通道显示，使植被呈红色。", desc_en: "Mapping invisible bands to RGB." },
//           { cn: "全色锐化", en: "Pan-sharpening", desc_cn: "融合高分辨率全色影像与低分辨率多光谱影像。", desc_en: "Fusing Pan and MS images." }
//         ]
//       },
//       {
//         id: "c13",
//         name: "Internship in RS Image Processing (遥感图像处理综合实习)",
//         summary: { cn: "专注编程实现(Python/Matlab)或高级算法的实习。", en: "Focus on programming (Python/Matlab) & algorithms." },
//         goals: { cn: "利用GDAL/OpenCV库实现图像I/O与算法。", en: "Implement I/O & algos via GDAL/OpenCV." },
//         logicTree: {
//           label: { cn: "编程实践", en: "Coding Lab" },
//           children: [
//             {
//               label: { cn: "1. 环境与I/O", en: "1. Env & I/O" },
//               children: [
//                 { label: { cn: "库配置", en: "Libraries" }, desc: { cn: "GDAL(栅格处理), Numpy(矩阵运算), Matplotlib(绘图)。", en: "GDAL, Numpy, Matplotlib." } },
//                 { label: { cn: "数据读取", en: "Reading" }, desc: { cn: "读取GeoTIFF头文件(投影/坐标)与数据块。", en: "Read GeoTIFF header & data block." } }
//               ]
//             },
//             {
//               label: { cn: "2. 算法实现", en: "2. Algo Impl" },
//               children: [
//                 { label: { cn: "波段运算", en: "Band Math" }, desc: { cn: "数组操作实现NDVI = (NIR-R)/(NIR+R)。", en: "Array ops for indices." } },
//                 { label: { cn: "底层算法", en: "Core Algo" }, desc: { cn: "手写K-means迭代循环或边缘检测卷积。", en: "Coding K-means or Convolution." }, heavy: true }
//               ]
//             },
//             {
//               label: { cn: "3. 批处理", en: "3. Batch" },
//               children: [
//                 { label: { cn: "自动化", en: "Automation" }, desc: { cn: "os.walk遍历文件夹，批量裁剪/投影转换。", en: "Loop folders, batch clip/reproject." } }
//               ]
//             }
//           ]
//         },
//         terms: [
//           { cn: "GDAL", en: "Geospatial Data Abstraction Library", desc_cn: "处理栅格空间数据的核心开源库(读写/转换)。", desc_en: "Core open-source lib for raster I/O." },
//           { cn: "Numpy", en: "Numerical Python", desc_cn: "Python科学计算库，提供高效的多维数组对象。", desc_en: "Efficient array computing lib." },
//           { cn: "栅格代数", en: "Raster Algebra", desc_cn: "对栅格图像进行的逐像元数学运算。", desc_en: "Math operations on raster pixels." },
//           { cn: "迭代", en: "Iteration", desc_cn: "重复执行一系列步骤直到满足条件(如K-means收敛)。", desc_en: "Repeating steps until convergence." }
//         ]
//       },
//       {
//         id: "c14",
//         name: "RS Application Model Internship (遥感应用模型实习)",
//         summary: { cn: "构建定量反演模型（如估产、生物量、水质）。", en: "Building quantitative retrieval models (Yield, Biomass)." },
//         goals: { cn: "掌握数据回归分析、模型构建与精度验证。", en: "Regression, Modeling, and Validation." },
//         logicTree: {
//           label: { cn: "定量建模流", en: "Quant Modeling" },
//           children: [
//             {
//               label: { cn: "1. 数据匹配", en: "1. Matching" },
//               children: [
//                 { label: { cn: "时空一致", en: "Consistency" }, desc: { cn: "影像过境时间与地面采样时间尽量接近。", en: "Sync Satellite & Ground time." }, heavy: true },
//                 { label: { cn: "坐标提取", en: "Extract" }, desc: { cn: "根据GPS坐标提取对应像元的光谱值。", en: "Extract pixel DN by GPS coords." } }
//               ]
//             },
//             {
//               label: { cn: "2. 回归建模", en: "2. Regression" },
//               children: [
//                 { label: { cn: "特征分析", en: "Correlation" }, desc: { cn: "计算皮尔逊相关系数，筛选敏感波段。", en: "Pearson correlation, band selection." } },
//                 { label: { cn: "模型构建", en: "Build" }, desc: { cn: "一元线性/多元回归/随机森林回归。", en: "Linear/Multi-Regression/RF." } }
//               ]
//             },
//             {
//               label: { cn: "3. 验证应用", en: "3. Validation" },
//               children: [
//                 { label: { cn: "留一法", en: "LOOCV" }, desc: { cn: "交叉验证(Cross Validation)评估模型稳定性。", en: "Cross-validation." } },
//                 { label: { cn: "评价指标", en: "Metrics" }, desc: { cn: "R²(拟合优度), RMSE(均方根误差)。", en: "R-squared, RMSE." } }
//               ]
//             }
//           ]
//         },
//         terms: [
//           { cn: "决定系数", en: "R-squared", desc_cn: "表示模型对观测数据变异性的解释程度(0-1)。", desc_en: "Variance explained by model." },
//           { cn: "留一交叉验证", en: "LOOCV", desc_cn: "每次留一个样本做验证，其余做训练，循环N次。", desc_en: "Leave-One-Out Cross-Validation." },
//           { cn: "均方根误差", en: "RMSE", desc_cn: "预测值与真实值偏差的平方和平均值的平方根。", desc_en: "Root Mean Square Error." },
//           { cn: "相关系数", en: "Correlation Coefficient", desc_cn: "衡量两个变量线性相关程度的指标。", desc_en: "Measure of linear correlation." }
//         ]
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

const BiText = ({ cn, en, label }) => {
  const [lang, setLang] = useState('cn');
  return (
    <div className="relative group">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <h4 className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</h4>
          <button onClick={() => setLang(l => l === 'cn' ? 'en' : 'cn')} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-mono text-slate-500 hover:text-teal-600 transition-colors border border-slate-200">
            <RefreshCw className="w-3 h-3" /><span>{lang === 'cn' ? '中' : 'EN'}</span>
          </button>
        </div>
      )}
      {!label && (
        <button onClick={(e) => { e.stopPropagation(); setLang(l => l === 'cn' ? 'en' : 'cn'); }} className="absolute top-2 right-2 p-1.5 rounded-md bg-white text-slate-400 border border-slate-200 shadow-sm z-10">
          <Languages className="w-3.5 h-3.5" />
        </button>
      )}
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
        <div 
          onClick={() => hasChildren && setIsExpanded(!isExpanded)}
          className={`relative p-3 rounded-xl border transition-all duration-200 w-full max-w-[90vw] ${level === 0 ? 'bg-teal-50 border-teal-200 shadow-sm' : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-md'} ${hasChildren ? 'cursor-pointer' : ''}`}
        >
          {node.heavy && <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full z-10 shadow-sm"><Zap className="w-3 h-3 inline mr-0.5" /> Core</div>}
          <div className="flex justify-between items-start">
            <div className="pr-8 flex-1 min-w-0">
              <h4 className={`font-bold text-sm ${level === 0 ? 'text-teal-800' : 'text-slate-800'} break-words whitespace-normal`}>{label}</h4>
              {desc && <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words whitespace-normal">{desc}</p>}
            </div>
            <div className="absolute top-3 right-3 flex gap-1 items-center">
               <button onClick={toggleLocalLang} className="p-1 rounded-full text-slate-300 hover:text-teal-600 hover:bg-slate-100"><Languages className="w-3.5 h-3.5" /></button>
               {hasChildren && <div className={`p-1 rounded-full text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}><ChevronDown className="w-4 h-4" /></div>}
            </div>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-2">
            {node.children.map((child, idx) => (
              <LogicNode key={idx} node={child} level={level + 1} isLast={idx === node.children.length - 1} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const LogicTreeContainer = ({ data }) => {
  const [lang, setLang] = useState('cn');
  if (!data?.children) return <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-xl">暂无导图</div>;
  return (
    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 overflow-x-auto scrollbar-hide">
      <div className="flex justify-between items-center mb-4 px-1 min-w-[260px]">
        <div className="flex items-center text-xs font-bold text-slate-400 uppercase"><Network className="w-3.5 h-3.5 mr-1.5" /> Logic</div>
        <button onClick={() => setLang(l => l === 'cn' ? 'en' : 'cn')} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white border shadow-sm text-xs text-slate-600"><RefreshCw className="w-3.5 h-3.5 mr-1" />{lang === 'cn' ? '全译' : 'All'}</button>
      </div>
      <div className="-ml-1 min-w-max"><LogicNode node={data} level={0} isLast={true} lang={lang} /></div>
    </div>
  );
};

// ============================================================================
// 5. 新增：打卡日历组件
// ============================================================================

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
  
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const handleDayClick = (day) => {
    if (!day) return;
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    setSelectedDateLog({ date: dateStr, content: history[dateStr] || "暂无打卡记录" });
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 bg-teal-600 text-white flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><CalendarDays className="w-5 h-5"/> 学习日历</h3>
          <button onClick={onClose}><X className="w-5 h-5"/></button>
        </div>
        
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
                <div 
                  key={i} 
                  onClick={() => handleDayClick(day)}
                  className={`
                    aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all relative
                    ${isToday ? 'border-2 border-teal-500 text-teal-600 font-bold' : ''}
                    ${isChecked ? 'bg-teal-100 text-teal-800 font-bold' : 'hover:bg-slate-100 text-slate-600'}
                  `}
                >
                  {day}
                  {isChecked && <div className="absolute bottom-1 w-1 h-1 bg-teal-500 rounded-full"></div>}
                </div>
              );
            })}
          </div>

          {selectedDateLog && (
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                <span className="text-xs font-bold text-slate-500">{selectedDateLog.date}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{selectedDateLog.content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 6. 页面组件 (NoteCard, NoteReader, CourseModal, etc.)
// ============================================================================

const Toast = ({ message, onClose }) => {
  useEffect(() => { const timer = setTimeout(onClose, 2000); return () => clearTimeout(timer); }, [onClose]);
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 z-[100] animate-in fade-in slide-in-from-top-4 backdrop-blur-sm">
      <CheckCircle className="w-5 h-5 text-teal-400" /><span className="text-sm font-medium">{message}</span>
    </div>
  );
};

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
            onDelete(note.id); // 直接调用闭包函数
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

const CourseModal = ({ course, onClose, onSaveNote, onDeleteNote }) => {
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false); 
  const [viewingNote, setViewingNote] = useState(null);

  const handleAiAsk = async () => {
    if (!aiQuery.trim()) return;
    setLoading(true);
    setIsSaved(false); 
    const res = await callGemini(`背景：APS审核。课程：${course.name}。问题：${aiQuery}。请用中文回答，术语附带英文，公式用$$格式(独立行)，表格用Markdown格式。`);
    setAiResponse(res);
    setLoading(false);
  };

  const handleSave = () => {
    onSaveNote(course.id, aiQuery, aiResponse);
    setIsSaved(true); 
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

          {course.notes && course.notes.length > 0 && (
            <div>
              <h4 className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-wider mb-4"><StickyNote className="w-4 h-4 mr-2" /> 学习笔记 ({course.notes.length})</h4>
              <div className="grid grid-cols-1 gap-3">
                {course.notes.map((note) => (
                  <NoteCard 
                    key={note.id} 
                    note={note} 
                    onDelete={(noteId) => onDeleteNote(course.id, noteId)} // 关键修复：确保传递 course.id
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
                  {isSaved ? <><Check className="w-4 h-4 mr-1.5" /> 已保存</> : <><Save className="w-4 h-4 mr-1.5" /> 保存到笔记</>}
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
      const saved = localStorage.getItem('aps_courses_v7'); // 升级 v7 防止旧数据冲突
      return saved ? JSON.parse(saved) : COURSE_DATA;
    } catch {
      return COURSE_DATA;
    }
  });

  useEffect(() => {
    localStorage.setItem('aps_courses_v7', JSON.stringify(coursesData));
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
        <div className="mt-auto pt-4 border-t border-slate-100 text-xs text-slate-400 px-4">APS Prep Assistant v2.5</div>
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