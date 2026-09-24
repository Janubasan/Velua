// ============================================================
//  CONTEÚDO DO CURSO — PARTE 1 (FASES 1 a 3)
//  "Amigo do Afiliado na Gringa" — Mina de Tesouro
// ============================================================

export type TipoAula = "aula" | "sop" | "checklist" | "template" | "metricas";

export interface Aula {
  slug: string;
  titulo: string;
  tipo: TipoAula;
  duracao: string;
  objetivo: string;
  conteudo: string; // markdown
  passos?: string[];
  checklist?: string[];
  quickWin?: string;
  erros?: { erro: string; correcao: string }[];
}

export interface Fase {
  slug: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  objetivo: string;
  duracao: string;
  icone: string;
  entregavel: string;
  aulas: Aula[];
}

const fase1: Fase = {
  slug: "mineracao",
  numero: 1,
  titulo: "Mineração e Validação de Ofertas com Baixo Risco",
  subtitulo: "Escolher a oferta certa é 80% do resultado. Aqui você não aposta: você filtra.",
  objetivo:
    "Sair do zero com uma oferta validada por dados (EPC, conversão de checkout, gravity, payout) e não por achismo, usando critérios de corte que protegem a banca de quem está começando com $20/dia.",
  duracao: "1h 40min",
  icone: "⛏️",
  entregavel: "Template Notion/Planilha de Ofertas preenchido com 3 ofertas validadas + score de aprovação.",
  aulas: [
    {
      slug: "tres-gargalos",
      titulo: "Os 3 gargalos que quebram a banca do iniciante",
      tipo: "aula",
      duracao: "14 min",
      objetivo:
        "Entender por que afiliado iniciante queima dinheiro mesmo com oferta boa — e qual sistema resolve cada gargalo.",
      conteudo: `Antes de falar de oferta, campanha ou página, você precisa entender **onde o iniciante quebra**. Não é falta de talento. É falta de sistema. Levantamento de campo com afiliados que operam BuyGoods, Digistore24 e ClickBank mostra que 100% das bancas quebradas nos primeiros 90 days têm os mesmos três buracos:

## Gargalo 1 — Tracking cego (o mais caro)
O afiliado **não controla o checkout do merchant**. Você não pode instalar a tag de conversão na thank-you page dele. Quando o visitante clica no seu anúncio, passa pelo redirect da rede e compra, o navegador **perde a trilha** — é o que chamamos de *redirect blackout*. Resultado: o Google Ads otimiza para cliques, não para vendas, e você paga cada vez mais caro por um lead que não converte.

**A solução** é o postback offline com *thread de click ID*: você gera um click_id no tracker, injeta no subID da rede, a rede te devolve no postback da venda, e você casa com a sessão original e envia a conversão para o Google Ads via Conversion API. A Fase 4 ensina a engenharia disso.

## Gargalo 2 — Presell sem valor original
O Google reprova **bridge page thin** (headline + 3 bullets + botão Buy Now) como *low value content* e violação de *Destination Requirements*. Uma oferta de afiliado precisa de página com conteúdo original útil: review, comparação, prós e contras, FAQ, prova social e disclosure. A Fase 2 entrega o wireframe que passa.

## Gargalo 3 — Ausência de negativas homônimas
Fundo de funil vive de **intenção exata**. Sem lista de negativas obrigatórias (free, trial, student, bad credit, no annual fee + homônimos do nicho), seu orçamento é comido por busca de baixa intenção e por homônimos que não têm nada a ver com o produto. A Fase 3 entrega a lista base com 100+ termos.

> Regra do curso: **nenhuma campanha sobe sem os três sistemas ligados**. Oferta boa com tracking cego = banca queimada. Oferta boa com presell thin = reprovação. Oferta boa sem negativas = verba derretida.`,
      erros: [
        {
          erro: "Subir campanha direto com o link de afiliado (direct linking)",
          correcao: "Google proíbe. Sempre presell com conteúdo original entre o anúncio e o hoplink.",
        },
        {
          erro: "Esperar o relatório da rede (CSV) para otimizar",
          correcao: "CSV é lento e cheio de erro. Postback em near real time alimenta o Smart Bidding.",
        },
        {
          erro: "Começar pelo criativo antes de validar a oferta",
          correcao: "Oferta com EPC < $2 em cold traffic Tier 1 reprova o teste antes de você aprender algo.",
        },
      ],
      quickWin:
        "Abra o Template de Ofertas (aula 5 desta fase) e liste as 3 ofertas que você já tinha em mente. Você vai eliminar pelo menos 2 só aplicando os filtros de EPC e conversão.",
    },
    {
      slug: "criterios-de-corte",
      titulo: "Critérios de corte validados: BuyGoods e Digistore24",
      tipo: "metricas",
      duracao: "22 min",
      objetivo:
        "Decorar os números de corte que separam oferta testável de oferta-armadilha para banca pequena.",
      conteudo: `Estes não são números bonitos de blog. São **critérios de corte de campo** — o que a oferta precisa mostrar, no mínimo, para entrar no seu radar.

## BuyGoods (nutra/suplementos, saúde masculina, emagrecimento)
- Modelos de pagamento: **CPL, CPS e RevShare**; tolerância zero a spam.
- Comissão típica: **40% a 60%**, chegando a **50%–75%** quando existem upsells com rebill.
- **Case validado**: oferta VigorX Pro — conversão de checkout **53,5%**, **EPC $3,81+**.
- Outras ofertas da rede: conversão de checkout **1,5%–2,4%**, payout **$100–$190**, EPC **$2,00–$3,00**.
- Pagamento: **3x por semana**, mínimo de saque **$100**.

### Filtros de corte para iniciante (BuyGoods)
| Critério | Mínimo aceito | Ideal |
| --- | --- | --- |
| Comissão líquida | $50–$100 | $75+ |
| EPC (cold traffic Tier 1) | $2,00 | $3,00+ |
| Conversão de checkout | > 2% | > 40% (VSL forte) |
| Payout recorrente | habilitado | rebill em upsell |
| Frequência de pagamento | semanal | 3x por semana |

## Digistore24 (info-produtos, saúde, idiomas, relacionamento)
- Comissão de até **85%** em produtos digitais; dashboard multi-moeda com analytics integrado.
- **Case validado**: ProDentim — EPC **$3+**, AOV **$130–$300** em bundles de 3 ou 6 frascos.
- **Gravity score** indica volume de vendas dos afiliados: escolha gravity alto com comissão mínima de **$55 por venda**.
- Atenção à política de tráfego: muitas ofertas **proíbem bidding em marca** (nome da empresa e do produto) no Google Ads e exigem **presell review**, nunca direct linking.

### Filtros de corte para iniciante (Digistore24)
| Critério | Mínimo aceito | Ideal |
| --- | --- | --- |
| Gravity score | alto (top do nicho) | top 3 do nicho |
| Comissão por venda | $55 | $70+ |
| EPC | $2,50 | $3,00+ |
| AOV do bundle | $130 | $200+ |
| Regra de marca | presell review obrigatório | keyword variation liberada |

## A regra de ouro do teste de $20/dia
Com $20/dia você aguenta aproximadamente **6 a 10 cliques** em Tier 1. Se a oferta tem EPC de $2,00, cada 10 cliques precisam gerar ~$20 para você ficar no zero-a-zero. Ou seja: **EPC $2,00 é o piso, não a meta**. Abaixo disso, o teste morre antes de o algoritmo aprender.

> **Checklist de corte:** comissão líquida ≥ $50–$100 · EPC ≥ $2,00 · conversão checkout > 2% · payout recorrente ou AOV alto · política de marca compatível com presell review · pagamento no mínimo semanal.`,
      erros: [
        {
          erro: "Escolher oferta só porque a comissão é 75%",
          correcao: "Comissão alta em produto que não converte pior que 40% em produto com EPC $3. Teste pelo EPC.",
        },
        {
          erro: "Ignorar a política de marca da oferta",
          correcao: "Leia os termos antes. Se proíbe marca, seu funil inteiro precisa ser review/keyword variation.",
        },
      ],
      quickWin:
        "Pegue uma oferta que você quer promover e calcule: (comissão % × preço) = comissão líquida. Depois compare com os filtros. Se não passar nos 6 itens, descarte sem culpa.",
    },
    {
      slug: "sop-mineracao",
      titulo: "SOP: mineração de ofertas em 45 minutos",
      tipo: "sop",
      duracao: "18 min",
      objetivo: "Executar um processo repetível de prospecção de ofertas sem depender de inspiração.",
      conteudo: `Este SOP usa sinais públicos + scrapers de SERP para ranquear ofertas por **intenção comercial, concorrência e oportunidade**. A lógica vem de scrapers open-source do tipo *affiliate-dropshipping-keyword-research-scraper* (Node + Playwright): extrair sinais da SERP do Google, cruzar com dados de produto e pontuar cada nicho.

**Ferramentas de apoio (auditáveis, open-source):**
- \`apify/google-search-scraper\` com \`focusOnPaidAds: true\` — coleta anúncios pagos por keyword (quem está anunciando = quem está ganhando).
- Scrapers de Google Ads exigem **proxies residenciais** — o Google bloqueia IP de data center.
- \`affiliate-skills\` — 45 skills de IA para pesquisa, conteúdo, páginas e tracking.
- \`EvoClick\` (Go + Next.js) — tracker self-hosted que você vai dockerizar na Fase 4.

Não reinvente: colete sinais, pontue, descarte.`,
      passos: [
        "Abra o marketplace (BuyGoods/Digistore24) e filtre o nicho-alvo por comissão líquida ≥ $50 e payout ≥ $55.",
        "Para cada candidata, anote no Template de Ofertas: EPC, conversão de checkout, gravity, AOV dos bundles, restrição de marca e frequência de pagamento.",
        "No Google, rode a keyword raiz do nicho (ex: 'dentist approved teeth whitening') e conte: quantos anúncios pagos? quantas reviews independentas? Se há 4+ anunciantes há 30+ dias, a oferta tem tração.",
        "Rode o scraper de SERP focado em paid ads para as 5 keywords principais e salve os domínios anunciantes em uma lista de 'quem sobrevive'.",
        "Pontue cada oferta de 0 a 100 no Template (Score): EPC 30 pts · conversão 20 pts · comissão 15 pts · gravity 15 pts · concorrência SERP 10 pts · política de marca 10 pts.",
        "Descarte tudo abaixo de 70. Das que sobrarem, escolha 3 para o funil da Fase 2 — uma de ticket baixo (impulso), uma de ticket médio (review), uma de bundle alto (AOV).",
        "Gere o hoplink com subID por canal (ex.: \`?tid=gads_fundo&subId1={campaign}\`) e registre no banco Tracking do Notion.",
      ],
      checklist: [
        "3 ofertas pontuadas e 1 aprovada com score ≥ 70",
        "EPC anotado com data da coleta (dados mudam)",
        "Política de marca lida e registrada",
        "Hoplink com subID criado e salvo",
        "Lista de 'quem sobrevive' (domínios anunciantes) salva",
      ],
      quickWin:
        "Em 45 minutos você tem oferta aprovada + hoplink com subID. Isso já é mais que 90% dos iniciantes fazem em 2 semanas.",
    },
    {
      slug: "serp-intencao",
      titulo: "SERP e intenção comercial: validar demanda antes de gastar",
      tipo: "aula",
      duracao: "16 min",
      objetivo: "Ler a SERP como um afiliado: saber se a keyword é fundo de funil antes de pagar o clique.",
      conteudo: `Fundo de funil puro significa que a pessoa **já decidiu comprar** e está escolhendo onde. A SERP te conta isso em 10 segundos.

## Os 4 sinais de intenção comercial de fundo
1. **Modificadores de decisão**: *best, review, vs, discount, coupon, official, buy, near me*. A keyword 'best credit card for high earners' é fundo; 'what is a credit card' é topo.
2. **Presença de anúncios pagos**: se há 3+ anunciantes consistentes, o clique tem valor econômico comprovado.
3. **Páginas de review independentes**: se a SERP tem reviews de terceiros, o Google já considera a query transacional.
4. ** rich results de produto/preço**: cards de preço indicam intenção de compra imediata.

## O que fazer com cada tipo de SERP
| O que você vê na SERP | Leitura | Ação |
| --- | --- | --- |
| 5+ anúncios, reviews, cupons | Fundo de funil quente | Estrutura SKAG exata + frase |
| Wikipédia, blogs educativos | Topo/meio de funil | Não compre clique — mude a keyword |
| Só o site oficial | Query de marca | Proibida na maioria das ofertas |
| Fóruns (Reddit/Quora) | Pesquisa de solução | Meio de funil — usar em STAG de consideração |

## Intenção × concorrência
Uma keyword fundo de funil com 1 anunciante é ouro. Com 12 anunciantes em Tier 1, o CPC come alto — aí você testa em Tier 2 (UK, CA, AU, NZ) antes de escalar.

> **Regra:** você não paga para descobrir se a keyword vende. Você lê a SERP primeiro, e só paga pelo clique quando a intenção já está provada.`,
      quickWin:
        "Pegue a keyword principal da sua oferta, cole no Google em janela anônima e classifique a SERP pela tabela acima. Se der 'fundo de funil quente', siga.",
    },
    {
      slug: "template-ofertas",
      titulo: "Template: Planilha/Notion de Ofertas com score de validação",
      tipo: "template",
      duracao: "12 min",
      objetivo: "Ter o banco de dados de ofertas pronto para uso, com fórmula de score automática.",
      conteudo: `O banco **Ofertas** é o primeiro banco do template Notion deste curso. Ele existe para que nenhuma decisão de teste seja tomada no achismo.

## Campos do banco Ofertas
| Campo | Tipo | Para que serve |
| --- | --- | --- |
| Nome da oferta | Título | Identificação |
| Nicho | Select | health / beauty / finance / language |
| Rede | Select | BuyGoods / Digistore24 / ClickBank |
| Hoplink + subID | URL | Link operacional com rastreio por canal |
| Preço do front | Número | Base do cálculo de comissão |
| Comissão % | Número | Do backoffice |
| Comissão líquida USD | Fórmula | preço × % |
| EPC | Número | Piso $2,00 |
| Conversão checkout | Número | Piso 2% |
| Gravity | Número | Só Digistore24 |
| AOV bundle | Número | Piso $130 |
| Volume de buscas | Número | Tier 1 > 1k/mês |
| Concorrência SERP | Número | < 40 |
| Restrição de marca | Select | livre / review-only / proibida |
| Frequência de pagamento | Select | diária / 3x semana / semanal |
| Score | Fórmula | 0–100 (regra abaixo) |
| Status | Select | minerando / validada / em teste / pausada / morta |

## Fórmula do Score (0 a 100)
\`\`\`
Score = EPC(30) + Conversão(20) + Comissão(15) + Gravity(15) + SERP(10) + Marca(10)
- EPC: ≥$3,00 = 30 | ≥$2,00 = 20 | <$2,00 = 0
- Conversão: >40% = 20 | >2% = 10 | <2% = 0
- Comissão: ≥$100 = 15 | ≥$50 = 10 | <$50 = 0
- Gravity: top 3 nicho = 15 | top 10 = 8 | fora = 0
- SERP: <20 concorrentes = 10 | <40 = 6 | ≥40 = 0
- Marca: livre = 10 | review-only = 6 | proibida = 0
\`\`\`

**Corte:** score ≥ 70 entra em teste. Score < 70 volta para mineração. Nada de exceção emocional.

Você pode exportar este banco pronto (com 3 ofertas de exemplo) na página **Template Notion** do site — em CSV, importável direto no Notion.`,
      checklist: [
        "Banco Ofertas criado com todos os campos",
        "Fórmula de Score configurada",
        "3 ofertas de exemplo preenchidas",
        "View 'Aprovadas' filtrando Score ≥ 70",
      ],
      quickWin:
        "Clique em Template Notion no menu, baixe o CSV do banco Ofertas e importe no Notion — o banco nasce pronto com score.",
    },
    {
      slug: "checklist-oferta",
      titulo: "Checklist de aprovação de oferta",
      tipo: "checklist",
      duracao: "8 min",
      objetivo: "Um portão objetivo: a oferta só vai para a Fase 2 se passar em 100% dos itens.",
      conteudo: `Use este checklist como **portão de passagem**. Se qualquer item falhar, a oferta não sobe de fase.`,
      checklist: [
        "Comissão líquida entre $50 e $100+ (BuyGoods) ou ≥ $55 (Digistore24)",
        "EPC ≥ $2,00 em cold traffic Tier 1",
        "Conversão de checkout > 2% (ou VSL com checkout > 40%)",
        "Payout recorrente habilitado OU AOV de bundle ≥ $130",
        "Pagamento no mínimo semanal (ideal 3x por semana)",
        "Política de marca lida: presell review permitido",
        "Gravity alto (Digistore24) ou volume de vendas comprovado (BuyGoods)",
        "Volume de buscas Tier 1 > 1.000/mês e concorrência SERP < 40",
        "Hoplink com subID por canal criado",
        "Página de vendes do merchant carrega rápido e tem ordem com rastreio",
        "Não é oferta de nicho saturado sem diferencial de review",
        "Score do Template ≥ 70",
      ],
      quickWin: "Oferta aprovada = sinal verde para construir a presell na Fase 2.",
    },
  ],
};

const fase2: Fase = {
  slug: "presell",
  numero: 2,
  titulo: "Estrutura de Pre-sell e Blindagem Técnica",
  subtitulo: "A página que o Google aprova e que esquenta o clique antes do hoplink.",
  objetivo:
    "Construir presell pages com conteúdo original que passam em Destination Requirements, carregam rápido e mantêm a trilha de tracking viva (gclid + click_id).",
  duracao: "1h 50min",
  icone: "🛡️",
  entregavel: "Presell publicada no domínio neutro com cookie pop-up, tracking template e compliance score ≥ 90.",
  aulas: [
    {
      slug: "por-que-reprova",
      titulo: "Por que o Google reprova bridge page thin",
      tipo: "aula",
      duracao: "15 min",
      objetivo: "Conhecer exatamente a regra que mata 80% das contas de afiliado novato.",
      conteudo: `O Google define **bridge page** como página cujo único propósito é enviar o usuário a outro site. Isso é classificado como *low value content* e reprovado por **Destination Requirements**.

## O que reprova (anti-padrões)
- Headline + 3 bullets + botão "Buy Now" — thin bridge clássica.
- Conteúdo copiado de outra review ou gerado sem originalidade.
- Página que só redireciona ou abre pop-up para o link de afiliado.
- Falta de disclosure de afiliado.
- Página inexistente, quebrada ou lenta.

## O que aprova (requisitos)
- **Conteúdo original** com 600+ palavras sobre o produto.
- **Review genuíno**: experiência, prós e contras, para quem é e para quem não é.
- **Comparação** com 2–3 alternativas do nicho (tabela).
- **Prova social** com depoimentos identificáveis (não inventar pessoa real).
- **FAQ** respondendo objeções reais.
- **Affiliate disclosure** visível ("podemos receber comissão").
- **Disclaimer** para suplementos (FDA: claims de estrutura/função, não de cura).
- **CTA claro** para o hoplink — com contexto, não como único elemento da página.

> A presell não é um enfeite entre o anúncio e a venda. Ela é o que **esquenta o clique**, responde objeção e sustenta a aprovação do anúncio.`,
      erros: [
        {
          erro: "Usar cloaker com whitepage rotativa para 'passar' pela aprovação",
          correcao: "Anti-padrão documentado. Aumenta risco de suspensão e queima domínio. Presell original é o caminho.",
        },
        {
          erro: "Publicar review de 200 palavras 'para testar rápido'",
          correcao: "Thin bridge. Mínimo 600 palavras originais + comparação + FAQ.",
        },
      ],
      quickWin:
        "Rode o verificador de compliance do Flow Engine na sua presell atual. Ele pontua palavra a palavra o que falta para passar.",
    },
    {
      slug: "anatomia-presell",
      titulo: "Anatomia da presell que passa em Destination Requirements",
      tipo: "aula",
      duracao: "20 min",
      objetivo: "Conhecer a estrutura seção a seção — e como o Flow Engine gera ela automática.",
      conteudo: `Esta é a anatomia validada. O gerador do site (Flow Engine) produz exatamente esta estrutura, em 3 variações para teste A/B.

## Estrutura (ordem importa)
1. **Headline com promessa específica** — semMarketing genérico. Ex.: "O que 4.317 usuários relataram nos primeiros 30 dias".
2. **Abertura advertorial** (2–3 parágrafos) — contexto e problema, linguagem de quem usa, não de quem vende.
3. **O que é o produto** — descrição factual, formato, como funciona.
4. **Benefícios em blocos** — 4 a 6 benefícios com explicação de 2 linhas cada.
5. **Ingredientes/Componentes ou Funcionalidades** — tabela com "para que serve".
6. **Como usar** — passo a passo de 3 a 5 passos (aumenta compromisso).
7. **Prova social** — 3 depoimentos com nome, idade, cidade e resultado específico.
8. **Comparação** — tabela vs 2 alternativas (com critérios honestos).
9. **FAQ** — 5 a 7 perguntas reais (envio, garantia, prazo, quem não deve usar).
10. **Oferta e CTA** — o que está incluído, garantia, botão para o hoplink.
11. **Disclosure + disclaimer** — affiliate disclosure e, em suplementos, disclaimer de estrutura/função.

## Regras de ouro da copy
- **Congruência**: o headline do anúncio, a headline da presell e a headline da página de vendas contam a **mesma promessa**.
- **Especificidade**: números, prazos e nomes concretos. "Resultados em 21 dias" > "resultados rápidos".
- **Objeção antes do clique**: cada 'mas...' do visitante é respondido antes do CTA.
- **Zero redirecionamento automático**: o clique no CTA é sempre voluntário e rastreável.

> Todas as seções acima são geradas automaticamente pelo **Flow Engine** (aba Flow) quando você informa produto, nicho, link e idioma.`,
      quickWin:
        "Abra o Flow Engine, gere uma presell do tipo 'Review' e compare com esta lista de 11 seções. O que faltar, peça a variação 'Robusta'.",
    },
    {
      slug: "sop-subir-presell",
      titulo: "SOP: subindo a presell no domínio neutro em 20 minutos",
      tipo: "sop",
      duracao: "16 min",
      objetivo: "Publicar a página gerada no seu domínio com tracking vivo, sem quebrar a trilha.",
      conteudo: `Domínio neutro = domínio que não tem histórico de spam e não é o domínio do merchant. Ex.: \`healthinsightsdaily.com\`. Ele é seu ativo de blindagem.`,
      passos: [
        "Gere a presell no Flow Engine (variação Review ou Robusta), informe o hoplink com subID e o código de tracking.",
        "Baixe o HTML completo (inline CSS — não depende de build nenhum).",
        "Na hospedagem, crie a pasta do domínio neutro e suba o arquivo como index.html.",
        "No Cloudflare, deixe o DNS **gray cloud (DNS only)** durante o setup do tracker para evitar cache quebrando o redirect.",
        "Confirme que a página carrega em < 2,5s em 4G (PageSpeed ou WebPageTest).",
        "Cole o código de tracking (EvoClick/Dub/AnyTrack pixel) no campo previsto — o gerador já reserva o slot.",
        "Teste o clique no CTA: confirme no tracker que o click_id foi gerado e o gclid chegou no parâmetro.",
        "Depois de validado, ative o proxy laranja (Cloudflare proxied) para velocidade e proteção.",
      ],
      checklist: [
        "HTML no ar no domínio neutro",
        "Carregamento < 2,5s em 4G",
        "Código de tracking instalado e disparando",
        "click_id + gclid chegando no tracker",
        "Disclosure e disclaimer visíveis",
      ],
      quickWin: "Presell no ar em 20 minutos, pronta para receber o clique do anúncio.",
    },
    {
      slug: "blindagem",
      titulo: "Cookie pop-up, age gate e tracking template",
      tipo: "aula",
      duracao: "18 min",
      objetivo: "Dominar os três elementos técnicos que blindam a operação e preservam a atribuição.",
      conteudo: `## 1. Cookie pop-up (consentimento + captura)
O pop-up de cookie não é só conformidade — ele **segura o clique** e permite gravar o click_id antes do redirect para a rede. Sem ele, parte do tráfego sai sem rastreio.

## 2. Age gate / verificação de idade
Em nichos de suplemento e saúde, a verificação de idade aumenta a **qualidade percebida** do tráfego e evita reprovação por público. O Flow Engine gera pop-up de idade e de captcha em segundos.

## 3. Tracking template (nível de conta)
Configure **uma vez** na conta do Google Ads:
- **Auto-tagging** ativado (gclid em todo clique).
- **UTM template** no nível conta: \`{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={adgroupid}&utm_term={keyword}&gclid={gclid}\`
- **Final URL** = URL da presell; **Display URL** = domínio neutro.

## 4. O que NUNCA fazer
- Cloaker com whitepage rotativa: funciona como arbitragem, mas é **anti-padrão** e aumenta risco de suspensão. Está documentado no curso apenas para você reconhecer e evitar.
- Direct linking do hoplink no anúncio: reprovação garantida.
- Redirect automático da presell para a oferta: quebra a trilha e reprova.

> **Blindagem = velocidade + conteúdo original + trilha íntegra.** Os três juntos sustentam conta viva por meses.`,
      quickWin:
        "Gere um pop-up de idade no Flow Engine e suba junto com a presell. Diferença de qualidade de tráfego aparece em 48h.",
    },
  ],
};

const fase3: Fase = {
  slug: "campanha",
  numero: 3,
  titulo: "Engenharia de Campanha Google Ads Fundo de Funil Puro",
  subtitulo: "Estrutura, keywords e negativas: o que separa quem aparece de que queima verba.",
  objetivo:
    "Estruturar campanhas de pesquisa fundo de funil com grupos por intenção, negativas homônimas obrigatórias e congruência total entre anúncio, URL e presell.",
  duracao: "2h 10min",
  icone: "🎯",
  entregavel: "Campanha no ar com SKAG/STAG validado, lista de negativas 100+ aplicada e UTM template conferido.",
  aulas: [
    {
      slug: "skag-stag",
      titulo: "SKAG vs STAG para fundo de funil",
      tipo: "aula",
      duracao: "16 min",
      objetivo: "Escolher a estrutura de grupos de anúncios certa para o tamanho da sua banca.",
      conteudo: `## SKAG (Single Keyword Ad Group)
Um grupo = uma keyword = um anúncio. CTR alto, Quality Score alto, controle cirúrgico.
- **Use quando**: banca pequena ($20–$50/dia), 3 a 5 keywords fundo de funil por oferta.
- **Risco**: fragmentação e lentidão para escalar.

## STAG (Single Theme Ad Group)
Um grupo = um tema de intenção (ex.: "produto X review"), com 5 a 15 keywords de frase variando o modificador.
- **Use quando**: você já validou o tema e precisa de volume para o Smart Bidding aprender.
- **Risco**: anúncio menos específico — resolva com 3 a 5 RSA por grupo.

## A régua prática
1. Comece em **SKAG** nas 3 keywords mais quentes (marca-produto + review + bonus/discount, se a oferta permitir).
2. Ao atingir 2 conversões no CPA alvo no grupo, promova o tema para **STAG** e alimente com frase variations.
3. Só escale STAG com postback offline ligado — sem sinal de venda, o Google otimiza para clique e o CPA derrete.

> Fundo de funil puro = pesquisa com intenção de compra. Nada de display, nada de discovery nessa fase.`,
      quickWin:
        " Liste suas 10 keywords fundo de funil e separe as 3 mais quentes para o SKAG inicial.",
    },
    {
      slug: "keywords-fundo",
      titulo: "Palavras-chave de fundo de funil e match types",
      tipo: "aula",
      duracao: "18 min",
      objetivo: "Montar a lista de keywords que compra intenção sem pagar por curiosidade.",
      conteudo: `## Modificadores de fundo de funil
| Modificador | Exemplo | Intenção |
| --- | --- | --- |
| review | "[produto] review" | altíssima |
| vs / versus | "[produto] vs [concorrente]" | altíssima |
| best + nicho | "best [categoria] for [perfil]" | alta |
| discount / coupon | "[produto] discount code" | alta |
| bonus | "[produto] bonus" | alta |
| official / buy | "[produto] official website" | média-alta |
| near me / online | "buy [categoria] online" | média |

## Match types — como usar sem queimar
- **Exata**: suas keywords quentes de SKAG. Controle máximo.
- **Frase**: no STAG, com modificador na frente ("[produto] review"). Evita que "review grátis" entre.
- **Ampla**: só com lista de negativas madura e postback ligado. Para iniciante: **não use**.

## Filtro de intenção antes de comprar o clique
- Query com "free", "trial", "sample", "student", "bad credit", "no annual fee", "for beginners", "DIY", "jobs", "salary", "scam" → **negativa obrigatória** (próxima aula).
- Query com "o que é", "como funciona sozinho", "definição" → topo de funil, não compre.

> Você não está comprando tráfego. Está comprando **intenção de compra**.`,
      quickWin: "Escreva 15 keywords, classifique cada uma pela tabela e delete tudo que não for alta/altíssima.",
    },
    {
      slug: "negativas-homonimas",
      titulo: "Negativas homônimas: a lista base de 100+ termos",
      tipo: "aula",
      duracao: "22 min",
      objetivo: "Aplicar a lista base de negativas que economiza 30–60% do orçamento em fundo de funil.",
      conteudo: `Negativa é o que **funde o funil**. Sem ela, seu orçamento é comido por busca de baixa intenção e por homônimos que não têm relação com o produto.

## O caso validado
Oferta "best credit card for high earners": as negativas obrigatórias incluíam **"student", "bad credit", "no annual fee"** — queries que trazem clique caro e conversão zero. Em contas de CPA, adicionar **"free", "trial", "review"** como negativas (quando a oferta não é de review) evita queima de verba.

## Como organizar
1. **Lista base universal** (100+ termos) — aplicada em todas as campanhas. Baixe pronta na página **Template Notion** (banco Negativas).
2. **Lista por nicho** — homônimos e termos do seu vertical (ex.: em saúde, "remédio caseiro", "SUS", "farmácia preço").
3. **Lista de marca** — se a oferta proíbe bidding em marca, o nome do merchant e do produto entram como negativas de frase.

## Regra de manutenção
- Toda semana, revise o **search terms report** e promova para negativa toda query com 2+ cliques e 0 conversão.
- Query com CTR < 2% e impressões altas = anúncio desconexo, não necessariamente negativa de keyword.
- Query homônima (ex.: "Meridian" banco vs "Meridian" suplemento) = negativa imediata.

> **Homônimo e homófono são negativas obrigatórias.** Um termo errado pode comer 40% do orçamento antes de você perceber.`,
      checklist: [
        "Lista base 100+ aplicada no nível de campanha",
        "Lista por nicho criada (mínimo 20 termos)",
        "Termos de marca proibidos negativados",
        "Search terms revisado semanalmente na agenda",
      ],
      quickWin:
        "Baixe o CSV do banco Negativas no Template Notion, importe e aplique como lista compartilhada em todas as campanhas.",
    },
    {
      slug: "congruencia",
      titulo: "Congruência URL, headline e anúncio",
      tipo: "aula",
      duracao: "14 min",
      objetivo: "Eliminar o gatilho de reprovação 'Low Value Content' por desconexão entre peças.",
      conteudo: `A reprovação mais comum em fundo de funil não é técnica: é **falta de congruência**. O anúncio promete uma coisa, a URL mostra outra, a presell fala de uma terceira.

## Os 3 elos que precisam contar a mesma história
1. **Headline do anúncio** → promessa específica.
2. **Display URL / Final URL** → domínio neutro coerente com o tema (nunca domínio do merchant, nunca hoplink).
3. **Headline da presell** → a MESMA promessa do anúncio, expandida.

## Exemplo de cadeia congruente
- Anúncio: "ProDentim — 4.317 Usuários, Bônus de 3 Frascos"
- URL: \`dentalinsightsdaily.com/prodentim\`
- Presell headline: "O Que 4.317 Usuários Relataram Sobre o ProDentim em 30 Dias"

## Exemplo de cadeia quebrada (reprovada)
- Anúncio: "Emagreça Rápido" · URL: \`xyz123.xyz\` · Presell: review genérica de chá
→ Google lê: baixo valor, destino enganoso. Reprovação.

## Checklist de congruência
- [ ] Promessa idêntica nos 3 elos
- [ ] Display URL sem subdomínio aleatório
- [ ] Presell com 600+ palavras originais sobre O produto do anúncio
- [ ] Nenhum redirect automático
- [ ] Disclosure visível acima da dobra`,
      quickWin: "Cole sua cadeia atual no teste dos 3 elos. Se um elo não conta a mesma história, reescreva antes de subir.",
    },
    {
      slug: "sop-subida",
      titulo: "SOP: subida de campanha em 30 minutos",
      tipo: "sop",
      duracao: "18 min",
      objetivo: "Um roteiro de subida que evita os 12 erros clássicos de configuração.",
      conteudo: `Ordem importa: quem configura tracking depois perde os primeiros dados — e o Smart Bidding precisa de sinal desde o dia 1.`,
      passos: [
        "Confirme o postback offline ativo (Fase 4) — se não estiver, suba em Manual CPC primeiro.",
        "Aplique a lista de negativas compartilhada (base + nicho + marca proibida).",
        "Crie a campanha de Pesquisa com UTM template no nível conta já preenchido.",
        "Crie 1 grupo SKAG por keyword quente, com 3 RSA congruentes (promessa igual à presell).",
        "Anexe sitelinks: Review Completa, Comparação, FAQ, Página Oficial (via presell).",
        "Defina lance inicial 20% abaixo da estimativa da página inicial — você quer dados, não vaidade.",
        "Programe os anúncios para aparecer 7h–23h no fuso do público-alvo (evite madrugada sem conversão).",
        "Ative o experimento de rotação de anúncios 'não otimizada' por 7 dias para teste limpo.",
        "Agende a revisão de search terms para 72h depois.",
        "Registre tudo no banco Campanhas do Notion: orçamento, CPA alvo, data, status.",
      ],
      checklist: [
        "Negativas aplicadas antes do primeiro clique",
        "UTM template conferido",
        "3 RSA por grupo, todas congruentes",
        "Lance e horários definidos",
        "Registro no Notion feito",
      ],
      quickWin: "Campanha no ar em 30 minutos, do jeito certo, sem retrabalho.",
    },
  ],
};

export const fases123: Fase[] = [fase1, fase2, fase3];
