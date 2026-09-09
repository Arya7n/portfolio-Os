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
  const weekday = now.toLocaleDateString(undefined, { weekday: "long" });

  return (
    <div className="w-[min(100vw-24px,260px)] p-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-os-muted">{weekday}</p>
      <p className="mt-0.5 text-[15px] font-medium">{label}</p>
      <div className="mt-3 grid grid-cols-7 gap-y-1 text-center text-[11px]">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={`${d}-${i}`} className="h-6 text-os-muted/70">
            {d}
          </span>
        ))}
        {cells.map((day, i) => (
          <span
            key={i}
            className={
              day === today
                ? "inline-flex h-7 w-7 items-center justify-center justify-self-center rounded-full bg-os-accent text-[12px] text-white"
                : "inline-flex h-7 w-7 items-center justify-center justify-self-center text-[12px] text-os-text/85"
            }
          >
            {day ?? ""}
          </span>
        ))}
      </div>
    </div>
  );
}
