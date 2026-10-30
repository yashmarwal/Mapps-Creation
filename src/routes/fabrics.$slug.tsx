import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, SendHorizontal } from "lucide-react";

import { ProductCard } from "@/components/site/ProductCard";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal, StampHeading } from "@/components/site/motion";
import {
  findFabricPage,
  gsmRange,
  indexablePages,
  MIN_PRODUCTS_TO_INDEX,
} from "@/data/fabricPages";
import { fetchActiveProducts } from "@/hooks/useProducts";
import { breadcrumbSchema, buildPageHead, itemListSchema, whatsappLink } from "@/lib/seo";

export const Route = createFileRoute("/fabrics/$slug")({
  // Fetched in the loader (not a hook) so the products are in the
  // server-rendered HTML that crawlers read.
  loader: async ({ params }) => {
    const page = findFabricPage(params.slug);
    if (!page) throw notFound();
    const all = await fetchActiveProducts();
    return {
      slug: page.slug,
      products: all.filter(page.matches),
      // Other pages that have products, for the "Other fabric types" links.
      liveSlugs: indexablePages(all).map((p) => p.slug),
    };
  },
  head: ({ loaderData }) => {
    const page = loaderData && findFabricPage(loaderData.slug);
    if (!loaderData || !page) return {};
    const path = `/fabrics/${page.slug}`;
    return buildPageHead({
      title: page.title,
      description: page.description,
      path,
      noindex: loaderData.products.length < MIN_PRODUCTS_TO_INDEX,
      jsonLd: [
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Catalogue", path: "/catalogue" },
          { name: page.label, path },
        ]),
        ...(loaderData.products.length > 0 ? [itemListSchema(loaderData.products)] : []),
      ],
    });
  },
  component: FabricPageView,
});

function FabricPageView() {
  const { slug, products, liveSlugs } = Route.useLoaderData();
  const page = findFabricPage(slug)!;
  const gsm = gsmRange(products);
  const units = [...new Set(products.map((p) => (p.unit === "kg" ? "kilogram" : "meter")))];
  const others = liveSlugs.filter((s) => s !== slug).map((s) => findFabricPage(s)!);

  return (
    <div className="pt-28 md:pt-36">
      <section className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <nav aria-label="Breadcrumb" className="label-caps text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            {" / "}
            <Link to="/catalogue" className="hover:text-primary">
              Catalogue
            </Link>
            {" / "}
            <span className="text-primary">{page.label}</span>
          </nav>
          <StampHeading lines={page.h1} className="display-lg mt-4 max-w-3xl" />
          <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed md:text-lg">
            {page.intro}
            {gsm ? ` Current qualities run ${gsm} GSM.` : ""} Shades, GSM and finishes can be
            matched to your specification, and we share swatches of the closest quality before you
            order.
          </p>
          <a
            href={whatsappLink(`Hi Mapps Creation, I need ${page.keyword}. Please share rates.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground label-caps mt-8 inline-flex min-h-[48px] items-center gap-2.5 px-6 text-xs transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
          >
            <SendHorizontal className="h-4 w-4" />
            Enquire on WhatsApp
          </a>
        </Reveal>

        <div className="mt-16">
          <h2 className="display-lg">{page.label} qualities available now</h2>
          {products.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-relaxed md:text-base">
              Qualities in this group are shared on request. Message us your requirement for current
              availability and rates.
            </p>
          )}
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="display-lg">Specifications and ordering</h2>
            <dl className="mt-6 space-y-4 text-sm md:text-base">
              {units.length > 0 && (
                <div>
                  <dt className="label-caps text-primary">Sold by</dt>
                  <dd className="text-muted-foreground mt-1">
                    The {units.join(" or ")}; rates shown are indicative for wholesale quantities.
                  </dd>
                </div>
              )}
              {gsm && (
                <div>
                  <dt className="label-caps text-primary">GSM</dt>
                  <dd className="text-muted-foreground mt-1">{gsm} across current qualities.</dd>
                </div>
              )}
              <div>
                <dt className="label-caps text-primary">Minimum order</dt>
                <dd className="text-muted-foreground mt-1">
                  Depends on the fabric and shade. Stock qualities can start from a single roll;
                  dyed-to-order shades typically start around 300 kg per colour.
                </dd>
              </div>
              <div>
                <dt className="label-caps text-primary">Samples</dt>
                <dd className="text-muted-foreground mt-1">
                  Swatches of the closest matching quality are free of charge; courier is arranged
                  at actuals for outstation buyers.
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="display-lg">How to order</h2>
            <ol className="text-muted-foreground mt-6 list-decimal space-y-3 pl-5 text-sm md:text-base">
              <li>Share fabric type, GSM, shade and quantity on WhatsApp or the enquiry form.</li>
              <li>We share swatches and confirm the rate.</li>
              <li>
                Once the swatch is approved, quality-checked rolls are dispatched from Surat with
                transport documentation.
              </li>
            </ol>
            <p className="mt-6 text-sm md:text-base">
              <Link
                to="/wholesale"
                className="text-primary group inline-flex items-center gap-2 underline underline-offset-4"
              >
                Wholesale partner program
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-16 pb-24 md:pb-32">
          <h2 className="display-lg">Other fabric types</h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {others.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/fabrics/$slug"
                  params={{ slug: p.slug }}
                  className="label-caps border-border hover:border-primary hover:text-primary inline-flex min-h-[44px] items-center rounded-full border px-5 text-xs transition-colors"
                >
                  {p.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/catalogue"
                className="label-caps border-border hover:border-primary hover:text-primary inline-flex min-h-[44px] items-center rounded-full border px-5 text-xs transition-colors"
              >
                Full catalogue
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
