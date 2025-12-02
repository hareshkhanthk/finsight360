// app/import/actions.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { parseCsvTransactions } from "@/lib/importers/csv-importer";
import { parseXlsxTransactions } from "@/lib/importers/xlsx-importer";
import { persistStatementAndTransactions } from "@/lib/importers/statement-normalizer";
import type { Account } from "@/lib/models";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Expect a multipart/form-data with "file" and optional "accountId"
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const accountId = (form.get("accountId") as string) || null;
  const filename = (file as any).name || "upload";
  const ext = filename.split(".").pop()?.toLowerCase() || "";

  let txCount = 0;

  if (ext === "csv") {
    const text = await file.text();
    const txs = parseCsvTransactions(session.userId, accountId || "unknown", text);
    // Persist statement + txs
    await persistStatementAndTransactions(session.userId, {
      accountId: accountId || "unknown",
      type: "import",
      bankName: "csv-import",
      statementMonth: new Date().toISOString().slice(0, 7),
      openingBalance: 0,
      closingBalance: 0,
      rawMeta: {},
      createdAt: new Date().toISOString()
    }, txs);
    txCount = txs.length;
  } else if (ext === "xlsx" || ext === "xls") {
    const buffer = await file.arrayBuffer();
    const txs = await parseXlsxTransactions(session.userId, accountId || "unknown", buffer);
    await persistStatementAndTransactions(session.userId, {
      accountId: accountId || "unknown",
      type: "import",
      bankName: "xlsx-import",
      statementMonth: new Date().toISOString().slice(0, 7),
      openingBalance: 0,
      closingBalance: 0,
      rawMeta: {},
      createdAt: new Date().toISOString()
    }, txs);
    txCount = txs.length;
  } else if (ext === "pdf") {
    // PDF text extraction is not implemented in this minimal example.
    // If you want PDF parsing on Vercel, either:
    //  - Use a Node runtime route + pdfjs-dist/pdf-parse, or
    //  - Extract text on the client and POST text
    return NextResponse.json({ error: "PDF parsing not implemented in this demo. Upload CSV/XLSX or POST plain text." }, { status: 400 });
  } else {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, transactions: txCount });
}
