import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink-700/80 bg-ink-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-500 text-lg font-black text-ink-950">A</span>
            <span className="text-sm font-extrabold text-white">Amigo do Afiliado na Gringa</span>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ink-100/50">
            Masterclass de afiliação internacional com sistema completo: mineração de ofertas, presell validada, Google Ads fundo
            de funil, tracking offline e rotina de gestão.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gold-500">Aprender</h4>
          <ul className="space-y-2 text-sm text-ink-100/60">
            <li><Link href="/curso" className="hover:text-white">Roadmap do curso</Link></li>
            <li><Link href="/metricas" className="hover:text-white">Métricas & cases validados</Link></li>
            <li><Link href="/rotina" className="hover:text-white">Rotina de 15 minutos</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gold-500">Ferramentas</h4>
          <ul className="space-y-2 text-sm text-ink-100/60">
            <li><Link href="/flow" className="hover:text-white">Flow Engine (presell com IA)</Link></li>
            <li><Link href="/notion" className="hover:text-white">Template Notion</Link></li>
            <li><Link href="/flow/biblioteca" className="hover:text-white">Minhas presells</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gold-500">Stack validada</h4>
          <ul className="space-y-2 text-xs text-ink-100/50">
            <li>EvoClick (tracker self-hosted, MIT)</li>
            <li>Qwen-Marketing (LLM, Apache 2.0)</li>
            <li>BuyGoods · Digistore24 · Google Ads</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-700/60 px-4 py-5 text-center text-[11px] text-ink-100/40">
        Conteúdo educacional. Resultados variam conforme operação, oferta e verba. Não há promessa de rentabilidade.
      </div>
    </footer>
  );
}
