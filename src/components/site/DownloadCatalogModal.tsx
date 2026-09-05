"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, FileText, Loader2, Sparkles, CheckCircle2, X } from "lucide-react";
import { useState } from "react";
import { PRODUCTS } from "@/data/catalog";
import { useProducts } from "@/hooks/useProducts";
import { generateB2bPdfCatalog } from "@/lib/pdfCatalogGenerator";
import { EASE_REVEAL, EASE_UI } from "./motion";

export function DownloadCatalogModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { products: allProducts } = useProducts();
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Use allProducts if available, fallback to seed PRODUCTS
  const activeProductsList = allProducts && allProducts.length > 0 ? allProducts : PRODUCTS;

  // Dynamically extract all unique categories present in active products list
  const dynamicCategories = Array.from(new Set(activeProductsList.map((p) => p.category)));

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      setIsSuccess(false);
      setProgressStatus("Initializing Catalogue...");

      await generateB2bPdfCatalog({
        productsList: activeProductsList,
        selectedCategory: selectedCat,
        onProgress: (status) => setProgressStatus(status),
      });

      setIsGenerating(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
      }, 4000);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setIsGenerating(false);
      setProgressStatus("Failed to generate PDF. Please try again.");
    }
  };

  const productCount =
    selectedCat === "all"
      ? activeProductsList.length
      : activeProductsList.filter((p) => p.category.toLowerCase() === selectedCat.toLowerCase())
          .length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[195] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_UI }}
          onClick={onClose}
        >
          <motion.div
            data-lenis-prevent
            className="border-[var(--gold)]/40 bg-[#0A1628] text-foreground relative w-full max-w-lg overflow-hidden border rounded-2xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.4, ease: EASE_REVEAL }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="border-border/60 bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center border rounded-full backdrop-blur transition-all active:scale-95 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header Badge & Title */}
            <div className="flex items-center gap-2">
              <span className="bg-[var(--gold)]/15 border border-[var(--gold)]/40 text-[var(--gold)] font-semibold uppercase tracking-wider text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Live B2B PDF Exporter
              </span>
            </div>

            <h3 className="font-serif mt-3 text-xl sm:text-2xl font-semibold text-foreground">
              Download Fabric Catalogue
            </h3>

            <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
              Export an official publication-quality B2B Catalogue PDF with GSM specs, wholesale
              rates, MOQ, and GST details.
            </p>

            <div className="hairline my-4" />

            {/* Category Selector Dropdown */}
            <div className="space-y-1.5">
              <label
                htmlFor="catalog-category-select"
                className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center justify-between"
              >
                <span>Select Category Filter</span>
                <span className="text-[var(--gold)] text-[11px] font-medium normal-case tracking-normal">
                  {productCount} {productCount === 1 ? "Product" : "Products"} Included
                </span>
              </label>

              <div className="relative">
                <select
                  id="catalog-category-select"
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  disabled={isGenerating}
                  className="w-full bg-slate-900 border border-border/80 text-foreground text-xs rounded-lg px-3.5 py-3 outline-none focus:border-[var(--gold)] transition-all cursor-pointer appearance-none"
                >
                  <option value="all">
                    📁 All Fabric Categories (Master Catalogue — {activeProductsList.length}{" "}
                    Products)
                  </option>
                  {dynamicCategories.map((cat) => {
                    const count = activeProductsList.filter((p) => p.category === cat).length;
                    return (
                      <option key={cat} value={cat}>
                        🧵 {cat} ({count} {count === 1 ? "Quality" : "Qualities"})
                      </option>
                    );
                  })}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Summary Box */}
            <div className="mt-3.5 bg-slate-950/60 border border-slate-800 rounded-lg p-3 space-y-1 text-[11px] text-muted-foreground">
              <div className="flex justify-between text-foreground/90">
                <span>Catalogue Format</span>
                <span>Vector PDF (A4 Printable)</span>
              </div>
              <div className="flex justify-between">
                <span>Includes</span>
                <span>GSM, Price (₹/kg or ₹/m), MOQ & GSTIN</span>
              </div>
              <div className="flex justify-between">
                <span>Live Data Sync</span>
                <span className="text-emerald-400/90">Auto-Synced with Store</span>
              </div>
            </div>

            {/* Status Feedback */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 rounded-lg p-2.5 text-[11px] flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Catalogue PDF downloaded successfully! Check your downloads folder.
              </motion.div>
            )}

            {/* Action Download Button */}
            <button
              onClick={handleDownload}
              disabled={isGenerating || productCount === 0}
              className="btn-enquire btn-enquire-gold mt-5 w-full !min-h-[46px] !text-xs !rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />{" "}
                    {progressStatus || "Generating PDF..."}
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" /> Download B2B PDF Catalogue
                  </>
                )}
              </span>
            </button>

            <p className="text-[10px] text-muted-foreground/70 text-center mt-3">
              Mapps Creation Surat · Official B2B Wholesale Document
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
