import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "@/lib/supabase";

const cache = new Map<string, string>();

/**
 * Looks up an admin-managed image for a named section (e.g. "hero",
 * "about-banner") from the site_images table. Falls back to the given
 * default (a bundled asset import) until an admin uploads a replacement,
 * or if Supabase isn't configured yet.
 */
export function useSiteImage(section: string, fallback: string) {
  const [url, setUrl] = useState(() => cache.get(section) ?? fallback);

  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;

    supabase
      .from("site_images")
      .select("url")
      .eq("section", section)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data?.url) return;
        cache.set(section, data.url);
        setUrl(data.url);
      });

    return () => {
      cancelled = true;
    };
  }, [section]);

  return url;
}
