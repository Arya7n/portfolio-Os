import { useEffect } from "react";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { githubProfile } from "@/data/socials";
import { WallpaperLayer } from "@/components/desktop/WallpaperLayer";
import { useClock } from "@/hooks/useClock";
import { useOsStore } from "@/store/osStore";

export function BootScreen() {
  const enterDesktop = useOsStore((s) => s.enterDesktop);
  const setRecruiterMode = useOsStore((s) => s.setRecruiterMode);
  const { time, date } = useClock();
  const current = experience.find((role) => role.current) ?? experience[0];
  const blurb = profile.summary.split(". ")[0] + ".";

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter") enterDesktop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enterDesktop]);

  return (
    <section className="relative flex h-full min-h-dvh flex-col overflow-hidden text-os-text" aria-label="Welcome">
      <WallpaperLayer dim />

      <div className="relative z-10 flex min-h-dvh flex-1 flex-col justify-between px-6 py-6 sm:px-14 sm:py-10">
        <header className="flex items-start justify-between gap-4 text-sm text-os-muted">
          <span>{profile.location}</span>
          <time dateTime={new Date().toISOString()} className="text-right tabular-nums">
            <span className="block font-display text-2xl text-os-text sm:text-3xl">{time}</span>
            <span className="text-xs">{date}</span>
          </time>
        </header>

        <div className="max-w-xl">
          <p className="text-sm text-os-accent">{profile.focus}</p>
          <h1 className="mt-2 font-display text-6xl font-semibold tracking-tight sm:text-8xl">Aryan</h1>
          <p className="mt-4 text-lg text-os-muted">{profile.title}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-os-text/85">{blurb}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={enterDesktop}
              className="rounded-full bg-os-accent px-7 py-3 text-sm font-medium text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-os-accent"
            >
              Enter desktop
            </button>
            <button
              type="button"
              onClick={() => setRecruiterMode(true)}
              className="rounded-full border border-white/15 px-7 py-3 text-sm text-os-muted transition hover:bg-white/8 hover:text-os-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-os-accent"
            >
              Recruiter Mode
            </button>
          </div>
        </div>

        <footer className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-os-muted">
          <span>
            {current.role} · {current.company}
          </span>
          <a href={githubProfile.url} target="_blank" rel="noreferrer" className="hover:text-os-text">
            github.com/{githubProfile.username}
          </a>
          <span>Press Enter</span>
        </footer>
      </div>
    </section>
  );
}
