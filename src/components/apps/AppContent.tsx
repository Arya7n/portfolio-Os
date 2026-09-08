import { lazy, Suspense } from "react";
import type { AppId } from "@/data/apps";

const AboutApp = lazy(() => import("@/components/apps/AboutApp").then((m) => ({ default: m.AboutApp })));
const ExperienceApp = lazy(() =>
  import("@/components/apps/ExperienceApp").then((m) => ({ default: m.ExperienceApp })),
);
const FilesApp = lazy(() => import("@/components/apps/FilesApp").then((m) => ({ default: m.FilesApp })));
const ProjectsApp = lazy(() => import("@/components/apps/ProjectsApp").then((m) => ({ default: m.ProjectsApp })));
const ResumeApp = lazy(() => import("@/components/apps/ResumeApp").then((m) => ({ default: m.ResumeApp })));
const SettingsApp = lazy(() => import("@/components/apps/SettingsApp").then((m) => ({ default: m.SettingsApp })));
const SkillsApp = lazy(() => import("@/components/apps/SkillsApp").then((m) => ({ default: m.SkillsApp })));
const TerminalApp = lazy(() => import("@/components/apps/TerminalApp"));
const GithubApp = lazy(() => import("@/components/apps/GithubApp"));
const ContactApp = lazy(() => import("@/components/apps/ContactApp"));
const SnakeApp = lazy(() => import("@/components/apps/SnakeApp"));

function ModuleFallback() {
  return (
    <p className="p-5 font-mono text-xs text-os-muted" role="status">
      Loading module…
    </p>
  );
}

export function AppContent({ appId }: { appId: AppId }) {
  const app = (() => {
    switch (appId) {
      case "about":
        return <AboutApp />;
      case "experience":
        return <ExperienceApp />;
      case "projects":
        return <ProjectsApp />;
      case "skills":
        return <SkillsApp />;
      case "resume":
        return <ResumeApp />;
      case "terminal":
        return <TerminalApp />;
      case "github":
        return <GithubApp />;
      case "contact":
        return <ContactApp />;
      case "files":
        return <FilesApp />;
      case "settings":
        return <SettingsApp />;
      case "snake":
        return <SnakeApp />;
      default:
        return <ModuleFallback />;
    }
  })();

  return <Suspense fallback={<ModuleFallback />}>{app}</Suspense>;
}
