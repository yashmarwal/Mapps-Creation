import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "@/lib/supabase";

const cache = new Map<string, unknown>();

/**
 * Admin-configurable settings stored as key/value JSON rows (site_settings
 * table). Falls back to the given default until Supabase resolves, or if
 * Supabase isn't configured — mirrors the useSiteImage pattern.
 */
export function useSiteSetting<T>(key: string, fallback: T) {
  const cached = cache.get(key) as T | undefined;
  const [value, setValue] = useState<T>(cached ?? fallback);
  const [loaded, setLoaded] = useState(cached !== undefined || !supabaseConfigured);

  useEffect(() => {
    // Already have a real cached value for this key (e.g. this component
    // remounted after a client-side navigation) — skip the network round
    // trip entirely instead of refetching data we already know.
    if (!supabaseConfigured || cache.has(key)) return;
    let cancelled = false;

    supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (data?.value) {
          cache.set(key, data.value);
          setValue(data.value as T);
        }
        setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return { value, loaded };
}
