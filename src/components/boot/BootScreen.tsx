import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useOsStore } from "@/store/osStore";
import { OsMark } from "@/components/icons/AppIcons";

const BOOT_LINES = [
  { label: "Initializing kernel", result: "OK" as const },
  { label: "Loading developer profile", result: "OK" as const },
  { label: "Loading experience", result: "OK" as const },
  { label: "Loading projects", result: "OK" as const },
  { label: "Loading systems", result: "OK" as const },
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
      className="relative flex h-full min-h-dvh flex-col overflow-hidden bg-os-void text-os-text"
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(8px)", scale: 1.02 }}
      transition={{ duration: 0.45 }}
      aria-label="ARYAN OS boot sequence"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(142,180,255,0.12),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(110,231,183,0.06),transparent_28%)]" />
        <div className="noise absolute inset-0" />
        <div className="scanlines absolute inset-0" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-5 py-4 text-[11px] tracking-[0.22em] text-os-muted uppercase">
        <span>ARYAN OS v1.0</span>
        <span>kernel · x64</span>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-8">
        {stage === "logs" ? (
          <div className="font-mono text-[13px] leading-7 sm:text-sm">
            <p className="mb-6 tracking-[0.28em] text-os-accent">ARYAN OS v1.0</p>
            {BOOT_LINES.slice(0, visibleCount).map((line) => (
              <p key={line.label} className="flex flex-wrap gap-x-3">
                <span className="text-os-muted">{line.label}</span>
                <span className="hidden text-os-muted/50 sm:inline">
                  {".".repeat(Math.max(4, 32 - line.label.length))}
                </span>
                <span
                  className={
                    line.result === "OK" ? "text-os-ok" : "text-os-fail"
                  }
                >
                  {line.result}
                </span>
              </p>
            ))}
            {logsDone && <p className="mt-6 text-os-text boot-caret">Starting ARYAN OS...</p>}
          </div>
        ) : (
          <motion.div
            initial={reducedMotion ? false : { y: 12 }}
            animate={{ y: 0 }}
            className="text-center"
          >
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-os-line bg-os-panel text-os-accent">
              <OsMark className="h-10 w-10" />
            </div>
            <p className="font-mono text-xs tracking-[0.42em] text-os-accent">SYSTEM READY</p>
            <h1 className="mt-4 font-display text-5xl font-extrabold tracking-[0.12em] sm:text-7xl">
              ARYAN OS
            </h1>
            <p className="mt-5 text-sm tracking-[0.28em] text-os-muted sm:text-base">
              FULL STACK DEVELOPER
            </p>
            <p className="mt-1 text-sm tracking-[0.32em] text-os-accent/90">BACKEND-FOCUSED</p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={enterDesktop}
                className="min-w-48 rounded-full border border-os-accent/40 bg-os-accent/10 px-8 py-3 text-sm font-medium tracking-[0.22em] text-os-text transition hover:border-os-accent hover:bg-os-accent/18 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-os-accent"
              >
                ENTER SYSTEM
              </button>
              <button
                type="button"
                onClick={() => setRecruiterMode(true)}
                className="min-w-48 rounded-full border border-os-line px-8 py-3 text-sm tracking-[0.18em] text-os-muted transition hover:border-os-accent/40 hover:text-os-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-os-accent"
              >
                RECRUITER MODE
              </button>
            </div>
            <p className="mt-6 font-mono text-[11px] text-os-muted/80">
              Press Enter to continue · Esc skips boot
            </p>
          </motion.div>
        )}
      </div>

      <footer className="relative z-10 px-5 py-4 text-center font-mono text-[10px] tracking-[0.18em] text-os-muted/70">
        © {year} ARYAN · BUILD 1.0.0
      </footer>
    </motion.section>
  );
}
