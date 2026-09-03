"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SendHorizontal, X } from "lucide-react";
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
          className="fixed inset-0 z-[190] flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE_UI }}
          onClick={() => setShow(false)}
        >
          <motion.div
            className="border-border/80 bg-[#0A1628]/95 text-foreground relative max-w-md w-full border rounded-2xl p-8 md:p-10 text-center shadow-2xl backdrop-blur-2xl overflow-hidden"
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

            <span className="bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/50 text-[10px] font-bold tracking-widest label-caps px-3.5 py-1 rounded-full uppercase inline-flex items-center gap-1.5">
              <SendHorizontal className="h-3.5 w-3.5" /> Instant Rate Check
            </span>

            <h2 className="font-serif mt-4 text-2xl md:text-3xl font-bold text-foreground">
              Get today's fabric rate on WhatsApp
            </h2>

            <p className="text-muted-foreground/90 mt-3 text-xs md:text-sm leading-relaxed">
              Share your fabric type and quantity — we'll reply with swatches and a firm quote the
              same working day, no obligation.
            </p>

            <a
              href={whatsappLink(
                "Hi Mapps Creation, can you share today's rate and quotation for my fabric requirement?",
              )}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp Us Now"
              className="btn-enquire mt-7 w-full !min-h-[50px] !rounded-xl !text-sm"
            >
              <span>
                <SendHorizontal className="h-4 w-4" />
                Quick Enquiry Now
              </span>
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
