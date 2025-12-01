import type { Transaction, Budget, Alert } from "@/lib/models";
import { kvList, kvSave } from "@/lib/kv-adapter";

export async function recomputeAlerts(userId: string) {
  const [txs, budgets] = await Promise.all([
    kvList<Transaction>("transactions", userId),
    kvList<Budget>("budgets", userId)
  ]);
  const alerts: Alert[] = [];

  // overspending (simple: if monthly sum > budget)
  const byCatMonth = new Map<string, number>();
  for (const t of txs) {
    if (t.direction === "out" && t.categoryId) {
      const key = `${t.categoryId}-${t.date.slice(0, 7)}`;
      byCatMonth.set(key, (byCatMonth.get(key) || 0) + Math.abs(t.amount));
    }
  }
  for (const b of budgets) {
    const key = `${b.categoryId}-${b.month}`;
    const spent = byCatMonth.get(key) || 0;
    if (spent > b.amount) {
      alerts.push({
        id: "",
        userId,
        type: "overspend",
        message: `Overspending in category ${b.categoryId} for ${b.month}`,
        createdAt: new Date().toISOString(),
        read: false
      });
    }
  }

  // Persist
  for (const a of alerts) {
    await kvSave<Alert>("alerts", { ...a, userId } as any);
  }
}
