export const rlRacingDetail = {
  caseFigures: {
    background: {
      src: "/projects/rl-racing/observation-diagram.webp",
      label: "Figure 1",
      title: "3D Racing Environment: Observation Space and LiDAR",
      caption: "Corner avoidance scenario rendered in the browser visualizer. The diagram shows the nine LiDAR rays, vehicle kinematics, centerline offset, obstacle collision boxes, and the resulting 16-dimensional observation vector.",
      wide: true
    },
    method: {
      src: "/projects/rl-racing/game.png",
      label: "Figure 2",
      title: "Real-Time OpenGL Viewport & Multi-Ray Obstacle Detection",
      caption: "In-game rendering showing real-time vehicle trajectory, waypoint tracking, and 9 fan-shaped raycast distance measurements feeding the 16-D observation vector.",
      wide: true
    },
    results: [
      {
        src: "https://media.tianyasky.top/site/projects/rl-racing/training_curves.png",
        label: "Figure 3",
        title: "PPO Policy Reward Trajectory (10M Timesteps)",
        caption: "Stable-Baselines3 PPO episode reward convergence curve over 10 million simulation steps across 8 parallel worker subprocesses.",
        wide: true
      },
      {
        src: "/projects/rl-racing/training_curves_diag.png",
        label: "Figure 4",
        title: "Policy Entropy, Value Loss, and Episode-Length Diagnostics",
        caption: "Policy entropy decays as the driving policy stabilizes, value loss tracks critic fitting, and episode length grows once collisions become rare."
      }
    ]
  },
  video: "https://media.tianyasky.top/RacingCar.webm",
  highlights: [
    "**State & Sensor Modeling**: Encodes 7 vehicle kinematic states and 9 fan-shaped raycast range measurements into a 16-D observation vector under a standard Gymnasium interface",
    "**Discrete Control & Reward Shaping**: Defines 7 compound throttle/brake/steering actions paired with dense progress, centerline alignment, and collision penalty terms",
    "**Parallel Rollout Training**: Trains a Stable-Baselines3 PPO (`MlpPolicy`) agent across 8 parallel CPU subprocesses with TensorBoard telemetry and checkpoint resumption",
    "**Interactive Evaluation CLI**: Provides a unified command-line entry point supporting headless batch training, real-time OpenGL policy playback, and manual keyboard driving",
    "**Browser 3D Visualizer**: Explore preset scenarios, LiDAR rays, vehicle state, and the 16-D observation vector in WebGL 2. Export the current view as a PNG diagram. This visualizer illustrates the environment; it does not run the trained PPO policy."
  ],
  background: "Training reinforcement learning agents only on pre-packaged benchmarks often obscures how physical task dynamics, sensor geometry, and reward terms interact. This project builds a lightweight 3D autonomous racing simulator from scratch using Pygame and OpenGL and wraps it as a standard Gymnasium environment. The central engineering problem is formulating compact kinematic and obstacle observations alongside a reward structure that guides the vehicle to corner smoothly rather than spinning in place or braking to avoid collisions.",
  method: "On each `reset`, the environment procedurally generates a closed circuit withrandomized curves and static obstacles. At each timestep, it returns a 16-dimensional observation vector combining 7 vehicle kinematic features (position, heading angle, speed, and lateral centerline offset) with 9 forward fan-shaped raycast distance measurements. The action space consists of 7 discrete control combinations covering acceleration, braking, left/right steering, and coupled throttle-turn maneuvers. The reward function combines forward velocity along the track tangent, a centerline-keeping term, and terminal penalties for wall or obstacle collisions. A Stable-Baselines3 PPO agent (`MlpPolicy`) samples rollouts across 8 parallel CPU worker processes for 10 million timesteps with periodic checkpointing.",
  results: "After 10 million training steps, the learned policy navigates procedurally generated bends and avoids mid-track obstacles without off-track resets. The repository ships a unified CLI supporting headless training, checkpoint continuation, TensorBoard logging, and real-time OpenGL playback, while retaining a manual keyboard driving mode to verify collision boundaries and track geometry.",
  reflection: "The simulator uses simplified rigid-body kinematics and noise-free geometric raycasts to support fast policy iteration, leaving a gap to real vehicle dynamics. Adding Gaussian sensor noise to the raycasts, varying road-surface friction, and extending the controller to continuous throttle and steering actions are the next steps for testing policy robustness under closer-to-physical conditions.",
  links: {
    visualizer: "/projects/rl-racing/visualizer/",
    github: "https://github.com/TianyaSKY/RacingCar"
  },
  featured: false
};

export default rlRacingDetail;
