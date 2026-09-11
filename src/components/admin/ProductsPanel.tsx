import { useEffect, useState } from "react";
import { Check, EyeOff, Pencil, Plus, Star, StarOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FABRIC_TYPE_CATEGORIES, PRODUCTS } from "@/data/catalog";
import {
  checkUploadSize,
  compressImageToTarget,
  PRODUCT_IMAGE_COMPRESS_TARGET_MB,
} from "@/lib/media";
import { supabase, type ProductRow } from "@/lib/supabase";
import { ImageDropzone } from "./ImageDropzone";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import placeholderImage from "@/assets/product-image-placeholder.svg";

const PRODUCT_IMAGE_COMPRESS_TARGET_BYTES = PRODUCT_IMAGE_COMPRESS_TARGET_MB * 1024 * 1024;

const OTHER_VALUE = "__other__";
const MAX_FEATURED = 6;

const EMPTY_FORM = {
  id: "",
  name: "",
  category: FABRIC_TYPE_CATEGORIES[0] as string,
  price: "",
  unit: "kg" as "kg" | "meter",
  spec: "",
  image_url: "",
  image_url_2: "",
  is_active: true,
};

export function ProductsPanel() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState<1 | 2 | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts((data as ProductRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (row: ProductRow) => {
    setForm({
      id: row.id,
      name: row.name,
      category: row.category,
      price: String(row.price),
      unit: row.unit,
      spec: row.spec,
      image_url: row.image_url ?? "",
      image_url_2: row.image_url_2 ?? "",
      is_active: row.is_active,
    });
    setIsOtherCategory(!(FABRIC_TYPE_CATEGORIES as readonly string[]).includes(row.category));
    setEditing(true);
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setIsOtherCategory(false);
    setEditing(false);
  };

  const handleUpload = async (file: File, slot: 1 | 2) => {
    setUploading(slot);
    const toastId = toast.loading(
      file.size > PRODUCT_IMAGE_COMPRESS_TARGET_BYTES ? "Compressing image..." : "Uploading...",
    );

    // Auto-compress large photos (phone camera shots are often 8-15MB) down
    // to a manageable size before upload — admins shouldn't need to
    // pre-compress product photos by hand. No-ops if already small enough.
    const upload = await compressImageToTarget(file, PRODUCT_IMAGE_COMPRESS_TARGET_BYTES);

    const sizeError = checkUploadSize(upload);
    if (sizeError) {
      toast.error(sizeError, { id: toastId });
      setUploading(null);
      return;
    }

    toast.loading("Uploading...", { id: toastId });
    const path = `${Date.now()}-${upload.name}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, upload, {
        upsert: true,
      });
    if (uploadError) {
      toast.error(uploadError.message, { id: toastId });
      setUploading(null);
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm((f) =>
      slot === 1 ? { ...f, image_url: data.publicUrl } : { ...f, image_url_2: data.publicUrl },
    );
    toast.success(`Image ${slot} uploaded`, { id: toastId });
    setUploading(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      unit: form.unit,
      spec: form.spec,
      image_url: form.image_url || null,
      image_url_2: form.image_url_2 || null,
      is_active: form.is_active,
    };

    const { error: saveError } = form.id
      ? await supabase.from("products").update(payload).eq("id", form.id)
      : await supabase.from("products").insert(payload);

    if (saveError) {
      toast.error(saveError.message);
      return;
    }
    toast.success(form.id ? "Product updated" : "Product created");
    resetForm();
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error: deleteError } = await supabase.from("products").delete().eq("id", id);
    if (deleteError) {
      toast.error(deleteError.message);
      return;
    }
    toast.success("Product deleted");
    setSelectedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    load();
  };

  const toggleActive = async (row: ProductRow) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !row.is_active })
      .eq("id", row.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    load();
  };

  const toggleFeatured = async (row: ProductRow) => {
    if (!row.is_featured && products.filter((p) => p.is_featured).length >= MAX_FEATURED) {
      toast.error(
        `Only ${MAX_FEATURED} products can be featured on the homepage at once; unfeature one first.`,
      );
      return;
    }
    const { error } = await supabase
      .from("products")
      .update({ is_featured: !row.is_featured })
      .eq("id", row.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    load();
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.size === products.length ? new Set() : new Set(products.map((p) => p.id)),
    );
  };

  const clearSelection = () => setSelectedIds(new Set());

  const bulkSetActive = async (active: boolean) => {
    if (selectedIds.size === 0) return;
    setBulkBusy(true);
    const { error: bulkError } = await supabase
      .from("products")
      .update({ is_active: active })
      .in("id", [...selectedIds]);
    setBulkBusy(false);
    if (bulkError) {
      toast.error(bulkError.message);
      return;
    }
    toast.success(`${selectedIds.size} product(s) ${active ? "activated" : "deactivated"}`);
    clearSelection();
    load();
  };

  const bulkSetFeatured = async (featured: boolean) => {
    if (selectedIds.size === 0) return;
    if (featured) {
      const alreadyFeaturedElsewhere = products.filter(
        (p) => p.is_featured && !selectedIds.has(p.id),
      ).length;
      if (alreadyFeaturedElsewhere + selectedIds.size > MAX_FEATURED) {
        const room = Math.max(0, MAX_FEATURED - alreadyFeaturedElsewhere);
        toast.error(
          `Only ${MAX_FEATURED} products can be featured at once; you have room for ${room} more. Unfeature some first or select fewer.`,
        );
        return;
      }
    }
    setBulkBusy(true);
    const { error: bulkError } = await supabase
      .from("products")
      .update({ is_featured: featured })
      .in("id", [...selectedIds]);
    setBulkBusy(false);
    if (bulkError) {
      toast.error(bulkError.message);
      return;
    }
    toast.success(`${selectedIds.size} product(s) ${featured ? "featured" : "unfeatured"}`);
    clearSelection();
    load();
  };

  const bulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected product(s)? This can't be undone.`)) return;
    setBulkBusy(true);
    const { error: bulkError } = await supabase
      .from("products")
      .delete()
      .in("id", [...selectedIds]);
    setBulkBusy(false);
    if (bulkError) {
      toast.error(bulkError.message);
      return;
    }
    toast.success(`${selectedIds.size} product(s) deleted`);
    clearSelection();
    load();
  };

  const seedDefaults = async () => {
    if (!confirm(`Load the ${PRODUCTS.length} default catalogue products into the database?`)) {
      return;
    }
    setSeeding(true);
    const { error: seedError } = await supabase.from("products").insert(
      PRODUCTS.map((p) => ({
        name: p.name,
        category: p.category,
        price: p.price,
        unit: p.unit,
        spec: p.spec,
        image_url: p.image,
        image_url_2: p.image2 || null,
        is_active: true,
      })),
    );
    setSeeding(false);
    if (seedError) {
      toast.error(seedError.message);
      return;
    }
    toast.success(`${PRODUCTS.length} products loaded`);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl">Products</h2>
        {!editing && (
          <div className="flex gap-2">
            <button
              onClick={seedDefaults}
              disabled={seeding}
              className="border-border text-muted-foreground hover:text-primary label-caps border px-4 py-2.5 disabled:opacity-60"
            >
              {seeding ? "Loading..." : "Load Default Catalogue"}
            </button>
            <button
              onClick={() => setEditing(true)}
              className="bg-primary text-primary-foreground label-caps flex items-center gap-2 px-4 py-2.5"
            >
              <Plus className="h-4 w-4" /> Add Product
            </button>
          </div>
        )}
      </div>
      <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
        "Load Default Catalogue" imports the built-in starter products here so you can edit or
        delete them individually. The site shows those starter products only until real ones exist
        in this table. Mark up to {MAX_FEATURED} as "Featured" to control exactly which fabrics show
        in the homepage row; leave none marked and the site falls back to the latest {MAX_FEATURED}.
      </p>

      {editing && (
        <form
          onSubmit={handleSubmit}
          className="border-border bg-card/40 mt-6 space-y-5 border p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="label-caps text-muted-foreground">Name</span>
              <input
                required
                value={form.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((f) => ({ ...f, name: value }));
                }}
                className="border-border bg-card mt-2 w-full min-h-[44px] border px-3"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Category</span>
              <select
                value={isOtherCategory ? OTHER_VALUE : form.category}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === OTHER_VALUE) {
                    setIsOtherCategory(true);
                    setForm((f) => ({ ...f, category: "" }));
                  } else {
                    setIsOtherCategory(false);
                    setForm((f) => ({ ...f, category: value }));
                  }
                }}
                className="border-border bg-card mt-2 w-full min-h-[44px] border px-3"
              >
                {FABRIC_TYPE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value={OTHER_VALUE}>Other (specify)…</option>
              </select>
              {isOtherCategory && (
                <input
                  required
                  placeholder="Type the category name"
                  value={form.category}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm((f) => ({ ...f, category: value }));
                  }}
                  className="border-border bg-card mt-2 w-full min-h-[44px] border px-3"
                />
              )}
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Price</span>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((f) => ({ ...f, price: value }));
                }}
                className="border-border bg-card mt-2 w-full min-h-[44px] border px-3"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Unit</span>
              <select
                value={form.unit}
                onChange={(e) => {
                  const value = e.target.value as "kg" | "meter";
                  setForm((f) => ({ ...f, unit: value }));
                }}
                className="border-border bg-card mt-2 w-full min-h-[44px] border px-3"
              >
                <option value="kg">kg</option>
                <option value="meter">meter</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="label-caps text-muted-foreground">Spec</span>
            <input
              required
              placeholder="e.g. 220 GSM, 4-Way Stretch"
              value={form.spec}
              onChange={(e) => {
                const value = e.target.value;
                setForm((f) => ({ ...f, spec: value }));
              }}
              className="border-border bg-card mt-2 w-full min-h-[44px] border px-3"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="label-caps text-muted-foreground">Image 1 (main)</span>
              <div className="mt-2">
                {form.image_url ? (
                  <div className="border-border flex items-center gap-3 border p-2">
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="h-16 w-16 shrink-0 object-cover"
                    />
                    <div className="flex flex-col gap-1.5">
                      <ImageDropzone
                        label="Replace"
                        compact
                        disabled={uploading === 1}
                        onFile={(file) => handleUpload(file, 1)}
                      />
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, image_url: "" }))}
                        className="text-muted-foreground hover:text-destructive label-caps text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <ImageDropzone
                    label="Drag a photo here, or click to browse"
                    disabled={uploading === 1}
                    onFile={(file) => handleUpload(file, 1)}
                  />
                )}
              </div>
            </div>
            <div>
              <span className="label-caps text-muted-foreground">Image 2 (optional)</span>
              <div className="mt-2">
                {form.image_url_2 ? (
                  <div className="border-border flex items-center gap-3 border p-2">
                    <img
                      src={form.image_url_2}
                      alt="Preview"
                      className="h-16 w-16 shrink-0 object-cover"
                    />
                    <div className="flex flex-col gap-1.5">
                      <ImageDropzone
                        label="Replace"
                        compact
                        disabled={uploading === 2}
                        onFile={(file) => handleUpload(file, 2)}
                      />
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, image_url_2: "" }))}
                        className="text-muted-foreground hover:text-destructive label-caps text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <ImageDropzone
                    label="Drag a photo here, or click to browse"
                    disabled={uploading === 2}
                    onFile={(file) => handleUpload(file, 2)}
                  />
                )}
              </div>
            </div>
          </div>
          <p className="text-muted-foreground/70 -mt-2 text-[11px]">
            Large photos are auto-compressed to under {PRODUCT_IMAGE_COMPRESS_TARGET_MB}MB before
            upload. Image 2 is optional — shown alongside the main photo on the product's detail
            view.
          </p>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => {
                const checked = e.target.checked;
                setForm((f) => ({ ...f, is_active: checked }));
              }}
            />
            Active (visible on site)
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-primary text-primary-foreground label-caps px-5 py-2.5"
            >
              {form.id ? "Save Changes" : "Create Product"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="border-border label-caps border px-5 py-2.5"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {selectedIds.size > 0 && (
        <div className="border-primary/40 bg-primary/5 mt-6 flex flex-wrap items-center gap-3 border p-4">
          <span className="label-caps text-foreground">{selectedIds.size} selected</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => bulkSetActive(true)}
              disabled={bulkBusy}
              className="border-border text-muted-foreground hover:text-primary label-caps flex items-center gap-1.5 border px-3 py-2 disabled:opacity-60"
            >
              <Check className="h-3.5 w-3.5" /> Activate
            </button>
            <button
              onClick={() => bulkSetActive(false)}
              disabled={bulkBusy}
              className="border-border text-muted-foreground hover:text-primary label-caps flex items-center gap-1.5 border px-3 py-2 disabled:opacity-60"
            >
              <EyeOff className="h-3.5 w-3.5" /> Deactivate
            </button>
            <button
              onClick={() => bulkSetFeatured(true)}
              disabled={bulkBusy}
              className="border-border text-muted-foreground hover:text-primary label-caps flex items-center gap-1.5 border px-3 py-2 disabled:opacity-60"
            >
              <Star className="h-3.5 w-3.5" /> Feature
            </button>
            <button
              onClick={() => bulkSetFeatured(false)}
              disabled={bulkBusy}
              className="border-border text-muted-foreground hover:text-primary label-caps flex items-center gap-1.5 border px-3 py-2 disabled:opacity-60"
            >
              <StarOff className="h-3.5 w-3.5" /> Unfeature
            </button>
            <button
              onClick={bulkDelete}
              disabled={bulkBusy}
              className="border-destructive/50 text-destructive hover:bg-destructive hover:text-white label-caps flex items-center gap-1.5 border px-3 py-2 disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
            <button
              onClick={clearSelection}
              disabled={bulkBusy}
              className="text-muted-foreground hover:text-foreground label-caps px-3 py-2 disabled:opacity-60"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div data-lenis-prevent className="mt-6 overflow-x-auto">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No products yet. The public site shows the seed catalogue until you add some here.
          </p>
        ) : (
          <Table className="min-w-[680px]">
            <TableHeader>
              <TableRow className="label-caps">
                <TableHead className="w-8">
                  <input
                    type="checkbox"
                    aria-label="Select all products"
                    checked={selectedIds.size === products.length}
                    onChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-14" />
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      aria-label={`Select ${row.name}`}
                      checked={selectedIds.has(row.id)}
                      onChange={() => toggleSelected(row.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <img
                      src={row.image_url || placeholderImage}
                      alt={row.name}
                      className="border-border h-10 w-10 border object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.category}</TableCell>
                  <TableCell>
                    ₹{row.price}/{row.unit}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={row.is_active}
                      onCheckedChange={() => toggleActive(row)}
                      aria-label={`${row.is_active ? "Deactivate" : "Activate"} ${row.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={row.is_featured}
                      onCheckedChange={() => toggleFeatured(row)}
                      aria-label={`${row.is_featured ? "Unfeature" : "Feature"} ${row.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-3">
                      <button onClick={() => startEdit(row)} aria-label="Edit">
                        <Pencil className="text-muted-foreground hover:text-primary h-4 w-4" />
                      </button>
                      <button onClick={() => remove(row.id)} aria-label="Delete">
                        <Trash2 className="text-muted-foreground hover:text-destructive h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
