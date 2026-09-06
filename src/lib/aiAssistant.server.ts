import { createServerFn } from "@tanstack/react-start";
import { supabase } from "./supabase";
import { SITE } from "./seo";

// Fast/cheap model — this is short text Q&A over an admin-supplied blurb,
// not a heavy task, so there's no reason to reach for a bigger model.
// Override via GEMINI_MODEL if you ever want to.
const DEFAULT_MODEL = "gemini-3.5-flash-lite";

type KnowledgeSetting = { text?: string };

/** Reads the admin-authored "AI Assistant Knowledge" textarea from Supabase. */
async function loadKnowledgeText(): Promise<string> {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "ai_knowledge_base")
    .maybeSingle();
  const value = (data?.value as KnowledgeSetting | null) ?? null;
  return value?.text?.trim() ?? "";
}

// Exact sentinel the model is told to return for input it shouldn't try to
// answer at all (gibberish, test messages, anything unrelated to fabrics
// or this business) — caught in the handler below and treated as "no
// answer", so the caller falls back to the local FALLBACK message instead
// of the model inventing a reply or pitching something irrelevant just to
// seem helpful.
const UNCLEAR_SENTINEL = "UNCLEAR_INPUT";

function buildPrompt(knowledge: string, question: string): string {
  return `You are the AI Fabric Assistant for Mapps Creation, a wholesale Lycra, knitted and polyester-lycra fabric trader based in Surat, Gujarat, India.

Follow these rules in order:

1. First, check whether the visitor's message is an actual question or statement about fabrics, orders, pricing, or this business. If it's gibberish, random characters, a test message (e.g. "jkl;", "test", "asdf"), or otherwise not a real message you can respond to, reply with EXACTLY this and nothing else: ${UNCLEAR_SENTINEL}

2. If it's a real message but about something unrelated to fabrics/this business entirely (weather, unrelated small talk, etc.), also reply with EXACTLY: ${UNCLEAR_SENTINEL}

3. Otherwise, answer using ONLY the business information below. Never invent prices, MOQs, policies or facts that aren't stated below, and never bring up something from the information below unless it's actually relevant to what was asked — don't use it as a sales pitch for an unrelated question. If the information below doesn't cover the specific question, say so plainly and suggest they connect with the sales team on WhatsApp or call ${SITE.phoneDisplay} — don't guess, and don't redirect to unrelated info you do have.

Keep every real answer short: 1-3 sentences, friendly, factual.

BUSINESS INFORMATION:
${knowledge}

VISITOR MESSAGE: ${question}`;
}

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
};

/**
 * Answers a chat question using Gemini, grounded in whatever the admin has
 * written into the "AI Assistant Knowledge" textarea. Returns null (never
 * throws to the caller) whenever it can't produce a real answer — no API
 * key configured yet, no knowledge text saved yet, or the request failed —
 * so the chat widget can silently fall back to its local keyword-matched
 * answers instead of ever showing a broken chat.
 */
export const askAiAssistant = createServerFn({ method: "POST" })
  .validator((data: { message: string }) => data)
  .handler(async ({ data }): Promise<string | null> => {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey || !data.message.trim()) return null;

    const knowledge = await loadKnowledgeText();
    if (!knowledge) return null;

    const model = process.env["GEMINI_MODEL"] || DEFAULT_MODEL;
    const prompt = buildPrompt(knowledge, data.message.trim());

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 300 },
          }),
        },
      );
      if (!res.ok) return null;

      const json = (await res.json()) as GeminiResponse;
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!text || text.includes(UNCLEAR_SENTINEL)) return null;
      return text;
    } catch {
      return null;
    }
  });
