import type { Metadata } from "next";
import Link from "next/link";
import { templateNotion, negativasBase } from "@/content/dados";
import NotionExport from "@/components/NotionExport";

export const metadata: Metadata = {
  title: "Template Notion completo",
  description:
    "Template Notion do Amigo do Afiliado: bancos de Ofertas, Campanhas, Negativas (120+ termos), Tracking, Presells e Rotina — exportáveis em CSV.",
};

export default function NotionPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <span className="badge-gold mb-4">Entregável</span>
        <h1 className="h-section">Template Notion completo</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-100/70">
          O sistema operacional do afiliado em 6 bancos de dados. Cada arquivo CSV abaixo importa direto no Notion como
          database — com dados de exemplo e as regras de decisão já embutidas.
        </p>
      </header>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="card p-5 text-center">
          <div className="text-3xl font-black text-gold-400">6</div>
          <div className="mt-1 text-sm font-semibold text-white">bancos de dados</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-black text-gold-400">{negativasBase.length}</div>
          <div className="mt-1 text-sm font-semibold text-white">negativas prontas</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-black text-gold-400">0–100</div>
          <div className="mt-1 text-sm font-semibold text-white">score de oferta</div>
        </div>
      </div>

      <h2 className="mb-5 text-xl font-bold text-white">Os bancos</h2>
      <div className="mb-10 space-y-4">
        {templateNotion.map((b) => (
          <div key={b.banco} className="card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-white">{b.banco}</h3>
              <span className="badge-muted">{b.linhas > 0 ? `${b.linhas} exemplos` : "lista completa"}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-100/70">{b.descricao}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 text-xl font-bold text-white">Exportar</h2>
      <p className="mb-6 text-sm text-ink-100/60">
        No Notion: <strong className="text-white">Novo → Importar → CSV</strong>. Depois crie uma página mestre e relacione os
        bancos (Ofertas ↔ Campanhas ↔ Presells).
      </p>
      <NotionExport />

      <div className="card mt-10">
        <h3 className="font-bold text-white">Como usar no dia a dia</h3>
        <ol className="mt-3 space-y-2 text-sm text-ink-100/75">
          <li><strong className="text-gold-400">1.</strong> Cadastre ofertas no banco Ofertas e calcule o Score. Só score ≥ 70 entra em teste.</li>
          <li><strong className="text-gold-400">2.</strong> Aplique a lista compartilhada de negativas em todas as campanhas antes do primeiro clique.</li>
          <li><strong className="text-gold-400">3.</strong> Registre cada campanha com CPA alvo e revise o search terms semanalmente.</li>
          <li><strong className="text-gold-400">4.</strong> Documente o postback no banco Tracking e monitore o match rate diariamente.</li>
          <li><strong className="text-gold-400">5.</strong> Faça a rotina de 15 min e registre diagnóstico + ação no banco Rotina.</li>
        </ol>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/rotina" className="btn btn-primary btn-sm">Abrir rotina de 15 min</Link>
          <Link href="/curso/mineracao/template-ofertas" className="btn btn-ghost btn-sm">Aula do Template de Ofertas</Link>
        </div>
      </div>
    </div>
  );
}
