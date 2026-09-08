import type { BuiltInWallpaperId } from "@/data/wallpapers";

export interface SceneTheme {
  id: BuiltInWallpaperId;
  void: string;
  fog: string;
  floor: string;
  grid: string;
  accent: string;
  light: string;
  rim: string;
  particle: string;
  desk: string;
}

export const SCENE_THEMES: Record<BuiltInWallpaperId, SceneTheme> = {
  harbor: {
    id: "harbor",
    void: "#07090d",
    fog: "#07090d",
    floor: "#0c1016",
    grid: "#1c2733",
    accent: "#5b8fbf",
    light: "#d5dee8",
    rim: "#3d6a94",
    particle: "#8fb4d4",
    desk: "#12171e",
  },
  ember: {
    id: "ember",
    void: "#0b0908",
    fog: "#0b0908",
    floor: "#12100e",
    grid: "#2a241e",
    accent: "#c4a574",
    light: "#efe6d6",
    rim: "#8a6240",
    particle: "#dcc4a0",
    desk: "#161310",
  },
  slate: {
    id: "slate",
    void: "#0c0c0e",
    fog: "#0c0c0e",
    floor: "#131316",
    grid: "#2c2c32",
    accent: "#8e9096",
    light: "#ececee",
    rim: "#6a6c72",
    particle: "#b4b6bc",
    desk: "#161618",
  },
  noir: {
    id: "noir",
    void: "#000000",
    fog: "#050505",
    floor: "#080808",
    grid: "#1a1a1a",
    accent: "#c8c8c8",
    light: "#f4f4f4",
    rim: "#7a7a7a",
    particle: "#e0e0e0",
    desk: "#101010",
  },
};

export function getSceneTheme(id: BuiltInWallpaperId | "custom" | string): SceneTheme {
  if (id in SCENE_THEMES) return SCENE_THEMES[id as BuiltInWallpaperId];
  return SCENE_THEMES.harbor;
}
