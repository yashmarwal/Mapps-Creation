import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Image, LogOut, Package, Settings } from "lucide-react";
import { ProductsPanel } from "@/components/admin/ProductsPanel";
import { SiteImagesPanel } from "@/components/admin/SiteImagesPanel";
import { SiteSettingsPanel } from "@/components/admin/SiteSettingsPanel";
import { useAdminSession } from "@/hooks/useAdminSession";
import { supabase } from "@/lib/supabase";
import { LogoMark } from "@/components/site/LogoMark";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin | Mapps Creation" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const { session, loading } = useAdminSession();

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
    <div className="bg-muted/30 min-h-screen">
      {/* A distinct bar, separate from the content below, so this reads as
          "you're inside a tool" rather than another page of the storefront. */}
      <header className="border-border bg-background sticky top-0 z-10 border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <LogoMark size={32} />
            <div className="leading-tight">
              <p className="font-display text-lg">Mapps Creation</p>
              <p className="label-caps text-muted-foreground text-[10px]">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="border-border text-muted-foreground hover:text-primary label-caps flex items-center gap-2 border px-4 py-2.5 text-xs"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 md:px-10">
        <Tabs defaultValue="products">
          <TabsList className="h-auto p-1">
            <TabsTrigger value="products" className="gap-1.5">
              <Package className="h-3.5 w-3.5" /> Products
            </TabsTrigger>
            <TabsTrigger value="images" className="gap-1.5">
              <Image className="h-3.5 w-3.5" /> Site Images
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-1.5">
              <Settings className="h-3.5 w-3.5" /> Site Settings
            </TabsTrigger>
          </TabsList>

          <div className="bg-background border-border mt-6 border p-6 md:p-8">
            <TabsContent value="products" className="mt-0">
              <ProductsPanel />
            </TabsContent>
            <TabsContent value="images" className="mt-0">
              <SiteImagesPanel />
            </TabsContent>
            <TabsContent value="settings" className="mt-0">
              <SiteSettingsPanel />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
