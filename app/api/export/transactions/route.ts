import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { kvList } from "@/lib/kv-adapter";
import type { Transaction } from "@/lib/models";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const txs = await kvList<Transaction>("transactions", session.userId);
  const header = "Date,Description,Amount,Direction,AccountId\n";
  const rows = txs
    .map(
      (t) =>
        `${t.date.slice(0, 10)},"${t.description.replace(/"/g, '""')}",${t.amount},${
          t.direction
        },${t.accountId}`
    )
    .join("\n");
  const csv = header + rows;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="transactions.csv"'
    }
  });
}
