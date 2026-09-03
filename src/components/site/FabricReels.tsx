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
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      onClick={onOpen}
      className="group border-border/80 relative aspect-[9/16] w-[170px] sm:w-[200px] shrink-0 overflow-hidden border rounded-2xl bg-slate-950 transform-gpu will-change-transform shadow-md cursor-pointer transition-transform duration-300 hover:scale-[1.02] select-none"
      aria-label="Play fabric reel"
    >
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover transform-gpu will-change-transform pointer-events-none select-none"
        style={{ transform: "translateZ(0)" }}
      />
      <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/30 pointer-events-none" />
      <span className="bg-amber-500 text-slate-950 absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 shadow-lg pointer-events-none">
        <Play className="ml-0.5 h-4 w-4 fill-slate-950" />
      </span>
    </div>
  );
}

export function FabricReels() {
  const { value: reelSettings } = useSiteSetting<ReelSettings>("reel_videos", REEL_DEFAULT);
  const videos = reelSettings.urls.length > 0 ? reelSettings.urls : DEFAULT_VIDEOS;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const isInView = useRef(false);
  const isWindowScrolling = useRef(false);
  const isUserInteracting = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasMovedDuringDrag = useRef(false);
  const resumeTimer = useRef<number | undefined>(undefined);

  // 1. Detect vertical page scrolling — HALT auto-scroll during page scroll to avoid reflow jittering
  useEffect(() => {
    let timer: number | undefined;
    const handleScroll = () => {
      isWindowScrolling.current = true;
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        isWindowScrolling.current = false;
      }, 250);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  // 2. Detect section visibility
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView.current = !!entry?.isIntersecting;
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 3. User interaction pause / resume timer (1.5 seconds)
  const pauseUserInteraction = () => {
    isUserInteracting.current = true;
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
  };

  const resumeUserInteractionSoon = () => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      isUserInteracting.current = false;
      isDragging.current = false;
    }, 1500);
  };

  // 4. Smooth Auto-Scroll Loop (Runs ONLY when section is visible, NOT vertical scrolling, NOT user touching)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let rafId = 0;
    let lastTime = performance.now();
    const speed = 0.04; // px/ms

    const step = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      if (
        isInView.current &&
        !isWindowScrolling.current &&
        !isUserInteracting.current &&
        !isDragging.current
      ) {
        const half = el.scrollWidth / 2;
        if (half > 0) {
          let nextScroll = el.scrollLeft + speed * dt;
          if (nextScroll >= half) {
            nextScroll -= half;
          }
          el.scrollLeft = nextScroll;
        }
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // 5. Desktop Mouse Dragging Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el) return;
    isDragging.current = true;
    hasMovedDuringDrag.current = false;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftStart.current = el.scrollLeft;
    pauseUserInteraction();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const el = trackRef.current;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.25;
    if (Math.abs(walk) > 4) {
      hasMovedDuringDrag.current = true;
    }
    el.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      resumeUserInteractionSoon();
    }
  };

  const handleCardClick = (index: number) => {
    if (!hasMovedDuringDrag.current) {
      setOpenIndex(index);
    }
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
    <section ref={containerRef} className="border-border border-y py-14 md:py-20 overflow-hidden">
      <Reveal className="mx-auto max-w-7xl px-5 text-center md:px-10">
        <p className="label-caps text-primary">From Our Reels</p>
        <h2 className="display-lg mt-4">Fabric in motion</h2>
      </Reveal>

      {/* Smooth Video Reel Track with Finger Swiping (Mobile) & Desktop Drag & Auto-Scroll Resume */}
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={pauseUserInteraction}
        onTouchEnd={resumeUserInteractionSoon}
        onTouchCancel={resumeUserInteractionSoon}
        onWheel={() => {
          pauseUserInteraction();
          resumeUserInteractionSoon();
        }}
        className="mt-10 flex gap-4 overflow-x-auto px-5 pb-3 md:px-10 select-none cursor-grab active:cursor-grabbing transform-gpu [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-amber-500/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-950"
        style={{ scrollbarWidth: "none", touchAction: "pan-x", overscrollBehaviorX: "contain" }}
        aria-label="Fabric reels"
      >
        {[0, 1].map((pass) => (
          <div key={pass} className="flex shrink-0 gap-4" aria-hidden={pass === 1}>
            {videos.map((src, i) => (
              <AutoplayCard key={`${pass}-${i}`} src={src} onOpen={() => handleCardClick(i)} />
            ))}
          </div>
        ))}
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
