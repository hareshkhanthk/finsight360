"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";

export default function ImportClient() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [type, setType] = useState<"bank" | "credit-card" | "loan" | "wallet">("bank");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setStatus(null);
    const form = new FormData();
    form.append("file", file);
    form.append("type", type);
    if (password) form.append("password", password);
    try {
      const res = await fetch("/import/actions", {
        method: "POST",
        body: form
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus(json.error || "Import failed");
      } else {
        setStatus(`Imported ${json.transactions} transactions`);
      }
    } catch (err) {
      setStatus("Import failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3 max-w-xl"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col gap-1 text-xs">
        <label className="font-medium">Statement type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="rounded-xl bg-black/40 border border-white/10 px-3 py-2"
        >
          <option value="bank">Bank statement</option>
          <option value="credit-card">Credit card</option>
          <option value="loan">Loan</option>
          <option value="wallet">Wallet</option>
        </select>
      </div>
      <div className="flex flex-col gap-1 text-xs">
        <label className="font-medium">File (PDF, XLSX, CSV)</label>
        <input
          type="file"
          accept=".pdf,.xlsx,.csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-xs"
        />
      </div>
      <div className="flex flex-col gap-1 text-xs">
        <label className="font-medium">PDF password (if any)</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl bg-black/40 border border-white/10 px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !file}
        className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-medium hover:bg-primary/90 flex items-center gap-2"
      >
        {loading && (
          <span className="h-3 w-3 rounded-full border-2 border-t-transparent animate-spin" />
        )}
        <span>Import now</span>
      </button>
      {status && (
        <p className="text-[11px] text-muted-foreground bg-black/40 rounded-md px-2 py-1">
          {status}
        </p>
      )}
    </motion.form>
  );
}
