"use client";

import { Link } from "@tanstack/react-router";
import { ArrowRight, Phone, Sparkles } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/seo";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";

/**
 * Ultra-Luxurious Floating Mobile Contact Dock
 * Features glassmorphism background, glowing quick-action pills, and a primary Gold CTA button.
 */
export function MobileActionBar({ onOpenAsk }: { onOpenAsk: () => void }) {
  return (
    <nav
      aria-label="Quick contact actions"
      className="fixed bottom-3 inset-x-3 z-[95] bg-[#0A1628]/95 border border-[var(--gold)]/35 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.7)] backdrop-blur-xl p-2 flex items-center justify-between gap-2 md:hidden"
    >
      {/* Phone Call Pill */}
      <a
        href={`tel:${SITE.phone}`}
        className="flex flex-col items-center justify-center min-w-[54px] py-2 px-2 rounded-xl bg-card/80 border border-border/80 text-foreground hover:border-[var(--gold)]/60 transition-all active:scale-95 cursor-pointer shrink-0"
        aria-label="Call Mapps Creation"
      >
        <Phone className="h-4 w-4 text-[var(--gold)]" />
        <span className="text-[9px] font-bold tracking-wider uppercase mt-1 text-foreground/90">
          Call
        </span>
      </a>

      {/* WhatsApp Chat Pill */}
      <a
        href={whatsappLink("Hi Mapps Creation, I'd like to enquire about your wholesale fabrics.")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center min-w-[58px] py-2 px-2 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/25 transition-all active:scale-95 cursor-pointer shrink-0"
        aria-label="Chat with Mapps Creation on WhatsApp"
      >
        <WhatsAppIcon className="h-4 w-4" />
        <span className="text-[9px] font-bold tracking-wider uppercase mt-1">WhatsApp</span>
      </a>

      {/* AI Help Assistant Pill */}
      <button
        type="button"
        onClick={onOpenAsk}
        className="relative flex flex-col items-center justify-center min-w-[54px] py-2 px-2 rounded-xl bg-card/80 border border-border/80 text-foreground hover:border-[var(--gold)]/60 transition-all active:scale-95 cursor-pointer shrink-0"
        aria-label="Open AI fabric help chat"
      >
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#25D366] animate-pulse" />
        <Sparkles className="h-4 w-4 text-amber-400" />
        <span className="text-[9px] font-bold tracking-wider uppercase mt-1 text-foreground/90">
          AI Help
        </span>
      </button>

      {/* Primary Enquire CTA */}
      <Link
        to="/contact"
        className="group flex-1 min-h-[46px] bg-primary text-primary-foreground font-semibold label-caps rounded-xl flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer text-xs tracking-wider shrink-0"
      >
        <span>Enquire Now</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </nav>
  );
}
