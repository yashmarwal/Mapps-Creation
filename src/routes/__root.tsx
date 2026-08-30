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
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

import appCss from "../styles.css?url";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { IntroProvider } from "@/components/site/Preloader";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { StickyCta } from "@/components/site/StickyCta";
import { CustomCursor } from "@/components/site/CustomCursor";
import { ExitIntent } from "@/components/site/ExitIntent";
import { AskUsChat } from "@/components/site/AskUsChat";
import { MobileActionBar } from "@/components/site/MobileActionBar";
import { TopMarquee, useMarqueeSettings } from "@/components/site/TopMarquee";
import { PromoPopup } from "@/components/site/PromoPopup";
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
      { title: "Mapps Creation — Lycra & Knitted Fabric Supplier, Surat" },
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
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");
  const { settings: marquee, visible: marqueeVisible } = useMarqueeSettings();
  const [askOpen, setAskOpen] = useState(false);
  useSmoothScroll();

  if (isAdmin) {
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <IntroProvider>
        <TopMarquee visible={marqueeVisible} text={marquee.text} />
        <Navigation marqueeVisible={marqueeVisible} />
        <main>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: EASE_UI }}
          >
            <Outlet />
          </motion.div>
        </main>
        <Footer />
        <WhatsAppButton />
        <StickyCta />
        <ExitIntent />
        <PromoPopup />
        <AskUsChat open={askOpen} onOpenChange={setAskOpen} />
        <MobileActionBar onOpenAsk={() => setAskOpen(true)} />
        <CustomCursor />
      </IntroProvider>
    </QueryClientProvider>
  );
}
