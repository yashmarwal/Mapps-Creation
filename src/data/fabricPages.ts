/**
 * Landing pages per fabric type. A product lands on a page if its category OR
 * its name matches (code only, nothing is written to the database), so a
 * product can appear on several pages, e.g. "Double Matty" in category
 * "Bottomwear and T-Shirt Fabric" shows on the matty, bottomwear and t-shirt
 * pages. Pages with fewer than MIN_PRODUCTS_TO_INDEX matching live products are
 * noindex and left out of the sitemap and links until more products are tagged.
 */
export type Matchable = { name: string; category: string };

export type FabricPage = {
  slug: string;
  /** Footer / link label. */
  label: string;
  title: string;
  description: string;
  h1: string[];
  intro: string;
  /** One primary keyword per page; also used in the WhatsApp message. */
  keyword: string;
  matches: (p: Matchable) => boolean;
};

const intro = (what: string, who: string) =>
  `Mapps Creation supplies ${what} to ${who} across India, dispatched from Surat.`;
const description = (what: string) =>
  `${what} from Surat, with GSM and shade matched to your spec. Wholesale supply across India.`;

export const FABRIC_PAGES: FabricPage[] = [
  {
    slug: "lycra-fabric",
    label: "Lycra Fabric",
    title: "Lycra Fabric Wholesale in Surat | Mapps Creation",
    description: description("Lycra and Lycra knitted fabric"),
    h1: ["Lycra Fabric", "Wholesale in Surat"],
    keyword: "lycra fabric",
    intro: intro(
      "Lycra fabric by wholesale quantity",
      "garment manufacturers, brands and exporters",
    ),
    // "Lycra Knitted Fabric" is folded into this page, not a page of its own.
    matches: (p) =>
      /^lycra( knitted)? fabric$/i.test(p.category.trim()) ||
      (/lycra/i.test(p.name) && !/poly/i.test(p.name)),
  },
  {
    slug: "polyester-lycra-fabric",
    label: "Polyester Lycra Fabric",
    title: "Polyester Lycra Fabric Wholesale in Surat | Mapps",
    description: description("Polyester-Lycra fabric"),
    h1: ["Polyester Lycra Fabric", "Wholesale in Surat"],
    keyword: "polyester lycra fabric",
    intro: intro(
      "polyester-Lycra fabric by wholesale quantity",
      "garment manufacturers and exporters",
    ),
    matches: (p) =>
      /^polyester lycra fabric$/i.test(p.category.trim()) ||
      /poly(ester)?[\s-]*lycra/i.test(p.name),
  },
  {
    slug: "melange-fabric",
    label: "Melange Fabric",
    title: "Melange Fabric Wholesale in Surat | Mapps Creation",
    description: description("Melange fabric"),
    h1: ["Melange Fabric", "Wholesale in Surat"],
    keyword: "melange fabric",
    intro: intro("melange fabric by wholesale quantity", "garment manufacturers and brands"),
    matches: (p) => /^melange fabric$/i.test(p.category.trim()) || /melange/i.test(p.name),
  },
  {
    slug: "t-shirt-fabric",
    label: "T-Shirt Fabric",
    title: "T-Shirt Fabric Wholesale in Surat | Mapps Creation",
    description: description("Knitted t-shirt fabric sold by the kg"),
    h1: ["T-Shirt Fabric", "Wholesale in Surat"],
    keyword: "t-shirt fabric",
    intro: intro(
      "knitted t-shirt fabric by the kilogram",
      "garment manufacturers, brands and exporters",
    ),
    matches: (p) => /t-?shirt/i.test(p.category) || /t-?shirt|\btee\b/i.test(p.name),
  },
  {
    slug: "twill-fabric",
    label: "Twill Fabric",
    title: "Twill Fabric Wholesale in Surat | Mapps Creation",
    description: description("Twill fabric"),
    h1: ["Twill Fabric", "Wholesale in Surat"],
    keyword: "twill fabric",
    intro: intro("twill fabric by wholesale quantity", "garment manufacturers and brands"),
    matches: (p) => /^twill fabric$/i.test(p.category.trim()) || /twill/i.test(p.name),
  },
  {
    slug: "matty-fabric",
    label: "Matty Fabric",
    title: "Matty Fabric Wholesale in Surat | Mapps Creation",
    description: description("Matty fabric"),
    h1: ["Matty Fabric", "Wholesale in Surat"],
    keyword: "matty fabric",
    intro: intro("matty fabric by wholesale quantity", "garment manufacturers and brands"),
    matches: (p) => /^matty fabric$/i.test(p.category.trim()) || /matty/i.test(p.name),
  },
  // Secondary pages: they have real products today, and their keywords differ from the above.
  {
    slug: "bottomwear-fabric",
    label: "Bottomwear Fabric",
    title: "Bottomwear Fabric Wholesale in Surat | Mapps Creation",
    description: description("Knitted bottomwear (lower) fabric sold by the kg"),
    h1: ["Bottomwear Fabric", "Wholesale in Surat"],
    keyword: "bottomwear fabric",
    intro: intro(
      "knitted bottomwear fabric, often called lower fabric, by the kilogram",
      "garment manufacturers and brands",
    ),
    matches: (p) => /bottom/i.test(p.category),
  },
  {
    slug: "co-ord-set-fabric",
    label: "Co-ord Set Fabric",
    title: "Co-ord Set Fabric Wholesale in Surat | Mapps Creation",
    description: description("Knitted co-ord set fabric sold by the kg"),
    h1: ["Co-ord Set Fabric", "Wholesale in Surat"],
    keyword: "co-ord set fabric",
    intro: intro("knitted co-ord set fabric by the kilogram", "garment manufacturers and brands"),
    matches: (p) => /co-?ord|cord set/i.test(p.category),
  },
];

export function findFabricPage(slug: string) {
  return FABRIC_PAGES.find((p) => p.slug === slug);
}

/** A fabric page with fewer live products than this is thin: noindex, unlisted and unlinked. */
export const MIN_PRODUCTS_TO_INDEX = 3;

/** Pages with enough live products: the only ones that are linked, listed and indexable. */
export function indexablePages(products: Matchable[]) {
  return FABRIC_PAGES.filter(
    (page) => products.filter(page.matches).length >= MIN_PRODUCTS_TO_INDEX,
  );
}

/** "180-230" style range pulled from each product's spec text, or null. */
export function gsmRange(products: { spec: string }[]) {
  const values = products
    .map((p) => Number(/(\d{2,3})\s*GSM/i.exec(p.spec)?.[1]))
    .filter((n) => n > 0);
  if (values.length === 0) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? `${min}` : `${min}-${max}`;
}
