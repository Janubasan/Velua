import { NextRequest, NextResponse } from "next/server";
import { userFromCookies } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = userFromCookies(req.cookies.get("adag_session")?.value);
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const todos = db.presells();
  const alvo = todos.find((p) => p.id === params.id);
  if (!alvo || alvo.userId !== user.id) {
    return NextResponse.json({ error: "Presell não encontrada." }, { status: 404 });
  }
  db.savePresells(todos.filter((p) => p.id !== params.id));
  return NextResponse.json({ ok: true });
}
