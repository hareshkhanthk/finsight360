import bcrypt from "bcryptjs";
import { kvList, kvSave } from "./kv-adapter";
import type { User } from "./models";
import { nanoid } from "nanoid";

const ADMIN_EMAIL = "user@finsight.local";

export async function getOrCreateUser() {
  const defaultUserId = "user-1";
  const users = await kvList<User>("users", defaultUserId);
  if (users.length > 0) return users[0];

  const password = process.env.FINSIGHT_PASSWORD || "change-me";
  const hash = await bcrypt.hash(password, 10);
  const user: User = {
    id: defaultUserId,
    email: ADMIN_EMAIL,
    passwordHash: hash,
    createdAt: new Date().toISOString()
  };
  await kvSave<User>("users", user);
  return user;
}

export async function validatePassword(password: string) {
  const user = await getOrCreateUser();
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}
