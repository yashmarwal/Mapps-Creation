"use client";

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

export function TopMarquee({ visible, text }: { visible: boolean; text: string }) {
  if (!visible) return null;

  return (
    <div className="bg-primary text-primary-foreground fixed inset-x-0 top-0 z-[101] flex h-9 items-center overflow-hidden">
      <div className="marquee-track flex w-max gap-10" style={{ animationDuration: "18s" }}>
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
