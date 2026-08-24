export const skyOjDetail = {
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
};

export default skyOjDetail;
