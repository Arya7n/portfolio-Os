import { BUILT_IN_WALLPAPERS } from "@/data/wallpapers";
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
    const current = wallpaper === "custom" ? -1 : BUILT_IN_WALLPAPERS.indexOf(wallpaper);
    const next = BUILT_IN_WALLPAPERS[(Math.max(current, -1) + 1) % BUILT_IN_WALLPAPERS.length];
    setWallpaper(next);
    pushNotification("Display", `Wallpaper: ${next}`);
    closeChrome();
  };

  const item = (label: string, onClick: () => void) => (
    <button
      type="button"
      className="block w-full px-3 py-1.5 text-left text-sm hover:bg-os-accent/20"
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div
      className="glass-panel fixed z-[95] min-w-44 overflow-hidden rounded-xl py-1"
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
      <div className="my-1 h-px bg-white/10" />
      {item("Change wallpaper", cycleWall)}
      {item("Upload wallpaper", () => {
        openApp("settings");
        closeChrome();
      })}
      {item("Refresh desktop", () => {
        pushNotification("Finder", "Desktop refreshed.");
        closeChrome();
      })}
      <div className="my-1 h-px bg-white/10" />
      {item("Recruiter Mode", () => {
        setRecruiterMode(true);
        closeChrome();
      })}
      {item("Lock session", () => lock())}
    </div>
  );
}
