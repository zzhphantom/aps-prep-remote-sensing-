// ============================================================================
// FILE: src/data.js
// 作用: 存放14门核心课程的深度复习数据 (APS面试专用 - 详实口语版)
// ============================================================================

export const QUOTES = [
  "In APS, logic is more important than memorization. (APS考察的是逻辑而非死记硬背)",
  "Remote Sensing is projecting the physical world into digital space. (遥感是物理世界在数字空间的投影)",
  "From Maxwell's equations to satellite images, it's the beauty of physics. (从麦克斯韦方程到卫星图像，是物理之美)",
  "Better to be slow and deep than fast and shallow. (宁可慢而深，不可快而浅)",
  "Errors are inevitable, but we can minimize them. (误差不可避免，但我们可以最小化它)",
  "Data has no soul; models and algorithms give it life. (数据没有灵魂，模型和算法赋予它生命)",
];

export const COURSE_DATA = [
  {
    category: "核心理论 (Core Theory)",
    courses: [
      {
        id: "c1",
        name: "Principles and Applications of Remote Sensing (遥感原理与应用)",
        summary: {
          cn: "这是我的入门核心课。它建立了一个完整的物理链条：太阳辐射作为源头，穿过大气层，与地表物体发生相互作用（反射/发射），最后被传感器记录下来。理解这个过程是学习后续所有课程的基础。",
          en: "This is my core introductory course. It establishes a complete physical chain: Solar radiation as the source, passing through the atmosphere, interacting with surface objects (reflection/emission), and finally being recorded by sensors. Understanding this process is the foundation for all subsequent courses."
        },
        goals: {
          cn: "重点掌握电磁波谱的物理定律、大气窗口的意义、三大典型地物（植被、水、土）的光谱曲线特征，以及传感器最重要的四个分辨率指标及其相互制约关系。",
          en: "Focus on EM spectrum laws, Atmospheric Windows, Spectral Signatures of Vegetation/Water/Soil, and the 4 key Resolutions with their trade-offs."
        },
        logicTree: {
          label: { cn: "遥感物理链路", en: "The Physical Chain" },
          children: [
            {
              label: { cn: "1. 辐射源与定律", en: "1. Source & Laws" },
              children: [
                {
                  label: { cn: "黑体辐射定律", en: "Blackbody Laws" },
                  desc: { cn: "这是遥感的物理基础。普朗克定律(Planck's Law)描述了能量随波长的分布；维恩位移定律(Wien's Law)非常重要，它告诉我们温度越高，辐射峰值波长越短——这就是为什么太阳辐射集中在可见光（短波），而地球辐射集中在热红外（长波）。", en: "Physics foundation. Planck's Law (Distribution); Wien's Law (Temp up, Peak Wavelength down) explains why Sun is Shortwave (Visible) and Earth is Longwave (Thermal)." },
                  heavy: true
                },
                {
                  label: { cn: "电磁波谱", en: "EM Spectrum" },
                  desc: { cn: "我们需要背诵关键波段：可见光(0.4-0.7μm)、近红外(0.7-1.1μm, 植被敏感)、热红外(3-14μm, 温度)、微波(1mm-1m, 全天候)。", en: "Key bands: Visible (0.4-0.7), NIR (Vegetation), Thermal (Temp), Microwave (All-weather)." }
                }
              ]
            },
            {
              label: { cn: "2. 大气传输", en: "2. Atmosphere" },
              children: [
                {
                  label: { cn: "大气窗口", en: "Atmospheric Window" },
                  desc: { cn: "大气不是透明的，它会吸收和散射光。透过率高的波段叫‘大气窗口’，我们的传感器必须设计在这些窗口内（如可见光窗、热红外窗），否则什么都看不到。", en: "Atmosphere absorbs/scatters. High transmittance bands are 'Windows'. Sensors must be designed within these windows." },
                  heavy: true
                },
                {
                  label: { cn: "散射类型", en: "Scattering" },
                  desc: { cn: "瑞利散射(Rayleigh)：粒子<波长(气体分子)，导致蓝天；米氏散射(Mie)：粒子≈波长(气溶胶)，导致灰霾；非选择性散射：粒子>波长(水滴)，导致白云。", en: "Rayleigh (Small, Blue sky); Mie (Medium, Haze); Non-selective (Large, White clouds)." }
                }
              ]
            },
            {
              label: { cn: "3. 地物光谱响应", en: "3. Spectral Response" },
              children: [
                {
                  label: { cn: "植被 (必考)", en: "Vegetation (Core)" },
                  desc: { cn: "植被曲线最特殊。可见光波段被叶绿素吸收（低反）；近红外波段被叶片细胞结构强烈反射（高反）。这导致在0.7μm附近出现陡峭上升，称为‘红边’(Red Edge)，这是识别植被最关键的特征。", en: "Visible absorbed by Chlorophyll (Low); NIR reflected by Cell Structure (High). The steep rise is 'Red Edge', key for ID." },
                  heavy: true
                },
                {
                  label: { cn: "水体与土壤", en: "Water & Soil" },
                  desc: { cn: "水体在红外波段几乎全吸收，呈黑色（除非有悬浮物）。土壤反射率随波长线性增加，但含水量越高，整体反射率越低（水是吸收剂）。", en: "Water absorbs IR (Dark). Soil reflectance increases linearly, but Moisture lowers it." }
                }
              ]
            },
            {
              label: { cn: "4. 传感器特性", en: "4. Resolutions" },
              children: [
                {
                  label: { cn: "四大分辨率", en: "4 Resolutions" },
                  desc: { cn: "空间(像素大小)、光谱(波段数/宽度)、辐射(灰度级/位深)、时间(重访周期)。它们之间存在权衡(Trade-off)，比如为了高信噪比，高光谱分辨率往往伴随着较低的空间分辨率。", en: "Spatial (Pixel size), Spectral (Band width), Radiometric (Bit depth), Temporal (Revisit). Trade-offs exist (e.g., High Spectral often means Low Spatial to keep SNR)." },
                  heavy: true
                }
              ]
            }
          ]
        },
        terms: [
          { cn: "红边效应", en: "Red Edge Effect", desc_cn: "绿色植被在红光（强吸收）和近红外（强反射）之间反射率急剧上升的现象。", desc_en: "Sharp rise in reflectance between Red and NIR bands for vegetation." },
          { cn: "大气窗口", en: "Atmospheric Window", desc_cn: "电磁波通过大气层时衰减较少、透过率较高的波段。", desc_en: "Spectral ranges where the atmosphere is transparent to radiation." }
        ],
        relations: [
          { targetId: 'm8', targetName: 'College Physics C2', label: '理论基础 (Foundation)', desc: '电磁波理论(Maxwell Eqs)是遥感的物理本源' },
          { targetId: 's2', targetName: 'Photography Surveying', label: '技术对比 (Contrast)', desc: 'RS侧重光谱特征(What)，Photo侧重几何位置(Where)' },
          { targetId: 'c2', targetName: 'Microwave Remote Sensing', label: '波段延伸 (Extension)', desc: '从光学(被动)延伸到微波(主动)' }
        ],
        notes: []
      },
      {
        id: "c2",
        name: "Microwave Remote Sensing (微波遥感)",
        summary: {
          cn: "这门课研究的是利用微波波段（1mm-1m）的主动遥感。与光学遥感被动接收太阳光不同，雷达(Radar)主动发射脉冲。这赋予了它两大优势：全天时（不依赖光照）和全天候（穿透云雨）。",
          en: "Focuses on active sensing in microwave (1mm-1m). Unlike passive optical, Radar transmits pulses. Advantages: Day/Night (Active) and All-weather (Penetration)."
        },
        goals: {
          cn: "理解SAR（合成孔径雷达）的成像原理、几何畸变产生的原因，以及InSAR干涉测量如何提取高程和形变。",
          en: "Understand SAR imaging principles, Geometric Distortions, and InSAR for DEM/Deformation."
        },
        logicTree: {
          label: { cn: "SAR 核心逻辑", en: "SAR Logic" },
          children: [
            {
              label: { cn: "1. 成像机理", en: "1. Imaging Mechanism" },
              children: [
                {
                  label: { cn: "距离向 (Range)", en: "Range Direction" },
                  desc: { cn: "分辨率取决于脉冲宽度。为了解决‘短脉冲(高分辨)’与‘高能量(远距离)’的矛盾，采用了Chirp线性调频信号和脉冲压缩技术。", en: "Res depends on pulse width. Uses 'Chirp' & 'Pulse Compression' to balance Resolution vs Energy." }
                },
                {
                  label: { cn: "方位向 (Azimuth)", en: "Azimuth Direction" },
                  desc: { cn: "这是难点。利用传感器飞行产生的多普勒频移，在数据处理中虚拟出一个超长天线（合成孔径）。结论：SAR的方位分辨率与距离无关，只等于天线长度的一半。", en: "Hard part. Uses Doppler shift to synthesize a long aperture. Result: Azimuth Res = Antenna Length / 2 (Independent of distance)." },
                  heavy: true
                }
              ]
            },
            {
              label: { cn: "2. 图像特征", en: "2. Image Features" },
              children: [
                {
                  label: { cn: "几何畸变", en: "Geometric Distortions" },
                  desc: { cn: "由于斜距成像导致。透视收缩(Foreshortening)：迎坡面被压缩；叠掩(Layover)：山顶比山底离传感器更近，导致山顶‘倒’在山底前面（无法纠正）；阴影(Shadow)：背坡面无信号。", en: "Slant range effects: Foreshortening (compressed), Layover (Top closer than Bottom -> Inverted), Shadow (Blocked)." },
                  heavy: true
                },
                {
                  label: { cn: "散射机制", en: "Scattering" },
                  desc: { cn: "表面散射（粗糙度决定强弱，水面镜面反射为黑）；体积散射（树冠内部多次散射）；二面角散射（建筑物墙角，强回波）。", en: "Surface (Roughness), Volume (Forest), Double-bounce (Buildings/Corners)." }
                }
              ]
            },
            {
              label: { cn: "3. InSAR技术", en: "3. InSAR" },
              children: [
                {
                  label: { cn: "干涉原理", en: "Interferometry" },
                  desc: { cn: "利用两次观测的相位差。相位差 = 地形相位 + 形变相位 + 大气 + 噪声。如果我们有DEM去除地形相位，剩下的就是形变（D-InSAR），精度可达毫米级。", en: "Phase Diff = Topo + Def + Atm. Remove Topo = Deformation (D-InSAR, mm-level accuracy)." }
                }
              ]
            }
          ]
        },
        terms: [
          { cn: "合成孔径", en: "Synthetic Aperture", desc_cn: "利用小天线沿飞行轨迹运动，通过信号处理合成一个等效的大孔径天线。", desc_en: "Simulating a large antenna by moving a small antenna along a flight path." },
          { cn: "叠掩", en: "Layover", desc_cn: "雷达特有的极端几何畸变，山顶成像在山底之前。", desc_en: "Extreme distortion where the top is imaged before the bottom." }
        ],
        relations: [
          { targetId: 'm8', targetName: 'College Physics C2', label: '物理基础 (Physics Foundation)', desc: '微波的产生与传播依赖电磁学理论' },
          { targetId: 's4', targetName: 'Lidar Technology', label: '主动遥感 (Active RS)', desc: '雷达与激光雷达同属主动遥感，互为补充' }
        ],
        notes: []
      },
      {
        id: "c3",
        name: "Thermal Infrared Remote Sensing (热红外遥感)",
        summary: {
          cn: "这门课从‘看光’转向了‘测热’。所有绝对零度以上的物体都在辐射能量。我们的目标是从卫星观测到的辐射亮度中，反演出地表真实的温度(LST)。",
          en: "Shift from 'Light' to 'Heat'. All objects emit radiation. Goal: Retrieve Land Surface Temperature (LST) from observed radiance."
        },
        goals: {
          cn: "掌握普朗克定律在热红外的应用、基尔霍夫定律的物理意义，以及解决‘一个方程两个未知数’（温度和发射率）的反演算法。",
          en: "Planck's Law in TIR, Kirchhoff's Law, and solving the ill-posed inversion problem (Temp & Emissivity)."
        },
        logicTree: {
          label: { cn: "温度反演逻辑", en: "Retrieval Logic" },
          children: [
            {
              label: { cn: "1. 物理定律", en: "1. Physics Laws" },
              children: [
                {
                  label: { cn: "基尔霍夫定律", en: "Kirchhoff's Law" },
                  desc: { cn: "热平衡下，发射率(ε) = 吸收率(α)。这意味着：好的吸收体也是好的辐射体，反射率高的物体辐射就弱。", en: "Emissivity = Absorptivity. Good absorber = Good emitter. High reflectance = Low emission." },
                  heavy: true
                },
                {
                  label: { cn: "普朗克定律", en: "Planck's Law" },
                  desc: { cn: "是反演的基础。它定义了黑体辐射亮度与波长和温度的数学关系。一旦知道亮度和波长，就能算温度。", en: "The math foundation. Relates Radiance to Wavelength and Temp." }
                }
              ]
            },
            {
              label: { cn: "2. 核心难题", en: "2. The Challenge" },
              children: [
                {
                  label: { cn: "病态方程", en: "Ill-posed Problem" },
                  desc: { cn: "卫星测到一个辐射值，但这个值由‘温度’和‘发射率’共同决定。一个方程解不出两个未知数，这就是温度/发射率分离问题。", en: "One measurement depends on BOTH Temp and Emissivity. 1 Equation, 2 Unknowns. Needs separation." },
                  heavy: true
                }
              ]
            },
            {
              label: { cn: "3. 解决方案", en: "3. Algorithms" },
              children: [
                {
                  label: { cn: "分裂窗算法 (SW)", en: "Split-Window" },
                  desc: { cn: "最常用的方法。利用10-12μm大气窗口内两个相邻波段（如MODIS 31/32）对水汽吸收的微小差异，通过线性组合来消除大气影响。", en: "Most common. Uses differential absorption in 2 adjacent bands to cancel atmospheric effects." },
                  heavy: true
                },
                {
                  label: { cn: "TES算法", en: "TES Algo" },
                  desc: { cn: "温度与发射率分离算法。利用经验关系（如最小最大差 MMD）增加约束条件，从而能同时反演温度和光谱发射率。", en: "Temperature-Emissivity Separation. Uses empirical constraints (MMD) to solve both." }
                }
              ]
            }
          ]
        },
        terms: [
          { cn: "发射率", en: "Emissivity", desc_cn: "物体实际辐射能量与同温度黑体辐射能量的比值（0-1）。", desc_en: "Ratio of object radiance to blackbody radiance at same temp." },
          { cn: "城市热岛", en: "UHI", desc_cn: "城市气温高于郊区的现象，研究发现它与不透水面(ISA)正相关，与植被指数(NDVI)负相关。", desc_en: "Urban warmer than rural. Correlates positively with Impervious Surface, negatively with Vegetation." }
        ],
        relations: [
          { targetId: 'm7', targetName: 'College Physics C1', label: '热学基础 (Thermal Foundation)', desc: '黑体辐射与热力学定律是热红外的基石' },
          { targetId: 'c9', targetName: 'RS Application Model', label: '应用深化 (Application)', desc: '地表温度(LST)是反演蒸散发(ET)的关键参数' }
        ],
        notes: []
      },
      {
        id: "c6",
        name: "Error Theory and Surveying Adjustment B (误差理论与测量平差)",
        summary: {
          cn: "这是测绘与遥感的数据处理基石。任何观测都有误差。这门课不教怎么测量，而是教怎么‘处理数据’，如何从带误差的一堆数据中算出一个最可靠的结果。",
          en: "Foundation of data processing. Observations always have errors. Teaches how to get the most reliable result from error-prone data."
        },
        goals: {
          cn: "深刻理解三类误差的区别（特别是偶然误差的正态分布特性），并能解释‘最小二乘法’为什么是平差的黄金准则。",
          en: "Understand 3 error types (esp. Random Error/Normal Dist) and why 'Least Squares' is the golden rule."
        },
        logicTree: {
          label: { cn: "平差知识体系", en: "Adjustment System" },
          children: [
            {
              label: { cn: "1. 误差论", en: "1. Theory of Errors" },
              children: [
                {
                  label: { cn: "三类误差", en: "3 Error Types" },
                  desc: { cn: "系统误差（如尺子偏长，有规律，可改正）；粗差（如读错数，离群值，需剔除）；偶然误差（随机波动，服从正态分布，是平差主要处理的对象）。", en: "Systematic (Correctable), Gross (Mistakes, Remove), Random (Normal dist, Main target)." },
                  heavy: true
                },
                {
                  label: { cn: "偶然误差特性", en: "Random Error Props" },
                  desc: { cn: "聚中性（小误差多）、对称性（正负抵消）、有界性（大误差极少）、抵偿性（平均趋于0）。", en: "Clustering, Symmetry, Boundedness, Compensation." }
                }
              ]
            },
            {
              label: { cn: "2. 最小二乘法", en: "2. Least Squares" },
              children: [
                {
                  label: { cn: "核心思想", en: "Core Principle" },
                  desc: { cn: "这是必考点。当观测数多于未知数（多余观测）时，矛盾产生。我们寻找一组解，使得所有观测值的‘改正数（残差）的加权平方和最小’ (VTPV = min)。", en: "With redundancy, we find a solution where the weighted sum of squared residuals is minimized." },
                  heavy: true
                }
              ]
            },
            {
              label: { cn: "3. 精度评价", en: "3. Accuracy Metrics" },
              children: [
                {
                  label: { cn: "中误差", en: "RMSE" },
                  desc: { cn: "均方根误差，是衡量一组观测值精度的标准指标。", en: "Root Mean Square Error. Standard metric for precision." }
                },
                {
                  label: { cn: "误差椭圆", en: "Error Ellipse" },
                  desc: { cn: "在二维平面上，点位的误差不是一个圆，而是一个椭圆，反映了不同方向上精度的差异。", en: "Shows positional accuracy distribution in 2D. Accuracy varies by direction." }
                }
              ]
            }
          ]
        },
        terms: [
          { cn: "多余观测", en: "Redundancy", desc_cn: "观测值数量多于确定未知量所需的最少数量。没有多余观测就无法进行平差。", desc_en: "Observations > Unknowns. Prerequisite for adjustment." },
          { cn: "权", en: "Weight (P)", desc_cn: "衡量观测值相对可靠程度的指标，精度越高，权越大（与方差成反比）。", desc_en: "Relative reliability. Inverse to variance." }
        ],
        relations: [
          { targetId: 'm6', targetName: 'Prob & Stat', label: '理论支撑 (Theory Support)', desc: '误差分布服从正态分布，平差原理基于最大似然估计' },
          { targetId: 'm5', targetName: 'Linear Algebra A', label: '计算工具 (Computation Tool)', desc: '平差模型的解算完全依赖矩阵运算' }
        ],
        notes: []
      },
      {
        id: "c7",
        name: "Digital Image Processing (数字图像处理)",
        summary: {
          cn: "这门课把遥感影像看作二维数字矩阵。核心任务有两个：一是让图像更好看（预处理：增强、滤波）；二是让计算机读懂图像（分类）。",
          en: "Treats images as number matrices. Two tasks: Make images better (Enhancement) and make computers understand them (Classification)."
        },
        goals: {
          cn: "掌握直方图均衡化原理、滤波器的卷积运算、PCA变换的几何意义，以及监督分类与非监督分类的本质区别。",
          en: "Master Histogram Eq, Convolution Filtering, PCA geometry, and Supervised vs Unsupervised Classification."
        },
        logicTree: {
          label: { cn: "DIP 核心算法", en: "Core Algorithms" },
          children: [
            {
              label: { cn: "1. 图像增强", en: "1. Enhancement" },
              children: [
                {
                  label: { cn: "直方图均衡化", en: "Histogram Eq" },
                  desc: { cn: "通过非线性拉伸，强制让像素灰度分布变得均匀，从而最大化图像的信息熵（对比度）。", en: "Non-linear stretch to flatten the histogram, maximizing contrast/entropy." }
                },
                {
                  label: { cn: "空间滤波", en: "Spatial Filter" },
                  desc: { cn: "利用卷积核(Kernel)在图像上滑动。低通滤波（如均值）模糊图像去噪；高通滤波（如Sobel）提取边缘。", en: "Convolution. Low-pass (Blur/Denoise), High-pass (Sharpen/Edges)." },
                  heavy: true
                }
              ]
            },
            {
              label: { cn: "2. 特征变换", en: "2. Transformation" },
              children: [
                {
                  label: { cn: "PCA (主成分分析)", en: "PCA" },
                  desc: { cn: "这是一种降维技术。通过坐标轴旋转，将高度相关的多波段数据（如可见光三个波段）压缩成少数几个不相关的主分量(PC1包含主要信息)，去除冗余。", en: "Dimensionality reduction. Rotates axes to compress correlated bands into few uncorrelated Principal Components." },
                  heavy: true
                },
                {
                  label: { cn: "缨帽变换", en: "Tasseled Cap" },
                  desc: { cn: "一种固定的物理变换。将数据投影到：亮度(Soil)、绿度(Veg)、湿度(Water)三个方向。", en: "Fixed physical transform: Brightness, Greenness, Wetness." }
                }
              ]
            },
            {
              label: { cn: "3. 图像分类", en: "3. Classification" },
              children: [
                {
                  label: { cn: "监督分类", en: "Supervised" },
                  desc: { cn: "有人工参与。先选择‘训练样本’（告诉电脑这是水、那是树），再训练分类器（如最大似然法MLC, SVM）。", en: "Human-guided. Select training samples first, then train classifier (MLC, SVM)." },
                  heavy: true
                },
                {
                  label: { cn: "非监督分类", en: "Unsupervised" },
                  desc: { cn: "无人工参与。计算机仅凭光谱统计特征（谁和谁长得像）自动聚类。常用K-means算法。", en: "No human input. Auto-clustering based on spectral stats (K-means)." }
                }
              ]
            }
          ]
        },
        terms: [
          { cn: "混淆矩阵", en: "Confusion Matrix", desc_cn: "通过对比分类结果与地面真值，计算总体精度(OA)和Kappa系数，是评价分类好坏的标准。", desc_en: "Table comparing classification vs ground truth to assess accuracy." },
          { cn: "卷积", en: "Convolution", desc_cn: "一种数学运算，利用小窗口（卷积核）对图像逐像素加权求和，是滤波和CNN的基础。", desc_en: "Mathematical operation using a kernel to process image pixels." }
        ],
        relations: [
          { targetId: 'm5', targetName: 'Linear Algebra A', label: '数学工具 (Math Tool)', desc: '图像本质是矩阵，滤波与变换全是矩阵运算' },
          { targetId: 'p5', targetName: 'C Programming', label: '编程实现 (Implementation)', desc: '底层图像处理算法通常用C/C++实现以保证效率' },
          { targetId: 'c8', targetName: 'RS Image Interpretation', label: '计算机视觉 (Computer Vision)', desc: '从像素处理(DIP)走向语义理解(Interp)' }
        ],
        notes: []
      },
      {
        id: "c8",
        name: "Remote Sensing Image Interpretation (遥感图像解译)",
        summary: {
          cn: "这门课是将图像转化为信息的关键。它不完全依赖计算机，更强调人的地学知识推理。核心是：如何从图像特征推断出地表是什么。",
          en: "Translating images into info. Emphasizes human geoscience reasoning. Key: Inferring 'what is it' from image features."
        },
        goals: {
          cn: "牢记目视解译八大要素，并能结合水系和地貌案例进行分析。了解计算机解译从‘像元’到‘对象’(OBIA)的进化。",
          en: "Memorize 8 Interpretation Keys, apply to drainage/landform analysis. Understand shift from Pixel-based to Object-based (OBIA)."
        },
        logicTree: {
          label: { cn: "解译方法论", en: "Interpretation Methods" },
          children: [
            {
              label: { cn: "1. 目视解译标志", en: "1. Visual Keys" },
              children: [
                {
                  label: { cn: "直接标志 (8大要素)", en: "Direct Keys" },
                  desc: { cn: "色调(Tone, 最基础)、颜色(Color)、形状(Shape)、大小(Size)、阴影(Shadow, 判读高度)、纹理(Texture, 粗糙度)、图型(Pattern)、位置(Site)。", en: "Tone, Color, Shape, Size, Shadow, Texture, Pattern, Site/Association." },
                  heavy: true
                },
                {
                  label: { cn: "逻辑推理", en: "Reasoning" },
                  desc: { cn: "利用相关性(Association)。例如：看到跑道推断是机场；看到冷却塔推断是电厂。", en: "Using Association. Runway -> Airport; Cooling tower -> Power plant." }
                }
              ]
            },
            {
              label: { cn: "2. 地学分析应用", en: "2. Geo-Analysis" },
              children: [
                {
                  label: { cn: "水系判读", en: "Drainage" },
                  desc: { cn: "水系格局反映地质构造。树枝状水系代表均质岩性；格状水系代表受断裂构造控制。", en: "Patterns reflect geology. Dendritic = Homogeneous; Trellis = Fault/Fracture controlled." }
                },
                {
                  label: { cn: "地貌判读", en: "Landform" },
                  desc: { cn: "典型的形态特征：冲积扇（扇形，河流出山口）、三角洲（河口）、滑坡体（圈椅状地形）。", en: "Typical shapes: Alluvial fan (Fan-shaped), Delta, Landslide (Armchair-shaped)." }
                }
              ]
            },
            {
              label: { cn: "3. 自动化技术", en: "3. Automation" },
              children: [
                {
                  label: { cn: "OBIA (面向对象)", en: "OBIA" },
                  desc: { cn: "传统方法基于单个像素（容易产生椒盐噪声）。OBIA先将影像分割(Segment)成一个个同质的‘对象’，再基于对象的形状、纹理和拓扑关系分类。这更像人类的认知方式。", en: "Segment first, then classify objects. Uses shape/context, avoids salt-and-pepper noise. Mimics human vision." },
                  heavy: true
                }
              ]
            }
          ]
        },
        terms: [
          { cn: "纹理", en: "Texture", desc_cn: "图像色调变化的频率和排列。森林纹理粗糙，水面纹理光滑。", desc_en: "Frequency of tonal variation. Forest=Rough, Water=Smooth." },
          { cn: "二分检索表", en: "Dichotomous Key", desc_cn: "一种分类工具，每一步通过回答‘是/否’两个选项，逐步缩小范围直到确定类别。", desc_en: "Step-by-step classification tool with binary choices." }
        ],
        relations: [
          { targetId: 'c1', targetName: 'Principles of RS', label: '特征基础 (Feature Foundation)', desc: '光谱特征是目视解译的重要依据' },
          { targetId: 'm13', targetName: 'Physical Geology', label: '地学背景 (Geology Background)', desc: '地貌判读需要深厚的地质学知识' }
        ],
        notes: []
      },
      {
        id: "c9",
        name: "Remote Sensing Application Model (遥感应用模型)",
        summary: {
          cn: "这门课探讨如何从‘定性’（是什么）走向‘定量’（是多少）。我们利用数学模型，把遥感观测值转化为具体的生物物理参数（如产量、生物量、蒸散发）。",
          en: "From Qualitative ('What') to Quantitative ('How much'). Using math models to convert RS data into biophysical parameters (Yield, Biomass, ET)."
        },
        goals: {
          cn: "理解统计模型与物理模型的优缺点，掌握数据同化的核心思想（卡尔曼滤波）。",
          en: "Pros/Cons of Statistical vs Physical models. Core concept of Data Assimilation (Kalman Filter)."
        },
        logicTree: {
          label: { cn: "建模方法论", en: "Modeling Methodology" },
          children: [
            {
              label: { cn: "1. 模型分类", en: "1. Model Types" },
              children: [
                {
                  label: { cn: "统计模型", en: "Statistical" },
                  desc: { cn: "基于回归分析。建立遥感指数（如NDVI）与地面实测值（如生物量）的线性关系。优点：简单、易用。缺点：没有物理机理，受地域和时间限制，换个地方就不准了。", en: "Regression based. Simple but local. Lacks physics, poor generalizability." },
                  heavy: true
                },
                {
                  label: { cn: "物理模型", en: "Physical" },
                  desc: { cn: "基于辐射传输方程(RTE)，如PROSAIL模型。从机理上解释光如何与叶片、冠层作用。优点：通用性强。缺点：复杂，参数多，反演困难（病态问题）。", en: "RTE based (e.g., PROSAIL). General & Physical. Complex, hard to invert." }
                }
              ]
            },
            {
              label: { cn: "2. 数据同化", en: "2. Data Assimilation" },
              children: [
                {
                  label: { cn: "原理", en: "Principle" },
                  desc: { cn: "为了解决遥感数据在时间上不连续的问题。它将‘陆面过程模型的预测值’与‘遥感卫星的观测值’相结合，利用算法（如卡尔曼滤波）不断调整模型轨迹，得到最优的时空连续结果。", en: "Combines Process Model (Prediction) + Satellite (Observation) to get optimal continuous estimation. e.g., Kalman Filter." },
                  heavy: true
                }
              ]
            },
            {
              label: { cn: "3. 典型案例", en: "3. Examples" },
              children: [
                { label: { cn: "NPP估算", en: "NPP (CASA)" }, desc: { cn: "CASA模型：NPP = 光合有效辐射(PAR) × 植被吸收比例(FPAR) × 光能利用率(ε)。", en: "NPP = PAR * FPAR * epsilon (Light Use Efficiency)." } },
                { label: { cn: "蒸散发", en: "ET (SEBAL)" }, desc: { cn: "基于能量平衡原理。地表净辐射 = 土壤热 + 感热 + 潜热(ET)。算出发射率和温度，余项就是ET。", en: "Energy Balance. Net Radiation = G + H + LE (ET)." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "反演", en: "Inversion / Retrieval", desc_cn: "从观测到的信号（结果）推导地表参数（原因）的过程，通常需要解决多解性问题。", desc_en: "Deriving parameters from signals. Often an inverse problem." },
          { cn: "查找表", en: "Look-Up Table (LUT)", desc_cn: "为了加速物理模型反演，预先计算好各种参数组合下的模型输出，反演时直接查表匹配。", desc_en: "Pre-computed database to speed up physical model inversion." }
        ],
        relations: [
          { targetId: 'm6', targetName: 'Prob & Stat', label: '统计建模 (Statistical Modeling)', desc: '回归分析与假设检验是统计模型的核心' },
          { targetId: 'm14', targetName: 'Intro to Ecology', label: '应用领域 (Application Field)', desc: '生态系统参数（如NPP/生物量）是建模的主要对象' }
        ],
        notes: []
      },
      {
        id: "c10",
        name: "Lecture on Frontiers of RS Knowledge (遥感前沿讲座)",
        summary: {
          cn: "这门课展示了遥感的未来。核心词是：更高（高光谱）、更立体（LiDAR）、更智能（深度学习）。",
          en: "The future of RS. Keywords: Higher (Hyperspectral), 3D (LiDAR), Smarter (Deep Learning)."
        },
        goals: {
          cn: "了解高光谱的‘图谱合一’特性及维数灾难，LiDAR的三维点云获取，以及CNN/Transformer在遥感中的应用。",
          en: "Understand Hyperspectral 'Image-Spectrum' & Hughes phenomenon, LiDAR 3D point cloud, and CNN/Transformer apps."
        },
        logicTree: {
          label: { cn: "前沿技术三驾马车", en: "The Big Three" },
          children: [
            {
              label: { cn: "1. 高光谱遥感", en: "1. Hyperspectral" },
              children: [
                { label: { cn: "特点", en: "Features" }, desc: { cn: "波段极多（成百上千），光谱分辨率极高（纳米级），实现了‘图谱合一’。能识别具体的矿物成分或树种。", en: "Hundreds of contiguous bands. 'Image + Spectrum'. Material identification." } },
                { label: { cn: "挑战", en: "Challenges" }, desc: { cn: "数据量太大导致‘维数灾难’（Hughes现象）；且空间分辨率通常较低，导致‘混合像元’严重，需要光谱解混。", en: "Data volume -> Hughes Phenomenon. Low spatial res -> Mixed Pixels -> Unmixing." }, heavy: true }
              ]
            },
            {
              label: { cn: "2. 激光雷达", en: "2. LiDAR" },
              children: [
                { label: { cn: "原理", en: "Principle" }, desc: { cn: "主动发射激光脉冲测距。最强优势是能穿透植被冠层缝隙打到地面，直接获取DTM（数字地形）和树高。", en: "Active laser ranging. Penetrates canopy gaps. Gets DTM & Tree Height directly." } },
                { label: { cn: "全波形", en: "Waveform" }, desc: { cn: "不只记录一个点，而是记录回波的完整波形，反映植被的垂直立体结构。", en: "Records full echo shape, revealing vertical structure." } }
              ]
            },
            {
              label: { cn: "3. 智能计算", en: "3. AI & Cloud" },
              children: [
                { label: { cn: "深度学习", en: "Deep Learning" }, desc: { cn: "CNN（卷积神经网络）擅长提取空间纹理特征；Transformer擅长处理时序数据。GEE（谷歌地球引擎）提供了云端算力。", en: "CNN for spatial texture; Transformer for time-series. GEE for cloud computing." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "维数灾难", en: "Hughes Phenomenon", desc_cn: "在训练样本有限的情况下，随着波段数增加，分类精度反而先升后降的现象。", desc_en: "Accuracy drops with increasing dimensionality if training samples are limited." },
          { cn: "端元", en: "Endmember", desc_cn: "构成混合像元的纯净物质的光谱曲线。", desc_en: "Pure spectral signature of a material in a mixed pixel." }
        ],
        relations: [
          { targetId: 'c1', targetName: 'Principles of RS', label: '基础 (Foundation)', desc: '前沿技术是基础理论的延伸与突破' },
          { targetId: 'p3', targetName: 'Computer Vision', label: '深度融合 (Deep Integration)', desc: '深度学习彻底改变了遥感信息提取的范式' }
        ],
        notes: []
      },
      {
        id: "c4",
        name: "Remote Sensing of Natural Disasters (自然灾害遥感)",
        summary: {
          cn: "这门课讲的是救命的技术。核心在于利用多源遥感（光学+雷达）进行‘变化检测’，快速评估灾情。",
          en: "Lifesaving tech. Core is 'Change Detection' using Multi-source RS (Optical + Radar) for rapid assessment."
        },
        goals: {
          cn: "针对三大灾害（洪水、地震、火灾）能够分别说出最佳监测手段和原理。",
          en: "State the best method and principle for Flood, Earthquake, and Wildfire."
        },
        logicTree: {
          label: { cn: "灾害响应方案", en: "Disaster Response" },
          children: [
            {
              label: { cn: "1. 洪水 (Flood)", en: "1. Flood" },
              children: [
                { label: { cn: "SAR监测 (最佳)", en: "SAR (Best)" }, desc: { cn: "洪水多伴随阴雨，光学卫星无法工作。SAR能穿透云雾。原理：水面发生镜面反射，回波极弱，影像上呈黑色（暗区），容易提取。", en: "Cloudy in floods -> Optical fails. SAR penetrates. Principle: Specular reflection -> Dark pixels." }, heavy: true },
                { label: { cn: "光学监测", en: "Optical" }, desc: { cn: "如果无云，可用NDWI（归一化水体指数）提取水体边界。", en: "If clear, use NDWI index." } }
              ]
            },
            {
              label: { cn: "2. 地震 (Earthquake)", en: "2. Earthquake" },
              children: [
                { label: { cn: "InSAR技术", en: "InSAR" }, desc: { cn: "地震往往造成地表形变。利用D-InSAR（差分干涉）技术，生成干涉条纹图，可以精确量化厘米级甚至毫米级的同震形变场。", en: "D-InSAR generates interference fringes to quantify co-seismic deformation (mm level)." }, heavy: true }
              ]
            },
            {
              label: { cn: "3. 火灾 (Wildfire)", en: "3. Wildfire" },
              children: [
                { label: { cn: "火点检测", en: "Active Fire" }, desc: { cn: "利用热红外或中红外(3-5μm)波段。根据维恩位移定律，高温目标的辐射峰值向短波移动，中红外对高温极度敏感。", en: "Use MIR (3-5μm). Wien's Law: High temp -> Peak shifts to shortwave. MIR is sensitive to fire." } },
                { label: { cn: "火烧迹地", en: "Burn Scar" }, desc: { cn: "利用NBR指数（近红外与短波红外比值）。火灾后植被减少（NIR降），木炭增加（SWIR升），NBR显著下降。", en: "NBR Index. Post-fire: NIR drops, SWIR rises -> NBR drops." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "变化检测", en: "Change Detection", desc_cn: "通过对比同一地区不同时相的影像，提取地表变化状态的技术。", desc_en: "Identifying differences by observing at different times." },
          { cn: "NDWI", en: "NDWI", desc_cn: "归一化差异水体指数 (Green-NIR)/(Green+NIR)，用于突显水体。", desc_en: "Normalized Difference Water Index." }
        ],
        relations: [
          { targetId: 'c2', targetName: 'Microwave RS', label: '核心技术 (Core Tech)', desc: 'SAR的全天候特性对洪水监测至关重要' },
          { targetId: 's5', targetName: 'GNSS Principles', label: '辅助监测 (Auxiliary Monitoring)', desc: '灾害监测往往结合GNSS进行高精度位移测量' }
        ],
        notes: []
      },
      {
        id: "c5",
        name: "Low Altitude UAV Remote Sensing (低空无人机遥感)",
        summary: {
          cn: "这是一门实践性很强的课。专注于利用无人机获取高分辨率数据。核心流程是：飞（航线规划）-> 拍（数据获取）-> 算（SfM建模）。",
          en: "Very practical. UAV for high-res data. Workflow: Fly (Planning) -> Shoot (Acquisition) -> Compute (SfM)."
        },
        goals: {
          cn: "掌握航线规划的关键参数（重叠度、GSD），以及SfM算法如何从二维照片重建三维模型。",
          en: "Master Flight Parameters (Overlap, GSD) and how SfM reconstructs 3D from 2D photos."
        },
        logicTree: {
          label: { cn: "UAV 作业全流程", en: "UAV Workflow" },
          children: [
            {
              label: { cn: "1. 航线规划", en: "1. Flight Planning" },
              children: [
                { label: { cn: "关键参数", en: "Parameters" }, desc: { cn: "航高(H)决定分辨率(GSD)；重叠度(Overlap)决定建模成功率。通常要求航向重叠>60%，旁向>30%，以保证形成立体像对。", en: "H -> GSD. Overlap (Forward>60%, Side>30%) ensures stereo vision for 3D." }, heavy: true },
                { label: { cn: "像控点(GCP)", en: "GCPs" }, desc: { cn: "在地面布设的已知坐标点。作用：1. 绝对定向（把模型放到正确的地球坐标上）；2. 消除非线性畸变，提高精度。", en: "Ground Control Points. For Absolute Orientation and accuracy improvement." } }
              ]
            },
            {
              label: { cn: "2. SfM 建模", en: "2. SfM Algo" },
              children: [
                { label: { cn: "原理", en: "Principle" }, desc: { cn: "Structure from Motion（运动恢复结构）。通过计算机视觉算法，从多角度照片中提取同名特征点（SIFT算法），反算相机位置和稀疏点云。", en: "Reconstruct 3D structure from 2D image motion using SIFT feature matching." }, heavy: true },
                { label: { cn: "光束法平差", en: "Bundle Adj" }, desc: { cn: "SfM的核心优化步骤。最小化重投影误差，优化相机参数和点云坐标。", en: "Minimizing reprojection error to refine camera pose and points." } }
              ]
            },
            {
              label: { cn: "3. 产品生成", en: "3. Products" },
              children: [
                { label: { cn: "DSM & DOM", en: "DSM & DOM" }, desc: { cn: "先生成密集点云 -> 构建TIN -> 生成数字表面模型(DSM) -> 进行微分纠正 -> 生成正射影像(DOM)。", en: "Dense Cloud -> Mesh -> DSM -> Ortho-rectification -> DOM." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "GSD", en: "Ground Sample Distance", desc_cn: "地面采样距离，即照片上一个像素代表的实际地面物理尺寸（如5cm）。", desc_en: "Physical size of one pixel on the ground." },
          { cn: "正射影像", en: "DOM", desc_cn: "经过几何纠正，消除了投影差，具有地图几何精度的影像。", desc_en: "Digital Orthophoto Map. Geometrically corrected image." }
        ],
        relations: [
          { targetId: 's2', targetName: 'Photography Surveying', label: '核心原理 (Core Principle)', desc: 'UAV建模本质上是低空摄影测量(SfM vs 空三)' },
          { targetId: 's5', targetName: 'GNSS Principles', label: '定位支持 (Positioning Support)', desc: 'RTK-GPS为无人机提供厘米级定位与POS数据' }
        ],
        notes: []
      },
      {
        id: "c11",
        name: "Comprehensive Internship in RS Applications (遥感应用综合实习)",
        summary: {
          cn: "这不仅是一门课，而是一个完整的项目实战。我选取了[您的选题，例如：某市10年间城市扩张]作为题目，独立完成了从数据获取到成果展示的全过程。",
          en: "A full project practice. I chose [e.g., Urban Expansion] as my topic and completed the whole process from data acquisition to mapping."
        },
        goals: {
          cn: "能够清晰复述项目的技术路线：预处理 -> 信息提取 -> 精度验证 -> 制图。",
          en: "Articulate the technical roadmap: Pre-processing -> Extraction -> Validation -> Mapping."
        },
        logicTree: {
          label: { cn: "项目技术路线", en: "Technical Roadmap" },
          children: [
            {
              label: { cn: "1. 数据预处理", en: "1. Pre-processing" },
              children: [
                { label: { cn: "辐射定标", en: "Calibration" }, desc: { cn: "将无量纲的DN值转换为辐射亮度或反射率。", en: "DN to Radiance/Reflectance." } },
                { label: { cn: "大气校正", en: "Atm Correction" }, desc: { cn: "使用FLAASH模块，消除大气散射和吸收的影响，还原地表真实反射率。", en: "Using FLAASH to remove atmospheric effects." } },
                { label: { cn: "几何校正", en: "Geo Correction" }, desc: { cn: "选取控制点，将影像配准到标准地图坐标系。", en: "Register image to map coordinates." }, heavy: true }
              ]
            },
            {
              label: { cn: "2. 信息提取", en: "2. Extraction" },
              children: [
                { label: { cn: "方法选择", en: "Method" }, desc: { cn: "我使用了[最大似然法/SVM/NDVI阈值法]提取了[目标地物]。", en: "Used [MLC/SVM/NDVI] to extract [Target]." } },
                { label: { cn: "变化检测", en: "Change Detection" }, desc: { cn: "通过转移矩阵，量化了不同年份间土地利用类型的转化面积。", en: "Quantified transitions using Transition Matrix." } }
              ]
            },
            {
              label: { cn: "3. 结果验证", en: "3. Validation" },
              children: [
                { label: { cn: "精度评价", en: "Accuracy" }, desc: { cn: "利用Google Earth高分影像作为真值，生成随机采样点，构建混淆矩阵，计算总体精度(OA)和Kappa系数。", en: "Used Google Earth as ground truth, built Confusion Matrix, calculated OA & Kappa." }, heavy: true }
              ]
            }
          ]
        },
        terms: [
          { cn: "转移矩阵", en: "Transition Matrix", desc_cn: "一个表格，展示了从时相T1到时相T2，各类别之间相互转化的面积。", desc_en: "Matrix showing area changes between classes over time." },
          { cn: "地面实测", en: "Ground Truth", desc_cn: "用于验证遥感解译结果准确性的真实地面数据。", desc_en: "Real data collected on ground for validation." }
        ],
        relations: [
          { targetId: 'c1', targetName: 'Principles of RS', label: '综合应用 (Comprehensive Application)', desc: '综合运用了遥感全流程知识' },
          { targetId: 'c7', targetName: 'DIP', label: '技术支撑 (Tech Support)', desc: '预处理与分类是项目成功的关键' }
        ],
        notes: []
      },
      {
        id: "c12",
        name: "Practice of RS Principles and Applications (遥感原理与应用实验)",
        summary: {
          cn: "这是配套理论课的软件操作课，主要使用ENVI和ArcGIS。重点是掌握基本操作流程，把理论落到实处。",
          en: "Software lab sessions using ENVI/ArcGIS. Focus on basic operation workflows."
        },
        goals: {
          cn: "熟悉ENVI界面，掌握几何校正、图像融合和监督分类的具体操作步骤。",
          en: "Master ENVI interface, steps for Geo-correction, Fusion, and Classification."
        },
        logicTree: {
          label: { cn: "实验操作流", en: "Lab Workflow" },
          children: [
            {
              label: { cn: "1. 几何校正", en: "1. Geo-Correction" },
              children: [
                { label: { cn: "步骤", en: "Steps" }, desc: { cn: "显示基准图和待校正图 -> 选取分布均匀的GCP（地面控制点） -> 检查RMS误差（要求小于0.5像素） -> 执行重采样（最邻近/双线性/立方卷积）。", en: "Select GCPs -> Check RMS Error (<0.5) -> Resample." }, heavy: true }
              ]
            },
            {
              label: { cn: "2. 图像分类", en: "2. Classification" },
              children: [
                { label: { cn: "步骤", en: "Steps" }, desc: { cn: "定义分类体系 -> 勾画感兴趣区(ROI)作为训练样本 -> 计算样本分离度(Separability) -> 执行最大似然分类(MLC) -> 精度评价。", en: "Define classes -> Draw ROIs -> Check Separability -> Run MLC -> Accuracy." } }
              ]
            },
            {
              label: { cn: "3. 图像融合", en: "3. Fusion" },
              children: [
                { label: { cn: "全色锐化", en: "Pan-sharpening" }, desc: { cn: "将低分辨率多光谱影像与高分辨率全色影像融合（如Gram-Schmidt方法），既有颜色又有细节。", en: "Fusing low-res MS and high-res Pan images (e.g. Gram-Schmidt)." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "GCP", en: "Ground Control Point", desc_cn: "地面控制点，用于建立图像坐标与地理坐标的联系。", desc_en: "Points used to link image coords to map coords." },
          { cn: "ROI", en: "Region of Interest", desc_cn: "在图像上选取的子区域，常用于作为分类的训练样本。", desc_en: "Subset of image used as training samples." }
        ],
        relations: [
          { targetId: 'c1', targetName: 'Principles of RS', label: '实践对象 (Practice Object)', desc: '理论知识在ENVI软件中的具体操作' },
          { targetId: 'c7', targetName: 'DIP', label: '算法实现 (Algorithm Implementation)', desc: '亲手操作最大似然分类与图像增强' }
        ],
        notes: []
      },
      {
        id: "c13",
        name: "Internship in RS Image Processing (遥感图像处理综合实习)",
        summary: {
          cn: "这门课不同于ENVI点鼠标，侧重于**编程实现**。我使用 Python 语言结合 GDAL 和 Numpy 库，实现了底层的图像处理算法。",
          en: "Focuses on Coding, not clicking. I used Python (GDAL, Numpy) to implement low-level algorithms."
        },
        goals: {
          cn: "掌握使用GDAL库读写栅格数据，利用Numpy进行矩阵运算（如NDVI计算），理解算法的底层逻辑。",
          en: "Master GDAL I/O, Numpy matrix operations (NDVI), and algorithm logic."
        },
        logicTree: {
          label: { cn: "编程实践", en: "Coding Practice" },
          children: [
            {
              label: { cn: "1. 库与环境", en: "1. Libraries" },
              children: [
                { label: { cn: "GDAL", en: "GDAL" }, desc: { cn: "这是处理空间数据的核心库。我用 `gdal.Open()` 读取GeoTIFF，获取投影和坐标信息。", en: "Core geo-library. Used gdal.Open() to read GeoTIFFs." }, heavy: true },
                { label: { cn: "Numpy", en: "Numpy" }, desc: { cn: "用于高效的矩阵运算。`ReadAsArray()`把影像转为数组。", en: "For matrix math. Image to Array." } }
              ]
            },
            {
              label: { cn: "2. 算法实现", en: "2. Implementation" },
              children: [
                { label: { cn: "波段运算", en: "Band Math" }, desc: { cn: "利用数组广播机制计算 NDVI = (NIR-R)/(NIR+R)。注意要处理分母为0的情况。", en: "Array broadcasting for NDVI. Handle division by zero." } },
                { label: { cn: "底层算法", en: "Core Algo" }, desc: { cn: "我尝试手写了 K-means 聚类算法。理解了‘随机初始化中心 -> 计算距离归类 -> 更新中心 -> 迭代收敛’的循环过程。", en: "Hand-coded K-means: Init -> Assign -> Update -> Iterate." }, heavy: true }
              ]
            },
            {
              label: { cn: "3. 批处理", en: "3. Batch Processing" },
              children: [
                { label: { cn: "自动化", en: "Automation" }, desc: { cn: "利用 `os.walk` 遍历文件夹，批量对影像进行裁剪或格式转换，极大提高了效率。", en: "Looping through folders to batch process images." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "GDAL", en: "Geospatial Data Abstraction Library", desc_cn: "一个开源栅格空间数据转换库，是遥感编程的事实标准。", desc_en: "Open source translator library for raster geospatial data." },
          { cn: "迭代", en: "Iteration", desc_cn: "在算法中重复执行一系列步骤直到满足停止条件（如K-means收敛）。", desc_en: "Repeating steps until a condition is met." }
        ],
        relations: [
          { targetId: 'p5', targetName: 'C Programming', label: '基础 (Foundation)', desc: 'GDAL底层由C++编写，Python调用需理解指针与内存' },
          { targetId: 'c7', targetName: 'DIP', label: '底层复现 (Low-level Implementation)', desc: '手写代码实现NDVI计算与直方图统计' }
        ],
        notes: []
      },
      {
        id: "c14",
        name: "RS Application Model Internship (遥感应用模型实习)",
        summary: {
          cn: "这门课是最高阶的应用。我们不满足于看图，而是要反演定量参数（如估产、生物量）。我建立了一个回归模型来估算[某参数]。",
          en: "Advanced application. Quantitative retrieval (Yield, Biomass). I built a regression model."
        },
        goals: {
          cn: "掌握数据预处理（时空匹配）、特征筛选、回归建模以及模型精度评价的方法。",
          en: "Master Data Matching, Feature Selection, Regression Modeling, and Validation."
        },
        logicTree: {
          label: { cn: "定量建模流程", en: "Modeling Workflow" },
          children: [
            {
              label: { cn: "1. 数据匹配", en: "1. Data Matching" },
              children: [
                { label: { cn: "时空一致性", en: "Consistency" }, desc: { cn: "这是最关键的一步。卫星过境时间必须与地面采样时间尽可能接近（准同步），且坐标要精确对应。", en: "Critical. Satellite pass time must match ground sampling time." }, heavy: true },
                { label: { cn: "值提取", en: "Extraction" }, desc: { cn: "根据采样点的GPS坐标，提取对应像元的光谱值或指数值。", en: "Extract pixel values based on GPS coordinates." } }
              ]
            },
            {
              label: { cn: "2. 建模", en: "2. Modeling" },
              children: [
                { label: { cn: "相关性分析", en: "Correlation" }, desc: { cn: "计算皮尔逊相关系数，筛选出与目标参数（如生物量）相关性最高的波段或指数。", en: "Pearson correlation to select best features." } },
                { label: { cn: "回归方程", en: "Regression" }, desc: { cn: "建立一元或多元线性回归方程。我也尝试了随机森林(RF)等机器学习方法。", en: "Linear Regression or Machine Learning (Random Forest)." } }
              ]
            },
            {
              label: { cn: "3. 验证", en: "3. Validation" },
              children: [
                { label: { cn: "留一法", en: "LOOCV" }, desc: { cn: "样本少时使用交叉验证。每次留一个做验证，其余做训练，循环N次。", en: "Leave-One-Out Cross-Validation." } },
                { label: { cn: "评价指标", en: "Metrics" }, desc: { cn: "R² (决定系数)：看趋势拟合得好不好（越接近1越好）；RMSE (均方根误差)：看预测值偏离了多少（越小越好）。", en: "R-squared (Fit), RMSE (Error magnitude)." }, heavy: true }
              ]
            }
          ]
        },
        terms: [
          { cn: "拟合优度", en: "R-squared", desc_cn: "统计指标，表示模型对观测数据变异性的解释程度。", desc_en: "Statistical measure of how close data are to the regression line." },
          { cn: "均方根误差", en: "RMSE", desc_cn: "预测值与真实值偏差的平方和平均值的平方根，衡量模型的绝对误差。", desc_en: "Root Mean Square Error. Measures absolute error." }
        ],
        notes: []
      }
    ]
  },
  {
    category: "测绘与空间信息类 (Surveying & Spatial Info)",
    courses: [
      {
        id: "s1",
        name: "Fundamentals of Geodesy B (大地测量学基础B)",
        summary: {
          cn: "测绘学的基石。主要研究地球的几何形状、物理性质、重力场以及建立国家空间坐标参考系的基础理论。",
          en: "The cornerstone of surveying. Studies Earth's geometry, gravity field, and the theoretical basis for establishing national spatial coordinate reference systems."
        },
        goals: {
          cn: "深刻理解水准面与参考椭球面的差异，掌握高斯-克吕格投影变形规律，以及坐标系转换的七参数模型。",
          en: "Understand Geoid vs Reference Ellipsoid, Gauss-Kruger projection distortions, and 7-parameter coordinate transformation."
        },
        logicTree: {
          label: { cn: "大地测量体系", en: "Geodetic System" },
          children: [
            {
              label: { cn: "1. 坐标系统", en: "1. Coordinate Systems" },
              children: [
                {
                  label: { cn: "基准面", en: "Datums" },
                  desc: { cn: "大地水准面（物理基准，测高程）；参考椭球面（数学基准，测平面）。垂线偏差是两者的夹角。", en: "Geoid (Physical, for Height); Ellipsoid (Math, for Position). Deflection of vertical connects them." },
                  heavy: true
                },
                {
                  label: { cn: "地图投影", en: "Map Projection" },
                  desc: { cn: "高斯-克吕格投影：等角横切椭圆柱投影。中央经线无变形，离中央经线越远长度变形越大。", en: "Gauss-Kruger: Conformal transverse cylindrical. Central meridian has no distortion; distortion increases with distance." }
                }
              ]
            },
            {
              label: { cn: "2. 高程系统", en: "2. Height Systems" },
              children: [
                {
                  label: { cn: "系统分类", en: "Types" },
                  desc: { cn: "正高（沿重力线到大地水准面）；正常高（沿重力线到似大地水准面，中国采用）；大地高（沿法线到椭球面）。关系：h = H + N。", en: "Orthometric (to Geoid); Normal (to Quasi-geoid, used in CN); Ellipsoidal (to Ellipsoid). h = H + N." },
                  heavy: true
                }
              ]
            }
          ]
        },
        terms: [
          { cn: "大地水准面", en: "Geoid", desc_cn: "一个与平均海水面重合并延伸到大陆内部的封闭重力等位面，是正高系统的基准面。", desc_en: "Equipotential surface of gravity coinciding with mean sea level." },
          { cn: "高斯投影", en: "Gauss Projection", desc_cn: "一种保角投影，中国地形图（1:50万以上）主要采用此投影。", desc_en: "Conformal projection used for Chinese topographic maps." }
        ],
        relations: [
          { targetId: 'm7', targetName: 'College Physics C1', label: '重力场 (Gravity Field)', desc: '大地水准面的定义依赖重力位势理论' },
          { targetId: 'm1', targetName: 'Adv. Math B1', label: '几何基础 (Geometry Foundation)', desc: '椭球面的曲率半径计算需要微分几何与微积分' }
        ],
        notes: []
      },
      {
        id: "s2",
        name: "Photography Surveying (摄影测量学)",
        summary: {
          cn: "从二维照片重建三维世界。核心是利用‘共线方程’，通过立体像对的几何反解，恢复物体在空间中的位置。",
          en: "Reconstructing 3D world from 2D photos. Core is 'Collinearity Equation' to recover spatial position from stereo pairs."
        },
        goals: {
          cn: "掌握中心投影规律、内外方位元素的物理意义，以及空中三角测量（空三）的平差原理。",
          en: "Master Central Projection, Orientation Elements (Interior/Exterior), and Aerial Triangulation adjustment."
        },
        logicTree: {
          label: { cn: "摄影测量逻辑", en: "Photogrammetry Logic" },
          children: [
            {
              label: { cn: "1. 成像几何", en: "1. Geometry" },
              children: [
                {
                  label: { cn: "共线方程", en: "Collinearity Eq" },
                  desc: { cn: "摄影中心、像点、物点三点共线。这是摄影测量最核心的数学模型，联系了像空间坐标与地面空间坐标。", en: "Center, Image point, Object point lie on a line. The core mathematical model linking 2D and 3D." },
                  heavy: true
                },
                {
                  label: { cn: "人造立体", en: "Stereo Vision" },
                  desc: { cn: "利用双眼视差原理。通过左右两张有重叠的照片，分光给左右眼，在大脑中重建立体模型。", en: "Parallax principle. Overlapping left/right photos create 3D perception." }
                }
              ]
            },
            {
              label: { cn: "2. 定向过程", en: "2. Orientation" },
              children: [
                {
                  label: { cn: "相对与绝对", en: "Rel. & Abs." },
                  desc: { cn: "相对定向：恢复两张照片的相对位置（建立模型，无坐标）；绝对定向：引入地面控制点(GCP)，把模型纳入绝对坐标系。", en: "Relative: Restore relative pos (Model); Absolute: Use GCPs to fit into specific coordinate system." }
                }
              ]
            }
          ]
        },
        terms: [
          { cn: "外方位元素", en: "Exterior Orientation", desc_cn: "描述摄影瞬间摄影中心在地面坐标系中的位置(Xs,Ys,Zs)和姿态(φ,ω,κ)的6个参数。", desc_en: "6 params describing position and attitude of the camera center." },
          { cn: "核线", en: "Epipolar Line", desc_cn: "核面与影像面的交线。同名像点必定位于同名核线上，这大大简化了影像匹配搜索范围。", desc_en: "Intersection of epipolar plane and image plane; used to constrain matching." }
        ],
        relations: [
          { targetId: 'm5', targetName: 'Linear Algebra A', label: '数学核心 (Math Core)', desc: '共线方程解算不仅依靠矩阵求逆，还需要最小二乘平差' },
          { targetId: 's1', targetName: 'Fund. of Geodesy', label: '空间基准 (Spatial Reference)', desc: '绝对定向需要将像空间坐标转换为大地坐标' }
        ],
        notes: []
      },
      {
        id: "s3",
        name: "Photogrammetry Course Internship (摄影测量实习)",
        summary: {
          cn: "理论的落地。主要在数字摄影测量工作站（如VirtuoZo或Inpho）上进行操作，从原始航片生产出4D产品。",
          en: "Theory into practice. Operations on Digital Photogrammetry Workstations (DPW) to produce 4D products."
        },
        goals: {
          cn: "熟练操作工作站，完成‘空三加密’，并能手工采集特征线，生成合格的DEM和DOM。",
          en: "Master DPW, finish Aerotriangulation, manually collect breaklines, generate DEM/DOM."
        },
        logicTree: {
          label: { cn: "作业流程", en: "Workflow" },
          children: [
            {
              label: { cn: "1. 准备", en: "1. Prep" },
              children: [
                { label: { cn: "数据导入", en: "Import" }, desc: { cn: "导入相机参数文件、航片和控制点数据。", en: "Import Camera calibration, Aerial photos, and GCPs." } }
              ]
            },
            {
              label: { cn: "2. 核心处理", en: "2. Processing" },
              children: [
                {
                  label: { cn: "空三加密", en: "Aerial Triangulation" },
                  desc: { cn: "最关键一步。利用少量的地面控制点，解算出所有影像的外方位元素和加密点坐标。", en: "Crucial. Solve exterior orientation for all images using few GCPs." },
                  heavy: true
                },
                {
                  label: { cn: "产品生成", en: "Production" },
                  desc: { cn: "DEM编辑（剔除房屋树木）；DOM纠正（消除投影差）；DLG采集（立体测图）。", en: "DEM editing (remove objects); DOM rectification; DLG stereo plotting." }
                }
              ]
            }
          ]
        },
        terms: [],
        relations: [
          { targetId: 's2', targetName: 'Photography Surveying', label: '实践 (Practice)', desc: '全数字摄影测量工作站的操作' }
        ],
        notes: []
      },
      {
        id: "s4",
        name: "Lidar Technology (激光雷达技术)",
        summary: {
          cn: "主动遥感的前沿。通过发射激光脉冲测距，直接获取高精度的三维点云坐标，是获取数字地表模型最有效的手段。",
          en: "Active RS frontier. Laser ranging to get high-precision 3D point clouds. Best for DSM/DTM."
        },
        goals: {
          cn: "理解LiDAR测距公式，掌握点云数据的预处理（去噪）、滤波（区分地面/非地面）及分类流程。",
          en: "Understand Ranging formula, Point Cloud Pre-processing (Denoising), Filtering (Ground/Non-ground), and Classification."
        },
        logicTree: {
          label: { cn: "LiDAR 核心", en: "LiDAR Core" },
          children: [
            {
              label: { cn: "1. 原理", en: "1. Principle" },
              children: [
                {
                  label: { cn: "测距公式", en: "Ranging" },
                  desc: { cn: "距离 = 光速 × (时间/2)。结合GPS（位置）和IMU（姿态），计算出激光脚点的绝对坐标。", en: "Distance = c * t / 2. Combine with GPS/IMU to get absolute coords." }
                },
                {
                  label: { cn: "多回波", en: "Multi-return" },
                  desc: { cn: "一束激光穿过植被时，会产生多次反射。第一回波代表冠层顶部，最后回波代表地面。这使其能‘穿透’植被测地形。", en: "One pulse, multiple returns. 1st: Canopy top; Last: Ground. Allows 'penetration'." },
                  heavy: true
                }
              ]
            },
            {
              label: { cn: "2. 数据处理", en: "2. Processing" },
              children: [
                {
                  label: { cn: "点云滤波", en: "Filtering" },
                  desc: { cn: "核心算法（如渐进三角网TIN）。目的是从混杂的点云中分离出‘地面点’，用于生成DEM。", en: "Core algorithm (e.g., Progressive TIN). Separating 'Ground points' to generate DEM." },
                  heavy: true
                }
              ]
            }
          ]
        },
        terms: [
          { cn: "点云", en: "Point Cloud", desc_cn: "海量三维坐标点的集合，是LiDAR数据的基本组织形式。", desc_en: "Collection of massive 3D points." },
          { cn: "全波形", en: "Full Waveform", desc_cn: "记录回波能量随时间变化的完整曲线，而不仅仅是离散点，包含更多物体结构信息。", desc_en: "Recording the full energy profile of the echo." }
        ],
        relations: [
          { targetId: 'm8', targetName: 'College Physics C2', label: '物理原理 (Physics Principle)', desc: '激光测距基于光速恒定原理' },
          { targetId: 's2', targetName: 'Photography Surveying', label: '互补技术 (Complementary Tech)', desc: 'LiDAR获取结构(Z)，摄影测量获取纹理(RGB)' }
        ],
        notes: []
      },
      {
        id: "s5",
        name: "GNSS Principles & Applications B (GNSS原理与应用B)",
        summary: {
          cn: "定位置的学问。涵盖GPS、北斗、GLONASS、Galileo四大系统。核心是如何通过接收卫星信号，精确算出接收机的位置。",
          en: "Science of Positioning. GPS/BDS/GLONASS/Galileo. How to calculate receiver position from satellite signals."
        },
        goals: {
          cn: "区分伪距测量与载波相位测量及其精度差异，重点掌握RTK（实时动态差分）的工作原理。",
          en: "Distinguish Pseudorange vs Carrier Phase. Master RTK (Real-Time Kinematic) principles."
        },
        logicTree: {
          label: { cn: "GNSS 架构", en: "GNSS Arch" },
          children: [
            {
              label: { cn: "1. 组成", en: "1. Segments" },
              children: [
                { label: { cn: "三部分", en: "3 Segments" }, desc: { cn: "空间部分（卫星星座）、地面控制部分（主控站/监测站）、用户部分（接收机）。", en: "Space (Satellites), Control (Ground stations), User (Receivers)." } }
              ]
            },
            {
              label: { cn: "2. 定位原理", en: "2. Positioning" },
              children: [
                {
                  label: { cn: "观测值", en: "Observables" },
                  desc: { cn: "伪距（码相位，米级精度）；载波相位（波长毫米级，通过解算整周模糊度，可达厘米级精度）。", en: "Pseudorange (Code, meters); Carrier Phase (mm level, needs Ambiguity Resolution)." },
                  heavy: true
                },
                {
                  label: { cn: "差分技术", en: "Differential" },
                  desc: { cn: "利用基准站已知坐标求出误差修正数，发送给流动站。RTK利用载波相位差分，实现了实时厘米级定位。", en: "Base station corrects errors. RTK uses Carrier Phase Differential for real-time cm-level accuracy." }
                }
              ]
            },
            {
              label: { cn: "3. 误差源", en: "3. Errors" },
              children: [
                { label: { cn: "主要误差", en: "Main Errors" }, desc: { cn: "与卫星有关（星历/钟差）；与传播有关（电离层/对流层延迟、多路径效应）；与接收机有关。", en: "Sat (Ephemeris/Clock); Path (Ionosphere/Troposphere/Multipath); Receiver." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "整周模糊度", en: "Integer Ambiguity", desc_cn: "载波相位测量中，起始时刻卫星到接收机之间未知的整波数。解算出它(Fix)是高精度定位的关键。", desc_en: "Unknown number of full cycles at start. Solving it is key to precision." },
          { cn: "DOP", en: "Dilution of Precision", desc_cn: "精度衰减因子。反映卫星空间几何分布对定位精度的影响，值越小越好。", desc_en: "Geometric strength of satellite configuration. Lower is better." }
        ],
        relations: [
          { targetId: 's1', targetName: 'Fund. of Geodesy', label: '坐标系 (Coordinate System)', desc: 'WGS84与CGCS2000坐标系转换是GNSS应用的前提' },
          { targetId: 'm8', targetName: 'College Physics C2', label: '信号传播 (Signal Propagation)', desc: '电离层与对流层延迟是电磁波传播的物理效应' }
        ],
        notes: []
      },
      {
        id: "s6",
        name: "3D GIS (三维GIS)",
        summary: {
          cn: "从平面地图走向立体世界。传统GIS处理地表X、Y，三维GIS引入Z轴，解决地下管网、复杂建筑物内部、地质体等真三维表达问题。",
          en: "From 2D maps to 3D world. Adds Z-axis to handle underground utilities, building interiors, and geology."
        },
        goals: {
          cn: "掌握三维数据模型（表面 vs 体元），理解LOD（细节层次）技术在渲染优化中的作用。",
          en: "Master 3D Data Models (Surface vs Voxel), understand LOD (Level of Detail) for rendering optimization."
        },
        logicTree: {
          label: { cn: "三维体系", en: "3D System" },
          children: [
            {
              label: { cn: "1. 数据模型", en: "1. Data Models" },
              children: [
                {
                  label: { cn: "表面模型", en: "Surface Rep" },
                  desc: { cn: "侧重外观。TIN（不规则三角网）、Grid（格网）、B-Rep（边界表示法，如CityGML）。", en: "Focus on boundary. TIN, Grid, B-Rep (CityGML)." }
                },
                {
                  label: { cn: "体模型", en: "Volumetric Rep" },
                  desc: { cn: "侧重内部结构。CSG（构造实体几何）、Voxel（体素，类似三维像素）、Octree（八叉树，高效索引）。", en: "Focus on interior. CSG, Voxel, Octree." },
                  heavy: true
                }
              ]
            },
            {
              label: { cn: "2. 可视化", en: "2. Visualization" },
              children: [
                {
                  label: { cn: "LOD技术", en: "LOD" },
                  desc: { cn: "远看大概，近看细节。根据观察距离动态切换模型精细度（如LOD0只是方块，LOD4包含家具），平衡性能与效果。", en: "Distance-dependent detail. LOD0 (Block) -> LOD4 (Interior). Balances performance." }
                }
              ]
            }
          ]
        },
        terms: [
          { cn: "体素", en: "Voxel", desc_cn: "体积元素(Volume Pixel)，是三维空间分割的最小单位，类似二维图像的像素。", desc_en: "Volume element. 3D equivalent of a pixel." },
          { cn: "CityGML", en: "CityGML", desc_cn: "一种开放的XML格式，用于存储和交换三维城市模型，如定义了建筑物的LOD等级。", desc_en: "Open XML standard for 3D city models." }
        ],
        relations: [
          { targetId: 's8', targetName: 'Prin of GIS', label: '进阶 (Advanced)', desc: '从二维平面扩展到三维立体空间' },
          { targetId: 'p3', targetName: 'Computer Vision', label: '技术融合 (Tech Integration)', desc: '三维重建常借助CV领域的SfM与SLAM技术' }
        ],
        notes: []
      },
      {
        id: "s7",
        name: "Digital Topography (数字测图)",
        summary: {
          cn: "现代测绘生产的主力课。利用全站仪配合草图或编码，在野外采集碎部点坐标，内业使用软件（如CASS）绘制地形图。",
          en: "Main production course. Using Total Station with sketches/codes to collect field points, and mapping with software (CASS)."
        },
        goals: {
          cn: "熟练掌握‘全站仪’操作，理解‘草图法’与‘简码法’的作业流程，能够绘制大比例尺数字地形图。",
          en: "Master Total Station operation, workflow of 'Sketch mode' vs 'Code mode', and large-scale topographic mapping."
        },
        logicTree: {
          label: { cn: "测图流程", en: "Mapping Flow" },
          children: [
            {
              label: { cn: "1. 数据采集", en: "1. Acquisition" },
              children: [
                {
                  label: { cn: "控制与碎部", en: "Control & Detail" },
                  desc: { cn: "先控制后碎部。先布设控制网测定骨架点，再在控制点上架设仪器由极坐标法测定碎部点（房屋角、路边）。", en: "Control first, then details. Polar Coordinate Method for details." },
                  heavy: true
                },
                {
                  label: { cn: "作业模式", en: "Modes" },
                  desc: { cn: "草图法（画草图记录点号属性，直观但慢）；编码法（输入特定代码代表地物，全自动成图，要求高）。", en: "Sketch (Manual record, intuitive); Coding (Auto-mapping, requires memorizing codes)." }
                }
              ]
            },
            {
              label: { cn: "2. 绘图编辑", en: "2. Editing" },
              children: [
                { label: { cn: "内业处理", en: "Office Work" }, desc: { cn: "数据传输 -> 展点 -> 连线 -> 勾绘等高线 -> 图廓修饰。", en: "Transfer -> Plot points -> Connect lines -> Contours -> Finishing." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "碎部点", en: "Detail Point", desc_cn: "反映地物特征和地貌特征的关键点，如房角、道路转折点。", desc_en: "Key points defining features and terrain." },
          { cn: "地物与地貌", en: "Features & Terrain", desc_cn: "地物是地面上的物体（房/路），地貌是地面的起伏状态（山/谷）。", desc_en: "Features (Objects) vs Terrain (Relief)." }
        ],
        relations: [
          { targetId: 's10', targetName: 'Surveying A', label: '应用与延伸 (Application & Extension)', desc: '将全站仪测量数据转化为数字图形' },
          { targetId: 's8', targetName: 'Prin of GIS', label: '数据源 (Data Source)', desc: '数字测图是GIS最重要的矢量数据来源' }
        ],
        notes: []
      },
      {
        id: "s8",
        name: "Principles of Geographic Information System B (地理信息系统原理B)",
        summary: {
          cn: "GIS的理论内核。系统讲解如何把现实世界抽象为数字模型，以及如何进行空间查询与分析。",
          en: "Theoretical core of GIS. How to abstract real world into digital models, and perform spatial query/analysis."
        },
        goals: {
          cn: "透彻理解矢量与栅格数据结构的优劣，掌握空间数据的拓扑关系，以及缓冲区、叠加分析等核心算法。",
          en: "Detailed grasp of Vector vs Raster, Topological relations, Buffer, and Overlay analysis."
        },
        logicTree: {
          label: { cn: "GIS 知识树", en: "GIS Tree" },
          children: [
            {
              label: { cn: "1. 数据结构", en: "1. Data Struct" },
              children: [
                {
                  label: { cn: "矢量 vs 栅格", en: "Vector vs Raster" },
                  desc: { cn: "矢量：点线面，精度高，适合网络分析，数据量小；栅格：像素矩阵，计算简单，适合空间叠加，数据量大。", en: "Vector (Point/Line/Poly, Precise); Raster (Grid, Simple math, Heavy)." },
                  heavy: true
                },
                {
                  label: { cn: "拓扑关系", en: "Topology" },
                  desc: { cn: "描述空间目标之间的邻接、关联、包含关系。不仅存画在哪，还存‘谁在谁旁边’。作用：数据检查、网络分析。", en: "Adjacency, Connectivity, Containment. Knows 'what is next to what'. Vital for validation." }
                }
              ]
            },
            {
              label: { cn: "2. 空间分析", en: "2. Spatial Analysis" },
              children: [
                {
                  label: { cn: "基础分析", en: "Basic Analysis" },
                  desc: { cn: "缓冲区(Buffer)：解决‘方圆几里’问题；叠加(Overlay)：解决‘选址’问题（层与层交集）。", en: "Buffer (Proximity); Overlay (Site selection / Interaction)." },
                  heavy: true
                }
              ]
            }
          ]
        },
        terms: [
          { cn: "拓扑", en: "Topology", desc_cn: "在橡胶表面变换下保持不变的空间属性。即不考虑几尺度和具体位置，只关注相对关系。", desc_en: "Spatial relationships unchanged by rubber-sheet transformations." },
          { cn: "四叉树", en: "Quadtree", desc_cn: "一种常用的栅格数据压缩编码方法，将图像递归划分为四个象限。", desc_en: "Raster compression coding by recursively dividing into 4 quadrants." }
        ],
        relations: [
          { targetId: 'p1', targetName: 'Data Structure', label: '底层实现 (Low-level Implementation)', desc: '矢量(链表/树)与栅格(数组)深受数据结构影响' },
          { targetId: 's10', targetName: 'Surveying A', label: '数据来源 (Data Source)', desc: '测绘是GIS数据的主要来源之一' }
        ],
        notes: []
      },
      {
        id: "s9",
        name: "Geographic Information System Practice (GIS实习)",
        summary: {
          cn: "ArcGIS/QGIS 实战课。从一张扫描地图开始，经历‘配准-数字化-建库-分析-制图’的全过程。",
          en: "ArcGIS/QGIS Lab. Full flow: Georeferencing -> Digitizing -> Database -> Analysis -> Mapping."
        },
        goals: {
          cn: "熟练使用软件工具箱，能独立完成地理数据库(GDB)构建，并进行专题图设计与输出。",
          en: "Master toolbox, build Geodatabase (GDB), and design thematic maps."
        },
        logicTree: {
          label: { cn: "操作流程", en: "Lab Flow" },
          children: [
            {
              label: { cn: "1. 数据生产", en: "1. Production" },
              children: [
                { label: { cn: "地理配准", en: "Georeferencing" }, desc: { cn: "给普通图片赋予空间坐标。选取控制点，定义投影。", en: "Assigning coords to raw images." } },
                { label: { cn: "矢量化", en: "Vectorization" }, desc: { cn: "屏幕跟踪数字化。手动描绘点线面，注意捕捉节点以保证拓扑正确。", en: "Heads-up digitizing. Snapping nodes for topology." } },
                { label: { cn: "属性录入", en: "Attribution" }, desc: { cn: "如给多边形添加‘土地类型’字段。", en: "Adding data fields." } }
              ]
            },
            {
              label: { cn: "2. 空间分析应用", en: "2. Application" },
              children: [
                { label: { cn: "选址分析", en: "Site Selection" }, desc: { cn: "经典案例：寻找‘坡度<15度 且 距水源<200米’的区域。利用Reclassify和Raster Calculator。", en: "Find area 'Slope<15 AND Dist<200'. Reclassify & Raster Math." }, heavy: true }
              ]
            }
          ]
        },
        terms: [],
        relations: [
          { targetId: 's8', targetName: 'Prin of GIS', label: '实践 (Practice)', desc: 'GIS软件操作' }
        ],
        notes: []
      },
      {
        id: "s10",
        name: "Surveying A (测量学A)",
        summary: {
          cn: "所有测绘课的起点。主要学习三大基本测量：高差、角度、距离。以及从‘测’到‘绘’的基本原理。",
          en: "The starting point. The Big 3: Height, Angle, Distance. Principle of 'Measuring to Mapping'."
        },
        goals: {
          cn: "掌握水准仪、经纬仪的操作，理解测量工作的基本原则：‘从整体到局部，先控制后碎部’。",
          en: "Master Level & Theodolite. Rule No.1: 'Part to Whole, Control then Detail'."
        },
        logicTree: {
          label: { cn: "基本测量", en: "Basic Surveying" },
          children: [
            {
              label: { cn: "1. 仪器与方法", en: "1. Instruments" },
              children: [
                {
                  label: { cn: "水准测量", en: "Leveling" },
                  desc: { cn: "使用水准仪(Level)。原理：利用水平视线测定两点高差。注意前后视距相等可消除视准轴误差(i角)。", en: "Measure height diff using horizontal LOS. Equal fore/back sight cancels collimation error." },
                  heavy: true
                },
                {
                  label: { cn: "角度测量", en: "Angle Msmt" },
                  desc: { cn: "使用经纬仪(Theodolite)。盘左盘右取平均（测回法）可消除视准轴不垂直横轴等大部分仪器误差。", en: "Measure angles. Face Left/Right averaging cancels instrumental errors." }
                }
              ]
            },
            {
              label: { cn: "2. 导线测量", en: "2. Traverse" },
              children: [
                {
                  label: { cn: "内业计算", en: "Computation" },
                  desc: { cn: "角度闭合差分配 -> 方位角推算 -> 坐标增量计算 -> 坐标闭合差分配 -> 最终坐标。", en: "Angular misclosure -> Azimuth -> Coordinate diff -> Correction -> Final Coords." }
                }
              ]
            }
          ]
        },
        terms: [
          { cn: "视准轴", en: "Collimation Axis", desc_cn: "望远镜物镜光心与十字丝中心的连线。", desc_en: "Line connecting objective lens center and crosshair center." },
          { cn: "i角", en: "i-angle", desc_cn: "水准仪视准轴与水准管轴不平行产生的夹角。", desc_en: "Angle between line of sight and bubble tube axis." }
        ],
        relations: [
          { targetId: 'm1', targetName: 'Adv. Math B1', label: '计算基础 (Calculation Foundation)', desc: '角度与距离的计算涉及三角函数' },
          { targetId: 'm9', targetName: 'Physics Exp A1', label: '仪器操作 (Instrument Operation)', desc: '物理实验中的误差理论与精密仪器调节是测量的基础' }
        ],
        notes: []
      },
      {
        id: "s11",
        name: "Surveying Practice A (测量实习A)",
        summary: {
          cn: "校园测图大作业。通常是小组合作，在校园内布设控制网，并完成一幅大比例尺地形图。",
          en: "Campus mapping project. Group work. Establish control network and map a large-scale topo map."
        },
        goals: {
          cn: "强化仪器操作肌肉记忆，体验完整的工程流程，学会处理外业测量中遇到的闭合差超限等实际问题。",
          en: "Muscle memory for instruments. Full engineering flow. Solving real problems like misclosure limits."
        },
        logicTree: {
          label: { cn: "实习任务", en: "Tasks" },
          children: [
            {
              label: { cn: "1. 控制测量", en: "1. Control" },
              children: [
                { label: { cn: "闭合导线", en: "Closed Traverse" }, desc: { cn: "外业选点埋石 -> 测角量边 -> 内业计算平差。要求：相对闭合差<1/3000。", en: "Field work -> Angle/Dist -> Computation. Loop closure better than 1/3000." }, heavy: true },
                { label: { cn: "四等水准", en: "Leveling" }, desc: { cn: "闭合水准路线，测定控制点高程。", en: "Closed loop leveling for heights." } }
              ]
            },
            {
              label: { cn: "2. 碎部测图", en: "2. Detail Survey" },
              children: [
                { label: { cn: "经纬仪测绘法", en: "Details" }, desc: { cn: "利用经纬仪测角视距法，配合量角器现场展点绘图（传统方法，锻炼绘图感）。", en: "Optical method + manual plotting. Good for understanding." } }
              ]
            }
          ]
        },
        terms: [],
        relations: [
          { targetId: 's10', targetName: 'Surveying A', label: '实践 (Practice)', desc: '校园测量实习' }
        ],
        notes: []
      },
      {
        id: "s12",
        name: "Principles of Geospatial Data Visualization (空间数据可视化原理)",
        summary: {
          cn: "地图学与计算机图形学的交叉。研究如何让地图既准确又美观，有效地传递空间信息。",
          en: "Intersection of Cartography and CG. Making maps accurate, beautiful, and effective."
        },
        goals: {
          cn: "掌握贝平的‘视觉变量’理论，色彩设计的原则，以及分级统计图等专题图的设计方法。",
          en: "Master Bertin's Visual Variables, Color theory, and Thematic Map design (Choropleth, etc.)."
        },
        logicTree: {
          label: { cn: "可视化设计", en: "Viz Design" },
          children: [
            {
              label: { cn: "1. 视觉变量", en: "1. Visual Vars" },
              children: [
                {
                  label: { cn: "六大变量", en: "The 6 Vars" },
                  desc: { cn: "形状、尺寸、方向（主要表达质/量差异）；色相、明度、饱和度（色彩三属性）。不同变量适合表达不同类型的数据（定性/定量/等级）。", en: "Shape, Size, Orientation; Hue, Value, Saturation. Matching vars to data types (Nominal/Ordinal/Ratio)." },
                  heavy: true
                }
              ]
            },
            {
              label: { cn: "2. 专题地图", en: "2. Thematic Maps" },
              children: [
                {
                  label: { cn: "表达方法", en: "Methods" },
                  desc: { cn: "独立符号法（点）；线状符号法（线）；分级统计图（面-Choropleth，颜色深浅代表数值）；定位图表法（饼图柱图）。", en: "Point symbols; Linear; Choropleth (Color scale); Charts (Pie/Bar)." }
                }
              ]
            }
          ]
        },
        terms: [
          { cn: "视觉变量", en: "Visual Variables", desc_cn: "Jacques Bertin提出，地图符号可变化的图形属性（如大小、颜色），是地图语言的基本词汇。", desc_en: "Graphic attributes of symbols (size, color) used to encode data." },
          { cn: "分级统计图", en: "Choropleth Map", desc_cn: "用区域颜色的深浅或纹理疏密来表示统计数据数值大小的地图。", desc_en: "Map using color shading to represent data values in areas." }
        ],
        relations: [
          { targetId: 'c7', targetName: 'DIP', label: '色彩原理 (Color Principle)', desc: 'RGB与CMYK色彩空间是地图可视化的基础' },
          { targetId: 's8', targetName: 'Prin of GIS', label: '呈现手段 (Presentation)', desc: '分析结果的最终出口是专题地图' }
        ],
        notes: []
      },
      {
        id: "s13",
        name: "Spatio-temporal Database (时空数据库)",
        summary: {
          cn: "Handling 'Where' + 'When'. 传统数据库只管此时此刻，时空数据库管理随时间变化的空间数据（如车辆轨迹、土地变迁）。",
          en: "Handling 'Where' + 'When'. Managing data changing over time (Trajectory, Land use change)."
        },
        goals: {
          cn: "理解时空数据模型（快照/基修正），掌握时空索引（R树/TPR树）的原理，以及时空查询语言的基本操作。",
          en: "Understand Spatio-temporal Models (Snapshot/Base-state), ST-Indexing (R-tree/TPR-tree), and Queries."
        },
        logicTree: {
          label: { cn: "时空管理", en: "ST Management" },
          children: [
            {
              label: { cn: "1. 模型", en: "1. Models" },
              children: [
                { label: { cn: "快照模型", en: "Snapshot" }, desc: { cn: "最简单暴力。每隔一段时间存一张完整的地图。冗余度高。", en: "Store full map at every timestamp. High redundancy." } },
                { label: { cn: "基修正模型", en: "Base-State" }, desc: { cn: "只存初始状态（基态）和之后的变化量（增量）。节省空间，但查询历史状态慢。", en: "Store Base + Deltas. Saves space, slow history query." }, heavy: true }
              ]
            },
            {
              label: { cn: "2. 索引", en: "2. Indexing" },
              children: [
                {
                  label: { cn: "R树", en: "R-tree" },
                  desc: { cn: "空间数据库的核心。利用最小外包矩形(MBR)层层嵌套，快速剔除不相关的区域，加速查询。", en: "Core spatial index. Uses Minimum Bounding Rectangles (MBR) hierarchy to prune search space." },
                  heavy: true
                }
              ]
            }
          ]
        },
        terms: [
          { cn: "MBR", en: "Minimum Bounding Rectangle", desc_cn: "包含一个几何对象的最小的轴对齐矩形，是建立空间索引的基础。", desc_en: "Smallest axis-aligned rectangle enclosing an object." },
          { cn: "轨迹", en: "Trajectory", desc_cn: "移动对象在时空中的运动路径，由一系列(x, y, t)采样点组成。", desc_en: "Path of a moving object in space-time." }
        ],
        relations: [
          { targetId: 's8', targetName: 'Prin of GIS', label: '时间维度 (Temporal Dimension)', desc: 'GIS从静态走向动态' },
          { targetId: 'p1', targetName: 'Data Structure', label: '索引技术 (Indexing Tech)', desc: 'R树是B树在多维空间的推广' }
        ],
        notes: []
      },
      {
        id: "s14",
        name: "Spatial Statistics and Analysis B (空间统计与分析B)",
        summary: {
          cn: "数据背后的规律。不仅仅是画图，而是利用统计学方法，挖掘空间数据的分布模式、聚类情况和相关性。",
          en: "Patterns behind data. Using statistics to mine spatial distribution, clustering, and correlation."
        },
        goals: {
          cn: "理解‘地理学第一定律’，掌握空间自相关（Moran's I）、插值方法（克里金）及地理加权回归(GWR)。",
          en: "Understand Tobler's First Law, Spatial Autocorrelation (Moran's I), Kriging, and GWR."
        },
        logicTree: {
          label: { cn: "分析体系", en: "Analysis Sys" },
          children: [
            {
              label: { cn: "1. 空间模式", en: "1. Patterns" },
              children: [
                {
                  label: { cn: "空间自相关", en: "Autocorrelation" },
                  desc: { cn: "‘相近的事物更相似’。Moran's I指数：>0表示集聚（高高/低低），<0表示离散（高低间隔）。", en: "Tobler's Law. Moran's I: >0 Clustered, <0 Dispersed." },
                  heavy: true
                },
                {
                  label: { cn: "热点分析", en: "Hot Spot" },
                  desc: { cn: "Getis-Ord Gi*。识别具有统计显著性的高值聚类区（热点）和低值聚类区（冷点）。", en: "Getis-Ord Gi*. Identifies significant clusters of high (Hot) or low (Cold) values." }
                }
              ]
            },
            {
              label: { cn: "2. 空间插值", en: "2. Interpolation" },
              children: [
                {
                  label: { cn: "克里金", en: "Kriging" },
                  desc: { cn: "最优线性无偏估计。不仅考虑距离，还利用半变异函数考虑了空间结构性，是最精确的插值法。", en: "Optimal linear unbiased estimator. Uses Semivariogram to account for spatial structure." },
                  heavy: true
                }
              ]
            }
          ]
        },
        terms: [
          { cn: "地理学第一定律", en: "Tobler's First Law", desc_cn: "任何事物都是相关的，但相近的事物关联更紧密。", desc_en: "Everything is related, but near things are more related than distant things." },
          { cn: "GWR", en: "Geographically Weighted Regression", desc_cn: "地理加权回归。允许回归系数随空间位置变化，以解决空间非平稳性问题。", desc_en: "Regression where coefficients vary by location." }
        ],
        relations: [
          { targetId: 's8', targetName: 'Prin of GIS', label: '分析进阶 (Advanced Analysis)', desc: '空间统计通过GIS平台实现可视化与计算' },
          { targetId: 'm6', targetName: 'Prob & Stat', label: '理论源头 (Theory Source)', desc: '地理学第一定律将统计学引入了空间维度' }
        ],
        notes: []
      }
    ]
  },
  {
    category: "数据科学与编程类 (Data Science & Programming)",
    courses: [
      {
        id: "p1",
        name: "Data Structure (数据结构)",
        summary: {
          cn: "编程的灵魂。研究数据的逻辑结构（线性/非线性）、存储结构及其操作算法。是编写高效代码的基础。",
          en: "The soul of programming. Studies logical structures (linear/non-linear), storage structures, and algorithms. Basis for efficient code."
        },
        goals: {
          cn: "熟练掌握链表、栈、队列、二叉树、图的实现，以及十大排序算法的时间复杂度分析。",
          en: "Master implementation of Linked List, Stack, Queue, Binary Tree, Graph, and complexity analysis of Sorting Algorithms."
        },
        logicTree: {
          label: { cn: "数据结构体系", en: "DS System" },
          children: [
            {
              label: { cn: "1. 线性结构", en: "1. Linear" },
              children: [
                { label: { cn: "表栈队", en: "List/Stack/Queue" }, desc: { cn: "栈(LIFO)用于函数调用/表达式求值；队列(FIFO)用于缓冲处理。", en: "Stack (LIFO) for recursion; Queue (FIFO) for buffering." } }
              ]
            },
            {
              label: { cn: "2. 非线性结构", en: "2. Non-linear" },
              children: [
                { label: { cn: "树 (Tree)", en: "Tree" }, desc: { cn: "二叉搜索树(BST)、AVL平衡树、堆(Heap)。核心是递归思想。", en: "BST, AVL, Heap. Core idea is Recursion." }, heavy: true },
                { label: { cn: "图 (Graph)", en: "Graph" }, desc: { cn: "存储(邻接矩阵/表)；遍历(DFS/BFS)；最短路径(Dijkstra)；最小生成树(Prim/Kruskal)。", en: "Adjacency Matrix/List; DFS/BFS; Shortest Path; MST." } }
              ]
            },
            {
              label: { cn: "3. 算法", en: "3. Algorithms" },
              children: [
                { label: { cn: "排序与查找", en: "Sort & Search" }, desc: { cn: "快排(QuickSort)和归并(MergeSort)是O(nlogn)的代表。二分查找是O(logn)。", en: "QuickSort/MergeSort O(nlogn). Binary Search O(logn)." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "时间复杂度", en: "Time Complexity", desc_cn: "描述算法运行时间随输入规模增长的变化趋势（如O(n)），而非具体秒数。", desc_en: "Growth rate of runtime vs input size (Big O notation)." },
          { cn: "哈希表", en: "Hash Table", desc_cn: "通过映射函数(Hash Function)实现O(1)平均查找速度的数据结构。", desc_en: "DS aiming for O(1) lookups via mapping functions." }
        ],
        relations: [
          { targetId: 'p5', targetName: 'C Programming', label: '实现语言 (Implementation Language)', desc: '指针是实现链表、树、图的关键' },
          { targetId: 's13', targetName: 'Spatio-temporal DB', label: '高级应用 (Advanced Application)', desc: 'R树索引是树结构在空间数据中的变体' }
        ],
        notes: []
      },
      {
        id: "p2",
        name: "Course Design for Data Structure (数据结构课程设计)",
        summary: {
          cn: "综合实践课。要求利用所学的数据结构知识，独立完成一个具有一定复杂度的系统（如‘校园导航系统’或‘图书管理系统’）。",
          en: "Project-based course. Build a complex system (e.g., Campus Navigation, Library System) using DS knowledge."
        },
        goals: {
          cn: "能够从实际问题中抽象出数据模型，选择合适的数据结构，并编写健壮的代码实现功能。",
          en: "Abstract models from real problems, select proper DS, and write robust code."
        },
        logicTree: {
          label: { cn: "设计流程", en: "Design Flow" },
          children: [
            { label: { cn: "1. 需求分析", en: "1. Analysis" }, desc: { cn: "输入是什么？输出是什么？核心操作是高频插入还是高频查找？", en: "Inputs/Outputs? High-freq insert or search?" } },
            { label: { cn: "2. 结构选型", en: "2. Selection" }, desc: { cn: "例如：导航系统选‘图’结构；排名系统选‘堆’结构。", en: "Navigation -> Graph; Ranking -> Heap." }, heavy: true }
          ]
        },
        terms: [],
        notes: []
      },
      {
        id: "p3",
        name: "Computer Vision and Machine Learning (计算机视觉与机器学习)",
        summary: {
          cn: "教会计算机‘看’懂世界。从传统的特征提取（SIFT/HOG）到现代的深度学习（CNN/Transformer）。",
          en: "Teaching computers to 'see'. From traditional features (SIFT/HOG) to Deep Learning (CNN/Transformer)."
        },
        goals: {
          cn: "理解卷积神经网络(CNN)的层级结构（卷积/池化/激活），掌握目标检测(YOLO)与语义分割(U-Net)的基本原理。",
          en: "Understand CNN hierarchy (Conv/Pool/Act), Object Detection (YOLO), and Segmentation (U-Net)."
        },
        logicTree: {
          label: { cn: "CV 知识树", en: "CV Tree" },
          children: [
            {
              label: { cn: "1. 传统CV", en: "1. Traditional" },
              children: [
                { label: { cn: "特征工程", en: "Feature Eng" }, desc: { cn: "手工设计特征算子，如检测边缘(Canny)、角点(Harris)或斑点(SIFT)。", en: "Hand-crafted features: Edges, Corners, Blobs." } }
              ]
            },
            {
              label: { cn: "2. 深度学习", en: "2. Deep Learning" },
              children: [
                { label: { cn: "CNN", en: "CNN" }, desc: { cn: "具有平移不变性。核心在于‘权值共享’和‘局部感受野’，大幅减少了参数量。", en: "Translation invariance. Weight Sharing & Local Receptive Fields reduce params." }, heavy: true },
                { label: { cn: "任务类型", en: "Tasks" }, desc: { cn: "分类(是什么?) -> 检测(在哪里?) -> 分割(轮廓是啥?)。", en: "Classification -> Detection -> Segmentation." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "过拟合", en: "Overfitting", desc_cn: "模型在训练集表现太好，泛化能力差。解决方法：Dropout、正则化、增加数据。", desc_en: "Good on training, bad on test. Fix: Dropout, Regularization." },
          { cn: "IoU", en: "Intersection over Union", desc_cn: "交并比。目标检测中衡量预测框准确度的指标。", desc_en: "Metric for measuring accuracy of an object detector." }
        ],
        relations: [
          { targetId: 'm5', targetName: 'Linear Algebra A', label: '基石 (Foundation)', desc: '卷积运算本质上是矩阵的点积' },
          { targetId: 'c7', targetName: 'DIP', label: '前导课 (Prerequisite)', desc: 'DIP处理图像信号，CV提取图像语义' }
        ],
        notes: []
      },
      {
        id: "p4",
        name: "Pattern Recognition (模式识别)",
        summary: {
          cn: "通过数学方法让机器自动识别事物。是机器学习的理论基础，涵盖统计模式识别和句法模式识别。",
          en: "Math methods for auto-recognition. Theoretical basis of ML. Statistical & Syntactic PR."
        },
        goals: {
          cn: "掌握贝叶斯决策理论（最小错误率/最小风险），理解线性分类器与支持向量机(SVM)的几何意义。",
          en: "Master Bayesian Decision Theory, Linear Classifiers, and SVM geometry."
        },
        logicTree: {
          label: { cn: "识别方法", en: "Methods" },
          children: [
            {
              label: { cn: "1. 贝叶斯决策", en: "1. Bayesian" },
              children: [
                { label: { cn: "核心公式", en: "Formula" }, desc: { cn: "后验概率 = (似然 × 先验) / 证据。根据后验概率最大进行分类。", en: "Posterior = (Likelihood * Prior) / Evidence. Classify by Max Posterior." }, heavy: true }
              ]
            },
            {
              label: { cn: "2. 分类器", en: "2. Classifiers" },
              children: [
                { label: { cn: "SVM", en: "SVM" }, desc: { cn: "寻找一个超平面，使得两类样本的‘间隔(Margin)’最大化。支持向量是离超平面最近的点。", en: "Find hyperplane maximizing 'Margin'. Support Vectors are points closest to boundary." } },
                { label: { cn: "聚类", en: "Clustering" }, desc: { cn: "无监督学习。K-Means（距离）、DBSCAN（密度）。", en: "Unsupervised. K-Means (Distance), DBSCAN (Density)." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "维度灾难", en: "Curse of Dimensionality", desc_cn: "特征维度增加导致样本稀疏，需要指数级增加的样本量才能维持估算精度。", desc_en: "High dims -> Sparse data -> Needs exponential data to learn." },
          { cn: "先验概率", en: "Prior Probability", desc_cn: "在看观测数据之前，对样本属于某类的概率的主观估计。", desc_en: "Probability before seeing evidence." }
        ],
        relations: [
          { targetId: 'm6', targetName: 'Prob & Stat', label: '数学基础', desc: '贝叶斯决策理论基于概率论' },
          { targetId: 'p3', targetName: 'Computer Vision', label: '应用场景', desc: '模式识别是CV分类任务的理论内核' }
        ],
        notes: []
      },
      {
        id: "p5",
        name: "C Language Programming (C语言程序设计)",
        summary: {
          cn: "面向过程编程的经典。我的第一门编程课。核心在于理解计算机的底层运行机制（内存地址）。",
          en: "Classic Procedural Programming. Key is understanding low-level mechanism (Memory/Address)."
        },
        goals: {
          cn: "彻底理解‘指针’（地址的变量）、内存管理（malloc/free）以及结构体。",
          en: "Master Pointers (Variable of address), Memory Mgmt, and Structs."
        },
        logicTree: {
          label: { cn: "C语言核心", en: "C Core" },
          children: [
            {
              label: { cn: "1. 指针", en: "1. Pointers" },
              children: [
                { label: { cn: "本质", en: "Essence" }, desc: { cn: "指针就是内存地址。通过指针可以直接操作内存，这是C高效但也危险的原因。", en: "Pointer = Address. Direct memory access. Efficient but risky." }, heavy: true },
                { label: { cn: "应用", en: "Usage" }, desc: { cn: "数组传参退化为指针；函数指针实现回调。", en: "Array decay; Function pointers." } }
              ]
            },
            {
              label: { cn: "2. 内存模型", en: "2. Memory" },
              children: [
                { label: { cn: "分区", en: "Segments" }, desc: { cn: "栈(Stack, 局部变量, 自动回收) vs 堆(Heap, 动态分配, 手动回收)。", en: "Stack (Auto) vs Heap (Manual)." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "段错误", en: "Segmentation Fault", desc_cn: "访问了未分配或无权访问的内存区域。", desc_en: "Accessing unauthorized memory." },
          { cn: "内存泄漏", en: "Memory Leak", desc_cn: "申请的堆内存未释放，导致程序占用内存持续增加。", desc_en: "Failure to free allocated memory." }
        ],
        relations: [
          { targetId: 'p1', targetName: 'Data Structure', label: '实现基础', desc: 'C语言指针是实现复杂数据结构的关键' }
        ],
        notes: []
      },
      {
        id: "p6",
        name: "Advanced Programming (C/C++) (高级语言程序设计)",
        summary: {
          cn: "从C走向C++。从‘面向过程’走向‘面向对象(OOP)’。引入了类、继承、多态等现代软件工程概念。",
          en: "From C to C++. From Procedural to OOP. Class, Inheritance, Polymorphism."
        },
        goals: {
          cn: "掌握OOP三大特性（封装、继承、多态），理解虚函数实现多态的机理，以及STL（标准模板库）的使用。",
          en: "Master OOP 3 pillars. Virtual functions for Polymorphism. STL usage."
        },
        logicTree: {
          label: { cn: "OOP 体系", en: "OOP Sys" },
          children: [
            {
              label: { cn: "1. 三大特性", en: "1. Three Pillars" },
              children: [
                { label: { cn: "封装/继承", en: "Enc/Inh" }, desc: { cn: "隐藏细节/代码复用。", en: "Hiding details / Reuse." } },
                { label: { cn: "多态 (Polymorphism)", en: "Polymorphism" }, desc: { cn: "‘一个接口，多种实现’。运行时根据对象实际类型调用不同函数。用Virtual关键字实现。", en: "One interface, many forms. Runtime binding via v-table." }, heavy: true }
              ]
            },
            {
              label: { cn: "2. 泛型编程", en: "2. Generic" },
              children: [
                { label: { cn: "STL", en: "STL" }, desc: { cn: "vector, map, algorithm。利用模板(Template)实现类型无关的高效代码。", en: "Containers & Algos. Code independent of types." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "虚函数表", en: "v-table", desc_cn: "编译器为每个有虚函数的类生成的函数指针数组，是实现动态多态的基础。", desc_en: "Table of function pointers for dynamic binding." },
          { cn: "构造/析构", en: "Ctor/Dtor", desc_cn: "对象创建时初始化/销毁时清理（RAII机制的核心）。", desc_en: "Init/Cleanup. Core of RAII." }
        ],
        relations: [
          { targetId: 'p5', targetName: 'C Programming', label: '进阶', desc: '从面向过程走向面向对象' }
        ],
        notes: []
      },
      {
        id: "p7",
        name: "Fundamentals of Computational Science (计算科学基础)",
        summary: {
          cn: "用计算机解决数学问题。当解析解不存在时（如复杂积分、微分方程），用数值方法求近似解。",
          en: "Solving math with computers. Numerical methods for approximate solutions when analytical ones fail."
        },
        goals: {
          cn: "掌握方程求根（牛顿迭代）、数值积分、插值拟合及误差传播分析。",
          en: "Root finding (Newton), Numerical Integration, Interpolation, and Error Analysis."
        },
        logicTree: {
          label: { cn: "数值方法", en: "Native Methods" },
          children: [
            { label: { cn: "1. 求根", en: "1. Roots" }, desc: { cn: "二分法（稳健慢）；牛顿迭代法（利用导数，收敛快，二阶收敛）。", en: "Bisection (Slow/Safe); Newton-Raphson (Fast/Derivative)." } },
            { label: { cn: "2. 线性代数", en: "2. Linear Alg" }, desc: { cn: "高斯消元法解线性方程组。", en: "Gaussian Elimination." } }
          ]
        },
        terms: [
          { cn: "截断误差", en: "Truncation Error", desc_cn: "数值方法（近似算法）本身带来的误差（如泰勒展开舍去高阶项）。", desc_en: "Error from the method/algorithm itself." },
          { cn: "舍入误差", en: "Round-off Error", desc_cn: "计算机浮点数精度有限导致的误差。", desc_en: "Error from finite floating-point precision." }
        ],
        notes: []
      }
    ]
  },
  {
    category: "数学与自然科学基础 (Mathematics & Natural Science)",
    courses: [
      {
        id: "m1",
        name: "Advanced Mathematics B1 (高等数学 B1)",
        summary: {
          cn: "工科数学基础的第一部分。核心是从静态的常量数学走向动态的变量数学。重点是研究函数的变化率（微分）和累积量（积分）。",
          en: "Part 1 of Engineering Math. Moving from static constants to dynamic variables. Focuses on rate of change (Differentiation) and accumulation (Integration)."
        },
        goals: {
          cn: "掌握极限思想，一元函数的导数与微分运算，以及不定积分与定积分的计算方法。",
          en: "Master Limit concept, Derivative & Differential of single-variable functions, and Indefinite/Definite Integrals."
        },
        logicTree: {
          label: { cn: "微积分基础", en: "Calculus I" },
          children: [
            { label: { cn: "1. 极限", en: "1. Limits" }, desc: { cn: "导数和积分的基石。ε-δ语言描述无限接近的过程。", en: "Foundation of calculus. ε-δ definition." } },
            { label: { cn: "2. 导数", en: "2. Derivative" }, desc: { cn: "几何意义是切线斜率；物理意义是瞬时速度。核心法则：链式法则。", en: "Slope of tangent; Instantaneous velocity. Chain Rule." }, heavy: true },
            { label: { cn: "3. 积分", en: "3. Integral" }, desc: { cn: "导数的逆运算。牛顿-莱布尼茨公式建立了微分与积分的联系。", en: "Inverse of derivative. Newton-Leibniz formula." } }
          ]
        },
        terms: [
          { cn: "微积分基本定理", en: "Fundamental Theorem of Calculus", desc_cn: "联系微分与积分的桥梁，表明积分就是原函数的增量。", desc_en: "Relates interpolation and differentiation." },
          { cn: "洛必达法则", en: "L'Hopital's Rule", desc_cn: "利用导数来计算0/0或∞/∞型未定式极限的方法。", desc_en: "Using derivatives to find limits of indeterminate forms." }
        ],
        relations: [
          { targetId: 'm7', targetName: 'College Physics C1', label: '工具', desc: '微积分是描述物理运动变化的语言' }
        ],
        notes: []
      },
      {
        id: "m2",
        name: "Advanced Mathematics B2 (高等数学 B2)",
        summary: {
          cn: "从一元走向多元，从平面走向空间。研究空间解析几何、多元函数微积分以及无穷级数。",
          en: "From Single to Multi-variable. Spatial Geometry, Multi-variable Calculus, and Infinite Series."
        },
        goals: {
          cn: "掌握偏导数与全微分，二重积分/三重积分的计算（坐标变换），以及常微分方程(ODE)的求解。",
          en: "Master Partial Derivatives, Total Differential, Multiple Integrals (Coord transform), and ODE solving."
        },
        logicTree: {
          label: { cn: "微积分进阶", en: "Calculus II" },
          children: [
            { label: { cn: "1. 多元微分", en: "1. Multi-Diff" }, desc: { cn: "偏导数(固定其他变量求导) vs 全微分(所有变量同时变)。梯度(Gradient)指向变化最快方向。", en: "Partial vs Total Diff. Gradient vector." }, heavy: true },
            { label: { cn: "2. 多元积分", en: "2. Multi-Int" }, desc: { cn: "二重积分(体积)；曲线/曲面积分(格林公式、高斯公式、斯托克斯公式)。", en: "Double Integrals; Line/Surface Integrals (Green/Gauss/Stokes)." } },
            { label: { cn: "3. 级数", en: "3. Series" }, desc: { cn: "泰勒级数(Taylor)：把复杂函数展开成多项式，是数值计算的基础。", en: "Taylor Series: Approximating functions with polynomials." } }
          ]
        },
        terms: [],
        notes: []
      },
      {
        id: "m3",
        name: "Advanced Mathematics A1 (高等数学 A1)",
        summary: {
          cn: "相比B类，A类数学更深度和抽象。重点在于更严谨的数学证明和更广泛的应用背景（如物理应用）。涵盖极限、连续、一元微积分。",
          en: "Deeper and more abstract than Class B. Rigorous proofs and broader references. Limits, Continuity, 1-Var Calculus."
        },
        goals: {
          cn: "深入理解微积分定义的本质，熟练掌握泰勒公式的推导，解决复杂的物理几何应用题。",
          en: "Deep understanding of definitions, Taylor expansion derivations, and complex physics/geometry applications."
        },
        logicTree: { label: { cn: "知识点同B1但更深", en: "Same as B1 but deeper" }, children: [] },
        terms: [],
        relations: [
          { targetId: 'm1', targetName: 'Adv. Math B1', label: '深造', desc: '更严谨的理论证明体系' }
        ],
        notes: []
      },
      {
        id: "m4",
        name: "Advanced Mathematics A2 (高等数学 A2)",
        summary: {
          cn: "A类数学下册。深度涵盖多元微积分、向量代数与空间解析几何、无穷级数及微分方程。",
          en: "Part 2 of Class A. Multivariate calc, Vector algebra, Infinite series, and Diff Equations."
        },
        goals: {
          cn: "熟练运用场论（梯度、散度、旋度），掌握傅里叶级数展开，能建立微分方程模型描述动态过程。",
          en: "Master Field Theory (Grad, Div, Curl), Fourier Series, and Modeling with ODEs."
        },
        logicTree: { label: { cn: "知识点同B2但更深", en: "Same as B2 but deeper" }, children: [] },
        terms: [],
        relations: [
          { targetId: 'm2', targetName: 'Adv. Math B2', label: '深造', desc: '涵盖场论等更高级的数学工具' }
        ],
        notes: []
      },
      {
        id: "m5",
        name: "Linear Algebra A (线性代数 A)",
        summary: {
          cn: "处理多维数据的数学工具。核心从‘数’转变为‘矩阵’和‘向量’。是遥感图像处理（图像即矩阵）和最小二乘平差的理论基础。",
          en: "Math for multi-dimensional data. From numbers to Matrices/Vectors. Basis for Image Processing and Least Squares."
        },
        goals: {
          cn: "理解线性空间与线性变换，掌握矩阵秩的概念、特征值与特征向量的几何意义（主方向）。",
          en: "Understand Vector Space, Linear Trans, Matrix Rank, Eigenvalues/Eigenvectors (Principal directions)."
        },
        logicTree: {
          label: { cn: "线代体系", en: "LinAlg System" },
          children: [
            {
              label: { cn: "1. 运算工具", en: "1. Tools" },
              children: [
                { label: { cn: "矩阵", en: "Matrix" }, desc: { cn: "矩阵乘法（变换的叠加）；逆矩阵（变换的撤销）；行列式（变换的缩放因子）。", en: "Multiplication (Composite); Inverse (Undo); Determinant (Scaling factor)." } }
              ]
            },
            {
              label: { cn: "2. 核心概念", en: "2. Core Concepts" },
              children: [
                { label: { cn: "线性方程组", en: "Systems" }, desc: { cn: "Ax=b。解的存在性取决于秩(Rank)。高斯消元法是通用解法。", en: "Ax=b. Rank determines solutions. Gaussian Elimination." } },
                { label: { cn: "特征值", en: "Eigen" }, desc: { cn: "Ax = λx。矩阵A作用下方向不变的向量。在PCA（主成分分析）中用于提取数据的主方向。", en: "Invariant direction. Used in PCA to find principal axes." }, heavy: true }
              ]
            }
          ]
        },
        terms: [
          { cn: "秩", en: "Rank", desc_cn: "矩阵中线性无关的行或列的最大数目，反映了矩阵的信息量。", desc_en: "Max number of linearly independent rows/cols." },
          { cn: "正交矩阵", en: "Orthogonal Matrix", desc_cn: "转置等于逆的矩阵。表示旋转变换，保持长度和角度不变。", desc_en: "Transpose = Inverse. Represents rotation." }
        ],
        relations: [
          { targetId: 'c6', targetName: 'Error Theory', label: '应用', desc: '最小二乘平差(B^TPB)x=B^TPL 完全依赖矩阵运算' },
          { targetId: 'p3', targetName: 'Computer Vision', label: '应用', desc: 'PCA特征提取是特征值分解的直接应用' }
        ],
        notes: []
      },
      {
        id: "m6",
        name: "Probability and Mathematical Statistics A (概率论与数理统计 A)",
        summary: {
          cn: "研究随机现象规律的学科。概率论是从模型推测数据（演绎），统计学是从数据推测模型（归纳）。是误差理论与遥感分类的基础。",
          en: "Study of randomness. Probability: Model -> Data; Statistics: Data -> Model. Basis for Error Theory & Classification."
        },
        goals: {
          cn: "掌握贝叶斯公式、大数定律与中心极限定理，熟练进行参数估计（矩估计/最大似然估计）与假设检验。",
          en: "Master Bayes Theorem, LLN, CLT, Parameter Estimation (MLE), and Hypothesis Testing."
        },
        logicTree: {
          label: { cn: "概统体系", en: "Prob & Stat" },
          children: [
            {
              label: { cn: "1. 概率模型", en: "1. Probability" },
              children: [
                { label: { cn: "分布", en: "Distributions" }, desc: { cn: "正态分布(Normal, 误差分布)；二项分布(Binomial)；泊松分布(Poisson)。", en: "Normal (Errors), Binomial, Poisson." }, heavy: true },
                { label: { cn: "定理", en: "Theorems" }, desc: { cn: "中心极限定理(CLT)：大量独立随机变量之和近似服从正态分布。这是为什么误差通常假设为正态分布的原因。", en: "CLT: Sum of variables -> Normal. Why errors are Normal." } }
              ]
            },
            {
              label: { cn: "2. 统计推断", en: "2. Inference" },
              children: [
                { label: { cn: "参数估计", en: "Estimation" }, desc: { cn: "最大似然估计(MLE)：选一个参数，让观测数据出现的概率最大。", en: "MLE: Choose param maximizing data likelihood." } },
                { label: { cn: "假设检验", en: "Testing" }, desc: { cn: "P值：在零假设成立下，观察到当前数据的概率。P<0.05拒绝零假设。", en: "P-value. Reject H0 if P is small." } }
              ]
            }
          ]
        },
        terms: [],
        relations: [
          { targetId: 'm1', targetName: 'Adv. Math B1', label: '基础', desc: '概率论需要微积分计算概率密度' }
        ],
        notes: []
      },
      {
        id: "m7",
        name: "College Physics C1 (大学物理 C1)",
        summary: {
          cn: "研究物质基本运动规律。C1涵盖力学（质点、刚体）和热学。是理解卫星轨道运动（力学）和热红外遥感（热学）的基础。",
          en: "Basic laws of matter. Mechanics (Particle/Rigid body) and Thermodynamics. Basis for Satellite Orbits & Thermal RS."
        },
        goals: {
          cn: "掌握牛顿三大定律、角动量守恒（卫星姿态）、能量守恒，以及热力学第一、第二定律。",
          en: "Newton's Laws, Angular Momentum (Attitude), Energy Conservation, Thermodynamics Laws."
        },
        logicTree: { label: { cn: "力热基础", en: "Mech & Heat" }, children: [] },
        terms: [],
        relations: [
          { targetId: 'm1', targetName: 'Adv. Math B1', label: '基础', desc: '牛顿力学建立在微积分基础上' }
        ],
        notes: []
      },
      {
        id: "m8",
        name: "College Physics C2 (大学物理 C2)",
        summary: {
          cn: "涵盖电磁学、光学和近代物理。电磁学是遥感（电磁波）的直接物理基础。光学涉及光的干涉、衍射和偏振。",
          en: "Electromagnetism, Optics, Modern Physics. EM is the direct basis of RS. Optics covers Interference, Diffraction, Polarization."
        },
        goals: {
          cn: "深刻理解麦克斯韦方程组（电磁波的产生），光的波粒二象性，以及激光（受激辐射）的原理。",
          en: "Maxwell's Equations (EM waves), Wave-Particle Duality, Laser principles."
        },
        logicTree: {
          label: { cn: "电磁光", en: "EM & Optics" },
          children: [
            {
              label: { cn: "1. 电磁学", en: "1. EM" },
              children: [
                { label: { cn: "麦克斯韦方程", en: "Maxwell Eqs" }, desc: { cn: "变化的电场产生磁场，变化的磁场产生电场 -> 电磁波及其传播。", en: "Changing E-field -> B-field -> EM Wave propagation." }, heavy: true }
              ]
            },
            {
              label: { cn: "2. 光学", en: "2. Optics" },
              children: [
                { label: { cn: "偏振", en: "Polarization" }, desc: { cn: "光矢量振动方向的不对称性。雷达遥感常用HH/VV不同极化方式探测地物。", en: "Orientation of oscillation. HH/VV polarization in Radar." } }
              ]
            }
          ]
        },
        terms: [],
        relations: [
          { targetId: 'm7', targetName: 'College Physics C1', label: '进阶', desc: '电磁学是物理学的核心分支' }
        ],
        notes: []
      },
      {
        id: "m9",
        name: "Physics Experiments A1 (物理实验 A1)",
        summary: {
          cn: "物理理论的验证。重点培养动手能力和数据处理能力（不确定度分析）。",
          en: "Verification of theory. Hands-on skills and Data Processing (Uncertainty analysis)."
        },
        goals: {
          cn: "掌握基本物理量的测量方法，学会使用游标卡尺、螺旋测微器等精密仪器，规范撰写实验报告。",
          en: "Measure basic quantities. Use Calipers/Micrometers. Write standard lab reports."
        },
        logicTree: { label: { cn: "基础实验", en: "Basic Labs" }, children: [] },
        terms: [],
        relations: [
          { targetId: 'm7', targetName: 'College Physics C1', label: '验证', desc: '通过实验验证力学与热学定律' }
        ],
        notes: []
      },
      {
        id: "m10",
        name: "Physics Experiments A2 (物理实验 A2)",
        summary: {
          cn: "进阶物理实验。涉及电学（电桥平衡）、光学（分光计调节、牛顿环干涉）等复杂实验。",
          en: "Advanced labs. Electricity (Bridge balance), Optics (Spectrometer, Newton's Rings)."
        },
        goals: {
          cn: "掌握示波器的使用，理解霍尔效应（磁场测量）及光电效应实验。",
          en: "Use Oscilloscope. Understand Hall Effect and Photoelectric Effect."
        },
        logicTree: { label: { cn: "进阶实验", en: "Adv Labs" }, children: [] },
        terms: [],
        relations: [
          { targetId: 'm8', targetName: 'College Physics C2', label: '验证', desc: '验证电磁学与光学现象' }
        ],
        notes: []
      },
      {
        id: "m11",
        name: "College Chemistry C (大学化学 C)",
        summary: {
          cn: "物质科学基础。虽然遥感是宏观观测，但高光谱遥感识别矿物的原理涉及微观的电子跃迁和化学键振动。",
          en: "Matter science. Hyperspectral RS identifies minerals based on electron transitions and bond vibrations."
        },
        goals: {
          cn: "了解原子结构、化学键（离子键/共价键），以及氧化还原反应的基本原理。",
          en: "Atomic structure, Chemical bonds, Redox reactions."
        },
        logicTree: { label: { cn: "化学基础", en: "Chem Basics" }, children: [] },
        terms: [],
        relations: [
          { targetId: 'm8', targetName: 'College Physics C2', label: '基础', desc: '原子结构理解依赖量子物理基础' }
        ],
        notes: []
      },
      {
        id: "m12",
        name: "College Chemistry Experiment C (大学化学实验 C)",
        summary: {
          cn: "化学基础操作训练。",
          en: "Basic chemical lab operations."
        },
        goals: {
          cn: "掌握溶液配制、滴定分析等基本化学实验技能。",
          en: "Solution preparation, Titration analysis."
        },
        logicTree: { label: { cn: "实验技能", en: "Lab Skills" }, children: [] },
        terms: [],
        relations: [
          { targetId: 'm11', targetName: 'College Chemistry C', label: '验证', desc: '化学理论的实验验证' }
        ],
        notes: []
      },
      {
        id: "m13",
        name: "Physical Geology (自然地理学 / 地质学基础)",
        summary: {
          cn: "研究地球表层自然环境（岩石圈、大气圈、水圈、生物圈）的学科。是遥感应用的主要对象。",
          en: "Study of Earth's surface spheres (Litho, Atmo, Hydro, Bio). The main subject of RS applications."
        },
        goals: {
          cn: "掌握三大类岩石的成因与转化，地质构造（褶皱/断层），以及地貌演化（流水/风沙/冰川地貌）。",
          en: "Rock cycle (Igneous/Sedimentary/Metamorphic), Tectonics (Folds/Faults), Geomorphology."
        },
        logicTree: {
          label: { cn: "地球系统", en: "Earth System" },
          children: [
            {
              label: { cn: "1. 岩石", en: "1. Rocks" },
              children: [
                { label: { cn: "三大岩", en: "3 Types" }, desc: { cn: "岩浆岩（冷凝）、沉积岩（外力/层理）、变质岩（高温高压）。", en: "Igneous, Sedimentary (Layers), Metamorphic." }, heavy: true }
              ]
            },
            {
              label: { cn: "2. 构造", en: "2. Struct" },
              children: [
                { label: { cn: "内力作用", en: "Internal" }, desc: { cn: "板块运动导致褶皱（背斜/向斜）和断层（正/逆）。", en: "Tectonics -> Folds (Anticline/Syncline) & Faults." } }
              ]
            }
          ]
        },
        terms: [
          { cn: "板块构造", en: "Plate Tectonics", desc_cn: "地球岩石圈由若干移动的刚性板块组成的理论。", desc_en: "Lithosphere divided into moving plates." },
          { cn: "矿物", en: "Mineral", desc_cn: "天然形成的具有特定化学成分和晶体结构的固体。", desc_en: "Natural solid with specific composition and structure." }
        ],
        relations: [
          { targetId: 'm11', targetName: 'College Chemistry C', label: '成分基础', desc: '矿物的化学成分决定其物理性质' }
        ],
        notes: []
      },
      {
        id: "m14",
        name: "Introduction to Ecology (生态学概论)",
        summary: {
          cn: "研究生物与环境关系的学科。遥感广泛应用于生态监测（如植被覆盖、生物量估算）。",
          en: "Interaction between organisms and environment. RS used for monitoring (Vegetation cover, biomass)."
        },
        goals: {
          cn: "理解生态系统、群落演替、生物多样性以及能量流动与物质循环（碳循环）。",
          en: "Ecosystems, Succession, Biodiversity, Energy flow & Matter cycles (Carbon cycle)."
        },
        logicTree: { label: { cn: "生态系统", en: "Ecosystem" }, children: [] },
        terms: [
          { cn: "NPP", en: "Net Primary Productivity", desc_cn: "净初级生产力。植物通过光合作用固定的净碳量，是生态遥感的重要参数。", desc_en: "Carbon fixed by plants via photosynthesis minus respiration." },
          { cn: "群落演替", en: "Succession", desc_cn: "随着时间推移，一个群落被另一个群落代替的过程。", desc_en: "Process of change in species structure over time." }
        ],
        notes: []
      }
    ]
  }
];