/**
 * SITE PROJECTS — Curated catalogue of David Linacre's active projects.
 *
 * Exclusively features verified live apps, active tools, games, and repositories from
 * the LIN4CRE and DLinacre GitHub accounts.
 * Each project includes authentic, high-definition 16:9 artwork banners.
 */

export type ProjectKind =
  | 'App' // consumer web app / PWA
  | 'Tool' // utility / calculator / directory
  | 'AI' // AI-powered product
  | 'Game' // playable game
  | 'DevOps' // backend / infra / pipeline / library
  | 'Source' // open-source project / collection
  | 'Private'; // private repo (listed, not linked)

export interface SiteProject {
  name: string;
  kind: ProjectKind;
  blurb: string;
  url?: string; // primary destination (live app or repo)
  repo?: string; // repository URL when different from url
  tags: string[]; // search keywords
  emoji?: string;
  private?: boolean; // hidden from external links (private repo)
  badge?: 'NEW'; // highlights recently shipped work
  artwork?: string; // image path in /banners or /projects (used for thumbnails)
  highlights?: string[]; // 2–3 bullet takeaways for the detail view
  tech?: string[]; // language / stack
  year?: number; // launch / release year
  featured?: boolean; // shown in the hero spotlight on the start page
  pinned?: boolean; // prioritised in the library based on owner preference
  downloadUrl?: string; // known download/release destination; never guessed from a repo
}

export const SITE_PROJECTS: SiteProject[] = [
  // ──────────────────────────── Flagship Work ────────────────────────────
  {
    name: 'Fire TV Setup Kit',
    badge: 'NEW',
    pinned: true,
    featured: true,
    kind: 'Tool',
    emoji: '🔥',
    artwork: '/banners/firetv-kit.png',
    blurb:
      'Turnkey Fire TV & Android TV deployment toolkit: Stremio with ExoPlayer trailer bugfix, SmartTube 4K, TiviMate IPTV, native AdGuard DoT ad-blocking, and dynamic Wi-Fi network discovery.',
    url: 'https://lin4cre.github.io/firetv-kit/',
    repo: 'https://github.com/LIN4CRE/firetv-kit',
    tags: ['firetv', 'stremio', 'smarttube', 'tivimate', 'androidtv', 'adguard', 'streaming', 'adb'],
    highlights: [
      'ExoPlayer deadlock permanently fixed — trailers never required to unfreeze video.',
      'Native Private DNS over TLS (AdGuard DoT) blocks ads system-wide with zero VPN.',
      'Dynamic subnet scanner discovers and identifies any TV on your Wi-Fi in ~500ms.',
    ],
    tech: ['PowerShell', 'Bash', 'Android ADB', 'Fire OS', 'DNS over TLS'],
    year: 2026,
    downloadUrl: 'https://github.com/LIN4CRE/firetv-kit/archive/refs/heads/main.zip',
  },
  {
    name: 'Tabulous Games',
    badge: 'NEW',
    pinned: true,
    featured: true,
    kind: 'Game',
    emoji: '🎮',
    artwork: '/banners/tabulous-games.webp',
    blurb:
      'The Curated Browser Gaming Vault — 303 games, 23 Classic 3D PC ports, shooters, zombies co-op, and WebAssembly games running natively in your browser.',
    url: '/games',
    repo: 'https://github.com/LIN4CRE/tabulous-games',
    tags: ['games', 'vault', 'retro', 'wasm', 'fps', 'emulator', 'webassembly', 'offline'],
    highlights: [
      '303 curated titles: Half-Life, Quake III, Doom, Mario 64, Sonic, Zelda, and retro arcade gems.',
      'Instant-play WebAssembly engine with local game saves and fullscreen HUD.',
      '100% self-hosted on linacre.site with zero external dependencies.',
    ],
    tech: ['WebAssembly', 'HTML5', 'Emscripten', 'Canvas', 'Web Audio'],
    year: 2026,
  },
  {
    name: 'APKHub',
    badge: 'NEW',
    pinned: true,
    featured: true,
    kind: 'App',
    emoji: '📱',
    artwork: '/banners/apkhub.webp',
    blurb:
      'Curated Android APK intelligence portal, build artifact manager, and automated inspection toolkit for TV and mobile packages.',
    url: 'https://apkhub-alpha.vercel.app/',
    repo: 'https://github.com/DLinacre/APKHub',
    tags: ['android', 'apk', 'firetv', 'artifacts', 'inspector', 'tooling'],
    highlights: [
      'Automated manifest inspection and architecture validation (armeabi-v7a / arm64-v8a).',
      'Version indexing and change telemetry across sideload packages.',
      'Integrated security and permission boundary auditing.',
    ],
    tech: ['TypeScript', 'Next.js', 'Android SDK', 'Tailwind CSS'],
    year: 2026,
  },
  {
    name: 'PokéFlip AI',
    badge: 'NEW',
    pinned: true,
    featured: true,
    kind: 'AI',
    emoji: '🃏',
    artwork: '/banners/pokeflip-ai.webp',
    blurb:
      'Intelligent collectible card pricing index, condition grading analyzer, and predictive market intelligence engine powered by Google Gemini.',
    url: 'https://pok-flip-ai.vercel.app/',
    repo: 'https://github.com/DLinacre/Pok-Flip-AI',
    tags: ['ai', 'gemini', 'pokemon', 'pricing', 'analytics', 'vision'],
    highlights: [
      'Computer vision centering, edge-wear, and surface flaw evaluation for grading prediction.',
      'Historical auction price aggregation and volatility indexing.',
      'Multi-modal prompt workflows tuned specifically for trading card collectibles.',
    ],
    tech: ['Google Gemini API', 'Python', 'FastAPI', 'React', 'OpenCV'],
    year: 2026,
  },
  {
    name: 'Retro Arcade Vault',
    pinned: true,
    featured: false,
    kind: 'Game',
    emoji: '🕹️',
    artwork: '/banners/retro-arcade-vault.jpg',
    blurb:
      'Zero-install browser retro arcade preloaded with 63+ legendary PS1, GBA, NDS, SNES, and Genesis titles, responsive gamepad mapping, and authentic CRT shaders.',
    url: 'https://lin4cre.github.io/retro-arcade-vault/',
    repo: 'https://github.com/LIN4CRE/retro-arcade-vault',
    tags: ['retro', 'emulator', 'ps1', 'gba', 'arcade', 'webassembly'],
    highlights: [
      'Instant-play WebAssembly cores: PCSX ReARMed, mGBA, DeSmuME, Snes9x, and Genesis Plus GX.',
      'Real-time retro scanline and CRT phosphor bloom shaders.',
      'Automatic state saving and Bluetooth gamepad vibration integration.',
    ],
    tech: ['WebAssembly', 'HTML5 Canvas', 'Web Audio API', 'Gamepad API'],
    year: 2026,
  },
  {
    name: 'Dual Audio Synchronizer',
    pinned: true,
    featured: false,
    kind: 'Tool',
    emoji: '🔊',
    artwork: '/banners/dual-audio-synchronizer.png',
    blurb:
      'Studio-grade WASAPI multi-speaker synchronizer for Windows with automatic ±1 ms clock-drift phase lock and 2.8 kHz Hearing Clarity DSP.',
    url: 'https://lin4cre.github.io/dual-audio-synchronizer/',
    repo: 'https://github.com/LIN4CRE/dual-audio-synchronizer',
    tags: ['audio', 'wasapi', 'synchronizer', 'dsp', 'windows', 'csharp', 'clarity'],
    highlights: [
      'Independent sub-millisecond circular buffer drift correction prevents acoustic echo.',
      'Hearing Clarity DSP emphasizes dialogue frequencies at 2.8 kHz without volume spikes.',
      'Lightweight Windows tray application with zero CPU throttling.',
    ],
    tech: ['C#', '.NET 9', 'WASAPI', 'DirectSound', 'WPF'],
    year: 2026,
  },
  {
    name: 'Karaoke Pulse',
    pinned: false,
    featured: false,
    kind: 'App',
    emoji: '🎤',
    artwork: '/banners/karaoke-pulse.png',
    blurb:
      'Full-stack YouTube Karaoke Studio featuring synced synchronized lyrics, AI dual-stem vocal removal, live microphone reverb, and pitch detection.',
    url: 'https://lin4cre.github.io/karaoke-pulse/',
    repo: 'https://github.com/LIN4CRE/karaoke-pulse',
    tags: ['karaoke', 'music', 'vocal-remover', 'youtube', 'dsp', 'audio'],
    highlights: [
      'Real-time stem separation isolates backing tracks and removes lead vocals cleanly.',
      'Live microphone monitoring with studio hall reverb and pitch accuracy scoring.',
      'Responsive synchronized lyrics display with auto-scroll and romanized lyrics.',
    ],
    tech: ['TypeScript', 'Web Audio API', 'React', 'FastAPI', 'Spleeter'],
    year: 2026,
  },
  {
    name: 'KushCloud',
    pinned: false,
    featured: false,
    kind: 'Game',
    emoji: '🌿',
    artwork: '/banners/kushcloud.webp',
    blurb:
      'A chill one-tap arcade flyer with responsive physics calibration, procedural synthesized chillwave audio, and unlockable cosmetics.',
    url: 'https://dlinacre.github.io/KushCloud/',
    repo: 'https://github.com/DLinacre/KushCloud',
    tags: ['game', 'arcade', 'chill', 'procedural', 'canvas', 'react'],
    highlights: [
      'Smooth 120 FPS high-refresh physics engine with responsive tap mechanics.',
      'Procedural Web Audio chiptune synthesizer with dynamic pitch transitions.',
      'Local-first high score persistence with zero external tracking.',
    ],
    tech: ['React', 'TypeScript', 'Vite', 'HTML5 Canvas', 'Web Audio API'],
    year: 2026,
  },
  {
    name: 'Afterglow',
    pinned: false,
    featured: false,
    kind: 'Game',
    emoji: '✨',
    artwork: '/banners/afterglow.webp',
    blurb:
      'Paint with long-exposure light — a novel, endless HTML5 light-painting game. Steer glowing lights to burn shimmering trails onto a night sky.',
    url: 'https://dlinacre.github.io/afterglow/',
    repo: 'https://github.com/DLinacre/afterglow',
    tags: ['game', 'light-painting', 'canvas', 'art', 'ambient', 'creative'],
    highlights: [
      'Real-time particle phosphor persistence mimicking long-exposure camera sensors.',
      'Responsive multitouch and stylus pressure integration.',
      'Harmonic ambient audio synthesis that modulates with light trail speed.',
    ],
    tech: ['HTML5 Canvas', 'JavaScript', 'Web Audio', 'CSS3'],
    year: 2026,
  },
  {
    name: 'Easy Audiobook Player',
    pinned: false,
    featured: false,
    kind: 'App',
    emoji: '🎧',
    artwork: '/banners/easy-audiobook-player.svg',
    blurb:
      'A zero-dependency standalone HTML5 audiobook player for local files and legal web audio with chapter bookmarks, playback speed memory, and sleep timers.',
    url: 'https://dlinacre.github.io/easy-audiobook-player/',
    repo: 'https://github.com/DLinacre/easy-audiobook-player',
    tags: ['audiobook', 'player', 'offline', 'single-file', 'html5'],
    highlights: [
      'Single self-contained HTML file running 100% client-side with zero external requests.',
      'IndexedDB chapter resume state, playback rate memory (0.75x–2.5x), and sleep timer.',
      'Direct drag-and-drop support for M4B, MP3, and AAC audiobooks.',
    ],
    tech: ['HTML5', 'Vanilla JavaScript', 'IndexedDB', 'Web Audio API'],
    year: 2026,
  },
  {
    name: 'Linacre Uninstaller',
    pinned: false,
    featured: false,
    kind: 'Tool',
    emoji: '🧹',
    artwork: '/banners/linacre-uninstaller.webp',
    blurb:
      'Android uninstaller and debloat review tool with a clean Material dark UI, safety tiers, and guided removal for OEM background services.',
    url: 'https://dlinacre.github.io/LinacreUninstaller/',
    repo: 'https://github.com/DLinacre/LinacreUninstaller',
    tags: ['android', 'debloat', 'uninstaller', 'security', 'adb', 'cleaner'],
    highlights: [
      'Automated safety tier classification (Safe to remove, Warning, Critical system).',
      'One-click disable/uninstall commands executable over wireless ADB or on-device.',
      'Backup and restore state tracking to revert uninstalled packages instantly.',
    ],
    tech: ['Android SDK', 'Kotlin', 'Material Design 3', 'Shell Scripting'],
    year: 2026,
  },
  {
    name: 'SpeedRead',
    pinned: false,
    featured: false,
    kind: 'Tool',
    emoji: '⚡',
    artwork: '/banners/speedread.jpg',
    blurb:
      'Rapid Serial Visual Presentation (RSVP) speed-reading engine that flashes words at optimal optical fixation points up to 1,000 WPM.',
    url: 'https://lin4cre.github.io/SpeedRead/',
    repo: 'https://github.com/LIN4CRE/SpeedRead',
    tags: ['speedread', 'rsvp', 'productivity', 'reading', 'tool'],
    highlights: [
      'Optimal Recognition Point (ORP) colored letter alignment minimizes eye saccades.',
      'Adaptive punctuation cadence pauses naturally on commas, periods, and paragraphs.',
      'Supports pasted text, EPUB files, and clipboard reading.',
    ],
    tech: ['TypeScript', 'React', 'Tailwind CSS', 'Vite'],
    year: 2026,
  },
  {
    name: 'Whole-Home AdBlocker',
    pinned: false,
    featured: false,
    kind: 'DevOps',
    emoji: '🛡️',
    artwork: '/banners/whole-home-adblocker.svg',
    blurb:
      'One-click whole-home network ad blocker for Windows: AdGuard Home in Docker with a friendly setup wizard, live telemetry, and preloaded blocklists.',
    url: 'https://dlinacre.github.io/whole-home-adblocker/',
    repo: 'https://github.com/DLinacre/whole-home-adblocker',
    tags: ['adblock', 'adguard', 'docker', 'dns', 'windows', 'networking'],
    highlights: [
      'Single-click setup orchestrates Docker Desktop, container provisioning, and DNS bindings.',
      'Preloaded with optimized blocklists stopping telemetry, malware, and video tracking.',
      'Encrypted DNS upstream configuration supporting DoH, DoT, and DNSCrypt.',
    ],
    tech: ['Docker', 'PowerShell', 'AdGuard Home', 'DNS over TLS'],
    year: 2026,
  },
  {
    name: 'Linacre System Monitor Wallpaper',
    pinned: false,
    featured: false,
    kind: 'Tool',
    emoji: '🖥️',
    artwork: '/banners/linacre-wallpaper.svg',
    blurb:
      'Real-time hardware telemetry live wallpaper for Windows (Lively Wallpaper native) displaying CPU, GPU, RAM, network graphs, and an integrated ⌘K command palette.',
    url: 'https://dlinacre.github.io/linacre-wallpaper/',
    repo: 'https://github.com/DLinacre/linacre-wallpaper',
    tags: ['wallpaper', 'hardware', 'telemetry', 'system-monitor', 'lively', 'hud'],
    highlights: [
      'Hardware-accelerated Canvas graphs render at 60 FPS with sub-1% CPU consumption.',
      'Dual-monitor adaptive grid layout with customizable sensor refresh intervals.',
      'Integrated quick-action command palette for system utilities and shortcuts.',
    ],
    tech: ['HTML5 Canvas', 'Lively Wallpaper API', 'WebSockets', 'CSS3'],
    year: 2026,
  },
  {
    name: 'CubeLab',
    pinned: false,
    featured: false,
    kind: 'App',
    emoji: '🎲',
    artwork: '/banners/cubelab.webp',
    blurb:
      'Free offline-first 3D Rubik\'s Cube solver, trainer, timer, and PWA featuring CFOP algorithms, scramble generation, and real-time step visualization.',
    url: 'https://dlinacre.github.io/cubelab/',
    repo: 'https://github.com/DLinacre/cubelab',
    tags: ['rubiks-cube', 'solver', 'threejs', '3d', 'pwa', 'algorithms'],
    highlights: [
      'Interactive 3D WebGL cube with smooth touch gestures and keyboard shortcuts.',
      'Algorithmic two-phase Kociemba solver finding optimal solutions in under 20 moves.',
      'WCA-compliant inspection timer with millisecond accuracy and scramble histories.',
    ],
    tech: ['Three.js', 'WebGL', 'TypeScript', 'PWA'],
    year: 2026,
  },
  {
    name: '1Files Repository',
    pinned: false,
    featured: false,
    kind: 'Source',
    emoji: '📄',
    artwork: '/banners/1files.svg',
    blurb:
      'Curated collection of complete, useful web apps and utilities, each shipped as a SINGLE self-contained HTML file with zero build steps and zero runtime dependencies.',
    url: 'https://dlinacre.github.io/1files/',
    repo: 'https://github.com/DLinacre/1files',
    tags: ['single-file', 'html', 'zero-dependency', 'utilities', 'open-source'],
    highlights: [
      'Every tool runs completely offline directly by double-clicking the .html file.',
      'Inline CSS, JavaScript, and SVGs ensure 100-year digital preservation.',
      'Includes text tools, calculators, network diagnostics, and visual utilities.',
    ],
    tech: ['HTML5', 'Vanilla JavaScript', 'CSS3', 'Embedded SVG'],
    year: 2026,
  },
  {
    name: 'Bonny Bats',
    pinned: false,
    featured: false,
    kind: 'Tool',
    emoji: '🦇',
    artwork: '/banners/bonny-bats.webp',
    blurb:
      'A friendly client-facing guide to bats in buildings: species identification, UK wildlife laws, roost safety, and humane exclusion methodologies.',
    url: 'https://dlinacre.github.io/bonny-bats/',
    repo: 'https://github.com/DLinacre/bonny-bats',
    tags: ['bats', 'wildlife', 'architecture', 'conservation', 'uk-law'],
    highlights: [
      'Visual roost identification matrix for UK species (Pipistrelles, Brown Long-eared).',
      'Plain-English breakdown of the Wildlife and Countryside Act 1981 compliance.',
      'Print-friendly roost survey checklists and contractor guidelines.',
    ],
    tech: ['HTML5', 'Tailwind CSS', 'Responsive Design'],
    year: 2026,
  },
  {
    name: 'Bonny Bakes',
    pinned: false,
    featured: false,
    kind: 'App',
    emoji: '🧁',
    artwork: '/banners/bonny-bakes.jpg',
    blurb:
      'Warm, friendly home-baking recipe companion with an ingredient quantity scaler, recipe favorites, dynamic shopping lists, and print-friendly cards.',
    url: 'https://dlinacre.github.io/bonny-bakes/',
    repo: 'https://github.com/DLinacre/bonny-bakes',
    tags: ['baking', 'recipes', 'calculator', 'lifestyle', 'pwa'],
    highlights: [
      'Dynamic serving scaler recalculates flour, sugar, and yeast ratios accurately.',
      'Offline-capable PWA with local recipe bookmarks and printable kitchen cards.',
      'Automatic ingredient grouping into organized shopping checklist categories.',
    ],
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'PWA'],
    year: 2026,
  },
  {
    name: 'Linacre OSINT HUD',
    pinned: false,
    featured: false,
    kind: 'Tool',
    emoji: '🛰️',
    artwork: '/banners/linacre-osint-hud.svg',
    blurb:
      'Dark glass OSINT heads-up display — 1,310 curated open-source intelligence tools from the OSINT4ALL collection in one self-contained, lightning-fast HTML console.',
    url: 'https://dlinacre.github.io/linacre-osint-hud/',
    repo: 'https://github.com/DLinacre/linacre-osint-hud',
    tags: ['osint', 'cybersecurity', 'intelligence', 'recon', 'console', 'hud'],
    highlights: [
      '1,310 verified tools organized across 36 intelligence disciplines (geoint, domain, social).',
      'Instant fuzzy search with keyboard navigation and bookmarking.',
      'Zero external tracking, self-contained single-page console architecture.',
    ],
    tech: ['HTML5', 'Vanilla JavaScript', 'CSS Grid', 'JSON Search'],
    year: 2026,
  },
  {
    name: 'Linacre Global Monitor',
    pinned: false,
    featured: false,
    kind: 'App',
    emoji: '📡',
    artwork: '/banners/linacre-global-monitor.svg',
    blurb:
      'Real-time geopolitical and environmental situational awareness dashboard powered by live telemetry from NASA, USGS, and Open-Meteo.',
    url: 'https://dlinacre.github.io/linacre-global-monitor/',
    repo: 'https://github.com/DLinacre/linacre-global-monitor',
    tags: ['geopolitical', 'nasa', 'usgs', 'earthquake', 'weather', 'dashboard'],
    highlights: [
      'Live seismic event streaming directly from the USGS earthquake API.',
      'NASA active wildfire hotspot and atmospheric anomaly feeds.',
      'Interactive dark-mode GIS map with real-time weather alerts and telemetry.',
    ],
    tech: ['JavaScript', 'Leaflet GIS', 'NASA API', 'USGS API', 'CSS3'],
    year: 2026,
  },
];
