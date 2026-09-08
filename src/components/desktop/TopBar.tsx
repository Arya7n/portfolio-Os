import { useState } from "react";
import { OsMark } from "@/components/icons/AppIcons";
import { cn } from "@/lib/cn";
import { useOsStore } from "@/store/osStore";

export function TopBar() {
  const setRecruiterMode = useOsStore((s) => s.setRecruiterMode);
  const setSpotlight = useOsStore((s) => s.setSpotlight);
  const openApp = useOsStore((s) => s.openApp);
  const lock = useOsStore((s) => s.lock);
  const windows = useOsStore((s) => s.windows);
  const activeId = useOsStore((s) => s.activeId);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = windows.find((win) => win.id === activeId && !win.minimized);

  return (
    <header className="relative z-40 flex h-10 items-center justify-between border-b border-os-line bg-os-panel/92 px-2 sm:px-3">
      <div className="relative flex min-w-0 items-center gap-2">
        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 px-1.5 py-1 text-os-accent hover:bg-os-raised",
            menuOpen && "bg-os-raised",
          )}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <OsMark className="h-4 w-4" />
          <span className="font-display text-[13px] font-medium">Aryan OS</span>
        </button>
        {menuOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 cursor-default"
              aria-label="Close system menu"
              onClick={() => setMenuOpen(false)}
            />
            <div className="glass-panel absolute left-0 top-full z-50 mt-1 min-w-48 py-1" role="menu">
              <MenuItem
                label="About this machine"
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
              <div className="my-1 h-px bg-os-line" />
              <MenuItem
                label="Recruiter Mode"
                onClick={() => {
                  setRecruiterMode(true);
                  setMenuOpen(false);
                }}
              />
              <MenuItem
                label="Lock"
                onClick={() => {
                  lock();
                  setMenuOpen(false);
                }}
              />
            </div>
          </>
        )}
        {active && (
          <span className="hidden truncate font-mono text-[11px] text-os-muted md:inline">{active.filename}</span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setSpotlight(true)}
          className="hidden border border-os-line px-2.5 py-1 font-mono text-[11px] text-os-muted hover:border-os-accent hover:text-os-text sm:inline"
        >
          Search
          <span className="ml-2 text-[10px] opacity-70">Ctrl+K</span>
        </button>
        <button
          type="button"
          onClick={() => setRecruiterMode(true)}
          className="border border-os-line px-2 py-1 font-mono text-[10px] text-os-muted hover:border-os-accent hover:text-os-text"
        >
          Recruiter
        </button>
      </div>
    </header>
  );
}

function MenuItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" role="menuitem" className="block w-full px-3 py-1.5 text-left text-sm hover:bg-os-accent/15" onClick={onClick}>
      {label}
    </button>
  );
}
