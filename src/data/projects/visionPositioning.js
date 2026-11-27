const patchCnnFigure = {
  src: "/projects/vision-positioning/patch-cnn-architecture.svg",
  label: "Figure 2a",
  title: "SimpleCNN Convolutional Architecture and 9-Class Output",
  caption: "A 64×64 RGB image patch passes through three convolution-pooling blocks and two fully connected layers before a Softmax head outputs probabilities for eight physical corner classes and one background class.",
  aspect: "wide"
};

const landmarkFigure = {
  src: "/projects/vision-positioning/landmark-ids.svg",
  label: "Figure 2b",
  title: "Eight 3D Reference Landmarks on the Structured Pole",
  caption: "Upper-tier corners at z=8 are indexed 1, 3, 5, 7, and lower-tier corners at z=4 are indexed 0, 2, 4, 6. Class 8 denotes background clutter and does not map to a 3D anchor.",
  aspect: "chart"
};

export const visionPositioningDetail = {
  paperInfo: {
    titleEn: "Monocular Camera 3D Coordinate Reconstruction via Structured Pole Keypoint Cascaded Networks and Ray-Angle Invariant Optimization",
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
    abstractEn: "In coastal vessel operations, port yard inspection, and GPS-denied indoor or nearshore environments, satellite navigation suffers from multipath drift or dropout, planar fiducial markers (e.g., AprilTag/ArUco) degrade under salt-spray fouling, and standard Perspective-n-Point (PnP) solvers become ill-conditioned when reference landmarks lie along slender vertical poles. We present an end-to-end monocular 3D camera localization system combining a five-stage cascaded keypoint perception pipeline with ray-angle invariant nonlinear least-squares (NLLS) optimization. In the front-end perception module, a fine-tuned YOLO detector (POLES.pt) generates binary ROI masks that prune over 95% of background pixels; Harris corner detection extracts candidate vertices inside the mask; a three-block convolutional classifier (SimpleCNN) categorizes 64×64 local patches into 9 semantic classes (8 physical pole landmarks plus 1 background class) to establish automatic 2D–3D correspondences; and class-wise NMS followed by cornerSubPix refinement recovers sub-pixel keypoint coordinates. In the back-end geometric solver, back-projected camera rays enforce invariance between optical inter-ray angles and world-frame subtended angles, decoupling camera rotation from translation and reducing 6-DoF pose estimation to a well-conditioned 3-DoF camera center optimization. A multi-start initializer (combining the previous frame estimate, a coarse PnP solution, and the 3D landmark centroid) paired with dual Levenberg-Marquardt (LM) and Trust Region Reflective (TRF) solvers improves convergence across viewpoints. In simulation ablations, the full pipeline achieves a 1.10×10⁻⁵ m mean position error; removing CNN semantic classification raises the error to 5.380 m due to correspondence mismatches, and removing NMS raises it to 6.132 m. Deployed on a Jetson Orin edge module, the system runs at 26 FPS and achieves 10–15 cm RMSE localization accuracy in coastal field trials in Dalian."
  },
  benchmarkTable: {
    caption: "Table 1: Ablation study across perception stages and pose solvers (Ablation Benchmark)",
    columns: [
      "Variant",
      "ROI Mask",
      "CNN Classification",
      "NMS & Sub-Pixel",
      "Pose Solver",
      "Cand. / Final Pts",
      "Success Rate",
      "Mean Pos. Error ↓",
      "Error Std",
      "Mechanism & Diagnostic Notes"
    ],
    rows: [
      {
        cells: [
          { text: "Ours-Full (Complete Pipeline)", badge: "BEST", ours: true },
          "Enabled (YOLO Mask)",
          "Enabled (9-Class CNN)",
          "Enabled (NMS+Subpix)",
          "Ray-Angle NLLS (Vector)",
          "235.5 / 4.0",
          "100.0 %",
          { text: "1.10 × 10⁻⁵ m", className: "col-num val-mae" },
          "4.00 × 10⁻⁶ m",
          "Stable convergence; 4 detected corners map to their true 3D anchors with zero false alarms"
        ],
        highlight: true,
        isOurs: true
      },
      {
        cells: [
          { text: "Ablation-1 (w/o ROI Mask)" },
          "Disabled (Full Frame)",
          "Enabled (9-Class CNN)",
          "Enabled (NMS+Subpix)",
          "Ray-Angle NLLS (Vector)",
          "217.3 / 4.0",
          "100.0 %",
          { text: "1.20 × 10⁻⁵ m", className: "col-num" },
          "3.00 × 10⁻⁶ m",
          "Comparable accuracy on clean backgrounds, but higher candidate count and latency in cluttered scenes"
        ]
      },
      {
        cells: [
          { text: "Ablation-2 (w/o CNN Semantics)" },
          "Enabled (YOLO Mask)",
          "Disabled (Geometric Heuristic)",
          "Enabled (NMS+Subpix)",
          "Ray-Angle NLLS (Vector)",
          "235.5 / 17.5",
          "100.0 %",
          { text: "5.380 m", className: "col-num val-rmse" },
          "1.180 m",
          "Without semantic IDs, heuristic 2D–3D assignment mismatches landmarks and causes meter-scale drift"
        ]
      },
      {
        cells: [
          { text: "Ablation-3 (w/o Post-Processing)" },
          "Enabled (YOLO Mask)",
          "Enabled (9-Class CNN)",
          "Disabled (No NMS/Subpix)",
          "Ray-Angle NLLS (Vector)",
          "235.5 / 75.0",
          "100.0 %",
          { text: "6.132 m", className: "col-num val-rmse" },
          "0.528 m",
          "Unfiltered duplicate corner clusters distort the NLLS residual surface and pull the solver off target"
        ]
      },
      {
        cells: [
          { text: "Ablation-4 (Pure Harris Baseline)" },
          "Disabled (Full Frame)",
          "Disabled (Unclassified)",
          "Disabled (No Post-Proc)",
          "Ray-Angle NLLS (Vector)",
          "217.3 / 217.3",
          "100.0 %",
          { text: "5.655 m", className: "col-num val-rmse" },
          "1.919 m",
          "Raw unlabelled corner clouds without ROI gating or semantic filtering fail to constrain camera geometry"
        ]
      },
      {
        cells: [
          { text: "Traditional PnP (solvePnP Baseline)" },
          "Enabled (YOLO Mask)",
          "Enabled (9-Class CNN)",
          "Enabled (NMS+Subpix)",
          "Iterative PnP (solvePnP)",
          "235.5 / 4.0",
          "100.0 %",
          { text: "3.21 × 10⁻⁴ m", className: "col-num" },
          "2.34 × 10⁻⁴ m",
          "Converges with clean keypoints but exhibits higher sensitivity to near-collinear pole geometry than ray-angle NLLS"
        ]
      }
    ],
    footnote: "Note: ↓ indicates lower is better; evaluated on synthetic ground-truth benchmarks. Ablation-2 and Ablation-3 isolate the roles of CNN landmark identification and class-wise NMS in preventing geometric solver divergence."
  },
  sotaTable: {
    caption: "Table 2: Comparison of monocular pose estimation paradigms on slender / near-collinear structural landmarks",
    columns: [
      "Method",
      "Collinear Degeneracy Tolerance",
      "2D–3D Correspondence",
      "Computational Cost",
      "Noise Robustness",
      "Rotation / Translation Decoupling",
      "Reference"
    ],
    rows: [
      {
        cells: [
          { text: "EPnP (Lepetit et al.)" },
          "Low (Collinear / Coplanar Sensitivity)",
          "Requires explicit descriptor matching",
          "O(n) linear solver",
          "Moderate",
          "No (6-DoF coupled)",
          "IJCV 2009"
        ]
      },
      {
        cells: [
          { text: "UPnP (Kneip et al.)" },
          "Moderate (Polynomial stationary points)",
          "Requires explicit descriptor matching",
          "O(n) polynomial roots",
          "Moderate",
          "No (6-DoF coupled)",
          "ECCV 2014"
        ]
      },
      {
        cells: [
          { text: "SQPnP (Terzakis et al.)" },
          "Moderate (Sequential quadratic programming)",
          "Requires explicit descriptor matching",
          "O(n) quadratic convergence",
          "Good",
          "No (6-DoF coupled)",
          "ECCV 2020"
        ]
      },
      {
        cells: [
          { text: "AprilTag / ArUco Fiducials" },
          "Low (Planar flip ambiguity & fouling loss)",
          "Built-in binary barcode ID",
          "O(1) fast",
          "Weak under occlusion / salt fouling",
          "No (Planar homography)",
          "ICRA / IROS"
        ]
      },
      {
        cells: [
          { text: "PoseNet End-to-End Regression" },
          "Low (Scene-specific overfitting)",
          "Implicit end-to-end",
          "Single forward pass",
          "Weak under viewpoint shift",
          "No (Direct 7-DoF regression)",
          "ICCV 2015"
        ]
      },
      {
        cells: [
          { text: "Ours (Cascaded CNN + Ray-Angle NLLS)", isOurs: true },
          "High (Angle invariance avoids rotational singularity)",
          "Automatic via 9-class Patch CNN",
          "O(n²) small-scale NLLS",
          "High (Multi-start LM + TRF)",
          "Yes (3-DoF position decoupled from R)",
          "Ours"
        ],
        isOurs: true
      }
    ],
    footnote: "Comparison spans algebraic PnP solvers (EPnP, UPnP, SQPnP), planar fiducial markers, and end-to-end neural pose regression."
  },
  paperArticle: {
    sections: [
      {
        id: "sec-intro",
        number: "01",
        kicker: "Introduction & Problem Formulation",
        title: "Introduction & Motivation",
        paragraphs: [
          "In port terminals, bridge underpasses, indoor warehouses, and nearshore aquaculture zones, structural occlusion and multipath interference frequently degrade or block GPS signals. While 3D LiDAR and stereo rigs provide direct depth measurements, their cost, power budget, and optical maintenance under humid salt-fog conditions limit deployment on small vessels and inspection platforms. A calibrated monocular camera offers a low-cost, compact alternative when paired with known structural landmarks.",
          "Two practical obstacles arise when localizing from existing infrastructure in the field. First, common reference structures—such as mooring bollards, bridge piers, and cylindrical marker poles—are slender and nearly collinear; standard Perspective-n-Point (PnP) solvers (e.g., EPnP, UPnP) suffer from rotational ill-conditioning on near-collinear point sets, where small pixel perturbations induce large rotational ambiguities and meter-scale translation errors. Second, under variable outdoor lighting and textureless water or sky backgrounds, generic keypoint descriptors (SIFT, ORB) fail to match pole vertices reliably, while pasted planar fiducials (AprilTag, ArUco) weather and corrode rapidly.",
          "To address both problems, we built an end-to-end monocular localization system around fixed structural poles with surveyed 3D vertex coordinates. The front-end perception module runs a five-stage cascade—YOLO ROI masking, masked Harris corner extraction, 9-class local patch CNN classification, class-wise NMS, and sub-pixel gradient refinement—to establish 2D–3D correspondences without barcodes or manual labeling. The back-end solver enforces back-projected ray-angle conservation, formulating camera localization as a 3-DoF nonlinear least-squares (NLLS) problem over the camera center $C$ with multi-start LM and TRF optimization."
        ],
        contributions: [
          "Five-Stage Cascaded Landmark Perception: Combines YOLO ROI masking, Harris corner detection, and a 9-class Patch CNN (trained on 1,377 patch samples) with class-wise NMS and sub-pixel refinement to map 2D image corners to 3D pole landmarks automatically.",
          "Rotation-Decoupled Ray-Angle NLLS Formulation: Back-projects 2D keypoints into unit directional rays and matches inter-ray angles to 3D world subtended angles, decoupling the 3-DoF camera position $C$ from camera orientation $R$ to avoid collinear rotational degeneracy.",
          "Multi-Start Dual-Solver Optimization: Initializes parallel Levenberg-Marquardt (LM) and Trust Region Reflective (TRF) runs from the previous frame's position $C_{t-1}$, a coarse PnP estimate, and the 3D anchor centroid, selecting the minimum-residual solution.",
          "Embedded Deployment & Coastal Field Trials: Packaged into a PyQt5 + SQLite desktop inspection suite and deployed on a Jetson Orin edge device at 26 FPS, achieving 10–15 cm RMSE localization accuracy across 8 surveyed test stations in Dalian coastal waters (registered software copyright and selected for the Provincial Innovation Conference)."
        ]
      },
      {
        id: "sec-theory",
        number: "02",
        kicker: "Geometric Invariance & Ray-Angle Formulation",
        title: "Theoretical Formulation: Back-Projected Ray-Angle Conservation & NLLS Solver",
        paragraphs: [
          "Under the pinhole camera model with intrinsic matrix $K \\in \\mathbb{R}^{3 \\times 3}$, each detected sub-pixel keypoint $u_i = (u_i^*, v_i^*)^T$ with homogeneous coordinates $\\tilde{u}_i = [u_i^*, v_i^*, 1]^T$ defines a unit back-projected directional ray $r_i = K^{-1}\\tilde{u}_i / \\|K^{-1}\\tilde{u}_i\\| \\in \\mathbb{R}^3$ in the camera frame.",
          "For any pair of simultaneously observed landmarks $(u_i, u_j)$, the inter-ray angle $\\theta_{ij}$ in the camera frame is determined by their inner product. Because the Euclidean inner product is invariant under orthogonal transformations ($\\langle Rr_i, Rr_j \\rangle = \\langle r_i, r_j \\rangle$ for any $R \\in SO(3)$), the observed angle $\\theta_{ij}$ is independent of the camera's 3D rotation matrix $R$ and depends only on the camera optical center $C$.",
          "Let $P_i, P_j \\in \\mathbb{R}^3$ denote the known world coordinates of the two landmarks and $C = (X_c, Y_c, Z_c)^T$ denote the unknown camera optical center in the world frame. The world-frame line-of-sight vectors from $C$ to $P_i$ and $P_j$ are $v_i(C) = P_i - C$ and $v_j(C) = P_j - C$, subtending a physical angle $\\phi_{ij}(C)$ given by the normalized dot product of $v_i(C)$ and $v_j(C)$."
        ],
        math: {
          title: "Ray-Angle Invariance & Nonlinear Least-Squares Objective (Ray-Angle NLLS)",
          formula: "\\min_{C \\in \\mathbb{R}^3} \\mathcal{F}(C) = \\frac{1}{2} \\sum_{1 \\le i < j \\le N} \\left[ \\arccos\\left( \\frac{(P_i - C) \\cdot (P_j - C)}{\\|P_i - C\\| \\|P_j - C\\|} \\right) - \\arccos\\left( \\frac{K^{-1} \\tilde{u}_i \\cdot K^{-1} \\tilde{u}_j}{\\|K^{-1} \\tilde{u}_i\\| \\|K^{-1} \\tilde{u}_j\\|} \\right) \\right]^2",
          explanation: "Here $\\tilde{u}_i = [u_i^*, v_i^*, 1]^T$ is the homogeneous pixel coordinate of landmark $i$, $K$ is the camera intrinsic matrix, $P_i \\in \\mathbb{R}^3$ is the surveyed 3D world position of landmark $i$, and $C = (X_c, Y_c, Z_c)^T$ is the unknown camera optical center. Eliminating $R$ from the objective reduces the 6-DoF coupled pose problem to a 3-DoF position optimization over $\\binom{N}{2}$ pairwise angle residuals, avoiding the rotational singularities triggered by slender vertical poles."
        },
        figure: {
          src: "/projects/vision-positioning/ray-angle-geometry.svg",
          label: "Figure 1",
          title: "Geometric Consistency Between Back-Projected Image Rays and 3D World Line-of-Sight Vectors",
          caption: "Perspective geometry linking the camera optical center $C$, image-plane keypoints $u_1, u_2$ (with back-projected unit rays $r_1, r_2$ and inter-ray angle $\\theta_{12}$), and surveyed 3D world anchors $P_1, P_2$ (with line-of-sight vectors $v_1, v_2$ and subtended angle $\\phi_{12}$).",
          analysis: "Under noise-free projection, the camera-frame ray angle $\\theta_{12}$ equals the world-frame subtended angle $\\phi_{12}(C)$. Minimizing the sum of squared angle differences over all visible landmark pairs recovers the camera position $C$ without requiring an initial rotation estimate."
        }
      },
      {
        id: "sec-method",
        number: "03",
        kicker: "Cascaded Perception Pipeline & Landmark CNN",
        title: "Perception Architecture: Five-Stage Cascaded Detection & 9-Class Patch CNN",
        paragraphs: [
          "To extract physical pole vertices reliably against water reflections, sky gradients, and port clutter, the front-end perception module narrows the candidate set through five sequential stages: coarse pole bounding-box gating, masked Harris corner detection, local patch semantic classification, class-wise duplicate suppression, and sub-pixel gradient refinement."
        ],
        figure: {
          src: "/projects/vision-positioning/figure_overall_pipeline.svg",
          label: "Figure 2",
          title: "Five-Stage Cascaded Visual Perception and Multi-Start Ray-Angle NLLS Localization Pipeline",
          caption: "System architecture divided into front-end perception and back-end geometric localization: YOLO detects structural poles to generate a binary ROI mask; Harris corners are extracted inside the ROI and cropped into 64×64 RGB patches for 9-class SimpleCNN classification; confidence thresholding, class-wise NMS, and cornerSubPix refinement yield the final 2D–3D correspondences fed into the multi-start ray-angle NLLS optimizer.",
          wide: true
        },
        subsections: [
          {
            title: "3.1 YOLO Pole Detection & ROI Mask Gating",
            content: "A lightweight YOLO detector fine-tuned on structural poles (`POLES.pt`) predicts bounding boxes around visible poles and converts them into a binary ROI mask. This gating step discards over 95% of background pixels (sky, water surface, and distant structures) before corner extraction."
          },
          {
            title: "3.2 Mask-Constrained Harris Corner Extraction",
            content: "Harris corner detection runs exclusively inside the active ROI mask, evaluating the local gradient autocorrelation matrix $M_H(p)$ with response $R(p) = \\det(M_H) - 0.10\\,(\\operatorname{tr}(M_H))^2$ to capture high-curvature structural vertices at high recall."
          },
          {
            title: "3.3 Nine-Class Patch CNN Semantic Classifier (SimpleCNN)",
            content: "Centered on each Harris candidate, a $64 \\times 64$ RGB patch is cropped and fed into SimpleCNN, a three-stage convolutional classifier (conv-pool blocks with 16, 32, and 64 channels, ReLU activations, and $2 \\times 2$ MaxPooling followed by two fully connected layers). Output classes 0–7 identify the 8 surveyed 3D vertices on the structural pole (four lower-tier vertices at $z=4.0$ and four upper-tier vertices at $z=8.0$), while class 8 rejects non-landmark background corners.",
            figures: [patchCnnFigure, landmarkFigure]
          },
          {
            title: "3.4 Class-Wise Non-Maximum Suppression (Class-Wise NMS)",
            content: "Candidates predicted as background (`class = 8`) or falling below the confidence threshold ($\\tau_{\\text{conf}} = 0.85$) are discarded. Remaining candidates are grouped by semantic class ID (0–7), sorted by Harris corner response, and filtered with a suppression radius of $r_{\\text{nms}} = 25\\,\\text{px}$ so each physical landmark yields at most one detection per pole."
          },
          {
            title: "3.5 Sub-Pixel Gradient Orthogonal Refinement",
            content: "Retained keypoints are refined via OpenCV's `cornerSubPix` solver, which enforces orthogonality between local intensity gradients and vectors pointing to the true corner vertex, improving coordinate precision from integer pixels to sub-pixel accuracy before back-projection."
          }
        ]
      },
      {
        id: "sec-loss",
        number: "04",
        kicker: "Multi-Start Optimization & Industrial Desktop Suite",
        title: "Backend Optimization: Multi-Start Strategy, Dual Solvers & Inspection Workstation",
        paragraphs: [
          "Because the ray-angle residual objective $\\mathcal{F}(C)$ is non-convex under noisy observations or narrow baseline views, a single poor initial guess can trap gradient-based solvers in a local minimum. We pair a three-source multi-start initializer with parallel Levenberg-Marquardt (LM) and Trust Region Reflective (TRF) solvers."
        ],
        math: {
          title: "Multi-Start Initialization & Dual-Solver Selection Criterion",
          formula: "\\mathcal{S} = \\left\\{ C_{t-1}, \\; -R_{\\text{pnp}}^T t_{\\text{pnp}}, \\; \\frac{1}{N}\\sum_{i=1}^N P_i \\right\\}, \\quad C^* = \\arg\\min_{C \\in \\{\\text{LM}(s), \\text{TRF}(s) \\mid s \\in \\mathcal{S}\\}} \\|\\mathbf{r}(C)\\|^2",
          explanation: "The initial candidate pool $\\mathcal{S}$ combines the previous frame's camera center $C_{t-1}$ (temporal continuity), a coarse algebraic PnP estimate $-R_{\\text{pnp}}^T t_{\\text{pnp}}$, and the centroid of visible 3D landmarks. Both LM and TRF optimize the ray-angle residual vector $\\mathbf{r}(C)$ from each seed $s \\in \\mathcal{S}$, and the converged solution with the minimum squared residual norm $\\|\\mathbf{r}(C)\\|^2$ is selected as the current camera position $C^*$."
        },
        trainingPillars: [
          {
            title: "Multi-Candidate Initialization Pool",
            detail: "Combines three complementary priors: (1) the previous frame estimate $C_{t-1}$ for fast convergence during smooth motion; (2) a coarse solvePnP camera center $-R^T t$ to recover from sudden viewpoint jumps; and (3) the 3D landmark centroid $\\bar{P} = \\frac{1}{N}\\sum P_i$ as a cold-start fallback."
          },
          {
            title: "Dual LM / TRF Solver Verification & Fallback",
            detail: "Executes unconstrained Levenberg-Marquardt (fast quadratic convergence near the basin) alongside box-constrained Trust Region Reflective optimization. If all NLLS runs exceed the residual acceptance threshold, the system falls back to the coarse PnP estimate or temporal prediction to prevent trajectory spikes."
          },
          {
            title: "PyQt5 & SQLite Desktop Inspection Suite",
            detail: "Provides an interactive engineering workstation supporting live RTSP streams and local video files, SQLite camera intrinsic and 3D anchor management, stage-by-stage visual diagnostics (ROI masks, Harris candidates, CNN labels, NMS outputs), and real-time 3D trajectory plotting."
          }
        ]
      },
      {
        id: "sec-results",
        number: "05",
        kicker: "Quantitative Ablation Suite & Error Diagnostics",
        title: "Experimental Evaluation: Ablation Suite & Error Attribution",
        paragraphs: [
          "To quantify the contribution of each perception stage and compare the ray-angle NLLS solver against standard PnP, we evaluated six system variants across synthetic ground-truth benchmarks and field recordings: (1) Ours-Full; (2) Ablation-1 (w/o YOLO ROI mask); (3) Ablation-2 (w/o CNN semantic classification, using geometric heuristic ordering); (4) Ablation-3 (w/o class-wise NMS and sub-pixel refinement); (5) Ablation-4 (pure Harris corner baseline); and (6) Traditional PnP (`solvePnP` on the same refined keypoints)."
        ],
        datasetFigure: {
          src: "https://media.tianyasky.top/site/projects/vision-positioning/figure_ablation_grid.png",
          label: "Figure 3",
          title: "Qualitative Keypoint Detection and Classification Across Six Ablation Variants",
          caption: "Six-panel comparison showing Ours-Full, Ablation-1 (No Mask), Ablation-2 (No CNN), Ablation-3 (No Post-Processing), Ablation-4 (Pure Harris), and stage-wise failure attribution."
        },
        sotaFigure: {
          src: "/projects/vision-positioning/figure_ablation_statistics.png",
          label: "Figure 4",
          title: "Candidate Corner Counts vs. Final Retained Keypoints Across Ablation Variants",
          caption: "Bar chart illustrating how ROI masking and class-wise NMS compress raw Harris candidates (235.5 per frame) down to the 4 true pole vertices, whereas omitting post-processing leaves 75.0 redundant points that corrupt the geometric residual."
        },
        sotaTitle: "Impact of Perception Stages on Geometric Localization Accuracy",
        sotaNarrative: "The ablation results in Table 1 isolate how each perception stage interacts with the geometric optimizer: (1) Ours-Full converges on 100% of test frames with a mean position error of $1.10 \\times 10^{-5}\\,\\text{m}$ in simulation; (2) removing CNN semantic classification (Ablation-2) forces heuristic 2D–3D matching, causing landmark ID swaps and raising mean error to $5.380\\,\\text{m}$; (3) removing class-wise NMS and sub-pixel refinement (Ablation-3) leaves 75.0 clustered corners around high-contrast edges, skewing the NLLS gradient and increasing error to $6.132\\,\\text{m}$; (4) the unfiltered Harris baseline (Ablation-4) yields $5.655\\,\\text{m}$ error; and (5) on the exact same 4 refined keypoints, ray-angle NLLS reduces mean position error by an order of magnitude compared with iterative `solvePnP` ($1.10 \\times 10^{-5}\\,\\text{m}$ vs. $3.21 \\times 10^{-4}\\,\\text{m}$).",
        scatterDiscussion: "In detector and classifier training, SimpleCNN was evaluated on 1,377 labeled patches (276 validation samples) across the 8 landmark classes and background class, achieving 100.0% validation accuracy with a clean diagonal confusion matrix (Figure 5c and Figure 8). The fine-tuned YOLO pole detector (`POLES.pt`) converged at $640 \\times 640$ resolution to 99.2% validation mAP@0.5 (Figure 5a–b).",
        scatterFigures: [
          {
            src: "https://media.tianyasky.top/site/projects/vision-positioning/figure_training_panel.png",
            label: "Figure 5",
            title: "YOLO Training Convergence Curves, Normalized Confusion Matrix, and Patch CNN Confusion Matrix",
            caption: "(a) YOLO training loss and mAP curves; (b) YOLO pole detection normalized confusion matrix; (c) SimpleCNN 9-class confusion matrix reaching 100.0% validation accuracy."
          },
          {
            src: "/projects/vision-positioning/figure_corner_order_render.png",
            label: "Figure 6",
            title: "Projected Landmark Indices and Background Class in the Synthetic 3D Viewport",
            caption: "Visible pole vertices indexed 0, 1, 2, 3 in the camera viewport. Class 8 denotes background candidates excluded from 2D–3D correspondence."
          },
          {
            src: "/projects/vision-positioning/ray-angle-derivation.svg",
            label: "Figure 7",
            title: "Unit Ray Back-Projection and Pairwise Angular Geometry",
            caption: "Left: back-projecting 2D pixels through $K^{-1}$ into unit directional rays. Right: geometric relationship between pairwise ray angles and 3D anchor positions optimized directly over the camera center $C$."
          },
          {
            src: "/projects/vision-positioning/cnn_confusion_matrix.png",
            label: "Figure 8",
            title: "SimpleCNN 9-Class Patch Classifier Confusion Matrix on the Held-Out Test Split (N=276)",
            caption: "All 276 test patches (65 positive landmark patches across classes 0–7 and 211 background negative patches in class 8) are classified with zero cross-class errors."
          }
        ]
      },
      {
        id: "sec-case-studies",
        number: "06",
        kicker: "Qualitative Case Studies & Marine Field Trials",
        title: "Qualitative Case Studies, Coastal Field Trials & Engineering Deliverables",
        paragraphs: [
          "To validate the pipeline beyond synthetic rendering, we conducted real-world camera calibration and multi-station field trials along the Dalian coast and deployed the full stack on an embedded Jetson Orin platform."
        ],
        cases: [
          {
            id: "case-1",
            tag: "Case Study 1 · Multi-Pole Panoramic Localization",
            dataset: "Ours-Full Benchmark (Render Scene #1)",
            figure: {
              src: "https://media.tianyasky.top/site/projects/vision-positioning/ours-full_result.jpg",
              label: "Figure 9",
              title: "End-to-End Keypoint Detection, Semantic Labeling, and 3D Position Reconstruction (Ours-Full)",
              caption: "Overlay showing YOLO ROI masks, Harris corner candidates, SimpleCNN semantic IDs (green/orange tags), and the reconstructed camera position with zero background false alarms."
            },
            analysis: "In a wide field of view with background clutter, the YOLO mask isolates the structural poles, SimpleCNN assigns each corner its exact 3D anchor ID, and the ray-angle NLLS solver converges to the true camera coordinates."
          },
          {
            id: "case-2",
            tag: "Case Study 2 · Multi-Start Nonlinear Optimization Workflow",
            dataset: "Multi-Start NLLS Schematic",
            figure: {
              src: "/projects/vision-positioning/multi-start-workflow.svg",
              label: "Figure 10",
              title: "Parallel Multi-Start LM / TRF Optimization, Residual Selection, and Fallback Logic",
              caption: "Seeds from the previous frame, coarse PnP, and anchor centroid are optimized in parallel by LM and TRF; the lowest-residual valid solution is emitted, with fallback to coarse PnP or temporal prediction if residuals exceed the gate."
            },
            analysis: "Seeding the solver from three distinct geometric priors prevents single-seed local minima during rapid camera motion while keeping per-frame optimization within real-time latency budgets."
          },
          {
            id: "case-3",
            tag: "Case Study 3 · Layered Software Architecture",
            dataset: "System Engineering Blueprint",
            figure: {
              src: "/projects/vision-positioning/software-architecture.svg",
              label: "Figure 11",
              title: "Layered Software Architecture of the Monocular 3D Localization Workstation",
              caption: "Five decoupled layers: video ingestion, deep learning perception, geometric NLLS optimization, SQLite persistence, and PyQt5 interactive visualization."
            },
            analysis: "Decoupling video capture, neural inference, and NLLS solving across asynchronous worker threads sustains 26 FPS real-time throughput on a Jetson Orin module."
          },
          {
            id: "case-4",
            tag: "Case Study 4 · Stage-Wise Keypoint Pruning & Sub-Pixel Inspection",
            dataset: "Single-Frame Keypoint Pipeline",
            figure: {
              src: "https://media.tianyasky.top/site/projects/vision-positioning/single_image_result.png",
              label: "Figure 12",
              title: "Stage-by-Stage Progression from Raw Image to Sub-Pixel Refined Landmarks",
              caption: "Visual trace from raw input frame to Harris corner cloud, CNN confidence filtering, class-wise NMS deduplication, and sub-pixel corner refinement."
            },
            analysis: "Step-by-step inspection confirms that class-wise NMS collapses dense clusters of 10–20 raw Harris corners around each structural vertex into a single peak before sub-pixel refinement."
          },
          {
            id: "case-5",
            tag: "Case Study 5 · On-Site Camera Calibration",
            dataset: "Coastal Dalian Test Stations",
            figure: {
              src: "/projects/vision-positioning/real_world/calib_pos01.jpg",
              label: "Figure 13",
              title: "On-Site Checkerboard Intrinsic Calibration",
              caption: "Checkerboard target captured at the coastal test station to recover the camera intrinsic matrix $K$ and distortion coefficients before pose evaluation."
            },
            analysis: "Recovering $K$ on site keeps the back-projected rays consistent with the physical pole geometry despite lens changes between deployments."
          }
        ]
      }
    ]
  },
  highlights: [
    "**Five-Stage Cascaded Perception**: Combines YOLO ROI masking, Harris corner extraction, 9-class SimpleCNN patch classification, class-wise NMS, and sub-pixel refinement",
    "**Ray-Angle Invariant NLLS**: Formulates 3D camera localization via back-projected inter-ray angle conservation, decoupling rotation $R$ to avoid collinear PnP degeneracy",
    "**Multi-Start Dual-Solver Engine**: Seeds parallel Levenberg-Marquardt (LM) and Trust Region Reflective (TRF) solvers from temporal, PnP, and centroid priors",
    "**Edge Deployment & Coastal Field Trials**: Includes a PyQt5/SQLite workstation, runs at 26 FPS on Jetson Orin, and achieves 10–15 cm RMSE across coastal test stations in Dalian",
    "**Recognition & IP**: Selected for the Liaoning Undergraduate Innovation Annual Conference, won 3rd Prizes at iCAN and BRICS Nationals, and registered National Software Copyright"
  ],
  background: "In coastal vessel operations, aquaculture cage inspection, port yards, and GPS-denied indoor or nearshore environments, satellite navigation suffers from multipath interference and signal dropout, while planar fiducial markers (AprilTag, ArUco) degrade rapidly under marine corrosion and fouling. Localizing a monocular camera from existing structural poles offers a low-cost alternative, but slender vertical poles place landmarks in a nearly collinear configuration where standard PnP solvers suffer from rotational ill-conditioning and meter-scale position drift. We developed a cascaded perception and rotation-decoupled geometric optimization system designed for slender structural landmarks under outdoor lighting.",
  method: "The system separates visual perception from geometric optimization. In the front-end cascade, a fine-tuned YOLO detector isolates structural poles into a binary ROI mask to reject sky and water clutter; Harris corner detection extracts candidate vertices inside the mask; a 3-block convolutional network (SimpleCNN) classifies $64 \\times 64$ local RGB patches into 9 classes (8 physical pole landmarks plus 1 background class); and class-wise NMS followed by `cornerSubPix` refinement yields sub-pixel 2D–3D correspondences. In the back-end solver, 2D keypoints are back-projected into unit rays and matched against 3D world subtended angles, reducing 6-DoF pose estimation to a 3-DoF nonlinear least-squares (NLLS) problem over the camera center $C$. Parallel Levenberg-Marquardt (LM) and Trust Region Reflective (TRF) solvers optimize seeds drawn from the previous frame, a coarse PnP estimate, and the 3D landmark centroid.",
  results: "Validated across synthetic benchmarks and 8 surveyed coastal test stations in Dalian, the full cascade achieves a $1.10 \\times 10^{-5}\\,\\text{m}$ mean position error in noise-free simulation. Ablations confirm that removing SimpleCNN semantic classification causes heuristic 2D–3D mismatches ($5.380\\,\\text{m}$ error), while removing class-wise NMS leaves dense duplicate clusters ($6.132\\,\\text{m}$ error). Deployed on a Jetson Orin edge module, the system runs at 26 FPS in real time, maintaining 10–15 cm localization RMSE and $<0.6^\\circ$ relative heading error in coastal trials, accompanied by a registered PyQt5/SQLite desktop engineering suite.",
  reflection: "Two practical limitations motivate future work. First, under heavy wave-induced camera pitch and roll, frame-by-frame optimization exhibits high-frequency jitter; coupling the ray-angle visual residuals with an Inertial Measurement Unit (IMU) inside an Extended Kalman Filter (EKF) or sliding-window factor graph is the direct path to smoother trajectories. Second, specular water glare and lens spray degrade corner contrast at long range, motivating synthetic glare augmentation during Patch CNN training.",
  links: {
    visualizer: "/projects/vision-positioning/visualizer/",
    github: "https://github.com/TianyaSKY",
    gitee: "https://gitee.com/TianyaSKY"
  },
  video: "https://media.tianyasky.top/site/projects/vision-positioning/demo.mp4",
  featured: true,
  legacyHasDemo: true
};

export default visionPositioningDetail;
