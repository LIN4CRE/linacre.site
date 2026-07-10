import { useState, useEffect, useRef, MouseEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Briefcase, Plus, X, Edit, Trash2, Save, ExternalLink, SlidersHorizontal } from 'lucide-react';
import { PROJECTS } from '../data';
import { Project } from '../types';

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'tag'>('name');

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
      // Dispatch storage event to alert other components (like Lab database queries)
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to save projects', e);
    }
  };

  // Listen to storage events to auto-update when database queries in the Lab modify custom projects
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('linacre_custom_projects');
        if (saved) {
          setProjects(JSON.parse(saved));
        } else {
          setProjects(PROJECTS);
        }
      } catch (e) {
        console.error('Failed to reload projects on storage event', e);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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

  // Filter & Sort projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.host.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'category') return a.category.localeCompare(b.category);
    if (sortBy === 'tag') return a.tag.localeCompare(b.tag);
    return 0;
  });

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'start', label: 'Start (Planning)' },
    { id: 'build', label: 'Build (Apps & DBs)' },
    { id: 'deploy', label: 'Deploy (Cloud/CDNs)' },
    { id: 'design', label: 'Design (UI/Assets)' },
    { id: 'email', label: 'Email (Messaging)' }
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Title & Header Section */}
      <section className="text-center md:text-left space-y-4 max-w-3xl" id="projects-hero">
        <span className="font-mono text-xs text-amber-color tracking-widest uppercase font-semibold">
          Ecosystem Hub & Portfolio
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Ecosystem <span className="text-amber-color">Projects</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Manage, build, and showcase all the applications inside your digital workspace. You can edit this page dynamically using direct form editing or by executing database SQL commands inside your AI Lab terminal.
        </p>
      </section>

      {/* Control Panel: Filters, Search, Sort & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/10 dark:bg-[#10141d]/30 border border-border-color p-4 rounded-xl" id="projects-form-anchor">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search projects by name, tag, host..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-background border border-border-color rounded-lg text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground uppercase font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <label htmlFor="projects-sort">Sort:</label>
            <select
              id="projects-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'category' | 'tag')}
              className="bg-background border border-border-color rounded px-2 py-1 text-[10px] text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-color"
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="tag">Tag</option>
            </select>
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-color/15 hover:bg-amber-color/25 text-amber-color border border-amber-color/30 rounded-lg text-xs font-mono transition-colors cursor-pointer select-none"
          >
            {isFormOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isFormOpen ? 'Close Form' : 'Add Project'}</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border-color/30 pb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              categoryFilter === cat.id
                ? 'bg-amber-color text-black font-bold border-amber-color'
                : 'bg-muted/10 text-muted-foreground hover:text-foreground border-border-color/60 hover:bg-muted/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Project Form */}
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="projects-grid">
        {filteredProjects.map((project, idx) => {
          const cardClassName = `group relative flex flex-col justify-between bg-muted/20 dark:bg-[#161b26] border border-border-color rounded-xl p-5 hover:bg-muted/35 dark:hover:bg-[#1c2230] hover:border-border-hi hover:-translate-y-0.5 transition-all duration-200 border-l-[3px] ${
            project.category === 'deploy'
              ? 'border-l-emerald-color'
              : project.category === 'build'
              ? 'border-l-cyan'
              : 'border-l-amber-color'
          }`;
          const cardId = `project-card-${project.name.toLowerCase().replace('.', '-')}`;
          const cardContent = (
            <>
            {/* Action Buttons on Card */}
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
              <span className="truncate max-w-[180px]">{project.host}</span>
              {project.url && <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan" />}
            </div>
            </>
          );

          // Cards without a URL (private/internal projects) must not render as links —
          // an empty href reloads the page on click.
          return project.url ? (
            <a key={idx} href={project.url} target="_blank" rel="noopener" className={cardClassName} id={cardId}>
              {cardContent}
            </a>
          ) : (
            <div key={idx} className={cardClassName} id={cardId}>
              {cardContent}
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-full text-center py-12 bg-muted/5 border border-dashed border-border-color/40 rounded-xl font-mono text-xs text-muted-foreground">
            No projects found matching the search filters.
          </div>
        )}
      </div>
    </div>
  );
}
