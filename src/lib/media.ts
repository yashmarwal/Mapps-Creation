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
