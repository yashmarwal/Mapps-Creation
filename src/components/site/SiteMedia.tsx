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
}: {
  src: string;
  poster?: string;
  alt: string;
  className?: string;
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

  return <img key={src} src={src} alt={alt} className={className} />;
}
