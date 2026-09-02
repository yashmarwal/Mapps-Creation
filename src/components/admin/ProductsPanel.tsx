import { useEffect, useState } from "react";
import { Check, EyeOff, Pencil, Plus, Star, StarOff, Trash2 } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/data/catalog";
import { checkUploadSize } from "@/lib/media";
import { supabase, type ProductRow } from "@/lib/supabase";

const OTHER_VALUE = "__other__";
const MAX_FEATURED = 6;

const EMPTY_FORM = {
  id: "",
  name: "",
  category: CATEGORIES[0] as string,
  price: "",
  unit: "kg" as "kg" | "meter",
  spec: "",
  image_url: "",
  is_active: true,
};

export function ProductsPanel() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      is_active: row.is_active,
    });
    setIsOtherCategory(!(CATEGORIES as readonly string[]).includes(row.category));
    setEditing(true);
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setIsOtherCategory(false);
    setEditing(false);
  };

  const handleUpload = async (file: File) => {
    const sizeError = checkUploadSize(file);
    if (sizeError) {
      setError(sizeError);
      return;
    }
    setUploading(true);
    setError(null);
    const path = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file, {
        upsert: true,
      });
    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: data.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      unit: form.unit,
      spec: form.spec,
      image_url: form.image_url || null,
      is_active: form.is_active,
    };

    const { error: saveError } = form.id
      ? await supabase.from("products").update(payload).eq("id", form.id)
      : await supabase.from("products").insert(payload);

    if (saveError) {
      setError(saveError.message);
      return;
    }
    resetForm();
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    setSelectedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    load();
  };

  const toggleActive = async (row: ProductRow) => {
    await supabase.from("products").update({ is_active: !row.is_active }).eq("id", row.id);
    load();
  };

  const toggleFeatured = async (row: ProductRow) => {
    if (!row.is_featured && products.filter((p) => p.is_featured).length >= MAX_FEATURED) {
      setError(
        `Only ${MAX_FEATURED} products can be featured on the homepage at once — unfeature one first.`,
      );
      return;
    }
    setError(null);
    await supabase.from("products").update({ is_featured: !row.is_featured }).eq("id", row.id);
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
    setError(null);
    const { error: bulkError } = await supabase
      .from("products")
      .update({ is_active: active })
      .in("id", [...selectedIds]);
    setBulkBusy(false);
    if (bulkError) {
      setError(bulkError.message);
      return;
    }
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
        setError(
          `Only ${MAX_FEATURED} products can be featured at once — you have room for ${room} more. Unfeature some first or select fewer.`,
        );
        return;
      }
    }
    setBulkBusy(true);
    setError(null);
    const { error: bulkError } = await supabase
      .from("products")
      .update({ is_featured: featured })
      .in("id", [...selectedIds]);
    setBulkBusy(false);
    if (bulkError) {
      setError(bulkError.message);
      return;
    }
    clearSelection();
    load();
  };

  const bulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected product(s)? This can't be undone.`)) return;
    setBulkBusy(true);
    setError(null);
    const { error: bulkError } = await supabase
      .from("products")
      .delete()
      .in("id", [...selectedIds]);
    setBulkBusy(false);
    if (bulkError) {
      setError(bulkError.message);
      return;
    }
    clearSelection();
    load();
  };

  const seedDefaults = async () => {
    if (!confirm(`Load the ${PRODUCTS.length} default catalogue products into the database?`)) {
      return;
    }
    setSeeding(true);
    setError(null);
    const { error: seedError } = await supabase.from("products").insert(
      PRODUCTS.map((p) => ({
        name: p.name,
        category: p.category,
        price: p.price,
        unit: p.unit,
        spec: p.spec,
        image_url: p.image,
        is_active: true,
      })),
    );
    setSeeding(false);
    if (seedError) {
      setError(seedError.message);
      return;
    }
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
        delete them individually — the site shows those starter products only until real ones exist
        in this table. Mark up to {MAX_FEATURED} as "Featured" to control exactly which fabrics show
        in the homepage row — leave none marked and the site falls back to the latest {MAX_FEATURED}
        .
      </p>

      {editing && (
        <form onSubmit={handleSubmit} className="border-border mt-6 space-y-4 border p-5">
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
                {CATEGORIES.map((c) => (
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

          <label className="block">
            <span className="label-caps text-muted-foreground">Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              className="mt-2 block text-sm"
            />
            {uploading && <p className="text-muted-foreground mt-1 text-xs">Uploading...</p>}
            {form.image_url && (
              <img src={form.image_url} alt="Preview" className="mt-3 h-24 w-24 object-cover" />
            )}
          </label>

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

          {error && <p className="text-destructive text-sm">{error}</p>}

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
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No products yet. The public site shows the seed catalogue until you add some here.
          </p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-border text-muted-foreground label-caps border-b">
                <th className="py-3 pr-2">
                  <input
                    type="checkbox"
                    aria-label="Select all products"
                    checked={selectedIds.size === products.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="py-3">Name</th>
                <th className="py-3">Category</th>
                <th className="py-3">Price</th>
                <th className="py-3">Active</th>
                <th className="py-3">Featured</th>
                <th className="py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((row) => (
                <tr key={row.id} className="border-border border-b">
                  <td className="py-3 pr-2">
                    <input
                      type="checkbox"
                      aria-label={`Select ${row.name}`}
                      checked={selectedIds.has(row.id)}
                      onChange={() => toggleSelected(row.id)}
                    />
                  </td>
                  <td className="py-3">{row.name}</td>
                  <td className="text-muted-foreground py-3">{row.category}</td>
                  <td className="py-3">
                    ₹{row.price}/{row.unit}
                  </td>
                  <td className="py-3">
                    <button onClick={() => toggleActive(row)} className="label-caps text-primary">
                      {row.is_active ? "Yes" : "No"}
                    </button>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => toggleFeatured(row)}
                      className={`label-caps ${row.is_featured ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {row.is_featured ? "Yes" : "No"}
                    </button>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => startEdit(row)} aria-label="Edit">
                        <Pencil className="text-muted-foreground hover:text-primary h-4 w-4" />
                      </button>
                      <button onClick={() => remove(row.id)} aria-label="Delete">
                        <Trash2 className="text-muted-foreground hover:text-destructive h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
