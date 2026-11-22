export const skyOjDetail = {
  caseFigures: {
    background: [
      {
        src: "/projects/sky-oj/homepage-landing.png",
        label: "Figure 1",
        title: "Interactive Courseware & Problem Exploration Portal",
        caption: "SKYOJ landing page providing centralized problem categorization, multi-dimensional tag filtering, and real-time submission statistics for students and instructors.",
        wide: true
      }
    ],
    method: [
      {
        src: "/projects/sky-oj/method-overview.png",
        label: "Figure 2",
        title: "SKYOJ: Asynchronous Grading and On-Demand Tutoring",
        caption: "FastAPI schedules ACM, OOP, and Kaggle submissions for Celery workers, which run code in isolated Docker sandboxes and return verdicts and case diagnostics. Students can separately request guided debugging hints from the LLM tutor.",
        kind: "diagram",
        wide: true
      },
      {
        src: "/projects/sky-oj/problem-list.png",
        label: "Figure 3",
        title: "Problem Catalog with Multi-Dimensional Filtering",
        caption: "Problems are grouped by algorithmic topic and difficulty, with tag filters and live submission statistics visible from the catalog.",
        wide: true
      },
      {
        src: "/projects/sky-oj/problem-detail-editor.png",
        label: "Figure 4",
        title: "Problem Statement and Monaco Editor Workspace",
        caption: "The split-pane workspace combines the problem statement, sample cases, and an in-browser Monaco editor with the guided AI debugging assistant."
      },
      {
        src: "/projects/sky-oj/problem-draft.png",
        label: "Figure 5",
        title: "Problem Authoring and Draft Publication Workflow",
        caption: "Instructors author problem statements, test data, and evaluation modes, then review drafts before publishing them to a course."
      }
    ],
    results: [
      {
        src: "/projects/sky-oj/submission-result.png",
        label: "Figure 6",
        title: "Multi-Case Verdict Diagnostics & Sandbox Metrics",
        caption: "Real-time grading verdict breakdown displaying execution time, peak memory usage, and per-test-case pass/fail diagnostics inside isolated Docker containers.",
        wide: true
      },
      {
        src: "/projects/sky-oj/teacher-dashboard.png",
        label: "Figure 7",
        title: "Instructor Course and Assignment Dashboard",
        caption: "Instructors track assignments, submission status, and per-student progress from a single course dashboard."
      },
      {
        src: "/projects/sky-oj/admin-problem-management.png",
        label: "Figure 8",
        title: "Administrator Problem-Bank Management Console",
        caption: "Administrators review, edit, and retire problems across the shared problem bank while keeping course assignments linked to stable problem versions."
      }
    ]
  },
  highlights: [
    "**Multi-Paradigm Evaluation**: Supports standard ACM stdin/stdout diffing, black-box OOP unit-test harness verification, and metric-based data science / Kaggle grading under one schema",
    "**Asynchronous Task Queues**: Decouples API submission writes from evaluation via RabbitMQ and single-process Celery workers with automated timeout reclamation",
    "**Hardened Sandbox Isolation**: Executes untrusted student code in ephemeral Docker containers with `network=none` and Linux Cgroups limits on CPU, memory, and PIDs",
    "**Guided AI Debugging Assistant**: Integrates an OpenAI-compatible LLM endpoint constrained by system prompts to explain compiler/runtime errors and suggest debugging steps without leaking full solutions"
  ],
  background: "University computer science coursework extends well beyond standard algorithmic puzzles to include object-oriented programming (OOP) class design and data-science modeling assignments. Traditional online judge (OJ) platforms typically only compare standard input/output streams, leaving OOP interface testing and quantitative metric grading to manual TA review. SKYOJ unifies these three evaluation paradigms in a single instructional platform while adding a pedagogical LLM assistant that helps students interpret tracebacks and logic bugs.",
  method: "The frontend uses Vue 3 and Monaco Editor for in-browser coding and submission tracking, while the FastAPI + MySQL backend manages problems, users, and submission records. At the scheduling layer, RabbitMQ and Celery route evaluation, AI tutoring, and file processing into dedicated queues; judge workers execute tasks sequentially in single-process mode to prevent resource contention during timing-sensitive runs. Each submission executes inside an isolated Docker container with external networking disabled (`network=none`) and Cgroups quotas enforcing CPU, memory, and process-count ceilings. The AI debugging module inspects the problem prompt, student code, and error logs to return guided diagnostic hints rather than complete answer code.",
  results: "The repository includes the full frontend, backend, judge container images, and Docker Compose orchestration. Instructors can author and publish ACM algorithm problems, OOP unit-test assignments, and Kaggle-style data evaluation tasks; students receive real-time execution verdicts and case-by-case feedback in the browser, backed by background reaper tasks that clean up timed-out containers.",
  reflection: "Running untrusted student submissions makes strict network and resource isolation non-negotiable. While spawning a fresh container per task provides strong isolation, cold container startup latency increases queue wait times during end-of-class submission spikes; introducing a pre-warmed container pool is the next step to raise concurrent evaluation throughput.",
  links: {
    github: "https://github.com/TianyaSKY/SKYOJ"
  },
  video: "https://media.tianyasky.top/skyoj-intro.mp4",
  featured: false
};

export default skyOjDetail;
