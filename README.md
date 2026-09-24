# Amigo do Afiliado na Gringa — Mina de Tesouro

Plataforma full-stack que reúne **três produtos integrados**:

1. **Masterclass em 6 fases** (26 aulas didáticas) — mineração de ofertas, presell blindada, campanha Google Ads fundo de funil, tracking offline por postback, rotina de gestão e arquitetura de entregáveis.
2. **Flow Engine** — clone do conceito do Flow Pages: gerador de **presells validadas com IA** (review, robusta, advertorial, pop-up de idade, pop-up de captcha), em HTML pronto para copiar/colar no seu domínio, com **auditoria de compliance** (Destination Requirements do Google Ads) pontuada de 0 a 100.
3. **Template Notion completo** — 6 bancos de dados (Ofertas com score 0–100, Campanhas, Negativas Homônimas com 120+ termos, Tracking, Presells, Rotina 15min) exportáveis em CSV para importar direto no Notion.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** (tema dark/premium)
- Persistência em **JSON** em `data/` (zero dependências nativas, funciona em qualquer hospedagem)
- Autenticação própria: **scrypt** + cookie de sessão `HttpOnly`
- LLM **pluggable** (OpenAI-compatible, Groq ou Anthropic) com **fallback determinístico local**

## Rodando

```bash
npm install
npm run dev      # http://localhost:3000
```

Build de produção:

```bash
npm run build
npm start
```

## Configurando a LLM (opcional)

Sem chave, o Flow Engine roda no **motor local determinístico** (mesma estrutura, pools de copy por nicho e idioma). Para geração por LLM real, copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

| Variável | Exemplo | Descrição |
| --- | --- | --- |
| `LLM_PROVIDER` | `openai` | `openai` (compatível), `groq` ou `anthropic` |
| `LLM_API_KEY` | `sk-...` | Chave da API. Sem ela, modo local |
| `LLM_MODEL` | `gpt-4o-mini` | Modelo usado |
| `LLM_BASE_URL` | `https://api.groq.com/openai/v1` | Endpoint (para Groq, Together, OpenRouter, Ollama etc.) |

O contrato de saída da LLM é JSON com as seções da presell (headline, abertura, benefícios, componentes, passo a passo, depoimentos, comparação, FAQ, oferta, veredito, CTAs). Se a resposta não validar, o sistema cai automaticamente no motor local.

## Estrutura

```
src/
  app/
    page.tsx                     Home (vitrine + cases + stack)
    curso/                       Roadmap, fases e aulas (SSG)
    metricas/                    Painel de métricas e cases validados
    rotina/                      Checklist 15min + árvore de diagnóstico + calculadora
    flow/                        Flow Engine (gerador) + biblioteca
    notion/                      Template Notion + exportação
    login/ registrar/            Auth
    api/
      generate/                  POST — gera presells (LLM ou local)
      presells/  [id]/           CRUD da biblioteca (autenticado)
      progress/                  Progresso das aulas (autenticado)
      export/notion/             CSV/MD do template
      auth/*                     login / registrar / logout
  lib/
    generator.ts                 Motor de render HTML das presells + pop-ups
    copy.ts                      Dicionários de copy pt/en/es/de × 5 nichos
    compliance.ts                Auditoria de Destination Requirements
    llm.ts                       Cliente LLM pluggable
    notion.ts                    Geração dos CSVs do template
    db.ts  auth.ts               Persistência JSON e sessões
  content/
    curso*.ts                    26 aulas em 6 fases
    dados.ts                     Métricas, cases, ferramentas, 120+ negativas
```

## O que é validado em cada página

| Página | O que entrega |
| --- | --- |
| `/curso` | Roadmap com progresso (localStorage + nuvem quando logado) |
| `/curso/[fase]/[aula]` | Aula com objetivo, SOP numerado, checklist interativo, erros comuns, quick win |
| `/metricas` | EPC $3,81, checkout 53,5%, AOV $130–300, comissão 50–85%, fluxo de postback em 8 passos |
| `/rotina` | Checklist diário, diagnóstico de 0 impressões/CTR/CPC, regras de pause-scale-kill, calculadora de CPA/ROAS |
| `/flow` | Geração de 1–3 presells, preview em iframe, score de compliance, copiar/baixar HTML, salvar na biblioteca |
| `/notion` | Exportação dos 6 bancos em CSV + guia mestre em Markdown |

## Compliance das presells geradas

Cada página recebe nota 0–100 em 10 regras: 600+ palavras originais, affiliate disclosure, disclaimer, FAQ 5+, tabela de comparação, 3+ depoimentos, 2+ CTAs, H1 específico, sem redirect automático e links `rel="sponsored nofollow"`. Pop-ups têm auditoria própria (botão de ação, link de destino, sem auto-redirect, textos completos, slot de tracking).

## Aviso

Conteúdo educacional. Métricas citadas são dados de campo/backoffice e não constituem promessa de resultado. Não há vínculo com a ferramenta de mercado citada como referência de funcionalidade.
