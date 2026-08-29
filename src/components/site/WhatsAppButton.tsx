"use client";

import { whatsappLink } from "@/lib/seo";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Hi Mapps Creation, I'd like to enquire about your fabrics.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Mapps Creation on WhatsApp"
      className="group fixed right-6 bottom-0 z-[95] hidden items-center md:safe-bottom md:flex"
    >
      <span className="relative flex h-14 w-14 items-center justify-center">
        <span className="attention-pulse bg-primary text-primary-foreground relative flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-12">
          <WhatsAppIcon className="h-7 w-7" />
        </span>
      </span>
      <span className="bg-card text-foreground label-caps pointer-events-none -ml-7 max-w-0 overflow-hidden rounded-r-full border-y border-r border-border py-4 whitespace-nowrap opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-w-[220px] group-hover:pr-6 group-hover:pl-9 group-hover:opacity-100">
        WhatsApp Us
      </span>
    </a>
  );
}
