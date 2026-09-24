"use client";

import { useEffect, useState } from "react";

interface Arquivo {
  nome: string;
  conteudo: string;
}

export default function NotionExport() {
  const [arquivos, setArquivos] = useState<Arquivo[]>([]);
  const [copiado, setCopiado] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/export/notion")
      .then((r) => r.json())
      .then((d) => setArquivos(d.arquivos || []))
      .catch(() => setArquivos([]));
  }, []);

  const baixar = (a: Arquivo) => {
    const blob = new Blob([a.conteudo], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = a.nome;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copiar = async (a: Arquivo) => {
    await navigator.clipboard.writeText(a.conteudo);
    setCopiado(a.nome);
    setTimeout(() => setCopiado(null), 2000);
  };

  return (
    <div className="space-y-3">
      {arquivos.map((a) => (
        <div key={a.nome} className="card flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">{a.nome.endsWith(".md") ? "📄" : "📊"}</span>
            <div>
              <div className="font-mono text-sm font-semibold text-white">{a.nome}</div>
              <div className="text-[11px] text-ink-100/45">
                {a.conteudo.split("\n").length} linhas · {(a.conteudo.length / 1024).toFixed(1)} KB
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => copiar(a)} className="btn btn-ghost btn-sm">
              {copiado === a.nome ? "✓ Copiado" : "Copiar"}
            </button>
            <button onClick={() => baixar(a)} className="btn btn-primary btn-sm">
              Baixar
            </button>
          </div>
        </div>
      ))}
      {arquivos.length === 0 && <div className="card p-6 text-sm text-ink-100/50">Carregando arquivos…</div>}
    </div>
  );
}
