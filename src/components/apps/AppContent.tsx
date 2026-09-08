import { AboutApp } from "@/components/apps/AboutApp";
import { StubApp } from "@/components/apps/StubApp";
import type { AppId } from "@/data/apps";

export function AppContent({ appId }: { appId: AppId }) {
  if (appId === "about") {
    return <AboutApp />;
  }
  return <StubApp appId={appId} />;
}
