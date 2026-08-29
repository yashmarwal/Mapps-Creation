import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CATEGORIES, PRODUCTS } from "@/data/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/motion";
import { useProducts } from "@/hooks/useProducts";
import { breadcrumbSchema, buildPageHead, itemListSchema } from "@/lib/seo";

type Search = { category?: string };

export const Route = createFileRoute("/catalogue")({
  // Any non-empty string is accepted here — categories aren't limited to the
  // static CATEGORIES list, since admins can add custom "Other" categories.
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
  const { products: allProducts } = useProducts();
  const products = category ? allProducts.filter((p) => p.category === category) : allProducts;

  // Only show a filter for categories that actually have a product in them —
  // known categories first (in their usual order), then any custom "Other"
  // categories an admin has typed in, so those are filterable too.
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
      <section className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <p className="label-caps text-primary">Catalogue</p>
          <h1 className="display-lg mt-4 max-w-3xl">
            Knitted &amp; stretch fabrics for sportswear, streetwear and knitwear
          </h1>
          <p className="text-muted-foreground mt-5 max-w-2xl text-sm leading-relaxed md:text-base">
            Indicative rates for wholesale quantities. Shades, GSM and finishes can be matched to
            your specification — message us for a firm quotation.
          </p>
        </Reveal>

        <Reveal className="mt-10">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory(undefined)}
              className={`label-caps min-h-[44px] border px-4 transition-colors duration-300 ${
                !category
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-primary hover:border-primary/60"
              }`}
            >
              All Fabrics
            </button>
            {categoriesInUse.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`label-caps min-h-[44px] border px-4 transition-colors duration-300 ${
                  category === item
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-primary hover:border-primary/60"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 pb-24 sm:gap-6 lg:grid-cols-3 md:pb-32">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
