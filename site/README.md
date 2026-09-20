# Xpressya — blog de home wellness (xpressya.com)

Site estático (HTML puro, sem WordPress) — carrega em < 1 s, zero manutenção de plugin, hospeda em qualquer plano Hostinger.

## Rodar
```bash
cd site && npm install && npm run build   # gera dist/
npm run serve                             # preview local
```

## Publicar na Hostinger (Business/Unlimited)
1. `npm run build`
2. hPanel → Gerenciador de arquivos (ou FTP) → envie o **conteúdo** de `dist/` para `public_html/` do domínio xpressya.com.
3. Ative SSL grátis e "Forçar HTTPS" no hPanel. Pronto.
   - Alternativa: hPanel → Git → aponte para este repo/branch com "diretório de deploy" = `site/dist` (ou rode o build via cron/SSH).

## Ativar links de afiliado (fazer ANTES de divulgar)
| Programa | Onde | O que fazer no projeto |
|---|---|---|
| **Amazon Associados** | associados.amazon.com.br (grátis, CPF; precisa de 3 vendas em 180 dias) | copie seu ID (ex.: `xpressya-20`) em `data/config.json` → `"amazon_tag"`. O build anexa `?tag=` em todos os links da Amazon. |
| **Mercado Livre Afiliados** | mercadolivre.com.br/afiliados → "Gerador de links" | cole a URL do produto, gere o link e coloque em `data/products.json` → campo `ml_afiliado` daquele produto. Se vazio, o site usa a busca normal do ML. |
| GA4 | analytics.google.com | ID `G-XXXX` em `config.json` → `"ga4"`. Cliques nos botões viram evento `affiliate_click`. |

Comissões de referência 2026: Amazon 1–15 % por categoria, cookie 24 h; Mercado Livre paga na conta Mercado Pago em até 60 dias.

## Adicionar conteúdo
- **Post:** novo `.md` em `content/posts/` com o cabeçalho (`title, desc, date, cat, tags`). Dentro do texto use `{{produto:id}}` ou `{{produtos:id1,id2}}` para inserir cards com botões ML + Amazon.
- **Produto:** novo objeto em `data/products.json` (id, cat, nome, marca, faixa, ticket, amazon, ml, ml_afiliado, destaque, resumo).
- **Categoria:** em `data/config.json` → `categorias`.

## Estrutura
```
site/
  build.js          gerador (Node, ~150 linhas)
  data/config.json  nome, url, tag Amazon, GA4, categorias, disclosure
  data/products.json  32 produtos com links ML + Amazon
  content/posts/*.md  9 artigos iniciais
  public/           css, favicon
  dist/             saída (não versionada)
```

## Regras editoriais (para não perder conta de afiliado nem ser derrubado)
- Disclosure de afiliado visível em toda página (já está no rodapé e no topo dos posts).
- Nunca exibir preço fixo da Amazon no texto (política deles); use faixas.
- `rel="nofollow sponsored"` em todos os links (já aplicado).
- Só recomendar produtos com Anatel/Inmetro quando exigido.
