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
      {/* Sleek Tooltip Label on Hover */}
      <span className="bg-[#0A1628]/95 border border-slate-700 text-foreground font-semibold label-caps backdrop-blur-xl pointer-events-none -mr-7 max-w-0 overflow-hidden rounded-l-full py-3.5 whitespace-nowrap opacity-0 transition-all duration-300 ease-out group-hover:max-w-[180px] group-hover:pl-5 group-hover:pr-9 group-hover:opacity-100 shadow-xl text-xs tracking-wider">
        WhatsApp Us
      </span>

      {/* Official WhatsApp Button Container */}
      <span className="relative flex h-13 w-13 items-center justify-center shrink-0">
        <span className="bg-[#25D366] text-white relative flex h-13 w-13 items-center justify-center rounded-full shadow-lg shadow-black/40 border border-emerald-400/30 transition-transform duration-300 ease-out group-hover:scale-105 active:scale-95">
          <WhatsAppIcon className="h-7 w-7 fill-white" />
        </span>
      </span>
    </a>
  );
}
