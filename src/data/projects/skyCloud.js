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
      caption: "SKYCloud 四层架构：只读检索、异步索引与独立 Docker 工作区",
      kind: "diagram"
    },
    results: {
      src: "/projects/sky-cloud/rag-retrieval.png",
      caption: "原问题与改写查询并行召回，经 RRF 融合及可选 Rerank 后流式回答",
      kind: "diagram"
    }
  },
  highlights: [
    "文件存储底座：支持大文件分片上传、秒传、断点续传、在线预览、批量管理与有效期分享",
    "混合检索链路：RabbitMQ 异步切块并生成 1024 维向量，在线检索结合多查询改写、RRF 融合与重排序",
    "双模式助手：快速模式只读当前工作空间；专家模式启动隔离 Docker 沙箱，支持命令确认与文件 Diff",
    "开放协议接入：基于 FastMCP 暴露常用文件与查询工具，可直接被 Cursor、Claude Desktop 等客户端调用"
  ],
  background: "平时存的文档、资料和代码多了，经常遇到“记得有这份笔记但翻不到”，或者“想把几份材料汇总整理成表格”的需求。传统网盘只负责存取文件，而在通用聊天窗口里传大文件又受上下文窗口限制。做这个项目就是想把个人网盘、文档知识库检索（RAG）和代码执行沙箱结合起来，搭一个自己用着顺手的工作区：平时当网盘存资料，需要时可以让 AI 检索里面的内容回答问题，或者让它在隔离的 Docker 容器里帮忙跑跑脚本、整理文件。",
  method: "系统主要分为几个部分：后端用 FastAPI、PostgreSQL 和 pgvector 处理用户、文件元数据与向量存储，前端是 Vue 3；文件上传后通过 RabbitMQ 异步调用 Worker 提取文本并生成向量；检索时支持多查询改写与两路召回（向量 + 关键词），再做重排序；针对需要修改文件或运行代码的任务，系统会动态启动独立的 Docker 容器沙箱，界面支持查看命令和 Diff 并由用户手动确认，同时实现了 FastMCP 协议接口，方便从外部客户端直接调用。",
  results: "目前系统已整理成完整的 Docker Compose 配置，可以直接一键拉起测试。功能上覆盖了分片上传、文件预览与分享、基于文档的 RAG 问答、以及独立代码沙箱。区分了只读问答的“快速模式”和能在容器里修改文件的“专家模式”，避免误操作破坏原文件，同时加入了 Token 消耗统计和权限校验。",
  reflection: "实际做下来感觉，给 Agent 堆工具并不难，难的是如何防范越权和误操作。把只读问答和沙箱执行明确分开是比较稳妥的做法。目前系统仍有不足，比如沙箱容器的自动回收机制还比较简陋，长期运行可能会占满宿主机磁盘；下一步需要优先完善容器生命周期管理和操作审计日志，而不是盲目接入更多权限。",
  links: {
    github: "https://github.com/TianyaSKY/SKYCloud"
  },
  video: "https://media.tianyasky.top/SKYCloudPromo.mp4",
  featured: true
};

export default skyCloudDetail;
