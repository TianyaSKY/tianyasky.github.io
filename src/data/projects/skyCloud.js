const figure = (name, label, title, caption) => ({
  src: `/projects/sky-cloud/${name}`,
  label,
  title,
  caption,
  kind: "diagram"
});

const screenshot = (name, label, title, caption, wide = true) => ({
  ...figure(name, label, title, caption),
  kind: "screenshot",
  wide
});

export const skyCloudDetail = {
  caseFigures: {
    background: [
      screenshot(
        "agent-chat.png",
        "Figure 1",
        "Grounded Assistant with File Citations",
        "A workspace question receives a grounded answer with the source files it references, keeping every claim traceable to stored content."
      )
    ],
    method: [
      figure(
        "method-overview.svg",
        "Figure 2",
        "Four-Layer Method Overview: Storage, Hybrid RAG, Control, and Sandboxed Execution",
        "Multi-modal files are chunked and indexed asynchronously; hybrid dense and lexical recall feeds a dual-mode controller; Expert mode provisions a Docker sandbox with human approval and writes verified artifacts back to storage."
      ),
      figure(
        "rag-retrieval.svg",
        "Figure 3",
        "Parallel Multi-Query Recall & RRF Fusion Pipeline",
        "Original and rewritten prompts feed dense and lexical recall. Reciprocal Rank Fusion merges candidates before optional cross-encoder reranking and a cited streaming answer."
      )
    ],
    results: [
      screenshot(
        "workspace.png",
        "Figure 4",
        "Isolated OpenCode Container Workspace",
        "Each Expert-mode session runs in its own container with the task files mounted; commands require explicit approval before execution."
      ),
      screenshot(
        "work-finish.png",
        "Figure 5",
        "Agent Task Completion and Artifact Write-Back",
        "Completed tasks report changed files and write the generated artifacts back into the workspace for review."
      ),
      screenshot(
        "work-file.png",
        "Figure 6",
        "In-Browser Preview of Agent-Generated Documents",
        "Generated documents can be opened directly in the browser without downloading them first."
      ),
      screenshot(
        "file-preview.png",
        "Figure 7",
        "Online Markdown Document Preview",
        "Markdown files are rendered with their formatting intact, so stored notes remain readable inside the workspace."
      ),
      screenshot(
        "mcp.png",
        "Figure 8",
        "FastMCP Access Token and External Client Configuration",
        "A scoped access token connects Cursor or Claude Desktop to the same 16 workspace tools exposed to the built-in assistant."
      ),
      screenshot(
        "token-usage.png",
        "Figure 9",
        "Per-Account Input and Output Token Totals",
        "Token accounting records prompt and completion usage for each account so retrieval and agent workloads stay observable."
      ),
      screenshot(
        "share.png",
        "Figure 10",
        "File Share-Link Expiry and Revocation Controls",
        "Share links carry an explicit expiration time and can be revoked without deleting the underlying file."
      )
    ]
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
