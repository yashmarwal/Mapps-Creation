import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — Mapps Creation" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { session } = useAdminSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/admin" });
  }, [session, navigate]);

  if (session) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    navigate({ to: "/admin" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <p className="label-caps text-primary text-center">Mapps Creation</p>
        <h1 className="font-display mt-3 text-center text-3xl">Admin Sign In</h1>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <label className="block">
            <span className="label-caps text-muted-foreground">Email</span>
            <input
              required
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border bg-card text-foreground focus:border-primary mt-2 w-full min-h-[52px] border px-4 outline-none transition-colors"
            />
          </label>
          <label className="block">
            <span className="label-caps text-muted-foreground">Password</span>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-border bg-card text-foreground focus:border-primary mt-2 w-full min-h-[52px] border px-4 outline-none transition-colors"
            />
          </label>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-primary-foreground label-caps flex w-full min-h-[52px] items-center justify-center disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
