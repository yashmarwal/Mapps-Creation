import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, Mail, SendHorizontal } from "lucide-react";
import { useRef } from "react";

import heroDesktopVideo from "@/assets/hero-desktop.mp4";
import heroMobileVideo from "@/assets/hero-mobile.mp4";
import warehouse from "@/assets/warehouse.jpg";
import { CATEGORIES } from "@/data/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import {
  CountUp,
  EASE_REVEAL,
  MagneticButton,
  Reveal,
  StampHeading,
  WordReveal,
} from "@/components/site/motion";
import { FounderSection } from "@/components/site/FounderSection";
import { WhatsAppIcon } from "@/components/site/icons/WhatsAppIcon";
import { useIntro } from "@/components/site/Preloader";
import { SupplyTree } from "@/components/site/SupplyTree";
import { FabricReels } from "@/components/site/FabricReels";
import { useProducts } from "@/hooks/useProducts";
import { useSiteImage } from "@/hooks/useSiteImage";
import { SiteMedia } from "@/components/site/SiteMedia";
import {
  breadcrumbSchema,
  buildPageHead,
  faqSchema,
  organizationSchema,
  websiteSchema,
  whatsappLink,
} from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    buildPageHead({
      title: "Mapps Creation — Lycra Fabric Supplier in Surat, Gujarat",
      description:
        "Wholesale trader of Lycra, knitted and polyester-lycra fabrics for garment manufacturers and exporters across India. Sourced, tested and dispatched from Surat.",
      path: "/",
      jsonLd: [
        organizationSchema,
        websiteSchema,
        breadcrumbSchema([{ name: "Home", path: "/" }]),
        faqSchema(FAQS),
      ],
    }),
  component: Home,
});

const TRUST = [
  "GST Registered",
  "1000+ Clients Served",
  "Surat, Gujarat",
  "Wholesale & Bulk Supply",
] as const;

const WHY = [
  {
    title: "Direct-from-source pricing",
    body: "Mill-linked sourcing in Surat keeps your landed cost lower without dropping quality.",
  },
  {
    title: "Sold by kg or meter",
    body: "Order in the unit your production planning actually uses — small trials to bulk programmes.",
  },
  {
    title: "Fast dispatch from Surat",
    body: "India's knit hub on our doorstep means shorter lead times and quicker reorders.",
  },
  {
    title: "Quality checked before shipping",
    body: "GSM, shade and stretch recovery verified roll by roll before anything leaves us.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Share your requirement",
    body: "Send fabric type, GSM, shade and quantity over WhatsApp or the enquiry form.",
  },
  {
    step: "02",
    title: "Samples & quotation",
    body: "We match the closest quality from stock, share swatches and confirm rate per kg or meter.",
  },
  {
    step: "03",
    title: "Approval & production",
    body: "Once the swatch is approved, we reserve or knit-to-order and dye to your shade.",
  },
  {
    step: "04",
    title: "Dispatch",
    body: "Quality-checked rolls packed and dispatched from Surat with transport documentation.",
  },
];

const DISPATCH_CITIES = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Tirupur",
  "Ludhiana",
  "Kolkata",
  "Chennai",
  "Ahmedabad",
  "Jaipur",
  "Indore",
] as const;

const FAQS = [
  {
    q: "What is your minimum order quantity?",
    a: "MOQ depends on the fabric and shade — stock qualities can start from a single roll, while dyed-to-order shades typically start around 50 kg per colour. Message us with your requirement for an exact answer.",
  },
  {
    q: "Do you sell by kilogram or by meter?",
    a: "Both. Knitted qualities are usually traded by kg and woven qualities such as twill and matty by meter. We quote in whichever unit suits your costing.",
  },
  {
    q: "Can I get samples before ordering?",
    a: "Yes. We share swatches of the closest matching quality free of charge; courier is arranged at actuals for outstation buyers.",
  },
  {
    q: "Do you supply outside Gujarat?",
    a: "Yes — we regularly supply garment manufacturers and exporters across India via road transport from Surat.",
  },
  {
    q: "Can you match a shade or GSM I already use?",
    a: "Send your existing swatch or specification and we will match GSM, blend and shade as closely as the base quality allows.",
  },
];

function Home() {
  const { ready, base } = useIntro();
  const { featured } = useProducts();

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  const heroVideoMobileSrc = useSiteImage("hero-video-mobile", heroMobileVideo);
  const heroVideoDesktopSrc = useSiteImage("hero-video-desktop", heroDesktopVideo);

  return (
    <>
      {/* HERO */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-end overflow-hidden">
        <motion.div
          className="absolute inset-x-0 -top-[8%] h-[118%] transform-gpu will-change-transform"
          style={{ y: heroY, transform: "translateZ(0)" }}
        >
          <div className="absolute inset-0 md:hidden">
            <SiteMedia
              src={heroVideoMobileSrc}
              alt="Draped navy and maroon lycra fabric"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 hidden md:block">
            <SiteMedia
              src={heroVideoDesktopSrc}
              alt="Draped navy and maroon lycra fabric"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
        <div className="from-background via-background/70 absolute inset-0 bg-gradient-to-t to-transparent" />
        <div className="grain absolute inset-0" />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-32 md:px-10 md:pb-28">
          <motion.p
            className="editorial-tag mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.7, ease: EASE_REVEAL, delay: base }}
          >
            01 / SURAT TEXTILE HUB
          </motion.p>

          <StampHeading
            as="h1"
            lines={["Knitting Dreams", "Into Reality"]}
            delay={base + 0.1}
            play={ready}
            className="display-xl mt-4 max-w-4xl text-gold-gradient"
            lineClassName="text-foreground"
          />

          <motion.p
            className="text-muted-foreground mt-7 max-w-xl text-base leading-relaxed md:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.8, ease: EASE_REVEAL, delay: base + 0.45 }}
          >
            Mapps Creation supplies premium Lycra, knitted, and polyester-lycra fabrics to garment
            manufacturers and exporters across India — sourced, tested, and delivered from Surat.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.8, ease: EASE_REVEAL, delay: base + 0.6 }}
          >
            <a
              href={whatsappLink("Hi Mapps Creation, I'd like to discuss a fabric requirement.")}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp Us"
              className="btn-enquire !min-h-[52px] !text-xs !px-7"
            >
              <span>
                <SendHorizontal className="h-4 w-4" />
                Quick Enquiry
              </span>
            </a>
            <Link
              to="/catalogue"
              className="border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground label-caps hidden min-h-[52px] items-center gap-2 border px-7 transition-colors duration-500 sm:inline-flex"
            >
              Explore the Catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.ul
            className="border-border text-muted-foreground mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t pt-6 text-xs tracking-[0.18em] uppercase"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE_REVEAL, delay: base + 0.8 }}
          >
            {TRUST.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="bg-primary h-1 w-1 rotate-45" /> {item}
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* MARQUEE */}
      <section
        className="border-border overflow-hidden border-y py-5"
        aria-label="Fabric categories"
      >
        <div className="marquee-track flex w-max">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex" aria-hidden={pass === 1}>
              {CATEGORIES.map((category) => (
                <span
                  key={`${pass}-${category}`}
                  className="font-display text-muted-foreground flex items-center gap-6 px-8 text-xl whitespace-nowrap"
                >
                  {category}
                  <span className="text-primary text-xs">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* STATEMENT */}
      <section className="silk grain relative py-24 md:py-36">
        <div className="relative mx-auto max-w-4xl px-5 text-center md:px-10">
          <Reveal>
            <p className="label-caps text-primary">The Standard</p>
          </Reveal>
          <WordReveal
            text="Every roll carries a standard — consistent quality, honest pricing, and fabric that performs the way your production line needs it to."
            className="font-display mt-7 block text-[clamp(1.6rem,3.6vw,2.9rem)] leading-[1.25]"
          />
          <Reveal index={2}>
            <div className="hairline mx-auto mt-10 max-w-xs" />
          </Reveal>
        </div>
      </section>

      {/* FEATURED CATALOGUE */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-6 gold-glow-radial">
          <div>
            <p className="editorial-tag">02 / CATALOGUE</p>
            <h2 className="display-lg mt-3 text-gold-gradient">Fabrics we move every week</h2>
          </div>
          <Link
            to="/catalogue"
            className="label-caps text-muted-foreground hover:text-primary group inline-flex items-center gap-2 transition-colors"
          >
            View full catalogue
            <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
          </Link>
        </Reveal>

        {/* Mobile: 1-Column Vertical List (< 640px) */}
        <div className="mt-8 space-y-4 sm:hidden">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Tablet / Desktop: Grid (>= 640px) */}
        <div className="mt-12 hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Centered CTA button after 6 products */}
        <Reveal className="mt-10 sm:mt-14 flex justify-center">
          <Link
            to="/catalogue"
            className="bg-primary text-primary-foreground font-semibold label-caps inline-flex min-h-[50px] items-center justify-center gap-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer text-xs tracking-wider group"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>

      <FabricReels />

      {/* WHY + STATS */}
      <section className="surface-ivory grain relative py-24 md:py-32">
        <div className="relative mx-auto max-w-7xl px-5 md:px-10">
          <Reveal>
            <p className="label-caps text-secondary">Why Mapps Creation</p>
            <h2 className="display-lg mt-4 max-w-2xl">
              A fabric partner built around your production calendar
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {WHY.map((item, i) => (
              <Reveal key={item.title} index={i}>
                <div className="border-border border-t pt-6">
                  <h3 className="flex items-center gap-3 text-2xl">
                    <Check className="text-secondary h-5 w-5" /> {item.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: 500, suffix: "+", label: "Fabric Varieties" },
              { value: 1000, suffix: "+", label: "Clients Served" },
              { text: "Pan India", label: "Dispatch Coverage" },
              { value: 100, suffix: "%", label: "Rolls quality checked" },
            ].map((stat, i) => (
              <Reveal key={stat.label} index={i}>
                <div className="text-center md:text-left">
                  <p className="font-display text-secondary text-[clamp(2.4rem,5vw,3.8rem)] leading-none">
                    {"text" in stat ? stat.text : <CountUp to={stat.value} suffix={stat.suffix} />}
                  </p>
                  <p className="label-caps text-muted-foreground mt-3">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <Reveal className="gold-glow-radial">
          <p className="editorial-tag">03 / HOW IT WORKS</p>
          <h2 className="display-lg mt-3 text-gold-gradient">From enquiry to dispatch</h2>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.step} index={i}>
              <div className="border-border h-full border-t pt-6">
                <span className="font-display text-primary text-3xl">{step.step}</span>
                <h3 className="mt-3 text-xl">{step.title}</h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PAN-INDIA DISPATCH */}
      <section className="border-border border-y py-16 md:py-24">
        <Reveal className="mx-auto max-w-7xl px-5 text-center md:px-10 gold-glow-radial">
          <p className="editorial-tag">04 / PAN-INDIA DISPATCH</p>
          <h2 className="display-lg mt-3 text-gold-gradient">Connected to India's Garment Hubs</h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-sm leading-relaxed">
            Quality-checked rolls leave Surat by road every week for garment manufacturing hubs
            across the country.
          </p>
        </Reveal>

        <Reveal index={1} className="mt-14 px-5">
          <SupplyTree />
        </Reveal>

        <div className="mt-12 overflow-hidden" aria-label="Cities we dispatch to">
          <div className="marquee-track flex w-max">
            {[0, 1].map((pass) => (
              <div key={pass} className="flex" aria-hidden={pass === 1}>
                {DISPATCH_CITIES.map((city) => (
                  <span
                    key={`${pass}-${city}`}
                    className="font-display text-muted-foreground flex items-center gap-6 px-8 text-2xl whitespace-nowrap"
                  >
                    {city}
                    <span className="text-primary text-xs">◆</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEET THE FOUNDER */}
      <FounderSection />

      {/* CTA BAND */}
      <section className="relative overflow-hidden">
        <img
          src={warehouse}
          alt="Fabric rolls stacked in the Mapps Creation warehouse in Surat"
          loading="lazy"
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="silk grain absolute inset-0 opacity-80" />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center md:px-10 md:py-32">
          <Reveal>
            <h2 className="display-lg">Tell us what you're knitting</h2>
            <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-sm leading-relaxed md:text-base">
              Share your fabric type, GSM and quantity — we'll come back with swatches and a rate
              the same working day.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a
                href={whatsappLink("Hi Mapps Creation, please share a quotation.")}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Us"
                className="btn-enquire !min-h-[52px] !text-xs !px-7"
              >
                <span>
                  <SendHorizontal className="h-4 w-4" />
                  Quick Enquiry
                </span>
              </a>
              <Link
                to="/contact"
                className="btn-enquire btn-enquire-navy !min-h-[52px] !text-xs !px-7"
              >
                <span>
                  <Mail className="h-4 w-4" />
                  Email Desk
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <p className="label-caps text-primary">FAQ</p>
          <h2 className="display-lg mt-4">Questions buyers ask us</h2>
        </Reveal>
        <div className="mt-10 divide-border divide-y border-border border-y">
          {FAQS.map((faq, i) => (
            <Reveal key={faq.q} index={i}>
              <details className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg">
                  {faq.q}
                  <span className="text-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{faq.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
        <Reveal index={FAQS.length} className="mt-8 text-center">
          <Link
            to="/faq"
            className="label-caps text-primary hover:text-foreground inline-flex items-center gap-2 transition-colors"
          >
            View all FAQs <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
