"use client";

import { useState } from "react";
import type { Presell } from "@/lib/db";

export default function BibliotecaClient({ presells }: { presells: Presell[] }) {
  const [itens, setItens] = useState(presells);
  const [aberto, setAberto] = useState<string | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);

  const remover = async (id: string) => {
    await fetch(`/api/presells/${id}`, { method: "DELETE" });
    setItens((prev) => prev.filter((p) => p.id !== id));
  };

  const copiar = (id: string, html: string) => {
    navigator.clipboard.writeText(html);
    setCopiado(id);
    setTimeout(() => setCopiado(null), 2000);
  };

  return (
    <div className="space-y-4">
      {itens.map((p) => (
        <div key={p.id} className="card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">{p.produto}</h2>
              <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] text-ink-100/50">
                <span className="badge-muted">{p.tipo}</span>
                <span className="badge-muted">{p.idioma}</span>
                <span className="badge-muted">{p.nicho}</span>
                <span className="badge-muted">{p.variantes.length} variações</span>
                <span className={`badge ${p.mode === "llm" ? "border-neon-500/50 bg-neon-500/10 text-neon-400" : "border-ink-500 bg-ink-700/60 text-ink-100/60"}`}>
                  {p.mode === "llm" ? "LLM" : "local"}
                </span>
                <span className="badge-muted">{new Date(p.createdAt).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setAberto(aberto === p.id ? null : p.id)} className="btn btn-ghost btn-sm">
                {aberto === p.id ? "Fechar" : "Ver / copiar"}
              </button>
              <button onClick={() => remover(p.id)} className="btn btn-ghost btn-sm text-red-400">
                Excluir
              </button>
            </div>
          </div>

          {aberto === p.id && (
            <div className="mt-4 space-y-3">
              {p.variantes.map((v, i) => (
                <div key={i} className="rounded-xl border border-ink-600 bg-ink-900/50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-wide text-gold-500">
                        Variação {i + 1} · {v.angulo} · {v.palavras} palavras
                      </div>
                      <div className="truncate text-sm font-semibold text-white">{v.headline}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`badge ${
                          v.score >= 90
                            ? "border-neon-500/50 bg-neon-500/10 text-neon-400"
                            : v.score >= 70
                              ? "border-gold-500/50 bg-gold-500/10 text-gold-400"
                              : "border-red-500/50 bg-red-500/10 text-red-400"
                        }`}
                      >
                        score {v.score}
                      </span>
                      <button onClick={() => copiar(`${p.id}-${i}`, v.html)} className="btn btn-ghost btn-sm">
                        {copiado === `${p.id}-${i}` ? "✓ Copiado" : "Copiar HTML"}
                      </button>
                    </div>
                  </div>
                  <iframe
                    title={`Preview ${p.id} ${i}`}
                    srcDoc={v.html}
                    className="mt-3 h-80 w-full rounded-lg bg-white"
                    sandbox="allow-scripts allow-popups allow-forms"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
