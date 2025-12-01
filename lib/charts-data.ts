import type { Account, Transaction, Budget } from "./models";

export function computeNetWorthSeries(accounts: Account[], transactions: Transaction[]) {
  // Simplified: just use current balances per account type at current moment
  const totalAssets = accounts
    .filter((a) => a.type !== "credit-card" && a.type !== "loan")
    .reduce((sum, a) => sum + (a.currentBalance || 0), 0);
  const totalLiabilities = accounts
    .filter((a) => a.type === "credit-card" || a.type === "loan")
    .reduce((sum, a) => sum + (a.currentBalance || 0), 0);
  return {
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities
  };
}

export function computeSpendingVsIncomeSeries(transactions: Transaction[]) {
  // group by month
  const map = new Map<string, { income: number; expense: number }>();
  for (const t of transactions) {
    const month = t.date.slice(0, 7);
    const entry = map.get(month) || { income: 0, expense: 0 };
    if (t.direction === "in") entry.income += t.amount;
    else entry.expense += Math.abs(t.amount);
    map.set(month, entry);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([month, v]) => ({
      month,
      income: v.income,
      expense: v.expense
    }));
}
