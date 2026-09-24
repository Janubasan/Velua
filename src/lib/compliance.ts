// ============================================================
//  COMPLIANCE CHECKER — audita a presell contra
//  Destination Requirements do Google Ads.
// ============================================================

export interface Regra {
  id: string;
  label: string;
  ok: boolean;
  peso: number;
  dica: string;
}

export interface ComplianceResult {
  score: number;
  aprovado: boolean;
  regras: Regra[];
}

function textOf(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function finalize(regras: Regra[]): ComplianceResult {
  const total = regras.reduce((a, r) => a + r.peso, 0);
  const score = regras.reduce((acc, r) => acc + (r.ok ? r.peso : 0), 0);
  return { score, aprovado: score >= 90, regras };
}

export function scoreCompliance(html: string, tipo?: string): ComplianceResult {
  const text = textOf(html);
  const words = text.split(/\s+/).filter(Boolean).length;
  const lower = html.toLowerCase();

  // ---- pop-ups: auditoria própria (não são páginas de conteúdo) ----
  if (tipo === "popup-idade" || tipo === "popup-captcha") {
    const hasButton = /<button[\s\S]*?>|class="yes"/i.test(html);
    const hasLink = /href="https?:\/\//i.test(html);
    const autoRedirect = /setTimeout\([\s\S]{0,80}location|window\.location\.replace|http-equiv="refresh"/i.test(html);
    const textosOk = words >= 25;
    const hasTrackingSlot = /tracking|<!--/i.test(lower) || /script/i.test(html);
    return finalize([
      {
        id: "botao",
        label: "Botão de ação presente",
        ok: hasButton,
        peso: 30,
        dica: "O pop-up precisa de um botão claro de confirmação.",
      },
      {
        id: "link",
        label: "Link de destino válido",
        ok: hasLink,
        peso: 30,
        dica: "Informe o hoplink com subID para o destino do pop-up.",
      },
      {
        id: "redirect",
        label: "Sem redirect automático",
        ok: !autoRedirect,
        peso: 20,
        dica: "O clique no botão é que leva ao destino — nunca redirecione sozinho.",
      },
      {
        id: "textos",
        label: "Textos completos no idioma",
        ok: textosOk,
        peso: 10,
        dica: "Confira se todos os textos do pop-up estão preenchidos.",
      },
      {
        id: "trackeamento",
        label: "Slot de trackeamento disponível",
        ok: hasTrackingSlot,
        peso: 10,
        dica: "Use o campo de código de tracking para injetar pixel no pop-up.",
      },
    ]);
  }

  // ---- páginas de conteúdo (review / robusta / advertorial) ----
  const faqCount = (html.match(/<details>/gi) || []).length;
  const testiCount = (html.match(/class="testi"/gi) || []).length;
  const ctaCount = (html.match(/class="cta cta-/gi) || []).length;
  const hasDisclosure = /disclosure|divulga|offenlegung|divulgaci/i.test(text);
  const hasDisclaimer = /disclaimer|aviso|hinweis/i.test(text);
  const hasCompare = /<table>[\s\S]*?<\/table>/i.test(html) && /compar|vergleich/i.test(text);
  const hasSponsored = /rel="sponsored nofollow noopener"/i.test(html);
  const h1Match = html.match(/<h1>([\s\S]*?)<\/h1>/i);
  const hasH1 = !!h1Match && h1Match[1].trim().length > 15;
  const autoRedirect = /setTimeout\([\s\S]{0,80}location|window\.location\.replace|http-equiv="refresh"/i.test(html);

  const regras: Regra[] = [
    {
      id: "palavras",
      label: `Conteúdo original (600+ palavras) — atual: ${words}`,
      ok: words >= 600,
      peso: 25,
      dica: "Adicione seções: review detalhada, comparação e FAQ. Use o tipo 'Robusta' no gerador.",
    },
    {
      id: "disclosure",
      label: "Affiliate disclosure visível",
      ok: hasDisclosure,
      peso: 10,
      dica: "Inclua aviso de comissão no rodapé, acima da dobra.",
    },
    {
      id: "disclaimer",
      label: "Disclaimer de produto",
      ok: hasDisclaimer,
      peso: 10,
      dica: "Em saúde, use disclaimer de estrutura/função (FDA).",
    },
    {
      id: "faq",
      label: `FAQ com 5+ perguntas — atual: ${faqCount}`,
      ok: faqCount >= 5,
      peso: 10,
      dica: "Responda objeções reais: prazo, garantia, quem não deve usar.",
    },
    {
      id: "comparacao",
      label: "Tabela de comparação",
      ok: hasCompare,
      peso: 10,
      dica: "Compare com 2 alternativas do nicho em critérios honestos.",
    },
    {
      id: "prova",
      label: `Prova social (3+ depoimentos) — atual: ${testiCount}`,
      ok: testiCount >= 3,
      peso: 10,
      dica: "Depoimentos identificáveis com resultado específico.",
    },
    {
      id: "cta",
      label: `CTAs claros (2+) — atual: ${ctaCount}`,
      ok: ctaCount >= 2,
      peso: 10,
      dica: "Botão principal + botão secundário, sempre com contexto.",
    },
    {
      id: "h1",
      label: "Headline H1 específica",
      ok: hasH1,
      peso: 5,
      dica: "Headline deve citar o produto e a promessa.",
    },
    {
      id: "redirect",
      label: "Sem redirect automático",
      ok: !autoRedirect,
      peso: 5,
      dica: "Nunca redirecione automaticamente: quebra a trilha e reprova.",
    },
    {
      id: "sponsored",
      label: "Links com rel sponsored/nofollow",
      ok: hasSponsored,
      peso: 5,
      dica: "Todo link de afiliado precisa de rel=sponsored nofollow.",
    },
  ];

  return finalize(regras);
}
