import { getSceneTheme } from "@/data/themes";
import { BUILT_IN_WALLPAPERS, type BuiltInWallpaperId } from "@/data/wallpapers";
import { useOsStore } from "@/store/osStore";

export function WallpaperLayer({ dim = false }: { dim?: boolean }) {
  const wallpaper = useOsStore((s) => s.wallpaper);
  const customId = useOsStore((s) => s.customId);
  const library = useOsStore((s) => s.customWallpapers);
  const customUrl = library.find((item) => item.id === customId)?.dataUrl ?? library[0]?.dataUrl ?? null;
  const isCustom = wallpaper === "custom" && Boolean(customUrl);
  const builtIn: BuiltInWallpaperId =
    wallpaper !== "custom" && (BUILT_IN_WALLPAPERS as string[]).includes(wallpaper)
      ? (wallpaper as BuiltInWallpaperId)
      : "harbor";
  const theme = getSceneTheme(builtIn);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {isCustom ? (
        <div
          className="absolute inset-0 bg-os-void bg-cover bg-center"
          style={{ backgroundImage: `url(${customUrl})` }}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: theme.void }} />
      )}
      <div className="noise absolute inset-0" />
      {dim && <div className="absolute inset-0 bg-gradient-to-r from-os-void via-os-void/70 to-os-void/25" />}
    </div>
  );
}
