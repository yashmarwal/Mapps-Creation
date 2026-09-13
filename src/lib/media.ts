import { supabase } from "@/lib/supabase";

/** True if the URL (or bundled asset path) points at a video file, by extension. */
export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(url);
}

const SUPABASE_URL = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const STORAGE_PUBLIC_PREFIX = SUPABASE_URL ? `${SUPABASE_URL}/storage/v1/object/public/` : null;

function parseStorageUrl(url: string | null | undefined): { bucket: string; path: string } | null {
  if (!url || !STORAGE_PUBLIC_PREFIX || !url.startsWith(STORAGE_PUBLIC_PREFIX)) return null;
  const rest = url.slice(STORAGE_PUBLIC_PREFIX.length);
  const slashIndex = rest.indexOf("/");
  if (slashIndex === -1) return null;
  return {
    bucket: rest.slice(0, slashIndex),
    path: decodeURIComponent(rest.slice(slashIndex + 1)),
  };
}

/**
 * Deletes previously-uploaded files from Supabase Storage, given their
 * public URLs — call this whenever an admin action removes or replaces
 * something, so a deleted product/image/video doesn't leave its file
 * behind, silently taking up storage quota forever.
 *
 * Silently skips (and never throws for) anything that isn't one of our own
 * storage URLs — the bundled default product photos and reel videos are
 * plain build-time asset paths, not Supabase URLs, and aren't ours to
 * delete. A real deletion failure is logged to the console rather than
 * thrown, since it shouldn't block whatever admin action triggered the
 * cleanup — the DB change this runs alongside already succeeded.
 */
export async function deleteStorageFiles(urls: Array<string | null | undefined>): Promise<void> {
  const byBucket = new Map<string, string[]>();
  for (const url of urls) {
    const parsed = parseStorageUrl(url);
    if (!parsed) continue;
    const list = byBucket.get(parsed.bucket) ?? [];
    list.push(parsed.path);
    byBucket.set(parsed.bucket, list);
  }
  if (byBucket.size === 0) return;

  // Callers intentionally fire-and-forget this (an admin action's own
  // success shouldn't wait on cleanup) — so a rejection here must never
  // become an unhandled promise rejection; catch per-bucket and log instead.
  await Promise.all(
    [...byBucket.entries()].map(async ([bucket, paths]) => {
      try {
        const { error } = await supabase.storage.from(bucket).remove(paths);
        if (error) {
          console.error(
            `Failed to delete ${paths.length} file(s) from "${bucket}":`,
            error.message,
          );
        }
      } catch (err) {
        console.error(`Failed to delete ${paths.length} file(s) from "${bucket}":`, err);
      }
    }),
  );
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
  return `That file is ${sizeMb}MB. The limit is ${MAX_UPLOAD_MB}MB. Compress it or choose a smaller file.`;
}

/** Target size product images are auto-compressed down to before upload. */
export const IMAGE_COMPRESS_TARGET_MB = 2;
const IMAGE_COMPRESS_TARGET_BYTES = IMAGE_COMPRESS_TARGET_MB * 1024 * 1024;

// Product photos are only ever displayed at modest sizes on the site (card
// thumbnails, a preview modal maxing out around 1024px wide) — a phone
// camera shot arrives at 3000-4000px+ on the longest side, and every one of
// those extra pixels costs file size for zero visible benefit at display
// size. Capping resolution *before* touching JPEG quality means the quality
// loop below almost never has to drop quality far to hit the target, which
// is what actually avoids visible degradation — shrinking dimensions
// preserves a photo's *look* far better than a low JPEG quality setting on
// an oversized image does.
const MAX_DIMENSION_PX = 1600;
export const PRODUCT_IMAGE_COMPRESS_TARGET_MB = 1;

/**
 * Re-encodes an image client-side (canvas) so a large phone-camera photo
 * never eats into the upload size limit — admins shouldn't have to
 * pre-compress product photos by hand. Caps resolution to a sane web size
 * first, then squeezes JPEG quality (only shrinking dimensions further if
 * quality alone still can't reach the target — rare once already capped).
 * Leaves the file untouched if it's already under the target, isn't a
 * raster type canvas can re-encode (SVG), or if anything about the process
 * fails — original upload path still works exactly as before.
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

    if (width > MAX_DIMENSION_PX || height > MAX_DIMENSION_PX) {
      const scale = MAX_DIMENSION_PX / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

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
