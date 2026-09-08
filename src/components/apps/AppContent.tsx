import { AboutApp } from "@/components/apps/AboutApp";
import { ExperienceApp } from "@/components/apps/ExperienceApp";
import { ProjectsApp } from "@/components/apps/ProjectsApp";
import { ResumeApp } from "@/components/apps/ResumeApp";
import { SkillsApp } from "@/components/apps/SkillsApp";
import { StubApp } from "@/components/apps/StubApp";
import type { AppId } from "@/data/apps";

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
    default:
      return <StubApp appId={appId} />;
  }
}
