"use client";

import { useEffect, useState } from "react";

export default function ProgressoCurso({ slugs }: { slugs: string[] }) {
  const [feitos, setFeitos] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      let done: string[] = [];
      try {
        const raw = localStorage.getItem("adag:aulas");
        if (raw) done = JSON.parse(raw) || [];
      } catch {
        /* ignore */
      }
      try {
        const res = await fetch("/api/progress");
        if (res.ok) {
          const data = await res.json();
          const server: string[] = Object.keys(data.progress || {});
          done = Array.from(new Set([...done, ...server]));
          localStorage.setItem("adag:aulas", JSON.stringify(done));
        }
      } catch {
        /* ignore */
      }
      setFeitos(done.filter((s) => slugs.includes(s)));
    };
    load();
  }, [slugs]);

  const pct = slugs.length ? Math.round((feitos.length / slugs.length) * 100) : 0;

  return (
    <div className="card p-5">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-white">Seu progresso</span>
        <span className="badge-gold">
          {feitos.length}/{slugs.length} aulas · {pct}%
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-ink-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
