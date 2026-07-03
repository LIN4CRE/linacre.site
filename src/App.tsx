import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import TerminalIntro from './components/TerminalIntro';
import Toolkit from './components/Toolkit';
import Learn from './components/Learn';
import Lab from './components/Lab';
import Dashboard from './components/Dashboard';
import IdentityHub from './components/IdentityHub';
import CommandPalette from './components/CommandPalette';
import Footer from './components/Footer';
import { CHANGELOG } from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('toolkit');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    amber: { primary: '#ffb454', secondary: '#fbbf24' },
    cyan: { primary: '#5ccfe6', secondary: '#22d3ee' },
    emerald: { primary: '#7fd88f', secondary: '#34d399' },
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
        type: "spring",
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

    let frameSVG = null;
    if (frame === 'hexagon') {
      frameSVG = (
        <>
          <polygon points="50,3 91,25 91,75 50,97 9,75 9,25" fill="none" stroke={p} strokeWidth="3.5" strokeLinejoin="round" filter="url(#heroGlow)" />
          <polygon points="50,8 87,28 87,72 50,92 13,72 13,28" fill="none" stroke={s} strokeWidth="1" strokeDasharray="8 4" strokeLinejoin="round" opacity="0.4" />
        </>
      );
    } else if (frame === 'circle') {
      frameSVG = (
        <>
          <circle cx="50" cy="50" r="44" fill="none" stroke={p} strokeWidth="3" filter="url(#heroGlow)" />
          <circle cx="50" cy="50" r="39" fill="none" stroke={s} strokeWidth="1" strokeDasharray="6 3" opacity="0.5" />
          <circle cx="50" cy="50" r="47" fill="none" stroke={p} strokeWidth="1" opacity="0.2" />
        </>
      );
    } else if (frame === 'brackets') {
      frameSVG = (
        <>
          <path d="M 24,12 L 10,12 L 10,88 L 24,88" fill="none" stroke={p} strokeWidth="4.5" strokeLinecap="round" filter="url(#heroGlow)" />
          <path d="M 76,12 L 90,12 L 90,88 L 76,88" fill="none" stroke={p} strokeWidth="4.5" strokeLinecap="round" filter="url(#heroGlow)" />
          <line x1="20" y1="50" x2="80" y2="50" stroke={s} strokeWidth="1" strokeDasharray="5 5" opacity="0.3" />
        </>
      );
    } else {
      // minimal
      frameSVG = <rect x="5" y="5" width="90" height="90" rx="10" fill="none" stroke={p} strokeWidth="1.5" strokeDasharray="10 5" opacity="0.2" />;
    }

    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="heroGlow" x="-20%" y="-20%" width="140%" height="140%">
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
        
        {frameSVG}

        <g>
          <path d="M 44,26 L 44,66 L 68,66" fill="none" stroke="url(#heroBrandGrad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" filter="url(#heroGlow)" />
          <circle cx="68" cy="66" r="3.5" fill={s} filter="url(#heroGlow)" />
          {identity.motionId === 'pulse' ? (
            <motion.path
              d="M 44,26 L 58,46 L 44,66"
              fill="none"
              stroke="url(#heroBrandGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#heroGlow)"
              animate={{
                opacity: [0.3, 0.95, 0.3],
                strokeWidth: [4, 5.5, 4]
              }}
              transition={{
                duration: identity.pulseSpeed === 'fast' ? 1.0 : identity.pulseSpeed === 'breathe' ? 5.0 : 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ) : (
            <path
              d="M 44,26 L 58,46 L 44,66"
              fill="none"
              stroke={p}
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />
          )}
        </g>
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-amber-color/30">
      <style dangerouslySetInnerHTML={{ __html: `
        ${activeFont.import}
        :root, .dark, .light {
          --color-amber-color: ${activeColor.primary} !important;
          --color-cyan: ${activeColor.secondary} !important;
          --font-display: ${activeFont.display} !important;
          --font-mono: ${activeFont.mono} !important;
        }
      `}} />
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        openPalette={() => setPaletteOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
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
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-border-color/30 pb-10" 
                id="toolkit-hero"
              >
                <div className="md:col-span-8 space-y-4 text-center md:text-left">
                  <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold bg-amber-color/10 border border-amber-color/20 px-2.5 py-1 rounded-full">
                    Full-Stack Portfolio & Directory
                  </span>
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
                    Hi, I'm <span className="text-amber-color">{identity.name}</span>
                  </h1>
                  <h3 className="font-mono text-sm sm:text-base text-amber-color font-medium tracking-wide">
                    {identity.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-md text-muted-foreground leading-relaxed">
                    {identity.bio}
                  </p>
                </div>

                {/* Live Responsive Brand Signature Widget */}
                <div className="md:col-span-4 flex justify-center items-center">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="p-6 rounded-2xl bg-muted/20 dark:bg-[#10141d]/30 border border-border-color shadow-xl flex flex-col items-center justify-center space-y-4 relative group overflow-hidden w-full max-w-[240px]"
                  >
                    {/* Pulsing ambient radial aura gradient */}
                    <div 
                      className="absolute -inset-10 opacity-20 group-hover:opacity-35 blur-2xl rounded-full transition-opacity pointer-events-none"
                      style={{ 
                        background: `radial-gradient(circle, ${activeColor.primary} 0%, transparent 70%)` 
                      }} 
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
        </AnimatePresence>
      </main>

      {/* Global command palette */}
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        setActiveTab={setActiveTab}
        setSearchQuery={setSearchQuery}
      />

      <Footer />
    </div>
  );
}
