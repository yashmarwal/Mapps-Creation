"use client";

import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  ChevronRight,
  Download,
  ExternalLink,
  Send,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SITE, whatsappLink } from "@/lib/seo";
import { askAiAssistant } from "@/lib/aiAssistant.server";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";
import { BrandGlowOrb, type CopilotState } from "./icons/BrandGlowOrb";
import { SiriLiquidAiCore, type AIVisualState } from "./SiriLiquidAiCore";
import { EASE_REVEAL, EASE_UI } from "./motion";

type Msg = {
  role: "user" | "agent";
  text: string;
  confused?: boolean;
  timestamp?: string;
  isStreaming?: boolean;
  showCatalogCta?: boolean;
};

// Checked against the visitor's own question, not the answer text — an AI
// answer can phrase "yes, here's our range" a dozen different ways without
// ever saying the word "PDF", so relying on the reply text alone (as the
// button below used to) meant the download button wouldn't reliably show
// up just because someone asked for the catalogue.
function asksForCatalogue(text: string): boolean {
  return /\bcatalog(ue)?\b|\bpdf\b|\bbrochure\b|price\s*list|price\s*sheet|spec\s*sheet/i.test(
    text,
  );
}

const SUGGESTED_CHIPS = [
  { icon: "⚡", text: "What is your MOQ & roll weight for Lycra?", label: "MOQ & Roll Specs" },
  { icon: "📄", text: "Can I download your B2B PDF Catalogue?", label: "Download PDF" },
  { icon: "💬", text: "Connect directly with Surat Sales Desk", label: "WhatsApp Sales" },
  { icon: "🧵", text: "Can I get free fabric swatch samples?", label: "Free Swatches" },
  { icon: "🚚", text: "Do you ship to Mumbai, Delhi, Tirupur?", label: "Pan-India Shipping" },
  { icon: "🎨", text: "Can you match custom Pantone shades?", label: "Shade Matching" },
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
      "We stock 8 premium fabric categories: Lycra Fabric, Lycra Knitted Fabric, Polyester Lycra Fabric, Melange Fabric, T-Shirt Fabric, Twill Fabric, Matty Fabric, and custom knitted blends.",
  },
  {
    keywords: ["kg", "meter", "unit", "sell by"],
    response:
      "Knitted qualities are traded by kg and woven qualities like twill and matty by meter. We quote in whichever unit suits your garment costing.",
  },
  {
    keywords: ["moq", "minimum", "minimum order", "how many", "small order"],
    response:
      "MOQ depends on shade & quality. In-stock rolls start from a single roll (~25 kg), while custom dyed-to-order shades start around 50 kg per color.",
  },
  {
    keywords: ["sample", "samples", "swatch", "try before"],
    response:
      "Yes! We share physical fabric swatches of matching qualities free of charge. Courier charges are billed at actuals.",
  },
  {
    keywords: ["price", "pricing", "cost", "rate", "quote", "quotation"],
    response:
      "Share your required fabric GSM, shade, and quantity, and our Surat mill team usually replies with firm rates the same working day.",
  },
  {
    keywords: ["payment", "pay", "upi", "bank", "gst", "invoice", "bill"],
    response:
      "We accept bank transfer (NEFT/RTGS/UPI) and bill every order with a valid GST invoice; Mapps Creation is a 100% GST-registered business.",
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
      "All orders dispatch from our Surat warehouse. We regularly supply garment manufacturers across India via reliable road logistics.",
  },
  {
    keywords: [
      "sportswear",
      "activewear",
      "dry fit",
      "gymwear",
      "leggings",
      "track pants",
      "4 way",
      "four way",
    ],
    response:
      "We stock high-stretch Polyester Lycra, Spandex, and 4-way Lycra knits engineered specifically for gymwear, leggings, and sportswear with high recovery.",
  },
  {
    keywords: ["hi", "hello", "hey", "namaste", "mappsy", "ai"],
    response:
      "Hello! I am MAPPSY, your Mapps Creation AI Fabric Specialist. Ask me about fabric GSM, wholesale pricing, MOQ, swatches, custom dyeing, or dispatch hubs.",
  },
];

const FALLBACK = `Thanks for asking! For custom mill lot specifications or firm pricing, connect directly with our Surat sales desk on WhatsApp / Call: ${SITE.phoneDisplay}`;

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  const match = KNOWLEDGE_BASE.find((entry) => entry.keywords.some((k) => lower.includes(k)));
  return match ? match.response : FALLBACK;
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
  const location = useLocation();
  const pathname = location.pathname;

  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "agent",
      text: "Hi! I'm MAPPSY, your AI fabric specialist. Ask me anything about fabric GSM, MOQ, swatches, custom dyeing, or wholesale rates.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copilotState, setCopilotState] = useState<CopilotState>("idle");
  const [aiVisualState, setAiVisualState] = useState<AIVisualState>("idle");
  const [proactiveNudge, setProactiveNudge] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Derive typing / idle state smoothly when user interacts with input
  useEffect(() => {
    if (
      isTyping ||
      aiVisualState === "sending" ||
      aiVisualState === "thinking" ||
      aiVisualState === "streaming" ||
      aiVisualState === "complete"
    ) {
      return;
    }
    if (input.trim().length > 0) {
      setAiVisualState("typing");
    } else {
      setAiVisualState("idle");
    }
  }, [input, isTyping, aiVisualState]);

  // Consciousness: Page Route Context Sensing
  const getRouteContextLabel = () => {
    if (pathname === "/") return "Home → Fabric Overview";
    if (pathname.startsWith("/catalogue")) return "Catalogue → 500+ Lycra Qualities";
    if (pathname.startsWith("/wholesale")) return "Wholesale → B2B Factory Pricing";
    if (pathname.startsWith("/about")) return "About → Surat Mill Hub";
    if (pathname.startsWith("/contact")) return "Contact → Direct Sales Desk";
    return "Surat Fabric Hub";
  };

  // Proactive Nudge on Scroll / Navigation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!open) {
        if (pathname.startsWith("/catalogue")) {
          setProactiveNudge("Looking for 4-Way Lycra or Cotton Spandex? ASK MAPPSY!");
        } else if (pathname.startsWith("/wholesale")) {
          setProactiveNudge("Inquire for factory direct rates on 500+ kg bulk lots!");
        } else {
          setProactiveNudge("ASK MAPPSY active. Click to chat!");
        }
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [pathname, open]);

  // `onOpenChange` is `setAskOpen` passed straight through from __root.tsx
  // (a real useState setter, stable across renders), so this isn't
  // currently the pushState-feedback-loop bug documented in
  // DownloadCatalogModal.tsx — but the same ref pattern is applied here too
  // so this stays safe even if that prop is ever passed differently.
  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  // Handle mobile & browser back button to close chat modal gracefully
  useEffect(() => {
    if (!open) return;

    window.history.pushState({ chatModalOpen: true }, "");

    const handlePopState = () => {
      onOpenChangeRef.current(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [open]);

  // Auto-scroll chat body smoothly during live text delivery
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [msgs, isTyping, copilotState]);

  // Silky smooth character-by-character streaming effect for zero jitter
  const streamAgentMessage = (fullText: string, isConfused: boolean, showCatalogCta: boolean) => {
    let charIdx = 0;
    const totalChars = fullText.length;

    setMsgs((m) => [
      ...m,
      {
        role: "agent",
        text: "",
        confused: isConfused,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isStreaming: true,
        showCatalogCta,
      },
    ]);

    setCopilotState("speaking");
    setAiVisualState("streaming");

    // Smooth character cadence: 2 chars every 18ms (silky smooth, no line wrap jumping)
    const step = 2;
    const interval = setInterval(() => {
      charIdx = Math.min(totalChars, charIdx + step);
      const textChunk = fullText.slice(0, charIdx);

      setMsgs((m) => {
        const updated = [...m];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.role === "agent") {
          lastMsg.text = textChunk;
        }
        return updated;
      });

      if (charIdx >= totalChars) {
        clearInterval(interval);
        setMsgs((m) => {
          const updated = [...m];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg) lastMsg.isStreaming = false;
          return updated;
        });
        setCopilotState(isConfused ? "confused" : "happy");
        setAiVisualState("complete");
        setTimeout(() => {
          setCopilotState("idle");
          setAiVisualState("idle");
        }, 1500);
        setIsTyping(false);
      }
    }, 18);
  };

  const send = (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Msg = {
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);
    setCopilotState("thinking");
    setAiVisualState("sending");

    setTimeout(() => {
      setAiVisualState("thinking");
    }, 350);

    const wantsCatalogue = asksForCatalogue(text);
    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, 600));
    Promise.all([askAiAssistant({ data: { message: text } }).catch(() => null), minDelay])
      .then(([aiResp]) => {
        const resp = aiResp ?? getResponse(text);
        streamAgentMessage(resp, resp === FALLBACK, wantsCatalogue);
      })
      .catch(() => {
        const fallbackResp = getResponse(text);
        streamAgentMessage(fallbackResp, true, wantsCatalogue);
      });
  };

  return (
    <>
      {/* Floating Rotative Shadow AI Core Button */}
      <div className="fixed bottom-6 left-6 z-[95] hidden md:flex items-center gap-3">
        {/* Proactive Speech Bubble */}
        <AnimatePresence>
          {!open && proactiveNudge && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              onClick={() => {
                onOpenChange(true);
                setProactiveNudge(null);
              }}
              className="absolute -top-12 left-0 bg-[#070D19]/95 border border-amber-500/40 text-amber-300 text-[11px] font-medium px-3.5 py-1.5 rounded-xl shadow-xl backdrop-blur-xl flex items-center gap-2 cursor-pointer hover:border-amber-400 transition-all whitespace-nowrap"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span>{proactiveNudge}</span>
              <X
                className="h-3 w-3 text-slate-400 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setProactiveNudge(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Circular Floating Siri Liquid Energy Core Trigger */}
        <motion.button
          onClick={() => {
            onOpenChange(!open);
            setProactiveNudge(null);
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="group relative flex h-17 w-17 items-center justify-center rounded-full cursor-pointer focus:outline-none"
          aria-label={open ? "Close chat" : "ASK MAPPSY"}
        >
          <SiriLiquidAiCore state={aiVisualState} size={66} />

          {/* Hover Tag */}
          {!open && (
            <span className="absolute left-18 bg-[#070D19]/95 border border-amber-500/40 text-slate-100 font-semibold label-caps backdrop-blur-2xl px-3 py-1.5 rounded-full text-[10px] tracking-wider shadow-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
              ASK MAPPSY
            </span>
          )}
        </motion.button>
      </div>

      {/* Main Interactive Window Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.28, ease: EASE_REVEAL }}
            className="border-amber-500/20 bg-[#070D19]/98 backdrop-blur-3xl text-foreground safe-bottom fixed inset-x-0 bottom-0 z-[96] flex h-[85vh] flex-col border rounded-t-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] md:h-[500px] md:w-[380px] md:inset-x-auto md:bottom-24 md:left-6 md:rounded-2xl touch-pan-y overscroll-contain overflow-hidden"
          >
            {/* Header HUD */}
            <div className="border-b border-slate-800/80 bg-slate-950/90 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <SiriLiquidAiCore state={aiVisualState} size={42} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-sm font-bold text-slate-100 tracking-wide">
                      ASK MAPPSY
                    </h3>
                    <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      LIVE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-emerald-400" />
                    {getRouteContextLabel()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
                aria-label="Close MAPPSY"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Chat Body & Live Streamer */}
            <div
              ref={scrollRef}
              data-lenis-prevent
              className="flex-1 space-y-3.5 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-800"
            >
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`leading-relaxed ${
                      m.role === "agent"
                        ? "bg-slate-900/80 border border-slate-800/80 text-slate-200 rounded-2xl rounded-tl-sm p-3.5 shadow-sm max-w-[90%] text-xs sm:text-sm"
                        : "bg-amber-500/90 text-slate-950 font-medium rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm max-w-[85%] text-xs sm:text-sm"
                    }`}
                  >
                    {m.role === "agent" && (
                      <div className="flex items-center justify-between gap-2 text-[10px] font-semibold text-amber-400 tracking-wider mb-1.5 pb-1 border-b border-slate-800/60">
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                          <span>ASK MAPPSY</span>
                        </div>
                        {m.timestamp && (
                          <span className="font-mono text-[9px] text-slate-500">{m.timestamp}</span>
                        )}
                      </div>
                    )}

                    <div className="whitespace-pre-line leading-relaxed text-slate-200 font-normal">
                      {m.text}
                      {m.isStreaming && (
                        <span className="inline-block w-1.5 h-3.5 bg-gradient-to-t from-amber-500 to-amber-300 ml-1 rounded-sm opacity-90 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)] align-middle" />
                      )}
                    </div>

                    {/* Auto Action Buttons */}
                    {m.role === "agent" && !m.isStreaming && (
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {(m.showCatalogCta || m.text.includes("PDF") || m.text.includes("pdf")) &&
                          onOpenCatalog && (
                            <button
                              type="button"
                              onClick={() => {
                                onOpenChange(false);
                                onOpenCatalog();
                              }}
                              className="bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-amber-400 hover:text-slate-950 transition-all cursor-pointer"
                            >
                              <Download className="h-3 w-3" /> Download B2B PDF
                            </button>
                          )}
                        {m.text.includes("Catalogue") && !m.text.includes("PDF") && (
                          <Link
                            to="/catalogue"
                            onClick={() => onOpenChange(false)}
                            className="bg-slate-800 border border-slate-700 text-amber-400 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:border-amber-400 transition-all"
                          >
                            Browse Catalogue <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                        {(m.text.includes("WhatsApp") || m.text.includes("reach us")) && (
                          <a
                            href={whatsappLink(
                              "Hi Mapps Creation, I would like to inquire about fabric lot prices.",
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-[#25D366] hover:text-slate-950 transition-all"
                          >
                            <WhatsAppIcon className="h-3 w-3" /> Direct Sales Desk
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Live Neural Thinking State Indicator - Pure Orb */}
              {(isTyping ||
                copilotState === "thinking" ||
                aiVisualState === "thinking" ||
                aiVisualState === "sending") && (
                <div className="flex items-center py-1.5 px-1">
                  <SiriLiquidAiCore
                    state={aiVisualState === "idle" ? "thinking" : aiVisualState}
                    size={36}
                    className="shrink-0"
                  />
                </div>
              )}

              {/* Quick Action Suggestion Chips */}
              {msgs.length <= 2 && !isTyping && (
                <div className="space-y-2.5 pt-3 border-t border-slate-800/60">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Wand2 className="h-3 w-3 text-amber-400" /> Quick Questions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_CHIPS.map((chip) => (
                      <button
                        key={chip.text}
                        onClick={() => send(chip.text)}
                        className="bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/80 text-slate-300 hover:text-amber-300 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{chip.icon}</span>
                        <span>{chip.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-slate-800/60 bg-slate-950/90 p-3 shrink-0"
            >
              <div className="relative flex items-center bg-slate-900/90 border border-slate-800 focus-within:border-amber-500/50 rounded-full px-3.5 py-1.5 transition-colors">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setCopilotState("listening")}
                  onBlur={() => {
                    if (!isTyping) setCopilotState("idle");
                  }}
                  placeholder="Ask MAPPSY: GSM, MOQ, Pantone shade..."
                  className="text-slate-100 bg-transparent flex-1 text-xs sm:text-sm outline-none placeholder:text-slate-500 pr-2"
                />
                <button
                  type="submit"
                  aria-label="Send query to ASK MAPPSY"
                  disabled={!input.trim() || isTyping}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 p-2 rounded-full transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
