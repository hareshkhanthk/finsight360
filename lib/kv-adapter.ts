// lib/kv-adapter.ts
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

/**
 * Simple KV schema used by this demo:
 * Key: `${collection}:${userId}` => JSON array of items
 */

async function readList<T>(key: string): Promise<T[]> {
  const val = (await kv.get<T[] | null>(key)) ?? null;
  if (!val) return [];
  return Array.isArray(val) ? val : [];
}

async function writeList<T>(key: string, data: T[]) {
  await kv.set(key, data);
}

export async function kvList<T>(collection: CollectionName, userId: string): Promise<T[]> {
  const key = `${collection}:${userId}`;
  return readList<T>(key);
}

export async function kvGet<T>(collection: CollectionName, userId: string, id: string): Promise<T | undefined> {
  const items = await kvList<T>(collection, userId);
  return items.find((it: any) => (it as any).id === id) as T | undefined;
}

export async function kvSave<T extends { id?: string }>(collection: CollectionName, item: T & { userId: string }): Promise<T & { id: string }> {
  const key = `${collection}:${item.userId}`;
  const existing = await readList<T & { id: string }>(key);
  const id = (item as any).id || nanoid();
  const newItem = { ...(item as any), id } as T & { id: string };

  const idx = existing.findIndex((x) => x.id === id);
  if (idx >= 0) {
    existing[idx] = newItem;
  } else {
    existing.push(newItem);
  }
  await writeList(key, existing);
  return newItem;
}

export async function kvDelete(collection: CollectionName, userId: string, id: string) {
  const key = `${collection}:${userId}`;
  const existing = await readList<any>(key);
  const out = existing.filter((x) => x.id !== id);
  await writeList(key, out);
  return true;
}

/** Helper to export all collections for a user (used by an export route) */
export async function kvExportAll(userId: string) {
  const collections: CollectionName[] = [
    "users",
    "accounts",
    "statements",
    "transactions",
    "categories",
    "budgets",
    "settings",
    "alerts",
    "timeline",
  ];
  const data: Record<string, any> = {};
  for (const c of collections) {
    data[c] = await kvList(c, userId);
  }
  return data;
}
