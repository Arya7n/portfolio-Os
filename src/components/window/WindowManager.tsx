import { Window } from "@/components/window/Window";
import { useOsStore } from "@/store/osStore";

export function WindowManager() {
  const windows = useOsStore((s) => s.windows);
  const visible = windows.filter((win) => !win.minimized);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {visible.map((win) => (
        <Window key={win.id} win={win} />
      ))}
    </div>
  );
}
