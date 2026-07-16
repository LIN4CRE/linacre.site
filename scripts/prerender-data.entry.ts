/**
 * Build-time data bridge for scripts/prerender.mjs.
 * Bundled with esbuild so the prerenderer consumes the same typed site data
 * as the app (blog bodies, projects, roadmap, tools) — no duplicated content.
 */
import { BLOG_POSTS, MANUAL_PROJECTS, ROADMAP_STEPS, TOOLS, WORK_FAQS, WORK_NEXT_AVAILABLE } from '../src/data';

// Shared markdown renderer — same implementation the React blog modal uses,
// so JS and no-JS visitors get identical HTML (audit TASK-001, 12 Jul 2026).
export { mdToHtml } from '../src/lib/markdown';

export const data = {
  posts: BLOG_POSTS.map(p => ({
    slug: p.slug, title: p.title, excerpt: p.excerpt, content: p.content,
    date: p.date, readTime: p.readTime, tags: p.tags, category: p.category,
  })),
  projects: MANUAL_PROJECTS.map(p => ({
    name: p.name, category: p.category, description: p.description,
    url: p.url || null, tag: p.tag, role: p.role ?? null,
    challenges: p.challenges ?? null, solution: p.solution ?? null,
    tech: p.tech ?? [],
  })),
  roadmap: ROADMAP_STEPS.map((s: any) => ({
    title: s.title ?? s.name ?? '',
    description: s.text ?? s.description ?? '',
  })),
  tools: TOOLS.map(t => ({
    name: t.name, category: (t as any).category ?? '', description: (t as any).description ?? '',
    url: (t as any).url ?? null,
  })),
  workFaqs: WORK_FAQS.map(f => ({ question: f.question, answer: f.answer })),
  workNextAvailable: WORK_NEXT_AVAILABLE,
};
