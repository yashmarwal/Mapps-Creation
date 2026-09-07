import { useEffect, useState } from "react";

type ViewportInsets = { height: number; offsetTop: number };

/**
 * Tracks the browser's *visual* viewport — the area actually visible above
 * an open on-screen keyboard — instead of the full layout viewport that
 * `100vh`/`100dvh` are ultimately still anchored to on some mobile browsers.
 *
 * Mobile browsers don't agree on how a `position: fixed`, full-height panel
 * should react when the keyboard opens: some genuinely shrink the layout
 * viewport (dvh works fine), others just scroll the page underneath the
 * fixed element while reporting the same layout height — which is exactly
 * the "shifts up / jumps to the top" bug this exists to fix. The
 * `VisualViewport` API reports what's *actually* visible regardless of
 * which behavior the browser picked, so a caller can pin an overlay's
 * height/position to it directly instead of trusting viewport units alone.
 *
 * Returns `{ height: 0, offsetTop: 0 }` until mounted client-side or on a
 * browser without `window.visualViewport` — callers should treat `height:
 * 0` as "not active" and fall back to their normal CSS sizing.
 */
export function useVisualViewportInsets(enabled: boolean): ViewportInsets {
  const [insets, setInsets] = useState<ViewportInsets>({ height: 0, offsetTop: 0 });

  useEffect(() => {
    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    if (!enabled || !vv) {
      setInsets({ height: 0, offsetTop: 0 });
      return;
    }

    const update = () => setInsets({ height: vv.height, offsetTop: vv.offsetTop });
    update();

    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [enabled]);

  return insets;
}
