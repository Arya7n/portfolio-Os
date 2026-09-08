import { wallpapers } from "@/data/wallpapers";
import { cn } from "@/lib/cn";
import { useOsStore } from "@/store/osStore";

export function SettingsApp() {
  const wallpaper = useOsStore((s) => s.wallpaper);
  const setWallpaper = useOsStore((s) => s.setWallpaper);
  const show3d = useOsStore((s) => s.show3d);
  const setShow3d = useOsStore((s) => s.setShow3d);
  const lock = useOsStore((s) => s.lock);
  const setRecruiterMode = useOsStore((s) => s.setRecruiterMode);
  const pushNotification = useOsStore((s) => s.pushNotification);

  return (
    <div className="space-y-6 p-5 text-sm">
      <div>
        <h3 className="font-display text-xl">Settings</h3>
        <p className="mt-1 text-os-muted">Appearance and session for this machine.</p>
      </div>

      <section>
        <h4 className="mb-2 text-os-muted">Wallpaper</h4>
        <div className="grid grid-cols-2 gap-2">
          {wallpapers.map((paper) => (
            <button
              key={paper.id}
              type="button"
              onClick={() => {
                setWallpaper(paper.id);
                pushNotification("Display", `Wallpaper: ${paper.label}`);
              }}
              className={cn(
                "overflow-hidden border text-left",
                wallpaper === paper.id ? "border-os-accent" : "border-os-line hover:border-os-muted",
              )}
            >
              <span className={cn("block h-16 w-full", `wall-${paper.id}`)} />
              <span className="block px-2 py-1.5">
                <span className="block text-xs">{paper.label}</span>
                <span className="block font-mono text-[10px] text-os-muted">{paper.note}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-between gap-3 border border-os-line px-3 py-3">
        <div>
          <p>3D backdrop</p>
          <p className="text-xs text-os-muted">Off on phones, reduced-motion, or if WebGL is missing.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={show3d}
          onClick={() => setShow3d(!show3d)}
          className={cn(
            "h-7 w-12 border px-0.5",
            show3d ? "border-os-accent bg-os-accent/20" : "border-os-line bg-os-void",
          )}
        >
          <span className={cn("block h-5 w-5 bg-os-text transition", show3d && "ml-auto bg-os-accent")} />
        </button>
      </section>

      <section>
        <h4 className="mb-2 text-os-muted">Session</h4>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="border border-os-line px-3 py-1.5 text-xs hover:border-os-accent" onClick={lock}>
            Lock
          </button>
          <button
            type="button"
            className="border border-os-line px-3 py-1.5 text-xs hover:border-os-accent"
            onClick={() => setRecruiterMode(true)}
          >
            Recruiter Mode
          </button>
        </div>
      </section>

      <section>
        <h4 className="mb-2 text-os-muted">Keyboard</h4>
        <ul className="space-y-1 font-mono text-[11px] text-os-muted">
          <li>Ctrl/Cmd + K — search</li>
          <li>Ctrl/Cmd + Space — search</li>
          <li>Ctrl/Cmd + Tab — switch windows</li>
          <li>Ctrl/Cmd + ` — terminal</li>
          <li>Esc — close menus</li>
        </ul>
      </section>
    </div>
  );
}
