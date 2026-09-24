// ============================================================
//  CONTEÚDO DO CURSO — PARTE 2 (FASES 4 a 6)
// ============================================================

import type { Fase } from "./curso-parte1";

const fase4: Fase = {
  slug: "tracking",
  numero: 4,
  titulo: "Traqueamento Offline e Atribuição",
  subtitulo: "O sistema que faz o Google Ads otimizar para VENDA, não para clique.",
  objetivo:
    "Implementar postback offline com thread de click ID, deduplicação e envio de conversão via Google Ads Conversion API — o diferencial que recupera sinais perdidos no redirect.",
  duracao: "2h 20min",
  icone: "📡",
  entregavel: "Postback testado ponta a ponta: venda real → click_id → Google Ads conversion.",
  aulas: [
    {
      slug: "redirect-blackout",
      titulo: "Por que o tracking padrão falha com afiliado",
      tipo: "aula",
      duracao: "15 min",
      objetivo: "Entender o mecanismo do 'redirect blackout' e por que importar CSV não resolve.",
      conteudo: `## O problema
O afiliado **não controla o checkout do merchant**. Não existe thank-you page sua para instalar a tag. Quando o visitante clica no anúncio → passa pelo redirect da rede → compra, o navegador perde a trilha do gclid. Isso é *redirect blackout*.

## Os workarolds manuais e por que falham
- **Importar CSV de conversões**: lento, propenso a erro e **inútil para Smart Bidding**, que precisa de sinais near real time.
- **Tag na página de obrigado do merchant**: impossível — você não tem acesso.
- **Pixel só na presell**: mede clique, não venda. Otimiza para o evento errado.

## A solução validada: postback offline
O tracker segura o click_id da sessão original. A rede, ao confirmar a venda, dispara um **postback URL** com esse click_id. O tracker casa com a sessão e envia a conversão para o Google Ads via **Conversion API** — com o gclid recuperado.

**Ganho medido:** rastreamento server-side recupera cerca de **11% mais sinais** que o client-side (AdBlock, iOS, redirect perdido).

> Sem postback, você está dirigindo de olhos fechados: o Google cobra mais caro a cada semana porque está otimizando o evento errado.`,
      quickWin:
        "Antes de escalar qualquer campanha, confirme: 'eu vejo vendas no Google Ads em até 3h?'. Se a resposta for não, a Fase 4 é prioridade zero.",
    },
    {
      slug: "thread-click-id",
      titulo: "Thread do click ID: gclid → subID → postback → API",
      tipo: "aula",
      duracao: "24 min",
      objetivo: "Dominar a engenharia de atribuição que sustenta toda a operação.",
      conteudo: `## O fluxo completo (decore esta sequência)
1. Visitante clica no anúncio Google → **gclid** é anexado à URL da presell (auto-tagging + UTM template).
2. Visitante clica no CTA da presell → o tracker (EvoClick/Dub) gera um **click_id** e redireciona para o hoplink.
3. O hoplink carrega o click_id no **subID** da rede (\`?tid=...&subId1={click_id}\`).
4. O visitante compra no merchant → a rede **segura o click_id** na transação.
5. A rede dispara o **postback URL** para o seu tracker: \`/postback?pid={click_id}&payout={amount}\`.
6. O tracker casa o click_id com a sessão original e **recupera o gclid** guardado.
7. O tracker envia a conversão ao **Google Ads Conversion API** (Click Conversions), com valor e transaction ID.
8. O Google Ads recebe a conversão **offline** e alimenta o Smart Bidding.

## A stack open-source que implementa isso
| Ferramenta | O que é | Papel no fluxo |
| --- | --- | --- |
| EvoClick (Go + Next.js) | Tracker self-hosted, MIT | Gera click_id, smart routing 14+ regras, postback URL, tokens dinâmicos \`{externalID}\`/\`{cost}\` |
| Dub.co | Atribuição moderna de links | Alternativa leve de link tracking |
| fb-gads-conversion-forwarder | Encaminha POST/GET para Google Ads API Click Conversion Uploads | Ponte rede → Google |
| AnyTrack / wecantrack | SaaS de conversão | Postback Digistore24/BuyGoods → Google/Facebook/TikTok |
| Offer18 + Zapier | Automação | Exige gclid + timestamp no postback URL |

## Parâmetros que você deve saber de cor
- \`{click_id}\` / \`{externalID}\` — ID único da sessão no tracker.
- \`{payout}\` / \`{amount}\` — valor da comissão da venda.
- \`{gclid}\` — ID do clique do Google (recuperado pelo match).
- \`{transaction_id}\` — deduplicação (nunca enviar a mesma venda duas vezes).
- \`{status}\` — approved / pending / reversed (trate reversals!).`,
      erros: [
        {
          erro: "Enviar conversão sem transaction ID",
          correcao: "Sem dedup, reenvios duplicam conversões e o CPA real fica inflado — o Google cobra por fantasmas.",
        },
        {
          erro: "Não tratar reversal/refund da rede",
          correcao: "Configure ajuste de conversão (conversion adjustment) para estornos, ou o ROAS relatado mentirá.",
        },
      ],
      quickWin:
        "Escreva o postback URL da sua rede em um papel e confira item a item contra os 8 passos acima. O buraco quase sempre está no subID.",
    },
    {
      slug: "sop-postback",
      titulo: "SOP: postback EvoClick → Google Ads Conversion API",
      tipo: "sop",
      duracao: "28 min",
      objetivo: "Configurar o forwarder de conversão offline e testar ponta a ponta.",
      conteudo: `Pré-requisitos: domínio com Cloudflare (gray cloud no setup), VPS ou Docker, conta Google Ads com Conversion API habilitada.`,
      passos: [
        "Suba o EvoClick via Docker (engine Go + frontend Next.js; PostgreSQL obrigatório, Redis opcional para real-time).",
        "Atrás do Traefik, publique o domínio de tracking (ex.: \`track.seudominio.com\`).",
        "No EvoClick, crie a fonte de tráfego 'Google Ads' e copie a **campaign URL** com os tokens dinâmicos.",
        "Gere o hoplink da oferta com \`subId1={click_id}\` (ou \`{externalID}\`) — confira o nome do token no suporte da rede.",
        "No backoffice da rede (BuyGoods/Digistore24), cole o postback: \`https://track.seudominio.com/postback?pid={click_id}&payout={payout}&txid={transaction_id}&status={status}\`.",
        "Suba o \`fb-gads-conversion-forwarder\` (ou use a integração nativa do EvoClick) apontando para o endpoint Click Conversions do Google Ads.",
        "No Google Ads, crie a ação de conversão 'Importar (conversões offline de clique)' com janela de 30 dias e deduplicação por transaction ID.",
        "Teste com uma compra real ou o simulador de postback da rede: confira venda → click_id → gclid → conversão aparecendo no Google Ads em até 3h.",
        "Documente o endpoint, os tokens e a janela no banco **Tracking** do Notion.",
      ],
      checklist: [
        "Postback configurado no backoffice da rede",
        "Forwarder no ar respondendo 200",
        "Conversão de teste visível no Google Ads < 3h",
        "Transaction ID chegando (dedup ativo)",
        "Endpoint documentado no Notion",
      ],
      quickWin:
        "Mesmo que você use SaaS (AnyTrack), faça este teste manual uma vez: você vai entender para sempre onde a atribuição quebra.",
    },
    {
      slug: "dedup-janela",
      titulo: "Dedup, janela de atribuição, refunds e reversals",
      tipo: "aula",
      duracao: "18 min",
      objetivo: "Evitar os três erros que fazem o ROAS relatado mentir para você.",
      conteudo: `## Deduplicação por transaction ID
Toda conversão enviada carrega o \`transaction_id\` da rede. Se a rede reenvia o postback (e ela reenvia), o Google descarta o duplicado. Sem isso, uma venda pode virar três e seu CPA real fica escondido.

## Janela de atribuição
- **30 dias** é o padrão para fundo de funil em nutra/info.
- Processamento do Google: **3h para last-click**, até **15h** para outros modelos, **3–5 dias** para conversões novas.
- Regra prática: não mexa em lance nas primeiras 72h de campanha — você está olhando dados incompletos.

## Refunds e reversals
- Status \`reversed\`/\`refunded\` no postback → envie **ajuste de conversão** (conversion adjustment) para remover/substituir o valor.
- Rebills: cada cobrança recorrente é uma conversão separada? Depende da regra da rede. BuyGoods com RevShare → sim, trate como conversão adicional com o mesmo transaction ID + sufixo.

## O relatório que você deve olhar todo dia
| Métrica | Onde ver | Frequência |
| --- | --- | --- |
| Conversões offline x cliques | Google Ads | diária |
| Match rate do postback | Tracker | diária |
| Receita por clique (EPC real) | Rede + tracker | diária |
| Reversals pendentes | Rede | 2x por semana |

> **ROAS honesto = conversão deduplicada − reversals + rebills.** Qualquer outro número é fantasia.`,
      quickWin: "Confira hoje: quantas conversões o Google reportou vs quantas vendas a rede reportou? A diferença é o seu match rate.",
    },
  ],
};

const fase5: Fase = {
  slug: "rotina",
  numero: 5,
  titulo: "Rotina de Gestão, Diagnóstico e Destrave",
  subtitulo: "15 minutos por dia, regras objetivas, zero achismo.",
  objetivo:
    "Operar com uma rotina curta e um conjunto de regras de pause/scale/kill baseadas em métricas — e diagnosticar qualquer travamento em menos de 5 minutos.",
  duracao: "1h 30min",
  icone: "⏱️",
  entregavel: "Checklist diário de 15 min + árvore de diagnóstico + calculadora de CPA/ROAS configurada.",
  aulas: [
    {
      slug: "rotina-15min",
      titulo: "A rotina de 15 minutos por dia",
      tipo: "checklist",
      duracao: "14 min",
      objetivo: "Um bloco diário curto que mantém a operação saudável sem virar refém do painel.",
      conteudo: `Faça **uma vez por dia**, sempre no mesmo horário. 15 minutos, cronômetro rodando.

## Ordem do checklist
1. **Impressões = 0?** → Checar: reprovação do anúncio, negativa homônima, orçamento, congruência URL. (árvore de diagnóstico na próxima aula)
2. **CTR < 2%?** → Trocar headline da RSA. Mantenha a promessa, mude o ângulo.
3. **CPC estourou?** → Adicionar negativas do search terms + checar Quality Score.
4. **Conversão = 0 com 1,5x o CPA alvo gasto?** → Pausar o grupo. Não tenha pena.
5. **ROAS > 1,5?** → Aumentar orçamento 20% (nunca mais que isso por vez).
6. **Search terms novo?** → 2+ cliques e 0 conversão = negativa. 1 clique e conversão = promover a exata.
7. **Postback ok?** → Match rate do tracker acima de 90%.

> A rotina não é para 'cuidar da campanha'. É para **tomar 3 decisões** com base em números.`,
      checklist: [
        "Impressões > 0 em todos os grupos ativos",
        "CTR ≥ 2% (ou RSA nova em teste)",
        "CPC dentro do teto definido",
        "Nenhum grupo gastou 1,5x CPA sem conversão",
        "ROAS > 1,5 → aumento de 20% aplicado",
        "Search terms revisado e negativas atualizadas",
        "Match rate do postback ≥ 90%",
      ],
      quickWin: "Agende 15 minutos na sua agenda com alarme. Rotina sem horário não existe.",
    },
    {
      slug: "arvore-diagnostico",
      titulo: "Árvore de diagnóstico: 0 impressões, CTR baixo, CPC estourado",
      tipo: "aula",
      duracao: "20 min",
      objetivo: "Diagnosticar em menos de 5 minutos qualquer travamento de campanha.",
      conteudo: `## Sintoma: 0 impressões
| Causa | Como confirmar | Correção |
| --- | --- | --- |
| Anúncio reprovado | Coluna 'Status' = Reprovado | Corrigir destino (presell thin) ou política |
| Negativa homônima | Search terms some totalmente | Remover negativa errada da lista compartilhada |
| Lance baixo demais | 'Elegibilidade do lance' | Subir lance 20% ou narrowing |
| Orçamento limitado | 'Impression share lost by budget' | Aumentar 20% ou reduzir keywords |
| URL não confere | Final URL ≠ destino aprovado | Congruência: mesma promessa nos 3 elos |

## Sintoma: CTR < 2%
- Headline sem congruência com a keyword → reescreva a RSA 1.
- Público errado (query topo de funil) → negativas.
- Anúncio genérico ("Saiba mais") → promessa específica com número.

## Sintoma: CPC estourado
- Quality Score baixo (relevância do anúncio/landing) → congruência + presell mais completa.
- Concorrência em leilão quente → Tier 2 (UK/CA/AU) ou horário fora do pico.
- Muitas broad matches → migrar para exata/frase.

## Sintoma: clique vai, venda não vem
- Match rate do postback < 90% → consertar antes de julgar a oferta.
- Página de vendas do merchant lenta ou sem rastreio → testar outra oferta.
- Presell não responde objeção → gerar variação Robusta no Flow Engine.

> **Regra dos 5 minutos:** sintoma → tabela → teste → registro no Notion. Sem adivinhação.`,
      quickWin: "Da próxima vez que travar, abra esta árvore e risque causa por causa. Anote qual era no banco Campanhas.",
    },
    {
      slug: "regras-pause-scale",
      titulo: "Regras de pause, scale e kill",
      tipo: "metricas",
      duracao: "16 min",
      objetivo: "Ter números, não sentimentos, para decidir o que pausar, escalar ou matar.",
      conteudo: `## Tabela de decisão (a regra da casa)
| Situação | Métrica | Ação |
| --- | --- | --- |
| Grupo sem conversão | gastou 1x CPA alvo | Pausar grupo, revisar anúncio/presell |
| Grupo sem conversão | gastou 1,5x CPA alvo | Matar keyword, voltar para mineração |
| ROAS > 1,5 | 2+ conversões no alvo | Aumentar orçamento 20% |
| IS perdido por orçamento | > 30% | Aumentar orçamento 20% |
| CPA subindo | 3 dias seguidos | Pausar, diagnosticar search terms |
| Campanha travada | 0 impressões 48h | Diagnóstico político/lance/negativa |

## Escala: a régra dos 20%
Aumente **20% do orçamento a cada 2 conversões dentro do CPA alvo**. Nunca dobre: o algoritmo precisa de janela para reaprender, e aumento brusco queima o aprendizado.

## Kill: quando matar sem pena
- 2x CPA alvo gasto sem conversão após revisão de anúncio e presell.
- Oferta morta (merchant pausou vendas ou mudou payout).
- Match rate do postback abaixo de 70% por 3 dias.

> **Kill rápido é skill.** Quanto mais cedo você mata o perdedor, mais verba sobra para o vencedor.`,
      quickWin: "Escreva seu CPA alvo hoje: (comissão líquida × margem de segurança 0,6). Ex.: comissão $80 → CPA alvo $48.",
    },
    {
      slug: "calculadora-roi",
      titulo: "Calculadora ROI/CPA e meta de ROAS",
      tipo: "template",
      duracao: "12 min",
      objetivo: "Usar a calculadora do site para transformar número de oferta em meta de campanha.",
      conteudo: `A calculadora está na página **Rotina** do site. Ela converte os dados da oferta em metas operacionais:

## O que ela calcula
- **CPA alvo** = comissão líquida × margem de segurança (padrão 60%).
- **CPC máximo** = CPA alvo × conversão esperada do clique (use 1–2% em cold Tier 1).
- **Cliques necessários por venda** = 1 ÷ conversão.
- **Orçamento de teste** = cliques necessários × CPC máximo.
- **ROAS de equilíbrio** = 1,0; **meta de scale** = 1,5.

## Exemplo real (VigorX Pro)
- Comissão líquida: **$120** · EPC: **$3,81**
- CPA alvo (60%): **$72**
- CPC máximo (conversão 1,5%): **$1,08**
- Orçamento de teste ($20/dia): ~18 cliques/dia → decisão em 5–7 dias.

> Use a calculadora **antes** de subir campanha. Se o CPC máximo da sua praça for maior que o calculado, a oferta não é para você — ou a praça não é Tier 1.`,
      quickWin: "Abra a Rotina, calcule seu CPA alvo e trave o número no topo do painel do Google Ads.",
    },
  ],
};

const fase6: Fase = {
  slug: "entregaveis",
  numero: 6,
  titulo: "Arquitetura dos Entregáveis e CTA 40%",
  subtitulo: "Como empacotar tudo isso em produto que vende — com quick win em 48h.",
  objetivo:
    "Consolidar o sistema em entregáveis (Notion, PDFs, templates, ferramenta) com copy de CTA de alta conversão e automação de IA que economiza 80% do tempo.",
  duracao: "1h 20min",
  icone: "📦",
  entregavel: "Pacote de entregáveis montado: Notion + PDFs + Flow Engine + copy de CTA testada.",
  aulas: [
    {
      slug: "quick-win-48h",
      titulo: "Quick win em 48h: o que entregar primeiro",
      tipo: "aula",
      duracao: "14 min",
      objetivo: "Estruturar o produto para que o aluno tenha resultado antes de aprender tudo.",
      conteudo: `Um produto educacional de alto CTA não entrega 'conhecimento'. Entrega **resultado em 48 horas** e depois aprofunda.

## O pacote de quick win (48h)
1. **Template de mineração** com filtros BuyGoods/Digistore24 (banco Ofertas + score).
2. **Tracker dockerizado** (EvoClick) — sobe em 1 comando.
3. **Presell validada** gerada no Flow Engine — 3 variações, prontas para subir.
4. **Lista de negativas 100+** pronta para importar.
5. **Checklist de subida** de campanha.

## Por que isso sustenta CTA de 40%
- Prova social embutida: EPC real **$3,81**, checkout **53,5%**, payout **3x por semana**.
- Stack validada e auditável: presell HTML + cookie pop-up + domínio neutro + tracking template + postback offline.
- Rotina de 15 min/dia com regras objetivas — o aluno não fica perdido.

> O quick win não é marketing: é **respeito ao tempo do aluno**. Ele precisa ver o sistema funcionando antes de confiar no aprofundamento.`,
      quickWin: "Monte a pasta '48h' do seu produto com os 5 itens acima. Ela é o primeiro módulo que o aluno abre.",
    },
    {
      slug: "wireframe-pdfs",
      titulo: "Wireframe dos PDFs de execução",
      tipo: "aula",
      duracao: "16 min",
      objetivo: "Saber exatamente o que vai em cada PDF — sem enrolação, com screenshots reais.",
      conteudo: `PDF de execução = documento que o aluno abre **com a mão no mouse**. Nada de teoria longa.

## Estrutura-padrão de cada PDF (8 a 14 páginas)
1. **Capa + promessa** (1 pág.)
2. "O que você terá ao final" (1 pág.)
3. **Passo a passo numerado** com screenshot real por passo (6–8 págs.)
4. **Tabela de métricas** da fase (1 pág.)
5. **Checklist imprimível** (1 pág.)
6. "Se der errado, leia aqui" — troubleshooting (1 pág.)

## Screenshots que precisam existir (reais, do backoffice)
- BuyGoods: EPC $3,81, checkout 53,5%, payout 3x/semana.
- Digistore24: AOV $130–$300 em bundles.
- Fluxo do postback ponta a ponta.
- Lista de negativas aplicada na conta.

> **Regra:** se o passo não tem screenshot, ele não é passo — é opinião.`,
      quickWin: "Para a Fase 1, tire os screenshots do marketplace hoje. PDF sem print não convence.",
    },
    {
      slug: "copy-cta-40",
      titulo: "Copy de CTA 40%: framework AIDA + prova social",
      tipo: "aula",
      duracao: "18 min",
      objetivo: "Escrever CTA que converte 40% usando a estrutura validada do produto.",
      conteudo: `## Framework AIDA aplicado ao produto
- **A**tenção: headline com número e especificidade ("O sistema que rodou 53,5% de checkout com EPC $3,81").
- **I**nteresse: os 3 gargalos que quebram a banca — o aluno se reconhece.
- **D**esejo: quick win 48h + stack dockerizada + prova social quantitativa.
- **A**ção: CTA único, repetido a cada bloco de valor.

## A estrutura de CTA que sustenta 40%
1. **Promessa específica** com número validado.
2. **Prova social quantitativa** (EPC, checkout, payout).
3. **Quick win com prazo** (48h).
4. **Redução de risco** (garantia, teste com $20).
5. **CTA único e direto** — uma ação, um botão, um link.

## Onde repetir o CTA
- Final de cada aula (contextual ao que foi ensinado).
- Final de cada fase (consolidando o entregável).
- Página de vendas / aula de abertura (AIDA completo).

> **Teste:** CTA 40% não é mágica — é prova social específica + quick win com prazo + risco zerado. Quando os três estão presentes, a oferta se vende.`,
      quickWin:
        "Escreva seu CTA em 5 linhas seguindo os 5 itens acima. Se não couber número validado, volte para a mineração.",
    },
    {
      slug: "automacao-ia",
      titulo: "Automação: Qwen-Marketing, affiliate-skills e o Flow Engine",
      tipo: "aula",
      duracao: "20 min",
      objetivo: "Usar IA para gerar copy e variações em escala — com auditoria de compliance.",
      conteudo: `## Os motores de copy (open-source)
- **Qwen-Marketing** (\`marketeam/Qwen-Marketing\`): LLM de reasoning fine-tunado do Qwen3-8B em 10B+ tokens de marketing curado, contexto 32k, licença **Apache 2.0**. Especialista em copy de produto em brand voice, variantes de campanha e landing pages. Roda local ou em GPU barata.
- **brandvoice-marketing-model**: LoRA adapter que faz o Llama 3.3 70B escrever na voz específica da marca.
- **copywriting-llm** (Kavyaah): push notifications e ad copy.

## O fluxo de automação que economiza 80% do tempo
1. **Gere**: Qwen-Marketing produz 10 variações de presell (headlines, benefícios, FAQ) a partir da ficha da oferta.
2. **Audite**: skill \`compliance-checker\` (do kit claude-code-copywriting-skills) audita cada variação contra políticas de Google, Meta, TikTok e ClickBank.
3. **Exporte**: HTML inline CSS pronto para subir no domínio.
4. **Opere**: \`affiliate-skills\` gera hoplinks com tid por canal e presell_html com disclosure automático.

## Como isso aparece neste produto
O **Flow Engine** (aba Flow do site) é exatamente esse fluxo empacotado: você informa produto, nicho, link e idioma — ele devolve 3 presells completas, pontuadas em compliance, em HTML pronto para copiar. Com \`LLM_API_KEY\` configurado, a geração usa o modelo configurado; sem chave, roda o motor local determinístico (mesma estrutura, mesma qualidade de esqueleto).

> **Regra de ouro:** IA escreve, humano valida. Nunca suba copy sem passar pelo compliance checker — reprovação de destino custa mais que o tempo economizado.`,
      quickWin: "Gere 3 presells no Flow Engine agora e rode o score de compliance em cada uma.",
    },
  ],
};

export const fases456: Fase[] = [fase4, fase5, fase6];
