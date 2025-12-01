import { AppShell } from "@/components/layout/shell";
import { kvList } from "@/lib/kv-adapter";
import type { Account, Transaction, Alert, TimelineEvent } from "@/lib/models";
import { computeNetWorthSeries, computeSpendingVsIncomeSeries } from "@/lib/charts-data";
import { NetWorthChart } from "@/components/charts/net-worth-chart";
import { SpendingVsIncomeChart } from "@/components/charts/spending-vs-income-chart";
import { CategoryDonut } from "@/components/charts/category-donut";
import { StatCard } from "@/components/dashboard/home-cards";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { Timeline } from "@/components/dashboard/timeline";
import { getSession } from "@/lib/session";

export const runtime = "edge";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    // middleware will redirect, this is fallback
    return null;
  }
  const userId = session.userId;

  const [accounts, txs, alerts, events] = await Promise.all([
    kvList<Account>("accounts", userId),
    kvList<Transaction>("transactions", userId),
    kvList<Alert>("alerts", userId),
    kvList<TimelineEvent>("timeline", userId)
  ]);

  const net = computeNetWorthSeries(accounts, txs);
  const svs = computeSpendingVsIncomeSeries(txs);
  const categoryMap = new Map<string, number>();
  for (const t of txs) {
    if (t.direction === "out") {
      const key = t.categoryId || "Uncategorized";
      categoryMap.set(key, (categoryMap.get(key) || 0) + Math.abs(t.amount));
    }
  }
  const donut = Array.from(categoryMap.entries()).map(([name, value]) => ({
    name,
    value
  }));

  const upcomingCcDue = accounts
    .filter((a) => a.type === "credit-card")
    .reduce((sum, a) => sum + (a.dueAmount || 0), 0);

  const totalBankBalances = accounts
    .filter((a) => a.type === "savings" || a.type === "current")
    .reduce((sum, a) => sum + (a.currentBalance || 0), 0);

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold">Welcome back</h1>
          <p className="text-xs text-muted-foreground">
            Your 360° financial snapshot at a glance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatCard label="Net worth" value={`₹${net.netWorth.toLocaleString("en-IN")}`} />
          <StatCard
            label="Total bank balances"
            value={`₹${totalBankBalances.toLocaleString("en-IN")}`}
          />
          <StatCard
            label="Upcoming card dues"
            value={`₹${upcomingCcDue.toLocaleString("en-IN")}`}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-medium">Spending vs income</h2>
              <span className="text-[11px] text-muted-foreground">Month over month</span>
            </div>
            <SpendingVsIncomeChart data={svs} />
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-medium">Category split</h2>
              <span className="text-[11px] text-muted-foreground">Last months</span>
            </div>
            {donut.length ? (
              <CategoryDonut data={donut} />
            ) : (
              <div className="h-52 flex items-center justify-center text-xs text-muted-foreground">
                No transactions yet. Import your first statement.
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <h2 className="text-sm font-medium mb-3">Alerts</h2>
            <AlertsPanel alerts={alerts} />
          </div>
          <div className="xl:col-span-2 rounded-2xl bg-white/5 border border-white/10 p-4">
            <h2 className="text-sm font-medium mb-3">Financial timeline</h2>
            <Timeline events={events} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
