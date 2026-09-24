"use client";

import { useEffect, useState } from "react";

export default function Checklist({ itens, storageKey, titulo }: { itens: string[]; storageKey: string; titulo?: string }) {
  const [marcados, setMarcados] = useState<boolean[]>(() => itens.map(() => false));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`chk:${storageKey}`);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setMarcados(itens.map((_, i) => !!arr[i]));
      }
    } catch {
      /* ignore */
    }
  }, [itens, storageKey]);

  const toggle = (i: number) => {
    setMarcados((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      try {
        localStorage.setItem(`chk:${storageKey}`, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const feitos = marcados.filter(Boolean).length;

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold text-white">
          <span className="text-gold-500">☑</span> {titulo ?? "Checklist de execução"}
        </h3>
        <span className="badge-gold">
          {feitos}/{itens.length}
        </span>
      </div>
      <ul className="space-y-2">
        {itens.map((item, i) => (
          <li key={i}>
            <button
              onClick={() => toggle(i)}
              className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition ${
                marcados[i]
                  ? "border-neon-500/50 bg-neon-500/10 text-neon-400"
                  : "border-ink-600 bg-ink-900/50 text-ink-100/80 hover:border-gold-500/50"
              }`}
            >
              <span
                className={`mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-md border text-xs font-bold ${
                  marcados[i] ? "border-neon-500 bg-neon-500 text-ink-950" : "border-ink-500"
                }`}
              >
                {marcados[i] ? "✓" : ""}
              </span>
              <span className={marcados[i] ? "line-through opacity-70" : ""}>{item}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
