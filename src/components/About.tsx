import { motion } from 'motion/react';
import {
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Github,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
} from 'lucide-react';

const skillGroups = [
  { title: 'Product engineering', items: ['React', 'TypeScript', 'Vue', 'Vite', 'Progressive Web Apps'] },
  { title: 'Systems', items: ['Python', 'FastAPI', 'Node.js', 'Docker', 'GitHub Actions'] },
  { title: 'Mobile & local-first', items: ['Kotlin', 'Android', 'Capacitor', 'IndexedDB', 'Offline-first design'] },
  { title: 'Delivery quality', items: ['Accessibility', 'Security headers', 'Static prerendering', 'Documentation', 'Release workflows'] },
];

const principles = [
  ['Useful before impressive', 'A project should solve a recognisable problem before it adds another framework, dashboard, or AI layer.'],
  ['Claims must be inspectable', 'Live links, source code, clear data provenance, and honest limitations matter more than inflated metrics.'],
  ['Local-first where it fits', 'Browser storage and offline behaviour can remove accounts, servers, cost, and unnecessary data collection.'],
];

const milestones = [
  {
    title: 'linacre.site becomes a useful start page',
    detail: 'Reframed the homepage around private browser utilities and a smaller, verified product portfolio, then introduced the CyberBlue-Green identity system.',
    href: 'https://www.linacre.site/',
    label: 'Live site',
  },
  {
    title: 'PokeGuru v1.6 ships',
    detail: 'Released a typed Pokémon TCG search and set-browsing product with GBP-first prices and a local collection vault.',
    href: 'https://lin4cre.github.io/PokeGuru/',
    label: 'Open PokeGuru',
  },
  {
    title: 'Android utility work becomes downloadable',
    detail: 'Published DKMA Monster for OEM battery guidance and Linacre Uninstaller v1.3.1 with safety tiers and clearer launcher discovery.',
    href: 'https://github.com/LIN4CRE/LinacreUninstaller/releases/latest',
    label: 'Latest Android release',
  },
  {
    title: 'Mob Deals prioritises transparency',
    detail: 'Separated manually reviewed deal entries from automated source reachability and added plain-English PAC/STAC switching guidance.',
    href: 'https://lin4cre.github.io/mob-deals/',
    label: 'Open Mob Deals',
  },
];

export default function About() {
  return (
    <div className="space-y-12">
      <section className="grid gap-8 overflow-hidden rounded-3xl border border-border-color bg-[var(--linacre-panel)] p-6 shadow-[var(--linacre-card-shadow)] sm:p-8 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:p-10">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-10 rounded-full bg-cyan/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-border-color bg-background/30 p-3">
            <img src="/profile_avatar.webp" alt="David Linacre" width="520" height="520" className="aspect-square w-full rounded-2xl object-cover" />
            <div className="mt-3 flex items-center justify-between rounded-xl border border-border-color bg-background/40 px-3 py-2 font-mono text-[10px]">
              <span className="flex items-center gap-1.5 text-emerald-color"><span className="h-2 w-2 rounded-full bg-emerald-color" /> Available for useful work</span>
              <span className="text-muted-foreground">UK / remote</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-color"><ShieldCheck className="h-4 w-4" /> About David Linacre</span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-[-0.05em] text-foreground sm:text-5xl">I build software people can actually use.</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
            I am a self-taught software developer based in Barnsley, South Yorkshire. With over 16 years of hands-on experience in customer service, health & safety compliance, and stock management, I bring strong organizational skills, reliability, and attention to detail into every project I build.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            From browser games like KushCloud to Android tools like Linacre Uninstaller and offline-first web apps like Apex POS, I focus on building real, accessible, and open-source tools that solve practical problems.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="https://github.com/LIN4CRE" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-amber-color px-4 py-3 font-mono text-xs font-bold text-[#031018] hover:bg-amber-glow"><Github className="h-4 w-4" /> GitHub profile</a>
            <a href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-border-color bg-muted/20 px-4 py-3 font-mono text-xs font-bold text-foreground hover:border-amber-color/50">Start a conversation <ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </motion.div>
      </section>

      <section className="space-y-5" aria-labelledby="principles-title">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-color">Working principles</span>
          <h2 id="principles-title" className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl">How I decide what is worth building</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {principles.map(([title, detail], index) => (
            <motion.article key={title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-amber-color/20 bg-amber-color/10 font-mono text-xs font-bold text-amber-color">0{index + 1}</span>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
        <div className="rounded-2xl border border-border-color bg-[#020a11] p-5 font-mono shadow-[var(--linacre-card-shadow)]">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-[10px] text-muted-foreground"><span className="h-2.5 w-2.5 rounded-full bg-[#fb7185]" /><span className="h-2.5 w-2.5 rounded-full bg-[#38bdf8]" /><span className="h-2.5 w-2.5 rounded-full bg-[#34d399]" /><span className="ml-2">profile.json</span></div>
          <pre className="mt-4 whitespace-pre-wrap text-[11px] leading-6 text-[#9ab7c3]">{`{
  "name": "David Linacre",
  "role": "Self Taught Developer",
  "location": "Barnsley, South Yorkshire, UK",
  "phone": "07391 428996",
  "email": "davidlinacre@hotmail.co.uk",
  "education": "Darton High School (2002 - 2007)",
  "experience": [
    "Tudor Rose Nurseries (2020 - 2024)",
    "Cubley Hall (2020)",
    "Five A Day (2013 - 2020)",
    "Fresh Today (2008 - 2013)"
  ],
  "focus": [
    "useful web products",
    "browser games",
    "Android utilities",
    "offline-first tools"
  ],
  "default": "build, verify, improve"
}`}</pre>
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-color/20 bg-emerald-color/5 p-3 text-[10px] text-emerald-color"><MapPin className="h-4 w-4" /> Barnsley, South Yorkshire / UK</div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2"><Code2 className="h-5 w-5 text-amber-color" /><h2 className="font-display text-2xl font-bold text-foreground">Capabilities</h2></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {skillGroups.map((group) => (
              <article key={group.title} className="rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5">
                <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-color">{group.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-amber-color" /> {item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5" aria-labelledby="milestones-title">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-color">Recent proof of work</span>
            <h2 id="milestones-title" className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl">What shipped in 2026</h2>
          </div>
          <TerminalSquare className="hidden h-8 w-8 text-amber-color sm:block" />
        </div>
        <div className="grid gap-3">
          {milestones.map((milestone, index) => (
            <article key={milestone.title} className="group grid gap-4 rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-amber-color/20 bg-amber-color/10 font-mono text-xs font-bold text-amber-color">{String(index + 1).padStart(2, '0')}</span>
              <div><h3 className="font-display text-base font-bold text-foreground">{milestone.title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{milestone.detail}</p></div>
              <a href={milestone.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 self-start font-mono text-[10px] font-bold text-amber-color hover:text-amber-glow sm:self-center">{milestone.label} <ArrowUpRight className="h-3.5 w-3.5" /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border-color bg-muted/10 p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="max-w-2xl"><span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-color"><Sparkles className="h-4 w-4" /> Open source keeps the work honest</span><h2 className="mt-2 font-display text-2xl font-bold text-foreground">Use the tools. Read the source. Challenge the claims.</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">If one of the public tools helps you, feedback and GitHub issues are more valuable than another decorative portfolio statistic.</p></div>
          <a href="https://paypal.me/DLinacre16" target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border-color px-4 py-3 font-mono text-xs font-bold text-foreground hover:border-amber-color/50"><Heart className="h-4 w-4 text-emerald-color" /> Support the work</a>
        </div>
      </section>
    </div>
  );
}
