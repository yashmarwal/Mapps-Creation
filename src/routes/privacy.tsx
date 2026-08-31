import { createFileRoute } from "@tanstack/react-router";
import { Reveal, StampHeading } from "@/components/site/motion";
import { breadcrumbSchema, buildPageHead, SITE } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    buildPageHead({
      title: "Privacy Policy | Mapps Creation",
      description:
        "How Mapps Creation collects, uses and protects information shared through our website, enquiry forms and WhatsApp.",
      path: "/privacy",
      jsonLd: breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Privacy Policy", path: "/privacy" },
      ]),
    }),
  component: PrivacyPolicy,
});

const LAST_UPDATED = "1 September 2026";

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Who we are",
    body: (
      <p>
        Mapps Creation is a GST-registered wholesale trader and distributor of Lycra, knitted and
        polyester-lycra fabrics, based in Surat, Gujarat, India. This policy explains what
        information we collect through {SITE.url.replace("https://", "")}, why we collect it, and
        how it's handled. It applies to this website only.
      </p>
    ),
  },
  {
    title: "Information we collect",
    body: (
      <>
        <p>We collect information only when you choose to share it with us, through:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Contact and wholesale registration forms</strong> —
            name, company name, phone number, email address, city, and the details of your fabric
            requirement.
          </li>
          <li>
            <strong className="text-foreground">The Bulk Quote Builder</strong> — the products you
            select, along with quantity, preferred shade, and the buyer/dispatch details you enter
            before sending a quote request. This list is stored in your browser's local storage on
            your own device so it's there when you come back — we only receive it when you actually
            send it to us via WhatsApp or email.
          </li>
          <li>
            <strong className="text-foreground">WhatsApp enquiries</strong> — if you message us via
            a WhatsApp link on this site, that conversation happens on WhatsApp and is governed by
            WhatsApp's own privacy policy, not this one.
          </li>
          <li>
            <strong className="text-foreground">Admin account</strong> — a single, invite-only login
            used by us to manage the website. This isn't a public account system; visitors cannot
            register.
          </li>
        </ul>
        <p className="mt-3">
          We don't currently run analytics or advertising trackers on this site, so we don't collect
          browsing behaviour, device fingerprints, or ad-targeting data.
        </p>
      </>
    ),
  },
  {
    title: "How we use it",
    body: (
      <>
        <p>Information you share is used only to:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Respond to your enquiry, quotation request, or wholesale registration.</li>
          <li>Share swatches, pricing, and dispatch details for an order you're discussing.</li>
          <li>Contact you about an order already in progress.</li>
        </ul>
        <p className="mt-3">
          We do not sell, rent, or trade your information to third parties for their own marketing
          purposes.
        </p>
      </>
    ),
  },
  {
    title: "Third-party services we rely on",
    body: (
      <>
        <p>
          A few outside services help this site work, and each handles data under its own policy:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Web3Forms</strong> — delivers the Contact and
            Wholesale form submissions to our email inbox. Web3Forms processes the form content
            solely to route it to us.
          </li>
          <li>
            <strong className="text-foreground">Supabase</strong> — hosts our product catalogue,
            site content, and the admin login. Product and catalogue data stored here is not
            personal information about site visitors.
          </li>
          <li>
            <strong className="text-foreground">WhatsApp (Meta)</strong> — used for click-to-chat
            enquiry links. Messages sent this way are handled by WhatsApp, not by us directly.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Cookies and local storage",
    body: (
      <p>
        This site does not use tracking or advertising cookies. It uses your browser's local storage
        for one purpose only — remembering the products you've added to the Bulk Quote Builder so
        your list persists between visits on the same device. This data stays on your device;
        clearing your browser's site data removes it.
      </p>
    ),
  },
  {
    title: "Data retention",
    body: (
      <p>
        We keep enquiry and order-related information for as long as needed to fulfil your order,
        respond to follow-up questions, and meet our own accounting and GST record-keeping
        obligations as a registered business in India. If you'd like us to delete information we
        hold about you, contact us using the details below.
      </p>
    ),
  },
  {
    title: "Your rights",
    body: (
      <p>
        You can ask us at any time what information we hold about you, ask us to correct it, or ask
        us to delete it, subject to what we're required to retain for accounting or legal reasons.
        To make a request, reach out via the contact details below.
      </p>
    ),
  },
  {
    title: "Security",
    body: (
      <p>
        We take reasonable steps to protect information shared with us, including restricting admin
        access to a single authenticated account and using a reputable, security-audited
        infrastructure provider (Supabase) for anything stored on our behalf. No method of
        transmission or storage is completely secure, and we can't guarantee absolute security.
      </p>
    ),
  },
  {
    title: "Children's privacy",
    body: (
      <p>
        This is a business-to-business wholesale site intended for garment manufacturers, exporters,
        and trade buyers. It is not directed at, and we do not knowingly collect information from,
        individuals under 18.
      </p>
    ),
  },
  {
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy as the site or our practices change. The date below reflects the
        most recent revision — check back periodically if you have concerns.
      </p>
    ),
  },
  {
    title: "Contact us",
    body: (
      <p>
        For any question about this policy or your information, reach us at{" "}
        <a
          href={`tel:${SITE.phone}`}
          className="text-primary hover:text-foreground underline underline-offset-2"
        >
          {SITE.phoneDisplay}
        </a>{" "}
        or via the{" "}
        <a
          href="/contact"
          className="text-primary hover:text-foreground underline underline-offset-2"
        >
          Contact page
        </a>
        .
      </p>
    ),
  },
];

function PrivacyPolicy() {
  return (
    <div className="pt-28 md:pt-36">
      <section className="mx-auto max-w-3xl px-5 md:px-10">
        <Reveal>
          <p className="label-caps text-primary">Legal</p>
          <StampHeading lines={["Privacy Policy"]} className="display-lg mt-4" />
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
