import { Wifi } from "lucide-react";
import { OsMark } from "@/components/icons/AppIcons";
import { useClock } from "@/hooks/useClock";
import { cn } from "@/lib/cn";
import { useOsStore } from "@/store/osStore";

export function TopBar() {
  const { time, date } = useClock();
  const setRecruiterMode = useOsStore((s) => s.setRecruiterMode);
  const windowCount = useOsStore((s) => s.windows.length);

  return (
    <header className="relative z-40 flex h-10 items-center justify-between border-b border-white/8 bg-black/35 px-3 backdrop-blur-xl sm:px-4">
      <div className="flex items-center gap-2 text-os-accent">
        <OsMark className="h-4 w-4" />
        <span className="font-display text-[13px] font-semibold tracking-[0.22em]">ARYAN OS</span>
        <span className="hidden font-mono text-[10px] text-os-muted sm:inline">v1.0</span>
      </div>

      <div className="hidden items-center gap-4 font-mono text-[11px] text-os-muted md:flex">
        <span className="flex items-center gap-1.5">
          <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
          LINK
        </span>
        <Meter label="CPU" value={18} />
        <Meter label="RAM" value={42} />
        <span>{windowCount} PROC</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setRecruiterMode(true)}
          className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-os-muted transition hover:border-os-accent/40 hover:text-os-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-os-accent"
        >
          RECRUITER
        </button>
        <time
          dateTime={new Date().toISOString()}
          className="font-mono text-[11px] tabular-nums text-os-text"
          title={date}
        >
          {time}
        </time>
      </div>
    </header>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <span className="flex items-center gap-1.5" aria-label={`${label} ${value} percent`}>
      {label}
      <span className="h-1 w-10 overflow-hidden rounded-full bg-white/10">
        <span
          className={cn("block h-full rounded-full bg-os-accent/80")}
          style={{ width: `${value}%` }}
        />
      </span>
    </span>
  );
}
