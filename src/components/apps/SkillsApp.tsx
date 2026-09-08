import { useMemo, useState } from "react";
import {
  skillCategoryMeta,
  skillEdges,
  skillNodes,
  type SkillCategory,
  type SkillNode,
} from "@/data/skillGraph";
import { cn } from "@/lib/cn";

export function SkillsApp() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<SkillCategory | "all">("all");

  const activeId = selected ?? hovered;
  const active = skillNodes.find((node) => node.id === activeId) ?? null;

  const related = useMemo(() => {
    if (!active) return new Set<string>();
    return new Set([active.id, ...active.related]);
  }, [active]);

  const visibleNodes =
    filter === "all" ? skillNodes : skillNodes.filter((node) => node.category === filter);

  return (
    <div className="flex min-h-full flex-col">
      <div className="space-y-3 border-b border-white/8 p-4">
        <div>
          <p className="text-xs text-os-accent">Skills</p>
          <p className="mt-1 text-xs text-os-muted">Hover for context. Click a node to pin related systems.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip label="All" active={filter === "all"} onClick={() => setFilter("all")} />
          {(Object.keys(skillCategoryMeta) as SkillCategory[]).map((id) => (
            <FilterChip
              key={id}
              label={skillCategoryMeta[id].label}
              active={filter === id}
              onClick={() => setFilter(id)}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        <div className="relative mx-auto aspect-[1.55/1] min-h-[320px] w-full max-w-4xl">
          <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
            {skillEdges.map((edge) => {
              const from = skillNodes.find((node) => node.id === edge.from);
              const to = skillNodes.find((node) => node.id === edge.to);
              if (!from || !to) return null;
              const lit = !active || (related.has(from.id) && related.has(to.id));
              const inFilter =
                filter === "all" || from.category === filter || to.category === filter;
              if (!inFilter) return null;
              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke={lit ? "rgba(142,180,255,0.45)" : "rgba(142,180,255,0.08)"}
                  strokeWidth={lit && active ? 1.6 : 1}
                />
              );
            })}
          </svg>

          {visibleNodes.map((node) => (
            <SkillButton
              key={node.id}
              node={node}
              dimmed={Boolean(active) && !related.has(node.id)}
              active={active?.id === node.id}
              onHover={setHovered}
              onSelect={() => setSelected((current) => (current === node.id ? null : node.id))}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-white/8 p-4">
        {active ? (
          <div>
            <p className="text-sm font-medium">{active.label}</p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-os-accent">
              {skillCategoryMeta[active.category].label}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-os-muted">{active.usedIn}</p>
            <p className="mt-2 text-[11px] text-os-muted">Related: {active.related.join(" · ")}</p>
          </div>
        ) : (
          <p className="text-xs text-os-muted">Select a technology to highlight its neighborhood.</p>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.12em]",
        active ? "border-os-accent/40 bg-os-accent/12 text-os-text" : "border-white/10 text-os-muted",
      )}
    >
      {label}
    </button>
  );
}

function SkillButton({
  node,
  dimmed,
  active,
  onHover,
  onSelect,
}: {
  node: SkillNode;
  dimmed: boolean;
  active: boolean;
  onHover: (id: string | null) => void;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node.id)}
      onBlur={() => onHover(null)}
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 text-[11px] transition",
        active
          ? "z-10 border-os-accent bg-os-accent/20 text-os-text"
          : "border-white/12 bg-os-panel/90 text-os-text/90 hover:border-os-accent/40",
        dimmed && "opacity-30",
      )}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      {node.label}
    </button>
  );
}
