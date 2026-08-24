// 项目详情数据：仅项目详情路由按需加载，勿从首页/列表组件引用。
import { projectCatalog } from './projectCatalog';

const projectDetailById = {
  "vision-positioning": {
    paperInfo: {
      titleZh: "基于射线夹角几何约束与级联神经网络的结构化杆体单目视觉位姿重建系统",
      titleEn: "Monocular Camera 3D Coordinate Reconstruction via Structured Pole Keypoint Cascaded Networks and Ray-Angle Invariant Optimization",
      authors: "陈敏祥 (Minxiang Chen), 指导教师: 李明智",
      affiliation: "大连海洋大学 · 信息工程学院 (Dalian Ocean University · School of Information Engineering)",
      keywordsZh: [
        "单目视觉定位",
        "射线夹角不变性",
        "级联检测流水线",
        "Harris 亚像素精炼",
        "CNN 语义分类",
        "非线性最小二乘 (NLLS)",
        "共线几何退化",
        "结构化参照物"
      ],
      keywordsEn: [
        "Monocular Visual Localization",
        "Ray-Angle Invariance",
        "Cascaded Detection Pipeline",
        "Harris Sub-Pixel Refinement",
        "CNN Patch Classification",
        "Nonlinear Least Squares (NLLS)",
        "Collinear Geometric Degeneracy",
        "Structured Reference Anchors"
      ],
      abstractZh: "针对海洋工程、近海渔船作业、港口堆场巡检以及室内/水下无 GPS 环境中，传统卫星导航易丢失信号、视觉人工标志物（如 AprilTag/ArUco）易污损退化，且经典透视 n 点算法（Perspective-n-Point, PnP）在共线或共面细长杆状结构上存在严重几何退化（Collinear Degeneracy）的痛点难题，本文提出一种融合级联深度学习与射线夹角不变性几何约束的单目视觉相机三维坐标重建系统。在前端感知层，构建了「YOLO 区域粗检 → Harris 候选角点提取 → 深度 CNN 局部块语义分类 → 分类别 NMS 抑制 → 亚像素精炼」的高精度级联检测流水线。首先利用轻量级 YOLO 目标检测模型（POLES.pt）定位视野中的杆状参照物并生成二值 ROI 掩膜，将关键点搜索空间大幅压缩 95% 以上；在掩膜约束的感兴趣区域内执行 Harris 算法捕获几何角点；随后由定制的三层卷积神经网络（SimpleCNN）对 64×64 局部图像块执行 9 分类推理（8 个空间物理特征点 + 1 个背景噪声类），在 1377 张样本数据集上实现了 100% 的精准分类与背景过滤，有效解决了无纹理场景下的 2D-3D 数据关联歧义；最后经按类别非极大值抑制与 cornerSubPix 迭代精炼，获取亚像素级关键点坐标。在后端几何解算层，推导并建立了基于反投影光学射线夹角守恒的非线性最小二乘位姿优化模型。通过相机内参将 2D 像点转换为归一化单位方向射线，构建两两射线夹角与空间三维世界点方向夹角的一致性残差，将原本对旋转平移耦合敏感的 PnP 求解转化为仅依赖相机三维位置参数的良态非线性优化；同时设计了融合历史帧滤波、PnP 粗估计及空间点几何中心的多候选初值策略，配合 Levenberg-Marquardt (LM) 与 Trust Region Reflective (TRF) 双优化引擎并发求解与最优残差选取。实验在仿真基准与实际场景下展开了系统性消融对比。结果表明：完整系统在测试集上达成 100% 解算成功率与 1.1×10⁻⁵ m 理论重构精度；消融实验证实，移除 CNN 语义分类会导致启发式分配失效，位置误差急剧恶化至 5.38 m；移除 NMS 与后处理会导致冗余点干扰，误差增至 6.13 m。系统在边缘计算终端 Jetson Orin 上实现 26 FPS 实时稳定运行，并在大连沿海实测中取得 10–15 cm RMSE 的高可靠定位精度，为无 GPS 复杂环境下的低成本高精度视觉定位提供了完整的理论与工程落地范式。",
      abstractEn: "In marine engineering, coastal vessel operations, port surveillance, and GPS-denied indoor/underwater environments, conventional satellite navigation is prone to signal degradation, and artificial visual fiducial tags (e.g., AprilTag/ArUco) suffer from surface fouling. Furthermore, standard Perspective-n-Point (PnP) solvers suffer from severe collinear geometric degeneracy when feature points lie along slender structural rods or poles. To resolve these challenges, this paper presents an end-to-end monocular camera 3D coordinate reconstruction system integrating cascaded neural networks with ray-angle invariant nonlinear optimization. In the front-end perception module, a five-stage detection pipeline is proposed: YOLO coarse region proposal (POLES.pt) generates binary ROI masks to compress the search space by over 95%; Harris corner detection extracts high-gradient geometric landmarks within the mask; a lightweight 3-stage patch CNN (SimpleCNN) performs 9-class semantic categorization over 64×64 local patches (8 distinct spatial pole corners + 1 background class) with 100% precision, fully eliminating 2D-to-3D landmark correspondence ambiguities without manual matching; and class-wise NMS coupled with cornerSubPix refinement achieves sub-pixel localization accuracy. In the back-end geometric solver, we establish a nonlinear least-squares optimization formulation based on back-projected ray-angle conservation. By back-projecting 2D pixels into normalized camera directional rays, we enforce congruence between optical ray angles and spatial world subtended angles, transforming the ill-conditioned 6-DoF PnP into a well-conditioned 3-DoF camera position optimization. A multi-start initialization scheme (combining temporal tracking, coarse PnP estimation, and 3D centroid priors) coupled with dual Levenberg-Marquardt (LM) and Trust Region Reflective (TRF) solvers guarantees global convergence. Ablation experiments demonstrate that our full system achieves a 100% success rate with 1.1×10⁻⁵ m theoretical reconstruction error. Removing CNN semantic classification causes heuristic mismatching with error jumping to 5.38 m, while disabling NMS post-processing causes cluster drift to 6.13 m. Deployed on an embedded Jetson Orin platform, the pipeline operates at 26 FPS in real-time, achieving 10–15 cm RMSE accuracy in coastal field trials in Dalian, delivering a robust, low-cost solution for visual localization in harsh environments."
    },
    benchmarkTable: {
      caption: "表 1：消融实验性能对比与关键点检测各阶段对定位误差的影响分析 (Ablation Benchmark)",
      columns: [
        "方案变体 (Variant)",
        "ROI 掩膜",
        "CNN 语义分类",
        "NMS & 亚像素",
        "位姿求解器",
        "候选 / 最终点数",
        "解算成功率",
        "平均位置误差 (Error ↓)",
        "误差标准差 (Std)",
        "简评与机理分析"
      ],
      rows: [
        {
          cells: [
            { text: "Ours-Full (完整流水线)", badge: "BEST", ours: true },
            "启用 (YOLO 掩膜)",
            "启用 (9分类 CNN)",
            "启用 (NMS+Subpix)",
            "射线夹角优化 (Vector)",
            "235.5 / 4.0",
            "100.0 %",
            { text: "1.10 × 10⁻⁵ m", className: "col-num val-mae" },
            "4.00 × 10⁻⁶ m",
            "解算稳定，4个角点准确对应先验锚点，无背景虚警"
          ],
          highlight: true,
          isOurs: true
        },
        {
          cells: [
            { text: "Ablation-1 (无掩膜)" },
            "禁用 (全图搜索)",
            "启用 (9分类 CNN)",
            "启用 (NMS+Subpix)",
            "射线夹角优化 (Vector)",
            "217.3 / 4.0",
            "100.0 %",
            { text: "1.20 × 10⁻⁵ m", className: "col-num" },
            "3.00 × 10⁻⁶ m",
            "在干净背景下误差相近，但复杂背景下候选点增多、推理耗时增加"
          ]
        },
        {
          cells: [
            { text: "Ablation-2 (无 CNN 语义)" },
            "启用 (YOLO 掩膜)",
            "禁用 (几何启发式分配)",
            "启用 (NMS+Subpix)",
            "射线夹角优化 (Vector)",
            "235.5 / 17.5",
            "100.0 %",
            { text: "5.380 m", className: "col-num val-rmse" },
            "1.180 m",
            "缺少语义ID导致2D-3D映射发生错配，误差显著增加"
          ]
        },
        {
          cells: [
            { text: "Ablation-3 (无后处理)" },
            "启用 (YOLO 掩膜)",
            "启用 (9分类 CNN)",
            "禁用 (无NMS/精炼)",
            "射线夹角优化 (Vector)",
            "235.5 / 75.0",
            "100.0 %",
            { text: "6.132 m", className: "col-num val-rmse" },
            "0.528 m",
            "冗余密集角点未被抑制，干扰残差场并影响优化收敛"
          ]
        },
        {
          cells: [
            { text: "Ablation-4 (纯 Harris 基线)" },
            "禁用 (全图搜索)",
            "禁用 (无分类)",
            "禁用 (无后处理)",
            "射线夹角优化 (Vector)",
            "217.3 / 217.3",
            "100.0 %",
            { text: "5.655 m", className: "col-num val-rmse" },
            "1.919 m",
            "无掩膜与分类过滤时杂乱角点较多，导致几何解算偏差较大"
          ]
        },
        {
          cells: [
            { text: "Traditional PnP (传统 PnP 基线)" },
            "启用 (YOLO 掩膜)",
            "启用 (9分类 CNN)",
            "启用 (NMS+Subpix)",
            "传统迭代 PnP (solvePnP)",
            "235.5 / 4.0",
            "100.0 %",
            { text: "3.21 × 10⁻⁴ m", className: "col-num" },
            "2.34 × 10⁻⁴ m",
            "具备可行性，但对共线点与图像噪声敏感，误差略大于射线夹角法"
          ]
        }
      ],
      footnote: "注：↓ 表示数值越小越优；仿真基准中世界真值已知，Ablation-2 与 Ablation-3 说明了 CNN 语义分类与 NMS 抑制对几何优化收敛的重要作用。"
    },
    sotaTable: {
      caption: "表 2：单目视觉位姿求解算法在共线/结构化参照物场景下的横向特性对比",
      columns: [
        "算法方案 (Method)",
        "空间几何退化抵抗",
        "2D-3D 自动关联",
        "计算复杂度",
        "抗噪声鲁棒性",
        "旋转/平移解耦",
        "代表文献 / 来源"
      ],
      rows: [
        {
          cells: [
            { text: "EPnP (Lepetit et al.)" },
            "低 (共线/共面退化)",
            "需显式特征匹配",
            "O(n) 线性解算",
            "中等",
            "否 (6-DoF 耦合)",
            "IJCV 2009"
          ]
        },
        {
          cells: [
            { text: "UPnP (Kneip et al.)" },
            "中等 (极值多项式求解)",
            "需显式特征匹配",
            "O(n) 多项式根",
            "中等",
            "否 (6-DoF 耦合)",
            "ECCV 2014"
          ]
        },
        {
          cells: [
            { text: "SQPnP (Terzakis et al.)" },
            "中等 (SQP 二次规划)",
            "需显式特征匹配",
            "O(n) 二次收敛",
            "良好",
            "否 (6-DoF 耦合)",
            "ECCV 2020"
          ]
        },
        {
          cells: [
            { text: "AprilTag / ArUco 标志物" },
            "低 (平面退化+污损易丢)",
            "自带二维码编码",
            "O(1) 快速",
            "较弱 (易受环境污损)",
            "否 (依赖平面对角)",
            "ICRA / IROS"
          ]
        },
        {
          cells: [
            { text: "PoseNet 端到端回归" },
            "较低 (泛化性受限)",
            "隐式端到端",
            "神经网络推理",
            "较弱 (跨域易产生抖动)",
            "否 (直接回归 7-DoF)",
            "ICCV 2015"
          ]
        },
        {
          cells: [
            { text: "Ours (级联CNN + 射线夹角 NLLS)", isOurs: true },
            "良好 (夹角不变性缓解退化)",
            "9分类 CNN 自动关联",
            "O(n²) 极小规模残差优化",
            "良好 (LM+TRF 多初值保障)",
            "是 (位置与旋转显式解耦)",
            "Ours (本系统)"
          ],
          isOurs: true
        }
      ],
      footnote: "对比涵盖经典代数 PnP (EPnP/UPnP/SQPnP)、人工二维码标志物与端到端深度学习回归算法。"
    },
    bibtex: "@article{chen2026monocularposereconstruction,\n  title={Monocular Camera 3D Coordinate Reconstruction via Structured Pole Keypoint Cascaded Networks and Ray-Angle Invariant Optimization},\n  author={Chen, Minxiang and Li, Mingzhi},\n  journal={Academic Thesis & Project Report},\n  year={2026},\n  institution={Dalian Ocean University}\n}",
    paperArticle: {
      sections: [
        {
          id: "sec-intro",
          number: "01",
          kicker: "Introduction & Problem Formulation",
          title: "引言与研究动机 / Introduction & Motivation",
          paragraphs: [
            "高精度、高可靠的空间三维位姿估计（Visual Pose Estimation）是自主移动机器人、近海养殖船舶作业、水下特种作业载具及工业数字孪生系统的关键核心使能技术。在海洋开阔水域、近海港口、桥梁涵洞以及室内仓储等 GPS 信号受限或完全拒止（GPS-Denied）的严苛环境中，传统卫星导航（GNSS）往往因多径效应、遮挡和海上电磁干扰发生严重漂移甚至失效；而依赖双目立体视觉或激光雷达（LiDAR）的方案则面临成本高昂、能耗巨大、透雾透水性能衰减严重以及机械尺寸难以适装等局限。",
            "单目视觉定位凭借其轻量化、低功耗、硬件成本低廉以及丰富的语义感知维度，成为受限场景下极具前景的替代方案。然而，在真实工程环境中采用单目视觉进行位姿解算仍面临两大根本性瓶颈：其一，经典透视 n 点算法（Perspective-n-Point, PnP及其变体 EPnP、UPnP 等）在面对空间中呈垂直分布、细长共线形态的杆状参照物（如港口系缆柱、海洋标杆、桥梁立柱）时，投影射线几何极易退化为共线/共面奇异临界曲面（Collinear Critical Surfaces），导致代数求解器产生严重的数值不稳定、旋转多义性以及数米乃至数十米的位置漂移；其二，在纹理稀疏、光照剧烈起伏的开放场景中，传统手工特征描述子（SIFT、ORB）无法建立 2D 像素与先验 3D 世界锚点的无歧义对应关系，传统方案通常依赖人工交互匹配或粘贴易受海水腐蚀的人工标志码（AprilTag），维护成本极高。",
            "为彻底突破上述理论与工程桎梏，本文提出一套端到端集成的「基于射线夹角不变性与级联深度学习的单目视觉相机三维坐标重建系统」。系统以场景中预设已知三维几何坐标的结构化杆体为参照物，前端通过「YOLO 区域粗检 → Harris 亚像素候选角点提取 → 深度 CNN 局部块语义分类 → 分类别 NMS 抑制 → 亚像素精炼」构建五级级联感知网络，自动建立 2D 像素与 3D 世界锚点的无歧义映射；后端摒弃传统 6-DoF 耦合的 PnP 求解思路，推导并建立了基于光心反投影射线夹角守恒的非线性最小二乘位姿优化方程，将位姿求解降维解耦为仅依赖相机三维位置的良态非线性优化，并辅以多初值并发与双求解器机制，实现了高精度、高鲁棒的全局位置解算。"
          ],
          contributions: [
            "提出五级级联式结构化关键点感知流水线：融合 YOLO 目标检测（ROI 掩膜生成，搜索空间缩小 95%+）、Harris 几何角点提取与轻量 9 分类 Patch CNN（SimpleCNN），在 1377 张样本数据集上实现 100% 的角点语义识别率，全自动完成 2D 像素与 3D 世界点的映射关联，无需任何手工匹配或人工标志码。",
            "创立基于反投影射线夹角不变性的位置解算理论：将 2D 像点反投影为归一化单位方向向量，推导了两两光线夹角与三维世界点方向夹角的守恒约束，将极易发生共线奇异退化的 6-DoF PnP 估计解耦为仅关于相机三维坐标 $C$ 的 3-DoF 非线性最小二乘优化，从数学机理上根除了共线退化问题。",
            "设计多候选初值生成与 LM/TRF 双优化求解机制：融合历史时序滤波先验 $C_{t-1}$、PnP 粗估计与空间点几何中心构建候选初值池，并发调用 Levenberg-Marquardt 与 Trust Region Reflective 双求解器进行最优残差收敛选取，保证了 100% 的求解成功率与高精度几何解算。",
            "完成系统原型研发与海上实测验证：开发了基于 PyQt5 与 SQLite 的视觉定位分析桌面软件，支持相机标定、多场景世界点云管理、实时 26 FPS 流水线阶段质检与轨迹绘制；大连沿海实测试验达成 10–15 cm RMSE 综合定位精度，获辽宁省创新创业年会推荐与国家计算机软件著作权登记。"
          ]
        },
        {
          id: "sec-theory",
          number: "02",
          kicker: "Geometric Invariance & Ray-Angle Formulation",
          title: "理论推导：反投影射线夹角守恒与非线性几何解算",
          paragraphs: [
            "在标准针孔相机成像模型（Pinhole Camera Model）中，设相机的内参矩阵为 $K \\in \\mathbb{R}^{3 \\times 3}$。对于图像平面上检测到的任意亚像素关键点 $u_i = (u_i^*, v_i^*)^T$，其对应的归一化相机坐标系反投影射线单位方向向量 $r_i \\in \\mathbb{R}^3$ 可由内参矩阵解析求得：",
            "对于视野内同时观测到的任意两点 $u_i$ 与 $u_j$，由几何内积定义可计算其在相机坐标系下的夹角 $\\theta_{ij}$。由于内积操作对任意正交旋转矩阵具有等距保角不变性（$\\langle Rr_i, Rr_j \\rangle = \\langle r_i, r_j \\rangle$），因此观测夹角 $\\theta_{ij}$ 与相机的三维旋转姿态 $R$ 完全解耦，仅取决于空间相对几何。",
            "设对应特征点在世界坐标系下的已知三维物理坐标为 $P_i, P_j \\in \\mathbb{R}^3$，未知相机光学中心在世界坐标系下的三维坐标为 $C = (X_c, Y_c, Z_c)^T$。从相机光心 $C$ 指向空间点 $P_i, P_j$ 的视线方向向量分别为 $v_i(C) = P_i - C$ 与 $v_j(C) = P_j - C$。此时两视线向量在空间中张开的物理夹角 $\\phi_{ij}(C)$ 同样由内积公式给出。"
          ],
          math: {
            title: "射线夹角不变性与非线性最小二乘残差优化模型 (Ray-Angle NLLS Model)",
            formula: "\\min_{C \\in \\mathbb{R}^3} \\mathcal{F}(C) = \\frac{1}{2} \\sum_{1 \\le i < j \\le N} \\left[ \\arccos\\left( \\frac{(P_i - C) \\cdot (P_j - C)}{\\|P_i - C\\| \\|P_j - C\\|} \\right) - \\arccos\\left( \\frac{K^{-1} \\tilde{u}_i \\cdot K^{-1} \\tilde{u}_j}{\\|K^{-1} \\tilde{u}_i\\| \\|K^{-1} \\tilde{u}_j\\|} \\right) \\right]^2",
            explanation: "其中 $\\tilde{u}_i = [u_i^*, v_i^*, 1]^T$ 为第 $i$ 个角点的齐次像素坐标，$K$ 为相机内参矩阵，$P_i \\in \\mathbb{R}^3$ 为第 $i$ 个关键点在世界坐标系下的已知三维位置，$C = (X_c, Y_c, Z_c)^T$ 为待求解的相机光学中心三维世界坐标。该模型将复杂的 6-DoF 旋转/平移耦合估计解耦为仅关于位置 $C$ 的 3-DoF 几何残差优化，有效缓解了共线点在旋转参数估计上的病态矩阵奇异退化。"
          },
          figure: {
            src: "/projects/vision-positioning/figure_geometric_model.png",
            label: "Figure 1",
            title: "相机光心、像平面反投影射线与三维空间特征点射线夹角一致性几何模型",
            caption: "空间几何模型展示了相机光心 $C$、归一化像平面上的观测像点 $u_1, u_2$（对应反投影射线 $r_1, r_2$ 及夹角 $\\theta_{12}$）与世界坐标系下已知特征锚点 $P_1, P_2$（对应空间视线向量 $v_1, v_2$ 及夹角 $\\phi_{12}$）之间的投影对应关系。",
            analysis: "在理想无噪成像条件下，像面反投影射线夹角 $\\theta_{12}$ 恒等于三维空间方向夹角 $\\phi_{12}$。通过联合优化所有观测点对的夹角残差，可在无需先验初始姿态角的前提下精确收敛到相机中心坐标 $C$。"
          }
        },
        {
          id: "sec-method",
          number: "03",
          kicker: "Cascaded Perception Pipeline & Landmark CNN",
          title: "感知架构：五级级联检测流水线与 9 分类 Patch CNN",
          paragraphs: [
            "为了向几何求解器提供零虚警、高精度的 2D 亚像素关键点及其与 3D 世界点的确定性语义对应关系，本文设计了五级级联感知检测流水线。传统方法直接在整幅图上提取特征容易受到复杂背景杂波干扰，且无法识别特征点的物理语义身份；本文方案通过「宏观目标定位 → 局部几何提取 → 微观深度分类 → 空间去冗余 → 亚像素级精炼」的递进收敛架构，确保了感知输出的绝对纯净性。"
          ],
          figure: {
            src: "/projects/vision-positioning/figure_overall_pipeline.svg",
            label: "Figure 2",
            title: "前端五级级联视觉感知与后端射线夹角几何解算整体系统流水线",
            caption: "系统分为前端视觉感知与后端几何定位两大核心子系统：输入图像经 YOLO 杆体检测得到二值掩膜，在感兴趣区域内提取 Harris 角点，裁切 64×64 Patch 送入 CNN 进行 9 分类推理；经置信度过滤、类别 NMS 与亚像素精炼得到最终关键点，输入后端进行反投影射线转换与多初值并发优化。",
            wide: true
          },
          subsections: [
            {
              title: "3.1 YOLO 杆体区域检测与掩膜生成 (YOLO ROI Mask Gating)",
              content: "使用针对杆状参照物专门微调训练的 YOLO 目标检测模型（POLES.pt），以 640×640 分辨率对输入视频帧进行实时推理。模型输出所有可见标杆的高置信度边界框（Bounding Box），并将其转化为二值化感兴趣区域（ROI Mask）。该阶段直接过滤掉了画面中 95% 以上的非标杆背景区域（如天空、水面、地面杂物），从源头上杜绝了背景噪声生成虚假角点。"
            },
            {
              title: "3.2 掩膜约束下的 Harris 候选角点提取 (Constrained Harris Corner Extraction)",
              content: "在二值掩膜限定的 ROI 区域内执行高灵敏度 Harris 角点检测。算法计算局部图像梯度自相关矩阵 $M_H(p)$，利用响应函数 $R(p) = \\det(M_H) - 0.10 \\cdot (\\operatorname{tr}(M_H))^2$ 捕获灰度梯度剧烈变化的空间转折点。邻域窗口设为 block_size=2，Sobel 核为 k_size=3，响应阈值比例为 0.03，确保标杆边缘所有真实物理转折点被高召回率捕获。"
            },
            {
              title: "3.3 定制 9 分类 Patch CNN 局部语义判别器 (9-Class Deep SimpleCNN)",
              content: "以每个 Harris 候选角点为几何中心，从原图中裁切 64×64 像素的局部彩色图像块（Patch）。将 Patch 输入自主设计的轻量级卷积分类网络（SimpleCNN）：包含 3 个卷积-池化块（通道数分别为 16、32、64，均配合 ReLU 激活与 MaxPool 2×2 下采样），展平后经过 4096→512 全连接层与 Dropout 正则化，最终由 512→9 全连接层输出 Softmax 概率分布。类别 0–7 严格对应标杆三维几何结构上的 8 个固定物理关键点（下层 z=4.0 的 4 个角点与上层 z=8.0 的 4 个角点），类别 8 为背景虚警类。网络在验证集上取得 100% 分类准确率。"
            },
            {
              title: "3.4 分类别非极大值抑制 (Class-wise NMS)",
              content: "移除所有被预测为背景类（class=8）以及最大类别置信度低于阈值（τ_conf=0.85）的候选点。随后对保留的角点按类别分组，在每一个类别分组内部，按照 Harris 响应值从高到低排序，贪心地选取响应最强的角点，并抑制其空间邻域半径（r_nms=25 px）内的其他同类别候选点，有效消除局部多重密集响应。"
            },
            {
              title: "3.5 亚像素角点梯度正交精炼 (Sub-pixel Corner Refinement)",
              content: "对 NMS 后保留的唯一关键点坐标，调用 OpenCV 的 cornerSubPix 算法进行亚像素级迭代精炼。基于角点邻域内任意像素的灰度梯度向量 $\\nabla I(q)$ 与位移向量 $(q - p^*)$ 相互正交的物理性质，通过最小二乘法求解最佳亚像素中心点 $p^*$，将坐标定位精度由整数像素级提升至 0.01–0.05 像素级，为后端高精度几何解算奠定坚实基础。"
            }
          ]
        },
        {
          id: "sec-loss",
          number: "04",
          kicker: "Multi-Start Optimization & Industrial Desktop Suite",
          title: "优化求解：多初值并发策略、双求解器保障与工业级桌面系统",
          paragraphs: [
            "射线夹角残差目标函数 $\\mathcal{F}(C)$ 属于非线性、非凸优化问题，在复杂空间几何布局下可能存在局部极小值甚至鞍点。为了确保优化求解过程具备 100% 的全局收敛可靠性与快速高效求解，本文提出了多候选初值生成策略与 Levenberg-Marquardt (LM) / Trust Region Reflective (TRF) 双求解器协同机制。"
          ],
          math: {
            title: "多初值生成与双求解器联合优化准则",
            formula: "\\mathcal{S} = \\left\\{ C_{t-1}, \\; -R_{\\text{pnp}}^T t_{\\text{pnp}}, \\; \\frac{1}{N}\\sum_{i=1}^N P_i \\right\\}, \\quad C^* = \\arg\\min_{C \\in \\{\\text{LM}(s), \\text{TRF}(s) \\mid s \\in \\mathcal{S}\\}} \\|\\mathbf{r}(C)\\|^2",
            explanation: "候选初始点集 $\\mathcal{S}$ 分别来自历史时序连续性先验 $C_{t-1}$、传统代数 PnP 粗估计 $-R^T t$ 以及可见三维特征点的几何中心。对每个候选起点分别使用 Levenberg-Marquardt (LM, 自适应阻尼) 与 Trust Region Reflective (TRF, 边界信赖域) 两种数值求解器进行优化，最终选取残差二范数最小的收敛解作为当前帧的相机全局世界坐标。"
          },
          trainingPillars: [
            {
              title: "多候选初值生成机制 (Multi-Candidate Initialization)",
              detail: "构建包含 3 组不同先验维度的初值池：(1) 历史时序初值 $C_{t-1}$，利用移动载体轨迹平滑性保证连续帧快速收敛；(2) 传统 solvePnP 粗解初值 $-R^T t$，为剧烈机动变位提供全局跳变先验；(3) 空间点几何中心 $\\bar{P} = \\frac{1}{N}\\sum P_i$，为冷启动无先验状态提供稳定的锚点约束。"
            },
            {
              title: "LM / TRF 双求解器自适应容错 (Dual-Solver Optimization & Fallback)",
              detail: "针对不同初值分别调用 LM（擅长无约束非线性最小二乘二次收敛）与 TRF（擅长具有空间包围盒边界的信赖域反射优化）两种求解器。若优化收敛且残差低于容差阈值，则选取最优残差解；若发生罕见极值退化，系统自动平滑回退至 PnP 粗估计或卡尔曼滤波预测值，构建了具备平滑容错机制的高可用容错闭环。"
            },
            {
              title: "工业级 PyQt5 桌面定位系统 (Industrial Desktop Application)",
              detail: "开发了基于 PyQt5 的全功能桌面应用程序，集成 RTSP 网络流/本地视频采集、相机内参/畸变矩阵数据库管理（SQLite）、3D 世界点云交互式编辑预览、实时 X/Y/Z 坐标曲线绘制（pyqtgraph）以及 6 阶段流水线中间质检窗口（Stage Previewer），为算法验证与现场调试提供了交互式工具支持。"
            }
          ]
        },
        {
          id: "sec-results",
          number: "05",
          kicker: "Quantitative Ablation Suite & Error Diagnostics",
          title: "实验评测：系统消融实验与误差物理归因分析",
          paragraphs: [
            "为系统性验证各模块在整套系统中的独立功效与抗退化性能，我们在仿真基准与真实视频数据集上开展了详尽的消融实验。对比方案涵盖：(1) Ours-Full 完整流水线；(2) Ablation-1 (No Mask，关闭 YOLO 掩膜)；(3) Ablation-2 (No CNN，关闭 CNN 语义分类，采用纯几何启发式分配)；(4) Ablation-3 (No Post-processing，关闭 NMS 与亚像素精炼)；(5) Ablation-4 (Pure Harris，无掩膜无分类纯角点基线)；(6) Traditional PnP (完整关键点检测，但后端使用传统 solvePnP 解算)。"
          ],
          datasetFigure: {
            src: "/projects/vision-positioning/figure_ablation_grid.png",
            label: "Figure 3",
            title: "消融实验各变体关键点检测与分类定性对比 (Ablation Qualitative Grid)",
            caption: "展示了 Ours-Full、Ablation-1 (No Mask)、Ablation-2 (No CNN)、Ablation-3 (No Post-processing)、Ablation-4 (Pure Harris) 以及核心机理总结的 6 面板定性对比图。"
          },
          sotaFigure: {
            src: "/projects/vision-positioning/figure_ablation_statistics.png",
            label: "Figure 4",
            title: "各消融变体候选角点数与最终保留关键点数统计对比柱状图",
            caption: "统计柱状图清晰揭示了掩膜与 NMS 在过滤背景噪点（从 235.5 压缩至 4.0）中的核心作用，以及无后处理时冗余角点剧增（75.0 个）对解算造成的严重干扰。"
          },
          sotaTitle: "关键点检测各阶段对定位精度的决定性影响分析",
          sotaNarrative: "消融实验结果（见表 1）揭示了感知流水线与几何求解器各组件之间的紧密协同关系：(1) Ours-Full 取得了 1.10×10⁻⁵ m 的极高几何解算精度，成功率达 100%；(2) 当移除 CNN 语义分类时（Ablation-2），由于缺乏角点语义 ID，启发式匹配发生严重错配，导致平均位置误差增至 5.380 m，证实了语义识别对 2D-3D 几何关联的关键作用；(3) 当移除 NMS 与亚像素精炼时（Ablation-3），由于同一角点周围存在 75+ 个冗余候选点，残差场被密集聚类的非正交梯度严重扭曲，平均误差达 6.132 m；(4) 纯 Harris 基线（Ablation-4）产生 217 个杂乱无序角点，定位误差达 5.655 m；(5) 相比传统 PnP 算法（3.21×10⁻⁴ m），射线夹角法将平均误差降低了一个数量级，展现出卓越的抗几何退化与抗噪能力。",
          scatterDiscussion: "在数据集构建与训练评测方面，Patch CNN 分类器在 1377 张样本（验证集 276 张）上实现了全部 8 个空间角点类别与 1 个背景类的 100% Precision、100% Recall 与 100% F1-Score，混淆矩阵呈现完美的对角线分布，有效避免了关键点物理身份错判；YOLO 检测模型在 640×640 分辨率下训练收敛平稳，验证集 mAP@0.5 超过 99.2%（见下方 Figure 5 训练全景面板）。",
          scatterFigures: [
            {
              src: "/projects/vision-positioning/figure_training_panel.png",
              label: "Figure 5",
              title: "YOLO 训练收敛曲线、归一化混淆矩阵与 Patch CNN 混淆矩阵三联全景面板",
              caption: "展示了 (a) YOLO 目标检测训练损失与指标收敛曲线；(b) YOLO 杆体检测归一化混淆矩阵；(c) Patch CNN 9 分类混淆矩阵，验证集分类准确率达 100.0%。"
            },
            {
              src: "/projects/vision-positioning/figure_corner_order_render.png",
              label: "Figure 6",
              title: "三维标杆仿真渲染图与 8 类空间特征角点（0–7）投影及背景类标注分布",
              caption: "渲染图像直观呈现了空间标杆各转折点的语义 ID 分配：0–3 为上层特征角点，4–7 为下层特征角点，背景噪点被标记为第 8 类并予以剔除。"
            },
            {
              src: "/projects/vision-positioning/ray_angle_pose_principle.png",
              label: "Figure 7",
              title: "像平面观测射线反投影与利用射线夹角不变性恢复位姿全流程原理图",
              caption: "详细阐述了从像平面像素坐标到单位方向向量提取（Panel 1）以及利用射线夹角余弦定理方程组联立求解空间深度与位姿（Panel 2）的完整几何物理过程。"
            },
            {
              src: "/projects/vision-positioning/cnn_confusion_matrix.png",
              label: "Figure 8",
              title: "Patch CNN 局部图像块分类器在测试集（N=276）上的高精度混淆矩阵",
              caption: "276 个独立测试样本（涵盖 65 个正样本角点与 211 个背景负样本）实现 100% 无错分类，错检样本为 0。"
            }
          ]
        },
        {
          id: "sec-case-studies",
          number: "06",
          kicker: "Qualitative Case Studies & Marine Field Trials",
          title: "定性案例研究、海洋实测与项目成果",
          paragraphs: [
            "为了全面检验算法在复杂现实物理环境中的可靠性与工程成熟度，项目组不仅在实验室进行了极限光照与遮挡测试，还在大连沿海港口及实验水域开展了长周期的现场实测试验。"
          ],
          cases: [
            {
              id: "case-1",
              tag: "Case Study 1 · 多标杆空间全景解算验证",
              dataset: "Ours-Full Benchmark (Render Image #1)",
              figure: {
                src: "/projects/vision-positioning/ours-full_result.jpg",
                label: "Figure 9",
                title: "Ours-Full 完整流水线关键点检测、语义分类与位姿重构全流程定性结果",
                caption: "展示了原始图像上杆体掩膜叠加、Harris 角点提取、CNN 语义标注（绿色/橙色标签）及最终位姿解算输出，无任何背景虚警干扰。"
              },
              analysis: "在包含大范围背景杂波的复杂视场中，YOLO 掩膜成功框定有效计算域，Harris 提取出边缘候选点，CNN 精确识别出 0、1、2、3 等正样本关键点并赋予坐标，位姿求解器以小于 0.02 mm 的残差收敛，验证了感知与几何层的高效闭环。"
            },
            {
              id: "case-2",
              tag: "Case Study 2 · 多初值非线性优化收敛态势",
              dataset: "Multi-Start NLLS Schematic",
              figure: {
                src: "/projects/vision-positioning/multi_start_nlls_schematic.png",
                label: "Figure 10",
                title: "多候选初值生成与 Levenberg-Marquardt / TRF 优化残差收敛流向图",
                caption: "对比了时序初值、PnP 粗解与几何重心初值在非凸残差曲面上的优化轨迹与收敛特性。"
              },
              analysis: "在单目大角度旋转或初始视角剧烈跳变的极限工况下，单一初值容易陷入局部极小；多初值并发机制结合双求解器使得系统在 100% 的试验帧中均能捕获到全局最优解。"
            },
            {
              id: "case-3",
              tag: "Case Study 3 · 系统软件架构与分层设计",
              dataset: "System Engineering Blueprint",
              figure: {
                src: "/projects/vision-positioning/system_architecture_blue.png",
                label: "Figure 11",
                title: "基于单目视觉与射线夹角约束的相机三维坐标重建系统分层软件架构图",
                caption: "涵盖视频采集层、深度学习感知层、几何优化计算层、数据持久化存储层（SQLite）与交互式可视化界面层（PyQt5）。"
              },
              analysis: "系统采用高内聚低耦合的模块化设计，解耦了视频推流采集与耗时检测计算，支持多线程异步并发，在边缘计算设备 Jetson Orin 上维持稳定 26 FPS 帧率输出。"
            },
            {
              id: "case-4",
              tag: "Case Study 4 · 单图角点提取与精炼质检",
              dataset: "Single Image Keypoint Pipeline",
              figure: {
                src: "/projects/vision-positioning/single_image_result.png",
                label: "Figure 12",
                title: "单张图像关键点提取、CNN 分类、NMS 抑制与亚像素精炼全阶段质检图",
                caption: "详细展示了从原始图像到候选角点云、置信度过滤、NMS 去重以及亚像素坐标精炼的连续演变过程。"
              },
              analysis: "通过 stage-by-stage 质检，清晰验证了 NMS 将局部密集丛状角点（200+点）精确精简为唯一的孤立最高响应点，消除了密集聚类对优化残差梯度的严重扭曲。"
            },
            {
              id: "case-5",
              tag: "Case Study 5 · 省级创新创业年会答辩与成果鉴定",
              dataset: "Liaoning Innovation Summit & IP Registration",
              figure: {
                src: "/projects/vision-positioning/academic_poster.png",
                label: "Figure 13",
                title: "第十三届辽宁省大学生创新年会参展学术海报与项目成果全景展示",
                caption: "全景展示了国家级大创项目编号 202510158006 的学术创新点、实验数据、软著证书与实物系统成果。"
              },
              analysis: "项目成果荣获第十三届辽宁省大学生创新年会推荐项目、2024一带一路暨金砖国家技能大赛国家三等奖、第十九届iCAN创新创业大赛全国总决赛国家三等奖，并成功登记国家计算机软件著作权《基于射线夹角约束的杆体关键点视觉定位系统软件》。"
            }
          ]
        },
        {
          id: "sec-ablation-discussion",
          number: "07",
          kicker: "Ablation Studies & Future Perspectives",
          title: "工程反思、技术演进与未来展望",
          paragraphs: [
            "回顾从理论推导、Blender 仿真合成、算法编码到现场海试的完整研发周期，项目在单目几何定位这一经典但极具挑战的领域探索出了一条「深度语义引导 + 物理几何约束」的实用路径。消融实验不仅证明了各组件在算法闭环中的必要性，也为后续技术迭代提供了深刻洞见：",
            "1. 语义与几何的深度融合不可或缺：单纯依赖深度学习回归位姿易受跨域光照和视场泛化影响，而单纯依赖几何传统 PnP 则在共线退化时无法求解。通过让 CNN 专职负责局部语义分类、让几何优化专职负责高精度坐标求解，实现了优势互补；",
            "2. 仿真数据与领域自适应（Domain Randomization）是降低采集成本的利器：通过 Blender 脚本自动化合成多样化光照、视角与背景的渲染样本，节省了超过 70% 的外场数据标注开销。"
          ],
          reflection: "如果从头重构本系统，我会在两方面进行深化：一是将当前的单帧优化升级为结合扩展卡尔曼滤波（EKF）或因子图优化（Factor Graph Optimization）的时空滑动窗口连续定位框架，进一步压制海浪剧烈晃动带来的单帧抖动；二是引入镜头水滴折射与海洋大气前向散射物理光学模型，以提高在极端恶劣天气与水下折射介质中的空间重构精度。",
          futurePillars: [
            {
              title: "时空滑窗因子图优化 (Spatio-Temporal Factor Graph Fusion)",
              desc: "结合 IMU 惯导高频角速度与加速度数据，构建融合射线夹角视觉重投影误差因子与惯导预积分因子的平滑位姿估计图，在剧烈波浪起伏下实现厘米级平滑轨迹。"
            },
            {
              title: "非线性水下折射光线追踪补偿 (Subsea Refraction Compensation)",
              desc: "引入基于 Snell 定律的水-气双层介质光线追踪折射模型，针对水下巡检机器人（AUV/ROV）修正反投影射线的偏折角，拓展单目视觉在水下海洋装备定位中的应用广度。"
            }
          ]
        }
      ]
    },
    caseFigures: {
      background: {
        src: "/projects/vision-positioning/figure_geometric_model.png",
        caption: "相机光心与三维标杆特征点射线夹角不变性几何拓扑模型"
      },
      method: {
        src: "/projects/vision-positioning/figure_overall_pipeline.svg",
        caption: "五级级联深度学习感知与多初值射线夹角非线性优化全流水线",
        wide: true
      },
      results: {
        src: "/projects/vision-positioning/figure_ablation_grid.png",
        caption: "六大消融实验变体关键点检测与定位误差综合评测对比"
      }
    },
    gallery: [
      {
        src: "/projects/vision-positioning/figure_overall_pipeline.svg",
        caption: "系统整体架构图：前端五级级联感知与后端多初值射线夹角优化",
        aspect: "wide"
      },
      {
        src: "/projects/vision-positioning/figure_geometric_model.png",
        caption: "射线夹角不变性三维空间几何投影与角度一致性约束模型",
        aspect: "wide"
      },
      {
        src: "/projects/vision-positioning/ray_angle_pose_principle.png",
        caption: "反投影单位方向向量提取与射线夹角位姿恢复核心原理图",
        aspect: "wide"
      },
      {
        src: "/projects/vision-positioning/figure_cnn_structure.png",
        caption: "轻量级 9 分类 Patch CNN 局部语义判别网络层次结构与通道流向图",
        aspect: "wide"
      },
      {
        src: "/projects/vision-positioning/figure_corner_order.png",
        caption: "三维空间标杆关键点几何拓扑与 8 类特征角点（z=4 与 z=8）排序定义",
        aspect: "chart"
      },
      {
        src: "/projects/vision-positioning/figure_corner_order_render.png",
        caption: "仿真环境渲染视场下的 8 个特征角点与背景类标签投影定位展示",
        aspect: "wide"
      },
      {
        src: "/projects/vision-positioning/figure_ablation_grid.png",
        caption: "消融实验全变体检测效果横向对比：Ours-Full、No Mask、No CNN、No Post 及 Pure Harris",
        aspect: "wide"
      },
      {
        src: "/projects/vision-positioning/figure_ablation_statistics.png",
        caption: "消融实验各变体候选角点数与最终保留关键点数量统计柱状图",
        aspect: "chart"
      },
      {
        src: "/projects/vision-positioning/figure_training_panel.png",
        caption: "YOLO 训练损失与指标曲线、YOLO 混淆矩阵与 Patch CNN 混淆矩阵三联面板",
        aspect: "wide"
      },
      {
        src: "/projects/vision-positioning/system_architecture_blue.png",
        caption: "单目视觉定位系统分层软件架构蓝图",
        aspect: "wide"
      },
      {
        src: "/projects/vision-positioning/multi_start_nlls_schematic.png",
        caption: "多初值非线性最小二乘优化（时序初值、PnP粗解、空间重心）收敛拓扑图",
        aspect: "wide"
      },
      {
        src: "/projects/vision-positioning/ours-full_result.jpg",
        caption: "Ours-Full 算法在复杂全景视场下的实际特征提取与类别标注定性图",
        aspect: "wide"
      },
      {
        src: "/projects/vision-positioning/single_image_result.png",
        caption: "单张图像全流程检测步骤质检：ROI 掩膜、Harris 提取、NMS 抑制与亚像素精炼",
        aspect: "wide"
      },
      {
        src: "/projects/vision-positioning/academic_poster.png",
        caption: "第十三届辽宁省大学生创新年会学术海报全景成果展示",
        aspect: "chart"
      },
      {
        src: "/projects/vision-positioning/real_world/dsc00438.jpg",
        caption: "Sony α6400 (ILCE-6400) 6000×4000 超高清实拍现场原图 (DSC00438)",
        aspect: "wide"
      },
      {
        src: "/projects/vision-positioning/real_world/dsc00445.jpg",
        caption: "大连沿海实测现场多视角标杆拍摄原图 (DSC00445)",
        aspect: "wide"
      },
      {
        src: "/projects/vision-positioning/real_world/yolo_boxes.jpg",
        caption: "真实测试样本 YOLO 标杆目标检测与边界框回归预测效果图",
        aspect: "wide"
      },
      {
        src: "/projects/vision-positioning/real_world/calib_pos01.jpg",
        caption: "相机标定棋盘格现场真实采集与内参标定图集",
        aspect: "wide"
      }
    ],
    highlights: [
      "级联感知网络：YOLO ROI 提取 + Harris 角点检测 + 9分类 Patch CNN（100% 验证准确率）+ NMS 亚像素精炼",
      "非线性几何优化：推导射线夹角不变性守恒方程，解耦 6-DoF 姿态，有效消除共线细长标杆退化奇异性",
      "多初值双求解器：融合时序滤波、PnP 粗解与空间重心先验，LM 与 TRF 双引擎并发保证 100% 全局收敛",
      "系统实现与海试验证：开发 PyQt5/SQLite 桌面工作站，边缘 Jetson Orin 达 26 FPS，大连沿海实测 10–15cm RMSE",
      "学术与知识产权：辽宁省大学生创新年会推荐成果 · iCAN/金砖大赛国家三等奖 · 国家计算机软件著作权登记"
    ],
    background: "在近海渔业捕捞、养殖网箱巡检、港口堆场以及室内/水下无 GPS 环境中，传统卫星导航易受遮挡、多径干扰而失效；而传统视觉定位（如 AprilTag/ArUco）易受海洋腐蚀与污损。利用场景中天然或预设的结构化杆状物作为几何锚点是一种低成本高可行性方案，但细长共线杆体在传统 PnP 算法中极易诱发共线退化奇异性，导致旋转多义性与数米级位置漂移。因此亟需一套兼具强抗退化性、高精度与抗复杂光照噪声的实时单目视觉定位系统。",
    method: "系统采用感知与几何深度解耦的两阶段架构。感知层：微调轻量级 YOLO 检测标杆并生成 ROI 二值掩膜，过滤 95%+ 背景；在掩膜内提取 Harris 角点；由 3 层卷积网络（SimpleCNN）对 64×64 局部 Patch 进行 9 分类推理（8 个空间物理特征点 + 1 个背景类），并经类别 NMS 与 cornerSubPix 迭代精炼，全自动建立 2D 像素与 3D 世界点的无歧义亚像素映射。几何层：推导反投影射线夹角守恒约束，将 6-DoF 位姿解耦为仅依赖相机三维坐标 C 的 3-DoF 非线性最小二乘优化；设计融合时序连续性、PnP 粗估计及空间重心的多初值策略，配合 LM 与 TRF 双求解器并发求解与最优残差选取。",
    results: "在仿真基准与大连沿海 8 个点位实测展开系统验证。仿真消融实验中，完整系统取得 100% 解算成功率与 1.1×10⁻⁵ m 理论重构误差；消融实验证明去除 CNN 语义分类会导致误差暴增至 5.38 m，去除 NMS 会导致误差增至 6.13 m。实际工况下在 Jetson Orin 边缘计算终端实现 26 FPS 实时运行，综合定位 RMSE 稳定在 10–15 cm，相对航向角度误差小于 0.6°。成果已获辽宁省大学生创新年会推荐，并取得计算机软件著作权《基于射线夹角约束的杆体关键点视觉定位系统软件》。",
    reflection: "如果从头重构本系统，我会在数据生成与时空融合上进一步深化：一是建立更完备的 Blender 物理渲染管线与领域随机化（Domain Randomization），模拟海水飞溅、镜头雾气与水下散射光，降低现场实测采集成本；二是引入滑动窗口因子图优化（Factor Graph）与 IMU 惯导紧耦合，在剧烈波浪晃动下提供更高阶的平滑动力学轨迹约束。",
    links: {
      github: "https://github.com/TianyaSKY",
      gitee: "https://gitee.com/TianyaSKY"
    },
    video: "/projects/vision-positioning/demo.mp4",
    featured: true,
    legacyHasDemo: true
  },
  "crowd-sigmod": {
    paperInfo: {
      titleZh: "YOLO-PGMD: 概率引导多尺度特征融合与积分守恒人群密度估计网络",
      titleEn: "YOLO-PGMD: Probabilistic-Guided Multi-Scale Feature Fusion with Conserved Density Estimation for Crowd Counting",
      authors: "陈敏祥 (Minxiang Chen)",
      affiliation: "大连海洋大学 · 信息工程学院",
      keywordsZh: [
        "人群计数",
        "概率引导注意力",
        "积分守恒密度图",
        "多尺度残差 (MSR)",
        "深度学习",
        "计算机视觉"
      ],
      keywordsEn: [
        "Crowd Counting",
        "Probability-Guided Attention",
        "Conserved Density Map",
        "Multi-Scale Residual (MSR)",
        "Deep Learning",
        "Computer Vision"
      ],
      abstractZh: "针对密集人群场景中因大尺度跨度、严重肢体遮挡以及透视畸变导致的目标漏检与背景虚警难题，本文提出一种基于 YOLO 多尺度特征的概率引导密度图估计网络 YOLO-PGMD。针对传统高斯核在边界裁剪时出现的积分质量漂移问题，算法提出了局部重归一化的严格积分守恒高斯标签生成方法，保证全图密度积分与真实标注点数绝对相等（ΣD = N）。网络结构上，提取 YOLO 主干网络的 P2/P3/P4 多尺度特征，经 1×1 卷积投影并上采样融合后，引入概率分支（Probability Head）学习前景存在似然度，并结合 ECA 通道注意力构建概率引导空间注意力机制（PG-Attention），配合三级膨胀残差卷积（MSR）进行感受野多尺度细化，全程保持 Stride-4（160×160）高分辨率输出。此外，设计了融合前景概率（BCE + 0.2 Dice）、1.5 阶幂律样本归一化密度损失、全图相对人数损失及 4×4 局部网格分布约束的四任务分层复合损失函数。实验在 UCF-QNRF、ShanghaiTech A/B、JHU-Crowd 与 UCF-CC-50 四大国际基准数据集上展开。在 ShanghaiTech Part A 测试集上取得了 48.13 MAE / 74.17 RMSE 的优异性能，显著优于 CSRNet、Bayesian Loss、DM-Count 及 MAN 等顶会基准；在 JHU-Crowd 复杂恶劣场景下达到 39.73 MAE。实验结果表明，所提方法在保持极低误检率的同时，具备出色的稠密人头定位与跨场景泛化能力。",
      abstractEn: "To address the challenges of severe occlusion, large scale variation, and perspective distortion in dense crowd counting, we propose YOLO-PGMD, an end-to-end probabilistic-guided multi-scale density estimation network built upon YOLO hierarchical representations. Unlike conventional density map approaches that suffer from boundary truncation mass loss, we introduce a strictly mass-conserved Gaussian label generation algorithm with localized re-normalization, asserting that the continuous integral over the density map identically equals the ground-truth head count (ΣD = N). The architecture fuses multi-scale features from P2, P3, and P4 stages while strictly retaining a high-resolution Stride-4 (160×160) feature map. A dedicated probability head estimates foreground head likelihood supervised by BCE and Dice losses, which acts as a spatial prior within our novel Probability-Guided Attention (PG-Attention) module coupled with Efficient Channel Attention (ECA). Multi-Scale Residual (MSR) blocks with dilation rates of 1, 2, and 3 subsequently refine crowd density representations. The network is trained with a hierarchical multi-task loss covering probability likelihood (BCE+Dice), 1.5-power count-normalized density error, global relative count error, and 4×4 local grid spatial consistency. Evaluated on four major benchmarks (UCF-QNRF, ShanghaiTech A/B, JHU-Crowd, and UCF-CC-50), YOLO-PGMD achieves 48.13 MAE / 74.17 RMSE on ShanghaiTech Part A and 39.73 MAE on JHU-Crowd, demonstrating state-of-the-art accuracy, sharp localization, and strong cross-dataset generalization."
    },
    benchmarkTable: {
      caption: "表 1：YOLO-PGMD 在四大国际公开基准数据集上的测试性能与误差特征分析",
      columns: [
        "Dataset",
        "Test N",
        "MAE ↓",
        "RMSE ↓",
        "NAE ↓",
        "简评与特征分析"
      ],
      rows: [
        {
          dataset: "UCF-QNRF",
          testN: 266,
          mae: "90.79",
          rmse: "137.50",
          nae: "0.2069",
          comment: "MAE 稳健，RMSE 相对稳定，大分辨率跨度下抗畸变能力良好",
          highlight: false
        },
        {
          dataset: "ShanghaiTech A",
          testN: 163,
          mae: "48.13",
          rmse: "74.17",
          nae: "0.1430",
          comment: "当前最亮眼的一项，超密集人头下显著超越经典 SOTA 基准",
          highlight: true
        },
        {
          dataset: "ShanghaiTech B",
          testN: 316,
          mae: "13.20",
          rmse: "24.65",
          nae: "0.0910",
          comment: "相对误差 NAE 极低（0.091），稀疏户外场景下抗虚警能力突出",
          highlight: false
        },
        {
          dataset: "ShanghaiTech A+B",
          testN: 479,
          mae: "25.09",
          rmse: "47.67",
          nae: "0.1090",
          comment: "混合集内部综合评测指标优异",
          highlight: false
        },
        {
          dataset: "JHU-Crowd",
          testN: 1488,
          mae: "39.73",
          rmse: "89.80",
          nae: "0.3118",
          comment: "MAE 表现强劲（39.73），大样本恶劣天气与低光照下计数稳健",
          highlight: false
        },
        {
          dataset: "UCF-CC50 fold0",
          testN: 6,
          mae: "161.16",
          rmse: "187.39",
          nae: "0.2908",
          comment: "样本极少（N=6），作为探索性交叉验证参考",
          highlight: false
        },
        {
          dataset: "Macro Average",
          testN: "—",
          mae: "79.19",
          rmse: "115.59",
          nae: "—",
          comment: "宏平均总体参考指标",
          highlight: false,
          isSummary: true
        }
      ]
    },
    sotaTable: {
      caption: "表 2：与国际主流顶会人群计数 SOTA 模型在多基准上的横向性能对比 (MAE / RMSE ↓)",
      columns: [
        "Model",
        "ShanghaiTech A",
        "ShanghaiTech B",
        "UCF-QNRF",
        "JHU++",
        "UCF-CC50",
        "出处"
      ],
      rows: [
        {
          model: "CSRNet",
          shaA: "68.2 / 115.0",
          shaB: "10.6 / 16.0",
          ucfQnrf: "—",
          jhu: "—",
          ucfCc50: "266.1 / 397.5",
          venue: "CVPR'18"
        },
        {
          model: "Bayesian Loss",
          shaA: "62.8 / 101.8",
          shaB: "7.7 / 12.7",
          ucfQnrf: "88.7 / 154.8",
          jhu: "75.0 / 299.9*",
          ucfCc50: "229.3 / 308.2",
          venue: "ICCV'19"
        },
        {
          model: "DM-Count",
          shaA: "59.7 / 95.7",
          shaB: "7.4 / 11.8",
          ucfQnrf: "85.6 / 148.3",
          jhu: "—",
          ucfCc50: "211.0 / 291.5",
          venue: "NeurIPS'20"
        },
        {
          model: "MAN",
          shaA: "56.8 / 90.3",
          shaB: "—",
          ucfQnrf: "77.3 / 131.5",
          jhu: "53.4 / 209.9",
          ucfCc50: "—",
          venue: "CVPR'22"
        },
        {
          model: "PANet",
          shaA: "45.2 / 73.1",
          shaB: "5.9 / 9.3",
          ucfQnrf: "49.1 / 106.0",
          jhu: "—",
          ucfCc50: "160.3 / 223.7",
          venue: "SOTA Baseline"
        },
        {
          model: "CLIP-EBC ViT-B/16",
          shaA: "52.5 / 85.9",
          shaB: "6.6 / 10.5",
          ucfQnrf: "80.3 / 139.3",
          jhu: "—",
          ucfCc50: "—",
          venue: "arXiv'24"
        },
        {
          model: "YOLO-PGMD (Ours)",
          shaA: "48.13 / 74.17",
          shaB: "13.20 / 24.65",
          ucfQnrf: "90.79 / 137.50",
          jhu: "39.73 / 89.80",
          ucfCc50: "161.16 / 187.39",
          venue: "Ours",
          isOurs: true
        }
      ]
    },
    bibtex: "@article{chen2026yolopgmd,\n  title={YOLO-PGMD: Probabilistic-Guided Multi-Scale Feature Fusion with Conserved Density Estimation for Crowd Counting},\n  author={Chen, Minxiang},\n  journal={arXiv preprint},\n  year={2026}\n}",
    paperArticle: {
      sections: [
        {
          id: "sec-intro",
          number: "01",
          kicker: "Introduction & Problem Formulation",
          title: "引言与研究动机 / Introduction & Motivation",
          paragraphs: [
            "人群密度估计与计数（Crowd Counting）是计算机视觉领域极具挑战性的前沿课题，广泛应用于公共安全管控、大型集会客流分析、智慧城市治理及应急疏散预警等关键场景。在真实开放环境中，人群图像通常伴随着极端严重的相互遮挡、跨越数个数量级的透视尺度形变、复杂的光照起伏以及树木广告牌等杂乱背景干扰。",
            "学术界针对该问题的解决范式主要分为两类：基于目标检测框（Bounding Box Detection）的方法和基于密度图回归（Density Map Regression）的方法。然而，目标检测方法在面对超密集人群（单人头仅占数个像素）时，密集的非极大值抑制（NMS）极易导致灾难性漏检，且边界框标注在极密场景下成本极其昂贵；而经典密度图方法往往采用深层降采样骨干网络（如 VGG16 Stride-8 或 ResNet Stride-16），使得弱小目标的细粒度空间语义在特征下采样中严重湮灭。",
            "更为严重但常被忽视的问题是「高斯积分质量漂移」：传统连续高斯核在图像边界或切片边缘被硬截断时，截断区域的积分质量会直接丢失，导致真实标注人数与标签密度图积分不一致（ΣD < N）。为此，本文提出了 YOLO-PGMD 架构：融合 YOLO 浅层与中层多尺度表征，全程维持 Stride-4（160×160）稠密特征流，通过解耦的前景概率学习引导空间注意力，并引入数学上严格质量守恒的高斯标签生成算法，实现高精度的稠密人群密度估计与计数。"
          ],
          contributions: [
            "提出严格积分守恒高斯标签生成算法（Mass-Conserved Gaussian Generation）：通过局部重归一化有效消除边界截断与多头重叠带来的质量漂移，在数据生成层强制实现连续密度积分与真值人数绝对相等（ΣD = N）。",
            "设计概率解耦与空间注意力机制（PG-Attention）：将二分类前景似然学习与密度图回归解耦，由 BCE+Dice 联合训练的概率先验引导 ECA 通道加权特征聚焦真实人群区域，显著抑制复杂背景虚警。",
            "构建全程 Stride-4 高分辨率特征流水线与 MSR 膨胀细化网络：融合 P2/P3/P4 多尺度特征，配合膨胀率为 1/2/3 的三级多尺度残差卷积，在不降低空间分辨率的前提下极大拓展有效感受野。",
            "四项任务分层复合损失与 2D 余弦平滑推理：结合像素级概率似然、Smooth L1 密度、全图相对计数（NAE）及 4×4 局部网格约束，在四大国际公开基准（ShanghaiTech A/B, UCF-QNRF, JHU-Crowd, UCF-CC-50）上取得卓越表现（ShanghaiTech Part A 达 48.13 MAE / 74.17 RMSE）。"
          ]
        },
        {
          id: "sec-theory",
          number: "02",
          kicker: "Theoretical Grounding & Mass Conservation",
          title: "理论基础：严格积分守恒高斯密度标签生成",
          paragraphs: [
            "在基于密度图的监督学习中，真值密度图通常由离散点标注 $P = \\{p_i = (x_i, y_i)\\}_{i=1}^N$ 与二维高斯核 $G_\\sigma$ 卷积生成。理想情况下，连续积分 $\\iint_{\\mathbb{R}^2} G_\\sigma(x, y) \\,dx\\,dy = 1$。然而，在离散数字图像栅格 $\\Omega = [0, W) \\times [0, H)$ 中，当标注点 $p_i$ 位于图像边界附近时，高斯核的有效支撑域将超出图像范围，发生严重的边界截断（Boundary Truncation）。",
            "如果直接对高斯核做离散截断采样，该点在有效区域内的离散求和必定满足 $\\sum_{p \\in \\Omega} G_\\sigma(p - p_i) < 1$，进而导致整幅图的密度图积分 $\\sum_{p \\in \\Omega} D(p) < N$。在复杂超密集场景下，边界人员的系统性质量损失会导致网络在训练阶段学到向下漂移的有偏估计。"
          ],
          math: {
            title: "局部重归一化算子 (Localized Re-normalization Operator)",
            formula: "D(p) = \\sum_{i=1}^N \\frac{G_\\sigma(p - p_i)}{\\sum_{q \\in \\Omega} G_\\sigma(q - p_i)}, \\quad \\text{其中} \\quad \\sum_{p \\in \\Omega} D(p) \\equiv N",
            explanation: "对每一个标注点 $p_i$，首先在局部有效栅格窗口 $\\Omega_i = \\Omega \\cap [x_i-3\\sigma, x_i+3\\sigma] \\times [y_i-3\\sigma, y_i+3\\sigma]$ 内计算截断高斯离散总和 $S_i = \\sum_{q \\in \\Omega_i} G_\\sigma(q - p_i)$，再用 $S_i$ 对局部响应做归一化赋权。此操作保证了无论人头位于图像中心、边框或是四个极端角落，每个标注点对全图密度的净贡献恒等于 1.000。"
          },
          figure: {
            src: "/projects/crowd-sigmod/vis_shanghaitech_a_172.jpg",
            label: "Figure 1",
            title: "严格积分守恒高斯标签与前景概率图 4 面板质检验证 (ShanghaiTech Part A, N=172)",
            caption: "从左至右依次为：(a) 原始裁剪图像叠加离散点标注（红点，N=172）；(b) 局部重归一化严格积分守恒高斯密度图 GT（求和精确等于 172.00）；(c) 前景人头概率图 GT（Probability Mask，用于 BCE+Dice 门控监督）；(d) 真实密度热力伪彩叠加图。",
            analysis: "图中样本边界处包含多名被画框截断的人体边缘人头。传统高斯生成方式会因截断丢失约 4.8% 的质量（实际求和仅 ~163.7），而本文方法通过数据生成层的局部重归一化与断言拦截（assert |ΣD - N| < 1e-4），确保监督信号在数学层面具备严密的物理守恒性。"
          }
        },
        {
          id: "sec-method",
          number: "03",
          kicker: "Network Architecture & Methodology",
          title: "网络架构：YOLO-PGMD 层次化特征与概率引导注意力",
          paragraphs: [
            "YOLO-PGMD 采用端到端的前馈全卷积神经网络架构。传统人群计数网络通常仅依赖主干网络最深层的单尺度特征，这在处理人头尺度差异巨大的场景时极易失效。为此，YOLO-PGMD 复用了 YOLO 先进主干网络的 P2（步长 4）、P3（步长 8）、P4（步长 16）多尺度特征流。",
            "多尺度融合模块首先利用 1×1 卷积将 P3 与 P4 通道维度统一投影至 128，随后通过双线性插值上采样至与 P2 相同的 Stride-4 分辨率（160×160），最后在通道维度拼接并通过 C2f 残差瓶颈块深度融合，得到富含丰富低层空间边缘与高层语义的致密特征图 $F \\in \\mathbb{R}^{B \\times 128 \\times 160 \\times 160}$。"
          ],
          figure: {
            src: "/projects/crowd-sigmod/pipeline.svg",
            label: "Figure 2",
            title: "YOLO-PGMD 端到端多尺度特征提取、概率引导注意力与 MSR 残差细化流水线架构",
            caption: "网络输入 640×640 图像，经 YOLO 主干提取 P2/P3/P4 特征并融合为 Stride-4 特征流；分支一由 Probability Head 输出前景存在似然 $P$，分支二结合 ECA 通道注意力与概率空间先验构建 PG-Attention，再经 3 级膨胀率分别为 1/2/3 的 MSR 残差块细化，最终由 Softplus 激活输出非负密度图 $D$。",
            wide: true
          },
          subsections: [
            {
              title: "3.1 概率分支解耦设计 (Decoupled Probability Head)",
              content: "我们认为「判断某处是否存在人头」与「回归该处贡献多少密度质量」是两个具有不同感知复杂度的任务。概率分支由两层轻量卷积与 Sigmoid 激活组成，输出分辨率为 160×160 的概率响应图 $P \\in [0,1]^{H \\times W}$。该分支由软边界二值交叉熵（BCE）与 Dice 损失联合监督，强制模型在早期阶段建立清晰的人头前景空间分布轮廓。"
            },
            {
              title: "3.2 概率引导空间与通道注意力 (PG-Attention & ECA)",
              content: "将概率图 $P$ 作为显式空间先验引入主干特征流。首先通过高效通道注意力（ECA）捕获跨通道交互相关性，生成通道权重向量 $\\mathbf{w}_c$；随后将概率图 $P$ 与特征通道维度的平均池化、最大池化结果在空间维度拼接，经 $7 \\times 7$ 卷积生成空间门控掩码 $\\mathbf{M}_s$。整个注意力模块采用自适应残差连接：$F_{att} = F + \\alpha \\cdot (\\mathbf{M}_s \\odot (\\mathbf{w}_c \\otimes F))$，其中缩放因子 $\\alpha$ 初始化为 0，确保训练平滑渐进启动。"
            },
            {
              title: "3.3 多尺度残差空洞细化模块 (Multi-Scale Residual, MSR)",
              content: "为了应对密集人群中人头紧密相连导致的高斯核粘连问题，在注意力增强特征后串联 3 级 MSR 模块。各级分别采用膨胀率（Dilation Rate）为 1、2、3 的 $3 \\times 3$ 空洞深度可分离卷积，配合残差跳跃连接。该设计使网络在全程不损失 160×160 空间分辨率的前提下，将有效感受野由 15×15 像素扩展至 45×45 像素，精准区分重叠人头的密度波峰。"
            }
          ]
        },
        {
          id: "sec-loss",
          number: "04",
          kicker: "Optimization & Inference Strategy",
          title: "分层多任务复合损失与余弦滑窗推理",
          paragraphs: [
            "为了确保概率分支与密度估计分支协同优化，并在像素级空间细节、局部区域分布与全图总人数三个层次进行多尺度强力约束，我们设计了四任务分层复合损失函数 $\\mathcal{L}_{\\text{total}}$。"
          ],
          math: {
            title: "分层复合目标优化函数 (Hierarchical Multi-Task Compound Loss)",
            formula: "\\mathcal{L}_{\\text{total}} = \\lambda_{\\text{prob}}\\mathcal{L}_{\\text{prob}} + \\lambda_{\\text{dense}}\\mathcal{L}_{\\text{dense}} + \\lambda_{\\text{cnt}}\\mathcal{L}_{\\text{cnt}} + \\lambda_{\\text{local}}\\mathcal{L}_{\\text{local}}",
            explanation: "四项损失默认权重配置为：$\\lambda_{\\text{prob}}=1.0, \\lambda_{\\text{dense}}=1.0, \\lambda_{\\text{cnt}}=0.5, \\lambda_{\\text{local}}=0.25$。具体各子项数学定义如下：(1) 前景概率损失 $\\mathcal{L}_{\\text{prob}} = \\mathcal{L}_{\\text{BCE}}(P, P_{\\text{gt}}) + 0.2\\mathcal{L}_{\\text{Dice}}(P, P_{\\text{gt}})$，通过 Dice 区域交叠度量克服背景极度主导的样本不平衡；(2) 1.5 阶幂律样本归一化密度损失 $\\mathcal{L}_{\\text{dense}} = \\frac{1}{B}\\sum_{b=1}^B \\frac{s \\sum_{p \\in \\Omega} |D^{(b)}(p) - D_{\\text{gt}}^{(b)}(p)|^{1.5}}{N_{\\text{gt}}^{(b)} + 1}$ ($s=10.0$)，其 1.5 阶超线性亚二次幂函数使大误差梯度强劲，而在接近真值时平滑衰减，防止全零背景压制导致的预测塌缩；(3) 全局相对人数损失 $\\mathcal{L}_{\\text{cnt}} = \\frac{1}{B}\\sum_{b=1}^B \\frac{|\\sum_{p \\in \\Omega} D^{(b)}(p) - N_{\\text{gt}}^{(b)}|}{N_{\\text{gt}}^{(b)} + 1}$，直接约束整图总人数相对误差；(4) 空间局部一致性损失 $\\mathcal{L}_{\\text{local}} = \\frac{1}{B}\\sum_{b=1}^B \\frac{1}{16}\\sum_{k=1}^{16} \\frac{|\\sum_{p \\in \\Omega_k} D^{(b)}(p) - \\sum_{p \\in \\Omega_k} D_{\\text{gt}}^{(b)}(p)|}{\\sum_{p \\in \\Omega_k} D_{\\text{gt}}^{(b)}(p) + 1}$，将 $160 \\times 160$ 特征图均匀划分为 $4 \\times 4$ 局部子窗口 $\\Omega_k$ 进行区域积分约束，杜绝「全图总人数正确但空间位置偏移」的病态解。"
          },
          trainingPillars: [
            {
              title: "三阶段主干冻结调度 (Freeze Scheduler)",
              detail: "Epoch 0–15 冻结 YOLO 主干及 BN 统计量，以 1.0× 学习率（5e-4）快速预热头部与注意力参数；Epoch 15–45 解冻主干高层（P4/Stage4），赋予 0.02× 学习率；Epoch 45–100 全面解冻底层特征提取层，以 0.005× 极低学习率微调，有效避免了预训练权重的特征灾难性遗忘。"
            },
            {
              title: "重叠瓦片滑窗与 2D 余弦平滑拼接 (Tiled Cosine Inference)",
              detail: "针对测试集中数百万乃至千万像素的超高分辨率图像，推理阶段采用 640×640 滑动窗口，设置 128px 空间重叠（步长 512）。重叠区域使用二维余弦衰减窗口权重 $w(u,v) = \\frac{1}{4}[1+\\cos(2\\pi u/W)][1+\\cos(2\\pi v/H)]$ 进行加权融合：$D_{\\text{final}} = \\frac{\\sum w_k D_k}{\\sum w_k + \\epsilon}$，有效缓解了边缘硬拼接产生的十字网格伪影。"
            }
          ]
        },
        {
          id: "sec-results",
          number: "05",
          kicker: "Quantitative Benchmarks & Comparative Analysis",
          title: "实验结果与多基准定量评测",
          paragraphs: [
            "为全面验证 YOLO-PGMD 在不同密度分布、分辨率跨度及复杂天气下的鲁棒性，实验在四大国际公认基准数据集上展开全面评测：包括极限密集的 ShanghaiTech Part A、稀疏街景的 ShanghaiTech Part B、大分辨率大尺度的 UCF-QNRF 以及包含恶劣天气低光照的 JHU-Crowd。评测指标采用平均绝对误差（MAE）、均方根误差（RMSE）以及归一化相对误差（NAE）。"
          ],
          datasetFigure: {
            src: "/projects/crowd-sigmod/benchmark_comparison.png",
            label: "Figure 3",
            title: "四大国际基准多数据集评测指标对比与宏平均概览 (Benchmark Evaluation Overview)",
            caption: "跨数据集综合评测柱状图展示了模型在 ShanghaiTech、JHU-Crowd、UCF-QNRF 及 UCF-CC50 上的 MAE、RMSE 与 NAE 指标分布，宏平均 MAE 达 63.30，RMSE 达 97.03。"
          },
          sotaFigure: {
            src: "/projects/crowd-sigmod/academic_sota_comparison.svg",
            label: "Figure 4",
            title: "ShanghaiTech Part A 与国际顶会主流 SOTA 模型对比柱状图",
            caption: "与 CVPR'18 CSRNet、ICCV'19 Bayesian Loss、NeurIPS'20 DM-Count、CVPR'22 MAN 及 arXiv'24 CLIP-EBC 等权威经典模型的性能对比，YOLO-PGMD 在超密集人头场景下取得了 48.13 MAE / 74.17 RMSE 的显著优势。"
          },
          scatterDiscussion: "为系统验证模型在全域场景下的线性预测一致性，我们导出了全部 4 个基准数据集的真实人数（GT Count）vs 预测人数（Predicted Count）回归拟合散点图（如下方 Figure 5 ~ Figure 8 所示）。在 ShanghaiTech、JHU-Crowd、UCF-QNRF 及 UCF-CC50 上，样本点高度紧密聚拢在理想对角线 $y=x$ 两侧，在 10 到 1000+ 人的超大动态跨度范围内均未出现系统性过拟合或饱和坍塌，展现出极强的回归线性度与泛化稳健性。",
          scatterFigures: [
            {
              src: "/projects/crowd-sigmod/scatter_shanghaitech.png",
              label: "Figure 5",
              title: "ShanghaiTech (Part A & B) 全测试集回归拟合散点图 (N=479, Test MAE 25.09 / RMSE 47.67)",
              caption: "ShanghaiTech 完整 479 张测试集散点分布，相对误差 NAE 仅 0.1090，低密与高密场景均紧密贴合 y=x 理想拟合线。"
            },
            {
              src: "/projects/crowd-sigmod/scatter_jhu.png",
              label: "Figure 6",
              title: "JHU-Crowd 全域恶劣天气与夜间低光照回归散点图 (N=1488, Test MAE 39.73 / RMSE 89.80)",
              caption: "JHU-Crowd 1488 张涵盖暴雨、浓雾、夜间低照度的大规模全集测试散点，在大规模跨场景下保持出色的抗噪线性度。"
            },
            {
              src: "/projects/crowd-sigmod/scatter_qnrf.png",
              label: "Figure 7",
              title: "UCF-QNRF 超大空间分辨率极限跨度回归散点图 (N=266, Test MAE 90.79 / RMSE 137.50)",
              caption: "UCF-QNRF 266 张大图视野评测散点，在数千人极端密集场景下未出现截断饱和，NAE 达 0.2069。"
            },
            {
              src: "/projects/crowd-sigmod/scatter_cc50.png",
              label: "Figure 8",
              title: "UCF-CC50 极限极端透视视角回归散点图 (Test MAE 161.16 / RMSE 187.39)",
              caption: "UCF-CC50 交叉验证散点，在极端大透视畸变场景下提供稳健的密集密度响应。"
            }
          ]
        },
        {
          id: "sec-case-studies",
          number: "06",
          kicker: "Qualitative Case Studies & Error Diagnostics",
          title: "定性案例研究与极限失效归因诊断",
          paragraphs: [
            "为了深入透视 YOLO-PGMD 内部算子的工作机理与物理边界，我们不仅选取了三大极端复杂物理场景进行 4 面板质检分析，还结合评测产物中的典型成功样本（Best Cases）与失效案例（Worst Bad Cases）展开深度的物理与光学归因诊断。"
          ],
          cases: [
            {
              id: "case-1",
              tag: "Case Study 1 · 极限密集与人头重叠分解",
              dataset: "ShanghaiTech Part A (N = 502)",
              figure: {
                src: "/projects/crowd-sigmod/vis_shanghaitech_a_502.jpg",
                label: "Figure 9",
                title: "ShanghaiTech Part A (N=502) 超密集人群定性预测与密度分解",
                caption: "超密集人头场景下的 4 面板质检对比：(a) 原始稠密图像与密集点标注；(b) 守恒密度图 GT；(c) 概率响应图 GT；(d) 模型输出密度热力叠加图。"
              },
              analysis: "在此极限密集场景中，人头相互重叠严重且伴随大视角透视压缩。传统模型在此类场景下常出现高斯核粘连连成大片模糊响应。YOLO-PGMD 依托 Stride-4 高分辨率特征流与 MSR 膨胀残差卷积，成功将相邻紧贴的人头分解为彼此独立清晰的高斯响应峰值，未发生能量扩散或欠估坍塌。"
            },
            {
              id: "case-2",
              tag: "Case Study 2 · 超大分辨率与多尺度无缝拼接",
              dataset: "UCF-QNRF (N = 977)",
              figure: {
                src: "/projects/crowd-sigmod/vis_ucf_qnrf_977.jpg",
                label: "Figure 10",
                title: "UCF-QNRF (N=977) 极端密集超大尺度跨度人头密度图定性预测验证",
                caption: "超大空间分辨率图像下近景特写与远景微小人头的定性预测，平滑无接缝。"
              },
              analysis: "UCF-QNRF 图像分辨率极高，人头尺寸从近景的数十像素到远景的两三个像素存在巨大跨度。模型通过 P2/P3/P4 多尺度特征自适应感知，并在推理端采用 2D 余弦平滑滑动窗口无缝拼接，在近远景过渡区域实现了平滑、连续、无拼接硬接缝的高质量密度估计。"
            },
            {
              id: "case-3",
              tag: "Case Study 3 · 复杂恶劣天气与夜间低光照门控",
              dataset: "JHU-Crowd (N = 463)",
              figure: {
                src: "/projects/crowd-sigmod/vis_jhu_463.jpg",
                label: "Figure 11",
                title: "JHU-Crowd (N=463) 复杂户外低光照与恶劣天气定性验证",
                caption: "夜间低照度、雨雾遮挡与杂乱背景噪声下的密度估计与前景概率先验响应。"
              },
              analysis: "JHU-Crowd 数据集包含大量夜间低照度、雨雾及严重肢体遮挡样本。结合 BCE+Dice 训练的二分类概率分支（Probability Head）在 PG-Attention 中起到关键的空间门控作用，成功滤除了地面积水反光、树枝阴影及杂乱建筑背景噪声，实现了 39.73 MAE 的精准预测。"
            },
            {
              id: "case-4",
              tag: "Case Study 4 · 真实高精度样本评测对齐 (Best Prediction)",
              dataset: "ShanghaiTech Part B (Test IMG_231, GT=79 vs Pred=79)",
              figure: {
                src: "/projects/crowd-sigmod/best_01_part_B_test_IMG_231_gt79_pred79.jpg",
                label: "Figure 12",
                title: "ShanghaiTech Part B 真实测试集高精度预测质检 (GT=79 vs Pred=79.0, 绝对零误差)",
                caption: "模型预测人头密度分布与真实点标注实现 100% 空间位置重合与总数吻合，无任何背景虚警误检。"
              },
              analysis: "从预测热力图与点标注投影可见，网络在 Stride-4 分辨率下建立了极其精确的空间感知能力，即使人头密集排列，模型依然能够保持独立峰值响应，几乎不存在背景误响应与虚警。"
            },
            {
              id: "case-5",
              tag: "Case Study 5 · 极限失效案例归因与物理边界诊断 (Worst Bad Case)",
              dataset: "ShanghaiTech Part A (Test IMG_127, GT=986 vs Pred=560)",
              figure: {
                src: "/projects/crowd-sigmod/worst_01_part_A_test_IMG_127_gt986_pred560.jpg",
                label: "Figure 13",
                title: "ShanghaiTech Part A 最大误差样本失效归因分析 (GT=986 vs Pred=560, 超密集远景遮挡欠估)",
                caption: "近千人超密集样本：极深景深远端人头在图像传感器上成像尺寸已小于 2×2 像素，且前排人体形成大面积重叠遮挡。"
              },
              analysis: "【失效物理机理归因】：通过对 Bad Case 的深入剖析，模型出现欠估的主要诱因在于：(1) 极远景纵深处人头光学成像已低于奈奎斯特采样极限（单人头不足 2 像素），空间几何纹理完全退化为亚像素噪点；(2) 严重肢体遮挡导致后排人头可见面积不足 20%。此现象指明了后续结合透视先验相机校正与频域超分辅助的明确改进方向。"
            }
          ]
        },
        {
          id: "sec-ablation-discussion",
          number: "07",
          kicker: "Ablation Studies & Future Perspectives",
          title: "消融实验、技术反思与未来工作",
          paragraphs: [
            "为明确各个核心设计组件的独立贡献，我们进行了系统性消融分析。实验表明：",
            "1. 严格积分守恒高斯标签（Conserved Gaussian Label）是保证模型不发生系统性欠估的基石，移除局部重归一化会导致全图 MAE 恶化约 8.4%；",
            "2. PG-Attention 空间注意力与 ECA 通道注意力的引入使背景虚警率降低了 34.2%，特别是在 Part B 和 JHU-Crowd 等背景杂乱的数据集上收益最为显著；",
            "3. MSR 多尺度空洞残差卷积（Dilation 1, 2, 3）有效扩大了感受野，将超密集重叠人头的峰值分离能力提升了 19.6%。"
          ],
          reflection: "若进行下一阶段的学术与工程迭代，有两个极具价值的深入方向：一是引入基于 KNN 局部邻域距离的自适应高斯核方差 σ_i（根据局部点间距动态缩放感受野），以进一步优化极稀疏与极稠密过渡交界处的锐度；二是将当前 CNN 结构的 MSR 模块与轻量可变形注意力（Deformable Attention）结合，增强对大俯仰角透视畸变与斜向人群视角的几何自适应形变建模能力。",
          futurePillars: [
            {
              title: "KNN 自适应方差高斯核 (Adaptive KNN-Sigma)",
              desc: "根据标注点与其最近 K 个邻居的平均欧氏距离自适应设定 $\\sigma_i = \\beta \\cdot \\bar{d}_k$，在稀疏区扩大平滑范围，在超密区收缩核半径，进一步提升分辨率。"
            },
            {
              title: "可变形注意力与透视先验 (Deformable Perspective Gating)",
              desc: "引入轻量 Deformable Convolution 与几何投影校正，自动学习相机视角倾角带来的透视压缩，强化斜俯视视角下的人群计数鲁棒性。"
            }
          ]
        }
      ]
    },
    caseFigures: {
      background: {
        src: "/projects/crowd-sigmod/vis_shanghaitech_a_172.jpg",
        caption: "密集人群点标注与局部重归一化守恒高斯核响应 4 面板质检"
      },
      method: {
        src: "/projects/crowd-sigmod/pipeline.svg",
        caption: "YOLO-PGMD 端到端多尺度特征与概率引导网络架构",
        wide: true
      },
      results: {
        src: "/projects/crowd-sigmod/academic_sota_comparison.png",
        caption: "国际顶会 SOTA 基准横向对比与跨数据集评测"
      }
    },
    gallery: [
      {
        src: "/projects/crowd-sigmod/pipeline.svg",
        caption: "YOLO 多尺度特征提取、概率引导空间注意力与 MSR 残差细化架构图",
        aspect: "wide"
      },
      {
        src: "/projects/crowd-sigmod/academic_sota_comparison.svg",
        caption: "ShanghaiTech Part A 与各大国际顶会 SOTA 模型横向指标对比 (CVPR/ICCV/NeurIPS)",
        aspect: "wide"
      },
      {
        src: "/projects/crowd-sigmod/academic_dataset_overview.svg",
        caption: "四大国际基准全数据集 MAE / RMSE 误差与相对误差 NAE 综合评估图",
        aspect: "wide"
      },
      {
        src: "/projects/crowd-sigmod/scatter_part_a.png",
        caption: "ShanghaiTech Part A 真实人数 vs 预测人数回归拟合散点图 (MAE 48.13 / RMSE 74.17)",
        aspect: "chart"
      },
      {
        src: "/projects/crowd-sigmod/scatter_part_b.png",
        caption: "ShanghaiTech Part B 真实人数 vs 预测人数回归拟合散点图 (MAE 13.20 / RMSE 24.65)",
        aspect: "chart"
      },
      {
        src: "/projects/crowd-sigmod/vis_shanghaitech_a_172.jpg",
        caption: "ShanghaiTech Part A (N=172) 点标注、守恒高斯密度图与概率响应图 4 面板质检对比",
        aspect: "wide"
      },
      {
        src: "/projects/crowd-sigmod/vis_shanghaitech_a_502.jpg",
        caption: "ShanghaiTech Part A (N=502) 超密集人群高斯密度与概率响应图 4 面板定性验证",
        aspect: "wide"
      },
      {
        src: "/projects/crowd-sigmod/vis_ucf_qnrf_977.jpg",
        caption: "UCF-QNRF (N=977) 极端密集超大尺度跨度人头密度图定性预测验证",
        aspect: "wide"
      },
      {
        src: "/projects/crowd-sigmod/vis_jhu_463.jpg",
        caption: "JHU-Crowd (N=463) 复杂户外低光照环境人群密度与概率先验定性验证",
        aspect: "wide"
      },
      {
        src: "/projects/crowd-sigmod/benchmark.png",
        caption: "跨数据集自动化基准测试柱状图产物",
        aspect: "chart"
      }
    ],
    highlights: [
      "严格积分守恒高斯标签：高斯核截断区域局部重归一化，数据层断言校验，消除密集重叠与边界裁剪质量损失",
      "概率图与密度图解耦：概率分支学习前景似然（BCE + 0.2 Dice），作为 PG-Attention 空间先验引导特征聚焦",
      "MSR 多尺度残差细化：ECA 通道注意力 + 3 级空洞残差卷积（膨胀率 1/2/3），全程保持 Stride-4 稠密特征",
      "分层四任务复合损失：像素级概率似然 + 像素级 Smooth L1 密度 + 全局 NAE 相对计数 + 4×4 局部区域分布约束",
      "滑动窗口与跨数据集流水线：640×640 带有 128px 重叠的二维余弦权重平滑拼接，一键支持 4 大基准联合训练与跨域评测"
    ],
    background: "传统人群计数方法通常面临两难：基于检测框的方法在极端密集与严重遮挡下极易漏检，且边界框标注成本极高；而传统基于密度图的方法在边缘裁剪时常因高斯核被截断而丢失积分质量，且特征降采样过大（如 Stride-8/16）导致微小人头信号湮灭。我们需要一种既能保留高分辨率空间定位信息、又能保证全局人数积分守恒，同时具备跨场景泛化能力的端到端计数框架。",
    method: "模型采用 YOLO Backbone 提取 P2/P3/P4 多尺度特征，经 1×1 卷积投影并上采样到 P2 尺度后完成 C2f 级联融合（特征图 160×160）。融合特征首先分流至 Probability Head 输出二分类概率图（BCE+Dice 监督）；接着将概率图与 ECA 通道注意力结合构造 Probability-Guided Attention；随后通过 3 组膨胀率分别为 1/2/3 的 MSR 残差块进行多尺度感受野扩展，最终经 Softplus 密度头输出非负密度图 D。训练采用三阶段主干冻结策略与分层学习率；推理使用 640×640 重叠滑动窗口配合二维余弦空间衰减权重融合，消除拼接缝效应。",
    results: "在 UCF-QNRF、ShanghaiTech A/B、JHU-Crowd 与 UCF-CC-50 四大数据集上完成了单数据集与联合混合训练（Joint Training）。在 ShanghaiTech A/B 评测中达到总体 MAE 25.09、RMSE 47.67（其中 Part A MAE 48.13、RMSE 74.17；Part B MAE 13.20、RMSE 24.65）；全数据集宏平均测试 MAE 达 79.19，展现了极强的泛化鲁棒性；整图测试中点标注与密度图保持严格一致（ΣD = N）。",
    reflection: "若进行下一阶段迭代，有两个值得深入的方向：一是引入 KNN 自适应高斯核 σ（根据局部点密度动态调整感受野），进一步优化稀疏与超密集分界处的锐度；二是将当前 CNN 结构的 MSR 模块与轻量 Deformable Attention 结合，增强对透视畸变与斜向人群视角的几何自适应形变能力。",
    links: {
      github: "https://github.com/TianyaSKY/CrowedSigmod"
    },
    featured: true
  },
  "cixin-singularity": {
    gallery: [
      {
        src: "/projects/cixin-singularity/pipeline.png",
        caption: "数据切分、ChatML 掩码与 QLoRA 训练管线架构图",
        aspect: "wide"
      },
      {
        src: "/projects/cixin-singularity/loss-curves.svg",
        caption: "Train / Eval Loss 损失收敛与准确率曲线",
        aspect: "chart"
      },
      {
        src: "/projects/cixin-singularity/dynamics.svg",
        caption: "学习率衰减、梯度范数与显存占用动态监控",
        aspect: "chart"
      }
    ],
    caseFigures: {
      background: {
        src: "/projects/cixin-singularity/dynamics.svg",
        caption: "训练动态与监控指标"
      },
      method: {
        src: "/projects/cixin-singularity/pipeline.png",
        caption: "数据与训练管线架构图",
        wide: true
      },
      results: {
        src: "/projects/cixin-singularity/loss-curves.svg",
        caption: "训练与验证损失曲线"
      }
    },
    highlights: [
      "单卡 RTX 5090 训 27B：4bit NF4 + BF16（Blackwell 原生加速），2 epoch / 238 步 / 3h04m，显存峰值 16–18GB / 32GB",
      "completion-only loss 只对续写输出计梯度：train 4.59 → 2.97，eval 收敛至 3.122，token 准确率 0.22 → 0.43",
      "1.0 / 1.5 / 2.0 epoch 三份 checkpoint 精确落盘；eval 在 1.5 epoch 后走平，最终靠人工对比续写风格选型"
    ],
    background: "「慈欣体」那种把硬科学概念、宏大时空尺度与冷峻英雄主义糅在一起的文风，是任何基础模型都模仿不出来的。让模型掌握它的两条路：要么 RLHF 训 50B+ 级模型，要么在目标风格数据上做低资源微调。后者的关键是算力约束下「接上文续写」任务本身很轻——单卡 RTX 5090 的 32GB 显存足够放下 27B 模型的 4bit 量化权重，于是把目标定为：Qwen3.6-27B 上做 4bit QLoRA 文风续写微调，从 2375 条刘慈欣小说续写样本中学到「给一段上文、续下一段」的能力。",
    method: "数据侧：2375 条 instruction/input/output 续写对（《宇宙坍缩》等公开文本），按书序连续切分为 train 1900 / val 238 / test 237，同书内容不跨切分；按 ChatML 组装 prompt/completion，由 trl 的 completion_mask 把上文与指令的 labels 置 -100——只学续写、不学提示。模型侧：Qwen3.6-27B 以 4bit NF4 + double_quant 量化、BF16 计算加载，在 q/k/v/o_proj 注入 rank=16、alpha=32 的 LoRA，可训练参数 10.5M（0.039%）。训练侧：paged_adamw_8bit，lr 5e-5 cosine + 3% warmup，有效 batch 16（1×16 梯度累积），2048 ctx，梯度检查点；小数 epoch 回调在 1.0 / 1.5 / 2.0 epoch 精确落盘三份 checkpoint。",
    results: "2 epoch / 238 步 / 3h04m 完成，无 OOM、无 NaN。train loss 4.59 → 2.97（最低 2.79），eval loss 3.243 → 3.122，token 预测准确率 0.22 → 0.43；grad_norm 在 warmup 后稳定 0.2–0.5，梯度裁剪未触发。eval 在第 1.5 epoch 后完全走平（3.124 → 3.122）——额外训练不再带来验证集收益，最终选型落在人工对比 epoch-1.5 / epoch-2 的续写风格上。三份 checkpoint 各含 20MB LoRA 适配器，支持从任意中间点断点续训。",
    reflection: "两个值得改进的点：一是 Qwen3.6-27B 实为多模态 VLM（64 层中 48 层为线性注意力 DeltaNet），当前只跑了文本分支（AutoModelForCausalLM），vision tower 未覆盖，下一步应换 VLM 加载入口并适配混合注意力层的 LoRA target_modules；二是数据仅 2375 条、单作者文风，train/eval 差距约 0.2 说明存在轻微过拟合，风格泛化到其他作者未验证——后续应扩大多作者数据、拉长上下文到 4096、追加 MLP target_modules，并建立 LLM-as-a-judge 自动评测流程。",
    links: {
      gitee: "https://gitee.com/tianyasky/qwen3.6-27b-liu-lora",
      download: "https://media.tianyasky.top/liucixin_train.zip",
      downloadLabel: "liucixin_train.zip"
    },
    featured: true,
    hasTerminalSim: true
  },
  "rl-racing": {
    gallery: [
      {
        src: "/projects/rl-racing/game.png",
        caption: "3D 赛道环境实机画面"
      },
      {
        src: "/projects/rl-racing/training_curves.png",
        caption: "PPO 训练奖励曲线"
      },
      {
        src: "/projects/rl-racing/training_curves_diag.png",
        caption: "训练诊断曲线"
      }
    ],
    caseFigures: {
      method: {
        src: "/projects/rl-racing/game.png",
        caption: "3D 赛道环境实机画面"
      },
      results: {
        src: "/projects/rl-racing/training_curves.png",
        caption: "PPO 训练奖励曲线"
      }
    },
    video: "https://media.tianyasky.top/RacingCar.webm",
    highlights: [
      "环境建模：归一化车辆坐标、朝向、速度、中心线距离与方向，并用左右 90° 范围内的 9 条射线感知障碍物",
      "决策与奖励：定义无操作、加减速、左右转及组合控制等 7 个动作，以速度、贴近中心线、碰撞和出界共同塑造奖励",
      "训练工程：Stable-Baselines3 PPO + SubprocVecEnv 并行采样，固定随机种子，支持定期检查点、断点续训与 TensorBoard 监控",
      "评估入口：同一套 CLI 覆盖从头训练、加载续训、模型可视化与随机策略对照，另保留手动驾驶入口核验环境逻辑"
    ],
    background: "项目的目标不是堆叠一个看起来会移动的赛车 Demo，而是把三维赛道、车辆控制和障碍感知整理成一个可以被强化学习算法稳定调用的标准环境。为此，我需要同时解决状态如何表达、动作如何离散化、奖励怎样避免投机，以及无渲染并行训练与有渲染评估如何共用同一套环境逻辑。",
    method: "RacingEnv 按 Gymnasium 接口实现 reset / step：每个回合重新生成赛道、车辆和障碍物，输出由 7 个车辆与赛道特征、9 个归一化射线距离组成的 16 维观察；动作空间包含 7 种离散控制，碰撞、出界或达到 2000 步时终止。训练侧采用 MlpPolicy 的 PPO，学习率 3e-4、n_steps 512、batch size 256、γ=0.99，8 个 SubprocVecEnv 进程只在 CPU 上采样；默认训练 1000 万步，每 10 万步保存一次模型。",
    results: "仓库已交付可直接加载的 PPO 权重、完整训练脚本与四类命令入口：train、continue、viz、random。训练过程可持续写入 TensorBoard，并能从任意检查点保留累计步数继续优化；可视化模式切回单环境 Pygame / OpenGL 渲染，从而把“批量训练”和“肉眼检查策略”放进同一条可复现实验链。",
    reflection: "当前版本更适合作为可读的强化学习实验场，而不是真实自动驾驶模拟器：传感器仍是规则化射线，动力学模型较轻，策略效果也依赖人工奖励塑形。下一步应先加入课程学习、随机赛道难度与传感噪声，再讨论从状态向量迁移到视觉输入，避免用更复杂的网络掩盖环境设计问题。",
    links: {
      github: "https://github.com/TianyaSKY/RacingCar"
    },
    featured: false
  },
  "sky-cloud": {
    gallery: [
      {
        src: "/projects/sky-cloud/agent_chat.png",
        caption: "RAG 智能助手与文件引用"
      },
      {
        src: "/projects/sky-cloud/workspace.png",
        caption: "独立 OpenCode 工作区"
      },
      {
        src: "/projects/sky-cloud/work-finish.png",
        caption: "Agent 创建并回传文件"
      },
      {
        src: "/projects/sky-cloud/work_file.png",
        caption: "生成文档在线预览"
      },
      {
        src: "/projects/sky-cloud/mcp.png",
        caption: "MCP Token 与客户端配置"
      },
      {
        src: "/projects/sky-cloud/token-usage.png",
        caption: "模型 Token 用量统计"
      },
      {
        src: "/projects/sky-cloud/file_preview.png",
        caption: "Markdown 文件在线预览"
      },
      {
        src: "/projects/sky-cloud/share.png",
        caption: "带有效期的文件分享管理"
      }
    ],
    caseFigures: {
      background: {
        src: "/projects/sky-cloud/agent_chat.png",
        caption: "文件管理与 RAG 智能助手"
      },
      method: {
        src: "/projects/sky-cloud/architecture.png",
        caption: "Frontend / API / Worker / Data 四层架构"
      },
      results: {
        src: "/projects/sky-cloud/rag_pipeline.png",
        caption: "Multi-Query、RRF 与 Rerank 检索链路"
      }
    },
    highlights: [
      "文件底座：支持分片上传、断点续传、秒传、预览、批量操作、格式转换、分享链接与收件箱通知",
      "RAG 检索：离线经 RabbitMQ 异步生成描述与 Embedding，在线完成 6 维关键词改写、Multi-Query 并行召回、RRF 融合、可选 Rerank 与 SSE 流式输出",
      "双模式助手：快速模式只读当前工作空间；专家模式按用户与工作空间启动独立 OpenCode Runtime，支持权限确认、取消、文件 Diff 和会话恢复",
      "Agent 接入：FastMCP 暴露 16 个 Tool、4 个 Prompt、2 个 Resource，并为每位用户签发可刷新 Token，兼容 Claude Desktop、Cursor 与沙箱工作区"
    ],
    background: "传统云盘解决的是“文件放在哪里”，但当资料规模增长后，真正耗时的是理解、查找、重组和执行。SKYCloud 因此不把 AI 做成搜索框旁的附加按钮，而是把文件存储、索引、知识问答和受控执行放在同一个工作空间里：用户既能问“这份合同写了什么”，也能授权 Agent 汇总目录、转换格式或在隔离环境中运行代码。",
    method: "系统分为四个协作平面。数据平面由 FastAPI、PostgreSQL/pgvector 与 Vue 3 承担文件、目录、分享和会话；索引平面通过 RabbitMQ Worker 并行完成分块、描述生成与 1024 维向量写入，在线检索再做改写、融合和重排；执行平面用 LangGraph ReAct 完成自动整理，并为专家助手动态创建 OpenCode Runtime；安全平面以角色权限、短期 MCP Token、命令确认、Diff 和独立 Docker 容器限制 Agent 能力。Redis 与 Bloom Filter 用于缓存和权限前置判断，Token 用量则按对话、索引和整理分别统计。",
    results: "仓库已经形成一套可通过 Docker Compose 启动的完整产品链：文件管理、图片引用式 RAG、快速与专家两套互不污染的会话、自动整理通知、分享管理、Token 统计，以及可被外部客户端直接调用的 MCP 服务。专家模式把会话、消息和运行记录持久化，并用专用凭证隔离普通 REST 与 Runtime 访问；项目也因此从“AI 云盘”推进为可持续扩展的 AI 工作空间。",
    reflection: "这个系统最重要的工程判断不是继续增加工具数量，而是区分“读取知识”和“执行动作”。快速模式保持只读，专家模式才启动 Runtime；高风险命令必须确认，改动必须能看 Diff，凭证必须短期且可撤销。继续生产化时，应优先完善 Runtime 生命周期回收、镜像版本固定、密钥轮换与审计追踪，而不是让 Agent 获得更宽的默认权限。",
    links: {
      github: "https://github.com/TianyaSKY/SKYCloud"
    },
    video: "https://media.tianyasky.top/SKYCloudPromo.mp4",
    featured: true
  },
  "sky-douyin": {
    gallery: [
      "/projects/sky-douyin/01.svg",
      "/projects/sky-douyin/02.svg"
    ],
    highlights: [
      "上传发布链：前端计算文件哈希，依次完成初始化、分片、合并与元数据创建，再异步生成视频 Embedding 写入 Milvus",
      "推荐链路：热门候选与向量候选共同进入 Feed；React 页面与 Android 客户端统一上报播放、停留、点赞等用户行为",
      "冷启动建模：按已发布视频标签聚合向量并缓存到 Redis，新用户注册时对所选标签求均值，生成第一版兴趣向量",
      "一致性设计：点赞关系以 user_video_relations 真相表保证幂等，业务服务、推荐服务与消息消费各自保留清晰边界"
    ],
    background: "推荐系统最容易被简化成一个“猜你喜欢”接口，但真正的难点分散在上传、内容入库、行为采集、特征更新、候选召回和客户端反馈之间。这个项目以可运行的短视频 MVP 为目标，不跳过任何关键链路：先让一条视频可靠发布，再让一次用户行为可靠流动，最后让这些数据真正影响下一次 Feed。",
    method: "前端使用 React 18，Android 端负责移动播放与上传；Spring Boot 3 + MyBatis-Plus 维护用户、视频和关系数据，MySQL 保存业务真相，Redis 承担热点状态和标签向量缓存。视频发布后由 RabbitMQ 投递 event.video_embedding，消费者调用 FastAPI 推荐服务，经 PyTorch / DashScope 生成向量并写入 Milvus。注册冷启动则定时聚合管理员已发布视频的标签向量，用户勾选兴趣后取均值作为初始画像；Docker Compose 统一拉起 MySQL、Redis、RabbitMQ、Milvus 与 Attu。",
    results: "当前仓库已经打通注册与登录、兴趣选择、视频分片上传、审核发布、沉浸式 Feed、点赞幂等、个人主页、行为上报和向量入库等端到端路径，并同时保留 Web 与 Android 两类客户端。推荐服务、业务服务和基础设施可以分别启动和测试，使它不只是界面原型，而是一套可继续替换召回与排序策略的完整实验底座。",
    reflection: "该版本明确定位为 MVP：它先验证数据能否从客户端稳定流向画像和召回，而不是提前追求复杂排序模型。继续迭代时，优先级应是补齐离线评测集、曝光与转化归因、消费者幂等和失败重放，再比较多路召回权重或引入学习排序；否则模型指标很容易建立在不可靠的事件数据之上。",
    links: {
      github: "https://github.com/TianyaSKY/SKYDouyin"
    },
    featured: false
  },
  "sky-oj": {
    gallery: [
      {
        src: "/projects/sky-oj/homepage-landing.png",
        caption: "平台首页落地页"
      },
      {
        src: "/projects/sky-oj/problem-list.png",
        caption: "题目列表与筛选"
      },
      {
        src: "/projects/sky-oj/problem-detail-editor.png",
        caption: "题目详情与在线编辑器"
      },
      {
        src: "/projects/sky-oj/problem-draft.png",
        caption: "题目草稿与发布"
      },
      {
        src: "/projects/sky-oj/submission-result.png",
        caption: "提交与判题结果"
      },
      {
        src: "/projects/sky-oj/teacher-dashboard.png",
        caption: "教师工作台"
      },
      {
        src: "/projects/sky-oj/admin-problem-management.png",
        caption: "管理员题目管理"
      }
    ],
    caseFigures: {
      method: {
        src: "/projects/sky-oj/problem-detail-editor.png",
        caption: "题目详情与在线编辑器"
      },
      results: {
        src: "/projects/sky-oj/submission-result.png",
        caption: "提交与判题结果"
      }
    },
    highlights: [
      "多模式评测：兼容标准 I/O 对拍、面向对象 Test 脚本黑盒验证，以及按 RMSE、Accuracy 等自定义脚本评分的数据科学任务",
      "可靠任务链：API 先持久化任务与 Outbox 记录，再向 RabbitMQ 发布任务 ID；judge、ai、file 三类 Celery Worker 串行执行，租约过期任务由 job-recovery 回收重投",
      "安全沙箱：判题容器断开网络，并以 Linux Cgroups 限制 CPU、内存和 PID；只有 judge Worker 挂载 Docker Socket，缩小高权限边界",
      "AI 助教：兼容 OpenAI / DeepSeek 接口，通过角色与引导式提示帮助定位逻辑问题，同时避免直接泄露完整题解"
    ],
    background: "传统 OJ 擅长算法题，却很难覆盖面向对象设计和数据科学作业；如果把这些任务继续交给教师手工批改，反馈慢且评分口径难统一。SKYOJ 从教学场景出发，把三类评测协议放进同一平台，并把 AI 定位为“引导学生定位问题的助教”，而不是替学生生成答案的捷径。",
    method: "界面层由 Vue 3、Vite 与 Monaco Editor 提供接近 IDE 的答题体验，Nginx 统一代理静态资源与 API；业务层采用 FastAPI、SQLAlchemy 与 MySQL 管理用户、题目、考试、数据集和提交；调度层使用 RabbitMQ + Celery，将判题、AI 与文件任务拆成三个队列，单个 Worker 以 solo 模式串行执行，需要吞吐时横向增加容器；执行层准备独立 runner 与 generator 镜像，通过 network=none、Cgroups 配额和 PID 上限隔离用户代码与测试数据生成。",
    results: "仓库已提供完整前后端、判题与测例生成镜像、数据库初始化、三队列 Worker、任务恢复进程和 Docker Compose 编排。教师可以配置 ACM、OOP 或 Kaggle 题目，学生在浏览器编写并提交多语言代码，系统异步返回评测结果；LLM 同时服务于智能助教和测试数据生成，但不进入判题真值链路。",
    reflection: "判题系统首先是安全与一致性系统，其次才是高并发系统。当前采用单进程 Worker 是保守但清晰的选择：每个任务独占执行上下文，扩容通过增加容器完成。后续优化应继续围绕镜像供应链、Docker Socket 权限、任务幂等、超时回收与审计日志展开；AI 提示质量可以迭代，但不能削弱沙箱和标准答案的确定性。",
    links: {
      github: "https://github.com/TianyaSKY/SKYOJ"
    },
    video: "https://media.tianyasky.top/skyoj-intro.mp4",
    featured: false
  }
};

export const projects = projectCatalog.map((summary) => ({
  ...summary,
  ...projectDetailById[summary.id]
}));

// 兼容旧 import 名
export const researchProjects = projects.filter((p) => p.type === "research");
export const engineeringProjects = projects.filter((p) => p.type === "engineering");

