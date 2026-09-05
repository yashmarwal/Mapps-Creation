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

/**
 * Active products from Supabase once an admin has added any; falls back to
 * the local seed catalogue so the site works before the project is wired up.
 *
 * When Supabase is configured, we start with an empty list (not the seed
 * data) so pages never flash the wrong catalogue while the real fetch is
 * in flight — callers should use `loading` to show a skeleton instead.
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(supabaseConfigured ? [] : PRODUCTS);
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;

    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        setProducts(data && data.length > 0 ? (data as ProductRow[]).map(fromRow) : PRODUCTS);
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
