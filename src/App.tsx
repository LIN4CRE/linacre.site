import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Search, Gamepad2, ExternalLink, Terminal } from 'lucide-react';
import { getTabFromLocation, tabToPath, type AppTab } from './config/routes';
import { SITE_PROJECTS } from './data/siteProjects';
import FeaturedSpotlight from './components/FeaturedSpotlight';
import ProjectGrid from './components/ProjectGrid';
import Tools from './components/Tools';
import About from './components/About';
import Contact from './components/Contact';
import ContactThanks from './components/ContactThanks';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import AccessibilityStatement from './components/AccessibilityStatement';
import CookiePolicy from './components/CookiePolicy';
import Emblem3D from './components/Emblem3D';
import AmbientSpaceCanvas from './components/AmbientSpaceCanvas';
const CommandPalette = lazy(() => import('./components/CommandPalette'));

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab | string>(() => {
    if (typeof window !== 'undefined') {
      return getTabFromLocation(window.location.pathname, window.location.hash);
    }
    return 'home';
  });
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Synchronize browser history and popstate
  const navigate = (tab: string) => {
    if (tab === 'games') {
      window.location.href = '/games';
      return;
    }
    const targetPath = tabToPath(tab);
    window.history.pushState(null, '', targetPath);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  useEffect(() => {
    const onPopState = () => {
      setActiveTab(getTabFromLocation(window.location.pathname, window.location.hash));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Keyboard shortcut: '/' focuses search bar & jumps to projects, 'Escape' clears it
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
        return;
      }
      if (e.key === '/') {
        e.preventDefault();
        if (activeTab !== 'home') {
          navigate('home');
        }
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeTab]);

  const handleSearchChange = (val: string) => {
    setQuery(val);
    if (activeTab !== 'home' && val.trim().length > 0) {
      navigate('home');
    }
  };

  return (
    <div
      className="min-h-screen text-[#eef1f6] selection:bg-[#8fd6ff]/30 selection:text-white relative"
      style={{
        background:
          '#07080b radial-gradient(1100px 500px at 15% -10%, rgba(143, 214, 255, 0.07), transparent 60%) no-repeat fixed',
      }}
    >
      {/* 3D Ambient Cyber Starfield & Constellation */}
      <AmbientSpaceCanvas />

      {/* Tabulous Dark Chrome Sticky Topbar */}
      <header className="tabulous-topbar relative z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          {/* Brand with 3D Rotating Gyro Emblem */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Emblem3D mode="mini" onNavigateHome={() => navigate('home')} />
            <button
              type="button"
              onClick={() => navigate('home')}
              className="flex flex-col text-left group cursor-pointer"
              title="David Linacre Home"
            >
              <span className="font-display text-sm font-bold tracking-tight text-white group-hover:text-[#8fd6ff] transition-colors leading-tight">
                David Linacre
              </span>
              <span className="text-[10px] font-mono text-[#6b7482] leading-none">
                linacre.site // 3D Core
              </span>
            </button>
          </div>

          {/* Primary Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 font-mono text-xs font-semibold">
            <button
              type="button"
              onClick={() => navigate('home')}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                activeTab === 'home'
                  ? 'bg-white/10 text-white font-bold'
                  : 'text-[#9aa3b2] hover:text-white hover:bg-white/5'
              }`}
            >
              Projects
            </button>
            <button
              type="button"
              onClick={() => navigate('tools')}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                activeTab === 'tools'
                  ? 'bg-white/10 text-white font-bold'
                  : 'text-[#9aa3b2] hover:text-white hover:bg-white/5'
              }`}
            >
              Tools
            </button>
            <a
              href="/games"
              className="rounded-lg px-3 py-1.5 text-[#8fd6ff] hover:text-white hover:bg-[#8fd6ff]/10 transition-colors"
            >
              Games (300+)
            </a>
            <button
              type="button"
              onClick={() => navigate('about')}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                activeTab === 'about'
                  ? 'bg-white/10 text-white font-bold'
                  : 'text-[#9aa3b2] hover:text-white hover:bg-white/5'
              }`}
            >
              About
            </button>
            <button
              type="button"
              onClick={() => navigate('contact')}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                activeTab === 'contact'
                  ? 'bg-white/10 text-white font-bold'
                  : 'text-[#9aa3b2] hover:text-white hover:bg-white/5'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Central Instant Search */}
          <div className="tabulous-search max-w-sm hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6b7482] pointer-events-none" />
            <input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder={`Search ${SITE_PROJECTS.length} verified projects...`}
              autoComplete="off"
              aria-label="Search all projects"
            />
            <button type="button" onClick={() => setIsCommandOpen(true)} className="flex items-center gap-1 cursor-pointer"><kbd>/</kbd><kbd className="text-[10px]">⌘K</kbd></button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Direct Tabulous Games Link */}
            <a
              href="/games"
              className="tabulous-btn-surprise"
              title="Launch Tabulous Games (300+ Playable Browser Games)"
            >
              <Gamepad2 className="h-3.5 w-3.5 text-[#8fd6ff]" />
              <span className="hidden sm:inline">Games (300+)</span>
              <span className="sm:hidden">Games</span>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/LIN4CRE"
              target="_blank"
              rel="noopener noreferrer"
              className="tabulous-btn-support"
              title="View source code on GitHub"
            >
              <span>GitHub ↗</span>
            </a>
          </div>
        </div>

        {/* Mobile Navigation & Search Bar */}
        <div className="px-4 pb-2.5 space-y-2 lg:hidden">
          <div className="flex items-center justify-around rounded-xl border border-white/[0.08] bg-[#0e1016]/90 p-1 text-xs font-mono">
            <button
              type="button"
              onClick={() => navigate('home')}
              className={`px-2 py-1 rounded-lg ${activeTab === 'home' ? 'bg-white/10 text-white font-bold' : 'text-[#9aa3b2]'}`}
            >
              Projects
            </button>
            <button
              type="button"
              onClick={() => navigate('tools')}
              className={`px-2 py-1 rounded-lg ${activeTab === 'tools' ? 'bg-white/10 text-white font-bold' : 'text-[#9aa3b2]'}`}
            >
              Tools
            </button>
            <a
              href="/games"
              className="px-2 py-1 rounded-lg text-[#8fd6ff]"
            >
              Games
            </a>
            <button
              type="button"
              onClick={() => navigate('about')}
              className={`px-2 py-1 rounded-lg ${activeTab === 'about' ? 'bg-white/10 text-white font-bold' : 'text-[#9aa3b2]'}`}
            >
              About
            </button>
            <button
              type="button"
              onClick={() => navigate('contact')}
              className={`px-2 py-1 rounded-lg ${activeTab === 'contact' ? 'bg-white/10 text-white font-bold' : 'text-[#9aa3b2]'}`}
            >
              Contact
            </button>
          </div>
          <div className="tabulous-search sm:hidden">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6b7482] pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder={`Search ${SITE_PROJECTS.length} verified projects...`}
              autoComplete="off"
              aria-label="Search all projects"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
        {/* Route 1: Home (Start / Projects) */}
        {activeTab === 'home' && (
          <>
            <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0e1016]/80 p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md">
              {/* Dynamic ambient cyber backlight */}
              <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#8fd6ff]/10 blur-3xl" />
              <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-[#38bdf8]/10 blur-3xl" />

              <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
                {/* Left: Headline, Value Proposition, Action CTAs & Telemetry */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#8fd6ff]/30 bg-[#8fd6ff]/10 px-3 py-1 text-xs font-mono font-bold text-[#8fd6ff] shadow-[0_0_15px_rgba(143,214,255,0.2)]">
                    <span className="h-2 w-2 rounded-full bg-[#8fd6ff] animate-pulse" />
                    <span>DAVID LINACRE // VERIFIED SYSTEM &amp; 3D VAULT</span>
                  </div>

                  <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                    Software &amp; systems engineered for the{' '}
                    <span className="bg-gradient-to-r from-white via-[#8fd6ff] to-[#38bdf8] bg-clip-text text-transparent">
                      open web
                    </span>
                    .
                  </h1>

                  <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-[#9aa3b2]">
                    <strong className="text-white font-semibold">{SITE_PROJECTS.length}</strong> hand-crafted applications,
                    low-latency WASAPI DSP audio synchronizers, Pokémon AI intelligence engines, and the curated
                    Tabulous browser gaming vault. Zero tracking, zero telemetry, 100% free and open-source.
                  </p>

                  {/* High-Impact Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href="/games"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#8fd6ff] px-4 py-2.5 font-mono text-xs font-bold text-[#07080b] shadow-[0_0_20px_rgba(143,214,255,0.4)] transition-all hover:bg-[#c4ebff] hover:scale-105"
                    >
                      <Gamepad2 className="h-4 w-4" />
                      <span>Play Games (300+)</span>
                    </a>

                    <a
                      href="https://github.com/LIN4CRE"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 font-mono text-xs font-bold text-white transition-all hover:border-[#8fd6ff]/50 hover:bg-white/10"
                    >
                      <span>Explore GitHub</span>
                      <ExternalLink className="h-3.5 w-3.5 text-[#8fd6ff]" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setIsCommandOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] px-3.5 py-2.5 font-mono text-xs text-[#9aa3b2] hover:text-white hover:border-white/20 transition-all cursor-pointer"
                    >
                      <Terminal className="h-3.5 w-3.5 text-[#8fd6ff]" />
                      <span>Palette <kbd className="rounded border border-white/10 bg-black/40 px-1 py-0.5 text-[10px]">⌘K</kbd></span>
                    </button>
                  </div>

                  {/* Telemetry Glass Counter Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-white/[0.08]">
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
                      <div className="font-display text-lg font-black text-[#8fd6ff]">303</div>
                      <div className="font-mono text-[10px] text-[#9aa3b2] uppercase tracking-wider">Browser Ports</div>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
                      <div className="font-display text-lg font-black text-white">{SITE_PROJECTS.length}</div>
                      <div className="font-mono text-[10px] text-[#9aa3b2] uppercase tracking-wider">LIN4CRE Repos</div>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
                      <div className="font-display text-lg font-black text-white">16 Yrs</div>
                      <div className="font-mono text-[10px] text-[#9aa3b2] uppercase tracking-wider">Discipline</div>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
                      <div className="font-display text-lg font-black text-emerald-400">100%</div>
                      <div className="font-mono text-[10px] text-[#9aa3b2] uppercase tracking-wider">Open Source</div>
                    </div>
                  </div>
                </div>

                {/* Right: The 3D Gyroscopic Core */}
                <div className="relative flex items-center justify-center">
                  <Emblem3D mode="hero" />
                </div>
              </div>
            </section>

            {!query && <FeaturedSpotlight />}
            <ProjectGrid query={query} setQuery={setQuery} />
          </>
        )}

        {/* Route 2: Developer Tools */}
        {activeTab === 'tools' && <Tools />}

        {/* Route 3: About */}
        {activeTab === 'about' && <About />}

        {/* Route 4: Contact */}
        {activeTab === 'contact' && <Contact />}

        {/* Route 5: Contact Thanks */}
        {activeTab === 'contact-thanks' && <ContactThanks />}

        {/* Route 6: Privacy Policy */}
        {activeTab === 'privacy' && <Privacy />}

        {/* Route 7: Terms of Service */}
        {activeTab === 'terms' && <Terms />}

        {/* Route 8: Accessibility Statement */}
        {activeTab === 'accessibility' && <AccessibilityStatement />}

        {/* Route 9: Cookie Policy */}
        {activeTab === 'cookie-policy' && <CookiePolicy />}
      </main>

      {/* Tabulous-style Compact Site Footer */}
      <footer className="mt-16 border-t border-white/[0.08] bg-[#07080b]/90 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 text-xs text-[#6b7482] font-mono">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5ad19a]" />
            <span>© 2026 David Linacre · Built from first principles · All systems nominal</span>
          </div>

          <div className="flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={() => navigate('home')}
              className="text-[#9aa3b2] hover:text-white transition-colors"
            >
              Projects
            </button>
            <button
              type="button"
              onClick={() => navigate('tools')}
              className="text-[#9aa3b2] hover:text-white transition-colors"
            >
              Tools
            </button>
            <a
              href="/games"
              className="text-[#8fd6ff] hover:text-white transition-colors"
            >
              Games
            </a>
            <button
              type="button"
              onClick={() => navigate('about')}
              className="text-[#9aa3b2] hover:text-white transition-colors"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => navigate('contact')}
              className="text-[#9aa3b2] hover:text-white transition-colors"
            >
              Contact
            </button>
            <a
              href="https://github.com/LIN4CRE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <button
              type="button"
              onClick={() => navigate('privacy')}
              className="hover:text-white transition-colors"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => navigate('terms')}
              className="hover:text-white transition-colors"
            >
              Terms
            </button>
          </div>
        </div>
      </footer>
      <Suspense fallback={null}>
        <CommandPalette
          isOpen={isCommandOpen}
          onClose={() => setIsCommandOpen(false)}
          setActiveTab={navigate}
          theme="dark"
          setTheme={() => {}}
        />
      </Suspense>
    </div>
  );
}
