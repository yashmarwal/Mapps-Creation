import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/data/catalog";
import { ProductCard, ProductCardSkeleton } from "@/components/site/ProductCard";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal } from "@/components/site/motion";
import { useProducts } from "@/hooks/useProducts";
import { breadcrumbSchema, buildPageHead, itemListSchema } from "@/lib/seo";
import { DownloadCatalogModal } from "@/components/site/DownloadCatalogModal";

type Search = { category?: string };

export const Route = createFileRoute("/catalogue")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const category = search["category"];
    return typeof category === "string" && category.trim() ? { category } : {};
  },
  head: () =>
    buildPageHead({
      title: "Fabric Catalogue — Lycra, Knit & Polyester Lycra | Mapps Creation",
      description:
        "Browse wholesale Lycra fabric, lycra knitted fabric, polyester lycra, melange, t-shirt, twill and matty fabrics available for bulk supply from Surat.",
      path: "/catalogue",
      jsonLd: [
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Catalogue", path: "/catalogue" },
        ]),
        itemListSchema(PRODUCTS),
      ],
    }),
  component: Catalogue,
});

function Catalogue() {
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/catalogue" });
  const { products: allProducts, loading: productsLoading } = useProducts();
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const products = category ? allProducts.filter((p) => p.category === category) : allProducts;

  const present = new Set(allProducts.map((p) => p.category));
  const knownInUse = CATEGORIES.filter((c) => present.has(c));
  const customInUse = [...present]
    .filter((c) => !(CATEGORIES as readonly string[]).includes(c))
    .sort((a, b) => a.localeCompare(b));
  const categoriesInUse = [...knownInUse, ...customInUse];

  const setCategory = (next?: string) =>
    navigate({ search: () => (next ? { category: next } : {}) });

  return (
    <div className="pt-28 md:pt-36">
      <DownloadCatalogModal open={downloadModalOpen} onClose={() => setDownloadModalOpen(false)} />
      <section className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="label-caps text-primary">Catalogue</p>
              <h1 className="display-lg mt-4 max-w-3xl">
                Knitted &amp; stretch fabrics for sportswear, streetwear and knitwear
              </h1>
            </div>

            <button
              onClick={() => setDownloadModalOpen(true)}
              className="btn-enquire btn-enquire-gold !min-h-[48px] !text-xs !px-5 shrink-0"
            >
              <span>
                <Download className="h-4 w-4" /> Download PDF Catalogue
              </span>
            </button>
          </div>
          <p className="text-muted-foreground mt-5 max-w-2xl text-sm leading-relaxed md:text-base">
            Indicative rates for wholesale quantities. Shades, GSM and finishes can be matched to
            your specification — message us for a firm quotation.
          </p>
        </Reveal>

        <Reveal className="mt-10">
          {/* Mobile: a single dropdown — too many long category names to
              show as pills without wrapping into a cluttered grid. */}
          <div className="relative md:hidden">
            <label htmlFor="category-filter" className="sr-only">
              Filter by category
            </label>
            <select
              id="category-filter"
              value={category ?? ""}
              onChange={(e) => setCategory(e.target.value || undefined)}
              className="label-caps border-border bg-card text-foreground focus:border-primary min-h-[48px] w-full appearance-none border px-4 pr-11 outline-none transition-colors"
            >
              <option value="">All Fabrics</option>
              {categoriesInUse.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2" />
          </div>

          {/* Desktop: full pill row — plenty of width, no wrapping issue. */}
          <div className="hidden flex-wrap gap-2 md:flex">
            <button
              onClick={() => setCategory(undefined)}
              className={`label-caps min-h-[40px] px-4 rounded-full border transition-all duration-300 active:scale-95 cursor-pointer text-xs ${
                !category
                  ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                  : "border-border/80 text-muted-foreground hover:text-primary hover:border-primary/60 bg-card/60"
              }`}
            >
              All Fabrics
            </button>
            {categoriesInUse.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`label-caps min-h-[40px] px-4 rounded-full border transition-all duration-300 active:scale-95 cursor-pointer text-xs ${
                  category === item
                    ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                    : "border-border/80 text-muted-foreground hover:text-primary hover:border-primary/60 bg-card/60"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 pb-24 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 md:pb-32">
          {productsLoading
            ? Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
