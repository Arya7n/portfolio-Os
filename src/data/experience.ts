export interface ExperienceRole {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  year: string;
  current?: boolean;
  highlights: string[];
  technologies: string[];
  metrics: Array<{
    label: string;
    value: string;
  }>;
}

export const experience: ExperienceRole[] = [
  {
    id: "psquare",
    company: "PSQUARE COMPANY",
    role: "MERN Stack Developer",
    start: "Dec 2025",
    end: "Present",
    year: "2025",
    current: true,
    highlights: [
      "Designed and developed scalable backend services using Node.js, TypeScript, and microservices architecture.",
      "Implemented Docker, Redis, and BullMQ for containerization, caching, and background processing.",
      "Integrated AWS S3 and SES for storage and email workflows.",
      "Optimized MongoDB aggregation pipelines, improving query performance by 40%.",
      "Developed notification and real-time chat services.",
      "Built and optimized REST APIs, improving performance and reducing response times by approximately 30–40%.",
    ],
    technologies: [
      "Node.js",
      "TypeScript",
      "Microservices",
      "Docker",
      "Redis",
      "BullMQ",
      "AWS S3",
      "AWS SES",
      "MongoDB",
      "WebSockets",
    ],
    metrics: [
      { label: "MongoDB query performance", value: "40%" },
      { label: "API response time improvement", value: "30–40%" },
    ],
  },
  {
    id: "netscape",
    company: "NetscapeLabsInfotech Pvt. Ltd.",
    role: "MERN Stack Developer — Trainee",
    start: "Jun 2025",
    end: "Nov 2025",
    year: "2025",
    highlights: [
      "Built and deployed 2 live production applications using Next.js, React.js, and Node.js.",
      "Developed reusable UI components using Tailwind CSS and Shadcn.",
      "Implemented real-time notifications and updates using Socket.io.",
      "Integrated REST APIs and Firebase for authentication, data storage, and analytics.",
      "Collaborated with backend and UI teams to improve page-load performance by 30% and enhance SEO.",
    ],
    technologies: [
      "Next.js",
      "React.js",
      "Node.js",
      "Tailwind CSS",
      "Shadcn",
      "Socket.io",
      "Firebase",
    ],
    metrics: [
      { label: "Live production applications", value: "2" },
      { label: "Page-load performance", value: "30%" },
    ],
  },
];
