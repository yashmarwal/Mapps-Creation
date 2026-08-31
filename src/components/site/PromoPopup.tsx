"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSiteSetting } from "@/hooks/useSiteSetting";
import { EASE_REVEAL, EASE_UI } from "./motion";

export type PromoPopupSettings = {
  enabled: boolean;
  title: string;
  message: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
};

export const PROMO_DEFAULT: PromoPopupSettings = {
  enabled: false,
  title: "",
  message: "",
  ctaText: "Learn More",
  ctaLink: "",
  imageUrl: "",
};

const SCROLL_TRIGGER = 0.2;

export function PromoPopup() {
  const { value: settings, loaded } = useSiteSetting<PromoPopupSettings>(
    "promo_popup",
    PROMO_DEFAULT,
  );
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!loaded || !settings.enabled || !settings.title.trim()) return;

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? window.scrollY / scrollable : 0;
      if (percent >= SCROLL_TRIGGER) {
        setShow(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [loaded, settings.enabled, settings.title]);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShow(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          data-lenis-prevent
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE_UI }}
          onClick={() => setShow(false)}
        >
          <motion.div
            className="border-border/80 bg-[#0A1628]/95 text-foreground relative max-w-md w-full border rounded-2xl shadow-2xl backdrop-blur-2xl text-center overflow-hidden"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.4, ease: EASE_REVEAL }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShow(false)}
              aria-label="Close"
              className="border-border/60 bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center border rounded-full backdrop-blur transition-all active:scale-95 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {settings.imageUrl && (
              <div className="relative h-44 w-full bg-slate-950">
                <img
                  src={settings.imageUrl}
                  alt={settings.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="p-7 md:p-8">
              <span className="bg-primary/20 text-primary border border-primary/50 text-[10px] font-bold tracking-widest label-caps px-3 py-1 rounded-full uppercase inline-block">
                Special Announcement
              </span>
              <h2 className="font-serif mt-3 text-2xl md:text-3xl font-bold text-foreground">
                {settings.title}
              </h2>
              {settings.message && (
                <p className="text-muted-foreground/90 mt-3 text-xs md:text-sm leading-relaxed">
                  {settings.message}
                </p>
              )}
              {settings.ctaLink && (
                <a
                  href={settings.ctaLink}
                  target={settings.ctaLink.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="bg-primary text-primary-foreground font-semibold label-caps mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl active:scale-98 transition-all cursor-pointer text-xs tracking-wider shadow-md"
                >
                  {settings.ctaText || "Learn More"}
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
