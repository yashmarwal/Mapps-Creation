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

export const DEFAULT_VIDEOS = [v1, v2, v3, v4, v5, v6, v7, v8];

/** Plays video smoothly when scrolled into view without layout jittering */
function AutoplayCard({ src, onOpen }: { src: string; onOpen: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      onClick={onOpen}
      className="group border-border/80 relative aspect-[9/16] w-[170px] sm:w-[200px] shrink-0 overflow-hidden border rounded-2xl bg-slate-950 transform-gpu will-change-transform shadow-md cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
      aria-label="Play fabric reel"
    >
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover transform-gpu will-change-transform pointer-events-none"
        style={{ transform: "translateZ(0)" }}
      />
      <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/30" />
      <span className="bg-amber-500 text-slate-950 absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 shadow-lg">
        <Play className="ml-0.5 h-4 w-4 fill-slate-950" />
      </span>
    </button>
  );
}

export function FabricReels() {
  const { value: reelSettings } = useSiteSetting<ReelSettings>("reel_videos", REEL_DEFAULT);
  const videos = reelSettings.urls.length > 0 ? reelSettings.urls : DEFAULT_VIDEOS;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
    <section className="border-border border-y py-14 md:py-20 overflow-hidden">
      <Reveal className="mx-auto max-w-7xl px-5 text-center md:px-10">
        <p className="label-caps text-primary">From Our Reels</p>
        <h2 className="display-lg mt-4">Fabric in motion</h2>
      </Reveal>

      {/* Smooth GPU Accelerated Continuous Infinite Marquee Reel Track */}
      <div className="mt-10 overflow-hidden w-full" aria-label="Fabric reels">
        <div className="animate-marquee-scroll flex gap-4 px-2">
          {[...videos, ...videos].map((src, i) => (
            <AutoplayCard key={i} src={src} onOpen={() => setOpenIndex(i % videos.length)} />
          ))}
        </div>
      </div>

      {/* Full Screen Video Modal */}
      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            data-lenis-prevent
            className="fixed inset-0 z-[190] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_UI }}
            onClick={() => setOpenIndex(null)}
          >
            <motion.div
              className="relative aspect-[9/16] max-h-[85vh] w-auto overflow-hidden rounded-2xl border border-amber-500/30 bg-slate-950 shadow-2xl"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: EASE_REVEAL }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenIndex(null)}
                aria-label="Close video"
                className="bg-slate-900/90 border border-slate-700 text-foreground hover:bg-slate-800 absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
              <video
                src={videos[openIndex]}
                controls
                autoPlay
                playsInline
                className="h-full max-h-[85vh] w-auto rounded-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
