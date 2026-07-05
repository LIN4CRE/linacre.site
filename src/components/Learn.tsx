import { motion } from 'motion/react';
import { BookOpen, MapPin, GraduationCap, ExternalLink, HelpCircle, Sparkles } from 'lucide-react';
import { ROADMAP_STEPS, LEARNING_RESOURCES } from '../data';

export default function Learn() {
  return (
    <div className="space-y-16 animate-fade-in">
      {/* Title section */}
      <section className="text-center md:text-left space-y-4 max-w-3xl" id="learn-hero">
        <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold">
          Curriculum & Resources
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Learn to build <span className="text-amber-color">from scratch</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          The exact route I followed and recommendations I'd give to any beginner: a curated list of top-tier, 100% free learning resources, followed by a roadmap to go from absolute zero to shipping full-stack applications.
        </p>
      </section>

      {/* The Timeline Roadmap */}
      <section className="space-y-8" id="roadmap-section">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-amber-color" />
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground">The Roadmap</h2>
        </div>

        {/* Steps container */}
        <div className="relative pl-8 sm:pl-10 space-y-8 border-l-2 border-border-color" id="roadmap-timeline">
          {ROADMAP_STEPS.map((step, idx) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="relative group space-y-2"
              id={`roadmap-step-${step.n}`}
            >
              {/* Bullet Node */}
              <div className="absolute -left-[45px] sm:-left-[49px] top-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-background dark:bg-[#0b0e14] border-2 border-amber-color flex items-center justify-center font-mono text-xs font-bold text-amber-color group-hover:scale-115 group-hover:bg-amber-color group-hover:text-background transition-all shadow-[0_0_0_rgba(245,158,11,0)] group-hover:shadow-[0_0_16px_rgba(245,158,11,0.35)]" style={{ transitionDuration: 'var(--linacre-duration-base)' }}>
                  {step.n}
                </div>
              </div>

              {/* Step Content */}
              <div className="bg-muted/10 dark:bg-[#0B1220]/70 border border-amber-color/12 p-5 rounded-2xl hover:border-amber-color/25 hover:bg-muted/20 dark:hover:bg-[#111827]/95 transition-all shadow-sm" style={{ transitionDuration: 'var(--linacre-duration-base)', boxShadow: 'var(--linacre-card-shadow)' }}>
                <h3 className="font-mono text-sm font-semibold text-foreground group-hover:text-amber-color transition-colors flex items-center gap-2">
                  <span>{step.title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1.5">
                  {step.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Curated Resources Grid */}
      <section className="space-y-8 pt-6 border-t border-border-color/50" id="resources-section">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan" />
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground">Curated Resources</h2>
          </div>
          <span className="hidden sm:inline-block font-mono text-[10px] text-muted-foreground/60">
            // 100% Free resources only
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="resources-grid">
          {LEARNING_RESOURCES.map((res, idx) => (
            <motion.a
              key={idx}
              href={res.url}
              target="_blank"
              rel="noopener"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="group flex flex-col justify-between bg-muted/20 dark:bg-[#0B1220]/80 border border-amber-color/12 rounded-2xl p-5 hover:bg-muted/35 dark:hover:bg-[#111827] hover:border-amber-color/30 hover:-translate-y-1 transition-all border-l-[3px] border-l-purple-color"
              style={{ transitionDuration: 'var(--linacre-duration-base)', boxShadow: 'var(--linacre-card-shadow)' }}
              id={`resource-card-${res.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-mono text-sm font-semibold text-foreground group-hover:text-amber-color transition-colors">
                    {res.name}
                  </h3>
                  <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded text-purple-color bg-purple-color/10">
                    {res.tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {res.description}
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/70 border-t border-border-color/40 pt-3">
                <span>{res.host}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan" />
              </div>
            </motion.a>
          ))}
        </div>
      </section>
    </div>
  );
}
