export const TOPBAR_HEIGHT = 40;
export const TASKBAR_HEIGHT = 48;
export const MOBILE_BREAKPOINT = 768;

export const WINDOW_MIN_WIDTH = 320;
export const WINDOW_MIN_HEIGHT = 240;

export function getDesktopBounds() {
  if (typeof window === "undefined") {
    return { width: 1280, height: 800, mobile: false };
  }

  const mobile = window.innerWidth < MOBILE_BREAKPOINT;
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    mobile,
  };
}

export function clampWindowPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  maximized = false,
) {
  const { width: vw, height: vh } = getDesktopBounds();
  const maxX = Math.max(0, vw - 80);
  const maxY = Math.max(TOPBAR_HEIGHT, vh - TASKBAR_HEIGHT - 40);

  if (maximized) {
    return { x: 0, y: TOPBAR_HEIGHT };
  }

  return {
    x: Math.min(Math.max(x, -width + 80), maxX),
    y: Math.min(Math.max(y, TOPBAR_HEIGHT - height + 40), maxY),
  };
}
