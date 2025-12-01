import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { kvExportUser } from "@/lib/kv-adapter";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await kvExportUser(session.userId);
  return NextResponse.json(data);
}
