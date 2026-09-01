"use client";

import { whatsappLink } from "@/lib/seo";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Hi Mapps Creation, I would like to make a wholesale fabric enquiry.")}
      target="_blank"
      rel="noopener noreferrer"
      title="WhatsApp Us"
      aria-label="Chat with Mapps Creation on WhatsApp"
      className="group fixed right-6 bottom-6 z-[95] hidden items-center md:flex"
    >
      <span className="bg-[#0A1628]/95 border border-[var(--gold)]/40 text-foreground font-semibold label-caps backdrop-blur-xl pointer-events-none -mr-7 max-w-0 overflow-hidden rounded-l-full py-3.5 whitespace-nowrap opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-w-[200px] group-hover:pl-6 group-hover:pr-10 group-hover:opacity-100 shadow-xl text-xs tracking-wider">
        WhatsApp Us
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center shrink-0">
        <span className="attention-pulse bg-[#25D366] text-black relative flex h-14 w-14 items-center justify-center rounded-full shadow-[0_0_25px_-5px_rgba(37,211,102,0.6)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:rotate-12">
          <WhatsAppIcon className="h-7 w-7 fill-current" />
        </span>
      </span>
    </a>
  );
}
