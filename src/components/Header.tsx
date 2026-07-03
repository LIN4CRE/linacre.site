import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Github, Terminal, BookOpen, Cpu, Layers, Sun, Moon, Command, Sparkles, Sliders, Briefcase } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  openPalette: () => void;
}

export default function Header({ activeTab, setActiveTab, theme, setTheme, openPalette }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'toolkit', label: 'Toolkit', icon: Layers },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'lab', label: 'Lab', icon: Cpu },
    { id: 'playground', label: 'Playground', icon: Sliders },
    { id: 'dashboard', label: 'Dashboard', icon: Terminal },
    { id: 'identity', label: 'Identity', icon: Sparkles },
  ];

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(nextTheme);
    localStorage.setItem('linacre_theme', nextTheme);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-color bg-background/80 backdrop-blur-md transition-colors duration-200" role="banner">
      {/* Skip-to-content link for keyboard/screen reader accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-amber-color focus:text-[#0b0e14] focus:rounded-md focus:font-mono focus:text-sm focus:font-bold focus:shadow-lg"
      >
        Skip to content
      </a>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <button
            onClick={() => setActiveTab('toolkit')}
            className="flex items-center gap-2 font-mono font-bold text-lg tracking-tight hover:opacity-90 group focus:outline-none focus:ring-2 focus:ring-cyan/50 rounded"
            id="nav-logo"
          >
            <span className="text-amber-color transform group-hover:translate-x-0.5 transition-transform">&gt;</span>
            <span className="text-foreground transition-colors">linacre</span>
            <span className="text-amber-color">.</span>
            <span className="text-foreground transition-colors">site</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`relative px-4 py-2 flex items-center gap-1.5 font-mono text-sm transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-cyan/50 ${
                    isActive ? 'text-amber-color font-medium' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-color"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}

            {/* GitHub external Link */}
            <a
              href="https://github.com/LIN4CRE/linacre.site"
              target="_blank"
              rel="noopener"
              id="nav-github"
              className="px-4 py-2 flex items-center gap-1.5 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-cyan/50"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* Command Palette Button */}
            <button
              onClick={openPalette}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan/50 flex items-center gap-1.5"
              title="Open Command Palette (Press /)"
              id="btn-command-palette"
            >
              <Command className="w-4 h-4" />
              <kbd className="hidden sm:inline-block font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border-color text-muted-foreground shadow-sm">
                /
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan/50"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              id="btn-theme-toggle"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-color" /> : <Moon className="w-4 h-4 text-cyan" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan/50"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              id="btn-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="md:hidden border-t border-border-color bg-background/95 backdrop-blur-lg overflow-hidden"
            id="mobile-nav-panel"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-tab-${item.id}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 flex items-center gap-2.5 font-mono text-sm transition-colors rounded-md ${
                      isActive
                        ? 'bg-amber-color/10 text-amber-color font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <a
                href="https://github.com/LIN4CRE/linacre.site"
                target="_blank"
                rel="noopener"
                id="mobile-nav-github"
                className="w-full px-3 py-2.5 flex items-center gap-2.5 font-mono text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors rounded-md"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
