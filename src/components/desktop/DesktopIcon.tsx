import { AppIcon } from "@/components/icons/AppIcons";
import type { DesktopApp } from "@/data/apps";
import { cn } from "@/lib/cn";
import { useOsStore } from "@/store/osStore";

interface DesktopIconProps {
  app: DesktopApp;
}

export function DesktopIcon({ app }: DesktopIconProps) {
  const openApp = useOsStore((s) => s.openApp);
  const selectApp = useOsStore((s) => s.selectApp);
  const selected = useOsStore((s) => s.selectedAppId === app.id);
  const running = useOsStore((s) => s.windows.some((win) => win.appId === app.id));

  const originFrom = (target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  return (
    <button
      type="button"
      title={app.description}
      aria-label={app.filename}
      aria-pressed={selected}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        selectApp(app.id);
        openApp(app.id, originFrom(event.currentTarget));
      }}
      onDoubleClick={(event) => openApp(app.id, originFrom(event.currentTarget))}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openApp(app.id, originFrom(event.currentTarget));
        }
      }}
      className={cn(
        "group flex w-[92px] flex-col items-center gap-1.5 rounded-xl p-2 text-center transition",
        "hover:bg-white/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-os-accent",
        selected && "bg-white/12",
      )}
    >
      <span
        className={cn(
          "relative flex h-12 w-12 items-center justify-center rounded-[15px] bg-white/10 text-os-text shadow-[0_8px_20px_rgba(0,0,0,0.28)] transition",
          "group-hover:scale-105 group-hover:shadow-[0_10px_24px_rgba(10,132,255,0.22)]",
          selected && "ring-1 ring-white/25",
        )}
      >
        <AppIcon id={app.id} className="h-6 w-6" />
        {running && <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-os-accent" />}
      </span>
      <span className="max-w-full truncate font-mono text-[10px] leading-tight text-os-text/85">
        {app.filename}
      </span>
    </button>
  );
}
