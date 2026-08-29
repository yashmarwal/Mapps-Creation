# Fabric Dreams Studio

Mapps Creation — Surat, Gujarat. Wholesale trader/distributor of Lycra, knitted, and polyester-lycra fabrics for garment manufacturing (sportswear, streetwear, knitwear). GST-registered proprietorship, est. 2024, owner P Agarwal, team up to 10. Phone/WhatsApp: +91 7949338795. Inquiry-only B2B site — no cart, no checkout.

Brand line: "Knitting Dreams Into Reality"

2. BRAND IDENTITY (from the logo)

--navy-deep: #0F2038 — primary dark background

--maroon-wine: #481B2C — secondary dark, gradients/accent blocks

--gold: #C9A66B — primary accent, CTAs, borders, monogram

--gold-bright: #E8DCC0 — hover/highlight, gradient top-stop

--ivory: #F7F3EA — light-mode background/cards

--ink: #201A15 — body text on light backgrounds

Typography: Cormorant Garamond (display/serif headings) + Inter (body/UI). Small-caps, wide letter-spacing on nav and section labels.

Motifs: diagonal navy→maroon gradient/silk-drape backgrounds, thin gold hairline rules, subtle grain overlay on dark sections, the M/C monogram used sparingly as a loading/watermark element.

(Hex values are pixel-sampled from the logo JPEG — confirm against source file before locking design tokens.)

3. WHAT WAS ANALYZED — FUNCTIONS, NOT JUST THEMES

All three codebases run the same core stack: React 19, Vite, Tailwind v4, Framer Motion, Lenis, Supabase, Radix/shadcn primitives. Below is what each one actually does, mechanically:

Taj Attire — reusable primitive library (MagneticButton, SplitHeading, FadeLines, CurtainImage, CountUp, Parallax), a full section library (Marquee, Statement, Collections, Stats, HowItWorks, CtaBand, FloatingWhatsApp, FAQ), grain-overlay CSS utility, emerald/gold luxury tokens.

Tanish Creation — same primitive philosophy, warm cream/terracotta OKLCH-based tokens, AnimatedNumber, CatalogueGrid, BulkOrder inquiry flow, ExitIntent capture, FactoryVisitForm, FloatingWhatsApp.

INS Overseas — the most feature-complete of the three. Concretely:

CustomCursor.tsx — magnetic dot + lagging ring cursor (desktop only, pointer: fine media query gate), with default / hover / view states that resize and relabel based on what's under the pointer. Explicitly disabled on /admin.

Preloader.tsx — branded loading screen: gold line draws in (0→60px), wordmark fades up, radial gold glow fades in behind it, whole screen slides up (y: "-100vh") to reveal the site. ~1.5s total.

HeroSection.tsx — animations are timed relative to preloader exit (BASE = 2.1s), not on mount — so nothing double-animates. Headline reveals line-by-line with a clipped "stamp up" motion (y: "100%" → "0%", custom cubic-bezier [0.22,1,0.36,1]). Separate GIF/image assets for mobile vs desktop hero background.

useSmoothScroll.ts — Lenis-driven inertia scroll (duration: 1.2, custom exponential easing), wired into requestAnimationFrame.

useCounter.ts — IntersectionObserver-gated count-up (only fires once, when 40% visible), cubic ease-out.

StickyCtaBar.tsx — appears after 90% of one viewport of scroll, disappears near the footer. Desktop: rotated side-rail tab. Mobile: floating pill with a glow, cycling through 4 different CTA messages every 3 seconds ("Request Catalogue" → "WhatsApp Us" → "Get Free Samples" → "Talk to Our Team").

WhatsAppButton.tsx — fixed floating button with a looping pulse-ring animation, icon rotates on hover, label slides out from behind the icon on hover instead of always being visible.

Navigation.tsx — transparent-over-hero navbar that crossfades to a solid, blurred, bordered bar on scroll (scrolled state at 80px), condenses the wordmark to initials on mobile.

ProductCard.tsx — staggered scroll-reveal per card (delay: (i % 6) * 0.05), slow 2000ms image zoom on hover, mailto-based enquiry link with a pre-filled subject/body as a fallback next to WhatsApp.

useSiteImage.ts — admin-manageable images beyond just products: any named "section" (e.g. hero, about-banner) pulls its image from a Supabase site_images table with an in-memory cache and a coded default fallback if no row exists yet. This is directly reusable for Mapps.

useFormSubmit.ts — thin hook around Web3Forms' API (no backend needed) with idle/submitting/success/error states and auto-reset timers.

lib/seo.ts — a buildPageHead() utility that emits title, description, canonical, full Open Graph + Twitter Card meta, and optional JSON-LD schema per route in one call.

use-mobile.tsx — a simple useIsMobile() hook off matchMedia, used to branch behavior (not just CSS) where needed, e.g. disabling the custom cursor entirely on touch devices.

Takeaway for Mapps: build the same mechanisms — timed preloader→hero handoff, scroll-gated sticky CTA with rotating messages, IntersectionObserver counters, admin-manageable section images, a real SEO head utility — restyled to navy/maroon/gold and rewritten for fabric-trading content. Don't reuse INS Overseas' leather-journal copy or Taj Attire's garment copy.

4. ANIMATION SYSTEM (build these explicitly — "cool and fast," not decorative)

Preloader: gold line-draw + wordmark/monogram fade-up + radial glow, ~1.2–1.5s, then slides away. Hero animations are timed to start right after this exits (don't animate on mount and also run a preloader — sequence them like INS Overseas does).

Hero headline: line-by-line clipped "stamp" reveal (overflow-hidden wrapper + inner y: 100%→0%), cubic-bezier [0.22,1,0.36,1] — reads as sharp and mechanical, not soft/bouncy.

Scroll reveals: every section and product card fades/slides in on scroll via IntersectionObserver or Framer's whileInView, staggered by index (delay: (i % 6) * 0.05) so grids cascade instead of popping in at once.

Counters: trust-stat numbers (years established, categories offered) count up only once, triggered at ~40% visibility, cubic ease-out, ~2s duration.

Smooth scroll: Lenis on the whole page (duration: 1.2), gives scrolling a weighted, premium feel instead of the default browser snap.

Micro-interactions: magnetic pull on primary CTA buttons, underline-grow on nav links on hover, image zoom (scale-110 over ~2000ms) on product card hover, WhatsApp button pulse-ring loop + hover label slide-out.

Navbar: transparent over the hero, crossfades to solid navy + blur + gold hairline border once scrolled past ~80px.

Sticky conversion bar: appears after ~90% of one viewport scrolled, hides near the footer, cycles between 3–4 short CTA messages every few seconds instead of showing one static line the whole time.

Easing discipline: stick to the two cubic-beziers used across all three reference codebases — [0.22,1,0.36,1] for reveals/entrances, [0.16,1,0.3,1] for UI micro-interactions (buttons, pills, dropdowns). Consistency here is what makes it feel "designed" instead of default Framer Motion presets.

Respect prefers-reduced-motion: fall back to simple opacity fades, no cursor/parallax/stamp effects, for users who've set that preference.

5. RESPONSIVENESS SYSTEM

useIsMobile() hook (matchMedia, 768px breakpoint) to branch behavior, not just layout — e.g. disable the custom cursor entirely on touch devices (it only makes sense with a real mouse), swap the sticky side-rail for a floating bottom pill on mobile.

Separate hero background assets for mobile vs desktop where it matters (crop/composition differs, not just scaled down).

env(safe-area-inset-bottom) padding on anything fixed to the bottom (floating WhatsApp button, sticky CTA pill) so it clears the home-indicator area on notched phones.

Minimum 52px touch targets on primary mobile CTAs (min-h-[52px]) even where the desktop equivalent is smaller.

Condensed nav on mobile: full wordmark → initials/monogram, hamburger menu with a full-screen overlay, same stagger-reveal treatment on the menu links as the rest of the site.

Fluid type via clamp() for all display headings (e.g. clamp(48px, 8vw, 120px)) instead of fixed breakpoint font sizes.

6. TECH STACK

React 19 + Vite

TanStack Router

Tailwind CSS v4

Framer Motion

Lenis (smooth scroll)

Supabase (Postgres + Auth + Storage)

Google Fonts: Cormorant Garamond + Inter

Web3Forms (or Supabase-backed form) for contact/inquiry submission — no custom backend needed

Deployment: Vercel

(Optional, not v1: react-simple-maps + d3-geo if Mapps later wants a "states/countries we supply to" map — INS Overseas' GlobalReach.tsx proves the pattern out, but skip it for the first pass to keep scope tight.)

7. SITE STRUCTURE

Pages

Home — Preloader → Hero (stamp reveal) → Marquee (category strip) → Statement → featured Catalogue slice → Why/Stats (counters) → HowItWorks → CtaBand → FAQ → Footer

Products/Catalogue — full catalog, filterable by category, staggered card grid with CurtainImage-style reveal

About — brand story tied to "Knitting Dreams Into Reality," facts (est. 2024, GST, team size), real warehouse/infrastructure photos framed with the gold-hairline/grain treatment

Contact — form (Web3Forms or Supabase) + WhatsApp + Call + address

Product Categories

Lycra Fabric · Lycra Knitted Fabric · Polyester Lycra Fabric · Melange Fabric · T-Shirt Fabric · Twill Fabric · Matty Fabric · Other Products

Catalog data: seed Supabase with placeholder products per category (name, category, price/unit, placeholder image, short spec); real products go in via the admin panel.

8. HOME PAGE COPY DIRECTION

Hero headline (line-by-line stamp reveal): "Knitting Dreams Into Reality" — as the emotional headline, not just a tagline.

Subheadline: "Mapps Creation supplies premium Lycra, knitted, and polyester-lycra fabrics to garment manufacturers and exporters across India — sourced, tested, and delivered from Surat."

Primary CTA: "WhatsApp Us" · Secondary CTA: "Explore the Catalogue"

Trust strip: GST Registered · Est. 2024 · Surat, Gujarat · Wholesale & Bulk Supply

Statement section: "Every roll carries a standard — consistent quality, honest pricing, and fabric that performs the way your production line needs it to."

Why section: direct-from-source pricing · sold by kg or meter to match order size · Surat-based for fast dispatch · quality checked before it ships

9. ADMIN PANEL

Auth-gated (Supabase Auth, single admin = P Agarwal), separate from public routes:

Product CRUD: name, category (fixed dropdown), price, unit (kg/meter), short spec, image upload (Supabase Storage), active/inactive toggle, table view with quick edit

Site image management (new, from the useSiteImage pattern): let the admin swap out key section backdrops (hero, about banner, category headers) without a redeploy — same site_images table + in-memory cache + coded default fallback approach

No order management, multi-user roles, or analytics in v1

Schema:

products
- id (uuid)
- name (text)
- category (text, enum-like from fixed list)
- price (numeric)
- unit (text: 'kg' | 'meter')
- spec (text, short e.g. "220 GSM, 4-Way Stretch")
- image_url (text, Supabase Storage path)
- is_active (boolean, default true)
- created_at (timestamp)

site_images
- id (uuid)
- section (text, e.g. 'hero', 'about-banner')
- url (text, Supabase Storage path)
- created_at (timestamp)

10. IMAGES

Seeded placeholder products: clean, generic fabric/textile stock-style images, swapped later via admin

Hero/section backdrops: navy→maroon gradient + grain overlay, optional soft-focus draped-fabric photography

Real warehouse/infrastructure photos: used on About, framed with the gold-hairline/grain treatment

11. CONTACT & CONVERSION

WhatsApp click-to-chat on every product card (pre-filled: "Hi, I'm interested in [Product Name]")

Mailto fallback next to WhatsApp on product cards (pre-filled subject + body), same pattern as INS Overseas' ProductCard

"Call Now" tel: link, visible in header on mobile

Contact form → Web3Forms or Supabase, idle/submitting/success/error states with a clear success message, no payment flow

Sticky bottom CTA (mobile) / side-rail tab (desktop), scroll-gated, cycling between 3–4 short messages

12. SEO

Per-route buildPageHead()-style utility: title, description, canonical, full Open Graph + Twitter Card meta, optional JSON-LD schema (Organization + BreadcrumbList at minimum)

Target queries: "Lycra fabric supplier Surat," "wholesale knit fabric India," "Lycra fabric manufacturer Gujarat"

Semantic headings, alt text on all product images, lazy-loaded below-the-fold images

13. VERCEL DEPLOYMENT

Framework preset: Vite (auto-detected) · Build: vite build · Output: dist · Install: npm install

SPA routing fix (required) — add vercel.json:

json

{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}

Environment variables (Vercel dashboard, not committed):

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

Checklist: .env gitignored · vercel.json rewrite in place · Supabase Storage bucket public-read · custom domain pointed once ready

14. PERFORMANCE CHECKLIST (ties "fast" animations to actually being fast)

Lazy-load all below-the-fold images and defer non-critical scripts

Cap Lenis/scroll-linked work to transform/opacity only — never animate layout properties (width/height/top/left) on scroll, it tanks frame rate

Custom cursor and parallax effects gated behind matchMedia("(hover: hover) and (pointer: fine)") so mobile never pays their cost

IntersectionObserver (not scroll-event listeners) for every scroll-triggered reveal/counter

One preloader run per session (not per route change) so navigating the site doesn't replay a 1.5s branded animation every click

## Development

You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
