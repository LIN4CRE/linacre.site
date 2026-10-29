import { useState } from 'react';
import { SITE_PROJECTS } from '../data/siteProjects';
import ProjectGrid from './ProjectGrid';

const games = SITE_PROJECTS.filter(project => project.kind === 'Game' && !project.private);

export default function Games() {
  const [query, setQuery] = useState('');
  return (
    <div className="space-y-8">
      <section aria-labelledby="games-heading" className="space-y-4">
        <h1 id="games-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Games, without the takeover</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">KushCloud and Tabulous Games are featured first. Other games remain discoverable for testing, not advertised as verified releases. Games open only when you follow a link — no embedded players or automatic audio.</p>
        <a href="/" className="inline-flex min-h-11 items-center rounded-lg underline underline-offset-4">Back to all projects</a>
      </section>

      {/* Featured Flagship Game Vault */}
      <section aria-label="Flagship games portal" className="rounded-2xl border border-border-color bg-card p-6 shadow-sm transition-all sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-foreground px-2.5 py-0.5 font-bold text-background uppercase tracking-wider">Flagship Portal</span>
              <span className="rounded-full border border-border-color px-2 py-0.5 text-muted-foreground">300+ Verified Titles</span>
              <span className="rounded-full border border-border-color px-2 py-0.5 text-muted-foreground">No Installs</span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Tabulous Games</h2>
            <p className="text-muted-foreground leading-relaxed">
              Curated catalogue of 300+ browser game ports, fan remakes, and static recompilations that actually run in a tab. Play Need for Speed: Most Wanted, Super Mario 64, Halo CE, GTA Vice City, Burnout 3, and Quake with zero installs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://lin4cre.github.io/tabulous-games/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-foreground px-6 text-sm font-semibold text-background shadow transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              Open Tabulous Games 🎮
            </a>
          </div>
        </div>
      </section>

      <div role="search">
        <label htmlFor="game-search" className="mb-2 block text-sm font-semibold">Find a game</label>
        <input id="game-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search games by name or genre" className="min-h-12 w-full rounded-xl border border-border-color bg-background px-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground" />
      </div>
      <ProjectGrid query={query} setQuery={setQuery} projects={games} heading="Games library" />
    </div>
  );
}
