import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Reveal, StampHeading } from "@/components/site/motion";
import { breadcrumbSchema, buildPageHead, faqSchema } from "@/lib/seo";

const GROUPS: { category: string; items: { q: string; a: string }[] }[] = [
  {
    category: "Fabrics & Products",
    items: [
      {
        q: "What fabric categories do you supply?",
        a: "Lycra Fabric, Lycra Knitted Fabric, Polyester Lycra Fabric, Melange Fabric, T-Shirt Fabric, Twill Fabric, Matty Fabric, and a range of other knit and woven qualities. See the full catalogue for GSM, blend and finish per item.",
      },
      {
        q: "Do you sell by kilogram or by meter?",
        a: "Both. Knitted qualities are usually traded by kg and woven qualities such as twill and matty by meter. We quote in whichever unit suits your costing.",
      },
      {
        q: "Can you match a shade or GSM I already use?",
        a: "Send your existing swatch or specification and we will match GSM, blend and shade as closely as the base quality allows.",
      },
      {
        q: "Do you supply for sportswear, streetwear and knitwear alike?",
        a: "Yes — our Lycra, knitted and polyester-lycra ranges are sourced and stocked to suit sportswear, streetwear and general knitwear production.",
      },
    ],
  },
  {
    category: "Orders & Pricing",
    items: [
      {
        q: "What is your minimum order quantity?",
        a: "MOQ depends on the fabric and shade — stock qualities can start from a single roll, while dyed-to-order shades typically start around 50 kg per colour. Message us with your requirement for an exact answer.",
      },
      {
        q: "How do I get a quotation?",
        a: "Share the fabric type, GSM, shade and quantity over WhatsApp or the enquiry form. We match the closest quality from stock, share swatches, and confirm a rate per kg or meter — usually the same working day.",
      },
      {
        q: "Can I mix fabrics across categories in one order?",
        a: "Yes. Lycra, knitted and polyester-lycra qualities can be combined in a single order to suit your production run.",
      },
      {
        q: "Do prices change with order size?",
        a: "Larger, bulk quantities are priced more competitively than small trial orders — share your expected volume when you enquire so we can quote accordingly.",
      },
    ],
  },
  {
    category: "Payment & Billing",
    items: [
      {
        q: "How do I pay for an order?",
        a: "We accept bank transfer (NEFT/RTGS/UPI) against a GST-compliant invoice. Payment terms for first-time and bulk orders are confirmed at the time of quotation.",
      },
      {
        q: "Do you provide a GST invoice?",
        a: "Yes — Mapps Creation is a GST-registered proprietorship, and every order is billed with a proper GST invoice for your records.",
      },
    ],
  },
  {
    category: "Shipping & Dispatch",
    items: [
      {
        q: "Where do you dispatch from?",
        a: "All orders are packed and dispatched from our Surat, Gujarat facility — India's knit and dyeing hub — which keeps lead times short for garment manufacturers anywhere in the country.",
      },
      {
        q: "Do you supply outside Gujarat?",
        a: "Yes — we regularly supply garment manufacturers and exporters across India via road transport from Surat, including hubs like Delhi, Mumbai, Bengaluru, Tirupur and Ludhiana.",
      },
      {
        q: "Who arranges transport?",
        a: "We hand over quality-checked rolls to your preferred transporter, or arrange dispatch via a regular transport company on request — transport cost is billed at actuals unless agreed otherwise.",
      },
    ],
  },
  {
    category: "Samples & Quality",
    items: [
      {
        q: "Can I get samples before ordering?",
        a: "Yes. We share swatches of the closest matching quality free of charge; courier is arranged at actuals for outstation buyers.",
      },
      {
        q: "How do you check quality before dispatch?",
        a: "GSM, shade and stretch recovery are verified roll by roll before anything leaves our facility, so what you receive matches the swatch you approved.",
      },
    ],
  },
  {
    category: "About Mapps Creation",
    items: [
      {
        q: "Is Mapps Creation a manufacturer or a trader?",
        a: "We are a wholesale trader and distributor — we source, stock and dispatch fabric rather than knit or dye it ourselves. This lets us offer a wide range of qualities without the lead time of in-house manufacturing.",
      },
      {
        q: "Do you have a minimum order for first-time buyers?",
        a: "No separate minimum applies beyond the standard MOQ per fabric — first-time buyers are welcome to start with a trial quantity to check quality before scaling up.",
      },
    ],
  },
];

export const Route = createFileRoute("/faq")({
  head: () =>
    buildPageHead({
      title: "FAQ — Fabric Orders, Pricing & Dispatch | Mapps Creation",
      description:
        "Answers to common questions about Mapps Creation's wholesale Lycra, knitted and polyester-lycra fabrics — MOQ, pricing, GST billing, dispatch from Surat and quality checks.",
      path: "/faq",
      jsonLd: [
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]),
        faqSchema(GROUPS.flatMap((g) => g.items)),
      ],
    }),
  component: FAQPage,
});

function FAQPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="pt-28 md:pt-36">
      <section className="mx-auto max-w-4xl px-5 md:px-10">
        <Reveal>
          <p className="label-caps text-primary">Support</p>
          <StampHeading lines={["Frequently Asked", "Questions"]} className="display-lg mt-4" />
          <p className="text-muted-foreground mt-6 max-w-xl text-sm leading-relaxed md:text-base">
            Everything buyers usually ask before placing a first order with us.
          </p>
        </Reveal>

        <div className="mt-16 space-y-14 pb-24 md:pb-32">
          {GROUPS.map((group, gi) => (
            <Reveal key={group.category} index={gi}>
              <h2 className="label-caps text-primary">{group.category}</h2>
              <ul className="border-border mt-6 border-t">
                {group.items.map((item) => {
                  const id = `${group.category}-${item.q}`;
                  const isOpen = open === id;
                  return (
                    <li key={item.q} className="border-border border-b">
                      <button
                        onClick={() => setOpen(isOpen ? null : id)}
                        className="flex w-full items-center justify-between gap-4 py-5 text-left"
                      >
                        <span className="font-display text-lg">{item.q}</span>
                        {isOpen ? (
                          <Minus className="text-primary h-4 w-4 shrink-0" />
                        ) : (
                          <Plus className="text-primary h-4 w-4 shrink-0" />
                        )}
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="text-muted-foreground pb-6 text-sm leading-relaxed">
                              {item.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
