"use client";

import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/seo";
import { EASE_REVEAL, EASE_UI } from "./motion";
import { LogoMark } from "./LogoMark";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/catalogue", label: "Catalogue" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navigation({ marqueeVisible = false }: { marqueeVisible?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 z-[100] transition-[background-color,backdrop-filter,border-color,top] duration-500 ${
        marqueeVisible ? "top-9" : "top-0"
      } ${
        scrolled
          ? "bg-background/85 border-border border-b backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-10">
        <Link to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <LogoMark size={40} />
          <span className="font-display text-foreground hidden text-xl tracking-wide sm:block">
            Mapps Creation
          </span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="label-caps text-muted-foreground hover:text-foreground group relative py-2 transition-colors"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: link.to === "/" }}
            >
              {link.label}
              <span className="bg-primary absolute bottom-0 left-0 h-px w-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
            </Link>
          ))}
          <Link
            to="/wholesale"
            className="bg-primary text-primary-foreground label-caps flex items-center px-4 py-2.5 transition-opacity duration-300 hover:opacity-90"
          >
            Wholesale
          </Link>
          <a
            href={`tel:${SITE.phone}`}
            className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground label-caps flex items-center gap-2 border px-4 py-2.5 transition-colors duration-300"
          >
            <Phone className="h-3.5 w-3.5" /> Call Now
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <a
            href={`tel:${SITE.phone}`}
            aria-label="Call Mapps Creation"
            className="bg-primary text-primary-foreground flex h-11 w-11 items-center justify-center"
          >
            <Phone className="h-4 w-4" />
          </a>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="border-border text-foreground flex h-11 w-11 items-center justify-center border"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className={`bg-background fixed inset-x-0 bottom-0 z-[99] md:hidden ${marqueeVisible ? "top-[100px]" : "top-16"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_UI }}
          >
            <div className="silk absolute inset-0" />
            <div className="relative flex h-full flex-col justify-center gap-2 px-8">
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.55, ease: EASE_REVEAL, delay: 0.06 * i }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="font-display text-foreground block border-b border-border/60 py-5 text-4xl"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.55, ease: EASE_REVEAL, delay: 0.06 * LINKS.length }}
              >
                <Link
                  to="/wholesale"
                  onClick={() => setOpen(false)}
                  className="bg-primary text-primary-foreground label-caps mt-6 flex min-h-[52px] items-center justify-center"
                >
                  Wholesale
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
