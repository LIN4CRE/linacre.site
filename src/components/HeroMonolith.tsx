/**
 * A small, CSS-built 3D brand artefact for the project-library hero.
 * The six faces are real preserve-3d layers; no WebGL, image download, or
 * pointer tracking is required. It is decorative, so its contents are hidden
 * from assistive technology and motion is disabled by the global reduced-motion
 * preference.
 */
export default function HeroMonolith() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="hero-art__grid" />
      <div className="hero-art__glow" />
      <div className="hero-art__orbit hero-art__orbit--outer">
        <span />
      </div>
      <div className="hero-art__orbit hero-art__orbit--inner">
        <span />
      </div>

      <div className="hero-art__cube-stage">
        <div className="hero-art__cube">
          <div className="hero-art__face hero-art__face--front">
            <span className="hero-art__mark">L</span>
            <span className="hero-art__face-caption">LIN4CRE / 001</span>
            <span className="hero-art__face-rule" />
          </div>
          <div className="hero-art__face hero-art__face--back">
            <span className="hero-art__face-index">INDEPENDENT BY DESIGN</span>
            <span className="hero-art__back-mark">L / 4</span>
            <span className="hero-art__face-index">MADE IN THE NORTH · UK</span>
          </div>
          <div className="hero-art__face hero-art__face--right">
            <span className="hero-art__face-index">SYSTEMS</span>
            <span className="hero-art__side-mark">//</span>
            <span className="hero-art__face-index">SOFTWARE</span>
          </div>
          <div className="hero-art__face hero-art__face--left">
            <span className="hero-art__face-index">BUILD / TEST / SHIP</span>
            <span className="hero-art__face-rule" />
            <span className="hero-art__face-index">EST. 2020</span>
          </div>
          <div className="hero-art__face hero-art__face--top">
            <span className="hero-art__top-mark">L</span>
          </div>
          <div className="hero-art__face hero-art__face--bottom">
            <span className="hero-art__bottom-mark">LIN4CRE</span>
          </div>
        </div>
      </div>

      <div className="hero-art__label hero-art__label--top">
        <span>FIELD NOTES / 01</span>
        <span>DESIGN · BUILD · REFINE</span>
      </div>
      <div className="hero-art__label hero-art__label--bottom">
        <span className="hero-art__live-dot" />
        <span>INDEPENDENT DIGITAL STUDIO</span>
        <span className="hero-art__label-coordinate">53° 47′ N</span>
      </div>
      <span className="hero-art__cross hero-art__cross--one" />
      <span className="hero-art__cross hero-art__cross--two" />
    </div>
  );
}
