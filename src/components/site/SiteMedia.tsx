import { isVideoUrl } from "@/lib/media";

/**
 * Renders whatever an admin-managed section resolves to — image or video —
 * without the page needing to know which one it'll get.
 * Optimized with GPU hardware acceleration to prevent scroll jittering.
 */
export function SiteMedia({
  src,
  poster,
  alt,
  className,
  lazy = false,
}: {
  src: string;
  poster?: string;
  alt: string;
  className?: string;
  /** Defer loading until near-visible — only for a usage that's genuinely
   * below the fold. Never set this on a hero/first-viewport usage, since
   * that's typically the page's LCP element and lazy-loading it would delay
   * the very thing that should paint first. Video ignores this (there's no
   * lazy-loading attribute for <video>; it already only preloads metadata). */
  lazy?: boolean;
}) {
  if (isVideoUrl(src)) {
    return (
      <video
        key={src}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
        className={`transform-gpu will-change-transform ${className || ""}`}
        style={{ transform: "translateZ(0)" }}
      />
    );
  }

  return (
    <img key={src} src={src} alt={alt} loading={lazy ? "lazy" : undefined} className={className} />
  );
}
