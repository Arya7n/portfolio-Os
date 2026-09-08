import { getApp, type AppId } from "@/data/apps";
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
        This module is scheduled for a later system update. Experience, projects, skills, and resume
        are already online.
      </p>

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
