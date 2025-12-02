// lib/transactions/categorizer.ts
import type { Transaction, Category } from "@/lib/models";
import { kvList, kvSave } from "@/lib/kv-adapter";
import { nanoid } from "nanoid";

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

async function ensureDefaultCategories(userId: string) {
  const existing = await kvList<Category>("categories", userId);
  if (existing.length === 0) {
    for (const c of DEFAULT_CATEGORIES) {
      await kvSave<Category>("categories", {
        userId,
        id: undefined,
        slug: c.slug!,
        name: c.name!,
        type: c.type as any,
        color: c.color || "#888888"
      } as any);
    }
  }
}

export async function detectCategoryForTransaction(userId: string, t: Partial<Transaction>): Promise<string | undefined> {
  // Make sure categories exist
  await ensureDefaultCategories(userId);
  const categories = await kvList<Category>("categories", userId);
  const desc = (t.description || "").toString().toLowerCase();

  // Simple heuristics
  if (!desc) return undefined;
  if (desc.includes("salary") || desc.includes("payroll") || desc.includes("credit salary")) {
    return categories.find((c) => c.slug === "salary")?.id;
  }
  if (desc.includes("zomato") || desc.includes("swiggy") || desc.includes("restaurant")) {
    return categories.find((c) => c.slug === "food-dining")?.id;
  }
  if (desc.includes("grocery") || desc.includes("bigbasket") || desc.includes("dmart")) {
    return categories.find((c) => c.slug === "groceries")?.id;
  }
  if (desc.includes("uber") || desc.includes("ola") || desc.includes("taxi") || desc.includes("cab")) {
    return categories.find((c) => c.slug === "fuel")?.id;
  }
  if (desc.includes("amazon") || desc.includes("flipkart")) {
    return categories.find((c) => c.slug === "shopping")?.id;
  }
  if (desc.includes("rent")) {
    return categories.find((c) => c.slug === "rent")?.id;
  }
  if (desc.includes("emi") || desc.includes("loan")) {
    return categories.find((c) => c.slug === "emi")?.id;
  }
  // fallback
  return undefined;
}
