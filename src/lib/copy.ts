// ============================================================
//  DICIONÁRIOS DE COPY — pt / en / es / de
//  Usados pelo motor local do Flow Engine para gerar presells
//  completas (review, robusta, advertorial) e pop-ups.
// ============================================================

export type Lang = "pt" | "en" | "es" | "de";
export type Nicho = "saude" | "beleza" | "financas" | "idiomas" | "geral";

export const LANGS: { id: Lang; label: string }[] = [
  { id: "pt", label: "Português" },
  { id: "en", label: "Inglês" },
  { id: "es", label: "Espanhol" },
  { id: "de", label: "Alemão" },
];

export const NICHOS: { id: Nicho; label: string }[] = [
  { id: "saude", label: "Saúde / Suplementos" },
  { id: "beleza", label: "Beleza / Skincare" },
  { id: "financas", label: "Finanças / Crédito" },
  { id: "idiomas", label: "Idiomas / Educação" },
  { id: "geral", label: "Geral" },
];

interface Dict {
  label: string;
  badge: string;
  opening: string[];
  whatIsTitle: string;
  whatIsBody: (p: string) => string;
  benefitsTitle: string;
  howToTitle: string;
  proofTitle: string;
  proofNote: string;
  compareTitle: string;
  compareCols: string[];
  faqTitle: string;
  offerTitle: string;
  offerBody: (p: string) => string;
  guarantee: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaNote: string;
  verdictTitle: string;
  prosTitle: string;
  consTitle: string;
  disclosure: string;
  disclaimer: string;
  footerNote: string;
  resultsLabel: string;
  names: string[];
  cities: string[];
  ageGate: { title: string; text: string; yes: string; no: string };
  cookie: { text: string; accept: string };
  faq: (p: string) => [string, string][];
  testimonials: (p: string) => string[];
}

const DICTS: Record<Lang, Dict> = {
  pt: {
    label: "Português",
    badge: "Análise Independente",
    opening: [
      "Se você chegou até aqui, provavelmente já pesquisou sobre {p} e encontrou mais promessas do que respostas. Esta página existe para mudar isso: sem enrolação, com o que funciona, o que não funciona e para quem o produto faz sentido.",
      "Reunimos abaixo a estrutura completa de uma avaliação honesta: o que é, como funciona, o que usuários relatam, como se compara às alternativas e as respostas para as dúvidas que mais aparecem antes da compra.",
    ],
    whatIsTitle: "O que é {p}?",
    whatIsBody: (p) =>
      `${p} é uma solução desenvolvida para quem quer resultado prático sem complicação. A proposta central é simples: entregar um método direto, com componentes selecionados e um passo a passo que qualquer pessoa consegue seguir — mesmo começando do zero.`,
    benefitsTitle: "Principais benefícios",
    howToTitle: "Como usar — passo a passo",
    proofTitle: "O que usuários relatam",
    proofNote: "Relatos de usuários reais, com resultado e contexto. Resultados variam de pessoa para pessoa.",
    compareTitle: "Comparação com alternativas",
    compareCols: ["Critério", "{p}", "Alternativa A", "Alternativa B"],
    faqTitle: "Perguntas frequentes",
    offerTitle: "A oferta completa",
    offerBody: (p) =>
      `Ao acessar a página oficial de ${p}, você encontra as opções de pacotes disponíveis hoje, a garantia oferecida pelo fabricante e o frete/condições aplicáveis à sua região. Recomendamos sempre escolher o maior pacote disponível quando o objetivo é resultado consistente — o custo por unidade cai e o período de uso aumenta.`,
    guarantee: "Garantia do fabricante consulte na página oficial",
    ctaPrimary: "Ver página oficial e preços",
    ctaSecondary: "Ver oferta completa",
    ctaNote: "Você será redirecionado para a página oficial do fabricante.",
    verdictTitle: "Nosso veredito",
    prosTitle: "Pontos fortes",
    consTitle: "Pontos de atenção",
    disclosure:
      "Divulgação de afiliado: esta página pode receber comissão se você comprar através dos nossos links, sem custo adicional para você. Isso não influencia nossa avaliação.",
    disclaimer:
      "Aviso: este conteúdo tem caráter informativo e não substitui orientação profissional. Produtos de saúde devem ser usados conforme as instruções do fabricante. Consulte um profissional de saúde antes de iniciar qualquer suplementação.",
    footerNote: "Página independente de review e comparação. Não somos o fabricante.",
    resultsLabel: "resultado relatado",
    names: ["Mariana S.", "Carlos A.", "Juliana R.", "Rafael M.", "Patrícia L.", "Fernando T."],
    cities: ["Belo Horizonte, MG", "Curitiba, PR", "Salvador, BA", "Porto Alegre, RS", "Recife, PE", "Goiânia, GO"],
    ageGate: {
      title: "Verificação de idade",
      text: "Este conteúdo é destinado a maiores de 18 anos. Confirme para continuar.",
      yes: "Tenho 18 anos ou mais",
      no: "Sair",
    },
    cookie: {
      text: "Usamos cookies para melhorar sua experiência e medir a performance desta página.",
      accept: "Aceitar e continuar",
    },
    faq: (p) => [
      [`${p} funciona mesmo?`, `A eficácia depende do uso consistente e do perfil de cada pessoa. Nossa análise indica que os componentes e o método entregam resultado quando seguidos corretamente.`],
      [`Em quanto tempo vejo resultado?`, `A maioria dos relatos indica mudanças perceptíveis entre a segunda e a quarta semana de uso contínuo.`],
      [`Tem garantia?`, `Sim. A página oficial informa a garantia e o prazo para reembolso — confirme as condições atuais antes de comprar.`],
      [`Qual pacote escolher?`, `Para quem busca resultado consistente, os maiores pacotes apresentam melhor custo-benefício e período de uso suficiente.`],
      [`É seguro comprar neste site?`, `A compra é finalizada na página oficial do fabricante, com checkout e suporte próprios.`],
      [`Quem não deve usar?`, `Gestantes, lactantes, menores de idade e pessoas com condições de saúde específicas devem consultar um profissional antes.`],
    ],
    testimonials: (p) => [
      `Comecei cético, mas segui o passo a passo por 30 dias e a diferença foi visível. Hoje entendo por que ${p} tem tanta procura.`,
      `Já tinha tentado outras opções sem sucesso. Com ${p} finalmente consegui constância — e o suporte responde.`,
      `O que me convenceu foi a comparação honesta: dá para ver exatamente o que você está comprando.`,
    ],
  },

  en: {
    label: "English",
    badge: "Independent Review",
    opening: [
      "If you landed here, you have probably searched for {p} and found more promises than answers. This page exists to change that: what works, what doesn't, and who the product is actually for.",
      "Below is the full structure of an honest review: what it is, how it works, what users report, how it compares to alternatives, and the questions people ask most before buying.",
    ],
    whatIsTitle: "What is {p}?",
    whatIsBody: (p) =>
      `${p} is a solution built for people who want practical results without complexity. The core idea is simple: a direct method, carefully selected components, and a step-by-step process anyone can follow — even starting from zero.`,
    benefitsTitle: "Key benefits",
    howToTitle: "How to use — step by step",
    proofTitle: "What users report",
    proofNote: "Reports from real users, with result and context. Individual results vary.",
    compareTitle: "Comparison with alternatives",
    compareCols: ["Criteria", "{p}", "Alternative A", "Alternative B"],
    faqTitle: "Frequently asked questions",
    offerTitle: "The full offer",
    offerBody: (p) =>
      `On the official ${p} page you will find today's available packages, the manufacturer's guarantee, and the shipping conditions for your region. We always recommend the largest available package when your goal is consistent results — the cost per unit drops and the usage period is long enough.`,
    guarantee: "Manufacturer's guarantee — check the official page",
    ctaPrimary: "Visit official page & pricing",
    ctaSecondary: "See full offer",
    ctaNote: "You will be redirected to the manufacturer's official page.",
    verdictTitle: "Our verdict",
    prosTitle: "Strengths",
    consTitle: "Points of attention",
    disclosure:
      "Affiliate disclosure: this page may earn a commission if you buy through our links, at no additional cost to you. This does not influence our review.",
    disclaimer:
      "Disclaimer: this content is informational and does not replace professional advice. Health products must be used according to the manufacturer's instructions. Consult a healthcare professional before starting any supplement.",
    footerNote: "Independent review and comparison page. We are not the manufacturer.",
    resultsLabel: "reported result",
    names: ["Sarah M.", "James D.", "Emily R.", "Michael T.", "Laura K.", "Daniel P."],
    cities: ["Austin, TX", "Denver, CO", "Miami, FL", "Seattle, WA", "Phoenix, AZ", "Boston, MA"],
    ageGate: {
      title: "Age verification",
      text: "This content is intended for adults 18 and over. Please confirm to continue.",
      yes: "I am 18 or older",
      no: "Exit",
    },
    cookie: {
      text: "We use cookies to improve your experience and measure this page's performance.",
      accept: "Accept and continue",
    },
    faq: (p) => [
      [`Does ${p} actually work?`, `Effectiveness depends on consistent use and individual profile. Our analysis shows the components and method deliver when followed correctly.`],
      [`How long until I see results?`, `Most reports indicate noticeable changes between the second and fourth week of consistent use.`],
      [`Is there a guarantee?`, `Yes. The official page states the guarantee and refund window — confirm current terms before buying.`],
      [`Which package should I choose?`, `For consistent results, the larger packages offer better value and a long enough usage period.`],
      [`Is it safe to buy here?`, `The purchase is completed on the manufacturer's official page, with its own checkout and support.`],
      [`Who should not use it?`, `Pregnant or nursing women, minors, and people with specific health conditions should consult a professional first.`],
    ],
    testimonials: (p) => [
      `I started skeptical, but I followed the steps for 30 days and the difference was visible. Now I understand why ${p} is in such demand.`,
      `I had tried other options without success. With ${p} I finally got consistency — and support actually replies.`,
      `What convinced me was the honest comparison: you can see exactly what you are buying.`,
    ],
  },

  es: {
    label: "Español",
    badge: "Análisis Independiente",
    opening: [
      "Si llegaste hasta aquí, probablemente ya buscaste sobre {p} y encontraste más promesas que respuestas. Esta página existe para cambiar eso: qué funciona, qué no y para quién es el producto.",
      "A continuación, la estructura completa de una evaluación honesta: qué es, cómo funciona, qué reportan los usuarios, cómo se compara con las alternativas y las dudas más comunes antes de comprar.",
    ],
    whatIsTitle: "¿Qué es {p}?",
    whatIsBody: (p) =>
      `${p} es una solución desarrollada para quien quiere resultados prácticos sin complicaciones. La idea central es simple: un método directo, componentes seleccionados y un paso a paso que cualquier persona puede seguir, incluso empezando desde cero.`,
    benefitsTitle: "Beneficios principales",
    howToTitle: "Cómo usarlo — paso a paso",
    proofTitle: "Lo que reportan los usuarios",
    proofNote: "Reportes de usuarios reales, con resultado y contexto. Los resultados varían según la persona.",
    compareTitle: "Comparación con alternativas",
    compareCols: ["Criterio", "{p}", "Alternativa A", "Alternativa B"],
    faqTitle: "Preguntas frecuentes",
    offerTitle: "La oferta completa",
    offerBody: (p) =>
      `En la página oficial de ${p} encontrarás los paquetes disponibles hoy, la garantía del fabricante y las condiciones de envío para tu región. Recomendamos siempre el paquete más grande cuando buscas resultados consistentes: el costo por unidad baja y el período de uso es suficiente.`,
    guarantee: "Garantía del fabricante — consulta en la página oficial",
    ctaPrimary: "Ver página oficial y precios",
    ctaSecondary: "Ver oferta completa",
    ctaNote: "Serás redirigido a la página oficial del fabricante.",
    verdictTitle: "Nuestro veredicto",
    prosTitle: "Puntos fuertes",
    consTitle: "Puntos de atención",
    disclosure:
      "Divulgación de afiliado: esta página puede recibir una comisión si compras a través de nuestros enlaces, sin costo adicional para ti. Esto no influye en nuestra evaluación.",
    disclaimer:
      "Aviso: este contenido es informativo y no sustituye la orientación profesional. Los productos de salud deben usarse según las instrucciones del fabricante. Consulta a un profesional antes de iniciar cualquier suplementación.",
    footerNote: "Página independiente de review y comparación. No somos el fabricante.",
    resultsLabel: "resultado reportado",
    names: ["Lucía G.", "Martín R.", "Sofía A.", "Diego M.", "Valentina L.", "Andrés T."],
    cities: ["Valencia", "Buenos Aires", "CDMX", "Bogotá", "Lima", "Santiago"],
    ageGate: {
      title: "Verificación de edad",
      text: "Este contenido está dirigido a mayores de 18 años. Confirma para continuar.",
      yes: "Tengo 18 años o más",
      no: "Salir",
    },
    cookie: {
      text: "Usamos cookies para mejorar tu experiencia y medir el rendimiento de esta página.",
      accept: "Aceptar y continuar",
    },
    faq: (p) => [
      [`¿${p} realmente funciona?`, `La eficacia depende del uso constante y del perfil de cada persona. Nuestro análisis indica que los componentes y el método entregan resultados si se siguen correctamente.`],
      [`¿En cuánto tiempo veo resultados?`, `La mayoría de los reportes indica cambios perceptibles entre la segunda y la cuarta semana de uso continuo.`],
      [`¿Tiene garantía?`, `Sí. La página oficial indica la garantía y el plazo de reembolso — confirma las condiciones actuales antes de comprar.`],
      [`¿Qué paquete elegir?`, `Para resultados consistentes, los paquetes más grandes tienen mejor costo-beneficio y un período de uso suficiente.`],
      [`¿Es seguro comprar aquí?`, `La compra se finaliza en la página oficial del fabricante, con su propio checkout y soporte.`],
      [`¿Quién no debe usarlo?`, `Embarazadas, lactantes, menores de edad y personas con condiciones de salud específicas deben consultar a un profesional primero.`],
    ],
    testimonials: (p) => [
      `Empecé escéptico, pero seguí los pasos durante 30 días y la diferencia fue visible. Ahora entiendo por qué ${p} tiene tanta demanda.`,
      `Ya había probado otras opciones sin éxito. Con ${p} por fin conseguí constancia — y el soporte responde.`,
      `Lo que me convenció fue la comparación honesta: se ve exactamente qué estás comprando.`,
    ],
  },

  de: {
    label: "Deutsch",
    badge: "Unabhängige Analyse",
    opening: [
      "Wenn du hier gelandet bist, hast du wahrscheinlich schon nach {p} gesucht und mehr Versprechen als Antworten gefunden. Diese Seite ändert das: was funktioniert, was nicht — und für wen das Produkt wirklich geeignet ist.",
      "Unten findest du die vollständige Struktur einer ehrlichen Bewertung: was es ist, wie es funktioniert, was Nutzer berichten, wie der Vergleich zu Alternativen ausfällt und die häufigsten Fragen vor dem Kauf.",
    ],
    whatIsTitle: "Was ist {p}?",
    whatIsBody: (p) =>
      `${p} ist eine Lösung für alle, die praktische Ergebnisse ohne Komplexität wollen. Der Kerngedanke ist einfach: eine direkte Methode, sorgfältig ausgewählte Komponenten und eine Schritt-für-Schritt-Anleitung, die jeder befolgen kann — auch bei Null.`,
    benefitsTitle: "Wichtigste Vorteile",
    howToTitle: "So funktioniert es — Schritt für Schritt",
    proofTitle: "Was Nutzer berichten",
    proofNote: "Berichte echter Nutzer mit Ergebnis und Kontext. Individuelle Ergebnisse variieren.",
    compareTitle: "Vergleich mit Alternativen",
    compareCols: ["Kriterium", "{p}", "Alternative A", "Alternative B"],
    faqTitle: "Häufige Fragen",
    offerTitle: "Das komplette Angebot",
    offerBody: (p) =>
      `Auf der offiziellen Seite von ${p} findest du die heute verfügbaren Pakete, die Herstellergarantie und die Versandbedingungen für deine Region. Wir empfehlen bei konsequenten Zielen immer das größte Paket — der Stückpreis sinkt und der Anwendungszeitraum reicht aus.`,
    guarantee: "Herstellergarantie — auf der offiziellen Seite prüfen",
    ctaPrimary: "Offizielle Seite & Preise ansehen",
    ctaSecondary: "Komplettes Angebot ansehen",
    ctaNote: "Du wirst zur offiziellen Seite des Herstellers weitergeleitet.",
    verdictTitle: "Unser Fazit",
    prosTitle: "Stärken",
    consTitle: "Beachtenswerte Punkte",
    disclosure:
      "Affiliate-Offenlegung: Diese Seite kann eine Provision erhalten, wenn du über unsere Links kaufst — ohne Mehrkosten für dich. Das beeinflusst unsere Bewertung nicht.",
    disclaimer:
      "Hinweis: Dieser Inhalt dient nur zur Information und ersetzt keine professionelle Beratung. Gesundheitsprodukte sind nach Herstellerangaben anzuwenden. Vor der Einnahme von Nahrungsergänzungsmitteln einen Fachmann konsultieren.",
    footerNote: "Unabhängige Review- und Vergleichsseite. Wir sind nicht der Hersteller.",
    resultsLabel: "berichtetes Ergebnis",
    names: ["Sabine K.", "Thomas M.", "Julia R.", "Michael B.", "Andrea L.", "Stefan W."],
    cities: ["Berlin", "München", "Hamburg", "Köln", "Frankfurt", "Stuttgart"],
    ageGate: {
      title: "Altersprüfung",
      text: "Dieser Inhalt richtet sich an Personen ab 18 Jahren. Bitte bestätige, um fortzufahren.",
      yes: "Ich bin 18 oder älter",
      no: "Beenden",
    },
    cookie: {
      text: "Wir verwenden Cookies, um dein Erlebnis zu verbessern und die Performance dieser Seite zu messen.",
      accept: "Akzeptieren und fortfahren",
    },
    faq: (p) => [
      [`Funktioniert ${p} wirklich?`, `Die Wirksamkeit hängt von konsequenter Anwendung und persönlichem Profil ab. Unsere Analyse zeigt: Komponenten und Methode liefern, wenn sie korrekt befolgt werden.`],
      [`Wann sehe ich Ergebnisse?`, `Die meisten Berichte zeigen spürbare Veränderungen zwischen der zweiten und vierten Woche konsequenter Anwendung.`],
      [`Gibt es eine Garantie?`, `Ja. Die offizielle Seite nennt Garantie und Rückgabefrist — aktuelle Bedingungen vor dem Kauf prüfen.`],
      [`Welches Paket soll ich wählen?`, `Für konsequente Ergebnisse bieten die größeren Pakete das bessere Preis-Leistungs-Verhältnis und einen ausreichenden Anwendungszeitraum.`],
      [`Ist der Kauf hier sicher?`, `Der Kauf wird auf der offiziellen Herstellerseite abgeschlossen — mit eigenem Checkout und Support.`],
      [`Wer sollte es nicht anwenden?`, `Schwangere, Stillende, Minderjährige und Menschen mit spezifischen Erkrankungen sollten vorher einen Fachmann konsultieren.`],
    ],
    testimonials: (p) => [
      `Ich war skeptisch, aber nach 30 Tagen konsequenter Anwendung war der Unterschied sichtbar. Jetzt verstehe ich, warum ${p} so gefragt ist.`,
      `Ich hatte es vorher ohne Erfolg versucht. Mit ${p} endlich Konstanz — und der Support antwortet tatsächlich.`,
      `Überzeugt hat mich der ehrliche Vergleich: man sieht genau, was man kauft.`,
    ],
  },
};

// ---------- pools por nicho (benefícios e componentes) ----------
type Pool = {
  beneficios: [string, string][];
  componentes: [string, string][];
  passos: string[];
  pros: string[];
  contras: string[];
  alts: string[];
};

const POOLS: Record<Lang, Record<Nicho, Pool>> = {
  pt: {
    saude: {
      beneficios: [
        ["Mais energia no dia a dia", "Formulação pensada para sustentar disposição sem picos de cafeína."],
        ["Apoio metabólico", "Componentes que auxiliam o metabolismo de quem tem rotina intensa."],
        ["Imunidade reforçada", "Nutrientes de suporte para as defesas naturais do organismo."],
        ["Recuperação mais rápida", "Ajuda na regeneração após esforço físico e desgaste diário."],
        ["Sono de melhor qualidade", "Ação calmante que favorece o descanso noturno."],
      ],
      componentes: [
        ["Complexo B", "Metabolismo energético e redução da fadiga"],
        ["Vitamina D3", "Suporte à imunidade e saúde óssea"],
        ["Magnésio", "Relaxamento muscular e qualidade do sono"],
        ["Zinco", "Defesas do organismo e cicatrização"],
        ["Extrato natural", "Apoio antioxidante e bem-estar geral"],
      ],
      passos: ["Leia o rótulo e a bula antes do primeiro uso", "Tome a dose indicada com água", "Mantenha horários fixos todos os dias", "Hidrate-se e mantenha alimentação equilibrada", "Avalie resultados após 30 dias de uso contínuo"],
      pros: ["Fórmula com componentes reconhecidos", "Uso simples, sem protocolos complicados", "Fabricante com garantia e suporte"],
      contras: ["Resultado exige constância", "Estoque limita no site oficial"],
      alts: ["Alternativa de farmácia", "Marca genérica similar"],
    },
    beleza: {
      beneficios: [
        ["Aparência mais saudável", "Rotina simples que devolve viço à pele e aos cabelos."],
        ["Hidratação profunda", "Ativos que retêm água nas camadas da pele."],
        ["Ação antienvelhecimento", "Antioxidantes que combatem sinais do tempo."],
        ["Brilho e maciez", "Textura leve que não deixa resíduo."],
        ["Para todos os tipos de pele", "Fórmula equilibrada, testada e de uso diário."],
      ],
      componentes: [
        ["Ácido hialurônico", "Hidratação e preenchimento superficial"],
        ["Vitamina C", "Brilho e proteção antioxidante"],
        ["Retinol", "Renovação celular e firmeza"],
        ["Niacinamida", "Controle de oleosidade e poros"],
        ["Ceramidas", "Barreira protetora da pele"],
      ],
      passos: ["Limpe o rosto antes de aplicar", "Use a quantidade indicada", "Aplique com movimentos circulares suves", "Espere absorver antes de maquiar", "Repita pela manhã e à noite"],
      pros: ["Resultados visíveis em semanas", "Textura leve e rápida absorção", "Uso combinável com maquiagem"],
      contras: ["Uso contínuo necessário", "Pode variar conforme tipo de pele"],
      alts: ["Creme de farmácia", "Marca importada similar"],
    },
    financas: {
      beneficios: [
        ["Aprovação facilitada", "Processo pensado para perfis que já foram recusados."],
        ["Sem taxas escondidas", "Condições claras desde o primeiro acesso."],
        ["Limite competitivo", "Ajuste conforme seu perfil de uso."],
        ["Benefícios reais", "Cashback e programas de recompensa."],
        ["Gestão pelo app", "Controle total de gastos e faturas."],
      ],
      componentes: [
        ["Anuidade", "Condições conforme o pacote escolhido"],
        ["Cashback", "Recompensa por compras elegíveis"],
        ["Segurança", "Proteção e monitoramento de transações"],
        ["Atendimento", "Suporte humano quando precisar"],
        ["App", "Gestão completa na palma da mão"],
      ],
      passos: ["Verifique sua elegibilidade", "Preencha o cadastro oficial", "Envie os documentos solicitados", "Aguarde a análise", "Receba e ative seu produto"],
      pros: ["Processo 100% online", "Condições transparentes", "Suporte dedicado"],
      contras: ["Aprovação depende de análise", "Requisitos mínimos de Score"],
      alts: ["Banco tradicional", "Outra fintech do segmento"],
    },
    idiomas: {
      beneficios: [
        ["Aprenda no seu ritmo", "Aulas curtas que cabem na rotina."],
        ["Método validado", "Estrutura testada com milhares de alunos."],
        ["Professores nativos", "Pronúncia e contexto cultural reais."],
        ["Certificado", "Comprovação ao final de cada módulo."],
        ["Acesso vitalício", "Estude quando e onde quiser."],
      ],
      componentes: [
        ["Módulos", "Progressão do básico ao avançado"],
        ["Áudios nativos", "Treino de escuta desde o dia 1"],
        ["Exercícios", "Fixação por repetição espaçada"],
        ["Comunidade", "Prática com outros alunos"],
        ["Certificado", "Validação do seu progresso"],
      ],
      passos: ["Faça o teste de nivelamento", "Escolha seu horário de estudo", "Assista à aula do dia", "Pratique com os exercícios", "Avance de módulo ao concluir"],
      pros: ["Flexibilidade total de horário", "Didática moderna", "Comunidade ativa"],
      contras: ["Exige disciplina diária", "Curso em inglês para alguns módulos"],
      alts: ["Curso presencial", "App gratuito de idiomas"],
    },
    geral: {
      beneficios: [
        ["Resultado prático", "Pensado para quem quer sair do zero."],
        ["Fácil de começar", "Sem curva de aprendizado longa."],
        ["Suporte incluído", "Ajuda quando você travar."],
        ["Custo-benefício", "Preço justo para o que entrega."],
        ["Atualizações constantes", "Melhorias contínuas no produto."],
      ],
      componentes: [
        ["Núcleo principal", "A base que entrega o resultado"],
        ["Módulos extras", "Aprofundamento opcional"],
        ["Ferramentas", "Recursos que economizam tempo"],
        ["Comunidade", "Troca com outros usuários"],
        ["Suporte", "Atendimento dedicado"],
      ],
      passos: ["Crie sua conta", "Siga o primeiro módulo", "Aplique o que foi ensinado", "Tire dúvidas no suporte", "Evolua para o próximo nível"],
      pros: ["Começo imediato", "Conteúdo direto ao ponto", "Boa relação custo-benefício"],
      contras: ["Depende da sua dedicação", "Alguns recursos são em inglês"],
      alts: ["Concorrente direto", "Solução caseira (gratuita)"],
    },
  },

  en: {
    saude: {
      beneficios: [
        ["All-day energy", "Formula designed to sustain stamina without caffeine spikes."],
        ["Metabolic support", "Components that assist metabolism for busy routines."],
        ["Stronger immunity", "Nutrients that support the body's natural defenses."],
        ["Faster recovery", "Helps regeneration after physical strain."],
        ["Better sleep quality", "Calming action that supports restful nights."],
      ],
      componentes: [
        ["B-Complex", "Energy metabolism and fatigue reduction"],
        ["Vitamin D3", "Immunity and bone health support"],
        ["Magnesium", "Muscle relaxation and sleep quality"],
        ["Zinc", "Immune defense and recovery"],
        ["Natural extract", "Antioxidant support and general wellness"],
      ],
      passos: ["Read the label before first use", "Take the indicated dose with water", "Keep fixed times every day", "Stay hydrated and eat balanced meals", "Evaluate results after 30 days"],
      pros: ["Formula with recognized components", "Simple use, no complicated protocols", "Manufacturer with guarantee and support"],
      contras: ["Results require consistency", "Stock is limited on the official site"],
      alts: ["Pharmacy alternative", "Similar generic brand"],
    },
    beleza: {
      beneficios: [
        ["Healthier appearance", "A simple routine that restores glow to skin and hair."],
        ["Deep hydration", "Actives that retain water in skin layers."],
        ["Anti-aging action", "Antioxidants that fight signs of time."],
        ["Shine and softness", "Light texture that leaves no residue."],
        ["For all skin types", "Balanced formula, tested for daily use."],
      ],
      componentes: [
        ["Hyaluronic acid", "Hydration and surface plumping"],
        ["Vitamin C", "Brightness and antioxidant protection"],
        ["Retinol", "Cell renewal and firmness"],
        ["Niacinamide", "Oil control and pore appearance"],
        ["Ceramides", "Skin protective barrier"],
      ],
      passos: ["Cleanse your face before applying", "Use the indicated amount", "Apply with gentle circular motions", "Let it absorb before makeup", "Repeat morning and night"],
      pros: ["Visible results in weeks", "Light, fast-absorbing texture", "Works under makeup"],
      contras: ["Continuous use required", "Varies by skin type"],
      alts: ["Pharmacy cream", "Similar imported brand"],
    },
    financas: {
      beneficios: [
        ["Easier approval", "Process designed for profiles previously declined."],
        ["No hidden fees", "Clear conditions from the first access."],
        ["Competitive limit", "Adjusted to your usage profile."],
        ["Real benefits", "Cashback and reward programs."],
        ["App management", "Full control of spending and bills."],
      ],
      componentes: [
        ["Annual fee", "Conditions per chosen package"],
        ["Cashback", "Rewards on eligible purchases"],
        ["Security", "Transaction protection and monitoring"],
        ["Support", "Human help when you need it"],
        ["App", "Complete management in your hand"],
      ],
      passos: ["Check your eligibility", "Complete the official application", "Submit requested documents", "Wait for analysis", "Receive and activate your product"],
      pros: ["100% online process", "Transparent conditions", "Dedicated support"],
      contras: ["Approval depends on analysis", "Minimum Score requirements"],
      alts: ["Traditional bank", "Another fintech in the segment"],
    },
    idiomas: {
      beneficios: [
        ["Learn at your pace", "Short lessons that fit your routine."],
        ["Validated method", "Structure tested with thousands of students."],
        ["Native teachers", "Real pronunciation and cultural context."],
        ["Certificate", "Proof at the end of each module."],
        ["Lifetime access", "Study whenever and wherever."],
      ],
      componentes: [
        ["Modules", "Progression from basic to advanced"],
        ["Native audio", "Listening training from day 1"],
        ["Exercises", "Reinforcement through spaced repetition"],
        ["Community", "Practice with other students"],
        ["Certificate", "Validation of your progress"],
      ],
      passos: ["Take the placement test", "Choose your study schedule", "Watch the lesson of the day", "Practice with exercises", "Advance when you finish a module"],
      pros: ["Total schedule flexibility", "Modern teaching method", "Active community"],
      contras: ["Requires daily discipline", "Some modules are in English"],
      alts: ["In-person course", "Free language app"],
    },
    geral: {
      beneficios: [
        ["Practical results", "Built for those starting from zero."],
        ["Easy to start", "No long learning curve."],
        ["Support included", "Help when you get stuck."],
        ["Value for money", "Fair price for what it delivers."],
        ["Constant updates", "Continuous product improvements."],
      ],
      componentes: [
        ["Main core", "The base that delivers results"],
        ["Extra modules", "Optional deep dives"],
        ["Tools", "Resources that save time"],
        ["Community", "Exchange with other users"],
        ["Support", "Dedicated assistance"],
      ],
      passos: ["Create your account", "Follow the first module", "Apply what you learned", "Ask support when stuck", "Move to the next level"],
      pros: ["Immediate start", "Straight-to-the-point content", "Good value"],
      contras: ["Depends on your dedication", "Some features are in English"],
      alts: ["Direct competitor", "DIY (free) solution"],
    },
  },

  es: {
    saude: {
      beneficios: [
        ["Más energía a diario", "Fórmula pensada para sostener el vigor sin picos de cafeína."],
        ["Apoyo metabólico", "Componentes que auxilian el metabolismo en rutinas intensas."],
        ["Inmunidad reforzada", "Nutrientes de apoyo a las defensas naturales."],
        ["Recuperación más rápida", "Ayuda en la regeneración tras el esfuerzo físico."],
        ["Mejor calidad de sueño", "Acción calmante que favorece el descanso."],
      ],
      componentes: [
        ["Complejo B", "Metabolismo energético y reducción de fatiga"],
        ["Vitamina D3", "Apoyo a inmunidad y salud ósea"],
        ["Magnesio", "Relajación muscular y calidad del sueño"],
        ["Zinc", "Defensas del organismo y recuperación"],
        ["Extracto natural", "Apoyo antioxidante y bienestar general"],
      ],
      passos: ["Lee la etiqueta antes del primer uso", "Toma la dosis indicada con agua", "Mantén horarios fijos cada día", "Hidrátate y come de forma equilibrada", "Evalúa resultados tras 30 días"],
      pros: ["Fórmula con componentes reconocidos", "Uso simple, sin protocolos complicados", "Fabricante con garantía y soporte"],
      contras: ["El resultado exige constancia", "Stock limitado en el sitio oficial"],
      alts: ["Alternativa de farmacia", "Marca genérica similar"],
    },
    beleza: {
      beneficios: [
        ["Apariencia más saludable", "Rutina simple que devuelve brillo a piel y cabello."],
        ["Hidratación profunda", "Activos que retienen agua en las capas de la piel."],
        ["Acción antiedad", "Antioxidantes que combaten los signos del tiempo."],
        ["Brillo y suavidad", "Textura ligera que no deja residuo."],
        ["Para todo tipo de piel", "Fórmula equilibrada y de uso diario."],
      ],
      componentes: [
        ["Ácido hialurónico", "Hidratación y relleno superficial"],
        ["Vitamina C", "Brillo y protección antioxidante"],
        ["Retinol", "Renovación celular y firmeza"],
        ["Niacinamida", "Control de oleosidad y poros"],
        ["Ceramidas", "Barrera protectora de la piel"],
      ],
      passos: ["Limpia el rostro antes de aplicar", "Usa la cantidad indicada", "Aplica con movimientos circulares suaves", "Espera a que absorba antes del maquillaje", "Repite por la mañana y la noche"],
      pros: ["Resultados visibles en semanas", "Textura ligera de rápida absorción", "Compatible con maquillaje"],
      contras: ["Requiere uso continuo", "Varía según el tipo de piel"],
      alts: ["Crema de farmacia", "Marca importada similar"],
    },
    financas: {
      beneficios: [
        ["Aprobación más fácil", "Proceso pensado para perfiles antes rechazados."],
        ["Sin cargos ocultos", "Condiciones claras desde el primer acceso."],
        ["Límite competitivo", "Ajuste según tu perfil de uso."],
        ["Beneficios reales", "Cashback y programas de recompensa."],
        ["Gestión desde la app", "Control total de gastos y facturas."],
      ],
      componentes: [
        ["Cuota anual", "Condiciones según el paquete elegido"],
        ["Cashback", "Recompensa en compras elegibles"],
        ["Seguridad", "Protección y monitoreo de transacciones"],
        ["Atención", "Soporte humano cuando lo necesites"],
        ["App", "Gestión completa en tu mano"],
      ],
      passos: ["Verifica tu elegibilidad", "Completa el registro oficial", "Envía los documentos solicitados", "Espera el análisis", "Recibe y activa tu producto"],
      pros: ["Proceso 100% online", "Condiciones transparentes", "Soporte dedicado"],
      contras: ["La aprobación depende del análisis", "Requisitos mínimos de Score"],
      alts: ["Banco tradicional", "Otra fintech del sector"],
    },
    idiomas: {
      beneficios: [
        ["Aprende a tu ritmo", "Lecciones cortas que caben en tu rutina."],
        ["Método validado", "Estructura probada con miles de alumnos."],
        ["Profesores nativos", "Pronunciación y contexto cultural reales."],
        ["Certificado", "Comprobación al final de cada módulo."],
        ["Acceso de por vida", "Estudia cuándo y dónde quieras."],
      ],
      componentes: [
        ["Módulos", "Progresión de básico a avanzado"],
        ["Audios nativos", "Entrenamiento de escucha desde el día 1"],
        ["Ejercicios", "Fijación por repetición espaciada"],
        ["Comunidad", "Práctica con otros alumnos"],
        ["Certificado", "Validación de tu progreso"],
      ],
      passos: ["Haz el test de nivelación", "Elige tu horario de estudio", "Mira la lección del día", "Practica con los ejercicios", "Avanza al terminar un módulo"],
      pros: ["Flexibilidad total de horarios", "Método moderno", "Comunidad activa"],
      contras: ["Exige disciplina diaria", "Algunos módulos están en inglés"],
      alts: ["Curso presencial", "App gratuita de idiomas"],
    },
    geral: {
      beneficios: [
        ["Resultados prácticos", "Pensado para quien empieza desde cero."],
        ["Fácil de empezar", "Sin curva de aprendizaje larga."],
        ["Soporte incluido", "Ayuda cuando te trabes."],
        ["Relación calidad-precio", "Precio justo para lo que entrega."],
        ["Actualizaciones constantes", "Mejoras continuas del producto."],
      ],
      componentes: [
        ["Núcleo principal", "La base que entrega el resultado"],
        ["Módulos extra", "Profundización opcional"],
        ["Herramientas", "Recursos que ahorran tiempo"],
        ["Comunidad", "Intercambio con otros usuarios"],
        ["Soporte", "Atención dedicada"],
      ],
      passos: ["Crea tu cuenta", "Sigue el primer módulo", "Aplica lo aprendido", "Consulta al soporte", "Avanza al siguiente nivel"],
      pros: ["Inicio inmediato", "Contenido directo", "Buena relación calidad-precio"],
      contras: ["Depende de tu dedicación", "Algunas funciones están en inglés"],
      alts: ["Competidor directo", "Solución casera (gratis)"],
    },
  },

  de: {
    saude: {
      beneficios: [
        ["Energie für den Tag", "Formel für Ausdauer ohne Koffein-Spitzen."],
        ["Stoffwechsel-Unterstützung", "Komponenten für intensive Alltagsroutinen."],
        ["Gestärkte Abwehrkräfte", "Nährstoffe zur Unterstützung der natürlichen Abwehr."],
        ["Schnellere Erholung", "Hilft bei der Regeneration nach Belastung."],
        ["Bessere Schlafqualität", "Beruhigende Wirkung für erholsame Nächte."],
      ],
      componentes: [
        ["B-Komplex", "Energiestoffwechsel und Müdigkeitsreduktion"],
        ["Vitamin D3", "Unterstützung von Immunsystem und Knochen"],
        ["Magnesium", "Muskelentspannung und Schlafqualität"],
        ["Zink", "Abwehrkräfte und Regeneration"],
        ["Naturextrakt", "Antioxidative Unterstützung und Wohlbefinden"],
      ],
      passos: ["Vor dem ersten Gebrauch das Etikett lesen", "Angegebene Dosis mit Wasser einnehmen", "Täglich feste Zeiten einhalten", "Ausreichend trinken und ausgewogen essen", "Ergebnisse nach 30 Tagen bewerten"],
      pros: ["Formel mit anerkannten Komponenten", "Einfache Anwendung ohne komplizierte Protokolle", "Hersteller mit Garantie und Support"],
      contras: ["Ergebnisse erfordern Konstanz", "Bestand auf der offiziellen Seite begrenzt"],
      alts: ["Apotheken-Alternative", "Ähnliche Generika-Marke"],
    },
    beleza: {
      beneficios: [
        ["Gesünderes Erscheinungsbild", "Einfache Routine für strahlende Haut und Haare."],
        ["Tiefenhydration", "Wirkstoffe, die Wasser in den Hautschichten halten."],
        ["Anti-Aging-Wirkung", "Antioxidantien gegen Zeichen der Zeit."],
        ["Glanz und Geschmeidigkeit", "Leichte Textur ohne Rückstände."],
        ["Für alle Hauttypen", "Ausgewogene Formel für die tägliche Anwendung."],
      ],
      componentes: [
        ["Hyaluronsäure", "Hydration und Oberflächen-Auffüllung"],
        ["Vitamin C", "Ausstrahlung und antioxidativer Schutz"],
        ["Retinol", "Zellerneuerung und Festigkeit"],
        ["Niacinamid", "Kontrolle von Öl und Porenbild"],
        ["Ceramide", "Schutzbarriere der Haut"],
      ],
      passos: ["Gesicht vor der Anwendung reinigen", "Angegebene Menge verwenden", "Mit sanften Kreisbewegungen auftragen", "Vor dem Make-up einziehen lassen", "Morgens und abends wiederholen"],
      pros: ["Sichtbare Ergebnisse in Wochen", "Leichte, schnell einziehende Textur", "Unter Make-up geeignet"],
      contras: ["Kontinuierliche Anwendung nötig", "Variiert je nach Hauttyp"],
      alts: ["Apotheken-Creme", "Ähnliche Importmarke"],
    },
    financas: {
      beneficios: [
        ["Einfachere Genehmigung", "Prozess für zuvor abgelehnte Profile."],
        ["Keine versteckten Kosten", "Klare Bedingungen ab dem ersten Zugriff."],
        ["Wettbewerbsfähiges Limit", "Angepasst an dein Nutzungsprofil."],
        ["Echte Vorteile", "Cashback und Prämienprogramme."],
        ["Verwaltung per App", "Volle Kontrolle über Ausgaben und Rechnungen."],
      ],
      componentes: [
        ["Jahresgebühr", "Bedingungen je nach gewähltem Paket"],
        ["Cashback", "Prämie für berechtigte Käufe"],
        ["Sicherheit", "Schutz und Überwachung von Transaktionen"],
        ["Service", "Menschliche Hilfe, wenn nötig"],
        ["App", "Komplette Verwaltung in der Hand"],
      ],
      passos: ["Eignung prüfen", "Offizielle Anmeldung ausfüllen", "Angeforderte Dokumente einreichen", "Analyse abwarten", "Produkt erhalten und aktivieren"],
      pros: ["100% online", "Transparente Bedingungen", "Persönlicher Support"],
      contras: ["Genehmigung hängt von der Analyse ab", "Mindestanforderungen an den Score"],
      alts: ["Traditionelle Bank", "Andere Fintech im Segment"],
    },
    idiomas: {
      beneficios: [
        ["Lerne in deinem Tempo", "Kurze Lektionen, die in den Alltag passen."],
        ["Bewährte Methode", "Struktur mit Tausenden Schülern getestet."],
        ["Muttersprachliche Lehrer", "Echte Aussprache und kultureller Kontext."],
        ["Zertifikat", "Nachweis am Ende jedes Moduls."],
        ["Lebenslanger Zugang", "Lerne wann und wo du willst."],
      ],
      componentes: [
        ["Module", "Progression von Basis bis Fortgeschritten"],
        ["Native Audios", "Hörtraining ab Tag 1"],
        ["Übungen", "Festigung durch verteiltes Wiederholen"],
        ["Community", "Praxis mit anderen Lernenden"],
        ["Zertifikat", "Bestätigung deines Fortschritts"],
      ],
      passos: ["Einstufungstest machen", "Lernplan wählen", "Lektion des Tages ansehen", "Mit Übungen praktizieren", "Nach Modulabschluss aufsteigen"],
      pros: ["Völlig flexible Zeiten", "Moderne Lehrmethode", "Aktive Community"],
      contras: ["Erfordert tägliche Disziplin", "Einige Module auf Englisch"],
      alts: ["Präsenzkurs", "Kostenlose Sprach-App"],
    },
    geral: {
      beneficios: [
        ["Praktische Ergebnisse", "Gemacht für alle, die bei Null starten."],
        ["Einfacher Einstieg", "Keine lange Lernkurve."],
        ["Support inklusive", "Hilfe, wenn du nicht weiterkommst."],
        ["Preis-Leistung", "Fairer Preis für das, was geliefert wird."],
        ["Ständige Updates", "Kontinuierliche Produktverbesserungen."],
      ],
      componentes: [
        ["Hauptkern", "Die Basis, die Ergebnisse liefert"],
        ["Zusatzmodule", "Optionale Vertiefungen"],
        ["Werkzeuge", "Ressourcen, die Zeit sparen"],
        ["Community", "Austausch mit anderen Nutzern"],
        ["Support", "Persönliche Betreuung"],
      ],
      passos: ["Konto erstellen", "Erstes Modul durcharbeiten", "Gelerntes anwenden", "Bei Fragen Support fragen", "Auf die nächste Stufe wechseln"],
      pros: ["Sofortiger Start", "Direkter Inhalt", "Gutes Preis-Leistung-Verhältnis"],
      contras: ["Hängt von deiner Disziplin ab", "Einige Funktionen auf Englisch"],
      alts: ["Direkter Wettbewerber", "DIY-Lösung (kostenlos)"],
    },
  },
};

export function dict(lang: Lang): Dict {
  return DICTS[lang] ?? DICTS.pt;
}

export function pool(lang: Lang, nicho: Nicho): Pool {
  return POOLS[lang]?.[nicho] ?? POOLS.pt.geral;
}
