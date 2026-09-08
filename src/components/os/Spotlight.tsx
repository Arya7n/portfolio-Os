import { useEffect, useMemo, useRef, useState } from "react";
import { listedApps, type AppId } from "@/data/apps";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { AppIcon } from "@/components/icons/AppIcons";
import { useOsStore } from "@/store/osStore";

export function Spotlight() {
  const open = useOsStore((s) => s.spotlightOpen);
  const setSpotlight = useOsStore((s) => s.setSpotlight);
  const openApp = useOsStore((s) => s.openApp);
  const setRecruiterMode = useOsStore((s) => s.setRecruiterMode);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      inputRef.current?.focus();
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const apps = listedApps(query).map((app) => ({
      id: app.id,
      label: app.title,
      meta: app.filename,
      kind: "app" as const,
    }));
    const projectHits = projects
      .filter((project) => !q || project.name.toLowerCase().includes(q) || project.description.toLowerCase().includes(q))
      .slice(0, 5)
      .map((project) => ({
        id: `p-${project.id}`,
        label: project.name,
        meta: "project",
        kind: "project" as const,
      }));
    const roleHits = experience
      .filter((role) => !q || role.company.toLowerCase().includes(q) || role.role.toLowerCase().includes(q))
      .map((role) => ({
        id: `e-${role.id}`,
        label: role.company,
        meta: role.role,
        kind: "role" as const,
      }));
    const actions = [
      { id: "recruiter", label: "Recruiter Mode", meta: "resume view", kind: "action" as const },
    ].filter((item) => !q || item.label.toLowerCase().includes(q));
    return [...apps, ...projectHits, ...roleHits, ...actions].slice(0, 10);
  }, [query]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-[90] flex items-start justify-center pt-[12vh]">
      <button type="button" className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-label="Close search" onClick={() => setSpotlight(false)} />
      <div className="glass-panel relative w-[min(92vw,560px)] overflow-hidden rounded-2xl" role="dialog" aria-label="Search" onContextMenu={(event) => event.stopPropagation()}>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search apps, projects, experience…"
          className="w-full border-b border-white/8 bg-transparent px-5 py-4 text-[15px] outline-none"
          onKeyDown={(event) => {
            if (event.key === "Escape") setSpotlight(false);
            if (event.key === "Enter" && results[0]) {
              const first = results[0];
              if (first.kind === "app") openApp(first.id as AppId);
              if (first.kind === "project") openApp("projects");
              if (first.kind === "role") openApp("experience");
              if (first.kind === "action") setRecruiterMode(true);
              setSpotlight(false);
            }
          }}
        />
        <ul className="max-h-72 overflow-auto py-1">
          {results.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-white/8"
                onClick={() => {
                  if (item.kind === "app") openApp(item.id as AppId);
                  if (item.kind === "project") openApp("projects");
                  if (item.kind === "role") openApp("experience");
                  if (item.kind === "action") setRecruiterMode(true);
                  setSpotlight(false);
                }}
              >
                <span className="w-16 shrink-0 font-mono text-[10px] text-os-muted">{item.kind}</span>
                <span className="flex-1">
                  {item.kind === "app" && (
                    <span className="mr-2 inline-flex h-4 w-4 align-middle text-os-accent">
                      <AppIcon id={item.id as AppId} />
                    </span>
                  )}
                  {item.label}
                </span>
                <span className="font-mono text-[10px] text-os-muted">{item.meta}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
