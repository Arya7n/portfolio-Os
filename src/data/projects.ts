export interface ArchitectureNode {
  id: string;
  label: string;
  summary: string;
  points: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  demoUrl?: string;
  language: string | null;
  languages: string[];
  technologies: string[];
  topics: string[];
  featured: boolean;
  stars?: number;
  problem?: string;
  features?: string[];
  architecture?: string[];
  architectureNodes?: ArchitectureNode[];
  status?: string;
}

export const projects: Project[] = [
  {
    id: "jobmate",
    name: "JobMate",
    description:
      "Personal job application assistant Chrome extension. Stores your professional profile and resumes locally, autofills applications with confidence-based field detection, and tracks submissions — no backend or accounts.",
    url: "https://github.com/Arya7n/JobMate",
    language: "TypeScript",
    languages: ["TypeScript", "HTML", "JavaScript", "CSS"],
    technologies: [
      "TypeScript",
      "React",
      "WXT",
      "Tailwind CSS",
      "Chrome Extension",
      "IndexedDB",
      "Vitest",
    ],
    topics: ["chrome-extension", "autofill", "job-search", "local-first", "privacy"],
    featured: true,
    stars: 0,
    problem:
      "Job applications ask for the same profile and resume data across many sites, while most autofill tools either miss fields or send data off-device.",
    features: [
      "Professional profile editor with typed on-device storage",
      "Resume manager (metadata in chrome.storage, files in IndexedDB)",
      "Field detection and confidence-based autofill content script",
      "Application tracker and dashboard stats",
      "Quick Copy from the popup",
      "Privacy-focused settings",
    ],
    architecture: [
      "Popup",
      "Dashboard",
      "Background service worker",
      "Content script",
      "chrome.storage + IndexedDB",
    ],
    architectureNodes: [
      {
        id: "popup",
        label: "Popup",
        summary: "Toolbar UI for quick actions and Quick Copy.",
        points: ["Open dashboard", "Trigger autofill", "Copy profile fields"],
      },
      {
        id: "dashboard",
        label: "Dashboard",
        summary: "Full app for profile, resumes, applications, and settings.",
        points: ["Hash-routed views", "Application stats", "Privacy controls"],
      },
      {
        id: "content",
        label: "Content script",
        summary: "Detects form fields on career pages and fills with confidence scoring.",
        points: ["Field detection", "Confidence-based autofill", "On-page panel"],
      },
      {
        id: "background",
        label: "Background",
        summary: "Extension messaging between popup, tabs, and content scripts.",
        points: ["tabs / scripting / activeTab", "Popup ↔ page messaging"],
      },
      {
        id: "storage",
        label: "Local storage",
        summary: "All profile, resume, and application data stays on device.",
        points: ["chrome.storage for metadata", "IndexedDB for resume files", "No backend or analytics"],
      },
    ],
    status: "V1 complete for local use — profile, resumes, autofill, tracker, and dashboard.",
  },
  {
    id: "devtunnel",
    name: "DevTunnel",
    description:
      "A self-hosted ngrok-style tunneling platform enabling secure public access to local applications through a CLI and web dashboard.",
    url: "https://github.com/Arya7n/devtunnel",
    language: "TypeScript",
    languages: ["TypeScript", "JavaScript", "Shell", "CSS"],
    technologies: [
      "TypeScript",
      "NestJS",
      "Next.js",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "Docker",
      "WebSockets",
    ],
    topics: ["docker", "nestjs", "networking", "nginx", "pnpm", "reverse-proxy"],
    featured: true,
    stars: 2,
    problem:
      "Expose a local application on a public HTTPS URL without depending on a closed third-party tunnel service.",
    architecture: [
      "Local application",
      "CLI",
      "WebSocket connection",
      "NestJS tunnel server",
      "Redis + PostgreSQL",
      "Public subdomain",
      "Next.js dashboard",
    ],
    architectureNodes: [
      {
        id: "local",
        label: "Local Application",
        summary: "The service running on the developer machine.",
        points: ["Listens on localhost", "Receives forwarded HTTP requests"],
      },
      {
        id: "cli",
        label: "CLI",
        summary: "devtunnel expose — starts and maintains the tunnel session.",
        points: [
          "Login and API key authorization",
          "Subdomain registration",
          "Automatic reconnection",
        ],
      },
      {
        id: "ws",
        label: "WebSocket",
        summary: "Real-time tunnel communication between CLI and server.",
        points: [
          "Secure CLI–server channel",
          "Request and response forwarding",
          "Persistent session",
        ],
      },
      {
        id: "server",
        label: "NestJS Tunnel Server",
        summary: "Tunnel engine, auth, and public request ingress.",
        points: [
          "JWT authentication",
          "Dynamic subdomain routing",
          "Request forwarding",
        ],
      },
      {
        id: "redis",
        label: "Redis",
        summary: "Live tunnel registry and fast metadata lookup.",
        points: ["Tunnel state", "Metadata caching", "Fast lookup"],
      },
      {
        id: "postgres",
        label: "PostgreSQL",
        summary: "Persistent storage via Prisma.",
        points: ["Tunnel metadata", "User and session information"],
      },
      {
        id: "public",
        label: "Public Subdomain",
        summary: "Internet-facing URL for the local app.",
        points: ["HTTPS public access", "Maps to an active tunnel session"],
      },
      {
        id: "dashboard",
        label: "Next.js Dashboard",
        summary: "Operator UI for tunnels and live traffic.",
        points: ["Active tunnels", "Live HTTP traffic inspection", "Session management"],
      },
    ],
    features: [
      "Real-time HTTP tunneling using WebSockets",
      "Dynamic subdomain registration",
      "Request forwarding",
      "Automatic reconnection",
      "JWT authentication",
      "API key authorization",
      "Secure CLI-WebSocket communication",
      "Live HTTP traffic inspection",
    ],
    status:
      "Auth, Postgres, and Redis live registry are working locally, including tunnels, login, dashboard, and request logs.",
  },
  {
    id: "cartify",
    name: "Cartify",
    description: "Ecommerce platform",
    url: "https://github.com/Arya7n/cartify",
    demoUrl: "https://cartifymern.vercel.app/",
    language: "JavaScript",
    languages: ["JavaScript", "CSS", "TypeScript", "HTML"],
    technologies: ["MongoDB", "Express", "React", "Node.js"],
    topics: [],
    featured: true,
    stars: 4,
  },
  {
    id: "time-travel",
    name: "time-travel",
    description:
      "An immersive interactive website that travels through time. Drag the timeline, scroll, or use the arrow keys — the entire interface morphs with the year.",
    url: "https://github.com/Arya7n/time-travel",
    demoUrl: "https://time-travel-sage.vercel.app",
    language: "TypeScript",
    languages: ["TypeScript", "CSS", "HTML"],
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "GSAP",
      "Framer Motion",
      "Three.js",
    ],
    topics: [],
    featured: true,
    problem: "Make an entire interface change with the selected year, not just a timeline widget.",
    features: [
      "Interactive timeline travel",
      "Keyboard and pointer controls",
      "Mobile swipe navigation",
    ],
  },
  {
    id: "one-piece",
    name: "one-piece",
    description:
      "A Three.js One Piece–inspired open world where you play as Luffy and Zoro — explore islands, swim, smash barrels, and sail the Going Merry.",
    url: "https://github.com/Arya7n/one-piece",
    demoUrl: "https://onepiece3js.vercel.app/",
    language: "JavaScript",
    languages: ["JavaScript", "CSS", "HTML"],
    technologies: ["Three.js", "JavaScript", "Vite"],
    topics: [],
    featured: true,
    stars: 1,
    features: [
      "Open-world exploration",
      "Crew switching and ship boarding",
      "Day/night cycle",
      "PWA install support",
    ],
  },
  {
    id: "hrms",
    name: "HRMS",
    description: "HRMS dashboard",
    url: "https://github.com/Arya7n/HRMS",
    demoUrl: "https://hrms-three-black.vercel.app",
    language: "JavaScript",
    languages: ["JavaScript", "CSS", "HTML"],
    technologies: ["JavaScript"],
    topics: [],
    featured: true,
    stars: 3,
  },
  {
    id: "veloce",
    name: "veloce",
    description:
      "Multi-marque hypercar showcase · Browse, listen, enjoy · Images & clips for illustration · Not affiliated with the marques shown.",
    url: "https://github.com/Arya7n/veloce",
    demoUrl: "https://veloce-beta-cyan.vercel.app",
    language: "JavaScript",
    languages: ["JavaScript", "CSS", "HTML"],
    technologies: ["JavaScript", "React"],
    topics: [],
    featured: true,
    stars: 1,
  },
  {
    id: "code-ai",
    name: "Code-AI",
    description: "",
    url: "https://github.com/Arya7n/Code-AI",
    language: "JavaScript",
    languages: ["JavaScript", "CSS", "HTML"],
    technologies: ["JavaScript"],
    topics: [],
    featured: false,
    stars: 3,
  },
  {
    id: "admin-dashboard-server",
    name: "AdminDashboardServer",
    description: "",
    url: "https://github.com/Arya7n/AdminDashboardServer",
    language: "JavaScript",
    languages: ["JavaScript"],
    technologies: ["JavaScript"],
    topics: [],
    featured: false,
    stars: 3,
  },
  {
    id: "adiblonder-server",
    name: "adiblonder-server",
    description: "",
    url: "https://github.com/Arya7n/adiblonder-server",
    language: "JavaScript",
    languages: ["JavaScript"],
    technologies: ["JavaScript"],
    topics: [],
    featured: false,
    stars: 2,
  },
  {
    id: "adiblonder-admin",
    name: "adiblonder-admin",
    description: "",
    url: "https://github.com/Arya7n/adiblonder-admin",
    language: "TypeScript",
    languages: ["TypeScript"],
    technologies: ["TypeScript"],
    topics: [],
    featured: false,
    stars: 2,
  },
  {
    id: "portfolio",
    name: "portfolio",
    description:
      "this is a personal portfolio build using reactjs , framer and tailwind css",
    url: "https://github.com/Arya7n/portfolio",
    demoUrl: "https://portfolio-arya7n.vercel.app",
    language: "JavaScript",
    languages: ["JavaScript"],
    technologies: ["React", "Framer Motion", "Tailwind CSS"],
    topics: [],
    featured: false,
    stars: 3,
  },
];
