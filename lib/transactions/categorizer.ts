import type { Transaction, Category } from "@/lib/models";
import { kvList } from "@/lib/kv-adapter";
import { getMatchingRuleId } from "./rules";

const DEFAULT_CATEGORIES: Partial<Category>[] = [
  { slug: "salary", name: "Salary", type: "income", color: "#22c55e" },
  { slug: "food-dining", name: "Food & Dining", type: "expense", color: "#f97316" },
  { slug: "groceries", name: "Groceries", type: "expense", color: "#22c55e" },
  { slug: "shopping", name: "Shopping", type: "expense", color: "#ec4899" },
  { slug: "utilities", name: "Utilities", type: "expense", color: "#4f46e5" },
  { slug: "rent", name: "Rent", type: "expense", color: "#a855f7" },
  { slug: "fuel", name: "Fuel", type: "expense", color: "#facc15" },
  { slug: "emi", name: "EMI", type: "expense", color: "#0ea5e9" },
  { slug: "investments", name: "Investments", type: "expense", color: "#22c55e" },
  { slug: "transfers", name: "Transfers", type: "transfer", color: "#64748b" }
];

export async function detectCategoryForTransaction(
  userId: string,
  t: Omit<Transaction, "id">
) {
  // rule-based
  const ruleCategoryId = await getMatchingRuleId(userId, t);
  if (ruleCategoryId) return ruleCategoryId;

  const cats = await kvList<Category>("categories", userId);
  const categories = cats.length ? cats : DEFAULT_CATEGORIES.map((c, i) => ({
    ...c,
    id: String(i),
    userId
  })) as Category[];

  const desc = t.description.toLowerCase();
  if (desc.includes("zomato") || desc.includes("swiggy")) {
    return categories.find((c) => c.slug === "food-dining")?.id;
  }
  if (desc.includes("uber") || desc.includes("ola")) {
    return categories.find((c) => c.slug === "fuel")?.id;
  }
  if (desc.includes("salary") || desc.includes("credit salary")) {
    return categories.find((c) => c.slug === "salary")?.id;
  }
  if (desc.includes("amazon") || desc.includes("flipkart")) {
    return categories.find((c) => c.slug === "shopping")?.id;
  }
  return undefined;
}
