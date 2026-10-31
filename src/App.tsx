import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Search, Gamepad2, Volume2, VolumeX, Sparkles, ArrowUp } from 'lucide-react';
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
import { toggleSound, isSoundEnabled, playBlip } from './lib/audioFeedback';
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
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Synchronize browser history and popstate
  const navigate = (tab: string) => {
    playBlip();
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

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleToggleSound = () => {
    const nextState = toggleSound();
    setSoundOn(nextState);
  };

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
          {/* Brand with 3D Precision Monolith */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Emblem3D mode="mini" onNavigateHome={() => navigate('home')} />
            <button
              type="button"
              onClick={() => navigate('home')}
              className="flex flex-col text-left group cursor-pointer"
              title="LIN4CRE // Home"
            >
              <span className="font-display text-sm font-bold tracking-tight text-white group-hover:text-[#8fd6ff] transition-colors leading-tight">
                LIN4CRE
              </span>
              <span className="text-[9px] font-mono tracking-wider text-[#6b7482] leading-none uppercase">
                Systems &amp; Software
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
              Games (77)
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
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className={`inline-flex items-center justify-center h-8 w-8 rounded-lg border transition-all cursor-pointer ${
                soundOn
                  ? 'border-[#8fd6ff]/50 bg-[#8fd6ff]/15 text-[#8fd6ff] shadow-[0_0_10px_rgba(143,214,255,0.25)]'
                  : 'border-white/[0.08] bg-white/[0.03] text-[#6b7482] hover:text-white hover:border-white/20'
              }`}
              title={soundOn ? 'Audio FX: Enabled (Click to mute)' : 'Audio FX: Muted (Click to enable synth audio)'}
              aria-label={soundOn ? 'Mute audio feedback' : 'Enable audio feedback'}
            >
              {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>

            {/* Direct Tabulous Games Link */}
            <a
              href="/games"
              className="tabulous-btn-surprise"
              title="Launch Tabulous Games (77 Instant Play Browser Games)"
            >
              <Gamepad2 className="h-3.5 w-3.5 text-[#8fd6ff]" />
              <span className="hidden sm:inline">Games (77)</span>
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
            <section className="flex flex-col gap-4 py-2 border-b border-white/[0.08] pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#8fd6ff]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8fd6ff] animate-pulse" />
                    LIN4CRE // Systems &amp; Software · Barnsley, UK
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    Useful software. Zero noise. Built to last.
                  </h1>
                  <p className="text-xs sm:text-sm text-[#9aa3b2] max-w-2xl leading-relaxed">
                    <strong className="text-white font-semibold">{SITE_PROJECTS.length}</strong> verified open-source applications, WASAPI audio DSP synchronizers, collectible AI engines, and <strong className="text-white font-semibold">77</strong> instant-play browser games · zero telemetry, 100% free on GitHub.
                  </p>
                </div>

                {/* Compact Quick Actions & Status */}
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="/games"
                    className="tabulous-btn-surprise"
                    title="Launch Tabulous Games (77 Instant Play Browser Games)"
                  >
                    <Gamepad2 className="h-3.5 w-3.5 text-[#8fd6ff]" />
                    <span>Games (77 Instant)</span>
                  </a>
                  <a
                    href="https://github.com/LIN4CRE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tabulous-btn-support"
                    title="View LIN4CRE on GitHub"
                  >
                    <span>GitHub ↗</span>
                  </a>
                </div>
              </div>

              {/* Interactive Quick Jump Ribbon */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6b7482] flex items-center gap-1 mr-1">
                  <Sparkles className="h-3 w-3 text-[#8fd6ff]" />
                  Quick Filter:
                </span>
                <button
                  type="button"
                  onClick={() => { playBlip(); setQuery(''); }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-all cursor-pointer ${
                    query === ''
                      ? 'bg-[#8fd6ff]/15 text-[#8fd6ff] border border-[#8fd6ff]/40 font-bold shadow-[0_0_12px_rgba(143,214,255,0.18)]'
                      : 'bg-white/[0.03] text-[#9aa3b2] border border-white/[0.08] hover:text-white hover:border-white/20'
                  }`}
                >
                  All ({SITE_PROJECTS.length})
                </button>
                <button
                  type="button"
                  onClick={() => { playBlip(); setQuery('audio'); }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-all cursor-pointer ${
                    query.toLowerCase() === 'audio'
                      ? 'bg-[#8fd6ff]/15 text-[#8fd6ff] border border-[#8fd6ff]/40 font-bold shadow-[0_0_12px_rgba(143,214,255,0.18)]'
                      : 'bg-white/[0.03] text-[#9aa3b2] border border-white/[0.08] hover:text-white hover:border-white/20'
                  }`}
                >
                  🎧 Audio &amp; DSP
                </button>
                <button
                  type="button"
                  onClick={() => { playBlip(); setQuery('ai'); }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-all cursor-pointer ${
                    query.toLowerCase() === 'ai'
                      ? 'bg-[#8fd6ff]/15 text-[#8fd6ff] border border-[#8fd6ff]/40 font-bold shadow-[0_0_12px_rgba(143,214,255,0.18)]'
                      : 'bg-white/[0.03] text-[#9aa3b2] border border-white/[0.08] hover:text-white hover:border-white/20'
                  }`}
                >
                  🤖 AI Systems
                </button>
                <button
                  type="button"
                  onClick={() => { playBlip(); navigate('tools'); }}
                  className="rounded-lg px-2.5 py-1 text-xs font-mono bg-white/[0.03] text-[#9aa3b2] border border-white/[0.08] hover:text-white hover:border-white/20 transition-all cursor-pointer"
                >
                  🛠️ Developer Tools
                </button>
                <a
                  href="/games"
                  className="rounded-lg px-2.5 py-1 text-xs font-mono bg-[#8fd6ff]/10 text-[#8fd6ff] border border-[#8fd6ff]/30 hover:bg-[#8fd6ff]/20 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                >
                  <Gamepad2 className="h-3 w-3" />
                  🎮 Instant Games (77)
                </a>
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

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => { playBlip(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center justify-center h-10 w-10 rounded-full border border-[#8fd6ff]/40 bg-[#0e1016]/90 text-[#8fd6ff] shadow-[0_4px_20px_rgba(0,0,0,0.6),0_0_12px_rgba(143,214,255,0.25)] backdrop-blur transition-all duration-200 hover:scale-110 hover:border-[#8fd6ff] hover:text-white cursor-pointer"
          title="Back to top"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}

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
