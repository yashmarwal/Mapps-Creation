"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Quote, Sparkles, ShieldCheck, MapPin, Award, Maximize2, X } from "lucide-react";
import { useState } from "react";
import founderImg from "@/assets/founder.png";
import { whatsappLink } from "@/lib/seo";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";
import { EASE_UI, Reveal } from "./motion";

export function FounderSection({ className = "" }: { className?: string }) {
  const [imageOpen, setImageOpen] = useState(false);

  return (
    <>
      <section className={`relative overflow-hidden py-10 md:py-16 ${className}`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10">
          <Reveal>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-[var(--gold)] font-bold uppercase tracking-widest text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Leadership
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Meet Our Co-Founder
            </h2>
          </Reveal>

          {/* Sleek, Compact Card Container */}
          <Reveal index={1} className="mt-6 md:mt-8">
            <div className="relative glass-card-luxury gold-shimmer-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
              {/* Subtle Ambient Background Light */}
              <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[var(--gold)]/10 blur-3xl" />

              <div className="relative flex flex-col md:flex-row md:items-center gap-5 sm:gap-6 md:gap-8">
                {/* Profile Image & Mobile Header */}
                <div className="flex items-center gap-3.5 sm:gap-4 md:flex-col md:items-center md:justify-center shrink-0">
                  {/* Tappable Photo Frame */}
                  <div
                    onClick={() => setImageOpen(true)}
                    className="relative shrink-0 cursor-pointer group"
                    title="Click/tap to view full screen"
                  >
                    <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-44 md:w-44 overflow-hidden rounded-2xl border border-[var(--gold)]/40 bg-slate-900 p-1 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:border-[var(--gold)]">
                      <img
                        src={founderImg}
                        alt="Pratham Aggarwal — Co-Founder & Proprietor"
                        className="h-full w-full object-cover rounded-xl"
                      />
                    </div>

                    {/* Hover/Tap Magnify Overlay Hint */}
                    <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Maximize2 className="h-4 w-4 md:h-6 md:w-6 drop-shadow-md" />
                    </div>

                    <span
                      className="absolute -bottom-1 -right-1 md:bottom-1 md:right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#0A1628]"
                      title="Active Leadership"
                    />
                  </div>

                  {/* Mobile Name Block */}
                  <div className="md:hidden">
                    <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-foreground">
                      Pratham Aggarwal
                    </h3>
                    <p className="text-[var(--gold)] font-medium text-[11px] uppercase tracking-wider mt-0.5">
                      Co-Founder &amp; Proprietor
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 text-emerald-400" /> Surat Textile Hub
                    </span>
                  </div>
                </div>

                {/* Narrative / Quote Block */}
                <div className="flex-1 space-y-3 sm:space-y-4">
                  {/* Desktop Name Block */}
                  <div className="hidden md:block">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif text-2xl font-bold tracking-wide text-foreground">
                          Pratham Aggarwal
                        </h3>
                        <p className="text-[var(--gold)] font-bold text-xs uppercase tracking-widest mt-0.5">
                          Co-Founder &amp; Proprietor · Mapps Creation
                        </p>
                      </div>
                      <span className="border border-[var(--gold)]/30 text-[var(--gold)] font-semibold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-emerald-400" /> Surat Hub Direct
                      </span>
                    </div>
                  </div>

                  {/* Quote Block */}
                  <div className="relative bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 sm:p-4">
                    <Quote className="h-4 w-4 text-[var(--gold)]/40 absolute top-3 left-3 rotate-180" />
                    <p className="font-serif italic text-xs sm:text-sm md:text-base leading-relaxed text-slate-200 pl-4 sm:pl-5">
                      &ldquo;Our commitment is simple — to provide garment manufacturers and
                      exporters across India with uncompromising fabric quality, precise GSM
                      specifications, and honest direct pricing straight from Surat&rsquo;s textile
                      hub.&rdquo;
                    </p>
                  </div>

                  {/* Credential Badges & WhatsApp Action */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <span className="bg-slate-900/80 border border-slate-800 text-slate-300 text-[10px] sm:text-xs px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Award className="h-3 w-3 text-[var(--gold)]" /> Surat Hub Direct
                      </span>
                      <span className="bg-slate-900/80 border border-slate-800 text-slate-300 text-[10px] sm:text-xs px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-emerald-400" /> 100% Quality Inspected
                      </span>
                    </div>

                    <a
                      href={whatsappLink(
                        "Hi Pratham, I would like to make a fabric requirement enquiry for my brand.",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-enquire btn-enquire-gold w-full sm:w-auto !min-h-[38px] !py-1.5 !px-4 !text-xs !rounded-full shrink-0 shadow-sm flex justify-center"
                    >
                      <span>
                        <WhatsAppIcon className="h-3.5 w-3.5" /> Connect on WhatsApp
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {imageOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_UI }}
            className="fixed inset-0 z-[220] flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
            onClick={() => setImageOpen(false)}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setImageOpen(false)}
              aria-label="Close full-screen image"
              className="absolute top-5 right-5 z-[225] bg-slate-900/80 border border-slate-700 text-foreground hover:bg-slate-800 p-2.5 rounded-full transition-all cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Modal Image Box */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE_UI }}
              className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-3xl border border-[var(--gold)]/40 bg-slate-950 p-2 shadow-[0_0_80px_rgba(201,166,107,0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={founderImg}
                alt="Pratham Aggarwal — Full View"
                className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain"
              />
              <div className="bg-slate-950/90 p-3.5 text-center">
                <h4 className="font-serif text-lg font-bold text-foreground">Pratham Aggarwal</h4>
                <p className="text-[var(--gold)] text-xs font-semibold uppercase tracking-wider mt-0.5">
                  Co-Founder &amp; Proprietor · Mapps Creation, Surat
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
