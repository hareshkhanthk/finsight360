import type { Statement, Transaction } from "@/lib/models";
import { nanoid } from "nanoid";
import { kvSave } from "@/lib/kv-adapter";
import { detectCategoryForTransaction } from "../transactions/categorizer";

export async function persistStatementAndTransactions(
  userId: string,
  rawStatement: Omit<Statement, "id">,
  rawTxs: Omit<Transaction, "id">[]
) {
  const stmt = await kvSave<Statement>("statements", {
    ...rawStatement,
    userId
  } as any);
  for (const t of rawTxs) {
    const categoryId = await detectCategoryForTransaction(userId, t);
    await kvSave<Transaction>("transactions", {
      ...t,
      userId,
      statementId: stmt.id,
      categoryId
    } as any);
  }
  return stmt;
}
