// Xpressya — gerador estático minimalista (Node 18+). `node build.js` → dist/
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'dist');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/config.json'), 'utf8'));
const { products } = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/products.json'), 'utf8'));
const CATS = cfg.categorias;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync(path.join(ROOT, 'public'), OUT, { recursive: true });

// ---------- links de afiliado ----------
function amazonLink(url) {
  if (!cfg.amazon_tag) return url;
  const u = new URL(url);
  u.searchParams.set('tag', cfg.amazon_tag);
  return u.toString();
}
function mlLink(p) { return p.ml_afiliado || p.ml; }
const byId = Object.fromEntries(products.map(p => [p.id, p]));

// ---------- componentes ----------
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function productCard(p, compact = false) {
  const badge = p.ticket === 'alto' ? '<span class="badge alto">High ticket</span>' : p.ticket === 'medio' ? '<span class="badge">Meio</span>' : '<span class="badge low">Entrada</span>';
  return `<article class="card prod ${compact ? 'compact' : ''}" id="p-${p.id}">
    <div class="card-top"><span class="cat">${esc(CATS[p.cat].nome)}</span>${badge}</div>
    <h3>${esc(p.nome)}</h3>
    <p class="marca">${esc(p.marca)} · <span class="faixa">${esc(p.faixa)}</span></p>
    <p class="resumo">${esc(p.resumo)}</p>
    <div class="btns">
      <a class="btn ml" href="${esc(mlLink(p))}" target="_blank" rel="nofollow sponsored noopener">Ver no Mercado Livre</a>
      <a class="btn amz" href="${esc(amazonLink(p.amazon))}" target="_blank" rel="nofollow sponsored noopener">Ver na Amazon</a>
    </div>
  </article>`;
}

function productsGrid(list, compact) { return `<div class="grid">${list.map(p => productCard(p, compact)).join('')}</div>`; }

// shortcode em markdown: {{produto:id}} e {{produtos:id1,id2}}
function expandShortcodes(md) {
  return md
    .replace(/\{\{produtos:([\w,\s-]+)\}\}/g, (_, ids) => productsGrid(ids.split(',').map(s => byId[s.trim()]).filter(Boolean), true))
    .replace(/\{\{produto:([\w-]+)\}\}/g, (_, id) => byId[id] ? productCard(byId[id], true) : '');
}

function layout({ title, desc, body, url = '/', type = 'website', jsonld = '' }) {
  const fullTitle = title === cfg.nome ? `${cfg.nome} — ${cfg.tagline}` : `${title} · ${cfg.nome}`;
  const nav = Object.entries(CATS).map(([k, c]) => `<a href="/${k}/">${esc(c.nome)}</a>`).join('');
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${cfg.url}${url}">
<meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="${type}"><meta property="og:url" content="${cfg.url}${url}"><meta property="og:site_name" content="${cfg.nome}"><meta property="og:locale" content="pt_BR">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="${cfg.nome}" href="/feed.xml">
<link rel="stylesheet" href="/style.css">
${jsonld ? `<script type="application/ld+json">${jsonld}</script>` : ''}
${cfg.ga4 ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${cfg.ga4}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${cfg.ga4}');</script>` : ''}
</head><body>
<header class="site"><div class="wrap">
  <a class="logo" href="/"><span>xpress</span>ya</a>
  <nav>${nav}<a href="/produtos/" class="hl">Produtos</a><a href="/sobre/">Sobre</a></nav>
</div></header>
<main class="wrap">${body}</main>
<footer class="site"><div class="wrap">
  <p><strong>${cfg.nome}</strong> — ${esc(cfg.tagline)}.</p>
  <p class="disc">${esc(cfg.disclosure)}</p>
  <p><a href="/privacidade/">Privacidade</a> · <a href="/sobre/">Sobre</a> · <a href="/feed.xml">RSS</a> · © ${new Date().getFullYear()} ${cfg.nome}</p>
</div></footer>
<script>document.querySelectorAll('a.btn').forEach(a=>a.addEventListener('click',()=>{window.gtag&&gtag('event','affiliate_click',{store:a.classList.contains('ml')?'mercadolivre':'amazon',product:a.closest('.prod').id})}))</script>
</body></html>`;
}

function write(rel, html) {
  const f = path.join(OUT, rel, 'index.html');
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
}

// ---------- posts ----------
function parsePost(file) {
  const raw = fs.readFileSync(path.join(ROOT, 'content/posts', file), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const meta = {};
  m[1].split('\n').forEach(l => { const i = l.indexOf(':'); if (i > 0) meta[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, ''); });
  meta.slug = meta.slug || file.replace(/\.md$/, '');
  meta.tags = (meta.tags || '').split(',').map(s => s.trim()).filter(Boolean);
  meta.html = marked.parse(expandShortcodes(m[2]));
  meta.min = Math.max(2, Math.round(m[2].split(/\s+/).length / 200));
  return meta;
}
const posts = fs.readdirSync(path.join(ROOT, 'content/posts')).filter(f => f.endsWith('.md')).map(parsePost)
  .sort((a, b) => b.date.localeCompare(a.date));

function postCard(p) {
  return `<article class="card post"><span class="cat">${esc(CATS[p.cat].nome)}</span>
  <h3><a href="/${p.cat}/${p.slug}/">${esc(p.title)}</a></h3><p>${esc(p.desc)}</p>
  <p class="meta">${p.date} · ${p.min} min de leitura</p></article>`;
}

// páginas de post
for (const p of posts) {
  const rel = `${p.cat}/${p.slug}`;
  const related = posts.filter(x => x.cat === p.cat && x.slug !== p.slug).slice(0, 3);
  const jsonld = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.desc, datePublished: p.date, author: { '@type': 'Organization', name: cfg.nome }, publisher: { '@type': 'Organization', name: cfg.nome }, mainEntityOfPage: `${cfg.url}/${rel}/` });
  write(rel, layout({ title: p.title, desc: p.desc, url: `/${rel}/`, type: 'article', jsonld, body: `
  <article class="article">
    <p class="crumbs"><a href="/">Início</a> › <a href="/${p.cat}/">${esc(CATS[p.cat].nome)}</a></p>
    <h1>${esc(p.title)}</h1>
    <p class="meta">${p.date} · ${p.min} min de leitura</p>
    <p class="disc small">${esc(cfg.disclosure)}</p>
    ${p.html}
  </article>
  ${related.length ? `<section><h2>Leia também</h2><div class="grid">${related.map(postCard).join('')}</div></section>` : ''}` }));
}

// páginas de categoria
for (const [k, c] of Object.entries(CATS)) {
  const cp = posts.filter(p => p.cat === k);
  const pr = products.filter(p => p.cat === k);
  write(k, layout({ title: c.nome, desc: c.desc, url: `/${k}/`, body: `
  <h1>${esc(c.nome)}</h1><p class="lead">${esc(c.desc)}</p>
  ${cp.length ? `<h2>Guias e artigos</h2><div class="grid">${cp.map(postCard).join('')}</div>` : ''}
  ${pr.length ? `<h2>Produtos selecionados</h2>${productsGrid(pr)}` : ''}` }));
}

// produtos (todos) com filtros
write('produtos', layout({ title: 'Produtos selecionados', desc: 'Curadoria de produtos de bem-estar, casa inteligente e games saudáveis com links para Mercado Livre e Amazon.', url: '/produtos/', body: `
<h1>Produtos selecionados</h1><p class="lead">Só entra aqui o que tem marca com garantia no Brasil, selo Anatel/Inmetro quando exigido e avaliação consistente. Links levam ao Mercado Livre e à Amazon.</p>
<div class="filters">${Object.entries(CATS).map(([k, c]) => `<button data-f="${k}">${esc(c.nome)}</button>`).join('')}<button data-f="alto">High ticket</button><button data-f="" class="on">Todos</button></div>
${productsGrid(products)}
<script>const F=${JSON.stringify(Object.fromEntries(products.map(p=>[p.id,p.cat+' '+p.ticket])))};document.querySelectorAll('.prod').forEach(c=>c.dataset.f=F[c.id.slice(2)]);document.querySelectorAll('.filters button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('on'));b.classList.add('on');const f=b.dataset.f;document.querySelectorAll('.prod').forEach(c=>{c.style.display=!f||c.dataset.f.split(' ').includes(f)?'':'none'})});</script>` }));

// home
const destaques = products.filter(p => p.destaque);
write('', layout({ title: cfg.nome, desc: cfg.tagline, url: '/', body: `
<section class="hero"><h1>Sua casa pode cuidar de você.</h1>
<p>Guias honestos sobre bem-estar em casa, automação residencial e games saudáveis — com foco no que realmente muda a qualidade de vida, não em gadget descartável.</p>
<div class="btns"><a class="btn" href="/produtos/">Ver curadoria de produtos</a><a class="btn ghost" href="/bemestar/">Começar pelo bem-estar</a></div></section>
<section><h2>Últimos artigos</h2><div class="grid">${posts.slice(0, 6).map(postCard).join('')}</div></section>
<section><h2>Destaques high ticket</h2><p class="lead">Compras que valem planejamento — e que a gente explica antes de você clicar.</p>${productsGrid(destaques)}</section>
<section class="cats">${Object.entries(CATS).map(([k, c]) => `<a class="cat-tile" href="/${k}/"><strong>${esc(c.nome)}</strong><span>${esc(c.desc)}</span></a>`).join('')}</section>` }));

// páginas fixas
write('sobre', layout({ title: 'Sobre', desc: 'O que é a Xpressya e como escolhemos produtos.', url: '/sobre/', body: marked.parse(fs.readFileSync(path.join(ROOT, 'content/sobre.md'), 'utf8').replace('{{disclosure}}', cfg.disclosure)) }));
write('privacidade', layout({ title: 'Privacidade', desc: 'Política de privacidade e cookies.', url: '/privacidade/', body: marked.parse(fs.readFileSync(path.join(ROOT, 'content/privacidade.md'), 'utf8')) }));

// sitemap, rss, robots
const urls = ['/', '/produtos/', '/sobre/', '/privacidade/', ...Object.keys(CATS).map(k => `/${k}/`), ...posts.map(p => `/${p.cat}/${p.slug}/`)];
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u => `<url><loc>${cfg.url}${u}</loc></url>`).join('')}</urlset>`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${cfg.url}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${cfg.nome}</title><link>${cfg.url}</link><description>${esc(cfg.tagline)}</description>${posts.map(p => `<item><title>${esc(p.title)}</title><link>${cfg.url}/${p.cat}/${p.slug}/</link><guid>${cfg.url}/${p.cat}/${p.slug}/</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${esc(p.desc)}</description></item>`).join('')}</channel></rss>`);

console.log(`✔ ${posts.length} posts, ${products.length} produtos, ${urls.length} URLs → dist/`);
