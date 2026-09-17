import { WallpaperLayer } from "@/components/desktop/WallpaperLayer";
import { profile } from "@/data/profile";
import { useOsStore } from "@/store/osStore";
import { useClock } from "@/hooks/useClock";
import { useEffect } from "react";

export function LockScreen() {
  const locked = useOsStore((s) => s.locked);
  const unlock = useOsStore((s) => s.unlock);
  const { time, date } = useClock();

  useEffect(() => {
    if (!locked) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        unlock();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [locked, unlock]);

  if (!locked) return null;

  return (
    <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center text-os-text">
      <WallpaperLayer dim />
      <p className="relative font-display text-5xl font-semibold tabular-nums tracking-tight sm:text-7xl">{time}</p>
      <p className="relative mt-2 text-os-muted">{date}</p>
      <p className="relative mt-10 font-display text-2xl font-medium">{profile.name}</p>
      <p className="relative text-sm text-os-muted">{profile.title}</p>
      <button
        type="button"
        autoFocus
        onClick={unlock}
        className="relative mt-8 rounded-full bg-white/12 px-8 py-2.5 text-sm hover:bg-white/18"
      >
        Unlock
      </button>
      <p className="relative mt-3 text-[11px] text-os-muted">Enter or click to resume session</p>
    </div>
  );
}
