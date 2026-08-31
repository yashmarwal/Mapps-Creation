"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Check, Mail, MessageCircle, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EASE_REVEAL, EASE_UI, Reveal } from "./motion";
import type { Product } from "@/data/catalog";
import { SITE, whatsappLink } from "@/lib/seo";
import { useQuoteBasket } from "@/hooks/useQuoteBasket";

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const [sheen, setSheen] = useState({ x: 50, y: 50, active: false });
  const [preview, setPreview] = useState(false);
  const { addItem, items } = useQuoteBasket();

  const isAdded = items.some((i) => i.id === product.id);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), spring);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), spring);

  useEffect(() => {
    if (!preview) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreview(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [preview]);

  const fine = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!fine() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px - 0.5);
    my.set(py - 0.5);
    setSheen({ x: px * 100, y: py * 100, active: true });
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
    setSheen((s) => ({ ...s, active: false }));
  };

  const productUrl = `${SITE.url}/catalogue?category=${encodeURIComponent(product.category)}`;
  const imageLine = product.image.startsWith("http") ? `\nImage: ${product.image}` : "";

  const wa = whatsappLink(
    `Hi Mapps Creation, I'm interested in this fabric:\n\n*${product.name}*\nCategory: ${product.category}\nSpec: ${product.spec}\nPrice: ₹${product.price} / ${product.unit}${imageLine}\n\nProduct link: ${productUrl}\n\nPlease share more details and a quotation.`,
  );
  const mailto = `mailto:mappscreation@gmail.com?subject=${encodeURIComponent(
    `Enquiry: ${product.name}`,
  )}&body=${encodeURIComponent(
    `Hello Mapps Creation,\n\nI'd like a quotation for the following fabric:\n\n${product.name}\nCategory: ${product.category}\nSpec: ${product.spec}\nPrice: ₹${product.price} / ${product.unit}${imageLine}\n\nProduct link: ${productUrl}\n\nQuantity required:\nDelivery city:\n\nThank you.`,
  )}`;

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const handleAddQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };

  return (
    <>
      <Reveal index={index}>
        {/* MOBILE HORIZONTAL SPLIT CARD (< 640px) — 1 COLUMN FULL WIDTH */}
        <div
          onClick={() => setPreview(true)}
          className="sm:hidden border-border/80 bg-card overflow-hidden border rounded-xl flex flex-row h-[175px] w-full relative cursor-pointer group shadow-sm transition-all duration-300 active:scale-[0.99]"
        >
          {/* Left Thumbnail (36% width) */}
          <div className="relative w-[36%] shrink-0 h-full overflow-hidden bg-slate-900">
            <img
              src={product.image}
              alt={`${product.name} — ${product.category} fabric from Mapps Creation, Surat`}
              loading="lazy"
              width={600}
              height={600}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="bg-background/90 text-primary label-caps absolute top-2 left-2 px-2 py-0.5 text-[8px] font-bold tracking-wider backdrop-blur rounded">
              {product.category}
            </span>
          </div>

          {/* Right Content Area (64% width) */}
          <div className="flex-1 p-3 flex flex-col justify-between overflow-hidden">
            <div>
              <h3 className="text-foreground font-serif text-base font-bold leading-tight truncate">
                {product.name}
              </h3>
              <p className="text-muted-foreground text-[11px] font-medium mt-0.5 line-clamp-1">
                {product.spec}
              </p>
              <p className="text-primary text-sm font-bold mt-1 tracking-tight">
                ₹{product.price}{" "}
                <span className="text-muted-foreground text-[10px] font-normal">
                  / {product.unit}
                </span>
              </p>
            </div>

            {/* Actions Row — Nothing Hidden */}
            <div className="space-y-1.5 pt-2 border-t border-border/40">
              <button
                type="button"
                onClick={handleAddQuote}
                className={`w-full label-caps py-1.5 px-2 flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-wider border rounded-md transition-all active:scale-95 cursor-pointer ${
                  isAdded
                    ? "bg-[#25D366]/20 text-[#25D366] border-[#25D366]/60 font-bold"
                    : "bg-amber-500/5 border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-slate-950 font-bold"
                }`}
              >
                {isAdded ? (
                  <Check className="h-3.5 w-3.5 shrink-0 text-[#25D366]" />
                ) : (
                  <Plus className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                )}
                <span>{isAdded ? "In Quote List" : "Add to Bulk Quote"}</span>
              </button>
              <div className="grid grid-cols-2 gap-1.5">
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={stop}
                  className="bg-primary text-primary-foreground font-semibold label-caps py-1.5 px-2 flex items-center justify-center gap-1 text-[10px] tracking-wider rounded-md cursor-pointer transition-all active:scale-95 group/enquire relative overflow-hidden"
                >
                  <MessageCircle className="h-3.5 w-3.5 transition-transform duration-500 ease-out group-hover/enquire:scale-110" />
                  <span>Enquire</span>
                </a>
                <a
                  href={mailto}
                  onClick={stop}
                  aria-label={`Email enquiry about ${product.name}`}
                  className="border-border text-muted-foreground hover:text-primary hover:border-primary/60 border py-1.5 px-2 rounded-md flex items-center justify-center gap-1 text-[10px] font-semibold label-caps cursor-pointer transition-colors active:scale-95"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP VERTICAL TILT CARD (>= 640px) */}
        <motion.article
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          onClick={() => setPreview(true)}
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          className="hidden sm:flex border-border bg-card group h-full cursor-pointer overflow-hidden border transition-shadow duration-500 hover:shadow-elevate flex-col justify-between"
        >
          <div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={product.image}
                alt={`${product.name} — ${product.category} fabric from Mapps Creation, Surat`}
                loading="lazy"
                width={1024}
                height={768}
                className="h-full w-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
              />
              {/* Specular sheen tracking the cursor */}
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: sheen.active ? 1 : 0,
                  background: `radial-gradient(circle at ${sheen.x}% ${sheen.y}%, oklch(0.893 0.035 88.5 / 30%), transparent 55%)`,
                }}
              />
              <span className="bg-background/80 text-primary label-caps absolute top-2 left-2 px-2 py-1 text-[9px] tracking-[0.18em] backdrop-blur sm:top-3 sm:left-3 sm:px-3 sm:py-1.5 sm:text-[11px] sm:tracking-[0.28em]">
                {product.category}
              </span>
            </div>
            <div className="p-3 sm:p-5" style={{ transform: "translateZ(20px)" }}>
              <h3 className="text-foreground text-lg sm:text-2xl">{product.name}</h3>
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm">{product.spec}</p>
              <div className="hairline my-3 sm:my-4" />
              <p className="text-primary text-sm font-semibold">
                ₹{product.price}{" "}
                <span className="text-muted-foreground font-normal">/ {product.unit}</span>
              </p>
            </div>
          </div>

          <div className="p-3 pt-0 sm:p-5 sm:pt-0" style={{ transform: "translateZ(20px)" }}>
            <button
              type="button"
              onClick={handleAddQuote}
              className={`mb-2 flex min-h-[38px] w-full items-center justify-center gap-1.5 border text-[10px] font-semibold tracking-wide uppercase whitespace-nowrap transition-all rounded-md sm:min-h-[40px] sm:text-[11px] sm:tracking-wider cursor-pointer active:scale-98 ${
                isAdded
                  ? "bg-[#25D366]/20 text-[#25D366] border-[#25D366]/60 font-bold"
                  : "border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground font-semibold"
              }`}
            >
              {isAdded ? (
                <Check className="h-3.5 w-3.5 shrink-0 text-[#25D366]" />
              ) : (
                <Plus className="h-3.5 w-3.5 shrink-0" />
              )}
              {isAdded ? "Added to Quote" : "Add to Bulk Quote"}
            </button>

            {/* Half-and-Half 50/50 Enquire & Email Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                onClick={stop}
                className="bg-primary text-primary-foreground font-semibold label-caps flex min-h-[44px] items-center justify-center gap-1.5 text-[10px] sm:text-[11px] tracking-wider rounded-md cursor-pointer transition-all active:scale-98 group/enquire relative overflow-hidden"
              >
                <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-500 ease-out group-hover/enquire:scale-110" />
                <span>Enquire</span>
              </a>
              <a
                href={mailto}
                onClick={stop}
                aria-label={`Email enquiry about ${product.name}`}
                className="border-border text-muted-foreground hover:text-primary hover:border-primary/60 flex min-h-[44px] items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-semibold label-caps border rounded-md transition-colors cursor-pointer active:scale-95"
              >
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </motion.article>
      </Reveal>

      {/* PREVIEW POPUP MODAL CARD */}
      <AnimatePresence>
        {preview && (
          <motion.div
            className="fixed inset-0 z-[190] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_UI }}
            onClick={() => setPreview(false)}
          >
            <motion.div
              data-lenis-prevent
              className="border-border/80 bg-[#0A1628] text-foreground relative grid max-h-[90vh] w-full max-w-2xl overflow-y-auto border rounded-2xl shadow-2xl sm:grid-cols-2 overflow-hidden"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.4, ease: EASE_REVEAL }}
              onClick={stop}
            >
              <button
                onClick={() => setPreview(false)}
                aria-label="Close"
                className="border-border/60 bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center border rounded-full backdrop-blur transition-all active:scale-95 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative aspect-[4/3] sm:aspect-auto bg-slate-950">
                <img
                  src={product.image}
                  alt={`${product.name} — ${product.category} fabric from Mapps Creation, Surat`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-center p-6 md:p-8">
                <span className="label-caps text-primary text-xs font-bold">
                  {product.category}
                </span>
                <h3 className="font-serif mt-2 text-2xl md:text-3xl font-bold text-foreground">
                  {product.name}
                </h3>
                <p className="text-muted-foreground mt-1 text-xs md:text-sm">{product.spec}</p>
                <div className="hairline my-4" />
                <p className="text-primary text-xl font-bold">
                  ₹{product.price}{" "}
                  <span className="text-muted-foreground text-xs font-normal">
                    / {product.unit}
                  </span>
                </p>
                <p className="text-muted-foreground/90 mt-2 text-xs leading-relaxed">
                  MOQ depends on the fabric and shade — stock qualities start from a single roll,
                  dyed-to-order shades start from 50 kg per colour.
                </p>

                <button
                  type="button"
                  onClick={handleAddQuote}
                  className={`label-caps mt-5 flex min-h-[46px] w-full items-center justify-center gap-2 border rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-98 ${
                    isAdded
                      ? "bg-[#25D366]/20 text-[#25D366] border-[#25D366]/60"
                      : "border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {isAdded ? (
                    <Check className="h-4 w-4 text-[#25D366]" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {isAdded ? "In Quote List" : "Add to Bulk Quote"}
                </button>

                {/* Half-and-Half 50/50 Enquire & Email Buttons in Popup */}
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-primary-foreground font-semibold label-caps flex min-h-[46px] items-center justify-center gap-1.5 text-xs tracking-wider rounded-xl cursor-pointer transition-all active:scale-98 group/popupEnquire relative overflow-hidden"
                  >
                    <MessageCircle className="h-4 w-4 transition-transform duration-500 ease-out group-hover/popupEnquire:scale-110" />
                    <span>Enquire</span>
                  </a>
                  <a
                    href={mailto}
                    aria-label={`Email enquiry about ${product.name}`}
                    className="border-border text-muted-foreground hover:text-primary hover:border-primary/60 flex min-h-[46px] items-center justify-center gap-1.5 text-xs font-semibold label-caps border rounded-xl transition-colors cursor-pointer active:scale-95"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
