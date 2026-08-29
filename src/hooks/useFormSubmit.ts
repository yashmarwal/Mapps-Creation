import { useEffect, useRef, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/**
 * Thin wrapper around Web3Forms — no custom backend needed. Requires
 * VITE_WEB3FORMS_ACCESS_KEY (see SUPABASE_SETUP.md / README for signup).
 * Auto-resets to idle a few seconds after success or error.
 */
export function useFormSubmit() {
  const [status, setStatus] = useState<Status>("idle");
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  async function submit(data: Record<string, string>) {
    setStatus("submitting");
    const accessKey = import.meta.env["VITE_WEB3FORMS_ACCESS_KEY"] as string | undefined;

    try {
      if (!accessKey) throw new Error("Web3Forms access key not configured");

      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: accessKey, ...data }),
      });
      // Web3Forms can reply with a non-JSON body on some failures (e.g. a
      // plain-text gateway error) — never let a parse failure here throw
      // past this try/catch's own boundary.
      const json: unknown = await res.json().catch(() => null);
      const success = Boolean(
        json && typeof json === "object" && (json as { success?: unknown }).success,
      );
      if (!res.ok || !success) {
        const message =
          json && typeof json === "object" ? (json as { message?: unknown }).message : undefined;
        throw new Error(typeof message === "string" ? message : "Submission failed");
      }

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setStatus("idle"), 6000);
    }
  }

  return { status, submit };
}
