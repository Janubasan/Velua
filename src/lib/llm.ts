// ============================================================
//  LLM CLIENT — geração de copy das presells via API externa.
//  Sem chave configurada, retorna null e o motor local assume.
// ============================================================

import type { PresellInput, Conteudo } from "./generator";
import { LANGS, NICHOS } from "./copy";

export function llmConfig() {
  const provider = (process.env.LLM_PROVIDER || "openai").toLowerCase();
  const apiKey = process.env.LLM_API_KEY || "";
  const model = process.env.LLM_MODEL || "";
  const baseUrl = process.env.LLM_BASE_URL || "";
  return {
    provider,
    apiKey,
    available: !!apiKey,
    model:
      model ||
      (provider === "anthropic"
        ? "claude-sonnet-4-20250514"
        : provider === "groq"
          ? "llama-3.3-70b-versatile"
          : "gpt-4o-mini"),
    baseUrl,
  };
}

function systemPrompt(): string {
  return `Você é um copywriter sênior especialista em páginas presell de afiliados que precisam ser aprovadas no Google Ads (Destination Requirements).
Escreva conteúdo ORIGINAL, útil e honesto. Nunca invente depoimentos de pessoas reais identificáveis — use personas fictícias com nome comum, idade e cidade.
Nunca faça alegações médicas de cura/tratamento. Para saúde, use linguagem de apoio/estrutura-função.
Responda SEMPRE em JSON válido, sem markdown, sem comentários, com exatamente estas chaves:
{
 "headline": "headline específica com o nome do produto (max 90 chars)",
 "opening": ["parágrafo 1", "parágrafo 2"],
 "whatIs": "parágrafo explicando o produto",
 "benefits": [["titulo","explicacao de 2 linhas"], ...4 a 6 itens],
 "components": [["nome","para que serve"], ...4 a 6 itens],
 "howTo": ["passo 1", ...3 a 5 passos],
 "testimonials": [{"name":"Nome F., 41","city":"Cidade, UF","text":"relato especifico"}, ...3 a 4],
 "comparison": {"cols":["Criterio","PRODUTO","Alternativa A","Alternativa B"],"rows":[["criterio","valor","valor","valor"], ...4 linhas]},
 "faq": [["pergunta","resposta"], ...5 a 7],
 "offerBody": "paragrafo sobre a oferta, pacotes e garantia",
 "verdict": {"pros":["...","...","..."], "cons":["...","..."]},
 "ctaPrimary": "texto do botao principal",
 "ctaSecondary": "texto do botao secundario"
}
Idioma de saída: o idioma solicitado. Tamanho total: no mínimo 700 palavras somando todos os textos.`;
}

function userPrompt(input: PresellInput, angulo: string): string {
  const lang = LANGS.find((l) => l.id === input.idioma)?.label || input.idioma;
  const nicho = NICHOS.find((n) => n.id === input.nicho)?.label || input.nicho;
  return `PRODUTO: ${input.produto}
NICHO: ${nicho}
IDIOMA: ${lang} (escreva tudo neste idioma)
PÚBLICO: ${input.publico || "compradores de fundo de funil buscando review antes de comprar"}
ÂNGULO DESTA VARIAÇÃO: ${angulo}
TIPO DE PÁGINA: ${input.tipo}
Gere UMA variação completa de presell no JSON especificado.`;
}

async function callOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  system: string,
  user: string
): Promise<string> {
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.8,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw new Error(`LLM HTTP ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function callAnthropic(apiKey: string, model: string, system: string, user: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic HTTP ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}

function normalize(raw: any): Conteudo | null {
  try {
    const j = typeof raw === "string" ? JSON.parse(raw.replace(/^```(?:json)?|```$/g, "").trim()) : raw;
    if (!j || !j.headline) return null;
    const asPairs = (v: any, n = 2): [string, string][] =>
      Array.isArray(v)
        ? v
            .filter((x) => Array.isArray(x) && x.length >= 2)
            .slice(0, 6)
            .map((x) => [String(x[0]), String(x[1])] as [string, string])
        : [];
    const asFaq = (v: any): [string, string][] =>
      Array.isArray(v)
        ? v
            .filter((x) => Array.isArray(x) && x.length >= 2)
            .slice(0, 7)
            .map((x) => [String(x[0]), String(x[1])] as [string, string])
        : [];
    return {
      headline: String(j.headline).slice(0, 120),
      angulo: String(j.angulo || "LLM"),
      opening: Array.isArray(j.opening) ? j.opening.map(String).slice(0, 3) : [],
      whatIs: String(j.whatIs || ""),
      benefits: asPairs(j.benefits),
      components: asPairs(j.components),
      howTo: Array.isArray(j.howTo) ? j.howTo.map(String).slice(0, 6) : [],
      testimonials: Array.isArray(j.testimonials)
        ? j.testimonials
            .filter((t: any) => t && t.name && t.text)
            .slice(0, 4)
            .map((t: any) => ({ name: String(t.name), city: String(t.city || ""), text: String(t.text) }))
        : [],
      comparison: {
        cols: Array.isArray(j.comparison?.cols) ? j.comparison.cols.map(String).slice(0, 4) : [],
        rows: Array.isArray(j.comparison?.rows)
          ? j.comparison.rows.filter((r: any) => Array.isArray(r)).map((r: any[]) => r.map(String)).slice(0, 5)
          : [],
      },
      faq: asFaq(j.faq),
      offerBody: String(j.offerBody || ""),
      verdict: {
        pros: Array.isArray(j.verdict?.pros) ? j.verdict.pros.map(String).slice(0, 4) : [],
        cons: Array.isArray(j.verdict?.cons) ? j.verdict.cons.map(String).slice(0, 4) : [],
      },
      ctaPrimary: String(j.ctaPrimary || "Ver oferta oficial"),
      ctaSecondary: String(j.ctaSecondary || "Ver detalhes"),
    };
  } catch {
    return null;
  }
}

const ANGULOS = ["Autoridade / Review", "História / Advertorial", "Dados / Comparação"];

export async function gerarComLLM(
  input: PresellInput
): Promise<{ conteudos: (Conteudo | null)[]; mode: "local" | "llm" }> {
  const cfg = llmConfig();
  if (!cfg.available) return { conteudos: input.variacoes ? Array(input.variacoes).fill(null) : [], mode: "local" };

  const system = systemPrompt();
  const out: (Conteudo | null)[] = [];
  for (let i = 0; i < input.variacoes; i++) {
    try {
      const user = userPrompt(input, ANGULOS[i % 3]);
      const raw =
        cfg.provider === "anthropic"
          ? await callAnthropic(cfg.apiKey, cfg.model, system, user)
          : await callOpenAICompatible(
              cfg.baseUrl || (cfg.provider === "groq" ? "https://api.groq.com/openai/v1" : "https://api.openai.com/v1"),
              cfg.apiKey,
              cfg.model,
              system,
              user
            );
      const c = normalize(raw);
      // válida só se tem o mínimo de seções
      out.push(c && c.benefits.length >= 3 && c.faq.length >= 4 ? c : null);
    } catch {
      out.push(null);
    }
  }
  return { conteudos: out, mode: out.some(Boolean) ? "llm" : "local" };
}
