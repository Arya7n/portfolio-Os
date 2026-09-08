export interface SkillGroup {
  id: string;
  label: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    items: ["JavaScript", "TypeScript"],
  },
  {
    id: "backend",
    label: "Backend",
    items: [
      "Node.js",
      "NestJS",
      "Express.js",
      "REST APIs",
      "Socket.IO",
      "WebSockets",
      "Microservices",
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    items: ["React.js", "Next.js", "Redux", "Tailwind CSS", "HTML5", "CSS3"],
  },
  {
    id: "databases",
    label: "Databases",
    items: ["MongoDB", "PostgreSQL", "Prisma", "Mongoose"],
  },
  {
    id: "cloud",
    label: "Cloud / DevOps",
    items: ["Docker", "Redis", "BullMQ", "AWS S3", "AWS SES", "PM2"],
  },
  {
    id: "tools",
    label: "Tools",
    items: ["Git", "GitHub", "Postman", "Firebase", "Linux"],
  },
];
