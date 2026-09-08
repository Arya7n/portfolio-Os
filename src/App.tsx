import { BootScreen } from "@/components/boot/BootScreen";
import { Desktop } from "@/components/desktop/Desktop";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LockScreen } from "@/components/os/LockScreen";
import { RecruiterMode } from "@/components/recruiter/RecruiterMode";
import { useOsStore } from "@/store/osStore";

export default function App() {
  const phase = useOsStore((s) => s.phase);
  const recruiterMode = useOsStore((s) => s.recruiterMode);
  const setRecruiterMode = useOsStore((s) => s.setRecruiterMode);

  return (
    <div className="os-root">
      <a href="#os-main" className="skip-link">
        Skip to ARYAN OS
      </a>
      <button type="button" className="skip-link skip-link-resume" onClick={() => setRecruiterMode(true)}>
        Skip to resume
      </button>
      {phase === "boot" ? (
        <BootScreen />
      ) : (
        <ErrorBoundary>
          <Desktop />
        </ErrorBoundary>
      )}
      {recruiterMode && <RecruiterMode />}
      <LockScreen />
    </div>
  );
}
