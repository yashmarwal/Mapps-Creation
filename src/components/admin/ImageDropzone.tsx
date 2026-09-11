"use client";

import { ImagePlus } from "lucide-react";
import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";

/**
 * Shared drag-and-drop upload zone for every admin image/video upload
 * (Products' two photo slots, Site Images' section backdrops, the Offers
 * Popup image). Wraps a plain hidden file input underneath, so it's still a
 * real, always-working click-to-browse control — the drag/drop handling is
 * additive, not a replacement for it.
 */
export function ImageDropzone({
  onFile,
  accept = "image/*",
  disabled,
  label,
  compact,
}: {
  onFile: (file: File) => void;
  accept?: string;
  disabled?: boolean;
  label: string;
  compact?: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={openPicker}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label={label}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed text-center transition-colors ${
        compact ? "p-3" : "p-6"
      } ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : dragOver
            ? "border-primary bg-primary/5 cursor-pointer"
            : "border-border hover:border-primary/50 hover:bg-card/60 cursor-pointer"
      }`}
    >
      <ImagePlus
        className={`text-muted-foreground ${compact ? "h-4 w-4" : "h-6 w-6"}`}
        aria-hidden="true"
      />
      <p className={`text-muted-foreground ${compact ? "text-[11px]" : "text-xs"}`}>{label}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
