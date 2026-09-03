"use client";

import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, Phone, Search, X } from "lucide-react";
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

export function Navigation({
  marqueeVisible = false,
  onOpenCatalog,
  onOpenSearch,
}: {
  marqueeVisible?: boolean;
  onOpenCatalog?: () => void;
  onOpenSearch?: () => void;
}) {
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
          <div className="hidden items-center gap-3 lg:gap-6 md:flex">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="label-caps text-muted-foreground hover:text-foreground group relative py-2 transition-colors text-xs"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
                <span className="bg-primary absolute bottom-0 left-0 h-px w-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
              </Link>
            ))}

            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                className="bg-slate-950/80 border border-slate-700/60 hover:border-[var(--gold)]/60 text-muted-foreground hover:text-foreground px-3.5 py-1.5 rounded-full font-medium transition-all duration-300 active:scale-95 cursor-pointer text-xs flex items-center gap-2 shadow-xs group shrink-0"
                title="Search Fabrics (Ctrl+K)"
              >
                <Search className="h-3.5 w-3.5 text-[var(--gold)]" />
                <span className="text-xs">Search...</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-900 border border-slate-800 text-muted-foreground/80">
                  ⌘K
                </kbd>
              </button>
            )}

            {onOpenCatalog && (
              <button
                type="button"
                onClick={onOpenCatalog}
                className="bg-slate-950/80 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-slate-950 px-3.5 py-1.5 rounded-full font-semibold transition-all duration-300 active:scale-95 cursor-pointer text-xs flex items-center gap-2 shadow-xs group shrink-0"
                title="Download Official B2B Fabric Catalogue PDF"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                  <Download className="h-3 w-3" />
                </span>
                <span className="font-bold tracking-wide uppercase text-[11px]">PDF Catalogue</span>
              </button>
            )}

            <Link
              to="/wholesale"
              className="bg-slate-900 border border-[var(--gold)]/50 text-[var(--gold)] hover:bg-[var(--gold)] hover:text-slate-950 label-caps flex items-center px-4 py-2 rounded-full font-bold transition-all duration-300 active:scale-95 cursor-pointer text-xs shadow-xs"
            >
              Wholesale
            </Link>
            <a
              href={`tel:${SITE.phone}`}
              className="bg-slate-950/80 border border-emerald-500/40 text-slate-100 hover:border-emerald-400 hover:bg-slate-900 px-3.5 py-1.5 rounded-full font-semibold transition-all duration-300 active:scale-95 cursor-pointer text-xs flex items-center gap-2 shadow-xs group shrink-0"
              title={`Call Sales Desk: ${SITE.phoneDisplay}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                <Phone className="h-3 w-3" />
              </span>
              <span className="font-mono text-[11px] font-bold tracking-tight whitespace-nowrap text-emerald-400 group-hover:text-slate-100 transition-colors">
                {SITE.phoneDisplay}
              </span>
            </a>
          </div>

          {/* Mobile Header Search, Call & Menu Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                aria-label="Search Fabrics"
                className="border border-slate-700/60 text-amber-400 bg-slate-950/90 backdrop-blur-md flex h-9 w-9 items-center justify-center rounded-full active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                <Search className="h-4 w-4" />
              </button>
            )}

            {onOpenCatalog && (
              <button
                type="button"
                onClick={onOpenCatalog}
                aria-label="Download PDF Catalogue"
                className="border border-amber-500/40 text-amber-400 bg-[#0A1628]/90 backdrop-blur-md flex h-9 px-2.5 items-center justify-center gap-1 rounded-full active:scale-95 transition-all shadow-xs cursor-pointer text-[10px] font-bold"
              >
                <Download className="h-3.5 w-3.5" /> PDF
              </button>
            )}
            <a
              href={`tel:${SITE.phone}`}
              aria-label="Call Mapps Creation"
              className="border border-[var(--gold)]/50 text-[var(--gold)] bg-[#0A1628]/80 backdrop-blur-md flex h-9 px-3 items-center justify-center gap-1.5 rounded-full active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold tracking-wider uppercase label-caps">
                Call
              </span>
            </a>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle Menu"
              className="border-border text-foreground hover:bg-card flex h-10 w-10 items-center justify-center border rounded-full backdrop-blur transition-all active:scale-95 cursor-pointer"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-background/95 fixed inset-0 z-[99] flex flex-col justify-between px-8 pt-28 pb-12 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-5">
              {LINKS.map((link, idx) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08, ease: EASE_REVEAL }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="font-serif text-3xl font-bold tracking-tight transition-colors hover:text-amber-400"
                    activeProps={{ className: "text-amber-400" }}
                    activeOptions={{ exact: link.to === "/" }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ease: EASE_REVEAL }}
              className="flex flex-col gap-3"
            >
              {onOpenCatalog && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onOpenCatalog();
                  }}
                  className="btn-enquire btn-enquire-gold w-full !min-h-[48px] !text-xs"
                >
                  <span>
                    <Download className="h-4 w-4" /> Download PDF Catalogue
                  </span>
                </button>
              )}
              <Link
                to="/wholesale"
                onClick={() => setOpen(false)}
                className="btn-enquire btn-enquire-navy w-full !min-h-[48px] !text-xs"
              >
                <span>Wholesale Enquiry</span>
              </Link>
              <a
                href={`tel:${SITE.phone}`}
                className="bg-amber-500/10 border border-amber-500/40 text-amber-400 label-caps flex min-h-[50px] items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer shadow-sm"
              >
                <Phone className="h-4 w-4" /> Direct Call: {SITE.phoneDisplay}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
