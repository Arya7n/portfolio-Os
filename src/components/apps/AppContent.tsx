import { lazy, Suspense } from "react";
import { AboutApp } from "@/components/apps/AboutApp";
import { ExperienceApp } from "@/components/apps/ExperienceApp";
import { FilesApp } from "@/components/apps/FilesApp";
import { ProjectsApp } from "@/components/apps/ProjectsApp";
import { ResumeApp } from "@/components/apps/ResumeApp";
import { SettingsApp } from "@/components/apps/SettingsApp";
import { SkillsApp } from "@/components/apps/SkillsApp";
import type { AppId } from "@/data/apps";

const TerminalApp = lazy(() => import("@/components/apps/TerminalApp"));
const GithubApp = lazy(() => import("@/components/apps/GithubApp"));
const ContactApp = lazy(() => import("@/components/apps/ContactApp"));

function ModuleFallback() {
  return (
    <p className="p-5 font-mono text-xs text-os-muted" role="status">
      Loading module…
    </p>
  );
}

export function AppContent({ appId }: { appId: AppId }) {
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
      return (
        <Suspense fallback={<ModuleFallback />}>
          <TerminalApp />
        </Suspense>
      );
    case "github":
      return (
        <Suspense fallback={<ModuleFallback />}>
          <GithubApp />
        </Suspense>
      );
    case "contact":
      return (
        <Suspense fallback={<ModuleFallback />}>
          <ContactApp />
        </Suspense>
      );
    case "files":
      return <FilesApp />;
    case "settings":
      return <SettingsApp />;
    default:
      return <ModuleFallback />;
  }
}
