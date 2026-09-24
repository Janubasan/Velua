import { NextRequest, NextResponse } from "next/server";
import { gerarPresell, type PresellInput } from "@/lib/generator";
import { gerarComLLM } from "@/lib/llm";
import { scoreCompliance } from "@/lib/compliance";
import { LANGS, NICHOS } from "@/lib/copy";

export const maxDuration = 120;

const TIPOS = ["review", "robusta", "advertorial", "popup-idade", "popup-captcha"] as const;

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const produto = String(body.produto || "").trim();
  if (produto.length < 2 || produto.length > 80) {
    return NextResponse.json({ error: "Informe o nome do produto (2 a 80 caracteres)." }, { status: 400 });
  }

  const nicho = (NICHOS.find((n) => n.id === body.nicho)?.id ?? "geral") as PresellInput["nicho"];
  const idioma = (LANGS.find((l) => l.id === body.idioma)?.id ?? "pt") as PresellInput["idioma"];
  const tipo = (TIPOS.includes(body.tipo) ? body.tipo : "review") as PresellInput["tipo"];
  const variacoes = Math.min(3, Math.max(1, Number(body.variacoes) || 1));

  const input: PresellInput = {
    produto,
    nicho,
    idioma,
    tipo,
    variacoes,
    link: String(body.link || "").trim(),
    publico: String(body.publico || "").trim().slice(0, 200),
    trackingCode: String(body.trackingCode || "").slice(0, 4000),
    ageGate: !!body.ageGate,
    cookieBanner: !!body.cookieBanner,
  };

  const { conteudos, mode } = await gerarComLLM(input);
  const { variantes } = gerarPresell(input, conteudos);

  return NextResponse.json({
    mode,
    input: { produto, nicho, idioma, tipo, variacoes },
    variantes: variantes.map((v) => ({
      headline: v.headline,
      angulo: v.angulo,
      palavras: v.palavras,
      score: v.score,
      html: v.html,
      regras: scoreCompliance(v.html, tipo).regras,
    })),
  });
}
