import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getFase, fases } from "@/content/curso";

export function generateStaticParams() {
  return fases.map((f) => ({ fase: f.slug }));
}

export async function generateMetadata({ params }: { params: { fase: string } }): Promise<Metadata> {
  const fase = getFase(params.fase);
  return { title: fase ? `Fase ${fase.numero}: ${fase.titulo}` : "Fase não encontrada" };
}

export default function FasePage({ params }: { params: { fase: string } }) {
  const fase = getFase(params.fase);
  if (!fase) notFound();
  const idx = fases.findIndex((f) => f.slug === fase.slug);
  const anterior = idx > 0 ? fases[idx - 1] : null;
  const proxima = idx < fases.length - 1 ? fases[idx + 1] : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link href="/curso" className="link-gold text-sm">
        ← Roadmap do curso
      </Link>

      <header className="mt-6">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 flex-none place-items-center rounded-2xl bg-ink-700 text-3xl">{fase.icone}</span>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-500">Fase {fase.numero}</div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{fase.titulo}</h1>
          </div>
        </div>
        <p className="mt-4 text-lg text-ink-100/70">{fase.subtitulo}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="badge-muted">{fase.aulas.length} aulas</span>
          <span className="badge-muted">{fase.duracao}</span>
          <span className="badge-gold">Entregável: {fase.entregavel}</span>
        </div>
      </header>

      <section className="card mt-8">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-gold-500">Objetivo da fase</h2>
        <p className="text-[15.5px] leading-relaxed text-ink-100/85">{fase.objetivo}</p>
      </section>

      <h2 className="mb-4 mt-10 text-xl font-bold text-white">Aulas desta fase</h2>
      <ul className="space-y-3">
        {fase.aulas.map((a, i) => (
          <li key={a.slug}>
            <Link
              href={`/curso/${fase.slug}/${a.slug}`}
              className="card flex items-center gap-4 p-5 transition hover:border-gold-500/50"
            >
              <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-ink-700 text-lg">
                {a.tipo === "sop" ? "🧭" : a.tipo === "checklist" ? "☑️" : a.tipo === "template" ? "🧩" : a.tipo === "metricas" ? "📊" : "📘"}
              </span>
              <span className="flex-1">
                <span className="block text-[11px] uppercase tracking-wide text-gold-500">
                  Aula {i + 1} · {a.tipo} · {a.duracao}
                </span>
                <span className="block font-bold text-white">{a.titulo}</span>
                <span className="mt-0.5 block text-sm text-ink-100/60">{a.objetivo}</span>
              </span>
              <span className="text-gold-500">→</span>
            </Link>
          </li>
        ))}
      </ul>

      <nav className="mt-12 flex items-center justify-between gap-4 border-t border-ink-700/60 pt-6">
        {anterior ? (
          <Link href={`/curso/${anterior.slug}`} className="btn btn-ghost btn-sm">
            ← Fase {anterior.numero}: {anterior.titulo}
          </Link>
        ) : (
          <span />
        )}
        {proxima ? (
          <Link href={`/curso/${proxima.slug}`} className="btn btn-primary btn-sm">
            Fase {proxima.numero}: {proxima.titulo} →
          </Link>
        ) : (
          <Link href="/flow" className="btn btn-primary btn-sm">
            Ir para o Flow Engine →
          </Link>
        )}
      </nav>
    </div>
  );
}
