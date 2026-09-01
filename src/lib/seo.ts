export const SITE = {
  name: "Mapps Creation",
  tagline: "Knitting Dreams Into Reality",
  city: "Surat, Gujarat",
  phone: "+917046009423",
  phoneDisplay: "+91 70460 09423",
  email: "mappscreation@gmail.com",
  url: "https://mappscreation.com",
  ogImage: "https://mappscreation.com/og-image.png",
} as const;

export const WHATSAPP_BASE = `https://wa.me/${SITE.phone.replace("+", "")}`;

export function whatsappLink(message: string) {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
}

type HeadInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

/** One-call head builder: title, description, canonical, OG, Twitter, JSON-LD. */
export function buildPageHead({
  title,
  description,
  path,
  image = SITE.ogImage,
  type = "website",
  jsonLd,
}: HeadInput) {
  const canonical = `${SITE.url}${path}`;
  const meta = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: canonical },
    { property: "og:locale", content: "en_IN" },
    { property: "og:site_name", content: SITE.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];

  if (image) {
    meta.push(
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: image },
    );
  }

  return {
    meta,
    links: [{ rel: "canonical", href: canonical }],
    ...(jsonLd
      ? { scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }] }
      : {}),
  };
}

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE.name,
  slogan: SITE.tagline,
  url: SITE.url,
  logo: `${SITE.url}/apple-touch-icon.png`,
  image: SITE.ogImage,
  telephone: SITE.phoneDisplay,
  foundingDate: "2024",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Surat",
    addressRegion: "Gujarat",
    addressCountry: "IN",
  },
  description:
    "Wholesale trader and distributor of Lycra, knitted and polyester-lycra fabrics for garment manufacturing, based in Surat, Gujarat.",
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE.name,
  url: SITE.url,
  publisher: { "@id": ORG_ID },
  inLanguage: "en-IN",
};

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function serviceSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE.url}${path}#service`,
    name,
    description,
    url: `${SITE.url}${path}`,
    provider: { "@id": ORG_ID },
    serviceType: "Wholesale Fabric Supply",
    areaServed: "IN",
    audience: {
      "@type": "Audience",
      audienceType: "Garment manufacturers, exporters, wholesale buyers",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Fabric Catalogue",
      url: `${SITE.url}/catalogue`,
    },
  };
}

export function itemListSchema(
  products: { name: string; category: string; price: number; unit: "kg" | "meter" }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: product.name,
        category: product.category,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "INR",
          unitCode: product.unit === "kg" ? "KGM" : "MTR",
          seller: { "@id": ORG_ID },
        },
      },
    })),
  };
}
