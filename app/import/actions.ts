import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { loadPdf } from "@/lib/pdf/pdf-utils";
import { parseBankStatementFromText } from "@/lib/pdf/parse-bank-statement";
import { parseCsvTransactions } from "@/lib/importers/csv-importer";
import { parseXlsxTransactions } from "@/lib/importers/xlsx-importer";
import { persistStatementAndTransactions } from "@/lib/importers/statement-normalizer";
import { kvSave } from "@/lib/kv-adapter";
import type { Account, StatementType } from "@/lib/models";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const password = form.get("password") as string | null;
  const type = form.get("type") as StatementType;
  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }
  const ext = file.name.split(".").pop()?.toLowerCase();
  const bytes = await file.arrayBuffer();

  // basic account creation
  const account: Account = await kvSave<Account>("accounts", {
    id: "",
    userId: session.userId,
    name: `${type} account`,
    type: type === "credit-card" ? "credit-card" : type === "loan" ? "loan" : "savings",
    institution: "Detected Bank",
    accountNumberMasked: "XXXX-XXXX-XXXX",
    currentBalance: 0,
    isActive: true,
    createdAt: new Date().toISOString()
  } as any);

  let txCount = 0;
  if (ext === "pdf") {
    const doc = await loadPdf(bytes, password || undefined);
    const textPages = await Promise.all(
      doc.getPages().map(async (p) => p.getTextContent?.()) // pdf-lib doesn't expose this; in real code use pdfjs
    );
    const combinedText = ""; // placeholder; use pdfjs-dist to extract text
    const { statement, transactions } = await parseBankStatementFromText(
      session.userId,
      account.id,
      combinedText
    );
    const stmt = await persistStatementAndTransactions(
      session.userId,
      { ...statement, accountId: account.id },
      transactions
    );
    txCount = transactions.length;
  } else if (ext === "csv") {
    const csv = new TextDecoder().decode(new Uint8Array(bytes));
    const txs = parseCsvTransactions(session.userId, account.id, csv);
    await persistStatementAndTransactions(
      session.userId,
      {
        userId: session.userId,
        accountId: account.id,
        type,
        bankName: "CSV Import",
        statementMonth: new Date().toISOString().slice(0, 7),
        openingBalance: 0,
        closingBalance: 0,
        rawMeta: {},
        createdAt: new Date().toISOString()
      },
      txs
    );
    txCount = txs.length;
  } else if (ext === "xlsx") {
    const txs = parseXlsxTransactions(session.userId, account.id, bytes);
    await persistStatementAndTransactions(
      session.userId,
      {
        userId: session.userId,
        accountId: account.id,
        type,
        bankName: "Excel Import",
        statementMonth: new Date().toISOString().slice(0, 7),
        openingBalance: 0,
        closingBalance: 0,
        rawMeta: {},
        createdAt: new Date().toISOString()
      },
      txs
    );
    txCount = txs.length;
  } else {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  // files are never persisted; bytes are discarded after parsing

  return NextResponse.json({ ok: true, transactions: txCount });
}
