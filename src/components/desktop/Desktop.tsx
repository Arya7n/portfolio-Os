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
  const selectApp = useOsStore((s) => s.selectApp);
  const unlockDeveloperMode = useOsStore((s) => s.unlockDeveloperMode);
  const pushNotification = useOsStore((s) => s.pushNotification);
  const openContextMenu = useOsStore((s) => s.openContextMenu);
  const mobile = useIsMobile();

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
        store.toggleLauncher();
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

      const typing =
        event.target instanceof HTMLElement &&
        (event.target.tagName === "INPUT" ||
          event.target.tagName === "TEXTAREA" ||
          event.target.isContentEditable);
      const hasWindow = store.windows.some((win) => !win.minimized);

      if (!typing && !hasWindow && !store.spotlightOpen && !store.launcherOpen) {
        const ids = desktopShortcuts.map((app) => app.id);
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          const index = store.selectedAppId ? ids.indexOf(store.selectedAppId) : -1;
          const next =
            event.key === "ArrowDown"
              ? Math.min(ids.length - 1, index + 1)
              : Math.max(0, index <= 0 ? 0 : index - 1);
          if (ids[next]) store.selectApp(ids[next]);
          return;
        }
        if ((event.key === "Enter" || event.key === " ") && store.selectedAppId) {
          event.preventDefault();
          store.openApp(store.selectedAppId);
          return;
        }
      }

      if (event.key === "Escape") {
        store.closeChrome();
        store.selectApp(null);
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
      aria-label="ARYAN OS desktop"
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
        onMouseDown={() => {
          closeChrome();
          selectApp(null);
        }}
      >
        {mobile ? (
          <MobileLauncher />
        ) : (
          <div
            className="relative z-30 flex w-auto flex-col gap-1 p-4 pt-5"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="grid grid-cols-1 gap-1">
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
