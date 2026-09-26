import { createFileRoute } from "@tanstack/react-router";
import { Reveal, StampHeading } from "@/components/site/motion";
import { breadcrumbSchema, buildPageHead, SITE } from "@/lib/seo";

export const Route = createFileRoute("/cookies")({
  head: () =>
    buildPageHead({
      title: "Cookies Policy | Mapps Creation",
      description:
        "What cookies, local storage and trackers Mapps Creation actually uses, and how to control them.",
      path: "/cookies",
      jsonLd: breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Cookies Policy", path: "/cookies" },
      ]),
    }),
  component: CookiesPage,
});

const LAST_UPDATED = "26 September 2026";

type Row = { name: string; category: "Essential" | "Analytics" | "Marketing"; purpose: string };

const ROWS: Row[] = [
  {
    name: "quote-basket (localStorage)",
    category: "Essential",
    purpose:
      "Remembers the products you've added to the Bulk Quote Builder so your list is still there when you come back, on the same device and browser.",
  },
  {
    name: "sb-*-auth-token (localStorage)",
    category: "Essential",
    purpose:
      "Supabase's admin session token. Only set after our staff signs in at /admin/login; ordinary visitors never get this. Required for the admin dashboard to work at all.",
  },
];

function CategoryBadge({ category }: { category: Row["category"] }) {
  const styles: Record<Row["category"], string> = {
    Essential: "bg-primary/15 text-primary border-primary/40",
    Analytics: "bg-secondary/15 text-secondary border-secondary/40",
    Marketing: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={`label-caps inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] ${styles[category]}`}
    >
      {category}
    </span>
  );
}

function CookiesPage() {
  return (
    <div className="pt-28 md:pt-36">
      <section className="mx-auto max-w-3xl px-5 md:px-10 pb-24 md:pb-32">
        <Reveal>
          <p className="label-caps text-primary">Legal</p>
          <StampHeading lines={["Cookies Policy"]} className="display-lg mt-4" />
          <p className="text-muted-foreground mt-6 text-sm">Last updated: {LAST_UPDATED}</p>
        </Reveal>

        <Reveal index={1}>
          <div className="border-border mt-14 border-t pt-6">
            <h2 className="font-display text-xl md:text-2xl">The honest version</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed md:text-base">
              This site does not set advertising cookies, tracking pixels, or third-party analytics
              cookies of any kind — we don't run Google Analytics, Meta Pixel, or any similar
              service. What we do use is your browser's own <strong>local storage</strong> (a
              cookie-adjacent mechanism that, like a cookie, stores a small piece of data on your
              device) for the essential, functional purposes listed below. Because none of it is
              used to track you across sites or to advertise to you, and everything below is
              necessary for a feature you're actively using, none of it requires consent under
              Indian or EU cookie law. We're listing it here anyway, in full, rather than saying
              nothing.
            </p>
          </div>
        </Reveal>

        <Reveal index={2}>
          <div className="border-border mt-12 border-t pt-6">
            <h2 className="font-display text-xl md:text-2xl">What's stored today</h2>
            <div className="mt-6 space-y-5">
              {ROWS.map((row) => (
                <div key={row.name} className="border-border/60 border p-4 md:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <code className="text-foreground font-mono text-xs md:text-sm">{row.name}</code>
                    <CategoryBadge category={row.category} />
                  </div>
                  <p className="text-muted-foreground mt-2.5 text-sm leading-relaxed">
                    {row.purpose}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal index={3}>
          <div className="border-border mt-12 border-t pt-6">
            <h2 className="font-display text-xl md:text-2xl">
              Analytics and marketing — none right now
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed md:text-base">
              We currently run no Analytics or Marketing category cookies or scripts. If that ever
              changes (for example, if we add a visitor-analytics tool), we'll update this page to
              name the specific service, what it collects, and how to opt out before turning it on —
              not after.
            </p>
          </div>
        </Reveal>

        <Reveal index={4}>
          <div className="border-border mt-12 border-t pt-6">
            <h2 className="font-display text-xl md:text-2xl">Third-party links, not embeds</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed md:text-base">
              Our WhatsApp and Instagram links open those services directly in a new tab; we don't
              embed their widgets on this site, so they can't read this site's cookies or leak this
              site's referrer data. Once you're on WhatsApp or Instagram, their own cookie and
              privacy policies apply.
            </p>
          </div>
        </Reveal>

        <Reveal index={5}>
          <div className="border-border mt-12 border-t pt-6">
            <h2 className="font-display text-xl md:text-2xl">Managing what's stored</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed md:text-base">
              There's nothing to opt out of today — the two items above only exist because you're
              using the feature they support (the Bulk Quote Builder, or the admin login), and
              nothing here tracks you or is shared with anyone. You can clear either at any time
              through your browser's site-data settings, which will simply reset your quote list or
              sign you out of admin.
            </p>
          </div>
        </Reveal>

        <Reveal index={6}>
          <div className="border-border mt-12 border-t pt-6">
            <h2 className="font-display text-xl md:text-2xl">Related policies</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed md:text-base">
              See our{" "}
              <a
                href="/privacy"
                className="text-primary hover:text-foreground underline underline-offset-2"
              >
                Privacy Policy
              </a>{" "}
              for how we handle personal data you give us directly, or contact us at{" "}
              <a
                href={`mailto:${SITE.email}`}
                className="text-primary hover:text-foreground underline underline-offset-2"
              >
                {SITE.email}
              </a>{" "}
              with questions.
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
