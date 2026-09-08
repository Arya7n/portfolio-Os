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
      <div>
        <p className="font-mono text-[11px] tracking-[0.2em] text-os-muted">SYSTEM PROFILE</p>
        <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight">{profile.name}</h3>
        <p className="mt-2 text-os-muted">
          {profile.title}
          <span className="mx-2 text-os-muted/50">|</span>
          {profile.focus}
        </p>
      </div>

      <p className="leading-relaxed text-os-text/90">{profile.summary}</p>

      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-os-muted">FOCUS</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {profile.specializations.map((item) => (
            <li key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-os-muted">TECHNOLOGIES</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {profile.coreStack.map((item) => (
            <li key={item} className="rounded-full border border-os-accent/25 bg-os-accent/8 px-2.5 py-1 text-xs">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Meta label="Education" value={profile.education.degree} detail={profile.education.school} />
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
            className="rounded-full border border-white/12 px-3 py-1.5 text-xs hover:bg-white/8"
          >
            {link.label}
          </a>
        ))}
        <button
          type="button"
          onClick={() => openApp("github")}
          className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-os-muted hover:text-os-text"
        >
          github.exe
        </button>
        <button
          type="button"
          onClick={() => setRecruiterMode(true)}
          className="rounded-full bg-os-accent px-3 py-1.5 text-xs font-medium text-white"
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
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="font-mono text-[10px] tracking-[0.16em] text-os-muted">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
      <p className="mt-0.5 text-xs text-os-muted">{detail}</p>
    </div>
  );
}
