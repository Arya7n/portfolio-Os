export function Atmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(142,180,255,0.10),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(196,181,253,0.06),transparent_24%)]" />
      <div className="horizon-grid absolute -bottom-[35%] left-[-20%] h-[90%] w-[140%] opacity-80" />
      <div
        className="absolute left-[12%] top-[18%] h-56 w-56 rounded-full bg-os-accent/8 blur-3xl"
        style={{ animation: "float-slow 14s ease-in-out infinite" }}
      />
      <div
        className="absolute right-[10%] top-[38%] h-40 w-40 rounded-full bg-os-ok/8 blur-3xl"
        style={{ animation: "float-slow 18s ease-in-out infinite reverse" }}
      />
      <div className="noise absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-os-void/80" />
    </div>
  );
}
