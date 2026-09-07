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
    setScrolled(window.scrollY > 40);
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
          {/* 1. Left Zone: Brand Logo & Title */}
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

          {/* 2. Center Zone: Centered Desktop Navigation Links */}
          <div className="hidden items-center justify-center gap-6 xl:gap-9 md:flex flex-1 px-4">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-slate-300 hover:text-amber-300 font-medium tracking-[0.16em] text-[11px] uppercase relative py-1.5 transition-colors group whitespace-nowrap"
                activeProps={{ className: "text-amber-400 font-semibold" }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
                <span className="bg-gradient-to-r from-amber-400 to-amber-200 absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-300 ease-out group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* 3. Right Zone: Consolidated Clean Action Bar */}
          <div className="hidden items-center gap-2.5 md:flex shrink-0">
            {/* Search Trigger */}
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-slate-100 h-9 px-3.5 rounded-full font-medium transition-all duration-300 active:scale-95 cursor-pointer text-xs flex items-center gap-2 shadow-inner group"
                title="Search Fabrics (Ctrl+K)"
              >
                <Search className="h-3.5 w-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] tracking-wide text-slate-400 group-hover:text-slate-200">
                  Search
                </span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-950 border border-slate-800 text-amber-400/80">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Download PDF Catalogue Button */}
            {onOpenCatalog && (
              <button
                type="button"
                onClick={onOpenCatalog}
                className="bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-400 hover:text-slate-950 h-9 px-4 rounded-full font-bold transition-all duration-300 active:scale-95 cursor-pointer text-[11px] uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/5 group"
                title="Download B2B Fabric Catalogue"
              >
                <Download className="h-3.5 w-3.5 text-amber-400 group-hover:text-slate-950 transition-colors" />
                <span>PDF Catalogue</span>
              </button>
            )}
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

      {/* Editorial Luxury Mobile Drawer Navigation Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[999] flex flex-col bg-[#070D19]/98 text-slate-100 backdrop-blur-3xl md:hidden overflow-hidden"
          >
            {/* Top Bar Header inside Overlay Drawer */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-950/90 shrink-0">
              <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                <LogoMark size={32} />
                <div className="flex flex-col">
                  <span className="font-serif text-lg font-medium tracking-wide text-slate-100 leading-tight">
                    Mapps <span className="text-[var(--gold)] italic">Creation</span>
                  </span>
                  <span className="text-[9px] font-sans tracking-widest text-slate-400 uppercase">
                    Surat Fabric Hub
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900/90 text-slate-300 hover:text-white hover:border-amber-500/40 active:scale-95 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
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
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-amber-500/40 text-slate-300 transition-all text-xs group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-amber-400/90 group-hover:scale-105 transition-transform" />
                    <span className="text-slate-400 text-xs font-normal">
                      Search fabrics, GSM, textures...
                    </span>
                  </div>
                  <kbd className="px-2 py-0.5 text-[9px] font-mono rounded bg-slate-950/80 border border-slate-800 text-amber-400/90">
                    SEARCH
                  </kbd>
                </button>
              )}

              {/* Editorial Navigation List */}
              <div className="space-y-1.5 pt-1">
                <div className="px-1 text-[9px] font-semibold tracking-[0.2em] text-amber-400/80 uppercase mb-3">
                  Navigation
                </div>

                {LINKS.map((link, idx) => {
                  const Icon = link.icon;
                  const isActive =
                    pathname === link.to || (link.to !== "/" && pathname.startsWith(link.to));

                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04, ease: EASE_REVEAL }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => setOpen(false)}
                        className={`group flex items-center justify-between py-3.5 px-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-slate-900/90 text-amber-300 font-medium"
                            : "hover:bg-slate-900/50 text-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              {/* Large Editorial Serif Page Title */}
                              <span
                                className={`font-serif text-xl tracking-wide transition-colors ${
                                  isActive
                                    ? "text-amber-300 font-semibold"
                                    : "text-slate-100 group-hover:text-amber-200"
                                }`}
                              >
                                {link.label}
                              </span>

                              {"badge" in link && link.badge && (
                                <span className="px-2 py-0.5 text-[9px] font-semibold rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                                  {link.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-sans font-normal truncate mt-0.5">
                              {link.desc}
                            </span>
                          </div>
                        </div>

                        {/* Active dot indicator or clean chevron */}
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          {isActive ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Action Buttons Section */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, ease: EASE_REVEAL }}
                className="pt-2 space-y-2.5 border-t border-slate-800/80"
              >
                {onOpenCatalog && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onOpenCatalog();
                    }}
                    className="w-full bg-slate-900 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-semibold uppercase tracking-wider min-h-[46px] rounded-xl text-xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer shadow-md"
                  >
                    <Download className="h-4 w-4 text-amber-400" /> Download PDF Catalogue
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={whatsappLink(
                      "Hi Mapps Creation, I would like to make a wholesale fabric enquiry. Please share catalogue & rates.",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="bg-[#25D366]/15 border border-[#25D366]/35 text-[#25D366] font-semibold uppercase tracking-wider min-h-[44px] rounded-xl text-[11px] flex items-center justify-center gap-1.5 active:scale-98 transition-all hover:bg-[#25D366]/25 cursor-pointer"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
                  </a>

                  <a
                    href={`tel:${SITE.phone}`}
                    onClick={() => setOpen(false)}
                    className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 text-slate-200 min-h-[44px] flex items-center justify-center gap-1.5 rounded-xl font-semibold tracking-wider text-[11px] uppercase active:scale-98 transition-all"
                  >
                    <PhoneCall className="h-3.5 w-3.5 text-amber-400" /> Call Desk
                  </a>
                </div>
              </motion.div>

              {/* Location & Operating Hours Footer */}
              <div className="pt-3 pb-6 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 px-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-amber-400" />
                  <span>Surat Textile Hub, IN</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400/90 font-medium">
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
