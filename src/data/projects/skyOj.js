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
    "多题型评测：支持常规标准 I/O 对拍、面向对象单元测试脚本验证，以及基于精度/误差的数据科学类评分",
    "异步任务队列：API 写入记录后通过 RabbitMQ 投递，Celery Worker 顺序执行判题任务，支持异常超时回收",
    "安全沙箱隔离：评测容器默认关闭外网，使用 Linux Cgroups 限制 CPU、内存及进程上限，降低越权风险",
    "AI 辅助排错：接入兼容接口的大模型，引导学生理解报错信息和排查思路，而不直接输出完整题解"
  ],
  background: "平时计算机专业课程里的编程作业，除了常见的算法题之外，还有很多面向对象设计（OOP）或者数据科学类的作业。传统的在线判题系统（OJ）大多只支持标准输入输出比对，遇到需要测试类接口实现或者计算模型指标的题目就无法自动评测，往往只能靠人工批改。这个项目从实际教学场景出发，尝试在一个平台上兼容这几种常见的评测需求，同时引入大模型作为答疑助手，帮助学生更快看懂报错原因。",
  method: "前端基于 Vue 3 和 Monaco Editor 构建在线代码编辑与提交界面；后端使用 FastAPI 与 MySQL 管理题目、用户和提交记录；调度层使用 RabbitMQ 与 Celery，把判题、AI 答疑与文件处理拆分成不同队列，Worker 采用单进程模式顺序执行，避免多任务相互争抢资源；执行层在独立的 Docker 容器中运行用户代码，通过关闭网络访问、限制 Cgroups 内存/CPU 配额以及最大进程数来保证沙箱安全。AI 模块则通过提示词工程定位常见语法和逻辑错误，做引导式提示。",
  results: "项目提供了完整的前后端代码、评测镜像与 Docker Compose 部署配置。目前支持教师在线布置 ACM 算法题、OOP 单元测试题与数据科学评估题；学生提交代码后可以在线查看运行状态与详细的测试反馈；后台也加入了超期任务回收机制，保障了日常教学和练习的可用性。",
  reflection: "做判题系统时最深刻的体会是安全和隔离必须放在第一位。由于学生提交的代码不可控，网络隔离和资源限制必须卡严。当前采用单任务容器隔离的方式比较稳妥，但在遇到上课集中提交等高峰场景时排队时间会变长；后续如果继续优化，可以考虑引入轻量沙箱容器池来减少每次启动容器的开销，提高并发评测的吞吐量。",
  links: {
    github: "https://github.com/TianyaSKY/SKYOJ"
  },
  video: "https://media.tianyasky.top/skyoj-intro.mp4",
  featured: false
};

export default skyOjDetail;
