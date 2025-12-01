import { parseCsvTransactions } from "@/lib/importers/csv-importer";

test("parseCsvTransactions parses simple CSV", () => {
  const csv = `Date,Description,Amount
2025-01-01,Test,100
2025-01-02,Test2,-50`;
  const txs = parseCsvTransactions("user-1", "acc-1", csv);
  expect(txs).toHaveLength(2);
  expect(txs[0].direction).toBe("in");
  expect(txs[1].direction).toBe("out");
});
