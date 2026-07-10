import { Tool, Project, MCPServer, SkillTemplate, ChangelogItem } from './types';
import ecosystem from './data/ecosystem.json';

export const TOOLS: Tool[] = [
  // START
  {
    id: 'vscode',
    name: 'VS Code',
    category: 'start',
    description: 'The gold-standard code editor. Extensions for everything. Start here.',
    url: 'https://code.visualstudio.com',
    host: 'code.visualstudio.com',
    searchKeywords: 'vs code editor microsoft extensions vscode',
    tag: 'Free'
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'start',
    description: 'Version control + collaboration. Host repos, track issues, showcase work.',
    url: 'https://github.com/LIN4CRE',
    host: 'github.com/LIN4CRE',
    searchKeywords: 'github version control repos repositories git collab',
    tag: 'Free'
  },
  {
    id: 'git',
    name: 'Git',
    category: 'start',
    description: 'The version control system underneath it all. Learn it early, love it forever.',
    url: 'https://git-scm.com',
    host: 'git-scm.com',
    searchKeywords: 'git version control cli terminal commandline',
    tag: 'Free'
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    category: 'start',
    description: 'AI pair programmer. Free for students & verified open-source contributors.',
    url: 'https://github.com/features/copilot',
    host: 'github.com/features/copilot',
    searchKeywords: 'github copilot ai pair programmer autocomplete coding assistant',
    tag: 'Free'
  },
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'start',
    description: 'AI-first editor built on VS Code. Generous free tier. Great for learning.',
    url: 'https://cursor.com',
    host: 'cursor.com',
    searchKeywords: 'cursor ai editor vscode code assistant auto-complete',
    tag: 'Free'
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'start',
    description: 'Plan projects, take notes, write docs. Great for organising your builds.',
    url: 'https://notion.so',
    host: 'notion.so',
    searchKeywords: 'notion notes docs planning roadmap markdown workspace wiki',
    tag: 'Free'
  },
  {
    id: 'readme',
    name: 'Profile README',
    category: 'start',
    description: 'Pin your projects and showcase skills. Make your GitHub profile memorable.',
    url: 'https://github.com/LIN4CRE',
    host: 'github.com/LIN4CRE',
    searchKeywords: 'github profile readme showcase portfolio markdown template customizer',
    tag: 'Free'
  },
  {
    id: 'prettier',
    name: 'Prettier',
    category: 'start',
    description: 'Opinionated code formatter. Consistent style across your whole project, zero config.',
    url: 'https://prettier.io',
    host: 'prettier.io',
    searchKeywords: 'prettier code formatter autoformat lint style consistency',
    tag: 'Free'
  },
  {
    id: 'linear',
    name: 'Linear',
    category: 'start',
    description: 'Issue tracking and project management. Clean, fast, built for developers.',
    url: 'https://linear.app',
    host: 'linear.app',
    searchKeywords: 'linear project management issues tracking software planning agile board',
    tag: 'Free'
  },
  {
    id: 'zed',
    name: 'Zed',
    category: 'start',
    description: 'Blazing-fast editor written in Rust. GPU-accelerated, built-in AI, multiplayer editing.',
    url: 'https://zed.dev',
    host: 'zed.dev',
    searchKeywords: 'zed editor fast rust gpu coding team collaboration peer coding',
    tag: 'Free'
  },

  // BUILD
  {
    id: 'react',
    name: 'React',
    category: 'build',
    description: 'The most popular UI library. Huge ecosystem, great docs. The safe bet.',
    url: 'https://react.dev',
    host: 'react.dev',
    searchKeywords: 'react ui library javascript components frontend framework SPA vdom',
    tag: 'Free'
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'build',
    description: 'Full-stack React framework. Best DX, deploys in seconds.',
    url: 'https://nextjs.org',
    host: 'nextjs.org',
    searchKeywords: 'next.js react framework fullstack server components SSR static hosting vercel',
    tag: 'Free'
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'build',
    description: 'Utility-first CSS. Style things fast without leaving your markup.',
    url: 'https://tailwindcss.com',
    host: 'tailwindcss.com',
    searchKeywords: 'tailwind css utility styling design system utility-first layout responsive',
    tag: 'Free'
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'build',
    description: 'Postgres + auth + storage + edge functions. The free tier is unreal.',
    url: 'https://supabase.com',
    host: 'supabase.com',
    searchKeywords: 'supabase postgres database auth storage serverless backend firebase alternative',
    tag: 'Free'
  },
  {
    id: 'neon',
    name: 'Neon',
    category: 'build',
    description: 'Serverless Postgres. Branch your DB like Git. Great for learning SQL.',
    url: 'https://neon.tech',
    host: 'neon.tech',
    searchKeywords: 'neon serverless postgres sql database cloud branching relational',
    tag: 'Free'
  },
  {
    id: 'turso',
    name: 'Turso',
    category: 'build',
    description: 'SQLite at the edge. Embedded databases, insanely fast, free hobby plan.',
    url: 'https://turso.tech',
    host: 'turso.tech',
    searchKeywords: 'turso sqlite edge database distributed embedded libsql',
    tag: 'Free'
  },
  {
    id: 'upstash',
    name: 'Upstash Redis',
    category: 'build',
    description: 'Serverless Redis for rate limiting, caching & queues. Pay per request.',
    url: 'https://upstash.com',
    host: 'upstash.com',
    searchKeywords: 'upstash redis serverless cache queue key-value memory data',
    tag: 'Free'
  },
  {
    id: 'clerk',
    name: 'Clerk',
    category: 'build',
    description: 'Auth in minutes — sign-up, sign-in, user management. 10K free users.',
    url: 'https://clerk.com',
    host: 'clerk.com',
    searchKeywords: 'clerk authentication users signin authorization sessions jwt login identity',
    tag: 'Free'
  },
  {
    id: 'authjs',
    name: 'Auth.js',
    category: 'build',
    description: 'Open-source auth. OAuth, magic links and more. Free forever.',
    url: 'https://authjs.dev',
    host: 'authjs.dev',
    searchKeywords: 'auth.js oauth open source authentication nextauth magiclinks passwordless',
    tag: 'Free'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'build',
    description: 'Accept payments online. Free to set up, pay only per transaction.',
    url: 'https://stripe.com',
    host: 'stripe.com',
    searchKeywords: 'stripe payments checkout credit card billing ecommerce gateway subscriptions',
    tag: 'Free'
  },
  {
    id: 'resend',
    name: 'Resend',
    category: 'build',
    description: 'Transactional email from code. 3K/month free, React Email built in.',
    url: 'https://resend.com',
    host: 'resend.com',
    searchKeywords: 'resend transactional email react inbox notification mailer smtp api',
    tag: 'Free'
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    category: 'build',
    description: 'CDN, DNS, Workers & R2 storage. Generous free tier, domains at cost.',
    url: 'https://cloudflare.com',
    host: 'cloudflare.com',
    searchKeywords: 'cloudflare cdn dns workers r2 storage security edge functions ssl',
    tag: 'Free'
  },
  {
    id: 'vite',
    name: 'Vite',
    category: 'build',
    description: 'Lightning-fast dev server & bundler. Hot module replacement, instant startup.',
    url: 'https://vitejs.dev',
    host: 'vitejs.dev',
    searchKeywords: 'vite build tool dev server bundler hot module replacement HMR esbuild rollup',
    tag: 'Free'
  },
  {
    id: 'bun',
    name: 'Bun',
    category: 'build',
    description: 'All-in-one JS runtime, bundler & package manager. Drop-in Node replacement, much faster.',
    url: 'https://bun.sh',
    host: 'bun.sh',
    searchKeywords: 'bun javascript runtime bundler package manager node replacement testing transpiler',
    tag: 'Free'
  },
  {
    id: 'postman',
    name: 'Postman',
    category: 'build',
    description: 'Test & explore APIs visually. Send requests, inspect responses, mock endpoints.',
    url: 'https://www.postman.com',
    host: 'postman.com',
    searchKeywords: 'postman api testing http client rest graphql mock collections headers',
    tag: 'Free'
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'build',
    description: 'Containerize apps for consistent dev & deployment. Free for personal use, huge ecosystem.',
    url: 'https://docker.com',
    host: 'docker.com',
    searchKeywords: 'docker containers devops deployment images virtualization engine compose hub',
    tag: 'Free'
  },
  {
    id: 'svelte',
    name: 'Svelte',
    category: 'build',
    description: 'Compiled UI framework. Less boilerplate, smaller bundles, great DX.',
    url: 'https://svelte.dev',
    host: 'svelte.dev',
    searchKeywords: 'svelte ui compiler javascript layout reactive compiled sveltekit framework',
    tag: 'Free'
  },
  {
    id: 'sentry',
    name: 'Sentry',
    category: 'build',
    description: 'Real-time error tracking and performance monitoring. Free for small teams.',
    url: 'https://sentry.io',
    host: 'sentry.io',
    searchKeywords: 'sentry error monitoring debugging crash tracing performance analytics logs telemetry',
    tag: 'Free'
  },

  // DEPLOY
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'deploy',
    description: 'Deploy React, Next.js, Svelte & more. Instant previews, free hobby tier.',
    url: 'https://vercel.com',
    host: 'vercel.com',
    searchKeywords: 'vercel deploy hosting next.js react serverless edge static analytics pre-rendering',
    tag: 'Free'
  },
  {
    id: 'netlify',
    name: 'Netlify',
    category: 'deploy',
    description: 'Static sites + serverless functions. Git or drag-and-drop. 100GB free.',
    url: 'https://netlify.com',
    host: 'netlify.com',
    searchKeywords: 'netlify static sites serverless functions git deployment jamstack lambda',
    tag: 'Free'
  },
  {
    id: 'cloudflare_pages',
    name: 'Cloudflare Pages',
    category: 'deploy',
    description: 'Unlimited bandwidth on the fastest edge network. Pairs with Workers.',
    url: 'https://pages.cloudflare.com',
    host: 'pages.cloudflare.com',
    searchKeywords: 'cloudflare pages edge hosting workers serverless site cd deployment unlimited',
    tag: 'Free'
  },
  {
    id: 'github_pages',
    name: 'GitHub Pages',
    category: 'deploy',
    description: 'Free static hosting straight from your repo. Perfect for portfolios & docs.',
    url: 'https://pages.github.com',
    host: 'pages.github.com',
    searchKeywords: 'github pages static hosting portfolio repositories custom domain build',
    tag: 'Free'
  },
  {
    id: 'render',
    name: 'Render',
    category: 'deploy',
    description: 'Web services, static sites & databases. Free static + 750 compute hrs/mo.',
    url: 'https://render.com',
    host: 'render.com',
    searchKeywords: 'render web services databases servers cron cloud redis postgres solid-hosting',
    tag: 'Free'
  },
  {
    id: 'railway',
    name: 'Railway',
    category: 'deploy',
    description: 'Deploy anything — databases, backends, full-stack apps. $5 credit/month.',
    url: 'https://railway.app',
    host: 'railway.app',
    searchKeywords: 'railway deploy backend fullstack containers database cloud variables templates',
    tag: 'Free'
  },

  // DESIGN
  {
    id: 'figma',
    name: 'Figma',
    category: 'design',
    description: 'Industry-standard design tool. Free for 3 projects, browser-based.',
    url: 'https://figma.com',
    host: 'figma.com',
    searchKeywords: 'figma design tool ui ux layout prototyping wireframe collaborative vector vector graphics',
    tag: 'Free'
  },
  {
    id: 'lucide',
    name: 'Lucide Icons',
    category: 'design',
    description: 'Beautiful, consistent icons. SVG + framework components. All free.',
    url: 'https://lucide.dev',
    host: 'lucide.dev',
    searchKeywords: 'lucide icons svg react vue svelte clean vector graphic design pack library',
    tag: 'Free'
  },
  {
    id: 'heroicons',
    name: 'Heroicons',
    category: 'design',
    description: 'Clean SVG icons in 3 styles, by the Tailwind team. Free to use anywhere.',
    url: 'https://heroicons.com',
    host: 'heroicons.com',
    searchKeywords: 'heroicons tailwind svg icons outline solid micro vector designer graphics UI iconset',
    tag: 'Free'
  },
  {
    id: 'unsplash',
    name: 'Unsplash',
    category: 'design',
    description: 'High-quality stock photos. Free for commercial use, no attribution.',
    url: 'https://unsplash.com',
    host: 'unsplash.com',
    searchKeywords: 'unsplash stock photos free commercial high-resolution photographer imagery background banner graphic',
    tag: 'Free'
  },
  {
    id: 'coolors',
    name: 'Coolors',
    category: 'design',
    description: 'Palette generator. Hit space to generate, export to CSS or Tailwind.',
    url: 'https://coolors.co',
    host: 'coolors.co',
    searchKeywords: 'coolors color palette generator matching shades tints contrast palette generator exporter hex rgb',
    tag: 'Free'
  },
  {
    id: 'dribbble',
    name: 'Dribbble',
    category: 'design',
    description: 'Design inspiration. See what top designers are shipping and get ideas.',
    url: 'https://dribbble.com',
    host: 'dribbble.com',
    searchKeywords: 'dribbble design inspiration UI showcase artwork mockups typography layout trends templates',
    tag: 'Free'
  },

  // EMAIL
  {
    id: 'zoho_mail',
    name: 'Zoho Mail',
    category: 'email',
    description: 'Custom-domain email for 5 users, no ads. david@yourdomain — done.',
    url: 'https://zoho.com/mail',
    host: 'zoho.com/mail',
    searchKeywords: 'zoho mail custom domain free professional mailbox zeroads host business email exchange',
    tag: 'Free'
  },
  {
    id: 'google_workspace',
    name: 'Google Workspace',
    category: 'email',
    description: 'Gmail on your domain. $7/mo after the trial — the best email experience.',
    url: 'https://workspace.google.com',
    host: 'workspace.google.com',
    searchKeywords: 'google workspace gmail custom domain trial docs slides drive drive business cloud productivity meet calendar',
    tag: 'Trial'
  }
];

export const MANUAL_PROJECTS: Project[] = [
  {
    name: 'linacre.site',
    category: 'deploy',
    description: 'This very site. Terminal-styled toolkit + AI Lab. Rebuilt in React, Tailwind CSS v4, TypeScript and Node server, deployed on Vercel.',
    url: 'https://linacre.site',
    host: 'linacre.site',
    tag: 'Live'
  },
  {
    name: 'GhostMail',
    category: 'build',
    description: 'Disposable email service. Built to learn Go and explore privacy-focused tools.',
    url: 'https://github.com/LIN4CRE/GhostMail',
    host: 'github.com/LIN4CRE/GhostMail',
    tag: 'Open Source'
  },
  {
    name: 'DomainDeals',
    category: 'start',
    description: 'Domain marketplace — buy, sell, and discover great domain names.',
    url: 'https://github.com/LIN4CRE/DomainDeals',
    host: 'github.com/LIN4CRE/DomainDeals',
    tag: 'Open Source'
  }
];

// Automatically append ecosystem projects to the dashboard
const ecoProjects: Project[] = ecosystem.map((item: any) => ({
  name: item.name,
  category: item.type.includes('Infrastructure') ? 'deploy' : (item.technologies.length > 0 ? 'build' : 'start'),
  description: item.description || `${item.type} project — details available on request.`,
  url: item.remote ? item.remote.replace(/\.git$/, '') : '',
  host: item.remote ? 'GitHub' : 'Private',
  tag: item.technologies.length > 0 ? item.technologies.join(', ') : (item.has_git ? 'Git Repo' : 'Internal')
}));

const allProjects = [...MANUAL_PROJECTS, ...ecoProjects];
export const PROJECTS: Project[] = allProjects.filter((project, index) => 
  allProjects.findIndex(p => p.name.toLowerCase() === project.name.toLowerCase()) === index
);

export const CHANGELOG: ChangelogItem[] = [
  {
    version: 'v4.5',
    title: 'Premium Brand-Kit Alignment',
    description: 'Complete visual overhaul aligned to the Linacre brand-kit: Ink Black backgrounds, Amber Core/Glow accent system, brand gradients and glow shadows, hex-grid hero with CTAs, glassmorphism header with breathing logo, amber pulse-line dividers, upgraded card surfaces across Toolkit/Learn/Terminal, LinkedIn footer link, and unified Python CLI (linacre.py) replacing 4 separate automation scripts.'
  },
  {
    version: 'v3.5',
    title: 'React & Full-Stack Evolution',
    description: 'Rebuild of the architecture to fully compiled React + TypeScript + Express v4, styled using Tailwind CSS v4 and Motion. Engineered server-side Gemini API chat routes to keep keys secure, built a client-side command palette with full keyboard navigation and shortcut support, added dark/light mode toggles with localStorage system-sync, fixed service worker state bugs, and polished the typography with Space Grotesk.'
  },
  {
    version: 'v3.0',
    title: 'Hardening & audit release',
    description: 'Full code audit: fixed roadmap section, service worker now picks up fresh deploys, patched a link-injection hole in the Lab, security headers, social preview card, PWA icons, robots + sitemap.'
  },
  {
    version: 'v2.0',
    title: 'Introducing the AI Lab',
    description: 'Connected local LLMs directly to the browser. Multi-provider chat terminal supporting Ollama, Gemini, OpenAI, and LiteLLM. Implemented client-side storage for conversation context preservation.'
  },
  {
    version: 'v1.0',
    title: 'V0 to Vercel',
    description: 'Initial release. Plain, clean HTML/CSS terminal-themed landing page, static searchable toolkit index, responsive grid and mobile navigation layouts.'
  }
];

export const TERMINAL_LINES = [
  { type: 'cmd', text: 'whoami' },
  { type: 'out', text: 'David Christopher Linacre', cls: '' },
  { type: 'gap' },
  { type: 'cmd', text: 'cat interests.txt' },
  { type: 'out', text: 'building things · open source · learning · creating', cls: 'dim' },
  { type: 'gap' },
  { type: 'cmd', text: 'echo $STATUS' },
  { type: 'out', text: '⚡ Shipping v4.5 — brand-kit aligned, amber-coded, premium.', cls: 'amb' },
  { type: 'gap' },
  { type: 'cmd', text: 'ls ./this-site/' },
  { type: 'out', text: 'React · TypeScript · Tailwind CSS v4 · Motion · Express · Brand Kit', cls: 'dim' },
  { type: 'gap' },
  { type: 'prompt' }
];

export const ROADMAP_STEPS = [
  { n: 1, title: 'Set up your dev environment', text: 'Install VS Code + Git, make a dev folder, and run `git init` for the first time.' },
  { n: 2, title: 'Finish freeCodeCamp Responsive Web Design', text: '~300 hours covering HTML, CSS, Flexbox & Grid — with a certificate. The perfect start.' },
  { n: 3, title: 'Rebuild this landing page', text: "Copy the source, modify it, break it, fix it. That's how you learn. Then deploy to Vercel." },
  { n: 4, title: 'Learn JavaScript (ES6+)', text: 'JavaScript.info + the freeCodeCamp JS cert. Build small projects — DOM, `fetch`, the works.' },
  { n: 5, title: 'Pick a framework & build something real', text: 'Next.js + Supabase + Vercel = a full-stack app. Build a blog, a tool, a portfolio. Ship it.' },
  { n: 6, title: 'Share everything on GitHub', text: 'Push code, write READMEs, build in public. Make your profile a showcase and get noticed.' }
];

export const LEARNING_RESOURCES = [
  {
    name: 'freeCodeCamp',
    url: 'https://freecodecamp.org',
    host: 'freecodecamp.org',
    description: 'Full curriculum + certs + huge community. The best place to start from zero.',
    tag: 'Free'
  },
  {
    name: 'The Odin Project',
    url: 'https://theodinproject.com',
    host: 'theodinproject.com',
    description: 'Full-stack JS path. Opinionated curriculum, real projects. Hardcore.',
    tag: 'Free'
  },
  {
    name: 'CS50 (Harvard)',
    url: 'https://cs50.harvard.edu',
    host: 'cs50.harvard.edu',
    description: 'The best intro to CS. C, Python, SQL, web — world-class lectures.',
    tag: 'Free'
  },
  {
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    host: 'developer.mozilla.org',
    description: 'The bible of web dev. HTML, CSS & JS reference. Bookmark it forever.',
    tag: 'Free'
  },
  {
    name: 'JavaScript.info',
    url: 'https://javascript.info',
    host: 'javascript.info',
    description: 'The modern JavaScript tutorial. Deep, thorough and practical.',
    tag: 'Free'
  },
  {
    name: 'Frontend Mentor',
    url: 'https://frontendmentor.io',
    host: 'frontendmentor.io',
    description: 'Real HTML/CSS/JS challenges with pro designs. Learn by building.',
    tag: 'Free'
  },
  {
    name: 'Exercism',
    url: 'https://exercism.org',
    host: 'exercism.org',
    description: 'Practice coding in 66 languages. Mentored & self-paced tracks. 100% free.',
    tag: 'Free'
  },
  {
    name: 'Web Dev Simplified',
    url: 'https://youtube.com/@WebDevSimplified',
    host: 'youtube.com/@WebDevSimplified',
    description: 'Clear, concise video tutorials. Best for visual learners.',
    tag: 'Free'
  },
  {
    name: 'Fireship',
    url: 'https://youtube.com/@Fireship',
    host: 'youtube.com/@Fireship',
    description: '100-second overviews & deep dives. Learn concepts fast, stay entertained.',
    tag: 'Free'
  },
  {
    name: 'Python',
    url: 'https://python.org',
    host: 'python.org',
    description: 'Versatile, beginner-friendly language. Great for automation, data science, and backend.',
    tag: 'Free'
  }
];

export const MCP_SERVERS: MCPServer[] = [
  {
    id: 'mcp-fs',
    category: 'Filesystem',
    title: 'Filesystem Access',
    description: 'Read, write, and manage files on your local machine.',
    package: 'npm i @modelcontextprotocol/server-filesystem',
    config: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/projects"]
    }
  }
}`,
    isReady: true
  },
  {
    id: 'mcp-gh',
    category: 'GitHub',
    title: 'GitHub API',
    description: 'Manage repos, issues, PRs, and code reviews.',
    package: 'npm i @modelcontextprotocol/server-github',
    config: `{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "<your-token>"
      }
    }
  }
}`,
    isReady: true
  },
  {
    id: 'mcp-brave',
    category: 'Brave Search',
    title: 'Web Search',
    description: 'Search the web via Brave\'s search API. Requires a free API key.',
    package: 'npm i @modelcontextprotocol/server-brave-search',
    config: `{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "<your-key>"
      }
    }
  }
}`,
    isReady: true
  },
  {
    id: 'mcp-fetch',
    category: 'Fetch',
    title: 'URL Fetcher',
    description: 'Fetch and extract content from any URL. Great for docs.',
    package: 'npm i @modelcontextprotocol/server-fetch',
    config: `{
  "mcpServers": {
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    }
  }
}`,
    isReady: true
  },
  {
    id: 'mcp-docker',
    category: 'Docker',
    title: 'Docker',
    description: 'Manage containers, images, and Docker Compose stacks.',
    package: 'docker pull mcp/docker',
    config: `{
  "mcpServers": {
    "docker": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "--init",
        "-v", "/var/run/docker.sock:/var/run/docker.sock",
        "mcp/docker"]
    }
  }
}`,
    isReady: false
  },
  {
    id: 'mcp-pg',
    category: 'Postgres',
    title: 'PostgreSQL',
    description: 'Query databases, inspect schemas, run migrations.',
    config: `{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-postgres",
        "postgresql://user:pass@host:5432/db"]
    }
  }
}`,
    isReady: false
  },
  {
    id: 'mcp-supa',
    category: 'Supabase',
    title: 'Supabase',
    description: 'Manage your Supabase projects, tables, and queries.',
    config: `{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-supabase"],
      "env": {
        "SUPABASE_URL": "<your-url>",
        "SUPABASE_KEY": "<your-key>"
      }
    }
  }
}`,
    isReady: false
  },
  {
    id: 'mcp-sentry',
    category: 'Sentry',
    title: 'Sentry',
    description: 'Error tracking, performance monitoring, and issue management.',
    config: `{
  "mcpServers": {
    "sentry": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-sentry"],
      "env": {
        "SENTRY_AUTH_TOKEN": "<your-token>",
        "SENTRY_ORG": "<your-org>",
        "SENTRY_PROJECT": "<your-project>"
      }
    }
  }
}`,
    isReady: false
  },
  {
    id: 'mcp-linear',
    category: 'Linear',
    title: 'Linear',
    description: 'Issue tracking, project management, and team workflows.',
    config: `{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-linear"],
      "env": {
        "LINEAR_API_KEY": "<your-key>"
      }
    }
  }
}`,
    isReady: false
  }
];

export const SKILL_TEMPLATES: SkillTemplate[] = [
  {
    id: 'skill-fullstack',
    title: 'Full-Stack Developer',
    description: 'System prompt + tools for building full-stack web apps with Next.js, Supabase, and Tailwind.',
    prompt: 'You are a senior full-stack developer. You build with Next.js, React, Tailwind CSS, and Supabase. Favour server components, edge functions, and free-tier hosting on Vercel. Write TypeScript by default. Include error handling and loading states.'
  },
  {
    id: 'skill-devops',
    title: 'DevOps / Infrastructure',
    description: 'System prompt for managing Docker, CI/CD, cloud services, and infrastructure as code.',
    prompt: 'You are a DevOps engineer. You manage servers, containers, CI/CD pipelines, and cloud infrastructure. Favour Docker Compose for local dev, GitHub Actions for CI, and cost-effective free tiers. Provide exact commands and config files.'
  },
  {
    id: 'skill-review',
    title: 'Code Reviewer',
    description: 'System prompt for thorough code review with security and performance focus.',
    prompt: 'You are a senior code reviewer. Review for: correctness, security vulnerabilities, performance issues, edge cases, code style consistency, and test coverage. Be specific about issues and suggest fixes. Prioritise security and correctness over style.'
  },
  {
    id: 'skill-db',
    title: 'Database Designer',
    description: 'System prompt for schema design, query optimization, and migration planning.',
    prompt: 'You are a database architect. Design schemas with normalized tables, proper indexing, and referential integrity. Write efficient SQL queries and migrations. Favour PostgreSQL and Supabase. Include Row Level Security policies where applicable.'
  },
  {
    id: 'skill-ui',
    title: 'UI/UX Developer',
    description: 'System prompt focused on accessible, responsive, and polished UI development.',
    prompt: 'You are a UI developer. Build accessible (WCAG AA), responsive, and performant interfaces. Use semantic HTML, CSS Grid/Flexbox, and prefer Tailwind CSS. Ensure keyboard navigation and respect prefers-reduced-motion. Keep bundles small.'
  },
  {
    id: 'skill-api',
    title: 'API Designer',
    description: 'System prompt for designing RESTful and GraphQL APIs with good DX.',
    prompt: 'You are an API designer. Design RESTful APIs with consistent resource naming, proper HTTP methods, and meaningful status codes. Include pagination, filtering, sorting, and error responses. Provide OpenAPI/Swagger specs. Favour serverless endpoints.'
  }
];

export const ENV_TEMPLATE = `# GitHub
GITHUB_TOKEN=ghp_...

# Brave Search
BRAVE_API_KEY=...

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-or-service-key

# Sentry
SENTRY_AUTH_TOKEN=...
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project

# Linear
LINEAR_API_KEY=...

# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...`;
