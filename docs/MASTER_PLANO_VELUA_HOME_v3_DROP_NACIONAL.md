# Master Plano v3 — Veluá Home · Dropshipping Nacional (sem estoque, envio pelo fornecedor)

**Stack fixa:** Hostinger (WordPress) + WooCommerce · **Bling** (NF-e + hub) → Mercado Livre + Amazon · Mercado Pago · **3Cliques / FForder (Seu Armazém Drop)** + fornecedores nacionais do nicho com galpão no Brasil.
**Modelo:** zero estoque próprio. Pedido entra → você paga o custo ao fornecedor → fornecedor separa e envia direto ao cliente em 24–72 h → você emite a NF-e de venda no Bling.
**Referência:** set/2026. Preços conferidos nas páginas públicas dos fornecedores (§10).

> Substitui o v2 na parte de portfólio, fornecedores, roadmap e custos. Hospedagem, stack WooCommerce, checkout 3 cliques e marketplaces continuam iguais ao v2 (§2–4 e §7 daquele documento).

---

## 1. Como funciona o fluxo (ponta a ponta)

```
Cliente compra (site / ML / Amazon)
        │
        ▼
Bling recebe o pedido (fonte única)  ──►  emite NF-e de VENDA (sua, CNPJ Veluá)
        │
        ▼
Pedido espelhado no painel do fornecedor (3Cliques FForder / DSlite-Hayamax / Dropi / OneDrop)
        │  você paga o custo do produto (saldo pré-pago ou Pix por pedido)
        ▼
Fornecedor separa, embala (branding opcional), anexa sua DANFE + NF de remessa dele
        │
        ▼
Transportadora (Correios / Jadlog / Flex / DBA) → cliente em 1–5 dias úteis
        │
        ▼
Código de rastreio volta para Bling → site / ML / Amazon → cliente
```

**Regra fiscal do drop nacional (venda à ordem):** o fornecedor emite NF de *remessa por conta e ordem de terceiro* (CFOP 5.923/6.923) e uma NF de venda para você; **você** emite NF de venda ao consumidor (CFOP 5.102/6.102 com natureza "venda à ordem"). O Bling suporta isso; alinhe com o contador antes do 1º pedido. Fornecedores sérios (Hayamax/DSlite) já operam exatamente assim [S3].

---

## 2. Fornecedores validados — quem tem galpão no Brasil e entrega o nicho

### 2.1 Tabela mestre

| # | Fornecedor / hub | O que tem p/ Veluá Home | Galpão | Custo de acesso | Integração | Exigência | Papel no plano |
|---|---|---|---|---|---|---|---|
| **F1** | **3Cliques — Seu Armazém Drop (FForder)** | +1.500 SKUs nacionalizados: gadgets casa, utilidades, bem-estar, fitness leve, acessórios smart | SP (estoque próprio 3Cliques) | **R$ 197/mês** Essencial · R$ 468/trim · R$ 937/ano (Venda Mais) — pago só o custo do produto após a venda; devolução tratada no galpão deles [S1][S2] | WooCommerce, Bling, ML, Amazon, Shopee, Magalu, TikTok Shop | CPF aceito; CNPJ recomendado | **Camada A** (isca / volume) + kits |
| **F2** | **Hayamax via DSlite (B2Lite)** | Eletrônicos e smart home de marca (Intelbras, Positivo, Multilaser, Elgin, Philips, JBL…), air fryer e eletroportáteis | SP, CD próprio, 60 anos | DSlite **R$ 189/mês** (plano Dropshipping) pré-pago · recarga mínima **R$ 1.000** (MEI R$ 2.000) · 7–30 dias teste [S3][S4] | API DSlite → WooCommerce/Bling; NF de remessa + sua DANFE | **CNPJ + IE** | **Camada B/C** (marca, Anatel/Inmetro OK) |
| **F3** | **Gazin Atacado** | Eletrodomésticos e móveis (air fryer, purificador, climatizador, poltronas) | 14 CDs no país, frota própria | Cadastro CNPJ; programa Venda Direta / atacado [S5] | Manual/planilha ou via Dropify | CNPJ | Camada B pesada (volumétricos) |
| **F4** | **All Nations** | Segurança eletrônica e informática (Intelbras, câmeras, fechaduras) | CDs no ES e SC | Cadastro revenda | B2B (pedido por pedido) | CNPJ + IE | Backup Intelbras p/ F2 |
| **F5** | **Cem Tecnologia / Mirão** | Eletrônicos, relógios smart, acessórios | SP | Sem mensalidade; drop com mínimo 1 un + taxa de embalagem [S6] | Manual | CNPJ | Backup gadgets |
| **F6** | **Dropi / Drop Nacional (Empreender)** | Hub com fábricas BR: casa, utilidades, beleza, bem-estar | fornecedores diversos | Grátis (3 produtos) · **R$ 59/mês** nível 1 (500 pedidos, fornecedores nacionais) [S7] | Plugin WooCommerce, ERP | CPF/CNPJ | Descoberta de fornecedores de nicho |
| **F7** | **OneDrop** | +500 SKUs nacionais; envio mesmo dia até 14 h (Flex/DBA) | SP | **R$ 79/mês** ou **R$ 397,90 vitalício** [S8] | ML, Shopee, Amazon, Shopify (Woo via Bling/manual) | CNPJ | Canal marketplace rápido |
| **F8** | **Dropify** | Marcas nacionais variadas, integra Bling/PluggTo | — | R$ 149/mês [S9] | Bling | CNPJ + IE | Opcional Fase 2 |

**Combinação recomendada (Fase 0):** F1 + F2 (+ F6 grátis para garimpar). Custo fixo de fornecimento: **R$ 386/mês** + saldo pré-pago Hayamax R$ 1.000.

### 2.2 Onde cada um é forte e o cuidado
- **3Cliques (F1):** catálogo genérico "China nacionalizada" — ótimo para itens **sem rádio** (massageadores manuais, organizadores, luminárias LED cabeadas, tapetes, garrafas, difusores). Para itens Wi-Fi/Bluetooth ou eletrodomésticos, **exija o nº de homologação Anatel / registro Inmetro antes de anunciar** (ML e Amazon derrubam anúncio sem selo). Planos "Venda Mais/Primeira Venda" incluem publicação de 25–50 produtos por eles — use para acelerar cadastro.
- **Hayamax/DSlite (F2):** produtos de marca, garantia do fabricante, NF completa; custo maior, margem menor (15–30 %), mas zero risco regulatório e reputação no ML sobe rápido. Exige IE e saldo.
- **Gazin (F3):** melhor para volumétricos (poltrona, esteira) onde 3Cliques/Hayamax não têm; prazo 5–10 dias.
- **Hubs (F6/F7):** servem para achar fábricas brasileiras de nicho (ex.: fábricas de massageadores, colchões magnéticos, tapetes yoga em SP/SC).

---

## 3. Portfólio v3 (sem estoque) — 3 camadas, com origem por fornecedor

Critério: fornecedor envia ≤ 48 h · margem bruta mínima 25 % no site / 15 % no ML · regulatório OK.

### Camada A — Isca e volume (R$ 49–299) · **3Cliques (F1)**
| SKU | Produto | Custo ref. | Preço site | Obs. |
|---|---|---|---|---|
| A-01 | Massageador de pescoço/ombros shiatsu (bivolt, Inmetro) | 95 | 219 | pedir certificado |
| A-02 | Pistola de massagem mini | 120 | 279 | bateria — exige Anatel? não (sem rádio); Inmetro p/ carregador |
| A-03 | Difusor de aromas ultrassônico + óleo | 45 | 129 | |
| A-04 | Luminária LED de mesa com carregador sem fio | 60 | 159 | |
| A-05 | Tapete yoga TPE 6 mm + faixa | 55 | 149 | |
| A-06 | Garrafa térmica smart (display temp.) | 40 | 109 | |
| A-07 | Balança bioimpedância Bluetooth | 65 | 169 | **Anatel obrigatória** — só com nº |
| A-08 | Organizador/porta-tempero giratório, kit cozinha saudável | 35 | 99 | |
| A-09 | Almofada massageadora lombar | 90 | 229 | |
| A-10 | Kit Bem-estar iniciante (A-03 + A-05 + A-06) | 140 | 349 | kit montado no Bling, 3 volumes ou 1 se F1 montar |

### Camada B — Margem do dia a dia (R$ 300–1.500) · **Hayamax/DSlite (F2)** + Gazin
| SKU | Produto | Custo ref. | Preço site |
|---|---|---|---|
| B-01 | Lâmpada / tomada / controle universal Wi-Fi Positivo ou Intelbras EWS | 55–110 | 99–189 |
| B-02 | Kit Casa Conectada Positivo | 230 | 349 |
| B-03 | Câmera Wi-Fi Intelbras iM3 / Mibo | 220 | 349 |
| B-04 | Fechadura digital Intelbras FR 101/201 | 430 | 749 |
| B-05 | Fechadura smart Intelbras IFR 7001+ | 640 | 1.099 |
| B-06 | Air fryer forno digital 12 L (Mondial/Philco) | 540 | 899 |
| B-07 | Purificador de ar HEPA (Philco/Electrolux) | 700 | 1.199 |
| B-08 | Massageador de pés Relaxmedic/Multilaser Serene | 380 | 649 |
| B-09 | Kit Segurança (B-05 + B-03 + B-01) | 950 | 1.599 |

### Camada C — Alto ticket assistido (R$ 1.500–4.500) · **Gazin (F3)** / Hayamax
| SKU | Produto | Custo ref. | Preço site |
|---|---|---|---|
| C-01 | Poltrona de massagem | 1.950 | 3.490 |
| C-02 | Esteira elétrica dobrável com app | 1.500 | 2.590 |
| C-03 | Bicicleta ergométrica magnética | 900 | 1.599 |

**Meta de sortimento:** Fase 0 = 25 SKUs (10 A via 3Cliques, 12 B via Hayamax, 3 C via Gazin). Fase 1 = 60. Fase 2 = 120+ (sem estoque, custo de SKU novo ≈ 0 — só tempo de cadastro).

---

## 4. Unit economics no modelo drop (vs. estoque)

| | A-01 Massageador (3Cliques) | B-05 IFR 7001+ (Hayamax) | C-01 Poltrona (Gazin) |
|---|---|---|---|
| Custo produto | 95 | 640 | 1.950 |
| Frete pago ao fornecedor (Correios/Jadlog) | 22 | 28 | 180 |
| Preço site (Pix) | 219 | 1.099 | 3.490 |
| Gateway 0,99 % | 2 | 11 | 35 |
| Simples 7 % | 15 | 77 | 244 |
| **Margem site** | **85 (39 %)** | **343 (31 %)** | **1.081 (31 %)** |
| Preço ML Premium | 259 | 1.249 | 3.890 |
| Comissão ML 17 % | 44 | 212 | 661 |
| Frete ML (subsídio) | 20 | 30 | 120 |
| Simples 7 % | 18 | 87 | 272 |
| **Margem ML** | **82 (32 %)** | **280 (22 %)** | **887 (23 %)** |

Diferença crítica vs v2: **capital de giro ≈ zero** (você recebe do Mercado Pago em 1–14 dias e paga o fornecedor por pedido), então o ROI sobre caixa é muito maior mesmo com margem % menor. Custos fixos mensais: hospedagem 14 + Bling 55 + Amazon 19 + 3Cliques 197 + DSlite 189 = **R$ 474/mês** → break-even ≈ **6 fechaduras** ou **1 poltrona + 2 fechaduras** por mês. Planilha: `docs/calculadora_margem_drop.csv`.

---

## 5. Integrações — como ligar tudo (ordem de setup)

1. **Bling Cobalto** — empresa, certificado A1, naturezas de operação incluindo *venda à ordem*; integra WooCommerce, ML, Amazon.
2. **3Cliques Seu Armazém Drop** — conectar WooCommerce **e** Bling (eles listam integração Bling); definir margem na "Calculadora Pro"; publicar 25–50 produtos (serviço Creation); testar 1 pedido.
3. **DSlite/Hayamax** — contratar plano Dropshipping (teste grátis), API → WooCommerce; regra de preço com sua margem; upload do XML da NF-e emitida no Bling no portal DSlite a cada pedido (ou via API).
4. **Gazin** — cadastro CNPJ; pedidos volumétricos manuais no início (≤ 10/mês), depois via Dropify se justificar.
5. **Melhor Envio** — só para exceções (troca, reenvio, kit montado por você). No drop o frete é do fornecedor.
6. **Rastreio** — Bling recebe o código do fornecedor → dispara no site/ML/Amazon; plugin "Advanced Shipment Tracking" (free) mostra ao cliente no Woo.
7. **Estoque** — sincronização automática do fornecedor → Bling → canais (evita vender sem estoque). Regra: **estoque de segurança 2 un** em todos os SKUs do ML para não tomar reclamação.

---

## 6. Regulatório e riscos específicos do drop

| Risco | Mitigação |
|---|---|
| Produto Wi-Fi/BT do catálogo 3Cliques sem Anatel | Só anunciar com nº de homologação impresso no produto/embalagem; pedir foto do selo. Sem selo = fora do catálogo. |
| Eletroportátil sem Inmetro | Idem — registro Inmetro; Hayamax/Gazin resolvem porque são marcas certificadas. |
| Fornecedor atrasa → sua reputação no ML cai | Diversificar fornecedor por SKU; SLA de despacho ≤ 24 h por contrato; monitorar "% despachado no prazo" semanal. |
| Devolução/arrependimento (7 dias CDC) | 3Cliques recebe no galpão deles; Hayamax/Gazin: logística reversa via Melhor Envio (custo seu, ~R$ 25–60). Provisionar 3 % da receita. |
| NF triangular errada | Contador configura CFOPs no Bling antes do 1º pedido; auditar 5 primeiras notas. |
| Dependência de um hub (3Cliques) | Nunca > 50 % da receita em um único fornecedor a partir da Fase 1. |
| Preço do fornecedor muda sem aviso | Monitor de preço (Dropi tem; DSlite atualiza via API); repricing semanal no Bling. |

---

## 7. Roadmap 12 meses (drop)

### Fase 0 — Semanas 1–3 · Setup (≈ R$ 2.500–4.000, sem estoque)
- CNPJ ME Simples + **Inscrição Estadual** (obrigatória p/ Hayamax/All Nations/Gazin) + e-CNPJ A1.
- Hostinger Business/Unlimited + stack Woo do v2; checkout 3 cliques.
- Bling Cobalto; Mercado Pago PJ; ML CNPJ; Amazon Profissional.
- Assinar **3Cliques Essencial (R$ 197)** e **DSlite Dropshipping (teste grátis → R$ 189)**; recarga Hayamax R$ 1.000.
- Cadastro Gazin e All Nations.
- Publicar 25 SKUs (10 A / 12 B / 3 C) no site, ML e Amazon via Bling.
- 1 pedido teste em cada fornecedor comprando você mesmo → validar NF, prazo, embalagem.
- **Saída:** 3 pedidos-teste entregues com NF correta.

### Fase 1 — Meses 1–3 · Validação (50 pedidos)
- Tráfego: ML orgânico (Camada A e B) + Meta Ads R$ 1.500–2.500/mês em B-04/B-05/B-07 + Reels 3×/semana.
- Encarte no pacote (3Cliques permite personalização) com cupom p/ site.
- **KPIs:** 50 pedidos, margem média ≥ 28 % site / ≥ 18 % ML, despacho ≤ 24 h em ≥ 95 %, reputação ML verde, abandono checkout < 60 %.
- **Gate:** fornecedor com > 5 % atraso → substituir SKU de origem.

### Fase 2 — Meses 4–6 · Escala (R$ 40–90 k/mês)
- Sortimento 60 → 120 SKUs; Shopee/Magalu/TikTok Shop via Bling + 3Cliques (Camada A).
- Adicionar OneDrop (R$ 397,90 vitalício) para SKUs Flex/mesmo dia em SP.
- Google Shopping + PMax; venda assistida WhatsApp para Camada C.
- Bling → Mercúrio/Titânio ao passar 160 pedidos/mês.
- **KPIs:** R$ 40–90 k/mês, 25 % da receita no site, recompra 10 %.

### Fase 3 — Meses 7–12 · Margem (R$ 100–200 k/mês)
- Modelo **híbrido**: comprar em lote os 5 SKUs campeões (giro ≥ 60 un/mês) e deixar no galpão da 3Cliques (modalidade Híbrida) ou em fulfillment ML Full → custo unitário −15–25 %.
- Marca própria em 1–2 SKUs sem rádio (3Cliques faz personalização/embalagem).
- Programa de instalação (parceiros em Goiânia/DF) para fechaduras/câmeras.
- **KPIs:** margem bruta 35 %+, 30 % site, NPS ≥ 70.

---

## 8. Documentos, certificados e custos (v3)

### 8.1 Obrigatórios antes da 1ª venda
| Item | Custo |
|---|---|
| CNPJ ME Simples Nacional (CNAEs 4753-9/00, 4759-8/99, 4763-6/02, 4789-0/99) — JUCEG + Prefeitura Goiânia + contador | R$ 900–3.000 (uma vez) |
| Inscrição Estadual GO | R$ 0 |
| e-CNPJ A1 | R$ 180–350/ano |
| Contador mensal | R$ 405+/mês |
| Conta PJ + Mercado Pago PJ | R$ 0 |
| Registro marca INPI (classe 35) | R$ 142 + R$ 298 |
| Políticas LGPD / trocas / termos | R$ 0–800 |

### 8.2 Recorrente (Fase 0 → Fase 2)
| Item | Fase 0 | Fase 2 |
|---|---|---|
| Hostinger Business/Unlimited | R$ 13,99 | R$ 39,99–64,99 |
| Bling | R$ 55 | R$ 110–200 |
| Amazon Profissional | R$ 19 | R$ 19 |
| 3Cliques Seu Armazém Drop | R$ 197 (ou R$ 78/mês no anual) | R$ 78–197 |
| DSlite/Hayamax | R$ 189 | R$ 189 |
| OneDrop | — | R$ 397,90 (única) |
| Dropi | R$ 0 | R$ 59 |
| Contador | R$ 405 | R$ 405 |
| **Total fixo** | **≈ R$ 880/mês** | **≈ R$ 1.000–1.100/mês** |
| Saldo pré-pago Hayamax (capital, não custo) | R$ 1.000 | R$ 3.000–5.000 |

### 8.3 Orçamento de partida (3 meses) — **sem estoque**
| Bloco | Valor |
|---|---|
| Empresa + certificado + marca | R$ 1.500–3.500 |
| Hostinger 12 m + domínio | R$ 170–400 |
| Assinaturas 3 meses (3Cliques + DSlite + Bling + Amazon) | R$ 1.400 |
| Saldo Hayamax | R$ 1.000 |
| Pedidos-teste (3 un.) | R$ 800 |
| Tráfego pago 3 meses | R$ 4.500–7.500 |
| Contador 3 meses | R$ 1.200 |
| Reserva devoluções | R$ 500 |
| **Total** | **R$ 11–16 mil** (vs R$ 17–28 mil do v2 com estoque) |

### 8.4 Não precisa (neste modelo)
Radar Siscomex, despachante, homologação Anatel/Inmetro própria, galpão, embalagens, seguro de estoque — tudo fica com o fornecedor. Só volta a ser necessário se você importar diretamente (Fase 3 opcional).

---

## 9. Decisão rápida: quando usar cada fornecedor

| Se o produto é… | Use | Porque |
|---|---|---|
| Genérico, sem rádio, ticket < R$ 300 | 3Cliques | menor custo, devolução no galpão deles, kit/branding |
| De marca, Wi-Fi/BT, eletroportátil | Hayamax/DSlite | Anatel/Inmetro resolvidos, garantia do fabricante |
| Volumétrico > 30 kg (poltrona, esteira) | Gazin | 14 CDs, frota própria |
| Precisa despacho mesmo dia / Flex SP | OneDrop | envio até 14 h |
| Nicho artesanal BR (magnetoterapia, tapetes, têxteis wellness) | Dropi/Drop Nacional | descobre fábricas brasileiras |

---

## 10. Fontes (set/2026)
[S1] 3cliques.net/seu-armazem-drop-3 — planos R$ 197 mensal, R$ 468 trimestral, R$ 937 anual; +1.500 produtos; integrações Woo/Bling/ML/Amazon; devoluções no galpão próprio.
[S2] 3cliques.net/perguntas-frequentes e /integracoes — plataforma FForder, integração WooCommerce.
[S3] hayamax.com.br/dropshipping — DSlite R$ 129 (CrossDocking) / R$ 189 (Dropshipping) pré-pago; recarga mín. R$ 1.000 (MEI R$ 2.000); fluxo NF remessa + DANFE do lojista.
[S4] fforder.com/pt/post/fornecedores-dropshipping-de-eletrônicos-guia-brasil-china-2026 — mapa de distribuidores (Hayamax, Cem, Mirão, All Nations).
[S5] fornecedoresdeconfianca.com.br/dropshipping-fornecedores — Gazin Venda Direta/atacado CNPJ, 14 CDs.
[S6] vivendomarketing.com/27-fornecedores-de-dropshipping — Cem Tecnologia mínimo 1 un.
[S7] aplicativos.tray.com.br/aplicativo/dropi-dropshipping-nacional — planos Dropi (grátis, R$ 59, R$ 97, R$ 249).
[S8] onedrop.com.br — R$ 79/mês, R$ 397,90 vitalício, envio mesmo dia até 14 h.
[S9] dogama.com.br/blog/artigos/melhores-fornecedores-dropshipping-nacional-2026 — Dropify R$ 149/mês, integra Bling.
Demais fontes (Hostinger, Bling, ML, Amazon, Anatel, Inmetro) estão no v2 §11.
