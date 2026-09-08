import type { ReactNode } from "react";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { socials } from "@/data/socials";
import { downloadResume } from "@/lib/resumeDownload";
import { useOsStore } from "@/store/osStore";

export function RecruiterMode() {
  const setRecruiterMode = useOsStore((s) => s.setRecruiterMode);
  const enterDesktop = useOsStore((s) => s.enterDesktop);
  const phase = useOsStore((s) => s.phase);

  return (
    <div id="recruiter" className="fixed inset-0 z-[100] overflow-auto bg-os-void text-os-text">
      <div className="mx-auto max-w-3xl px-5 py-8 sm:py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-os-accent">Recruiter Mode</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={downloadResume}
              className="border border-os-line px-3 py-1.5 text-xs"
            >
              Download resume
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="border border-os-line px-3 py-1.5 text-xs"
            >
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={() => {
                setRecruiterMode(false);
                if (phase !== "desktop") enterDesktop();
              }}
              className="border border-os-accent/40 px-3 py-1.5 text-xs"
            >
              Enter desktop
            </button>
            <button
              type="button"
              onClick={() => setRecruiterMode(false)}
              className="border border-os-line px-3 py-1.5 text-xs text-os-muted"
            >
              Close
            </button>
          </div>
        </div>

        <header className="border-b border-white/10 pb-6">
          <h1 className="font-display text-4xl font-medium">{profile.name}</h1>
          <p className="mt-2 text-os-muted">
            {profile.title} · {profile.focus}
          </p>
          <p className="mt-1 text-sm text-os-muted">{profile.location}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {socials.map((link) => (
              <a key={link.id} href={link.href} target="_blank" rel="noreferrer" className="text-os-accent hover:underline">
                {link.label}
              </a>
            ))}
          </div>
        </header>

        <Section title="Summary">
          <p className="leading-relaxed text-os-text/90">{profile.summary}</p>
        </Section>

        <Section title="Experience">
          <div className="space-y-6">
            {experience.map((role) => (
              <article key={role.id}>
                <h3 className="font-medium">{role.company}</h3>
                <p className="text-sm text-os-muted">
                  {role.role} · {role.start} – {role.end}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-os-text/90">
                  {role.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section title="Selected projects">
          <div className="space-y-4">
            {projects
              .filter((project) => project.featured)
              .map((project) => (
                <article key={project.id}>
                  <h3 className="font-medium">{project.name}</h3>
                  {project.description && (
                    <p className="mt-1 text-sm text-os-text/90">{project.description}</p>
                  )}
                  <p className="mt-1 text-xs text-os-muted">{project.technologies.join(" · ")}</p>
                  <div className="mt-1 flex gap-3 text-sm">
                    <a href={project.url} target="_blank" rel="noreferrer" className="text-os-accent hover:underline">
                      GitHub
                    </a>
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noreferrer" className="text-os-accent hover:underline">
                        Live demo
                      </a>
                    )}
                  </div>
                </article>
              ))}
          </div>
        </Section>

        <Section title="Skills">
          <div className="grid gap-3 sm:grid-cols-2">
            {skills.map((group) => (
              <div key={group.id}>
                <p className="text-sm font-medium">{group.label}</p>
                <p className="text-sm text-os-muted">{group.items.join(", ")}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Education">
          <p className="font-medium">{profile.education.degree}</p>
          <p className="text-sm text-os-muted">
            {profile.education.school} · {profile.education.start} – {profile.education.end} · CGPA{" "}
            {profile.education.cgpa}
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-white/10 py-6">
      <h2 className="mb-3 text-xs text-os-muted">{title}</h2>
      {children}
    </section>
  );
}
