import type { AppId } from "@/data/apps";

export type OsPhase = "boot" | "entering" | "desktop";

export interface WindowOrigin {
  x: number;
  y: number;
}

export interface OsWindow {
  id: string;
  appId: AppId;
  title: string;
  filename: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  prevBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  origin: WindowOrigin;
}

export interface OsNotification {
  id: string;
  title: string;
  body: string;
  createdAt: number;
}
