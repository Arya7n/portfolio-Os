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
      className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-[min(100%,340px)] flex-col items-end justify-between px-6 py-6 pr-7"
      aria-label="Desktop widgets"
    >
      <DesktopClock />
      <StickyNote />
      <ProcessStrip />
    </aside>
  );
}

function DesktopClock() {
  const { now, time } = useClock();
  const date = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="pointer-events-none select-none text-right text-os-text">
      <p className="font-display text-[64px] font-semibold leading-none tracking-tight tabular-nums drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:text-[72px]">
        {time}
      </p>
      <p className="mt-2 text-sm text-os-text/80 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] sm:text-[15px]">
        {date}
      </p>
    </div>
  );
}

function StickyNote() {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        "pointer-events-auto w-[210px] rounded-[2px] bg-[#d7c4a3] px-3.5 py-3 text-[#2a241c] shadow-[0_16px_40px_rgba(0,0,0,0.35)]",
        !reduced && "-rotate-[2.5deg]",
      )}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <span className="mx-auto mb-2 block h-3 w-12 bg-black/10" aria-hidden="true" />
      <p className="font-mono text-[10px] tracking-[0.16em] text-[#6b5c48]">NOTE</p>
      <p className="mt-2 text-[13px] leading-relaxed">
        open Terminal
        <br />
        <span className="font-mono text-[12px]">$ cat resume.txt</span>
      </p>
      <p className="mt-3 font-mono text-[11px] leading-5 text-[#5c5346]">
        Ctrl/Cmd + K · search
        <br />
        Ctrl/Cmd + ` · terminal
      </p>
    </div>
  );
}

function ProcessStrip() {
  const openApp = useOsStore((s) => s.openApp);

  return (
    <div
      className="pointer-events-auto w-[240px] rounded-2xl border border-white/10 bg-black/35 px-3 py-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.28)] backdrop-blur-md"
      onMouseDown={(event) => event.stopPropagation()}
    >
      <p className="mb-1.5 font-mono text-[10px] tracking-[0.18em] text-os-muted">PS</p>
      <ul className="font-mono text-[11px] leading-6">
        {PROCESSES.map((proc) => (
          <li key={proc.cmd}>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-1 text-left text-os-text/85 hover:bg-white/8 hover:text-os-text"
              onClick={() => openApp(proc.appId)}
            >
              <span className="w-5 text-os-muted">{proc.pid}</span>
              <span className="flex-1">{proc.cmd}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-os-ok" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
