import { NextRequest, NextResponse } from "next/server";
import { validatePassword } from "@/lib/auth";
import { createSession, destroySession } from "@/lib/session";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { password, action } = await req.json();
  if (action === "logout") {
    await destroySession();
    return NextResponse.json({ ok: true });
  }
  const user = await validatePassword(password);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
  }
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
