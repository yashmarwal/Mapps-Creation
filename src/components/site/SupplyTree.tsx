"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageSquare, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { SITE } from "@/lib/seo";
import { EASE_REVEAL, EASE_UI } from "./motion";

/** India's standard zonal council groupings — used so "pan-India" reads as
 * genuinely comprehensive rather than a curated shortlist of cities. */
const ZONES = [
  { name: "North", states: ["Delhi", "Punjab", "Haryana", "Rajasthan", "Himachal Pradesh"], hub: "Delhi, Ludhiana & Jaipur Hubs" },
  { name: "West", states: ["Gujarat", "Maharashtra", "Goa"], hub: "Surat, Mumbai & Pune Hubs" },
  { name: "Central", states: ["Madhya Pradesh", "Uttar Pradesh", "Chhattisgarh", "Uttarakhand"], hub: "Kanpur, Indore & Lucknow Hubs" },
  { name: "East", states: ["West Bengal", "Bihar", "Jharkhand", "Odisha"], hub: "Kolkata & Cuttack Hubs" },
  { name: "South", states: ["Karnataka", "Tamil Nadu", "Telangana", "Andhra Pradesh", "Kerala"], hub: "Tirupur, Bengaluru & Hyderabad Hubs" },
  { name: "Northeast", states: ["Assam", "Tripura", "Meghalaya", "Manipur"], hub: "Guwahati Hub" },
] as const;

export function SupplyTree() {
  const reduced = useReducedMotion();
  const [activeZone, setActiveZone] = useState(0);

  const selectedZone = ZONES[activeZone];
  const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    `Hi Mapps Creation, I am inquiring about wholesale fabric dispatch from Surat to ${selectedZone.name} Zone (${selectedZone.states.join(", ")}).`
  )}`;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Central Origin Node */}
      <div className="flex items-center justify-center gap-3">
        <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
          <span className="bg-primary h-3 w-3 rounded-full shadow-[0_0_12px_var(--gold)]" />
          {!reduced && (
            <motion.span
              className="border-primary absolute inset-0 rounded-full border"
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 3.2 }}
              transition={{ duration: 2, ease: "easeOut", repeat: Infinity }}
            />
          )}
        </span>
        <span className="font-display text-2xl md:text-3xl text-foreground tracking-wide">Surat</span>
        <span className="label-caps text-primary text-xs md:text-sm tracking-widest uppercase">Origin</span>
      </div>

      {/* Trunk Line */}
      <div className="border-border/60 mx-auto mt-4 h-6 w-px border-l" />

      {/* Interactive Zone Selector Pills (Desktop & Mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 px-2 no-scrollbar justify-start sm:justify-center">
        {ZONES.map((zone, idx) => {
          const isActive = activeZone === idx;
          return (
            <button
              key={zone.name}
              onClick={() => setActiveZone(idx)}
              className={`relative px-4 sm:px-6 py-2.5 text-xs sm:text-sm uppercase tracking-wider rounded-full transition-all shrink-0 ${
                isActive
                  ? "text-primary-foreground font-medium shadow-md"
                  : "text-muted-foreground hover:text-foreground border border-border/60 bg-background/60"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeZonePill"
                  className="absolute inset-0 bg-primary rounded-full shadow-[var(--shadow-gold)]"
                  transition={{ duration: 0.3, ease: EASE_UI }}
                />
              )}
              <span className="relative z-10">{zone.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Route & Logistics Hub Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedZone.name}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: EASE_UI }}
          className="mt-2 border border-[var(--gold)]/30 bg-[#0F2038]/90 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl text-left"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--gold)]/20 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-primary font-mono tracking-wider uppercase">
                    <span>Surat Dispatch Hub</span>
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-[#F7F3EA]">{selectedZone.name} Zone</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{selectedZone.hub}</p>
                </div>
                <span className="text-xs text-primary/90 border border-primary/40 px-3 py-1 rounded-full uppercase tracking-wider font-mono bg-primary/5">
                  {selectedZone.states.length} Manufacturing Regions
                </span>
              </div>

              <div>
                <p className="label-caps text-muted-foreground text-xs tracking-widest uppercase mb-3">
                  Garment Manufacturing Destinations
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedZone.states.map((state) => (
                    <span
                      key={state}
                      className="bg-primary/10 text-primary border border-primary/30 px-3.5 py-2 text-xs sm:text-sm tracking-wide rounded-lg font-light shadow-sm"
                    >
                      {state}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Logistics & Action Column */}
            <div className="lg:col-span-5 bg-background/40 border border-border/50 p-5 sm:p-6 rounded-xl flex flex-col justify-between h-full space-y-4">
              <div className="space-y-3 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-primary shrink-0" />
                  <span>Pan-India Transport & Road Logistics Network</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                  <span>100% GST Billed Bulk Fabric Roll Shipments</span>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground label-caps flex min-h-[48px] items-center justify-center gap-2.5 rounded-lg font-medium tracking-wider uppercase text-xs sm:text-sm shadow-md transition-opacity hover:opacity-90 mt-2"
              >
                <MessageSquare className="h-4.5 w-4.5" /> Inquiry For {selectedZone.name} Supply
              </a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 6-Zone Quick Navigation Grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {ZONES.map((zone, idx) => (
          <button
            key={zone.name}
            onClick={() => setActiveZone(idx)}
            className={`p-3 text-center rounded-lg border transition-all text-xs ${
              activeZone === idx
                ? "border-primary bg-primary/10 text-primary shadow-sm font-medium"
                : "border-border/50 bg-background/30 text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            <span className="block font-display text-sm text-foreground">{zone.name}</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">{zone.states.length} States</span>
          </button>
        ))}
      </div>
    </div>
  );
}
