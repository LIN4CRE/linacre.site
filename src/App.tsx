import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { ArrowUp } from 'lucide-react';
import { getTabFromLocation, tabToPath, type AppTab } from './config/routes';
import StartPage from './components/StartPage';
import SiteHeader from './components/SiteHeader';
import AmbientSpaceCanvas from './components/AmbientSpaceCanvas';
import { toggleSound, isSoundEnabled, playBlip } from './lib/audioFeedback';
import { RouteHead, type RouteMeta } from './components/RouteHead';
import routeMetaJson from '../route-meta.json';

const CommandPalette = lazy(() => import('./components/CommandPalette'));
const Tools = lazy(() => import('./components/Tools'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const ContactThanks = lazy(() => import('./components/ContactThanks'));
const Privacy = lazy(() => import('./components/Privacy'));
const Terms = lazy(() => import('./components/Terms'));
const AccessibilityStatement = lazy(() => import('./components/AccessibilityStatement'));
const CookiePolicy = lazy(() => import('./components/CookiePolicy'));
const Lab = lazy(() => import('./components/Lab'));
const IdentityHub = lazy(() => import('./components/IdentityHub'));
const OpsHUD = lazy(() => import('./components/OpsHUD'));
const MobDealsSwitcher = lazy(() => import('./components/MobDealsSwitcher'));
const PokeGuruExplorer = lazy(() => import('./components/PokeGuruExplorer'));

function RouteLoading() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <span className="route-loading__spinner" aria-hidden="true" />
      <span>Loading page…</span>
    </div>
  );
}

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
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return localStorage.getItem('linacre_theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });
  const [showBackToTop, setShowBackToTop] = useState(false);

  const currentPath = tabToPath(activeTab);
  const currentMeta: RouteMeta =
    (routeMetaJson.routes as Record<string, RouteMeta>)[currentPath] || routeMetaJson.routes['/'];

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    root.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#07080b' : '#f4f7fa');
    try {
      localStorage.setItem('linacre_theme', theme);
    } catch {
      // Theme selection still works for this session when storage is unavailable.
    }
  }, [theme]);

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
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  useEffect(() => {
    const onPopState = () => {
      setActiveTab(getTabFromLocation(window.location.pathname, window.location.hash));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Keyboard shortcuts: '/' focuses project search; Escape dismisses an active text field.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === 'Escape') e.target.blur();
        return;
      }
      if (e.target instanceof HTMLElement && e.target.isContentEditable) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
        return;
      }
      if (e.key === '/') {
        e.preventDefault();
        if (activeTab !== 'home') navigate('home');
        window.requestAnimationFrame(() => searchInputRef.current?.focus());
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

  return (
    <div className="site-shell min-h-screen selection:bg-[#8fd6ff]/30 relative">
      {/* WCAG 2.2 AA Skip to Content Link */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* Dynamic Route Title & SEO Sync */}
      <RouteHead meta={currentMeta} />

      {/* 3D Ambient Cyber Starfield & Constellation */}
      <AmbientSpaceCanvas />

      <SiteHeader
        activeTab={activeTab}
        onNavigate={navigate}
        onOpenSearch={() => setIsCommandOpen(true)}
        soundOn={soundOn}
        onToggleSound={handleToggleSound}
        theme={theme}
        onThemeChange={setTheme}
      />

      {/* Main Content Area */}
      <main
        id="main-content"
        tabIndex={-1}
        className="site-main mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12"
      >
        <Suspense fallback={<RouteLoading />}>
          {activeTab === 'home' && (
            <StartPage
              navigate={navigate}
              query={query}
              setQuery={setQuery}
              searchRef={searchInputRef}
            />
          )}
          {activeTab === 'tools' && <Tools />}
          {activeTab === 'about' && <About />}
          {activeTab === 'contact' && <Contact />}
          {activeTab === 'contact-thanks' && <ContactThanks />}
          {activeTab === 'privacy' && <Privacy />}
          {activeTab === 'terms' && <Terms />}
          {activeTab === 'accessibility' && <AccessibilityStatement />}
          {activeTab === 'cookie-policy' && <CookiePolicy />}
          {activeTab === 'lab' && <Lab />}
          {activeTab === 'identity' && <IdentityHub />}
          {activeTab === 'ops' && <OpsHUD />}
          {activeTab === 'mob-deals' && <MobDealsSwitcher />}
          {activeTab === 'pokeguru' && <PokeGuruExplorer />}
        </Suspense>
      </main>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => {
            playBlip();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="site-back-to-top"
          title="Back to top"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}

      {/* Tabulous-style Compact Site Footer */}
      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__copyright">
            <span aria-hidden="true" />
            <span>© {new Date().getFullYear()} David Linacre · Independent software studio</span>
          </div>

          <nav className="site-footer__links" aria-label="Footer navigation">
            <button
              type="button"
              onClick={() => navigate('home')}
              className="text-[#9aa3b2] hover:text-white transition-colors cursor-pointer"
            >
              Projects
            </button>
            <button
              type="button"
              onClick={() => navigate('tools')}
              className="text-[#9aa3b2] hover:text-white transition-colors cursor-pointer"
            >
              Tools
            </button>
            <a href="/games" className="text-[#8fd6ff] hover:text-white transition-colors">
              Games
            </a>
            <button
              type="button"
              onClick={() => navigate('lab')}
              className="text-[#9aa3b2] hover:text-white transition-colors cursor-pointer"
            >
              AI Lab
            </button>
            <button
              type="button"
              onClick={() => navigate('identity')}
              className="text-[#9aa3b2] hover:text-white transition-colors cursor-pointer"
            >
              Identity Studio
            </button>
            <button
              type="button"
              onClick={() => navigate('ops')}
              className="text-[#9aa3b2] hover:text-white transition-colors cursor-pointer"
            >
              Mission Control
            </button>
            <button
              type="button"
              onClick={() => navigate('about')}
              className="text-[#9aa3b2] hover:text-white transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => navigate('contact')}
              className="text-[#9aa3b2] hover:text-white transition-colors cursor-pointer"
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
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => navigate('cookie-policy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Cookie Policy
            </button>
            <button
              type="button"
              onClick={() => navigate('accessibility')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Accessibility
            </button>
            <button
              type="button"
              onClick={() => navigate('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms
            </button>
          </nav>
        </div>
      </footer>
      <Suspense fallback={null}>
        <CommandPalette
          isOpen={isCommandOpen}
          onClose={() => setIsCommandOpen(false)}
          setActiveTab={navigate}
          theme={theme}
          setTheme={setTheme}
        />
      </Suspense>
    </div>
  );
}
