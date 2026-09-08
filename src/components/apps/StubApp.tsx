import { getApp, type AppId } from "@/data/apps";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { githubProfile } from "@/data/socials";
import { useOsStore } from "@/store/osStore";

export function StubApp({ appId }: { appId: AppId }) {
  const app = getApp(appId);
  const setRecruiterMode = useOsStore((s) => s.setRecruiterMode);

  return (
    <div className="space-y-5 p-5">
      <div>
        <p className="font-mono text-[10px] tracking-[0.24em] text-os-accent">MODULE</p>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-wide">{app.filename}</h3>
        <p className="mt-1 text-sm text-os-muted">{app.description}</p>
      </div>

      <p className="rounded-xl border border-white/8 bg-white/[0.03] p-3 font-mono text-xs leading-relaxed text-os-muted">
        Kernel module staged for a later system update. Core identity is live in about.exe. Recruiter
        Mode has the full scan-friendly resume.
      </p>

      {appId === "experience" && (
        <ul className="space-y-3">
          {experience.map((role) => (
            <li key={role.id} className="border-l border-os-accent/40 pl-3">
              <p className="text-sm font-medium">{role.company}</p>
              <p className="text-xs text-os-muted">
                {role.role} · {role.start} – {role.end}
              </p>
            </li>
          ))}
        </ul>
      )}

      {appId === "projects" && (
        <ul className="space-y-2">
          {projects
            .filter((project) => project.featured)
            .map((project) => (
              <li key={project.id} className="flex items-baseline justify-between gap-3">
                <span>{project.name}</span>
                <span className="font-mono text-[11px] text-os-muted">{project.language}</span>
              </li>
            ))}
        </ul>
      )}

      {appId === "skills" && (
        <div className="flex flex-wrap gap-2">
          {skills.flatMap((group) => group.items).slice(0, 14).map((item) => (
            <span key={item} className="rounded-full border border-white/10 px-2.5 py-1 text-xs">
              {item}
            </span>
          ))}
        </div>
      )}

      {appId === "github" && (
        <div className="space-y-2 text-sm">
          <p>@{githubProfile.username}</p>
          <p className="text-os-muted">{githubProfile.bio}</p>
          <a
            href={githubProfile.url}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-os-accent hover:underline"
          >
            Open GitHub profile ↗
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setRecruiterMode(true)}
        className="rounded-full border border-os-accent/30 px-4 py-2 text-xs tracking-[0.16em] text-os-text"
      >
        OPEN RECRUITER MODE
      </button>
    </div>
  );
}
