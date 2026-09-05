/** True if the URL (or bundled asset path) points at a video file, by extension. */
export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(url);
}

// Must match the Supabase Storage bucket's own file-size-limit setting
// (product-images / site-images) — kept here so every admin upload handler
// checks the same number and fails with a clear message before the request
// ever reaches Supabase, instead of a raw storage error after the fact.
export const MAX_UPLOAD_MB = 20;
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

/** Returns an error message if the file exceeds the bucket's size limit, else null. */
export function checkUploadSize(file: File): string | null {
  if (file.size <= MAX_UPLOAD_BYTES) return null;
  const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
  return `That file is ${sizeMb}MB — the limit is ${MAX_UPLOAD_MB}MB. Compress it or choose a smaller file.`;
}

/** Target size product images are auto-compressed down to before upload. */
export const IMAGE_COMPRESS_TARGET_MB = 2;
const IMAGE_COMPRESS_TARGET_BYTES = IMAGE_COMPRESS_TARGET_MB * 1024 * 1024;

/**
 * Re-encodes an image client-side (canvas) so a large phone-camera photo
 * never eats into the upload size limit — admins shouldn't have to
 * pre-compress product photos by hand. Shrinks JPEG quality first, then
 * dimensions if quality alone isn't enough. Leaves the file untouched if
 * it's already under the target, isn't a raster type canvas can re-encode
 * (SVG), or if anything about the process fails — original upload path
 * still works exactly as before.
 */
export async function compressImageToTarget(
  file: File,
  targetBytes: number = IMAGE_COMPRESS_TARGET_BYTES,
): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;
  if (file.size <= targetBytes) return file;

  try {
    const bitmap = await createImageBitmap(file);
    let width = bitmap.width;
    let height = bitmap.height;
    let quality = 0.9;
    let blob: Blob | null = null;

    // Squeeze quality down first; once quality is already low, shrink the
    // dimensions instead — a handful of passes gets close enough in practice.
    for (let attempt = 0; attempt < 8; attempt++) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        bitmap.close?.();
        return file;
      }
      ctx.drawImage(bitmap, 0, 0, width, height);

      blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality),
      );
      if (!blob) {
        bitmap.close?.();
        return file;
      }
      if (blob.size <= targetBytes) break;

      if (quality > 0.5) {
        quality -= 0.15;
      } else {
        width = Math.round(width * 0.8);
        height = Math.round(height * 0.8);
      }
    }

    bitmap.close?.();
    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
