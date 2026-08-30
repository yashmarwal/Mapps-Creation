"use client";

import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/seo";
import { EASE_REVEAL } from "./motion";
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
  const pathname = useLocation({ select: (l) => l.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 z-[100] transition-[background-color,backdrop-filter,border-color] duration-300 ${
          marqueeVisible ? "top-9" : "top-0"
        } ${
          scrolled
            ? "bg-background/90 border-border border-b backdrop-blur-xl shadow-sm"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-10">
          <Link to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
            <LogoMark size={38} />
            <span className="font-display text-foreground hidden text-xl tracking-wide sm:block md:hidden lg:block">
              Mapps Creation
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-4 lg:gap-8 md:flex">
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

          {/* Mobile Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href={`tel:${SITE.phone}`}
              aria-label="Call Mapps Creation"
              className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-sm"
            >
              <Phone className="h-4 w-4" />
            </a>
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="border-border text-foreground flex h-10 w-10 items-center justify-center border bg-background/50 rounded-sm"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Full-Screen Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-drawer"
            data-lenis-prevent
            className="bg-[#0F2038] text-foreground fixed inset-0 z-[300] flex flex-col overflow-y-auto md:hidden"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4, ease: EASE_REVEAL }}
          >
            <div className="silk absolute inset-0 min-h-full opacity-40" />

            {/* Drawer Header */}
            <div className="relative z-10 flex h-16 items-center justify-between px-5 border-b border-[var(--gold)]/20">
              <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                <LogoMark size={36} />
                <span className="font-display text-[#F7F3EA] text-lg tracking-wider uppercase font-light">
                  Mapps Creation
                </span>
              </Link>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center text-[#F7F3EA] border border-[var(--gold)]/30 rounded-sm bg-background/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="relative z-10 flex flex-1 flex-col justify-center px-8 py-10 gap-2">
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.45, ease: EASE_REVEAL, delay: 0.08 * i }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="font-display text-[#F7F3EA] block border-b border-[var(--gold)]/20 py-4 text-3xl font-light tracking-wider"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, ease: EASE_REVEAL, delay: 0.35 }}
                className="mt-8 flex flex-col gap-3"
              >
                <Link
                  to="/wholesale"
                  onClick={() => setOpen(false)}
                  className="bg-[var(--gold)] text-[#0F2038] label-caps flex min-h-[50px] items-center justify-center font-medium tracking-widest uppercase shadow-md"
                >
                  Wholesale Enquiry
                </Link>
                <a
                  href={`tel:${SITE.phone}`}
                  className="border border-[var(--gold)]/40 text-[var(--gold)] label-caps flex min-h-[50px] items-center justify-center gap-2 uppercase tracking-widest"
                >
                  <Phone className="h-4 w-4" /> Direct Call: {SITE.phone}
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
