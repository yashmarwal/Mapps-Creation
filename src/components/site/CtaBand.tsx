"use client";

import { Link } from "@tanstack/react-router";
import { Mail, SendHorizontal } from "lucide-react";
import warehouse from "@/assets/warehouse.jpg";
import { whatsappLink } from "@/lib/seo";
import { Reveal } from "./motion";

const WA_MESSAGE = "Hi Mapps Creation, please share a quotation.";

/**
 * Shared "quick enquiry" conversion prompt.
 *
 * `variant="full"` — the big warehouse-photo close, used once on the
 * homepage, right after the featured catalogue.
 *
 * `variant="slim"` (default) — a compact text + button strip with no
 * photo, reused near the bottom of every other page (About, Catalogue,
 * Wholesale, Contact) so the same conversion prompt is present sitewide
 * instead of only appearing once, buried at the end of Home.
 */
export function CtaBand({ variant = "slim" }: { variant?: "full" | "slim" }) {
  const waHref = whatsappLink(WA_MESSAGE);

  if (variant === "full") {
    return (
      <section className="relative overflow-hidden">
        <img
          src={warehouse}
          alt="Fabric rolls stacked in the Mapps Creation warehouse in Surat"
          loading="lazy"
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="silk grain absolute inset-0 opacity-80" />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center md:px-10 md:py-32">
          <Reveal>
            <h2 className="display-lg">Tell us what you're knitting</h2>
            <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-sm leading-relaxed md:text-base">
              Share your fabric type, GSM and quantity — we'll come back with swatches and a rate
              the same working day.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Us"
                className="btn-enquire !min-h-[52px] !text-xs !px-7"
              >
                <span>
                  <SendHorizontal className="h-4 w-4" />
                  Quick Enquiry
                </span>
              </a>
              <Link
                to="/contact"
                className="btn-enquire btn-enquire-navy !min-h-[52px] !text-xs !px-7"
              >
                <span>
                  <Mail className="h-4 w-4" />
                  Email Desk
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="border-border bg-card/40 border-y">
      <Reveal className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-5 py-10 text-center sm:flex-row sm:justify-between sm:text-left md:px-10">
        <div>
          <h3 className="font-serif text-xl md:text-2xl">Tell us what you're knitting</h3>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Share your fabric type, GSM and quantity — swatches and a rate the same working day.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap justify-center gap-3">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp Us"
            className="btn-enquire !min-h-[46px] !text-xs !px-6"
          >
            <span>
              <SendHorizontal className="h-4 w-4" />
              Quick Enquiry
            </span>
          </a>
          <Link to="/contact" className="btn-enquire btn-enquire-navy !min-h-[46px] !text-xs !px-6">
            <span>
              <Mail className="h-4 w-4" />
              Email Desk
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
