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
  }
];