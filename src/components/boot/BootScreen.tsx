import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useOsStore } from "@/store/osStore";

const BOOT_LINES = [
  "Initializing kernel............. OK",
  "Loading developer profile....... OK",
  "Loading experience.............. OK",
  "Loading projects................ OK",
  "Loading systems................. OK",
  "Connecting to GitHub............ OK",
];

export function BootScreen() {
  const enterDesktop = useOsStore((s) => s.enterDesktop);
  const setRecruiterMode = useOsStore((s) => s.setRecruiterMode);
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(reduced ? BOOT_LINES.length : 0);
  const complete = visible >= BOOT_LINES.length;

  useEffect(() => {
    if (reduced) {
      const timer = window.setTimeout(enterDesktop, 450);
      return () => window.clearTimeout(timer);
    }

    if (complete) {
      const timer = window.setTimeout(enterDesktop, 380);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => setVisible((count) => count + 1), 260);
    return () => window.clearTimeout(timer);
  }, [complete, enterDesktop, reduced, visible]);

  useEffect(() => {
    const skip = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === "Escape" || event.key === " ") {
        event.preventDefault();
        enterDesktop();
      }
    };
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, [enterDesktop]);

  return (
    <section
      className="relative flex h-full min-h-dvh flex-col overflow-hidden bg-[#07090d] text-os-text"
      aria-label="ARYAN boot"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true">
        <div className="horizon-grid absolute -bottom-[40%] left-[-15%] h-[85%] w-[130%] opacity-25" />
        <div className="noise absolute inset-0" />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-1 flex-col justify-between px-4 py-7 sm:px-14 sm:py-10">
        <div>
          <p className="font-mono text-[11px] tracking-[0.28em] text-os-accent">KERNEL</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">ARYAN</h1>
          <p className="mt-1 font-mono text-sm text-os-muted">v2.0</p>
        </div>

        <div className="max-w-xl font-mono text-[13px] leading-7 text-os-text/90 sm:text-sm">
          {BOOT_LINES.slice(0, visible).map((line) => (
            <p key={line}>{line}</p>
          ))}
          {complete && <p className="mt-4 text-os-accent">Starting desktop...</p>}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={enterDesktop}
            className="rounded-md border border-white/12 px-4 py-2 font-mono text-xs text-os-muted transition hover:border-white/25 hover:text-os-text"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={() => setRecruiterMode(true)}
            className="rounded-md px-4 py-2 font-mono text-xs text-os-muted transition hover:text-os-text"
          >
            Recruiter Mode
          </button>
          <span className="font-mono text-[11px] text-os-muted/70">Enter to continue</span>
        </div>
      </div>
    </section>
  );
}
