import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { ProductsPanel } from "@/components/admin/ProductsPanel";
import { SiteImagesPanel } from "@/components/admin/SiteImagesPanel";
import { SiteSettingsPanel } from "@/components/admin/SiteSettingsPanel";
import { useAdminSession } from "@/hooks/useAdminSession";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — Mapps Creation" }] }),
  component: AdminDashboard,
});

const TABS = ["Products", "Site Images", "Site Settings"] as const;

function AdminDashboard() {
  const navigate = useNavigate();
  const { session, loading } = useAdminSession();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Products");

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/admin/login" });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-caps text-primary">Mapps Creation</p>
          <h1 className="font-display mt-2 text-3xl">Admin Panel</h1>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="border-border text-muted-foreground hover:text-primary label-caps flex items-center gap-2 border px-4 py-2.5"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>

      <div className="border-border mt-10 flex gap-6 border-b">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`label-caps -mb-px border-b-2 pb-3 transition-colors ${
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {tab === "Products" && <ProductsPanel />}
        {tab === "Site Images" && <SiteImagesPanel />}
        {tab === "Site Settings" && <SiteSettingsPanel />}
      </div>
    </div>
  );
}
