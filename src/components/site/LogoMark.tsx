import logoBadge from "@/assets/logo-badge.png";

/** Cropped gold monogram from the brand logo — for nav/footer badges. */
export function LogoMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <img
      src={logoBadge}
      alt="Mapps Creation monogram"
      className={className}
      style={{ height: size, width: "auto" }}
    />
  );
}
