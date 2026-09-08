import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DevTunnelArchitecture } from "@/components/apps/DevTunnelArchitecture";
import { projects, type Project } from "@/data/projects";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useOsStore } from "@/store/osStore";

let projectsNotified = false;

export function ProjectsApp() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const pushNotification = useOsStore((s) => s.pushNotification);
  const setFocusedProjectId = useOsStore((s) => s.setFocusedProjectId);
  const selected = projects.find((project) => project.id === selectedId) ?? null;
  const visible = showAll ? projects : projects.filter((project) => project.featured);

  useEffect(() => {
    if (projectsNotified) return;
    projectsNotified = true;
    pushNotification("Projects", "Projects loaded.");
  }, [pushNotification]);

  useEffect(() => {
    setFocusedProjectId(selectedId);
    return () => setFocusedProjectId(null);
  }, [selectedId, setFocusedProjectId]);

  if (selected) {
    return <ProjectDetail project={selected} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-os-muted">PROJECT EXPLORER</p>
          <h3 className="mt-1 font-display text-xl font-medium">Repositories</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowAll((value) => !value)}
          className="rounded-full border border-white/12 px-3 py-1.5 font-mono text-[11px] text-os-muted hover:text-os-text"
        >
          {showAll ? "Featured" : "All repos"}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {visible.map((project) => (
          <ProjectCard key={project.id} project={project} onOpen={() => setSelectedId(project.id)} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={reducedMotion ? undefined : { y: -4, scale: 1.01, transition: { duration: 0.18 } }}
      className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left hover:border-white/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] text-os-muted">{project.id}.repo</p>
          <h4 className="mt-1 font-medium">{project.name}</h4>
        </div>
        <span className="font-mono text-[10px] text-os-muted">{project.language ?? "—"}</span>
      </div>
      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-os-muted">
        {project.description || "Public repository on GitHub."}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.id === "devtunnel" && (
          <span className="rounded-full bg-os-accent/15 px-2 py-0.5 text-[10px] text-os-accent">Flagship</span>
        )}
        {project.technologies.slice(0, 4).map((tech) => (
          <span key={tech} className="rounded-full border border-white/8 px-2 py-0.5 text-[10px] text-os-muted">
            {tech}
          </span>
        ))}
      </div>
    </motion.button>
  );
}

function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const tabs = [
    "Overview",
    project.architectureNodes ? "Architecture" : null,
    "Tech stack",
    project.problem ? "Challenge" : null,
    project.features?.length ? "Features" : null,
    project.status ? "Results" : null,
    "Links",
  ].filter((tab): tab is string => Boolean(tab));
  const [tab, setTab] = useState(tabs[0]);

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-white/10 px-2 py-1 font-mono text-[11px] text-os-muted hover:text-os-text"
        >
          ← explorer
        </button>
        <div className="min-w-0">
          <p className="truncate font-medium">{project.name}</p>
          <p className="truncate font-mono text-[10px] text-os-muted">{project.url}</p>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-white/8 px-4 py-2">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "rounded-full px-3 py-1 text-[12px]",
              tab === item ? "bg-white/10 text-os-text" : "text-os-muted hover:text-os-text",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-4 p-4 text-sm">
        {tab === "Overview" && (
          <>
            <p className="leading-relaxed text-os-text/90">
              {project.description || "No README description is published for this repository."}
            </p>
            {project.architecture && (
              <ol className="space-y-1 font-mono text-[12px] text-os-muted">
                {project.architecture.map((step, index) => (
                  <li key={step}>
                    {index + 1}. {step}
                  </li>
                ))}
              </ol>
            )}
          </>
        )}

        {tab === "Architecture" && project.architectureNodes && (
          <DevTunnelArchitecture nodes={project.architectureNodes} />
        )}

        {tab === "Tech stack" && (
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li key={tech} className="rounded-full border border-white/10 px-3 py-1 text-xs">
                {tech}
              </li>
            ))}
          </ul>
        )}

        {tab === "Challenge" && project.problem && (
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <p className="font-mono text-[10px] tracking-[0.18em] text-os-muted">ENGINEERING CHALLENGE</p>
            <p className="mt-2 leading-relaxed">{project.problem}</p>
          </div>
        )}

        {tab === "Features" && project.features && (
          <ul className="space-y-2">
            {project.features.map((feature) => (
              <li key={feature} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-os-accent" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        {tab === "Results" && project.status && (
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <p className="font-mono text-[10px] tracking-[0.18em] text-os-muted">STATUS</p>
            <p className="mt-2 leading-relaxed">{project.status}</p>
          </div>
        )}

        {tab === "Links" && (
          <div className="flex flex-wrap gap-2">
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-os-accent px-3 py-1.5 text-xs font-medium text-white"
            >
              GitHub
            </a>
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/12 px-3 py-1.5 text-xs"
              >
                Live demo
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
