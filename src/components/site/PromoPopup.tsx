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
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE_UI }}
          onClick={() => setShow(false)}
        >
          <motion.div
            className="silk grain border-border relative max-w-md overflow-hidden border text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: EASE_REVEAL }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShow(false)}
              aria-label="Close"
              className="text-muted-foreground hover:text-primary absolute top-4 right-4 z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {settings.imageUrl && (
              <img
                src={settings.imageUrl}
                alt={settings.title}
                className="relative h-40 w-full object-cover"
              />
            )}

            <div className="relative p-8">
              <h2 className="font-display text-3xl">{settings.title}</h2>
              {settings.message && (
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                  {settings.message}
                </p>
              )}
              {settings.ctaLink && (
                <a
                  href={settings.ctaLink}
                  target={settings.ctaLink.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="bg-primary text-primary-foreground label-caps mt-7 inline-flex min-h-[52px] items-center px-7"
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
