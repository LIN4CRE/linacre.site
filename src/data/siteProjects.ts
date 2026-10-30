/**
 * SITE PROJECTS — Curated catalogue of David Linacre's active projects.
 *
 * Exclusively features verified live apps, active tools, games, and repositories from
 * the LIN4CRE GitHub account and live Vercel deployments (APKHub, PokéFlip AI).
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
  // ───────────────────────────── Flagship Work ─────────────────────────────
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
    artwork: '/banners/apkhub.jpg',
    blurb:
      'Curated Android APK intelligence, build artifact manager, and automated inspection toolkit with direct package downloads.',
    url: 'https://apkhub-alpha.vercel.app',
    repo: 'https://github.com/LIN4CRE/apkhub',
    tags: ['android', 'apk', 'decompile', 'security', 'analysis', 'mobile', 'toolkit', 'verifier'],
    highlights: [
      'Automated manifest and DEX permission surface inspection.',
      'Cryptographic hash verification against known malware feeds.',
      'Verified zero-tracker APK artifact repository.',
    ],
    tech: ['TypeScript', 'React', 'Next.js', 'Vercel Edge', 'Web Crypto API'],
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
      'Intelligent collectible card pricing index, condition analyzer, and real-time market prediction engine powered by Gemini AI.',
    url: 'https://pok-flip-ai.vercel.app',
    repo: 'https://github.com/LIN4CRE/pok-flip-ai',
    tags: ['pokemon', 'cards', 'tcg', 'gemini', 'ai', 'pricing', 'ebay', 'computer-vision', 'market'],
    highlights: [
      'Multi-modal card condition estimation and PSA grading predictor.',
      'Live arbitrage signals comparing eBay Sold comps with TCGPlayer market values.',
      'Instant barcode & art scanning via device camera.',
    ],
    tech: ['Gemini 2.5 Flash', 'Computer Vision', 'TypeScript', 'React', 'Vercel Edge'],
    year: 2026,
  },
  {
    name: 'Retro Arcade Vault',
    pinned: true,
    featured: true,
    kind: 'Game',
    emoji: '🕹️',
    artwork: '/banners/retro-arcade-vault.jpg',
    blurb:
      'Sleek retro gaming vault & web player preloaded with 63+ classic PS1, GBA, NDS, SNES, and Sega Genesis titles with box artwork and CRT shaders.',
    url: 'https://lin4cre.github.io/retro-arcade-vault/',
    repo: 'https://github.com/LIN4CRE/retro-arcade-vault',
    tags: ['arcade', 'retro', 'emulator', 'vault', 'ps1', 'gba', 'snes', 'genesis', 'webassembly'],
    highlights: [
      'Preloaded multi-system WebAssembly emulation engine.',
      'Box artwork metadata and instant loading with zero setup.',
      'Custom CRT scanline shaders, savestates, and gamepad mapping.',
    ],
    tech: ['HTML5', 'JavaScript', 'WebAssembly', 'RetroArch', 'CSS3'],
    year: 2026,
  },
  {
    name: 'DBSTEAM',
    pinned: true,
    featured: true,
    kind: 'App',
    emoji: '♨️',
    artwork: '/banners/dbsteam.png',
    blurb:
      'Next-Gen Steam & Gaming Account Operations Hub with SteamDB Paid Releases, Cloud Save Vault, Lua Automation Scripting, and Gemini AI Intelligence.',
    url: 'https://github.com/LIN4CRE/DBSTEAM',
    repo: 'https://github.com/LIN4CRE/DBSTEAM',
    tags: ['steam', 'gaming', 'steamdb', 'vault', 'lua', 'automation', 'cloud-save', 'desktop'],
    highlights: [
      'Cross-platform desktop launcher written in C# and TypeScript with Capacitor Android port.',
      'SteamDB pricing arbitrage analyzer and paid release tracker.',
      'Encrypted cloud game saves sync with automated delta compression.',
    ],
    tech: ['C#', 'TypeScript', 'Capacitor', 'Steam API', 'Gemini AI', 'Lua'],
    year: 2026,
  },
  {
    name: 'Dual Audio Synchronizer',
    pinned: true,
    featured: true,
    kind: 'Tool',
    emoji: '🔊',
    artwork: '/banners/dual-audio-synchronizer.png',
    blurb:
      'Studio-grade WASAPI multi-speaker audio synchronizer for Windows with automatic ±1 ms clock-drift phase lock and 2.8 kHz Hearing Clarity DSP.',
    url: 'https://github.com/LIN4CRE/dual-audio-synchronizer',
    repo: 'https://github.com/LIN4CRE/dual-audio-synchronizer',
    tags: ['audio', 'wasapi', 'dsp', 'windows', 'csharp', 'synchronizer', 'sound', 'multi-speaker'],
    highlights: [
      'Real-time dual endpoint playback with sub-millisecond audio phase matching.',
      'Dedicated 2.8 kHz speech intelligibility DSP filter curve.',
      'Zero background CPU overhead with hardware-accelerated Windows Core Audio.',
    ],
    tech: ['C#', '.NET 9', 'WASAPI', 'DirectSound', 'WPF', 'Windows Core Audio'],
    year: 2026,
  },
  {
    name: 'Karaoke Pulse',
    pinned: true,
    featured: true,
    kind: 'App',
    emoji: '🎤',
    artwork: '/banners/karaoke-pulse.png',
    blurb:
      'Full-stack YouTube Karaoke Studio with synced scrolling lyrics, dual-stem AI vocal removal, live mic reverb & pitch detection.',
    url: 'https://github.com/LIN4CRE/karaoke-pulse',
    repo: 'https://github.com/LIN4CRE/karaoke-pulse',
    tags: ['karaoke', 'music', 'youtube', 'vocal-remover', 'audio', 'pitch', 'lyrics', 'dsp'],
    highlights: [
      'Real-time browser-based dual-stem vocal separation using WebAssembly DSP.',
      'Synchronized scrolling lyric teleprompter with syllable-level pitch tracking.',
      'Direct YouTube audio streaming with mic mix and reverb FX.',
    ],
    tech: ['TypeScript', 'Web Audio API', 'React', 'Tailwind CSS', 'Vite'],
    year: 2026,
  },
  {
    name: 'Skipr',
    pinned: true,
    featured: true,
    kind: 'Tool',
    emoji: '⚡',
    artwork: '/banners/skipr.jpg',
    blurb:
      'Auto-skip intros, outros & recaps seamlessly for Stremio on Android TV, Fire TV, and Desktop.',
    url: 'https://github.com/LIN4CRE/skipr',
    repo: 'https://github.com/LIN4CRE/skipr',
    tags: ['stremio', 'addon', 'android-tv', 'fire-tv', 'video', 'automation', 'skip-intro'],
    highlights: [
      'Cloud video fingerprinting and intro timing timestamp database.',
      'Native Android TV and Fire TV Stremio client integration.',
      'Zero latency automated transition skip with custom notification toasts.',
    ],
    tech: ['Node.js', 'Express', 'Stremio Addon SDK', 'Docker'],
    year: 2026,
  },

  // ───────────────────────────── Core Systems & Apps ─────────────────────────────
  {
    name: 'SpeedRead',
    kind: 'App',
    emoji: '⚡',
    artwork: '/banners/speedread.jpg',
    blurb:
      'High-velocity RSVP speed reading app — train comprehension from 300 to 1,000+ words per minute with cadence pacing.',
    url: 'https://github.com/LIN4CRE/SpeedRead',
    repo: 'https://github.com/LIN4CRE/SpeedRead',
    tags: ['speed-reading', 'rsvp', 'education', 'focus', 'epub', 'productivity', 'reading'],
    highlights: [
      'Optimal Recognition Point (ORP) focal highlighting for eye strain reduction.',
      'EPUB, PDF, and Markdown parsing with saved reading positions.',
      'Dynamic speed ramp from 250 WPM up to 1,200 WPM.',
    ],
    tech: ['TypeScript', 'React', 'Vite', 'Tailwind CSS'],
    year: 2026,
  },
  {
    name: 'Barnsley Web Builder',
    kind: 'App',
    emoji: '🏗️',
    artwork: '/banners/barnsley-web-builder.png',
    blurb:
      'Turnkey website builder for local shops, trades, and independent services in Barnsley and South Yorkshire.',
    url: 'https://github.com/LIN4CRE/Barnsley-Web-Builder',
    repo: 'https://github.com/LIN4CRE/Barnsley-Web-Builder',
    tags: ['builder', 'barnsley', 'local', 'business', 'website', 'cms', 'generator'],
    highlights: [
      'Single-click generation for builders, cafes, plumbers, and independent shops.',
      'Built-in PayPal tipping and invoicing integrations.',
      'Instant mobile-responsive previews with zero build dependencies.',
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    year: 2026,
  },
  {
    name: 'Beginner 2x4 Workbench Guide',
    kind: 'Tool',
    emoji: '🪵',
    artwork: '/banners/beginner-bench.jpg',
    blurb:
      'Responsive beginner woodworking bench build guide with cut diagrams, hardware list, and an interactive 3D model.',
    url: 'https://github.com/LIN4CRE/beginner-2x4-bench-plan',
    repo: 'https://github.com/LIN4CRE/beginner-2x4-bench-plan',
    tags: ['woodworking', 'diy', 'bench', '3d', 'guide', 'maker', 'workshop', 'hardware'],
    highlights: [
      'Interactive 3D rotatable CAD model built with WebGL.',
      'Complete 2x4 lumber cut list with zero-waste optimization.',
      'Printable step-by-step assembly diagrams for shop use.',
    ],
    tech: ['WebGL', 'Three.js', 'TypeScript', 'HTML5 Canvas'],
    year: 2026,
  },
  {
    name: 'DigiPoke',
    kind: 'Game',
    emoji: '🐾',
    artwork: '/banners/digipoke.jpg',
    blurb:
      'Local-first creature-collecting battler PWA with turn-based strategy and optional end-to-end encrypted sync.',
    url: 'https://github.com/LIN4CRE/digipoke',
    repo: 'https://github.com/LIN4CRE/digipoke',
    tags: ['pokemon', 'game', 'pwa', 'offline', 'pixel-art', 'rpg', 'dexie', 'battle'],
    highlights: [
      'Completely offline gameplay backed by Dexie / IndexedDB.',
      'Over 150 handcrafted creature sprites and move balance trees.',
      'PWA installable on iOS, Android, and desktop browsers.',
    ],
    tech: ['TypeScript', 'Vue 3', 'Dexie.js', 'Canvas 2D', 'PWA'],
    year: 2026,
  },
  {
    name: 'Frostpine',
    kind: 'Game',
    emoji: '❄️',
    artwork: '/banners/frostpine.jpg',
    blurb:
      'Winter simulation game — operate a heavy-duty snow plough clearing drift mountain passes under the northern lights.',
    url: 'https://github.com/LIN4CRE/Frostpine',
    repo: 'https://github.com/LIN4CRE/Frostpine',
    tags: ['game', 'simulation', 'winter', 'snow', 'vite', 'pwa', 'driving'],
    highlights: [
      'Dynamic snow displacement and vehicle traction physics.',
      'Atmospheric low-poly day-night cycle with aurora borealis shader.',
      'Installable PWA with offline game state persistence.',
    ],
    tech: ['JavaScript', 'Canvas 2D', 'Vite', 'PWA'],
    year: 2026,
  },
  {
    name: 'Gyroll',
    kind: 'Game',
    emoji: '🔮',
    artwork: '/banners/gyroll.jpg',
    blurb:
      '3D physics marble puzzle game — guide a high-momentum gyroscope sphere through gravity tracks and obstacle courses.',
    url: 'https://github.com/LIN4CRE/Gyroll',
    repo: 'https://github.com/LIN4CRE/Gyroll',
    tags: ['game', 'physics', 'marble', '3d', 'gyro', 'puzzle', 'vite'],
    highlights: [
      'Rigid body sphere physics with momentum conservation.',
      'Procedural floating sky tracks with speed pads and loop-de-loops.',
      'Ultra-responsive mobile tilt sensor and keyboard controls.',
    ],
    tech: ['TypeScript', 'WebGL', 'Three.js', 'Vite'],
    year: 2026,
  },
  {
    name: 'Lad Jokes',
    kind: 'App',
    emoji: '🍺',
    artwork: '/banners/lad-jokes.png',
    blurb:
      'Adults-only humor commons prototype: raunchy stories, rigged-nothing polls, anonymous outrage ratings, and encrypted chat.',
    url: 'https://github.com/LIN4CRE/lad-jokes',
    repo: 'https://github.com/LIN4CRE/lad-jokes',
    tags: ['humor', 'jokes', 'community', 'anonymity', 'adult', 'polls', 'chat'],
    highlights: [
      'Zero build step, zero runtime dependencies, and 304 automated assertions.',
      'Local-first privacy architecture with zero telemetry.',
      'Community voting, joke tier lists, and anonymous joke submission queue.',
    ],
    tech: ['JavaScript', 'CSS3', 'HTML5', 'Local Storage'],
    year: 2026,
  },
  {
    name: 'Linacre Lyric Cinema',
    kind: 'App',
    emoji: '🎬',
    artwork: '/banners/linacre-cinema.jpg',
    blurb:
      'High-definition master lyric videos cinema player featuring official Linacre audio productions and visuals.',
    url: 'https://github.com/LIN4CRE/linacre-music-videos',
    repo: 'https://github.com/LIN4CRE/linacre-music-videos',
    tags: ['music', 'video', 'cinema', 'player', 'lyrics', 'audio', 'production'],
    highlights: [
      'High-bitrate cinema playback engine with kinetic typography sync.',
      'Fullscreen theater mode with customizable audio visualization curves.',
      'Curated catalogue of official Linacre musical projects.',
    ],
    tech: ['HTML5 Video', 'CSS3', 'JavaScript', 'Web Audio'],
    year: 2026,
  },
  {
    name: 'LineRider',
    kind: 'Game',
    emoji: '🛷',
    artwork: '/banners/linerider.jpg',
    blurb:
      'Physics track drawing game — draw luminous lines and loops for a sledder to ride with momentum and gravity vectors.',
    url: 'https://github.com/LIN4CRE/LineRider',
    repo: 'https://github.com/LIN4CRE/LineRider',
    tags: ['game', 'physics', 'drawing', 'linerider', 'canvas', 'simulation'],
    highlights: [
      'Custom 2D Verlet integration physics engine.',
      'Infinite zoomable and pan-able drawing canvas with speed lines.',
      'Track saving and export/import via JSON string format.',
    ],
    tech: ['HTML5 Canvas', 'JavaScript', 'Verlet Physics'],
    year: 2026,
  },
  {
    name: 'MmoSnake',
    kind: 'Game',
    emoji: '🐍',
    artwork: '/banners/mmosnake.jpg',
    blurb:
      'High-performance multiplayer web Snake game with responsive controls and competitive arena rankings.',
    url: 'https://github.com/LIN4CRE/MmoSnake',
    repo: 'https://github.com/LIN4CRE/MmoSnake',
    tags: ['game', 'multiplayer', 'snake', 'arcade', 'websockets', 'canvas'],
    highlights: [
      'Real-time low-latency WebSocket client-prediction netcode.',
      '60 FPS hardware-accelerated canvas rendering.',
      'Competitive global leaderboards with session record tracking.',
    ],
    tech: ['HTML5 Canvas', 'WebSockets', 'JavaScript', 'Node.js'],
    year: 2026,
  },
  {
    name: 'NXAndroid',
    kind: 'Tool',
    emoji: '🤖',
    artwork: '/banners/nxandroid.png',
    blurb:
      'Android system optimization suite, APK debloat toolkit, and hardware telemetry dashboard for power users.',
    url: 'https://github.com/LIN4CRE/NXAndroid',
    repo: 'https://github.com/LIN4CRE/NXAndroid',
    tags: ['android', 'debloat', 'system', 'optimization', 'adb', 'performance', 'mobile'],
    highlights: [
      'Guided OEM package uninstaller with safety categorization tiers.',
      'Real-time ADB shell interface for device inspection.',
      'Battery health, thermal throttling, and background service diagnostics.',
    ],
    tech: ['Kotlin', 'Android SDK', 'Shell', 'Material 3'],
    year: 2026,
  },
  {
    name: 'N8Ns Automation Workflows',
    kind: 'DevOps',
    emoji: '🔄',
    artwork: '/banners/n8ns.png',
    blurb:
      'Automated content ingestion and distribution workflows for TikTok, YouTube Shorts, and multi-platform publishing.',
    url: 'https://github.com/LIN4CRE/N8Ns',
    repo: 'https://github.com/LIN4CRE/N8Ns',
    tags: ['n8n', 'automation', 'tiktok', 'youtube', 'workflows', 'pipeline', 'devops'],
    highlights: [
      'Headless video clipping and automated subtitle burn-in pipelines.',
      'Scheduled publishing with webhook verification and error recovery.',
      'Automated analytics telemetry syncing to Google Sheets & Postgres.',
    ],
    tech: ['n8n', 'Node.js', 'Docker', 'FFmpeg', 'REST APIs'],
    year: 2026,
  },
  {
    name: 'BuildingBux',
    kind: 'App',
    emoji: '🧱',
    artwork: '/banners/buildingbux.jpg',
    blurb:
      'Roblox developer game economy simulator — design virtual balance curves, monetization telemetry, and item drops.',
    url: 'https://github.com/LIN4CRE/BuildingBux',
    repo: 'https://github.com/LIN4CRE/BuildingBux',
    tags: ['roblox', 'developer', 'economy', 'simulation', 'luau', 'monetization', 'tools'],
    highlights: [
      'Virtual economy inflation simulation and balance calculators.',
      'Exportable Luau modules for drop rates and player progression.',
      'Interactive visual graphs showing currency velocity across server clusters.',
    ],
    tech: ['TypeScript', 'React', 'Chart.js', 'Vite'],
    year: 2026,
  },
  {
    name: 'Bizintel',
    kind: 'Tool',
    emoji: '📊',
    artwork: '/banners/bizintel.jpg',
    blurb:
      'Executive business intelligence and competitive market analytics platform with real-time KPI dashboards.',
    url: 'https://github.com/LIN4CRE/Bizintel',
    repo: 'https://github.com/LIN4CRE/Bizintel',
    tags: ['business', 'analytics', 'kpi', 'dashboard', 'intelligence', 'charts'],
    highlights: [
      'Live metric tracking with configurable alert thresholds.',
      'Interactive forecasting models using browser-side regression.',
      'Exportable executive summaries in clean printable PDF format.',
    ],
    tech: ['TypeScript', 'React', 'Tailwind CSS', 'Chart.js'],
    year: 2026,
  },
  {
    name: 'AeroFlap',
    kind: 'Game',
    emoji: '🕊️',
    artwork: '/banners/aeroflap.webp',
    blurb:
      'Precision obstacle avoider game with calibrated physics, particle effects, and high-score arena tracking.',
    url: 'https://github.com/LIN4CRE/AeroFlap',
    repo: 'https://github.com/LIN4CRE/AeroFlap',
    tags: ['game', 'flappy', 'arcade', 'physics', 'canvas', 'retro'],
    highlights: [
      'Sub-pixel collision detection and calibrated gravity physics.',
      'Adaptive difficulty curve with procedurally generated obstacles.',
      'Local high scores and zero-latency audio engine.',
    ],
    tech: ['HTML5 Canvas', 'JavaScript', 'Web Audio API'],
    year: 2026,
  },
  {
    name: 'Gadget Guru',
    kind: 'Tool',
    emoji: '🔌',
    artwork: '/banners/gadget-guru.jpg',
    blurb:
      'Hardware gadget building application — interactive pinout reference, circuit schematics, and component calculators.',
    url: 'https://github.com/LIN4CRE/Gadget-Guru-',
    repo: 'https://github.com/LIN4CRE/Gadget-Guru-',
    tags: ['hardware', 'gadgets', 'electronics', 'diy', 'schematics', 'pinouts', 'maker'],
    highlights: [
      'Interactive GPIO pinout diagrams for ESP32, Raspberry Pi, and Arduino.',
      'Ohm law, resistor color code, and voltage divider calculators.',
      'Component footprint references with printable cheat sheets.',
    ],
    tech: ['TypeScript', 'React', 'SVG', 'Tailwind CSS'],
    year: 2026,
  },
  {
    name: 'KushCloud',
    pinned: true,
    kind: 'Game',
    emoji: '🌿',
    artwork: '/banners/kushcloud.webp',
    blurb:
      'A chill one-tap arcade flyer with synthesized audio, responsive calibration, unlockable cosmetics and power-ups.',
    url: 'https://lin4cre.github.io/KushCloud/',
    repo: 'https://github.com/LIN4CRE/KushCloud',
    tags: ['arcade', 'flappy', 'synthwave', 'pwa', 'offline'],
    tech: ['React', 'TypeScript', 'Vite', 'Web Audio API'],
    year: 2026,
  },
  {
    name: 'Slime Factory Tycoon',
    kind: 'Source',
    emoji: '🧪',
    artwork: '/banners/slime-factory-tycoon.webp',
    blurb:
      'Production-ready open-source Roblox idle-tycoon template with server-authoritative Luau and CI balance simulator.',
    repo: 'https://github.com/LIN4CRE/slime-factory-tycoon',
    tags: ['roblox', 'luau', 'tycoon', 'template', 'open-source', 'ci'],
    tech: ['Luau', 'Roblox Studio', 'GitHub Actions'],
    year: 2026,
  },
  {
    name: 'linacre.site',
    kind: 'DevOps',
    emoji: '🌐',
    blurb:
      'David Linacre personal software engineering portfolio, project showcase, Tabulous Games browser vault, and tools platform.',
    url: 'https://www.linacre.site',
    repo: 'https://github.com/LIN4CRE/linacre.site',
    tags: ['portfolio', 'react', 'typescript', 'tailwind', 'ssg', 'dark-chrome', 'open-source'],
    highlights: [
      'Server-side prerendered static generation with 15 routes.',
      'High-performance 3D ambient canvas and physical card tilt.',
      'Zero telemetry, 100% open-source, and 72 automated Vitest tests.',
    ],
    tech: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Vite', 'Motion', 'Vercel'],
    year: 2026,
  },
];
