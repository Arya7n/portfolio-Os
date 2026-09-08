import { useState, type ReactNode, type SVGProps } from "react";
import { CalendarPanel } from "@/components/os/CalendarPanel";
import { NotificationCenter } from "@/components/os/NotificationCenter";
import { profile } from "@/data/profile";
import { useClock } from "@/hooks/useClock";
import { useSystemStats } from "@/hooks/useSystemStats";
import { cn } from "@/lib/cn";
import { useOsStore } from "@/store/osStore";

export function TopBar() {
  const setRecruiterMode = useOsStore((s) => s.setRecruiterMode);
  const openApp = useOsStore((s) => s.openApp);
  const lock = useOsStore((s) => s.lock);
  const launcherOpen = useOsStore((s) => s.launcherOpen);
  const toggleLauncher = useOsStore((s) => s.toggleLauncher);
  const tray = useOsStore((s) => s.tray);
  const setTray = useOsStore((s) => s.setTray);
  const unread = useOsStore((s) => s.notificationLog.length);
  const { time } = useClock();
  const stats = useSystemStats();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-40 flex h-9 items-center justify-between bg-black/30 px-2 backdrop-blur-2xl">
      <div className="relative flex min-w-0 items-center gap-0.5">
        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[13px] font-medium tracking-tight hover:bg-white/8",
            menuOpen && "bg-white/10",
          )}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-os-accent" aria-hidden="true" />
          ARYAN OS
        </button>
        {menuOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 cursor-default"
              aria-label="Close system menu"
              onClick={() => setMenuOpen(false)}
            />
            <div className="glass-panel absolute left-0 top-full z-50 mt-1 min-w-44 overflow-hidden rounded-xl py-1" role="menu">
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
              <div className="my-1 h-px bg-white/8" />
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
        <button
          type="button"
          className={cn(
            "rounded-md px-2 py-0.5 text-[13px] text-os-muted hover:bg-white/8 hover:text-os-text",
            launcherOpen && "bg-white/10 text-os-text",
          )}
          onClick={toggleLauncher}
        >
          Applications
        </button>
        <button
          type="button"
          className={cn(
            "rounded-md px-2 py-0.5 text-[13px] text-os-muted hover:bg-white/8 hover:text-os-text",
            tray === "system" && "bg-white/10 text-os-text",
          )}
          onClick={() => setTray("system")}
        >
          System
        </button>
      </div>

      <div className="flex items-center gap-0.5">
        <StatusButton
          label="Recruiter Mode"
          active={false}
          onClick={() => setRecruiterMode(true)}
          className="hidden px-2 sm:flex"
        >
          <span className="text-[12px] text-os-muted">Recruiter</span>
        </StatusButton>
        <StatusButton label="Wi-Fi" active={tray === "net"} onClick={() => setTray("net")}>
          <IconWifi />
        </StatusButton>
        <span className="hidden px-1.5 font-mono text-[11px] tabular-nums text-os-muted sm:inline">
          {stats.frameMs != null ? `${Math.round(stats.frameMs)}ms` : "—"}
        </span>
        <span className="hidden px-1.5 font-mono text-[11px] tabular-nums text-os-muted md:inline">
          {stats.heapMb != null ? `${stats.heapMb}M` : "RAM —"}
        </span>
        <StatusButton label="Notifications" active={tray === "notify"} onClick={() => setTray("notify")}>
          <span className="relative">
            <IconBell />
            {unread > 0 && <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-os-accent" />}
          </span>
        </StatusButton>
        <StatusButton
          label="Calendar"
          active={tray === "clock"}
          onClick={() => setTray("clock")}
          className="px-2"
        >
          <span className="font-mono text-[12px] tabular-nums text-os-text/90">{time}</span>
        </StatusButton>
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
          <div className="w-56 p-4">
            <p className="text-sm font-medium">Wi-Fi</p>
            <p className="mt-1 text-[11px] text-os-ok">{stats.online ? "Connected" : "Offline"}</p>
            <p className="mt-3 text-[12px] text-os-muted">{profile.location}</p>
          </div>
        </TrayFlyout>
      )}
      {tray === "system" && (
        <TrayFlyout onClose={() => setTray(null)} align="left">
          <div className="w-64 p-4 font-mono text-[12px]">
            <p className="mb-3 text-[11px] tracking-[0.16em] text-os-muted">SYSTEM</p>
            <StatRow label="WEBGL" value={stats.webgl ? "Available" : "Unavailable"} ok={stats.webgl} />
            <StatRow label="NETWORK" value={stats.online ? "Online" : "Offline"} ok={stats.online} />
            <StatRow
              label="CPU"
              value={stats.frameMs != null ? `${Math.round(stats.frameMs)}ms frame` : "Sampling…"}
            />
            <StatRow
              label="MEMORY"
              value={stats.heapMb != null ? `${stats.heapMb} MB JS heap` : "Not exposed"}
            />
            <p className="mt-3 text-[10px] leading-relaxed text-os-muted/80">
              Client session indicators only. Not a remote host.
            </p>
          </div>
        </TrayFlyout>
      )}
    </header>
  );
}

function StatRow({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-os-muted">{label}</span>
      <span className={ok === false ? "text-os-fail" : ok ? "text-os-ok" : "text-os-text"}>{value}</span>
    </div>
  );
}

function StatusButton({
  label,
  active,
  onClick,
  children,
  className,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "flex h-7 items-center justify-center rounded-md px-1.5 text-os-muted/90 transition hover:bg-white/8 hover:text-os-text",
        active && "bg-white/10 text-os-text",
        className,
      )}
    >
      {children}
    </button>
  );
}

function MenuItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="menuitem"
      className="block w-full px-3 py-1.5 text-left text-[13px] hover:bg-white/8"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function TrayFlyout({
  children,
  onClose,
  align = "right",
}: {
  children: ReactNode;
  onClose: () => void;
  align?: "left" | "right";
}) {
  return (
    <>
      <button type="button" className="fixed inset-0 z-40 cursor-default" aria-label="Close tray" onClick={onClose} />
      <div
        className={cn(
          "glass-panel absolute top-full z-50 mt-1.5 overflow-hidden rounded-2xl",
          align === "right" ? "right-2" : "left-2",
        )}
      >
        {children}
      </div>
    </>
  );
}

function IconWifi(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true" {...props}>
      <path d="M2.6 7.2c3-3 7.8-3 10.8 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M4.6 9.4c1.9-1.9 4.9-1.9 6.8 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M6.6 11.5c.8-.8 2-.8 2.8 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="13.2" r="0.7" fill="currentColor" />
    </svg>
  );
}

function IconBell(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8 2.6a3.4 3.4 0 0 1 3.4 3.4v2.1l.9 1.8H3.7l.9-1.8V6A3.4 3.4 0 0 1 8 2.6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M6.4 13.1a1.6 1.6 0 0 0 3.2 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
