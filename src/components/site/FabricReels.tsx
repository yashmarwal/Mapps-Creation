"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import v1 from "@/assets/videos/shop-look-1.mp4";
import v2 from "@/assets/videos/shop-look-2.mp4";
import v3 from "@/assets/videos/shop-look-3.mp4";
import v4 from "@/assets/videos/shop-look-4.mp4";
import v5 from "@/assets/videos/shop-look-5.mp4";
import v6 from "@/assets/videos/shop-look-6.mp4";
import v7 from "@/assets/videos/shop-look-7.mp4";
import v8 from "@/assets/videos/shop-look-8.mp4";
import { useSiteSetting } from "@/hooks/useSiteSetting";
import { EASE_REVEAL, EASE_UI, Reveal } from "./motion";

export const MAX_REEL_VIDEOS = 8;
export type ReelSettings = { urls: string[] };
export const REEL_DEFAULT: ReelSettings = { urls: [] };

// Exported so the admin panel can seed its editor with these — the built-in
// clips are just the starting "8 slots", editable/replaceable like any other.
export const DEFAULT_VIDEOS = [v1, v2, v3, v4, v5, v6, v7, v8];
const AUTO_SCROLL_SPEED = 0.045; // px per ms
const RESUME_DELAY_MS = 2500;

/** Plays only while scrolled into view — avoids decoding every clip at once. */
function AutoplayCard({ src, onOpen }: { src: string; onOpen: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      onClick={onOpen}
      className="group border-border relative aspect-[9/16] w-[190px] shrink-0 overflow-hidden border"
      aria-label="Play video"
    >
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
      <span className="bg-primary text-primary-foreground absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Play className="ml-0.5 h-3.5 w-3.5" fill="currentColor" />
      </span>
    </button>
  );
}

export function FabricReels() {
  const { value: reelSettings } = useSiteSetting<ReelSettings>("reel_videos", REEL_DEFAULT);
  const videos = reelSettings.urls.length > 0 ? reelSettings.urls : DEFAULT_VIDEOS;

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const resumeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = now - last;
      last = now;
      if (!paused.current) {
        const half = el.scrollWidth / 2;
        el.scrollLeft = (el.scrollLeft + AUTO_SCROLL_SPEED * dt) % half;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pause = () => {
    paused.current = true;
    window.clearTimeout(resumeTimer.current);
  };
  const resumeSoon = () => {
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      paused.current = false;
    }, RESUME_DELAY_MS);
  };

  useEffect(() => {
    if (openIndex === null) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openIndex]);

  return (
    <section className="border-border border-y py-16 md:py-20">
      <Reveal className="mx-auto max-w-7xl px-5 text-center md:px-10">
        <p className="label-caps text-primary">From Our Reels</p>
        <h2 className="display-lg mt-4">Fabric in motion</h2>
      </Reveal>

      <div
        ref={trackRef}
        data-lenis-prevent
        onPointerDown={pause}
        onPointerUp={resumeSoon}
        onPointerLeave={resumeSoon}
        onTouchStart={pause}
        onTouchEnd={resumeSoon}
        onWheel={() => {
          pause();
          resumeSoon();
        }}
        className="mt-10 flex gap-4 overflow-x-auto px-5 pb-2 md:px-10 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
        aria-label="Fabric reels"
      >
        {[0, 1].map((pass) => (
          <div key={pass} className="flex shrink-0 gap-4" aria-hidden={pass === 1}>
            {videos.map((src, i) => (
              <AutoplayCard key={`${pass}-${i}`} src={src} onOpen={() => setOpenIndex(i)} />
            ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            data-lenis-prevent
            className="fixed inset-0 z-[190] flex items-center justify-center bg-black/85 px-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_UI }}
            onClick={() => setOpenIndex(null)}
          >
            <motion.div
              className="relative aspect-[9/16] max-h-[85vh] w-auto"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: EASE_REVEAL }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenIndex(null)}
                aria-label="Close"
                className="border-border bg-background text-foreground absolute -top-12 right-0 flex h-10 w-10 items-center justify-center border md:-right-12 md:top-0"
              >
                <X className="h-5 w-5" />
              </button>
              <video
                src={videos[openIndex]}
                controls
                autoPlay
                playsInline
                className="h-full max-h-[85vh] w-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
