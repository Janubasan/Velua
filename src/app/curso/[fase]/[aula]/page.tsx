import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAula, getFase, fases, navegacao } from "@/content/curso";
import Markdown from "@/components/Markdown";
import Checklist from "@/components/Checklist";
import ConcluirAula from "@/components/ConcluirAula";
import { cookies } from "next/headers";
import { userFromCookies } from "@/lib/auth";

export function generateStaticParams() {
  return fases.flatMap((f) => f.aulas.map((a) => ({ fase: f.slug, aula: a.slug })));
}

export async function generateMetadata({ params }: { params: { fase: string; aula: string } }): Promise<Metadata> {
  const found = getAula(params.fase, params.aula);
  return { title: found ? found.aula.titulo : "Aula não encontrada" };
}

const TIPO_LABEL: Record<string, string> = {
  aula: "Aula",
  sop: "SOP — passo a passo",
  checklist: "Checklist",
  template: "Template",
  metricas: "Métricas",
};

export default function AulaPage({ params }: { params: { fase: string; aula: string } }) {
  const found = getAula(params.fase, params.aula);
  if (!found) notFound();
  const { fase, aula } = found;
  const nav = navegacao(fase.slug, aula.slug);
  const logged = !!userFromCookies(cookies().get("adag_session")?.value);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-100/45">
        <Link href="/curso" className="hover:text-white">Curso</Link>
        <span>/</span>
        <Link href={`/curso/${fase.slug}`} className="hover:text-white">
          Fase {fase.numero}: {fase.titulo}
        </Link>
        <span>/</span>
        <span className="text-ink-100/70">Aula {nav.indice} de {nav.total}</span>
      </nav>

      <header className="mt-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge-gold">{TIPO_LABEL[aula.tipo] ?? aula.tipo}</span>
          <span className="badge-muted">{aula.duracao}</span>
        </div>
        <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">{aula.titulo}</h1>
        <div className="mt-4 rounded-xl border-l-4 border-gold-500 bg-ink-800/60 px-5 py-3.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gold-500">Objetivo da aula</div>
          <p className="mt-1 text-[15px] text-ink-100/85">{aula.objetivo}</p>
        </div>
      </header>

      <article className="mt-8">
        <Markdown content={aula.conteudo} />
      </article>

      {aula.passos && aula.passos.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-white">Passo a passo</h2>
          <ol className="space-y-3">
            {aula.passos.map((p, i) => (
              <li key={i} className="card flex gap-4 p-4">
                <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-gold-500 text-sm font-black text-ink-950">
                  {i + 1}
                </span>
                <p className="text-[15px] leading-relaxed text-ink-100/85">{p}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {aula.checklist && (
        <div className="mt-8">
          <Checklist itens={aula.checklist} storageKey={`aula:${fase.slug}:${aula.slug}`} />
        </div>
      )}

      {aula.erros && aula.erros.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-white">Erros comuns — e a correção</h2>
          <div className="card overflow-hidden p-0">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-600">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-red-400">Erro</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neon-400">Correção</th>
                </tr>
              </thead>
              <tbody>
                {aula.erros.map((e, i) => (
                  <tr key={i} className="border-b border-ink-700/50 last:border-0">
                    <td className="px-4 py-3 align-top text-ink-100/80">✗ {e.erro}</td>
                    <td className="px-4 py-3 align-top text-ink-100/80">✓ {e.correcao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {aula.quickWin && (
        <section className="mt-10">
          <div className="rounded-2xl border border-neon-500/40 bg-gradient-to-br from-neon-500/10 to-transparent p-6">
            <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-neon-400">⚡ Quick win</div>
            <p className="text-[15.5px] leading-relaxed text-white">{aula.quickWin}</p>
          </div>
        </section>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-ink-700/60 pt-6">
        <ConcluirAula slug={aula.slug} logged={logged} />
        {!logged && (
          <span className="text-xs text-ink-100/45">
            <Link href="/login" className="link-gold">Entre</Link> para salvar seu progresso na nuvem.
          </span>
        )}
      </div>

      <nav className="mt-8 grid gap-3 sm:grid-cols-2">
        {nav.anterior ? (
          <Link
            href={`/curso/${nav.anterior.fase.slug}/${nav.anterior.aula.slug}`}
            className="card p-4 transition hover:border-gold-500/50"
          >
            <div className="text-[11px] uppercase tracking-wide text-ink-100/45">← Aula anterior</div>
            <div className="mt-0.5 font-semibold text-white">{nav.anterior.aula.titulo}</div>
          </Link>
        ) : (
          <span />
        )}
        {nav.proxima ? (
          <Link
            href={`/curso/${nav.proxima.fase.slug}/${nav.proxima.aula.slug}`}
            className="card p-4 text-right transition hover:border-gold-500/50"
          >
            <div className="text-[11px] uppercase tracking-wide text-ink-100/45">Próxima aula →</div>
            <div className="mt-0.5 font-semibold text-white">{nav.proxima.aula.titulo}</div>
          </Link>
        ) : (
          <Link href="/flow" className="card p-4 text-right transition hover:border-gold-500/50">
            <div className="text-[11px] uppercase tracking-wide text-ink-100/45">Próximo passo →</div>
            <div className="mt-0.5 font-semibold text-gold-400">Flow Engine — gerar presell com IA</div>
          </Link>
        )}
      </nav>
    </div>
  );
}
