export const skyCloudDetail = {
  gallery: [
    {
      src: "/projects/sky-cloud/agent_chat.png",
      caption: "RAG 智能助手与文件引用"
    },
    {
      src: "/projects/sky-cloud/workspace.png",
      caption: "独立 OpenCode 工作区"
    },
    {
      src: "/projects/sky-cloud/work-finish.png",
      caption: "Agent 创建并回传文件"
    },
    {
      src: "/projects/sky-cloud/work_file.png",
      caption: "生成文档在线预览"
    },
    {
      src: "/projects/sky-cloud/mcp.png",
      caption: "MCP Token 与客户端配置"
    },
    {
      src: "/projects/sky-cloud/token-usage.png",
      caption: "模型 Token 用量统计"
    },
    {
      src: "/projects/sky-cloud/file_preview.png",
      caption: "Markdown 文件在线预览"
    },
    {
      src: "/projects/sky-cloud/share.png",
      caption: "带有效期的文件分享管理"
    }
  ],
  caseFigures: {
    background: {
      src: "/projects/sky-cloud/agent_chat.png",
      caption: "文件管理与 RAG 智能助手"
    },
    method: {
      src: "/projects/sky-cloud/architecture.png",
      caption: "Frontend / API / Worker / Data 四层架构"
    },
    results: {
      src: "/projects/sky-cloud/rag_pipeline.png",
      caption: "Multi-Query、RRF 与 Rerank 检索链路"
    }
  },
  highlights: [
    "文件底座：支持分片上传、断点续传、秒传、预览、批量操作、格式转换、分享链接与收件箱通知",
    "RAG 检索：离线经 RabbitMQ 异步生成描述与 Embedding，在线完成 6 维关键词改写、Multi-Query 并行召回、RRF 融合、可选 Rerank 与 SSE 流式输出",
    "双模式助手：快速模式只读当前工作空间；专家模式按用户与工作空间启动独立 OpenCode Runtime，支持权限确认、取消、文件 Diff 和会话恢复",
    "Agent 接入：FastMCP 暴露 16 个 Tool、4 个 Prompt、2 个 Resource，并为每位用户签发可刷新 Token，兼容 Claude Desktop、Cursor 与沙箱工作区"
  ],
  background: "传统云盘解决的是“文件放在哪里”，但当资料规模增长后，真正耗时的是理解、查找、重组和执行。SKYCloud 因此不把 AI 做成搜索框旁的附加按钮，而是把文件存储、索引、知识问答和受控执行放在同一个工作空间里：用户既能问“这份合同写了什么”，也能授权 Agent 汇总目录、转换格式或在隔离环境中运行代码。",
  method: "系统分为四个协作平面。数据平面由 FastAPI、PostgreSQL/pgvector 与 Vue 3 承担文件、目录、分享和会话；索引平面通过 RabbitMQ Worker 并行完成分块、描述生成与 1024 维向量写入，在线检索再做改写、融合和重排；执行平面用 LangGraph ReAct 完成自动整理，并为专家助手动态创建 OpenCode Runtime；安全平面以角色权限、短期 MCP Token、命令确认、Diff 和独立 Docker 容器限制 Agent 能力。Redis 与 Bloom Filter 用于缓存和权限前置判断，Token 用量则按对话、索引和整理分别统计。",
  results: "仓库已经形成一套可通过 Docker Compose 启动的完整产品链：文件管理、图片引用式 RAG、快速与专家两套互不污染的会话、自动整理通知、分享管理、Token 统计，以及可被外部客户端直接调用的 MCP 服务。专家模式把会话、消息和运行记录持久化，并用专用凭证隔离普通 REST 与 Runtime 访问；项目也因此从“AI 云盘”推进为可持续扩展的 AI 工作空间。",
  reflection: "这个系统最重要的工程判断不是继续增加工具数量，而是区分“读取知识”和“执行动作”。快速模式保持只读，专家模式才启动 Runtime；高风险命令必须确认，改动必须能看 Diff，凭证必须短期且可撤销。继续生产化时，应优先完善 Runtime 生命周期回收、镜像版本固定、密钥轮换与审计追踪，而不是让 Agent 获得更宽的默认权限。",
  links: {
    github: "https://github.com/TianyaSKY/SKYCloud"
  },
  video: "https://media.tianyasky.top/SKYCloudPromo.mp4",
  featured: true
};

export default skyCloudDetail;
