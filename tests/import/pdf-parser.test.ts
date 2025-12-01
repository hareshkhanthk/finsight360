import { parseBankStatementFromText } from "@/lib/pdf/parse-bank-statement";
import { samplePdfText } from "@/lib/test-data";

test("parseBankStatementFromText extracts transactions", async () => {
  const { statement, transactions } = await parseBankStatementFromText(
    "user-1",
    "acc-1",
    samplePdfText
  );
  expect(statement.bankName).toBeDefined();
  expect(transactions.length).toBeGreaterThan(0);
});
