import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Code, Calendar, Terminal, ExternalLink } from 'lucide-react';

const getFilterForColor = (colorId: string) => {
  switch (colorId) {
    case 'amber':
      return 'invert(1) sepia(0.2) saturate(2.5) hue-rotate(5deg) brightness(1.1) contrast(1.1)';
    case 'cyan':
      return 'invert(1) sepia(0.5) saturate(3) hue-rotate(160deg) brightness(1.1) contrast(1.1)';
    case 'emerald':
      return 'invert(1) sepia(0.6) saturate(2.5) hue-rotate(85deg) brightness(1.1) contrast(1.1)';
    case 'crimson':
      return 'invert(1) sepia(0.6) saturate(3) hue-rotate(310deg) brightness(1.1) contrast(1.1)';
    case 'mono':
      return 'invert(1) grayscale(1) brightness(1.2) contrast(1.1)';
    default:
      return 'invert(1) brightness(1.1) contrast(1.1)';
  }
};

export default function About() {
  const [activeColorId, setActiveColorId] = useState(() => localStorage.getItem('linacre_brand_color') || 'amber');
  useEffect(() => {
    const handleUpdate = () => {
      setActiveColorId(localStorage.getItem('linacre_brand_color') || 'amber');
    };
    window.addEventListener('linacre-identity-updated', handleUpdate);
    return () => window.removeEventListener('linacre-identity-updated', handleUpdate);
  }, []);

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
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 110, damping: 14 } }
  };

  const skills = [
    { category: 'Languages', items: ['TypeScript', 'JavaScript', 'Go', 'Python', 'SQL', 'HTML / CSS'] },
    { category: 'Frontend', items: ['React', 'Next.js', 'Svelte', 'Tailwind CSS', 'Framer Motion'] },
    { category: 'Backend & DB', items: ['Node.js', 'Express', 'PostgreSQL', 'SQLite', 'Supabase', 'Redis'] },
    { category: 'DevOps & Tools', items: ['Docker', 'Git / GitHub', 'Vercel', 'Netlify', 'Linux', 'Vite'] }
  ];

  const milestones = [
    { 
      year: '2026', 
      title: 'Premium Brand Overhaul & Live Customizer v4.5', 
      desc: 'Completely overhauled the site’s design system, adding visual grid overlays, real-time relative-luminance contrast validation tools, and a dynamic vector monogram customization panel with drag-and-drop file ingestion support.' 
    },
    { 
      year: '2025', 
      title: 'Shipped GhostMail Secure Disposable Email Engine', 
      desc: 'Created an open-source, high-throughput secure disposable inbox manager built in Go. Integrated with worker pools, rate limiters, and channel synchronization to handle massive SMTP transaction streams. Packaged and deployed via Docker.' 
    },
    { 
      year: '2025', 
      title: 'Launched DomainDeals Escrow & Brokerage Portal', 
      desc: 'Designed and developed a secure marketplace platform to list, search, and broker domain purchases directly. Engineered with a React single-page architecture, Vercel Edge caching headers, and automated transaction email triggers.' 
    },
    { 
      year: '2024', 
      title: 'Established Autonomous Agent Research Hub', 
      desc: 'Built custom Model Context Protocol (MCP) servers and orchestrator clients. Developed local Ollama LLM playground interfaces and autonomous dev agent playbooks to enable collaborative code generation and security audits.' 
    }
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
        {/* Avatar and Support column */}
        <motion.div variants={itemVariants} className="md:col-span-4 flex flex-col items-center gap-6">
          {/* Avatar block */}
          <div className="linacre-surface p-4 w-full max-w-[280px] relative group overflow-hidden">
            <div className="absolute -inset-10 opacity-20 group-hover:opacity-35 blur-2xl rounded-full bg-amber-color pointer-events-none transition-opacity duration-300" />
            <img
              src="/profile_avatar.webp"
              alt="David Linacre — full-stack &amp; AI engineer"
              className="rounded-xl border border-border-color bg-muted/20 aspect-square w-full object-cover"
              width="248"
              height="248"
              loading="lazy"
              decoding="async"
            />
            <div className="mt-4 text-center font-mono">
              <h2 className="text-xs font-bold text-foreground">David Christopher Linacre</h2>
              <p className="text-[10px] text-muted-foreground mt-1">Lead Systems Engineer & Coder</p>
            </div>
          </div>

          {/* Support/Donation Card */}
          <div className="linacre-surface p-5 w-full max-w-[280px] relative group overflow-hidden space-y-4 select-none">
            <div className="absolute -inset-10 opacity-15 group-hover:opacity-25 blur-2xl rounded-full bg-amber-color pointer-events-none transition-opacity duration-300" />
            <div className="flex items-center gap-2 border-b border-border-color/30 pb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-color animate-pulse" />
              <span className="font-mono text-[10px] font-bold text-foreground uppercase tracking-wider">SUPPORT MY CRAFT</span>
            </div>
            <div className="w-36 h-36 mx-auto bg-black rounded-lg border border-border-color p-1 flex items-center justify-center relative overflow-hidden">
              <img
                src="/paypal-qr.png"
                alt="PayPal QR Code"
                className="w-full h-full mix-blend-screen transition-transform duration-300 group-hover:scale-105"
                style={{ filter: getFilterForColor(activeColorId) }}
              />
            </div>
            <div className="text-center space-y-2.5 font-mono">
              <p className="text-[10px] text-muted-foreground leading-normal font-medium">
                Enjoying my open-source work or dev tools? Support new builds via PayPal.
              </p>
              <a
                href="https://paypal.me/DLinacre16"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-amber-color hover:bg-amber-glow text-[#0b0e14] font-bold rounded-lg text-[10px] transition-all active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.15)]"
              >
                <span>paypal.me/DLinacre16</span>
                <ExternalLink className="w-3 h-3" />
              </a>
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
                I fell into software engineering during my early days of trying to customize local configurations, automate boring data scraping pipelines, and rebuild legacy workflows. Over the last several years, I have worked as a systems consultant, principal platform developer, and fractional DevOps architect. I've designed and shipped everything from low-latency concurrency pipelines in Go to fully secure edge caching systems for enterprise applications.
              </p>
              <p className="leading-relaxed">
                My career is built on a simple foundation: treat technical debt as a systems bug, optimize for the next decade rather than next week, and enforce strict, automated quality guardrails. I believe that developer platforms should manage themselves automatically. That's why I focus heavily on operational infrastructure, continuous deployment, and context-aware developer tooling.
              </p>
              <p className="leading-relaxed">
                When we work together on a project, you're not just getting a coder. You're getting a systematic approach. I scope tasks with absolute transparency, write robust unit tests for every critical endpoint, configure clear CI/CD pipelines, and provide complete documentation from day one. I coordinate communication through asynchronous updates, standardizing on clear milestones and regular logs to keep everyone aligned without wasteful meetings.
              </p>
              <p className="leading-relaxed">
                When I am not sitting in front of a keyboard tweaking Linux configuration variables or orchestrating AI model pipelines, you can find me exploring retro arcade hardware, hiking across the English countryside, or learning new culinary techniques.
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

    </motion.div>
  );
}
