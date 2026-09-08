import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { socials } from "@/data/socials";
import { githubProfile } from "@/data/socials";
import { useOsStore } from "@/store/osStore";

export function AboutApp() {
  const current = experience.find((role) => role.current) ?? experience[0];
  const setRecruiterMode = useOsStore((s) => s.setRecruiterMode);
  const openApp = useOsStore((s) => s.openApp);

  return (
    <div className="space-y-6 p-5 text-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-os-accent">About</p>
          <h3 className="mt-1 font-display text-3xl font-medium">{profile.name}</h3>
          <p className="mt-2 text-os-muted">{profile.title}</p>
          <p className="text-os-accent">{profile.focus}</p>
        </div>
        <span className="border border-os-ok/40 bg-os-ok/10 px-2.5 py-1 font-mono text-[10px] text-os-ok">
          online
        </span>
      </div>

      <p className="leading-relaxed text-os-text/90">{profile.summary}</p>

      <div>
        <p className="text-xs text-os-muted">Focus</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {profile.specializations.map((item) => (
            <li
              key={item}
              className="border border-os-line bg-os-raised/50 px-2.5 py-1 text-xs text-os-text/90"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Meta label="Education" value={`${profile.education.degree}`} detail={profile.education.school} />
        <Meta
          label="Term"
          value={`${profile.education.start} – ${profile.education.end}`}
          detail={`CGPA ${profile.education.cgpa}`}
        />
        <Meta label="Now" value={current.company} detail={current.role} />
        <Meta label="Location" value={profile.location} detail={profile.status} />
      </div>

      <div className="flex flex-wrap gap-2">
        {socials.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="border border-os-accent/40 bg-os-accent/10 px-3 py-1.5 text-xs text-os-text transition hover:border-os-accent"
          >
            {link.label} ↗
          </a>
        ))}
        <button
          type="button"
          onClick={() => openApp("github")}
          className="border border-os-line px-3 py-1.5 text-xs text-os-muted hover:text-os-text"
        >
          github.exe
        </button>
        <button
          type="button"
          onClick={() => setRecruiterMode(true)}
          className="border border-os-line px-3 py-1.5 text-xs text-os-muted hover:text-os-text"
        >
          Recruiter Mode
        </button>
      </div>

      <p className="font-mono text-[11px] text-os-muted">
        @{githubProfile.username} · {githubProfile.publicRepos} public repositories
      </p>
    </div>
  );
}

function Meta({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="border border-os-line bg-os-raised/40 p-3">
      <p className="text-[11px] text-os-muted">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
      <p className="mt-0.5 text-xs text-os-muted">{detail}</p>
    </div>
  );
}
