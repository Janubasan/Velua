import { NextRequest, NextResponse } from "next/server";
import { destroySession, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  destroySession(req.cookies.get(COOKIE_NAME)?.value);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
