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
      <p className="font-mono text-[11px] tracking-[0.2em] text-os-muted">ARYAN OS</p>
      <h2 className="mt-2 font-display text-2xl font-semibold">Applications</h2>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {desktopApps.map((app) => (
          <button
            key={app.id}
            type="button"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              openApp(app.id, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
            }}
            className="flex items-center gap-3 rounded-2xl bg-white/8 p-3 text-left hover:bg-white/12"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-white/10 text-os-text">
              <AppIcon id={app.id} className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-mono text-[12px]">{app.filename}</span>
              <span className="mt-0.5 block text-xs text-os-muted">{app.description}</span>
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setRecruiterMode(true)}
        className="mt-4 rounded-full bg-os-accent px-4 py-3 text-sm font-medium text-white"
      >
        Recruiter Mode
      </button>
    </div>
  );
}
