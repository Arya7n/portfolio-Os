import { useState } from "react";
import { OsMark } from "@/components/icons/AppIcons";
import { CalendarPanel } from "@/components/os/CalendarPanel";
import { NotificationCenter } from "@/components/os/NotificationCenter";
import { profile } from "@/data/profile";
import { useClock } from "@/hooks/useClock";
import { cn } from "@/lib/cn";
import { useOsStore } from "@/store/osStore";
import type { ReactNode } from "react";

export function TopBar() {
  const setRecruiterMode = useOsStore((s) => s.setRecruiterMode);
  const setSpotlight = useOsStore((s) => s.setSpotlight);
  const openApp = useOsStore((s) => s.openApp);
  const lock = useOsStore((s) => s.lock);
  const windows = useOsStore((s) => s.windows);
  const activeId = useOsStore((s) => s.activeId);
  const tray = useOsStore((s) => s.tray);
  const setTray = useOsStore((s) => s.setTray);
  const unread = useOsStore((s) => s.notificationLog.length);
  const { time, date } = useClock();
  const [menuOpen, setMenuOpen] = useState(false);
  const active = windows.find((win) => win.id === activeId && !win.minimized);

  return (
    <header className="relative z-40 flex h-10 items-center justify-between border-b border-white/8 bg-black/25 px-3 backdrop-blur-2xl sm:px-4">
      <div className="relative flex min-w-0 items-center gap-3">
        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-os-text hover:bg-white/8",
            menuOpen && "bg-white/10",
          )}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <OsMark className="h-3.5 w-3.5" />
          <span className="text-[13px] font-semibold">Aryan</span>
        </button>
        {menuOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 cursor-default"
              aria-label="Close system menu"
              onClick={() => setMenuOpen(false)}
            />
            <div className="glass-panel absolute left-0 top-full z-50 mt-1 min-w-48 overflow-hidden rounded-xl py-1" role="menu">
              <MenuItem
                label="About"
                onClick={() => {
                  openApp("about");
                  setMenuOpen(false);
                }}
              />
              <MenuItem
                label="Files"
                onClick={() => {
                  openApp("files");
                  setMenuOpen(false);
                }}
              />
              <MenuItem
                label="Settings"
                onClick={() => {
                  openApp("settings");
                  setMenuOpen(false);
                }}
              />
              <div className="my-1 h-px bg-white/10" />
              <MenuItem
                label="Recruiter Mode"
                onClick={() => {
                  setRecruiterMode(true);
                  setMenuOpen(false);
                }}
              />
              <MenuItem
                label="Lock Screen"
                onClick={() => {
                  lock();
                  setMenuOpen(false);
                }}
              />
            </div>
          </>
        )}
        {active && <span className="hidden truncate text-[13px] text-os-muted md:inline">{active.title}</span>}
      </div>

      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => setSpotlight(true)}
          className="hidden rounded-md px-2 py-1 text-[12px] text-os-muted hover:bg-white/8 sm:inline"
        >
          Search
        </button>
        <button
          type="button"
          aria-label="Network"
          onClick={() => setTray("net")}
          className={cn("rounded-md px-2 py-1 text-[12px] text-os-muted hover:bg-white/8", tray === "net" && "bg-white/10 text-os-text")}
        >
          Wi-Fi
        </button>
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => setTray("notify")}
          className={cn("rounded-md px-2 py-1 text-[12px] text-os-muted hover:bg-white/8", tray === "notify" && "bg-white/10 text-os-text")}
        >
          {unread ? unread : "•"}
        </button>
        <button
          type="button"
          aria-label="Calendar"
          onClick={() => setTray("clock")}
          className={cn("rounded-md px-2 py-1 text-[12px] tabular-nums hover:bg-white/8", tray === "clock" && "bg-white/10")}
          title={date}
        >
          {date} {time}
        </button>
      </div>

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
            <p className="font-medium">Wi-Fi</p>
            <p className="mt-2 text-xs text-os-ok">Connected</p>
            <p className="mt-1 text-xs text-os-muted">{profile.location}</p>
          </div>
        </TrayFlyout>
      )}
    </header>
  );
}

function MenuItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" role="menuitem" className="block w-full px-3 py-1.5 text-left text-sm hover:bg-os-accent/20" onClick={onClick}>
      {label}
    </button>
  );
}

function TrayFlyout({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <>
      <button type="button" className="fixed inset-0 z-40 cursor-default" aria-label="Close tray" onClick={onClose} />
      <div className="glass-panel absolute right-2 top-full z-50 mt-1 overflow-hidden rounded-xl">{children}</div>
    </>
  );
}
