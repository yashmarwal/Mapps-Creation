"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Mail, MessageCircle, X } from "lucide-react";
import { useRef, useState } from "react";
import { EASE_REVEAL, EASE_UI, Reveal } from "./motion";
import type { Product } from "@/data/catalog";
import { SITE, whatsappLink } from "@/lib/seo";

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const [sheen, setSheen] = useState({ x: 50, y: 50, active: false });
  const [preview, setPreview] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), spring);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), spring);

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

  return (
    <>
      <Reveal index={index}>
        <motion.article
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          onClick={() => setPreview(true)}
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          className="border-border bg-card group h-full cursor-pointer overflow-hidden border transition-shadow duration-500 hover:shadow-elevate"
        >
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
            <p className="text-primary text-sm">
              ₹{product.price} <span className="text-muted-foreground">/ {product.unit}</span>
            </p>
            <div className="mt-3 flex gap-1.5 sm:mt-5 sm:gap-2">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                onClick={stop}
                className="bg-primary text-primary-foreground label-caps flex min-h-[44px] flex-1 items-center justify-center gap-1.5 text-[10px] transition-opacity duration-300 hover:opacity-90 sm:min-h-[48px] sm:gap-2 sm:text-[11px]"
              >
                <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Enquire
              </a>
              <a
                href={mailto}
                onClick={stop}
                aria-label={`Email enquiry about ${product.name}`}
                className="border-border text-muted-foreground hover:text-primary hover:border-primary/60 flex min-h-[44px] w-10 items-center justify-center border transition-colors sm:min-h-[48px] sm:w-12"
              >
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
            </div>
          </div>
        </motion.article>
      </Reveal>

      <AnimatePresence>
        {preview && (
          <motion.div
            className="fixed inset-0 z-[190] flex items-center justify-center bg-black/85 p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_UI }}
            onClick={() => setPreview(false)}
          >
            <motion.div
              className="border-border bg-card relative grid max-h-[90vh] w-full max-w-2xl overflow-y-auto border sm:grid-cols-2"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.4, ease: EASE_REVEAL }}
              onClick={stop}
            >
              <button
                onClick={() => setPreview(false)}
                aria-label="Close"
                className="border-border bg-background text-foreground absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center border"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative aspect-[4/3] sm:aspect-auto">
                <img
                  src={product.image}
                  alt={`${product.name} — ${product.category} fabric from Mapps Creation, Surat`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-center p-6 md:p-8">
                <p className="label-caps text-primary">{product.category}</p>
                <h3 className="font-display mt-3 text-3xl">{product.name}</h3>
                <p className="text-muted-foreground mt-2 text-sm">{product.spec}</p>
                <div className="hairline my-5" />
                <p className="text-primary text-lg">
                  ₹{product.price}{" "}
                  <span className="text-muted-foreground text-sm">/ {product.unit}</span>
                </p>
                <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
                  MOQ depends on the fabric and shade — stock qualities can start from a single
                  roll, dyed-to-order shades typically start around 50 kg per colour.
                </p>
                <div className="mt-6 flex gap-2">
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-primary-foreground label-caps flex min-h-[48px] flex-1 items-center justify-center gap-2 transition-opacity duration-300 hover:opacity-90"
                  >
                    <MessageCircle className="h-4 w-4" /> Enquire
                  </a>
                  <a
                    href={mailto}
                    aria-label={`Email enquiry about ${product.name}`}
                    className="border-border text-muted-foreground hover:text-primary hover:border-primary/60 flex min-h-[48px] w-12 items-center justify-center border transition-colors"
                  >
                    <Mail className="h-4 w-4" />
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
