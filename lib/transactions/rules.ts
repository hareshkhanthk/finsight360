import type { CategoryRule, Transaction } from "@/lib/models";
import { kvList } from "@/lib/kv-adapter";

export async function getMatchingRuleId(userId: string, t: Omit<Transaction, "id">) {
  const rules = await kvList<CategoryRule>("settings" as any, userId);
  const description = t.description;
  for (const r of rules) {
    const pattern = r.caseSensitive ? r.matchText : r.matchText.toLowerCase();
    const hay = r.caseSensitive ? description : description.toLowerCase();
    const match =
      r.matchType === "contains"
        ? hay.includes(pattern)
        : hay.startsWith(pattern);
    if (match) return r.categoryId;
  }
  return null;
}
