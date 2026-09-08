import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { MobileLauncher } from "@/components/desktop/MobileLauncher";
import { WallpaperLayer } from "@/components/desktop/WallpaperLayer";
import { SceneBackdrop } from "@/components/scene/SceneBackdrop";
import { DesktopIcon } from "@/components/desktop/DesktopIcon";
import { Taskbar } from "@/components/desktop/Taskbar";
import { TopBar } from "@/components/desktop/TopBar";
import { NotificationHost } from "@/components/notifications/NotificationHost";
import { WindowManager } from "@/components/window/WindowManager";
import { AltTab } from "@/components/os/AltTab";
import { ContextMenu } from "@/components/os/ContextMenu";
import { Spotlight } from "@/components/os/Spotlight";
import { desktopShortcuts } from "@/data/apps";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useKonami } from "@/hooks/useKonami";
import { useOsStore } from "@/store/osStore";

export function Desktop() {
  const closeChrome = useOsStore((s) => s.closeChrome);
  const openApp = useOsStore((s) => s.openApp);
  const unlockDeveloperMode = useOsStore((s) => s.unlockDeveloperMode);
  const pushNotification = useOsStore((s) => s.pushNotification);
  const openContextMenu = useOsStore((s) => s.openContextMenu);
  const mobile = useIsMobile();

  useEffect(() => {
    if (mobile) return;
    const timer = window.setTimeout(() => {
      const store = useOsStore.getState();
      if (store.windows.length === 0) store.openApp("about");
    }, 280);
    return () => window.clearTimeout(timer);
  }, [mobile]);

  useKonami(() => {
    unlockDeveloperMode();
    pushNotification("Developer mode", "Kernel debug unlocked.");
    openApp("terminal");
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const store = useOsStore.getState();
      if (store.locked) return;

      const mod = event.ctrlKey || event.metaKey;
      if (mod && (event.key === "k" || event.key === "K")) {
        event.preventDefault();
        store.setSpotlight(!store.spotlightOpen);
        return;
      }
      if (mod && event.code === "Space") {
        event.preventDefault();
        store.setSpotlight(!store.spotlightOpen);
        return;
      }
      if (mod && event.key === "Tab") {
        event.preventDefault();
        if (!store.altTabOpen) store.setAltTab(true);
        store.cycleAltTab();
        return;
      }
      if (mod && event.key === "`") {
        event.preventDefault();
        store.openApp("terminal");
        return;
      }
      if (event.key === "Escape") {
        store.closeChrome();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Control" || event.key === "Meta") {
        const store = useOsStore.getState();
        if (store.altTabOpen) store.confirmAltTab();
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return (
    <section
      id="os-main"
      className="relative flex h-full min-h-dvh flex-col overflow-hidden bg-os-void"
      aria-label="Aryan desktop"
      onContextMenu={(event) => {
        event.preventDefault();
        openContextMenu(
          Math.min(event.clientX, window.innerWidth - 180),
          Math.min(event.clientY, window.innerHeight - 240),
        );
      }}
    >
      <WallpaperLayer />
      <SceneBackdrop />
      <TopBar />

      <div
        className="relative flex min-h-0 flex-1"
        onMouseDown={() => closeChrome()}
      >
        {mobile ? (
          <MobileLauncher />
        ) : (
          <div className="relative z-10 flex w-auto flex-col gap-1 p-5">
            <div className="grid grid-cols-1 gap-2">
              {desktopShortcuts.map((app) => (
                <DesktopIcon key={app.id} app={app} />
              ))}
            </div>
          </div>
        )}
        <WindowManager />
      </div>

      <Taskbar />
      <Spotlight />
      <AltTab />
      <ContextMenu />
      <AnimatePresence>
        <NotificationHost />
      </AnimatePresence>
    </section>
  );
}
