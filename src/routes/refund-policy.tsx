import { createFileRoute } from "@tanstack/react-router";
import { Reveal, StampHeading } from "@/components/site/motion";
import { breadcrumbSchema, buildPageHead, SITE } from "@/lib/seo";

export const Route = createFileRoute("/refund-policy")({
  head: () =>
    buildPageHead({
      title: "Refund & Cancellation Policy | Mapps Creation",
      description:
        "How order changes, cancellations, and quality disputes are handled for Mapps Creation wholesale fabric orders.",
      path: "/refund-policy",
      jsonLd: breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Refund & Cancellation Policy", path: "/refund-policy" },
      ]),
    }),
  component: RefundPolicyPage,
});

const LAST_UPDATED = "26 September 2026";

// ⚠ NEEDS BUSINESS INPUT: every value below marked [confirm] is a gap this
// audit could not fill safely — nothing in the codebase or existing copy
// states a cancellation window, a return window, a restocking fee, or a
// refund turnaround time. Do not invent numbers for a legal/financial
// policy; get them from the business owner before this page is final.
const NEEDS_INPUT = "confirm this with Mapps Creation before publishing";

const SECTIONS: { title: string; body: React.ReactNode; flagged?: boolean }[] = [
  {
    title: "How this applies to our order process",
    body: (
      <p>
        Mapps Creation is an inquiry-only wholesale site: there is no online cart or checkout, so
        nothing is "purchased" directly through this website. Every order is confirmed manually —
        over WhatsApp, phone, or email — after you've reviewed a quotation and, for dyed-to-order or
        bulk shades, approved a physical swatch. This policy covers what happens after that point:
        cancelling a confirmed order, and what happens if what arrives doesn't match what you
        approved.
      </p>
    ),
  },
  {
    title: "Samples and swatches",
    body: (
      <p>
        Swatches are shared free of charge before you commit to a bulk or dyed-to-order quantity
        (courier charged at actuals for outstation buyers, per our FAQ). Once you approve a swatch
        and we begin dyeing or reserving stock against your order, that approval is treated as final
        for that batch — see "Order confirmation" below.
      </p>
    ),
  },
  {
    title: "Order confirmation",
    body: (
      <p>
        An order is considered confirmed once you've approved the quotation (fabric, GSM, shade,
        quantity, and rate) and, where applicable, the swatch. Confirmed orders may move directly
        into production or dispatch preparation, which limits how late a cancellation can be
        accepted — see below.
      </p>
    ),
  },
  {
    title: "Cancelling a confirmed order",
    flagged: true,
    body: (
      <p>
        <strong className="text-foreground">[Needs business input — {NEEDS_INPUT}]:</strong> the
        window within which a confirmed order can be cancelled without charge, whether a
        cancellation fee applies once production/dyeing has started on a dyed-to-order shade, and
        whether in-stock (non-custom) orders can be cancelled up to dispatch. Contact us as soon as
        possible if you need to cancel — we'll confirm what's still possible based on how far your
        specific order has progressed.
      </p>
    ),
  },
  {
    title: "Quality issues and returns",
    flagged: true,
    body: (
      <>
        <p>
          Every roll is quality-checked for GSM, shade, and stretch recovery before it leaves our
          Surat facility, matched against the swatch you approved. If what you receive doesn't match
          that approved swatch or the confirmed specification, contact us with your order details
          and photos of the issue.
        </p>
        <p className="mt-3">
          <strong className="text-foreground">[Needs business input — {NEEDS_INPUT}]:</strong> the
          number of days after delivery within which a quality claim must be raised, whether a claim
          results in a replacement, credit note, or refund, who bears return freight for a confirmed
          quality defect, and the accepted shade/GSM tolerance before a variance counts as a defect
          versus normal manufacturing tolerance.
        </p>
      </>
    ),
  },
  {
    title: "Refund method and timeline",
    flagged: true,
    body: (
      <p>
        <strong className="text-foreground">[Needs business input — {NEEDS_INPUT}]:</strong> where a
        refund is due (a cancelled order, an overpayment, or an approved quality claim), how it's
        issued (bank transfer to the original account, credit note against a future order) and the
        turnaround time.
      </p>
    ),
  },
  {
    title: "What's not covered",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Shade or GSM variance within normal manufacturing tolerance for the fabric type.</li>
        <li>Damage occurring after the goods have been handed over to your chosen transporter.</li>
        <li>
          A change of mind on a dyed-to-order shade that was approved via swatch before production.
        </li>
      </ul>
    ),
  },
  {
    title: "How to request a cancellation, return, or refund",
    body: (
      <p>
        Contact us at{" "}
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
        </a>{" "}
        with your order/quotation reference, what happened, and (for a quality issue) photos of the
        fabric received. We'll confirm next steps once the business input above is filled in.
      </p>
    ),
  },
  {
    title: "Related policies",
    body: (
      <p>
        See our{" "}
        <a
          href="/terms"
          className="text-primary hover:text-foreground underline underline-offset-2"
        >
          Terms &amp; Conditions
        </a>{" "}
        for the terms of an order generally, and our{" "}
        <a
          href="/privacy"
          className="text-primary hover:text-foreground underline underline-offset-2"
        >
          Privacy Policy
        </a>{" "}
        for how we handle the information you share with a cancellation or return request.
      </p>
    ),
  },
];

function RefundPolicyPage() {
  return (
    <div className="pt-28 md:pt-36">
      <section className="mx-auto max-w-3xl px-5 md:px-10">
        <Reveal>
          <p className="label-caps text-primary">Legal</p>
          <StampHeading lines={["Refund & Cancellation Policy"]} className="display-lg mt-4" />
          <p className="text-muted-foreground mt-6 text-sm">Last updated: {LAST_UPDATED}</p>
        </Reveal>

        <div className="mt-14 space-y-12 pb-24 md:pb-32">
          {SECTIONS.map((section, i) => (
            <Reveal key={section.title} index={i}>
              <div
                className={`border-t pt-6 ${
                  section.flagged ? "border-destructive/40" : "border-border"
                }`}
              >
                <h2 className="font-display flex items-center gap-2.5 text-xl md:text-2xl">
                  {section.title}
                  {section.flagged && (
                    <span className="label-caps bg-destructive/10 text-destructive border-destructive/40 rounded-full border px-2.5 py-0.5 text-[10px]">
                      Needs input
                    </span>
                  )}
                </h2>
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
