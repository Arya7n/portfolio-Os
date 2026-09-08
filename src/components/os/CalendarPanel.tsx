import { useClock } from "@/hooks/useClock";

export function CalendarPanel() {
  const { now } = useClock();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();
  const cells = Array.from({ length: first + days }, (_, i) => (i < first ? null : i - first + 1));
  const label = now.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <div className="w-64 p-3">
      <p className="mb-2 font-medium">{label}</p>
      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-os-muted">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d}>{d}</span>
        ))}
        {cells.map((day, i) => (
          <span
            key={i}
            className={
              day === today
                ? "rounded bg-os-accent/20 text-os-accent"
                : "text-os-text"
            }
          >
            {day ?? ""}
          </span>
        ))}
      </div>
    </div>
  );
}
