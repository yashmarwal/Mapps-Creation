import { useEffect } from "react";

// Shared across every call site on purpose — see the comment below.
let lockCount = 0;
let savedScrollY = 0;

/**
 * Reference-counted page-scroll lock.
 *
 * Two things this has to get right, both found broken in practice:
 *
 * 1. This site never sets a height/overflow-y on `html` or `body` (see
 *    styles.css), so neither one is a sized, scrolling box — the actual
 *    scrolling element is the viewport itself, which browsers expose as
 *    `document.scrollingElement`, and on a page shaped like this one
 *    that's `<html>`, not `<body>`. Locking only `document.body.style.
 *    overflow` (what every overlay in this codebase did before this hook,
 *    and what this hook itself did in its first version) sets a property
 *    on an element that was never the thing scrolling, so it does
 *    nothing — the page keeps scrolling behind every overlay, on every
 *    browser, not just as a mobile quirk. Both elements need the lock.
 * 2. Even with both locked, iOS Safari is known to let a touch-drag
 *    rubber-band the page past `overflow: hidden` on `html`/`body`. Also
 *    pinning `body` with `position: fixed` (offset by the saved scroll
 *    position so nothing visually jumps) is the standard, reliable fix —
 *    `position: fixed` on body does not turn it into a containing block
 *    for *other* fixed-position descendants (the nav header, the overlay
 *    itself, the WhatsApp button), only `transform`/`filter`/`will-change`
 *    do that, so nothing else on the page needs to change.
 *
 * Several overlays in this app can legitimately be open at once — the
 * product preview lightbox opens *on top of* an already-open Quote drawer
 * or Search modal. A naive "lock on open, unlock on close" effect breaks
 * the moment the inner one closes first: its cleanup would reset the lock
 * even though the outer overlay is still open. Counting how many overlays
 * currently want the lock, and only touching the DOM when that count
 * crosses to/from zero, makes nested overlays compose correctly.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    lockCount += 1;
    if (lockCount === 1) {
      savedScrollY = window.scrollY;
      const html = document.documentElement;
      const body = document.body;
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.top = `-${savedScrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
    }

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        const html = document.documentElement;
        const body = document.body;
        html.style.overflow = "";
        body.style.overflow = "";
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        window.scrollTo(0, savedScrollY);
      }
    };
  }, [active]);
}
