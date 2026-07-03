import { useState, useEffect, useRef, MouseEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star, ExternalLink, HelpCircle, Briefcase, Sparkles, Plus, Check, Trash2, Edit, X, Save } from 'lucide-react';
import { TOOLS, PROJECTS } from '../data';
import { Tool, Project, ToolCategory } from '../types';

interface ToolkitProps {
  onToolSelect?: (tool: Tool) => void;
  openPalette?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Toolkit({ onToolSelect, openPalette, searchQuery, setSearchQuery }: ToolkitProps) {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [bookmarkedTools, setBookmarkedTools] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Projects State with localStorage synchronization
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('linacre_custom_projects');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load custom projects', e);
    }
    return PROJECTS;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Form fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('build');
  const [formDescription, setFormDescription] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formHost, setFormHost] = useState('');
  const [formTag, setFormTag] = useState('Live');

  // Sync projects to localStorage
  const saveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    try {
      localStorage.setItem('linacre_custom_projects', JSON.stringify(updatedProjects));
    } catch (e) {
      console.error('Failed to save projects', e);
    }
  };

  const handleAddOrEditProject = (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formUrl.trim()) return;

    // Derive host name from URL if empty
    let finalHost = formHost.trim();
    if (!finalHost) {
      try {
        let cleanUrl = formUrl.trim();
        if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
          cleanUrl = 'https://' + cleanUrl;
        }
        const parsedUrl = new URL(cleanUrl);
        finalHost = parsedUrl.hostname.replace('www.', '');
      } catch {
        finalHost = formUrl;
      }
    }

    const newProject: Project = {
      name: formName.trim(),
      category: formCategory,
      description: formDescription.trim(),
      url: formUrl.trim(),
      host: finalHost,
      tag: formTag.trim() || 'Live'
    };

    let updated: Project[];
    if (editingProject) {
      // Map names or find match
      updated = projects.map(p => p.name === editingProject.name ? newProject : p);
    } else {
      if (projects.some(p => p.name.toLowerCase() === newProject.name.toLowerCase())) {
        alert('A project with this name already exists.');
        return;
      }
      updated = [...projects, newProject];
    }

    saveProjects(updated);
    
    // Reset form
    setFormName('');
    setFormCategory('build');
    setFormDescription('');
    setFormUrl('');
    setFormHost('');
    setFormTag('Live');
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleEditClick = (project: Project, e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingProject(project);
    setFormName(project.name);
    setFormCategory(project.category);
    setFormDescription(project.description);
    setFormUrl(project.url);
    setFormHost(project.host);
    setFormTag(project.tag);
    setIsFormOpen(true);
    
    // Scroll form into view gently
    setTimeout(() => {
      document.getElementById('projects-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteProject = (projectName: string, e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to remove project "${projectName}"?`)) {
      const updated = projects.filter(p => p.name !== projectName);
      saveProjects(updated);
    }
  };

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
              className="w-full bg-muted/40 dark:bg-[#10141d]/40 border border-border-color rounded-lg py-2.5 pl-20 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan text-foreground placeholder:text-muted-foreground/60 transition-all font-mono"
              id="search-input"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <span className="hidden sm:inline-block font-mono text-[10px] text-muted-foreground bg-muted border border-border-color px-1.5 py-0.5 rounded shadow-sm">
                / to search
              </span>
            </div>
          </div>

          {/* Counts */}
          <div className="font-mono text-xs text-muted-foreground flex items-center gap-1.5 self-end md:self-center bg-muted/30 dark:bg-muted/10 border border-border-color/30 px-3 py-1.5 rounded-md">
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
                    className={`group relative flex flex-col justify-between bg-muted/20 dark:bg-[#161b26] border border-border-color rounded-xl p-5 hover:bg-muted/35 dark:hover:bg-[#1c2230] hover:border-border-hi hover:-translate-y-0.5 transition-all duration-200 border-l-[3px] ${getLeftBorderColor(
                      tool.category
                    )}`}
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
                          >
                            <Star
                              className={`w-3.5 h-3.5 transition-transform ${
                                isBookmarked
                                  ? 'fill-amber-color text-amber-color scale-110'
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

      {/* Projects Grid Section */}
      <section className="space-y-6 pt-6 border-t border-border-color/50" id="projects-section">
        <div className="flex items-center justify-between" id="projects-form-anchor">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-color" />
            <h2 className="font-mono text-md font-bold tracking-tight text-foreground">Projects</h2>
          </div>
          <button
            onClick={() => {
              if (isFormOpen && editingProject) {
                setEditingProject(null);
                setFormName('');
                setFormCategory('build');
                setFormDescription('');
                setFormUrl('');
                setFormHost('');
                setFormTag('Live');
                setIsFormOpen(false);
              } else if (isFormOpen) {
                setIsFormOpen(false);
              } else {
                setEditingProject(null);
                setFormName('');
                setFormCategory('build');
                setFormDescription('');
                setFormUrl('');
                setFormHost('');
                setFormTag('Live');
                setIsFormOpen(true);
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-color/10 hover:bg-amber-color/20 text-amber-color border border-amber-color/30 rounded-lg text-xs font-mono transition-colors cursor-pointer select-none"
          >
            {isFormOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isFormOpen ? 'Close Form' : 'Add Project'}</span>
          </button>
        </div>

        <AnimatePresence>
          {isFormOpen && (
            <motion.form
              onSubmit={handleAddOrEditProject}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-muted/15 border border-border-color/60 rounded-xl p-5 space-y-4 overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border-color/40 pb-2">
                <span className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                  {editingProject ? '✏️ Edit Project' : '🚀 Add New Project'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingProject(null);
                  }}
                  className="text-muted-foreground hover:text-foreground p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My Awesome App"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-background/50 border border-border-color rounded-lg px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-background border border-border-color rounded-lg px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                  >
                    <option value="start">start (ide / planning)</option>
                    <option value="build">build (frameworks / DB / backend)</option>
                    <option value="deploy">deploy (hosting / CDNs)</option>
                    <option value="design">design (icons / ui / assets)</option>
                    <option value="email">email (messaging / contact)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">Project URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. github.com/LIN4CRE/project"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    className="w-full bg-background/50 border border-border-color rounded-lg px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">Label (e.g. Host/Repo)</label>
                    <input
                      type="text"
                      placeholder="e.g. github.com (auto if blank)"
                      value={formHost}
                      onChange={(e) => setFormHost(e.target.value)}
                      className="w-full bg-background/50 border border-border-color rounded-lg px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Live, Open Source"
                      value={formTag}
                      onChange={(e) => setFormTag(e.target.value)}
                      className="w-full bg-background/50 border border-border-color rounded-lg px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-muted-foreground uppercase font-bold">Description</label>
                <textarea
                  placeholder="Tell us about the project, tech stack, and what you learned..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-background/50 border border-border-color rounded-lg px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border-color/30">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingProject(null);
                  }}
                  className="px-3 py-1.5 border border-border-color rounded-lg text-xs font-mono hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-color hover:bg-amber-color/90 text-black font-bold rounded-lg text-xs font-mono transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingProject ? 'Update Project' : 'Add Project'}</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((project, idx) => (
            <a
              key={idx}
              href={project.url}
              target="_blank"
              rel="noopener"
              className={`group relative flex flex-col justify-between bg-muted/20 dark:bg-[#161b26] border border-border-color rounded-xl p-5 hover:bg-muted/35 dark:hover:bg-[#1c2230] hover:border-border-hi hover:-translate-y-0.5 transition-all duration-200 border-l-[3px] ${
                project.category === 'deploy'
                  ? 'border-l-emerald-color'
                  : project.category === 'build'
                  ? 'border-l-cyan'
                  : 'border-l-amber-color'
              }`}
              id={`project-card-${project.name.toLowerCase().replace('.', '-')}`}
            >
              {/* Overlay edit/delete tools in top right */}
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                <button
                  onClick={(e) => handleEditClick(project, e)}
                  className="p-1 rounded bg-muted/80 dark:bg-[#202738] border border-border-color text-muted-foreground hover:text-cyan hover:border-cyan transition-all cursor-pointer"
                  title="Edit Project"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => handleDeleteProject(project.name, e)}
                  className="p-1 rounded bg-muted/80 dark:bg-[#202738] border border-border-color text-muted-foreground hover:text-rose-400 hover:border-rose-500/50 transition-all cursor-pointer"
                  title="Delete Project"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-mono text-sm font-semibold text-foreground group-hover:text-cyan transition-colors pr-14">
                    {project.name}
                  </h3>
                  <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded text-cyan bg-cyan/10 shrink-0">
                    {project.tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {project.description}
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/70 border-t border-border-color/40 pt-3">
                <span>{project.host}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan" />
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
