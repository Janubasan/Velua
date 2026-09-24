import { NextRequest, NextResponse } from "next/server";
import { userFromCookies } from "@/lib/auth";
import { db, uid } from "@/lib/db";
import { scoreCompliance } from "@/lib/compliance";
import type { Presell } from "@/lib/db";

export async function GET(req: NextRequest) {
  const user = userFromCookies(req.cookies.get("adag_session")?.value);
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const minhas = db.presells().filter((p) => p.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ presells: minhas });
}

export async function POST(req: NextRequest) {
  const user = userFromCookies(req.cookies.get("adag_session")?.value);
  if (!user) return NextResponse.json({ error: "Faça login para salvar." }, { status: 401 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const variantes = Array.isArray(body.variantes) ? body.variantes : [];
  if (!variantes.length) return NextResponse.json({ error: "Nenhuma variação recebida." }, { status: 400 });

  const presell: Presell = {
    id: uid("psl"),
    userId: user.id,
    produto: String(body.produto || "").slice(0, 80),
    nicho: String(body.nicho || ""),
    idioma: String(body.idioma || ""),
    tipo: String(body.tipo || ""),
    link: String(body.link || ""),
    mode: body.mode === "llm" ? "llm" : "local",
    variantes: variantes.slice(0, 3).map((v: any) => ({
      headline: String(v.headline || ""),
      angulo: String(v.angulo || ""),
      palavras: Number(v.palavras) || 0,
      score: Number(v.score) || scoreCompliance(String(v.html || "")).score,
      html: String(v.html || ""),
    })),
    createdAt: new Date().toISOString(),
  };

  const todos = db.presells();
  todos.push(presell);
  db.savePresells(todos);
  return NextResponse.json({ ok: true, id: presell.id });
}
