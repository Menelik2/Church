/**
 * Image compression utilities for announcement uploads.
 * - Client: canvas resize + JPEG quality
 * - Server: sharp (when available) → WebP/JPEG
 */

export const IMAGE_LIMITS = {
  maxInputBytes: 8 * 1024 * 1024, // accept up to 8MB before compress
  maxOutputBytes: 900 * 1024, // target under ~900KB
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.82,
  mime: "image/jpeg" as const,
};

/** Client-side compression via Canvas (works in browser only). */
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

  // GIF: skip heavy re-encode to preserve animation when small
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
    // Step down quality if still too large
    while (blob && blob.size > maxOutputBytes && quality > 0.45) {
      quality -= 0.1;
      blob = await toBlob(quality);
    }

    if (!blob) {
      return file;
    }

    if (blob.size >= file.size && file.size <= maxOutputBytes) {
      return file;
    }

    const name = file.name.replace(/\.\w+$/, "") + ".jpg";
    return new File([blob], name, {
      type: IMAGE_LIMITS.mime,
      lastModified: Date.now(),
    });
  } finally {
    bitmap.close();
  }
}

export type ServerCompressResult = {
  buffer: Buffer;
  contentType: string;
  ext: string;
  width?: number;
  height?: number;
  originalBytes: number;
  compressedBytes: number;
};

/**
 * Server-side compression with sharp (optional dependency).
 * Falls back to original buffer if sharp is missing.
 */
export async function compressImageServer(
  input: Buffer,
  originalType?: string
): Promise<ServerCompressResult> {
  const originalBytes = input.length;

  try {
    const sharpMod = await import("sharp");
    const sharp = sharpMod.default;

    let pipeline = sharp(input, { failOn: "none" }).rotate();

    const meta = await pipeline.metadata();
    const maxW = IMAGE_LIMITS.maxWidth;
    const maxH = IMAGE_LIMITS.maxHeight;

    if (
      (meta.width && meta.width > maxW) ||
      (meta.height && meta.height > maxH)
    ) {
      pipeline = pipeline.resize({
        width: maxW,
        height: maxH,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    const webp = await pipeline
      .clone()
      .webp({ quality: 80, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    const jpeg = await pipeline
      .clone()
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });

    const useWebp = webp.info.size <= jpeg.info.size;
    const chosen = useWebp ? webp : jpeg;

    return {
      buffer: chosen.data,
      contentType: useWebp ? "image/webp" : "image/jpeg",
      ext: useWebp ? "webp" : "jpg",
      width: chosen.info.width,
      height: chosen.info.height,
      originalBytes,
      compressedBytes: chosen.data.length,
    };
  } catch {
    const ext =
      originalType === "image/png"
        ? "png"
        : originalType === "image/webp"
          ? "webp"
          : originalType === "image/gif"
            ? "gif"
            : "jpg";
    return {
      buffer: input,
      contentType: originalType || "image/jpeg",
      ext,
      originalBytes,
      compressedBytes: originalBytes,
    };
  }
}
