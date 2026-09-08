import { AnimatePresence } from "framer-motion";
import { BootScreen } from "@/components/boot/BootScreen";
import { Desktop } from "@/components/desktop/Desktop";
import { RecruiterMode } from "@/components/recruiter/RecruiterMode";
import { useOsStore } from "@/store/osStore";

export default function App() {
  const phase = useOsStore((s) => s.phase);
  const recruiterMode = useOsStore((s) => s.recruiterMode);

  return (
    <div className="os-root">
      <AnimatePresence mode="wait">
        {phase === "desktop" ? <Desktop key="desktop" /> : <BootScreen key="boot" />}
      </AnimatePresence>
      {recruiterMode && <RecruiterMode />}
    </div>
  );
}
