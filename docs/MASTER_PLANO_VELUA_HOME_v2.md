# Master Plano v2 — Veluá Home (Home Wellness & Smart)

**Stack fixa:** Hostinger (WordPress) + WooCommerce · Bling ERP como hub → Mercado Livre + Amazon · Mercado Pago (checkout) · Melhor Envio (frete).
**Sem:** Bling? não — *Bling fica* (é o hub mais barato). **Sem Accio, sem Shopify, sem Nuvemshop.**
**Data de referência:** setembro/2026. Valores em BRL; preços de terceiros conferidos em fontes públicas (ver §11) e sujeitos a mudança — recontratar sempre olhando a página oficial.

> **Sobre "FF 3 cliques":** interpretei como *fluxo de compra em 3 cliques* (página do produto → "Comprar agora" → "Pagar"). Está detalhado em §4.3. Se você quis dizer outra coisa (ex.: "Fast Funnel"), me avise e eu ajusto.

---

## 0. O que mudou em relação ao plano v1 (e por quê)

| Item do plano v1 | Problema | Decisão v2 |
|---|---|---|
| Nuvemshop Next | Custo alto, dependência de plataforma, você pediu Hostinger + WooCommerce | **WooCommerce na Hostinger** — custo fixo ~R$14–65/mês, dono do código e dos dados |
| Accio Work + 1688 como motor de sourcing | Produtos Wi-Fi/BT importados **exigem homologação Anatel** e eletrodomésticos exigem **Inmetro (Portaria 371)**; sem isso a carga fica retida e o anúncio pode ser derrubado no ML/Amazon | **Fase 1–2: 100% fornecedores nacionais já homologados.** Importação só na Fase 3 e só de itens *sem rádio e fora do Inmetro compulsório* (ver §6) |
| Cases da Nuvemshop como "validação" | São cases de plataforma, não do nicho | Validação passa a ser **sua**: 30 vendas piloto com margem medida por SKU (ver §8) |
| Portfólio de 5 SKUs (R$650–4.500) | Ticket alto demais para começar sem reputação no ML | **Portfólio em 3 camadas** (entrada / meio / alto ticket) para construir reputação e girar caixa (§5) |
| "Tesla Master Plan" com metas de R$55M | Não ancorado em custo | Metas ancoradas em **margem por pedido e caixa** (§8, §9) |

---

## 1. Arquitetura da operação (uma fonte de verdade)

```
                 ┌─────────────────────────────────────────┐
                 │  BLING ERP  (estoque, preço, NF-e, pedidos) │  ← fonte única de verdade
                 └───────┬───────────────┬─────────────┬───┘
                         │               │             │
              ┌──────────▼───┐   ┌───────▼──────┐  ┌───▼────────┐
              │ WooCommerce  │   │ Mercado Livre│  │  Amazon BR │
              │ (Hostinger)  │   │              │  │            │
              └──────┬───────┘   └──────────────┘  └────────────┘
                     │
        ┌────────────┼──────────────┐
        │            │              │
  Mercado Pago   Melhor Envio   WhatsApp/Meta Pixel/GA4
  (Pix/cartão)   (etiquetas)    (marketing)
```

Regra de ouro: **produto, preço e estoque nascem no Bling** e são empurrados para os 3 canais. Pedido de qualquer canal cai no Bling → NF-e → etiqueta (Melhor Envio) → baixa de estoque em todos os canais. Isso evita vender no ML o que acabou no site.

---

## 2. Hostinger — qual plano e quando subir

A Hostinger BR hoje vende os planos WordPress **Single / Premium / Unlimited (ex-"Business") / Cloud Startup**. O plano que você chama de "Business" corresponde ao **Unlimited/Business + IA**:

| Plano | Promo (48 m) | Renovação | Recursos relevantes p/ Woo | Quando usar |
|---|---|---|---|---|
| **Business/Unlimited + IA** | **R$ 13,99/mês** (R$ 671,52 à vista) | R$ 64,99/mês | 50 GB NVMe, backup diário, CDN, LiteSpeed, staging, ~100 mil visitas/mês, ~30 entry processes | **Fase 0 → ~R$ 100k/mês de faturamento** |
| Cloud Startup + IA | R$ 39,99/mês | R$ 129,99/mês | 100 GB NVMe, 3 GB RAM dedicada, 100 PHP workers, IP dedicado | Quando o site passar de ~5–7 mil visitas/mês *simultâneas de campanha* ou > 5 plugins pesados |

Fontes: página oficial de hospedagem WordPress da Hostinger (preços e renovação) e comparativos 2026 [H1][H2][H3].

**Recomendação:** contratar **Business/Unlimited 12 ou 24 meses** (não 48 — o negócio pode pedir Cloud em 6 meses). Domínio `.com.br` incluso 1 ano (depois ~R$ 40/ano no Registro.br).

**Configuração mínima de performance (grátis):** LiteSpeed Cache (já vem), Object Cache (Redis, disponível no hPanel), imagens WebP, PHP 8.3, desativar cron do WP e usar cron do hPanel, limitar plugins a ≤ 15.

---

## 3. Stack WooCommerce — "melhor valor" (custo total ≈ R$ 0–90/mês além da hospedagem)

| Camada | Plugin / serviço | Custo | Por que este |
|---|---|---|---|
| Loja | WooCommerce | grátis | padrão |
| Tema | **Astra** ou **Kadence** (free) + Elementor free *ou* editor de blocos | grátis (Pro opcional R$ 250–300/ano) | leve, compatível com Core Web Vitals |
| Campos BR (CPF/CNPJ, bairro, nº) | **Brazilian Checkout Toolkit for WooCommerce** (oficial Woo, 2026) ou *BuildsByLuke Checkout Brasil* (suporta CNPJ alfanumérico jul/2026) | grátis | o antigo "Brazilian Market" está sem manutenção [W1][W2] |
| Checkout 1 página | **Fluid Checkout Lite** (free) | grátis (Pro ~US$ 99/ano opcional) | reduz campos, salva progresso, mobile-first |
| Botão "Comprar agora" (pula carrinho) | **Direct Checkout for WooCommerce** (free) ou snippet `?add-to-cart=ID&quantity=1` redirecionando p/ `/checkout` | grátis | base do fluxo 3 cliques |
| Pagamentos | **Mercado Pago para WooCommerce** (oficial) | sem mensalidade · Pix 0,99% · cartão ~4,99% à vista (parcelado: taxa maior ou juros ao cliente) · boleto R$ 3,49 [P1][P2] | mesma conta recebe do ML; Pix instantâneo |
| Pagamento alternativo (Pix mais barato) | Asaas (Pix R$ 1,99 fixo, boleto R$ 1,99) [P2] | sem mensalidade | ativar na Fase 2 se Pix > 40% dos pedidos |
| Frete | **Melhor Envio** (plugin oficial) | sem mensalidade, paga por etiqueta (Correios, Jadlog, Loggi, Buslog…) [F1] | sem contrato próprio, até ~80% de desconto |
| Frete B (fallback) | Frenet ou Virtuaria Correios (modo básico) | grátis / plano | cotação Correios mesmo sem contrato [F2] |
| ERP/Hub | **Bling** — plano Cobalto | R$ 55–60/mês (até 200 pedidos importados/mês) [B1][B2][B3] | NF-e, estoque, integra Woo + ML + Amazon + Melhor Envio |
| ERP quando escalar | Bling Mercúrio/Titânio F1 (500 pedidos) → Titânio (2.000) | R$ 110–120 → R$ 185–200/mês [B1][B3] | subir só quando bater 80% do limite |
| E-mail transacional | Hostinger Reach (incluído) ou Brevo free (300/dia) | grátis | recuperação de carrinho |
| Analytics | GA4 + Meta Pixel + Google Tag Manager; plugin "Site Kit" | grátis | |
| SEO | Rank Math free | grátis | schema Product, sitemap |
| Segurança/Backups | Backup diário da Hostinger + Wordfence free | grátis | |
| Reviews com foto/vídeo | Judge.me free ou WP Customer Reviews | grátis | prova social p/ alto ticket |
| WhatsApp | Botão "Joinchat" + catálogo WhatsApp Business | grátis | canal de fechamento p/ ticket > R$ 1.500 |

**Custo recorrente do stack (Fase 0):** hospedagem R$ 13,99 + Bling R$ 55 + Amazon Profissional R$ 19 = **≈ R$ 88/mês** + taxas por venda.

### 3.1 Por que Bling e não plugin direto WooCommerce↔ML
Existem plugins diretos (WooSync ~US$ 89/ano; plugins da Fabrica de Plugins R$ 399 pagamento único) [M1][M2], mas eles **não emitem NF-e** e não cobrem Amazon. Você precisaria de um emissor de nota de qualquer jeito (≥ R$ 30–50/mês). O Bling faz tudo por R$ 55 e é o hub mais usado do país, com integração ML/Amazon nativa e configuração automática de taxas por canal [B1][B3]. Alternativa equivalente: **Tiny (Olist) Avance R$ 59/mês** — porém integrações via API só do plano *Construa* (R$ 159) em diante [T1][T2]. → **Bling Cobalto.**

---

## 4. O site: estrutura e o fluxo de 3 cliques

### 4.1 Nome / domínio
Manter **Veluá Home** (`veluahome.com.br`). Registrar marca no INPI (classe 35 comércio + 11/10 conforme produtos) — ver custos em §10.

### 4.2 Arquitetura de páginas
- **Home:** vídeo hero 6–8 s (autoplay mudo, WebM ≤ 1 MB), 3 selos (NF-e · garantia do fabricante · envio 24 h), 3 blocos de categoria, prova social (reviews com foto), FAQ curto.
- **Categorias (Fase 0–1):** Bem-estar & Massagem · Segurança Smart · Casa Conectada · Ar & Clima · Cozinha Saudável · Fitness em Casa · Sono.
- **Página de produto (template único):** galeria + vídeo 15 s, preço à vista Pix (destaque) e "12x de R$ X", frete calculado inline, **botão "Comprar agora"** acima da dobra, comparativo de modelos (tabela), avaliações, FAQ do produto, "Fale no WhatsApp".
- **Conteúdo/SEO:** 2 artigos/semana ("fechadura digital vale a pena", "cadeira de massagem x poltrona", "iluminação circadiana") com link interno para produto.
- **Institucional obrigatório:** Trocas & Devoluções (CDC art. 49: 7 dias), Política de Privacidade (LGPD), Termos, Garantia, Contato com CNPJ e endereço no rodapé.

### 4.3 Fluxo de compra em 3 cliques
1. **Clique 1 — "Comprar agora"** na página do produto → adiciona ao carrinho *e* redireciona para `/checkout` (Direct Checkout).
2. **Clique 2 — "Continuar"** após preencher e-mail + CEP + CPF (Fluid Checkout, autocompletar endereço via ViaCEP, login opcional). Cliente recorrente: já preenchido.
3. **Clique 3 — "Pagar com Pix"** (QR gerado na hora, Mercado Pago) ou "Pagar com cartão" (checkout transparente, sem sair do site).

Medir: taxa de abandono por etapa no GA4 (evento `begin_checkout` → `add_payment_info` → `purchase`). Meta: **abandono < 60 %** (média BR ≈ 70–80 %).

---

## 5. Portfólio ampliado — 3 camadas, 100 % nacional nas Fases 0–2

Critérios: (1) fornecedor nacional com Anatel/Inmetro já resolvidos; (2) NF de compra; (3) margem bruta mínima 30 % após taxa do canal; (4) peso ≤ 30 kg (fora disso, só site + Mercado Envios Flex/coleta).

### Camada A — Entrada (R$ 59–350) → volume, reputação no ML/Amazon, isca do funil
| SKU | Produto | Fornecedor(es) nacionais | Ticket alvo |
|---|---|---|---|
| A-01 | Lâmpada Wi-Fi RGB (Positivo / Elgin / Intelbras EWS) | Fujioka Distribuidor (Goiânia — CNPJ) [D1][D2], Mazer, Make | R$ 69–99 |
| A-02 | Tomada / interruptor smart | Fujioka, distribuidores Intelbras | R$ 79–149 |
| A-03 | Controle universal IR Wi-Fi (Positivo) | Fujioka | R$ 99–149 |
| A-04 | Massageador de pescoço Shiatsu (Relaxmedic / Multilaser Serene) | Relaxmedic B2B, distribuidores Multilaser (mín. R$ 600) [D3] | R$ 199–349 |
| A-05 | Pistola de massagem (Relaxmedic / Multilaser) | idem | R$ 249–399 |
| A-06 | Umidificador ultrassônico / difusor | Multilaser, Mondial, Elgin | R$ 99–199 |
| A-07 | Kit Casa Conectada Positivo (lâmpada + tomada + controle) | Fujioka | R$ 299–349 |
| A-08 | Acessórios wellness não elétricos (tapete yoga, faixa elástica, rolo de liberação) | nacional agora; **importável na Fase 3** | R$ 59–149 |

### Camada B — Meio (R$ 350–1.500) → onde está a margem do dia a dia
| SKU | Produto | Fornecedor | Ticket |
|---|---|---|---|
| B-01 | Fechadura digital Intelbras FR 101 / FR 201 (sem Wi-Fi) | Fujioka, Mazer, Martins | R$ 449–799 |
| B-02 | Fechadura smart Intelbras IFR 7001+ / FR 620 (Wi-Fi) | idem | R$ 899–1.400 |
| B-03 | Câmera Wi-Fi Intelbras iM3/Mibo + campainha | idem | R$ 299–599 |
| B-04 | Air fryer forno digital 12–25 L (Mondial / Philco / Electrolux) | distribuidores eletro (Fujioka, Hayamax) | R$ 599–1.200 |
| B-05 | Purificador de ar com HEPA (Electrolux / Philco / Multilaser) | idem | R$ 699–1.500 |
| B-06 | Massageador de pés / pernas (Relaxmedic) | Relaxmedic B2B | R$ 499–999 |
| B-07 | Bicicleta ergométrica / esteira compacta dobrável (Dream, Kikos, WCT) | distribuidores fitness | R$ 899–1.500 |
| B-08 | Kit Segurança (fechadura + câmera + lâmpada) — **kit próprio** | montagem interna (Bling suporta kits) | R$ 1.199–1.699 |

### Camada C — Alto ticket (R$ 1.500–4.500) → margem absoluta, venda assistida via WhatsApp
| SKU | Produto | Fornecedor | Ticket |
|---|---|---|---|
| C-01 | Poltrona/cadeira de massagem Relaxmedic | Relaxmedic B2B | R$ 2.400–4.500 |
| C-02 | Esteira elétrica com app (Dream / Kikos) | distribuidor fitness | R$ 1.900–3.200 |
| C-03 | Kit Bem-Estar (poltrona + massageador pés + umidificador) | kit próprio | R$ 2.999–4.999 |
| C-04 | Kit Casa Inteligente completo (IFR 7001 + 2 câmeras + 4 lâmpadas + hub) | kit próprio | R$ 1.999–2.999 |

**Meta de sortimento:** Fase 0 = 15 SKUs (8 A, 5 B, 2 C). Fase 1 = 40 SKUs. Fase 2 = 80–120 SKUs. **Regra:** só entra SKU novo se o anterior girou ≥ 1x/mês ou for insumo de kit.

### 5.1 Onde comprar (Goiânia primeiro — frete e prazo)
- **Fujioka Distribuidor** — atacado CNPJ, sede em Goiânia, marcas Intelbras, Positivo, Philips, Panasonic, JBL; frete grátis p/ CNPJ em várias linhas, cartão 10x / BNDES [D1][D2].
- **Mazer / Make / Martins** — distribuidores Intelbras nacionais (segunda cotação).
- **Relaxmedic** — cadastro de revendedor direto (CNPJ + IE).
- **Multilaser** — cadastro de revendedor, pedido mínimo ~R$ 600, frete CIF [D3].
- **Mondial / Philco / Electrolux** — via distribuidores eletro regionais (Hayamax, Fujioka).
- Sempre pedir **tabela de revenda + prazo + política de RMA/garantia** por escrito antes de cadastrar SKU.

---

## 6. Sourcing internacional — quando e como (Fase 3, não antes)

**Barreiras reais para o que estava no plano v1:**
1. **Anatel** — tudo com Wi-Fi/Bluetooth/Zigbee (fechadura smart, lâmpada, tomada, câmera) exige homologação prévia à importação; Anatel pode reter na alfândega e multar importador/vendedor; plataformas (ML/Amazon) têm dever de diligência e derrubam anúncio [A1][A2][A3]. Certificação de um modelo custa tipicamente **R$ 8–30 mil** (laboratório + OCD) e leva 45–90 dias — só compensa com volume próprio de marca.
2. **Inmetro Portaria 371/2009** — eletrodomésticos (fritadeira, massageador elétrico, umidificador, ventilador etc.) têm certificação compulsória; importação exige LI com certificado antes do embarque [I1][I2]. Custo típico **R$ 15–50 mil por família** + ensaios anuais.
3. **Tributação formal** — II 0–35 % + IPI + PIS/COFINS 11,75 % + ICMS (GO 19 %); carga total 50–130 % sobre FOB; despachante R$ 800–2.500/processo; operação só compensa acima de US$ 3–5 mil por embarque; exige **Radar Siscomex** no CNPJ [C1][C2].

**Portanto, na Fase 3 importar somente:**
- Itens **sem rádio e fora do Inmetro compulsório**: tapetes, rolos, faixas, acessórios de organização, capas, suportes, luminárias LED *não conectadas* (verificar NCM), difusores a vela, etc.
- Ou **marca própria** de 1–2 SKUs campeões com certificação própria, quando o giro justificar (≥ 300 un/mês).
- Alternativa sem Radar: importadores **DDP** (ex.: JoomPro) entregam desembaraçado — custo unitário maior, mas zero burocracia [C3].

Substituto do Accio: planilha de landed cost (incluída em `docs/calculadora_margem.csv`) + cotação em Alibaba com Trade Assurance. Agente de 1688 só depois de 2 importações bem-sucedidas.

---

## 7. Marketplaces — custos reais e como integrar

| Canal | Mensalidade | Comissão | Extras | Integração |
|---|---|---|---|---|
| **Mercado Livre** | R$ 0 | Clássico 10–14 % · Premium 15–19 % (12x s/ juros) [ML1][ML2] | custo variável por peso em itens < R$ 79; frete grátis obrigatório acima de R$ 79 com subsídio por reputação | Bling (nativo) |
| **Amazon BR** | **R$ 19/mês** (Profissional) [AM1][AM2] | 8–15 % por categoria | FBA opcional | Bling (nativo) |
| Shopee (Fase 2) | R$ 0 | 14–20 % + taxa fixa | ruim p/ ticket alto | Bling |
| Magalu (Fase 2) | R$ 0 | 14,8–20 % | bom p/ eletro | Bling |

**Estratégia por camada:** Camada A → ML Clássico + Amazon (volume, reputação). Camada B → ML Premium (12x) + Amazon + site. Camada C → **site + WhatsApp** prioritariamente (comissão 15–19 % em R$ 3.000 = R$ 450–570 por venda; no site custa ~R$ 150 de gateway).

**Precificação por canal (Bling faz automático):** preço site = custo × markup; preço ML = preço site ÷ (1 − comissão − frete% − imposto%). Nunca vender mais barato no ML que no site — leve o cliente do ML para a base própria (encarte com cupom no pacote).

---

## 8. Unit economics — exemplo com números reais

Premissas: Simples Nacional anexo I (~6–8 % no início), Pix 0,99 %, frete médio pago pelo cliente ou embutido.

| | A-04 Massageador pescoço | B-02 Fechadura IFR 7001+ | C-01 Poltrona massagem |
|---|---|---|---|
| Custo de compra (NF) | R$ 190 | R$ 620 | R$ 1.900 |
| Preço site (Pix) | R$ 299 | R$ 1.099 | R$ 3.490 |
| Gateway (Pix 0,99 %) | R$ 3 | R$ 11 | R$ 35 |
| Simples (7 %) | R$ 21 | R$ 77 | R$ 244 |
| Embalagem + etiqueta (parcial) | R$ 12 | R$ 18 | R$ 90 |
| **Margem bruta site** | **R$ 73 (24 %)** | **R$ 373 (34 %)** | **R$ 1.221 (35 %)** |
| Preço ML Premium (12x) | R$ 349 | R$ 1.249 | R$ 3.890 |
| Comissão ML 17 % + frete subs. | R$ 59 + 25 | R$ 212 + 30 | R$ 661 + 120 |
| **Margem bruta ML** | **R$ 51 (15 %)** | **R$ 300 (24 %)** | **R$ 928 (24 %)** |

Leituras: Camada A serve p/ reputação, não p/ lucro. **Break-even mensal** dos custos fixos (≈ R$ 90 stack + R$ 405 contador + R$ 200 ferramentas = ~R$ 700): 2 fechaduras ou 1 poltrona. Com R$ 3.000/mês de tráfego pago, break-even ≈ 10 fechaduras + 15 itens A. Planilha editável: `docs/calculadora_margem.csv`.

---

## 9. Roadmap 12 meses

### Fase 0 — Semanas 1–4 · Fundação (investimento ≈ R$ 3.500 + estoque)
- [ ] Abrir/ajustar CNPJ (ME Simples Nacional) com CNAEs 4753-9/00 (eletrodomésticos), 4759-8/99 (artigos de uso doméstico), 4789-0/99, 4763-6/02 (artigos esportivos); Inscrição Estadual GO; e-CNPJ A1.
- [ ] Contratar Hostinger Business/Unlimited 12–24 m; domínio `veluahome.com.br`.
- [ ] Instalar stack §3; tema; 7 categorias; template de produto; páginas legais.
- [ ] Bling Cobalto: cadastrar empresa, certificado A1, natureza de operação, testar NF-e em homologação.
- [ ] Contas: Mercado Pago PJ, Melhor Envio PJ, ML (CNPJ), Amazon Profissional.
- [ ] Cadastro em Fujioka, Relaxmedic, Multilaser, 1 distribuidor Intelbras alternativo.
- [ ] Comprar estoque piloto: **R$ 8–12 mil** (10 SKUs A × 5 un, 4 SKUs B × 2 un, 1 SKU C × 1 un — C pode ser *sob encomenda* com prazo 5 dias).
- [ ] Fotos/vídeo próprios de 15 s por SKU (celular + fundo neutro).
- **Saída da fase:** primeira NF-e emitida, primeiro pedido de teste nos 3 canais, checkout 3 cliques medido.

### Fase 1 — Meses 2–3 · Validação (30 vendas)
- Tráfego: orgânico (SEO + Reels/TikTok 3×/semana) + **R$ 1.500–3.000/mês** Meta Ads em Camada B (fechadura, purificador) com público Goiânia/DF/Centro-Oeste + remarketing.
- ML: 15 anúncios Clássico (A) + 8 Premium (B); responder perguntas < 1 h; meta reputação verde em 60 dias.
- Amazon: mesmos SKUs; conteúdo A+ básico.
- Kits próprios no Bling (B-08, C-03, C-04).
- **KPIs:** 30 pedidos, CVR site ≥ 1,2 %, ticket médio ≥ R$ 450, margem bruta média ≥ 28 %, abandono checkout < 60 %.
- **Gate:** se margem média < 22 % ou CAC > 30 % do ticket, trocar mix antes de escalar.

### Fase 2 — Meses 4–6 · Escala nacional (R$ 60–120 k/mês)
- Sortimento 40 → 80 SKUs; entrar Shopee/Magalu via Bling só p/ Camada A/B.
- Subir Bling p/ Mercúrio/Titânio F1 quando passar de 160 pedidos/mês.
- Avaliar Hostinger Cloud Startup se TTFB > 800 ms em campanha.
- Ads: Google Shopping (feed via Rank Math/Product Feed PRO free) + PMax; escala +20 % orçamento a cada 3 dias com ROAS ≥ 3.
- Venda assistida: fluxo WhatsApp para Camada C (script + vídeo de demonstração + parcelamento).
- Negociar contrato Correios próprio (cartão de postagem) se > 300 envios/mês.
- **KPIs:** R$ 60–120 k/mês, 35 % margem bruta, 25 % dos pedidos no site próprio, recompra 10 %.

### Fase 3 — Meses 7–12 · Margem e marca (R$ 150–300 k/mês)
- Radar Siscomex (Expresso/Limitado) + 1ª importação de **itens não regulados** (Camada A-08 e acessórios de kits) — piloto US$ 5–8 k FOB.
- Estudar marca própria de 1 SKU campeão *com* certificação (Inmetro ou Anatel) — decisão por giro ≥ 300 un/mês.
- Programa de instalação (parceiros chaveiros/eletricistas em Goiânia e DF) como serviço adicional na fechadura/câmera.
- Assinatura de reposição (filtros HEPA, refis de difusor).
- ERP Titânio; considerar Cloud Startup/VPS; CDN Cloudflare.
- **KPIs:** margem bruta 38–42 %, 30 % receita no site, NPS ≥ 70, 15 % recompra.

---

## 10. Documentos, certificados e custos

### 10.1 Jurídico/fiscal (obrigatório antes de vender)
| Item | Onde | Custo estimado |
|---|---|---|
| CNPJ ME (Simples Nacional), contrato social, JUCEG | contador + JUCEG | JUCEG R$ 192–338 · Prefeitura Goiânia R$ 224 · honorários abertura R$ 500–2.500 [J1] |
| Contador mensal (Simples, comércio) | contador | R$ 405+/mês em Goiânia [J1] |
| Inscrição Estadual (GO) | SEFAZ-GO (via contador) | R$ 0 |
| Certificado digital e-CNPJ A1 | AC (Serasa, Certisign, Soluti) | R$ 180–350/ano [J1] |
| Alvará de funcionamento / uso do solo (endereço comercial ou coworking fiscal) | Prefeitura | R$ 50–500 |
| Conta PJ | banco digital | R$ 0 |
| Registro de marca INPI (por classe, ME) | INPI | R$ 142 pedido + R$ 298 concessão por classe (com desconto ME) |
| Política de privacidade/LGPD, termos, trocas | modelo + revisão | R$ 0–800 |
| Código de Defesa do Consumidor: 7 dias arrependimento, garantia legal 90 dias, NF em todo pedido | processo interno | R$ 0 |

### 10.2 Plataformas e ferramentas (recorrente)
| Item | Fase 0 | Fase 2 |
|---|---|---|
| Hostinger Business/Unlimited | R$ 13,99/mês (promo) | R$ 39,99–64,99/mês |
| Domínio .com.br | grátis 1º ano | R$ 40/ano |
| Bling | R$ 55/mês | R$ 110–200/mês |
| Amazon Profissional | R$ 19/mês | R$ 19/mês |
| Mercado Pago / Melhor Envio | por transação | por transação |
| Plugins premium (opcional) | R$ 0 | R$ 60–100/mês |
| **Total fixo** | **≈ R$ 90/mês** | **≈ R$ 300/mês** |

### 10.3 Somente se importar (Fase 3)
| Item | Custo |
|---|---|
| Habilitação Radar Siscomex (Expresso ≤ US$ 50 k/semestre) | R$ 0 taxa + despachante R$ 500–1.500 p/ montar processo |
| Despachante aduaneiro por processo | R$ 800–2.500 [C2] |
| Frete internacional LCL + THC + seguro | US$ 400–900 por embarque pequeno |
| Tributos (II + IPI + PIS/COFINS + ICMS) | 50–130 % sobre FOB [C1][C2] |
| Homologação Anatel (por modelo com rádio) | R$ 8–30 mil + 45–90 dias |
| Certificação Inmetro Portaria 371 (por família) | R$ 15–50 mil + manutenção anual |
| Taxa Siscomex | ~R$ 115–215 por DI |

### 10.4 Orçamento de partida (Fase 0 + Fase 1, 3 meses)
| Bloco | Valor |
|---|---|
| Abertura/ajuste empresa + certificado + marca | R$ 1.500–3.500 |
| Hostinger 12 m + stack | R$ 400–900 |
| Estoque piloto | R$ 8.000–12.000 |
| Embalagens, fita, etiquetas, fundo de fotos | R$ 600 |
| Tráfego pago (3 meses) | R$ 4.500–9.000 |
| Contador (3 meses) | R$ 1.200 |
| Reserva p/ devoluções/garantia (5 % do estoque) | R$ 600 |
| **Total** | **R$ 17–28 mil** |

---

## 11. Fontes consultadas (set/2026)

**Hostinger** — [H1] hostinger.com/br/hospedagem-wordpress (preços e renovação); [H2] kildaryoliver.com.br/hospedagem-woocommerce-hostinger; [H3] checkthat.ai/brands/hostinger/pricing (limites de entry processes).
**WooCommerce BR** — [W1] woocommerce.com/feature-request/the-need-for-essential-checkout-fields-for-the-brazilian-market (Brazilian Checkout Toolkit); [W2] wordpress.org/plugins/buildsbyluke-checkout-brasil-for-woocommerce.
**Pagamentos** — [P1] mindconsulting.com.br/2026/07/gateways-pagamento-online-brasil-comparativo-2026; [P2] panacea.com.br/blog/pagamentos-woocommerce-brasil.
**Frete** — [F1] github.com/melhorenvio/wp-melhorenvio-v2; [F2] panacea.com.br/blog/frete-woocommerce-brasil.
**ERP** — [B1] analister.com/ferramentas/bling; [B2] panacea.com.br/blog/integrar-woocommerce-erp; [B3] gosmarter.com.br/bling-para-marketplace; [T1] gosmarter.com.br/tiny-erp-para-e-commerce; [T2] tiny.com.br/planos.
**Plugins ML diretos** — [M1] woosync.io; [M2] fabricadeplugins.com.br/campanhas/plugin-mercado-livre.
**Marketplaces** — [ML1] yav.com.br/blog/quanto-custa-vender-mercado-livre-2026; [ML2] ecommercenapratica.com/blog/comissao-mercado-livre; [AM1] sellsync.ai/pt/blog/taxas-para-vender-na-amazon-guia-2026; [AM2] nuvemshop.com.br/blog/como-vender-pela-amazon.
**Regulatório** — [A1] yescert.com.br/blog/anatel/modulos-iot-2026; [A2] portalcomexbr.com/homologacao-anatel-de-produtos; [A3] tecnoblog.net (Anatel e marketplaces); [I1] tecparcert.com.br/eletrodomesticos/orientacoes-portaria-371-2009.pdf; [I2] oglobo.globo.com (Portaria 371).
**Importação** — [C1] destinochina.com/blog/china-custo-real-importar; [C2] bcvn.com.br/blog/quanto-custa-importar-da-china; [C3] babitonhela.com/blog/incoterms-importacao-china-brasil.
**Fornecedores** — [D1] fujiokadistribuidor.com.br/intelbras; [D2] aredacao.com.br (Fujioka atacado Goiânia); [D3] montaronegocio.com/como-revender-multilaser.
**Empresa** — [J1] se7e.cnt.br (custos abertura Goiânia).

> Valores de certificação Anatel/Inmetro e de honorários de despachante são **faixas de mercado estimadas**, não cotações — pedir 2 orçamentos a OCDs (ex.: TÜV, UL, Eldorado, Bracert) antes de decidir a Fase 3.
