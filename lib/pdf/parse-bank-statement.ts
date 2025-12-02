// lib/pdf/parse-bank-statement.ts
import type { Statement, Transaction } from "@/lib/models";
import { nanoid } from "nanoid";

interface ParseResult {
  statement: Omit<Statement, "id">;
  transactions: Omit<Transaction, "id">[];
}

/**
 * Minimal text-based bank statement parser:
 * - Looks for lines with a date and amount (very fuzzy).
 * - Intended for demo/testing; replace with robust logic per bank.
 */
export async function parseBankStatementFromText(
  userId: string,
  accountId: string | null,
  text: string
): Promise<ParseResult> {
  const lines = (text || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const bankName = lines[0]?.slice(0, 40) || "Unknown Bank";
  const txs: Omit<Transaction, "id">[] = [];

  // Very naive: if a line contains a date-like token and an amount, parse them.
  const dateRegex = /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/;
  const amountRegex = /(-?\d{1,3}(?:[,\d]{0,})\.\d{2})/;

  for (const l of lines.slice(1)) {
    const dMatch = l.match(dateRegex);
    const aMatch = l.match(amountRegex);
    if (dMatch && aMatch) {
      const rawDate = dMatch[1];
      let parsedDate: string;
      try {
        parsedDate = new Date(rawDate.replace(/-/g, "/")).toISOString();
      } catch {
        parsedDate = new Date().toISOString();
      }
      const rawAmount = aMatch[1].replace(/,/g, "");
      const amount = Math.abs(parseFloat(rawAmount) || 0);
      const direction = (aMatch[1].trim().startsWith("-") ? "out" : "in") as "in" | "out";
      txs.push({
        userId,
        accountId: accountId || "auto",
        date: parsedDate,
        description: l.replace(dateRegex, "").replace(amountRegex, "").trim().slice(0, 200),
        amount,
        direction,
        createdAt: new Date().toISOString()
      });
    }
  }

  // Make a best-effort statement object
  const month = new Date().toISOString().slice(0, 7);
  const openingBalance = 0;
  const closingBalance = txs.reduce((s, t) => s + (t.direction === "in" ? t.amount : -t.amount), 0);

  return {
    statement: {
      userId,
      accountId: accountId || "auto",
      type: "bank",
      bankName,
      statementMonth: month,
      openingBalance,
      closingBalance,
      rawMeta: {},
      createdAt: new Date().toISOString()
    },
    transactions: txs
  };
}
