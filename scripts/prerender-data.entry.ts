/**
 * Build-time data bridge for scripts/prerender.mjs.
 * Bundled with esbuild so the prerenderer consumes the same typed site data
 * as the app (project catalogue, tools) — no duplicated content.
 */
import { SITE_PROJECTS } from '../src/data/siteProjects';
import { TOOLS } from '../src/data';
import { MUSIC_VIDEO_TRACKS } from '../src/data/musicVideos';

export const data = {
  musicVideos: MUSIC_VIDEO_TRACKS,
  projects: SITE_PROJECTS.map(p => ({
    name: p.name,
    kind: p.kind,
    blurb: p.blurb,
    url: p.url || null,
    repo: p.repo || null,
    tags: p.tags ?? [],
    emoji: p.emoji ?? null,
    private: !!p.private,
    artwork: p.artwork ?? null,
    featured: !!p.featured,
    tech: p.tech ?? [],
    year: p.year ?? null,
  })),
  tools: TOOLS.map(t => ({
    name: t.name,
    category: (t as any).category ?? '',
    description: (t as any).description ?? '',
    url: (t as any).url ?? null,
  })),
};
