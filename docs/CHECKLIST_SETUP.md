# Checklist de setup — Veluá Home (WooCommerce na Hostinger)

Ordem sugerida. Marque conforme conclui.

## Semana 1 — Empresa
- [ ] CNPJ ME Simples Nacional com CNAEs 4753-9/00, 4759-8/99, 4763-6/02, 4789-0/99 (+ 4751-2/01 se vender informática)
- [ ] Inscrição Estadual GO ativa
- [ ] e-CNPJ A1 emitido e arquivo .pfx guardado
- [ ] Conta PJ aberta
- [ ] Contador com experiência em e-commerce/marketplace contratado
- [ ] Pedido de marca no INPI (classe 35)

## Semana 1–2 — Hostinger + WordPress
- [ ] Plano Business/Unlimited contratado (12–24 m), datacenter São Paulo
- [ ] Domínio veluahome.com.br apontado, SSL ativo, e-mail contato@ criado
- [ ] WordPress instalado; PHP 8.3; Redis object cache ligado; LiteSpeed Cache configurado
- [ ] Tema Astra/Kadence; logo; paleta; fontes
- [ ] Plugins: WooCommerce, Brazilian Checkout Toolkit, Fluid Checkout, Direct Checkout, Mercado Pago, Melhor Envio, Rank Math, Site Kit, Wordfence, Joinchat
- [ ] Staging criado no hPanel
- [ ] Páginas: Home, Loja, 7 categorias, Trocas & Devoluções, Privacidade, Termos, Garantia, Contato (CNPJ + endereço no rodapé)
- [ ] Fluxo 3 cliques testado em celular real (Pix e cartão)
- [ ] GA4 + Meta Pixel + GTM com eventos view_item, add_to_cart, begin_checkout, add_payment_info, purchase

## Semana 2 — Bling (hub)
- [ ] Plano Cobalto; dados da empresa; certificado A1 carregado
- [ ] Naturezas de operação (venda dentro/fora do estado; devolução)
- [ ] NF-e emitida em homologação e depois em produção
- [ ] Integração WooCommerce ativa (pedidos + estoque + preço)
- [ ] Integração Mercado Livre ativa (taxas automáticas por canal)
- [ ] Integração Amazon ativa
- [ ] Integração Melhor Envio ativa (etiqueta a partir do pedido)
- [ ] Tabela de preço por canal configurada (site < ML)
- [ ] Kits cadastrados (B-08, C-03, C-04)

## Semana 2–3 — Canais
- [ ] Mercado Pago PJ verificado; checkout transparente; Pix ativo
- [ ] Melhor Envio PJ; endereço de coleta; saldo inicial
- [ ] Mercado Livre conta CNPJ; dados fiscais; Mercado Envios ativo
- [ ] Amazon Seller Profissional (R$ 19/mês); identidade verificada; conta bancária
- [ ] Cadastro de revenda: Fujioka Distribuidor, Relaxmedic, Multilaser, +1 distribuidor Intelbras
- [ ] Tabelas de preço de revenda e política de garantia/RMA recebidas por e-mail

## Semana 3–4 — Produto e conteúdo
- [ ] 15 SKUs cadastrados no Bling com NCM, GTIN/EAN, peso e dimensões reais
- [ ] Fotos (fundo neutro) + vídeo 15 s por SKU
- [ ] Descrição com benefícios, compatibilidades (Alexa/Google), voltagem, garantia
- [ ] 15 anúncios ML (Clássico A / Premium B) + listagens Amazon
- [ ] Encarte de agradecimento com cupom para o site dentro de cada pacote
- [ ] Pedido teste ponta a ponta em cada canal: compra → NF-e → etiqueta → baixa de estoque nos 3 canais

## Gate de saída da Fase 0
- [ ] Primeira venda real em cada canal
- [ ] Abandono de checkout medido
- [ ] Planilha `calculadora_margem.csv` preenchida com custos reais de compra
