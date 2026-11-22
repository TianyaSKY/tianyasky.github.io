export const crowdSigmodDetail = {
  paperInfo: {
    titleEn: "YOLO-PGMD: Probabilistic-Guided Multi-Scale Feature Fusion with Conserved Density Estimation for Crowd Counting",
    keywordsEn: [
      "Crowd Counting",
      "Probability-Guided Attention",
      "Conserved Density Map",
      "Multi-Scale Residual (MSR)",
      "Deep Learning",
      "Computer Vision"
    ],
    abstractEn: "Severe occlusion, extreme scale variation, and perspective distortion in dense crowd scenes degrade both bounding-box detectors and low-resolution density regressors. We present YOLO-PGMD, an end-to-end probabilistic-guided multi-scale density estimation network built on YOLO hierarchical representations. Conventional Gaussian label generation truncates kernel mass at image borders, causing systematic under-counting (ΣD < N); we apply localized re-normalization over each kernel's in-frame support so the discrete density integral equals the annotated head count (ΣD = N). Architecturally, YOLO-PGMD projects P2, P3, and P4 backbone features to 64 channels and aligns them on the Stride-4 (160×160) grid via C2f fusion. A decoupled probability branch supervised by binary cross-entropy (BCE) and Dice losses estimates foreground head likelihood, which combines with Efficient Channel Attention (ECA) to form a spatial gating mask before three Multi-Scale Residual (MSR) blocks (parallel dilation rates 1, 2, and 3) and a long residual shortcut. The network is optimized with a four-term loss combining foreground probability (BCE + 0.2 Dice), 1.5-power count-normalized density error, global relative count error, and 4×4 local grid consistency, paired with 640×640 2D-cosine-blended tiled inference. Across ShanghaiTech A/B, UCF-QNRF, JHU-Crowd, and UCF-CC-50, YOLO-PGMD achieves 48.13 MAE / 74.17 RMSE on ShanghaiTech Part A, 13.20 MAE on Part B, and 39.73 MAE on JHU-Crowd."
  },
  benchmarkTable: {
    caption: "Table 1: Quantitative evaluation of YOLO-PGMD across four public crowd-counting benchmarks",
    columns: [
      "Dataset",
      "Test N",
      "MAE ↓",
      "RMSE ↓",
      "NAE ↓",
      "Characteristics & Observations"
    ],
    rows: [
      {
        dataset: "UCF-QNRF",
        testN: 266,
        mae: "90.79",
        rmse: "137.50",
        nae: "0.2069",
        comment: "Stable MAE and RMSE across high-resolution scenes with wide head-scale spans",
        highlight: false
      },
      {
        dataset: "ShanghaiTech A",
        testN: 163,
        mae: "48.13",
        rmse: "74.17",
        nae: "0.1430",
        comment: "Primary dense-crowd benchmark; outperforms CSRNet, Bayesian Loss, DM-Count, and MAN",
        highlight: true
      },
      {
        dataset: "ShanghaiTech B",
        testN: 316,
        mae: "13.20",
        rmse: "24.65",
        nae: "0.0910",
        comment: "Low relative error (NAE 0.091) with minimal false positives in sparser street scenes",
        highlight: false
      },
      {
        dataset: "ShanghaiTech A+B",
        testN: 479,
        mae: "25.09",
        rmse: "47.67",
        nae: "0.1090",
        comment: "Combined evaluation across both dense and sparse ShanghaiTech splits",
        highlight: false
      },
      {
        dataset: "JHU-Crowd",
        testN: 1488,
        mae: "39.73",
        rmse: "89.80",
        nae: "0.3118",
        comment: "39.73 MAE across 1,488 test images including rain, fog, and nighttime illumination",
        highlight: false
      },
      {
        dataset: "UCF-CC50 fold0",
        testN: 6,
        mae: "161.16",
        rmse: "187.39",
        nae: "0.2908",
        comment: "Small-sample fold (N=6) under extreme crowd density and perspective distortion",
        highlight: false
      },
      {
        dataset: "Macro Average",
        testN: "—",
        mae: "79.19",
        rmse: "115.59",
        nae: "—",
        comment: "Unweighted macro average across evaluated benchmark splits",
        highlight: false,
        isSummary: true
      }
    ],
    footnote: "Note: ↓ indicates lower is better; ShanghaiTech Part A is the primary dense-crowd benchmark; Macro Average reports the unweighted mean across splits."
  },
  sotaTable: {
    caption: "Table 2: Cross-benchmark comparison with published crowd-counting models (MAE / RMSE ↓)",
    columns: [
      "Model",
      "ShanghaiTech A",
      "ShanghaiTech B",
      "UCF-QNRF",
      "JHU++",
      "UCF-CC50",
      "Venue"
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
    ],
    footnote: "Reference baselines include CSRNet (CVPR'18), Bayesian Loss (ICCV'19), DM-Count (NeurIPS'20), MAN (CVPR'22), PANet, and CLIP-EBC (arXiv'24)."
  },
  paperArticle: {
    sections: [
      {
        id: "sec-intro",
        number: "01",
        kicker: "Introduction & Problem Formulation",
        title: "Introduction & Motivation",
        paragraphs: [
          "Crowd density estimation and counting support public safety monitoring, transit hub capacity analysis, and large-event management. In real-world surveillance footage, crowds exhibit severe limb occlusion, strong perspective scale variation from foreground to background, and shifting illumination, alongside visual distractors such as foliage and building reflections.",
          "Existing approaches follow either object detection or density-map regression. Detection-based methods work well in sparse scenes, but in densely packed crowds adjacent heads overlap heavily and are frequently suppressed as redundant boxes during Non-Maximum Suppression (NMS). Conventional density-map regressors avoid box suppression but typically downsample feature maps to Stride-8 or Stride-16, attenuating far-field heads that occupy only a few pixels.",
          "A further source of systematic bias is Gaussian boundary truncation: when a discrete 2D Gaussian kernel is clipped at an image or crop border, the truncated mass is lost, leaving the integrated density strictly smaller than the annotated head count ($\\sum D < N$). To address these issues, YOLO-PGMD fuses shallow and mid-level YOLO features on a high-resolution Stride-4 ($160 \\times 160$) grid, uses a decoupled foreground probability branch to gate spatial attention, and enforces mass conservation during label generation."
        ],
        contributions: [
          "Mass-Conserved Gaussian Label Generation: Applies localized re-normalization over each kernel's in-frame support to eliminate boundary truncation loss and guarantee $\\sum D = N$.",
          "Decoupled Foreground Probability Gating: Trains a dedicated probability head with joint BCE and Dice supervision to capture head region contours and gate backbone features against background clutter.",
          "Stride-4 Multi-Scale Stream with MSR Refinement: Fuses P2, P3, and P4 features at $160 \\times 160$ resolution and expands the receptive field via three Multi-Scale Residual blocks with dilation rates 1, 2, and 3.",
          "Hierarchical Compound Loss and Cosine-Tiled Inference: Optimizes pixel probability, power-normalized pixel density, global relative count, and $4 \\times 4$ grid consistency, achieving 48.13 MAE / 74.17 RMSE on ShanghaiTech Part A and 39.73 MAE on JHU-Crowd."
        ]
      },
      {
        id: "sec-theory",
        number: "02",
        kicker: "Theoretical Grounding & Mass Conservation",
        title: "Theoretical Formulation: Mass-Conserved Gaussian Density Labels",
        paragraphs: [
          "In density-map regression, ground-truth maps are constructed by convolving discrete head annotations $P = \\{p_i = (x_i, y_i)\\}_{i=1}^N$ with a 2D Gaussian kernel $G_\\sigma$. In continuous space, $\\iint_{\\mathbb{R}^2} G_\\sigma(x, y)\\,dx\\,dy = 1$. On a finite image grid $\\Omega = [0, W) \\times [0, H)$, however, any annotation $p_i$ near the image boundary has part of its kernel support clipped outside $\\Omega$.",
          "Direct truncation leaves the in-frame discrete sum strictly below unity ($\\sum_{p \\in \\Omega} G_\\sigma(p - p_i) < 1$), so the total integrated mass underestimates the true count ($\\sum_{p \\in \\Omega} D(p) < N$). When dense crowds extend across image borders or training crops, this truncation introduces a systematic negative bias. We eliminate this bias by computing each point's active in-frame mass and re-normalizing locally so every annotated head contributes exactly 1 to the density integral."
        ],
        math: {
          title: "Localized Re-normalization Operator",
          formula: "D(p) = \\sum_{i=1}^N \\frac{G_\\sigma(p - p_i)}{\\sum_{q \\in \\Omega} G_\\sigma(q - p_i)}, \\quad \\text{where} \\quad \\sum_{p \\in \\Omega} D(p) \\equiv N",
          explanation: "For each annotated point $p_i$, we evaluate the truncated Gaussian sum $S_i = \\sum_{q \\in \\Omega_i} G_\\sigma(q - p_i)$ over its valid in-frame window $\\Omega_i = \\Omega \\cap [x_i-3\\sigma, x_i+3\\sigma] \\times [y_i-3\\sigma, y_i+3\\sigma]$ and normalize the local kernel response by $S_i$. Every annotation therefore contributes a net mass of 1 regardless of its proximity to the image border."
        },
        figure: {
          src: "/projects/crowd-sigmod/vis_shanghaitech_a_172.jpg",
          label: "Figure 1",
          title: "Four-Panel Verification of Mass-Conserved Gaussian Labels and Foreground Probability Masks (ShanghaiTech Part A, N=172)",
          caption: "Left to right: (a) cropped image with discrete point annotations (red dots, N=172); (b) locally re-normalized mass-conserved Gaussian density ground truth (integral exactly 172.00); (c) foreground head probability mask (supervised by BCE + Dice); (d) ground-truth density heatmap overlay.",
          analysis: "Multiple heads along the crop borders are partially truncated by the frame boundary. Unnormalized Gaussian rendering loses approximately 4.8% of the total mass on this crop (integrating to ~163.7), whereas localized re-normalization with dataset assertion checks (assert |ΣD - N| < 1e-4) preserves the exact target count."
        }
      },
      {
        id: "sec-method",
        number: "03",
        kicker: "Network Architecture & Methodology",
        title: "Network Architecture: Hierarchical Feature Fusion & Probability-Guided Attention",
        paragraphs: [
          "YOLO-PGMD is a feed-forward fully convolutional network. To handle perspective scale changes from near-field to far-field heads, the model extracts multi-scale features from stages P2 (stride 4), P3 (stride 8), and P4 (stride 16) of a YOLO backbone.",
          "The multi-scale fusion module projects P2, P3, and P4 to 64 channels each via $1 \\times 1$ convolutions and bilinearly upsamples P3 and P4 to match the P2 Stride-4 grid ($160 \\times 160$). Concatenating the three branches followed by a $1 \\times 1$ projection and a C2f residual block yields the fused representation $F \\in \\mathbb{R}^{B \\times 128 \\times 160 \\times 160}$."
        ],
        figure: {
          src: "/projects/crowd-sigmod/pipeline.png",
          label: "Figure 2",
          title: "YOLO-PGMD End-to-End Multi-Scale Feature Extraction, PG-Attention, and MSR Refinement Pipeline",
          caption: "From a 640×640 input, YOLO extracts P2/P3/P4 features and fuses them at Stride-4 (160×160). The foreground probability map $P$ gates spatial features after ECA channel weighting; three MSR blocks with parallel dilation rates 1/2/3 refine the representation. Combined with a long residual shortcut from the fused features, a Softplus head outputs a non-negative density map $D$ whose spatial sum yields the estimated count.",
          wide: true
        },
        subsections: [
          {
            title: "3.1 Decoupled Probability Head",
            content: "We separate foreground head detection from density magnitude regression. The probability head comprises two lightweight convolutional layers with Sigmoid activation, producing a $160 \\times 160$ foreground likelihood map $P \\in [0,1]^{H \\times W}$. Joint supervision with binary cross-entropy (BCE) and Dice losses trains this branch to delineate head regions before density regression."
          },
          {
            title: "3.2 Probability-Guided Spatial and Channel Attention (PG-Attention & ECA)",
            content: "Efficient Channel Attention (ECA) first reweights the fused features $F$ to produce $F_{\\mathrm{ca}}$. Channel-wise average and max projections of $F_{\\mathrm{ca}}$ are concatenated with the probability map $P$ and passed through a $7 \\times 7$ convolution with Sigmoid activation to form the spatial mask $M_s$. The gated output is $F_{\\mathrm{att}} = F_{\\mathrm{ca}} \\odot (1 + \\alpha M_s)$, where the learnable scalar $\\alpha$ is initialized to 0 so spatial gating starts as an identity pass-through."
          },
          {
            title: "3.3 Multi-Scale Residual Dilated Refinement (MSR)",
            content: "Three MSR blocks follow the attention module. Each block applies parallel $3 \\times 3$ convolutions with dilation rates 1, 2, and 3, concatenates and projects the three outputs, and adds a residual connection at the $160 \\times 160$ resolution. A learnable long residual shortcut also connects the initial fused features $F$ directly to the MSR output prior to the Softplus density head."
          }
        ]
      },
      {
        id: "sec-loss",
        number: "04",
        kicker: "Optimization & Inference Strategy",
        title: "Hierarchical Multi-Task Compound Loss & Cosine-Blended Tiled Inference",
        paragraphs: [
          "To jointly optimize the probability branch and the density regressor, we supervise the network across pixel likelihoods, pixel density magnitudes, $4 \\times 4$ local grid distributions, and global image counts through the compound objective $\\mathcal{L}_{\\text{total}}$."
        ],
        math: {
          title: "Hierarchical Multi-Task Compound Loss",
          formula: "\\mathcal{L}_{\\text{total}} = \\lambda_{\\text{prob}}\\mathcal{L}_{\\text{prob}} + \\lambda_{\\text{dense}}\\mathcal{L}_{\\text{dense}} + \\lambda_{\\text{cnt}}\\mathcal{L}_{\\text{cnt}} + \\lambda_{\\text{local}}\\mathcal{L}_{\\text{local}}",
          explanation: "Default loss weights are $\\lambda_{\\text{prob}}=1.0, \\lambda_{\\text{dense}}=1.0, \\lambda_{\\text{cnt}}=0.5, \\lambda_{\\text{local}}=0.25$. The four terms are: (1) Foreground probability loss $\\mathcal{L}_{\\text{prob}} = \\mathcal{L}_{\\text{BCE}}(P, P_{\\text{gt}}) + 0.2\\mathcal{L}_{\\text{Dice}}(P, P_{\\text{gt}})$, where the Dice term counteracts foreground-background class imbalance; (2) Count-normalized 1.5-power density loss $\\mathcal{L}_{\\text{dense}} = \\frac{1}{B}\\sum_{b=1}^B \\frac{s \\sum_{p \\in \\Omega} |D^{(b)}(p) - D_{\\text{gt}}^{(b)}(p)|^{1.5}}{N_{\\text{gt}}^{(b)} + 1}$ ($s=10.0$), which tempers gradients near zero to prevent all-zero background collapse; (3) Global relative count loss $\\mathcal{L}_{\\text{cnt}} = \\frac{1}{B}\\sum_{b=1}^B \\frac{|\\sum_{p \\in \\Omega} D^{(b)}(p) - N_{\\text{gt}}^{(b)}|}{N_{\\text{gt}}^{(b)} + 1}$; and (4) Local spatial consistency loss $\\mathcal{L}_{\\text{local}} = \\frac{1}{B}\\sum_{b=1}^B \\frac{1}{16}\\sum_{k=1}^{16} \\frac{|\\sum_{p \\in \\Omega_k} D^{(b)}(p) - \\sum_{p \\in \\Omega_k} D_{\\text{gt}}^{(b)}(p)|}{\\sum_{p \\in \\Omega_k} D_{\\text{gt}}^{(b)}(p) + 1}$ over a $4 \\times 4$ partition $\\{\\Omega_k\\}_{k=1}^{16}$ to constrain regional density drift."
        },
        trainingPillars: [
          {
            title: "Three-Stage Backbone Freeze Schedule",
            detail: "Epochs 0–15 freeze the YOLO backbone and BatchNorm statistics while warming up the new fusion, attention, and regression heads at a 5e-4 learning rate; Epochs 15–45 unfreeze upper backbone stages at a reduced learning rate; Epochs 45–100 unfreeze all layers for end-to-end fine-tuning without destabilizing pretrained weights."
          },
          {
            title: "Overlapping Tiled Inference with 2D Cosine Blending",
            detail: "For high-resolution test images, inference runs a 640×640 sliding window with a 128 px overlap (stride 512). Overlapping tiles are blended using a 2D cosine window $w(u,v) = \\frac{1}{4}[1+\\cos(2\\pi u/W)][1+\\cos(2\\pi v/H)]$ via $D_{\\text{final}} = \\frac{\\sum w_k D_k}{\\sum w_k + \\epsilon}$, eliminating seam artifacts across tile boundaries."
          }
        ]
      },
      {
        id: "sec-results",
        number: "05",
        kicker: "Quantitative Benchmarks & Comparative Analysis",
        title: "Quantitative Evaluation Across Four Public Benchmarks",
        paragraphs: [
          "We evaluate YOLO-PGMD across four standard crowd-counting benchmarks covering distinct density regimes, image resolutions, and environmental conditions: dense crowds in ShanghaiTech Part A, sparser street scenes in ShanghaiTech Part B, high-resolution wide-scale scenes in UCF-QNRF, and adverse weather / low-light conditions in JHU-Crowd, alongside exploratory cross-validation on UCF-CC-50. Metrics are Mean Absolute Error (MAE), Root Mean Square Error (RMSE), and Normalized Absolute Error (NAE)."
        ],
        datasetFigure: {
          src: "/projects/crowd-sigmod/benchmark_comparison.png",
          label: "Figure 3",
          title: "Cross-Benchmark Evaluation Metrics (MAE, RMSE, and NAE)",
          caption: "Comparison of MAE, RMSE, and NAE across ShanghaiTech, JHU-Crowd, UCF-QNRF, and UCF-CC50."
        },
        datasetOverview: {
          src: "/projects/crowd-sigmod/academic_dataset_overview.svg",
          label: "Figure 3b",
          title: "Dataset-Level Error Profile Across Four Public Benchmarks",
          caption: "MAE and RMSE reported side by side for every benchmark split, showing the error scale spanned by sparse street scenes and ultra-dense crowds.",
          wide: true
        },
        sotaFigure: {
          src: "/projects/crowd-sigmod/academic_sota_comparison.svg",
          label: "Figure 4",
          title: "ShanghaiTech Part A Comparison with Published Crowd-Counting Models",
          caption: "Comparison on ShanghaiTech Part A against CSRNet (CVPR'18), Bayesian Loss (ICCV'19), DM-Count (NeurIPS'20), MAN (CVPR'22), and CLIP-EBC (arXiv'24), where YOLO-PGMD reaches 48.13 MAE / 74.17 RMSE."
        },
        sotaTitle: "Cross-Benchmark Comparison with Published Models",
        sotaNarrative: "We compare YOLO-PGMD with six representative crowd-counting models published at CVPR, ICCV, and NeurIPS under the same benchmark splits. On dense ShanghaiTech Part A, YOLO-PGMD achieves 48.13 MAE / 74.17 RMSE, outperforming MAN (56.8 MAE, CVPR'22), DM-Count (59.7 MAE, NeurIPS'20), Bayesian Loss (62.8 MAE, ICCV'19), and CLIP-EBC (52.5 MAE, arXiv'24). On JHU-Crowd, which includes rain, fog, and nighttime scenes, it reaches 39.73 MAE / 89.80 RMSE.",
        scatterDiscussion: "To inspect prediction linearity across count magnitudes, Figures 5–8 plot predicted counts against ground-truth counts across the four benchmarks. Across ShanghaiTech, JHU-Crowd, UCF-QNRF, and UCF-CC50, predictions track the $y = x$ identity line from tens to thousands of people without high-density saturation.",
        scatterFigures: [
          {
            src: "/projects/crowd-sigmod/scatter_shanghaitech.png",
            label: "Figure 5",
            title: "ShanghaiTech (Part A & B) Test-Set Regression Scatter Plot (N=479, MAE 25.09 / RMSE 47.67)",
            caption: "Predicted vs. ground-truth counts across all 479 ShanghaiTech test images (NAE 0.1090), tracking the y=x reference line across both sparse and dense regimes."
          },
          {
            src: "/projects/crowd-sigmod/scatter_jhu.png",
            label: "Figure 6",
            title: "JHU-Crowd Adverse-Weather and Low-Light Regression Scatter Plot (N=1488, MAE 39.73 / RMSE 89.80)",
            caption: "Predicted vs. ground-truth counts across 1,488 JHU-Crowd test images spanning rain, fog, and nighttime illumination."
          },
          {
            src: "/projects/crowd-sigmod/scatter_qnrf.png",
            label: "Figure 7",
            title: "UCF-QNRF High-Resolution Wide-Scale Regression Scatter Plot (N=266, MAE 90.79 / RMSE 137.50)",
            caption: "Predicted vs. ground-truth counts across 266 high-resolution UCF-QNRF test images (NAE 0.2069) without saturation at thousand-person counts."
          },
          {
            src: "/projects/crowd-sigmod/scatter_cc50.png",
            label: "Figure 8",
            title: "UCF-CC50 Extreme-Density Fold Regression Scatter Plot (MAE 161.16 / RMSE 187.39)",
            caption: "Cross-validation scatter distribution on UCF-CC50 under severe perspective distortion."
          }
        ]
      },
      {
        id: "sec-case-studies",
        number: "06",
        kicker: "Qualitative Case Studies & Error Diagnostics",
        title: "Qualitative Case Studies & Failure-Mode Diagnostics",
        paragraphs: [
          "Beyond aggregate metrics, we inspect representative test cases covering severe head overlap, high-resolution tiled stitching, nighttime rain/fog gating, exact count alignment, and extreme far-field under-counting."
        ],
        cases: [
          {
            id: "case-1",
            tag: "Case Study 1 · Dense Head Overlap Separation",
            dataset: "ShanghaiTech Part A (N = 502)",
            figure: {
              src: "https://media.tianyasky.top/site/projects/crowd-sigmod/vis_shanghaitech_a_502.jpg",
              label: "Figure 9",
              title: "ShanghaiTech Part A (N=502) Dense Crowd Prediction and Peak Separation",
              caption: "Four-panel comparison in a 502-person scene: (a) input image with point annotations; (b) mass-conserved ground-truth density map; (c) ground-truth probability mask; (d) predicted density heatmap overlay."
            },
            analysis: "In this scene, heavy head overlap and perspective compression cause standard low-resolution regressors to merge adjacent heads into a single blurred blob. Operating at Stride-4 resolution with MSR dilated refinement keeps neighboring head responses resolved as distinct local peaks."
          },
          {
            id: "case-2",
            tag: "Case Study 2 · High-Resolution Multi-Scale Tiled Stitching",
            dataset: "UCF-QNRF (N = 977)",
            figure: {
              src: "https://media.tianyasky.top/site/projects/crowd-sigmod/vis_ucf_qnrf_977.jpg",
              label: "Figure 10",
              title: "UCF-QNRF (N=977) Wide-Scale Density Prediction with Cosine-Blended Tiling",
              caption: "Seamless density estimation across near-field large heads and far-field sub-pixel heads in a high-resolution UCF-QNRF frame."
            },
            analysis: "Head sizes in UCF-QNRF span from tens of pixels in the foreground to 2–3 pixels in the background. Multi-scale P2/P3/P4 fusion combined with 2D-cosine-weighted sliding-window blending produces continuous density transitions without tile boundary seams."
          },
          {
            id: "case-3",
            tag: "Case Study 3 · Adverse Weather and Nighttime Clutter Gating",
            dataset: "JHU-Crowd (N = 463)",
            figure: {
              src: "https://media.tianyasky.top/site/projects/crowd-sigmod/vis_jhu_463.jpg",
              label: "Figure 11",
              title: "JHU-Crowd (N=463) Nighttime Low-Light and Adverse-Weather Verification",
              caption: "Density estimation and foreground probability gating under low illumination, rain/fog occlusion, and reflective background clutter."
            },
            analysis: "In JHU-Crowd scenes with wet-pavement reflections, tree branches, and dark architectural clutter, the BCE+Dice-supervised probability branch gates out non-crowd background regions within PG-Attention, supporting the 39.73 MAE result on this benchmark."
          },
          {
            id: "case-4",
            tag: "Case Study 4 · Exact Count Alignment (Best Test Sample)",
            dataset: "ShanghaiTech Part B (Test IMG_231, GT=79 vs Pred=79.0)",
            figure: {
              src: "/projects/crowd-sigmod/best_01_part_B_test_IMG_231_gt79_pred79.jpg",
              label: "Figure 12",
              title: "ShanghaiTech Part B Test Sample Evaluation (GT=79 vs. Pred=79.0)",
              caption: "Predicted density peaks align spatially with ground-truth point annotations and integrate to 79.0 with zero background false alarms."
            },
            analysis: "On moderately dense street scenes, the predicted heatmap peaks coincide with individual head locations while background regions remain suppressed near zero."
          },
          {
            id: "case-5",
            tag: "Case Study 5 · Failure-Mode Attribution (Worst Test Sample)",
            dataset: "ShanghaiTech Part A (Test IMG_127, GT=986 vs Pred=560)",
            figure: {
              src: "/projects/crowd-sigmod/worst_01_part_A_test_IMG_127_gt986_pred560.jpg",
              label: "Figure 13",
              title: "ShanghaiTech Part A Largest-Error Sample Diagnosis (GT=986 vs. Pred=560)",
              caption: "Nearly 1,000-person scene where far-field heads fall below 2×2 pixels under severe foreground-to-background occlusion."
            },
            analysis: "Under-counting on this extreme sample stems from two physical factors: (1) heads in the deep background project to fewer than 2×2 pixels on the sensor, losing appearance texture even at Stride-4 resolution; and (2) severe front-row occlusion leaves only tiny fractions of rear heads visible. Incorporating camera perspective priors or geometry-adaptive kernel scales is a direct avenue to reduce far-field under-estimation."
          }
        ]
      }
    ]
  },
  caseFigures: {
    background: {
      src: "/projects/crowd-sigmod/vis_shanghaitech_a_172.jpg",
      label: "Figure 1",
      title: "Mass-Conserved Gaussian Labels & Probability Masks",
      caption: "Four-panel verification of point annotations, discrete density re-normalization (sum D = N), and foreground probability gating."
    },
    method: {
      src: "/projects/crowd-sigmod/pipeline.png",
      label: "Figure 2",
      title: "YOLO-PGMD Architecture & MSR Refinement",
      caption: "End-to-end multi-scale feature fusion (P2/P3/P4), probability-guided spatial attention, and Multi-Scale Residual (MSR) blocks.",
      wide: true,
      kind: "diagram"
    },
    results: {
      src: "https://media.tianyasky.top/site/projects/crowd-sigmod/academic_sota_comparison.png",
      label: "Figure 4",
      title: "Cross-Benchmark Comparison with Published Models",
      caption: "Quantitative evaluation on ShanghaiTech Part A against CSRNet, Bayesian Loss, DM-Count, MAN, and CLIP-EBC."
    }
  },
  highlights: [
    "**Mass-Conserved Gaussian Labels**: Locally re-normalizes truncated boundary kernels with dataset-level assertion checks ($\\sum D = N$) to eliminate border mass loss",
    "**Decoupled Probability & Density Heads**: Supervises a foreground likelihood branch with BCE + 0.2 Dice as a spatial gating prior inside PG-Attention",
    "**MSR Multi-Scale Residual Refinement**: Chains three residual blocks with parallel dilation rates 1, 2, and 3 after ECA channel weighting at Stride-4 ($160 \\times 160$) resolution",
    "**Four-Term Hierarchical Loss**: Combines pixel probability likelihood, 1.5-power count-normalized density error, global relative count error, and $4 \\times 4$ local grid consistency",
    "**Cosine-Blended Tiled Inference**: Uses $640 \\times 640$ sliding windows with 128 px overlap and 2D cosine weighting for seamless high-resolution evaluation across 4 benchmarks"
  ],
  background: "Crowd counting methods face a trade-off between detection and density regression: bounding-box detectors miss heavily overlapping heads during NMS and require costly box annotations, whereas standard Stride-8/16 density regressors lose fine spatial detail on 2–3 pixel far-field heads and suffer from Gaussian mass loss at image boundaries. We designed YOLO-PGMD to preserve Stride-4 spatial resolution, enforce exact label mass conservation ($\\sum D = N$), and suppress background false alarms across sparse and dense crowd regimes.",
  method: "YOLO extracts P2, P3, and P4 features, projects each to 64 channels via $1 \\times 1$ convolutions, and aligns them on the P2 grid ($160 \\times 160$) with C2f fusion. A dedicated probability head predicts foreground head likelihood to gate ECA-weighted features spatially. Three Multi-Scale Residual (MSR) blocks with parallel dilation rates 1, 2, and 3 refine the gated representation; combined with a long residual shortcut from the fused features, a Softplus head outputs a non-negative density map whose spatial sum gives the head count. Training uses staged backbone unfreezing, while inference blends overlapping $640 \\times 640$ tiles with a 2D cosine window.",
  results: "Evaluated across UCF-QNRF, ShanghaiTech A/B, JHU-Crowd, and UCF-CC-50, YOLO-PGMD achieves 48.13 MAE and 74.17 RMSE on dense ShanghaiTech Part A, 13.20 MAE on Part B, and 39.73 MAE on JHU-Crowd under adverse weather and low light. Mass-conserved labels maintain $\\sum D = N$ across training crops, while Stride-4 MSR features resolve closely packed heads and suppress background clutter.",
  reflection: "Two extensions are planned for future iterations: introducing nearest-neighbor geometry-adaptive Gaussian kernel variances so kernel bandwidths adjust automatically between sparse and ultra-dense regions, and incorporating camera perspective priors or deformable convolutions to reduce far-field under-counting under oblique surveillance angles.",
  links: {
    github: "https://github.com/TianyaSKY/CrowedSigmod"
  },
  featured: true
};

export default crowdSigmodDetail;
