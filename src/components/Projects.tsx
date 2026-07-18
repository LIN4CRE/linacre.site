import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Briefcase, ExternalLink, SlidersHorizontal, Github, Globe2, LockKeyhole, Star, Sparkles } from 'lucide-react';
import { PROJECTS } from '../data';
import { Project } from '../types';

const categoryMeta: Record<string, { label: string; tone: string; border: string }> = {
  all: { label: 'All', tone: 'text-foreground', border: 'border-border-color' },
  build: { label: 'Apps & systems', tone: 'text-cyan', border: 'border-cyan' },
  deploy: { label: 'Live platforms', tone: 'text-emerald-color', border: 'border-emerald-color' },
  start: { label: 'Research & planning', tone: 'text-amber-color', border: 'border-amber-color' },
  design: { label: 'Design & assets', tone: 'text-purple-300', border: 'border-purple-300' },
  email: { label: 'Messaging', tone: 'text-rose-300', border: 'border-rose-300' }
};

const isPrivateProject = (project: Project) =>
  !project.url || ['private', 'details on request'].includes(project.url.toLowerCase());

const projectKey = (name: string) => name.trim().toLowerCase();

const mergeSavedProjects = (): Project[] => {
  try {
    const saved = localStorage.getItem('linacre_custom_projects');
    if (!saved) return PROJECTS;

    const customProjects = JSON.parse(saved) as Project[];
    const projectMap = new Map<string, Project>();

    // Canonical public projects always win so new portfolio entries ship to returning visitors.
    PROJECTS.forEach(project => projectMap.set(projectKey(project.name), project));
    customProjects.forEach(project => {
      const key = projectKey(project.name);
      if (!projectMap.has(key)) projectMap.set(key, project);
    });

    return Array.from(projectMap.values());
  } catch (error) {
    console.error('Failed to load custom projects', error);
    return PROJECTS;
  }
};

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'category' | 'tag'>('featured');
  const [projects, setProjects] = useState<Project[]>(mergeSavedProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const handleStorageChange = () => setProjects(mergeSavedProjects());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#project-')) {
        const projectName = decodeURIComponent(hash.slice(9)).replace(/_/g, ' ');
        const found = projects.find(p => p.name.toLowerCase() === projectName.toLowerCase());
        if (found) setSelectedProject(found);
      } else if (!hash) {
        setSelectedProject(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [projects]);

  useEffect(() => {
    if (selectedProject) {
      const projectHash = `#project-${encodeURIComponent(selectedProject.name.replace(/\s+/g, '_'))}`;
      if (window.location.hash !== projectHash) window.history.pushState(null, '', projectHash);
    } else if (window.location.hash.startsWith('#project-')) {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  }, [selectedProject]);

  const handleRequestAccess = (project: Project) => {
    try {
      sessionStorage.setItem('linacre_pending_request', JSON.stringify({
        projectName: project.name,
        projectType: project.tag
      }));
      setSelectedProject(null);
      window.history.pushState({}, '', '/contact');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      console.error('Failed to save pending request', error);
    }
  };

  const categories = [
    { id: 'all', label: 'All work' },
    ...Array.from(new Set(projects.map(project => project.category))).map(category => ({
      id: category,
      label: categoryMeta[category]?.label || category
    }))
  ];

  const filteredProjects = projects.filter(project => {
    const haystack = [
      project.name,
      project.description,
      project.tag,
      project.host,
      project.role || '',
      project.challenges || '',
      project.solution || '',
      ...(project.tech || [])
    ].join(' ').toLowerCase();

    const matchesSearch = haystack.includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    const privateProject = isPrivateProject(project);
    const matchesVisibility =
      visibilityFilter === 'all' ||
      (visibilityFilter === 'public' && !privateProject) ||
      (visibilityFilter === 'private' && privateProject);

    return matchesSearch && matchesCategory && matchesVisibility;
  }).sort((a, b) => {
    if (sortBy === 'featured') {
      const rank = (project: Project) => {
        if (project.name === 'Mob Deals') return 0;
        if (project.name === 'linacre.site') return 1;
        if (project.tag.toLowerCase().includes('featured')) return 2;
        if (project.liveUrl) return 3;
        return 4;
      };
      return rank(a) - rank(b) || a.name.localeCompare(b.name);
    }
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'category') return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
    if (sortBy === 'tag') return a.tag.localeCompare(b.tag) || a.name.localeCompare(b.name);
    return 0;
  });

  const publicProjects = projects.filter(project => !isPrivateProject(project));
  const liveProjects = projects.filter(project => project.liveUrl || project.url.startsWith('http'));
  const techCount = new Set(projects.flatMap(project => project.tech || [])).size;
  const featuredProjects = filteredProjects.slice(0, 3);

  return (
    <div className="space-y-10 animate-fade-in">
      <section id="projects-hero" className="relative overflow-hidden rounded-3xl border border-border-color bg-gradient-to-br from-muted/20 via-background to-amber-color/10 p-6 sm:p-8 lg:p-10">
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,.22),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,.12),transparent_34%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] text-amber-color tracking-widest uppercase font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Selected builds / live systems / experiments
            </span>
            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Projects built to <span className="text-amber-color">ship</span>, not sit in folders.
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                A cleaner portfolio of production sites, open-source utilities, AI experiments and automation systems. Mob Deals now sits alongside the strongest work as a fully deployed UK mobile decision tool with live source checks and accessible switching guidance.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#projects-grid" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-color text-black font-mono text-xs font-bold hover:bg-amber-color/90 transition-colors">
                Browse projects
              </a>
              <a href="https://lin4cre.github.io/mob-deals/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan/40 text-cyan bg-cyan/10 font-mono text-xs font-bold hover:bg-cyan/15 transition-colors">
                Mob Deals live <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="rounded-2xl border border-border-color bg-background/60 p-4">
              <div className="text-3xl font-bold text-foreground">{projects.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total projects</div>
            </div>
            <div className="rounded-2xl border border-border-color bg-background/60 p-4">
              <div className="text-3xl font-bold text-emerald-color">{publicProjects.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Public links</div>
            </div>
            <div className="rounded-2xl border border-border-color bg-background/60 p-4">
              <div className="text-3xl font-bold text-cyan">{liveProjects.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Live / reachable</div>
            </div>
            <div className="rounded-2xl border border-border-color bg-background/60 p-4">
              <div className="text-3xl font-bold text-amber-color">{techCount}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Tech tags</div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="featured-projects-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Best of the stack</span>
            <h2 id="featured-projects-heading" className="font-display text-2xl sm:text-3xl font-bold text-foreground">Featured projects</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Highlighting projects with live deployments, useful public documentation and a clear product story.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {featuredProjects.map((project) => (
            <button
              key={project.name}
              onClick={() => setSelectedProject(project)}
              className="text-left group rounded-2xl border border-border-color bg-muted/15 hover:bg-muted/25 hover:border-border-hi p-5 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-color/15 border border-amber-color/25 grid place-items-center text-amber-color">
                  <Star className="w-4 h-4" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-full text-cyan bg-cyan/10 border border-cyan/20">
                  {project.tag}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-foreground group-hover:text-amber-color transition-colors">{project.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-4">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(project.tech || []).slice(0, 4).map(tech => (
                  <span key={tech} className="font-mono text-[10px] px-2 py-1 rounded-full bg-background/60 border border-border-color text-muted-foreground">{tech}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="project-controls-heading" className="rounded-2xl border border-border-color bg-muted/10 p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 text-foreground">
          <SlidersHorizontal className="w-4 h-4 text-amber-color" />
          <h2 id="project-controls-heading" className="font-mono text-xs uppercase tracking-widest font-bold">Find the right case study</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <label className="relative block">
            <span className="sr-only">Search projects</span>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              type="search"
              placeholder="Search by project, tech, role or outcome..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border-color rounded-xl text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
            />
          </label>

          <label className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground uppercase font-bold">
            Access
            <select
              value={visibilityFilter}
              onChange={(event) => setVisibilityFilter(event.target.value as 'all' | 'public' | 'private')}
              className="bg-background border border-border-color rounded-lg px-2 py-2 text-[11px] text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-color"
            >
              <option value="all">All</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </label>

          <label className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground uppercase font-bold">
            Sort
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as 'featured' | 'name' | 'category' | 'tag')}
              className="bg-background border border-border-color rounded-lg px-2 py-2 text-[11px] text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-color"
            >
              <option value="featured">Featured</option>
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="tag">Tag</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border-color/40 pt-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setCategoryFilter(category.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                categoryFilter === category.id
                  ? 'bg-amber-color text-black font-bold border-amber-color'
                  : 'bg-background/60 text-muted-foreground hover:text-foreground border-border-color hover:bg-muted/20'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
        <span>{filteredProjects.length} project{filteredProjects.length === 1 ? '' : 's'} shown</span>
        <span>{categoryFilter === 'all' ? 'All categories' : categoryMeta[categoryFilter]?.label || categoryFilter}</span>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" id="projects-grid" aria-label="Project cards">
        {filteredProjects.map((project, idx) => {
          const privateProject = isPrivateProject(project);
          const meta = categoryMeta[project.category] || categoryMeta.build;
          const cardId = `project-card-${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

          return (
            <article
              key={`${project.name}-${idx}`}
              className={`group relative flex flex-col bg-muted/15 dark:bg-[#111722] border border-border-color rounded-2xl p-5 hover:bg-muted/25 dark:hover:bg-[#172033] hover:border-border-hi hover:-translate-y-0.5 transition-all duration-200 border-l-[3px] ${meta.border}`}
              id={cardId}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <p className={`font-mono text-[10px] uppercase tracking-widest font-bold ${meta.tone}`}>{meta.label}</p>
                  <h3 className="mt-1 font-display text-lg font-bold text-foreground leading-tight">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-left hover:text-amber-color transition-colors focus:outline-none focus:underline"
                      aria-label={`View details for project ${project.name}`}
                    >
                      {project.name}
                    </button>
                  </h3>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-full text-cyan bg-cyan/10 border border-cyan/20 shrink-0 max-w-[9rem] truncate">
                  {project.tag}
                </span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                {project.description}
              </p>

              {project.tech && project.tech.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tech.slice(0, 5).map(tech => (
                    <span key={tech} className="font-mono text-[10px] px-2 py-1 rounded-full bg-background/70 border border-border-color text-muted-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-muted-foreground/80 border-t border-border-color/40 pt-3">
                <span className="truncate max-w-[180px] flex items-center gap-1.5">
                  {privateProject ? <LockKeyhole className="w-3 h-3" /> : <Globe2 className="w-3 h-3" />}
                  {project.host}
                </span>
                <button
                  onClick={() => setSelectedProject(project)}
                  className="text-cyan hover:text-cyan/80 transition-colors flex items-center gap-1 focus:outline-none focus:underline"
                  aria-label={`View details for project ${project.name}`}
                >
                  Details <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </article>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-full text-center py-14 bg-muted/5 border border-dashed border-border-color/40 rounded-2xl font-mono text-sm text-muted-foreground">
            No projects match those filters. Try clearing search or switching category.
          </div>
        )}
      </section>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-[#0b0e14] border border-border-color rounded-2xl overflow-hidden shadow-2xl font-mono text-xs flex flex-col"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-project-title"
            >
              <div className="bg-[#111622] px-4 py-3 flex items-center justify-between border-b border-border-color/30">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                  <span className="text-muted-foreground/60 text-[10px] ml-2">case-study.md</span>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Close project details"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-amber-color font-bold">Project details</p>
                    <h2 id="modal-project-title" className="mt-1 font-display text-2xl font-bold text-foreground">
                      {selectedProject.name}
                    </h2>
                    <span className="inline-block mt-2 font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-full text-cyan bg-cyan/10 border border-cyan/20">
                      {selectedProject.tag}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.liveUrl && (
                      <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-color text-black rounded-lg font-bold hover:bg-amber-color/90 transition-colors">
                        Live <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {selectedProject.repoUrl && (
                      <a href={selectedProject.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-color rounded-lg text-foreground hover:bg-muted/20 transition-colors">
                        <Github className="w-3.5 h-3.5" /> Repo
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed bg-muted/10 border border-border-color/50 rounded-xl p-4">
                  {selectedProject.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedProject.role && (
                    <div className="space-y-1">
                      <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Role</h3>
                      <p className="text-foreground">{selectedProject.role}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Access</h3>
                    <p className="text-foreground">{isPrivateProject(selectedProject) ? 'Details on request' : selectedProject.host}</p>
                  </div>
                </div>

                {selectedProject.challenges && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-foreground flex items-center gap-2"><Briefcase className="w-3.5 h-3.5 text-amber-color" /> Challenge</h3>
                    <p className="text-muted-foreground leading-relaxed">{selectedProject.challenges}</p>
                  </div>
                )}

                {selectedProject.solution && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-foreground flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-cyan" /> Solution</h3>
                    <p className="text-muted-foreground leading-relaxed">{selectedProject.solution}</p>
                  </div>
                )}

                {selectedProject.tech && selectedProject.tech.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-foreground">Tech stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech.map(tech => (
                        <span key={tech} className="px-2 py-1 rounded-full bg-muted/20 border border-border-color text-muted-foreground">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border-color/40">
                  {isPrivateProject(selectedProject) ? (
                    <button
                      onClick={() => handleRequestAccess(selectedProject)}
                      className="flex-1 px-4 py-2.5 bg-amber-color text-black font-bold rounded-xl hover:bg-amber-color/90 transition-colors"
                    >
                      Request details / access
                    </button>
                  ) : (
                    <a
                      href={selectedProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-color text-black font-bold rounded-xl hover:bg-amber-color/90 transition-colors"
                    >
                      Open project <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2.5 border border-border-color rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
