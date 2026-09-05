import { Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MARQUEE_DEFAULT, type MarqueeSettings } from "@/components/site/TopMarquee";
import { PROMO_DEFAULT, type PromoPopupSettings } from "@/components/site/PromoPopup";
import {
  DEFAULT_VIDEOS,
  MAX_REEL_VIDEOS,
  REEL_DEFAULT,
  type ReelSettings,
} from "@/components/site/FabricReels";
import { checkUploadSize, compressImageToTarget } from "@/lib/media";

async function loadSetting<T>(key: string, fallback: T): Promise<T> {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return data?.value ? { ...fallback, ...(data.value as object) } : fallback;
}

async function saveSetting(key: string, value: unknown) {
  return supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });
}

export function SiteSettingsPanel() {
  const [marquee, setMarquee] = useState<MarqueeSettings>(MARQUEE_DEFAULT);
  const [promo, setPromo] = useState<PromoPopupSettings>(PROMO_DEFAULT);
  const [reels, setReels] = useState<ReelSettings>(REEL_DEFAULT);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [uploadingReel, setUploadingReel] = useState(false);
  const [reelError, setReelError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    Promise.all([
      loadSetting("marquee", MARQUEE_DEFAULT),
      loadSetting("promo_popup", PROMO_DEFAULT),
      loadSetting("reel_videos", REEL_DEFAULT),
    ]).then(([m, p, r]) => {
      setMarquee(m);
      setPromo(p);
      // Nothing saved yet — seed the editor with the 8 built-in clips so
      // they're visible and editable here too, not just a hidden fallback.
      setReels(r.urls.length > 0 ? r : { urls: DEFAULT_VIDEOS });
      setLoading(false);
    });
  }, []);

  const saveAll = async () => {
    setStatus("saving");
    const [{ error: e1 }, { error: e2 }, { error: e3 }] = await Promise.all([
      saveSetting("marquee", marquee),
      saveSetting("promo_popup", promo),
      saveSetting("reel_videos", reels),
    ]);
    setStatus(e1 || e2 || e3 ? "error" : "saved");
    window.setTimeout(() => setStatus("idle"), 3000);
  };

  const handlePromoImage = async (file: File) => {
    setPromoError(null);
    setUploading(true);

    // Image-only field (accept="image/*") — always safe to compress.
    const upload = await compressImageToTarget(file);

    const sizeError = checkUploadSize(upload);
    if (sizeError) {
      setPromoError(sizeError);
      setUploading(false);
      return;
    }
    const path = `promo-${Date.now()}-${upload.name}`;
    const { error } = await supabase.storage
      .from("site-images")
      .upload(path, upload, { upsert: true });
    if (error) {
      setPromoError(error.message);
    } else {
      const { data } = supabase.storage.from("site-images").getPublicUrl(path);
      setPromo((p) => ({ ...p, imageUrl: data.publicUrl }));
    }
    setUploading(false);
  };

  const handleReelUpload = async (file: File) => {
    if (reels.urls.length >= MAX_REEL_VIDEOS) {
      setReelError(`Only ${MAX_REEL_VIDEOS} videos allowed — remove one first.`);
      return;
    }
    const sizeError = checkUploadSize(file);
    if (sizeError) {
      setReelError(sizeError);
      return;
    }
    setReelError(null);
    setUploadingReel(true);
    const path = `reel-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("site-images")
      .upload(path, file, { upsert: true });
    if (error) {
      setReelError(error.message);
    } else {
      const { data } = supabase.storage.from("site-images").getPublicUrl(path);
      setReels((r) => ({ urls: [...r.urls, data.publicUrl] }));
    }
    setUploadingReel(false);
  };

  const removeReel = (index: number) => {
    setReels((r) => ({ urls: r.urls.filter((_, i) => i !== index) }));
  };

  const replaceReel = async (index: number, file: File) => {
    const sizeError = checkUploadSize(file);
    if (sizeError) {
      setReelError(sizeError);
      return;
    }
    setReelError(null);
    setUploadingReel(true);
    const path = `reel-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("site-images")
      .upload(path, file, { upsert: true });
    if (error) {
      setReelError(error.message);
    } else {
      const { data } = supabase.storage.from("site-images").getPublicUrl(path);
      setReels((r) => ({ urls: r.urls.map((url, i) => (i === index ? data.publicUrl : url)) }));
    }
    setUploadingReel(false);
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-display text-2xl">Top Marquee</h2>
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
          A slim scrolling announcement bar above the navigation — e.g. a festive offer or delivery
          notice. Leave disabled to hide it.
        </p>
        <div className="mt-5 space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={marquee.enabled}
              onChange={(e) => {
                const checked = e.target.checked;
                setMarquee((m) => ({ ...m, enabled: checked }));
              }}
            />
            Enabled
          </label>
          <label className="block">
            <span className="label-caps text-muted-foreground">Text</span>
            <input
              placeholder="e.g. Diwali Offer — Extra 5% off bulk orders this week"
              value={marquee.text}
              onChange={(e) => {
                const value = e.target.value;
                setMarquee((m) => ({ ...m, text: value }));
              }}
              className="border-border bg-card mt-2 w-full min-h-[44px] border px-3"
            />
          </label>
        </div>
      </div>

      <div className="border-border border-t pt-10">
        <h2 className="font-display text-2xl">Offers Popup</h2>
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
          A one-time popup shown to visitors after they scroll 20% down any page — for seasonal
          offers or promotions. Shows once per browser session.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={promo.enabled}
              onChange={(e) => {
                const checked = e.target.checked;
                setPromo((p) => ({ ...p, enabled: checked }));
              }}
            />
            Enabled
          </label>
          <label className="block sm:col-span-2">
            <span className="label-caps text-muted-foreground">Title</span>
            <input
              placeholder="e.g. Festive Season Offer"
              value={promo.title}
              onChange={(e) => {
                const value = e.target.value;
                setPromo((p) => ({ ...p, title: value }));
              }}
              className="border-border bg-card mt-2 w-full min-h-[44px] border px-3"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="label-caps text-muted-foreground">Message</span>
            <textarea
              rows={3}
              placeholder="Describe the offer"
              value={promo.message}
              onChange={(e) => {
                const value = e.target.value;
                setPromo((p) => ({ ...p, message: value }));
              }}
              className="border-border bg-card mt-2 w-full border p-3"
            />
          </label>
          <label className="block">
            <span className="label-caps text-muted-foreground">Button Text</span>
            <input
              placeholder="e.g. WhatsApp Us"
              value={promo.ctaText}
              onChange={(e) => {
                const value = e.target.value;
                setPromo((p) => ({ ...p, ctaText: value }));
              }}
              className="border-border bg-card mt-2 w-full min-h-[44px] border px-3"
            />
          </label>
          <label className="block">
            <span className="label-caps text-muted-foreground">Button Link</span>
            <input
              placeholder="https://wa.me/... or /catalogue"
              value={promo.ctaLink}
              onChange={(e) => {
                const value = e.target.value;
                setPromo((p) => ({ ...p, ctaLink: value }));
              }}
              className="border-border bg-card mt-2 w-full min-h-[44px] border px-3"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="label-caps text-muted-foreground">Image (optional)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handlePromoImage(e.target.files[0])}
              className="mt-2 block text-sm"
            />
            {uploading && <p className="text-muted-foreground mt-1 text-xs">Uploading...</p>}
            {promoError && <p className="text-destructive mt-1 text-xs">{promoError}</p>}
            {promo.imageUrl && (
              <img src={promo.imageUrl} alt="Preview" className="mt-3 h-24 w-40 object-cover" />
            )}
          </label>
        </div>
      </div>

      <div className="border-border border-t pt-10">
        <h2 className="font-display text-2xl">Video Reels Bar</h2>
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
          The horizontal scrolling video row on the homepage ("Fabric in motion") — up to{" "}
          {MAX_REEL_VIDEOS} videos. The 8 below are the current lineup, including the built-in
          defaults — replace or remove any of them, or upload to fill an empty slot. Clearing all of
          them and saving reverts the site to the built-in clips.
        </p>

        <div className="mt-5">
          <label className="text-primary label-caps inline-block cursor-pointer text-xs">
            {uploadingReel ? "Uploading..." : "Upload a video"}
            <input
              type="file"
              accept="video/*"
              className="hidden"
              disabled={uploadingReel || reels.urls.length >= MAX_REEL_VIDEOS}
              onChange={(e) => {
                if (e.target.files?.[0]) handleReelUpload(e.target.files[0]);
                e.target.value = "";
              }}
            />
          </label>
          <span className="text-muted-foreground ml-3 text-xs">
            {reels.urls.length} / {MAX_REEL_VIDEOS} in the bar
          </span>
          {reelError && <p className="text-destructive mt-2 text-sm">{reelError}</p>}

          {reels.urls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {reels.urls.map((url, i) => (
                <div
                  key={`${i}-${url}`}
                  className="group border-border relative aspect-[9/16] border"
                >
                  <video src={url} muted loop playsInline className="h-full w-full object-cover" />
                  <div className="absolute top-1.5 right-1.5 flex gap-1.5">
                    <label
                      aria-label="Replace video"
                      className="bg-background/90 text-muted-foreground hover:text-primary flex h-7 w-7 cursor-pointer items-center justify-center border border-border"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        disabled={uploadingReel}
                        onChange={(e) => {
                          if (e.target.files?.[0]) replaceReel(i, e.target.files[0]);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeReel(i)}
                      aria-label="Remove video"
                      className="bg-background/90 text-destructive flex h-7 w-7 items-center justify-center border border-border"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={saveAll}
          disabled={status === "saving"}
          className="bg-primary text-primary-foreground label-caps px-6 py-3 disabled:opacity-60"
        >
          {status === "saving" ? "Saving..." : "Save Settings"}
        </button>
        {status === "saved" && <p className="text-primary text-sm">Saved.</p>}
        {status === "error" && <p className="text-destructive text-sm">Failed to save.</p>}
      </div>
    </div>
  );
}
