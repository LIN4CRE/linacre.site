import { useState, useEffect, useRef, MouseEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star, ExternalLink, HelpCircle, Sparkles, Check } from 'lucide-react';
import { TOOLS } from '../data';
import { Tool, ToolCategory } from '../types';

interface ToolkitProps {
  onToolSelect?: (tool: Tool) => void;
  openPalette?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: ToolCategory | 'all';
  setActiveCategory: (category: ToolCategory | 'all') => void;
}

export default function Toolkit({ onToolSelect, openPalette, searchQuery, setSearchQuery, activeCategory, setActiveCategory }: ToolkitProps) {
  const [bookmarkedTools, setBookmarkedTools] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('linacre_stack_v1');
      if (saved) {
        setBookmarkedTools(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load stack bookmarks', e);
    }
  }, []);

  // Save bookmarks to localStorage
  const saveBookmarks = (newBookmarks: string[]) => {
    setBookmarkedTools(newBookmarks);
    try {
      localStorage.setItem('linacre_stack_v1', JSON.stringify(newBookmarks));
    } catch (e) {
      console.error('Failed to save stack bookmarks', e);
    }
  };

  const toggleBookmark = (id: string, e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    let updated: string[];
    if (bookmarkedTools.includes(id)) {
      updated = bookmarkedTools.filter((item) => item !== id);
    } else {
      updated = [...bookmarkedTools, id];
    }
    saveBookmarks(updated);
  };

  // Focus search input on "/"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter tools based on search and category
  const filteredTools = TOOLS.filter((tool) => {
    const matchesSearch =
      !searchQuery ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.searchKeywords.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.host.toLowerCase().includes(searchQuery.toLowerCase());

    const isStackActive = activeCategory === 'stack';
    const matchesCategory =
      activeCategory === 'all' ||
      (isStackActive ? bookmarkedTools.includes(tool.id) : tool.category === activeCategory);

    return matchesSearch && matchesCategory;
  });

  const categories: { id: ToolCategory | 'all'; label: string; title: string }[] = [
    { id: 'all', label: 'all', title: 'Show all developer tools' },
    { id: 'start', label: 'start', title: 'IDE, Version Control, Project planning' },
    { id: 'build', label: 'build', title: 'Frameworks, DBs, Auth, Payment' },
    { id: 'deploy', label: 'deploy', title: 'Hostings, Cloud platforms, CDNs' },
    { id: 'design', label: 'design', title: 'Icons, Prototyping, Assets' },
    { id: 'email', label: 'email', title: 'Domain emails, transactional APIs' },
    { id: 'stack', label: '★ my stack', title: 'Your bookmarked developer tools' },
  ];

  const getLeftBorderColor = (cat: string) => {
    switch (cat) {
      case 'start':
        return 'border-l-amber-color';
      case 'build':
        return 'border-l-cyan';
      case 'deploy':
        return 'border-l-emerald-color';
      case 'design':
        return 'border-l-purple-color';
      case 'email':
        return 'border-l-rose-400';
      default:
        return 'border-l-border-color';
    }
  };

  return (
    <div className="space-y-12">
      {/* Search and Filters Section */}
      <section className="space-y-6" id="toolkit-head">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Label and search */}
          <div className="relative flex-1 max-w-md w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground font-mono text-sm">
              $ grep
            </div>
            <input
              ref={searchInputRef}
              type="search"
              placeholder="search the toolkit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/40 dark:bg-[#0B1220]/60 border border-amber-color/15 rounded-2xl py-2.5 pl-20 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-amber-color/50 focus:border-amber-color text-foreground placeholder:text-muted-foreground/60 transition-all font-mono"
              id="search-input"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <span className="hidden sm:inline-block font-mono text-[10px] text-muted-foreground bg-muted border border-border-color px-1.5 py-0.5 rounded shadow-sm">
                / to search
              </span>
            </div>
          </div>

          {/* Counts */}
          <div className="font-mono text-xs text-muted-foreground flex items-center gap-1.5 self-end md:self-center bg-muted/30 dark:bg-[#0B1220]/40 border border-amber-color/10 px-3 py-1.5 rounded-xl">
            <Sparkles className="w-3.5 h-3.5 text-amber-color animate-pulse" />
            <span>
              // showing {filteredTools.length} of {TOOLS.length} tools
              {activeCategory !== 'all' && (
                <span> in <span className="text-amber-color">{activeCategory === 'stack' ? 'my stack' : activeCategory}</span></span>
              )}
            </span>
          </div>
        </div>

        {/* Categories Grid/Chips */}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category" id="category-chips">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 font-mono text-xs rounded-md border transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan/40 ${
                  isSelected
                    ? cat.id === 'stack'
                      ? 'bg-amber-color/10 border-amber-color text-amber-color font-medium shadow-[0_0_12px_rgba(255,180,84,0.15)]'
                      : 'bg-cyan/10 border-cyan text-cyan font-medium'
                    : 'bg-muted/40 dark:bg-[#10141d]/20 border-border-color text-muted-foreground hover:text-foreground hover:border-muted-foreground/40'
                }`}
                title={cat.title}
                aria-pressed={isSelected}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid of Cards */}
      <section className="space-y-4" id="toolkit-grid-section">
        <AnimatePresence mode="popLayout">
          {filteredTools.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              id="toolkit-grid"
            >
              {filteredTools.map((tool) => {
                const isBookmarked = bookmarkedTools.includes(tool.id);
                return (
                  <motion.a
                    key={tool.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    href={tool.url}
                    target="_blank"
                    rel="noopener"
                    className={`group relative flex flex-col justify-between bg-muted/20 dark:bg-[#0B1220]/80 border border-amber-color/12 rounded-2xl p-5 hover:bg-muted/35 dark:hover:bg-[#111827] hover:border-amber-color/30 hover:-translate-y-1 transition-all border-l-[3px] ${getLeftBorderColor(
                      tool.category
                    )}`}
                    style={{ transitionDuration: 'var(--linacre-duration-base)', boxShadow: 'var(--linacre-card-shadow)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--linacre-glow-soft)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--linacre-card-shadow)'; }}
                    id={`tool-card-${tool.id}`}
                  >
                    <div>
                      {/* Top bar inside card */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="font-mono text-sm font-semibold text-foreground group-hover:text-amber-color transition-colors">
                          {tool.name}
                        </h3>
                        
                        <div className="flex items-center gap-1.5">
                          {/* Bookmark button */}
                          <button
                            onClick={(e) => toggleBookmark(tool.id, e)}
                            className="p-1 rounded-md text-muted-foreground hover:text-amber-color hover:bg-muted/60 transition-colors cursor-pointer"
                            title={isBookmarked ? 'Remove from stack' : 'Add to stack'}
                            aria-label={isBookmarked ? 'Remove from stack' : 'Add to stack'}
                          >
                            <Star
                              className={`w-3.5 h-3.5 transition-transform ${
                                isBookmarked
                                  ? 'fill-amber-color text-amber-color scale-110 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </button>
                          
                          <span
                            className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              tool.tag === 'Free'
                                ? 'text-emerald-color bg-emerald-color/10'
                                : 'text-amber-color bg-amber-color/10'
                            }`}
                          >
                            {tool.tag}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
                        {tool.description}
                      </p>
                    </div>

                    {/* Bottom host */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/70 border-t border-border-color/40 pt-3 mt-1">
                      <span>{tool.host}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan" />
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 border border-dashed border-border-color rounded-xl bg-muted/10 font-mono text-xs text-muted-foreground"
              id="no-results-panel"
            >
              <HelpCircle className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
              <p>// no matches — try another keyword or clear the filter.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>


    </div>
  );
}
