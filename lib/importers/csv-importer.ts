import type { Transaction } from "@/lib/models";

export function parseCsvTransactions(
  userId: string,
  accountId: string,
  csv: string
): Omit<Transaction, "id">[] {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim().length);
  const [header, ...rows] = lines;
  const cols = header.split(",");
  const idxDate = cols.indexOf("Date");
  const idxDesc = cols.indexOf("Description");
  const idxAmount = cols.indexOf("Amount");
  if (idxDate === -1 || idxDesc === -1 || idxAmount === -1) {
    throw new Error("CSV must contain Date, Description, Amount columns");
  }
  return rows.map((r) => {
    const cells = r.split(",");
    const amount = parseFloat(cells[idxAmount]);
    return {
      userId,
      accountId,
      date: new Date(cells[idxDate]).toISOString(),
      description: cells[idxDesc],
      amount: Math.abs(amount),
      direction: amount >= 0 ? "in" : "out",
      createdAt: new Date().toISOString()
    };
  });
}
