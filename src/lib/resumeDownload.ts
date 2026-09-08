import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { socials } from "@/data/socials";

export function buildResumeText() {
  const featured = projects.filter((project) => project.featured);
  const links = socials.map((link) => `${link.label}: ${link.href}`).join("\n");

  return [
    `${profile.name}`,
    `${profile.title} | ${profile.focus}`,
    profile.location,
    links,
    "",
    "SUMMARY",
    profile.summary,
    "",
    "EXPERIENCE",
    ...experience.flatMap((role) => [
      `${role.company} — ${role.role}`,
      `${role.start} – ${role.end}`,
      ...role.highlights.map((item) => `• ${item}`),
      `Tech: ${role.technologies.join(", ")}`,
      "",
    ]),
    "PROJECTS",
    ...featured.flatMap((project) => [
      project.name,
      project.description || project.url,
      `Tech: ${project.technologies.join(", ")}`,
      project.url,
      project.demoUrl ?? "",
      "",
    ]),
    "SKILLS",
    ...skills.map((group) => `${group.label}: ${group.items.join(", ")}`),
    "",
    "EDUCATION",
    `${profile.education.degree}`,
    `${profile.education.school}`,
    `${profile.education.start} – ${profile.education.end} · CGPA ${profile.education.cgpa}`,
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

export function downloadResume() {
  const blob = new Blob([buildResumeText()], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "Aryan-Resume.txt";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
