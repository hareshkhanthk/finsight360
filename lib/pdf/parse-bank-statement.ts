import type { Statement, Transaction } from "@/lib/models";
import { nanoid } from "nanoid";

interface ParseResult {
  statement: Omit<Statement, "id">;
  transactions: Omit<Transaction, "id">[];
}

export async function parseBankStatementFromText(
  userId: string,
  accountId: string | null,
  text: string
): Promise<ParseResult> {
  // Very simplified demo parser; replace with bank-specific rules
  const lines = text.split(/\r?\n/).filter(Boolean);
  const bankName = lines[0]?.slice(0, 40) || "Unknown Bank";
  const month = "2025-01";
  const openingBalance = 0;
  const closingBalance = 0;

  const txs: Omit<Transaction, "id">[] = [];
  for (const line of lines) {
    const match = line.match(/^(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+(-?\d+\.?\d*)$/);
    if (!match) continue;
    const [, dateStr, desc, amtStr] = match;
    const amount = parseFloat(amtStr);
    txs.push({
      userId,
      accountId: accountId || "auto",
      statementId: "", // set later
      date: new Date(dateStr).toISOString(),
      description: desc.trim(),
      amount: Math.abs(amount),
      direction: amount >= 0 ? "in" : "out",
      createdAt: new Date().toISOString()
    });
  }

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
