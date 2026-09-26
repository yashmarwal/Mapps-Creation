import { createFileRoute } from "@tanstack/react-router";
import { Reveal, StampHeading } from "@/components/site/motion";
import { breadcrumbSchema, buildPageHead, SITE } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () =>
    buildPageHead({
      title: "Terms & Conditions | Mapps Creation",
      description:
        "The terms that govern using the Mapps Creation website and placing a wholesale fabric order with us.",
      path: "/terms",
      jsonLd: breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Terms & Conditions", path: "/terms" },
      ]),
    }),
  component: TermsPage,
});

const LAST_UPDATED = "26 September 2026";

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Who these terms apply to",
    body: (
      <p>
        These Terms & Conditions govern your use of {SITE.url.replace("https://", "")} and any
        enquiry, quotation, or order you place with Mapps Creation, a GST-registered wholesale
        trader and distributor of Lycra, knitted and polyester-lycra fabrics based in Surat,
        Gujarat, India. By using this site or placing an order with us, you agree to these terms.
        This is a business-to-business (B2B) wholesale site; it is not intended for individual
        consumer purchases.
      </p>
    ),
  },
  {
    title: "What we offer",
    body: (
      <p>
        We source, stock, and dispatch Lycra, knitted, and polyester-lycra fabrics for garment
        manufacturers, exporters, and trade buyers. This site is inquiry-only: there is no online
        cart or checkout. Prices, availability, GSM, and shade shown on the site (including the
        downloadable PDF catalogue) are indicative and are confirmed in writing (over WhatsApp,
        email, or a formal quotation) before an order is placed. A quotation is not an order until
        you've confirmed it and we've accepted it.
      </p>
    ),
  },
  {
    title: "Your obligations as a buyer",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Provide accurate contact, billing, and dispatch information when you enquire or order.
        </li>
        <li>
          Review and approve swatches/samples before confirming a bulk or dyed-to-order quantity —
          once a shade or quality is approved and production/dispatch begins, that approval is
          treated as final for that batch.
        </li>
        <li>Pay for confirmed orders per the payment terms agreed at the time of quotation.</li>
        <li>
          Use the site, the AI chat assistant, and the enquiry forms for genuine business enquiries.
        </li>
      </ul>
    ),
  },
  {
    title: "Pricing, GST, and payment",
    body: (
      <p>
        Prices are quoted per kg or per meter depending on the fabric, in Indian Rupees, and are
        subject to change until a quotation is confirmed. Every order is billed with a GST-compliant
        invoice. We accept bank transfer (NEFT/RTGS/UPI); specific payment terms (advance, partial,
        or credit) are agreed per order at the time of quotation, particularly for first-time
        buyers.
      </p>
    ),
  },
  {
    title: "Dispatch and delivery",
    body: (
      <p>
        Orders are quality-checked and dispatched from our Surat facility. Delivery timelines depend
        on the fabric, quantity, and destination, and are communicated at the time of quotation.
        Transport is arranged via your preferred transporter or ours, and is billed at actuals
        unless otherwise agreed. Title and risk in the goods pass to the buyer on handover to the
        transporter, unless we've agreed otherwise in writing.
      </p>
    ),
  },
  {
    title: "Cancellations and returns",
    body: (
      <p>
        See our{" "}
        <a
          href="/refund-policy"
          className="text-primary hover:text-foreground underline underline-offset-2"
        >
          Refund &amp; Cancellation Policy
        </a>{" "}
        for how order changes, cancellations, and quality disputes are handled.
      </p>
    ),
  },
  {
    title: "Intellectual property",
    body: (
      <p>
        The content of this site — text, product photography, logo, and design — belongs to Mapps
        Creation or is used with permission, and may not be copied or reused for a competing
        commercial purpose without our written consent. Product names and specifications are
        provided for identification only.
      </p>
    ),
  },
  {
    title: "Limitation of liability",
    body: (
      <p>
        We take reasonable care to describe our fabrics accurately and to check quality before
        dispatch. To the maximum extent permitted by Indian law, Mapps Creation is not liable for
        indirect, incidental, or consequential loss (such as lost production time or lost business)
        arising from a delay, a shade/GSM variance within normal manufacturing tolerance, or use of
        this website. Our liability for a confirmed order is limited to the value of that order.
        Nothing in these terms excludes liability that cannot lawfully be excluded under Indian law.
      </p>
    ),
  },
  {
    title: "Governing law and dispute resolution",
    body: (
      <p>
        These terms are governed by the laws of India. Any dispute arising out of or in connection
        with these terms, or an order placed with Mapps Creation, will first be attempted to be
        resolved amicably between the parties, and failing that, will be subject to the exclusive
        jurisdiction of the courts at Surat, Gujarat.
      </p>
    ),
  },
  {
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms as our practices change. The date below reflects the most recent
        revision. Continued use of the site after an update means you accept the revised terms.
      </p>
    ),
  },
  {
    title: "Related policies",
    body: (
      <p>
        See our{" "}
        <a
          href="/privacy"
          className="text-primary hover:text-foreground underline underline-offset-2"
        >
          Privacy Policy
        </a>{" "}
        for how we handle personal data, and our{" "}
        <a
          href="/cookies"
          className="text-primary hover:text-foreground underline underline-offset-2"
        >
          Cookies Policy
        </a>{" "}
        for what's stored in your browser.
      </p>
    ),
  },
  {
    title: "Contact us",
    body: (
      <p>
        Questions about these terms? Reach us at{" "}
        <a
          href={`mailto:${SITE.email}`}
          className="text-primary hover:text-foreground underline underline-offset-2"
        >
          {SITE.email}
        </a>{" "}
        or{" "}
        <a
          href={`tel:${SITE.phone}`}
          className="text-primary hover:text-foreground underline underline-offset-2"
        >
          {SITE.phoneDisplay}
        </a>
        .
      </p>
    ),
  },
];

function TermsPage() {
  return (
    <div className="pt-28 md:pt-36">
      <section className="mx-auto max-w-3xl px-5 md:px-10">
        <Reveal>
          <p className="label-caps text-primary">Legal</p>
          <StampHeading lines={["Terms & Conditions"]} className="display-lg mt-4" />
          <p className="text-muted-foreground mt-6 text-sm">Last updated: {LAST_UPDATED}</p>
        </Reveal>

        <div className="mt-14 space-y-12 pb-24 md:pb-32">
          {SECTIONS.map((section, i) => (
            <Reveal key={section.title} index={i}>
              <div className="border-border border-t pt-6">
                <h2 className="font-display text-xl md:text-2xl">{section.title}</h2>
                <div className="text-muted-foreground mt-3 text-sm leading-relaxed md:text-base">
                  {section.body}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
