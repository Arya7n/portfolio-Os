import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Window } from "@/components/window/Window";
import { useOsStore } from "@/store/osStore";

export function WindowManager() {
  const windows = useOsStore((s) => s.windows);
  const visible = windows.filter((win) => !win.minimized);
  const closeWindow = useOsStore((s) => s.closeWindow);
  const activeId = useOsStore((s) => s.activeId);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
      if (activeId) closeWindow(activeId);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, closeWindow]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div className="pointer-events-auto">
        <AnimatePresence>
          {visible.map((win) => (
            <Window key={win.id} win={win} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
