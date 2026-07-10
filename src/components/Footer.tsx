import { useState, useEffect } from 'react';
import { Terminal, Github, Heart, ArrowUp, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating back-to-top button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 bg-amber-color text-[#0b0e14] rounded-full hover:scale-110 transition-transform animate-slide-up focus:outline-none focus:ring-2 focus:ring-amber-color"
          style={{ boxShadow: 'var(--linacre-glow-strong)' }}
          aria-label="Scroll to top"
          id="btn-scroll-top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Amber pulse-line divider */}
      <div className="linacre-pulse-line w-full" />

      <footer className="w-full bg-background/50 py-12 transition-all" style={{ transitionDuration: 'var(--linacre-duration-base)' }} id="global-footer" role="contentinfo">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Copyright/Author */}
            <div className="flex flex-col items-center md:items-start gap-1.5 font-mono text-xs text-muted-foreground/80">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Terminal className="w-3.5 h-3.5 text-amber-color" />
                <span>david@linacre.site</span>
              </div>
              <p className="mt-1">
                &copy; {currentYear} Built with React, TypeScript and Tailwind CSS v4.
              </p>
              <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                Calm systems, useful tools, amber-coded craft.
              </p>
            </div>

            {/* Center heart indicator */}
            <div className="text-[10px] font-mono text-muted-foreground/60 flex items-center gap-1">
              <span>Built with passion and absolute precision</span>
              <Heart className="w-3 h-3 text-amber-color fill-amber-color linacre-animate-pulse" />
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/LIN4CRE"
                target="_blank"
                rel="noopener"
                className="p-2 text-muted-foreground hover:text-amber-color hover:bg-amber-color/10 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-color"
                title="GitHub Profile"
                aria-label="GitHub profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/davidlinacre"
                target="_blank"
                rel="noopener"
                className="p-2 text-muted-foreground hover:text-amber-color hover:bg-amber-color/10 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-color"
                title="LinkedIn Profile"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <span className="font-mono text-[9px] text-muted-foreground/40 border border-amber-color/15 px-1.5 py-0.5 rounded-md select-none">
                v4.5.0
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
