"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_REVEAL } from "./motion";

/** India's standard zonal council groupings — used so "pan-India" reads as
 * genuinely comprehensive rather than a curated shortlist of cities. */
const ZONES = [
  { name: "North", states: ["Delhi", "Punjab", "Haryana", "Rajasthan", "Himachal Pradesh"] },
  { name: "West", states: ["Gujarat", "Maharashtra", "Goa"] },
  { name: "Central", states: ["Madhya Pradesh", "Uttar Pradesh", "Chhattisgarh", "Uttarakhand"] },
  { name: "East", states: ["West Bengal", "Bihar", "Jharkhand", "Odisha"] },
  { name: "South", states: ["Karnataka", "Tamil Nadu", "Telangana", "Andhra Pradesh", "Kerala"] },
  { name: "Northeast", states: ["Assam", "Tripura", "Meghalaya", "Manipur"] },
] as const;

/** Horizontal supply fan-out — one trunk from Surat branching into all six zones of India. */
export function SupplyTree() {
  const reduced = useReducedMotion();

  return (
    <div className="mx-auto max-w-6xl">
      {/* Root */}
      <div className="flex items-center justify-center gap-3">
        <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
          <span className="bg-primary h-2.5 w-2.5 rounded-full" />
          {!reduced && (
            <motion.span
              className="border-primary absolute inset-0 rounded-full border"
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 3.2 }}
              transition={{ duration: 2, ease: "easeOut", repeat: Infinity }}
            />
          )}
        </span>
        <span className="font-display text-xl">Surat</span>
        <span className="label-caps text-primary">Origin</span>
      </div>

      {/* Trunk */}
      <div className="border-border mx-auto mt-5 h-6 w-px border-l" />

      {/* Zones — horizontal fan-out, scrollable on small screens */}
      <div className="border-border border-t">
        <div className="flex gap-8 overflow-x-auto px-1 pb-2 md:grid md:grid-cols-6 md:gap-6 md:overflow-visible">
          {ZONES.map((zone, zi) => (
            <motion.div
              key={zone.name}
              className="border-border relative min-w-[150px] flex-1 border-t pt-6 text-center md:min-w-0"
              initial={{ opacity: 0, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE_REVEAL, delay: zi * 0.08 }}
            >
              <span className="bg-primary absolute -top-px left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45" />
              <p className="label-caps text-secondary">{zone.name}</p>
              <ul className="mt-4 space-y-2">
                {zone.states.map((state) => (
                  <li key={state} className="text-muted-foreground text-sm leading-snug">
                    {state}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
