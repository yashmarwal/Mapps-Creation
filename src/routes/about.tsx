import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import warehouse from "@/assets/warehouse.jpg";
import { CountUp, Reveal, StampHeading } from "@/components/site/motion";
import { useSiteImage } from "@/hooks/useSiteImage";
import { SiteMedia } from "@/components/site/SiteMedia";
import { breadcrumbSchema, buildPageHead } from "@/lib/seo";

import { FounderSection } from "@/components/site/FounderSection";
import { CtaBand } from "@/components/site/CtaBand";

export const Route = createFileRoute("/about")({
  head: () =>
    buildPageHead({
      title: "About Mapps Creation — Fabric Wholesaler in Surat",
      description:
        "Mapps Creation is a GST-registered wholesale trader and distributor of Lycra, knitted and polyester-lycra fabrics in Surat, trusted by 1000+ buyers across India, led by proprietor P Agarwal.",
      path: "/about",
      jsonLd: breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ]),
    }),
  component: About,
});

const FACTS = [
  { label: "Clients Served", value: "1000+" },
  { label: "Structure", value: "GST-Registered Proprietorship" },
  { label: "Proprietor / Co-Founder", value: "Pratham Aggarwal" },
  { label: "Dispatch Coverage", value: "Pan India" },
  { label: "Based in", value: "Surat, Gujarat" },
  { label: "Model", value: "Wholesale & Bulk Supply" },
] as const;

const PILLARS = [
  {
    title: "Sourced at the root",
    body: "Surat is India's knitting and dyeing hub — being here means we buy close to the mill, not through three layers of middlemen.",
  },
  {
    title: "Checked before it ships",
    body: "GSM, shade consistency and stretch recovery are verified roll by roll, so what you receive matches the swatch you approved.",
  },
  {
    title: "Sized to your order",
    body: "Trial quantities or full production runs — we quote in kg or meter, whichever matches how your costing already works.",
  },
];

function About() {
  const banner = useSiteImage("about-banner", warehouse);

  return (
    <div className="pt-28 md:pt-36">
      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="gold-glow-radial">
          <p className="editorial-tag mb-2">01 / OUR STORY</p>
          <StampHeading
            lines={["Knitting Dreams", "Into Reality"]}
            className="display-lg mt-3 max-w-2xl text-gold-gradient"
          />
        </Reveal>
        <Reveal index={1}>
          <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed md:text-lg">
            Mapps Creation is a Surat-based wholesale trader and distributor of Lycra, knitted, and
            polyester-lycra fabrics for garment manufacturing — supplying sportswear, streetwear and
            knitwear brands and exporters across India. We started in 2024 with a simple aim: give
            production teams a fabric partner who answers the phone, quotes honestly, and ships what
            was promised.
          </p>
        </Reveal>
      </section>

      {/* BANNER */}
      <section className="relative mt-16 overflow-hidden md:mt-24">
        <div className="hairline" />
        <div className="relative aspect-video md:aspect-21/9">
          <SiteMedia
            src={banner}
            alt="Mapps Creation warehouse and fabric stock in Surat"
            className="h-full w-full object-cover"
          />
          <div className="silk grain absolute inset-0 opacity-20" />
        </div>
        <div className="hairline" />
      </section>

      {/* FACTS */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <p className="label-caps text-primary">At a Glance</p>
          <h2 className="display-lg mt-4 max-w-xl">The facts, plainly stated</h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3">
          {FACTS.map((fact, i) => (
            <Reveal key={fact.label} index={i}>
              <div className="border-border border-t pt-5">
                <p className="label-caps text-muted-foreground">{fact.label}</p>
                <p className="font-display mt-2 text-2xl md:text-3xl">{fact.value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FOUNDER SECTION */}
      <FounderSection />

      {/* PILLARS */}
      <section className="surface-ivory grain relative py-24 md:py-32">
        <div className="relative mx-auto max-w-7xl px-5 md:px-10">
          <Reveal>
            <p className="label-caps text-secondary">How We Work</p>
            <h2 className="display-lg mt-4 max-w-2xl">
              Built around what a production line actually needs
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-3">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.title} index={i}>
                <div className="border-border border-t pt-6">
                  <h3 className="flex items-center gap-3 text-2xl">
                    <Check className="text-secondary h-5 w-5 shrink-0" /> {pillar.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { value: 500, suffix: "+", label: "Fabric Varieties" },
            { value: 1000, suffix: "+", label: "Clients Served" },
            { text: "Pan India", label: "Dispatch Coverage" },
            { value: 100, suffix: "%", label: "Rolls quality checked" },
          ].map((stat, i) => (
            <Reveal key={stat.label} index={i}>
              <div className="text-center md:text-left">
                <p className="font-display text-primary text-[clamp(2.4rem,5vw,3.8rem)] leading-none">
                  {"text" in stat ? stat.text : <CountUp to={stat.value} suffix={stat.suffix} />}
                </p>
                <p className="label-caps text-muted-foreground mt-3">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
