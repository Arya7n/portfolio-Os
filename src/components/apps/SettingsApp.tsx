import { useRef, useState } from "react";
import { SCENE_THEMES } from "@/data/themes";
import { wallpapers } from "@/data/wallpapers";
import { cn } from "@/lib/cn";
import { fileToWallpaper } from "@/lib/wallpaper";
import { useOsStore } from "@/store/osStore";

export function SettingsApp() {
  const wallpaper = useOsStore((s) => s.wallpaper);
  const customId = useOsStore((s) => s.customId);
  const customWallpapers = useOsStore((s) => s.customWallpapers);
  const setWallpaper = useOsStore((s) => s.setWallpaper);
  const setCustomWallpaper = useOsStore((s) => s.setCustomWallpaper);
  const addCustomWallpaper = useOsStore((s) => s.addCustomWallpaper);
  const removeCustomWallpaper = useOsStore((s) => s.removeCustomWallpaper);
  const show3d = useOsStore((s) => s.show3d);
  const setShow3d = useOsStore((s) => s.setShow3d);
  const lock = useOsStore((s) => s.lock);
  const setRecruiterMode = useOsStore((s) => s.setRecruiterMode);
  const pushNotification = useOsStore((s) => s.pushNotification);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of [...files].slice(0, 6)) {
        const { dataUrl, name } = await fileToWallpaper(file);
        addCustomWallpaper({
          id: `w-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          name,
          dataUrl,
        });
      }
      pushNotification("Display", "Wallpaper added.");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Could not add wallpaper.";
      setError(message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6 p-5 text-sm">
      <div>
        <h3 className="font-display text-xl">Settings</h3>
        <p className="mt-1 text-os-muted">Wallpaper, display, and session.</p>
      </div>

      <section>
        <h4 className="mb-2 text-os-muted">Built-in</h4>
        <div className="grid grid-cols-2 gap-2">
          {wallpapers.map((paper) => (
            <button
              key={paper.id}
              type="button"
              onClick={() => {
                setWallpaper(paper.id);
              }}
              className={cn(
                "overflow-hidden rounded-xl border text-left",
                wallpaper === paper.id ? "border-os-accent" : "border-os-line hover:border-os-muted",
              )}
            >
              <span className="relative block h-16 w-full overflow-hidden" style={{ background: SCENE_THEMES[paper.id].void }}>
                <span
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: `linear-gradient(${SCENE_THEMES[paper.id].grid} 1px, transparent 1px), linear-gradient(90deg, ${SCENE_THEMES[paper.id].grid} 1px, transparent 1px)`,
                    backgroundSize: "14px 14px",
                    maskImage: "linear-gradient(to top, black, transparent 85%)",
                  }}
                />
                <span
                  className="absolute inset-x-0 bottom-0 h-px"
                  style={{ background: SCENE_THEMES[paper.id].accent, opacity: 0.55 }}
                />
              </span>
              <span className="block px-2 py-1.5">
                <span className="block text-xs">{paper.label}</span>
                <span className="block font-mono text-[10px] text-os-muted">{paper.note}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h4 className="mb-2 text-os-muted">Your wallpapers</h4>
        <label
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-os-line px-3 py-6 text-center text-xs text-os-muted hover:border-os-accent hover:text-os-text",
            busy && "opacity-60",
          )}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            void onFiles(event.dataTransfer.files);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            disabled={busy}
            onChange={(event) => void onFiles(event.target.files)}
          />
          {busy ? "Compressing…" : "Drop or click to upload images"}
          <span className="mt-1 font-mono text-[10px]">jpg, png, webp · stored on this device</span>
        </label>
        {error && <p className="mt-2 text-xs text-os-fail">{error}</p>}

        {customWallpapers.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {customWallpapers.map((item) => {
              const active = wallpaper === "custom" && customId === item.id;
              return (
                <div
                  key={item.id}
                  className={cn("overflow-hidden rounded-xl border", active ? "border-os-accent" : "border-os-line")}
                >
                  <button
                    type="button"
                    className="block w-full"
                    onClick={() => {
                      setCustomWallpaper(item.id);
                    }}
                  >
                    <span
                      className="block h-16 w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.dataUrl})` }}
                    />
                    <span className="block truncate px-2 py-1.5 text-left text-xs">{item.name}</span>
                  </button>
                  <button
                    type="button"
                    className="w-full border-t border-os-line py-1 font-mono text-[10px] text-os-muted hover:text-os-fail"
                    onClick={() => removeCustomWallpaper(item.id)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="flex items-center justify-between gap-3 rounded-xl border border-os-line px-3 py-3">
        <div>
          <p>3D backdrop</p>
          <p className="text-xs text-os-muted">Hidden automatically on a custom photo wallpaper.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={show3d}
          onClick={() => setShow3d(!show3d)}
          className={cn(
            "h-7 w-12 rounded-full px-0.5",
            show3d ? "bg-os-accent" : "bg-os-raised",
          )}
        >
          <span className={cn("block h-6 w-6 rounded-full bg-white transition", show3d && "ml-auto")} />
        </button>
      </section>

      <section>
        <h4 className="mb-2 text-os-muted">Session</h4>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border border-os-line px-3 py-1.5 text-xs hover:border-os-accent" onClick={lock}>
            Lock
          </button>
          <button
            type="button"
            className="rounded-full border border-os-line px-3 py-1.5 text-xs hover:border-os-accent"
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
          <li>Ctrl/Cmd + Tab — switch windows</li>
          <li>Ctrl/Cmd + ` — terminal</li>
          <li>Esc — close menus</li>
        </ul>
      </section>
    </div>
  );
}
