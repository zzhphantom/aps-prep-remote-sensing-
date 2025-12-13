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
const apiKey = ""; 

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
// 14门核心课程全量深度数据 (Deep Logic Expansion)
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
          label: { cn: "遥感物理链路", en: "Physical Chain" },
          children: [
            {
              label: { cn: "1. 辐射源与传输", en: "1. Source & Transfer" },
              children: [
                { label: { cn: "黑体辐射", en: "Blackbody" }, desc: { cn: "普朗克定律(Planck's Law)描述能量分布；维恩位移定律决定峰值波长。", en: "Planck's Law (Distribution) & Wien's Law (Peak Wavelength)." }, heavy: true },
                { label: { cn: "大气窗口", en: "Atm Windows" }, desc: { cn: "可见光(0.4-0.7)、近红外(0.7-1.1)、热红外(3-5/8-14)、微波(1mm-1m)。", en: "VIS, NIR, TIR (3-5/8-14um), Microwave." } },
                { label: { cn: "散射机制", en: "Scattering" }, desc: { cn: "瑞利散射(粒子<波长, 蓝天) vs 米氏散射(粒子≈波长, 云雾)。", en: "Rayleigh (Blue sky) vs Mie (Clouds/Haze)." } }
              ]
            },
            {
              label: { cn: "2. 地物光谱响应", en: "2. Spectral Response" },
              children: [
                { label: { cn: "植被", en: "Vegetation" }, desc: { cn: "可见光吸收(叶绿素)、近红外高反(细胞结构)、红边效应。", en: "VIS absorption (Chlorophyll), NIR reflection (Cell), Red Edge." }, heavy: true },
                { label: { cn: "水体", en: "Water" }, desc: { cn: "近红外/短波红外强吸收；叶绿素/悬浮物增加可见光反射。", en: "NIR/SWIR absorption; Chl/Sediment increases VIS reflection." } },
                { label: { cn: "土壤", en: "Soil" }, desc: { cn: "反射率随波长线性增加；受含水量、有机质、粗糙度影响。", en: "Linear increase; affected by moisture, organic matter." } }
              ]
            },
            {
              label: { cn: "3. 传感器特性", en: "3. Sensor Traits" },
              children: [
                { label: { cn: "四大分辨率", en: "Resolutions" }, desc: { cn: "空间(IFOV)、光谱(波段宽窄)、辐射(SNR/位数)、时间(重访)。", en: "Spatial, Spectral (Bandwidth), Radiometric (Bit depth), Temporal." }, heavy: true },
                { label: { cn: "扫描几何", en: "Geometry" }, desc: { cn: "全景畸变、全景投影差、地球自转影响。", en: "Panoramic distortion, Earth rotation skew." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "红边", en: "Red Edge", desc_cn: "植被在0.7μm附近反射率急剧上升的区域，反映植被健康状况。", desc_en: "Sharp rise in reflectance near 0.7μm, indicating plant health." },
          { cn: "大气校正", en: "Atmospheric Correction", desc_cn: "消除大气散射和吸收，将辐亮度转换为地表反射率。", desc_en: "Converting radiance to surface reflectance by removing atm effects." }
        ]
      },
      {
        id: "c2",
        name: "Microwave Remote Sensing (微波遥感)",
        summary: { cn: "利用微波波段进行全天时、全天候的主动观测。", en: "All-weather active sensing using microwave bands." },
        goals: { cn: "透彻理解SAR成像几何、多普勒原理、极化分解及InSAR干涉测量。", en: "Deep understanding of SAR geometry, Doppler, PolSAR, and InSAR." },
        logicTree: {
          label: { cn: "SAR 系统深度解析", en: "SAR System Deep Dive" },
          children: [
            {
              label: { cn: "1. 成像机理", en: "1. Imaging Physics" },
              children: [
                { label: { cn: "测距原理", en: "Ranging" }, desc: { cn: "距离向分辨率取决于脉冲宽度(通过Chirp脉冲压缩优化)。", en: "Range Res depends on pulse width (Chirp compression)." } },
                { label: { cn: "方位原理", en: "Azimuth" }, desc: { cn: "利用多普勒频移合成虚拟长孔径(L = λR/L_antenna)。", en: "Doppler synthesis creates virtual aperture." }, heavy: true },
                { label: { cn: "几何畸变", en: "Distortions" }, desc: { cn: "透视收缩(Foreshortening)、叠掩(Layover, 顶底倒置)、阴影(Shadow)。", en: "Specific to slant-range geometry." } }
              ]
            },
            {
              label: { cn: "2. 信号特性", en: "2. Signal Traits" },
              children: [
                { label: { cn: "穿透性", en: "Penetration" }, desc: { cn: "波长越长穿透越深 (L波段穿透树冠 vs X波段树冠表面)。", en: "L-band (Canopy) vs X-band (Surface)." } },
                { label: { cn: "极化机制", en: "Polarization" }, desc: { cn: "HH/VV(表面散射)、HV/VH(体积散射/去极化)。", en: "Surface scattering vs Volume scattering." } }
              ]
            },
            {
              label: { cn: "3. InSAR干涉", en: "3. InSAR" },
              children: [
                { label: { cn: "基本原理", en: "Basics" }, desc: { cn: "相位差 = 地形相位 + 形变相位 + 大气相位 + 噪声。", en: "Phase diff = Topo + Deformation + Atm + Noise." }, heavy: true },
                { label: { cn: "处理流程", en: "Workflow" }, desc: { cn: "配准 -> 干涉图 -> 去平地 -> 相位解缠 -> 地理编码。", en: "Coreg -> Interferogram -> Flatten -> Unwrap -> Geocode." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "相位解缠", en: "Phase Unwrapping", desc_cn: "将周期性的缠绕相位(-π, π)恢复为连续的绝对相位。", desc_en: "Resolving 2π ambiguities to continuous phase." },
          { cn: "基线", en: "Baseline", desc_cn: "两次观测时卫星位置的空间距离，影响高程灵敏度。", desc_en: "Spatial separation between satellite tracks." }
        ]
      },
      {
        id: "c3",
        name: "Thermal Infrared Remote Sensing (热红外遥感)",
        summary: { cn: "基于热辐射理论反演地表温度(LST)与发射率。", en: "Retrieving LST and emissivity based on thermal radiation theory." },
        goals: { cn: "掌握普朗克定律、基尔霍夫定律、分裂窗算法及城市热岛应用。", en: "Master Planck's Law, Kirchhoff, Split-Window, UHI." },
        logicTree: {
          label: { cn: "LST 反演体系", en: "LST Retrieval Sys" },
          children: [
            {
              label: { cn: "1. 物理定律", en: "1. Physics" },
              children: [
                { label: { cn: "普朗克定律", en: "Planck's" }, desc: { cn: "描述黑体辐射能量随波长和温度的分布。", en: "Radiance distribution over wavelength/temp." } },
                { label: { cn: "基尔霍夫", en: "Kirchhoff" }, desc: { cn: "热平衡状态下：发射率(ε) = 吸收率(α)。", en: "Emissivity equals Absorptivity." }, heavy: true }
              ]
            },
            {
              label: { cn: "2. 反演算法", en: "2. Algorithms" },
              children: [
                { label: { cn: "单通道", en: "Single-Channel" }, desc: { cn: "需极其精确的大气廓线数据(探空数据)。", en: "Requires precise atmospheric profiles." } },
                { label: { cn: "分裂窗(SW)", en: "Split-Window" }, desc: { cn: "利用10-12μm波段对水汽吸收的差异消除大气影响。", en: "Using differential absorption to remove atm." }, heavy: true },
                { label: { cn: "TES", en: "TES" }, desc: { cn: "温度与发射率分离：利用MMD(最小最大差)经验关系。", en: "Temp-Emissivity Separation using MMD." } }
              ]
            },
            {
              label: { cn: "3. 典型应用", en: "3. Apps" },
              children: [
                { label: { cn: "城市热岛", en: "UHI" }, desc: { cn: "与不透水面(Impervious Surface)比例正相关。", en: "Correlated with impervious surfaces." } },
                { label: { cn: "土壤水分", en: "Soil Moisture" }, desc: { cn: "利用热惯量(Thermal Inertia)原理：水热容大，昼夜温差小。", en: "Thermal Inertia: Water dampens temp change." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "热惯量", en: "Thermal Inertia", desc_cn: "物质阻碍温度变化的能力，用于区分岩石、土壤和水。", desc_en: "Resistance to temperature change." },
          { cn: "亮温", en: "Brightness Temp", desc_cn: "假设物体为黑体(ε=1)时传感器观测到的等效温度。", desc_en: "Temp assuming object is a blackbody." }
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
          { cn: "SfM", en: "Structure from Motion", desc_cn: "利用二维图像序列的运动视差恢复三维结构的算法。", desc_en: "Reconstructing 3D structure from 2D image motion." }
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
                { label: { cn: "显示增强", en: "Display" }, desc: { cn: "线性拉伸(2%)、直方图匹配、假彩色合成(432 vs 543)。", en: "Linear stretch, FCC combinations." } },
                { label: { cn: "统计查看", en: "Stats" }, desc: { cn: "查看DN值分布、散点图分析波段相关性。", en: "Histograms & Scatter plots." } }
              ]
            },
            {
              label: { cn: "2. 几何校正", en: "2. Geo-Correction" },
              children: [
                { label: { cn: "GCP选取", en: "GCPs" }, desc: { cn: "特征明显、分布均匀(道路交叉口)。", en: "Distinct features, uniform distribution." }, heavy: true },
                { label: { cn: "重采样", en: "Resampling" }, desc: { cn: "最近邻(保光谱)、双线性(平滑)、三次卷积。", en: "Nearest Neighbor vs Bilinear/Cubic." } }
              ]
            },
            {
              label: { cn: "3. 图像分类", en: "3. Classification" },
              children: [
                { label: { cn: "ROI建立", en: "ROI" }, desc: { cn: "选取纯净像元作为训练样本，计算分离度。", en: "Pure pixels training samples, separability." } },
                { label: { cn: "执行分类", en: "Execute" }, desc: { cn: "运行最大似然法，进行多数分析(Majority)后处理。", en: "Run MLC, post-class smoothing." } }
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

const TreeNode = ({ node, lang, isRoot = false, isLast = false }) => {
  const [expanded, setExpanded] = useState(true);
  
  if (!node) return null;

  const label = node.label ? (node.label[lang] || node.label.cn || node.label) : "Node";
  const desc = node.desc ? (node.desc[lang] || node.desc.cn || node.desc) : "";
  const isHeavy = node.heavy || false;
  const hasChildren = node.children && node.children.length > 0;

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

const LogicMindMap = ({ data }) => {
  const [lang, setLang] = useState('cn');
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialDistance, setInitialDistance] = useState(null);
  const [initialScale, setInitialScale] = useState(1);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    if (e.touches && e.touches.length === 2) return;

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

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      setInitialDistance(dist);
      setInitialScale(scale);
    } else {
      handlePointerDown(e);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialDistance !== null) {
      e.preventDefault(); 
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      
      const newScale = initialScale * (currentDist / initialDistance);
      setScale(Math.min(Math.max(0.5, newScale), 3));
    } else {
      handlePointerMove(e);
    }
  };

  if (!data || !data.label) return (
    <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded text-slate-400 text-xs text-center flex flex-col items-center justify-center h-32">
      <Network className="w-8 h-8 text-slate-300 mb-2" />
      <span className="block">暂未录入逻辑导图</span>
      <span className="text-[10px] opacity-70">(Logic Map Not Available)</span>
    </div>
  );

  return (
    <div className="flex flex-col h-[500px] border border-slate-200 rounded-xl overflow-hidden bg-slate-50 relative group select-none">
      <div className="absolute top-4 left-4 z-30 flex gap-2">
         <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider bg-white/80 backdrop-blur px-2 py-1 rounded border border-slate-200 shadow-sm">
            <Network className="w-3 h-3 mr-1" /> Logic Map
         </div>
         <button 
            onClick={() => setLang(lang === 'cn' ? 'en' : 'cn')}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-white/80 backdrop-blur shadow-sm text-xs font-mono text-slate-600 hover:text-teal-600 border border-slate-200"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{lang === 'cn' ? '中' : 'EN'}</span>
          </button>
      </div>

      <div 
        ref={containerRef}
        className="flex-grow w-full h-full cursor-move touch-none overflow-hidden relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
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
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
          className="absolute top-10 left-10 p-10 min-w-max"
        >
          <TreeNode node={data} lang={lang} isRoot={true} />
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-2 bg-white/90 backdrop-blur border border-slate-200 p-1.5 rounded-lg shadow-lg">
        <button onClick={() => setScale(s => Math.min(s + 0.2, 3))} className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><Plus className="w-5 h-5"/></button>
        <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><Minus className="w-5 h-5"/></button>
        <button onClick={() => { setScale(1); setPosition({x:0, y:0}); }} className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Reset View"><Maximize className="w-4 h-4"/></button>
      </div>
      
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none opacity-50 text-[10px] text-slate-400 flex flex-col gap-1">
        <span className="flex items-center"><Move className="w-3 h-3 mr-1"/> Drag</span>
        <span className="flex items-center"><Maximize className="w-3 h-3 mr-1"/> Zoom</span>
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
      <div className="bg-white w-full max-w-lg sm:rounded-2xl rounded-t-2xl h-[90vh] flex flex-col shadow-2xl">
        <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50 sm:rounded-t-2xl shrink-0">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-800 leading-tight pr-4">{course.name}</h3>
            <span className="text-xs font-mono text-teal-600 bg-teal-50 px-2 py-0.5 rounded mt-2 inline-block">APS CORE</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-8 pb-20">
          <BiText 
            label={<><FileText className="w-4 h-4 mr-2" /> 一句话概述 (Summary)</>}
            cn={<div className="bg-blue-50 text-blue-900 p-3 rounded-lg text-sm leading-relaxed border border-blue-100">{course.summary?.cn || "暂无描述"}</div>}
            en={<div className="bg-indigo-50 text-indigo-900 p-3 rounded-lg text-sm leading-relaxed border border-indigo-100 font-medium">{course.summary?.en || "No description"}</div>}
            defaultLang="cn"
          />

          <BiText 
            label={<><Target className="w-4 h-4 mr-2" /> 核心目标 (Goals)</>}
            cn={<p className="text-slate-700 text-sm leading-relaxed pl-1">{course.goals?.cn || "暂无目标"}</p>}
            en={<p className="text-slate-700 text-sm leading-relaxed pl-1 font-medium">{course.goals?.en || "No goals"}</p>}
            defaultLang="cn"
          />

          <div className="py-2">
            <LogicMindMap data={course.logicTree} />
          </div>

          {course.terms && course.terms.length > 0 && (
            <div>
              <h4 className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                <Globe className="w-4 h-4 mr-2" /> 核心术语库 (Terminology)
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {course.terms.map((term, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-teal-300 transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-bold text-teal-700 text-base">{term.en}</h5>
                        <span className="inline-block mt-1 font-medium text-slate-600 text-xs bg-slate-100 px-2 py-0.5 rounded">{term.cn}</span>
                      </div>
                    </div>
                    <BiText 
                      cn={
                        <div className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2">
                          <span className="text-xs font-bold text-slate-400 mr-1 block mb-1">中文释义:</span> 
                          {term.desc_cn}
                        </div>
                      }
                      en={
                        <div className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2 font-medium">
                          <span className="text-xs font-bold text-slate-400 mr-1 block mb-1">English Definition:</span> 
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

          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <h4 className="flex items-center text-sm font-bold text-purple-700 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 mr-2" /> AI 深度追问
            </h4>
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="例如：为什么SAR会有阴影？"
                className="flex-grow text-sm p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
              />
              <button 
                onClick={handleAiAsk}
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 font-medium"
              >
                {loading ? "..." : "提问"}
              </button>
            </div>
            {aiResponse && (
              <div className="bg-white p-3 rounded-lg text-sm text-slate-700 leading-relaxed whitespace-pre-wrap border border-purple-100 shadow-sm animate-fade-in">
                {aiResponse}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseList = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedCat, setExpandedCat] = useState("遥感基础类 (RS Fundamentals)");

  return (
    <div className="space-y-4 pb-24">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-1 flex items-center"><BookOpen className="w-5 h-5 mr-2"/> 核心课程栈</h2>
        <p className="text-blue-100 text-xs opacity-90 mt-2">
          包含14门遥感基础类核心课程的双语逻辑树与定义库。
        </p>
      </div>

      {COURSE_DATA.map((cat, idx) => (
        <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setExpandedCat(expandedCat === cat.category ? null : cat.category)}
            className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <span className="font-bold text-slate-700 text-sm">{cat.category}</span>
            {expandedCat === cat.category ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>
          
          {expandedCat === cat.category && (
            <div className="p-2 grid grid-cols-1 gap-2">
              {cat.courses.map((course) => (
                <div 
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className="p-3 bg-white border border-slate-100 rounded-lg hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group flex justify-between items-center"
                >
                  <div className="flex-grow pr-2">
                    <h4 className="font-semibold text-slate-800 text-sm group-hover:text-teal-700 transition-colors leading-tight">
                      {course.name.split('(')[0]}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 truncate">
                      {course.summary?.cn || "Click for details"}
                    </p>
                  </div>
                  <div className="ml-2 pl-2 border-l border-slate-100">
                     <Zap className="w-4 h-4 text-slate-200 group-hover:text-teal-500 fill-current" />
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

    const prompt = `
      我是一名准备APS面谈的遥感专业学生。
      我今天的复习感悟是：“${reflection}”。
      请给我一句简短的、富有哲理的鼓励（中文，50字以内）。
    `;
    
    const response = await callGemini(prompt);
    setAiFeedback(response);
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 opacity-5">
        <Calendar className="w-24 h-24" />
      </div>
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
          <Calendar className="mr-2 text-teal-600 w-5 h-5" /> 每日复盘
        </h3>
        <span className="text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100">
          Day {streak}
        </span>
      </div>

      {isCheckedToday ? (
        <div className="text-center py-6 bg-green-50/50 rounded-xl border border-green-100 animate-fade-in relative">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
          <p className="text-green-800 font-bold text-sm">今日复盘已完成</p>
          {loading ? (
             <div className="mt-4"><LoadingDots /></div>
          ) : aiFeedback ? (
            <div className="mt-4 mx-2 p-3 bg-white rounded-lg text-slate-600 text-xs italic shadow-sm border border-green-100 text-left">
              <div className="flex items-center gap-1 mb-1 text-teal-600 font-bold text-[10px] uppercase">
                <Sparkles className="w-3 h-3" /> AI Mentor
              </div>
              "{aiFeedback}"
            </div>
          ) : null}
        </div>
      ) : (
        <div className="space-y-3 relative z-10">
          <p className="text-slate-500 text-xs">
            今天复习了什么？有什么新的理解？
          </p>
          <textarea
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm resize-none"
            rows="3"
            placeholder="e.g. 终于弄懂了直方图均衡化的数学原理..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
          <button
            onClick={handleCheckIn}
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-teal-200 flex justify-center items-center text-sm"
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full relative overflow-hidden">
       <div className="absolute -right-10 -top-10 bg-purple-50 w-32 h-32 rounded-full z-0"></div>
      <div className="flex justify-between items-center mb-6 relative z-10">
         <h3 className="font-bold text-slate-800 text-lg flex items-center"><RefreshCw className="w-5 h-5 mr-2 text-purple-600"/> 快速问答 (Q&A)</h3>
         <span className="text-xs font-mono bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100">Q-{qIndex + 1}</span>
      </div>
      
      <div className="flex-grow relative z-10">
        <h4 className="text-lg font-bold text-slate-800 mb-3 leading-snug">{QUESTIONS[qIndex].q}</h4>
        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full inline-block border border-amber-100 mb-6">
          💡 Hint: {QUESTIONS[qIndex].hint}
        </p>
        
        {showAns ? (
          <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 border-l-4 border-purple-500 animate-fade-in shadow-sm">
            <span className="font-bold block mb-1 text-purple-700">Answer:</span>
            {QUESTIONS[qIndex].a}
          </div>
        ) : (
          <div className="h-24 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs">
            Try to speak it out loud first...
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-8 relative z-10">
        <button onClick={() => setShowAns(!showAns)} className="py-2.5 border border-slate-300 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-600 transition-colors">
          {showAns ? "隐藏答案" : "查看答案"}
        </button>
        <button onClick={() => {setQIndex((qIndex+1)%QUESTIONS.length); setShowAns(false);}} className="py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 text-sm font-medium shadow-lg shadow-slate-200 transition-all active:scale-95">
          下一题
        </button>
      </div>
    </div>
  );
};

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
          <div className="space-y-6 animate-fade-in pb-24">
            <div className="bg-gradient-to-r from-teal-700 to-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-teal-100 relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-2xl font-bold mb-2">Ready for APS?</h1>
                <p className="text-teal-50 text-sm mb-4 opacity-90 italic leading-relaxed">"{quote}"</p>
                <div className="flex items-center text-xs font-mono bg-black/20 backdrop-blur-sm w-fit px-3 py-1 rounded-full border border-white/10">
                  <GraduationCap className="w-3 h-3 mr-2" /> CUG {'->'} Germany
                </div>
              </div>
              <Layers className="absolute -right-6 -bottom-6 w-36 h-36 text-white/10 rotate-12" />
            </div>

            <DailyCheckIn streak={streak} setStreak={setStreak} lastCheckIn={lastCheckIn} setLastCheckIn={setLastCheckIn} />

            <div className="grid grid-cols-2 gap-4">
              <div onClick={() => setActiveTab('courses')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-teal-400 hover:shadow-md transition-all group">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-700">核心课程栈</h3>
                <p className="text-xs text-slate-400 mt-1">Bilingual + Logic Map</p>
              </div>
              <div onClick={() => setActiveTab('interview')} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-purple-400 hover:shadow-md transition-all group">
                 <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-slate-700">模拟面谈</h3>
                <p className="text-xs text-slate-400 mt-1">AI 考官实时对练</p>
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 max-w-md mx-auto shadow-2xl overflow-hidden flex flex-col relative">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 sticky top-0 z-30 flex justify-between items-center">
        <div className="flex items-center space-x-2" onClick={() => setActiveTab('dashboard')}>
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center text-white font-bold shadow-sm cursor-pointer">RS</div>
          <span className="font-bold text-slate-800 cursor-pointer">Logic Prep</span>
        </div>
        <button onClick={() => setShowInstallGuide(true)} className="p-2 text-slate-400 hover:text-teal-600 rounded-full hover:bg-slate-50 transition-colors">
          <Smartphone className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-grow p-6 overflow-y-auto scrollbar-hide">{renderContent()}</main>

      <nav className="absolute bottom-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-30 pb-6 sm:pb-3">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === 'dashboard' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <Layers className="w-6 h-6" /> <span className="text-[10px] font-medium">概览</span>
        </button>
        <button onClick={() => setActiveTab('courses')} className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === 'courses' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <BookOpen className="w-6 h-6" /> <span className="text-[10px] font-medium">课程</span>
        </button>
        <button onClick={() => setActiveTab('interview')} className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === 'interview' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <Award className="w-6 h-6" /> <span className="text-[10px] font-medium">实战</span>
        </button>
      </nav>

      {showInstallGuide && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white p-6 rounded-2xl max-w-sm w-full relative shadow-2xl">
             <button onClick={() => setShowInstallGuide(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
             <h3 className="font-bold mb-4 text-lg">安装到手机</h3>
             <div className="space-y-4 text-sm text-slate-600">
               <div className="flex items-start gap-3">
                 <div className="bg-slate-100 p-2 rounded-lg"><Smartphone className="w-5 h-5"/></div>
                 <p>在浏览器点击底部的 <strong>"分享"</strong> 按钮。</p>
               </div>
               <div className="flex items-start gap-3">
                 <div className="bg-slate-100 p-2 rounded-lg"><CheckCircle className="w-5 h-5"/></div>
                 <p>选择 <strong>"添加到主屏幕" (Add to Home Screen)</strong> 即可全屏离线使用。</p>
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}