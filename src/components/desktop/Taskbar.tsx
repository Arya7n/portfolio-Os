import { useMemo, useState } from "react";
import { AppIcon, OsMark } from "@/components/icons/AppIcons";
import { listedApps } from "@/data/apps";
import type { AppId } from "@/data/apps";
import { cn } from "@/lib/cn";
import { useOsStore } from "@/store/osStore";

const PINNED: AppId[] = ["terminal", "projects", "resume", "files"];

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
  const lock = useOsStore((s) => s.lock);
  const [query, setQuery] = useState("");
  const runningUnpinned = windows.filter((win) => !PINNED.includes(win.appId));
  const filteredApps = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listedApps(q);
  }, [query]);

  return (
    <div className="relative z-50 flex justify-center px-3 pb-3 pt-1">
      {launcherOpen && (
        <>
          <button type="button" aria-label="Close app grid" className="fixed inset-0 z-40 cursor-default bg-black/35 backdrop-blur-sm" onClick={() => { closeLauncher(); setQuery(""); }} />
          <div className="glass-panel absolute bottom-[calc(100%+12px)] left-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 overflow-hidden rounded-2xl" role="menu" aria-label="Applications">
            <div className="border-b border-white/8 px-4 py-3">
              <p className="font-mono text-[11px] tracking-[0.18em] text-os-muted">APPLICATIONS</p>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                className="mt-2 w-full rounded-lg border-0 bg-white/6 px-3 py-1.5 text-sm outline-none placeholder:text-os-muted"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && filteredApps[0]) openApp(filteredApps[0].id);
                }}
              />
            </div>
            <div className="grid max-h-80 grid-cols-2 gap-1 overflow-auto p-2 sm:grid-cols-3">
              {filteredApps.length === 0 && (
                <p className="col-span-full px-2 py-6 text-center text-xs text-os-muted">No applications match.</p>
              )}
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  role="menuitem"
                  onClick={() => openApp(app.id)}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/8"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/8 text-os-accent">
                    <AppIcon id={app.id} className="h-4 w-4" />
                  </span>
                  <span className="text-sm">{app.filename}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2 border-t border-white/8 p-2">
              <button
                type="button"
                onClick={() => setRecruiterMode(true)}
                className="flex-1 rounded-lg px-2 py-1.5 text-xs hover:bg-white/8"
              >
                Recruiter
              </button>
              <button type="button" onClick={lock} className="flex-1 rounded-lg px-2 py-1.5 text-xs hover:bg-white/8">
                Lock
              </button>
            </div>
          </div>
        </>
      )}

      <nav aria-label="Dock" className="glass-panel flex h-[52px] items-center gap-1 rounded-2xl px-2">
        <button
          type="button"
          aria-label="Open applications"
          aria-expanded={launcherOpen}
          onClick={toggleLauncher}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl text-os-text hover:bg-white/10",
            launcherOpen && "bg-white/12",
          )}
        >
          <OsMark className="h-5 w-5" />
        </button>

        <div className="mx-1 h-6 w-px bg-white/12" />

        {PINNED.map((id) => {
          const win = windows.find((item) => item.appId === id);
          const isActive = win && win.id === activeId && !win.minimized;
          return (
            <button
              key={id}
              type="button"
              aria-label={`Open ${id}`}
              onClick={() => openApp(id)}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-xl text-os-text transition-transform hover:scale-110 hover:bg-white/10",
                isActive && "bg-white/12",
              )}
            >
              <AppIcon id={id} className="h-5 w-5" />
              {win && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-os-text/80" />}
            </button>
          );
        })}

        {runningUnpinned.map((win) => {
          const isActive = win.id === activeId && !win.minimized;
          return (
            <button
              key={win.id}
              type="button"
              aria-label={`${win.minimized ? "Restore" : "Focus"} ${win.title}`}
              onClick={() => {
                if (win.minimized) restoreWindow(win.id);
                else if (isActive) minimizeWindow(win.id);
                else focusWindow(win.id);
              }}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-xl transition-transform hover:scale-110 hover:bg-white/10",
                isActive && "bg-white/12",
              )}
            >
              <AppIcon id={win.appId} className="h-5 w-5" />
              <span className="absolute bottom-1 h-1 w-1 rounded-full bg-os-text/80" />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
