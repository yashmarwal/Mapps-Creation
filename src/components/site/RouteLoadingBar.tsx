"use client";

import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

// Only show the bar if a navigation is still pending after this long — a
// fast/already-loaded route resolves within a frame or two and should never
// flash a loading bar at all.
const SHOW_DELAY_MS = 120;

/**
 * Thin top-of-page progress bar for route transitions.
 *
 * The root layout deliberately keeps the outgoing page on screen until the
 * next route has fully loaded (see the `pathname`/`resolvedLocation`
 * comment in __root.tsx) — that avoids a blank-page flash, but it means
 * there's a real gap where the URL/UI state (e.g. the mobile menu, which
 * closes immediately on click) has already moved on while the page content
 * hasn't. Without any indicator, that gap reads as "did my click even
 * register?" rather than "it's loading." This fills it.
 */
export function RouteLoadingBar() {
  const isPending = useRouterState({ select: (s) => s.status === "pending" });
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (isPending) {
      timerRef.current = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    } else {
      window.clearTimeout(timerRef.current);
      setVisible(false);
    }
    return () => window.clearTimeout(timerRef.current);
  }, [isPending]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page loading"
      aria-valuetext="Loading"
      className="pointer-events-none fixed inset-x-0 top-0 z-1000 h-[3px] overflow-hidden"
    >
      <div className="route-loading-bar bg-primary h-full w-1/3" />
    </div>
  );
}
