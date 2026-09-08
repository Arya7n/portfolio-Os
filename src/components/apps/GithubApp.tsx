import { useEffect } from "react";
import { projects } from "@/data/projects";
import { githubProfile } from "@/data/socials";
import { useOsStore } from "@/store/osStore";

function languagePresence() {
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const language of project.languages) {
      counts.set(language, (counts.get(language) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

let githubNotified = false;

export default function GithubApp() {
  const languages = languagePresence();
  const featured = projects.filter((project) => project.featured);
  const max = languages[0]?.[1] ?? 1;
  const pushNotification = useOsStore((s) => s.pushNotification);

  useEffect(() => {
    if (githubNotified) return;
    githubNotified = true;
    pushNotification("GitHub", "Repository index loaded.");
  }, [pushNotification]);

  return (
    <div className="space-y-5 p-5 text-sm">
      <div className="flex items-center gap-4">
        <img
          src={githubProfile.avatar}
          alt={`${githubProfile.username} GitHub avatar`}
          width={56}
          height={56}
          className="h-14 w-14 rounded-xl border border-white/10"
        />
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-os-muted">GITHUB</p>
          <h3 className="mt-1 font-display text-2xl font-medium">@{githubProfile.username}</h3>
          <p className="text-xs text-os-muted">{githubProfile.bio}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat label="Public repos" value={String(githubProfile.publicRepos)} />
        <Stat label="Followers" value={String(githubProfile.followers)} />
        <Stat label="Catalogued here" value={String(projects.length)} />
      </div>

      <section>
        <h4 className="text-xs text-os-muted">Languages</h4>
        <p className="mt-1 text-[11px] text-os-muted">
          Presence across catalogued repositories — not GitHub linguist byte counts.
        </p>
        <ul className="mt-3 space-y-2">
          {languages.map(([language, count]) => (
            <li key={language}>
              <div className="mb-1 flex justify-between text-xs">
                <span>{language}</span>
                <span className="text-os-muted">{count}</span>
              </div>
              <span className="block h-1 overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-full rounded-full bg-os-accent/80"
                  style={{ width: `${Math.round((count / max) * 100)}%` }}
                />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="text-xs text-os-muted">Selected</h4>
        <ul className="mt-2 space-y-2">
          {featured.map((project) => (
            <li key={project.id} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <div className="flex items-baseline justify-between gap-2">
                <a href={project.url} target="_blank" rel="noreferrer" className="font-medium hover:text-os-accent">
                  {project.name}
                </a>
                <span className="font-mono text-[10px] text-os-muted">{project.language}</span>
              </div>
              {project.description && (
                <p className="mt-1 text-xs text-os-muted">{project.description}</p>
              )}
              <p className="mt-2 text-[11px] text-os-muted">{project.technologies.join(" · ")}</p>
              <div className="mt-2 flex gap-3 text-[12px]">
                <a href={project.url} target="_blank" rel="noreferrer" className="text-os-accent hover:underline">
                  GitHub
                </a>
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noreferrer" className="text-os-accent hover:underline">
                    Demo
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <a
        href={githubProfile.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex rounded-full border border-os-accent/30 bg-os-accent/10 px-3 py-1.5 text-xs tracking-[0.12em]"
      >
        Open GitHub profile ↗
      </a>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
      <p className="font-display text-xl font-semibold text-os-accent">{value}</p>
      <p className="text-[11px] text-os-muted">{label}</p>
    </div>
  );
}
