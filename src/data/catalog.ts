import lycra from "@/assets/fabric-lycra.jpg";
import knit from "@/assets/fabric-knit.jpg";
import polyester from "@/assets/fabric-polyester.jpg";
import melange from "@/assets/fabric-melange.jpg";

export const CATEGORIES = [
  "Lycra Fabric",
  "Lycra Knitted Fabric",
  "Polyester Lycra Fabric",
  "Melange Fabric",
  "T-Shirt Fabric",
  "Twill Fabric",
  "Matty Fabric",
  "Other Products",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Product = {
  id: string;
  name: string;
  // A plain string, not `Category` — admins can add custom "Other"
  // categories at product-creation time, so this is open-ended at runtime.
  category: string;
  price: number;
  unit: "kg" | "meter";
  spec: string;
  image: string;
  featured?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "4-Way Stretch Lycra",
    category: "Lycra Fabric",
    price: 320,
    unit: "kg",
    spec: "220 GSM · 4-Way Stretch",
    image: lycra,
  },
  {
    id: "p2",
    name: "Nylon Spandex Lycra",
    category: "Lycra Fabric",
    price: 410,
    unit: "kg",
    spec: "240 GSM · Matte Finish",
    image: lycra,
  },
  {
    id: "p3",
    name: "Sportswear Lycra",
    category: "Lycra Fabric",
    price: 365,
    unit: "kg",
    spec: "190 GSM · Moisture Wicking",
    image: polyester,
  },
  {
    id: "p4",
    name: "Single Jersey Lycra Knit",
    category: "Lycra Knitted Fabric",
    price: 295,
    unit: "kg",
    spec: "180 GSM · Soft Handfeel",
    image: knit,
  },
  {
    id: "p5",
    name: "Rib Knit Lycra",
    category: "Lycra Knitted Fabric",
    price: 340,
    unit: "kg",
    spec: "230 GSM · 2x2 Rib",
    image: knit,
  },
  {
    id: "p6",
    name: "Interlock Knit Lycra",
    category: "Lycra Knitted Fabric",
    price: 355,
    unit: "kg",
    spec: "250 GSM · Dual Face",
    image: knit,
  },
  {
    id: "p7",
    name: "Poly Lycra Stretch",
    category: "Polyester Lycra Fabric",
    price: 210,
    unit: "meter",
    spec: "200 GSM · High Recovery",
    image: polyester,
  },
  {
    id: "p8",
    name: "Poly Lycra Scuba",
    category: "Polyester Lycra Fabric",
    price: 245,
    unit: "meter",
    spec: "280 GSM · Structured",
    image: polyester,
  },
  {
    id: "p9",
    name: "Grey Melange Knit",
    category: "Melange Fabric",
    price: 280,
    unit: "kg",
    spec: "180 GSM · 90/10 Blend",
    image: melange,
  },
  {
    id: "p10",
    name: "Charcoal Melange",
    category: "Melange Fabric",
    price: 300,
    unit: "kg",
    spec: "200 GSM · Combed Yarn",
    image: melange,
  },
  {
    id: "p11",
    name: "Combed Cotton Tee Fabric",
    category: "T-Shirt Fabric",
    price: 330,
    unit: "kg",
    spec: "180 GSM · Bio-Washed",
    image: knit,
  },
  {
    id: "p12",
    name: "Cotton Lycra Tee Fabric",
    category: "T-Shirt Fabric",
    price: 350,
    unit: "kg",
    spec: "200 GSM · 95/5 Cotton-Lycra",
    image: knit,
  },
  {
    id: "p13",
    name: "Cotton Twill",
    category: "Twill Fabric",
    price: 165,
    unit: "meter",
    spec: "240 GSM · 2/1 Twill",
    image: melange,
  },
  {
    id: "p14",
    name: "Stretch Twill",
    category: "Twill Fabric",
    price: 190,
    unit: "meter",
    spec: "260 GSM · 2% Spandex",
    image: melange,
  },
  {
    id: "p15",
    name: "Poly Matty",
    category: "Matty Fabric",
    price: 150,
    unit: "meter",
    spec: "160 GSM · Breathable Weave",
    image: polyester,
  },
  {
    id: "p16",
    name: "Honeycomb Matty",
    category: "Matty Fabric",
    price: 175,
    unit: "meter",
    spec: "180 GSM · Textured",
    image: polyester,
  },
  {
    id: "p17",
    name: "Fleece Knit",
    category: "Other Products",
    price: 310,
    unit: "kg",
    spec: "320 GSM · Brushed Back",
    image: knit,
  },
  {
    id: "p18",
    name: "Rib Collar & Cuff",
    category: "Other Products",
    price: 270,
    unit: "kg",
    spec: "Ready Trims · Dyed to Match",
    image: lycra,
  },
];
