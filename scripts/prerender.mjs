/**
 * Static prerenderer for linacre.site
 * -----------------------------------
 * Runs after `vite build`. For every route in route-meta.json it emits
 * dist/<route>/index.html containing:
 *   1. A single, correctly ordered head (charset/viewport first, one OG set,
 *      one Twitter set, canonical, robots) sourced only from route-meta.json.
 *   2. Route-appropriate JSON-LD (Person/WebSite everywhere; BlogPosting +
 *      BreadcrumbList on articles; ItemList on / and /projects).
 *   3. A semantic static content snapshot inside #root so crawlers and no-JS
 *      visitors get real page content. React replaces it on hydration.
 * It also generates dist/sitemap.xml (index:true routes only, real lastmod)
 * and FAILS THE BUILD if any sitemap URL lacks an emitted file.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build as esbuild } from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('[prerender] dist/index.html not found — run vite build first.');
  process.exit(1);
}

// ---------------------------------------------------------------- utilities
const esc = (s = '') => String(s)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

/** Minimal, dependency-free markdown → HTML for blog bodies. */
function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let inCode = false, codeLang = '', codeBuf = [], para = [], list = [];
  const flushPara = () => {
    if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; }
  };
  const flushList = () => {
    if (list.length) { out.push(`<ul>${list.map(li => `<li>${inline(li)}</li>`).join('')}</ul>`); list = []; }
  };
  const inline = (s) => esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
  for (const raw of lines) {
    const line = raw;
    if (line.trim().startsWith('```')) {
      if (!inCode) { flushPara(); flushList(); inCode = true; codeLang = line.trim().slice(3).trim(); codeBuf = []; }
      else { out.push(`<pre><code${codeLang ? ` class="language-${esc(codeLang)}"` : ''}>${esc(codeBuf.join('\n'))}</code></pre>`); inCode = false; }
      continue;
    }
    if (inCode) { codeBuf.push(line); continue; }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) { flushPara(); flushList(); const lvl = h[1].length === 1 ? 2 : h[1].length; out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`); continue; }
    const li = line.match(/^\s*[-*]\s+(.*)$/);
    if (li) { flushPara(); list.push(li[1]); continue; }
    if (!line.trim()) { flushPara(); flushList(); continue; }
    para.push(line.trim());
  }
  flushPara(); flushList();
  return out.join('\n');
}

// ------------------------------------------------------------- site content
// Strip a possible UTF-8 BOM before parsing -- some Windows editors/tools
// save JSON with a leading BOM, which breaks JSON.parse silently otherwise.
const stripBom = (s) => (s.charCodeAt(0) === 0xFEFF ? s.slice(1) : s);
const meta = JSON.parse(stripBom(fs.readFileSync(path.join(root, 'route-meta.json'), 'utf8')));

// Bundle the typed data module, then import it.
const dataBundle = path.join(distDir, '.prerender-data.mjs');
await esbuild({
  entryPoints: [path.join(root, 'scripts', 'prerender-data.entry.ts')],
  bundle: true, format: 'esm', platform: 'node', outfile: dataBundle, logLevel: 'silent',
});
const { data } = await import(pathToFileURL(dataBundle).href);
fs.rmSync(dataBundle, { force: true });

const SITE = 'https://www.linacre.site';
const PERSON = {
  '@type': 'Person', '@id': `${SITE}/#person`, name: 'David Linacre', url: `${SITE}/`,
  sameAs: ['https://github.com/LIN4CRE', 'https://linkedin.com/in/davidlinacre'],
  jobTitle: 'Full Stack Developer & AI Engineer',
  description: 'Developer building open-source tools, AI applications, and developer utilities.',
  knowsAbout: ['React', 'TypeScript', 'Node.js', 'Python', 'AI', 'Developer Tools'],
};
const WEBSITE = {
  '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'linacre.site',
  description: 'Developer portfolio, toolkit directory, project hub, and AI playground by David Linacre.',
  publisher: { '@id': `${SITE}/#person` },
};

const featured = data.projects.filter(p => p.url).slice(0, 6);
const publicProjects = data.projects.filter(p => p.url);
const caseStudies = data.projects.filter(p => ['GhostMail', 'DomainDeals'].includes(p.name));

function jsonLdFor(route, m) {
  const graph = [PERSON, WEBSITE];
  if (route === '/' || route === '/projects') {
    graph.push({
      '@type': 'ItemList', '@id': `${SITE}${route === '/' ? '/' : route}#projects`, name: 'Featured Projects',
      itemListElement: publicProjects.map((p, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: { 
          '@type': 'SoftwareApplication', 
          'name': p.name, 
          'url': p.url || `${SITE}/projects`, 
          'description': p.description,
          'applicationCategory': p.category === 'deploy' ? 'DevOpsApplication' : 'DeveloperApplication', 
          'operatingSystem': 'Web',
          'author': { '@id': `${SITE}/#person` }
        },
      })),
    });
    // Enhanced: SoftwareSourceCode nodes for verifiable open-source case studies
    const ghostMail = caseStudies.find(p => p.name === 'GhostMail');
    if (ghostMail) {
      graph.push({
        '@type': 'SoftwareSourceCode',
        '@id': `${SITE}/#ghostmail`,
        name: 'GhostMail',
        description: ghostMail.description || 'Disposable email generation tool built with React and Vite.',
        codeRepository: 'https://github.com/LIN4CRE/GhostMail',
        url: ghostMail.url || 'https://github.com/LIN4CRE/GhostMail',
        programmingLanguage: ['TypeScript', 'React'],
        creator: { '@id': `${SITE}/#person` },
        license: 'https://opensource.org/licenses/MIT',
        applicationCategory: 'DeveloperApplication',
      });
    }
    const domainDeals = caseStudies.find(p => p.name === 'DomainDeals');
    if (domainDeals) {
      graph.push({
        '@type': 'SoftwareSourceCode',
        '@id': `${SITE}/#domaindeals`,
        name: 'DomainDeals',
        description: domainDeals.description || 'Domain availability search and deal-finding tool.',
        codeRepository: 'https://github.com/LIN4CRE/domaindeals',
        url: domainDeals.url || 'https://github.com/LIN4CRE/domaindeals',
        programmingLanguage: ['TypeScript', 'Node.js'],
        creator: { '@id': `${SITE}/#person` },
        license: 'https://opensource.org/licenses/MIT',
        applicationCategory: 'DeveloperApplication',
      });
    }
    // linacre.site itself as a SoftwareApplication
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': `${SITE}/#app`,
      name: 'linacre.site',
      description: 'Developer portfolio, toolkit directory, AI playground, and knowledge base by David Linacre.',
      url: `${SITE}/`,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      creator: { '@id': `${SITE}/#person` },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
    });
  }
  if (m.type === 'article') {
    const post = data.posts.find(p => `/blog/${p.slug}` === route);
    graph.push({
      '@type': 'BlogPosting', 
      '@id': `${m.canonical}#article`, 
      'headline': m.title.split(' | ')[0],
      'description': m.description, 
      'datePublished': m.published, 
      'dateModified': m.published,
      'inLanguage': 'en-GB',
      'author': { '@id': `${SITE}/#person` }, 
      'publisher': { 
        '@type': 'Organization', 
        'name': 'Linacre', 
        'logo': { 
          '@type': 'ImageObject', 
          'url': `${SITE}/favicon.svg` 
        } 
      },
      'image': m.image || meta.site.defaultImage, 
      'mainEntityOfPage': { 
        '@type': 'WebPage', 
        '@id': m.canonical 
      },
      'keywords': post ? post.tags.join(', ') : undefined, 
      'timeRequired': post ? post.readTime : undefined,
    });
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
        { '@type': 'ListItem', position: 3, name: m.title.split(' | ')[0], item: m.canonical },
      ],
    });
  }
  if (route === '/contact') {
    graph.push({
      '@type': 'ContactPage',
      '@id': `${SITE}/contact#page`,
      'url': `${SITE}/contact`,
      'name': m.title,
      'mainEntity': {
        '@type': 'ProfessionalService',
        '@id': `${SITE}/#service`,
        'name': 'David Linacre Consulting',
        'contactPoint': {
          '@type': 'ContactPoint',
          'contactType': 'sales',
          'email': 'david@linacre.site',
          'url': `${SITE}/contact`
        }
      }
    });
    graph.push({
      '@type': 'FAQPage',
      '@id': `${SITE}/contact#faq`,
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Are you available for freelance or contract projects?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, I am open to select freelance consulting and systems engineering contracts. My primary areas of focus are CI/CD pipelining, cloud migrations (GCP/AWS), backend engineering in Go/Node.js, and containerizing legacy systems. Reach out via the form above with your requirements.'
          }
        },
        {
          '@type': 'Question',
          'name': 'What is your primary technology stack?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'I specialize in TypeScript/React on the frontend, Go and Node.js on the backend, Docker/Kubernetes for containerization, and Terraform for Infrastructure as Code. I am also highly comfortable with database administration across PostgreSQL, MySQL, and Redis.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How do you handle project privacy and client security?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Security is baked into my design process from day one. I never hardcode credentials, using centralized secret architectures instead. I sign NDAs before discussing proprietary details, and all client repositories are fully isolated with strict IAM roles.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How can I request access to one of your private projects?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Click the \'Request Details / Access\' button on any project card in the Projects tab. It will automatically populate the contact form with a structured request. Once validated, I can arrange repository access or share architectural documents.'
          }
        }
      ]
    });
  }
  if (route === '/work') {
    graph.push({
      '@type': 'ProfessionalService',
      '@id': `${SITE}/work#service`,
      'name': 'David Linacre Consulting',
      'url': `${SITE}/work`,
      'logo': `${SITE}/favicon.svg`,
      'image': `${SITE}/favicon.svg`,
      'priceRange': '£££',
      'telephone': '',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Bradford',
        'addressRegion': 'West Yorkshire',
        'addressCountry': 'GB'
      },
      'serviceType': ['Freelance Full-Stack Developer', 'Contract AI Automation Systems Builder'],
      'provider': { '@id': `${SITE}/#person` },
      'areaServed': 'GB',
      'hasOfferCatalog': { '@id': `${SITE}/work#services` }
    });
    graph.push({
      '@type': 'OfferCatalog',
      '@id': `${SITE}/work#services`,
      'name': 'David Linacre Consulting & Development Offerings',
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Systems & Infrastructure Audit',
            'description': 'Deep technical review of your architecture, security, performance, and developer experience.'
          },
          'priceSpecification': {
            '@type': 'PriceSpecification',
            'price': '1800',
            'priceCurrency': 'GBP',
            'valueAddedTaxIncluded': true
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Custom Development Project',
            'description': 'End-to-end build of production-grade tools, automation platforms, or AI integrations.'
          },
          'priceSpecification': {
            '@type': 'PriceSpecification',
            'price': '6500',
            'priceCurrency': 'GBP',
            'valueAddedTaxIncluded': true
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Ongoing Engineering Retainer',
            'description': 'Dedicated fractional engineering time for ongoing improvements and rapid iteration.'
          },
          'priceSpecification': {
            '@type': 'PriceSpecification',
            'price': '2400',
            'priceCurrency': 'GBP',
            'valueAddedTaxIncluded': true
          }
        }
      ]
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}


function headFor(route, m) {
  const robots = m.index ? 'index, follow' : 'noindex, nofollow';
  const ogType = m.type === 'article' ? 'article' : 'website';
  const image = m.image || meta.site.defaultImage;
  const title = esc(m.title); const desc = esc(m.description);
  const lines = [
    `<title>${title}</title>`,
    `<meta name="description" content="${desc}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${m.canonical}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:site_name" content="${esc(meta.site.name)}" />`,
    `<meta property="og:locale" content="${esc(meta.site.locale)}" />`,
    `<meta property="og:url" content="${m.canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:alt" content="${title}" />`,
    `<meta name="twitter:card" content="${esc(meta.site.twitterCard)}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ];
  if (m.type === 'article' && m.published) {
    lines.push(`<meta property="article:published_time" content="${m.published}" />`);
    lines.push(`<meta property="article:author" content="David Linacre" />`);
  }
  lines.push(`<script type="application/ld+json">${jsonLdFor(route, m)}</script>`);
  return lines.join('\n    ');
}

// ------------------------------------------------- static content snapshots
const NAV = [
  ['/work', 'Work'], ['/projects', 'Projects'], ['/toolkit', 'Toolkit'], ['/learn', 'Learn'],
  ['/blog', 'Blog'], ['/playground', 'Playground'], ['/about', 'About'], ['/contact', 'Contact'],
];

const SHELL_CSS = `
#prerender-shell{max-width:60rem;margin:0 auto;padding:2rem 1.25rem;background:#0b0e14;color:#e5e5e5;
font-family:Inter,ui-sans-serif,system-ui,sans-serif;line-height:1.65;min-height:100vh}
#prerender-shell a{color:#ffb454;text-decoration:none}#prerender-shell a:hover{text-decoration:underline}
#prerender-shell nav{display:flex;flex-wrap:wrap;gap:.9rem;margin:1rem 0 2rem;font-family:'JetBrains Mono',monospace;font-size:.85rem}
#prerender-shell h1,#prerender-shell h2,#prerender-shell h3{font-family:'Space Grotesk',Inter,sans-serif;line-height:1.25}
#prerender-shell h1{font-size:1.9rem;margin:.25rem 0 .75rem}#prerender-shell h2{font-size:1.3rem;margin:2rem 0 .5rem;color:#ffb454}
#prerender-shell h3{font-size:1.05rem;margin:1.25rem 0 .4rem}
#prerender-shell pre{background:#11151f;border:1px solid #232838;border-radius:8px;padding:1rem;overflow:auto;font-size:.85rem}
#prerender-shell code{font-family:'JetBrains Mono',monospace;color:#9fe8ff}
#prerender-shell ul{padding-left:1.25rem}#prerender-shell li{margin:.3rem 0}
#prerender-shell .brand{font-family:'JetBrains Mono',monospace;font-weight:700;color:#ffb454;font-size:1rem}
#prerender-shell .meta{color:#8b93a7;font-size:.85rem;font-family:'JetBrains Mono',monospace}
#prerender-shell .cta{display:inline-block;background:#ffb454;color:#0b0e14;font-weight:700;padding:.6rem 1.1rem;border-radius:8px;margin:.5rem .75rem .5rem 0}
#prerender-shell .cta.alt{background:transparent;color:#ffb454;border:1px solid #ffb454}
#prerender-shell footer{margin-top:3rem;border-top:1px solid #232838;padding-top:1.25rem;font-size:.85rem;color:#8b93a7}
`.trim();

const CTA_BLOCK = `
<p>
  <a class="cta" href="/contact">Start a project — get in touch</a>
  <a class="cta alt" href="/projects">See selected work</a>
</p>`;

function pageBody(route, m) {
  const posts = data.posts;
  switch (true) {
    case route === '/':
      return `
<h1>David Linacre — full-stack engineer &amp; AI systems builder</h1>
<p>I design and ship reliable web applications, developer tools and automation systems.
I&#39;m based in the UK and <strong>currently available for freelance and contract work</strong>. See my <a href="/work">available services</a> —
from product builds to AI integrations and developer-experience tooling.</p>
${CTA_BLOCK}
<h2>What I do</h2>
<ul>
  <li><strong>Product engineering</strong> — React / TypeScript / Node applications, end to end.</li>
  <li><strong>AI integration</strong> — chat interfaces, agent workflows and model orchestration with cost controls.</li>
  <li><strong>Developer tooling &amp; automation</strong> — CLIs, pipelines, dashboards and self-hosted infrastructure.</li>
</ul>
<h2>Featured open-source work</h2>
<ul>
${featured.map(p => `  <li><a href="${esc(p.url)}" rel="noopener">${esc(p.name)}</a> — ${esc(p.description)}</li>`).join('\n')}
</ul>
<h2>Latest writing</h2>
<ul>
${posts.map(p => `  <li><a href="/blog/${esc(p.slug)}">${esc(p.title)}</a> <span class="meta">(${esc(p.date)} · ${esc(p.readTime)})</span></li>`).join('\n')}
</ul>
<h2>Free developer toolkit</h2>
<p>A curated directory of ${data.tools.length} free tools across ${data.toolCategoriesCount} categories —
<a href="/toolkit">browse the toolkit</a> or follow the <a href="/learn">learning roadmap</a>.</p>`;

    case route === '/projects': {
      const rows = publicProjects.map(p =>
        `  <li><a href="${esc(p.url)}" rel="noopener">${esc(p.name)}</a> <span class="meta">[${esc(p.category)}]</span> — ${esc(p.description)}</li>`).join('\n');
      const cs = caseStudies.map(p => `
<h3 id="${esc(p.name.toLowerCase())}">${esc(p.name)} — case study</h3>
<p>${esc(p.description)}</p>
${p.role ? `<p><strong>Role:</strong> ${esc(p.role)}</p>` : ''}
${p.challenges ? `<p><strong>Problem:</strong> ${esc(p.challenges)}</p>` : ''}
${p.solution ? `<p><strong>Approach:</strong> ${esc(p.solution)}</p>` : ''}
${p.tech?.length ? `<p><strong>Stack:</strong> ${esc(p.tech.join(', '))}</p>` : ''}
${p.url ? `<p><a href="${esc(p.url)}" rel="noopener">Source &amp; docs →</a></p>` : ''}`).join('\n');
      return `
<h1>Projects</h1>
<p>Selected tools and applications. Open-source work is linked directly; private and client work is available on request.</p>
<h2>Public projects</h2>
<ul>
${rows}
</ul>
<h2>Case studies</h2>
${cs}
${CTA_BLOCK}`;
    }

    case route === '/about':
      return `
<h1>About David Linacre</h1>
<p>I&#39;m a self-taught full-stack engineer focused on developer experience, automation and AI systems.
I build with React, TypeScript, Node.js, Python and Go, and I ship on Vercel, Docker and self-hosted infrastructure.</p>
<p>This site is my working environment as much as a portfolio: a free tool directory, a learning roadmap,
an AI lab and a set of browser utilities — all open to use.</p>
<ul>
  <li><a href="https://github.com/LIN4CRE" rel="noopener">GitHub — github.com/LIN4CRE</a></li>
  <li><a href="https://linkedin.com/in/davidlinacre" rel="noopener">LinkedIn — davidlinacre</a></li>
</ul>
${CTA_BLOCK}`;

    case route === '/toolkit': {
      const byCat = {};
      for (const t of data.tools) (byCat[t.category] ||= []).push(t);
      return `
<h1>Free developer toolkit</h1>
<p>${data.tools.length} curated free tools for building, deploying, designing and learning. No sign-up, no tracking — just links that earn their place.</p>
${Object.entries(byCat).map(([cat, tools]) => `
<h2>${esc(cat)}</h2>
<ul>
${tools.map(t => `  <li>${t.url ? `<a href="${esc(t.url)}" rel="noopener">${esc(t.name)}</a>` : esc(t.name)} — ${esc(t.description)}</li>`).join('\n')}
</ul>`).join('\n')}`;
    }

    case route === '/learn':
      return `
<h1>Learn web development from scratch</h1>
<p>A practical six-step roadmap I recommend to self-taught engineers — free resources only.</p>
${data.roadmap.map((s, i) => `<h2>Step ${i + 1}: ${esc(s.title)}</h2>\n<p>${esc(s.description)}</p>`).join('\n')}
<p>Pair the roadmap with the <a href="/toolkit">free toolkit directory</a>.</p>`;

    case route === '/blog':
      return `
<h1>Engineering notes</h1>
<p>Technical write-ups from real projects — concurrency, theming, caching and tooling.</p>
<ul>
${posts.map(p => `  <li>
    <h2><a href="/blog/${esc(p.slug)}">${esc(p.title)}</a></h2>
    <p class="meta">${esc(p.date)} · ${esc(p.readTime)} · ${p.tags.map(esc).join(', ')}</p>
    <p>${esc(p.excerpt)}</p>
  </li>`).join('\n')}
</ul>`;

    case route.startsWith('/blog/'): {
      const post = posts.find(p => `/blog/${p.slug}` === route);
      if (!post) return `<h1>${esc(m.title)}</h1><p>${esc(m.description)}</p>`;
      return `
<article>
  <h1>${esc(post.title)}</h1>
  <p class="meta">By David Linacre · ${esc(post.date)} · ${esc(post.readTime)} · ${post.tags.map(esc).join(', ')}</p>
  ${mdToHtml(post.content)}
</article>
<p><a href="/blog">← All engineering notes</a></p>`;
    }

    case route === '/playground':
      return `
<h1>Developer utility playground</h1>
<p>Browser-based utilities that run entirely client-side — nothing you paste ever leaves your machine:</p>
<ul>
  <li><strong>JWT inspector</strong> — decode and verify token structure.</li>
  <li><strong>Regex tester</strong> — live pattern matching with explanations.</li>
  <li><strong>Secure value generator</strong> — passwords, UUIDs and keys via the Web Crypto API.</li>
  <li><strong>Encoders &amp; formatters</strong> — Base64, URL, JSON and more.</li>
</ul>
<p class="meta">These tools require JavaScript. Enable JS to use the playground.</p>`;

    case route === '/work':
      return `
<h1>Work with David Linacre</h1>
<p>I help engineering groups ship faster, automate operations, and implement secure, high-throughput systems. Select contract services are outlined below.</p>
<h2>Offerings</h2>
<ul>
  <li><strong>Systems &amp; Infrastructure Audit</strong> — Deep technical review of your architecture, security, performance, and developer experience. From £1,800.</li>
  <li><strong>Custom Development Project</strong> — End-to-end build of production-grade tools, automation platforms, or AI integrations. From £6,500.</li>
  <li><strong>Ongoing Engineering Retainer</strong> — Dedicated fractional engineering time for ongoing improvements and rapid iteration. £2,400 / month.</li>
</ul>
<p>The interactive Work page (with secure scheduling links and booking forms) requires JavaScript.</p>
${CTA_BLOCK}`;

    case route === '/contact':
      return `
<h1>Contact David Linacre</h1>
<p><strong>Available for freelance and contract work.</strong> Tell me about your project — software design, developer tools, AI integration or automation.</p>
<form action="/api/contact" method="POST" style="display: flex; flex-direction: column; gap: 15px; margin: 20px 0; max-width: 500px; font-family: monospace;">
  <input type="hidden" name="startedAt" value="${Date.now()}" />
  <div style="display: flex; flex-direction: column; gap: 5px;">
    <label for="name" style="font-size: 10px; color: #a1a1aa; text-transform: uppercase; font-weight: bold;">Name *</label>
    <input type="text" id="name" name="name" required placeholder="Your Name" style="background: #0b0e14; border: 1px solid #2e3545; border-radius: 6px; padding: 10px; color: #e5e5e5; font-size: 12px; font-family: monospace;" />
  </div>
  <div style="display: flex; flex-direction: column; gap: 5px;">
    <label for="email" style="font-size: 10px; color: #a1a1aa; text-transform: uppercase; font-weight: bold;">Email Address *</label>
    <input type="email" id="email" name="email" required placeholder="you@example.com" style="background: #0b0e14; border: 1px solid #2e3545; border-radius: 6px; padding: 10px; color: #e5e5e5; font-size: 12px; font-family: monospace;" />
  </div>
  <div style="display: flex; flex-direction: column; gap: 5px;">
    <label for="subject" style="font-size: 10px; color: #a1a1aa; text-transform: uppercase; font-weight: bold;">Subject / Project Area</label>
    <input type="text" id="subject" name="subject" placeholder="e.g. Pipeline Design Consultation" style="background: #0b0e14; border: 1px solid #2e3545; border-radius: 6px; padding: 10px; color: #e5e5e5; font-size: 12px; font-family: monospace;" />
  </div>
  <div style="display: flex; flex-direction: column; gap: 5px;">
    <label for="message" style="font-size: 10px; color: #a1a1aa; text-transform: uppercase; font-weight: bold;">Transmission Body *</label>
    <textarea id="message" name="message" required rows="5" placeholder="Outline your requirements, tech specs, or inquiries..." style="background: #0b0e14; border: 1px solid #2e3545; border-radius: 6px; padding: 10px; color: #e5e5e5; font-size: 12px; font-family: monospace; resize: vertical;"></textarea>
  </div>
  <button type="submit" style="background: #f59e0b; border: none; border-radius: 6px; padding: 10px; color: #000000; font-weight: bold; cursor: pointer; font-size: 12px; font-family: monospace;">Send Message</button>
</form>
<ul>
  <li>Email: <a href="mailto:david@linacre.site">david@linacre.site</a></li>
  <li>GitHub: <a href="https://github.com/LIN4CRE" rel="noopener">github.com/LIN4CRE</a></li>
  <li>LinkedIn: <a href="https://linkedin.com/in/davidlinacre" rel="noopener">davidlinacre</a></li>
</ul>`;

    case route === '/privacy':
      return `
<h1>Privacy policy</h1>
<p>linacre.site does not run third-party analytics or advertising trackers. Browser storage is used only for
your own preferences (theme, brand customisation). Contact submissions are validated server-side, rate limited,
and used solely to reply to you. AI chat requests are proxied without building profiles.</p>
<p>Questions: <a href="mailto:david@linacre.site">david@linacre.site</a>.</p>`;

    case route === '/accessibility':
      return `
<h1>Accessibility statement</h1>
<p>linacre.site targets WCAG 2.2 AA: semantic landmarks, a skip link, visible focus states, keyboard operability
and <code>prefers-reduced-motion</code> support across pages. Static content is served for assistive technologies
and no-JS browsing. Known limitations and the feedback route are documented on this page&#39;s interactive version;
report issues to <a href="mailto:david@linacre.site">david@linacre.site</a>.</p>`;

    case route === '/agents':
      return `
<h1>Agents Hub</h1>
<p>Playbooks and executors for autonomous agent workflows used across the linacre.site toolchain —
task graphs, guardrails, scheduled runs and audit logs. The interactive hub requires JavaScript.</p>
<p>Related: <a href="/lab">AI Lab</a> · <a href="/toolkit">Toolkit</a> · <a href="/blog">Engineering notes</a></p>`;

    case route === '/lab':
      return `
<h1>AI Lab</h1>
<p>An interactive sandbox for chatting with AI models, testing prompts, and inspecting live context windows.</p>
<h3>Active LLM Proxy Models</h3>
<ul>
  <li><strong>Gemini 2.5 / 2.0 Flash:</strong> For rapid text completions and analysis.</li>
  <li><strong>GPT-4o:</strong> For advanced reasoning and code generation.</li>
  <li><strong>Claude 3.5 Sonnet:</strong> Powers agent orchestrations and system audits.</li>
 </ul>
<h3>Prompt Architecture</h3>
<p>Proxy endpoints enforce strict privacy controls: conversation logs are discarded immediately, and API keys are stored solely in your local browser storage.</p>
<p class="meta">The interactive AI chat client requires JavaScript. Enable JS to connect to the secure model proxy.</p>
<p>Related: <a href="/agents">Agents Hub</a> · <a href="/playground">Playground</a></p>`;

    case route === '/identity':
      return `
<h1>Identity Hub</h1>
<p>A live brand-system builder: customise colours, frames, motion and typography, preview the monogram
and export production-ready SVG. Changes persist locally in your browser. Requires JavaScript.</p>`;

    case route === '/status':
      return `
<h1>Site status</h1>
<p>Operational overview for linacre.site — page availability, API health and deployment state.</p>
<div style="background: #111622; border: 1px solid rgba(245,158,11,0.16); padding: 20px; border-radius: 12px; margin: 20px 0; max-width: 500px;">
  <h3 style="margin-top: 0; color: #f59e0b; font-size: 12px; font-family: monospace;">System Health (Build Snapshot)</h3>
  <ul style="list-style: none; padding-left: 0; margin-bottom: 0; font-family: monospace; font-size: 11px; color: #a1a1aa;">
    <li style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
      <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #34d399;"></span>
      <strong>Frontend (Global Edge):</strong> Operational
    </li>
    <li style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
      <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #34d399;"></span>
      <strong>Backend API:</strong> Operational
    </li>
    <li style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
      <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #34d399;"></span>
      <strong>Central Registry Sync:</strong> Synchronized (15/15 credentials)
    </li>
  </ul>
</div>
<p class="meta">The live status dashboard (with active path audits and server statistics) requires JavaScript. For raw API checks, visit <a href="/api/health">/api/health</a>.</p>`;

    default:
      return `<h1>${esc(m.title.split(' | ')[0])}</h1><p>${esc(m.description)}</p>`;
  }
}

function snapshot(route, m) {
  const nav = NAV.map(([href, label]) =>
    route === href ? `<a href="${href}" aria-current="page">${label}</a>` : `<a href="${href}">${label}</a>`).join('\n    ');
  return `<style>${SHELL_CSS}</style>
<div id="prerender-shell">
  <a class="brand" href="/">&gt; linacre.site</a>
  <nav aria-label="Primary">
    ${nav}
  </nav>
  <main id="main-content">${pageBody(route, m)}</main>
  <footer>
    <p>© ${new Date().getFullYear()} David Linacre · <a href="https://github.com/LIN4CRE" rel="noopener">GitHub</a> ·
    <a href="/work">Work</a> · <a href="/contact">Contact</a> · <a href="/privacy">Privacy</a> · <a href="/accessibility">Accessibility</a> ·
    <a href="/status">Status</a></p>
    <p class="meta">Full interactive experience (toolkit search, AI lab, playground) requires JavaScript.</p>
  </footer>
</div>`;
}

// --------------------------------------------------------------- write pass
data.toolCategoriesCount = [...new Set(data.tools.map(t => t.category))].length;
const template = fs.readFileSync(templatePath, 'utf8');
const HEAD_RE = /<!--ROUTE_HEAD-->[\s\S]*?<!--\/ROUTE_HEAD-->/;
const CONTENT_RE = /<!--ROUTE_CONTENT-->/;
if (!HEAD_RE.test(template) || !CONTENT_RE.test(template)) {
  console.error('[prerender] template markers missing in dist/index.html');
  process.exit(1);
}

const written = [];
for (const [route, m] of Object.entries(meta.routes)) {
  let html = template
    .replace(HEAD_RE, headFor(route, m))
    .replace(CONTENT_RE, m.index ? snapshot(route, m) : '');
  const outPath = route === '/' ? templatePath : path.join(distDir, route.replace(/^\//, ''), 'index.html');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
  written.push(route);
  console.log(`[prerender] ${route} → ${path.relative(root, outPath)}`);
}

// --------------------------------------------------------------- sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const indexable = Object.entries(meta.routes).filter(([, m]) => m.index);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map(([route, m]) => `  <url>
    <loc>${m.canonical}</loc>
    <lastmod>${m.published || today}</lastmod>
    <changefreq>${m.type === 'article' ? 'yearly' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : m.type === 'article' ? '0.6' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');

// Validation: every sitemap URL must have an emitted file; fail the build otherwise.
let failed = false;
for (const [route] of indexable) {
  const f = route === '/' ? templatePath : path.join(distDir, route.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(f)) { console.error(`[prerender] SITEMAP VALIDATION FAILED: ${route} has no output file`); failed = true; }
}
if (failed) process.exit(1);
console.log(`[prerender] done — ${written.length} routes, sitemap has ${indexable.length} URLs.`);
