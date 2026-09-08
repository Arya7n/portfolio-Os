import { AppIcon, OsMark } from "@/components/icons/AppIcons";
import { desktopApps } from "@/data/apps";
import { cn } from "@/lib/cn";
import { useOsStore } from "@/store/osStore";

export function Taskbar() {
  const windows = useOsStore((s) => s.windows);
  const activeId = useOsStore((s) => s.activeId);
  const launcherOpen = useOsStore((s) => s.launcherOpen);
  const toggleLauncher = useOsStore((s) => s.toggleLauncher);
  const closeLauncher = useOsStore((s) => s.closeLauncher);
  const openApp = useOsStore((s) => s.openApp);
  const restoreWindow = useOsStore((s) => s.restoreWindow);
  const focusWindow = useOsStore((s) => s.focusWindow);
  const minimizeWindow = useOsStore((s) => s.minimizeWindow);
  const setRecruiterMode = useOsStore((s) => s.setRecruiterMode);

  return (
    <div className="relative z-50">
      {launcherOpen && (
        <div className="absolute bottom-[calc(100%+10px)] left-3 w-[min(100vw-24px,320px)]">
          <div className="glass-panel rounded-2xl p-3" role="menu" aria-label="Application launcher">
            <p className="mb-2 px-2 font-mono text-[10px] tracking-[0.2em] text-os-muted">
              APPLICATIONS
            </p>
            <div className="grid grid-cols-1 gap-1">
              {desktopApps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  role="menuitem"
                  onClick={() => openApp(app.id)}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-white/6 focus-visible:outline-2 focus-visible:outline-os-accent"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-os-accent">
                    <AppIcon id={app.id} className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm">{app.title}</span>
                    <span className="block font-mono text-[10px] text-os-muted">{app.filename}</span>
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setRecruiterMode(true)}
              className="mt-2 w-full rounded-xl border border-white/10 px-3 py-2 font-mono text-[11px] tracking-[0.16em] text-os-muted hover:text-os-text"
            >
              RECRUITER MODE
            </button>
          </div>
        </div>
      )}

      {launcherOpen && (
        <button
          type="button"
          aria-label="Close launcher"
          className="fixed inset-0 z-[-1] cursor-default"
          onClick={closeLauncher}
        />
      )}

      <nav
        aria-label="Taskbar"
        className="flex h-14 items-center gap-2 border-t border-white/8 bg-black/45 px-3 backdrop-blur-xl"
      >
        <button
          type="button"
          aria-label="Open application launcher"
          aria-expanded={launcherOpen}
          onClick={toggleLauncher}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-os-accent transition hover:border-os-accent/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-os-accent",
            launcherOpen && "border-os-accent/50 bg-os-accent/10",
          )}
        >
          <OsMark className="h-5 w-5" />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {windows.map((win) => {
            const isActive = win.id === activeId && !win.minimized;
            return (
              <button
                key={win.id}
                type="button"
                aria-label={`${win.minimized ? "Restore" : "Focus"} ${win.filename}`}
                onClick={() => {
                  if (win.minimized) restoreWindow(win.id);
                  else if (isActive) minimizeWindow(win.id);
                  else focusWindow(win.id);
                }}
                className={cn(
                  "flex max-w-48 min-w-0 items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left transition",
                  isActive
                    ? "border-os-accent/40 bg-os-accent/12"
                    : "border-transparent bg-white/4 hover:bg-white/8",
                )}
              >
                <AppIcon id={win.appId} className="h-3.5 w-3.5 shrink-0 text-os-accent" />
                <span className="truncate font-mono text-[11px]">{win.filename}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
