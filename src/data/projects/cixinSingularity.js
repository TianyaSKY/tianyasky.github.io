export const cixinSingularityDetail = {
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
};

export default cixinSingularityDetail;
