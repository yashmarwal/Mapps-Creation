"use client";

import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Download,
  ExternalLink,
  MessageCircle,
  MessageCircleQuestion,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SITE, whatsappLink } from "@/lib/seo";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";
import { LogoMark } from "./LogoMark";
import { EASE_REVEAL, EASE_UI } from "./motion";

type Msg = { role: "user" | "agent"; text: string };

const SUGGESTED_CHIPS = [
  { icon: "📄", text: "Can I download your B2B PDF Catalogue?", label: "Download PDF" },
  { icon: "💬", text: "Can I connect directly on WhatsApp?", label: "WhatsApp Sales Desk" },
  { icon: "📦", text: "What is your minimum order quantity (MOQ)?", label: "MOQ & Rates" },
  { icon: "🧵", text: "Can I get free fabric swatch samples?", label: "Free Swatches" },
  { icon: "⚡", text: "How fast is delivery & dispatch?", label: "Lead Time & Dispatch" },
  { icon: "🚚", text: "Do you supply outside Gujarat?", label: "Pan-India Shipping" },
  { icon: "🏃", text: "Do you have sportswear & legging fabrics?", label: "Activewear & Lycra" },
  { icon: "💳", text: "How do I pay & get GST tax invoice?", label: "Payment & Billing" },
  { icon: "🎨", text: "Can you match custom Pantone shades?", label: "Shade Matching" },
  { icon: "💰", text: "Are there bulk discounts for large orders?", label: "Bulk Discounts" },
];

const KNOWLEDGE_BASE: { keywords: string[]; response: string }[] = [
  {
    keywords: [
      "pdf",
      "download catalog",
      "pdf catalog",
      "download pdf",
      "spec sheet",
      "pdf catalogue",
    ],
    response:
      "Yes! You can download our official B2B Wholesale Fabric Catalogue PDF with GSM specs, fabric images, wholesale rates, MOQ, and GST details.",
  },
  {
    keywords: ["product", "categories", "range", "what do you sell", "fabric type", "offer"],
    response:
      "We stock 8 premium fabric categories: Lycra Fabric, Lycra Knitted Fabric, Polyester Lycra Fabric, Melange Fabric, T-Shirt Fabric, Twill Fabric, Matty Fabric, and custom knitted blends — see our Catalogue for complete specs.",
  },
  {
    keywords: ["kg", "meter", "unit", "sell by"],
    response:
      "Knitted qualities are traded by kg and woven qualities like twill and matty by meter. We quote in whichever unit suits your costing.",
  },
  {
    keywords: ["moq", "minimum", "minimum order", "how many", "small order"],
    response:
      "MOQ depends on the fabric and shade — stock qualities start from a single roll, while dyed-to-order shades typically start around 50 kg per colour.",
  },
  {
    keywords: ["sample", "samples", "swatch", "try before"],
    response:
      "Yes — we share swatches of the closest matching quality free of charge. Outstation courier is arranged at actuals.",
  },
  {
    keywords: ["price", "pricing", "cost", "rate", "quote", "quotation"],
    response:
      "Share your fabric type, GSM, shade and required quantity — we usually reply with today's firm rate the same working day.",
  },
  {
    keywords: ["payment", "pay", "upi", "bank", "gst", "invoice", "bill"],
    response:
      "We accept bank transfer (NEFT/RTGS/UPI) and bill every order with a proper GST invoice — Mapps Creation is a GST-registered business.",
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
      "All orders dispatch from our Surat facility. We regularly supply garment manufacturers across India — Delhi, Mumbai, Bengaluru, Tirupur, Ludhiana and more — via road transport.",
  },
  {
    keywords: ["quality", "check", "defect", "gsm", "stretch"],
    response:
      "GSM, shade and stretch recovery are verified roll by roll before anything leaves our Surat facility.",
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
      "Mapps Creation is a GST-registered wholesale trader based in Surat, Gujarat, established in 2024. We supply Lycra, knitted and polyester-lycra fabrics to garment manufacturers across India.",
  },
  {
    keywords: ["contact", "phone", "whatsapp", "call", "reach", "number"],
    response: `You can reach our sales desk directly on WhatsApp or call: ${SITE.phoneDisplay}.`,
  },
  {
    keywords: ["wholesale", "register", "bulk", "partner", "buyer"],
    response:
      "For structured wholesale enquiries, fill out the registration form on our Wholesale page — we'll follow up with swatches and proforma pricing.",
  },
  {
    keywords: ["melange", "grey melange", "charcoal"],
    response:
      "Our Melange Fabric range includes grey and charcoal shades in cotton-blend knits — check the Catalogue for GSM and blend ratios.",
  },
  {
    keywords: ["twill", "matty", "woven"],
    response:
      "Twill and Matty are our woven qualities traded by meter. Twill suits bottomwear structure, while Matty is a lighter, breathable weave.",
  },
  {
    keywords: ["t-shirt", "tshirt", "tee fabric"],
    response:
      "Our T-Shirt Fabric range includes cotton and cotton-lycra knits, bio-washed for a soft handfeel — ideal for sportswear and streetwear.",
  },
  {
    keywords: ["shade match", "match shade", "colour match", "color match", "existing swatch"],
    response:
      "Send us your existing swatch or shade/GSM specification over WhatsApp — we'll match it as closely as the base quality allows.",
  },
  {
    keywords: ["source", "sourcing", "mill", "where from", "manufacture", "manufacturer"],
    response:
      "We source directly from leading mills in Surat — India's knitting & dyeing hub — keeping pricing competitive.",
  },
  {
    keywords: ["first time", "new buyer", "trial", "small quantity", "test order"],
    response:
      "First-time buyers can start with a trial roll quantity — there's no separate minimum for new buyers beyond standard MOQ.",
  },
  {
    keywords: [
      "roll length",
      "roll size",
      "meters per roll",
      "kg per roll",
      "packing",
      "roll weight",
    ],
    response:
      "Standard fabric rolls range from 20 kg to 35 kg per roll (~80 to 120 meters depending on GSM). All rolls are poly-wrapped and labeled with net weight & GSM.",
  },
  {
    keywords: ["custom gsm", "width", "tubular", "open width", "dia", "diameter", "custom width"],
    response:
      "Stock rolls come in standard 60-72 inch tubular or open width. Custom GSM and widths can be knitted to order for bulk requirements (100+ kg).",
  },
  {
    keywords: ["shrinkage", "color fastness", "bleeding", "washing", "color fade", "wash care"],
    response:
      "All Lycra and knitted qualities undergo pre-shrunk & heat-setting processes. We ensure commercial color fastness (3-4 grade) suitable for garment manufacturing.",
  },
  {
    keywords: [
      "sportswear",
      "activewear",
      "dry fit",
      "dri fit",
      "gymwear",
      "leggings",
      "track pants",
      "4 way",
      "four way",
    ],
    response:
      "We stock high-stretch Polyester Lycra, Spandex, and 4-way Lycra knits designed specifically for gymwear, leggings, track pants, and sportswear with high stretch recovery.",
  },
  {
    keywords: ["bulk discount", "discount", "cheaper rate", "volume discount", "large order"],
    response:
      "Yes! Volume orders (500+ kg or multi-roll full lot orders) qualify for competitive tiered wholesale rates. Share your expected monthly volume over WhatsApp for a quote.",
  },
  {
    keywords: [
      "lead time",
      "turnaround",
      "dispatch time",
      "delivery time",
      "how long",
      "fast delivery",
    ],
    response:
      "In-stock roll qualities dispatch from our Surat warehouse within 24-48 hours. Custom dyed or mill-knitted orders take approximately 7 to 12 working days.",
  },
  {
    keywords: ["gst rate", "tax", "hsn code", "gst percent", "tax rate", "5%"],
    response:
      "Fabrics are billed under standard textile HSN codes with a 5% GST rate as per Indian tax regulations. Official GST invoices are provided with every order.",
  },
  {
    keywords: ["custom dye", "panton", "pantone", "dyed to order", "lab dip", "custom shade"],
    response:
      "Yes! Share your Pantone TCX shade code or send a physical swatch. We provide lab-dip approvals before commercial mill dyeing (MOQ ~50 kg per shade).",
  },
  {
    keywords: ["blend", "composition", "cotton lycra blend", "spandex percentage", "cotton poly"],
    response:
      "Our standard blends include 95% Cotton / 5% Spandex, 88% Polyester / 12% Lycra, 100% Bio-washed Cotton, and Cotton-Poly Melange knits.",
  },
  {
    keywords: ["export", "packing", "transportation charge", "freight", "bale", "bundle"],
    response:
      "Rolls are heavy-duty poly-wrapped and baled for safe long-distance transit. Freight charges are billed at actuals via trusted road logistics.",
  },
  {
    keywords: ["faq", "more questions", "other questions"],
    response:
      "Check our FAQ page for complete answers on pricing, roll specs, and sample dispatch.",
  },
  {
    keywords: ["hi", "hello", "hey", "namaste"],
    response:
      "Hello! I am your AI Fabric Assistant. Ask me about fabric GSM, wholesale pricing, MOQ, swatches, custom dyeing, or dispatch hubs.",
  },
];

const FALLBACK = `Thanks for asking — for detailed custom fabric specifications, connect directly with our Surat sales team on WhatsApp / Call: ${SITE.phoneDisplay}`;

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  const match = KNOWLEDGE_BASE.find((entry) => entry.keywords.some((k) => lower.includes(k)));
  return match ? match.response : FALLBACK;
}

function TriggerButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  const [showIcon, setShowIcon] = useState(true);

  useEffect(() => {
    if (open) return;
    const id = window.setInterval(() => setShowIcon((v) => !v), 2500);
    return () => window.clearInterval(id);
  }, [open]);

  return (
    <div className="fixed bottom-6 left-6 z-[95] hidden md:flex items-center gap-2 group">
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={open ? { y: 0 } : { y: [0, -5, 0] }}
        transition={open ? { duration: 0.2 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
        aria-label={open ? "Close chat" : "Ask Mapps Creation AI Help"}
        className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 relative h-14 w-14 items-center justify-center rounded-full shadow-[0_0_25px_rgba(201,166,107,0.5)] flex border border-amber-300/40 cursor-pointer overflow-hidden"
      >
        <span className="absolute inset-0 bg-white/20 animate-pulse" />
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25, ease: EASE_UI }}
            >
              <X className="h-5 w-5 text-slate-950" />
            </motion.span>
          ) : showIcon ? (
            <motion.span
              key="icon"
              initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 15 }}
              transition={{ duration: 0.35, ease: EASE_UI }}
            >
              <Sparkles className="h-6 w-6 text-slate-950" />
            </motion.span>
          ) : (
            <motion.span
              key="ask"
              initial={{ opacity: 0, y: 8, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.7 }}
              transition={{ duration: 0.3, ease: EASE_UI }}
              className="text-[11px] font-bold tracking-wider uppercase text-slate-950"
            >
              AI Help
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      {!open && (
        <span className="bg-[#0A1628]/95 border border-[var(--gold)]/40 text-foreground font-semibold label-caps backdrop-blur-xl px-3 py-1.5 rounded-full text-[10px] tracking-wider shadow-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
          Ask AI Fabric Specialist
        </span>
      )}
    </div>
  );
}

export function AskUsChat({
  open,
  onOpenChange,
  onOpenCatalog,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenCatalog?: () => void;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "agent",
      text: "Hello! I am your Mapps Creation AI Assistant. Ask me anything about fabric specifications, MOQ, sample swatches, or Pan-India delivery.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, isTyping]);

  const send = (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Msg = { role: "user", text };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const resp = getResponse(text);
      setMsgs((m) => [...m, { role: "agent", text: resp }]);
      setIsTyping(false);
    }, 550);
  };

  return (
    <>
      <TriggerButton open={open} onClick={() => onOpenChange(!open)} />
      <AnimatePresence>
        {open && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.35, ease: EASE_REVEAL }}
            className="border-[var(--gold)]/35 bg-[#0A1628]/95 backdrop-blur-2xl text-foreground safe-bottom fixed inset-x-0 bottom-0 z-[96] flex h-[82vh] flex-col border rounded-t-2xl shadow-2xl md:h-[500px] md:w-[360px] md:inset-x-auto md:bottom-24 md:left-6 md:rounded-2xl touch-pan-y overscroll-contain overflow-hidden"
            style={{ overscrollBehavior: "contain", touchAction: "pan-y" }}
          >
            {/* Header */}
            <div className="border-border/60 bg-slate-950/60 flex items-center justify-between gap-3 border-b p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Bot className="h-4.5 w-4.5" />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold leading-tight text-foreground flex items-center gap-1.5">
                    Mapps AI Assistant
                  </h3>
                  <p className="text-[10px] text-emerald-400 font-medium tracking-wider uppercase flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" /> Online
                    · Instant Answers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <a
                  href={whatsappLink(
                    "Hi Mapps Creation, I'd like to talk directly with your sales team.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Connect with Human Sales Expert on WhatsApp"
                  aria-label="Connect with Human Sales Expert on WhatsApp"
                  className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase transition-all flex items-center gap-1 cursor-pointer"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close chat"
                  className="text-muted-foreground hover:text-foreground p-1.5 transition-colors cursor-pointer rounded-md hover:bg-card"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div
              ref={scrollRef}
              data-lenis-prevent
              className="flex-1 space-y-3.5 overflow-y-auto p-4 touch-pan-y"
              style={{ overscrollBehavior: "contain", touchAction: "pan-y" }}
            >
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      m.role === "agent"
                        ? "bg-slate-900/90 border border-slate-700/60 text-slate-100 rounded-2xl rounded-tl-none p-3.5 shadow-sm max-w-[90%]"
                        : "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-2xl rounded-tr-none px-4 py-2.5 shadow-md max-w-[85%]"
                    }`}
                  >
                    {m.role === "agent" && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">
                        <LogoMark size={12} /> Mapps Creation
                      </div>
                    )}
                    {m.text}

                    {/* Auto-detected Inline Action Links */}
                    {m.role === "agent" &&
                      (m.text.includes("PDF") || m.text.includes("pdf")) &&
                      onOpenCatalog && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              onOpenChange(false);
                              onOpenCatalog();
                            }}
                            className="btn-enquire btn-enquire-gold !py-1 !px-2.5 !text-[10px]"
                          >
                            <span>
                              <Download className="h-3 w-3" /> Download B2B PDF Catalogue
                            </span>
                          </button>
                        </div>
                      )}
                    {m.role === "agent" &&
                      m.text.includes("Catalogue") &&
                      !m.text.includes("PDF") && (
                        <div className="pt-2">
                          <Link
                            to="/catalogue"
                            onClick={() => onOpenChange(false)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold label-caps text-amber-400 border border-amber-400/40 rounded px-2 py-1 hover:bg-amber-400 hover:text-slate-950 transition-all"
                          >
                            View Catalogue <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      )}
                    {m.role === "agent" &&
                      (m.text.includes("WhatsApp") || m.text.includes("reach us")) && (
                        <div className="pt-2">
                          <a
                            href={whatsappLink(
                              "Hi Mapps Creation, I would like to make an enquiry.",
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-enquire !py-1 !px-2.5 !text-[10px]"
                          >
                            <span>
                              <WhatsAppIcon className="h-3 w-3" /> WhatsApp Sales Desk
                            </span>
                          </a>
                        </div>
                      )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 text-slate-400 rounded-2xl rounded-tl-none p-3 max-w-[120px]">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-amber-400">
                    Thinking
                  </span>
                  <span className="flex gap-1">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </span>
                </div>
              )}

              {/* Suggested Quick Chips */}
              {msgs.length <= 2 && !isTyping && (
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                    Quick Topics
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_CHIPS.map((chip) => (
                      <button
                        key={chip.text}
                        onClick={() => send(chip.text)}
                        className="bg-card/80 border-border/80 text-foreground hover:border-amber-400/60 hover:text-amber-400 border px-2.5 py-1.5 rounded-xl text-[11px] font-medium tracking-wide transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{chip.icon}</span>
                        <span>{chip.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Persistent Quick Action Footer Bar */}
            <div className="bg-slate-950/90 border-t border-slate-800/80 px-3 py-2 flex items-center justify-between gap-2">
              <a
                href={whatsappLink("Hi Mapps Creation, I would like to make an enquiry.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-enquire flex-1 !min-h-[34px] !py-1 !px-2 !text-[10px] !rounded-lg"
              >
                <span>
                  <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp Us
                </span>
              </a>
              {onOpenCatalog && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    onOpenCatalog();
                  }}
                  className="btn-enquire btn-enquire-gold flex-1 !min-h-[34px] !py-1 !px-2 !text-[10px] !rounded-lg"
                >
                  <span>
                    <Download className="h-3.5 w-3.5" /> PDF Catalogue
                  </span>
                </button>
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-border/60 bg-slate-950 flex shrink-0 items-center gap-2 border-t p-3 backdrop-blur-md"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your fabric query..."
                className="text-foreground focus:border-amber-400 flex-1 border-b border-transparent bg-transparent px-2 py-1.5 text-xs sm:text-sm outline-none transition-colors placeholder:text-muted-foreground/70"
              />
              <button
                type="submit"
                aria-label="Send query"
                disabled={!input.trim() || isTyping}
                className="bg-amber-500 text-slate-950 hover:bg-amber-400 p-2 rounded-lg transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
