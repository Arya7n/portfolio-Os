import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { experience, type ExperienceRole } from "@/data/experience";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function ExperienceApp() {
  const [selectedId, setSelectedId] = useState(experience[0]?.id ?? "");
  const selected = experience.find((role) => role.id === selectedId) ?? experience[0];
  const grouped = useMemo(() => {
    const years = new Map<string, ExperienceRole[]>();
    for (const role of experience) {
      const list = years.get(role.year) ?? [];
      list.push(role);
      years.set(role.year, list);
    }
    return [...years.entries()];
  }, []);

  return (
    <div className="grid min-h-full lg:grid-cols-[minmax(220px,280px)_1fr]">
      <nav className="border-b border-white/8 p-4 lg:border-b-0 lg:border-r" aria-label="Experience timeline">
        <p className="font-mono text-[11px] tracking-[0.2em] text-os-muted">EXPERIENCE</p>
        <div className="mt-4 space-y-6">
          {grouped.map(([year, roles]) => (
            <div key={year}>
              <p className="font-mono text-xs text-os-muted">{year}</p>
              <ol className="mt-2 space-y-2 border-l border-os-accent/35 pl-3">
                {roles.map((role) => {
                  const active = role.id === selected.id;
                  return (
                    <li key={role.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(role.id)}
                        aria-current={active ? "true" : undefined}
                        className={cn(
                          "w-full rounded-lg px-2 py-2 text-left transition",
                          active ? "bg-os-accent/12 text-os-text" : "hover:bg-white/5",
                        )}
                      >
                        <span className="block text-sm font-medium">{role.company}</span>
                        <span className="mt-0.5 block text-[11px] text-os-muted">{role.role}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </nav>

      {selected && <ExperienceDetail role={selected} />}
    </div>
  );
}

function ExperienceDetail({ role }: { role: ExperienceRole }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="space-y-5 p-5">
      <div>
        <p className="text-xs text-os-accent">{role.current ? "Current" : "Role"}</p>
        <h3 className="mt-2 font-display text-2xl font-medium">{role.company}</h3>
        <p className="mt-1 text-sm text-os-muted">
          {role.role} · {role.start} – {role.end}
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {role.metrics.map((metric, index) => (
            <motion.div
              key={`${role.id}-${metric.label}`}
              initial={reducedMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
              className="rounded-xl border border-os-accent/25 bg-os-accent/8 px-3 py-3"
            >
              <p className="font-display text-2xl font-semibold tracking-wide text-os-accent">
                {metric.value}
              </p>
              <p className="mt-1 text-xs text-os-muted">{metric.label}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div>
        <p className="text-xs text-os-muted">Responsibilities</p>
        <ul className="mt-2 space-y-2 text-sm leading-relaxed text-os-text/90">
          {role.highlights.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-os-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs text-os-muted">Technologies</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {role.technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
