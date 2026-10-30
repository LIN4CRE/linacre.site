/**
 * SITE PROJECTS — Curated catalogue of David Linacre's active projects.
 *
 * Prioritises verified live apps, active tools, games, and repositories from
 * the LIN4CRE GitHub account and live Vercel deployments (APKHub, PokéFlip AI).
 * Broken placeholders and dead external services have been removed.
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
  // ───────────────────────────── Featured Spotlight ─────────────────────────────
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
      'Curated Android APK intelligence, build artifact manager, and automated inspection toolkit with direct package downloads.',
    url: 'https://apkhub-alpha.vercel.app',
    repo: 'https://github.com/LIN4CRE/APKHub',
    tags: ['android', 'apk', 'f-droid', 'store', 'indexer', 'security', 'downloads'],
    highlights: [
      'Direct APK release tracking from verified GitHub & F-Droid open-source releases.',
      'Automated manifest inspection, permission auditing, and signature verification.',
      'Fast, ad-free alternative app directory for Android enthusiasts.',
    ],
    tech: ['React', 'TypeScript', 'Python', 'Vercel', 'TailwindCSS'],
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
    repo: 'https://github.com/LIN4CRE/Pok-Flip-AI',
    tags: ['pokemon', 'tcg', 'ai', 'arbitrage', 'gemini', 'market-analysis', 'pricing'],
    highlights: [
      'Real-time Pokémon TCG arbitrage, historical valuation, and market trend tracking.',
      'Gemini AI visual card grading and centering analysis from photos.',
      'Predictive buy and sell price signals calibrated to live marketplace comps.',
    ],
    tech: ['Next.js', 'TypeScript', 'Gemini AI', 'TailwindCSS', 'Vercel'],
    year: 2026,
  },
  {
    name: 'Retro Arcade Vault',
    badge: 'NEW',
    pinned: true,
    featured: true,
    kind: 'Game',
    emoji: '🕹️',
    artwork: '/banners/tabulous-games.webp',
    blurb:
      'Sleek retro gaming vault & web player preloaded with 63+ classic PS1, GBA, NDS, SNES, and Sega Genesis titles with box artwork and CRT shaders.',
    url: 'https://lin4cre.github.io/retro-arcade-vault/',
    repo: 'https://github.com/LIN4CRE/retro-arcade-vault',
    tags: ['retro', 'arcade', 'playstation', 'gameboy', 'snes', 'sega', 'emulation', 'wasm'],
    highlights: [
      '63+ playable retro classics running in browser WebAssembly emulators.',
      'Authentic CRT scanline shaders, customizable gamepads, and state save/load.',
      'Box artwork metadata and instant loading with zero setup.',
    ],
    tech: ['HTML5', 'JavaScript', 'WebAssembly', 'RetroArch', 'CSS3'],
    year: 2026,
  },
  {
    name: 'DBSTEAM',
    badge: 'NEW',
    pinned: true,
    featured: true,
    kind: 'App',
    emoji: '🚂',
    artwork: '/banners/deasy.webp',
    blurb:
      'Next-Gen Steam & Gaming Account Operations Hub with SteamDB Paid Releases, Cloud Save Vault, Lua Automation Scripting, and Gemini AI Intelligence.',
    url: 'https://lin4cre.github.io/DBSTEAM/',
    repo: 'https://github.com/LIN4CRE/DBSTEAM',
    tags: ['steam', 'gaming', 'steamdb', 'cloud-saves', 'automation', 'lua', 'gemini-ai'],
    highlights: [
      'Live SteamDB price alerts, release monitoring, and historical low tracking.',
      'Cross-device encrypted cloud save synchronization vault.',
      'Gemini AI game recommendations with automated Lua scripting macros.',
    ],
    tech: ['React', 'TypeScript', 'Steam API', 'Gemini AI', 'Lua'],
    year: 2026,
  },
  {
    name: 'Dual Audio Synchronizer',
    badge: 'NEW',
    pinned: true,
    featured: true,
    kind: 'Tool',
    emoji: '🔊',
    artwork: '/projects/whole-home-adblocker.svg',
    blurb:
      'Studio-grade WASAPI multi-speaker audio synchronizer for Windows with automatic ±1 ms clock-drift phase lock and 2.8 kHz Hearing Clarity DSP.',
    url: 'https://lin4cre.github.io/dual-audio-synchronizer/',
    repo: 'https://github.com/LIN4CRE/dual-audio-synchronizer',
    tags: ['audio', 'dsp', 'wasapi', 'windows', 'synchronizer', 'speakers', 'sound'],
    highlights: [
      'Automatic ±1 ms clock-drift phase lock across multiple Windows output devices.',
      'Real-time 2.8 kHz Hearing Clarity DSP equalizer enhancement.',
      'Zero external virtual cable drivers required — native WASAPI loopback capture.',
    ],
    tech: ['C#', 'WASAPI', 'DSP', 'Windows Audio Engine'],
    year: 2026,
  },
  {
    name: 'linacre.site',
    featured: true,
    kind: 'App',
    emoji: '🌐',
    blurb:
      'David Linacre personal portfolio, project library, browser games vault, and tools directory.',
    url: 'https://www.linacre.site',
    repo: 'https://github.com/LIN4CRE/linacre.site',
    tags: ['portfolio', 'website', 'react', 'tools', 'games'],
    highlights: [
      'Fast dark chrome UI with instant keyboard command palette.',
      'Integrated Tabulous Games browser vault with 303 games.',
      'Zero external dependencies for client routing and pre-rendering.',
    ],
    tech: ['React', 'TypeScript', 'Tailwind', 'Node.js', 'Vite'],
    year: 2026,
  },

  // ───────────────────────────── Apps & Utilities (LIN4CRE) ─────────────────────
  {
    name: 'SpeedRead',
    badge: 'NEW',
    kind: 'App',
    emoji: '📖',
    blurb:
      'High-velocity RSVP speed reading app — train comprehension at 300 to 1,000+ words per minute with cadence pacing.',
    url: 'https://lin4cre.github.io/SpeedRead/',
    repo: 'https://github.com/LIN4CRE/SpeedRead',
    tags: ['speed-reading', 'rsvp', 'reading', 'productivity', 'pwa'],
    highlights: [
      'Rapid Serial Visual Presentation (RSVP) with optimal focal recognition markers.',
      'Configurable WPM acceleration, pause on punctuation, and chapter bookmarking.',
      'Offline-first reading with EPUB, PDF, and pasteboard support.',
    ],
    tech: ['TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'PWA'],
    year: 2026,
  },
  {
    name: 'Skipr',
    badge: 'NEW',
    kind: 'Tool',
    emoji: '⚡',
    blurb:
      'Auto-skip intros, outros & recaps seamlessly for Stremio on Android TV, Fire TV, and Desktop.',
    url: 'https://lin4cre.github.io/skipr/',
    repo: 'https://github.com/LIN4CRE/skipr',
    tags: ['stremio', 'addon', 'android-tv', 'firetv', 'auto-skip', 'media', 'automation'],
    highlights: [
      'Automated intro, recap, and credits skipping for media streaming.',
      'Optimized for remote-control navigation on Android TV & Fire TV devices.',
      'Lightweight daemon running client-side or self-hosted.',
    ],
    tech: ['Node.js', 'JavaScript', 'Android TV', 'Stremio Addon API'],
    year: 2026,
  },
  {
    name: 'Karaoke Pulse',
    badge: 'NEW',
    kind: 'App',
    emoji: '🎤',
    blurb:
      'Full-stack YouTube Karaoke Studio with synced scrolling lyrics, dual-stem AI vocal removal, live mic reverb & pitch detection.',
    url: 'https://github.com/LIN4CRE/karaoke-pulse',
    repo: 'https://github.com/LIN4CRE/karaoke-pulse',
    tags: ['karaoke', 'music', 'youtube', 'vocal-removal', 'lyrics', 'pitch-detection', 'audio'],
    highlights: [
      'Real-time dual-stem AI vocal isolation from any YouTube audio stream.',
      'Time-synced scrolling lyrics with live microphone pitch evaluation.',
      'Integrated studio vocal effects: studio reverb, delay, and EQ.',
    ],
    tech: ['JavaScript', 'Web Audio API', 'React', 'HTML5'],
    year: 2026,
  },
  {
    name: 'Beginner 2x4 Workbench Guide',
    kind: 'Tool',
    emoji: '🪵',
    blurb:
      'Responsive beginner woodworking bench build guide with cut diagrams, hardware list, and an interactive 3D model.',
    url: 'https://lin4cre.github.io/beginner-2x4-bench-plan/',
    repo: 'https://github.com/LIN4CRE/beginner-2x4-bench-plan',
    tags: ['woodworking', 'diy', '3d', 'calculator', 'workbench', 'guides'],
    highlights: [
      'Interactive rotatable 3D model of the assembled workbench.',
      'Optimized 2x4 cut list that minimizes lumber waste.',
      'Step-by-step assembly diagrams with screw placement guides.',
    ],
    tech: ['Three.js', 'HTML5', 'CSS3', 'WebGL'],
    year: 2026,
  },
  {
    name: 'Barnsley Web Builder',
    kind: 'App',
    emoji: '🏗️',
    blurb:
      'Turnkey website builder for local shops, trades, and independent services in Barnsley and South Yorkshire.',
    url: 'https://lin4cre.github.io/Barnsley-Web-Builder/',
    repo: 'https://github.com/LIN4CRE/Barnsley-Web-Builder',
    tags: ['website-builder', 'local-business', 'barnsley', 'templates', 'responsive'],
    highlights: [
      'Pre-built templates optimized for local trades, food vendors, and shops.',
      'Built-in appointment booking and quote inquiry forms.',
      'Ultra-fast static generation requiring zero hosting maintenance.',
    ],
    tech: ['TypeScript', 'HTML5', 'CSS3', 'JavaScript'],
    year: 2026,
  },
  {
    name: 'DigiPoke',
    kind: 'Game',
    emoji: '🐾',
    blurb:
      'Local-first creature-collecting battler PWA with turn-based strategy and optional end-to-end encrypted sync.',
    url: 'https://lin4cre.github.io/digipoke/',
    repo: 'https://github.com/LIN4CRE/digipoke',
    tags: ['pokemon', 'creature-collector', 'battler', 'pwa', 'offline-first', 'turn-based'],
    highlights: [
      'Turn-based tactical combat with element affinities and stat builds.',
      '100% offline-playable PWA saving state to IndexedDB.',
      'Optional multi-device sync with zero third-party account tracking.',
    ],
    tech: ['JavaScript', 'HTML5 Canvas', 'IndexedDB', 'PWA'],
    year: 2026,
  },
  {
    name: 'MmoSnake',
    kind: 'Game',
    emoji: '🐍',
    artwork: '/banners/snake.webp',
    blurb:
      'High-performance multiplayer web Snake game with responsive controls and competitive arena rankings.',
    url: 'https://lin4cre.github.io/MmoSnake/',
    repo: 'https://github.com/LIN4CRE/MmoSnake',
    tags: ['snake', 'game', 'multiplayer', 'arcade', 'canvas'],
    tech: ['TypeScript', 'HTML5 Canvas', 'WebSockets'],
    year: 2026,
  },
  {
    name: 'Lad Jokes',
    kind: 'App',
    emoji: '🍻',
    blurb:
      'Adults-only humour commons prototype: raunchy stories, community outrage ratings, and encrypted chat with zero runtime dependencies.',
    url: 'https://lin4cre.github.io/lad-jokes/',
    repo: 'https://github.com/LIN4CRE/lad-jokes',
    tags: ['humour', 'jokes', 'community', 'e2ee', 'pwa', 'zero-dependencies'],
    tech: ['Vanilla JS', 'Web Crypto API', 'CSS3', 'PWA'],
    year: 2026,
  },
  {
    name: 'Linacre Lyric Cinema',
    kind: 'App',
    emoji: '🎬',
    blurb:
      'Official high-definition master lyric videos and cinema player for David Linacre original music releases.',
    url: 'https://lin4cre.github.io/linacre-music-videos/',
    repo: 'https://github.com/LIN4CRE/linacre-music-videos',
    tags: ['music', 'cinema', 'video', 'lyrics', 'player', 'album'],
    tech: ['HTML5 Video', 'CSS3 Glassmorphism', 'Vanilla JS'],
    year: 2026,
  },
  {
    name: 'Frostpine',
    kind: 'Game',
    emoji: '❄️',
    blurb:
      'Snow plough arcade game — clear treacherous alpine roads, avoid obstacles, and beat the storm timer.',
    url: 'https://github.com/LIN4CRE/Frostpine',
    repo: 'https://github.com/LIN4CRE/Frostpine',
    tags: ['game', 'arcade', 'snow', 'winter', 'driving'],
    tech: ['TypeScript', 'HTML5 Canvas', 'Web Audio'],
    year: 2026,
  },
  {
    name: 'Gyroll',
    kind: 'Game',
    emoji: '⚪',
    blurb:
      '3D precision ball-rolling physics puzzle game with accelerometer tilt and keyboard controls.',
    url: 'https://github.com/LIN4CRE/Gyroll',
    repo: 'https://github.com/LIN4CRE/Gyroll',
    tags: ['game', 'physics', '3d', 'puzzle', 'ball-roller'],
    tech: ['TypeScript', 'Three.js', 'Cannon.js'],
    year: 2026,
  },
  {
    name: 'LineRider',
    kind: 'Game',
    emoji: '🎿',
    blurb:
      'Interactive line-drawing track creator and physics sledder simulation running directly in the browser.',
    url: 'https://github.com/LIN4CRE/LineRider',
    repo: 'https://github.com/LIN4CRE/LineRider',
    tags: ['game', 'physics', 'sandbox', 'creative', 'linerider'],
    tech: ['Kotlin', 'TypeScript', 'HTML5 Canvas'],
    year: 2026,
  },
  {
    name: 'AeroFlap',
    kind: 'Game',
    emoji: '🪽',
    artwork: '/banners/aeroflap.webp',
    blurb:
      'Flappy birds style arcade flyer with tight hitboxes, momentum physics, and high-score saves.',
    url: 'https://github.com/LIN4CRE/AeroFlap',
    repo: 'https://github.com/LIN4CRE/AeroFlap',
    tags: ['game', 'flappy', 'arcade', 'casual', 'runner'],
    tech: ['TypeScript', 'HTML5 Canvas'],
    year: 2026,
  },
  {
    name: 'PulseRider',
    kind: 'Game',
    emoji: '⚡',
    blurb:
      'High-speed neon rhythm runner with procedural soundtrack pacing and reactive obstacle dodging.',
    url: 'https://github.com/LIN4CRE/PulseRider',
    repo: 'https://github.com/LIN4CRE/PulseRider',
    tags: ['game', 'rhythm', 'synthwave', 'arcade', 'runner'],
    tech: ['TypeScript', 'HTML5 Canvas', 'Web Audio API'],
    year: 2026,
  },
  {
    name: 'NXAndroid',
    kind: 'Tool',
    emoji: '🎮',
    blurb:
      'Android companion utilities, configuration patches, and launcher integrations for mobile console emulation.',
    url: 'https://github.com/LIN4CRE/NXAndroid',
    repo: 'https://github.com/LIN4CRE/NXAndroid',
    tags: ['android', 'emulation', 'gaming', 'utility', 'console'],
    tech: ['TypeScript', 'Android', 'Kotlin'],
    year: 2026,
  },
  {
    name: 'BuildingBux',
    kind: 'Tool',
    emoji: '🧱',
    blurb:
      'Roblox developer monetization toolset and Luau balance simulator for game designers.',
    url: 'https://github.com/LIN4CRE/BuildingBux',
    repo: 'https://github.com/LIN4CRE/BuildingBux',
    tags: ['roblox', 'luau', 'gamedev', 'monetization', 'tools'],
    tech: ['TypeScript', 'Luau', 'Node.js'],
    year: 2026,
  },
  {
    name: 'N8Ns',
    kind: 'DevOps',
    emoji: '🔄',
    blurb:
      'Automated n8n workflow blueprints for TikTok content scheduling, trend analysis, and social webhooks.',
    url: 'https://github.com/LIN4CRE/N8Ns',
    repo: 'https://github.com/LIN4CRE/N8Ns',
    tags: ['automation', 'n8n', 'workflows', 'tiktok', 'social', 'devops'],
    tech: ['n8n', 'TypeScript', 'REST APIs'],
    year: 2026,
  },
  {
    name: 'Bizintel',
    kind: 'Tool',
    emoji: '📊',
    blurb:
      'Lightweight business intelligence analytics dashboard for tracking sales pipelines and operational metrics.',
    url: 'https://github.com/LIN4CRE/Bizintel',
    repo: 'https://github.com/LIN4CRE/Bizintel',
    tags: ['bi', 'analytics', 'dashboard', 'business', 'metrics'],
    tech: ['Kotlin', 'Android', 'SQL'],
    year: 2026,
  },
  {
    name: 'Gadget Guru',
    kind: 'Tool',
    emoji: '🔧',
    blurb:
      'Interactive electronics assembly and hardware component sizing toolkit for makers and DIYers.',
    url: 'https://github.com/LIN4CRE/Gadget-Guru-',
    repo: 'https://github.com/LIN4CRE/Gadget-Guru-',
    tags: ['electronics', 'diy', 'hardware', 'gadgets', 'maker'],
    tech: ['Kotlin', 'Android', 'Java'],
    year: 2026,
  },
  {
    name: 'ComfyUI Wallpaper Pipeline',
    kind: 'AI',
    emoji: '🎨',
    blurb:
      'Automated ComfyUI diffusion workflow for generating ultra-wide desktop and dual-monitor wallpapers.',
    url: 'https://github.com/LIN4CRE/comfyui-wallpaper-pipeline',
    repo: 'https://github.com/LIN4CRE/comfyui-wallpaper-pipeline',
    tags: ['ai', 'comfyui', 'stable-diffusion', 'wallpapers', 'generative'],
    tech: ['Python', 'ComfyUI', 'PyTorch'],
    year: 2026,
  },
  {
    name: 'EMULATED',
    kind: 'Game',
    emoji: '💾',
    blurb:
      'Consolidated retro emulator library and ROM cataloging scripts for multi-system retro setups.',
    url: 'https://github.com/LIN4CRE/EMULATED',
    repo: 'https://github.com/LIN4CRE/EMULATED',
    tags: ['emulation', 'retro', 'roms', 'gamedev', 'archiving'],
    tech: ['TypeScript', 'Shell', 'Node.js'],
    year: 2026,
  },

  // ───────────────────────────── Tested & Verified Live Web Apps ─────────────────────
  {
    name: 'KushCloud',
    pinned: true,
    kind: 'Game',
    emoji: '🌿',
    artwork: '/banners/kushcloud.webp',
    blurb:
      'A chill one-tap arcade flyer with synthesized audio, responsive calibration, unlockable cosmetics and power-ups.',
    url: 'https://dlinacre.github.io/KushCloud/',
    repo: 'https://github.com/DLinacre/KushCloud',
    tags: ['arcade', 'flappy', 'synthwave', 'pwa', 'offline'],
    tech: ['React', 'TypeScript', 'Vite', 'Web Audio API'],
    year: 2025,
  },
  {
    name: 'Bonny Bakes',
    kind: 'App',
    emoji: '🧁',
    artwork: '/banners/bonny-bakes.jpg',
    blurb:
      'Warm, friendly home-baking recipe website with quantity scaler, favorites, shopping list and printable cards.',
    url: 'https://dlinacre.github.io/bonny-bakes/',
    repo: 'https://github.com/DLinacre/bonny-bakes',
    tags: ['baking', 'recipes', 'calculator', 'offline', 'food', 'pwa'],
    tech: ['HTML5', 'Vanilla JS', 'CSS3', 'Web Storage'],
    year: 2026,
  },
  {
    name: 'CubeLab',
    kind: 'App',
    emoji: '🧊',
    artwork: '/banners/cubelab.webp',
    blurb:
      "Free offline-first Rubik's Cube solver and trainer — animated 3D solutions, beginner guide, verified drills, timer and stats.",
    url: 'https://dlinacre.github.io/cubelab/',
    repo: 'https://github.com/DLinacre/cubelab',
    tags: ['rubiks-cube', 'solver', 'puzzle', 'timer', 'pwa', 'offline', '3d'],
    tech: ['React', 'TypeScript', 'Three.js', 'PWA'],
    year: 2026,
  },
  {
    name: 'HELIX',
    kind: 'App',
    emoji: '🧬',
    artwork: '/banners/helix.webp',
    blurb:
      'Watch a living population of tiny programs evolve in real-time — runs 100% in your browser.',
    url: '/helix',
    repo: 'https://github.com/DLinacre/helix',
    tags: ['evolution', 'simulation', 'canvas', 'offline', 'generative'],
    tech: ['Vanilla JS', 'Canvas 2D', 'Web Audio'],
    year: 2026,
  },
  {
    name: 'Whole-Home Ad Blocker',
    kind: 'Tool',
    emoji: '🛡️',
    artwork: '/projects/whole-home-adblocker.svg',
    blurb:
      'One-click Windows installer that turns an always-on PC into a network-wide ad blocker via AdGuard Home.',
    url: 'https://dlinacre.github.io/whole-home-adblocker/',
    repo: 'https://github.com/DLinacre/whole-home-adblocker',
    tags: ['adblock', 'adguard', 'dns', 'windows', 'privacy', 'docker'],
    tech: ['PowerShell', 'AdGuard Home', 'Docker'],
    year: 2025,
  },
  {
    name: 'Linacre Uninstaller',
    kind: 'Tool',
    emoji: '🗑️',
    artwork: '/banners/linacre-uninstaller.webp',
    blurb:
      'Android debloat and package removal review tool with safety tiers and guided uninstalls.',
    url: 'https://dlinacre.github.io/LinacreUninstaller/',
    repo: 'https://github.com/DLinacre/LinacreUninstaller',
    tags: ['android', 'debloat', 'apk', 'adb', 'system'],
    tech: ['Kotlin', 'Android', 'Material You'],
    year: 2025,
  },
  {
    name: 'Fleatment',
    kind: 'App',
    emoji: '🐱',
    artwork: '/banners/fleatment.webp',
    blurb:
      'UK cat flea & tick treatment finder: live price index, active-ingredient matrix and veterinary safety calculator.',
    url: 'https://dlinacre.github.io/Fleatment/',
    repo: 'https://github.com/DLinacre/Fleatment',
    tags: ['cats', 'pets', 'veterinary', 'prices', 'comparison', 'uk'],
    tech: ['TypeScript', 'React', 'TailwindCSS'],
    year: 2025,
  },
  {
    name: 'String & Band',
    kind: 'Tool',
    emoji: '🏹',
    artwork: '/projects/string-and-band.webp',
    blurb:
      'Offline-first educational guide on the craft, materials, and tuning of archery equipment and slingshots.',
    url: 'https://dlinacre.github.io/string-and-band/',
    repo: 'https://github.com/DLinacre/string-and-band',
    tags: ['archery', 'slingshots', 'craft', 'outdoor', 'offline'],
    tech: ['HTML5', 'CSS3', 'Zero-Dependency'],
    year: 2025,
  },
  {
    name: 'Linacre Global Monitor',
    kind: 'Tool',
    emoji: '📡',
    blurb:
      'Real-time geopolitical and environmental situational awareness dashboard fed by NASA, USGS, and Open-Meteo.',
    url: 'https://dlinacre.github.io/linacre-global-monitor/',
    repo: 'https://github.com/DLinacre/linacre-global-monitor',
    tags: ['monitoring', 'nasa', 'weather', 'geopolitical', 'earthquakes'],
    tech: ['React', 'Leaflet', 'Open-Meteo API', 'NASA APIs'],
    year: 2025,
  },
  {
    name: 'Deasy',
    kind: 'DevOps',
    emoji: '🌿',
    artwork: '/banners/deasy.webp',
    blurb:
      'Desktop branch orchestrator: serverless pipelines, AES-256 encrypted backups, and NSIS zero-terminal installers.',
    url: 'https://dlinacre.github.io/Deasy/',
    repo: 'https://github.com/DLinacre/Deasy',
    tags: ['electron', 'git', 'desktop', 'aes-256', 'powershell', 'devops'],
    tech: ['TypeScript', 'Electron', 'PowerShell', 'NSIS'],
    year: 2025,
  },
  {
    name: 'Linacre Mission Control Wallpaper',
    kind: 'Tool',
    emoji: '🖥️',
    blurb:
      'Real-time dual-monitor desktop HUD powered by Lively Wallpaper: live CPU/GPU thread telemetry and storage monitors.',
    url: 'https://dlinacre.github.io/linacre-wallpaper/',
    repo: 'https://github.com/DLinacre/linacre-wallpaper',
    tags: ['wallpaper', 'hardware', 'telemetry', 'lively-wallpaper', 'hud'],
    tech: ['JavaScript', 'WebView2', 'PowerShell', 'CSS3'],
    year: 2025,
  },
  {
    name: '1Files',
    kind: 'Tool',
    emoji: '📦',
    blurb:
      'Curated collection of self-contained single-file HTML applications requiring zero build step and zero runtime dependencies.',
    url: 'https://dlinacre.github.io/1files/',
    repo: 'https://github.com/DLinacre/1files',
    tags: ['single-file', 'html5', 'portable', 'offline', 'zero-dependency'],
    tech: ['HTML5', 'Vanilla JavaScript', 'CSS3'],
    year: 2025,
  },
  {
    name: 'SIM://ROOT',
    kind: 'Tool',
    emoji: '📟',
    blurb:
      'Interactive digital lab and reference guide on SIM card anatomy, APDU pinouts, and client-side cellular protocols.',
    url: 'https://dlinacre.github.io/sim-root/',
    repo: 'https://github.com/DLinacre/sim-root',
    tags: ['security', 'sim-card', 'telecom', 'apdu', 'hardware'],
    tech: ['HTML5 Canvas', 'Vanilla JS', 'SVG'],
    year: 2025,
  },
  {
    name: 'Afterglow',
    kind: 'Game',
    emoji: '✨',
    artwork: '/projects/afterglow.webp',
    blurb:
      'Long-exposure light painting web game — steer shimmering particles to paint glowing auroral ribbons onto the night sky.',
    url: 'https://dlinacre.github.io/afterglow/',
    repo: 'https://github.com/DLinacre/afterglow',
    tags: ['game', 'canvas', 'generative', 'light-painting', 'chill'],
    tech: ['HTML5 Canvas', 'Web Audio API', 'JavaScript'],
    year: 2025,
  },
  {
    name: 'Dragon Rush Heroes',
    kind: 'Game',
    emoji: '🐉',
    artwork: '/banners/dragon-rush-heroes.webp',
    blurb:
      'Anime action-RPG card battler with 464 fighters, real-time Arts combat, and provably-fair summons — 100% free with no ads.',
    url: 'https://dlinacre.github.io/dragon-rush-heroes/',
    repo: 'https://github.com/DLinacre/dragon-rush-heroes',
    tags: ['game', 'rpg', 'card-battler', 'anime', 'gacha', 'pwa'],
    tech: ['JavaScript', 'HTML5 Canvas', 'Web Audio API', 'PWA'],
    year: 2025,
  },
  {
    name: 'Sporing',
    kind: 'App',
    emoji: '🍄',
    blurb:
      "Seasonal foraging chance map for England's edible wild fungi, seasonal fruiting calendars and identification keys.",
    url: 'https://dlinacre.github.io/sporing/',
    repo: 'https://github.com/DLinacre/sporing',
    tags: ['foraging', 'mushrooms', 'nature', 'uk', 'pwa', 'offline'],
    tech: ['TypeScript', 'PWA', 'TailwindCSS'],
    year: 2025,
  },
  {
    name: 'Bonny Bats',
    kind: 'App',
    emoji: '🦇',
    artwork: '/banners/bonny-bats.webp',
    blurb:
      'Friendly client-facing guide to bats in UK buildings: identification, roost law, and humane exclusion advice.',
    url: 'https://dlinacre.github.io/bonny-bats/',
    repo: 'https://github.com/DLinacre/bonny-bats',
    tags: ['wildlife', 'bats', 'conservation', 'uk-law', 'ecology'],
    tech: ['HTML5', 'Vanilla JS', 'TailwindCSS'],
    year: 2025,
  },
  {
    name: 'Slime Factory Tycoon',
    kind: 'Source',
    emoji: '🧪',
    artwork: '/banners/slime-factory-tycoon.webp',
    blurb:
      'Production-ready open-source Roblox idle-tycoon template with server-authoritative Luau and CI balance simulator.',
    url: 'https://github.com/DLinacre/slime-factory-tycoon',
    repo: 'https://github.com/DLinacre/slime-factory-tycoon',
    tags: ['roblox', 'luau', 'tycoon', 'template', 'open-source', 'ci'],
    tech: ['Luau', 'Roblox Studio', 'GitHub Actions'],
    year: 2025,
  },
];
