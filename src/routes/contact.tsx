import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { EASE_UI, Reveal, StampHeading } from "@/components/site/motion";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { breadcrumbSchema, buildPageHead, SITE, whatsappLink } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    buildPageHead({
      title: "Contact Mapps Creation — Fabric Enquiries, Surat",
      description:
        "Get in touch with Mapps Creation for wholesale Lycra, knitted and polyester-lycra fabric enquiries. WhatsApp, call, or send your requirement below.",
      path: "/contact",
      jsonLd: breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ]),
    }),
  component: Contact,
});

function Contact() {
  const { status, submit } = useFormSubmit();
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  // Read e.currentTarget.value synchronously, right here — it's only valid
  // while the event is actively dispatching. Closing over `e` inside the
  // setState updater instead (i.e. reading it there rather than here) is
  // unsafe: React can invoke that updater a second time later, by which
  // point the native event has already been recycled and currentTarget is null.
  const set =
    (key: keyof typeof form) => (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.currentTarget.value;
      setForm((f) => ({ ...f, [key]: value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submit({
      subject: `Fabric enquiry from ${form.name || "website visitor"}`,
      from_name: SITE.name,
      name: form.name,
      phone: form.phone,
      email: form.email,
      message: form.message,
    });
  };

  return (
    <div className="pt-28 md:pt-36">
      <section className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <p className="label-caps text-primary">Contact</p>
          <StampHeading lines={["Let's talk fabric"]} className="display-lg mt-4 max-w-2xl" />
          <p className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed md:text-lg">
            Share your fabric type, GSM and quantity — we usually reply the same working day with
            swatches and a rate.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-14 pb-24 md:grid-cols-5 md:gap-16 md:pb-32">
          {/* DIRECT CONTACT */}
          <Reveal index={1} className="md:col-span-2">
            <div className="space-y-6">
              <a
                href={whatsappLink(
                  "Hi Mapps Creation, I would like to make a fabric requirement enquiry. Please share details.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                title="Enquire on WhatsApp"
                className="border-border hover:border-primary/60 group flex items-center gap-4 border p-5 transition-colors"
              >
                <span className="bg-primary text-primary-foreground flex h-11 w-11 shrink-0 items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <span>
                  <span className="label-caps text-muted-foreground block">Enquire Now</span>
                  <span className="text-foreground group-hover:text-primary text-lg transition-colors">
                    {SITE.phoneDisplay}
                  </span>
                </span>
              </a>

              <a
                href={`tel:${SITE.phone}`}
                className="border-border hover:border-primary/60 group flex items-center gap-4 border p-5 transition-colors"
              >
                <span className="bg-primary text-primary-foreground flex h-11 w-11 shrink-0 items-center justify-center">
                  <Phone className="h-5 w-5" />
                </span>
                <span>
                  <span className="label-caps text-muted-foreground block">Call Now</span>
                  <span className="text-foreground group-hover:text-primary text-lg transition-colors">
                    {SITE.phoneDisplay}
                  </span>
                </span>
              </a>

              <a
                href={`mailto:${SITE.email}`}
                className="border-border hover:border-primary/60 group flex items-center gap-4 border p-5 transition-colors"
              >
                <span className="bg-primary text-primary-foreground flex h-11 w-11 shrink-0 items-center justify-center">
                  <Mail className="h-5 w-5" />
                </span>
                <span>
                  <span className="label-caps text-muted-foreground block">Email Us</span>
                  <span className="text-foreground group-hover:text-primary text-base sm:text-lg transition-colors">
                    {SITE.email}
                  </span>
                </span>
              </a>

              <div className="border-border flex items-center gap-4 border p-5">
                <span className="bg-secondary text-secondary-foreground flex h-11 w-11 shrink-0 items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </span>
                <span>
                  <span className="label-caps text-muted-foreground block">Location</span>
                  <span className="text-foreground text-lg">{SITE.city}, India</span>
                </span>
              </div>
            </div>
          </Reveal>

          {/* FORM */}
          <Reveal index={2} className="md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="label-caps text-muted-foreground">Name</span>
                  <input
                    required
                    value={form.name}
                    onChange={set("name")}
                    className="border-border bg-card text-foreground focus:border-primary mt-2 w-full min-h-[52px] border px-4 outline-none transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="label-caps text-muted-foreground">Phone</span>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    className="border-border bg-card text-foreground focus:border-primary mt-2 w-full min-h-[52px] border px-4 outline-none transition-colors"
                  />
                </label>
              </div>
              <label className="block">
                <span className="label-caps text-muted-foreground">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  className="border-border bg-card text-foreground focus:border-primary mt-2 w-full min-h-[52px] border px-4 outline-none transition-colors"
                />
              </label>
              <label className="block">
                <span className="label-caps text-muted-foreground">
                  Requirement (fabric, GSM, quantity)
                </span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={set("message")}
                  className="border-border bg-card text-foreground focus:border-primary mt-2 w-full border p-4 outline-none transition-colors"
                />
              </label>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-enquire btn-enquire-gold !min-h-[52px] !text-xs !px-7 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  <Send className="h-4 w-4" />
                  {status === "submitting" ? "Sending..." : "Send Enquiry"}
                </span>
              </button>

              {status === "success" && (
                <p className="text-primary text-sm">
                  Thank you — your enquiry has been sent. We'll be in touch shortly.
                </p>
              )}
              {status === "error" && (
                <p className="text-destructive text-sm">
                  Something went wrong sending that. Please WhatsApp or call us instead — we'll
                  respond faster that way.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
