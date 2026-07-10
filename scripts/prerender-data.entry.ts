/**
 * Build-time data bridge for scripts/prerender.mjs.
 * Bundled with esbuild so the prerenderer consumes the same typed site data
 * as the app (blog bodies, projects, roadmap, tools) — no duplicated content.
 */
import { BLOG_POSTS, MANUAL_PROJECTS, ROADMAP_STEPS, TOOLS } from '../src/data';

export const data = {
  posts: BLOG_POSTS.map(p => ({
    slug: p.slug, title: p.title, excerpt: p.excerpt, content: p.content,
    date: p.date, readTime: p.readTime, tags: p.tags,
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
};
