import { Terminal, Github, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border-color/60 bg-background/50 py-10 transition-all duration-200" id="global-footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright/Author */}
          <div className="flex flex-col items-center md:items-start gap-1 font-mono text-xs text-muted-foreground/80">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Terminal className="w-3.5 h-3.5 text-cyan" />
              <span>david@linacre.site</span>
            </div>
            <p className="mt-1">
              &copy; {currentYear} Rebuilt with React, TypeScript and Tailwind CSS v4.
            </p>
          </div>

          {/* Center heart indicator */}
          <div className="text-[10px] font-mono text-muted-foreground/60 flex items-center gap-1">
            <span>Built with passion and absolute precision</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/LIN4CRE"
              target="_blank"
              rel="noopener"
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors focus:outline-none"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
