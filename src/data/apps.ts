export type AppId =
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "terminal"
  | "resume"
  | "github"
  | "contact"
  | "files"
  | "settings";

export interface DesktopApp {
  id: AppId;
  filename: string;
  title: string;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  phase: 1 | 2 | 3;
  onDesktop?: boolean;
}

export const desktopApps: DesktopApp[] = [
  {
    id: "about",
    filename: "about.exe",
    title: "About",
    description: "Developer identity and profile",
    defaultWidth: 560,
    defaultHeight: 680,
    phase: 1,
    onDesktop: true,
  },
  {
    id: "experience",
    filename: "experience.exe",
    title: "Experience",
    description: "Professional timeline",
    defaultWidth: 820,
    defaultHeight: 620,
    phase: 2,
    onDesktop: true,
  },
  {
    id: "projects",
    filename: "projects.exe",
    title: "Projects",
    description: "Repository explorer",
    defaultWidth: 880,
    defaultHeight: 640,
    phase: 2,
    onDesktop: true,
  },
  {
    id: "skills",
    filename: "skills.exe",
    title: "Skills",
    description: "Technology graph",
    defaultWidth: 880,
    defaultHeight: 640,
    phase: 2,
    onDesktop: true,
  },
  {
    id: "terminal",
    filename: "terminal.exe",
    title: "Terminal",
    description: "Command interface",
    defaultWidth: 720,
    defaultHeight: 520,
    phase: 3,
    onDesktop: true,
  },
  {
    id: "resume",
    filename: "resume.pdf",
    title: "Resume",
    description: "Resume viewer",
    defaultWidth: 720,
    defaultHeight: 740,
    phase: 2,
    onDesktop: true,
  },
  {
    id: "github",
    filename: "github.exe",
    title: "GitHub",
    description: "Public repositories",
    defaultWidth: 720,
    defaultHeight: 640,
    phase: 3,
    onDesktop: true,
  },
  {
    id: "contact",
    filename: "contact.exe",
    title: "Contact",
    description: "Send a local message",
    defaultWidth: 520,
    defaultHeight: 560,
    phase: 3,
    onDesktop: true,
  },
  {
    id: "files",
    filename: "files",
    title: "Files",
    description: "Home directory",
    defaultWidth: 640,
    defaultHeight: 520,
    phase: 3,
  },
  {
    id: "settings",
    filename: "settings",
    title: "Settings",
    description: "System preferences",
    defaultWidth: 520,
    defaultHeight: 560,
    phase: 3,
  },
];

export const desktopShortcuts = desktopApps.filter((app) => app.onDesktop);

export function getApp(id: AppId): DesktopApp {
  const app = desktopApps.find((item) => item.id === id);
  if (!app) {
    throw new Error(`Unknown app: ${id}`);
  }
  return app;
}
