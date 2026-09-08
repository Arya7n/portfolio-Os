import { AnimatePresence, motion } from "framer-motion";
import { useOsStore } from "@/store/osStore";

export function NotificationHost() {
  const notifications = useOsStore((s) => s.notifications);
  const dismissNotification = useOsStore((s) => s.dismissNotification);

  return (
    <div className="pointer-events-none absolute right-3 top-14 z-[80] flex w-[min(100%-24px,320px)] flex-col gap-2">
      <AnimatePresence>
        {notifications.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 24, y: -6 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 16 }}
            className="pointer-events-auto glass-panel rounded-2xl px-3 py-2.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] text-os-accent">{item.title}</p>
                <p className="mt-1 text-sm text-os-text">{item.body}</p>
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => dismissNotification(item.id)}
                className="text-os-muted transition hover:text-os-text"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
