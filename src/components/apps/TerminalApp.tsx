import { useEffect, useRef, useState } from "react";
import { runCommand } from "@/lib/terminal";
import { cn } from "@/lib/cn";
import { useOsStore } from "@/store/osStore";

interface Line {
  kind: "in" | "out" | "sys";
  text: string;
}

export default function TerminalApp() {
  const openApp = useOsStore((s) => s.openApp);
  const developerMode = useOsStore((s) => s.developerMode);
  const [lines, setLines] = useState<Line[]>([
    { kind: "sys", text: "ARYAN OS v2.0 · type help" },
  ]);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const history = useRef<string[]>([]);
  const historyIndex = useRef(-1);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines, busy]);

  const submit = (raw: string) => {
    const input = raw.trim();
    if (!input || busy) return;
    history.current = [...history.current, input];
    historyIndex.current = -1;
    setValue("");
    setLines((current) => [...current, { kind: "in", text: `> ${input}` }]);

    const result = runCommand(input, developerMode);

    if (result.action?.type === "clear") {
      setLines([]);
      return;
    }

    if (result.action?.type === "scan") {
      setBusy(true);
      setLines((current) => [...current, { kind: "sys", text: "Scanning filesystem..." }]);
      window.setTimeout(() => {
        setLines((current) => [
          ...current,
          { kind: "sys", text: "████████████████████ 100%" },
          { kind: "sys", text: "Projects found." },
          { kind: "sys", text: "" },
          ...result.lines.map((text) => ({ kind: "out" as const, text })),
        ]);
        setBusy(false);
        openApp("projects");
      }, 520);
      return;
    }

    if (result.lines.length) {
      setLines((current) => [...current, ...result.lines.map((text) => ({ kind: "out" as const, text }))]);
    }
    if (result.action?.type === "open") {
      openApp(result.action.appId);
    }
  };

  return (
    <div
      className="flex h-full min-h-[280px] flex-col bg-[#070b10] font-mono text-[13px]"
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={scroller}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        className="min-h-0 flex-1 overflow-auto px-4 py-3 leading-6"
      >
        {lines.map((line, index) => (
          <pre
            key={`${index}-${line.text}`}
            className={cn(
              "whitespace-pre-wrap break-words",
              line.kind === "in" && "text-os-accent",
              line.kind === "sys" && "text-os-muted",
              line.kind === "out" && "text-os-text/90",
            )}
          >
            {line.text || " "}
          </pre>
        ))}
        {busy && <p className="text-os-muted">working…</p>}
      </div>
      <form
        className="flex items-center gap-2 border-t border-white/8 px-4 py-2"
        onSubmit={(event) => {
          event.preventDefault();
          submit(value);
        }}
      >
        <label htmlFor="terminal-input" className="text-os-accent">
          {">"}
        </label>
        <input
          id="terminal-input"
          ref={inputRef}
          value={value}
          disabled={busy}
          autoComplete="off"
          spellCheck={false}
          aria-label="Terminal command"
          className="min-w-0 flex-1 bg-transparent text-os-text outline-none"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault();
              const list = history.current;
              if (!list.length) return;
              const next = historyIndex.current < 0 ? list.length - 1 : Math.max(0, historyIndex.current - 1);
              historyIndex.current = next;
              setValue(list[next] ?? "");
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              const list = history.current;
              if (historyIndex.current < 0) return;
              const next = historyIndex.current + 1;
              if (next >= list.length) {
                historyIndex.current = -1;
                setValue("");
              } else {
                historyIndex.current = next;
                setValue(list[next] ?? "");
              }
            }
          }}
        />
      </form>
    </div>
  );
}
