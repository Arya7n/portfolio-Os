import { useEffect } from "react";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { socials } from "@/data/socials";
import { downloadResume } from "@/lib/resumeDownload";
import { useOsStore } from "@/store/osStore";

let resumeNotified = false;

export function ResumeApp() {
  const setRecruiterMode = useOsStore((s) => s.setRecruiterMode);
  const pushNotification = useOsStore((s) => s.pushNotification);
  const featured = projects.filter((project) => project.featured);

  useEffect(() => {
    if (resumeNotified) return;
    resumeNotified = true;
    pushNotification("Resume", "Resume loaded.");
  }, [pushNotification]);

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex flex-wrap gap-2 border-b border-white/8 px-4 py-3">
        <button
          type="button"
          onClick={downloadResume}
          className="rounded-full border border-os-accent/40 bg-os-accent/10 px-3 py-1.5 font-mono text-[11px] tracking-[0.12em]"
        >
          Download resume
        </button>
        <button
          type="button"
          onClick={() => setRecruiterMode(true)}
          className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-os-muted hover:text-os-text"
        >
          Recruiter Mode
        </button>
      </div>

      <article className="mx-auto w-full max-w-2xl space-y-6 p-5 text-sm">
        <header>
          <h3 className="font-display text-3xl font-bold tracking-[0.12em]">{profile.name}</h3>
          <p className="mt-1 text-os-muted">
            {profile.title} · {profile.focus}
          </p>
          <p className="text-xs text-os-muted">{profile.location}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            {socials.map((link) => (
              <a key={link.id} href={link.href} target="_blank" rel="noreferrer" className="text-os-accent hover:underline">
                {link.label}
              </a>
            ))}
          </div>
        </header>

        <section>
          <h4 className="font-mono text-[10px] tracking-[0.22em] text-os-muted">SUMMARY</h4>
          <p className="mt-2 leading-relaxed text-os-text/90">{profile.summary}</p>
        </section>

        <section>
          <h4 className="font-mono text-[10px] tracking-[0.22em] text-os-muted">EXPERIENCE</h4>
          <div className="mt-3 space-y-4">
            {experience.map((role) => (
              <div key={role.id}>
                <p className="font-medium">{role.company}</p>
                <p className="text-xs text-os-muted">
                  {role.role} · {role.start} – {role.end}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-os-text/90">
                  {role.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="font-mono text-[10px] tracking-[0.22em] text-os-muted">PROJECTS</h4>
          <div className="mt-3 space-y-3">
            {featured.map((project) => (
              <div key={project.id}>
                <p className="font-medium">{project.name}</p>
                {project.description && (
                  <p className="mt-1 text-os-text/90">{project.description}</p>
                )}
                <p className="mt-1 text-xs text-os-muted">{project.technologies.join(" · ")}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="font-mono text-[10px] tracking-[0.22em] text-os-muted">SKILLS</h4>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {skills.map((group) => (
              <p key={group.id} className="text-os-text/90">
                <span className="text-os-muted">{group.label}: </span>
                {group.items.join(", ")}
              </p>
            ))}
          </div>
        </section>

        <section>
          <h4 className="font-mono text-[10px] tracking-[0.22em] text-os-muted">EDUCATION</h4>
          <p className="mt-2 font-medium">{profile.education.degree}</p>
          <p className="text-xs text-os-muted">
            {profile.education.school} · {profile.education.start} – {profile.education.end} · CGPA{" "}
            {profile.education.cgpa}
          </p>
        </section>
      </article>
    </div>
  );
}
