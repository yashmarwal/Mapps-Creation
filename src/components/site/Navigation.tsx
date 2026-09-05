"use client";

import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  ChevronRight,
  Clock,
  Download,
  Home,
  Info,
  Layers,
  MapPin,
  Menu,
  Phone,
  PhoneCall,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SITE, whatsappLink } from "@/lib/seo";
import { EASE_REVEAL } from "./motion";
import { LogoMark } from "./LogoMark";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";

const LINKS = [
  {
    to: "/",
    label: "Home",
    num: "01",
    desc: "Welcome & Fabric Highlights",
    icon: Home,
  },
  {
    to: "/catalogue",
    label: "Catalogue",
    num: "02",
    desc: "500+ Lycra & Knitted Fabrics",
    icon: Layers,
    badge: "500+ Types",
  },
  {
    to: "/wholesale",
    label: "Wholesale",
    num: "03",
    desc: "B2B Bulk Factory Pricing",
    icon: Building2,
    badge: "B2B Bulk",
  },
  {
    to: "/about",
    label: "About Us",
    num: "04",
    desc: "Surat Manufacturing Legacy",
    icon: Info,
  },
  {
    to: "/contact",
    label: "Contact",
    num: "05",
    desc: "Direct Office & Surat Location",
    icon: PhoneCall,
  },
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
        className={`fixed inset-x-0 z-[100] transition-all duration-300 ${
          marqueeVisible ? "top-9" : "top-0"
        } ${
          scrolled
            ? "bg-[#0B1524]/90 border-b border-amber-500/15 backdrop-blur-2xl shadow-2xl py-0.5"
            : "border-b border-white/5 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 md:h-20">
          {/* Logo Mark & Brand Title */}
          <Link
            to="/"
            className="group flex items-center gap-3 shrink-0"
            onClick={() => setOpen(false)}
          >
            <LogoMark size={36} />
            <span className="font-display text-slate-100 hidden text-xl tracking-wide sm:block lg:text-2xl font-serif">
              Mapps <span className="text-[var(--gold)] italic font-light">Creation</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-5 lg:gap-8 md:flex">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-slate-300 hover:text-amber-300 font-medium tracking-[0.18em] text-[11px] uppercase relative py-1.5 transition-colors group"
                activeProps={{ className: "text-amber-400 font-semibold" }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
                <span className="bg-gradient-to-r from-amber-400 to-amber-200 absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-300 ease-out group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Action CTA Bar (Desktop) */}
          <div className="hidden items-center gap-3 md:flex shrink-0">
            {/* Search Pill */}
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                className="bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-slate-100 px-3.5 py-1.5 rounded-full font-medium transition-all duration-300 active:scale-95 cursor-pointer text-xs flex items-center gap-2 shadow-inner group"
                title="Search Fabrics (Ctrl+K)"
              >
                <Search className="h-3.5 w-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] tracking-wide text-slate-400 group-hover:text-slate-200">
                  Search...
                </span>
                <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-900 border border-slate-800 text-amber-400/80">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Download PDF Catalogue Button */}
            {onOpenCatalog && (
              <button
                type="button"
                onClick={onOpenCatalog}
                className="bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-400 hover:text-slate-950 px-4 py-1.5 rounded-full font-semibold transition-all duration-300 active:scale-95 cursor-pointer text-xs flex items-center gap-2 shadow-lg shadow-amber-500/5 group"
                title="Download B2B Fabric Catalogue"
              >
                <Download className="h-3.5 w-3.5 text-amber-400 group-hover:text-slate-950 transition-colors" />
                <span className="font-bold tracking-wider uppercase text-[11px]">
                  PDF Catalogue
                </span>
              </button>
            )}

            {/* Call Desk Button */}
            <a
              href={`tel:${SITE.phone}`}
              className="bg-slate-950/80 border border-emerald-500/30 text-slate-200 hover:border-emerald-400 hover:bg-slate-900 px-3.5 py-1.5 rounded-full transition-all duration-300 active:scale-95 cursor-pointer text-xs flex items-center gap-2 shadow-xs group"
              title={`Call Direct: ${SITE.phoneDisplay}`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Phone className="h-3.5 w-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span className="font-mono text-[11px] font-semibold tracking-tight text-emerald-300 group-hover:text-emerald-200">
                {SITE.phoneDisplay}
              </span>
            </a>
          </div>

          {/* Mobile Action Controls Header Bar */}
          <div className="flex items-center gap-2 md:hidden">
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                aria-label="Search Fabrics"
                className="border border-slate-800 text-amber-400 bg-slate-950/90 flex h-9 w-9 items-center justify-center rounded-full active:scale-95 transition-all cursor-pointer"
              >
                <Search className="h-4 w-4" />
              </button>
            )}

            {onOpenCatalog && (
              <button
                type="button"
                onClick={onOpenCatalog}
                aria-label="Download PDF Catalogue"
                className="border border-amber-500/40 text-amber-300 bg-amber-500/10 flex h-9 px-3 items-center justify-center gap-1.5 rounded-full active:scale-95 transition-all text-[11px] font-bold tracking-wide"
              >
                <Download className="h-3.5 w-3.5" /> PDF
              </button>
            )}

            <a
              href={`tel:${SITE.phone}`}
              aria-label="Call Mapps Creation"
              className="border border-emerald-500/40 text-emerald-400 bg-slate-950/90 flex h-9 w-9 items-center justify-center rounded-full active:scale-95 transition-all cursor-pointer"
            >
              <Phone className="h-4 w-4" />
            </a>

            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle Menu"
              className="border-slate-800 text-slate-100 bg-slate-900 flex h-9 w-9 items-center justify-center border rounded-full transition-all active:scale-95 cursor-pointer shadow-md"
            >
              {open ? <X className="h-4 w-4 text-amber-400" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Redesigned Luxury Mobile Drawer Navigation Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-[999] flex flex-col bg-[#070D19]/98 text-slate-100 backdrop-blur-3xl md:hidden overflow-hidden"
          >
            {/* Ambient Lighting Accents */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-12 -left-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

            {/* Top Bar Header inside Overlay Drawer */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-amber-500/15 bg-slate-950/80 shrink-0">
              <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                <LogoMark size={32} />
                <div className="flex flex-col">
                  <span className="font-serif text-lg font-medium tracking-wide text-slate-100 leading-tight">
                    Mapps <span className="text-[var(--gold)] italic">Creation</span>
                  </span>
                  <span className="text-[10px] font-sans tracking-widest text-slate-400 uppercase">
                    Surat Fabric Hub
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-amber-400 hover:text-white hover:border-amber-500/40 active:scale-95 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Scrollable Drawer Content */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
              {/* Interactive Search Bar Trigger */}
              {onOpenSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onOpenSearch();
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 text-slate-300 transition-all text-xs shadow-inner group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-400 text-xs font-normal">
                      Search fabrics, GSM, textures...
                    </span>
                  </div>
                  <kbd className="px-2 py-0.5 text-[9px] font-mono rounded bg-slate-950 border border-slate-800 text-amber-400/90">
                    SEARCH
                  </kbd>
                </button>
              )}

              {/* Navigation Cards List */}
              <div className="space-y-2.5">
                <div className="px-1 text-[10px] font-bold tracking-widest text-amber-400/90 uppercase">
                  Main Navigation
                </div>
                {LINKS.map((link, idx) => {
                  const Icon = link.icon;
                  const isActive =
                    pathname === link.to || (link.to !== "/" && pathname.startsWith(link.to));

                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, ease: EASE_REVEAL }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => setOpen(false)}
                        className={`group relative flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-amber-500/20 via-slate-900/95 to-slate-900 border-amber-500/60 text-slate-100 shadow-lg shadow-amber-500/10"
                            : "bg-slate-900/50 border-slate-800/80 hover:bg-slate-900/90 hover:border-amber-500/30 text-slate-300"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-3 bottom-3 w-1 bg-amber-400 rounded-r-full shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                        )}

                        <div className="flex items-center gap-3.5">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                              isActive
                                ? "bg-amber-400/20 border-amber-400/50 text-amber-300"
                                : "bg-slate-800/60 border-slate-700/50 text-slate-400 group-hover:text-amber-300 group-hover:border-amber-500/30"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-lg font-medium tracking-wide">
                                {link.label}
                              </span>
                              {"badge" in link && link.badge && (
                                <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                                  {link.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-sans font-normal">
                              {link.desc}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-slate-500 group-hover:text-amber-400/70">
                            {link.num}
                          </span>
                          <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Action Buttons Section */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26, ease: EASE_REVEAL }}
                className="pt-1 space-y-2.5"
              >
                {onOpenCatalog && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onOpenCatalog();
                    }}
                    className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold uppercase tracking-wider min-h-[46px] rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all hover:brightness-110 cursor-pointer"
                  >
                    <Download className="h-4 w-4" /> Download PDF Catalogue
                  </button>
                )}

                <a
                  href={whatsappLink(
                    "Hi Mapps Creation, I would like to make a wholesale fabric enquiry. Please share catalogue & rates.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="w-full bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] font-bold uppercase tracking-wider min-h-[46px] rounded-xl text-xs flex items-center justify-center gap-2 active:scale-98 transition-all hover:bg-[#25D366]/25 cursor-pointer"
                >
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp Bulk Inquiry
                </a>

                <a
                  href={`tel:${SITE.phone}`}
                  onClick={() => setOpen(false)}
                  className="w-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 min-h-[44px] flex items-center justify-center gap-2 rounded-xl font-semibold tracking-wider text-xs active:scale-98 transition-all"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <PhoneCall className="h-4 w-4 text-emerald-400" /> Direct Mill Desk:{" "}
                  {SITE.phoneDisplay}
                </a>
              </motion.div>

              {/* Location & Operating Hours Footer Banner inside Menu */}
              <div className="pt-2 pb-6 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 px-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-amber-400" />
                  <span>Surat Textile Hub, IN</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Mon-Sat: 9 AM - 8 PM</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
