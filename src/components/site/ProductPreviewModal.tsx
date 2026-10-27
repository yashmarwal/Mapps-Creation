"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ImageOff, X } from "lucide-react";
import { useEffect } from "react";
import { useBackToClose } from "@/hooks/useBackToClose";
import { useScrollLock } from "@/hooks/useScrollLock";
import { EASE_REVEAL, EASE_UI } from "./motion";

/** Minimal shape both a full catalogue Product and a QuoteItem satisfy —
 * `spec` and `price` are optional since a quote-basket item doesn't always
 * carry them. */
type PreviewItem = {
  name: string;
  category: string;
  image?: string;
  spec?: string;
  price?: number;
  unit?: string;
};

/**
 * Shared "tap to preview" lightbox — a larger image + key details for a
 * single product, reused wherever a small thumbnail (Search results, the
 * Bulk Quote list) needs a bigger look without leaving that screen.
 */
export function ProductPreviewModal({
  item,
  onClose,
}: {
  item: PreviewItem | null;
  onClose: () => void;
}) {
  // Handle mobile/browser back button to close lightbox preview gracefully
  useBackToClose(Boolean(item), onClose);

  // Lock page scroll while open. Reference-counted on purpose: this modal
  // can be opened from inside an already-open Quote drawer or Search modal
  // (both of which also hold this lock) — a plain set/clear here would
  // un-lock scroll out from under the parent the moment this one closes.
  useScrollLock(Boolean(item));

  // Close on Escape, matching every other overlay in this codebase
  // (SearchModal, Navigation drawer, PromoPopup, DownloadCatalogModal).
  useEffect(() => {
    if (!item) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[260] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE_UI }}
          onClick={onClose}
        >
          <motion.div
            data-lenis-prevent
            className="border-border/80 bg-[#0A1628] text-foreground relative w-full max-w-sm overflow-hidden border rounded-2xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.3, ease: EASE_REVEAL }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close preview"
              className="border-border/60 bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center border rounded-full backdrop-blur transition-all active:scale-95 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative aspect-[4/3] bg-slate-950">
              {item.image ? (
                <img
                  src={item.image}
                  alt={`${item.name}, ${item.category} fabric from Mapps Creation, Surat`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground/60">
                  <ImageOff className="h-8 w-8" />
                  <span className="text-xs">No image available</span>
                </div>
              )}
            </div>

            <div className="p-5">
              <span className="label-caps text-primary text-[11px]">{item.category}</span>
              <h3 className="font-serif mt-1.5 text-xl font-semibold text-foreground">
                {item.name}
              </h3>
              {item.spec && <p className="text-muted-foreground mt-1 text-xs">{item.spec}</p>}
              {typeof item.price === "number" && (
                <p className="text-primary mt-2.5 text-lg font-semibold">
                  ₹{item.price}
                  {item.unit && (
                    <span className="text-muted-foreground text-xs font-normal">
                      {" "}
                      / {item.unit}
                    </span>
                  )}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
