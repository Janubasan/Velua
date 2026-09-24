"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConcluirAula({ slug, logged }: { slug: string; logged: boolean }) {
  const [done, setDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("adag:aulas");
      if (raw) setDone((JSON.parse(raw) as string[]).includes(slug));
    } catch {
      /* ignore */
    }
  }, [slug]);

  const toggle = async () => {
    const next = !done;
    setDone(next);
    try {
      const raw = localStorage.getItem("adag:aulas");
      const arr: string[] = raw ? JSON.parse(raw) : [];
      const updated = next ? Array.from(new Set([...arr, slug])) : arr.filter((s) => s !== slug);
      localStorage.setItem("adag:aulas", JSON.stringify(updated));
    } catch {
      /* ignore */
    }
    if (logged) {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aula: slug, concluir: next }),
      });
      router.refresh();
    }
  };

  return (
    <button onClick={toggle} className={done ? "btn border border-neon-500/60 bg-neon-500/15 text-neon-400" : "btn btn-primary"}>
      {done ? "✓ Aula concluída" : "Marcar aula como concluída"}
    </button>
  );
}
