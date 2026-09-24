import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { userFromCookies } from "@/lib/auth";
import FlowClient from "@/components/FlowClient";

export const metadata: Metadata = {
  title: "Flow Engine — presell validada com IA",
  description:
    "Gere páginas presell de review, robusta, advertorial, pop-up de idade e captcha com IA. HTML pronto para copiar e colar no seu domínio, com score de compliance do Google Ads.",
};

const comparativo = [
  ["Páginas de review com IA", "✓", "✓ 3 variações por geração"],
  ["Página robusta (estrutura de vendas)", "✓", "✓ mais seções + vídeo"],
  ["Pop-up de idade", "✓", "✓ 4 idiomas + tracking"],
  ["Pop-up de captcha", "✓", "✓ 4 idiomas + tracking"],
  ["Campo de código de tracking", "✓", "✓ injetado no <head>"],
  ["Copiar e colar HTML completo", "✓", "✓ + download .html"],
  ["Múltiplos idiomas", "16 (pop-up) / 4 (review)", "pt, en, es, de em todos os tipos"],
  ["Score de compliance (Destination Requirements)", "—", "✓ auditoria regra por regra"],
  ["Biblioteca de presells salvas", "—", "✓ por usuário"],
  ["Quick win 48h com o curso", "—", "✓ integrado ao roadmap"],
];

export default function FlowPage() {
  const logged = !!userFromCookies(cookies().get("adag_session")?.value);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="badge-gold mb-2">Ferramenta · IA integrada</span>
          <span className="badge-green mb-2">presell em &lt; 1 minuto</span>
        </div>
        <h1 className="h-section">Flow Engine</h1>
        <p className="mt-4 max-w-3xl text-lg text-ink-100/70">
          O gerador de presells validadas — no espírito do Flow Pages, integrado ao curso. Você informa produto, nicho, link
          e idioma; a IA monta a página completa com estrutura que passa em Destination Requirements. Copie o HTML e suba no
          seu domínio neutro.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/curso/presell/anatomia-presell" className="btn btn-ghost btn-sm">
            📘 Aula: anatomia da presell que passa
          </Link>
          <Link href="/curso/presell/por-que-reprova" className="btn btn-ghost btn-sm">
            🛡️ Aula: por que reprova bridge thin
          </Link>
          {logged && (
            <Link href="/flow/biblioteca" className="btn btn-ghost btn-sm">
              🗂️ Minha biblioteca
            </Link>
          )}
        </div>
      </header>

      <FlowClient logged={logged} />

      <section className="mt-14">
        <h2 className="mb-2 text-xl font-bold text-white">Flow Engine vs. ferramenta de mercado</h2>
        <p className="mb-6 text-sm text-ink-100/55">
          Mesma proposta de velocidade — com a auditoria de compliance e a integração com o método do curso.
        </p>
        <div className="card overflow-hidden p-0">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-600">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gold-500">Recurso</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-100/50">Flow Pages (mercado)</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gold-400">Flow Engine (aqui)</th>
              </tr>
            </thead>
            <tbody>
              {comparativo.map((r, i) => (
                <tr key={i} className="border-b border-ink-700/50 last:border-0">
                  <td className="px-5 py-2.5 font-medium text-white">{r[0]}</td>
                  <td className="px-5 py-2.5 text-ink-100/55">{r[1]}</td>
                  <td className="px-5 py-2.5 font-semibold text-neon-400">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-ink-100/40">
          Comparativo elaborado a partir das informações públicas da ferramenta de mercado. Não há vínculo com o produto
          original.
        </p>
      </section>
    </div>
  );
}
