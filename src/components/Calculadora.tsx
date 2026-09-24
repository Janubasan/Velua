"use client";

import { useState } from "react";

export default function Calculadora() {
  const [comissao, setComissao] = useState(88.2);
  const [preco, setPreco] = useState(147);
  const [comissaoPct, setComissaoPct] = useState(60);
  const [conversao, setConversao] = useState(1.5);
  const [orcamento, setOrcamento] = useState(20);
  const [margem, setMargem] = useState(60);

  const comissaoLiquida = (preco * comissaoPct) / 100 || comissao;
  const cpaAlvo = comissaoLiquida * (margem / 100);
  const cpcMax = cpaAlvo * (conversao / 100);
  const cliquesPorVenda = conversao > 0 ? Math.round(100 / conversao) : 0;
  const cliquesDia = cpcMax > 0 ? Math.floor(orcamento / cpcMax) : 0;
  const diasTeste = cliquesDia > 0 ? Math.ceil(cliquesPorVenda / cliquesDia) : 0;

  const rows = [
    { label: "Comissão líquida por venda", valor: `$${comissaoLiquida.toFixed(2)}`, dica: "preço × comissão %" },
    { label: "CPA alvo", valor: `$${cpaAlvo.toFixed(2)}`, dica: `comissão × ${margem}% de segurança` },
    { label: "CPC máximo", valor: `$${cpcMax.toFixed(2)}`, dica: `CPA alvo × conversão ${conversao}%` },
    { label: "Cliques por venda", valor: `${cliquesPorVenda}`, dica: "1 ÷ conversão" },
    { label: "Cliques por dia com seu orçamento", valor: `${cliquesDia}`, dica: `orçamento $${orcamento}/dia ÷ CPC máximo` },
    { label: "Dias para decidir", valor: `${diasTeste}`, dica: "cliques necessários ÷ cliques por dia" },
  ];

  return (
    <div className="card">
      <h3 className="mb-1 text-lg font-bold text-white">Calculadora de CPA / ROAS</h3>
      <p className="mb-5 text-sm text-ink-100/55">
        Transforme os números da oferta em metas operacionais antes de subir a campanha.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="label">Preço do front-end ($)</label>
          <input type="number" className="input" value={preco} onChange={(e) => setPreco(+e.target.value)} />
        </div>
        <div>
          <label className="label">Comissão (%)</label>
          <input type="number" className="input" value={comissaoPct} onChange={(e) => setComissaoPct(+e.target.value)} />
        </div>
        <div>
          <label className="label">Margem de segurança (%)</label>
          <input type="number" className="input" value={margem} onChange={(e) => setMargem(+e.target.value)} />
        </div>
        <div>
          <label className="label">Conversão esperada do clique (%)</label>
          <input type="number" step="0.1" className="input" value={conversao} onChange={(e) => setConversao(+e.target.value)} />
        </div>
        <div>
          <label className="label">Orçamento de teste ($/dia)</label>
          <input type="number" className="input" value={orcamento} onChange={(e) => setOrcamento(+e.target.value)} />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-ink-600">
        <table className="w-full text-left text-sm">
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.label} className={i % 2 === 0 ? "bg-ink-900/50" : ""}>
                <td className="px-4 py-3 font-medium text-ink-100/85">
                  {r.label}
                  <span className="ml-2 text-[11px] text-ink-100/40">{r.dica}</span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-base font-bold text-gold-400">{r.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 rounded-xl border border-gold-500/25 bg-gold-500/5 p-4 text-sm text-ink-100/80">
        <strong className="text-gold-400">Regra de bolso:</strong> se o CPC da sua praça for maior que o CPC máximo calculado,
        a oferta não é para você — ou a praça não é Tier 1. ROAS 1,0 é equilíbrio; <strong>1,5 é a meta de escala</strong>.
      </div>
    </div>
  );
}
