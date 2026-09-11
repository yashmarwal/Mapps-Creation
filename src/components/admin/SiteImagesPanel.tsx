import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase, type SiteImageRow } from "@/lib/supabase";
import { checkUploadSize, compressImageToTarget, isVideoUrl } from "@/lib/media";
import { ImageDropzone } from "./ImageDropzone";

const SECTIONS = [
  { key: "hero-video-desktop", label: "Home: Hero Background (Desktop)" },
  { key: "hero-video-mobile", label: "Home: Hero Background (Mobile)" },
  { key: "about-banner", label: "About: Banner" },
] as const;

export function SiteImagesPanel() {
  const [images, setImages] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);

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
    setUploading(section);
    const toastId = toast.loading("Uploading...");

    // This slot accepts either a photo or a video — only compress photos;
    // compressImageToTarget is a no-op for any non-image file, so a video
    // upload passes through completely untouched.
    const upload = await compressImageToTarget(file);

    const sizeError = checkUploadSize(upload);
    if (sizeError) {
      toast.error(sizeError, { id: toastId });
      setUploading(null);
      return;
    }
    const path = `${section}/${Date.now()}-${upload.name}`;
    const { error: uploadError } = await supabase.storage.from("site-images").upload(path, upload, {
      upsert: true,
    });
    if (uploadError) {
      toast.error(uploadError.message, { id: toastId });
      setUploading(null);
      return;
    }
    const { data } = supabase.storage.from("site-images").getPublicUrl(path);
    const { error: insertError } = await supabase
      .from("site_images")
      .insert({ section, url: data.publicUrl });
    if (insertError) {
      toast.error(insertError.message, { id: toastId });
    } else {
      toast.success("Uploaded", { id: toastId });
    }
    setUploading(null);
    load();
  };

  const handleRestoreDefault = async (section: string) => {
    if (!confirm("Restore the default asset for this section? This removes your uploaded file.")) {
      return;
    }
    // Remove every row for this section so the site falls back to its bundled default.
    const { error: deleteError } = await supabase
      .from("site_images")
      .delete()
      .eq("section", section);
    if (deleteError) {
      toast.error(deleteError.message);
      return;
    }
    toast.success("Restored to default");
    load();
  };

  return (
    <div>
      <h2 className="font-display text-2xl">Site Images</h2>
      <p className="text-muted-foreground mt-2 max-w-xl text-sm">
        Replace key section backdrops without a redeploy: upload either a photo or a video,
        whichever you have. Takes effect on the live site the next time a visitor loads that page.
      </p>

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
              <div className="mt-3">
                <ImageDropzone
                  compact
                  accept="image/*,video/*"
                  disabled={uploading === section.key}
                  label={
                    uploading === section.key
                      ? "Uploading..."
                      : "Drop a photo or video, or click to browse"
                  }
                  onFile={(file) => handleUpload(section.key, file)}
                />
                {current && (
                  <button
                    type="button"
                    onClick={() => handleRestoreDefault(section.key)}
                    className="text-muted-foreground hover:text-destructive label-caps mt-2 flex items-center gap-1.5 text-xs"
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
