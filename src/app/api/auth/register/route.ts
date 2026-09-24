import { NextRequest, NextResponse } from "next/server";
import { createUser, createSession, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { user, error } = createUser(String(body.email || ""), String(body.password || ""), String(body.name || ""));
  if (!user) return NextResponse.json({ error }, { status: 400 });

  const token = createSession(user.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
