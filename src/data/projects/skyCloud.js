export const skyCloudDetail = {
  gallery: [
    {
      src: "/projects/sky-cloud/agent_chat.png",
      caption: "RAG assistant conversation with grounded file citations"
    },
    {
      src: "/projects/sky-cloud/workspace.png",
      caption: "Isolated OpenCode container workspace"
    },
    {
      src: "/projects/sky-cloud/work-finish.png",
      caption: "Agent task completion and artifact write-back"
    },
    {
      src: "/projects/sky-cloud/work_file.png",
      caption: "In-browser preview of agent-generated documents"
    },
    {
      src: "/projects/sky-cloud/mcp.png",
      caption: "FastMCP access token and external client configuration"
    },
    {
      src: "/projects/sky-cloud/token-usage.png",
      caption: "Model token consumption telemetry dashboard"
    },
    {
      src: "/projects/sky-cloud/file_preview.png",
      caption: "Online Markdown document preview"
    },
    {
      src: "/projects/sky-cloud/share.png",
      caption: "Time-bounded file sharing management"
    }
  ],
  caseFigures: {
    background: {
      src: "/projects/sky-cloud/agent_chat.png",
      label: "Figure 1",
      title: "Grounded Knowledge Retrieval & Conversational Interface",
      caption: "Interactive web assistant combining streaming responses with verifiable document chunk citations and file grounding."
    },
    method: {
      src: "/projects/sky-cloud/architecture.png",
      label: "Figure 2",
      title: "Four-Tier System Blueprint & Sandboxed Runtimes",
      caption: "End-to-end architecture decoupling read-only file retrieval, asynchronous vector indexing via Celery/RabbitMQ, and sandboxed Docker agent environments.",
      kind: "diagram",
      wide: true
    },
    results: {
      src: "/projects/sky-cloud/rag-retrieval.png",
      label: "Figure 3",
      title: "Parallel Multi-Query Recall & RRF Fusion Pipeline",
      caption: "Dual query recall spanning original and rewritten user prompts, fused via Reciprocal Rank Fusion (RRF) and cross-encoder reranking prior to streaming generation.",
      kind: "diagram"
    }
  },
  highlights: [
    "**Cloud Storage Foundation**: Supports chunked large-file uploads, hash-based instant deduplication, resumable transfers, online previews, batch operations, and expiring share links",
    "**Hybrid RAG Pipeline**: RabbitMQ workers asynchronously chunk documents into 1024-D pgvector embeddings; online queries combine multi-query rewriting, vector + keyword recall, RRF fusion, and reranking",
    "**Dual-Mode AI Assistant**: Fast mode performs read-only retrieval over workspace files; Expert mode provisions an isolated Docker sandbox with explicit command approval and file diff inspection",
    "**FastMCP Protocol Server**: Exposes 16 workspace file and retrieval tools over FastMCP for direct invocation from Cursor and Claude Desktop"
  ],
  background: "As personal documents, research notes, and code archives grow, retrieving specific passages or synthesizing multiple files into structured reports becomes difficult. Conventional cloud drives only store and transfer raw files, while pasting large documents into general chat interfaces hits context-window limits. SKYCloud combines cloud file storage, a retrieval-augmented generation (RAG) knowledge base, and an isolated code-execution sandbox into a unified workspace where files are stored once and can be queried or processed by an AI agent in a controlled Docker container.",
  method: "The backend is built with FastAPI, PostgreSQL, and `pgvector` to manage user accounts, file metadata, and 1024-dimensional embeddings, paired with a Vue 3 frontend. Upon file upload, a RabbitMQ task dispatches background workers to extract text, split chunks, and compute embeddings asynchronously. At query time, the retriever executes multi-query rewriting alongside dual-route recall (dense vector search plus lexical keyword matching), merges candidates via Reciprocal Rank Fusion (RRF), and applies optional reranking. For tasks requiring code execution or file edits, the platform dynamically spawns an isolated Docker container workspace with human-in-the-loop command confirmation and Git diff visualization, while also exposing a 16-tool FastMCP server for external IDE clients.",
  results: "The system is packaged as a multi-container Docker Compose deployment covering chunked uploads, online file preview and sharing, document-grounded RAG chat, and isolated sandbox execution. Separating the read-only Fast mode from the container-backed Expert mode prevents accidental modifications to user files during ordinary Q&A, while per-user token accounting and permission checks govern resource usage.",
  reflection: "Separating read-only retrieval from sandboxed execution proved essential for preventing unintended file mutations when granting an agent workspace tools. Currently, container garbage collection relies on basic idle timeouts, which can accumulate disk usage under heavy multi-user workloads; tightening container lifecycle reclamation and adding fine-grained execution audit logs are the priority next steps.",
  links: {
    github: "https://github.com/TianyaSKY/SKYCloud"
  },
  video: "https://media.tianyasky.top/SKYCloudPromo.mp4",
  featured: true
};

export default skyCloudDetail;
