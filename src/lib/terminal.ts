import { desktopApps, getApp, type AppId } from "@/data/apps";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { contactEmail, githubProfile, socials } from "@/data/socials";

export type CommandAction = { type: "open"; appId: AppId } | { type: "clear" } | { type: "hire" };

export interface CommandContext {
  developerMode: boolean;
  processes: Array<{ filename: string; title: string; appId: AppId }>;
}

export interface CommandResult {
  lines: string[];
  action?: CommandAction;
}

const HOME = `/home/${profile.handle.toLowerCase()}`;

const HELP = [
  "usage: command [args]",
  "",
  "files",
  "  ls [dir]              list directory",
  "  pwd                   print working directory",
  "  cat FILE              print file",
  "  open APP|FILE         open an application",
  "",
  "profile",
  "  whoami                identity",
  "  neofetch              system summary",
  "  cat resume.txt        full resume",
  "",
  "system",
  "  ps                    running processes",
  "  top                   live-style process table",
  "  uname                 kernel name",
  "  clear                 clear screen",
  "  help                  this list",
  "",
  "actions",
  "  hire                  open recruiter mode",
  "  snake                 open snake.exe",
];

const TEXT_FILES: Record<string, () => string[]> = {
  "resume.txt": resumeText,
  resume: resumeText,
  "resume.pdf": resumeText,
  "about.txt": aboutText,
  about: aboutText,
  "contact.txt": contactText,
  contact: contactText,
  "experience.txt": experienceText,
};

const DIRECTORIES: Record<string, string[]> = {
  documents: ["about.txt", "resume.txt", "experience.txt", "contact.txt"],
  projects: projects.map((project) => project.name.replace(/\s+/g, "-").toLowerCase()),
  applications: desktopApps.map((app) => app.filename),
  apps: desktopApps.map((app) => app.filename),
};

export function runCommand(raw: string, ctx: CommandContext): CommandResult {
  const input = raw.trim();
  if (!input) return { lines: [] };

  const argv = input.split(/\s+/);
  const cmd = argv[0]?.toLowerCase() ?? "";
  const args = argv.slice(1);

  if (cmd === "sudo") {
    const rest = args.join(" ").toLowerCase();
    if (rest === "hire" || rest === "hire aryan") return hireResult();
    return { lines: [`sudo: ${args[0] ?? ""}: command not found`] };
  }

  if (cmd === "help" || cmd === "man") {
    const extra = ctx.developerMode ? ["", "developer mode", "  diagnostics", "  sysinfo"] : [];
    return { lines: [...HELP, ...extra] };
  }

  if (cmd === "clear") return { lines: [], action: { type: "clear" } };

  if (cmd === "pwd") return { lines: [HOME] };

  if (cmd === "echo") return { lines: [args.join(" ")] };

  if (cmd === "date") return { lines: [new Date().toUTCString()] };

  if (cmd === "whoami") {
    return {
      lines: [
        profile.name,
        "",
        profile.title,
        profile.focus,
        "",
        "Specialization:",
        "",
        "Backend Systems",
        "Distributed Systems",
        "Real-Time Applications",
        "SaaS",
      ],
    };
  }

  if (cmd === "uname") {
    return {
      lines: [args[0] === "-a" || args.join(" ") === "-a" ? "ARYAN v2.0  kernel  desktop  webgl-optional" : "ARYAN"],
    };
  }

  if (cmd === "neofetch") return { lines: neofetch() };

  if (cmd === "coffee") {
    return { lines: ["Loading coffee................... FAILED", "Kernel refuses. Developer is already caffeinated."] };
  }

  if (cmd === "diagnostics" || cmd === "sysinfo") {
    return {
      lines: [
        "Aryan diagnostics",
        "",
        "kernel          ok",
        "window manager  ok",
        "profile         loaded",
        "github index    static (no token)",
        "webgl           probed at runtime",
        "coffee          failed (expected)",
        "",
        "No issues requiring a ticket.",
      ],
    };
  }

  if (cmd === "hire") return hireResult();

  if (cmd === "ls") {
    const target = args.find((arg) => !arg.startsWith("-"));
    return { lines: listDir(target) };
  }

  if (cmd === "cat") {
    if (!args[0]) return { lines: ["cat: missing file operand"] };
    return { lines: catFile(args[0]) };
  }

  if (cmd === "open" || cmd === "xdg-open" || cmd === "start") {
    if (!args[0]) return { lines: [`${cmd}: missing file operand`] };
    return openTarget(args[0]);
  }

  if (cmd === "ps") return { lines: psTable(ctx.processes, args.includes("aux") || args[0] === "aux") };

  if (cmd === "top") return { lines: topTable(ctx.processes) };

  const asApp = resolveApp(cmd);
  if (asApp && args.length === 0) {
    const app = getApp(asApp);
    return { lines: [`opening ${app.filename}`], action: { type: "open", appId: asApp } };
  }

  if (TEXT_FILES[normalizePath(cmd)] && args.length === 0) {
    return { lines: [`${cmd}: Permission denied`, `try: cat ${cmd}`] };
  }

  return { lines: [`command not found: ${input}`, 'Type "help" for available commands.'] };
}

function hireResult(): CommandResult {
  return {
    lines: [
      "Checking credentials...",
      "",
      "✓ JavaScript",
      "✓ TypeScript",
      "✓ Node.js",
      "✓ React",
      "✓ AWS",
      "✓ Docker",
      "✓ Distributed Systems",
      "",
      "Result:",
      "READY TO SHIP",
      "",
      "Opening recruiter mode.",
    ],
    action: { type: "hire" },
  };
}

function normalizePath(raw: string): string {
  let path = raw.trim().replace(/\\/g, "/").toLowerCase();
  path = path.replace(/^\.\//, "");
  path = path.replace(/^~\//, "");
  path = path.replace(new RegExp(`^${HOME}/`), "");
  path = path.replace(/^\/+/, "");
  path = path.replace(/\/+$/, "");
  return path;
}

function listDir(target?: string): string[] {
  if (!target) {
    return ["Applications/", "Documents/", "Projects/", "about.txt", "resume.txt"];
  }

  const path = normalizePath(target);
  if (path === "documents" || path.endsWith("/documents")) return DIRECTORIES.documents;
  if (path === "projects" || path.endsWith("/projects")) return DIRECTORIES.projects;
  if (path === "applications" || path === "apps" || path.endsWith("/applications")) {
    return DIRECTORIES.applications;
  }

  return [`ls: cannot access '${target}': No such file or directory`];
}

function catFile(target: string): string[] {
  const path = normalizePath(target);
  const base = path.split("/").pop() ?? path;
  const loader = TEXT_FILES[base] ?? TEXT_FILES[path];
  if (loader) return loader();
  return [`cat: ${target}: No such file or directory`];
}

function openTarget(target: string): CommandResult {
  const path = normalizePath(target);
  const base = path.split("/").pop() ?? path;
  const appId = resolveApp(base) ?? resolveApp(path);
  if (appId) {
    const app = getApp(appId);
    return { lines: [`opening ${app.filename}`], action: { type: "open", appId } };
  }
  if (TEXT_FILES[base]) {
    if (base.startsWith("resume")) {
      return { lines: ["opening resume.pdf"], action: { type: "open", appId: "resume" } };
    }
    if (base.startsWith("about")) {
      return { lines: ["opening about.exe"], action: { type: "open", appId: "about" } };
    }
    if (base.startsWith("contact")) {
      return { lines: ["opening contact.exe"], action: { type: "open", appId: "contact" } };
    }
    if (base.startsWith("experience")) {
      return { lines: ["opening experience.exe"], action: { type: "open", appId: "experience" } };
    }
  }
  return { lines: [`open: ${target}: No such file or application`] };
}

function resolveApp(token: string): AppId | null {
  const t = normalizePath(token);
  if (t === "game" || t === "arcade") return "snake";
  const match = desktopApps.find(
    (app) => app.id === t || app.filename.toLowerCase() === t || app.title.toLowerCase() === t,
  );
  return match?.id ?? null;
}

function pad(value: string, width: number) {
  return value.length >= width ? value.slice(0, width) : value + " ".repeat(width - value.length);
}

function load(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash += name.charCodeAt(i);
  return ((hash % 17) + 3).toFixed(1);
}

function processRows(open: CommandContext["processes"]) {
  const daemons = profile.coreStack.slice(0, 6).map((name, index) => ({
    pid: 20 + index,
    user: profile.handle.toLowerCase(),
    cpu: load(name),
    mem: (Number(load(name)) / 3).toFixed(1),
    cmd: name.toLowerCase().replace(/\s+/g, "-"),
  }));

  const windows = open.map((proc, index) => ({
    pid: 100 + index,
    user: profile.handle.toLowerCase(),
    cpu: load(proc.filename),
    mem: (Number(load(proc.title)) / 2.4).toFixed(1),
    cmd: proc.filename,
  }));

  return [
    { pid: 1, user: "root", cpu: "0.2", mem: "0.4", cmd: "init" },
    { pid: 2, user: "root", cpu: "0.8", mem: "1.1", cmd: "window-manager" },
    ...daemons,
    ...windows,
  ];
}

function psTable(open: CommandContext["processes"], wide: boolean): string[] {
  const rows = processRows(open);
  const header = wide
    ? `${pad("PID", 6)} ${pad("USER", 10)} ${pad("CPU", 6)} ${pad("MEM", 6)} COMMAND`
    : `${pad("PID", 6)} ${pad("TTY", 8)} ${pad("TIME", 8)} CMD`;

  const body = rows.map((row) =>
    wide
      ? `${pad(String(row.pid), 6)} ${pad(row.user, 10)} ${pad(row.cpu, 6)} ${pad(row.mem, 6)} ${row.cmd}`
      : `${pad(String(row.pid), 6)} ${pad("pts/0", 8)} ${pad("0:0" + row.cpu[0], 8)} ${row.cmd}`,
  );

  return [header, ...body];
}

function topTable(open: CommandContext["processes"]): string[] {
  const rows = processRows(open).sort((a, b) => Number(b.cpu) - Number(a.cpu));
  const now = new Date().toTimeString().slice(0, 8);
  return [
    `top - ${now} up 2:00,  1 user,  load average: 0.42, 0.38, 0.31`,
    `Tasks: ${rows.length} total, ${1 + open.length} running, ${rows.length - 1 - open.length} sleeping`,
    `%Cpu: stack resident · user ${profile.handle}`,
    "",
    `${pad("PID", 6)} ${pad("USER", 10)} ${pad("%CPU", 6)} ${pad("%MEM", 6)} COMMAND`,
    ...rows.map(
      (row) => `${pad(String(row.pid), 6)} ${pad(row.user, 10)} ${pad(row.cpu, 6)} ${pad(row.mem, 6)} ${row.cmd}`,
    ),
  ];
}

function resumeText(): string[] {
  const featured = projects.filter((project) => project.featured);
  return [
    profile.name,
    `${profile.title} · ${profile.focus}`,
    profile.location,
    `GitHub: ${githubProfile.url}`,
    `Email: ${contactEmail}`,
    "",
    "SUMMARY",
    profile.summary,
    "",
    "EXPERIENCE",
    ...experience.flatMap((role) => [
      "",
      `${role.company}`,
      `${role.role} · ${role.start} – ${role.end}`,
      ...role.highlights.map((item) => `- ${item}`),
    ]),
    "",
    "PROJECTS",
    ...featured.flatMap((project) => [
      "",
      project.name,
      project.description,
      project.technologies.join(", "),
      project.url,
    ]),
    "",
    "SKILLS",
    ...skills.map((group) => `${group.label}: ${group.items.join(", ")}`),
    "",
    "EDUCATION",
    profile.education.degree,
    `${profile.education.school} · ${profile.education.start} – ${profile.education.end} · CGPA ${profile.education.cgpa}`,
  ];
}

function aboutText(): string[] {
  return [
    `${profile.name} — ${profile.title} | ${profile.focus}`,
    "",
    profile.summary,
    "",
    `Location: ${profile.location}`,
    `Status: ${profile.status}`,
    "",
    "Core stack:",
    profile.coreStack.join(", "),
  ];
}

function contactText(): string[] {
  return ["Email:", contactEmail, "", githubProfile.url, ...socials.map((link) => `${link.label}: ${link.href}`)];
}

function experienceText(): string[] {
  return experience.flatMap((role) => [
    `${role.year}  ${role.company}`,
    `    ${role.role}`,
    `    ${role.start} – ${role.end}`,
    ...role.metrics.map((metric) => `    ${metric.value} ${metric.label}`),
    "",
  ]);
}

function neofetch() {
  return [
    "    /\\_/\\",
    "   ( o.o )",
    "    > ^ <",
    "",
    "ARYAN",
    "",
    "OS:         ARYAN v2.0",
    "Role:       Full Stack Developer",
    "Focus:      Backend Engineering",
    "Runtime:    Node.js",
    "Framework:  NestJS",
    "Frontend:   React / Next.js",
    "Database:   MongoDB / PostgreSQL",
    "Cache:      Redis",
    "Cloud:      AWS",
    "Containers: Docker",
  ];
}
