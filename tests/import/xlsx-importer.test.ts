import * as XLSX from "xlsx";
import { parseXlsxTransactions } from "@/lib/importers/xlsx-importer";

test("parseXlsxTransactions parses basic sheet", () => {
  const data = [
    { Date: "2025-01-01", Description: "Test", Amount: 100 },
    { Date: "2025-01-02", Description: "Test2", Amount: -50 }
  ];
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  const txs = parseXlsxTransactions("user-1", "acc-1", buf);
  expect(txs).toHaveLength(2);
});
