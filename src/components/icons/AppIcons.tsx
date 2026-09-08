import type { ReactNode } from "react";
import type { AppId } from "@/data/apps";
import { cn } from "@/lib/cn";

interface IconProps {
  className?: string;
}

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    >
      {children}
    </svg>
  );
}

export function AboutIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <circle cx="16" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 24.5c1.4-4 4.2-6 8-6s6.6 2 8 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Frame>
  );
}

export function ExperienceIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect x="7" y="10" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 10V8.5a4 4 0 0 1 8 0V10" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 16h18" stroke="currentColor" strokeWidth="1.6" />
    </Frame>
  );
}

export function ProjectsIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect x="6" y="14" width="10" height="10" rx="1.4" stroke="currentColor" strokeWidth="1.6" />
      <rect x="16" y="8" width="10" height="10" rx="1.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 14V11h5" stroke="currentColor" strokeWidth="1.6" />
    </Frame>
  );
}

export function SkillsIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <circle cx="10" cy="16" r="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="22" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="22" cy="22" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12.8 14.2 19 11.3M12.8 17.8 19 20.7" stroke="currentColor" strokeWidth="1.6" />
    </Frame>
  );
}

export function TerminalIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect x="6" y="8" width="20" height="16" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 13l3.5 3L10 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 19h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Frame>
  );
}

export function ResumeIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <path
        d="M10 6.5h8.2L24 12.3V25a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 9 25V8a1.5 1.5 0 0 1 1-1.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M18 6.5V12h6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13 16h6M13 20h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Frame>
  );
}

export function GithubIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <path
        d="M16 7.2c-4.9 0-8.8 3.9-8.8 8.8 0 3.9 2.5 7.2 6 8.3.4.1.6-.2.6-.4v-1.5c-2.4.5-2.9-1-2.9-1-.4-1-1-1.2-1-1.2-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2.2 1 2.7.8.1-.6.3-1 .6-1.2-2-.2-4-1-4-4.4 0-1 .4-1.8 1-2.4-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.6 1a9 9 0 0 1 4.8 0c1.8-1.3 2.6-1 2.6-1 .5 1.3.2 2.3.1 2.6.6.6 1 1.4 1 2.4 0 3.4-2.1 4.2-4.1 4.4.3.3.6.8.6 1.7v2.5c0 .2.2.5.6.4 3.5-1.1 6-4.4 6-8.3 0-4.9-3.9-8.8-8.8-8.8Z"
        fill="currentColor"
      />
    </Frame>
  );
}

export function ContactIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <path d="M7 16h4l2-5 3 10 2-5h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="16" r="1.4" fill="currentColor" />
    </Frame>
  );
}

export function FilesIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <path
        d="M8 10.5h6l2 2.5h8.5v11A1.5 1.5 0 0 1 23 25.5H9A1.5 1.5 0 0 1 7.5 24V12A1.5 1.5 0 0 1 9 10.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </Frame>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <circle cx="16" cy="16" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M16 7v2.2M16 22.8V25M7 16h2.2M22.8 16H25M9.7 9.7l1.6 1.6M20.7 20.7l1.6 1.6M9.7 22.3l1.6-1.6M20.7 11.3l1.6-1.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Frame>
  );
}

export function SnakeIcon({ className }: IconProps) {
  return (
    <Frame className={className}>
      <path
        d="M7 21c0-3.4 2.6-5.2 5.4-5.2h5.2c2.6 0 4.4-1.8 4.4-4.2 0-2.3-1.8-4-4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="22" cy="7.6" r="1.5" fill="currentColor" />
      <path d="M9.2 21h3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Frame>
  );
}

export function OsMark({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect x="5" y="5" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
      <path d="M10 23 L16 9 L22 23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.4 17.5h7.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Frame>
  );
}

const icons: Record<AppId, (props: IconProps) => ReactNode> = {
  about: AboutIcon,
  experience: ExperienceIcon,
  projects: ProjectsIcon,
  skills: SkillsIcon,
  terminal: TerminalIcon,
  resume: ResumeIcon,
  github: GithubIcon,
  contact: ContactIcon,
  files: FilesIcon,
  settings: SettingsIcon,
  snake: SnakeIcon,
};

export function AppIcon({ id, className }: { id: AppId; className?: string }) {
  const Icon = icons[id];
  return <Icon className={className} />;
}
