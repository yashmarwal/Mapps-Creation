import { useEffect, useState } from "react";
import { supabase, supabaseConfigured, type ProductRow } from "@/lib/supabase";
import { PRODUCTS, type Product } from "@/data/catalog";

function fromRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    unit: row.unit,
    spec: row.spec,
    image: row.image_url || "",
    featured: row.is_featured,
  };
}

const MAX_FEATURED = 6;

// Module-level cache, shared by every `useProducts()` instance in the app.
// Without this, every component that calls the hook (homepage, catalogue
// page, search modal, download-catalogue modal — often 2-3 of them mounted
// simultaneously) fired its own independent Supabase query for the exact
// same `products` table on every page load. `hasFetched` covers both cases:
// a legitimate "Supabase returned rows" result AND a "returned nothing, use
// the seed catalogue" result, so once resolved, nothing refetches again for
// the rest of the session (matches the original one-shot-per-mount fetch
// behavior — there was never any live revalidation to begin with, just no
// sharing across components/remounts).
let hasFetched = false;
let cachedProducts: Product[] | null = null; // null = resolved empty, use seed
let inFlight: Promise<void> | null = null;

function ensureProductsFetched(): Promise<void> {
  if (hasFetched) return Promise.resolve();
  if (inFlight) return inFlight;

  // Wrapped in a real async IIFE (not a raw .then() chain) so this is a
  // genuine native Promise — Supabase's query builder is only "thenable",
  // it doesn't support .finally() directly.
  inFlight = (async () => {
    try {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      cachedProducts = data && data.length > 0 ? (data as ProductRow[]).map(fromRow) : null;
      hasFetched = true;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}

/**
 * Active products from Supabase once an admin has added any; falls back to
 * the local seed catalogue so the site works before the project is wired up.
 *
 * When Supabase is configured, we start with an empty list (not the seed
 * data) so pages never flash the wrong catalogue while the real fetch is
 * in flight — callers should use `loading` to show a skeleton instead.
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
    if (!supabaseConfigured) return PRODUCTS;
    return hasFetched ? (cachedProducts ?? PRODUCTS) : [];
  });
  const [loading, setLoading] = useState(() => supabaseConfigured && !hasFetched);

  useEffect(() => {
    if (!supabaseConfigured || hasFetched) return;
    let cancelled = false;

    ensureProductsFetched().then(() => {
      if (cancelled) return;
      setProducts(cachedProducts ?? PRODUCTS);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Admin-picked products for the homepage row — falls back to the latest
  // products if the admin hasn't curated any yet, so the section is never empty.
  const picked = products.filter((p) => p.featured);
  const featured = (picked.length > 0 ? picked : products).slice(0, MAX_FEATURED);

  return { products, featured, loading };
}
