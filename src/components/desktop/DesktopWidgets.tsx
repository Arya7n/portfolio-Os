import type { AppId } from "@/data/apps";
import { cn } from "@/lib/cn";
import { useClock } from "@/hooks/useClock";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useOsStore } from "@/store/osStore";

const PROCESSES: Array<{
  pid: string;
  cmd: string;
  appId: AppId;
}> = [
  { pid: "14", cmd: "nestjs", appId: "skills" },
  { pid: "15", cmd: "redis", appId: "skills" },
  { pid: "16", cmd: "postgres", appId: "skills" },
  { pid: "22", cmd: "devtunnel", appId: "projects" },
];

export function DesktopWidgets() {
  return (
    <aside
      className="pointer-events-none z-10 flex min-h-0 w-full min-w-0 flex-1 flex-col gap-3 px-3 pb-1 pt-1 md:absolute md:inset-y-0 md:right-0 md:w-[min(42vw,340px)] md:items-end md:justify-between md:gap-5 md:px-5 md:py-5 lg:w-[340px] lg:px-7"
      aria-label="Desktop widgets"
    >
      <DesktopClock />
      <div className="flex min-h-0 w-full min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-end md:flex-1 md:flex-col md:items-end md:justify-end">
        <StickyNote />
        <ProcessStrip />
      </div>
    </aside>
  );
}

function DesktopClock() {
  const { now, time } = useClock();
  const longDate = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const shortDate = now.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="pointer-events-none w-full select-none text-left text-os-text md:text-right">
      <p className="font-display text-[clamp(2.25rem,8vw,4.5rem)] font-semibold leading-none tracking-tight tabular-nums drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
        {time}
      </p>
      <p className="mt-1.5 text-[13px] text-os-text/80 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] sm:text-sm">
        <span className="md:hidden">{shortDate}</span>
        <span className="hidden md:inline">{longDate}</span>
      </p>
    </div>
  );
}

function StickyNote() {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        "pointer-events-auto w-full min-w-0 rounded-[2px] bg-[#d7c4a3] px-3 py-2.5 text-[#2a241c] shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:max-w-[240px] md:w-[210px] md:px-3.5 md:py-3",
        !reduced && "md:-rotate-[2.5deg]",
      )}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <span className="mx-auto mb-2 hidden h-3 w-12 bg-black/10 md:block" aria-hidden="true" />
      <p className="font-mono text-[10px] tracking-[0.16em] text-[#6b5c48]">NOTE</p>
      <p className="mt-1.5 text-[13px] leading-relaxed">
        open Terminal
        <br />
        <span className="font-mono text-[12px]">$ cat resume.txt</span>
      </p>
      <p className="mt-2.5 font-mono text-[11px] leading-5 text-[#5c5346]">
        <span className="md:hidden">Dock · Terminal</span>
        <span className="hidden md:inline">
          Ctrl/Cmd + K · search
          <br />
          Ctrl/Cmd + ` · terminal
        </span>
      </p>
    </div>
  );
}

function ProcessStrip() {
  const openApp = useOsStore((s) => s.openApp);

  return (
    <div
      className="pointer-events-auto w-full min-w-0 rounded-2xl border border-white/10 bg-black/35 px-3 py-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.28)] backdrop-blur-md sm:max-w-[280px] md:w-[240px]"
      onMouseDown={(event) => event.stopPropagation()}
    >
      <p className="mb-1.5 font-mono text-[10px] tracking-[0.18em] text-os-muted">PS</p>
      <ul className="grid grid-cols-2 gap-x-2 font-mono text-[11px] leading-6 sm:grid-cols-1">
        {PROCESSES.map((proc) => (
          <li key={proc.cmd}>
            <button
              type="button"
              className="flex w-full min-w-0 items-center gap-2 rounded-md px-1 text-left text-os-text/85 hover:bg-white/8 hover:text-os-text"
              onClick={() => openApp(proc.appId)}
            >
              <span className="hidden w-5 shrink-0 text-os-muted sm:inline">{proc.pid}</span>
              <span className="min-w-0 flex-1 truncate">{proc.cmd}</span>
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-os-ok" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
