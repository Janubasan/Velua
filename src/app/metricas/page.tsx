import type { Metadata } from "next";
import Link from "next/link";
import { metricasValidadas, casesValidados, fluxoPostback, negativasBase } from "@/content/dados";

export const metadata: Metadata = {
  title: "Métricas e cases validados",
  description:
    "Os números validados em campo: EPC, conversão de checkout, comissões, payouts e as regras de gestão de BuyGoods, Digistore24 e Google Ads.",
};

const tierStyle: Record<string, string> = {
  ouro: "border-gold-500/50 bg-gold-500/10 text-gold-400",
  prata: "border-ink-400/40 bg-ink-500/20 text-ink-100/80",
  bronze: "border-orange-500/40 bg-orange-500/10 text-orange-300",
};

export default function MetricasPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <span className="badge-gold mb-4">Dados de campo</span>
        <h1 className="h-section">Métricas & cases validados</h1>
        <p className="mt-3 max-w-3xl text-ink-100/65">
          Nada de número de blog. Estas são as métricas coletadas em backoffice (BuyGoods, Digistore24), em trackers
          open-source e em operações reais de fundo de funil. Use como critério de corte — não como promessa.
        </p>
      </header>

      {/* métricas */}
      <section className="mb-14">
        <h2 className="mb-5 text-xl font-bold text-white">Painel de métricas</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metricasValidadas.map((m) => (
            <div key={m.label} className="card p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="text-2xl font-black text-gold-400">{m.valor}</div>
                <span className={`badge ${tierStyle[m.tier]}`}>{m.tier}</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-white">{m.label}</div>
              <p className="mt-1 text-xs leading-relaxed text-ink-100/55">{m.contexto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* cases */}
      <section className="mb-14">
        <h2 className="mb-2 text-xl font-bold text-white">Cases: o que funcionou, o que começar fazendo, como escalar</h2>
        <p className="mb-6 text-sm text-ink-100/55">
          Três ofertas, três arquiteturas. Compare com a sua operação e copie o que faz sentido para o seu nicho.
        </p>
        <div className="space-y-6">
          {casesValidados.map((c) => (
            <article key={c.oferta} className="card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{c.oferta}</h3>
                  <p className="text-xs uppercase tracking-wide text-gold-500">
                    {c.nicho} · {c.rede}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.numeros.map((n) => (
                    <div key={n.label} className="rounded-lg bg-ink-900/70 px-3 py-2 text-center">
                      <div className="text-sm font-black text-gold-400">{n.valor}</div>
                      <div className="text-[10px] uppercase tracking-wide text-ink-100/45">{n.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-neon-400">✓ O que funcionou</h4>
                  <ul className="space-y-1.5 text-sm text-ink-100/75">
                    {c.oQueFuncionou.map((x, i) => (
                      <li key={i} className="flex gap-2"><span className="text-neon-500">•</span>{x}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-gold-400">→ O que você começa fazendo</h4>
                  <ul className="space-y-1.5 text-sm text-ink-100/75">
                    {c.oQueComecarFazendo.map((x, i) => (
                      <li key={i} className="flex gap-2"><span className="text-gold-500">•</span>{x}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-sky-400">↑ Como escalar</h4>
                  <ul className="space-y-1.5 text-sm text-ink-100/75">
                    {c.comoEscalar.map((x, i) => (
                      <li key={i} className="flex gap-2"><span className="text-sky-400">•</span>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* fluxo postback */}
      <section className="mb-14">
        <h2 className="mb-2 text-xl font-bold text-white">O fluxo de atribuição (postback offline)</h2>
        <p className="mb-6 text-sm text-ink-100/55">
          A engenharia que faz o Google Ads otimizar para venda. Cada etapa tem dono e ferramenta.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {fluxoPostback.map((f) => (
            <div key={f.passo} className="card p-4">
              <div className="mb-2 grid h-8 w-8 place-items-center rounded-lg bg-gold-500/15 text-sm font-black text-gold-400">
                {f.passo}
              </div>
              <h3 className="text-sm font-bold text-white">{f.titulo}</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-100/60">{f.detalhe}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/curso/tracking/thread-click-id" className="btn btn-ghost btn-sm">
            Ver aula completa do thread de click ID →
          </Link>
        </div>
      </section>

      {/* negativas preview */}
      <section>
        <h2 className="mb-2 text-xl font-bold text-white">Negativas homônimas — amostra da lista base</h2>
        <p className="mb-6 text-sm text-ink-100/55">
          A lista completa tem <strong className="text-white">{negativasBase.length} termos</strong> e está no template Notion,
          pronta para virar lista compartilhada nas suas campanhas.
        </p>
        <div className="card overflow-hidden p-0">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-600">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gold-500">Termo</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gold-500">Tipo</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gold-500">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {negativasBase.slice(0, 12).map((n) => (
                <tr key={n.termo} className="border-b border-ink-700/50 last:border-0">
                  <td className="px-4 py-2.5 font-mono text-[13px] text-ink-100">{n.termo}</td>
                  <td className="px-4 py-2.5 text-ink-100/70">{n.tipo}</td>
                  <td className="px-4 py-2.5 text-ink-100/60">{n.motivo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Link href="/notion" className="btn btn-primary btn-sm">
            Baixar lista completa no Template Notion →
          </Link>
        </div>
      </section>
    </div>
  );
}
