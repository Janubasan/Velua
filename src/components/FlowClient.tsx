"use client";

import { useState, useRef } from "react";
import { LANGS, NICHOS, type Lang, type Nicho } from "@/lib/copy";

interface Regra {
  id: string;
  label: string;
  ok: boolean;
  dica: string;
}
interface Variante {
  headline: string;
  angulo: string;
  palavras: number;
  score: number;
  html: string;
  regras: Regra[];
}
interface Resultado {
  mode: "local" | "llm";
  variantes: Variante[];
}

const TIPOS = [
  { id: "review", label: "Presell de Review (IA)", desc: "Review completa: benefícios, prova social, comparação, FAQ, veredito." },
  { id: "robusta", label: "Presell Robusta (IA)", desc: "Estrutura de página de vendas enxuta: mais seções, vídeo, FAQ completo." },
  { id: "advertorial", label: "Advertorial", desc: "Formato história — esquenta o clique antes do CTA." },
  { id: "popup-idade", label: "Pop-up de Idade", desc: "Verificação 18+ em tela cheia, redireciona para o link." },
  { id: "popup-captcha", label: "Pop-up Captcha", desc: "Verificação 'não sou um robô' antes do destino." },
];

function scoreColor(score: number): string {
  if (score >= 90) return "border-neon-500/50 bg-neon-500/10 text-neon-400";
  if (score >= 70) return "border-gold-500/50 bg-gold-500/10 text-gold-400";
  return "border-red-500/50 bg-red-500/10 text-red-400";
}

export default function FlowClient({ logged }: { logged: boolean }) {
  const [produto, setProduto] = useState("");
  const [nicho, setNicho] = useState<Nicho>("saude");
  const [link, setLink] = useState("");
  const [idioma, setIdioma] = useState<Lang>("pt");
  const [tipo, setTipo] = useState("review");
  const [variacoes, setVariacoes] = useState(3);
  const [publico, setPublico] = useState("");
  const [tracking, setTracking] = useState("");
  const [ageGate, setAgeGate] = useState(false);
  const [cookie, setCookie] = useState(true);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [ativa, setAtiva] = useState(0);
  const [salvo, setSalvo] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  async function gerar() {
    setLoading(true);
    setErro("");
    setSalvo(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produto,
          nicho,
          link,
          idioma,
          tipo,
          variacoes,
          publico,
          trackingCode: tracking,
          ageGate,
          cookieBanner: cookie,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || "Erro ao gerar.");
        return;
      }
      setResultado(data);
      setAtiva(0);
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const variante = resultado?.variantes[ativa];

  function copiarHtml() {
    if (!variante) return;
    navigator.clipboard.writeText(variante.html);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  function baixarHtml() {
    if (!variante) return;
    const blob = new Blob([variante.html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${produto.toLowerCase().replace(/[^a-z0-9]+/gi, "-") || "presell"}-${tipo}-${idioma}-v${ativa + 1}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function salvar() {
    if (!resultado) return;
    const res = await fetch("/api/presells", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        produto,
        nicho,
        idioma,
        tipo,
        link,
        mode: resultado.mode,
        variantes: resultado.variantes.map((v) => ({
          headline: v.headline,
          angulo: v.angulo,
          palavras: v.palavras,
          score: v.score,
          html: v.html,
        })),
      }),
    });
    if (res.ok) setSalvo(true);
    else setErro("Faça login para salvar na biblioteca.");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      {/* FORM */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="card">
          <h2 className="mb-1 text-lg font-bold text-white">Gerar presell validada</h2>
          <p className="mb-5 text-xs text-ink-100/50">
            Preencha, gere e copie o HTML. Pronto para subir no seu domínio neutro.
          </p>

          <div className="space-y-4">
            <div>
              <label className="label">Produto *</label>
              <input
                className="input"
                placeholder="Ex.: ProDentim"
                value={produto}
                onChange={(e) => setProduto(e.target.value)}
                maxLength={80}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Nicho</label>
                <select className="input" value={nicho} onChange={(e) => setNicho(e.target.value as Nicho)}>
                  {NICHOS.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Idioma</label>
                <select className="input" value={idioma} onChange={(e) => setIdioma(e.target.value as Lang)}>
                  {LANGS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Link de afiliado (hoplink)</label>
              <input
                className="input"
                placeholder="https://... ?tid=gads_fundo&subId1={click_id}"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            <div>
              <label className="label">Tipo de página</label>
              <select className="input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                {TIPOS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-100/45">
                {TIPOS.find((t) => t.id === tipo)?.desc}
              </p>
            </div>

            <div>
              <label className="label">Variações para teste A/B</label>
              <div className="flex gap-2">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => setVariacoes(n)}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-bold transition ${
                      variacoes === n
                        ? "border-gold-500 bg-gold-500/15 text-gold-400"
                        : "border-ink-600 text-ink-100/60 hover:border-ink-500"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Público / observação (opcional)</label>
              <input
                className="input"
                placeholder="Ex.: homens 40+ buscando energia"
                value={publico}
                onChange={(e) => setPublico(e.target.value)}
                maxLength={200}
              />
            </div>

            <div>
              <label className="label">Código de tracking (opcional)</label>
              <textarea
                className="input font-mono text-xs"
                rows={3}
                placeholder="<!-- cole aqui pixel/tracker -->"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-100/75">
                <input type="checkbox" checked={ageGate} onChange={(e) => setAgeGate(e.target.checked)} className="h-4 w-4 accent-gold-500" />
                Pop-up de idade
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-100/75">
                <input type="checkbox" checked={cookie} onChange={(e) => setCookie(e.target.checked)} className="h-4 w-4 accent-gold-500" />
                Aviso de cookies
              </label>
            </div>

            <button onClick={gerar} disabled={loading || produto.trim().length < 2} className="btn btn-primary w-full py-3.5">
              {loading ? "Gerando…" : "⚡ Gerar presell com IA"}
            </button>

            {erro && <p className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{erro}</p>}

            {!logged && (
              <p className="text-[11px] leading-relaxed text-ink-100/40">
                <a href="/login" className="link-gold">Entre</a> para salvar suas presells na biblioteca.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* RESULTADOS */}
      <div>
        {!resultado && (
          <div className="card">
            <h3 className="text-lg font-bold text-white">Como funciona</h3>
            <ol className="mt-4 space-y-2.5 text-sm text-ink-100/75">
              <li><strong className="text-gold-400">1.</strong> Informe produto, nicho, link e idioma.</li>
              <li><strong className="text-gold-400">2.</strong> A IA monta a estrutura validada: headline, abertura, benefícios, componentes, passo a passo, prova social, comparação, FAQ, oferta e veredito.</li>
              <li><strong className="text-gold-400">3.</strong> Cada variação recebe um <strong>score de compliance</strong> (Destination Requirements do Google Ads).</li>
              <li><strong className="text-gold-400">4.</strong> Copie o HTML completo (CSS inline) e suba no seu domínio neutro — em menos de 1 minuto.</li>
            </ol>
            <div className="mt-6 rounded-xl border border-ink-600 bg-ink-900/60 p-4 text-sm text-ink-100/70">
              <strong className="text-white">Modo de geração:</strong> com <code className="rounded bg-ink-700 px-1.5 py-0.5 font-mono text-xs text-gold-400">LLM_API_KEY</code> configurada no servidor, a copy é gerada pelo modelo de linguagem. Sem chave, o motor local determinístico gera a mesma estrutura com os pools do nicho.
            </div>
          </div>
        )}

        {resultado && variante && (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {resultado.variantes.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setAtiva(i)}
                  className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
                    ativa === i ? "border-gold-500 bg-gold-500/15 text-gold-400" : "border-ink-600 text-ink-100/60 hover:border-ink-500"
                  }`}
                >
                  Variação {i + 1}
                  <span className="ml-2 text-xs font-normal opacity-70">{v.angulo}</span>
                </button>
              ))}
              <span className={`badge ${resultado.mode === "llm" ? "border-neon-500/50 bg-neon-500/10 text-neon-400" : "border-ink-500 bg-ink-700/60 text-ink-100/60"}`}>
                {resultado.mode === "llm" ? "gerado por LLM" : "motor local"}
              </span>
            </div>

            <div className="card mb-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold leading-snug text-white">{variante.headline}</h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-ink-100/50">
                    <span className="badge-muted">{variante.palavras} palavras</span>
                    <span className="badge-muted">{idioma.toUpperCase()}</span>
                    <span className="badge-muted">{tipo}</span>
                  </div>
                </div>
                <div className={`rounded-2xl border px-5 py-3 text-center ${scoreColor(variante.score)}`}>
                  <div className="text-3xl font-black">{variante.score}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider">compliance</div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={copiarHtml} className="btn btn-primary btn-sm">{copiado ? "✓ HTML copiado" : "Copiar HTML"}</button>
                <button onClick={baixarHtml} className="btn btn-ghost btn-sm">Baixar .html</button>
                <button
                  onClick={() => {
                    const w = window.open("", "_blank");
                    if (w) {
                      w.document.write(variante.html);
                      w.document.close();
                    }
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  Abrir em nova aba
                </button>
                {logged && (
                  <button onClick={salvar} disabled={salvo} className="btn btn-ghost btn-sm">
                    {salvo ? "✓ Salvo na biblioteca" : "Salvar na biblioteca"}
                  </button>
                )}
              </div>
            </div>

            {/* compliance */}
            <div className="card mb-4">
              <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-gold-500">
                Auditoria de compliance — {variante.score}/100
              </h4>
              <ul className="grid gap-2 sm:grid-cols-2">
                {variante.regras.map((r) => (
                  <li
                    key={r.id}
                    className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs ${
                      r.ok ? "border-neon-500/30 bg-neon-500/5 text-neon-400" : "border-red-500/30 bg-red-500/5 text-red-300"
                    }`}
                  >
                    <span className="font-bold">{r.ok ? "✓" : "✗"}</span>
                    <span>
                      <span className="block font-semibold text-ink-100/90">{r.label}</span>
                      {!r.ok && <span className="mt-0.5 block text-ink-100/50">{r.dica}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* preview */}
            <div className="card overflow-hidden p-0">
              <div className="flex items-center justify-between border-b border-ink-600/60 px-4 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-100/50">Preview da página</span>
                <span className="text-[11px] text-ink-100/35">renderizado localmente no seu navegador</span>
              </div>
              <iframe
                ref={iframeRef}
                title="Preview da presell"
                srcDoc={variante.html}
                className="h-[720px] w-full bg-white"
                sandbox="allow-scripts allow-popups allow-forms"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
