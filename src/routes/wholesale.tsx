import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Award,
  Boxes,
  Check,
  CheckCircle,
  Loader2,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { EASE_REVEAL, EASE_UI, Reveal, StampHeading, WordReveal } from "@/components/site/motion";
import { LogoMark } from "@/components/site/LogoMark";
import { CATEGORIES } from "@/data/catalog";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { breadcrumbSchema, buildPageHead, serviceSchema } from "@/lib/seo";

export const Route = createFileRoute("/wholesale")({
  head: () =>
    buildPageHead({
      title: "Wholesale Fabric Partner Program | Mapps Creation, Surat",
      description:
        "Register as a wholesale fabric buyer with Mapps Creation. Lycra, knitted and polyester-lycra fabrics, sold by kg or meter, dispatched from Surat with GST billing.",
      path: "/wholesale",
      jsonLd: [
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Wholesale", path: "/wholesale" },
        ]),
        serviceSchema({
          name: "Mapps Creation Wholesale Fabric Programme",
          description:
            "Wholesale supply of Lycra, knitted and polyester-lycra fabrics to garment manufacturers and exporters across India, dispatched from Surat, Gujarat.",
          path: "/wholesale",
        }),
      ],
    }),
  component: Wholesale,
});

const USPS = [
  { icon: Award, title: "Direct-from-source pricing" },
  { icon: Boxes, title: "8 fabric categories, sold by kg or meter" },
  { icon: Truck, title: "Fast dispatch from Surat" },
  { icon: ShieldCheck, title: "GST-billed, quality checked before shipping" },
];

const STEPS = [
  "Send your requirement",
  "Receive swatches & quotation",
  "Approve the sample",
  "Confirm order",
  "Production & dispatch",
];

const COMPARISON: [string, string, string][] = [
  [
    "Pricing",
    "Direct-from-source, transparent per kg/meter pricing",
    "Marked-up through multiple middlemen, prices often withheld until you call",
  ],
  [
    "Catalog range",
    "8 fabric categories — Lycra, knitted & polyester-lycra variants under one roof",
    "Narrow specialization — separate suppliers needed for Lycra, knits, and blends",
  ],
  [
    "Order flexibility",
    "Sold by kg or meter, scaled to your production run",
    "Fixed minimum order quantities regardless of your actual need",
  ],
  [
    "Quality control",
    "Every roll checked before dispatch",
    "Inconsistent batch quality, often discovered only after delivery",
  ],
  [
    "Response time",
    "Direct WhatsApp/call line, same-day quotes",
    "Enquiries routed through agents, multi-day response times",
  ],
  [
    "Location advantage",
    "Based in Surat — India's textile hub — for fast dispatch",
    "Sourced from out-of-state suppliers, longer lead times",
  ],
  [
    "Compliance",
    "GST-registered, verifiable business",
    "Unregistered or undocumented trading common in the segment",
  ],
];

const QUICK_STATS: [string, string][] = [
  ["8", "Fabric categories"],
  ["2024", "Established"],
  ["10+", "Team members"],
  ["100%", "Rolls quality checked"],
];

function WholesaleForm() {
  const { status, submit } = useFormSubmit();
  const [fields, setFields] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    city: "",
    businessType: "",
    interest: "",
    volume: "",
    message: "",
  });

  // See contact.tsx for why e.currentTarget.value is read here, synchronously,
  // rather than inside the setState updater (currentTarget is null by the
  // time React can potentially replay that updater).
  const set =
    (key: keyof typeof fields) =>
    (e: FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.currentTarget.value;
      setFields((f) => ({ ...f, [key]: value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submit({
      subject: `Wholesale Registration — ${fields.company || "New buyer"}`,
      from_name: fields.contact,
      ...fields,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {(
        [
          ["company", "Company Name", "text", true],
          ["contact", "Contact Person", "text", true],
          ["email", "Email", "email", false],
          ["phone", "Phone", "tel", true],
          ["city", "City", "text", true],
          ["volume", "Estimated Monthly Volume", "text", false],
        ] as [keyof typeof fields, string, string, boolean][]
      ).map(([name, label, type, required]) => (
        <input
          key={name}
          required={required}
          type={type}
          name={name}
          placeholder={label}
          value={fields[name]}
          onChange={set(name)}
          className="border-border bg-card text-foreground focus:border-primary min-h-[48px] border-b bg-transparent px-1 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground"
        />
      ))}

      <select
        required
        value={fields.businessType}
        onChange={set("businessType")}
        className="border-border bg-card text-foreground focus:border-primary min-h-[48px] border-b bg-transparent px-1 py-3 text-sm outline-none transition-colors"
      >
        <option value="">Business Type</option>
        <option value="Garment Manufacturer">Garment Manufacturer</option>
        <option value="Exporter">Exporter</option>
        <option value="Trader / Distributor">Trader / Distributor</option>
        <option value="Other">Other</option>
      </select>

      <select
        value={fields.interest}
        onChange={set("interest")}
        className="border-border bg-card text-foreground focus:border-primary min-h-[48px] border-b bg-transparent px-1 py-3 text-sm outline-none transition-colors"
      >
        <option value="">Fabric Category of Interest</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <textarea
        rows={3}
        placeholder="Anything else we should know?"
        value={fields.message}
        onChange={set("message")}
        className="border-border bg-card text-foreground focus:border-primary resize-none border-b bg-transparent px-1 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground sm:col-span-2"
      />

      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-primary text-primary-foreground font-semibold label-caps mt-4 inline-flex min-h-[52px] items-center justify-center gap-3 px-8 rounded-lg active:scale-98 transition-all disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 cursor-pointer text-sm tracking-wider"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting Registration...
          </>
        ) : (
          "Submit Registration"
        )}
      </button>

      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 text-foreground flex items-center gap-3 px-4 py-3 text-sm sm:col-span-2"
        >
          <CheckCircle className="text-primary h-5 w-5 shrink-0" />
          Registration received — we'll be in touch shortly with swatches and pricing.
        </motion.div>
      )}
      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 text-destructive flex items-center gap-3 px-4 py-3 text-sm sm:col-span-2"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          Submission failed — please WhatsApp or call us instead.
        </motion.div>
      )}
    </form>
  );
}

function ComparisonSection() {
  const [tab, setTab] = useState<"mapps" | "typical">("mapps");

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:px-10 md:py-32">
      <Reveal>
        <p className="label-caps text-primary">The Difference</p>
        <h2 className="display-lg mt-4">Mapps Creation vs. a typical fabric supplier</h2>
      </Reveal>

      {/* ================= MOBILE VIEW (Tab Switcher) ================= */}
      <Reveal index={1} className="mt-10 md:hidden">
        {/* Toggle Pills */}
        <div className="flex items-center gap-2 p-1.5 border border-border/80 bg-background/80 rounded-full mb-6 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setTab("mapps")}
            className={`relative flex-1 py-2.5 px-4 text-xs uppercase tracking-wider font-medium rounded-full transition-colors text-center ${
              tab === "mapps"
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "mapps" && (
              <motion.div
                layoutId="activeComparisonTab"
                className="absolute inset-0 bg-primary rounded-full shadow-[var(--shadow-gold)]"
                transition={{ duration: 0.3, ease: EASE_UI }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              <LogoMark size={14} className="shrink-0" /> Mapps Creation
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab("typical")}
            className={`relative flex-1 py-2.5 px-4 text-xs uppercase tracking-wider font-medium rounded-full transition-colors text-center ${
              tab === "typical" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "typical" && (
              <motion.div
                layoutId="activeComparisonTab"
                className="absolute inset-0 bg-muted/80 border border-border rounded-full"
                transition={{ duration: 0.3, ease: EASE_UI }}
              />
            )}
            <span className="relative z-10">Typical Supplier</span>
          </button>
        </div>

        {/* Content Card */}
        <AnimatePresence mode="wait">
          {tab === "mapps" ? (
            <motion.div
              key="mapps-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: EASE_UI }}
              className="border border-[var(--gold)]/40 bg-[#0F2038]/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[var(--gold)]/20 pb-3">
                <span className="label-caps text-primary text-xs tracking-widest uppercase font-semibold flex items-center gap-2">
                  <LogoMark size={16} className="shrink-0" /> The Mapps Creation Advantage
                </span>
                <span className="text-[10px] text-primary/80 border border-primary/30 px-2 py-0.5 rounded uppercase font-mono">
                  Surat Direct
                </span>
              </div>

              <div className="space-y-4">
                {COMPARISON.map(([label, ours]) => (
                  <div
                    key={label}
                    className="border-b border-border/30 pb-3.5 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2 text-xs font-display text-primary tracking-wider uppercase mb-1">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>{label}</span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed font-light pl-6">
                      {ours}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="typical-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: EASE_UI }}
              className="border border-border/80 bg-background/80 backdrop-blur-md p-6 rounded-2xl shadow-md space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <span className="label-caps text-muted-foreground text-xs tracking-widest uppercase font-medium">
                  Typical Fabric Supplier Standard
                </span>
                <span className="text-[10px] text-muted-foreground border border-border px-2 py-0.5 rounded uppercase font-mono">
                  Industry Standard
                </span>
              </div>

              <div className="space-y-4">
                {COMPARISON.map(([label, , theirs]) => (
                  <div
                    key={label}
                    className="border-b border-border/30 pb-3.5 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2 text-xs font-display text-muted-foreground tracking-wider uppercase mb-1">
                      <X className="h-4 w-4 text-destructive/80 shrink-0" />
                      <span>{label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light pl-6">
                      {theirs}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>

      {/* ================= DESKTOP VIEW (3-Column Table) ================= */}
      <Reveal index={1} className="mt-14 hidden md:block overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="label-caps text-muted-foreground w-1/5 border-b border-border pb-4 pr-4 font-normal">
                &nbsp;
              </th>
              <th className="label-caps text-primary border-b border-primary/40 pb-4 pr-6 font-normal">
                <span className="flex items-center gap-2">
                  <LogoMark size={18} className="shrink-0" /> Mapps Creation
                </span>
              </th>
              <th className="label-caps text-muted-foreground border-b border-border pb-4 font-normal">
                Typical Fabric Supplier
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map(([label, ours, theirs], i) => (
              <tr key={label} className={i < COMPARISON.length - 1 ? "border-b border-border" : ""}>
                <td className="font-display py-5 pr-4 text-base align-top">{label}</td>
                <td className="border-l border-primary/20 bg-primary/5 py-5 pr-6 pl-4 align-top leading-relaxed text-foreground">
                  {ours}
                </td>
                <td className="text-muted-foreground py-5 pl-4 align-top leading-relaxed">
                  {theirs}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </section>
  );
}

function Wholesale() {
  return (
    <>
      {/* Text-only dark hero */}
      <section className="silk grain relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="relative mx-auto max-w-5xl px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_REVEAL }}
          >
            <p className="label-caps text-primary">For Wholesale Buyers</p>
            <StampHeading
              lines={["Partner With", "Mapps Creation"]}
              className="display-xl mt-5 max-w-3xl"
            />
            <p className="text-muted-foreground mt-7 max-w-xl text-base leading-relaxed md:text-lg">
              Wholesale Lycra, knitted and polyester-lycra fabrics for garment manufacturers and
              exporters across India — sourced, tested and dispatched from Surat.
            </p>

            <div className="border-border mt-12 flex flex-wrap gap-10 border-t pt-10">
              {QUICK_STATS.map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-primary text-4xl leading-none">{n}</p>
                  <p className="label-caps text-muted-foreground mt-2">{l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* USPs */}
      <section className="surface-ivory grain relative py-24 md:py-32">
        <div className="relative mx-auto max-w-7xl px-5 md:px-10">
          <Reveal>
            <p className="label-caps text-secondary">Why Us</p>
            <h2 className="display-lg mt-4">Why source from Mapps Creation</h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
            {USPS.map((u, i) => (
              <Reveal key={u.title} index={i}>
                <div className="border-border bg-card flex h-full flex-col items-center border p-6 text-center">
                  <u.icon className="text-secondary h-7 w-7" />
                  <p className="font-display mt-5 text-lg">{u.title}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <ComparisonSection />

      {/* Process */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <p className="label-caps text-primary">The Process</p>
          <h2 className="display-lg mt-4">How it works</h2>
        </Reveal>
        <ol className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-5">
          {STEPS.map((step, i) => (
            <Reveal key={step} index={i}>
              <li className="border-border h-full border-t pt-6">
                <span className="font-display text-primary text-3xl">0{i + 1}</span>
                <p className="font-display mt-3 text-lg leading-snug">{step}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Registration */}
      <section className="silk grain relative py-24 md:py-32">
        <div className="relative mx-auto max-w-3xl px-5 pb-8 md:px-10">
          <Reveal>
            <p className="label-caps text-primary">Register</p>
            <h2 className="display-lg mt-4">Wholesale registration</h2>
          </Reveal>
          <WordReveal
            text="Tell us a little about your business and what you're sourcing — we'll follow up with swatches and a quotation."
            className="text-muted-foreground mt-5 block max-w-xl text-sm leading-relaxed md:text-base"
          />
          <WholesaleForm />
        </div>
      </section>
    </>
  );
}
