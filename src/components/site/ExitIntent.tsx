"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { whatsappLink } from "@/lib/seo";
import { EASE_REVEAL, EASE_UI } from "./motion";

export function ExitIntent() {
  const isMobile = useIsMobile();
  const [show, setShow] = useState(false);
  const shownThisLoad = useRef(false);

  useEffect(() => {
    const reveal = () => {
      if (shownThisLoad.current) return;
      shownThisLoad.current = true;
      setShow(true);
    };

    if (isMobile) {
      const t = window.setTimeout(reveal, 25000);
      return () => window.clearTimeout(t);
    }

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) reveal();
    };
    window.addEventListener("mouseout", onMouseLeave);
    return () => window.removeEventListener("mouseout", onMouseLeave);
  }, [isMobile]);

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
          className="fixed inset-0 z-[190] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE_UI }}
          onClick={() => setShow(false)}
        >
          <motion.div
            className="silk grain border-border relative max-w-md border p-8 text-center md:p-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: EASE_REVEAL }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShow(false)}
              aria-label="Close"
              className="text-muted-foreground hover:text-primary absolute top-4 right-4"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="label-caps text-primary">Before You Go</p>
            <h2 className="font-display relative mt-4 text-3xl md:text-4xl">
              Get today's fabric rate on WhatsApp
            </h2>
            <p className="text-muted-foreground relative mt-4 text-sm leading-relaxed">
              Share your fabric type and quantity — we'll reply with swatches and a firm quote the
              same working day, no obligation.
            </p>
            <a
              href={whatsappLink(
                "Hi Mapps Creation, can you share today's rate for my fabric requirement?",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground label-caps relative mt-7 inline-flex min-h-[52px] items-center gap-2 px-7"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Us Now
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
