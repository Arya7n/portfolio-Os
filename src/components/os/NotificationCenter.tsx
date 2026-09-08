import { useOsStore } from "@/store/osStore";

export function NotificationCenter() {
  const log = useOsStore((s) => s.notificationLog);
  const clearLog = useOsStore((s) => s.clearLog);

  return (
    <div className="w-80 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium">Notifications</p>
        <button type="button" className="font-mono text-[10px] text-os-muted hover:text-os-text" onClick={clearLog}>
          Clear
        </button>
      </div>
      {log.length === 0 ? (
        <p className="text-xs text-os-muted">No recent notices.</p>
      ) : (
        <ul className="max-h-72 space-y-2 overflow-auto">
          {log.map((item) => (
            <li key={item.id} className="border-b border-os-line pb-2">
              <p className="text-xs text-os-accent">{item.title}</p>
              <p className="text-sm">{item.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
