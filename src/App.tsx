import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff } from 'lucide-react';
import Header from './components/Header';
import TerminalIntro from './components/TerminalIntro';
import Toolkit from './components/Toolkit';
import Footer from './components/Footer';
import CommandPalette from './components/CommandPalette';
import ErrorBoundary from './components/ErrorBoundary';
import AIChatbot from './components/AIChatbot';
import { CHANGELOG } from './data';
import { ToolCategory } from './types';

// Lazy-loaded page components for optimization (code splitting)
const Learn = lazy(() => import('./components/Learn'));
const Lab = lazy(() => import('./components/Lab'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const IdentityHub = lazy(() => import('./components/IdentityHub'));
const DevPlayground = lazy(() => import('./components/DevPlayground'));
const Projects = lazy(() => import('./components/Projects'));
const AgentsHub = lazy(() => import('./components/AgentsHub'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const Privacy = lazy(() => import('./components/Privacy'));
const AccessibilityStatement = lazy(() => import('./components/AccessibilityStatement'));
const Blog = lazy(() => import('./components/Blog'));
const StatusPage = lazy(() => import('./components/StatusPage'));

export default function App() {
  const getTabFromPath = () => {
    const path = window.location.pathname.replace(/^\//, '');
    const validTabs = ['toolkit', 'learn', 'lab', 'dashboard', 'identity', 'playground', 'projects', 'agents', 'about', 'contact', 'privacy', 'accessibility', 'blog', 'status'];
    return validTabs.includes(path) ? path : 'projects';
  };

  const [activeTab, setActiveTab] = useState<string>(() => {
    const initialTab = getTabFromPath();
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['toolkit', 'learn', 'lab', 'dashboard', 'identity', 'playground', 'projects', 'agents', 'about', 'contact', 'privacy', 'accessibility', 'blog', 'status'];
    if (hash && validTabs.includes(hash)) {
      return hash;
    }
    try {
      return localStorage.getItem('linacre_active_tab') || initialTab;
    } catch (e) {
      return initialTab;
    }
  });
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Synchronize activeTab with URL path for back/forward navigation support
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromPath());
    };

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['toolkit', 'learn', 'lab', 'dashboard', 'identity', 'playground', 'projects', 'agents', 'about', 'contact'];
      if (hash && validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Update URL path and localStorage when activeTab changes
  useEffect(() => {
    const currentPath = window.location.pathname.replace(/^\//, '');
    if (currentPath !== activeTab) {
      window.history.pushState(null, '', `/${activeTab}`);
    }
    try {
      localStorage.setItem('linacre_active_tab', activeTab);
    } catch (e) {
      console.error('Failed to save active tab', e);
    }
  }, [activeTab]);

  // Scroll to top on active tab navigation changes to resolve SPA scroll retention
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [activeTab]);

  // Identity and Brand custom values synchronized from localStorage
  const [identity, setIdentity] = useState({
    colorId: 'amber',
    fontId: 'cyber',
    frameId: 'hexagon',
    motionId: 'pulse',
    pulseSpeed: 'slow',
    name: 'DAVID LINACRE',
    title: 'Full Stack & AI Engineer',
    bio: 'I\'m a software engineer and designer. This is my curated repository of best-in-class free tools, step-by-step roadmap for self-taught engineers, live AI sandbox, and private dashboard. Rebuilt into a premium full-stack React workspace.',
    glow: 3
  });

  const syncIdentity = () => {
    const colorId = localStorage.getItem('linacre_brand_color') || 'amber';
    const fontId = localStorage.getItem('linacre_brand_font') || 'cyber';
    const frameId = localStorage.getItem('linacre_brand_frame') || 'hexagon';
    const motionId = localStorage.getItem('linacre_brand_motion') || 'pulse';
    const pulseSpeed = localStorage.getItem('linacre_brand_pulse_speed') || 'slow';
    const name = localStorage.getItem('linacre_brand_name') || 'DAVID LINACRE';
    const title = localStorage.getItem('linacre_brand_title') || 'Full Stack & AI Engineer';
    const bio = localStorage.getItem('linacre_brand_bio') || 'I\'m a software engineer and designer. This is my curated repository of best-in-class free tools, step-by-step roadmap for self-taught engineers, live AI sandbox, and private dashboard. Rebuilt into a premium full-stack React workspace.';
    const glow = Number(localStorage.getItem('linacre_brand_glow') || '3');

    setIdentity({ colorId, fontId, frameId, motionId, pulseSpeed, name, title, bio, glow });
  };

  useEffect(() => {
    syncIdentity();
    window.addEventListener('linacre-identity-updated', syncIdentity);
    return () => window.removeEventListener('linacre-identity-updated', syncIdentity);
  }, []);

  // Synchronize theme on initial mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('linacre_theme') || 'dark';
      setTheme(savedTheme as 'dark' | 'light');
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(savedTheme);
    } catch (e) {
      console.error('Failed to sync theme', e);
    }
  }, []);

  // Keyboard shortcut listener to open command palette on "/" or "Cmd+K"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (
          document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA'
        ) {
          return; // Skip if focused on input fields
        }
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Define brand configuration maps to inject into styles and SVGs
  const colorsMap: Record<string, { primary: string; secondary: string }> = {
    amber: { primary: '#F59E0B', secondary: '#FFB000' },
    cyan: { primary: '#22D3EE', secondary: '#67e8f9' },
    emerald: { primary: '#34D399', secondary: '#6ee7b7' },
    crimson: { primary: '#f87171', secondary: '#ef4444' },
    mono: { primary: '#e2e8f0', secondary: '#94a3b8' }
  };

  const fontsMap: Record<string, { display: string; mono: string; import: string }> = {
    cyber: {
      display: '"Space Grotesk", "Inter", sans-serif',
      mono: '"JetBrains Mono", monospace',
      import: "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap');"
    },
    neotech: {
      display: '"Orbitron", sans-serif',
      mono: '"Share Tech Mono", monospace',
      import: "@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;800&family=Share+Tech+Mono&display=swap');"
    },
    brutalist: {
      display: '"Plus Jakarta Sans", sans-serif',
      mono: '"Fira Code", monospace',
      import: "@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&family=Plus+Jakarta+Sans:wght@500;800&display=swap');"
    },
    editorial: {
      display: '"Playfair Display", serif',
      mono: '"Fira Mono", monospace',
      import: "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,400&family=Fira+Mono&display=swap');"
    }
  };

  const activeColor = colorsMap[identity.colorId] || colorsMap.amber;
  const activeFont = fontsMap[identity.fontId] || fontsMap.cyber;

  // Stagger & entering animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 110,
        damping: 14
      }
    }
  };

  const renderEmblem = () => {
    const p = activeColor.primary;
    const s = activeColor.secondary;
    const frame = identity.frameId;
    const glowIntensity = identity.glow;
    const shadowSize = glowIntensity * 4;

    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="heroGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={shadowSize / 4} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="heroBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={p} />
            <stop offset="100%" stopColor={s} />
          </linearGradient>
        </defs>

        {frame === 'hexagon' && (
          <g filter="url(#heroGlow)">
            {/* Pipeline Nexus Hexagon */}
            <polygon points="50,3 91,25 91,75 50,97 9,75 9,25" fill="none" stroke={p} strokeWidth="3" strokeLinejoin="round" />
            <polygon points="50,8 87,28 87,72 50,92 13,72 13,28" fill="none" stroke={s} strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />
            
            {/* 5x5 pipeline block grid */}
            <g transform="translate(20, 20)" fill="url(#heroBrandGrad)">
              <rect x="5" y="5" width="8" height="8" rx="2" opacity="0.4" />
              <rect x="18" y="5" width="8" height="8" rx="2" opacity="0.6" />
              <rect x="31" y="5" width="8" height="8" rx="2" />
              <rect x="44" y="5" width="8" height="8" rx="2" opacity="0.6" />
              <rect x="5" y="18" width="8" height="8" rx="2" opacity="0.5" />
              <rect x="18" y="18" width="8" height="8" rx="2" opacity="0.8" />
              <rect x="31" y="18" width="8" height="8" rx="2" fill={s} />
              <rect x="44" y="18" width="8" height="8" rx="2" opacity="0.5" />
              <motion.rect 
                x="18" y="31" width="22" height="8" rx="2" fill="#ff6b9d"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <rect x="5" y="31" width="8" height="8" rx="2" opacity="0.6" />
              <rect x="44" y="31" width="8" height="8" rx="2" opacity="0.6" />
              <rect x="5" y="44" width="8" height="8" rx="2" opacity="0.4" />
              <rect x="18" y="44" width="8" height="8" rx="2" opacity="0.6" />
              <rect x="31" y="44" width="8" height="8" rx="2" />
              <rect x="44" y="44" width="8" height="8" rx="2" opacity="0.4" />
            </g>
          </g>
        )}

        {frame === 'circle' && (
          <g filter="url(#heroGlow)">
            {/* Aether Orb Center */}
            <circle cx="50" cy="50" r="44" fill="none" stroke={p} strokeWidth="2.5" />
            <circle cx="50" cy="50" r="39" fill="none" stroke={s} strokeWidth="1" strokeDasharray="5 3" opacity="0.4" />
            
            <circle cx="50" cy="50" r="16" fill="url(#heroBrandGrad)" />
            
            <motion.circle 
              cx="50" cy="50" r="22" fill="none" stroke={s} strokeWidth="1.5"
              animate={{ r: [16, 26, 16], opacity: [0.6, 0.1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <path d="M 50,43 L 52,48 L 57,50 L 52,52 L 50,57 L 48,52 L 43,50 L 48,48 Z" fill="#ffffff" />
          </g>
        )}

        {frame === 'brackets' && (
          <g filter="url(#heroGlow)">
            {/* Code Brackets Frame */}
            <path d="M 24,12 L 10,12 L 10,88 L 24,88" fill="none" stroke={p} strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 76,12 L 90,12 L 90,88 L 76,88" fill="none" stroke={p} strokeWidth="4.5" strokeLinecap="round" />
            
            <g transform="translate(34, 40)" fill="url(#heroBrandGrad)">
              <path d="M 0,4 L 12,10 L 0,16" fill="none" stroke={p} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <motion.rect 
                x="18" y="15" width="14" height="3" rx="1.5" fill={s}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </g>
          </g>
        )}

        {frame === 'minimal' && (
          <g filter="url(#heroGlow)">
            {/* Minimalist Spark Frame */}
            <rect x="12" y="12" width="76" height="76" rx="16" fill="none" stroke={p} strokeWidth="2.5" opacity="0.3" />
            
            <motion.path 
              d="M 50,22 Q 50,50 22,50 Q 50,50 50,78 Q 50,50 78,50 Q 50,50 50,22 Z" 
              fill="url(#heroBrandGrad)"
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: '50px 50px' }}
            />
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-amber-color/30" style={{ background: 'var(--linacre-gradient-hero)' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        ${activeFont.import}
        :root, .dark, .light {
          --color-amber-color: ${activeColor.primary} !important;
          --color-cyan: ${activeColor.secondary} !important;
          --font-display: ${activeFont.display} !important;
          --font-mono: ${activeFont.mono} !important;
        }
      `}} />
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-color text-[#0b0e14] font-mono text-[11px] font-bold text-center flex items-center justify-center gap-2 py-2 px-4 shadow-[0_4px_12px_rgba(245,158,11,0.25)] relative z-50 select-none overflow-hidden"
            id="offline-banner"
          >
            <WifiOff className="w-3.5 h-3.5 animate-pulse" />
            <span>CONNECTIVITY INTERRUPTED: Running in offline mode. Local state and custom projects are preserved.</span>
          </motion.div>
        )}
      </AnimatePresence>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        openPalette={() => setPaletteOpen(true)}
      />

      <main id="main-content" role="main" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
        <ErrorBoundary>
          <Suspense fallback={
            <div className="py-20 text-center font-mono text-xs text-muted-foreground flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-amber-color border-t-transparent rounded-full animate-spin"></div>
              <span>Loading interface module...</span>
            </div>
          }>
          <AnimatePresence mode="wait">
            {activeTab === 'toolkit' && (
            <motion.div
              key="toolkit"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -15, transition: { duration: 0.15 } }}
              className="space-y-12"
            >
              {/* Hero Banner Section with Dynamic Identity Integration */}
              <motion.section 
                variants={itemVariants}
                className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-12 overflow-hidden" 
                id="toolkit-hero"
              >
                {/* Hex-grid subtle background pattern */}
                <div className="absolute inset-0 linacre-grid-bg opacity-40 pointer-events-none" />
                {/* Ambient amber orb */}
                <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)` }} />

                <div className="md:col-span-8 space-y-5 text-center md:text-left relative z-10">
                  <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold bg-amber-color/10 border border-amber-color/20 px-2.5 py-1 rounded-full">
                    Full-Stack Portfolio & Directory
                  </span>
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.04em] text-foreground leading-tight">
                    Hi, I'm <span className="text-amber-color animate-amber-breathe">{identity.name}</span>
                  </h1>
                  <h3 className="font-mono text-sm sm:text-base text-amber-color/90 font-medium tracking-wide">
                    {identity.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-md text-muted-foreground leading-[1.65] max-w-2xl">
                    {identity.bio}
                  </p>
                  {/* CTA buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => { setActiveTab('toolkit'); }}
                      className="px-5 py-2.5 bg-amber-color text-[#0b0e14] font-mono text-sm font-bold rounded-lg hover:bg-amber-glow transition-all duration-200 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:-translate-y-0.5"
                      id="cta-explore-toolkit"
                    >
                      Explore Toolkit
                    </button>
                    <button
                      onClick={() => { setActiveTab('projects'); }}
                      className="px-5 py-2.5 bg-transparent border border-amber-color/40 text-amber-color font-mono text-sm font-bold rounded-lg hover:bg-amber-color/10 hover:border-amber-color transition-all duration-200 hover:-translate-y-0.5"
                      id="cta-view-projects"
                    >
                      View Projects
                    </button>
                  </div>
                </div>

                {/* Live Responsive Brand Signature Widget */}
                <div className="md:col-span-4 flex justify-center items-center relative z-10">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="linacre-surface p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 relative group overflow-hidden w-full max-w-[240px]"
                  >
                    {/* Pulsing ambient radial aura gradient */}
                    <div 
                      className="absolute -inset-10 opacity-20 group-hover:opacity-35 blur-2xl rounded-full transition-opacity pointer-events-none"
                      style={{ background: `radial-gradient(circle, ${activeColor.primary} 0%, transparent 70%)` }} 
                    />
                    
                    {/* Rendered Live SVG Monogram Emblem */}
                    <div className={`relative z-10 select-none ${identity.motionId === 'spin' ? 'animate-spin-slow' : ''}`}>
                      {renderEmblem()}
                    </div>
                    
                    <div className="relative z-10 text-center space-y-1">
                      <div className="font-display text-[11px] font-bold tracking-wider text-foreground uppercase">
                        Signature Identity
                      </div>
                      <div className="font-mono text-[9px] text-muted-foreground/80 tracking-wider uppercase">
                        {identity.colorId} · {identity.frameId} · {identity.motionId} · {identity.fontId}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.section>

              {/* Brand amber pulse-line divider */}
              <motion.div variants={itemVariants} className="linacre-pulse-line w-full" />
 
              {/* Typewriter Terminal */}
              <motion.div variants={itemVariants}>
                <TerminalIntro />
              </motion.div>
 
              {/* Filterable Toolkit directory */}
              <motion.div variants={itemVariants}>
                <Toolkit
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  openPalette={() => setPaletteOpen(true)}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              </motion.div>
 
              {/* Beautiful Releases Changelog timeline */}
              <motion.section 
                variants={itemVariants}
                className="space-y-8 pt-12 border-t border-border-color/50" 
                id="changelog-section"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-amber-color bg-amber-color/10 px-2 py-0.5 rounded font-semibold">
                    Releases
                  </span>
                  <h2 className="font-display text-lg font-bold tracking-tight text-foreground">Changelog</h2>
                </div>
 
                {/* Vertical line timeline */}
                <div className="relative pl-6 border-l border-border-color space-y-8" id="changelog-timeline">
                  {CHANGELOG.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="relative group"
                      id={`changelog-item-${item.version}`}
                    >
                      {/* node dot */}
                      <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-background dark:bg-[#0b0e14] border-2 border-cyan group-hover:scale-125 transition-transform" />
                      
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="font-mono text-xs font-bold text-cyan">{item.version}</span>
                          <span className="hidden sm:inline text-xs text-muted-foreground/60 font-semibold">·</span>
                          <h3 className="font-display text-sm font-bold text-foreground group-hover:text-amber-color transition-colors">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pl-1 max-w-4xl">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            </motion.div>
          )}
 
          {activeTab === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Learn />
            </motion.div>
          )}
 
          {activeTab === 'lab' && (
            <motion.div
              key="lab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Lab theme={theme} />
            </motion.div>
          )}
 
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Dashboard />
            </motion.div>
          )}
 
          {activeTab === 'identity' && (
            <motion.div
              key="identity"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <IdentityHub />
            </motion.div>
          )}

          {activeTab === 'playground' && (
            <motion.div
              key="playground"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <DevPlayground />
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Projects />
            </motion.div>
          )}

          {activeTab === 'agents' && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <AgentsHub />
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <About />
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Contact />
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Privacy />
            </motion.div>
          )}

          {activeTab === 'accessibility' && (
            <motion.div
              key="accessibility"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <AccessibilityStatement />
            </motion.div>
          )}

          {activeTab === 'blog' && (
            <motion.div
              key="blog"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Blog />
            </motion.div>
          )}

          {activeTab === 'status' && (
            <motion.div
              key="status"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <StatusPage />
            </motion.div>
          )}

          {!['toolkit', 'learn', 'lab', 'dashboard', 'identity', 'playground', 'projects', 'agents', 'about', 'contact', 'privacy', 'accessibility', 'blog', 'status'].includes(activeTab) && (
            <motion.div
              key="404"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center space-y-6 max-w-md mx-auto"
            >
              <div className="font-mono text-5xl text-amber-color font-bold animate-pulse">&gt; 404</div>
              <h2 className="font-display text-xl font-bold text-foreground">ROUTE NOT RESOLVED</h2>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                The requested URL path could not be located in David's developer directory files.
              </p>
              <button
                onClick={() => setActiveTab('projects')}
                className="px-4 py-2 bg-amber-color text-black font-mono text-xs font-bold rounded-lg hover:bg-amber-color/90 transition-all cursor-pointer"
              >
                Return to Projects
              </button>
            </motion.div>
          )}
          </AnimatePresence>
        </Suspense>
        </ErrorBoundary>
      </main>

      {/* Global command palette */}
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        setActiveTab={setActiveTab}
        setSearchQuery={setSearchQuery}
        setActiveCategory={setActiveCategory}
      />

      <AIChatbot />

      <Footer />
    </div>
  );
}
