"use client";

import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircleQuestion, Phone } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/seo";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";

const ICON_BTN =
  "border-border text-muted-foreground flex min-h-[56px] w-16 shrink-0 flex-col items-center justify-center gap-1 border";

/**
 * Persistent mobile-only contact strip — Call / Chat / Instant Help + a
 * primary Enquire Now CTA, docked to the bottom of the viewport. Replaces
 * the desktop's separate floating WhatsApp/Ask buttons and sticky pill,
 * which stay desktop-only (see WhatsAppButton, AskUsChat, StickyCta).
 */
export function MobileActionBar({ onOpenAsk }: { onOpenAsk: () => void }) {
  return (
    <nav
      aria-label="Quick contact actions"
      className="bg-background/95 border-border safe-bottom fixed inset-x-0 bottom-0 z-[95] flex gap-2 border-t px-2 pt-2 backdrop-blur md:hidden"
    >
      <a href={`tel:${SITE.phone}`} className={ICON_BTN} aria-label="Call Mapps Creation">
        <Phone className="h-[18px] w-[18px]" />
        <span className="text-[9px] font-medium tracking-[0.14em] uppercase">Call</span>
      </a>

      <a
        href={whatsappLink("Hi Mapps Creation, I'd like to enquire about your fabrics.")}
        target="_blank"
        rel="noopener noreferrer"
        className={`${ICON_BTN} border-[#25D366]/70 text-[#25D366]`}
        aria-label="Chat with Mapps Creation on WhatsApp"
      >
        <WhatsAppIcon className="h-[18px] w-[18px]" />
        <span className="text-[9px] font-medium tracking-[0.14em] uppercase">Chat</span>
      </a>

      <button
        type="button"
        onClick={onOpenAsk}
        className={`${ICON_BTN} relative`}
        aria-label="Open instant help chat"
      >
        <span className="absolute top-2 right-3 h-1.5 w-1.5 rounded-full bg-[#25D366]" />
        <MessageCircleQuestion className="h-[18px] w-[18px]" />
        <span className="text-center text-[9px] leading-[1.15] font-medium tracking-[0.1em] uppercase">
          Instant
          <br />
          Help
        </span>
      </button>

      <Link
        to="/contact"
        className="bg-primary text-primary-foreground label-caps flex min-h-[56px] flex-1 items-center justify-center gap-2"
      >
        Enquire Now
        <ArrowRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
