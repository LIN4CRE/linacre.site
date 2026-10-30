import { useState, useEffect, useRef } from 'react';
import { Search, Github, Gamepad2, ArrowUpRight, Sparkles } from 'lucide-react';
import FeaturedSpotlight from './components/FeaturedSpotlight';
import ProjectGrid from './components/ProjectGrid';

export default function App() {
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: '/' focuses the search bar, 'Escape' clears it
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }
      if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div
      className="min-h-screen text-[#eef1f6] selection:bg-[#8fd6ff]/30 selection:text-white"
      style={{
        background:
          '#07080b radial-gradient(1100px 500px at 15% -10%, rgba(143, 214, 255, 0.07), transparent 60%) no-repeat fixed',
      }}
    >
      {/* Tabulous Dark Chrome Sticky Topbar */}
      <header className="tabulous-topbar">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          {/* Brand */}
          <a
            href="/"
            className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity shrink-0"
            title="David Linacre Home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-mono text-sm font-bold text-[#8fd6ff] shadow-sm">
              DL
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-tight text-white leading-tight">
                David Linacre
              </span>
              <span className="text-[10px] font-mono text-[#6b7482] leading-none">
                linacre.site
              </span>
            </div>
          </a>

          {/* Central Instant Search */}
          <div className="tabulous-search max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6b7482] pointer-events-none" />
            <input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search 79 projects, WASAPI engines, tools, AI..."
              autoComplete="off"
              aria-label="Search all projects"
            />
            <kbd>/</kbd>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-[#9aa3b2] font-mono pr-1">
              <i className="h-2 w-2 rounded-full bg-[#5ad19a] shadow-[0_0_8px_#5ad19a] animate-pulse" />
              <span>79 projects</span>
            </span>

            {/* Direct Tabulous Games Link */}
            <a
              href="/games"
              className="tabulous-btn-surprise"
              title="Launch Tabulous Games (300+ Playable Browser Games)"
            >
              <Gamepad2 className="h-3.5 w-3.5 text-[#8fd6ff]" />
              <span>Games (300+)</span>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/DLinacre"
              target="_blank"
              rel="noopener noreferrer"
              className="tabulous-btn-support"
              title="View source code on GitHub"
            >
              <span>GitHub ↗</span>
            </a>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="px-4 pb-2.5 sm:hidden">
          <div className="tabulous-search">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6b7482] pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search 79 projects..."
              autoComplete="off"
              aria-label="Search all projects"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
        {/* Intro Section (Tabulous-style clean typography) */}
        <section className="space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-0.5 text-xs font-mono text-[#8fd6ff]">
            <Sparkles className="h-3 w-3" />
            <span>DAVID LINACRE // DIGITAL ECOSYSTEM &amp; PROJECTS</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Software &amp; systems that actually ship.
          </h1>

          <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-[#9aa3b2]">
            <strong className="text-white font-semibold">79</strong> hand-crafted web applications,
            WASAPI audio synchronizers, developer utilities, and browser ports · no installs, zero telemetry,
            100% free and open source.
          </p>
        </section>

        {/* Featured Flagships Spotlight */}
        {!query && <FeaturedSpotlight />}

        {/* Complete Interactive Project Library */}
        <ProjectGrid query={query} setQuery={setQuery} />
      </main>

      {/* Tabulous-style Compact Site Footer */}
      <footer className="mt-16 border-t border-white/[0.08] bg-[#07080b]/90 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 text-xs text-[#6b7482] font-mono">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5ad19a]" />
            <span>© 2026 David Linacre · Built from first principles · All systems nominal</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/games"
              className="text-[#8fd6ff] hover:text-white transition-colors"
            >
              Tabulous Games
            </a>
            <a
              href="https://github.com/DLinacre"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/david-linacre"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="hover:text-white transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
