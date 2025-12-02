// lib/transactions/alerts.ts
import type { Transaction, Budget, Alert } from "@/lib/models";
import { kvList, kvSave } from "@/lib/kv-adapter";

export async function recomputeAlerts(userId: string) {
  const [txs, budgets] = await Promise.all([
    kvList<Transaction>("transactions", userId),
    kvList<Budget>("budgets", userId)
  ]);

  const alerts: Alert[] = [];

  // Compute monthly totals by category
  const byCatMonth = new Map<string, number>();
  for (const t of txs) {
    if (t.direction === "out" && t.categoryId) {
      const month = t.date?.slice(0, 7) ?? new Date().toISOString().slice(0, 7);
      const key = `${t.categoryId}-${month}`;
      byCatMonth.set(key, (byCatMonth.get(key) || 0) + Math.abs(t.amount));
    }
  }

  // For each budget, compare
  for (const b of budgets) {
    const key = `${b.categoryId}-${b.month}`;
    const spent = byCatMonth.get(key) || 0;
    if (spent > (b.amount || 0)) {
      alerts.push({
        id: undefined as any,
        type: "overspend",
        categoryId: b.categoryId,
        month: b.month,
        message: `Overspending in category ${b.categoryId} for ${b.month}: spent ${spent}, budget ${b.amount}`,
        createdAt: new Date().toISOString(),
        read: false,
        userId: userId
      } as Alert);
    }
  }

  // Persist alerts
  for (const a of alerts) {
    await kvSave<Alert>("alerts", {
      ...a,
      userId
    } as any);
  }
}
