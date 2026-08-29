import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase, type SiteImageRow } from "@/lib/supabase";
import { checkUploadSize, isVideoUrl } from "@/lib/media";

const SECTIONS = [
  { key: "hero-video-desktop", label: "Home — Hero Background (Desktop)" },
  { key: "hero-video-mobile", label: "Home — Hero Background (Mobile)" },
  { key: "about-banner", label: "About — Banner" },
] as const;

export function SiteImagesPanel() {
  const [images, setImages] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("site_images")
      .select("*")
      .order("created_at", { ascending: false });
    const latest: Record<string, string> = {};
    for (const row of (data as SiteImageRow[]) ?? []) {
      if (!latest[row.section]) latest[row.section] = row.url;
    }
    setImages(latest);
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (section: string, file: File) => {
    const sizeError = checkUploadSize(file);
    if (sizeError) {
      setError(sizeError);
      return;
    }
    setUploading(section);
    setError(null);
    const path = `${section}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("site-images").upload(path, file, {
      upsert: true,
    });
    if (uploadError) {
      setError(uploadError.message);
      setUploading(null);
      return;
    }
    const { data } = supabase.storage.from("site-images").getPublicUrl(path);
    const { error: insertError } = await supabase
      .from("site_images")
      .insert({ section, url: data.publicUrl });
    if (insertError) {
      setError(insertError.message);
    }
    setUploading(null);
    load();
  };

  const handleRestoreDefault = async (section: string) => {
    if (!confirm("Restore the default asset for this section? This removes your uploaded file.")) {
      return;
    }
    setError(null);
    // Remove every row for this section so the site falls back to its bundled default.
    const { error: deleteError } = await supabase
      .from("site_images")
      .delete()
      .eq("section", section);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    load();
  };

  return (
    <div>
      <h2 className="font-display text-2xl">Site Images</h2>
      <p className="text-muted-foreground mt-2 max-w-xl text-sm">
        Replace key section backdrops without a redeploy — upload either a photo or a video,
        whichever you have. Takes effect on the live site the next time a visitor loads that page.
      </p>

      {error && <p className="text-destructive mt-4 text-sm">{error}</p>}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => {
          const current = images[section.key];
          return (
            <div key={section.key} className="border-border border p-4">
              <p className="label-caps text-muted-foreground">{section.label}</p>
              <div className="bg-muted mt-3 aspect-video overflow-hidden">
                {current ? (
                  isVideoUrl(current) ? (
                    <video
                      key={current}
                      src={current}
                      className="h-full w-full object-cover"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img src={current} alt={section.label} className="h-full w-full object-cover" />
                  )
                ) : (
                  <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
                    Using default asset
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <label className="block">
                  <span className="text-primary label-caps cursor-pointer text-xs">
                    {uploading === section.key ? "Uploading..." : "Upload photo or video"}
                  </span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    disabled={uploading === section.key}
                    onChange={(e) =>
                      e.target.files?.[0] && handleUpload(section.key, e.target.files[0])
                    }
                  />
                </label>
                {current && (
                  <button
                    type="button"
                    onClick={() => handleRestoreDefault(section.key)}
                    aria-label="Restore default"
                    className="text-muted-foreground hover:text-destructive label-caps flex shrink-0 items-center gap-1.5 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Restore default
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
