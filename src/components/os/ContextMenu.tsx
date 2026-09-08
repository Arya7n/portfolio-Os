import { useOsStore } from "@/store/osStore";

export function ContextMenu() {
  const menu = useOsStore((s) => s.contextMenu);
  const closeChrome = useOsStore((s) => s.closeChrome);
  const openApp = useOsStore((s) => s.openApp);
  const setWallpaper = useOsStore((s) => s.setWallpaper);
  const wallpaper = useOsStore((s) => s.wallpaper);
  const setRecruiterMode = useOsStore((s) => s.setRecruiterMode);
  const lock = useOsStore((s) => s.lock);
  const pushNotification = useOsStore((s) => s.pushNotification);

  if (!menu) return null;

  const cycleWall = () => {
    const order = ["forge", "dune", "ink", "studio"] as const;
    const next = order[(order.indexOf(wallpaper) + 1) % order.length];
    setWallpaper(next);
    pushNotification("Display", `Wallpaper: ${next}`);
    closeChrome();
  };

  const item = (label: string, onClick: () => void) => (
    <button
      type="button"
      className="block w-full px-3 py-1.5 text-left text-sm hover:bg-os-accent/15"
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div
      className="glass-panel fixed z-[95] min-w-44 overflow-hidden rounded py-1"
      style={{ left: menu.x, top: menu.y }}
      role="menu"
    >
      {item("Open Terminal", () => {
        openApp("terminal");
        closeChrome();
      })}
      {item("Open Files", () => {
        openApp("files");
        closeChrome();
      })}
      {item("Settings", () => {
        openApp("settings");
        closeChrome();
      })}
      <div className="my-1 h-px bg-os-line" />
      {item("Change wallpaper", cycleWall)}
      {item("Refresh desktop", () => {
        pushNotification("Finder", "Desktop refreshed.");
        closeChrome();
      })}
      <div className="my-1 h-px bg-os-line" />
      {item("Recruiter Mode", () => {
        setRecruiterMode(true);
        closeChrome();
      })}
      {item("Lock session", () => lock())}
    </div>
  );
}
