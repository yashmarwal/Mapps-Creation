import { createClient } from "@supabase/supabase-js";

const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const anonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined;

/** True once real Supabase credentials are provided via env vars. */
export const supabaseConfigured = Boolean(url && anonKey);

export type ProductRow = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: "kg" | "meter";
  spec: string;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
};

export type SiteImageRow = {
  id: string;
  section: string;
  url: string;
  created_at: string;
};

export type SiteSettingRow = {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
};

/**
 * Falls back to a stub client when env vars are absent so the site keeps
 * working off local seed data before a Supabase project is connected —
 * see setup instructions in SUPABASE_SETUP.md.
 */
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "public-anon-key",
);
