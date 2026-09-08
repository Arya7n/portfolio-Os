import { useRef, useState, type PointerEvent } from "react";
import { AppIcon } from "@/components/icons/AppIcons";
import { AppContent } from "@/components/apps/AppContent";
import { TASKBAR_HEIGHT, TOPBAR_HEIGHT, WINDOW_MIN_HEIGHT, WINDOW_MIN_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/cn";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useOsStore } from "@/store/osStore";
import type { OsWindow } from "@/types/os";

interface WindowProps {
  win: OsWindow;
}

export function Window({ win }: WindowProps) {
  const isMobile = useIsMobile();
  const activeId = useOsStore((s) => s.activeId);
  const focusWindow = useOsStore((s) => s.focusWindow);
  const closeWindow = useOsStore((s) => s.closeWindow);
  const minimizeWindow = useOsStore((s) => s.minimizeWindow);
  const toggleMaximize = useOsStore((s) => s.toggleMaximize);
  const moveWindow = useOsStore((s) => s.moveWindow);
  const resizeWindow = useOsStore((s) => s.resizeWindow);
  const snapWindow = useOsStore((s) => s.snapWindow);
  const dragRef = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const snapRef = useRef<"left" | "right" | "max" | null>(null);
  const [snapEdge, setSnapEdge] = useState<"left" | "right" | "max" | null>(null);

  const active = activeId === win.id;
  const maximized = win.maximized || isMobile;

  const style = maximized
    ? {
        left: 8,
        top: TOPBAR_HEIGHT + 8,
        width: `calc(100vw - 16px)`,
        height: `calc(100dvh - ${TOPBAR_HEIGHT + TASKBAR_HEIGHT + 16}px)`,
      }
    : {
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
      };

  const onTitlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || maximized) return;
    focusWindow(win.id);
    dragRef.current = { px: event.clientX, py: event.clientY, x: win.x, y: win.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onTitlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!dragRef.current) return;
    const dx = event.clientX - dragRef.current.px;
    const dy = event.clientY - dragRef.current.py;
    moveWindow(win.id, dragRef.current.x + dx, dragRef.current.y + dy);
    const next =
      event.clientY < TOPBAR_HEIGHT + 10
        ? "max"
        : event.clientX < 28
          ? "left"
          : event.clientX > window.innerWidth - 28
            ? "right"
            : null;
    snapRef.current = next;
    setSnapEdge(next);
  };

  const onTitlePointerUp = (event: PointerEvent<HTMLElement>) => {
    const hint = snapRef.current;
    const start = dragRef.current;
    dragRef.current = null;
    snapRef.current = null;
    setSnapEdge(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!start) return;
    const moved = Math.hypot(event.clientX - start.px, event.clientY - start.py) > 10;
    if (!moved) return;
    if (hint === "left") snapWindow(win.id, "left");
    if (hint === "right") snapWindow(win.id, "right");
    if (hint === "max") toggleMaximize(win.id);
  };

  return (
    <article
      role="dialog"
      aria-label={`${win.filename} window`}
      aria-labelledby={`${win.id}-title`}
      onMouseDown={() => focusWindow(win.id)}
      onContextMenu={(event) => event.stopPropagation()}
      className={cn(
        "absolute flex flex-col overflow-hidden rounded-[12px]",
        "pointer-events-auto glass-panel",
        active ? "shadow-[0_24px_60px_rgba(0,0,0,0.45)]" : "opacity-90",
      )}
      style={{ ...style, zIndex: win.zIndex }}
    >
      {snapEdge && (
        <div
          className="pointer-events-none fixed rounded-[12px] border border-os-accent/50 bg-os-accent/10"
          style={
            snapEdge === "max"
              ? { left: 8, top: TOPBAR_HEIGHT + 8, width: "calc(100vw - 16px)", height: `calc(100dvh - ${TOPBAR_HEIGHT + TASKBAR_HEIGHT + 16}px)` }
              : snapEdge === "left"
                ? { left: 0, top: TOPBAR_HEIGHT, width: "50vw", height: `calc(100dvh - ${TOPBAR_HEIGHT + TASKBAR_HEIGHT}px)` }
                : { right: 0, top: TOPBAR_HEIGHT, width: "50vw", height: `calc(100dvh - ${TOPBAR_HEIGHT + TASKBAR_HEIGHT}px)` }
          }
        />
      )}
      <header
        className="flex h-11 shrink-0 cursor-grab items-center gap-3 border-b border-white/8 px-3 active:cursor-grabbing"
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <div className="flex items-center gap-1.5">
          <TrafficLight
            label={`Close ${win.filename}`}
            color="bg-[#ff5f57] hover:brightness-110"
            onClick={() => closeWindow(win.id)}
          />
          <TrafficLight
            label={`Minimize ${win.filename}`}
            color="bg-[#febc2e] hover:brightness-110"
            onClick={() => minimizeWindow(win.id)}
          />
          <TrafficLight
            label={maximized ? `Restore ${win.filename}` : `Maximize ${win.filename}`}
            color="bg-[#28c840] hover:brightness-110"
            onClick={() => toggleMaximize(win.id)}
          />
        </div>
        <h2 id={`${win.id}-title`} className="min-w-0 flex-1 truncate text-center text-[13px] font-medium">
          {win.title}
        </h2>
        <AppIcon id={win.appId} className="h-4 w-4 text-os-muted" />
      </header>

      <div className="min-h-0 flex-1 overflow-auto">
        <AppContent appId={win.appId} />
      </div>

      {!maximized && (
        <>
          <ResizeHandle edge="n" win={win} resizeWindow={resizeWindow} />
          <ResizeHandle edge="s" win={win} resizeWindow={resizeWindow} />
          <ResizeHandle edge="e" win={win} resizeWindow={resizeWindow} />
          <ResizeHandle edge="w" win={win} resizeWindow={resizeWindow} />
          <ResizeHandle edge="ne" win={win} resizeWindow={resizeWindow} />
          <ResizeHandle edge="nw" win={win} resizeWindow={resizeWindow} />
          <ResizeHandle edge="se" win={win} resizeWindow={resizeWindow} />
          <ResizeHandle edge="sw" win={win} resizeWindow={resizeWindow} />
        </>
      )}
    </article>
  );
}

function TrafficLight({
  label,
  color,
  onClick,
}: {
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      onPointerDown={(event) => event.stopPropagation()}
      className={cn("h-3 w-3 rounded-full", color)}
    />
  );
}

type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

function ResizeHandle({
  edge,
  win,
  resizeWindow,
}: {
  edge: Edge;
  win: OsWindow;
  resizeWindow: (
    id: string,
    bounds: { x: number; y: number; width: number; height: number },
  ) => void;
}) {
  const start = useRef<{
    x: number;
    y: number;
    w: number;
    h: number;
    px: number;
    py: number;
  } | null>(null);

  const cursor: Record<Edge, string> = {
    n: "ns-resize",
    s: "ns-resize",
    e: "ew-resize",
    w: "ew-resize",
    ne: "nesw-resize",
    sw: "nesw-resize",
    nw: "nwse-resize",
    se: "nwse-resize",
  };

  const position: Record<Edge, string> = {
    n: "left-2 right-2 top-0 h-1.5",
    s: "left-2 right-2 bottom-0 h-1.5",
    e: "top-2 bottom-2 right-0 w-1.5",
    w: "top-2 bottom-2 left-0 w-1.5",
    ne: "right-0 top-0 h-3 w-3",
    nw: "left-0 top-0 h-3 w-3",
    se: "right-0 bottom-0 h-3 w-3",
    sw: "left-0 bottom-0 h-3 w-3",
  };

  return (
    <div
      role="separator"
      aria-label={`Resize ${win.filename} ${edge}`}
      className={cn("absolute z-10", position[edge])}
      style={{ cursor: cursor[edge] }}
      onPointerDown={(event) => {
        event.stopPropagation();
        event.preventDefault();
        start.current = {
          x: win.x,
          y: win.y,
          w: win.width,
          h: win.height,
          px: event.clientX,
          py: event.clientY,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!start.current) return;
        const dx = event.clientX - start.current.px;
        const dy = event.clientY - start.current.py;
        let x = start.current.x;
        let y = start.current.y;
        let width = start.current.w;
        let height = start.current.h;

        if (edge.includes("e")) width = Math.max(WINDOW_MIN_WIDTH, start.current.w + dx);
        if (edge.includes("s")) height = Math.max(WINDOW_MIN_HEIGHT, start.current.h + dy);
        if (edge.includes("w")) {
          width = Math.max(WINDOW_MIN_WIDTH, start.current.w - dx);
          x = start.current.x + (start.current.w - width);
        }
        if (edge.includes("n")) {
          height = Math.max(WINDOW_MIN_HEIGHT, start.current.h - dy);
          y = start.current.y + (start.current.h - height);
        }
        resizeWindow(win.id, { x, y, width, height });
      }}
      onPointerUp={(event) => {
        start.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      }}
    />
  );
}
