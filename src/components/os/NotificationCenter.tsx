import { useOsStore } from "@/store/osStore";

export function NotificationCenter() {
  const log = useOsStore((s) => s.notificationLog);
  const clearLog = useOsStore((s) => s.clearLog);

  return (
    <div className="w-72 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[13px] font-medium">Notifications</p>
        {log.length > 0 && (
          <button type="button" className="text-[11px] text-os-muted hover:text-os-text" onClick={clearLog}>
            Clear
          </button>
        )}
      </div>
      {log.length === 0 ? (
        <p className="text-[12px] text-os-muted">You’re all caught up.</p>
      ) : (
        <ul className="max-h-72 space-y-2 overflow-auto">
          {log.map((item) => (
            <li key={item.id} className="rounded-xl bg-white/5 px-3 py-2">
              <p className="text-[11px] text-os-muted">{item.title}</p>
              <p className="mt-0.5 text-[13px]">{item.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
