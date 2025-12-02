import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";

export type CollectionName =
  | "users"
  | "accounts"
  | "statements"
  | "transactions"
  | "categories"
  | "budgets"
  | "settings"
  | "alerts"
  | "timeline";

export async function kvList<T>(collection: CollectionName, userId: string) {
  const key = `${collection}:${userId}`;
  const data = (await kv.get<T[]>(key)) ?? [];
  return data;
}

export async function kvSave<T extends { id: string; userId: string }>(
  collection: CollectionName,
  item: Omit<T, "id"> & Partial<Pick<T, "id">>
) {
  const id = item.id ?? nanoid();
  const key = `${collection}:${item.userId}`;
  const existing = ((await kv.get<T[]>(key)) ?? []) as T[];
  const idx = existing.findIndex((x) => x.id === id);
  const newItem = { ...(item as any), id } as T;
  if (idx >= 0) {
    existing[idx] = newItem;
  } else {
    existing.push(newItem);
  }
  await kv.set(key, existing);
  return newItem;
}

export async function kvDelete(
  collection: CollectionName,
  userId: string,
  id: string
) {
  const key = `${collection}:${userId}`;
  const existing = ((await kv.get<any[]>(key)) ?? []) as any[];
  const filtered = existing.filter((x) => x.id !== id);
  await kv.set(key, filtered);
}

export async function kvExportUser(userId: string) {
  const collections: CollectionName[] = [
    "users",
    "accounts",
    "statements",
    "transactions",
    "categories",
    "budgets",
    "settings",
    "alerts",
    "timeline"
  ];
  const data: Record<string, any> = {};
  for (const c of collections) {
    data[c] = await kvList(c as any, userId);
  }
  return data;
}
