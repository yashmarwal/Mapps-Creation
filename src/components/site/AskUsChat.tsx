"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircleQuestion, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/seo";
import { EASE_UI } from "./motion";

type Msg = { role: "user" | "agent"; text: string };

const SUGGESTED = [
  "What's your minimum order quantity?",
  "Can I get samples first?",
  "Do you supply outside Gujarat?",
  "How do I pay for an order?",
];

const KNOWLEDGE_BASE: { keywords: string[]; response: string }[] = [
  {
    keywords: ["product", "categories", "range", "what do you sell", "fabric type", "offer"],
    response:
      "We stock 8 fabric categories: Lycra Fabric, Lycra Knitted Fabric, Polyester Lycra Fabric, Melange Fabric, T-Shirt Fabric, Twill Fabric, Matty Fabric, and Other Products — see the full Catalogue for specs.",
  },
  {
    keywords: ["kg", "meter", "unit", "sell by"],
    response:
      "Knitted qualities are usually traded by kg and woven qualities like twill and matty by meter — we quote in whichever unit suits your costing.",
  },
  {
    keywords: ["moq", "minimum", "minimum order", "how many", "small order"],
    response:
      "MOQ depends on the fabric and shade — stock qualities can start from a single roll, while dyed-to-order shades typically start around 50 kg per colour. Share your requirement and we'll confirm.",
  },
  {
    keywords: ["sample", "samples", "swatch", "try before"],
    response:
      "Yes — we share swatches of the closest matching quality free of charge. Courier is arranged at actuals for outstation buyers.",
  },
  {
    keywords: ["price", "pricing", "cost", "rate", "quote", "quotation"],
    response:
      "Share your fabric type, GSM, shade and quantity over WhatsApp — we usually confirm a rate the same working day.",
  },
  {
    keywords: ["payment", "pay", "upi", "bank", "gst", "invoice", "bill"],
    response:
      "We accept bank transfer (NEFT/RTGS/UPI) and bill every order with a proper GST invoice — Mapps Creation is a GST-registered proprietorship.",
  },
  {
    keywords: [
      "ship",
      "shipping",
      "dispatch",
      "delivery",
      "transport",
      "surat",
      "outside gujarat",
      "delhi",
      "mumbai",
      "bengaluru",
      "tirupur",
      "ludhiana",
    ],
    response:
      "All orders dispatch from our Surat facility. We regularly supply garment manufacturers across India — Delhi, Mumbai, Bengaluru, Tirupur, Ludhiana and more — via road transport, billed at actuals.",
  },
  {
    keywords: ["quality", "check", "defect", "gsm", "stretch"],
    response:
      "GSM, shade and stretch recovery are verified roll by roll before anything leaves our facility, so what you receive matches the swatch you approved.",
  },
  {
    keywords: [
      "about",
      "company",
      "gst registered",
      "established",
      "founded",
      "team",
      "who are you",
    ],
    response:
      "Mapps Creation is a GST-registered wholesale trader based in Surat, Gujarat, established in 2024. We're a growing team supplying Lycra, knitted and polyester-lycra fabrics to garment manufacturers across India.",
  },
  {
    keywords: ["contact", "phone", "whatsapp", "call", "reach", "number"],
    response: `You can reach us directly:\nWhatsApp / Call: ${SITE.phoneDisplay}\nOr use the enquiry form on our Contact page.`,
  },
  {
    keywords: ["wholesale", "register", "bulk", "partner", "buyer"],
    response:
      "For structured wholesale enquiries, fill out the registration form on our Wholesale page — we'll follow up with swatches and pricing.",
  },
  {
    keywords: ["melange", "grey melange", "charcoal"],
    response:
      "Our Melange Fabric range includes grey and charcoal shades in cotton-blend knits — check the Catalogue for GSM and blend ratios on each variant.",
  },
  {
    keywords: ["twill", "matty", "woven"],
    response:
      "Twill and Matty are our woven qualities, traded by meter rather than kg. Twill suits bottomwear structure, Matty is a lighter, breathable weave — both available with or without stretch.",
  },
  {
    keywords: ["t-shirt", "tshirt", "tee fabric"],
    response:
      "Our T-Shirt Fabric range is cotton and cotton-lycra knits, bio-washed for a soft handfeel — suited to sportswear, streetwear and everyday knitwear production.",
  },
  {
    keywords: ["shade match", "match shade", "colour match", "color match", "existing swatch"],
    response:
      "Send us your existing swatch or a shade/GSM specification and we'll match it as closely as the base quality allows — this usually goes with a dyed-to-order request.",
  },
  {
    keywords: ["source", "sourcing", "mill", "where from", "manufacture", "manufacturer"],
    response:
      "We're a wholesale trader, not a manufacturer — we source directly from mills in Surat, India's knit and dyeing hub, which keeps pricing competitive without a chain of middlemen.",
  },
  {
    keywords: ["first time", "new buyer", "trial", "small quantity", "test order"],
    response:
      "First-time buyers are welcome to start with a trial quantity — there's no separate minimum for new buyers beyond the standard MOQ per fabric.",
  },
  {
    keywords: ["faq", "more questions", "other questions"],
    response: "Our full FAQ page covers pricing, dispatch, samples and more — worth a look.",
  },
  {
    keywords: ["hi", "hello", "hey", "namaste"],
    response:
      "Hi there! Ask me about our fabrics, pricing, MOQ, samples or dispatch — or pick one of the suggestions below.",
  },
];

const FALLBACK = `Thanks for the question — for the most accurate answer, please reach out directly:\nWhatsApp / Call: ${SITE.phoneDisplay}`;

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  const match = KNOWLEDGE_BASE.find((entry) => entry.keywords.some((k) => lower.includes(k)));
  return match ? match.response : FALLBACK;
}

function TriggerButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  const [showIcon, setShowIcon] = useState(true);

  useEffect(() => {
    if (open) return;
    const id = window.setInterval(() => setShowIcon((v) => !v), 2200);
    return () => window.clearInterval(id);
  }, [open]);

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      animate={open ? { y: 0 } : { y: [0, -6, 0] }}
      transition={open ? { duration: 0.2 } : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      aria-label={open ? "Close chat" : "Ask Mapps Creation"}
      className="bg-primary fixed bottom-6 left-6 z-[95] hidden h-14 w-14 items-center justify-center rounded-full shadow-[var(--shadow-gold)] md:flex"
    >
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.span
            key="close"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: EASE_UI }}
          >
            <X className="text-primary-foreground h-5 w-5" />
          </motion.span>
        ) : showIcon ? (
          <motion.span
            key="icon"
            initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 15 }}
            transition={{ duration: 0.35, ease: EASE_UI }}
          >
            <MessageCircleQuestion className="text-primary-foreground h-6 w-6" />
          </motion.span>
        ) : (
          <motion.span
            key="ask"
            initial={{ opacity: 0, y: 8, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.7 }}
            transition={{ duration: 0.3, ease: EASE_UI }}
            className="label-caps text-primary-foreground"
          >
            Ask
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function AskUsChat({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "agent",
      text: "Hi — I can help with quick questions about our fabrics, pricing and dispatch. Pick one below or type your own.",
    },
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!open) return;
    window.history.pushState({ chatOpen: true }, "");
    const onPop = () => onOpenChange(false);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }, { role: "agent", text: getResponse(text) }]);
    setInput("");
  };

  return (
    <>
      <TriggerButton open={open} onClick={() => onOpenChange(!open)} />
      <AnimatePresence>
        {open && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE_UI }}
            className="border-border bg-card safe-bottom fixed inset-x-0 bottom-0 z-[96] flex h-[72vh] flex-col border shadow-2xl md:h-[440px] md:w-[320px] md:inset-x-auto md:bottom-24 md:left-6"
          >
            <div className="border-border bg-background/60 flex items-start justify-between gap-3 border-b p-4">
              <div>
                <h3 className="font-display text-lg">Ask Mapps Creation</h3>
                <p className="text-muted-foreground mt-1 text-[10px] tracking-[0.15em] uppercase">
                  Quick answers, no waiting
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Close chat"
                className="text-muted-foreground hover:text-foreground -mr-1 -mt-1 shrink-0 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              data-lenis-prevent
              className="flex-1 space-y-3 overflow-y-auto p-4"
              style={{ overscrollBehavior: "contain" }}
            >
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={`text-sm leading-relaxed whitespace-pre-line ${
                    m.role === "agent"
                      ? "text-foreground"
                      : "bg-primary text-primary-foreground ml-8 px-3 py-2"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {msgs.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {SUGGESTED.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground border px-3 py-1.5 text-[11px] tracking-[0.08em] uppercase transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-border flex shrink-0 gap-2 border-t p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a question…"
                className="text-foreground focus:border-primary flex-1 border-b border-transparent bg-transparent px-1 py-2 text-sm outline-none"
              />
              <button type="submit" aria-label="Send" className="text-primary">
                <Send className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
