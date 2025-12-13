import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, CheckCircle, Brain, Target, Calendar, ChevronDown, 
  ChevronRight, Award, RefreshCw, Layers, Sparkles, X, 
  Smartphone, GraduationCap, FileText, Globe, Network, 
  Languages, Zap, Database, Camera, AlertCircle, 
  Plus, Minus, Maximize, Move, Code, Activity
} from 'lucide-react';

// -----------------------------------------------------------------------------
// Gemini API 配置
// -----------------------------------------------------------------------------
const apiKey = "AIzaSyByXIQqk0INBioBN92DLuKTNBpfHO8BhpM"; 

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

// -----------------------------------------------------------------------------
// 14门核心课程全量深度数据
// -----------------------------------------------------------------------------

const COURSE_DATA = [
  {
    category: "遥感基础类 (RS Fundamentals)",
    courses: [
      {
        id: "c1",
        name: "Principles and Applications of Remote Sensing (遥感原理与应用)",
        summary: { cn: "遥感科学基石：建立电磁波与地表交互的物理模型及成像基础。", en: "Cornerstone of RS: Physical models of EM wave-surface interaction & imaging." },
        goals: { cn: "精通电磁波谱、大气传输、地物光谱特征及四大分辨率权衡。", en: "Master EM spectrum, Atmospheric transfer, Spectral signatures, 4 Resolutions." },
        logicTree: {
          label: { cn: "遥感全链路", en: "RS Full Chain" },
          children: [
            {
              label: { cn: "1. 物理基础", en: "1. Physical Basis" },
              children: [
                { label: { cn: "辐射源", en: "Source" }, desc: { cn: "普朗克定律(黑体辐射)与太阳常数。", en: "Planck's Law & Solar Constant." }, heavy: true },
                { label: { cn: "大气传输", en: "Atmosphere" }, desc: { cn: "大气窗口(透过率)与散射(瑞利/米氏)。", en: "Atm Windows & Scattering (Rayleigh/Mie)." }, heavy: true },
                { label: { cn: "地物光谱", en: "Spectra" }, desc: { cn: "植被(红边/近红外峰)、水(吸收)、土(线性)。", en: "Veg(RedEdge), Water(Absorb), Soil(Linear)." } }
              ]
            },
            {
              label: { cn: "2. 成像系统", en: "2. Imaging" },
              children: [
                { label: { cn: "分辨率", en: "Resolutions" }, desc: { cn: "空间、光谱、辐射、时间分辨率的相互制约。", en: "Constraints: Spatial/Spectral/Rad/Temp." }, heavy: true },
                { label: { cn: "扫描方式", en: "Scanning" }, desc: { cn: "推扫式(Pushbroom, 高信噪比) vs 摆扫式(Whiskbroom)。", en: "Pushbroom (High SNR) vs Whiskbroom." } }
              ]
            },
            {
              label: { cn: "3. 处理与解译", en: "3. Proc & Interp" },
              children: [
                { label: { cn: "预处理", en: "Pre-proc" }, desc: { cn: "辐射定标、大气校正、几何校正。", en: "Rad Cal, Atm Corr, Geo Corr." } },
                { label: { cn: "图像解译", en: "Interpretation" }, desc: { cn: "目视解译八大要素与计算机分类基础。", en: "Visual Keys & Basic Classification." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "大气窗口", en: "Atmospheric Window", desc_cn: "大气透过率较高的波段，决定了传感器的通道设计。", desc_en: "Spectral bands with high transmittance guiding sensor design." },
          { cn: "光谱特征", en: "Spectral Signature", desc_cn: "地物反射率随波长变化的独特规律。", desc_en: "Unique reflectance variation with wavelength." }
        ]
      },
      {
        id: "c2",
        name: "Microwave Remote Sensing (微波遥感)",
        summary: { cn: "利用长波(微波)进行全天时、全天候的主动观测技术。", en: "All-weather active sensing using microwave bands." },
        goals: { cn: "透彻理解SAR成像几何、多普勒原理、极化分解及InSAR干涉测量。", en: "Deep understanding of SAR geometry, Doppler, PolSAR, and InSAR." },
        logicTree: {
          label: { cn: "微波体系", en: "Microwave Sys" },
          children: [
            {
              label: { cn: "1. 成像机理", en: "1. Mechanism" },
              children: [
                { label: { cn: "合成孔径", en: "SAR Principle" }, desc: { cn: "利用多普勒效应合成虚拟长天线(提高方位分辨率)。", en: "Doppler synthesis for high azimuth res." }, heavy: true },
                { label: { cn: "几何畸变", en: "Distortions" }, desc: { cn: "透视收缩、叠掩(顶底倒置)、阴影。", en: "Foreshortening, Layover, Shadow." } }
              ]
            },
            {
              label: { cn: "2. 散射特性", en: "2. Scattering" },
              children: [
                { label: { cn: "物理参数", en: "Parameters" }, desc: { cn: "粗糙度(漫反射)与介电常数(含水量)。", en: "Roughness & Dielectric Constant." } },
                { label: { cn: "极化", en: "Polarization" }, desc: { cn: "HH/HV/VV/VH 反映地物结构与方向。", en: "Polarization reflects structure." } }
              ]
            },
            {
              label: { cn: "3. 高级技术", en: "3. Advanced" },
              children: [
                { label: { cn: "InSAR", en: "Interferometry" }, desc: { cn: "相位差 -> 高程(DEM)或微小形变。", en: "Phase Diff -> DEM/Deformation." }, heavy: true },
                { label: { cn: "PolSAR", en: "Polarimetry" }, desc: { cn: "极化分解(Pauli/Freeman)提取散射机制。", en: "Decomposition for scattering mech." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "后向散射系数", en: "Backscattering Coeff (σ0)", desc_cn: "单位面积目标的散射强度，与粗糙度和介电常数有关。", desc_en: "Scattering intensity per unit area." },
          { cn: "相干斑", en: "Speckle Noise", desc_cn: "相干成像特有的椒盐噪声，需多视处理去除。", desc_en: "Salt-and-pepper noise in coherent systems." }
        ]
      },
      {
        id: "c3",
        name: "Thermal Infrared Remote Sensing (热红外遥感)",
        summary: { cn: "基于热辐射理论反演地表温度(LST)与发射率。", en: "Retrieving LST and emissivity based on thermal radiation theory." },
        goals: { cn: "掌握普朗克定律、基尔霍夫定律、分裂窗算法及城市热岛应用。", en: "Master Planck's Law, Kirchhoff, Split-Window, UHI." },
        logicTree: {
          label: { cn: "热红外反演", en: "TIR Retrieval" },
          children: [
            {
              label: { cn: "1. 物理定律", en: "1. Physics Laws" },
              children: [
                { label: { cn: "基础定律", en: "Basics" }, desc: { cn: "普朗克定律(能量分布)、斯蒂芬-玻尔兹曼定律(总能量)。", en: "Planck's & Stefan-Boltzmann Law." } },
                { label: { cn: "基尔霍夫定律", en: "Kirchhoff" }, desc: { cn: "热平衡时：发射率 = 吸收率。", en: "Emissivity = Absorptivity." }, heavy: true }
              ]
            },
            {
              label: { cn: "2. 反演难点", en: "2. Challenges" },
              children: [
                { label: { cn: "病态问题", en: "Ill-posed" }, desc: { cn: "N个波段解N+1个未知数(1温度+N发射率)。", en: "N bands vs N+1 unknowns." }, heavy: true },
                { label: { cn: "大气影响", en: "Atm Effects" }, desc: { cn: "水汽对热红外有强烈吸收。", en: "Strong water vapor absorption." } }
              ]
            },
            {
              label: { cn: "3. 算法模型", en: "3. Algorithms" },
              children: [
                { label: { cn: "分裂窗算法", en: "Split-Window" }, desc: { cn: "利用双通道(11/12μm)吸收差异消大气。", en: "Diff absorption in dual channels." }, heavy: true },
                { label: { cn: "TES算法", en: "TES" }, desc: { cn: "温度与发射率分离算法。", en: "Temp-Emissivity Separation." } }
              ]
            },
            {
              label: { cn: "4. 应用", en: "4. Apps" },
              children: [
                { label: { cn: "热岛效应", en: "UHI" }, desc: { cn: "城市不透水面导致高温。", en: "Urban Heat Island." } },
                { label: { cn: "林火/矿物", en: "Fire/Mineral" }, desc: { cn: "高温异常探测与岩石识别。", en: "Thermal anomalies & Rock ID." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "发射率", en: "Emissivity", desc_cn: "物体辐射能力与同温黑体之比(0-1)。", desc_en: "Ratio of radiation to blackbody (0-1)." },
          { cn: "亮温", en: "Brightness Temp", desc_cn: "假设物体为黑体时的观测温度。", desc_en: "Temp assuming object is a blackbody." }
        ]
      },
      {
        id: "c4",
        name: "Remote Sensing of Natural Disasters (自然灾害遥感)",
        summary: { cn: "利用多源遥感进行灾害预警、评估与应急响应。", en: "Disaster warning, assessment, and response using RS." },
        goals: { cn: "掌握洪水(SAR)、地震(InSAR)、火灾(MIR)的监测机理。", en: "Mechanisms for Flood, Earthquake, and Fire monitoring." },
        logicTree: {
          label: { cn: "灾害响应链", en: "Disaster Chain" },
          children: [
            {
              label: { cn: "1. 洪涝监测", en: "1. Flood" },
              children: [
                { label: { cn: "原理", en: "Principle" }, desc: { cn: "SAR: 镜面反射致低后向散射(暗)；光学: NDWI指数。", en: "SAR: Specular/Dark; Optical: NDWI." }, heavy: true },
                { label: { cn: "方法", en: "Method" }, desc: { cn: "Otsu阈值分割、变化矢量分析(CVA)。", en: "Otsu thresholding, CVA." } }
              ]
            },
            {
              label: { cn: "2. 地震/滑坡", en: "2. Geo-Hazard" },
              children: [
                { label: { cn: "D-InSAR", en: "D-InSAR" }, desc: { cn: "差分干涉测量提取同震形变场(条纹图)。", en: "Differential InSAR for co-seismic deformation." }, heavy: true },
                { label: { cn: "SBAS/PS-InSAR", en: "Time-Series" }, desc: { cn: "时序分析监测缓慢滑坡或沉降。", en: "Time-series for slow motion." } }
              ]
            },
            {
              label: { cn: "3. 森林火灾", en: "3. Wildfire" },
              children: [
                { label: { cn: "火点(Active)", en: "Active Fire" }, desc: { cn: "利用Planck曲线位移，中红外(3-5μm)对高温极敏感。", en: "MIR (3-5μm) highly sensitive to high temp." } },
                { label: { cn: "迹地(Scar)", en: "Burn Scar" }, desc: { cn: "NBR (归一化燃烧比率) = (NIR-SWIR)/(NIR+SWIR)。", en: "NBR index using NIR/SWIR." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "变化矢量分析", en: "CVA", desc_cn: "在多维光谱空间中计算变化的大小和方向。", desc_en: "Calculating magnitude/direction of change in spectral space." },
          { cn: "Otsu算法", en: "Otsu Method", desc_cn: "自适应阈值分割算法，常用于水体提取。", desc_en: "Auto-thresholding for segmentation." }
        ]
      },
      {
        id: "c5",
        name: "Low Altitude UAV Remote Sensing (低空无人机遥感)",
        summary: { cn: "利用无人机平台获取超高分辨率数据的技术。", en: "High-res data acquisition using UAV platforms." },
        goals: { cn: "掌握航线规划、SfM建模原理及正射影像生产流程。", en: "Flight planning, SfM modeling, DOM production." },
        logicTree: {
          label: { cn: "UAV 作业流", en: "UAV Workflow" },
          children: [
            {
              label: { cn: "1. 航测规划", en: "1. Planning" },
              children: [
                { label: { cn: "参数设计", en: "Params" }, desc: { cn: "航高(H)决定分辨率(GSD)；重叠度(Overlap)决定建模质量。", en: "H -> GSD; Overlap -> Quality." }, heavy: true },
                { label: { cn: "像控点", en: "GCPs" }, desc: { cn: "均匀分布边缘与中心，用于绝对定向。", en: "Distributed for absolute orientation." } }
              ]
            },
            {
              label: { cn: "2. SfM 建模", en: "2. SfM Algo" },
              children: [
                { label: { cn: "特征匹配", en: "Matching" }, desc: { cn: "SIFT/SURF算法提取同名特征点。", en: "SIFT/SURF feature extraction." } },
                { label: { cn: "光束法平差", en: "Bundle Adj" }, desc: { cn: "解算相机位姿和三维点坐标(稀疏点云)。", en: "Solving camera pose & sparse cloud." }, heavy: true }
              ]
            },
            {
              label: { cn: "3. 产品生产", en: "3. Products" },
              children: [
                { label: { cn: "MVS", en: "MVS" }, desc: { cn: "多视图立体匹配生成稠密点云。", en: "Dense cloud generation." } },
                { label: { cn: "DOM/DSM", en: "DOM/DSM" }, desc: { cn: "基于TIN构建数字表面模型与正射影像。", en: "TIN-based DSM & Orthophoto." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "GSD", en: "Ground Sample Distance", desc_cn: "地面采样距离，即照片上一个像素代表的实际地面大小。", desc_en: "Ground size of one pixel." },
          { cn: "SfM", en: "Structure from Motion", desc_cn: "利用二维图像序列的运动视差恢复三维结构的计算机视觉算法。", desc_en: "Reconstructing 3D from 2D image motion." }
        ]
      },
      {
        id: "c6",
        name: "Error Theory and Surveying Adjustment B (误差理论与测量平差)",
        summary: { cn: "处理观测数据误差，求取最优解的数学方法。", en: "Math methods for error handling and optimal estimation." },
        goals: { cn: "掌握误差传播定律及最小二乘法原理。", en: "Master Error Propagation & Least Squares." },
        logicTree: {
          label: { cn: "平差核心", en: "Adjustment Core" },
          children: [
            {
              label: { cn: "1. 误差性质", en: "1. Properties" },
              children: [
                { label: { cn: "分类", en: "Types" }, desc: { cn: "系统误差(函数模型改正)、偶然误差(统计处理)、粗差(剔除)。", en: "Systematic, Random, Gross." } },
                { label: { cn: "正态分布", en: "Normal Dist" }, desc: { cn: "偶然误差具有聚中性、对称性、有界性。", en: "Centrality, Symmetry, Boundedness." } }
              ]
            },
            {
              label: { cn: "2. 最小二乘法", en: "2. Least Squares" },
              children: [
                { label: { cn: "原理", en: "Principle" }, desc: { cn: "观测值改正数的平方和最小 (V^T P V = min)。", en: "Minimizing weighted sum of squared residuals." }, heavy: true },
                { label: { cn: "模型", en: "Models" }, desc: { cn: "条件平差(几何条件) vs 间接平差(选参数求解)。", en: "Conditional vs Indirect Adjustment." } }
              ]
            },
            {
              label: { cn: "3. 精度指标", en: "3. Indicators" },
              children: [
                { label: { cn: "中误差", en: "RMSE" }, desc: { cn: "衡量观测值精度的标准。", en: "Standard error." } },
                { label: { cn: "误差椭圆", en: "Error Ellipse" }, desc: { cn: "描述点位在二维平面上的精度分布。", en: "2D positional accuracy distribution." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "权", en: "Weight (P)", desc_cn: "衡量观测值相对可靠程度的指标，与方差成反比。", desc_en: "Relative reliability, inverse to variance." },
          { cn: "协方差矩阵", en: "Covariance Matrix", desc_cn: "描述多维随机变量之间相关性和精度的矩阵。", desc_en: "Matrix describing correlation and precision." }
        ]
      },
      {
        id: "c7",
        name: "Digital Image Processing (数字图像处理)",
        summary: { cn: "遥感影像的数学运算与自动化分析算法。", en: "Math operations on imagery for enhancement and analysis." },
        goals: { cn: "掌握增强、滤波、PCA变换及监督/非监督分类。", en: "Enhancement, Filtering, PCA, Classification." },
        logicTree: {
          label: { cn: "DIP 算法库", en: "DIP Algorithms" },
          children: [
            {
              label: { cn: "1. 增强与复原", en: "1. Enhancement" },
              children: [
                { label: { cn: "对比度", en: "Contrast" }, desc: { cn: "线性拉伸(2%截断)、直方图均衡化(非线性)。", en: "Linear stretch, Histogram Eq." } },
                { label: { cn: "滤波", en: "Filtering" }, desc: { cn: "低通(均值/中值)去噪；高通(Sobel/Laplacian)锐化。", en: "Low-pass (Denoise), High-pass (Sharpen)." }, heavy: true }
              ]
            },
            {
              label: { cn: "2. 特征变换", en: "2. Transform" },
              children: [
                { label: { cn: "PCA", en: "PCA" }, desc: { cn: "K-L变换：基于统计特性的去相关与降维。", en: "K-L Transform: Decorrelation/Compression." }, heavy: true },
                { label: { cn: "缨帽变换", en: "Tasseled Cap" }, desc: { cn: "物理意义变换：亮度、绿度、湿度。", en: "Brightness, Greenness, Wetness." } }
              ]
            },
            {
              label: { cn: "3. 图像分类", en: "3. Classification" },
              children: [
                { label: { cn: "监督", en: "Supervised" }, desc: { cn: "最大似然法(MLC, 正态假设)、SVM(小样本, 非线性)。", en: "MLC (Normal dist), SVM (Non-linear)." }, heavy: true },
                { label: { cn: "非监督", en: "Unsupervised" }, desc: { cn: "K-means / ISODATA (迭代聚类)。", en: "Iterative clustering." } },
                { label: { cn: "精度", en: "Accuracy" }, desc: { cn: "总体精度(OA)、用户/制图精度、Kappa系数。", en: "OA, UA/PA, Kappa." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "直方图", en: "Histogram", desc_cn: "描述图像中各灰度级像素出现频率的统计图。", desc_en: "Frequency distribution of pixel values." },
          { cn: "卷积", en: "Convolution", desc_cn: "利用滑动窗口(Kernel)对图像进行加权求和的运算。", desc_en: "Sliding window weighted sum operation." }
        ]
      },
      {
        id: "c8",
        name: "Remote Sensing Image Interpretation (遥感图像解译)",
        summary: { cn: "从影像中提取语义信息的理论与方法。", en: "Extracting semantic info from imagery." },
        goals: { cn: "掌握目视解译八大要素及地学分析逻辑。", en: "Visual interpretation keys & Geo-analysis logic." },
        logicTree: {
          label: { cn: "解译方法论", en: "Interpretation" },
          children: [
            {
              label: { cn: "1. 目视解译", en: "1. Visual Keys" },
              children: [
                { label: { cn: "基础要素", en: "Elements" }, desc: { cn: "色调(Tone)、颜色(Color)是最基本标志；形状(Shape)、大小(Size)。", en: "Tone/Color are fundamental; Shape/Size." }, heavy: true },
                { label: { cn: "空间要素", en: "Spatial" }, desc: { cn: "纹理(Texture)、阴影(Shadow)、图型(Pattern)。", en: "Texture, Shadow, Pattern." } },
                { label: { cn: "相关要素", en: "Association" }, desc: { cn: "位置(Site)、布局(Association)等逻辑推理。", en: "Contextual reasoning." } }
              ]
            },
            {
              label: { cn: "2. 地学分析", en: "2. Geo-Analysis" },
              children: [
                { label: { cn: "水系", en: "Drainage" }, desc: { cn: "树枝状(均质岩性) vs 格状(断裂控制)。", en: "Dendritic (Homogeneous) vs Trellis (Faults)." } },
                { label: { cn: "地貌", en: "Landform" }, desc: { cn: "冲积扇、三角洲、滑坡体的形态特征。", en: "Alluvial fans, Deltas, Landslides." } }
              ]
            },
            {
              label: { cn: "3. 计算机视觉", en: "3. CV & AI" },
              children: [
                { label: { cn: "OBIA", en: "OBIA" }, desc: { cn: "面向对象：先分割(Segment)生成对象，再分类。", en: "Segment first, then classify objects." }, heavy: true },
                { label: { cn: "语义分割", en: "Semantic Seg" }, desc: { cn: "利用U-Net等深度学习网络进行端到端提取。", en: "End-to-end extraction via U-Net." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "二分检索表", en: "Dichotomous Key", desc_cn: "通过一系列二选一的问题逐步缩小范围的分类工具。", desc_en: "Step-by-step identification tool." },
          { cn: "纹理", en: "Texture", desc_cn: "图像色调变化的频率和空间排列规律。", desc_en: "Spatial arrangement of tonal variations." }
        ]
      },
      {
        id: "c9",
        name: "Remote Sensing Application Model (遥感应用模型)",
        summary: { cn: "将遥感数据转化为地学参数的数学物理模型。", en: "Math/Physical models converting RS data to parameters." },
        goals: { cn: "理解经验模型、物理模型及数据同化。", en: "Empirical/Physical models & Data Assimilation." },
        logicTree: {
          label: { cn: "建模与反演", en: "Modeling" },
          children: [
            {
              label: { cn: "1. 模型分类", en: "1. Model Types" },
              children: [
                { label: { cn: "统计模型", en: "Statistical" }, desc: { cn: "回归分析(Regression)，简单但在地性强，普适性差。", en: "Simple, local, low generalizability." } },
                { label: { cn: "物理模型", en: "Physical" }, desc: { cn: "基于辐射传输方程(RTE)，如PROSAIL(植被)，复杂但通用。", en: "RTE-based (PROSAIL), complex but general." }, heavy: true }
              ]
            },
            {
              label: { cn: "2. 典型模型", en: "2. Examples" },
              children: [
                { label: { cn: "NPP模型", en: "NPP (CASA)" }, desc: { cn: "光能利用率模型：NPP = PAR × FPAR × ε。", en: "Light Use Efficiency model." } },
                { label: { cn: "蒸散发", en: "ET (SEBAL)" }, desc: { cn: "地表能量平衡：Rn - G - H = LE (潜热通量)。", en: "Surface Energy Balance residual." } }
              ]
            },
            {
              label: { cn: "3. 数据同化", en: "3. Assimilation" },
              children: [
                { label: { cn: "原理", en: "Principle" }, desc: { cn: "结合陆面过程模型与遥感观测，优化状态变量。", en: "Merging Land Model & Observation." }, heavy: true },
                { label: { cn: "方法", en: "Methods" }, desc: { cn: "卡尔曼滤波(Kalman Filter)、变分法(3D/4D-Var)。", en: "Kalman Filter, Variational methods." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "叶面积指数", en: "LAI", desc_cn: "单位地表面积上绿叶总面积的一半，植被生长的关键参数。", desc_en: "Leaf Area Index, key for vegetation." },
          { cn: "查找表", en: "LUT (Look-Up Table)", desc_cn: "预先计算好的模型输入输出数据库，用于加速物理模型反演。", desc_en: "Pre-computed database to speed up inversion." }
        ]
      },
      {
        id: "c10",
        name: "Lecture on Frontiers of Remote Sensing Knowledge (遥感知识前沿讲座)",
        summary: { cn: "探索遥感技术的最新发展趋势与前沿技术。", en: "Exploring latest trends and frontiers in RS." },
        goals: { cn: "了解高光谱、激光雷达、大数据及深度学习应用。", en: "Hyperspectral, LiDAR, Big Data, Deep Learning." },
        logicTree: {
          label: { cn: "前沿技术", en: "Frontiers" },
          children: [
            {
              label: { cn: "1. 高光谱", en: "1. Hyperspectral" },
              children: [
                { label: { cn: "图谱合一", en: "Imaging Spec" }, desc: { cn: "数百个连续窄波段，能识别矿物成分。", en: "Hundreds of bands for material ID." } },
                { label: { cn: "处理难点", en: "Challenges" }, desc: { cn: "维数灾难(Hughes)与混合像元分解。", en: "Hughes phenomenon & Unmixing." }, heavy: true }
              ]
            },
            {
              label: { cn: "2. LiDAR", en: "2. LiDAR" },
              children: [
                { label: { cn: "原理", en: "Principle" }, desc: { cn: "主动激光测距，获取三维点云。", en: "Active laser ranging for 3D clouds." } },
                { label: { cn: "全波形", en: "Full Waveform" }, desc: { cn: "记录回波完整形态，反映植被垂直结构。", en: "Vertical structure of vegetation." } }
              ]
            },
            {
              label: { cn: "3. 智能计算", en: "3. AI & Cloud" },
              children: [
                { label: { cn: "深度学习", en: "Deep Learning" }, desc: { cn: "CNN提取高维特征，Transformer处理序列。", en: "CNN for features, Transformer for seq." } },
                { label: { cn: "GEE", en: "Google Earth Engine" }, desc: { cn: "行星级尺度的云计算平台。", en: "Planetary-scale cloud computing." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "端元", en: "Endmember", desc_cn: "组成混合像元的纯净物质光谱。", desc_en: "Pure material spectrum in a mixed pixel." },
          { cn: "数字孪生", en: "Digital Twin", desc_cn: "现实世界的虚拟数字化镜像，支持模拟与预测。", desc_en: "Virtual replica for simulation." }
        ]
      },
      {
        id: "c11",
        name: "Comprehensive Internship in Remote Sensing Applications (遥感应用综合实习)",
        summary: { cn: "综合运用遥感技术解决具体行业问题的全流程实践。", en: "End-to-end practice solving industry problems." },
        goals: { cn: "独立完成选题、数据处理、分析及报告撰写。", en: "Project: Topic -> Data -> Analysis -> Report." },
        logicTree: {
          label: { cn: "项目全周期", en: "Project Cycle" },
          children: [
            {
              label: { cn: "1. 设计与获取", en: "1. Design" },
              children: [
                { label: { cn: "需求分析", en: "Needs" }, desc: { cn: "明确解决什么问题(如: 某市水体变化)。", en: "Define the problem (e.g. Water change)." } },
                { label: { cn: "数据源", en: "Data" }, desc: { cn: "Landsat(历史长), Sentinel(高分), MODIS(高频)。", en: "Select appropriate sensors." } }
              ]
            },
            {
              label: { cn: "2. 处理与分析", en: "2. Execution" },
              children: [
                { label: { cn: "预处理链", en: "Chain" }, desc: { cn: "辐射定标 -> 大气校正 -> 几何配准 -> 裁剪。", en: "Cal -> Atm -> Reg -> Clip." }, heavy: true },
                { label: { cn: "专题提取", en: "Extraction" }, desc: { cn: "指数计算(MNDWI) -> 阈值分割 -> 矢量化。", en: "Indices -> Threshold -> Vector." } }
              ]
            },
            {
              label: { cn: "3. 成果产出", en: "3. Output" },
              children: [
                { label: { cn: "精度验证", en: "Validation" }, desc: { cn: "利用Google Earth高分影像或野外点验证。", en: "Validate via High-res or Field data." } },
                { label: { cn: "制图", en: "Mapping" }, desc: { cn: "添加图例、比例尺、指北针，撰写分析报告。", en: "Cartography & Reporting." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "转移矩阵", en: "Transition Matrix", desc_cn: "量化不同时期土地利用类型之间相互转化的面积。", desc_en: "Quantifying area changes between classes." },
          { cn: "地面实测", en: "Ground Truth", desc_cn: "用于训练模型或验证结果的真实地面数据。", desc_en: "Real data for training/validation." }
        ]
      },
      {
        id: "c12",
        name: "Practice of Remote Sensing Principles and Applications (遥感原理与应用实验)",
        summary: { cn: "配合理论课的软件操作实验(ENVI/ArcGIS)。", en: "Software lab sessions (ENVI/ArcGIS) supporting theory." },
        goals: { cn: "熟悉商用软件界面，掌握基础处理流程操作。", en: "Master ENVI/ArcGIS basic workflows." },
        logicTree: {
          label: { cn: "实验操作流", en: "Lab Workflow" },
          children: [
            {
              label: { cn: "1. 基础操作", en: "1. Basic Ops" },
              children: [
                { label: { cn: "数据显示", en: "Display" }, desc: { cn: "波段组合(真彩色vs标准假彩色)。", en: "Band Composites (True vs False Color)." } },
                { label: { cn: "统计特征", en: "Stats" }, desc: { cn: "查看DN值分布、散点图分析波段相关性。", en: "Histograms & Scatter plots." } }
              ]
            },
            {
              label: { cn: "2. 核心实验", en: "2. Core Labs" },
              children: [
                { label: { cn: "几何校正", en: "Geo Corr" }, desc: { cn: "选取地面控制点(GCP)进行配准。", en: "Registration using GCPs." }, heavy: true },
                { label: { cn: "图像融合", en: "Fusion" }, desc: { cn: "全色与多光谱融合(Gram-Schmidt)。", en: "Pan-sharpening." } },
                { label: { cn: "分类实验", en: "Class Lab" }, desc: { cn: "建立ROI，执行最大似然分类。", en: "ROI & MLC Classification." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "分离度", en: "Separability", desc_cn: "Jeffries-Matusita距离，衡量训练样本在特征空间的可分性。", desc_en: "Measure of sample distinction (JM distance)." },
          { cn: "假彩色", en: "False Color", desc_cn: "将不可见光波段(如NIR)赋予红/绿/蓝通道显示。", desc_en: "Mapping invisible bands to RGB." }
        ]
      },
      {
        id: "c13",
        name: "Comprehensive Internship in Remote Sensing Image Processing (遥感图像处理综合实习)",
        summary: { cn: "专注编程实现(Python/Matlab)或高级算法的实习。", en: "Focus on programming (Python/Matlab) & algorithms." },
        goals: { cn: "利用GDAL/OpenCV库实现图像I/O与算法。", en: "Implement I/O & algos via GDAL/OpenCV." },
        logicTree: {
          label: { cn: "编程实践", en: "Coding Lab" },
          children: [
            {
              label: { cn: "1. 环境与I/O", en: "1. Env & I/O" },
              children: [
                { label: { cn: "库配置", en: "Libraries" }, desc: { cn: "GDAL(栅格处理), Numpy(矩阵运算), Matplotlib(绘图)。", en: "GDAL, Numpy, Matplotlib." } },
                { label: { cn: "数据读取", en: "Reading" }, desc: { cn: "读取GeoTIFF头文件(投影/坐标)与数据块。", en: "Read GeoTIFF header & data block." } }
              ]
            },
            {
              label: { cn: "2. 算法实现", en: "2. Algo Impl" },
              children: [
                { label: { cn: "波段运算", en: "Band Math" }, desc: { cn: "数组操作实现NDVI = (NIR-R)/(NIR+R)。", en: "Array ops for indices." } },
                { label: { cn: "底层算法", en: "Core Algo" }, desc: { cn: "手写K-means迭代循环或边缘检测卷积。", en: "Coding K-means loop or Convolution." }, heavy: true }
              ]
            },
            {
              label: { cn: "3. 批处理", en: "3. Batch" },
              children: [
                { label: { cn: "自动化", en: "Automation" }, desc: { cn: "os.walk遍历文件夹，批量裁剪/投影转换。", en: "Loop folders, batch clip/reproject." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "GDAL", en: "Geospatial Data Abstraction Library", desc_cn: "处理栅格空间数据的核心开源库(读写/转换)。", desc_en: "Core open-source lib for raster I/O." },
          { cn: "Numpy", en: "Numerical Python", desc_cn: "Python科学计算库，提供高效的多维数组对象。", desc_en: "Efficient array computing lib." }
        ]
      },
      {
        id: "c14",
        name: "Remote Sensing Application Model Internship (遥感应用模型实习)",
        summary: { cn: "构建定量反演模型（如估产、生物量、水质）。", en: "Building quantitative retrieval models (Yield, Biomass)." },
        goals: { cn: "掌握数据回归分析、模型构建与精度验证。", en: "Regression, Modeling, and Validation." },
        logicTree: {
          label: { cn: "定量建模流", en: "Quant Modeling" },
          children: [
            {
              label: { cn: "1. 数据匹配", en: "1. Matching" },
              children: [
                { label: { cn: "时空一致", en: "Consistency" }, desc: { cn: "影像过境时间与地面采样时间尽量接近。", en: "Sync Satellite & Ground time." }, heavy: true },
                { label: { cn: "坐标提取", en: "Extract" }, desc: { cn: "根据GPS坐标提取对应像元的光谱值。", en: "Extract pixel DN by GPS coords." } }
              ]
            },
            {
              label: { cn: "2. 回归建模", en: "2. Regression" },
              children: [
                { label: { cn: "特征分析", en: "Correlation" }, desc: { cn: "计算皮尔逊相关系数，筛选敏感波段。", en: "Pearson correlation, band selection." } },
                { label: { cn: "模型构建", en: "Build" }, desc: { cn: "一元线性/多元回归/随机森林回归。", en: "Linear/Multi-Regression/RF." } }
              ]
            },
            {
              label: { cn: "3. 验证应用", en: "3. Validation" },
              children: [
                { label: { cn: "留一法", en: "LOOCV" }, desc: { cn: "交叉验证(Cross Validation)评估模型稳定性。", en: "Cross-validation." } },
                { label: { cn: "评价指标", en: "Metrics" }, desc: { cn: "R²(拟合优度), RMSE(均方根误差)。", en: "R-squared, RMSE." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "决定系数", en: "R-squared", desc_cn: "表示模型对观测数据变异性的解释程度(0-1)。", desc_en: "Variance explained by model." },
          { cn: "留一交叉验证", en: "LOOCV", desc_cn: "每次留一个样本做验证，其余做训练，循环N次。", desc_en: "Leave-One-Out Cross-Validation." }
        ]
      }
    ]
  }
];

const QUOTES = [
  "遥感不仅仅是看图片，它是物理世界在数字空间的投影。",
  "APS考察的不是记忆力，而是你作为工程师的逻辑思维。",
  "从麦克斯韦方程组到卫星图像，中间贯穿着几何与物理的美。",
  "宁可慢一点，也要把基本概念（如分辨率、大气窗口）彻底吃透。",
  "误差理论告诉我们：真值不可求，但我们可以无限逼近。",
];

// -----------------------------------------------------------------------------
// 组件实现
// -----------------------------------------------------------------------------

const BiText = ({ cn, en, label, defaultLang = 'cn', className = "" }) => {
  const [lang, setLang] = useState(defaultLang);
  
  return (
    <div className={`relative group ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <h4 className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-wider">
            {label}
          </h4>
          <button 
            onClick={() => setLang(lang === 'cn' ? 'en' : 'cn')}
            className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-100 hover:bg-teal-50 text-xs font-mono text-slate-500 hover:text-teal-600 transition-colors border border-slate-200"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{lang === 'cn' ? '中' : 'EN'}</span>
          </button>
        </div>
      )}
      
      {!label && (
        <button 
          onClick={(e) => { e.stopPropagation(); setLang(lang === 'cn' ? 'en' : 'cn'); }}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-white/50 hover:bg-teal-50 text-slate-400 hover:text-teal-600 border border-transparent hover:border-teal-200 transition-all z-10"
          title="Switch Language"
        >
          <Languages className="w-3.5 h-3.5" />
        </button>
      )}

      <div className={`transition-opacity duration-300 ${lang === 'cn' ? 'font-sans' : 'font-sans'}`}>
        {lang === 'cn' ? cn : en}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 思维导图节点组件 (稳定性增强)
// -----------------------------------------------------------------------------
const TreeNode = ({ node, lang, isRoot = false, isLast = false }) => {
  const [expanded, setExpanded] = useState(true);
  
  if (!node) return null; // Null check

  // Safe access properties
  const label = node.label ? (node.label[lang] || node.label.cn || node.label) : "Node";
  const desc = node.desc ? (node.desc[lang] || node.desc.cn || node.desc) : "";
  const isHeavy = node.heavy || false;
  const hasChildren = node.children && Array.isArray(node.children) && node.children.length > 0;

  return (
    <div className={`relative ${!isRoot ? 'ml-10' : ''}`}>
      {!isRoot && (
        <div className="absolute -left-10 top-5 w-10 h-[2px] bg-slate-300 rounded-l-full"></div>
      )}
      {!isRoot && !isLast && (
        <div className="absolute -left-10 top-5 h-full w-[2px] bg-slate-300"></div>
      )}
      
      <div className="mb-4">
        <div className="flex items-start">
           <div className={`
              relative inline-flex flex-col items-start px-3 py-2 rounded-lg border shadow-sm transition-all duration-300 max-w-[240px] sm:max-w-[300px]
              ${isRoot 
                ? 'bg-teal-600 text-white border-teal-700' 
                : isHeavy 
                  ? 'bg-amber-50 border-amber-300 text-slate-800 ring-1 ring-amber-200' 
                  : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:shadow-md'
              }
            `}>
              {isHeavy && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm flex items-center z-10">
                  <Zap className="w-3 h-3 mr-0.5 fill-current" /> Core
                </div>
              )}

              {hasChildren && (
                 <button 
                   onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                   className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-300 text-slate-500 shadow-sm hover:text-teal-600 hover:border-teal-400 z-20 transition-transform ${expanded ? 'rotate-0' : '-rotate-90'}`}
                 >
                   {expanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                 </button>
              )}

              <span className={`font-bold text-sm ${isRoot ? 'text-white' : 'text-slate-800'}`}>
                {label}
              </span>
              {desc && (
                <span className={`text-[11px] mt-1 leading-snug whitespace-normal ${isRoot ? 'text-teal-100' : 'text-slate-500'}`}>
                  {desc}
                </span>
              )}
           </div>
        </div>
        
        {hasChildren && expanded && (
          <div className="mt-4 relative border-l-2 border-slate-200 ml-4 pl-0 pt-0 animate-in slide-in-from-left-2 duration-200">
             <div className="absolute -left-[2px] -top-4 h-6 w-[2px] bg-slate-200"></div>
             
            {node.children.map((child, idx) => (
              <div key={idx} className="relative">
                 <TreeNode 
                    node={child} 
                    lang={lang}
                    isLast={idx === node.children.length - 1} 
                 />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 无限画布容器
// -----------------------------------------------------------------------------
const LogicMindMap = ({ data }) => {
  const [lang, setLang] = useState('cn');
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialDistance, setInitialDistance] = useState(null);
  const [initialScale, setInitialScale] = useState(1);

  // Mouse Handlers
  const handlePointerDown = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    if (e.touches && e.touches.length === 2) return; // Ignore pinch

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setInitialDistance(null); 
  };

  // Touch Handlers (Pinch Zoom)
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialDistance(dist);
      setInitialScale(scale);
    } else {
      handlePointerDown(e);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialDistance !== null) {
      e.preventDefault(); 
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newScale = initialScale * (currentDist / initialDistance);
      setScale(Math.min(Math.max(0.5, newScale), 3));
    } else {
      handlePointerMove(e);
    }
  };

  if (!data || !data.label) return (
    <div className="p-8 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs text-center flex flex-col items-center justify-center h-48">
      <Network className="w-8 h-8 text-slate-300 mb-2" />
      <span className="block font-medium">暂未录入逻辑导图</span>
      <span className="text-[10px] opacity-70 mt-1">(Logic Map Not Available)</span>
    </div>
  );

  return (
    <div className="flex flex-col h-[500px] border border-slate-200 rounded-xl overflow-hidden bg-slate-50 relative group select-none shadow-inner">
      {/* Top Bar */}
      <div className="absolute top-4 left-4 z-30 flex gap-2">
         <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <Network className="w-3.5 h-3.5 mr-1.5 text-teal-600" /> Logic Map
         </div>
         <button 
            onClick={() => setLang(lang === 'cn' ? 'en' : 'cn')}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur shadow-sm text-xs font-mono text-slate-600 hover:text-teal-600 border border-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'cn' ? '中' : 'EN'}</span>
          </button>
      </div>

      {/* Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-grow w-full h-full cursor-move touch-none overflow-hidden relative bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handlePointerUp}
      >
        <div 
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
          className="absolute top-10 left-10 p-10 min-w-max"
        >
          <TreeNode node={data} lang={lang} isRoot={true} />
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-2">
        <div className="flex flex-col bg-white/90 backdrop-blur border border-slate-200 p-1 rounded-lg shadow-lg">
          <button onClick={() => setScale(s => Math.min(s + 0.2, 3))} className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"><Plus className="w-5 h-5"/></button>
          <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"><Minus className="w-5 h-5"/></button>
          <div className="h-[1px] bg-slate-200 my-1 mx-2"></div>
          <button onClick={() => { setScale(1); setPosition({x:0, y:0}); }} className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors" title="Reset View"><Maximize className="w-4 h-4"/></button>
        </div>
      </div>
      
      {/* Hint */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none opacity-40 text-[10px] text-slate-500 flex flex-col gap-1 bg-white/50 p-2 rounded-lg backdrop-blur-sm">
        <span className="flex items-center"><Move className="w-3 h-3 mr-1.5"/> Drag to Pan</span>
        <span className="flex items-center"><Maximize className="w-3 h-3 mr-1.5"/> Pinch to Zoom</span>
      </div>
    </div>
  );
};

const LoadingDots = () => (
  <div className="flex space-x-1 justify-center py-2">
    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-75"></div>
    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-150"></div>
  </div>
);

// -----------------------------------------------------------------------------
// 课程详情弹窗
// -----------------------------------------------------------------------------
const CourseModal = ({ course, onClose }) => {
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAiAsk = async () => {
    if (!aiQuery.trim()) return;
    setLoading(true);
    const prompt = `
      背景：我是一名遥感专业的学生，正在准备APS审核。
      课程：${course.name}
      我的问题：${aiQuery}
      
      请用通俗易懂的中文回答，如果有专业术语请附带英文。
    `;
    const res = await callGemini(prompt);
    setAiResponse(res);
    setLoading(false);
  };

  if (!course) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg sm:rounded-2xl rounded-t-2xl h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/80 backdrop-blur-sm sm:rounded-t-2xl shrink-0 sticky top-0 z-10">
          <div className="flex-1 mr-4">
            <h3 className="font-bold text-lg text-slate-800 leading-snug">{course.name}</h3>
            <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded mt-1.5 inline-block uppercase tracking-wide">
              APS Core Module
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="overflow-y-auto p-5 space-y-8 pb-24">
          
          {/* Summary Section */}
          <BiText 
            label={<><FileText className="w-4 h-4 mr-2" /> 一句话概述 (Summary)</>}
            cn={<div className="bg-blue-50 text-blue-900 p-4 rounded-xl text-sm leading-relaxed border border-blue-100 shadow-sm">{course.summary?.cn || "暂无描述"}</div>}
            en={<div className="bg-indigo-50 text-indigo-900 p-4 rounded-xl text-sm leading-relaxed border border-indigo-100 shadow-sm font-medium">{course.summary?.en || "No description"}</div>}
            defaultLang="cn"
          />

          {/* Goals Section */}
          <BiText 
            label={<><Target className="w-4 h-4 mr-2" /> 核心目标 (Goals)</>}
            cn={<p className="text-slate-700 text-sm leading-relaxed pl-1 border-l-2 border-teal-500 ml-1 py-1">{course.goals?.cn || "暂无目标"}</p>}
            en={<p className="text-slate-700 text-sm leading-relaxed pl-1 border-l-2 border-indigo-500 ml-1 py-1 font-medium">{course.goals?.en || "No goals"}</p>}
            defaultLang="cn"
          />

          {/* Logic Map Section */}
          <div className="py-2">
            <LogicMindMap data={course.logicTree} />
          </div>

          {/* Terminology Section */}
          {course.terms && course.terms.length > 0 && (
            <div>
              <h4 className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                <Globe className="w-4 h-4 mr-2" /> 核心术语库 (Terminology)
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {course.terms.map((term, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-teal-400 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-bold text-teal-700 text-base">{term.en}</h5>
                        <span className="inline-block mt-1.5 font-medium text-slate-600 text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{term.cn}</span>
                      </div>
                    </div>
                    <BiText 
                      cn={
                        <div className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2.5">
                          <span className="text-[10px] font-bold text-slate-400 mr-1.5 uppercase tracking-wide">Explain</span> 
                          {term.desc_cn}
                        </div>
                      }
                      en={
                        <div className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5 font-medium">
                          <span className="text-[10px] font-bold text-slate-400 mr-1.5 uppercase tracking-wide">Explain</span> 
                          {term.desc_en}
                        </div>
                      }
                      defaultLang="cn"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Assistant Section */}
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border border-purple-100 shadow-sm">
            <h4 className="flex items-center text-sm font-bold text-purple-700 uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 mr-2" /> AI 深度追问
            </h4>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="例如：为什么SAR会有阴影？"
                className="flex-grow text-sm p-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white shadow-inner"
              />
              <button 
                onClick={handleAiAsk}
                disabled={loading}
                className="bg-purple-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-md shadow-purple-200"
              >
                {loading ? "..." : "提问"}
              </button>
            </div>
            {aiResponse && (
              <div className="bg-white p-4 rounded-xl text-sm text-slate-700 leading-relaxed whitespace-pre-wrap border border-purple-100 shadow-sm animate-fade-in">
                {aiResponse}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 课程列表 (列表页)
// -----------------------------------------------------------------------------
const CourseList = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedCat, setExpandedCat] = useState("遥感基础类 (RS Fundamentals)");

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg shadow-blue-200">
        <h2 className="text-xl font-bold mb-1 flex items-center"><BookOpen className="w-5 h-5 mr-2"/> 核心课程栈</h2>
        <p className="text-blue-100 text-xs opacity-90 mt-2 font-medium">
          包含14门遥感基础类核心课程的双语逻辑树与定义库。
        </p>
      </div>

      {COURSE_DATA.map((cat, idx) => (
        <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setExpandedCat(expandedCat === cat.category ? null : cat.category)}
            className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-100"
          >
            <span className="font-bold text-slate-700 text-sm flex items-center">
              <span className="w-1.5 h-4 bg-teal-500 rounded-full mr-2"></span>
              {cat.category}
            </span>
            {expandedCat === cat.category ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>
          
          {expandedCat === cat.category && (
            <div className="p-3 grid grid-cols-1 gap-2 bg-slate-50/50">
              {cat.courses.map((course) => (
                <div 
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className="p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group flex justify-between items-center relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-teal-500 transition-colors"></div>
                  <div className="flex-grow pr-4">
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-teal-700 transition-colors leading-tight mb-1">
                      {course.name.split('(')[0]}
                    </h4>
                    <p className="text-xs text-slate-400 truncate font-medium">
                      {course.summary?.cn || "点击查看详情"}
                    </p>
                  </div>
                  <div className="flex-none">
                     <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500" />
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {selectedCourse && (
        <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// 每日打卡与模拟面试 (其他Tab页)
// -----------------------------------------------------------------------------
const DailyCheckIn = ({ streak, setStreak, lastCheckIn, setLastCheckIn }) => {
  const [reflection, setReflection] = useState("");
  const [isCheckedToday, setIsCheckedToday] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    if (lastCheckIn === today) {
      setIsCheckedToday(true);
    }
  }, [lastCheckIn]);

  const handleCheckIn = async () => {
    if (!reflection.trim()) {
      alert("请至少写下一句今天的思考感悟。");
      return;
    }
    setLoading(true);
    const today = new Date().toDateString();
    setLastCheckIn(today);
    setStreak(prev => prev + 1);
    setIsCheckedToday(true);
    const prompt = `我是一名准备APS面谈的遥感专业学生。我今天的复习感悟是：“${reflection}”。请给我一句简短的、富有哲理的鼓励（中文，50字以内）。`;
    const response = await callGemini(prompt);
    setAiFeedback(response);
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Calendar className="w-32 h-32 text-teal-600" />
      </div>
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
          <Activity className="mr-2 text-teal-600 w-5 h-5" /> 每日复盘
        </h3>
        <span className="text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full border border-teal-100 flex items-center">
          <Zap className="w-3 h-3 mr-1 fill-current" /> Day {streak}
        </span>
      </div>

      {isCheckedToday ? (
        <div className="text-center py-8 bg-green-50/50 rounded-xl border border-green-100 animate-in zoom-in duration-300 relative">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
             <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-green-800 font-bold text-sm">今日复盘已完成</p>
          {loading ? (
             <div className="mt-4"><LoadingDots /></div>
          ) : aiFeedback ? (
            <div className="mt-4 mx-4 p-4 bg-white rounded-xl text-slate-600 text-xs italic shadow-sm border border-green-100 text-left relative">
              <div className="absolute -top-2 left-4 w-4 h-4 bg-white border-t border-l border-green-100 transform rotate-45"></div>
              <div className="flex items-center gap-1.5 mb-1.5 text-teal-600 font-bold text-[10px] uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> AI Mentor
              </div>
              "{aiFeedback}"
            </div>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4 relative z-10">
          <p className="text-slate-500 text-xs font-medium">
            今天复习了什么？有什么新的理解？
          </p>
          <textarea
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm resize-none bg-slate-50 focus:bg-white transition-colors"
            rows="3"
            placeholder="e.g. 终于弄懂了直方图均衡化的数学原理..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
          <button
            onClick={handleCheckIn}
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-teal-200 flex justify-center items-center text-sm active:scale-95"
          >
            {loading ? <LoadingDots /> : "提交打卡"}
          </button>
        </div>
      )}
    </div>
  );
};

const InterviewSim = () => {
  const [qIndex, setQIndex] = useState(0);
  const [showAns, setShowAns] = useState(false);
  const QUESTIONS = [
    { q: "What is the difference between supervised and unsupervised classification?", a: "Supervised needs training samples (prior knowledge). Unsupervised relies on statistical clustering (Isodata/K-means).", hint: "Prior knowledge vs Statistics" },
    { q: "Explain the geometric distortions in SAR images.", a: "Foreshortening (slope facing radar), Layover (top imaged before bottom), Shadow (slope away from radar).", hint: "Slant range geometry" },
    { q: "Why do we need Atmospheric Correction?", a: "To remove scattering and absorption effects, retrieving surface reflectance.", hint: "Radiance to Reflectance" }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full relative overflow-hidden">
       <div className="absolute -right-12 -top-12 bg-purple-50 w-40 h-40 rounded-full z-0"></div>
      <div className="flex justify-between items-center mb-8 relative z-10">
         <h3 className="font-bold text-slate-800 text-lg flex items-center"><RefreshCw className="w-5 h-5 mr-2 text-purple-600"/> 快速问答 (Q&A)</h3>
         <span className="text-xs font-mono font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100">Q-{qIndex + 1}</span>
      </div>
      
      <div className="flex-grow relative z-10 flex flex-col justify-center">
        <h4 className="text-xl font-bold text-slate-800 mb-4 leading-snug">{QUESTIONS[qIndex].q}</h4>
        <div className="mb-6">
           <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100 uppercase tracking-wide">
             💡 Hint: {QUESTIONS[qIndex].hint}
           </span>
        </div>
        
        {showAns ? (
          <div className="bg-slate-50 p-5 rounded-2xl text-sm text-slate-700 border-l-4 border-purple-500 animate-in fade-in slide-in-from-bottom-2 shadow-sm">
            <span className="font-bold block mb-2 text-purple-700 uppercase text-xs tracking-wider">Reference Answer</span>
            {QUESTIONS[qIndex].a}
          </div>
        ) : (
          <div className="h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-xs">
            <p className="mb-2">Try to speak it out loud first...</p>
            <div className="w-8 h-1 bg-slate-200 rounded-full"></div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8 relative z-10">
        <button onClick={() => setShowAns(!showAns)} className="py-3 border border-slate-300 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-600 transition-colors">
          {showAns ? "隐藏答案" : "查看答案"}
        </button>
        <button onClick={() => {setQIndex((qIndex+1)%QUESTIONS.length); setShowAns(false);}} className="py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-sm font-bold shadow-lg shadow-slate-200 transition-all active:scale-95">
          下一题
        </button>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// App 入口
// -----------------------------------------------------------------------------
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [streak, setStreak] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [quote, setQuote] = useState(QUOTES[0]);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]), []);

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-in fade-in pb-24">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-teal-700 to-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-teal-100 relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">Ready for APS?</h1>
                <p className="text-teal-50 text-sm mb-5 opacity-90 italic leading-relaxed font-medium">"{quote}"</p>
                <div className="flex items-center text-xs font-mono font-bold bg-black/20 backdrop-blur-sm w-fit px-4 py-1.5 rounded-full border border-white/10">
                  <GraduationCap className="w-3.5 h-3.5 mr-2" /> CUG {'->'} Germany
                </div>
              </div>
              <Layers className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 rotate-12" />
            </div>

            <DailyCheckIn streak={streak} setStreak={setStreak} lastCheckIn={lastCheckIn} setLastCheckIn={setLastCheckIn} />

            <div className="grid grid-cols-2 gap-4">
              <div onClick={() => setActiveTab('courses')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-teal-400 hover:shadow-md transition-all group active:scale-95">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors text-blue-600">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-700 text-lg">核心课程栈</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">Bilingual + Logic Map</p>
              </div>
              <div onClick={() => setActiveTab('interview')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-purple-400 hover:shadow-md transition-all group active:scale-95">
                 <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors text-purple-600">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-700 text-lg">模拟面谈</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">AI 考官实时对练</p>
              </div>
            </div>
          </div>
        );
      case 'courses': return <CourseList />;
      case 'interview': return <InterviewSim />;
      default: return null;
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-slate-50 font-sans text-slate-900 max-w-md mx-auto shadow-2xl flex flex-col relative overflow-hidden">
      {/* Top Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex-none z-30 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">RS</div>
          <span className="font-bold text-slate-800 text-lg tracking-tight">Logic Prep</span>
        </div>
        <button onClick={() => setShowInstallGuide(true)} className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-slate-50 rounded-full transition-all">
          <Smartphone className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content (Scrollable) */}
      <main className="flex-1 overflow-y-auto scrollbar-hide p-6 pb-24">
        {renderContent()}
      </main>

      {/* Bottom Nav (Fixed) */}
      <nav className="bg-white border-t border-slate-200 px-6 py-3 flex-none flex justify-between items-center z-30 pb-safe sm:pb-3">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center space-y-1.5 transition-all w-16 ${activeTab === 'dashboard' ? 'text-teal-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
          <Layers className="w-6 h-6" /> <span className="text-[10px] font-bold">概览</span>
        </button>
        <button onClick={() => setActiveTab('courses')} className={`flex flex-col items-center space-y-1.5 transition-all w-16 ${activeTab === 'courses' ? 'text-teal-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
          <BookOpen className="w-6 h-6" /> <span className="text-[10px] font-bold">课程</span>
        </button>
        <button onClick={() => setActiveTab('interview')} className={`flex flex-col items-center space-y-1.5 transition-all w-16 ${activeTab === 'interview' ? 'text-teal-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
          <Award className="w-6 h-6" /> <span className="text-[10px] font-bold">实战</span>
        </button>
      </nav>

      {/* Install Guide Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white p-6 rounded-3xl max-w-sm w-full relative shadow-2xl">
             <button onClick={() => setShowInstallGuide(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"><X className="w-5 h-5" /></button>
             <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-slate-600" />
             </div>
             <h3 className="font-bold text-xl mb-2 text-slate-800">安装到手机</h3>
             <p className="text-slate-500 text-sm mb-6 leading-relaxed">
               为了获得最佳的全屏体验，请将此应用添加到主屏幕。
             </p>
             <div className="space-y-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
               <div className="flex items-start gap-3">
                 <div className="bg-white p-1.5 rounded-md shadow-sm border border-slate-200 text-blue-500"><ShareIcon /></div>
                 <p className="pt-0.5">点击浏览器底部的 <strong>"分享"</strong> 按钮。</p>
               </div>
               <div className="flex items-start gap-3">
                 <div className="bg-white p-1.5 rounded-md shadow-sm border border-slate-200 text-slate-600"><Plus className="w-4 h-4"/></div>
                 <p className="pt-0.5">选择 <strong>"添加到主屏幕"</strong> 即可。</p>
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}

// Icon Helper
const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
);