import { motion } from 'motion/react';
import { User, Code, Calendar, Terminal } from 'lucide-react';
import Newsletter from './Newsletter';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 110, damping: 14 } }
  };

  const skills = [
    { category: 'Languages', items: ['TypeScript', 'JavaScript', 'Go', 'Python', 'SQL', 'HTML / CSS'] },
    { category: 'Frontend', items: ['React', 'Next.js', 'Svelte', 'Tailwind CSS', 'Framer Motion'] },
    { category: 'Backend & DB', items: ['Node.js', 'Express', 'PostgreSQL', 'SQLite', 'Supabase', 'Redis'] },
    { category: 'DevOps & Tools', items: ['Docker', 'Git / GitHub', 'Vercel', 'Netlify', 'Linux', 'Vite'] }
  ];

  const milestones = [
    { year: '2026', title: 'Premium Brand overhaul v4.5', desc: 'Crafted premium design system with custom brand identities, live widget, and full-stack React integration.' },
    { year: '2025', title: 'Shipped GhostMail Disposable Email Engine', desc: 'Created an open-source high-throughput secure disposable inbox manager built in Go, distributed with Docker.' },
    { year: '2025', title: 'Launched DomainDeals Marketplace', desc: 'Developed web platform to list, search, and broker domain purchases directly, using modern SPA patterns.' },
    { year: '2024', title: 'Began Autonomous Agent Engineering', desc: 'Integrated Model Context Protocol (MCP) clients, local Ollama LLMs, and web dev playgrounds.' }
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12 animate-fade-in"
    >
      {/* Title Hero */}
      <motion.section variants={itemVariants} className="text-center md:text-left space-y-4 max-w-3xl" id="about-hero">
        <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold bg-amber-color/10 border border-amber-color/20 px-2.5 py-1 rounded-full">
          Identity Module & Bio
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-3">
          About <span className="text-amber-color">David Linacre</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          I'm a full-stack engineer and digital operations architect focused on constructing robust, secure, and beautiful developer utilities, automation systems, and AI sandboxes.
        </p>
      </motion.section>

      {/* Grid: Photo & Terminal Biography */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Avatar block */}
        <motion.div variants={itemVariants} className="md:col-span-4 flex justify-center">
          <div className="linacre-surface p-4 w-full max-w-[280px] relative group overflow-hidden">
            <div className="absolute -inset-10 opacity-20 group-hover:opacity-35 blur-2xl rounded-full bg-amber-color pointer-events-none transition-opacity duration-300" />
            <img 
              src="/profile_avatar.webp" 
              alt="David Linacre Profile Avatar" 
              className="rounded-xl border border-border-color bg-muted/20 aspect-square w-full object-cover"
              width="248"
              height="248"
            />
            <div className="mt-4 text-center">
              <h3 className="font-mono text-xs font-bold text-foreground">David Christopher Linacre</h3>
              <p className="font-mono text-[10px] text-muted-foreground mt-1">Lead Systems Engineer & Coder</p>
            </div>
          </div>
        </motion.div>

        {/* Bio Terminal */}
        <motion.div variants={itemVariants} className="md:col-span-8 space-y-6">
          <div className="bg-[#0b0e14] border border-border-color rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
            {/* Terminal Top bar */}
            <div className="bg-[#111622] px-4 py-2 flex items-center gap-2 border-b border-border-color/30">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
              <span className="text-muted-foreground/60 text-[10px] ml-2">bio_query.sh</span>
            </div>
            {/* Terminal Body */}
            <div className="p-5 space-y-4 text-muted-foreground">
              <p className="text-foreground flex items-center gap-2 font-bold">
                <span className="text-amber-color">&gt;</span> cat about_me.md
              </p>
              <p className="leading-relaxed">
                I spend my time engineering custom digital platforms from the ground up, following a strict "no duplicated data, no clutter, one source of truth" philosophy. My development stack is built on speed, security, and developer experience.
              </p>
              <p className="leading-relaxed">
                Whether deploying high-performance React frontends on Vercel, orchestrating secure microservices in Go/Docker, or training context-aware AI models in the cloud, I design systems built to reduce complexity and scale gracefully over the next decade.
              </p>
              <p className="text-foreground flex items-center gap-2 font-bold">
                <span className="text-amber-color">&gt;</span> echo $LOCATION
              </p>
              <p className="text-cyan font-bold">United Kingdom (UK)</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="linacre-pulse-line w-full" />

      {/* Skills Matrix */}
      <motion.section variants={itemVariants} className="space-y-6" id="about-skills">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-amber-color" />
          <h2 className="font-display text-lg font-bold text-foreground">Skills Matrix</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((skillGroup, idx) => (
            <div key={idx} className="bg-muted/15 border border-border-color/60 rounded-xl p-5 hover:bg-muted/25 hover:border-border-hi transition-all duration-200">
              <h3 className="font-mono text-xs font-bold text-amber-color uppercase tracking-wider mb-4 border-b border-border-color/30 pb-2">
                {skillGroup.category}
              </h3>
              <ul className="space-y-2 font-mono text-xs text-muted-foreground">
                {skillGroup.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.section>

      <div className="linacre-pulse-line w-full" />

      {/* Timeline Section */}
      <motion.section variants={itemVariants} className="space-y-6" id="about-timeline">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-color" />
          <h2 className="font-display text-lg font-bold text-foreground">Project Milestones</h2>
        </div>
        <div className="relative pl-6 border-l border-border-color space-y-8">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative group">
              <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-background dark:bg-[#0b0e14] border-2 border-amber-color group-hover:scale-125 transition-transform" />
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-mono text-xs font-bold text-amber-color">{m.year}</span>
                  <span className="hidden sm:inline text-xs text-muted-foreground/60 font-semibold">·</span>
                  <h3 className="font-display text-sm font-bold text-foreground group-hover:text-cyan transition-colors">
                    {m.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-1 max-w-3xl">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <div className="linacre-pulse-line w-full" />

      {/* Newsletter Section */}
      <motion.section variants={itemVariants}>
        <Newsletter />
      </motion.section>
    </motion.div>
  );
}
