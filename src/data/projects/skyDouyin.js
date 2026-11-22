const architectureFigure = {
  src: "/projects/sky-douyin/cover.svg",
  label: "Figure 1",
  title: "End-to-End Microservice Short-Video Ecosystem",
  caption: "Full-stack short-video architecture integrating React/Android clients, Spring Boot 3 core services, RabbitMQ async messaging, FastAPI recommendation workers, and Milvus vector search.",
  kind: "diagram"
};

const uploadFigure = {
  src: "/projects/sky-douyin/upload-and-indexing.png",
  label: "Figure 2",
  title: "Chunked Video Ingestion & Asynchronous Vector Indexing",
  caption: "Client-side file hashing with chunked resumable upload; asynchronous event emission via RabbitMQ triggers multimodal embedding extraction and Milvus vector indexing.",
  kind: "diagram",
  wide: true
};

const recommendationFigure = {
  src: "/projects/sky-douyin/cold-start-and-feed.png",
  label: "Figure 3",
  title: "Cold-Start Preference Profiling & Hybrid Feed Recall",
  caption: "Category centroid embedding aggregation for new user onboarding, followed by real-time behavioral telemetry and hybrid vector similarity plus trending fallback.",
  kind: "diagram"
};

export const skyDouyinDetail = {
  gallery: [architectureFigure, uploadFigure, recommendationFigure],
  caseFigures: {
    background: architectureFigure,
    method: uploadFigure,
    results: recommendationFigure
  },
  highlights: [
    "**Ingestion & Indexing Pipeline**: Client-side file hashing with chunked, resumable uploads; video metadata creation triggers asynchronous embedding extraction and Milvus indexing before publishing",
    "**Cross-Client Behavior Telemetry**: Web and Android clients report playback, dwell time, and like events through a unified schema to drive real-time feed refreshes",
    "**Cold-Start User Profiling**: Pre-aggregates category-level video embeddings so newly registered users receive an initial preference vector averaged from their selected interest tags",
    "**Decoupled Service Architecture**: Separates transactional business logic (Spring Boot 3), embedding and recommendation services (FastAPI), and storage engines (MySQL, Redis, Milvus)"
  ],
  background: "Standalone recommendation experiments often stop at an offline ranking script or a static database query, omitting the operational loop between content ingestion, client interaction capture, and online candidate recall. In a production-like short-video system, chunked video uploading, asynchronous feature extraction, real-time telemetry (views, dwell duration, likes), and subsequent feed generation are tightly coupled. SKYDouyin implements a full-stack short-video prototype (MVP) to connect content publishing, behavioral event streaming, and vector-based feed recommendation end to end.",
  method: "The client layer includes a React 18 web app and a native Android client supporting streaming playback and resumable chunked uploads. A Spring Boot 3 service backed by MySQL manages users, video metadata, and social interactions, while Redis caches like counters and session state. When a video is uploaded, Spring Boot publishes an asynchronous event over RabbitMQ to a FastAPI recommendation service, which extracts multimodal content embeddings, inserts them into Milvus, and updates the video's publication status. To handle user cold start, the system pre-computes centroid embeddings for each content category and initializes a new user's preference vector by averaging the centroids of their chosen registration tags. All services are orchestrated via Docker Compose.",
  results: "The end-to-end loop—spanning user registration, interest onboarding, chunked video publishing, vertical feed playback, like/unlike interactions, telemetry ingestion, and Milvus vector similarity recall merged with trending fallback—runs across both the Web and Android clients. Because the FastAPI recommendation engine is decoupled from the Spring Boot core via RabbitMQ and REST contracts, recall strategies and embedding models can be swapped independently.",
  reflection: "This prototype prioritized closing the full data loop from client telemetry to online vector recall, so its ranking layer relies on cosine-similarity retrieval blended with trending candidates rather than a multi-stage deep reranker. Before introducing heavier ranking models, the next engineering priorities are hardening telemetry delivery with idempotent message deduplication and building an offline replay evaluation set.",
  links: {
    github: "https://github.com/TianyaSKY/SKYDouyin"
  },
  featured: false
};

export default skyDouyinDetail;
