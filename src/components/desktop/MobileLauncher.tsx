import { AppIcon } from "@/components/icons/AppIcons";
import { desktopApps } from "@/data/apps";
import { useOsStore } from "@/store/osStore";

export function MobileLauncher() {
  const openApp = useOsStore((s) => s.openApp);
  const setRecruiterMode = useOsStore((s) => s.setRecruiterMode);
  const hasWindows = useOsStore((s) => s.windows.some((win) => !win.minimized));

  if (hasWindows) return null;

  return (
    <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-auto p-4 pb-8">
      <p className="text-xs text-os-accent">Aryan OS</p>
      <h2 className="mt-2 font-display text-2xl font-medium">Applications</h2>
      <div className="mt-4 grid grid-cols-1 gap-2">
        {desktopApps.map((app) => (
          <button
            key={app.id}
            type="button"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              openApp(app.id, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
            }}
            className="flex items-center gap-3 border border-os-line bg-os-panel/80 p-3 text-left"
          >
            <span className="flex h-11 w-11 items-center justify-center border border-os-line text-os-accent">
              <AppIcon id={app.id} className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-medium">{app.title}</span>
              <span className="block font-mono text-[11px] text-os-muted">{app.filename}</span>
              <span className="mt-0.5 block text-xs text-os-muted">{app.description}</span>
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setRecruiterMode(true)}
        className="mt-4 border border-os-accent/40 px-4 py-3 text-sm"
      >
        RECRUITER MODE
      </button>
    </div>
  );
}
