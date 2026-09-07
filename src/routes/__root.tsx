import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

import appCss from "../styles.css?url";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { IntroProvider } from "@/components/site/Preloader";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { StickyCta } from "@/components/site/StickyCta";
import { AskUsChat } from "@/components/site/AskUsChat";
import { MobileActionBar } from "@/components/site/MobileActionBar";
import { TopMarquee, useMarqueeSettings } from "@/components/site/TopMarquee";
import { PromoPopup } from "@/components/site/PromoPopup";
import { QuoteDrawer } from "@/components/site/QuoteDrawer";
import { DownloadCatalogModal } from "@/components/site/DownloadCatalogModal";
import { SearchModal } from "@/components/site/SearchModal";
import { QuoteBasketProvider } from "@/hooks/useQuoteBasket";
import { EASE_UI } from "@/components/site/motion";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

function NotFoundComponent() {
  return (
    <div className="silk grain flex min-h-screen items-center justify-center px-4">
      <div className="relative max-w-md text-center">
        <h1 className="font-display text-primary text-7xl">404</h1>
        <h2 className="mt-4 text-xl">Page not found</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="bg-primary text-primary-foreground label-caps inline-flex items-center justify-center px-5 py-3"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl tracking-tight">This page didn't load</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-primary text-primary-foreground label-caps inline-flex items-center justify-center px-5 py-3"
          >
            Try again
          </button>
          <a
            href="/"
            className="border-border label-caps inline-flex items-center justify-center border px-5 py-3"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mapps Creation | Lycra & Knitted Fabric Supplier, Surat" },
      {
        name: "description",
        content:
          "Wholesale Lycra, knitted and polyester-lycra fabrics for garment manufacturing, supplied from Surat, Gujarat.",
      },
      { name: "author", content: "Mapps Creation" },
      { name: "theme-color", content: "#0F2038" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      // Fonts are now self-hosted (see styles.css) — no external Google
      // Fonts request, so no preconnect/stylesheet needed here anymore.
    ],
    // Organization + WebSite JSON-LD, once here at the root so it's present
    // on every indexable page (helps AI/search engines resolve "who is behind
    // this site" no matter which page they land on first). Individual routes
    // only add their own page-specific schema (breadcrumb, FAQ, product list,
    // etc.) — never re-declare Organization/WebSite, or it'll be duplicated.
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([organizationSchema, websiteSchema]),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// Regular useEffect fires *after* the browser paints — for a scroll-position
// reset, that means one visible frame (sometimes more) of the new page
// rendered at the OLD scroll offset before it snaps to top, which reads as a
// jitter/flash on every navigation. useLayoutEffect runs synchronously right
// after the DOM updates but before paint, so the reset happens before the
// user ever sees the wrong position. It's a no-op during SSR (React skips
// effects there entirely), but React still warns about using it in
// server-rendered code, hence the typeof-window guard, matching the
// standard "useIsomorphicLayoutEffect" idiom.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  // `location.pathname` flips to the target route the instant navigation
  // *starts* — before that route's code has even finished loading. Keying
  // the page-transition div (and the scroll reset) off that meant a route
  // visited for the first time (its chunk not cached yet) would unmount the
  // outgoing page immediately and render a blank Outlet until the new chunk
  // arrived, reading as "the page refreshes, then switches." `resolvedLocation`
  // is a separate store TanStack Router only updates once the navigation has
  // fully resolved (code loaded, ready to render) — exactly the "safe to swap
  // now" signal we want, so the outgoing page stays put until the new one is
  // actually ready instead of leaving a gap. Falls back to `location` for the
  // very first render, before any client-side nav has happened yet.
  const pathname = useRouterState({
    select: (s) => s.resolvedLocation?.pathname ?? s.location.pathname,
  });
  const isAdmin = pathname.startsWith("/admin");
  const { settings: marquee, visible: marqueeVisible } = useMarqueeSettings();
  const [askOpen, setAskOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useSmoothScroll();

  useIsomorphicLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
      window.__lenis.resize();
    }
  }, [pathname]);

  // Global Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isAdmin) {
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <QuoteBasketProvider>
        <IntroProvider>
          <TopMarquee visible={marqueeVisible} text={marquee.text} />
          <Navigation
            marqueeVisible={marqueeVisible}
            onOpenCatalog={() => setCatalogOpen(true)}
            onOpenSearch={() => setSearchOpen(true)}
          />
          <main>
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </main>
          <Footer />
          <WhatsAppButton />
          <StickyCta />
          <PromoPopup />
          <QuoteDrawer />
          <AskUsChat
            open={askOpen}
            onOpenChange={setAskOpen}
            onOpenCatalog={() => setCatalogOpen(true)}
          />
          <DownloadCatalogModal open={catalogOpen} onClose={() => setCatalogOpen(false)} />
          <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
          <MobileActionBar onOpenAsk={() => setAskOpen(true)} />
        </IntroProvider>
      </QuoteBasketProvider>
    </QueryClientProvider>
  );
}
