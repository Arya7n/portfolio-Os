const MAX_EDGE = 1920;
const MAX_CHARS = 1_400_000;

export async function fileToWallpaper(file: File): Promise<{ dataUrl: string; name: string }> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose an image file (jpg, png, webp, gif).");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Could not read that image.");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = 0.78;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  while (dataUrl.length > MAX_CHARS && quality > 0.42) {
    quality -= 0.08;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }
  if (dataUrl.length > MAX_CHARS) {
    throw new Error("That image is still too large after compressing. Try a smaller file.");
  }

  return {
    dataUrl,
    name: file.name.replace(/\.[^.]+$/, "") || "Wallpaper",
  };
}
