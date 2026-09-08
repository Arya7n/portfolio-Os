import type { AppId } from "@/data/apps";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { contactEmail, githubProfile, socials } from "@/data/socials";

export type CommandAction = { type: "open"; appId: AppId } | { type: "clear" } | { type: "scan" };

export interface CommandResult {
  lines: string[];
  action?: CommandAction;
}

const HELP = [
  "Available commands:",
  "",
  "about",
  "experience",
  "projects",
  "skills",
  "contact",
  "resume",
  "github",
  "whoami",
  "neofetch",
  "files",
  "settings",
  "ls",
  "clear",
];

export function runCommand(raw: string, developerMode: boolean): CommandResult {
  const input = raw.trim();
  if (!input) return { lines: [] };

  const normalized = input.replace(/\s+/g, " ").toLowerCase();

  if (normalized === "help") {
    const extra = developerMode
      ? ["", "developer mode:", "diagnostics", "sudo hire aryan"]
      : [];
    return { lines: [...HELP, ...extra] };
  }

  if (normalized === "clear") return { lines: [], action: { type: "clear" } };

  if (normalized === "whoami") {
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

  if (normalized === "about") {
    return {
      lines: [
        `${profile.name} — ${profile.title} | ${profile.focus}`,
        "",
        profile.summary,
        "",
        `Location: ${profile.location}`,
        `Status: ${profile.status}`,
      ],
      action: { type: "open", appId: "about" },
    };
  }

  if (normalized === "experience") {
    return {
      lines: experience.flatMap((role) => [
        `${role.year}  ${role.company}`,
        `    ${role.role}`,
        `    ${role.start} – ${role.end}`,
        ...role.metrics.map((metric) => `    ${metric.value} ${metric.label}`),
        "",
      ]),
      action: { type: "open", appId: "experience" },
    };
  }

  if (normalized === "projects") {
    const featured = projects.filter((project) => project.featured);
    return {
      lines: featured.map(
        (project) =>
          `${project.name.padEnd(22, " ")} ${project.language ?? ""}  ${project.url}`,
      ),
      action: { type: "scan" },
    };
  }

  if (normalized === "skills") {
    return {
      lines: skills.flatMap((group) => [`${group.label}:`, `  ${group.items.join(", ")}`, ""]),
      action: { type: "open", appId: "skills" },
    };
  }

  if (normalized === "contact") {
    return {
      lines: [
        "Email:",
        contactEmail,
        "",
        githubProfile.url,
        ...socials.map((link) => `${link.label}: ${link.href}`),
      ],
      action: { type: "open", appId: "contact" },
    };
  }

  if (normalized === "resume") {
    return {
      lines: [
        `${profile.name} — ${profile.title}`,
        profile.summary,
        "",
        "Open resume.pdf or Recruiter Mode for the full document.",
      ],
      action: { type: "open", appId: "resume" },
    };
  }

  if (normalized === "github") {
    return {
      lines: [
        `@${githubProfile.username}`,
        githubProfile.bio,
        `${githubProfile.publicRepos} public repositories · ${githubProfile.followers} followers`,
        githubProfile.url,
      ],
      action: { type: "open", appId: "github" },
    };
  }

  if (normalized === "neofetch") {
    return { lines: neofetch() };
  }

  if (normalized === "sudo hire aryan") {
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
        "READY TO SHIP 🚀",
      ],
    };
  }

  if (normalized === "coffee") {
    return { lines: ["Loading coffee................... FAILED", "Kernel refuses. Developer is already caffeinated."] };
  }

  if (normalized === "diagnostics" || normalized === "sysinfo") {
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

  if (normalized === "ls") {
    return {
      lines: [
        "about.exe",
        "experience.exe",
        "projects.exe",
        "skills.exe",
        "terminal.exe",
        "resume.pdf",
        "github.exe",
        "contact.exe",
        "files",
        "settings",
      ],
    };
  }

  if (normalized === "files") {
    return { lines: ["Opening home directory."], action: { type: "open", appId: "files" } };
  }

  if (normalized === "settings") {
    return { lines: ["Opening settings."], action: { type: "open", appId: "settings" } };
  }

  return { lines: [`command not found: ${input}`, 'Type "help" for available commands.'] };
}

function neofetch() {
  return [
    "    /\\_/\\",
    "   ( o.o )",
    "    > ^ <",
    "",
    "Aryan",
    "",
    "OS:         Aryan",
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
