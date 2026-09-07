"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useSiteSetting } from "@/hooks/useSiteSetting";

export type MarqueeSettings = { enabled: boolean; text: string };
export const MARQUEE_DEFAULT: MarqueeSettings = { enabled: false, text: "" };

/** Reads the shared marquee setting once — pass the result down to both
 * TopMarquee and Navigation so they never race against two independent fetches. */
export function useMarqueeSettings() {
  const { value, loaded } = useSiteSetting<MarqueeSettings>("marquee", MARQUEE_DEFAULT);
  const visible = loaded && value.enabled && value.text.trim().length > 0;
  return { settings: value, visible };
}

// Constant scroll speed, tuned to feel like the original fixed 18s duration
// did for a typical short marquee line. The track always travels exactly
// half its own width per loop (see the `marquee` keyframes — 0 to -50%),
// so with a *fixed* duration, longer pasted text means more pixels have to
// cover that same distance in the same time — i.e. it visibly speeds up
// the longer the admin's text gets. Keeping px/second constant instead
// means the perceived speed stays the same no matter how long the text is.
const PIXELS_PER_SECOND = 90;
// Only a floor, not a ceiling: very short text would otherwise loop in a
// fraction of a second and look like a glitch. There's no equivalent
// problem at the long end — a longer loop for longer text is just what
// constant speed means — so MAX_DURATION_S exists purely as a sanity net
// against someone pasting something pathological (an entire document by
// accident), not as a normal-operating clamp.
const MIN_DURATION_S = 10;
const MAX_DURATION_S = 300;

export function TopMarquee({ visible, text }: { visible: boolean; text: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [durationS, setDurationS] = useState(18);

  // Measure after the two passes have actually rendered with this text (and
  // re-measure if the font finishes loading/swapping and reflows it) —
  // `scrollWidth` reports the full unclipped content width even though the
  // track's parent has overflow:hidden, and the track holds two identical
  // passes back to back, so half of that is the distance one loop travels.
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const measure = () => {
      const passWidth = el.scrollWidth / 2;
      const seconds = passWidth / PIXELS_PER_SECOND;
      setDurationS(Math.min(MAX_DURATION_S, Math.max(MIN_DURATION_S, seconds)));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  if (!visible) return null;

  return (
    <div className="bg-primary text-primary-foreground fixed inset-x-0 top-0 z-[101] flex h-9 items-center overflow-hidden">
      <div
        ref={trackRef}
        className="marquee-track flex w-max gap-10"
        style={{ animationDuration: `${durationS}s` }}
      >
        {[0, 1].map((pass) => (
          <div key={pass} className="flex gap-10" aria-hidden={pass === 1}>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="label-caps px-2 text-[11px] whitespace-nowrap">
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
