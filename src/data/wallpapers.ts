export type BuiltInWallpaperId = "harbor" | "ember" | "slate" | "noir";
export type WallpaperId = BuiltInWallpaperId | "custom";

export interface CustomWallpaper {
  id: string;
  name: string;
  dataUrl: string;
}

export const wallpapers: Array<{ id: BuiltInWallpaperId; label: string; note: string }> = [
  { id: "harbor", label: "Harbor", note: "Quiet navy" },
  { id: "ember", label: "Ember", note: "Warm graphite" },
  { id: "slate", label: "Slate", note: "Neutral gray" },
  { id: "noir", label: "Noir", note: "Absolute black" },
];

export const BUILT_IN_WALLPAPERS: BuiltInWallpaperId[] = wallpapers.map((item) => item.id);

const LEGACY: Record<string, BuiltInWallpaperId> = {
  forge: "harbor",
  dune: "ember",
  ink: "noir",
  studio: "slate",
};

export function normalizeWallpaperId(id: string | undefined): WallpaperId {
  if (!id) return "harbor";
  if (id === "custom") return "custom";
  if ((BUILT_IN_WALLPAPERS as string[]).includes(id)) return id as BuiltInWallpaperId;
  return LEGACY[id] ?? "harbor";
}
