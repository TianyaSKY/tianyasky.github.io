export const rlRacingDetail = {
  gallery: [
    {
      src: "/projects/rl-racing/game.png",
      caption: "3D 赛道环境实机画面"
    },
    {
      src: "https://media.tianyasky.top/site/projects/rl-racing/training_curves.png",
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
      src: "https://media.tianyasky.top/site/projects/rl-racing/training_curves.png",
      caption: "PPO 训练奖励曲线"
    }
  },
  video: "https://media.tianyasky.top/RacingCar.webm",
  highlights: [
    "环境建模：用 16 维向量表达车体运动状态与 9 条扇形射线的测距信息，提供标准 Gym 接口",
    "离散控制与奖励：设计包含加减速与转向的 7 种动作组合，结合速度、居中与碰撞惩罚引导策略学习",
    "并行训练：基于 Stable-Baselines3 PPO 实现 8 进程 CPU 采样，支持 TensorBoard 监控与断点续训",
    "实机回放：提供统一命令行入口，支持无渲染批量训练与 OpenGL 窗口实时可视化、人工试驾"
  ],
  background: "学习强化学习算法时，如果直接用现成的 Gym 环境，往往容易忽略从零抽象一个实际任务的细节。做这个项目的初衷，是用 Pygame 和 OpenGL 自己动手写一个轻量级的 3D 赛车仿真环境，并封装成标准的 Gymnasium 接口。核心在于如何把车辆运动和障碍物检测整理成合理的观测特征，以及怎样设计奖励函数，让小车学会沿着赛道正常行驶，而不是原地打转或消极制动。",
  method: "环境遵循 Gymnasium 规范，reset 时随机生成带弯道和障碍物的赛道。每一步返回由 7 项车体运动特征（坐标、朝向、速度、距中心线偏差等）与 9 条扇形虚拟射线测距组成的 16 维观测向量；动作空间定义为 7 种离散控制组合（包含前进、制动、左转、右转及其组合）。奖励函数综合了前进速度、保持在车道中央的引导，以及碰撞和出界的惩罚；算法采用 Stable-Baselines3 的 PPO（MlpPolicy），用 8 个进程在 CPU 上并行采样，训练约 1000 万步，定期保存权重检查点。",
  results: "经过训练，智能体能够在随机生成的赛道中稳定避开障碍物并平稳过弯。项目整理了统一的命令行工具，支持常规训练、加载断点继续训练、TensorBoard 监控，以及切回 Pygame / OpenGL 窗口查看模型实际驾驶表现，同时也保留了人工键盘控制入口，方便手动检查物理碰撞与环境规则是否正常。",
  reflection: "目前的定位是一个适合快速实验和验证想法的轻量仿真环境，物理模型做了较多简化，传感器也是理想化的几何射线，和真实的车辆动力学与自动驾驶仍有差距。后续如果要进一步迭代，可以尝试给射线测距加入随机噪声、增加赛道曲率变化，或者引入连续动作空间，逐步提升算法面对复杂环境时的泛化能力。",
  links: {
    github: "https://github.com/TianyaSKY/RacingCar"
  },
  featured: false
};

export default rlRacingDetail;
