import { useState, useRef, MouseEvent } from 'react';

interface Emblem3DProps {
  mode?: 'hero' | 'mini';
  className?: string;
  onNavigateHome?: () => void;
}

/**
 * Emblem3D — an interactive 3D gyroscopic brand core.
 * Features counter-rotating celestial rings, isometric faceted crystal prism,
 * mouse-tracking 3D perspective tilt, and interactive hyperdrive pulse.
 */
export default function Emblem3D({
  mode = 'hero',
  className = '',
  onNavigateHome,
}: Emblem3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isOverclocked, setIsOverclocked] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  // Mouse tilt tracking for 3D perspective in hero mode
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (mode === 'mini') return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Map to tilt angles (-20 to +20 degrees)
    const tiltX = -(y / (rect.height / 2)) * 18;
    const tiltY = (x / (rect.width / 2)) * 18;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Trigger hyperdrive pulse on click
  const handlePulse = () => {
    setIsOverclocked(true);
    setSpeedMultiplier(4);
    setTimeout(() => {
      setSpeedMultiplier(1);
      setIsOverclocked(false);
    }, 2400);
  };

  // Topbar mini mode: sleek 34px rotating cyber insignia
  if (mode === 'mini') {
    return (
      <button
        type="button"
        onClick={onNavigateHome}
        className={`group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0e1016] transition-all duration-300 hover:border-[#8fd6ff]/50 hover:shadow-[0_0_16px_rgba(143,214,255,0.3)] cursor-pointer ${className}`}
        title="David Linacre // Home"
        aria-label="David Linacre — Home"
      >
        <svg
          viewBox="0 0 40 40"
          className="h-7 w-7 transition-transform duration-500 group-hover:scale-110"
        >
          <defs>
            <linearGradient id="mini-core-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c4ebff" />
              <stop offset="50%" stopColor="#8fd6ff" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Outer ring (clockwise) */}
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="url(#mini-core-grad)"
            strokeWidth="1.2"
            strokeDasharray="18 10 4 10"
            className="origin-center"
            style={{
              animation: 'spin 14s linear infinite',
            }}
          />

          {/* Middle counter-rotating ring */}
          <circle
            cx="20"
            cy="20"
            r="12"
            fill="none"
            stroke="rgba(143, 214, 255, 0.5)"
            strokeWidth="0.9"
            strokeDasharray="8 6 12 4"
            className="origin-center"
            style={{
              animation: 'spin 9s linear infinite reverse',
            }}
          />

          {/* Core monogram */}
          <polygon points="20,10 27,15 27,25 20,30 13,25 13,15" fill="#07080b" stroke="#8fd6ff" strokeWidth="1" />
          <text
            x="20"
            y="23"
            textAnchor="middle"
            fill="#8fd6ff"
            fontSize="8.5"
            fontFamily="monospace"
            fontWeight="bold"
            className="select-none"
          >
            DL
          </text>
        </svg>
        <span className="absolute -inset-1 rounded-xl bg-[#8fd6ff]/15 blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </button>
    );
  }

  // Hero Mode: Full interactive 3D centerpiece
  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handlePulse}
      className={`relative mx-auto flex h-[280px] w-[280px] sm:h-[320px] sm:w-[320px] items-center justify-center select-none cursor-pointer ${className}`}
      style={{ perspective: '1000px' }}
      title="Click to engage Hyperdrive Pulse"
    >
      {/* Dynamic 3D Transform Container */}
      <div
        className="relative flex h-full w-full items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Ambient Radial Backlight Glow */}
        <div
          className={`absolute inset-4 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
            isOverclocked
              ? 'bg-[#8fd6ff]/40 scale-125'
              : 'bg-[#8fd6ff]/15 group-hover:bg-[#8fd6ff]/25'
          }`}
        />

        {/* Shockwave ring on pulse */}
        {isOverclocked && (
          <div className="absolute inset-0 rounded-full border-2 border-[#8fd6ff] animate-ping pointer-events-none" />
        )}

        {/* Multi-Ring Gyroscope SVG Canvas */}
        <svg
          viewBox="0 0 200 200"
          className="relative h-full w-full drop-shadow-[0_0_24px_rgba(143,214,255,0.25)]"
        >
          <defs>
            <linearGradient id="emblem-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#8fd6ff" />
              <stop offset="70%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            <linearGradient id="emblem-amber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>

            <linearGradient id="emblem-facet-left" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#141c2b" />
              <stop offset="100%" stopColor="#080e18" />
            </linearGradient>

            <linearGradient id="emblem-facet-right" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="emblem-facet-top" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8fd6ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
            </linearGradient>

            <filter id="emblem-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Layer 1: Outer Celestial Coordinate Ring (Clockwise) */}
          <g
            className="origin-center"
            style={{
              animation: `spin ${26 / speedMultiplier}s linear infinite`,
            }}
          >
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
            />
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="url(#emblem-cyan-grad)"
              strokeWidth="1.8"
              strokeDasharray="28 42 12 50 4 20"
              filter="url(#emblem-glow)"
            />
            {/* Coordinate Tick Pips */}
            <circle cx="100" cy="8" r="3" fill="#8fd6ff" />
            <circle cx="192" cy="100" r="3" fill="#8fd6ff" />
            <circle cx="100" cy="192" r="3" fill="#8fd6ff" />
            <circle cx="8" cy="100" r="3" fill="#8fd6ff" />
          </g>

          {/* Layer 2: Intermediate Gimbal Ring (Counter-Clockwise) */}
          <g
            className="origin-center"
            style={{
              animation: `spin ${18 / speedMultiplier}s linear infinite reverse`,
            }}
          >
            <ellipse
              cx="100"
              cy="100"
              rx="76"
              ry="52"
              fill="none"
              stroke="rgba(143, 214, 255, 0.45)"
              strokeWidth="1.2"
              strokeDasharray="16 12 4 12"
              transform="rotate(45 100 100)"
            />
            <ellipse
              cx="100"
              cy="100"
              rx="76"
              ry="52"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="6 24 18 12"
              transform="rotate(-45 100 100)"
            />
          </g>

          {/* Layer 3: Inner Orbital Core Ring (Fast Clockwise) */}
          <g
            className="origin-center"
            style={{
              animation: `spin ${11 / speedMultiplier}s linear infinite`,
            }}
          >
            <circle
              cx="100"
              cy="100"
              r="58"
              fill="none"
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth="1"
            />
            <circle
              cx="100"
              cy="100"
              r="58"
              fill="none"
              stroke="url(#emblem-cyan-grad)"
              strokeWidth="2.2"
              strokeDasharray="36 18 12 18"
              filter="url(#emblem-glow)"
            />
            {/* Energy nodes */}
            <circle cx="100" cy="42" r="2.5" fill="#ffffff" />
            <circle cx="158" cy="100" r="2.5" fill="#ffffff" />
            <circle cx="100" cy="158" r="2.5" fill="#ffffff" />
            <circle cx="42" cy="100" r="2.5" fill="#ffffff" />
          </g>

          {/* Layer 4: Isometric 3D Faceted Diamond Prism */}
          <g className="origin-center">
            {/* Hexagonal Prism Base */}
            {/* Top-facing lit facet */}
            <polygon
              points="100,64 128,78 100,92 72,78"
              fill="url(#emblem-facet-top)"
              stroke="#8fd6ff"
              strokeWidth="1"
            />
            {/* Left dark metallic facet */}
            <polygon
              points="72,78 100,92 100,128 72,114"
              fill="url(#emblem-facet-left)"
              stroke="rgba(143, 214, 255, 0.3)"
              strokeWidth="1"
            />
            {/* Right reflective facet */}
            <polygon
              points="128,78 100,92 100,128 128,114"
              fill="url(#emblem-facet-right)"
              stroke="rgba(143, 214, 255, 0.5)"
              strokeWidth="1"
            />

            {/* Bottom inverted prism vertex */}
            <polygon
              points="72,114 100,128 100,146"
              fill="#06090e"
              stroke="rgba(143, 214, 255, 0.2)"
              strokeWidth="0.8"
            />
            <polygon
              points="128,114 100,128 100,146"
              fill="#0b111a"
              stroke="rgba(143, 214, 255, 0.3)"
              strokeWidth="0.8"
            />

            {/* Central glowing LIN4CRE Monogram */}
            <g stroke="#8fd6ff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" filter="url(#emblem-glow)">
              <path d="M94 88 L94 106 L106 106" />
            </g>
          </g>
        </svg>

        {/* Telemetry Readouts around the 3D Gyro */}
        <div className="absolute -bottom-2 flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#07080b]/90 px-3 py-1 font-mono text-[10px] text-[#8fd6ff] shadow-lg backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8fd6ff] animate-pulse" />
          <span>{isOverclocked ? 'HYPERDRIVE // ACTIVE' : 'LIN4CRE // 3D CORE'}</span>
          <span className="text-white/30">|</span>
          <span className="text-[#9aa3b2]">CLICK TO BOOST</span>
        </div>
      </div>
    </div>
  );
}
