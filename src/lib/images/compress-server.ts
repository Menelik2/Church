/**
 * Server-only image compression using sharp.
 * Import only from API routes / server code — never from client components.
 */

export const IMAGE_LIMITS = {
  maxInputBytes: 8 * 1024 * 1024,
  maxOutputBytes: 900 * 1024,
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.82,
  mime: "image/jpeg" as const,
};

export type ServerCompressResult = {
  buffer: Buffer;
  contentType: string;
  ext: string;
  width?: number;
  height?: number;
  originalBytes: number;
  compressedBytes: number;
};

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
