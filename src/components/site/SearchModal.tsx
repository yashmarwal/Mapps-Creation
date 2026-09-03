"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Filter,
  Mail,
  Plus,
  Search,
  SendHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CATEGORIES, type Product } from "@/data/catalog";
import { useProducts } from "@/hooks/useProducts";
import { useQuoteBasket } from "@/hooks/useQuoteBasket";
import { SITE, whatsappLink } from "@/lib/seo";
import { EASE_REVEAL, EASE_UI } from "./motion";

const MAX_QUICK_SEARCHES = 6;

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem, items } = useQuoteBasket();
  // Live/admin-managed products (falls back to the seed catalogue if
  // Supabase isn't configured) — search must reflect the same data as the
  // rest of the site, not the static seed list.
  const { products: allProducts } = useProducts();

  // Known categories that actually have a product, plus any custom "Other"
  // category an admin has added — same approach as the Catalogue page.
  const categoriesInUse = useMemo(() => {
    const present = new Set(allProducts.map((p) => p.category));
    const known = CATEGORIES.filter((c) => present.has(c));
    const custom = [...present]
      .filter((c) => !(CATEGORIES as readonly string[]).includes(c))
      .sort((a, b) => a.localeCompare(b));
    return [...known, ...custom];
  }, [allProducts]);

  // Quick-search chips must be real product names that actually exist —
  // showing made-up example terms means some suggestions return zero
  // results, which is exactly the bug this replaces. One name per category
  // first (for variety), then fill any remaining slots.
  const popularSearches = useMemo(() => {
    const picks: string[] = [];
    const seenCategories = new Set<string>();
    for (const p of allProducts) {
      if (picks.length >= MAX_QUICK_SEARCHES) break;
      if (seenCategories.has(p.category)) continue;
      seenCategories.add(p.category);
      picks.push(p.name);
    }
    if (picks.length < MAX_QUICK_SEARCHES) {
      for (const p of allProducts) {
        if (picks.length >= MAX_QUICK_SEARCHES) break;
        if (!picks.includes(p.name)) picks.push(p.name);
      }
    }
    return picks;
  }, [allProducts]);

  // Focus input automatically on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(timer);
    }
    document.body.style.overflow = "";
    setQuery("");
    setSelectedCategory("All");
    return undefined;
  }, [isOpen]);

  // Global Esc key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter products by query & category
  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allProducts.filter((p: Product) => {
      const matchCat =
        selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase();
      if (!matchCat) return false;
      if (!q) return true;

      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.spec.toLowerCase().includes(q)
      );
    });
  }, [query, selectedCategory, allProducts]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-lenis-prevent
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-2xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_UI }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full h-[92vh] sm:h-auto sm:max-h-[85vh] sm:max-w-3xl bg-[#0A1628]/98 backdrop-blur-3xl border-t sm:border border-[var(--gold)]/40 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 100, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE_REVEAL }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Bottom Sheet Pull Indicator Handle */}
            <div className="w-12 h-1 bg-slate-700/80 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

            {/* Search Header Bar */}
            <div className="relative p-3.5 sm:p-6 pb-3 border-b border-border/60 bg-slate-950/80 shrink-0">
              <div className="flex items-center justify-between mb-2 sm:hidden">
                <span className="editorial-tag !text-[10px]">SEARCH FABRICS</span>
                <button
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="relative flex items-center bg-slate-900/90 border border-primary/30 rounded-xl sm:rounded-2xl px-3.5 py-2.5 sm:py-3 shadow-inner">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mr-2.5" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Lycra, GSM, category, T-shirt fabric..."
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/70 text-xs sm:text-base outline-none font-sans"
                />
                {query ? (
                  <button
                    onClick={() => setQuery("")}
                    className="text-muted-foreground hover:text-foreground text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 mr-1.5 cursor-pointer shrink-0"
                  >
                    Clear
                  </button>
                ) : null}
                <button
                  onClick={onClose}
                  className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-muted-foreground hover:text-foreground transition-all cursor-pointer shrink-0"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Category Filter Pills */}
            <div
              className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto px-3.5 sm:px-6 py-2.5 border-b border-border/40 bg-slate-950/40 shrink-0"
              style={{ touchAction: "pan-x", scrollbarWidth: "none" }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 mr-1 flex items-center gap-1">
                <Filter className="h-3 w-3 text-primary" /> Category:
              </span>
              <button
                onClick={() => setSelectedCategory("All")}
                className={`inline-flex min-h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-3 text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  selectedCategory === "All"
                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                    : "bg-slate-900/80 text-muted-foreground hover:text-foreground border border-border/60"
                }`}
              >
                All ({allProducts.length})
              </button>
              {categoriesInUse.map((catName) => (
                <button
                  key={catName}
                  onClick={() => setSelectedCategory(catName)}
                  className={`inline-flex min-h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-3 text-xs font-medium tracking-wide transition-all cursor-pointer ${
                    selectedCategory === catName
                      ? "bg-primary text-primary-foreground font-bold shadow-sm"
                      : "bg-slate-900/80 text-muted-foreground hover:text-foreground border border-border/60"
                  }`}
                >
                  {catName}
                </button>
              ))}
            </div>

            {/* Popular Search Suggestions (when input query is empty) — real
                product names only, so every suggestion actually has a result */}
            {!query && popularSearches.length > 0 && (
              <div
                className="flex items-center gap-1.5 overflow-x-auto px-3.5 sm:px-6 py-2.5 bg-slate-950/20 border-b border-border/40 shrink-0"
                style={{ touchAction: "pan-x", scrollbarWidth: "none" }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1 mr-1 shrink-0">
                  <Sparkles className="h-3 w-3" /> Quick:
                </span>
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-[11px] sm:text-xs text-muted-foreground hover:text-foreground border border-slate-800 transition-all cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}

            {/* Search Results List Container (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-3">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product: Product) => {
                  const isAdded = items.some((i) => i.id === product.id);
                  const wa = whatsappLink(
                    `Hi Mapps Creation, I am inquiring about fabric "${product.name}" (${product.spec}, ₹${product.price}/${product.unit}). Please share roll availability.`,
                  );

                  return (
                    <div
                      key={product.id}
                      className="p-3 sm:p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 transition-all space-y-3 group shadow-md"
                    >
                      {/* Top Row: Thumbnail & Info */}
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-slate-950">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-foreground text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                              {product.name}
                            </h4>
                            <span className="text-primary font-bold text-xs sm:text-sm shrink-0">
                              ₹{product.price}/{product.unit}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              {product.category}
                            </span>
                            <span className="text-xs text-muted-foreground font-sans">
                              {product.spec}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Full Width 50/50 Dual Action CTA Buttons */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-800/60">
                        <button
                          type="button"
                          onClick={() => addItem(product)}
                          className={`w-full py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 ${
                            isAdded
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                              : "bg-slate-950 border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span>In Quote</span>
                            </>
                          ) : (
                            <>
                              <Plus className="h-3 w-3" />
                              <span>Add Quote</span>
                            </>
                          )}
                        </button>

                        <a
                          href={wa}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={onClose}
                          className="btn-enquire w-full !py-1.5 !px-2 !text-[10px] !rounded-lg"
                        >
                          <span>
                            <SendHorizontal className="h-3 w-3" />
                            <span>Enquire</span>
                          </span>
                        </a>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 px-4">
                  <Search className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <h4 className="text-foreground text-base sm:text-lg font-medium">
                    {query.trim() ? `No fabrics found for "${query.trim()}"` : "No fabrics found"}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    It may not be listed yet — message us directly and we'll check current stock and
                    mill options for you.
                  </p>
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xs mx-auto">
                    <a
                      href={whatsappLink(
                        query.trim()
                          ? `Hi Mapps Creation, I'm looking for "${query.trim()}" but couldn't find it in the online catalogue. Do you have this or something similar in stock?`
                          : "Hi Mapps Creation, I'd like help finding a specific fabric that's not in your online catalogue.",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="btn-enquire w-full !text-xs !min-h-[42px]"
                    >
                      <span>
                        <SendHorizontal className="h-3.5 w-3.5" /> WhatsApp Us
                      </span>
                    </a>
                    <a
                      href={`mailto:${SITE.email}?subject=${encodeURIComponent(
                        `Fabric enquiry: ${query.trim() || "Specific requirement"}`,
                      )}&body=${encodeURIComponent(
                        `Hello Mapps Creation,\n\nI'm looking for "${query.trim() || "a specific fabric"}" which I couldn't find in your online catalogue. Could you let me know if you have this or something similar available?\n\nThank you.`,
                      )}`}
                      onClick={onClose}
                      className="btn-enquire btn-enquire-navy w-full !text-xs !min-h-[42px]"
                    >
                      <span>
                        <Mail className="h-3.5 w-3.5" /> Email Us
                      </span>
                    </a>
                  </div>
                  <Link
                    to="/catalogue"
                    onClick={onClose}
                    className="mt-4 inline-flex items-center gap-2 text-xs text-primary hover:underline font-semibold uppercase tracking-wider"
                  >
                    View Full Catalogue <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Bottom Footer Bar */}
            <div className="px-3.5 sm:px-6 py-3 bg-slate-950 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground shrink-0">
              <span>
                Found <strong className="text-foreground">{filteredProducts.length}</strong> fabrics
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-primary sm:hidden cursor-pointer"
              >
                Done
              </button>
              <div className="hidden sm:flex items-center gap-2">
                <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-muted-foreground">
                  ESC to close
                </kbd>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
