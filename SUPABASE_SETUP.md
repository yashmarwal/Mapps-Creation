# Supabase Setup — Mapps Creation

The site works out of the box with local seed data (`src/data/catalog.ts`) and no
Supabase project. Follow this once you're ready to manage products/images from
the `/admin` panel instead of editing code.

## Already have a project running? Run this once

Two things were added after the initial setup — the featured-products picker and
the Site Images "Restore default" button. If your project already existed
before, run this in the SQL editor (safe to run even if some of it already
matches):

```sql
alter table products add column if not exists is_featured boolean not null default false;

-- CREATE POLICY has no IF NOT EXISTS in Postgres — drop-then-create is the
-- safe idempotent way to (re-)apply it.
drop policy if exists "Admin delete site_images" on site_images;
create policy "Admin delete site_images" on site_images
  for delete using (auth.role() = 'authenticated');
```

## 1. Create the project

1. Go to [supabase.com](https://supabase.com) → New Project.
2. Once it's provisioned, go to **Project Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`
3. Create `.env` at the project root (copy `.env.example`) and paste both values in.

## 2. Create the tables

Run this in the Supabase SQL editor:

```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price numeric not null,
  unit text not null check (unit in ('kg', 'meter')),
  spec text not null,
  image_url text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table site_images (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  url text not null,
  created_at timestamptz not null default now()
);

alter table products enable row level security;
alter table site_images enable row level security;

-- Public (anon) can read; only signed-in users (the admin) can write.
create policy "Public read products" on products for select using (true);
create policy "Admin write products" on products for insert with check (auth.role() = 'authenticated');
create policy "Admin update products" on products for update using (auth.role() = 'authenticated');
create policy "Admin delete products" on products for delete using (auth.role() = 'authenticated');

create policy "Public read site_images" on site_images for select using (true);
create policy "Admin write site_images" on site_images for insert with check (auth.role() = 'authenticated');
create policy "Admin delete site_images" on site_images for delete using (auth.role() = 'authenticated');

-- Key/value settings used by the top marquee and offers popup (admin-editable).
create table site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Admin write site_settings" on site_settings for insert with check (auth.role() = 'authenticated');
create policy "Admin update site_settings" on site_settings for update using (auth.role() = 'authenticated');
```

## 3. Create storage buckets

**Storage → New bucket**, create two, both set to **Public**, both with a
**file size limit of 20 MB** (the site's admin upload forms enforce this same
20 MB cap client-side — see `MAX_UPLOAD_MB` in `src/lib/media.ts` — so keep
them in sync if you ever change one):

- `product-images`
- `site-images` (also holds site videos — hero background, video reels bar,
  promo popup image)

Then add write policies so only signed-in users can upload (Storage → bucket → Policies):

```sql
create policy "Admin upload product-images" on storage.objects
  for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Admin upload site-images" on storage.objects
  for insert with check (bucket_id = 'site-images' and auth.role() = 'authenticated');

create policy "Public read product-images" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "Public read site-images" on storage.objects
  for select using (bucket_id = 'site-images');
```

## 4. Create the admin login

Single admin user (P Agarwal), no self-signup:

1. **Authentication → Users → Add user** (email + password).
2. Sign in at `/admin/login` with those credentials.

## 5. Seed products (optional)

Once tables exist, add products via `/admin`, or bulk-insert the existing
catalogue from `src/data/catalog.ts` as a starting point.

## 6. Web3Forms (contact page)

Sign up free at [web3forms.com](https://web3forms.com), grab your access key,
and set `VITE_WEB3FORMS_ACCESS_KEY` in `.env`. Until it's set, the contact form
shows a friendly error asking visitors to use WhatsApp/call instead.

## 7. Vercel environment variables

Add all three vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
`VITE_WEB3FORMS_ACCESS_KEY`) under **Project Settings → Environment Variables**
on Vercel — they're not committed to the repo.
