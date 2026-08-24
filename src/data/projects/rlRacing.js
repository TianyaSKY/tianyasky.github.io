export const rlRacingDetail = {
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
};

export default rlRacingDetail;
