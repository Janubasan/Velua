import Link from "next/link";
import type { Metadata } from "next";
import { fases, totalAulas, aulasFlat } from "@/content/curso";
import ProgressoCurso from "@/components/ProgressoCurso";

export const metadata: Metadata = {
  title: "Roadmap do curso — 6 fases",
  description:
    "Roadmap completo do curso Amigo do Afiliado na Gringa: mineração, presell, campanha, tracking offline, rotina e entregáveis.",
};

export default function CursoPage() {
  const slugs = aulasFlat().map((x) => x.aula.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <span className="badge-gold mb-4">Masterclass · Mina de Tesouro</span>
        <h1 className="h-section">Roadmap do curso</h1>
        <p className="mt-3 max-w-2xl text-ink-100/65">
          Seis fases, {totalAulas} aulas, zero achismo. Cada fase entrega um artefato operacional — você termina com o sistema
          montado, não com anotações.
        </p>
      </div>

      <div className="mb-10">
        <ProgressoCurso slugs={slugs} />
      </div>

      <div className="space-y-6">
        {fases.map((f) => (
          <section key={f.slug} className="card overflow-hidden p-0">
            <div className="flex flex-col gap-4 border-b border-ink-600/60 p-6 sm:flex-row sm:items-center">
              <span className="grid h-14 w-14 flex-none place-items-center rounded-2xl bg-ink-700 text-2xl">{f.icone}</span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-500">Fase {f.numero}</span>
                  <span className="badge-muted">{f.aulas.length} aulas</span>
                  <span className="badge-muted">{f.duracao}</span>
                </div>
                <h2 className="mt-1.5 text-xl font-extrabold tracking-tight text-white">{f.titulo}</h2>
                <p className="mt-1 text-sm text-ink-100/65">{f.subtitulo}</p>
              </div>
              <Link href={`/curso/${f.slug}`} className="btn btn-ghost btn-sm self-start sm:self-auto">
                Abrir fase
              </Link>
            </div>
            <div className="p-6 pt-5">
              <p className="mb-4 text-sm text-ink-100/70">
                <strong className="text-white">Objetivo:</strong> {f.objetivo}
              </p>
              <div className="mb-4 rounded-xl border border-gold-500/25 bg-gold-500/5 p-3 text-sm">
                <span className="font-semibold text-gold-400">Entregável da fase:</span>{" "}
                <span className="text-ink-100/80">{f.entregavel}</span>
              </div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {f.aulas.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/curso/${f.slug}/${a.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-ink-600/70 bg-ink-900/40 p-3 transition hover:border-gold-500/50"
                    >
                      <span className="text-lg">
                        {a.tipo === "sop" ? "🧭" : a.tipo === "checklist" ? "☑️" : a.tipo === "template" ? "🧩" : a.tipo === "metricas" ? "📊" : "📘"}
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold text-white">{a.titulo}</span>
                        <span className="block text-[11px] uppercase tracking-wide text-ink-100/45">
                          {a.tipo} · {a.duracao}
                        </span>
                      </span>
                      <span className="text-gold-500">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
