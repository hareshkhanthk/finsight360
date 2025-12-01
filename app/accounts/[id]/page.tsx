import { AppShell } from "@/components/layout/shell";
import { kvList } from "@/lib/kv-adapter";
import type { Account, Transaction } from "@/lib/models";
import { getSession } from "@/lib/session";
import { SpendingVsIncomeChart } from "@/components/charts/spending-vs-income-chart";

export const runtime = "edge";

export default async function AccountDetailPage({
  params
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) return null;
  const [accounts, txs] = await Promise.all([
    kvList<Account>("accounts", session.userId),
    kvList<Transaction>("transactions", session.userId)
  ]);
  const account = accounts.find((a) => a.id === params.id);
  if (!account) {
    return (
      <AppShell>
        <p className="text-sm">Account not found.</p>
      </AppShell>
    );
  }

  const accountTxs = txs.filter((t) => t.accountId === account.id);
  const monthly = new Map<string, { income: number; expense: number }>();
  let biggestExpense = 0;
  let biggestLabel = "";
  for (const t of accountTxs) {
    const m = t.date.slice(0, 7);
    const e = monthly.get(m) || { income: 0, expense: 0 };
    if (t.direction === "in") e.income += t.amount;
    else {
      e.expense += Math.abs(t.amount);
      if (Math.abs(t.amount) > biggestExpense) {
        biggestExpense = Math.abs(t.amount);
        biggestLabel = t.description;
      }
    }
    monthly.set(m, e);
  }
  const data = Array.from(monthly.entries()).map(([month, v]) => ({
    month,
    income: v.income,
    expense: v.expense
  }));

  return (
    <AppShell>
      <div className="mb-4">
        <h1 className="text-xl font-semibold">{account.name}</h1>
        <p className="text-xs text-muted-foreground">
          {account.institution} · {account.accountNumberMasked}
        </p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm">
          <p className="text-[11px] text-muted-foreground mb-1">Current balance</p>
          <p className="text-lg font-semibold">
            ₹{account.currentBalance.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm">
          <p className="text-[11px] text-muted-foreground mb-1">Incoming vs outgoing</p>
          <p className="text-xs text-muted-foreground">
            {accountTxs.length} transactions tracked.
          </p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm">
          <p className="text-[11px] text-muted-foreground mb-1">Biggest expense</p>
          {biggestExpense ? (
            <>
              <p className="text-lg font-semibold">
                ₹{biggestExpense.toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-muted-foreground">{biggestLabel}</p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">No expenses yet.</p>
          )}
        </div>
      </div>
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
        <h2 className="text-sm font-medium mb-3">Trend</h2>
        <SpendingVsIncomeChart data={data} />
      </div>
    </AppShell>
  );
}
