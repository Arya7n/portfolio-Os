import { getSceneTheme } from "@/data/themes";
import { useOsStore } from "@/store/osStore";

export function Atmosphere() {
  const wallpaper = useOsStore((s) => s.wallpaper);
  const theme = getSceneTheme(wallpaper);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: theme.void }} />
      <div
        className="horizon-grid absolute -bottom-[42%] left-[-18%] h-[88%] w-[136%] opacity-[0.18]"
        style={{
          backgroundImage: `linear-gradient(${theme.grid}33 1px, transparent 1px), linear-gradient(90deg, ${theme.grid}33 1px, transparent 1px)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 55% 38% at 50% 40%, ${theme.accent}10, transparent 64%), linear-gradient(to top, ${theme.void} 0%, transparent 46%)`,
        }}
      />
      <div className="noise absolute inset-0" />
    </div>
  );
}
