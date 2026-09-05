"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Download,
  FileText,
  Loader2,
  Mail,
  MessageCircle,
  Minus,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useQuoteBasket, type QuoteItem } from "@/hooks/useQuoteBasket";
import { LogoMark } from "./LogoMark";
import { EASE_UI } from "./motion";
import { SITE, whatsappLink } from "@/lib/seo";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { ProductPreviewModal } from "./ProductPreviewModal";

export function QuoteDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, updateShade, clearBasket } =
    useQuoteBasket();
  const { status, submit } = useFormSubmit();
  const [previewItem, setPreviewItem] = useState<QuoteItem | null>(null);

  const [buyerInfo, setBuyerInfo] = useState({
    company: "",
    phone: "",
    email: "",
    city: "Surat / Pan-India",
    notes: "",
  });

  const [mounted, setMounted] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close drawer on mobile/browser back button instead of navigating away
  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ quoteDrawerOpen: true }, "");

    const handlePopState = () => {
      setIsOpen(false);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (typeof window !== "undefined" && window.history.state?.quoteDrawerOpen) {
        window.history.back();
      }
    };
  }, [isOpen, setIsOpen]);

  const targetBody = typeof document !== "undefined" ? document.body : null;

  const printDocument =
    mounted && targetBody && items.length > 0
      ? createPortal(
          <div
            id="print-quote-root"
            className="hidden print:block fixed inset-0 bg-white text-slate-900 p-8 z-[999999] overflow-visible"
          >
            {/* Document Header */}
            <div className="flex justify-between items-start border-b-2 border-amber-600 pb-4 mb-6">
              <div className="flex items-center gap-4">
                <LogoMark size={54} />
                <div>
                  <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-wide">
                    MAPPS CREATION
                  </h1>
                  <p className="text-xs text-slate-600 font-medium">
                    Wholesale Lycra & Knitted Fabric Supplier
                  </p>
                  <p className="text-xs text-slate-500">Surat, Gujarat, India · GST Registered</p>
                </div>
              </div>
              <div className="text-right text-xs text-slate-600">
                <span className="inline-block bg-slate-100 text-slate-900 font-bold px-3 py-1 rounded text-xs uppercase mb-1">
                  PROFORMA ESTIMATE / QUOTE
                </span>
                <p className="font-mono text-slate-500">
                  Date: {new Date().toLocaleDateString("en-IN")}
                </p>
                <p>Direct Call / WhatsApp: +91 70460 09423</p>
                <p>Email: mappscreation@gmail.com</p>
              </div>
            </div>

            {/* Buyer & Logistics Block */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-bold uppercase text-slate-500 text-[10px] tracking-wider mb-1">
                  Buyer Details
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {buyerInfo.company || "Valued Wholesale Buyer"}
                </p>
                <p className="text-slate-700">Contact: {buyerInfo.phone || "N/A"}</p>
                <p className="text-slate-700">Email: {buyerInfo.email || "N/A"}</p>
              </div>
              <div>
                <p className="font-bold uppercase text-slate-500 text-[10px] tracking-wider mb-1">
                  Dispatch & Transport Details
                </p>
                <p className="text-slate-700">Dispatch Location: Surat, Gujarat</p>
                <p className="text-slate-700">Destination Hub: {buyerInfo.city}</p>
                <p className="text-slate-700">Terms: Wholesale Roll Supply / Mill Price</p>
              </div>
            </div>

            {/* Items Table WITH PRODUCT THUMBNAIL IMAGES */}
            <div className="mb-6">
              <table className="w-full text-left text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                    <th className="p-3 w-16 text-center border-b border-slate-900">Sample Image</th>
                    <th className="p-3 border-b border-slate-900">Fabric Description</th>
                    <th className="p-3 border-b border-slate-900">Category</th>
                    <th className="p-3 text-center border-b border-slate-900">Quantity</th>
                    <th className="p-3 border-b border-slate-900">Preferred Shade</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr
                      key={item.id || idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                    >
                      <td className="p-2 border-b border-slate-200 text-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name || "Fabric"}
                            className="w-12 h-12 object-cover rounded border border-slate-300 mx-auto"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-slate-100 rounded border border-slate-200 mx-auto flex items-center justify-center text-[8px] text-slate-400">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="p-3 border-b border-slate-200">
                        <p className="font-bold text-slate-900 text-sm">{item.name || "Fabric"}</p>
                        <p className="text-[10px] text-slate-500">Mapps Creation Surat Stock</p>
                      </td>
                      <td className="p-3 border-b border-slate-200 text-slate-700 font-medium">
                        {item.category || "General"}
                      </td>
                      <td className="p-3 border-b border-slate-200 text-center font-bold text-slate-900 text-sm">
                        {item.quantity || 50} {item.unit || "kg"}
                      </td>
                      <td className="p-3 border-b border-slate-200 font-medium text-slate-800">
                        {item.shade || "Standard Stock Shade"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notes & Approval Stamp */}
            <div className="border-t border-slate-300 pt-4 flex justify-between items-end text-xs text-slate-600">
              <div>
                <p className="font-bold text-slate-800">Mapps Creation Quality Assurance:</p>
                <p className="text-[10px] text-slate-500 max-w-md mt-1">
                  GSM, shade and stretch recovery are verified roll by roll before dispatch from our
                  Surat facility. Swatches available on request.
                </p>
              </div>
              <div className="text-right border-t border-slate-400 pt-2 px-6">
                <p className="font-bold text-slate-900">Authorized Signature</p>
                <p className="text-[10px] text-slate-500">Mapps Creation · Surat</p>
              </div>
            </div>
          </div>,
          targetBody,
        )
      : null;

  const handleInfoChange =
    (field: keyof typeof buyerInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setBuyerInfo((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const generateWhatsAppMessage = () => {
    let msg = `📋 *WHOLESALE BULK QUOTATION REQUEST*\n`;
    msg += `------------------------------------\n`;
    msg += `🏢 *Company/Brand*: ${buyerInfo.company || "Wholesale Buyer"}\n`;
    msg += `📞 *Contact*: ${buyerInfo.phone || "Not Provided"}\n`;
    msg += `📧 *Email*: ${buyerInfo.email || "Not Provided"}\n`;
    msg += `🚚 *Destination Hub*: ${buyerInfo.city}\n\n`;
    msg += `📦 *SELECTED FABRIC REQUIREMENTS* (${items.length} items):\n`;

    items.forEach((item, index) => {
      msg += `${index + 1}. *${item.name}* (${item.category})\n`;
      msg += `   • Quantity: ${item.quantity} ${item.unit}\n`;
      msg += `   • Preferred Shade: ${item.shade || "Standard Stock"}\n`;
    });

    if (buyerInfo.notes) {
      msg += `\n📝 *Notes*: ${buyerInfo.notes}\n`;
    }

    msg += `------------------------------------\n`;
    msg += `Please confirm stock availability, swatch samples & proforma quotation from Surat.`;

    return msg;
  };

  const handleWhatsAppSend = () => {
    if (items.length === 0) return;
    const message = generateWhatsAppMessage();
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  };

  const handlePrintPdf = () => {
    if (items.length === 0) return;
    window.print();
  };

  const handleEmailSend = (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const subject = encodeURIComponent(
      `Wholesale Bulk Quote Request — ${buyerInfo.company || "Wholesale Buyer"}`,
    );
    let bodyText = `WHOLESALE BULK QUOTATION REQUEST\n`;
    bodyText += `------------------------------------\n`;
    bodyText += `Company/Brand: ${buyerInfo.company || "Wholesale Buyer"}\n`;
    bodyText += `Phone: ${buyerInfo.phone || "Not Provided"}\n`;
    bodyText += `Email: ${buyerInfo.email || "Not Provided"}\n`;
    bodyText += `Destination Hub: ${buyerInfo.city}\n\n`;
    bodyText += `SELECTED FABRICS:\n`;
    items.forEach((item, idx) => {
      bodyText += `${idx + 1}. ${item.name} (${item.category}): ${item.quantity} ${item.unit}, Shade: ${item.shade || "Standard Stock"}\n`;
    });
    if (buyerInfo.notes) bodyText += `\nNotes: ${buyerInfo.notes}\n`;

    const mailtoUrl = `mailto:mappscreation@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;

    const payload = {
      name: buyerInfo.company || "Wholesale Buyer",
      company: buyerInfo.company,
      phone: buyerInfo.phone,
      email: buyerInfo.email,
      city: buyerInfo.city,
      message: bodyText,
      source: "wholesale-bulk-quotation-generator",
    };

    setEmailSuccess(true);
    window.location.href = mailtoUrl;
    submit(payload);
  };

  return (
    <>
      {/* Floating Trigger Badge */}
      <AnimatePresence>
        {items.length > 0 && !isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ cursor: "pointer" }}
            className="fixed bottom-24 right-6 z-[95] bg-[#0F2038] border border-[var(--gold)]/50 text-[var(--gold)] px-5 py-3.5 rounded-full shadow-[0_0_25px_rgba(201,166,107,0.3)] flex items-center gap-3 label-caps text-xs tracking-wider cursor-pointer"
          >
            <div className="relative flex items-center justify-center">
              <FileText className="h-4 w-4" />
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground h-4 w-4 rounded-full text-[10px] flex items-center justify-center font-bold">
                {items.length}
              </span>
            </div>
            <span>Quote List ({items.length})</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[240] bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Drawer Body */}
            <motion.div
              data-lenis-prevent
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: EASE_UI }}
              className="fixed inset-y-0 right-0 z-[250] w-full max-w-lg bg-[#0F2038] text-foreground border-l border-[var(--gold)]/30 flex flex-col shadow-2xl overscroll-contain touch-pan-y"
              style={{ overscrollBehavior: "contain", touchAction: "pan-y" }}
            >
              {/* Header */}
              <div className="p-5 border-b border-[var(--gold)]/20 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-3">
                  <LogoMark size={32} />
                  <div>
                    <h3 className="font-display text-lg tracking-wide text-foreground">
                      Bulk Quote Builder
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      Mapps Creation · Surat Dispatch
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      onClick={clearBasket}
                      title="Clear Quote List"
                      className="text-muted-foreground hover:text-destructive p-2 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-muted-foreground hover:text-foreground p-2 transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Items Scroll View */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <FileText className="h-12 w-12 text-[var(--gold)]/40 mx-auto" />
                    <h4 className="font-display text-xl">Your Quote List is Empty</h4>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      Browse our Catalogue and click "Add to Bulk Quote" to build an itemized
                      quotation.
                    </p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-[var(--gold)]/20 bg-card/60 p-4 rounded-xl space-y-3 relative group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setPreviewItem(item)}
                          aria-label={`Preview ${item.name}`}
                          className="flex items-center gap-3 bg-transparent p-0 text-left cursor-pointer group/preview"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-md object-cover border border-border/50 shrink-0 transition-transform group-hover/preview:scale-105"
                            />
                          )}
                          <div>
                            <span className="text-[10px] text-primary uppercase font-mono tracking-wider">
                              {item.category}
                            </span>
                            <h4 className="font-display text-base text-foreground mt-0.5 group-hover/preview:text-primary transition-colors">
                              {item.name}
                            </h4>
                          </div>
                        </button>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive p-1 transition-colors cursor-pointer shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/40">
                        {/* Quantity Stepper */}
                        <div>
                          <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                            Quantity ({item.unit})
                          </label>
                          <div className="flex items-center border border-border rounded-lg bg-background/50 overflow-hidden">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity - (item.unit === "kg" ? 10 : 25),
                                )
                              }
                              className="p-1.5 hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity || 50}
                              onChange={(e) =>
                                updateQuantity(item.id, parseInt(e.target.value) || 0)
                              }
                              className="no-spinner w-full text-center text-xs font-mono bg-transparent text-foreground outline-none py-1"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  (item.quantity || 50) + (item.unit === "kg" ? 10 : 25),
                                )
                              }
                              className="p-1.5 hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Shade Input */}
                        <div>
                          <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                            Preferred Shade
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Navy, Black"
                            value={item.shade || ""}
                            onChange={(e) => updateShade(item.id, e.target.value)}
                            className="w-full border border-border rounded-lg bg-background/50 text-xs px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Buyer Contact Form & Export Options */}
              {items.length > 0 && (
                <div className="p-5 border-t border-[var(--gold)]/20 bg-black/30 space-y-4">
                  <h4 className="label-caps text-xs text-primary tracking-widest uppercase">
                    Buyer & Dispatch Information
                  </h4>

                  <form onSubmit={handleEmailSend} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Company / Brand Name *"
                        value={buyerInfo.company}
                        onChange={handleInfoChange("company")}
                        className="w-full border-b border-border bg-transparent text-xs py-2 px-1 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Phone / WhatsApp *"
                        value={buyerInfo.phone}
                        onChange={handleInfoChange("phone")}
                        className="w-full border-b border-border bg-transparent text-xs py-2 px-1 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={buyerInfo.email}
                        onChange={handleInfoChange("email")}
                        className="w-full border-b border-border bg-transparent text-xs py-2 px-1 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Destination City / Hub"
                        value={buyerInfo.city}
                        onChange={handleInfoChange("city")}
                        className="w-full border-b border-border bg-transparent text-xs py-2 px-1 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Option 1: WhatsApp — text summary only */}
                        <button
                          type="button"
                          onClick={handleWhatsAppSend}
                          style={{ cursor: "pointer" }}
                          className="bg-[#25D366] text-black font-semibold label-caps py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 hover:brightness-105 active:scale-95 transition-all text-xs tracking-wider cursor-pointer"
                        >
                          <MessageCircle className="h-4 w-4 fill-current" />
                          Send WhatsApp Summary
                        </button>

                        {/* Option 2: Print / Save PDF */}
                        <button
                          type="button"
                          onClick={handlePrintPdf}
                          style={{ cursor: "pointer" }}
                          className="bg-[#0F2038] text-[var(--gold)] border border-[var(--gold)]/50 font-semibold label-caps py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 hover:bg-[var(--gold)]/10 active:scale-95 transition-all text-xs tracking-wider cursor-pointer"
                        >
                          <Download className="h-4 w-4 text-[var(--gold)]" />
                          Download / Save PDF
                        </button>
                      </div>

                      {/* Option 3: Send via Email */}
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="btn-enquire btn-enquire-navy w-full !py-2.5 !text-xs disabled:opacity-60"
                      >
                        <span>
                          {status === "submitting" ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" /> Sending Email...
                            </>
                          ) : (
                            <>
                              <Mail className="h-4 w-4" />
                              Send Quote via Email
                            </>
                          )}
                        </span>
                      </button>

                      <p className="text-[10px] text-muted-foreground/80 leading-relaxed text-center pt-1">
                        WhatsApp and Email send a text summary only — neither can carry a file
                        attachment automatically. Use "Print / Save as PDF" to save a copy, then
                        attach it yourself if you'd like to include one.
                      </p>
                    </div>

                    {emailSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-primary/10 border border-primary/30 text-foreground p-3 rounded-lg flex items-center gap-2 text-xs"
                      >
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                        <span>Quote summary sent — check your email app.</span>
                      </motion.div>
                    )}
                  </form>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {printDocument}

      <ProductPreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
    </>
  );
}
