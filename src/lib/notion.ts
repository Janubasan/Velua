// ============================================================
//  TEMPLATE NOTION — exportação em CSV (importável direto
//  no Notion como database) + guia mestre em Markdown.
// ============================================================

import { negativasBase } from "@/content/dados";

function toCsv(headers: string[], rows: (string | number)[][]): string {
  const esc = (v: string | number) => {
    const s = String(v ?? "");
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
}

export interface ArquivoExport {
  nome: string;
  conteudo: string;
}

export function buildNotionExports(): ArquivoExport[] {
  const arquivos: ArquivoExport[] = [];

  // ---- Ofertas ----
  arquivos.push({
    nome: "01-ofertas.csv",
    conteudo: toCsv(
      [
        "Nome",
        "Nicho",
        "Rede",
        "Hoplink + subID",
        "Preço front",
        "Comissão %",
        "Comissão líquida USD",
        "EPC",
        "Conversão checkout",
        "Gravity",
        "AOV bundle",
        "Volume buscas",
        "Concorrência SERP",
        "Restrição de marca",
        "Pagamento",
        "Score",
        "Status",
      ],
      [
        ["VigorX Pro", "Saúde", "BuyGoods", "https://hop...?tid=gads_fundo&subId1={click_id}", 147, 60, 88.2, 3.81, 0.535, "", "", 2400, 32, "review-only", "3x por semana", 92, "Validada"],
        ["ProDentim", "Saúde dental", "Digistore24", "https://hop...?tid=gads_fundo&subId1={click_id}", 99, 75, 74.25, 3.2, 0.024, 187, 210, 3600, 28, "review-only", "Semanal", 88, "Validada"],
        ["Oferta C (exemplo)", "Finanças", "Digistore24", "https://hop...?tid=gads_fundo&subId1={click_id}", 79, 70, 55.3, 2.1, 0.019, 96, 130, 1400, 38, "presell review obrigatório", "Semanal", 74, "Em teste"],
      ]
    ),
  });

  // ---- Campanhas ----
  arquivos.push({
    nome: "02-campanhas.csv",
    conteudo: toCsv(
      [
        "Nome",
        "Oferta",
        "Tipo",
        "Orçamento/dia",
        "CPC médio",
        "CTR",
        "Impressões",
        "Cliques",
        "Conversões",
        "CPA",
        "ROAS",
        "CPA alvo",
        "Status",
        "Próxima ação",
        "Revisão search terms",
      ],
      [
        ["GADS | VigorX | SKAG review", "VigorX Pro", "SKAG", 20, 0.92, 0.041, 820, 34, 2, 17.0, 5.18, 48, "Ativa", "Aumentar 20% (2 conversões no alvo)", "2026-09-27"],
        ["GADS | ProDentim | STAG bundle", "ProDentim", "STAG", 35, 1.12, 0.028, 1600, 45, 3, 11.7, 6.35, 40, "Ativa", "Subir bundle de 6 quando ROAS > 1.5", "2026-09-27"],
      ]
    ),
  });

  // ---- Negativas (lista completa 120+) ----
  arquivos.push({
    nome: "03-negativas-homonimas.csv",
    conteudo: toCsv(
      ["Termo", "Tipo", "Match", "Motivo", "Aplicar em", "Data"],
      negativasBase.map((n) => [n.termo, n.tipo, "negativa exata/frase", n.motivo, "Lista compartilhada (todas as campanhas)", "2026-09-24"])
    ),
  });

  // ---- Tracking ----
  arquivos.push({
    nome: "04-tracking.csv",
    conteudo: toCsv(
      [
        "click_id",
        "gclid",
        "subID",
        "Rede",
        "Postback URL",
        "Token",
        "transaction ID",
        "Status",
        "Match rate",
        "Data",
      ],
      [
        [
          "clk_8f2a91",
          "Cj0KCQjw...",
          "subId1",
          "BuyGoods",
          "https://track.seudominio.com/postback?pid={click_id}&payout={payout}&txid={transaction_id}&status={status}",
          "{externalID}",
          "tx_55021",
          "approved",
          0.94,
          "2026-09-24",
        ],
        [
          "clk_91b2c7",
          "Cj0KCQjw...",
          "subId1",
          "Digistore24",
          "https://track.seudominio.com/postback?pid={click_id}&payout={payout}&txid={transaction_id}&status={status}",
          "{click_id}",
          "tx_55022",
          "pending",
          0.91,
          "2026-09-24",
        ],
      ]
    ),
  });

  // ---- Presells ----
  arquivos.push({
    nome: "05-presells.csv",
    conteudo: toCsv(
      ["URL", "Oferta", "Tipo", "Idioma", "Compliance score", "Variação", "Status", "Data"],
      [
        ["https://healthinsightsdaily.com/vigorx", "VigorX Pro", "Review", "en", 95, "A — Autoridade", "Publicada", "2026-09-24"],
        ["https://healthinsightsdaily.com/prodentim", "ProDentim", "Robusta", "en", 100, "C — Dados", "Publicada", "2026-09-24"],
      ]
    ),
  });

  // ---- Rotina 15min ----
  arquivos.push({
    nome: "06-rotina-15min.csv",
    conteudo: toCsv(
      [
        "Data",
        "Impressões = 0?",
        "CTR < 2%?",
        "CPC estourou?",
        "1,5x CPA sem conversão?",
        "ROAS > 1,5?",
        "Search terms revisado?",
        "Match rate ≥ 90%?",
        "Diagnóstico",
        "Ação tomada",
        "Resultado",
      ],
      [
        ["2026-09-24", "Não", "Não", "Não", "Não", "Sim", "Sim", "Sim", "ROAS acima da meta", "Aumento de 20% no orçamento", "Aguardando 48h"],
        ["2026-09-23", "Não", "Sim", "Não", "Sim", "Não", "Sim", "Sim", "Grupo STAG sem conversão em 1,5x CPA", "Grupo pausado + nova RSA", "Nova RSA em teste"],
      ]
    ),
  });

  // ---- Guia mestre ----
  arquivos.push({
    nome: "00-GUIA-NOTION.md",
    conteudo: `# O Melhor Amigo do Afiliado — Template Notion (Mina de Tesouro)

> Importe cada CSV como **database** no Notion (Novo → Importar → CSV). Depois crie uma página mestre e relacione os bancos.

## Bancos deste template
1. **01-ofertas.csv** — prospecção com score 0–100 (corte: ≥ 70).
2. **02-campanhas.csv** — controle de campanha, CPA alvo e ROAS.
3. **03-negativas-homonimas.csv** — lista base ${negativasBase.length} termos (compartilhe em todas as campanhas).
4. **04-tracking.csv** — engenharia de atribuição (click_id → gclid → postback).
5. **05-presells.csv** — biblioteca de páginas geradas e score de compliance.
6. **06-rotina-15min.csv** — checklist diário com regras de decisão.

## Fórmula do Score de Ofertas (0–100)
- EPC (30): ≥$3,00 = 30 | ≥$2,00 = 20 | <$2,00 = 0
- Conversão checkout (20): >40% = 20 | >2% = 10 | <2% = 0
- Comissão (15): ≥$100 = 15 | ≥$50 = 10 | <$50 = 0
- Gravity (15): top 3 nicho = 15 | top 10 = 8 | fora = 0
- SERP (10): <20 concorrentes = 10 | <40 = 6 | ≥40 = 0
- Marca (10): livre = 10 | review-only = 6 | proibida = 0

## Regras de gestão embutidas
- Pausar grupo com 1x CPA alvo gasto sem conversão.
- Matar keyword com 2x CPA sem conversão.
- Aumentar orçamento 20% a cada 2 conversões no alvo.
- ROAS > 1,5 = escala | IS perdido por orçamento > 30% = aumentar 20%.
- Match rate do postback < 90% = consertar tracking antes de julgar oferta.

## Fluxo de atribuição (referência rápida)
1. Clique no anúncio → gclid na URL da presell.
2. Clique no CTA → tracker gera click_id.
3. Hoplink carrega click_id no subID da rede.
4. Compra no merchant → rede segura click_id.
5. Rede dispara postback → tracker casa sessão e recupera gclid.
6. Tracker envia conversão ao Google Ads Conversion API (dedup por transaction ID).
`,
  });

  return arquivos;
}
