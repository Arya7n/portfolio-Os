import { useEffect, useState } from "react";
import { hasWebGL } from "@/lib/webgl";

interface SystemStats {
  webgl: boolean;
  online: boolean;
  frameMs: number | null;
  heapMb: number | null;
}

type MemoryPerformance = Performance & {
  memory?: { usedJSHeapSize: number };
};

export function useSystemStats(): SystemStats {
  const [online, setOnline] = useState(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [webgl] = useState(() => (typeof window !== "undefined" ? hasWebGL() : false));
  const [frameMs, setFrameMs] = useState<number | null>(null);
  const [heapMb, setHeapMb] = useState<number | null>(null);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);

    let last = performance.now();
    let total = 0;
    let frames = 0;
    let raf = 0;

    const tick = (now: number) => {
      total += now - last;
      frames += 1;
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const interval = window.setInterval(() => {
      if (frames > 0) setFrameMs(total / frames);
      total = 0;
      frames = 0;
      const memory = (performance as MemoryPerformance).memory;
      if (memory?.usedJSHeapSize) {
        setHeapMb(Math.round(memory.usedJSHeapSize / 1048576));
      }
    }, 800);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(interval);
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return { webgl, online, frameMs, heapMb };
}
