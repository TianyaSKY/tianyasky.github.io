const trainingFigure = {
  src: "/projects/cixin-singularity/training-pipeline.png",
  caption: "按篇章切分数据、ChatML 掩码与 QLoRA 训练流程",
  aspect: "wide",
  kind: "diagram"
};

export const cixinSingularityDetail = {
  gallery: [
    trainingFigure,
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
    method: trainingFigure,
    results: {
      src: "/projects/cixin-singularity/loss-curves.svg",
      caption: "训练与验证损失曲线"
    }
  },
  highlights: [
    "单卡微调 27B 模型：使用 4-bit NF4 量化在单张 RTX 5090（32GB）上微调 Qwen3.6-27B，训练 2 个 epoch（238 步），耗时约 3 小时",
    "仅对续写部分计 Loss：采用 ChatML 格式，利用 completion_mask 将提示词部分 label 设为 -100，让模型专注学习续写后文",
    "显存与收敛监控：显存峰值约 16–18GB，验证集 Loss 从 3.24 降至 3.12，生成 LoRA 适配层大小仅约 20MB"
  ],
  background: "通用大语言模型在直接提示下写科幻文本，往往容易变成空洞的套路化描写，缺乏刘慈欣小说中那种偏向硬科幻的叙事节奏和独特的文风质感。如果为了特定风格专门从头预训练一个模型，算力成本根本吃不消。正好手头有一张 32GB 显存的 RTX 5090，采用 4-bit 量化跑 27B 模型的微调在显存上是可行的。因此这个项目的目标很直接：以 Qwen3.6-27B 为基底做 4-bit QLoRA 续写微调，从 2375 条清洗整理的刘慈欣小说段落中，让模型专门学习输入前文、续写后文的叙事风格。",
  method: "数据方面，整理了 2375 条小说上下文续写对，按篇章连续划分为训练集（1900条）、验证集（238条）和测试集（237条），避免同篇内容交叉泄露；采用 ChatML 格式，并用 trl 的 completion_mask 把前文提示部分的 label 设为 -100，确保梯度只对模型实际续写的文字生效。模型采用 4-bit NF4 格式加载，在注意力投影像（q/k/v/o_proj）注入 rank=16、alpha=32 的 LoRA 适配层，可训练参数约 1050 万（占比约 0.039%）。使用 8-bit AdamW 优化器，学习率 5e-5，开启梯度检查点，在 1.0、1.5 和 2.0 epoch 保存权重检查点。",
  results: "训练共进行 2 个 epoch（238 步），耗时约 3 小时 4 分钟，显存峰值约 16–18GB，没有发生 OOM。训练集 Loss 从 4.59 降至 2.97，验证集 Loss 从 3.24 降到 3.12，Token 预测准确率从 0.22 提升到 0.43。观察验证集 Loss 发现，在 1.5 epoch 之后曲线基本走平（3.124 → 3.122），继续多训并没有带来明显的泛化提升，最终通过人工抽样对比不同检查点的续写质量来挑选模型。训练好的 LoRA 权重仅 20MB 左右，加载和分享都很轻便。",
  reflection: "这个小实验有两点值得总结：一是 Qwen3.6-27B 本身包含混合注意力结构，这次只是用常规的 AutoModelForCausalLM 跑了纯文本分支，还没有针对多模态与特殊层做专门优化；二是训练样本量只有两千多条，虽然续写时能看出明显的文风倾向，但面对复杂长篇情节时仍容易陷入循环或前后逻辑脱节。后面如果有空，可以尝试把上下文扩到 4096、加入更多作者的数据做对比，并设计一些更有针对性的评测样本来观察风格保持度。",
  links: {
    gitee: "https://gitee.com/tianyasky/qwen3.6-27b-liu-lora",
    download: "https://media.tianyasky.top/liucixin_train.zip",
    downloadLabel: "liucixin_train.zip"
  },
  featured: true,
  hasTerminalSim: true
};

export default cixinSingularityDetail;
