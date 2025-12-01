import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { kv } from "@vercel/kv";

const SESSION_COOKIE = "fs360_session";

export interface SessionData {
  userId: string;
  createdAt: string;
}

export async function createSession(userId: string) {
  const id = nanoid();
  const session: SessionData = {
    userId,
    createdAt: new Date().toISOString()
  };
  await kv.set(`session:${id}`, session, { ex: 60 * 60 * 24 * 7 });
  const c = cookies();
  c.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function getSession() {
  const c = cookies();
  const id = c.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  const session = (await kv.get<SessionData>(`session:${id}`)) ?? null;
  return session;
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function destroySession() {
  const c = cookies();
  const id = c.get(SESSION_COOKIE)?.value;
  if (id) {
    await kv.del(`session:${id}`);
  }
  c.delete(SESSION_COOKIE);
}
