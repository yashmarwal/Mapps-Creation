import { useEffect, useRef } from "react";

/**
 * Makes an overlay (modal, drawer, lightbox) closable with the browser/
 * Android back button, without leaving a "ghost" history entry behind when
 * it's closed any other way (X button, overlay click, Escape, selecting a
 * result) — and without eating a real back-navigation when it IS closed
 * that other way.
 *
 * Every overlay in this codebase used to hand-roll this (AskUsChat,
 * DownloadCatalogModal, ProductPreviewModal, QuoteDrawer, SearchModal), and
 * every one of them pushed a history entry on open but never popped it on a
 * normal UI close. Those dead entries pile up at the *same* URL as whatever
 * page they were opened from, so a later real back-press lands on one of
 * these ghosts instead of the actual previous page — and enough of them
 * (plus QuoteDrawer's version, which called `history.back()` on *every*
 * close, UI or not) can walk a user's back button straight past their own
 * history and out of the site. One correct implementation, used everywhere.
 */
export function useBackToClose(isOpen: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // True only while we're inside the popstate handler itself — tells the
  // cleanup below "the browser already removed this entry for us, don't
  // remove it again."
  const closedByBackButtonRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    closedByBackButtonRef.current = false;
    window.history.pushState({ overlayOpen: true }, "");

    const handlePopState = () => {
      closedByBackButtonRef.current = true;
      onCloseRef.current();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      // Closed by something other than the back button (X / overlay click /
      // Escape / selecting a result) — step back ourselves to remove the
      // entry we pushed, so it's never left as a dead stop for a *later*
      // back press. Only do this if that entry is still the current one;
      // if the user already navigated further, there's nothing to undo.
      if (!closedByBackButtonRef.current && window.history.state?.overlayOpen) {
        window.history.back();
      }
    };
  }, [isOpen]);
}
