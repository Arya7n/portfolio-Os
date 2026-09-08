import { Component, lazy, Suspense, useMemo, type ReactNode } from "react";
import { Atmosphere } from "@/components/desktop/Atmosphere";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { hasWebGL } from "@/lib/webgl";
import { useOsStore } from "@/store/osStore";

const OsScene = lazy(() => import("@/components/scene/OsScene"));

interface BackdropState {
  failed: boolean;
}

class SceneErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, BackdropState> {
  state: BackdropState = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

export function SceneBackdrop() {
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const show3d = useOsStore((s) => s.show3d);
  const wallpaper = useOsStore((s) => s.wallpaper);
  const webgl = useMemo(() => typeof window !== "undefined" && hasWebGL(), []);
  const use3d = show3d && wallpaper !== "custom" && !mobile && !reduced && webgl;

  if (wallpaper === "custom") {
    return <div className="pointer-events-none absolute inset-0 bg-black/20" aria-hidden="true" />;
  }

  if (!use3d) {
    return <Atmosphere />;
  }

  return (
    <SceneErrorBoundary fallback={<Atmosphere />}>
      <Suspense fallback={<Atmosphere />}>
        <OsScene />
      </Suspense>
    </SceneErrorBoundary>
  );
}
