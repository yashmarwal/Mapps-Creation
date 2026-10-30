// Regenerates public/sitemap.xml. Run `npm run sitemap` after adding or editing a page.
// lastmod = the date of the last commit touching the page's source files, or
// today if those files have uncommitted changes. It is never the build date.
// Fabric pages are listed only if at least 3 live products match them (a
// read-only query with the public anon key from .env); empty pages are noindex.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

import { indexablePages } from "../src/data/fabricPages.ts";

const SITE = "https://www.mappscreation.in";
const FABRIC_FILES = ["src/routes/fabrics.$slug.tsx", "src/data/fabricPages.ts"];

const env = Object.fromEntries(
  readFileSync(new URL("../.env", import.meta.url), "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.includes("=") && !line.startsWith("#"))
    .map((line) => {
      const i = line.indexOf("=");
      return [
        line.slice(0, i).trim(),
        line
          .slice(i + 1)
          .trim()
          .replace(/^"|"$/g, ""),
      ];
    }),
);
const key = env.VITE_SUPABASE_ANON_KEY;
const res = await fetch(
  `${env.VITE_SUPABASE_URL}/rest/v1/products?select=name,category&is_active=eq.true`,
  { headers: { apikey: key, Authorization: `Bearer ${key}` } },
);
if (!res.ok)
  throw new Error(`Could not read live products (HTTP ${res.status}); sitemap not written`);
const livePages = indexablePages(await res.json());

const PAGES = [
  { path: "/", files: ["src/routes/index.tsx"] },
  { path: "/about", files: ["src/routes/about.tsx"] },
  { path: "/catalogue", files: ["src/routes/catalogue.tsx"] },
  ...livePages.map((p) => ({ path: `/fabrics/${p.slug}`, files: FABRIC_FILES })),
  { path: "/wholesale", files: ["src/routes/wholesale.tsx"] },
  { path: "/contact", files: ["src/routes/contact.tsx"] },
  { path: "/faq", files: ["src/routes/faq.tsx"] },
  { path: "/privacy", files: ["src/routes/privacy.tsx"] },
];

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const today = new Date().toISOString().slice(0, 10);

function lastmod(files) {
  if (git("status", "--porcelain", "--", ...files)) return today;
  return git("log", "-1", "--format=%cs", "--", ...files) || today;
}

const urls = PAGES.map(
  ({ path, files }) =>
    `  <url>\n    <loc>${SITE}${path}</loc>\n    <lastmod>${lastmod(files)}</lastmod>\n  </url>`,
).join("\n");

writeFileSync(
  new URL("../public/sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log(
  `sitemap.xml: ${PAGES.length} URLs; fabric pages listed: ${livePages.map((p) => p.slug).join(", ") || "none"}`,
);
