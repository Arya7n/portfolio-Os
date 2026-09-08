import { create } from "zustand";
import { desktopApps, getApp, type AppId } from "@/data/apps";
import type { WallpaperId } from "@/data/wallpapers";
import {
  TASKBAR_HEIGHT,
  TOPBAR_HEIGHT,
  WINDOW_MIN_HEIGHT,
  WINDOW_MIN_WIDTH,
  clampWindowPosition,
  getDesktopBounds,
} from "@/lib/layout";
import type { OsNotification, OsPhase, OsWindow, WindowOrigin } from "@/types/os";

export type TrayId = "clock" | "notify" | "net" | null;

interface ContextMenuState {
  x: number;
  y: number;
}

interface OsPrefs {
  wallpaper: WallpaperId;
  show3d: boolean;
}

function loadPrefs(): OsPrefs {
  try {
    const raw = localStorage.getItem("aryan-os-prefs");
    if (!raw) return { wallpaper: "forge", show3d: true };
    const parsed = JSON.parse(raw) as Partial<OsPrefs>;
    const wallpaper = parsed.wallpaper ?? "forge";
    const allowed: WallpaperId[] = ["forge", "dune", "ink", "studio"];
    return {
      wallpaper: allowed.includes(wallpaper) ? wallpaper : "forge",
      show3d: parsed.show3d !== false,
    };
  } catch {
    return { wallpaper: "forge", show3d: true };
  }
}

function savePrefs(prefs: OsPrefs) {
  try {
    localStorage.setItem("aryan-os-prefs", JSON.stringify(prefs));
  } catch {
    /* ignore quota */
  }
}

interface OsStore {
  phase: OsPhase;
  recruiterMode: boolean;
  windows: OsWindow[];
  activeId: string | null;
  zCounter: number;
  notifications: OsNotification[];
  notificationLog: OsNotification[];
  launcherOpen: boolean;
  developerMode: boolean;
  wallpaper: WallpaperId;
  show3d: boolean;
  locked: boolean;
  spotlightOpen: boolean;
  contextMenu: ContextMenuState | null;
  tray: TrayId;
  altTabOpen: boolean;
  enterDesktop: () => void;
  unlockDeveloperMode: () => void;
  setRecruiterMode: (open: boolean) => void;
  toggleRecruiterMode: () => void;
  toggleLauncher: () => void;
  closeLauncher: () => void;
  closeChrome: () => void;
  setWallpaper: (id: WallpaperId) => void;
  setShow3d: (on: boolean) => void;
  lock: () => void;
  unlock: () => void;
  setSpotlight: (open: boolean) => void;
  openContextMenu: (x: number, y: number) => void;
  setTray: (id: TrayId) => void;
  setAltTab: (open: boolean) => void;
  cycleAltTab: () => void;
  confirmAltTab: () => void;
  openApp: (appId: AppId, origin?: WindowOrigin) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  snapWindow: (id: string, edge: "left" | "right") => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (
    id: string,
    bounds: { x: number; y: number; width: number; height: number },
  ) => void;
  pushNotification: (title: string, body: string) => void;
  dismissNotification: (id: string) => void;
  clearLog: () => void;
}

function nextWindowPosition(count: number): { x: number; y: number } {
  const { width, height, mobile } = getDesktopBounds();
  if (mobile) {
    return { x: 8, y: TOPBAR_HEIGHT + 8 };
  }
  const offset = (count % 6) * 28;
  return {
    x: Math.min(120 + offset, Math.max(24, width - 420)),
    y: Math.min(TOPBAR_HEIGHT + 36 + offset, Math.max(TOPBAR_HEIGHT + 8, height - 320)),
  };
}

function defaultSize(appId: AppId) {
  const app = getApp(appId);
  const { width, height, mobile } = getDesktopBounds();
  if (mobile) {
    return {
      width: Math.max(WINDOW_MIN_WIDTH, width - 16),
      height: Math.max(WINDOW_MIN_HEIGHT, height - TOPBAR_HEIGHT - TASKBAR_HEIGHT - 16),
    };
  }
  return {
    width: Math.min(app.defaultWidth, width - 32),
    height: Math.min(app.defaultHeight, height - TOPBAR_HEIGHT - TASKBAR_HEIGHT - 24),
  };
}

const prefs = loadPrefs();

export const useOsStore = create<OsStore>((set, get) => ({
  phase: "boot",
  recruiterMode: false,
  windows: [],
  activeId: null,
  zCounter: 100,
  notifications: [],
  notificationLog: [],
  launcherOpen: false,
  developerMode: false,
  wallpaper: prefs.wallpaper,
  show3d: prefs.show3d,
  locked: false,
  spotlightOpen: false,
  contextMenu: null,
  tray: null,
  altTabOpen: false,

  enterDesktop: () => {
    if (get().phase === "desktop") return;
    set({ phase: "desktop" });
    get().pushNotification("Aryan OS", "Session started.");
    window.setTimeout(() => {
      if (!getDesktopBounds().mobile && get().windows.length === 0) {
        get().openApp("about");
      }
      get().pushNotification("Hint", "Ctrl+K search · right-click the desktop.");
    }, 200);
  },

  setRecruiterMode: (open) => set({ recruiterMode: open, launcherOpen: false, spotlightOpen: false }),
  toggleRecruiterMode: () =>
    set((state) => ({ recruiterMode: !state.recruiterMode, launcherOpen: false })),
  unlockDeveloperMode: () => set({ developerMode: true }),
  toggleLauncher: () =>
    set((state) => ({
      launcherOpen: !state.launcherOpen,
      spotlightOpen: false,
      tray: null,
      contextMenu: null,
    })),
  closeLauncher: () => set({ launcherOpen: false }),
  closeChrome: () =>
    set({
      launcherOpen: false,
      spotlightOpen: false,
      contextMenu: null,
      tray: null,
      altTabOpen: false,
    }),

  setWallpaper: (id) => {
    set({ wallpaper: id });
    savePrefs({ wallpaper: id, show3d: get().show3d });
  },
  setShow3d: (on) => {
    set({ show3d: on });
    savePrefs({ wallpaper: get().wallpaper, show3d: on });
  },
  lock: () => set({ locked: true, launcherOpen: false, spotlightOpen: false, tray: null }),
  unlock: () => set({ locked: false }),
  setSpotlight: (open) =>
    set({ spotlightOpen: open, launcherOpen: false, tray: null, contextMenu: null }),
  openContextMenu: (x, y) => set({ contextMenu: { x, y }, launcherOpen: false, tray: null }),
  setTray: (id) =>
    set((state) => ({
      tray: state.tray === id ? null : id,
      launcherOpen: false,
      spotlightOpen: false,
    })),
  setAltTab: (open) => set({ altTabOpen: open }),
  cycleAltTab: () => {
    const visible = get().windows.filter((win) => !win.minimized);
    if (!visible.length) return;
    const sorted = [...visible].sort((a, b) => b.zIndex - a.zIndex);
    const current = sorted.findIndex((win) => win.id === get().activeId);
    const next = sorted[(current + 1) % sorted.length];
    if (next) get().focusWindow(next.id);
  },
  confirmAltTab: () => set({ altTabOpen: false }),

  openApp: (appId, origin) => {
    const existing = get().windows.find((win) => win.appId === appId);
    if (existing) {
      if (existing.minimized) {
        get().restoreWindow(existing.id);
      } else {
        get().focusWindow(existing.id);
      }
      get().closeChrome();
      return;
    }

    const app = getApp(appId);
    const size = defaultSize(appId);
    const pos = nextWindowPosition(get().windows.length);
    const zIndex = get().zCounter + 1;
    const id = `${appId}-${Date.now()}`;
    const originPoint = origin ?? {
      x: pos.x + size.width / 2,
      y: pos.y + 20,
    };

    const windowState: OsWindow = {
      id,
      appId,
      title: app.title,
      filename: app.filename,
      x: pos.x,
      y: pos.y,
      width: size.width,
      height: size.height,
      zIndex,
      minimized: false,
      maximized: getDesktopBounds().mobile,
      origin: originPoint,
    };

    set((state) => ({
      windows: [...state.windows, windowState],
      activeId: id,
      zCounter: zIndex,
      launcherOpen: false,
      spotlightOpen: false,
      contextMenu: null,
      tray: null,
    }));
  },

  closeWindow: (id) =>
    set((state) => {
      const remaining = state.windows.filter((win) => win.id !== id);
      const nextActive = remaining
        .filter((win) => !win.minimized)
        .sort((a, b) => b.zIndex - a.zIndex)[0];
      return {
        windows: remaining,
        activeId: nextActive?.id ?? null,
      };
    }),

  focusWindow: (id) => {
    const current = get().windows.find((win) => win.id === id);
    if (!current || current.minimized) return;
    const zIndex = get().zCounter + 1;
    set((state) => ({
      windows: state.windows.map((win) =>
        win.id === id ? { ...win, zIndex } : win,
      ),
      activeId: id,
      zCounter: zIndex,
      launcherOpen: false,
    }));
  },

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((win) =>
        win.id === id ? { ...win, minimized: true } : win,
      ),
      activeId:
        state.activeId === id
          ? state.windows
              .filter((win) => win.id !== id && !win.minimized)
              .sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null
          : state.activeId,
    })),

  restoreWindow: (id) => {
    const zIndex = get().zCounter + 1;
    set((state) => ({
      windows: state.windows.map((win) =>
        win.id === id ? { ...win, minimized: false, zIndex } : win,
      ),
      activeId: id,
      zCounter: zIndex,
    }));
  },

  toggleMaximize: (id) =>
    set((state) => ({
      windows: state.windows.map((win) => {
        if (win.id !== id) return win;
        if (win.maximized) {
          const prev = win.prevBounds;
          return {
            ...win,
            maximized: false,
            x: prev?.x ?? win.x,
            y: prev?.y ?? win.y,
            width: prev?.width ?? win.width,
            height: prev?.height ?? win.height,
          };
        }
        return {
          ...win,
          maximized: true,
          prevBounds: {
            x: win.x,
            y: win.y,
            width: win.width,
            height: win.height,
          },
        };
      }),
      activeId: id,
    })),

  snapWindow: (id, edge) => {
    const { width, height } = getDesktopBounds();
    const y = TOPBAR_HEIGHT;
    const h = height - TOPBAR_HEIGHT - TASKBAR_HEIGHT;
    const w = Math.floor(width / 2);
    set((state) => ({
      windows: state.windows.map((win) => {
        if (win.id !== id) return win;
        return {
          ...win,
          maximized: false,
          prevBounds: win.maximized
            ? win.prevBounds
            : { x: win.x, y: win.y, width: win.width, height: win.height },
          x: edge === "left" ? 0 : w,
          y,
          width: w,
          height: h,
        };
      }),
      activeId: id,
    }));
  },

  moveWindow: (id, x, y) =>
    set((state) => ({
      windows: state.windows.map((win) => {
        if (win.id !== id || win.maximized) return win;
        const next = clampWindowPosition(x, y, win.width, win.height);
        return { ...win, ...next };
      }),
    })),

  resizeWindow: (id, bounds) =>
    set((state) => ({
      windows: state.windows.map((win) => {
        if (win.id !== id || win.maximized) return win;
        const width = Math.max(WINDOW_MIN_WIDTH, bounds.width);
        const height = Math.max(WINDOW_MIN_HEIGHT, bounds.height);
        const next = clampWindowPosition(bounds.x, bounds.y, width, height);
        return { ...win, ...next, width, height };
      }),
    })),

  pushNotification: (title, body) => {
    const id = `n-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const item = { id, title, body, createdAt: Date.now() };
    set((state) => ({
      notifications: [...state.notifications, item],
      notificationLog: [item, ...state.notificationLog].slice(0, 12),
    }));
    window.setTimeout(() => get().dismissNotification(id), 4200);
  },

  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((item) => item.id !== id),
    })),

  clearLog: () => set({ notificationLog: [] }),
}));

export { desktopApps };
