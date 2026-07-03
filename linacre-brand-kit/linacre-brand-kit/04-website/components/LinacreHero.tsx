import React from "react";
import "./linacre-hero.css";

export function LinacreHero() {
  return (
    <section className="linacre-hero" aria-labelledby="linacre-hero-title">
      <div className="linacre-hero__copy">
        <p className="linacre-eyebrow">amber · hexagon · pulse · cyber</p>
        <h1 id="linacre-hero-title">
          Full-stack and AI engineering, built with calm systems.
        </h1>
        <p className="linacre-hero__lead">
          Linacre.site is my toolkit directory, AI lab, roadmap, and
          changelog-driven workspace for modern web builders.
        </p>
        <div className="linacre-hero__actions">
          <a className="linacre-button linacre-button--primary" href="#toolkit">
            Explore the toolkit
          </a>
          <a className="linacre-button linacre-button--secondary" href="#ai-lab">
            Try the AI Lab
          </a>
        </div>
      </div>

      <aside className="linacre-terminal-card" aria-label="Terminal preview">
        <div className="linacre-terminal-card__top" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p><strong>david@linacre.site</strong>:~ $ whoami</p>
        <p>Full-Stack & AI Engineer</p>
        <p><strong>$ grep</strong> / to search toolkit</p>
        <div className="linacre-mini-grid">
          <span>Toolkit</span>
          <span>AI Lab</span>
          <span>Roadmap</span>
          <span>Changelog</span>
        </div>
      </aside>
    </section>
  );
}
