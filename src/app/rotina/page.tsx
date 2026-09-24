import type { Metadata } from "next";
import Link from "next/link";
import Checklist from "@/components/Checklist";
import Calculadora from "@/components/Calculadora";

export const metadata: Metadata = {
  title: "Rotina de 15 minutos, diagnóstico e calculadora",
  description:
    "Checklist diário de 15 minutos, árvore de diagnóstico para 0 impressões/CTR/CPC e calculadora de CPA alvo e ROAS.",
};

const diagnostico = [
  {
    sintoma: "0 impressões",
    causas: [
      ["Anúncio reprovado", "Coluna Status = Reprovado", "Corrigir destino: presell thin ou política"],
      ["Negativa homônima", "Search terms desaparece", "Remover negativa errada da lista compartilhada"],
      ["Lance baixo", "Elegibilidade do lance", "Subir lance 20% ou reduzir keywords"],
      ["Orçamento limitado", "IS lost by budget > 30%", "Aumentar 20% ou podar keywords"],
      ["URL não confere", "Final URL ≠ destino", "Congruência nos 3 elos (anúncio/URL/presell)"],
    ],
  },
  {
    sintoma: "CTR < 2%",
    causas: [
      ["Headline sem congruência", "RSA não reflete a keyword", "Reescrever RSA 1 com a mesma promessa"],
      ["Query topo de funil", "Search terms genéricos", "Adicionar negativas de intenção"],
      ["Anúncio genérico", "CTR baixo em todos os grupos", "Promessa específica com número"],
    ],
  },
  {
    sintoma: "CPC estourado",
    causas: [
      ["Quality Score baixo", "Relevância do anúncio/landing", "Congruência + presell mais completa"],
      ["Leilão quente", "CPC sobe em horário de pico", "Tier 2 (UK/CA/AU) ou ajustar horários"],
      ["Muitas broad", "Search terms aleatórios", "Migrar para exata/frase"],
    ],
  },
  {
    sintoma: "Clique vai, venda não vem",
    causas: [
      ["Match rate < 90%", "Tracker com perda de postback", "Consertar tracking antes de julgar a oferta"],
      ["Checkout do merchant lento", "Página de vendas pesada", "Testar outra oferta do mesmo nicho"],
      ["Presell não responde objeção", "Alto bounce na presell", "Gerar variação Robusta no Flow Engine"],
    ],
  },
];

const regras = [
  ["Grupo sem conversão", "gastou 1x CPA alvo", "Pausar grupo, revisar anúncio e presell"],
  ["Grupo sem conversão", "gastou 1,5x CPA alvo", "Matar keyword, voltar para mineração"],
  ["ROAS > 1,5", "2+ conversões no alvo", "Aumentar orçamento 20%"],
  ["IS perdido por orçamento", "> 30%", "Aumentar orçamento 20%"],
  ["CPA subindo", "3 dias seguidos", "Pausar e diagnosticar search terms"],
  ["Campanha travada", "0 impressões por 48h", "Diagnóstico: política, lance ou negativa"],
  ["Match rate do postback", "< 90%", "Consertar tracking — prioridade zero"],
];

export default function RotinaPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <span className="badge-gold mb-4">Fase 5 · operação</span>
        <h1 className="h-section">Rotina de 15 minutos</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-100/70">
          Uma vez por dia, sempre no mesmo horário, cronômetro rodando. A rotina não é para "cuidar da campanha" — é para
          tomar três decisões com base em números.
        </p>
      </header>

      <div className="mb-12">
        <Checklist
          titulo="Checklist diário (15 min)"
          storageKey="rotina-diaria"
          itens={[
            "Impressões > 0 em todos os grupos ativos (se 0: árvore de diagnóstico abaixo)",
            "CTR ≥ 2% — se não, trocar headline da RSA",
            "CPC dentro do teto — se não, adicionar negativas e checar Quality Score",
            "Nenhum grupo gastou 1,5x CPA alvo sem conversão (se gastou: pausar)",
            "ROAS > 1,5 → aumento de 20% aplicado (nunca dobrar)",
            "Search terms revisado: 2+ cliques e 0 conversão = negativa",
            "Match rate do postback ≥ 90%",
            "Diagnóstico e ação registrados no banco Rotina do Notion",
          ]}
        />
      </div>

      <section className="mb-12">
        <h2 className="mb-2 text-xl font-bold text-white">Árvore de diagnóstico</h2>
        <p className="mb-6 text-sm text-ink-100/55">Sintoma → tabela → teste → registro. Nada de adivinhação.</p>
        <div className="space-y-5">
          {diagnostico.map((d) => (
            <div key={d.sintoma} className="card overflow-hidden p-0">
              <div className="border-b border-ink-600/60 bg-ink-900/60 px-5 py-3">
                <h3 className="font-bold text-gold-400">Sintoma: {d.sintoma}</h3>
              </div>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-700/60">
                    <th className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-100/50">Causa</th>
                    <th className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-100/50">Como confirmar</th>
                    <th className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-100/50">Correção</th>
                  </tr>
                </thead>
                <tbody>
                  {d.causas.map((c, i) => (
                    <tr key={i} className="border-b border-ink-700/40 last:border-0">
                      <td className="px-5 py-2.5 font-medium text-white">{c[0]}</td>
                      <td className="px-5 py-2.5 text-ink-100/70">{c[1]}</td>
                      <td className="px-5 py-2.5 text-neon-400">{c[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-2 text-xl font-bold text-white">Regras de pause, scale e kill</h2>
        <p className="mb-6 text-sm text-ink-100/55">Números, não sentimentos. Kill rápido é skill.</p>
        <div className="card overflow-hidden p-0">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-600">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gold-500">Situação</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gold-500">Métrica</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gold-500">Ação</th>
              </tr>
            </thead>
            <tbody>
              {regras.map((r, i) => (
                <tr key={i} className="border-b border-ink-700/50 last:border-0">
                  <td className="px-5 py-2.5 text-white">{r[0]}</td>
                  <td className="px-5 py-2.5 font-mono text-ink-100/75">{r[1]}</td>
                  <td className="px-5 py-2.5 text-neon-400">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <Calculadora />
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/curso/rotina/arvore-diagnostico" className="btn btn-ghost btn-sm">
          Aula completa: árvore de diagnóstico →
        </Link>
        <Link href="/notion" className="btn btn-ghost btn-sm">
          Banco Rotina no Template Notion →
        </Link>
      </div>
    </div>
  );
}
