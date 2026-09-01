"use client";

import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { whatsappLink } from "@/lib/seo";
import { EASE_UI } from "./motion";

const MESSAGES = [
  { text: "Request Catalogue", to: "/catalogue" as const },
  {
    text: "Enquire Now",
    whatsapp: "Hi Mapps Creation, I'd like to enquire about your wholesale fabrics.",
  },
  {
    text: "Request Swatches",
    whatsapp: "Hi Mapps Creation, I'd like to request fabric swatch samples.",
  },
  { text: "Talk to Our Team", to: "/contact" as const },
];

export function StickyCta() {
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? y / scrollable : 0;
      const nearFooter =
        y + window.innerHeight > document.documentElement.scrollHeight - window.innerHeight * 0.6;
      setVisible(percent >= 0.6 && !nearFooter);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 3000);
    return () => window.clearInterval(id);
  }, [visible]);

  // On mobile the persistent MobileActionBar's "Enquire Now" already covers
  // this job — the floating pill would collide with that bar, so it's
  // desktop-only here.
  if (isMobile) return null;

  const current = MESSAGES[index]!;

  const label = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={current.text}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: EASE_UI }}
        className="label-caps block"
      >
        {current.text}
      </motion.span>
    </AnimatePresence>
  );

  const linkProps = current.whatsapp
    ? { href: whatsappLink(current.whatsapp), target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <AnimatePresence>
      {visible &&
        (current.to ? (
          <motion.div
            key="rail"
            className="fixed top-1/2 right-0 z-[94] origin-right -translate-y-1/2 rotate-[-90deg]"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_UI }}
          >
            <Link to={current.to} className="bg-primary text-primary-foreground block px-6 py-3">
              {label}
            </Link>
          </motion.div>
        ) : (
          <motion.a
            key="rail"
            {...linkProps}
            className="bg-primary text-primary-foreground fixed top-1/2 right-0 z-[94] origin-right -translate-y-1/2 rotate-[-90deg] px-6 py-3"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_UI }}
          >
            {label}
          </motion.a>
        ))}
    </AnimatePresence>
  );
}
