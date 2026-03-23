window.PORTFOLIO_DATA = {
  profile: {
    name: "Sithu Kyaw",
    title: "Professional Trash Pretending to be Engineer-ish",
    subtitle: "Low-Effort Full-Stack Faketician",
    bio: [
      "Technically a former student at the University of Information Technology — not that it matters. I just throw the name around to make it sound like I had a plan at some point.",
      "I somehow convince myself I'm doing \"deep Linux stuff,\" messing with networks I barely understand, and writing backend code like I'm deploying to Mars and also sprinkling in some DevOps and DevSecOps buzzwords to sound employable.",
      "Basically the human version of a half-loaded man page and still talks like building the next Google from a laptop that sounds like it's about to take off every time VSCode is running.",
      "A jack of all trades, master of none, enthusiast of everything I half understand.",
    ],
    status: "Bing Chilling",
    moodStatus: "ONLINE_AND_CONFUSED",
    coffeeLevel: "Dangerously low",
    timezone: "Myanmar Time (UTC+6:30)",
    email: "hello@sithukyaw.me",
    social: {
      github: {
        url: "https://github.com/Sithukyaw666",
        handle: "Sithukyaw666",
      },
      linkedin: {
        url: "https://www.linkedin.com/in/sithu-kyaw-b00905235/",
        handle: "sithukyaw",
      },
    },
    availability: [
      "Full-stack development projects",
      "DevOps consulting",
      "System architecture discussions",
      "Coffee-fueled coding sessions",
      "Debugging mysterious issues at 3 AM",
    ],
  },

  // ── Projects ────────────────────────────────────────────────
  // type: "personal" | "fork" | "contrib"
  // status: "live" | "wip" | "archived"
  projects: [
    {
      id: "watcher",
      name: "Watcher",
      description:
        "Lightweight, pull-based GitOps engine for Docker Compose environments. Basically argo for docker compose.",
      tech: ["Go", "Docker", "Linux"],
      url: "https://watcher.sithukyaw.me",
      repo: "https://github.com/Sithukyaw666/watcher",
      type: "personal",
      status: "live",
      date: "2024-01",
    },
    {
      id: "watchtower",
      name: "Watchtower",
      description:
        "A fork of the popular Watchtower — automatically updates running Docker containers when new images are pushed.",
      tech: ["Go", "Docker", "GitHub Actions"],
      url: "https://sithukyaw.me/watchtower",
      repo: "https://github.com/Sithukyaw666/watchtower",
      type: "fork",
      status: "live",
      date: "2024-03",
    },
  ],

  // ── Skills ──────────────────────────────────────────────────
  skills: {
    // Simple tag display for the traditional UI
    categories: [
      {
        title: "Frontend",
        icon: "fas fa-code",
        tags: ["HTML5", "CSS3", "JavaScript", "React", "TypeScript"],
      },
      {
        title: "Backend",
        icon: "fas fa-server",
        tags: [
          "Node.js",
          "Go",
          "Python",
          "Express",
          "NestJS",
          "PostgreSQL",
          "MongoDB",
        ],
      },
      {
        title: "Platform Engineering",
        icon: "fas fa-tools",
        tags: ["Git", "Docker", "AWS", "Linux", "Kubernetes", "Bash"],
      },
    ],

    // Detailed data for terminal constellation and list views
    constellation: {
      "Backend Languages": {
        category: "core",
        color: "#F0DB4F",
        skills: [
          {
            name: "JavaScript",
            level: 90,
            description:
              "ES6+, Node.js, async/await mastery. Building scalable backend services.",
            icon: "fab fa-js-square",
            color: "#F0DB4F",
          },
          {
            name: "Go",
            level: 85,
            description:
              "Concurrent programming, microservices, high-performance APIs. gRPC and REST.",
            icon: "fa-brands fa-golang",
            color: "#00ADD8",
          },
          {
            name: "Python",
            level: 75,
            description:
              "Backend services, automation scripts, data processing pipelines.",
            icon: "fab fa-python",
            color: "#3776AB",
          },
          {
            name: "TypeScript",
            level: 88,
            description:
              "Type-safe backend development, strong typing for large codebases.",
            icon: "fas fa-code",
            color: "#3178C6",
          },
        ],
      },
      "JS Frameworks": {
        category: "frontend",
        color: "#339933",
        skills: [
          {
            name: "Node.js",
            level: 92,
            description:
              "Express, Fastify, event-driven architecture. Real-time applications.",
            icon: "fab fa-node-js",
            color: "#339933",
          },
          {
            name: "Express.js",
            level: 88,
            description:
              "RESTful APIs, middleware, authentication, robust web applications.",
            icon: "fas fa-server",
            color: "#000000",
          },
          {
            name: "Fastify",
            level: 80,
            description:
              "High-performance alternative to Express. Schema validation, plugins.",
            icon: "fas fa-rocket",
            color: "#000000",
          },
          {
            name: "NestJS",
            level: 78,
            description:
              "Enterprise-grade Node.js framework. Dependency injection, decorators.",
            icon: "fas fa-layer-group",
            color: "#E0234E",
          },
        ],
      },
      "Container & Orchestration": {
        category: "devops",
        color: "#2496ED",
        skills: [
          {
            name: "Docker",
            level: 92,
            description:
              "Containerization expert. Multi-stage builds, optimization, security.",
            icon: "fab fa-docker",
            color: "#2496ED",
          },
          {
            name: "Kubernetes",
            level: 85,
            description:
              "Pod management, services, ingress, helm charts. Production deployments.",
            icon: "fas fa-dharmachakra",
            color: "#326CE5",
          },
          {
            name: "Docker Compose",
            level: 90,
            description:
              "Multi-container applications, development environments, service orchestration.",
            icon: "fas fa-cubes",
            color: "#2496ED",
          },
          {
            name: "Podman",
            level: 70,
            description:
              "Rootless containers, Docker alternative, security-focused container runtime.",
            icon: "fas fa-box",
            color: "#892CA0",
          },
        ],
      },
      "CNCF Ecosystem": {
        category: "cloud",
        color: "#F46800",
        skills: [
          {
            name: "Prometheus",
            level: 80,
            description:
              "Metrics collection, alerting, monitoring cloud-native applications.",
            icon: "fas fa-chart-line",
            color: "#E6522C",
          },
          {
            name: "Grafana",
            level: 82,
            description:
              "Visualization dashboards, real-time monitoring, performance analytics.",
            icon: "fas fa-chart-bar",
            color: "#F46800",
          },
          {
            name: "Loki",
            level: 75,
            description:
              "Distributed tracing, microservices observability, performance debugging.",
            icon: "fas fa-project-diagram",
            color: "#60D0E4",
          },
          {
            name: "Helm",
            level: 78,
            description:
              "Kubernetes package manager, templating, application deployment automation.",
            icon: "fas fa-anchor",
            color: "#0F1689",
          },
        ],
      },
      "Service Mesh": {
        category: "network",
        color: "#466BB0",
        skills: [
          {
            name: "Istio",
            level: 72,
            description:
              "Service mesh management, traffic control, security policies, observability.",
            icon: "fas fa-network-wired",
            color: "#466BB0",
          },
          {
            name: "Envoy",
            level: 68,
            description:
              "Proxy configuration, load balancing, service discovery in microservices.",
            icon: "fas fa-route",
            color: "#AC6199",
          },
          {
            name: "Linkerd",
            level: 65,
            description:
              "Lightweight service mesh, automatic TLS, traffic shifting capabilities.",
            icon: "fas fa-link",
            color: "#2DCEAA",
          },
        ],
      },
      "CI/CD Tools": {
        category: "automation",
        color: "#2088FF",
        skills: [
          {
            name: "GitHub Actions",
            level: 88,
            description:
              "Workflow automation, CI/CD pipelines, deployment strategies, testing.",
            icon: "fab fa-github",
            color: "#181717",
          },
          {
            name: "GitLab CI",
            level: 82,
            description:
              "Pipeline configuration, auto-scaling runners, security scanning integration.",
            icon: "fab fa-gitlab",
            color: "#FCA326",
          },
          {
            name: "Jenkins",
            level: 78,
            description:
              "Build automation, plugin ecosystem, distributed builds, legacy system integration.",
            icon: "fas fa-tools",
            color: "#D33833",
          },
          {
            name: "ArgoCD",
            level: 75,
            description:
              "GitOps deployment, Kubernetes continuous delivery, declarative configuration.",
            icon: "fas fa-sync-alt",
            color: "#EF7B4D",
          },
        ],
      },
      "Linux & Systems": {
        category: "systems",
        color: "#FCC624",
        skills: [
          {
            name: "Linux",
            level: 90,
            description:
              "System administration, shell scripting, performance tuning, security hardening.",
            icon: "fab fa-linux",
            color: "#FCC624",
          },
          {
            name: "Bash",
            level: 88,
            description:
              "Advanced scripting, automation, system integration, command-line mastery.",
            icon: "fas fa-terminal",
            color: "#4EAA25",
          },
          {
            name: "SystemD",
            level: 80,
            description:
              "Service management, unit files, system initialization, logging configuration.",
            icon: "fas fa-cogs",
            color: "#30A3EC",
          },
          {
            name: "Nginx",
            level: 85,
            description:
              "Reverse proxy, load balancing, SSL termination, performance optimization.",
            icon: "fas fa-server",
            color: "#009639",
          },
        ],
      },
      VCS: {
        category: "tools",
        color: "#F05032",
        skills: [
          {
            name: "Git",
            level: 92,
            description:
              "Advanced workflows, branching strategies, conflict resolution, repository management.",
            icon: "fab fa-git-alt",
            color: "#F05032",
          },
          {
            name: "GitHub",
            level: 90,
            description:
              "Collaboration, code review, project management, automated workflows.",
            icon: "fab fa-github",
            color: "#181717",
          },
          {
            name: "GitLab",
            level: 85,
            description:
              "DevOps platform, merge requests, issue tracking, integrated CI/CD.",
            icon: "fab fa-gitlab",
            color: "#FCA326",
          },
        ],
      },
    },
  },
};
