import * as XLSX from "xlsx";
import type { Transaction } from "@/lib/models";

export function parseXlsxTransactions(
  userId: string,
  accountId: string,
  buffer: ArrayBuffer
): Omit<Transaction, "id">[] {
  const wb = XLSX.read(buffer, { type: "array" });
  const wsName = wb.SheetNames[0];
  const ws = wb.Sheets[wsName];
  const json = XLSX.utils.sheet_to_json<any>(ws, { defval: "" });
  if (!json.length) return [];
  return json.map((row) => {
    const amount = parseFloat(row.Amount ?? row.amount);
    return {
      userId,
      accountId,
      date: new Date(row.Date || row.date).toISOString(),
      description: String(row.Description || row.description),
      amount: Math.abs(amount),
      direction: amount >= 0 ? "in" : "out",
      createdAt: new Date().toISOString()
    };
  });
}
