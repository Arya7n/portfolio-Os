export type WallpaperId = "forge" | "dune" | "ink" | "studio";

export const wallpapers: Array<{ id: WallpaperId; label: string; note: string }> = [
  { id: "forge", label: "Forge", note: "Warm graphite — default workbench" },
  { id: "dune", label: "Dune", note: "Dust and brass" },
  { id: "ink", label: "Ink", note: "Near-black, no wash" },
  { id: "studio", label: "Studio", note: "Olive shadow" },
];
