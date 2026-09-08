import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useOsStore } from "@/store/osStore";
import { OsMark } from "@/components/icons/AppIcons";

const BOOT_LINES = [
  { label: "Mounting /home/arya7n", result: "OK" as const },
  { label: "Loading developer profile", result: "OK" as const },
  { label: "Indexing experience", result: "OK" as const },
  { label: "Indexing projects", result: "OK" as const },
  { label: "Starting window manager", result: "OK" as const },
  { label: "Loading coffee", result: "FAILED" as const },
];

export function BootScreen() {
  const enterDesktop = useOsStore((s) => s.enterDesktop);
  const setRecruiterMode = useOsStore((s) => s.setRecruiterMode);
  const reducedMotion = usePrefersReducedMotion();
  const [visibleCount, setVisibleCount] = useState(reducedMotion ? BOOT_LINES.length : 0);
  const [stage, setStage] = useState<"logs" | "identity">(reducedMotion ? "identity" : "logs");

  const logsDone = visibleCount >= BOOT_LINES.length;

  useEffect(() => {
    if (reducedMotion) return;
    if (visibleCount >= BOOT_LINES.length) {
      const timer = window.setTimeout(() => setStage("identity"), 700);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setVisibleCount((count) => count + 1), 320);
    return () => window.clearTimeout(timer);
  }, [visibleCount, reducedMotion]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" && stage === "identity") {
        enterDesktop();
      }
      if (event.key === "Escape" || event.key.toLowerCase() === "s") {
        if (stage === "logs") {
          setVisibleCount(BOOT_LINES.length);
          setStage("identity");
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enterDesktop, stage]);

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <motion.section
      className="wall-forge relative flex h-full min-h-dvh flex-col overflow-hidden text-os-text"
      aria-label="Aryan OS boot sequence"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="noise absolute inset-0" />
        <div className="scanlines absolute inset-0" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-5 py-4 font-mono text-[11px] text-os-muted">
        <span>Aryan OS v1.0</span>
        <span>workstation</span>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-8">
        {stage === "logs" ? (
          <div className="font-mono text-[13px] leading-7 sm:text-sm">
            <p className="mb-6 text-os-accent">boot — aryan os</p>
            {BOOT_LINES.slice(0, visibleCount).map((line) => (
              <p key={line.label} className="flex flex-wrap gap-x-3">
                <span className="text-os-muted">{line.label}</span>
                <span className="hidden text-os-muted/50 sm:inline">
                  {".".repeat(Math.max(4, 32 - line.label.length))}
                </span>
                <span className={line.result === "OK" ? "text-os-ok" : "text-os-fail"}>{line.result}</span>
              </p>
            ))}
            {logsDone && <p className="mt-6 text-os-text boot-caret">Starting desktop…</p>}
          </div>
        ) : (
          <motion.div initial={reducedMotion ? false : { y: 12 }} animate={{ y: 0 }} className="text-center">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center border border-os-line bg-os-panel text-os-accent">
              <OsMark className="h-10 w-10" />
            </div>
            <p className="font-mono text-xs text-os-accent">session ready</p>
            <h1 className="mt-3 font-display text-5xl font-medium sm:text-7xl">Aryan OS</h1>
            <p className="mt-4 text-base text-os-muted">Full stack developer · backend-focused</p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={enterDesktop}
                className="min-w-48 border border-os-accent bg-os-accent/15 px-8 py-3 text-sm font-medium text-os-text transition hover:bg-os-accent/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-os-accent"
              >
                Enter desktop
              </button>
              <button
                type="button"
                onClick={() => setRecruiterMode(true)}
                className="min-w-48 border border-os-line px-8 py-3 text-sm text-os-muted transition hover:border-os-accent hover:text-os-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-os-accent"
              >
                Recruiter Mode
              </button>
            </div>
            <p className="mt-6 font-mono text-[11px] text-os-muted">Enter continues · Esc skips boot</p>
          </motion.div>
        )}
      </div>

      <footer className="relative z-10 px-5 py-4 text-center font-mono text-[10px] text-os-muted">
        © {year} Aryan
      </footer>
    </motion.section>
  );
}
