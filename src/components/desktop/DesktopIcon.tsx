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
        "group flex w-[88px] flex-col items-center gap-1.5 rounded-xl p-2 text-center transition",
        "hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-os-accent",
        active && "bg-white/12",
      )}
    >
      <span className="relative flex h-12 w-12 items-center justify-center rounded-[14px] bg-white/10 text-os-text shadow-inner">
        <AppIcon id={app.id} className="h-7 w-7" />
        {active && <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-os-accent" />}
      </span>
      <span className="text-[11px] leading-tight text-os-text/90">
        {app.title}
      </span>
    </button>
  );
}
