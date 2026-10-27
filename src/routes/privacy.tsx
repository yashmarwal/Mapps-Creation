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

const LAST_UPDATED = "26 September 2026";

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
            <strong className="text-foreground">Contact and wholesale registration forms:</strong>{" "}
            name, company name, phone number, email address, city, and the details of your fabric
            requirement.
          </li>
          <li>
            <strong className="text-foreground">The Bulk Quote Builder:</strong> the products you
            select, along with quantity, preferred shade, and the buyer/dispatch details you enter
            before sending a quote request. This list is stored in your browser's local storage on
            your own device so it's there when you come back. We only receive it when you actually
            send it to us via WhatsApp or email.
          </li>
          <li>
            <strong className="text-foreground">WhatsApp enquiries:</strong> if you message us via a
            WhatsApp link on this site, that conversation happens on WhatsApp and is governed by
            WhatsApp's own privacy policy, not this one.
          </li>
          <li>
            <strong className="text-foreground">ASK MAPPSY (AI chat):</strong> whatever you type
            into the chat widget is sent to Google's Gemini API to generate a reply (see Third-party
            services below). Please don't share sensitive personal information in the chat.
          </li>
          <li>
            <strong className="text-foreground">Admin account:</strong> a single, invite-only login
            used by us to manage the website. This isn't a public account system; visitors cannot
            register.
          </li>
        </ul>
        <p className="mt-3">
          We don't run advertising trackers, ad pixels, or third-party analytics on this site, so we
          don't collect browsing behaviour, device fingerprints, or ad-targeting data. See our{" "}
          <a
            href="/cookies"
            className="text-primary hover:text-foreground underline underline-offset-2"
          >
            Cookies Policy
          </a>{" "}
          for exactly what is stored in your browser.
        </p>
      </>
    ),
  },
  {
    title: "How we use it, and your consent",
    body: (
      <>
        <p>Information you share is used only to:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Respond to your enquiry, quotation request, or wholesale registration.</li>
          <li>Share swatches, pricing, and dispatch details for an order you're discussing.</li>
          <li>Contact you about an order already in progress.</li>
        </ul>
        <p className="mt-3">
          Every form on this site that collects personal data asks you to explicitly tick a consent
          checkbox before it can be submitted, confirming you agree to this Privacy Policy and to us
          using your information for the purpose stated on that form. We don't collect personal data
          through any form without that consent, and we don't use it for a different, incompatible
          purpose later without asking again.
        </p>
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
            <strong className="text-foreground">Web3Forms:</strong> delivers the Contact, Wholesale
            and Bulk Quote form submissions to our email inbox. Web3Forms processes the form content
            solely to route it to us.
          </li>
          <li>
            <strong className="text-foreground">Supabase:</strong> hosts our product catalogue, site
            content, and the admin login. Product and catalogue data stored here is not personal
            information about site visitors.
          </li>
          <li>
            <strong className="text-foreground">WhatsApp (Meta):</strong> used for click-to-chat
            enquiry links. Messages sent this way are handled by WhatsApp, not by us directly.
          </li>
          <li>
            <strong className="text-foreground">Google Gemini API:</strong> powers the optional ASK
            MAPPSY chat assistant. If you use the chat, the text of your message is sent from our
            server to Google to generate a reply. It is not linked to your name unless you type it
            yourself, and it is not used for advertising.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Cookies and local storage",
    body: (
      <p>
        This site does not use advertising or analytics cookies. It does use your browser's local
        storage for one purpose: remembering the products you've added to the Bulk Quote Builder so
        your list persists between visits on the same device. If we ever add analytics or marketing
        scripts in future, we'll update this page and our Cookies Policy to say so, with how to opt
        out, before turning them on. Full detail, including exactly what's stored today, is in our{" "}
        <a
          href="/cookies"
          className="text-primary hover:text-foreground underline underline-offset-2"
        >
          Cookies Policy
        </a>
        .
      </p>
    ),
  },
  {
    title: "Data retention",
    body: (
      <p>
        We keep enquiry and order-related information for as long as needed to fulfil your order,
        respond to follow-up questions, and meet our own accounting and GST record-keeping
        obligations as a registered business in India (typically up to 8 years for financial
        records, matching Indian accounting-record requirements). If you'd like us to delete
        information we hold about you sooner, contact us using the details below and we'll do so
        unless we're required to keep it for accounting, legal or dispute-resolution reasons.
      </p>
    ),
  },
  {
    title: "Your rights under India's DPDP Act, 2023",
    body: (
      <>
        <p>
          As a "Data Principal" under India's Digital Personal Data Protection Act, 2023, you have
          the right to:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Access:</strong> ask us to confirm whether we hold
            your personal data, and get a summary of what we hold and how it's being processed.
          </li>
          <li>
            <strong className="text-foreground">Correction:</strong> ask us to correct inaccurate or
            misleading personal data, or complete incomplete data.
          </li>
          <li>
            <strong className="text-foreground">Erasure:</strong> ask us to delete personal data we
            no longer need for the purpose it was collected, subject to what we're legally required
            to retain (see Data retention above).
          </li>
          <li>
            <strong className="text-foreground">Withdraw consent:</strong> withdraw consent you
            previously gave, at any time, as easily as you gave it. This doesn't affect anything we
            did with your data before you withdrew consent.
          </li>
          <li>
            <strong className="text-foreground">Grievance redressal:</strong> raise a complaint with
            us about how your data has been handled, and get a response within a reasonable time. If
            you're unsatisfied with our response, you can complain to the Data Protection Board of
            India.
          </li>
          <li>
            <strong className="text-foreground">Nominate:</strong> nominate another individual to
            exercise these rights on your behalf in the event of your death or incapacity.
          </li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, contact our grievance contact below.
        </p>
      </>
    ),
  },
  {
    title: "Grievance officer / contact for data requests",
    body: (
      <p>
        For any request, question or complaint about your personal data under the DPDP Act, 2023,
        write to us at{" "}
        <a
          href={`mailto:${SITE.email}`}
          className="text-primary hover:text-foreground underline underline-offset-2"
        >
          {SITE.email}
        </a>{" "}
        or call{" "}
        <a
          href={`tel:${SITE.phone}`}
          className="text-primary hover:text-foreground underline underline-offset-2"
        >
          {SITE.phoneDisplay}
        </a>
        , marked "Data Privacy Request." We aim to acknowledge every request within a reasonable
        time.
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
        most recent revision; check back periodically if you have concerns.
      </p>
    ),
  },
  {
    title: "Related policies",
    body: (
      <p>
        This Privacy Policy covers personal data specifically. For the terms that govern using this
        site and placing orders, see our{" "}
        <a
          href="/terms"
          className="text-primary hover:text-foreground underline underline-offset-2"
        >
          Terms &amp; Conditions
        </a>
        . For cancellations and returns on a confirmed order, see our{" "}
        <a
          href="/refund-policy"
          className="text-primary hover:text-foreground underline underline-offset-2"
        >
          Refund &amp; Cancellation Policy
        </a>
        .
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
