const pipelineOverview = {
  src: "/projects/cixin-singularity/pipeline.svg",
  label: "Figure 2",
  title: "Qwen3.6-27B QLoRA Pipeline Overview",
  caption: "Six stages trace the run from data preparation to checkpoint selection. The ChatML examples illustrate which tokens contribute to training loss.",
  aspect: "wide",
  kind: "diagram"
};

const trainingFigure = {
  src: "/projects/cixin-singularity/training-pipeline.svg",
  label: "Figure 3",
  title: "Document-Contiguous Partitioning & QLoRA Training Pipeline",
  caption: "Curated 2,375 passage-continuation pairs formatted in ChatML; prompt tokens masked with -100 labels to ensure loss computation strictly on continuation tokens during 4-bit NF4 fine-tuning.",
  aspect: "wide",
  kind: "diagram"
};

export const cixinSingularityDetail = {
  caseFigures: {
    background: {
      src: "/projects/cixin-singularity/dynamics.svg",
      label: "Figure 1",
      title: "Optimization Dynamics & Hardware Telemetry",
      caption: "Learning-rate schedule, gradient norm stability, and RTX 5090 VRAM footprint held consistently within 16–18 GB across 238 optimization steps."
    },
    method: [pipelineOverview, trainingFigure],
    results: {
      src: "/projects/cixin-singularity/loss-curves.svg",
      label: "Figure 4",
      title: "Training Convergence & Generalization Plateau",
      caption: "Training and validation loss trajectories demonstrating steady convergence with validation loss plateauing at 3.12 after 1.5 epochs."
    }
  },
  highlights: [
    "**Single-GPU 27B Fine-Tuning**: Fine-tuned Qwen3.6-27B in 4-bit NF4 precision on a single RTX 5090 (32 GB VRAM) for 2 epochs (238 steps) in 3 hours 4 minutes",
    "**Completion-Only Loss Masking**: Formatted examples in ChatML and applied `completion_mask` (`label = -100` on prompt tokens) so gradients update only on generated continuations",
    "**Memory & Convergence Telemetry**: Maintained peak VRAM at 16–18 GB while reducing validation loss from 3.24 to 3.12 and exporting a 20 MB LoRA adapter"
  ],
  background: "Under direct zero-shot prompting, general-purpose language models often default to generic tropes when writing science fiction, missing the physical scale and austere narrative cadence characteristic of Cixin Liu's prose. Pre-training a model from scratch for a specific literary register is computationally prohibitive, whereas a 32 GB RTX 5090 makes 4-bit quantized fine-tuning of a 27B model practical on a single workstation. This project adapts Qwen3.6-27B via 4-bit QLoRA on 2,375 curated passage-continuation pairs from Cixin Liu's works, training the model to continue a given context in the target narrative voice.",
  method: "We curated 2,375 context-continuation pairs and partitioned them contiguously by source chapter into training (1,900), validation (238), and test (237) splits to prevent intra-chapter leakage. Samples are formatted in ChatML with `trl`'s `completion_mask`, setting prompt token labels to `-100` so gradients propagate exclusively through the continuation tokens. The base model is loaded in 4-bit NF4 quantization, with rank-16 (`alpha = 32`) LoRA adapters injected into the attention projections (`q_proj`, `k_proj`, `v_proj`, `o_proj`), totaling 10.5M trainable parameters (0.039% of the backbone). Training uses 8-bit AdamW with a `5e-5` learning rate and gradient checkpointing, saving checkpoints at 1.0, 1.5, and 2.0 epochs.",
  results: "Training ran for 2 epochs (238 steps) in 3 hours 4 minutes with peak VRAM between 16 GB and 18 GB and zero out-of-memory interrupts. Training loss decreased from 4.59 to 2.97, validation loss dropped from 3.24 to 3.12, and token prediction accuracy rose from 0.22 to 0.43. Validation loss plateaued after 1.5 epochs (3.124 to 3.122), indicating limited generalization gain from further steps; checkpoint selection was therefore finalized by blind side-by-side comparison of held-out continuations. The resulting LoRA adapter occupies roughly 20 MB for standalone distribution.",
  reflection: "Two practical boundaries emerged from this study. First, Qwen3.6-27B incorporates hybrid attention layers, whereas this run fine-tuned only the causal text branch via `AutoModelForCausalLM` without specialized adaptation for multimodal or non-standard blocks. Second, while 2,375 samples transfer lexical tone and sentence cadence, long multi-scene continuations can still drift in plot state or repeat structural motifs. Extending the context window to 4,096 tokens and constructing a multi-author contrastive evaluation set are the next steps for measuring long-range stylistic consistency.",
  links: {
    gitee: "https://gitee.com/tianyasky/qwen3.6-27b-liu-lora",
    download: "https://media.tianyasky.top/liucixin_train.zip",
    downloadLabel: "liucixin_train.zip"
  },
  featured: true,
  hasTerminalSim: true
};

export default cixinSingularityDetail;
