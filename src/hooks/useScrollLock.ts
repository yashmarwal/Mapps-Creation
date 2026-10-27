import { useEffect } from "react";

// Shared across every call site on purpose — see the comment below.
let lockCount = 0;

/**
 * Reference-counted page-scroll lock.
 *
 * Several overlays in this app can legitimately be open at the same time —
 * the product preview lightbox opens *on top of* an already-open Quote
 * drawer or Search modal, for instance. A naive "set overflow:hidden on
 * open, clear it on close" effect breaks the moment the inner one closes
 * first: its cleanup unconditionally resets `document.body.style.overflow`
 * to `""`, silently un-locking scroll even though the outer overlay is
 * still open. Counting how many overlays currently want the lock, and only
 * clearing the style when that count returns to zero, makes nested
 * overlays compose correctly. For the common case of exactly one overlay,
 * this behaves identically to the simple version.
 *
 * `useSmoothScroll`'s MutationObserver watches document.body's style
 * attribute and pauses Lenis (our inertia-scroll lib) whenever it sees
 * overflow:hidden, so this one hook handles both native and Lenis scroll.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    lockCount += 1;
    document.body.style.overflow = "hidden";

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = "";
      }
    };
  }, [active]);
}
