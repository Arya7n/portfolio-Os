import { AnimatePresence, motion } from "framer-motion";
import { Atmosphere } from "@/components/desktop/Atmosphere";
import { DesktopIcon } from "@/components/desktop/DesktopIcon";
import { Taskbar } from "@/components/desktop/Taskbar";
import { TopBar } from "@/components/desktop/TopBar";
import { NotificationHost } from "@/components/notifications/NotificationHost";
import { WindowManager } from "@/components/window/WindowManager";
import { desktopApps } from "@/data/apps";
import { useOsStore } from "@/store/osStore";

export function Desktop() {
  const closeLauncher = useOsStore((s) => s.closeLauncher);

  return (
    <motion.section
      className="relative flex h-full min-h-dvh flex-col overflow-hidden bg-os-void"
      aria-label="ARYAN OS desktop"
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Atmosphere />
      <TopBar />

      <div
        className="relative flex min-h-0 flex-1"
        onMouseDown={() => closeLauncher()}
      >
        <div className="relative z-10 flex w-full flex-col gap-1 p-3 pt-4 sm:w-auto sm:p-5">
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-1 sm:gap-3">
            {desktopApps.map((app) => (
              <DesktopIcon key={app.id} app={app} />
            ))}
          </div>
        </div>
        <WindowManager />
      </div>

      <Taskbar />
      <AnimatePresence>
        <NotificationHost />
      </AnimatePresence>
    </motion.section>
  );
}
