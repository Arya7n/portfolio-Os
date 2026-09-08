import { AppIcon } from "@/components/icons/AppIcons";
import { useOsStore } from "@/store/osStore";
import { cn } from "@/lib/cn";

export function AltTab() {
  const open = useOsStore((s) => s.altTabOpen);
  const windows = useOsStore((s) => s.windows);
  const activeId = useOsStore((s) => s.activeId);
  const focusWindow = useOsStore((s) => s.focusWindow);
  const setAltTab = useOsStore((s) => s.setAltTab);
  const visible = windows.filter((win) => !win.minimized);

  if (!open || !visible.length) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[92] flex items-center justify-center">
      <div className="glass-panel pointer-events-auto flex max-w-[90vw] gap-2 rounded-lg p-3" role="listbox" aria-label="Switch windows">
        {visible.map((win) => (
          <button
            key={win.id}
            type="button"
            onClick={() => {
              focusWindow(win.id);
              setAltTab(false);
            }}
            className={cn(
              "flex w-28 flex-col items-center gap-2 rounded-md border px-2 py-3",
              win.id === activeId ? "border-os-accent bg-os-accent/12" : "border-transparent hover:bg-white/5",
            )}
          >
            <AppIcon id={win.appId} className="h-6 w-6 text-os-accent" />
            <span className="truncate text-xs">{win.filename}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
