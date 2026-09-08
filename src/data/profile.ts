export interface Profile {
  name: string;
  handle: string;
  title: string;
  focus: string;
  location: string;
  summary: string;
  specializations: string[];
  education: {
    school: string;
    degree: string;
    start: string;
    end: string;
    cgpa: string;
  };
  status: string;
  coreStack: string[];
}

export const profile: Profile = {
  name: "ARYAN",
  handle: "Arya7n",
  title: "Full Stack Developer",
  focus: "Backend-Focused",
  location: "Mohali, Punjab",
  summary:
    "Full Stack Developer with professional experience building scalable backend systems and modern web applications using Node.js, TypeScript, NestJS, React, and Next.js. Experienced in microservices, WebSockets, Redis, Docker, PostgreSQL, and MongoDB with a strong focus on backend architecture, performance optimization, and distributed systems.",
  specializations: [
    "Backend engineering",
    "Full-stack development",
    "Distributed systems",
    "APIs",
    "Real-time systems",
    "Cloud",
    "SaaS",
  ],
  education: {
    school: "CGC Landran, Mohali, Punjab",
    degree: "B.Tech in Information Technology",
    start: "June 2021",
    end: "June 2025",
    cgpa: "7.5/10",
  },
  status: "Building production systems at PSQUARE",
  coreStack: [
    "Node.js",
    "TypeScript",
    "NestJS",
    "React",
    "Next.js",
    "Redis",
    "MongoDB",
    "PostgreSQL",
    "Docker",
    "AWS",
    "WebSockets",
  ],
};
