import { useState } from "react";
import { AppIcon } from "@/components/icons/AppIcons";
import type { AppId } from "@/data/apps";
import { desktopApps } from "@/data/apps";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { useOsStore } from "@/store/osStore";

type Entry =
  | { kind: "folder"; name: string; id: string }
  | { kind: "file"; name: string; id: string; appId: AppId };

const ROOT: Entry[] = [
  { kind: "folder", name: "Documents", id: "documents" },
  { kind: "folder", name: "Projects", id: "projects" },
  { kind: "folder", name: "Applications", id: "apps" },
];

const FOLDERS: Record<string, Entry[]> = {
  documents: [
    { kind: "file", name: "resume.pdf", id: "resume", appId: "resume" },
    { kind: "file", name: "about.txt", id: "about", appId: "about" },
  ],
  projects: projects.slice(0, 8).map((project) => ({
    kind: "file" as const,
    name: project.name,
    id: project.id,
    appId: "projects" as const,
  })),
  apps: desktopApps.map((app) => ({
    kind: "file" as const,
    name: app.filename,
    id: app.id,
    appId: app.id,
  })),
};

export function FilesApp() {
  const openApp = useOsStore((s) => s.openApp);
  const [folder, setFolder] = useState<string | null>(null);
  const entries = folder ? FOLDERS[folder] ?? [] : ROOT;
  const path = folder ? `/home/${profile.handle.toLowerCase()}/${folder}` : `/home/${profile.handle.toLowerCase()}`;

  return (
    <div className="flex h-full min-h-[360px] flex-col text-sm">
      <div className="flex items-center gap-2 border-b border-os-line px-3 py-2">
        <button
          type="button"
          className="rounded-lg border border-os-line px-2 py-1 text-xs text-os-muted hover:text-os-text disabled:opacity-40"
          disabled={!folder}
          onClick={() => setFolder(null)}
        >
          ← Home
        </button>
        <p className="font-mono text-[11px] text-os-muted">{path}</p>
      </div>
      <ul className="grid grid-cols-2 gap-1 p-3 sm:grid-cols-3">
        {entries.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl border border-transparent px-2 py-2 text-left hover:bg-white/8"
              onDoubleClick={() => {
                if (entry.kind === "folder") setFolder(entry.id);
                else openApp(entry.appId);
              }}
              onClick={() => {
                if (entry.kind === "folder") setFolder(entry.id);
                else openApp(entry.appId);
              }}
            >
              {entry.kind === "folder" ? (
                <span className="h-5 w-5 shrink-0 text-os-accent">
                  <AppIcon id="files" className="h-5 w-5" />
                </span>
              ) : (
                <span className="h-5 w-5 shrink-0 text-os-accent">
                  <AppIcon id={entry.appId} className="h-5 w-5" />
                </span>
              )}
              <span className="truncate">{entry.name}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-auto border-t border-os-line px-3 py-2 font-mono text-[10px] text-os-muted">
        {entries.length} items · click to open
      </p>
    </div>
  );
}
