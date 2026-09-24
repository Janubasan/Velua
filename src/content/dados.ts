// ============================================================
//  DADOS VALIDADOS — métricas, cases, ferramentas, negativas
//  Fontes: backoffices BuyGoods/Digistore24, repositórios
//  open-source citados na pesquisa e cases de campo.
// ============================================================

export interface Metrica {
  label: string;
  valor: string;
  contexto: string;
  tier: "ouro" | "prata" | "bronze";
}

export const metricasValidadas: Metrica[] = [
  {
    label: "EPC — VigorX Pro (BuyGoods)",
    valor: "$3,81+",
    contexto: "Case de referência em nutra masculino: EPC acima de $3 com checkout forte.",
    tier: "ouro",
  },
  {
    label: "Conversão de checkout — VigorX Pro",
    valor: "53,5%",
    contexto: "Checkout do merchant convertendo mais da metade dos iniciados — valida VSL + oferta.",
    tier: "ouro",
  },
  {
    label: "Comissão BuyGoods (com upsell/rebill)",
    valor: "50%–75%",
    contexto: "Teto real quando há upsells com cobrança recorrente (RevShare).",
    tier: "ouro",
  },
  {
    label: "Frequência de pagamento BuyGoods",
    valor: "3x por semana",
    contexto: "Mínimo de saque $100 — caixa saudável para reinvestir em teste.",
    tier: "prata",
  },
  {
    label: "EPC — ProDentim (Digistore24)",
    valor: "$3+",
    contexto: "Info-produto/suplemento dental com bundle de 3 e 6 frascos.",
    tier: "ouro",
  },
  {
    label: "AOV em bundles — ProDentim",
    valor: "$130–$300",
    contexto: "Ticket médio alto permite CPA de campanha folgado.",
    tier: "ouro",
  },
  {
    label: "Comissão Digistore24",
    valor: "até 85%",
    contexto: "Teto em produtos digitais; na prática escolha gravity alto + $55/venda.",
    tier: "prata",
  },
  {
    label: "Payout típico BuyGoods",
    valor: "$100–$190",
    contexto: "Faixa de comissão por venda em ofertas de saúde/emagrecimento.",
    tier: "prata",
  },
  {
    label: "Conversão de checkout — ofertas comuns",
    valor: "1,5%–2,4%",
    contexto: "Ofertas sem VSL forte: use conversão 1–2% no cálculo de CPC máximo.",
    tier: "bronze",
  },
  {
    label: "EPC — ofertas comuns",
    valor: "$2,00–$3,00",
    contexto: "Piso de teste para cold traffic Tier 1: abaixo de $2,00 não testar.",
    tier: "prata",
  },
  {
    label: "Ganho do tracking server-side",
    valor: "+11% sinais",
    contexto: "Postback server-side vs client-side: recupera conversões perdidas no redirect.",
    tier: "ouro",
  },
  {
    label: "Janela de atribuição recomendada",
    valor: "30 dias",
    contexto: "Processamento Google: 3h last-click, 15h outros modelos, 3–5 dias conversão nova.",
    tier: "prata",
  },
  {
    label: "Regra de escala de orçamento",
    valor: "+20% a cada 2 conversões",
    contexto: "Nunca dobrar: o algoritmo precisa de janela para reaprender.",
    tier: "ouro",
  },
  {
    label: "Travamento: gasto sem conversão",
    valor: "1,5x CPA = pausar",
    contexto: "Regra de kill objetivo. 2x CPA sem conversão = matar a keyword.",
    tier: "ouro",
  },
  {
    label: "CTR mínimo em fundo de funil",
    valor: "≥ 2%",
    contexto: "Abaixo disso: trocar headline da RSA antes de tocar em lance.",
    tier: "prata",
  },
  {
    label: "Carregamento da presell",
    valor: "< 2,5s em 4G",
    contexto: "Velocidade é fator de aprovação e de conversão. HTML inline CSS ajuda.",
    tier: "prata",
  },
];

export interface CaseValidado {
  oferta: string;
  rede: string;
  nicho: string;
  numeros: { label: string; valor: string }[];
  oQueFuncionou: string[];
  oQueComecarFazendo: string[];
  comoEscalar: string[];
}

export const casesValidados: CaseValidado[] = [
  {
    oferta: "VigorX Pro",
    rede: "BuyGoods",
    nicho: "Saúde masculina / nutra",
    numeros: [
      { label: "EPC", valor: "$3,81+" },
      { label: "Conversão checkout", valor: "53,5%" },
      { label: "Payout", valor: "$100–$190" },
      { label: "Pagamento", valor: "3x/semana" },
    ],
    oQueFuncionou: [
      "Presell review com 800+ palavras, comparação com 2 concorrentes e FAQ.",
      "SKAG em 'vigorx pro review' + 'vigorx pro bonus' com RSA congruente.",
      "Postback offline ligado desde o dia 1 (match rate > 92%).",
    ],
    oQueComecarFazendo: [
      "Validar EPC ≥ $3 no marketplace antes de qualquer criativo.",
      "Escrever a review em PT/EN com depoimentos identificáveis e disclaimer.",
      "Configurar UTM template + auto-tagging antes do primeiro clique.",
    ],
    comoEscalar: [
      "Aumentar 20% do orçamento a cada 2 conversões no CPA alvo.",
      "Promover SKAG validado para STAG com 10+ frase variations.",
      "Expandir Tier 2 (UK/CA/AU) quando o CPC de US saturar.",
    ],
  },
  {
    oferta: "ProDentim",
    rede: "Digistore24",
    nicho: "Saúde dental",
    numeros: [
      { label: "EPC", valor: "$3+" },
      { label: "AOV bundle", valor: "$130–$300" },
      { label: "Comissão", valor: "até 85%" },
      { label: "Bundles", valor: "3 e 6 frascos" },
    ],
    oQueFuncionou: [
      "Review comparativa (vs 2 pastas comerciais) com tabela de ingredientes.",
      "Página robusta com vídeo bloqueado e seção 'como usar' em 4 passos.",
      "AnyTrack postback Digistore24 → Google Ads Conversion API.",
    ],
    oQueComecarFazendo: [
      "Confirmar gravity alto e política de marca (presell review obrigatório).",
      "Montar a tabela de comparação antes de escrever o corpo do texto.",
      "Testar AOV: começar pelo bundle de 3 (menor fricção).",
    ],
    comoEscalar: [
      "Subir o bundle de 6 quando o ROAS passar de 1,5 no de 3.",
      "Criar STAG de 'dental whitening' uma vez validado o review.",
      "Usar ad customizers para variar preço/promoção sem reprovar.",
    ],
  },
  {
    oferta: "Oferta genérica de crédito (CPA)",
    rede: "BuyGoods / Digistore24",
    nicho: "Financeiro",
    numeros: [
      { label: "EPC piso", valor: "$2,00" },
      { label: "Negativas críticas", valor: "student, bad credit, no annual fee" },
      { label: "CTR alvo", valor: "≥ 2%" },
    ],
    oQueFuncionou: [
      "Lista de negativas homônimas aplicada antes do primeiro clique.",
      "Exata 'best credit card for high earners' em SKAG isolado.",
      "Presell com comparativo de 3 cartões + FAQ de taxas.",
    ],
    oQueComecarFazendo: [
      "Mapear homônimos do nicho financeiro antes de subir (banco Negativas).",
      "Nunca comprar 'free', 'trial', 'review' se a oferta não é de review.",
      "Medir match rate do postback diariamente.",
    ],
    comoEscalar: [
      "Só escalar STAG com postback estável > 90%.",
      "Renovar negativas semanalmente pelo search terms report.",
      "Testar Tier 2 quando CPC de US passar de $1,20.",
    ],
  },
];

export interface Ferramenta {
  nome: string;
  tipo: string;
  oQueFaz: string;
  papelNoFunil: string;
  licenca: string;
  url: string;
}

export const ferramentas: Ferramenta[] = [
  {
    nome: "EvoClick",
    tipo: "Tracker self-hosted (Go + Next.js)",
    oQueFaz:
      "Tracking de cliques em tempo real, smart routing com 14+ regras (país, device, OS, browser, ISP), postback URL, tokens dinâmicos {externalID}/{cost}, Traefik + PostgreSQL + Redis opcional.",
    papelNoFunil: "Gera o click_id, casa o postback da venda e alimenta o Google Ads.",
    licenca: "MIT",
    url: "https://github.com/ssousa455/evoclick",
  },
  {
    nome: "Dub.co",
    tipo: "Atribuição moderna de links",
    oQueFaz: "Encurtamento e atribuição de links com analytics de cliques.",
    papelNoFunil: "Alternativa leve ao tracker completo para começar.",
    licenca: "Open-source (core)",
    url: "https://github.com/aiagencynow/dub.co-link-sortner-tracker",
  },
  {
    nome: "affiliate-tracker-mvp",
    tipo: "MVP Node + SQLite",
    oQueFaz: "Gera link de rastreio, atribuição de clique e export CSV de payout em um único processo.",
    papelNoFunil: "Estudo mínimo do fluxo de atribuição para quem está aprendendo.",
    licenca: "MIT",
    url: "https://github.com/bensblueprints/affiliate-tracker-mvp",
  },
  {
    nome: "affiliate-skills",
    tipo: "Kit de 45 skills de IA",
    oQueFaz:
      "Skills para pesquisa, conteúdo, páginas, tracking e otimização — incluindo conversion-tracker e geração de hoplinks com tid por canal.",
    papelNoFunil: "Automatiza hoplink + presell_html com disclosure.",
    licenca: "MIT",
    url: "https://github.com/gingg7260/affiliate-skills",
  },
  {
    nome: "fb-gads-conversion-forwarder",
    tipo: "Forwarder de conversão",
    oQueFaz: "Escuta HTTP POST/GET e encaminha para Google Ads API Click Conversion Uploads.",
    papelNoFunil: "Ponte entre o postback da rede e o Google Ads.",
    licenca: "MIT",
    url: "https://github.com/rafaelolivra/fb-gads-conversion-forwarder",
  },
  {
    nome: "Qwen-Marketing",
    tipo: "LLM de marketing (Hugging Face)",
    oQueFaz:
      "Fine-tunado de Qwen3-8B em 10B+ tokens de marketing curado; contexto 32k; copy de produto em brand voice, variantes de campanha e landing pages.",
    papelNoFunil: "Motor de copy do Flow Engine (gera as 3 variações de presell).",
    licenca: "Apache 2.0",
    url: "https://huggingface.co/marketeam/Qwen-Marketing",
  },
  {
    nome: "claude-code-copywriting-skills",
    tipo: "Kit de copy + compliance",
    oQueFaz:
      "Skills de landing-page-copy (bridge pages) e compliance-checker que audita anúncios e landings contra políticas de Meta, Google, TikTok e ClickBank.",
    papelNoFunil: "Auditoria de compliance de cada presell gerada.",
    licenca: "MIT",
    url: "https://github.com/1webninja/claude-code-copywriting-skills",
  },
  {
    nome: "apify/google-search-scraper",
    tipo: "Scraper de SERP",
    oQueFaz: "Coleta resultados e anúncios pagos por keyword com focusOnPaidAds: true.",
    papelNoFunil: "Mineração: quem está anunciando está ganhando.",
    licenca: "Apache 2.0",
    url: "https://github.com/apify/awesome-skills",
  },
  {
    nome: "affiliate-dropshipping-keyword-research-scraper",
    tipo: "Scraper Node + Playwright",
    oQueFaz: "Extrai sinais de SERP do Google e dados de produto, pontuando intenção comercial, concorrência e oportunidade.",
    papelNoFunil: "Score de nicho/keyword antes de comprar clique.",
    licenca: "MIT",
    url: "https://github.com/ceoloo/affiliate-dropshipping-keyword-research-scraper",
  },
  {
    nome: "AnyTrack / wecantrack",
    tipo: "SaaS de conversão",
    oQueFaz:
      "Digistore24 envia conversão via postback URL; casa com sessão e repassa para Google Ads, Facebook e TikTok via Conversion API.",
    papelNoFunil: "Alternativa sem servidor ao postback self-hosted.",
    licenca: "Comercial",
    url: "https://anytrack.io",
  },
];

// Lista base de negativas — 120+ termos (universal + nicho)
export const negativasBase: { termo: string; tipo: string; motivo: string }[] = [
  // ---- Baixa intenção / gratuitidade ----
  { termo: "free", tipo: "baixa intenção", motivo: "Não paga — queima verba em fundo de funil" },
  { termo: "for free", tipo: "baixa intenção", motivo: "Intenção de gratuidade" },
  { termo: "free trial", tipo: "baixa intenção", motivo: "Freebie hunter" },
  { termo: "free sample", tipo: "baixa intenção", motivo: "Amostra grátis" },
  { termo: "trial", tipo: "baixa intenção", motivo: "Quer testar sem pagar" },
  { termo: "sample", tipo: "baixa intenção", motivo: "Amostra" },
  { termo: "giveaway", tipo: "baixa intenção", motivo: "Sorteio" },
  { termo: "download", tipo: "baixa intenção", motivo: "Busca arquivo, não produto" },
  { termo: "pdf", tipo: "baixa intenção", motivo: "Busca documento" },
  { termo: "torrent", tipo: "baixa intenção", motivo: "Pirataria" },
  { termo: "crack", tipo: "baixa intenção", motivo: "Pirataria" },
  { termo: "keygen", tipo: "baixa intenção", motivo: "Pirataria" },
  { termo: "serial key", tipo: "baixa intenção", motivo: "Pirataria" },
  { termo: "nulled", tipo: "baixa intenção", motivo: "Pirataria" },
  { termo: "cheap", tipo: "baixa intenção", motivo: "Caça de preço —CPA inviável" },
  { termo: "cheapest", tipo: "baixa intenção", motivo: "Caça de preço" },
  { termo: "discount code", tipo: "baixa intenção", motivo: "Só converte com cupom (quando não há)" },
  { termo: "coupon", tipo: "baixa intenção", motivo: "Cupom — margem comprimida" },
  { termo: "promo code", tipo: "baixa intenção", motivo: "Cupom" },
  { termo: "deal", tipo: "baixa intenção", motivo: "Promoção agressiva" },
  { termo: "clearance", tipo: "baixa intenção", motivo: "Liquidação" },

  // ---- Pesquisa / informação (topo de funil) ----
  { termo: "what is", tipo: "topo de funil", motivo: "Pergunta definicional, sem intenção de compra" },
  { termo: "how to", tipo: "topo de funil", motivo: "Busca tutorial" },
  { termo: "why", tipo: "topo de funil", motivo: "Pergunta conceitual" },
  { termo: "meaning", tipo: "topo de funil", motivo: "Definição" },
  { termo: "definition", tipo: "topo de funil", motivo: "Definição" },
  { termo: "wiki", tipo: "topo de funil", motivo: "Enciclopédia" },
  { termo: "wikipedia", tipo: "topo de funil", motivo: "Enciclopédia" },
  { termo: "reddit", tipo: "topo de funil", motivo: "Discussão, não compra" },
  { termo: "quora", tipo: "topo de funil", motivo: "Discussão" },
  { termo: "forum", tipo: "topo de funil", motivo: "Discussão" },
  { termo: "youtube", tipo: "topo de funil", motivo: "Busca vídeo" },
  { termo: "video", tipo: "topo de funil", motivo: "Busca vídeo" },
  { termo: "images", tipo: "topo de funil", motivo: "Busca imagem" },
  { termo: "pictures", tipo: "topo de funil", motivo: "Busca imagem" },
  { termo: "logo", tipo: "topo de funil", motivo: "Busca identidade visual" },
  { termo: "history", tipo: "topo de funil", motivo: "Contexto histórico" },
  { termo: "statistics", tipo: "topo de funil", motivo: "Dados" },
  { termo: "research", tipo: "topo de funil", motivo: "Pesquisa acadêmica" },
  { termo: "study", tipo: "topo de funil", motivo: "Pesquisa" },
  { termo: "examples", tipo: "topo de funil", motivo: "Exemplos" },
  { termo: "template", tipo: "topo de funil", motivo: "Busca modelo grátis" },
  { termo: "worksheet", tipo: "topo de funil", motivo: "Material educativo" },
  { termo: "lesson plan", tipo: "topo de funil", motivo: "Material educativo" },
  { termo: "course free", tipo: "topo de funil", motivo: "Curso gratuito" },
  { termo: "mooc", tipo: "topo de funil", motivo: "Curso aberto" },

  // ---- Carreira / renda (nichos que atraem cliques errados) ----
  { termo: "jobs", tipo: "fora de público", motivo: "Busca emprego, não produto" },
  { termo: "job", tipo: "fora de público", motivo: "Busca emprego" },
  { termo: "salary", tipo: "fora de público", motivo: "Expectativa salarial" },
  { termo: "career", tipo: "fora de público", motivo: "Carreira" },
  { termo: "hiring", tipo: "fora de público", motivo: "Recrutamento" },
  { termo: "internship", tipo: "fora de público", motivo: "Estágio" },
  { termo: "resume", tipo: "fora de público", motivo: "Currículo" },
  { termo: "cv", tipo: "fora de público", motivo: "Currículo" },
  { termo: "work from home jobs", tipo: "fora de público", motivo: "Emprego" },
  { termo: "make money online free", tipo: "fora de público", motivo: "Gratuidade + renda" },

  // ---- Review negativo / fraude ----
  { termo: "scam", tipo: "negativo", motivo: "Busca fraude — não converte" },
  { termo: "fake", tipo: "negativo", motivo: "Desconfiança" },
  { termo: "fraud", tipo: "negativo", motivo: "Fraude" },
  { termo: "complaint", tipo: "negativo", motivo: "Reclamação" },
  { termo: "complaints", tipo: "negativo", motivo: "Reclamações" },
  { termo: "lawsuit", tipo: "negativo", motivo: "Processo judicial" },
  { termo: "side effects", tipo: "negativo", motivo: "Efeitos colaterais — alto risco em saúde" },
  { termo: "warning", tipo: "negativo", motivo: "Alerta" },
  { termo: "recall", tipo: "negativo", motivo: "Recall de produto" },
  { termo: "bbb", tipo: "negativo", motivo: "Better Business Bureau" },
  { termo: "trustpilot", tipo: "negativo", motivo: "Site de review de terceiros" },

  // ---- Estudante / baixa renda (nichos financeiro) ----
  { termo: "student", tipo: "baixa intenção", motivo: "Público sem poder de compra" },
  { termo: "students", tipo: "baixa intenção", motivo: "Público sem poder de compra" },
  { termo: "bad credit", tipo: "baixa intenção", motivo: "Não qualifica para a oferta" },
  { termo: "no credit", tipo: "baixa intenção", motivo: "Sem crédito" },
  { termo: "no annual fee", tipo: "baixa intenção", motivo: "Busca isenção — não é o produto" },
  { termo: "no credit check", tipo: "baixa intenção", motivo: "Sem verificação" },
  { termo: "low income", tipo: "baixa intenção", motivo: "Fora do público" },
  { termo: "unemployed", tipo: "baixa intenção", motivo: "Fora do público" },
  { termo: "section 8", tipo: "baixa intenção", motivo: "Programa social" },
  { termo: "food stamps", tipo: "baixa intenção", motivo: "Programa social" },

  // ---- DIY / caseiro (nichos saúde) ----
  { termo: "diy", tipo: "baixa intenção", motivo: "Faça você mesmo — não compra" },
  { termo: "homemade", tipo: "baixa intenção", motivo: "Caseiro" },
  { termo: "home remedy", tipo: "baixa intenção", motivo: "Remédio caseiro" },
  { termo: "natural remedy", tipo: "baixa intenção", motivo: "Remédio natural" },
  { termo: "at home", tipo: "baixa intenção", motivo: "Caseiro" },
  { termo: "recipe", tipo: "baixa intenção", motivo: "Receita caseira" },
  { termo: "ingredients at home", tipo: "baixa intenção", motivo: "Ingredientes caseiros" },

  // ---- Sistema de saúde público (nichos saúde) ----
  { termo: "sus", tipo: "homônima", motivo: "Sistema Único de Saúde (PT-BR) — homônimo" },
  { termo: "nhs", tipo: "homônima", motivo: "National Health Service (UK) — saúde pública" },
  { termo: "medicare", tipo: "fora de público", motivo: "Programa de saúde dos EUA" },
  { termo: "medicaid", tipo: "fora de público", motivo: "Programa de saúde dos EUA" },
  { termo: "insurance", tipo: "fora de público", motivo: "Seguro saúde (nichos não relacionados)" },
  { termo: "clinic near me", tipo: "fora de público", motivo: "Busca serviço local" },
  { termo: "pharmacy", tipo: "fora de público", motivo: "Farmácia" },
  { termo: "farmácia", tipo: "fora de público", motivo: "Farmácia (PT)" },
  { termo: "preço", tipo: "baixa intenção", motivo: "Comparação de preço agressiva" },
  { termo: "valor", tipo: "baixa intenção", motivo: "Comparação de preço" },

  // ---- Idioma / geografia errada ----
  { termo: "en español", tipo: "idioma errado", motivo: "Público hispânico em campanha EN" },
  { termo: "auf deutsch", tipo: "idioma errado", motivo: "Público alemão em campanha EN" },
  { termo: "em português", tipo: "idioma errado", motivo: "Público BR em campanha EN" },
  { termo: "in english", tipo: "idioma errado", motivo: "Reforço de idioma" },
  { termo: "translate", tipo: "idioma errado", motivo: "Tradução" },
  { termo: "translation", tipo: "idioma errado", motivo: "Tradução" },

  // ---- Marca de terceiros / concorrência (quando proibido) ----
  { termo: "walmart", tipo: "marca proibida", motivo: "Marketplace — política de marca" },
  { termo: "amazon", tipo: "marca proibida", motivo: "Marketplace — política de marca" },
  { termo: "ebay", tipo: "marca proibida", motivo: "Marketplace — política de marca" },
  { termo: "costco", tipo: "marca proibida", motivo: "Marketplace — política de marca" },
  { termo: "cvs", tipo: "marca proibida", motivo: "Farmácia — política de marca" },
  { termo: "walgreens", tipo: "marca proibida", motivo: "Farmácia — política de marca" },
  { termo: "gnc", tipo: "marca proibida", motivo: "Varejista — política de marca" },
  { termo: "clickbank", tipo: "marca proibida", motivo: "Rede concorrente" },
  { termo: "jvzoo", tipo: "marca proibida", motivo: "Rede concorrente" },
  { termo: "warriorplus", tipo: "marca proibida", motivo: "Rede concorrente" },
  { termo: "hotmart", tipo: "marca proibida", motivo: "Rede concorrente" },
  { termo: "eduzz", tipo: "marca proibida", motivo: "Rede concorrente" },

  // ---- Dispositivo / técnico ----
  { termo: "apk", tipo: "baixa intenção", motivo: "App android — não é o produto" },
  { termo: "app", tipo: "baixa intenção", motivo: "Aplicativo" },
  { termo: "login", tipo: "baixa intenção", motivo: "Acesso a conta" },
  { termo: "sign in", tipo: "baixa intenção", motivo: "Acesso a conta" },
  { termo: "customer service", tipo: "fora de público", motivo: "Suporte" },
  { termo: "phone number", tipo: "fora de público", motivo: "Telefone" },
  { termo: "address", tipo: "fora de público", motivo: "Endereço" },
  { termo: "hours", tipo: "fora de público", motivo: "Horário de funcionamento" },
  { termo: "near me", tipo: "fora de público", motivo: "Intenção local (não cold Tier 1)" },
  { termo: "in store", tipo: "fora de público", motivo: "Loja física" },
  { termo: "store locator", tipo: "fora de público", motivo: "Localizador de loja" },

  // ---- Suplementos: alegações proibidas ----
  { termo: "cure", tipo: "claim proibido", motivo: "Alegação de cura — risco FDA" },
  { termo: "cures", tipo: "claim proibido", motivo: "Alegação de cura" },
  { termo: "treat", tipo: "claim proibido", motivo: "Alegação de tratamento" },
  { termo: "treatment", tipo: "claim proibido", motivo: "Alegação de tratamento" },
  { termo: "diagnose", tipo: "claim proibido", motivo: "Alegação médica" },
  { termo: "prevent disease", tipo: "claim proibido", motivo: "Alegação médica" },
  { termo: "weight loss pill fda", tipo: "claim proibido", motivo: "Regulação FDA" },
  { termo: "prescription", tipo: "claim proibido", motivo: "Medicamento controlado" },
  { termo: "dosage", tipo: "claim proibido", motivo: "Posologia — risco" },
  { termo: "overdose", tipo: "negativo", motivo: "Segurança" },

  // ---- Homonímias comuns de nicho (exemplos) ----
  { termo: "meridian", tipo: "homônima", motivo: "Banco vs produto — verificar nicho" },
  { termo: "vital", tipo: "homônima", motivo: "Genérico — múltiplos produtos" },
  { termo: "pro", tipo: "homônima", motivo: "Sufixo genérico" },
  { termo: "one", tipo: "homônima", motivo: "Genérico" },
  { termo: "flow", tipo: "homônima", motivo: "Genérico (state, app, marca)" },
  { termo: "prime", tipo: "homônima", motivo: "Amazon Prime / genérico" },
  { termo: "nova", tipo: "homônima", motivo: "Genérico / marca" },
  { termo: "alpha", tipo: "homônima", motivo: "Genérico" },
  { termo: "ultra", tipo: "homônima", motivo: "Genérico" },
  { termo: "max", tipo: "homônima", motivo: "Genérico / HBO Max" },
  { termo: "plus", tipo: "homônima", motivo: "Genérico / Disney Plus" },
  { termo: "go", tipo: "homônima", motivo: "Genérico" },
  { termo: "fit", tipo: "homônima", motivo: "Genérico" },
  { termo: "pure", tipo: "homônima", motivo: "Genérico" },
  { termo: "pro fit", tipo: "homônima", motivo: "Marca vs genérico" },
];

export const fluxoPostback = [
  {
    passo: 1,
    titulo: "Clique no anúncio Google",
    detalhe: "gclid anexado à URL da presell (auto-tagging + UTM template no nível conta).",
  },
  {
    passo: 2,
    titulo: "Clique no CTA da presell",
    detalhe: "Tracker (EvoClick/Dub) gera o click_id e redireciona para o hoplink.",
  },
  {
    passo: 3,
    titulo: "click_id no subID da rede",
    detalhe: "Hoplink carrega ?tid=...&subId1={click_id} — confira o nome do token no suporte da rede.",
  },
  {
    passo: 4,
    titulo: "Compra no merchant",
    detalhe: "A rede segura o click_id atrelado à transação.",
  },
  {
    passo: 5,
    titulo: "Rede dispara o postback",
    detalhe: "/postback?pid={click_id}&payout={amount}&txid={transaction_id}&status={status}",
  },
  {
    passo: 6,
    titulo: "Tracker casa o click_id",
    detalhe: "Match com a sessão original e recuperação do gclid guardado.",
  },
  {
    passo: 7,
    titulo: "Envio ao Google Ads",
    detalhe: "Conversion API (Click Conversions) com valor, transaction ID e status.",
  },
  {
    passo: 8,
    titulo: "Smart Bidding alimentado",
    detalhe: "Google otimiza para venda. Conversão aparece em até 3h (last-click).",
  },
];

export const templateNotion = [
  {
    banco: "Ofertas",
    descricao:
      "Banco mestre de prospecção. Nenhuma oferta entra em teste sem score ≥ 70. Campos: Nicho, Rede, Hoplink+subID, Preço front, Comissão %, Comissão líquida (fórmula), EPC, Conversão checkout, Gravity, AOV bundle, Volume de buscas, Concorrência SERP, Restrição de marca, Frequência de pagamento, Score (fórmula 0–100), Status.",
    linhas: 3,
  },
  {
    banco: "Campanhas",
    descricao:
      "Controle de campanhas ativas. Campos: Nome, Oferta (relação), Tipo (SKAG/STAG), Orçamento/dia, CPC médio, CTR, Impressões, Cliques, Conversões, CPA, ROAS, CPA alvo, Status, Próxima ação, Data revisão search terms.",
    linhas: 2,
  },
  {
    banco: "Negativas Homônimas",
    descricao:
      "Lista base 120+ termos (baixa intenção, topo de funil, fora de público, marca proibida, homônimas, claims proibidos) + termos do seu nicho. Campos: Termo, Tipo, Match, Motivo, Aplicar em, Data.",
    linhas: 0, // gerado dinamicamente (lista completa)
  },
  {
    banco: "Tracking",
    descricao:
      "Engenharia de atribuição. Campos: click_id, gclid, subID, rede, postback URL, token usado, transaction ID, status (approved/pending/reversed), match rate, data.",
    linhas: 2,
  },
  {
    banco: "Presells",
    descricao:
      "Biblioteca de páginas geradas. Campos: URL, Oferta (relação), Tipo (Review/Robusta/Pop-up), Idioma, Compliance score, Variação (A/B/C), Status, Data.",
    linhas: 2,
  },
  {
    banco: "Rotina 15min",
    descricao:
      "Checklist diário com regras de decisão. Campos: Data, Impressões=0?, CTR<2%?, CPC estourou?, 1,5x CPA sem conversão?, ROAS>1,5?, Search terms revisado?, Match rate ≥90%?, Diagnóstico, Ação tomada, Resultado.",
    linhas: 2,
  },
];
