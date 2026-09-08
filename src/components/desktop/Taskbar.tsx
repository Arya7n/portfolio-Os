import { AppIcon, OsMark } from "@/components/icons/AppIcons";
import { CalendarPanel } from "@/components/os/CalendarPanel";
import { NotificationCenter } from "@/components/os/NotificationCenter";
import { desktopApps } from "@/data/apps";
import type { AppId } from "@/data/apps";
import { profile } from "@/data/profile";
import { useClock } from "@/hooks/useClock";
import { cn } from "@/lib/cn";
import { useOsStore } from "@/store/osStore";
import type { ReactNode } from "react";

const PINNED: AppId[] = ["files", "terminal", "projects", "settings"];

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
  const tray = useOsStore((s) => s.tray);
  const setTray = useOsStore((s) => s.setTray);
  const { time, date } = useClock();
  const unread = useOsStore((s) => s.notificationLog.length);

  const runningUnpinned = windows.filter((win) => !PINNED.includes(win.appId));

  return (
    <div className="relative z-50">
      {launcherOpen && (
        <div className="absolute bottom-[calc(100%+8px)] left-2 w-[min(100vw-16px,340px)]">
          <div className="glass-panel overflow-hidden" role="menu" aria-label="Start menu">
            <div className="border-b border-os-line px-3 py-3">
              <p className="font-display text-lg">{profile.name}</p>
              <p className="text-xs text-os-muted">{profile.title}</p>
            </div>
            <div className="grid max-h-72 grid-cols-1 gap-0.5 overflow-auto p-2">
              {desktopApps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  role="menuitem"
                  onClick={() => openApp(app.id)}
                  className="flex items-center gap-3 px-2 py-2 text-left hover:bg-os-raised"
                >
                  <span className="flex h-8 w-8 items-center justify-center border border-os-line text-os-accent">
                    <AppIcon id={app.id} className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm">{app.title}</span>
                    <span className="block font-mono text-[10px] text-os-muted">{app.filename}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-1 border-t border-os-line p-2">
              <button
                type="button"
                onClick={() => setRecruiterMode(true)}
                className="flex-1 border border-os-line px-2 py-1.5 text-xs hover:border-os-accent"
              >
                Recruiter
              </button>
              <button type="button" onClick={lock} className="flex-1 border border-os-line px-2 py-1.5 text-xs hover:border-os-accent">
                Lock
              </button>
            </div>
          </div>
        </div>
      )}

      {launcherOpen && (
        <button type="button" aria-label="Close start menu" className="fixed inset-0 z-[-1] cursor-default" onClick={closeLauncher} />
      )}

      {tray === "clock" && (
        <TrayFlyout onClose={() => setTray(null)}>
          <CalendarPanel />
        </TrayFlyout>
      )}
      {tray === "notify" && (
        <TrayFlyout onClose={() => setTray(null)}>
          <NotificationCenter />
        </TrayFlyout>
      )}
      {tray === "net" && (
        <TrayFlyout onClose={() => setTray(null)}>
          <div className="w-64 p-3 text-sm">
            <p className="font-medium">Network</p>
            <p className="mt-2 font-mono text-xs text-os-ok">wlan0 · connected</p>
            <p className="mt-1 text-xs text-os-muted">{profile.location}</p>
          </div>
        </TrayFlyout>
      )}

      <nav aria-label="Taskbar" className="flex h-12 items-center gap-1 border-t border-os-line bg-os-panel/95 px-2">
        <button
          type="button"
          aria-label="Open start menu"
          aria-expanded={launcherOpen}
          onClick={toggleLauncher}
          className={cn(
            "flex h-9 w-9 items-center justify-center border border-os-line text-os-accent hover:border-os-accent",
            launcherOpen && "border-os-accent bg-os-accent/12",
          )}
        >
          <OsMark className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-0.5">
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
                  "relative flex h-9 w-9 items-center justify-center border border-transparent text-os-accent hover:bg-os-raised",
                  isActive && "border-os-line bg-os-raised",
                  win && !isActive && "opacity-90",
                )}
              >
                <AppIcon id={id} className="h-4 w-4" />
                {win && <span className="absolute bottom-0.5 h-0.5 w-3 bg-os-accent" />}
              </button>
            );
          })}
        </div>

        <div className="mx-1 h-6 w-px bg-os-line" />

        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {runningUnpinned.map((win) => {
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
                  "flex max-w-44 min-w-0 items-center gap-2 border px-2 py-1.5 text-left",
                  isActive ? "border-os-accent/50 bg-os-accent/12" : "border-transparent bg-os-raised/60 hover:bg-os-raised",
                )}
              >
                <AppIcon id={win.appId} className="h-3.5 w-3.5 shrink-0 text-os-accent" />
                <span className="truncate font-mono text-[11px]">{win.filename}</span>
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Network"
            onClick={() => setTray("net")}
            className={cn("px-2 py-1 font-mono text-[10px] text-os-muted hover:bg-os-raised", tray === "net" && "bg-os-raised text-os-text")}
          >
            net
          </button>
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => setTray("notify")}
            className={cn("px-2 py-1 font-mono text-[10px] text-os-muted hover:bg-os-raised", tray === "notify" && "bg-os-raised text-os-text")}
          >
            {unread ? `${unread}` : "inbox"}
          </button>
          <button
            type="button"
            aria-label="Calendar"
            onClick={() => setTray("clock")}
            className={cn(
              "px-2 py-1 text-right font-mono text-[11px] tabular-nums hover:bg-os-raised",
              tray === "clock" && "bg-os-raised",
            )}
            title={date}
          >
            <span className="block leading-none">{time}</span>
            <span className="hidden text-[10px] text-os-muted sm:block">{date}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function TrayFlyout({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <>
      <button type="button" className="fixed inset-0 z-[-1] cursor-default" aria-label="Close tray" onClick={onClose} />
      <div className="glass-panel absolute right-2 bottom-[calc(100%+8px)] z-10 overflow-hidden">{children}</div>
    </>
  );
}
