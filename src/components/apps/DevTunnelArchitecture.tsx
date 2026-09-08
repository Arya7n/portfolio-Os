import { useMemo, useState } from "react";
import type { ArchitectureNode } from "@/data/projects";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const FLOW = ["local", "cli", "ws", "server"] as const;
const STORE = ["redis", "postgres"] as const;
const EDGE = ["public", "dashboard"] as const;

export function DevTunnelArchitecture({ nodes }: { nodes: ArchitectureNode[] }) {
  const [activeId, setActiveId] = useState(nodes[0]?.id ?? "server");
  const reducedMotion = usePrefersReducedMotion();
  const byId = useMemo(
    () => Object.fromEntries(nodes.map((node) => [node.id, node])),
    [nodes],
  );
  const active = byId[activeId] ?? nodes[0];

  return (
    <div className="space-y-4">
      <p className="font-mono text-[10px] tracking-[0.2em] text-os-muted">
        REQUEST PATH · click a node
      </p>

      <div className="space-y-2">
        <Row ids={[...FLOW]} byId={byId} activeId={activeId} onSelect={setActiveId} />
        <Connector reducedMotion={reducedMotion} />
        <Row ids={[...STORE]} byId={byId} activeId={activeId} onSelect={setActiveId} />
        <Connector reducedMotion={reducedMotion} />
        <Row ids={[...EDGE]} byId={byId} activeId={activeId} onSelect={setActiveId} />
      </div>

      {active && (
        <div className="rounded-xl border border-os-accent/25 bg-os-accent/8 p-3">
          <p className="font-mono text-[10px] tracking-[0.2em] text-os-accent">{active.label}</p>
          <p className="mt-2 text-sm">{active.summary}</p>
          <ul className="mt-2 space-y-1 text-xs text-os-muted">
            {active.points.map((point) => (
              <li key={point}>· {point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Row({
  ids,
  byId,
  activeId,
  onSelect,
}: {
  ids: string[];
  byId: Record<string, ArchitectureNode>;
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {ids.map((id, index) => {
        const node = byId[id];
        if (!node) return null;
        return (
          <div key={id} className="flex items-center gap-2">
            {index > 0 && <span className="font-mono text-os-muted/70">→</span>}
            <button
              type="button"
              onClick={() => onSelect(id)}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-xs transition",
                activeId === id
                  ? "border-os-accent/50 bg-os-accent/15 text-os-text"
                  : "border-white/10 bg-white/[0.03] text-os-muted hover:text-os-text",
              )}
            >
              {node.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function Connector({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="relative ml-4 h-6 w-px bg-os-accent/30">
      {!reducedMotion && <span className="arch-packet absolute left-[-3px] h-1.5 w-1.5 rounded-full bg-os-accent" />}
    </div>
  );
}
