"use client";

import { useState, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const search = useSearchParams();
  const router = useRouter();
  const redirectTo = search.get("redirect") || "/dashboard";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({ password, action: "login" })
      });
      if (!res.ok) {
        setError("Invalid password");
      } else {
        router.push(redirectTo);
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <motion.div
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">F</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold">FinSight 360</h1>
            <p className="text-xs text-muted-foreground">
              Personal finance, reimagined.
            </p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm font-medium">
            Master password
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-500/40 rounded-md px-2 py-1">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90 transition flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="h-3 w-3 rounded-full border-2 border-t-transparent animate-spin" />
            )}
            <span>Enter FinSight 360</span>
          </button>
        </form>
        <p className="mt-4 text-[10px] text-muted-foreground text-center">
          Your data is encrypted locally using your environment secret. Keep it safe.
        </p>
      </motion.div>
    </div>
  );
}
