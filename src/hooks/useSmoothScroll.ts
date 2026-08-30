"use client";

import { useEffect } from "react";

/** Lenis-driven inertia scroll, skipped when reduced motion is requested. */
export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let destroyed = false;
    let observer: MutationObserver | null = null;
    let instance: { raf: (t: number) => void; destroy: () => void; stop: () => void; start: () => void } | null = null;

    import("lenis").then(({ default: Lenis }) => {
      if (destroyed) return;
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        allowNestedScroll: true,
        prevent: (node) => {
          return !!(node instanceof HTMLElement && (node.hasAttribute("data-lenis-prevent") || node.closest("[data-lenis-prevent]")));
        },
      });

      instance = {
        raf: (time) => lenis.raf(time),
        destroy: () => lenis.destroy(),
        stop: () => lenis.stop(),
        start: () => lenis.start(),
      };

      const checkOverflow = () => {
        const isHidden =
          document.body.style.overflow === "hidden" ||
          document.documentElement.style.overflow === "hidden" ||
          document.body.classList.contains("overflow-hidden");
        if (isHidden) {
          lenis.stop();
        } else {
          lenis.start();
        }
      };

      observer = new MutationObserver(checkOverflow);
      observer.observe(document.body, { attributes: true, attributeFilter: ["style", "class"] });
      checkOverflow();

      const loop = (time: number) => {
        instance?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      destroyed = true;
      observer?.disconnect();
      cancelAnimationFrame(raf);
      instance?.destroy();
    };
  }, []);
}

