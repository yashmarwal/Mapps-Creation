"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Zap,
  ShoppingBag,
  SendHorizontal,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuoteBasket } from "@/hooks/useQuoteBasket";
import { PRODUCTS } from "@/data/catalog";

type ApplicationCategory = "all" | "sportswear" | "streetwear" | "corporate" | "winterwear";

interface FabricApplication {
  id: string;
  title: string;
  category: ApplicationCategory;
  categoryName: string;
  fabricName: string;
  productId: string;
  spec: string;
  yieldInfo: string;
  description: string;
  highlights: string[];
  gradient: string;
  imageEmoji: string;
}

const APPLICATIONS: FabricApplication[] = [
  {
    id: "app-1",
    title: "High-Performance Gym Leggings",
    category: "sportswear",
    categoryName: "Sportswear & Activewear",
    fabricName: "4-Way Stretch Lycra",
    productId: "p1",
    spec: "220 GSM · 4-Way Stretch · Squat-Proof",
    yieldInfo: "~3.2 Pairs per Kg",
    description:
      "Engineered for zero-transparency performance wear with 360-degree muscular compression and moisture management.",
    highlights: ["Squat-Proof Opacity", "High Elastic Recovery", "Anti-Chafing Smoothness"],
    gradient: "from-amber-500/20 via-slate-900 to-slate-950",
    imageEmoji: "🧘‍♀️",
  },
  {
    id: "app-2",
    title: "Oversized Heavyweight Streetwear Tees",
    category: "streetwear",
    categoryName: "Streetwear & Casuals",
    fabricName: "Cotton Lycra Tee Fabric",
    productId: "p12",
    spec: "200 GSM · 95/5 Cotton-Lycra · Bio-Washed",
    yieldInfo: "~3.8 Oversized Tees per Kg",
    description:
      "Delivers that modern luxury drape with structured drop-shoulders, rich color depth, and zero collar deformation.",
    highlights: ["Silky Bio-Wash Handfeel", "Drop-Shoulder Stability", "Anti-Pilling Finish"],
    gradient: "from-blue-500/20 via-slate-900 to-slate-950",
    imageEmoji: "👕",
  },
  {
    id: "app-3",
    title: "Corporate & Hospitality Polo Shirts",
    category: "corporate",
    categoryName: "Corporate & Uniforms",
    fabricName: "Honeycomb & Poly Matty",
    productId: "p16",
    spec: "180 GSM · Breathable Weave · Wrinkle Resistant",
    yieldInfo: "~4.5 Meters per Shirt",
    description:
      "Durable textured knit fabric crafted for high-frequency wash cycles, company branding, and crisp collar cuffs.",
    highlights: ["Breathe-Easy Structure", "Fast-Drying Yarn", "Ideal for Embroidery"],
    gradient: "from-emerald-500/20 via-slate-900 to-slate-950",
    imageEmoji: "💼",
  },
  {
    id: "app-4",
    title: "Luxury Fleece Hoodies & Sweatpants",
    category: "winterwear",
    categoryName: "Winter & Heavy Knits",
    fabricName: "Fleece Knit Fabric",
    productId: "p17",
    spec: "320 GSM · Brushed Fleece Back · Thermal Wrap",
    yieldInfo: "~1.4 Sets per Kg",
    description:
      "Ultra-plush interior brushed lining with a smooth anti-dust exterior face, perfect for premium winter collections.",
    highlights: ["Plush Insulating Fleece", "Zero Shrinkage Batching", "Heavyweight Handfeel"],
    gradient: "from-purple-500/20 via-slate-900 to-slate-950",
    imageEmoji: "🧥",
  },
  {
    id: "app-5",
    title: "Slim-Fit Stretch Formal Trousers",
    category: "corporate",
    categoryName: "Corporate & Workwear",
    fabricName: "Stretch Twill Fabric",
    productId: "p14",
    spec: "260 GSM · 2% Spandex Blend · Diagonal Weave",
    yieldInfo: "~1.3 Meters per Trouser",
    description:
      "Offers structured executive tailoring with comfortable 2-way flex mobility for all-day office comfort.",
    highlights: ["Wrinkle-Free Crease", "Comfort Flex Spandex", "Sharp Tailoring Finish"],
    gradient: "from-yellow-500/20 via-slate-900 to-slate-950",
    imageEmoji: "👖",
  },
  {
    id: "app-6",
    title: "Athletic Compression Sets & Tracksuits",
    category: "sportswear",
    categoryName: "Sportswear & Athleisure",
    fabricName: "Poly Lycra Scuba",
    productId: "p8",
    spec: "280 GSM · Structured Dual-Face · Quick Dry",
    yieldInfo: "~1.8 Meters per Jacket",
    description:
      "Smooth architectural drape ideal for technical outer layers, track jackets, and form-fitting athleisure sets.",
    highlights: ["Double-Knit Structure", "Shape-Retaining Bounce", "Weather Resistant"],
    gradient: "from-cyan-500/20 via-slate-900 to-slate-950",
    imageEmoji: "🏃‍♂️",
  },
];

export function FabricCraftingShowcase() {
  const [activeCategory, setActiveCategory] = useState<ApplicationCategory>("all");
  const { addItem } = useQuoteBasket();
  const [addedId, setAddedId] = useState<string | null>(null);

  const filteredApps = APPLICATIONS.filter(
    (app) => activeCategory === "all" || app.category === activeCategory,
  );

  const handleRequestSample = (app: FabricApplication) => {
    const product = PRODUCTS.find((p) => p.id === app.productId) || {
      id: app.productId,
      name: app.fabricName,
      category: app.categoryName,
      price: 320,
      unit: "kg" as const,
      spec: app.spec,
      image: "",
    };
    addItem(product);
    setAddedId(app.id);
    setTimeout(() => setAddedId(null), 2500);
  };

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-950">
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-widest uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Garment Creation Possibilities</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-100 mb-4">
            What Can You Build With{" "}
            <span className="text-[var(--gold)] italic font-normal">Our Fabrics?</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From high-performance gym compression leggings to heavyweight streetwear tees, explore
            how Surat's finest Lycra & knitted rolls transform into high-margin end garments.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
            {[
              { id: "all", label: "All Applications" },
              { id: "sportswear", label: "🏋️ Sportswear & Gymwear" },
              { id: "streetwear", label: "👕 Streetwear & Casuals" },
              { id: "corporate", label: "💼 Corporate & Workwear" },
              { id: "winterwear", label: "🧥 Winterwear & Fleece" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as ApplicationCategory)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 scale-105"
                    : "bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-amber-500/40 hover:text-slate-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Garment Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {filteredApps.map((app) => {
              const isJustAdded = addedId === app.id;
              return (
                <div
                  key={app.id}
                  className="group relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Banner / Emoji Badge */}
                  <div
                    className={`p-6 bg-gradient-to-br ${app.gradient} border-b border-slate-800/60 relative`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{app.imageEmoji}</span>
                      <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-700/60 text-amber-400 font-semibold">
                        {app.yieldInfo}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-widest block mb-1">
                      {app.categoryName}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-slate-100 font-medium group-hover:text-amber-300 transition-colors">
                      {app.title}
                    </h3>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Recommended Fabric Tag */}
                      <div className="mb-4 p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase text-slate-400 tracking-wider block">
                            Recommended Fabric
                          </span>
                          <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-amber-400" />
                            {app.fabricName}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                          {app.spec.split("·")[0]}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        {app.description}
                      </p>

                      {/* Key Fabric Highlights */}
                      <ul className="space-y-2 mb-6">
                        {app.highlights.map((h, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
                      <button
                        onClick={() => handleRequestSample(app)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                          isJustAdded
                            ? "bg-emerald-500 text-slate-950"
                            : "bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md shadow-amber-500/10 active:scale-95"
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> Added to Swatches!
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" /> Get Swatch Sample
                          </>
                        )}
                      </button>

                      <Link
                        to="/contact"
                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        title="Enquire Wholesale"
                      >
                        <SendHorizontal className="w-3.5 h-3.5 text-amber-400" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA Banner */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-serif text-2xl font-light text-slate-100 mb-2">
              Have a Custom Garment Concept or GSM Requirement?
            </h4>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              Our Surat textile masters customize knitting stretch %, GSM thickness, and custom yarn
              dye matching for fashion brands & exporters worldwide.
            </p>
          </div>
          <Link
            to="/contact"
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 shrink-0 active:scale-95 transition-all"
          >
            <span>Consult Our Textile Engineers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
