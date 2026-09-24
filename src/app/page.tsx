import Link from "next/link";
import { fases, totalAulas } from "@/content/curso";
import { metricasValidadas, casesValidados, ferramentas } from "@/content/dados";

const destaques = [
  { label: "EPC validado", valor: "$3,81", sub: "VigorX Pro · BuyGoods" },
  { label: "Checkout convertendo", valor: "53,5%", sub: "case de referência" },
  { label: "Comissão até", valor: "85%", sub: "Digistore24" },
  { label: "Quick win em", valor: "48h", sub: "oferta + presell + tracker" },
];

const produtos = [
  {
    icone: "🎓",
    titulo: "Masterclass em 6 fases",
    desc: `${totalAulas} aulas didáticas com SOP passo a passo, métricas de corte, erros comuns e quick win em cada etapa. Do zero à campanha no ar.`,
    href: "/curso",
    cta: "Ver roadmap",
  },
  {
    icone: "⚡",
    titulo: "Flow Engine — presell com IA",
    desc: "Gerador de presells validadas: review, robusta, advertorial, pop-up de idade e captcha. HTML pronto para copiar e colar no seu domínio, em 4 idiomas, com score de compliance.",
    href: "/flow",
    cta: "Gerar presell",
  },
  {
    icone: "🗂️",
    titulo: "Template Notion completo",
    desc: "6 bancos de dados prontos (Ofertas, Campanhas, Negativas com 120+ termos, Tracking, Presells, Rotina) exportáveis em CSV para importar no Notion.",
    href: "/notion",
    cta: "Exportar template",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-gold-500/15 blur-[120px]" />
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="badge-gold mb-5">Mina de Tesouro · edição 2026</span>
            <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-6xl">
              O sistema completo para vender como afiliado{" "}
              <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">na gringa</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-100/70">
              Mineração de ofertas validadas em BuyGoods e Digistore24, presell que passa no Google Ads, campanha de fundo de
              funil com tracking offline por postback — e uma rotina de 15 minutos por dia para não quebrar a banca.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/curso" className="btn btn-primary px-7 py-3.5 text-base">
                Começar o curso agora
              </Link>
              <Link href="/flow" className="btn btn-ghost px-7 py-3.5 text-base">
                ⚡ Gerar presell com IA
              </Link>
            </div>
            <p className="mt-4 text-xs text-ink-100/40">
              Sem cartão, sem enrolação: as 3 primeiras aulas estão abertas.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {destaques.map((d) => (
              <div key={d.label} className="card p-4 text-center">
                <div className="text-2xl font-black text-gold-400 sm:text-3xl">{d.valor}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-white">{d.label}</div>
                <div className="text-[11px] text-ink-100/45">{d.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="border-y border-ink-700/60 bg-ink-900/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <span className="badge-muted mb-4">O diagnóstico</span>
              <h2 className="h-section">O iniciante não quebra por falta de oferta. Quebra por falta de sistema.</h2>
              <p className="mt-4 text-ink-100/70">
              Três buracos explicam 100% das bancas queimadas nos primeiros 90 dias. O curso existe para tapar os três —
              na ordem certa.
              </p>
            </div>
            <div className="space-y-3">
              {[
                {
                  t: "Tracking cego",
                  d: "Sem postback offline, o Google Ads otimiza para clique, não para venda. Você paga mais caro a cada semana.",
                  fix: "Fase 4",
                },
                {
                  t: "Presell thin",
                  d: "Bridge page de 3 bullets é reprovada como low value content em Destination Requirements.",
                  fix: "Fase 2",
                },
                {
                  t: "Sem negativas homônimas",
                  d: "Busca de baixa intenção e homônimos comem o orçamento antes de você aprender qualquer coisa.",
                  fix: "Fase 3",
                },
              ].map((p) => (
                <div key={p.t} className="card flex items-start gap-4 p-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{p.t}</h3>
                      <span className="badge-gold">{p.fix}</span>
                    </div>
                    <p className="mt-1.5 text-sm text-ink-100/65">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUTOS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <span className="badge-gold mb-4">Tudo em um lugar</span>
          <h2 className="h-section">Curso, ferramenta e template — integrados</h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink-100/65">
            Você aprende o sistema, executa com a ferramenta e controla tudo no Notion. Nada de produto pela metade.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {produtos.map((p) => (
            <div key={p.titulo} className="card flex flex-col transition hover:border-gold-500/50">
              <div className="mb-4 text-4xl">{p.icone}</div>
              <h3 className="text-lg font-bold text-white">{p.titulo}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-100/65">{p.desc}</p>
              <Link href={p.href} className="btn btn-primary mt-5">
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ROADMAP */}
      <section className="border-y border-ink-700/60 bg-ink-900/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="badge-gold mb-4">Roadmap</span>
              <h2 className="h-section">6 fases, 0 achismo</h2>
            </div>
            <Link href="/curso" className="btn btn-ghost">Ver todas as aulas</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fases.map((f) => (
              <Link key={f.slug} href={`/curso/${f.slug}`} className="card group transition hover:border-gold-500/50">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-ink-700 text-xl">{f.icone}</span>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gold-500">Fase {f.numero}</div>
                    <h3 className="font-bold leading-tight text-white group-hover:text-gold-400">{f.titulo}</h3>
                  </div>
                </div>
                <p className="mt-3 text-sm text-ink-100/60">{f.subtitulo}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-ink-100/45">
                  <span>{f.aulas.length} aulas · {f.duracao}</span>
                  <span className="text-gold-500">entrar →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CASES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <span className="badge-green mb-4">Cases validados</span>
          <h2 className="h-section">O que funcionou, o que começar fazendo, como escalar</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {casesValidados.map((c) => (
            <div key={c.oferta} className="card">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-bold text-white">{c.oferta}</h3>
                <span className="badge-muted">{c.rede}</span>
              </div>
              <p className="mt-1 text-xs uppercase tracking-wide text-gold-500">{c.nicho}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {c.numeros.map((n) => (
                  <div key={n.label} className="rounded-lg bg-ink-900/70 p-3">
                    <div className="text-base font-black text-gold-400">{n.valor}</div>
                    <div className="text-[11px] text-ink-100/50">{n.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-neon-400">O que funcionou</h4>
                  <ul className="mt-1 space-y-1 text-ink-100/70">
                    {c.oQueFuncionou.map((x, i) => (
                      <li key={i} className="flex gap-2"><span className="text-neon-500">✓</span>{x}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-gold-400">Comece fazendo</h4>
                  <ul className="mt-1 space-y-1 text-ink-100/70">
                    {c.oQueComecarFazendo.map((x, i) => (
                      <li key={i} className="flex gap-2"><span className="text-gold-500">→</span>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <Link href="/metricas" className="link-gold mt-4 inline-block text-sm">Ver métricas completas →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* STACK */}
      <section className="border-t border-ink-700/60 bg-ink-900/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-10 text-center">
            <span className="badge-muted mb-4">Stack auditável</span>
            <h2 className="h-section">Ferramentas open-source que sustentam o sistema</h2>
            <p className="mx-auto mt-3 max-w-2xl text-ink-100/60">
              Nada de caixa-preta: cada peça do funil tem uma ferramenta aberta, documentada e testada em campo.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ferramentas.slice(0, 9).map((f) => (
              <a
                key={f.nome}
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card block p-5 transition hover:border-gold-500/50"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white">{f.nome}</h3>
                  <span className="badge-muted">{f.licenca}</span>
                </div>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-gold-500">{f.tipo}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-100/60">{f.papelNoFunil}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="card relative overflow-hidden text-center">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-gold-500/20 blur-[100px]" />
          <div className="relative">
            <h2 className="h-section">Quick win em 48 horas</h2>
            <p className="mx-auto mt-4 max-w-2xl text-ink-100/70">
              Template de mineração + tracker dockerizado + presell validada gerada com IA + lista de negativas com 120+ termos.
              Você começa pelo resultado e aprofunda depois.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/curso" className="btn btn-primary px-7 py-3.5 text-base">Começar Fase 1</Link>
              <Link href="/flow" className="btn btn-ghost px-7 py-3.5 text-base">Gerar minha presell</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
