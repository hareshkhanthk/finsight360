import { AppShell } from "@/components/layout/shell";
import { kvList } from "@/lib/kv-adapter";
import type { Account } from "@/lib/models";
import { getSession } from "@/lib/session";
import Link from "next/link";

export const runtime = "edge";

export default async function AccountsPage() {
  const session = await getSession();
  if (!session) return null;
  const accounts = await kvList<Account>("accounts", session.userId);

  return (
    <AppShell>
      <div className="flex justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">Accounts</h1>
          <p className="text-xs text-muted-foreground">
            Bank accounts, FDs and wallets.
          </p>
        </div>
      </div>
      {accounts.length === 0 ? (
        <div className="rounded-2xl bg-white/5 border border-dashed border-white/20 p-6 text-center text-xs text-muted-foreground">
          No accounts yet. Import a statement to create accounts automatically.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {accounts.map((a) => (
            <Link
              href={`/accounts/${a.id}`}
              key={a.id}
              className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm hover:bg-white/10 transition"
            >
              <p className="font-medium">{a.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {a.institution} · {a.accountNumberMasked}
              </p>
              <p className="mt-2 text-[11px] text-muted-foreground">Current balance</p>
              <p className="text-lg font-semibold">
                ₹{a.currentBalance.toLocaleString("en-IN")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
