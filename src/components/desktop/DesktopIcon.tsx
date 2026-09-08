import { AppIcon } from "@/components/icons/AppIcons";
import type { DesktopApp } from "@/data/apps";
import { cn } from "@/lib/cn";
import { useOsStore } from "@/store/osStore";

interface DesktopIconProps {
  app: DesktopApp;
}

export function DesktopIcon({ app }: DesktopIconProps) {
  const openApp = useOsStore((s) => s.openApp);
  const active = useOsStore(
    (s) => s.windows.some((win) => win.appId === app.id && !win.minimized && s.activeId === win.id),
  );

  return (
    <button
      type="button"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        openApp(app.id, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          const rect = event.currentTarget.getBoundingClientRect();
          openApp(app.id, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        }
      }}
      title={app.description}
      aria-label={`Open ${app.filename}`}
      className={cn(
        "group flex w-[88px] flex-col items-center gap-2 rounded-xl p-2 text-center transition",
        "hover:-translate-y-0.5 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-os-accent",
        active && "bg-white/6",
      )}
    >
      <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 text-os-accent shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition group-hover:border-os-accent/40 group-hover:shadow-[0_0_24px_rgba(142,180,255,0.18)]">
        <AppIcon id={app.id} className="h-7 w-7" />
        {active && (
          <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-os-accent" />
        )}
      </span>
      <span className="font-mono text-[11px] leading-tight text-os-text/90">
        {app.filename}
      </span>
    </button>
  );
}
