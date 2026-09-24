// ============================================================
//  FLOW ENGINE — motor de geração de presells
//  Estrutura validada (review/robusta/advertorial) + pop-ups.
//  Funciona em modo LOCAL (determinístico) ou via LLM.
// ============================================================

import { dict, pool, type Lang, type Nicho } from "./copy";
import { scoreCompliance } from "./compliance";

export interface PresellInput {
  produto: string;
  nicho: Nicho;
  link: string;
  idioma: Lang;
  tipo: "review" | "robusta" | "advertorial" | "popup-idade" | "popup-captcha";
  variacoes: number;
  publico?: string;
  trackingCode?: string;
  ageGate?: boolean;
  cookieBanner?: boolean;
}

export interface Conteudo {
  headline: string;
  angulo: string;
  opening: string[];
  whatIs: string;
  benefits: [string, string][];
  components: [string, string][];
  howTo: string[];
  testimonials: { name: string; city: string; text: string }[];
  comparison: { cols: string[]; rows: string[][] };
  faq: [string, string][];
  offerBody: string;
  verdict: { pros: string[]; cons: string[] };
  ctaPrimary: string;
  ctaSecondary: string;
}

const HEADLINES: Record<Lang, [string, string, string]> = {
  pt: [
    "{badge}: review completo de {p} — o que funciona, para quem é e nosso veredito",
    "Eu já tinha tentado de tudo antes de testar {p} — o que mudou em 30 dias",
    "{p} vs alternativas: comparativo honesto com prós, contras e preços",
  ],
  en: [
    "{badge}: full {p} review — what works, who it's for, and our verdict",
    "I had tried everything before testing {p} — what changed in 30 days",
    "{p} vs alternatives: an honest comparison with pros, cons and pricing",
  ],
  es: [
    "{badge}: review completo de {p} — qué funciona, para quién es y nuestro veredicto",
    "Ya lo había probado todo antes de testar {p} — lo que cambió en 30 días",
    "{p} vs alternativas: comparativa honesta con pros, contras y precios",
  ],
  de: [
    "{badge}: vollständiges {p} Review — was funktioniert, für wen es ist und unser Fazit",
    "Ich hatte alles probiert, bevor ich {p} testete — was sich in 30 Tagen änderte",
    "{p} vs Alternativen: ehrlicher Vergleich mit Stärken, Schwächen und Preisen",
  ],
};

const ANGULOS = ["Autoridade / Review", "História / Advertorial", "Dados / Comparação"];

// ---------- util ----------
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedOf(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(arr: T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)];
}

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeLink(link: string): string {
  const l = (link || "").trim();
  if (/^https?:\/\//i.test(l)) return l;
  return "#cta";
}

// ---------- conteúdo LOCAL ----------
export function buildConteudoLocal(input: PresellInput, variante: number): Conteudo {
  const d = dict(input.idioma);
  const p = pool(input.idioma, input.nicho);
  const rnd = mulberry32(seedOf(`${input.produto}|${input.idioma}|${input.nicho}|${input.tipo}|${variante}`));
  const produto = input.produto.trim() || "Produto";

  const headline = HEADLINES[input.idioma][variante % 3]
    .replace("{badge}", d.badge)
    .replace("{p}", produto);

  const opening = d.opening.map((t) => t.replace(/\{p\}/g, produto));

  const nBenefits = input.tipo === "robusta" ? p.beneficios.length : Math.max(3, p.beneficios.length - 1);
  const benefits = shuffle(p.beneficios, rnd).slice(0, nBenefits) as [string, string][];
  const components = shuffle(p.componentes, rnd).slice(0, 5) as [string, string][];
  const howTo = shuffle(p.passos, rnd);
  const pros = p.pros;
  const cons = p.contras;

  const nTest = input.tipo === "robusta" ? 4 : 3;
  const names = shuffle(d.names, rnd).slice(0, nTest);
  const cities = shuffle(d.cities, rnd);
  const testTexts = shuffle(d.testimonials(produto), rnd);
  const testimonials = names.map((name, i) => ({
    name,
    city: cities[i % cities.length],
    text: testTexts[i % testTexts.length],
  }));

  const faqAll = d.faq(produto);
  const faq = input.tipo === "robusta" ? faqAll : faqAll.slice(0, 5);

  const cols = d.compareCols.map((c) => c.replace("{p}", produto));
  const criterios: Record<Nicho, string[][]> = {
    saude: [
      ["Componentes", "5 ativos reconhecidos", "2 ativos", "1 ativo"],
      ["Uso diário", "Simples, 1x ao dia", "3x ao dia", "2x ao dia"],
      ["Garantia", "do fabricante", "30 dias", "sem garantia"],
      ["Custo por mês", "competitivo", "alto", "médio"],
    ],
    beleza: [
      ["Textura", "leve, absorção rápida", "pesada", "oleosa"],
      ["Ativos", "5 comprovados", "2", "1"],
      ["Uso", "manhã e noite", "somente noite", "1x por semana"],
      ["Custo", "acessível", "premium", "baixo"],
    ],
    financas: [
      ["Anuidade", "conforme pacote", "alta", "média"],
      ["Aprovação", "facilitada", "rígida", "média"],
      ["Cashback", "sim", "não", "parcial"],
      ["App", "completo", "básico", "médio"],
    ],
    idiomas: [
      ["Método", "validado", "tradicional", "autodidata"],
      ["Professores", "nativos", "locais", "sem professor"],
      ["Certificado", "sim", "sim", "não"],
      ["Acesso", "vitalício", "12 meses", "1 mês"],
    ],
    geral: [
      ["Facilidade", "alto", "médio", "baixo"],
      ["Suporte", "incluído", "limitado", "sem suporte"],
      ["Custo-benefício", "alto", "médio", "baixo"],
      ["Atualizações", "constantes", "raras", "nenhuma"],
    ],
  };
  const rows = criterios[input.nicho] ?? criterios.geral;

  return {
    headline,
    angulo: ANGULOS[variante % 3],
    opening,
    whatIs: d.whatIsBody(produto),
    benefits,
    components,
    howTo,
    testimonials,
    comparison: { cols, rows },
    faq,
    offerBody: d.offerBody(produto),
    verdict: { pros, cons },
    ctaPrimary: d.ctaPrimary,
    ctaSecondary: d.ctaSecondary,
  };
}

// ---------- render HTML ----------
function ctaButton(label: string, link: string, primary = true): string {
  return `<a class="cta ${primary ? "cta-main" : "cta-alt"}" href="${esc(link)}" rel="sponsored nofollow noopener" target="_blank">${esc(label)}</a>`;
}

function renderPresell(input: PresellInput, c: Conteudo): string {
  const d = dict(input.idioma);
  const link = safeLink(input.link);
  const langAttr = input.idioma;
  const publico = input.publico?.trim();

  const benefitsHtml = c.benefits
    .map(
      ([t, x]) => `<div class="ben"><h4>${esc(t)}</h4><p>${esc(x)}</p></div>`
    )
    .join("\n");

  const compRows = c.components
    .map(([n, u]) => `<tr><td><strong>${esc(n)}</strong></td><td>${esc(u)}</td></tr>`)
    .join("\n");

  const howHtml = c.howTo
    .map((s, i) => `<li><span class="stepnum">${i + 1}</span><span>${esc(s)}</span></li>`)
    .join("\n");

  const testHtml = c.testimonials
    .map(
      (t) => `<div class="testi"><p class="stars">★★★★★</p><p>"${esc(t.text)}"</p><p class="who">— ${esc(t.name)}, ${esc(t.city)}</p></div>`
    )
    .join("\n");

  const cmpCols = c.comparison.cols.map((x) => `<th>${esc(x)}</th>`).join("");
  const cmpRows = c.comparison.rows
    .map((r) => `<tr>${r.map((cell, i) => (i === 0 ? `<td><strong>${esc(cell)}</strong></td>` : `<td>${esc(cell)}</td>`)).join("")}</tr>`)
    .join("\n");

  const faqHtml = c.faq
    .map(
      ([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`
    )
    .join("\n");

  const prosHtml = c.verdict.pros.map((x) => `<li>${esc(x)}</li>`).join("");
  const consHtml = c.verdict.cons.map((x) => `<li>${esc(x)}</li>`).join("");

  const openingHtml = c.opening.map((x) => `<p>${esc(x)}</p>`).join("\n");

  const videoBlock =
    input.tipo === "robusta"
      ? `<section id="video"><h2>Assista antes de decidir</h2><div class="videobox"><div class="play">▶</div><p>Vídeo de apresentação — carregado sob demanda para não travar sua página.</p></div></section>`
      : "";

  const tracking = input.trackingCode?.trim()
    ? `\n  <!-- Código de tracking (Flow Engine) -->\n  ${input.trackingCode.trim()}`
    : "";

  const ageGateHtml = input.ageGate
    ? `
  <div id="agegate" class="gate">
    <div class="gate-box">
      <h2>${esc(d.ageGate.title)}</h2>
      <p>${esc(d.ageGate.text)}</p>
      <div class="gate-btns">
        <button onclick="document.getElementById('agegate').style.display='none'">${esc(d.ageGate.yes)}</button>
        <a href="about:blank">${esc(d.ageGate.no)}</a>
      </div>
    </div>
  </div>`
    : "";

  const cookieHtml = input.cookieBanner
    ? `
  <div id="cookie" class="cookie">
    <p>${esc(d.cookie.text)}</p>
    <button onclick="localStorage.setItem('adag_ok','1');document.getElementById('cookie').style.display='none'">${esc(d.cookie.accept)}</button>
  </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="${langAttr}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(c.headline)}</title>
  <meta name="description" content="${esc(c.whatIs.slice(0, 155))}">${tracking}
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#f6f7f9;color:#1b1e24;line-height:1.65}
    .wrap{max-width:760px;margin:0 auto;padding:24px 18px 60px}
    .badge{display:inline-block;background:#111827;color:#ffd166;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:6px 12px;border-radius:999px;margin-bottom:16px}
    h1{font-size:32px;line-height:1.2;margin-bottom:14px;color:#0f1115}
    h2{font-size:22px;margin:36px 0 12px;color:#0f1115}
    h3{font-size:17px;margin:18px 0 8px}
    p{margin-bottom:12px;font-size:16.5px;color:#33383f}
    section{margin-bottom:8px}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin:14px 0}
    .ben{background:#fff;border:1px solid #e6e8ec;border-radius:12px;padding:16px}
    .ben h4{font-size:15.5px;margin-bottom:6px;color:#0f1115}
    .ben p{font-size:14.5px;margin:0;color:#4a5058}
    table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;margin:14px 0;font-size:14.5px}
    th{background:#111827;color:#fff;text-align:left;padding:10px 12px;font-size:13.5px}
    td{padding:10px 12px;border-bottom:1px solid #eceef2;vertical-align:top}
    tr:last-child td{border-bottom:none}
    .steps{list-style:none;margin:14px 0}
    .steps li{display:flex;gap:12px;align-items:flex-start;background:#fff;border:1px solid #e6e8ec;border-radius:10px;padding:12px 14px;margin-bottom:8px}
    .stepnum{flex:0 0 26px;height:26px;background:#ffd166;color:#111827;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px}
    .testi{background:#fff;border:1px solid #e6e8ec;border-radius:12px;padding:16px;margin-bottom:12px}
    .stars{color:#f5b942;letter-spacing:2px;margin-bottom:6px}
    .who{font-size:13.5px;color:#6b7280;margin:8px 0 0}
    details{background:#fff;border:1px solid #e6e8ec;border-radius:10px;padding:12px 14px;margin-bottom:8px}
    summary{cursor:pointer;font-weight:600;font-size:15px}
    details p{margin-top:8px;font-size:14.5px;color:#4a5058}
    .offer{background:linear-gradient(135deg,#111827,#1f2937);color:#fff;border-radius:16px;padding:24px;margin:20px 0}
    .offer h2{color:#ffd166;margin-top:0}
    .offer p{color:#d7dbe2}
    .cta{display:block;text-align:center;background:#f5b942;color:#111827;font-weight:800;font-size:17px;padding:16px;border-radius:12px;text-decoration:none;margin:12px 0;transition:transform .15s}
    .cta:hover{transform:translateY(-2px)}
    .cta-alt{background:#fff;color:#111827;border:2px solid #111827;font-size:15px}
    .cta-note{font-size:13px;color:#9aa1ab;text-align:center;margin-top:6px}
    .verdict{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .verdict div{background:#fff;border:1px solid #e6e8ec;border-radius:12px;padding:16px}
    .verdict h3{margin-top:0}
    .verdict ul{padding-left:18px;font-size:14.5px;color:#4a5058}
    .videobox{background:#0f1115;border-radius:12px;aspect-ratio:16/9;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#8b929c;gap:10px}
    .play{font-size:42px;color:#ffd166}
    footer{margin-top:40px;padding-top:20px;border-top:1px solid #e6e8ec;font-size:12.5px;color:#7a818b}
    footer p{margin-bottom:8px;font-size:12.5px;color:#7a818b}
    .gate{position:fixed;inset:0;background:rgba(8,10,14,.92);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px}
    .gate-box{background:#fff;border-radius:16px;max-width:420px;width:100%;padding:28px;text-align:center}
    .gate-box h2{margin:0 0 10px}
    .gate-box p{font-size:14.5px;color:#4a5058}
    .gate-btns{margin-top:18px;display:flex;flex-direction:column;gap:10px}
    .gate-btns button{background:#111827;color:#fff;border:none;padding:14px;border-radius:10px;font-weight:700;cursor:pointer}
    .gate-btns a{color:#6b7280;font-size:13.5px}
    .cookie{position:fixed;left:16px;right:16px;bottom:16px;background:#111827;color:#fff;border-radius:12px;padding:14px 16px;display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap;z-index:9998}
    .cookie p{margin:0;font-size:13.5px;color:#d7dbe2;flex:1;min-width:220px}
    .cookie button{background:#ffd166;color:#111827;border:none;padding:10px 16px;border-radius:8px;font-weight:700;cursor:pointer;white-space:nowrap}
    @media(max-width:600px){h1{font-size:26px}.verdict{grid-template-columns:1fr}}
  </style>
</head>
<body>${ageGateHtml}
  <div class="wrap">
    <span class="badge">${esc(d.badge)}</span>
    <h1>${esc(c.headline)}</h1>
    ${publico ? `<p style="font-size:14px;color:#6b7280"><em>${esc(publico)}</em></p>` : ""}
    <section id="abertura">${openingHtml}</section>
    <section id="o-que-e"><h2>${esc(d.whatIsTitle.replace("{p}", input.produto))}</h2><p>${esc(c.whatIs)}</p></section>
    <section id="beneficios"><h2>${esc(d.benefitsTitle)}</h2><div class="grid">${benefitsHtml}</div></section>
    <section id="componentes"><h2>${esc(input.idioma === "pt" ? "Componentes / Ingredientes" : input.idioma === "en" ? "Components / Ingredients" : input.idioma === "es" ? "Componentes / Ingredientes" : "Komponenten / Inhaltsstoffe")}</h2>
      <table><thead><tr><th>${esc(input.idioma === "pt" ? "Componente" : input.idioma === "en" ? "Component" : input.idioma === "es" ? "Componente" : "Komponente")}</th><th>${esc(input.idioma === "pt" ? "Para que serve" : input.idioma === "en" ? "What it does" : input.idioma === "es" ? "Para qué sirve" : "Wirkung")}</th></tr></thead><tbody>${compRows}</tbody></table>
    </section>
    <section id="como-usar"><h2>${esc(d.howToTitle)}</h2><ul class="steps">${howHtml}</ul></section>
    <section id="cta-1"><h2>${esc(d.verdictTitle)}</h2>${ctaButton(c.ctaPrimary, link, true)}<p class="cta-note">${esc(d.ctaNote)}</p></section>
    ${videoBlock}
    <section id="prova"><h2>${esc(d.proofTitle)}</h2><p style="font-size:13.5px;color:#6b7280">${esc(d.proofNote)}</p>${testHtml}</section>
    <section id="comparacao"><h2>${esc(d.compareTitle)}</h2>
      <table><thead><tr>${cmpCols}</tr></thead><tbody>${cmpRows}</tbody></table>
    </section>
    <section id="veredito"><h2>${esc(d.verdictTitle)}</h2>
      <div class="verdict">
        <div><h3>${esc(d.prosTitle)}</h3><ul>${prosHtml}</ul></div>
        <div><h3>${esc(d.consTitle)}</h3><ul>${consHtml}</ul></div>
      </div>
    </section>
    <section id="faq"><h2>${esc(d.faqTitle)}</h2>${faqHtml}</section>
    <section id="oferta" class="offer">
      <h2>${esc(d.offerTitle)}</h2>
      <p>${esc(c.offerBody)}</p>
      <p style="font-size:14px;color:#ffd166">✔ ${esc(d.guarantee)}</p>
      ${ctaButton(c.ctaPrimary, link, true)}
      ${ctaButton(c.ctaSecondary, link, false)}
      <p class="cta-note" style="color:#9aa1ab">${esc(d.ctaNote)}</p>
    </section>
    <footer>
      <p>${esc(d.disclosure)}</p>
      <p>${esc(d.disclaimer)}</p>
      <p>${esc(d.footerNote)}</p>
    </footer>
  </div>${cookieHtml}
</body>
</html>`;
}

const TERMS: Record<Lang, string> = {
  pt: "Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade. Esta página pode receber comissão por compras realizadas através dos nossos links, sem custo adicional para você.",
  en: "By continuing, you agree to our Terms of Use and Privacy Policy. This page may earn a commission on purchases made through our links, at no additional cost to you.",
  es: "Al continuar, aceptas nuestros Términos de Uso y Política de Privacidad. Esta página puede recibir una comisión por compras a través de nuestros enlaces, sin costo adicional para ti.",
  de: "Mit dem Fortfahren stimmst du unseren Nutzungsbedingungen und der Datenschutzerklärung zu. Diese Seite kann Provisionen für Käufe über unsere Links erhalten — ohne Mehrkosten für dich.",
};

// ---------- pop-ups standalone ----------
function renderAgeGate(input: PresellInput): string {
  const d = dict(input.idioma);
  const link = safeLink(input.link);
  return `<!DOCTYPE html>
<html lang="${input.idioma}">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(d.ageGate.title)}</title>${input.trackingCode?.trim() ? `\n${input.trackingCode.trim()}` : ""}
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,"Segoe UI",Roboto,sans-serif;background:linear-gradient(135deg,#0f1115,#1f2937);color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
  .box{background:#fff;color:#1b1e24;border-radius:20px;max-width:440px;width:100%;padding:36px 28px;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.5)}
  .icon{font-size:44px;margin-bottom:12px}
  h1{font-size:24px;margin-bottom:10px}
  p{color:#4a5058;font-size:15px;margin-bottom:22px}
  .btns{display:flex;flex-direction:column;gap:12px}
  .yes{display:block;background:#111827;color:#fff;border:none;padding:16px;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;text-align:center;text-decoration:none}
  .no{display:block;margin-top:12px;color:#6b7280;font-size:13.5px;text-decoration:none}
  .brand{margin-top:22px;font-size:12px;color:#9aa1ab}
  .terms{margin-top:16px;font-size:11px;color:#9aa1ab;line-height:1.5}
</style>
</head>
<body>
  <div class="box">
    <div class="icon">🔞</div>
    <h1>${esc(d.ageGate.title)}</h1>
    <p>${esc(d.ageGate.text)}</p>
    <div class="btns">
      <a class="yes" href="${esc(link)}" rel="sponsored nofollow noopener">${esc(d.ageGate.yes)}</a>
      <a class="no" href="about:blank">${esc(d.ageGate.no)}</a>
    </div>
    <div class="brand">${esc(input.produto)}</div>
    <div class="terms">${esc(TERMS[input.idioma])}</div>
  </div>
  <script>
    // memoriza a confirmação para não repetir a verificação no mesmo navegador
    document.querySelector('.yes').addEventListener('click', function () {
      try { localStorage.setItem('adag_age_ok', '1'); } catch (e) {}
    });
  </script>
</body>
</html>`;
}

function renderCaptcha(input: PresellInput): string {
  const d = dict(input.idioma);
  const link = safeLink(input.link);
  const T: Record<Lang, { title: string; text: string; btn: string; no: string }> = {
    pt: { title: "Verificação de segurança", text: "Confirme que você é humano para continuar.", btn: "Verificar e continuar", no: "Sair" },
    en: { title: "Security check", text: "Please confirm you are human to continue.", btn: "Verify and continue", no: "Exit" },
    es: { title: "Verificación de seguridad", text: "Confirma que eres humano para continuar.", btn: "Verificar y continuar", no: "Salir" },
    de: { title: "Sicherheitsprüfung", text: "Bitte bestätige, dass du ein Mensch bist, um fortzufahren.", btn: "Prüfen und fortfahren", no: "Beenden" },
  };
  const t = T[input.idioma];
  return `<!DOCTYPE html>
<html lang="${input.idioma}">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(t.title)}</title>${input.trackingCode?.trim() ? `\n${input.trackingCode.trim()}` : ""}
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,"Segoe UI",Roboto,sans-serif;background:#f6f7f9;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
  .box{background:#fff;border:1px solid #e6e8ec;border-radius:16px;max-width:420px;width:100%;padding:32px 28px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.08)}
  .icon{font-size:40px;margin-bottom:10px}
  h1{font-size:22px;margin-bottom:8px;color:#0f1115}
  p{color:#4a5058;font-size:14.5px;margin-bottom:20px}
  .check{display:flex;align-items:center;gap:10px;border:1px solid #e6e8ec;border-radius:10px;padding:14px;margin-bottom:16px;cursor:pointer;user-select:none}
  .box-c{width:22px;height:22px;border:2px solid #c9ced6;border-radius:6px;flex:0 0 22px}
  .check.on .box-c{background:#22c55e;border-color:#22c55e}
  .check.on .box-c::after{content:"✓";color:#fff;font-weight:800;display:block;text-align:center;line-height:18px;font-size:13px}
  .yes{display:block;width:100%;background:#111827;color:#fff;border:none;padding:15px;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;opacity:.4;text-align:center;text-decoration:none}
  .yes.on{opacity:1}
  .no{display:block;margin-top:14px;color:#6b7280;font-size:13px;text-decoration:none}
  .terms{margin-top:16px;font-size:11px;color:#9aa1ab;line-height:1.5}
</style>
</head>
<body>
  <div class="box">
    <div class="icon">🛡️</div>
    <h1>${esc(t.title)}</h1>
    <p>${esc(t.text)}</p>
    <div class="check" id="c" onclick="toggle()"><div class="box-c"></div><span>${esc(input.idioma === "pt" ? "Não sou um robô" : input.idioma === "en" ? "I am not a robot" : input.idioma === "es" ? "No soy un robot" : "Ich bin kein Roboter")}</span></div>
    <a class="yes" id="b" href="${esc(link)}" rel="sponsored nofollow noopener" onclick="if(!ok){event.preventDefault();toggle();return false;}">${esc(t.btn)}</a>
    <a class="no" href="about:blank">${esc(t.no)}</a>
    <div class="terms">${esc(TERMS[input.idioma])}</div>
  </div>
  <script>
    var ok=false;
    function toggle(){ok=!ok;document.getElementById('c').classList.toggle('on',ok);document.getElementById('b').classList.toggle('on',ok);}
    function go(){if(ok){window.location.href='${esc(link)}';}}
  </script>
</body>
</html>`;
}

// ---------- API principal ----------
export interface VarianteGerada {
  headline: string;
  angulo: string;
  palavras: number;
  score: number;
  html: string;
}

export function gerarPresell(
  input: PresellInput,
  conteudos?: (Conteudo | null)[]
): { variantes: VarianteGerada[]; mode: "local" | "llm" } {
  const variantes: VarianteGerada[] = [];
  let mode: "local" | "llm" = "local";

  for (let i = 0; i < input.variacoes; i++) {
    let c = conteudos?.[i];
    if (c) mode = "llm";
    if (!c) c = buildConteudoLocal(input, i);

    const html =
      input.tipo === "popup-idade"
        ? renderAgeGate(input)
        : input.tipo === "popup-captcha"
          ? renderCaptcha(input)
          : renderPresell(input, c);

    const text = html
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<[^>]+>/g, " ");
    const palavras = text.split(/\s+/).filter(Boolean).length;

    variantes.push({
      headline: c.headline,
      angulo: c.angulo,
      palavras,
      score: scoreCompliance(html, input.tipo).score,
      html,
    });
  }

  return { variantes, mode };
}
