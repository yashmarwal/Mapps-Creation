"use client";

import { useEffect } from "react";

/** Lenis-driven inertia scroll, skipped when reduced motion is requested. */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let destroyed = false;
    let instance: { raf: (t: number) => void; destroy: () => void } | null = null;

    import("lenis").then(({ default: Lenis }) => {
      if (destroyed) return;
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        // Without this, Lenis hijacks scroll/touch globally and any nested
        // overflow-y-auto panel (the Ask-AI chat's message list, etc.) can't
        // scroll natively — Lenis detects real nested-scroll containers and
        // lets them handle their own scroll instead.
        allowNestedScroll: true,
      });
      instance = { raf: (time) => lenis.raf(time), destroy: () => lenis.destroy() };
      const loop = (time: number) => {
        instance?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      instance?.destroy();
    };
  }, []);
}
