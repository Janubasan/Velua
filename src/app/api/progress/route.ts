import { NextRequest, NextResponse } from "next/server";
import { userFromCookies } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const user = userFromCookies(req.cookies.get("adag_session")?.value);
  if (!user) return NextResponse.json({ progress: {} });
  return NextResponse.json({ progress: db.progress()[user.id] || {} });
}

export async function POST(req: NextRequest) {
  const user = userFromCookies(req.cookies.get("adag_session")?.value);
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const aula = String(body.aula || "");
  const concluir = body.concluir !== false;
  if (!aula) return NextResponse.json({ error: "Aula não informada." }, { status: 400 });

  const progress = db.progress();
  const atual = progress[user.id] || {};
  if (concluir) atual[aula] = new Date().toISOString();
  else delete atual[aula];
  progress[user.id] = atual;
  db.saveProgress(progress);
  return NextResponse.json({ ok: true, progress: atual });
}
