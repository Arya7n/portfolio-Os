import { create } from "zustand";
import { getApp, type AppId } from "@/data/apps";
import {
  TASKBAR_HEIGHT,
  TOPBAR_HEIGHT,
  WINDOW_MIN_HEIGHT,
  WINDOW_MIN_WIDTH,
  clampWindowPosition,
  getDesktopBounds,
} from "@/lib/layout";
import type { OsNotification, OsPhase, OsWindow, WindowOrigin } from "@/types/os";

interface OsStore {
  phase: OsPhase;
  recruiterMode: boolean;
  windows: OsWindow[];
  activeId: string | null;
  zCounter: number;
  notifications: OsNotification[];
  launcherOpen: boolean;
  enterDesktop: () => void;
  setRecruiterMode: (open: boolean) => void;
  toggleRecruiterMode: () => void;
  toggleLauncher: () => void;
  closeLauncher: () => void;
  openApp: (appId: AppId, origin?: WindowOrigin) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (
    id: string,
    bounds: { x: number; y: number; width: number; height: number },
  ) => void;
  pushNotification: (title: string, body: string) => void;
  dismissNotification: (id: string) => void;
}

function nextWindowPosition(count: number): { x: number; y: number } {
  const { width, height, mobile } = getDesktopBounds();
  if (mobile) {
    return { x: 8, y: TOPBAR_HEIGHT + 8 };
  }
  const offset = (count % 6) * 28;
  return {
    x: Math.min(96 + offset, Math.max(24, width - 420)),
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

export const useOsStore = create<OsStore>((set, get) => ({
  phase: "boot",
  recruiterMode: false,
  windows: [],
  activeId: null,
  zCounter: 100,
  notifications: [],
  launcherOpen: false,

  enterDesktop: () => {
    if (get().phase === "desktop") return;
    set({ phase: "entering" });
    window.setTimeout(() => {
      set({ phase: "desktop" });
      get().pushNotification("ARYAN OS", "Welcome to ARYAN OS.");
      window.setTimeout(() => {
        get().openApp("about");
        get().pushNotification("GitHub", "GitHub connection established.");
      }, 500);
    }, 420);
  },

  setRecruiterMode: (open) => set({ recruiterMode: open, launcherOpen: false }),
  toggleRecruiterMode: () =>
    set((state) => ({ recruiterMode: !state.recruiterMode, launcherOpen: false })),
  toggleLauncher: () => set((state) => ({ launcherOpen: !state.launcherOpen })),
  closeLauncher: () => set({ launcherOpen: false }),

  openApp: (appId, origin) => {
    const existing = get().windows.find((win) => win.appId === appId);
    if (existing) {
      if (existing.minimized) {
        get().restoreWindow(existing.id);
      } else {
        get().focusWindow(existing.id);
      }
      set({ launcherOpen: false });
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
    set((state) => ({
      notifications: [...state.notifications, { id, title, body, createdAt: Date.now() }],
    }));
    window.setTimeout(() => get().dismissNotification(id), 4200);
  },

  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((item) => item.id !== id),
    })),
}));
