/**
 * Browser-only image compression (canvas). Never import sharp here.
 */

export const IMAGE_LIMITS = {
  maxInputBytes: 8 * 1024 * 1024,
  maxOutputBytes: 900 * 1024,
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.82,
  mime: "image/jpeg" as const,
};

export async function compressImageClient(
  file: File,
  opts?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    maxOutputBytes?: number;
  }
): Promise<File> {
  if (typeof window === "undefined") {
    throw new Error("compressImageClient is browser-only");
  }

  const maxWidth = opts?.maxWidth ?? IMAGE_LIMITS.maxWidth;
  const maxHeight = opts?.maxHeight ?? IMAGE_LIMITS.maxHeight;
  let quality = opts?.quality ?? IMAGE_LIMITS.quality;
  const maxOutputBytes = opts?.maxOutputBytes ?? IMAGE_LIMITS.maxOutputBytes;

  if (file.type === "image/gif" && file.size < 1.5 * 1024 * 1024) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  try {
    let { width, height } = bitmap;
    const scale = Math.min(1, maxWidth / width, maxHeight / height);
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.drawImage(bitmap, 0, 0, width, height);

    const toBlob = (q: number) =>
      new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), IMAGE_LIMITS.mime, q)
      );

    let blob = await toBlob(quality);
    while (blob && blob.size > maxOutputBytes && quality > 0.45) {
      quality -= 0.1;
      blob = await toBlob(quality);
    }

    if (!blob) return file;
    if (blob.size >= file.size && file.size <= maxOutputBytes) return file;

    const name = file.name.replace(/\.\w+$/, "") + ".jpg";
    return new File([blob], name, {
      type: IMAGE_LIMITS.mime,
      lastModified: Date.now(),
    });
  } finally {
    bitmap.close();
  }
}
