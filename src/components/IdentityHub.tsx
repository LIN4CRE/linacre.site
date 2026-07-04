import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Copy, 
  Check, 
  Download, 
  Palette, 
  Shield, 
  Code, 
  Sparkles, 
  Terminal, 
  FileCode, 
  ChevronRight, 
  Globe, 
  Github, 
  Type, 
  Mail, 
  Briefcase, 
  Linkedin, 
  Image as ImageIcon, 
  IdCard, 
  Sliders, 
  ExternalLink 
} from 'lucide-react';

export default function IdentityHub() {
  // Brand Color Options
  const colors = [
    { name: 'Amber Aura', id: 'amber', primary: '#f59e0b', secondary: '#fbbf24', glow: 'rgba(245, 158, 11, 0.25)', text: 'text-amber-color', border: 'border-amber-color/30', bg: 'bg-amber-color/10', signature: '#f59e0b' },
    { name: 'Cyber Cyan', id: 'cyan', primary: '#06b6d4', secondary: '#22d3ee', glow: 'rgba(6, 182, 212, 0.25)', text: 'text-cyan', border: 'border-cyan/30', bg: 'bg-cyan/10', signature: '#06b6d4' },
    { name: 'Emerald Flux', id: 'emerald', primary: '#10b981', secondary: '#34d399', glow: 'rgba(16, 185, 129, 0.25)', text: 'text-emerald-color', border: 'border-emerald-color/30', bg: 'bg-emerald-color/10', signature: '#10b981' },
    { name: 'Crimson Pulse', id: 'crimson', primary: '#ef4444', secondary: '#f87171', glow: 'rgba(239, 68, 68, 0.25)', text: 'text-rose-500', border: 'border-rose-500/30', bg: 'bg-rose-500/10', signature: '#ef4444' },
    { name: 'Obsidian Mono', id: 'mono', primary: '#e2e8f0', secondary: '#94a3b8', glow: 'rgba(226, 232, 240, 0.15)', text: 'text-slate-200', border: 'border-slate-700', bg: 'bg-slate-800/40', signature: '#e2e8f0' }
  ];

  // Shield Frames
  const frames = [
    { id: 'hexagon', name: 'Pipeline Nexus' },
    { id: 'circle', name: 'Aether Orb' },
    { id: 'brackets', name: 'Cyber Brackets' },
    { id: 'minimal', name: 'Minimalist Spark' },
    { id: 'streetwear', name: 'Streetwear Morph' }
  ];

  // Premium Typography Pairings (dynamically loaded via Google Fonts link)
  const fonts = [
    {
      id: 'cyber',
      name: 'Space Tech',
      import: "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap');",
      displayFamily: "'Space Grotesk', sans-serif",
      monoFamily: "'JetBrains Mono', monospace",
    },
    {
      id: 'neotech',
      name: 'Futuristic Orbit',
      import: "@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;800&family=Share+Tech+Mono&display=swap');",
      displayFamily: "'Orbitron', sans-serif",
      monoFamily: "'Share Tech Mono', monospace",
    },
    {
      id: 'brutalist',
      name: 'Technical Mono',
      import: "@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&family=Plus+Jakarta+Sans:wght@500;800&display=swap');",
      displayFamily: "'Plus Jakarta Sans', sans-serif",
      monoFamily: "'Fira Code', monospace",
    },
    {
      id: 'editorial',
      name: 'Editorial Serif',
      import: "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,400&family=Fira+Mono&display=swap');",
      displayFamily: "'Playfair Display', serif",
      monoFamily: "'Fira Mono', monospace",
    }
  ];

  const [activeColor, setActiveColor] = useState(() => {
    const saved = localStorage.getItem('linacre_brand_color');
    return colors.find(c => c.id === saved) || colors[0];
  });
  const [activeFrame, setActiveFrame] = useState(() => localStorage.getItem('linacre_brand_frame') || 'hexagon');
  const [activeMotion, setActiveMotion] = useState(() => localStorage.getItem('linacre_brand_motion') || 'pulse');
  const [activePulseSpeed, setActivePulseSpeed] = useState(() => localStorage.getItem('linacre_brand_pulse_speed') || 'slow');
  const [activeFont, setActiveFont] = useState(() => {
    const saved = localStorage.getItem('linacre_brand_font');
    return fonts.find(f => f.id === saved) || fonts[0];
  });
  const [glowIntensity, setGlowIntensity] = useState<number>(() => Number(localStorage.getItem('linacre_brand_glow') || '3'));
  
  // User Profile Data
  const [userName, setUserName] = useState(() => localStorage.getItem('linacre_brand_name') || 'DAVID LINACRE');
  const [userTitle, setUserTitle] = useState(() => localStorage.getItem('linacre_brand_title') || 'Full Stack & AI Engineer');
  const [userBio, setUserBio] = useState(() => localStorage.getItem('linacre_brand_bio') || 'Crafting pristine digital tools, robust server proxy networks, and intelligent sandbox applications.');
  
  // Social links for email signature and badges
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('linacre_brand_email') || 'delinacre@gmail.com');
  const [userGithub, setUserGithub] = useState(() => localStorage.getItem('linacre_brand_github') || 'github.com/LIN4CRE');
  const [userLinkedin, setUserLinkedin] = useState(() => localStorage.getItem('linacre_brand_linkedin') || 'linkedin.com/in/david-linacre');
  const [userWebsite, setUserWebsite] = useState(() => localStorage.getItem('linacre_brand_website') || 'https://linacre.site');

  useEffect(() => {
    localStorage.setItem('linacre_brand_color', activeColor.id);
    localStorage.setItem('linacre_brand_font', activeFont.id);
    localStorage.setItem('linacre_brand_frame', activeFrame);
    localStorage.setItem('linacre_brand_motion', activeMotion);
    localStorage.setItem('linacre_brand_pulse_speed', activePulseSpeed);
    localStorage.setItem('linacre_brand_name', userName);
    localStorage.setItem('linacre_brand_title', userTitle);
    localStorage.setItem('linacre_brand_bio', userBio);
    localStorage.setItem('linacre_brand_email', userEmail);
    localStorage.setItem('linacre_brand_github', userGithub);
    localStorage.setItem('linacre_brand_linkedin', userLinkedin);
    localStorage.setItem('linacre_brand_website', userWebsite);
    localStorage.setItem('linacre_brand_glow', glowIntensity.toString());
    
    // Dispatch event to notify other components reactively (e.g. App.tsx)
    window.dispatchEvent(new Event('linacre-identity-updated'));
  }, [
    activeColor,
    activeFont,
    activeFrame,
    activeMotion,
    activePulseSpeed,
    userName,
    userTitle,
    userBio,
    userEmail,
    userGithub,
    userLinkedin,
    userWebsite,
    glowIntensity
  ]);

  // Preview Layout switcher
  const [activeLayout, setActiveLayout] = useState<'panoramic' | 'avatar' | 'card'>('panoramic');
  
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Copy animation feedback
  const triggerCopyFeedback = (type: string) => {
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Generate the customized SVG code
  const getSVGCode = () => {
    const p = activeColor.primary;
    const s = activeColor.secondary;
    const shadowSize = glowIntensity * 4;
    const frame = activeFrame;

    let styleBlock = '';
    const speedSeconds = activePulseSpeed === 'fast' ? '1.0s' : activePulseSpeed === 'breathe' ? '5.0s' : '2.5s';
    
    if (frame === 'streetwear') {
      styleBlock = `
    <style>
      @keyframes rotateCW {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes rotateCCW {
        from { transform: rotate(0deg); }
        to { transform: rotate(-360deg); }
      }
      @keyframes scanline {
        0% { transform: translateY(-36px); }
        100% { transform: translateY(36px); }
      }
      @keyframes characterMorph {
        0%, 28% { opacity: 1; transform: translate(0, 0) scale(1); }
        33%, 95% { opacity: 0; transform: translate(0, 2px) scale(0.92); }
        100% { opacity: 1; transform: translate(0, 0) scale(1); }
      }
      @keyframes eyeGlow {
        0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 1px #00F0FF); }
        50% { opacity: 1; filter: drop-shadow(0 0 4px #00F0FF); }
      }
      .g-rotate-cw {
        transform-origin: 50px 50px;
        animation: rotateCW 25s linear infinite;
      }
      .g-rotate-ccw {
        transform-origin: 50px 50px;
        animation: rotateCCW 20s linear infinite;
      }
      .scanline-bar {
        animation: scanline 4s linear infinite;
      }
      .char-layer {
        transform-origin: 50px 50px;
        animation: characterMorph 15s ease-in-out infinite;
      }
      .char-ape {
        animation-delay: 0s;
      }
      .char-skull {
        animation-delay: 5s;
      }
      .char-cat {
        animation-delay: 10s;
      }
      .glowing-eye {
        animation: eyeGlow 2s ease-in-out infinite;
      }
    </style>`;
    } else if (activeMotion === 'pulse') {
      styleBlock = `
    <style>
      @keyframes dPulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.95; }
      }
      .d-pulse-path {
        animation: dPulse ${speedSeconds} ease-in-out infinite;
      }
    </style>`;
    } else if (activeMotion === 'spin') {
      styleBlock = `
    <style>
      @keyframes spinLogo {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .spin-logo-g {
        transform-origin: 50px 50px;
        animation: spinLogo 8s linear infinite;
      }
    </style>`;
    }

    let emblemContents = '';
    if (frame === 'hexagon') {
      emblemContents = `
  <!-- Pipeline Nexus Hexagon -->
  <polygon points="50,3 91,25 91,75 50,97 9,75 9,25" fill="none" stroke="${p}" stroke-width="3" stroke-linejoin="round" filter="url(#glow)" />
  <polygon points="50,8 87,28 87,72 50,92 13,72 13,28" fill="none" stroke="${s}" stroke-width="1" stroke-dasharray="6 4" opacity="0.3" />
  
  <g transform="translate(20, 20)" fill="url(#brandGrad)" filter="url(#glow)">
    <rect x="5" y="5" width="8" height="8" rx="2" opacity="0.4" />
    <rect x="18" y="5" width="8" height="8" rx="2" opacity="0.6" />
    <rect x="31" y="5" width="8" height="8" rx="2" />
    <rect x="44" y="5" width="8" height="8" rx="2" opacity="0.6" />
    <rect x="5" y="18" width="8" height="8" rx="2" opacity="0.5" />
    <rect x="18" y="18" width="8" height="8" rx="2" opacity="0.8" />
    <rect x="31" y="18" width="8" height="8" rx="2" fill="${s}" />
    <rect x="44" y="18" width="8" height="8" rx="2" opacity="0.5" />
    <rect x="18" y="31" width="22" height="8" rx="2" fill="#ff6b9d" ${activeMotion === 'pulse' ? 'class="d-pulse-path"' : ''} />
    <rect x="5" y="31" width="8" height="8" rx="2" opacity="0.6" />
    <rect x="44" y="31" width="8" height="8" rx="2" opacity="0.6" />
    <rect x="5" y="44" width="8" height="8" rx="2" opacity="0.4" />
    <rect x="18" y="44" width="8" height="8" rx="2" opacity="0.6" />
    <rect x="31" y="44" width="8" height="8" rx="2" />
    <rect x="44" y="44" width="8" height="8" rx="2" opacity="0.4" />
  </g>`;
    } else if (frame === 'circle') {
      emblemContents = `
  <!-- Aether Orb Center -->
  <circle cx="50" cy="50" r="44" fill="none" stroke="${p}" stroke-width="2.5" filter="url(#glow)" />
  <circle cx="50" cy="50" r="39" fill="none" stroke="${s}" stroke-width="1" stroke-dasharray="5 3" opacity="0.4" />
  
  <circle cx="50" cy="50" r="16" fill="url(#brandGrad)" filter="url(#glow)" />
  <circle cx="50" cy="50" r="22" fill="none" stroke="${s}" stroke-width="1.5" filter="url(#glow)" ${activeMotion === 'pulse' ? 'class="d-pulse-path"' : ''} />
  <path d="M 50,43 L 52,48 L 57,50 L 52,52 L 50,57 L 48,52 L 43,50 L 48,48 Z" fill="#ffffff" filter="url(#glow)" />`;
    } else if (frame === 'brackets') {
      emblemContents = `
  <!-- Code Brackets Frame -->
  <path d="M 24,12 L 10,12 L 10,88 L 24,88" fill="none" stroke="${p}" stroke-width="4.5" stroke-linecap="round" filter="url(#glow)" />
  <path d="M 76,12 L 90,12 L 90,88 L 76,88" fill="none" stroke="${p}" stroke-width="4.5" stroke-linecap="round" filter="url(#glow)" />
  
  <g transform="translate(34, 40)" fill="url(#brandGrad)" filter="url(#glow)">
    <path d="M 0,4 L 12,10 L 0,16" fill="none" stroke="${p}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <rect x="18" y="15" width="14" height="3" rx="1.5" fill="${s}" ${activeMotion === 'pulse' ? 'class="d-pulse-path"' : ''} />
  </g>`;
    } else if (frame === 'streetwear') {
      emblemContents = `
  <!-- Background Component: Cybernetic Circular Ring Base -->
  <circle cx="50" cy="50" r="47" fill="url(#darkMetalGrad)" stroke="#1a1a26" stroke-width="1.5" />
  
  <!-- Rotating Technical Rings -->
  <circle cx="50" cy="50" r="44" fill="none" stroke="url(#brandGrad)" stroke-width="0.8" stroke-dasharray="16 28 8 12" class="g-rotate-cw" opacity="0.9" filter="url(#glow)" />
  <circle cx="50" cy="50" r="41.8" fill="none" stroke="#ff6b9d" stroke-width="0.5" stroke-dasharray="6 30 18 6" class="g-rotate-ccw" opacity="0.6" />
  <circle cx="50" cy="50" r="39.5" fill="none" stroke="#ffffff" stroke-width="0.25" stroke-dasharray="1 4" opacity="0.2" />

  <!-- Corner Crosshair Brackets -->
  <g stroke="#ffffff" stroke-width="0.5" opacity="0.3" fill="none">
    <path d="M 13.5,35 L 13.5,32.5 L 16,32.5" />
    <path d="M 86.5,35 L 86.5,32.5 L 84,32.5" />
    <path d="M 13.5,65 L 13.5,67.5 L 16,67.5" />
    <path d="M 86.5,65 L 86.5,67.5 L 84,67.5" />
  </g>

  <!-- Masked Moving Scanline Overlay -->
  <g clip-path="url(#charClip)">
    <line x1="20" y1="50" x2="80" y2="50" stroke="#00F0FF" stroke-width="0.4" opacity="0.3" class="scanline-bar" filter="url(#glow)" />
  </g>

  <!-- CHARACTER 1: THE HIGH-FIDELITY CYBER APE -->
  <g class="char-layer char-ape">
    <!-- Drop Shadow Base -->
    <ellipse cx="50" cy="76" rx="12" ry="1.8" fill="rgba(0,0,0,0.5)" />
    
    <!-- Ribbed Beanie Hat (Graphite) -->
    <path d="M 33.5,41 C 33.5,24 66.5,24 66.5,41 Z" fill="url(#graphiteGrad)" stroke="#1a1a24" stroke-width="0.8" />
    <!-- Beanie Ribbed Texture Lines -->
    <g stroke="#121217" stroke-width="0.6" opacity="0.5">
      <path d="M 38,28 C 39,32 40,36 40,41" />
      <path d="M 43,26 C 44,30 45,35 45,41" />
      <path d="M 48,25.2 C 49,30 49,35 49,41" />
      <path d="M 52,25.2 C 51,30 51,35 51,41" />
      <path d="M 57,26 C 56,30 55,35 55,41" />
      <path d="M 62,28 C 61,32 60,36 60,41" />
    </g>
    <!-- Beanie Fold-up Band -->
    <path d="M 31.5,39 C 31.5,38 68.5,38 68.5,39 L 67.5,43.5 C 67.5,44.5 32.5,44.5 32.5,43.5 Z" fill="url(#darkMetalGrad)" stroke="#121217" stroke-width="0.6" />
    <!-- Specular shine on beanie fold -->
    <path d="M 32.5,39 H 67.5 V 40.5 H 32.5 Z" fill="url(#specularGrad)" />
    <!-- Beanie Woven Label (Carbon-Fiber with cyan branding) -->
    <rect x="45.5" y="39.5" width="9" height="3.5" rx="0.5" fill="url(#carbonFiber)" stroke="url(#brandGrad)" stroke-width="0.4" />
    <text x="50" y="42" font-family="'JetBrains Mono', monospace" font-size="1.8" font-weight="900" fill="#00F0FF" text-anchor="middle" letter-spacing="0.1">LNC</text>

    <!-- Ape Head Structure (Graphite & Details) -->
    <!-- Ears -->
    <circle cx="32" cy="51" r="4.5" fill="url(#graphiteGrad)" stroke="#1a1a24" stroke-width="0.6" />
    <circle cx="32" cy="51" r="2.8" fill="#15151f" stroke="#00f0ff" stroke-width="0.4" />
    <circle cx="68" cy="51" r="4.5" fill="url(#graphiteGrad)" stroke="#1a1a24" stroke-width="0.6" />
    <circle cx="68" cy="51" r="2.8" fill="#15151f" stroke="#00f0ff" stroke-width="0.4" />

    <!-- Main Face Area -->
    <path d="M 34.5,48.5 C 34.5,64.5 65.5,64.5 65.5,48.5 C 65.5,42.5 61.5,39.5 50,39.5 C 38.5,39.5 34.5,42.5 34.5,48.5 Z" fill="url(#darkMetalGrad)" stroke="#121217" stroke-width="0.8" />

    <!-- Visor Sunglasses (Carbon Fiber Frame with Specular Visor) -->
    <!-- Visor Frame -->
    <path d="M 33.5,44 C 35,42 65,42 66.5,44 L 64.5,52.5 C 63,54.5 37,54.5 35.5,52.5 Z" fill="url(#carbonFiber)" stroke="#121217" stroke-width="0.8" />
    <!-- Visor Lens -->
    <path d="M 35,45 C 36.5,43.5 63.5,43.5 65,45 L 63.2,51.2 C 62,52.8 38,52.8 36.8,51.2 Z" fill="url(#visorGrad)" stroke="#ffffff" stroke-width="0.3" opacity="0.9" />
    <!-- Visor Specular Sheen -->
    <path d="M 35.5,45.2 C 37,44.2 63,44.2 64.5,45.2 L 63.8,47 C 62.5,46.2 37.5,46.2 36.2,47 Z" fill="#ffffff" opacity="0.4" />
    <line x1="39" y1="46" x2="42" y2="50" stroke="#ffffff" stroke-width="0.6" opacity="0.3" stroke-linecap="round" />
    <line x1="40.5" y1="46" x2="43.5" y2="50" stroke="#ffffff" stroke-width="0.3" opacity="0.2" stroke-linecap="round" />

    <!-- Muzzle / Snout (Graphite with detailed creases) -->
    <path d="M 40.5,54.5 C 40.5,63.5 59.5,63.5 59.5,54.5 C 59.5,51.5 40.5,51.5 40.5,54.5 Z" fill="url(#graphiteGrad)" stroke="#1a1a24" stroke-width="0.6" />
    <!-- Nose Creases / Nostrils -->
    <path d="M 48.5,53.8 Q 50,55.2 51.5,53.8" fill="none" stroke="#121217" stroke-width="0.8" stroke-linecap="round" />
    <ellipse cx="48.2" cy="55.2" rx="0.8" ry="0.5" fill="#121217" />
    <ellipse cx="51.8" cy="55.2" rx="0.8" ry="0.5" fill="#121217" />
    <!-- Mouth Grin (Streetwear stitching look) -->
    <path d="M 44.5,58 Q 50,60.8 55.5,58" fill="none" stroke="#00F0FF" stroke-width="0.6" stroke-linecap="round" />

    <!-- Hoodie Collar & Strings (Carbon Fiber) -->
    <path d="M 35,63.5 C 32,71.5 68,71.5 65,63.5 L 59,71 H 41 Z" fill="url(#carbonFiber)" stroke="#121217" stroke-width="0.8" />
    <!-- Metallic Drawstring Grommets -->
    <circle cx="44" cy="68.5" r="1.3" fill="url(#graphiteGrad)" stroke="#ffffff" stroke-width="0.3" />
    <circle cx="56" cy="68.5" r="1.3" fill="url(#graphiteGrad)" stroke="#ffffff" stroke-width="0.3" />
    <!-- Hanging Strings with Metallic Tips -->
    <path d="M 44,69.5 C 43,72 45,74 44.5,76.5" fill="none" stroke="#1a1a24" stroke-width="0.8" stroke-linecap="round" />
    <rect x="43.8" y="76.5" width="1.4" height="2.5" rx="0.3" fill="url(#graphiteGrad)" stroke="#ffffff" stroke-width="0.2" />
    <path d="M 56,69.5 C 57,72 55,74 55.5,76.5" fill="none" stroke="#1a1a24" stroke-width="0.8" stroke-linecap="round" />
    <rect x="54.8" y="76.5" width="1.4" height="2.5" rx="0.3" fill="url(#graphiteGrad)" stroke="#ffffff" stroke-width="0.2" />
  </g>

  <!-- CHARACTER 2: THE HIGH-FIDELITY CYBER SKULL -->
  <g class="char-layer char-skull" opacity="0">
    <!-- Drop Shadow Base -->
    <ellipse cx="50" cy="76" rx="12" ry="1.8" fill="rgba(0,0,0,0.5)" />
    
    <!-- Crossed Bones (Graphite with amber outline) -->
    <g stroke="url(#graphiteGrad)" stroke-width="3" stroke-linecap="round" opacity="0.95">
      <line x1="28" y1="28" x2="72" y2="72" stroke="url(#graphiteGrad)" />
      <line x1="72" y1="28" x2="28" y2="72" stroke="url(#graphiteGrad)" />
    </g>
    <!-- Bone End Lobes -->
    <g fill="url(#graphiteGrad)" stroke="#1a1a24" stroke-width="0.5">
      <!-- Top Left -->
      <circle cx="26" cy="26" r="2.2" /><circle cx="29" cy="27" r="1.8" />
      <!-- Top Right -->
      <circle cx="74" cy="26" r="2.2" /><circle cx="71" cy="27" r="1.8" />
      <!-- Bottom Left -->
      <circle cx="26" cy="74" r="2.2" /><circle cx="29" cy="73" r="1.8" />
      <!-- Bottom Right -->
      <circle cx="74" cy="74" r="2.2" /><circle cx="71" cy="73" r="1.8" />
    </g>

    <!-- Skull Structure (Polished Graphite / Bone structure) -->
    <path d="M 36.5,45 C 36.5,33.5 63.5,33.5 63.5,45 C 63.5,55.5 60.5,56.5 57,58.5 L 56.5,65.5 C 56.5,67 43.5,67 43.5,65.5 L 43,58.5 C 39.5,56.5 36.5,55.5 36.5,45 Z" fill="url(#graphiteGrad)" stroke="#15151f" stroke-width="0.8" />
    
    <!-- Specular Highlight on Skull Forehead -->
    <path d="M 37.5,44.5 C 37.5,34.5 62.5,34.5 62.5,44.5 C 62.5,41 37.5,41 37.5,44.5 Z" fill="url(#specularGrad)" opacity="0.6" />

    <!-- Deep Temporal Shading (Dimension Folds) -->
    <path d="M 37,45 Q 40,43 40,48 Q 40,53 37,51 Z" fill="#121217" opacity="0.3" />
    <path d="M 63,45 Q 60,43 60,48 Q 60,53 63,51 Z" fill="#121217" opacity="0.3" />

    <!-- Backward Snapback Cap (Carbon Fiber Body with Metal Details) -->
    <path d="M 36,43 C 36,31 64,31 64,43 Z" fill="url(#carbonFiber)" stroke="#121217" stroke-width="0.6" />
    <path d="M 31.8,42 Q 50,38 68.2,42" fill="none" stroke="url(#brandGrad)" stroke-width="1.2" stroke-linecap="round" filter="url(#glow)" />
    <!-- Snapback adjustable strap at the front forehead -->
    <rect x="42.5" y="42.5" width="15" height="3" rx="0.5" fill="#121217" stroke="#333" stroke-width="0.3" />
    <circle cx="44.5" cy="44" r="0.4" fill="#FFAA33" />
    <circle cx="46.5" cy="44" r="0.4" fill="#FFAA33" />
    <circle cx="48.5" cy="44" r="0.4" fill="#FFAA33" />
    <circle cx="50.5" cy="44" r="0.4" fill="#FFAA33" />
    <circle cx="52.5" cy="44" r="0.4" fill="#FFAA33" />
    <circle cx="54.5" cy="44" r="0.4" fill="#FFAA33" />
    <circle cx="56.5" cy="44" r="0.4" fill="#FFAA33" />

    <!-- Eye Sockets (Deep black with cyber HUD targets) -->
    <!-- Left Socket -->
    <polygon points="38.5,46.5 41.5,43.5 46.5,45.5 46.5,49.5 43,51.5 39.5,49.8" fill="#111116" stroke="#252530" stroke-width="0.4" />
    <!-- Right Socket -->
    <polygon points="61.5,46.5 58.5,43.5 53.5,45.5 53.5,49.5 57,51.5 60.5,49.8" fill="#111116" stroke="#252530" stroke-width="0.4" />
    
    <!-- Glowing Cybernetic HUD Eyes (Amber) -->
    <circle cx="42.8" cy="47.2" r="2.2" fill="none" stroke="#FFAA33" stroke-width="0.3" stroke-dasharray="1.5 1.5" class="glowing-eye" />
    <circle cx="42.8" cy="47.2" r="0.8" fill="#FFAA33" />
    <circle cx="57.2" cy="47.2" r="2.2" fill="none" stroke="#FFAA33" stroke-width="0.3" stroke-dasharray="1.5 1.5" class="glowing-eye" />
    <circle cx="57.2" cy="47.2" r="0.8" fill="#FFAA33" />

    <!-- Nose Cavity (Upside-down heart detail) -->
    <path d="M 50,50 L 48,53 Q 50,54 52,53 Z" fill="#111116" stroke="#252530" stroke-width="0.3" />

    <!-- Teeth and Jaw structure (Graphite & Individual white pieces) -->
    <rect x="44" y="56" width="12" height="4.5" rx="0.8" fill="#111116" stroke="#1d1d26" stroke-width="0.4" />
    <!-- Individual Top Teeth -->
    <rect x="45.2" y="56.2" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <rect x="47.2" y="56.2" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <rect x="49.2" y="56.2" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <rect x="51.2" y="56.2" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <rect x="53.2" y="56.2" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <!-- Individual Bottom Teeth -->
    <rect x="45.2" y="58.3" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <rect x="47.2" y="58.3" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <rect x="49.2" y="58.3" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <rect x="51.2" y="58.3" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <rect x="53.2" y="58.3" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
    <!-- Grid separators -->
    <line x1="44" y1="58.1" x2="56" y2="58.1" stroke="#111116" stroke-width="0.3" />
  </g>

  <!-- CHARACTER 3: THE HIGH-FIDELITY CYBER CAT/BEAR -->
  <g class="char-layer char-cat" opacity="0">
    <!-- Drop Shadow Base -->
    <ellipse cx="50" cy="76" rx="12" ry="1.8" fill="rgba(0,0,0,0.5)" />
    
    <!-- Neck Collar -->
    <path d="M 37.5,61 Q 50,66.5 62.5,61 L 59.5,68.5 Q 50,71.5 40.5,68.5 Z" fill="url(#darkMetalGrad)" stroke="#ff6b9d" stroke-width="0.5" />

    <!-- Stitched Ears (Graphite ear backs with pink gradients) -->
    <!-- Left Ear -->
    <g>
      <polygon points="35.5,41.5 25.5,21.5 45,35.5" fill="url(#graphiteGrad)" stroke="#1a1a24" stroke-width="0.6" stroke-linejoin="round" />
      <polygon points="34.2,39 27.5,24.5 42,34.8" fill="url(#pinkGrad)" />
      <!-- Stitching lines across the border -->
      <line x1="28" y1="26" x2="31" y2="28" stroke="#ffffff" stroke-width="0.4" opacity="0.8" />
      <line x1="32" y1="31" x2="35" y2="33" stroke="#ffffff" stroke-width="0.4" opacity="0.8" />
    </g>
    <!-- Right Ear -->
    <g>
      <polygon points="64.5,41.5 74.5,21.5 55,35.5" fill="url(#graphiteGrad)" stroke="#1a1a24" stroke-width="0.6" stroke-linejoin="round" />
      <polygon points="65.8,39 72.5,24.5 58,34.8" fill="url(#pinkGrad)" />
      <!-- Stitching lines across the border -->
      <line x1="72" y1="26" x2="69" y2="28" stroke="#ffffff" stroke-width="0.4" opacity="0.8" />
      <line x1="68" y1="31" x2="65" y2="33" stroke="#ffffff" stroke-width="0.4" opacity="0.8" />
    </g>

    <!-- Head Base Structure -->
    <path d="M 34.5,41 C 29,49.2 30.2,60 37,64 C 43.8,67.8 56.2,67.8 63,64 C 69.8,60 71,49.2 65.5,41 C 65.5,38 34.5,38 34.5,41 Z" fill="url(#darkMetalGrad)" stroke="#121217" stroke-width="0.8" />
    <path d="M 35.5,40.5 C 38,39 62,39 64.5,40.5 Z" fill="url(#specularGrad)" opacity="0.5" />

    <!-- Forehead Stitching details (Streetwear patch styling) -->
    <g stroke="#ff6b9d" stroke-width="0.4" stroke-linecap="round" opacity="0.8">
      <line x1="50" y1="38" x2="50" y2="44" />
      <line x1="48" y1="40" x2="52" y2="40" /><line x1="48.5" y1="42.5" x2="51.5" y2="42.5" />
    </g>

    <!-- DJ Headphones (Graphite cuffs + Carbon Fiber outer plates) -->
    <!-- Headband -->
    <path d="M 31,34.5 C 31,18 69,18 69,34.5" fill="none" stroke="url(#graphiteGrad)" stroke-width="3" />
    <path d="M 32.5,34 C 32.5,19 67.5,19 67.5,34" fill="none" stroke="url(#specularGrad)" stroke-width="1" />
    <!-- Left Cup -->
    <g>
      <ellipse cx="29.5" cy="41" rx="4.5" ry="8" fill="url(#graphiteGrad)" stroke="#ff6b9d" stroke-width="0.6" />
      <ellipse cx="27.8" cy="41" rx="2.5" ry="5" fill="url(#carbonFiber)" />
      <!-- Swivel Joint -->
      <rect x="29" y="32" width="1.5" height="3" fill="#ffffff" opacity="0.6" />
    </g>
    <!-- Right Cup -->
    <g>
      <ellipse cx="70.5" cy="41" rx="4.5" ry="8" fill="url(#graphiteGrad)" stroke="#ff6b9d" stroke-width="0.6" />
      <ellipse cx="72.2" cy="41" rx="2.5" ry="5" fill="url(#carbonFiber)" />
      <!-- Swivel Joint -->
      <rect x="69.5" y="32" width="1.5" height="3" fill="#ffffff" opacity="0.6" />
    </g>

    <!-- Cross-Stitch Glowing Eyes (X X Pink Neon) -->
    <!-- Left Eye X -->
    <g filter="url(#glow)">
      <line x1="36.5" y1="46" x2="43.5" y2="53" stroke="url(#pinkGrad)" stroke-width="1.8" stroke-linecap="round" />
      <line x1="43.5" y1="46" x2="36.5" y2="53" stroke="url(#pinkGrad)" stroke-width="1.8" stroke-linecap="round" />
    </g>
    <!-- Right Eye X -->
    <g filter="url(#glow)">
      <line x1="56.5" y1="46" x2="63.5" y2="53" stroke="url(#pinkGrad)" stroke-width="1.8" stroke-linecap="round" />
      <line x1="63.5" y1="46" x2="56.5" y2="53" stroke="url(#pinkGrad)" stroke-width="1.8" stroke-linecap="round" />
    </g>

    <!-- Nose (Minimal pink triangle) -->
    <polygon points="49,54.5 51,54.5 50,56" fill="#ff6b9d" />

    <!-- Cheek stitches/scars -->
    <g stroke="#ff6b9d" stroke-width="0.3" stroke-linecap="round" opacity="0.7">
      <!-- Left Cheek -->
      <line x1="32" y1="53.5" x2="34.5" y2="55.5" /><line x1="34" y1="53" x2="32.5" y2="56" />
      <!-- Right Cheek -->
      <line x1="68" y1="53.5" x2="65.5" y2="55.5" /><line x1="66" y1="53" x2="67.5" y2="56" />
    </g>

    <!-- Devious Fang Grin (Pink outline, white individual fangs) -->
    <path d="M 40,58 Q 50,65.5 60,58 Q 50,61 40,58 Z" fill="#111116" stroke="#ff6b9d" stroke-width="0.6" stroke-linejoin="round" />
    <!-- White Fangs -->
    <polygon points="42.8,58.4 44.8,58.4 43.8,61.2" fill="#ffffff" />
    <polygon points="57.2,58.4 55.2,58.4 56.2,61.2" fill="#ffffff" />
  </g>

  <!-- Foreground Badge / Brand Label -->
  <g fill="none" stroke="url(#brandGrad)" stroke-width="0.4" opacity="0.8">
    <path d="M 23.5,88.5 C 36,93 64,93 76.5,88.5" />
    <path d="M 23.5,11.5 C 36,7 64,7 76.5,11.5" />
  </g>
  <rect x="42.5" y="87" width="15" height="3.8" rx="0.8" fill="#121217" stroke="url(#brandGrad)" stroke-width="0.3" />
  <text x="50" y="89.8" font-family="'JetBrains Mono', monospace" font-size="1.8" font-weight="900" fill="#00F0FF" text-anchor="middle" letter-spacing="0.2">MORPH.v2</text>`;
    } else {
      emblemContents = `
  <!-- Minimalist Spark Frame -->
  <rect x="12" y="12" width="76" height="76" rx="16" fill="none" stroke="${p}" stroke-width="2.5" opacity="0.3" filter="url(#glow)" />
  <path d="M 50,22 Q 50,50 22,50 Q 50,50 50,78 Q 50,50 78,50 Q 50,50 50,22 Z" fill="url(#brandGrad)" filter="url(#glow)" ${activeMotion === 'pulse' ? 'class="d-pulse-path"' : ''} />`;
    }

    if (activeMotion === 'spin' && frame !== 'streetwear') {
      emblemContents = `<g class="spin-logo-g">${emblemContents}</g>`;
    }

    let extraDefs = '';
    if (frame === 'streetwear') {
      extraDefs = `
    <!-- Carbon Fiber Pattern -->
    <pattern id="carbonFiber" width="6" height="6" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="#121217" />
      <path d="M0,3 L6,3 M3,0 L3,6" stroke="#1d1d26" stroke-width="0.8" />
      <path d="M0,0 L6,6 M0,6 L6,0" stroke="#0a0a0f" stroke-width="0.4" opacity="0.8" />
      <rect width="3" height="3" fill="#1a1a24" opacity="0.4" />
      <rect x="3" y="3" width="3" height="3" fill="#0d0d12" opacity="0.4" />
    </pattern>

    <!-- Metallic Graphite Gradients -->
    <linearGradient id="graphiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#555566" />
      <stop offset="20%" stop-color="#2a2a35" />
      <stop offset="40%" stop-color="#15151f" />
      <stop offset="60%" stop-color="#3d3d4f" />
      <stop offset="80%" stop-color="#111116" />
      <stop offset="100%" stop-color="#22222d" />
    </linearGradient>

    <linearGradient id="darkMetalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2d2d3a" />
      <stop offset="50%" stop-color="#181822" />
      <stop offset="100%" stop-color="#09090d" />
    </linearGradient>

    <!-- Specular Highlight Overlay -->
    <linearGradient id="specularGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3" />
      <stop offset="35%" stop-color="#ffffff" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>

    <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b9d" />
      <stop offset="100%" stop-color="#6c63ff" />
    </linearGradient>

    <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#00F0FF" />
      <stop offset="50%" stop-color="#6c63ff" />
      <stop offset="100%" stop-color="#ff6b9d" />
    </linearGradient>
    
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    
    <clipPath id="charClip">
      <circle cx="50" cy="50" r="36" />
    </clipPath>`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="${shadowSize / 4}" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p}" />
      <stop offset="100%" stop-color="${s}" />
    </linearGradient>${extraDefs}${styleBlock}
  </defs>
  ${emblemContents}
</svg>`;
  };

  // Generate the tailored React / JSX Code
  const getReactCode = () => {
    const p = activeColor.primary;
    const s = activeColor.secondary;
    const frame = activeFrame;
    const speedSeconds = activePulseSpeed === 'fast' ? '1.0s' : activePulseSpeed === 'breathe' ? '5.0s' : '2.5s';

    let extraGradientsJSX = '';
    let styleJSX = '';
    if (frame === 'streetwear') {
      extraGradientsJSX = `
        {/* Carbon Fiber Pattern */}
        <pattern id="carbonFiber" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#121217" />
          <path d="M0,3 L6,3 M3,0 L3,6" stroke="#1d1d26" strokeWidth="0.8" />
          <path d="M0,0 L6,6 M0,6 L6,0" stroke="#0a0a0f" strokeWidth="0.4" opacity="0.8" />
          <rect width="3" height="3" fill="#1a1a24" opacity="0.4" />
          <rect x="3" y="3" width="3" height="3" fill="#0d0d12" opacity="0.4" />
        </pattern>

        {/* Metallic Graphite Gradients */}
        <linearGradient id="graphiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#555566" />
          <stop offset="20%" stopColor="#2a2a35" />
          <stop offset="40%" stopColor="#15151f" />
          <stop offset="60%" stopColor="#3d3d4f" />
          <stop offset="80%" stopColor="#111116" />
          <stop offset="100%" stopColor="#22222d" />
        </linearGradient>

        <linearGradient id="darkMetalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2d2d3a" />
          <stop offset="50%" stopColor="#181822" />
          <stop offset="100%" stopColor="#09090d" />
        </linearGradient>

        {/* Specular Highlight Overlay */}
        <linearGradient id="specularGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b9d" />
          <stop offset="100%" stopColor="#6c63ff" />
        </linearGradient>

        <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="50%" stopColor="#6c63ff" />
          <stop offset="100%" stopColor="#ff6b9d" />
        </linearGradient>
        
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <clipPath id="charClip">
          <circle cx="50" cy="50" r="36" />
        </clipPath>`;
      
      styleJSX = `
        <style>
          @keyframes rotateCW {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes rotateCCW {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
          @keyframes scanline {
            0% { transform: translateY(-36px); }
            100% { transform: translateY(36px); }
          }
          @keyframes characterMorph {
            0%, 28% { opacity: 1; transform: translate(0, 0) scale(1); }
            33%, 95% { opacity: 0; transform: translate(0, 2px) scale(0.92); }
            100% { opacity: 1; transform: translate(0, 0) scale(1); }
          }
          .g-rotate-cw {
            transform-origin: 50px 50px;
            animation: rotateCW 25s linear infinite;
          }
          .g-rotate-ccw {
            transform-origin: 50px 50px;
            animation: rotateCCW 20s linear infinite;
          }
          .scanline-bar {
            animation: scanline 4s linear infinite;
          }
          .char-layer {
            transform-origin: 50px 50px;
            animation: characterMorph 15s ease-in-out infinite;
          }
          .char-ape { animation-delay: 0s; }
          .char-skull { animation-delay: 5s; }
          .char-cat { animation-delay: 10s; }
        </style>`;
    } else if (activeMotion === 'pulse') {
      styleJSX = `
        <style>
          @keyframes dPulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.95; }
          }
          .d-pulse-path {
            animation: dPulse ${speedSeconds} ease-in-out infinite;
          }
        </style>`;
    } else if (activeMotion === 'spin') {
      styleJSX = `
        <style>
          @keyframes spinLogo {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin-logo-g {
            transform-origin: 50px 50px;
            animation: spinLogo 8s linear infinite;
          }
        </style>`;
    }

    let emblemJSX = '';
    if (frame === 'hexagon') {
      emblemJSX = `
        {/* Pipeline Nexus Hexagon */}
        <polygon points="50,3 91,25 91,75 50,97 9,75 9,25" fill="none" stroke="${p}" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="50,8 87,28 87,72 50,92 13,72 13,28" fill="none" stroke="${s}" strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />
        
        <g transform="translate(20, 20)" fill="url(#linacreGrad)">
          <rect x="5" y="5" width="8" height="8" rx="2" opacity="0.4" />
          <rect x="18" y="5" width="8" height="8" rx="2" opacity="0.6" />
          <rect x="31" y="5" width="8" height="8" rx="2" />
          <rect x="44" y="5" width="8" height="8" rx="2" opacity="0.6" />
          <rect x="5" y="18" width="8" height="8" rx="2" opacity="0.5" />
          <rect x="18" y="18" width="8" height="8" rx="2" opacity="0.8" />
          <rect x="31" y="18" width="8" height="8" rx="2" fill="${s}" />
          <rect x="44" y="18" width="8" height="8" rx="2" opacity="0.5" />
          <rect x="18" y="31" width="22" height="8" rx="2" fill="#ff6b9d" className="${activeMotion === 'pulse' ? 'd-pulse-path' : ''}" />
          <rect x="5" y="31" width="8" height="8" rx="2" opacity="0.6" />
          <rect x="44" y="31" width="8" height="8" rx="2" opacity="0.6" />
          <rect x="5" y="44" width="8" height="8" rx="2" opacity="0.4" />
          <rect x="18" y="44" width="8" height="8" rx="2" opacity="0.6" />
          <rect x="31" y="44" width="8" height="8" rx="2" />
          <rect x="44" y="44" width="8" height="8" rx="2" opacity="0.4" />
        </g>`;
    } else if (frame === 'circle') {
      emblemJSX = `
        {/* Aether Orb Center */}
        <circle cx="50" cy="50" r="44" fill="none" stroke="${p}" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="39" fill="none" stroke="${s}" strokeWidth="1" strokeDasharray="5 3" opacity="0.4" />
        
        <circle cx="50" cy="50" r="16" fill="url(#linacreGrad)" />
        <circle cx="50" cy="50" r="22" fill="none" stroke="${s}" strokeWidth="1.5" className="${activeMotion === 'pulse' ? 'd-pulse-path' : ''}" />
        <path d="M 50,43 L 52,48 L 57,50 L 52,52 L 50,57 L 48,52 L 43,50 L 48,48 Z" fill="#ffffff" />`;
    } else if (frame === 'brackets') {
      emblemJSX = `
        {/* Code Brackets Frame */}
        <path d="M 24,12 L 10,12 L 10,88 L 24,88" fill="none" stroke="${p}" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 76,12 L 90,12 L 90,88 L 76,88" fill="none" stroke="${p}" strokeWidth="4.5" strokeLinecap="round" />
        
        <g transform="translate(34, 40)" fill="url(#linacreGrad)">
          <path d="M 0,4 L 12,10 L 0,16" fill="none" stroke="${p}" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="18" y="15" width="14" height="3" rx="1.5" fill="${s}" className="${activeMotion === 'pulse' ? 'd-pulse-path' : ''}" />
        </g>`;
    } else if (frame === 'streetwear') {
      emblemJSX = `
        {/* Background Component */}
        <circle cx="50" cy="50" r="47" fill="url(#darkMetalGrad)" stroke="#1a1a26" strokeWidth="1.5" />
        
        {/* Rotating Technical Rings */}
        <circle cx="50" cy="50" r="44" fill="none" stroke="url(#linacreGrad)" strokeWidth="0.8" strokeDasharray="16 28 8 12" className="g-rotate-cw" opacity="0.9" filter="url(#linacreGlow)" />
        <circle cx="50" cy="50" r="41.8" fill="none" stroke="${s}" strokeWidth="0.5" strokeDasharray="6 30 18 6" className="g-rotate-ccw" opacity="0.6" />
        <circle cx="50" cy="50" r="39.5" fill="none" stroke="#ffffff" strokeWidth="0.25" strokeDasharray="1 4" opacity="0.2" />

        {/* Corner Crosshair Brackets */}
        <g stroke="#ffffff" strokeWidth="0.5" opacity="0.3" fill="none">
          <path d="M 13.5,35 L 13.5,32.5 L 16,32.5" />
          <path d="M 86.5,35 L 86.5,32.5 L 84,32.5" />
          <path d="M 13.5,65 L 13.5,67.5 L 16,67.5" />
          <path d="M 86.5,65 L 86.5,67.5 L 84,67.5" />
        </g>

        {/* Masked Moving Scanline Overlay */}
        <g clipPath="url(#charClip)">
          <line x1="20" y1="50" x2="80" y2="50" stroke="#00F0FF" strokeWidth="0.4" opacity="0.3" className="scanline-bar" filter="url(#linacreGlow)" />
        </g>

        {/* CHARACTER 1: THE HIGH-FIDELITY CYBER APE */}
        <g className="char-layer char-ape">
          {/* Drop Shadow Base */}
          <ellipse cx="50" cy="76" rx="12" ry="1.8" fill="rgba(0,0,0,0.5)" />
          
          {/* Ribbed Beanie Hat (Graphite) */}
          <path d="M 33.5,41 C 33.5,24 66.5,24 66.5,41 Z" fill="url(#graphiteGrad)" stroke="#1a1a24" strokeWidth="0.8" />
          {/* Beanie Ribbed Texture Lines */}
          <g stroke="#121217" strokeWidth="0.6" opacity="0.5">
            <path d="M 38,28 C 39,32 40,36 40,41" />
            <path d="M 43,26 C 44,30 45,35 45,41" />
            <path d="M 48,25.2 C 49,30 49,35 49,41" />
            <path d="M 52,25.2 C 51,30 51,35 51,41" />
            <path d="M 57,26 C 56,30 55,35 55,41" />
            <path d="M 62,28 C 61,32 60,36 60,41" />
          </g>
          {/* Beanie Fold-up Band */}
          <path d="M 31.5,39 C 31.5,38 68.5,38 68.5,39 L 67.5,43.5 C 67.5,44.5 32.5,44.5 32.5,43.5 Z" fill="url(#darkMetalGrad)" stroke="#121217" strokeWidth="0.6" />
          {/* Specular shine on beanie fold */}
          <path d="M 32.5,39 H 67.5 V 40.5 H 32.5 Z" fill="url(#specularGrad)" />
          {/* Beanie Woven Label */}
          <rect x="45.5" y="39.5" width="9" height="3.5" rx="0.5" fill="url(#carbonFiber)" stroke="url(#linacreGrad)" strokeWidth="0.4" />
          <text x="50" y="42" fontFamily="'JetBrains Mono', monospace" fontSize="1.8" fontWeight="900" fill="#00F0FF" textAnchor="middle" letterSpacing="0.1">LNC</text>

          {/* Ape Head Structure */}
          {/* Ears */}
          <circle cx="32" cy="51" r="4.5" fill="url(#graphiteGrad)" stroke="#1a1a24" strokeWidth="0.6" />
          <circle cx="32" cy="51" r="2.8" fill="#15151f" stroke="#00f0ff" strokeWidth="0.4" />
          <circle cx="68" cy="51" r="4.5" fill="url(#graphiteGrad)" stroke="#1a1a24" strokeWidth="0.6" />
          <circle cx="68" cy="51" r="2.8" fill="#15151f" stroke="#00f0ff" strokeWidth="0.4" />

          {/* Face */}
          <path d="M 34.5,48.5 C 34.5,64.5 65.5,64.5 65.5,48.5 C 65.5,42.5 61.5,39.5 50,39.5 C 38.5,39.5 34.5,42.5 34.5,48.5 Z" fill="url(#darkMetalGrad)" stroke="#121217" strokeWidth="0.8" />

          {/* Visor Sunglasses */}
          <path d="M 33.5,44 C 35,42 65,42 66.5,44 L 64.5,52.5 C 63,54.5 37,54.5 35.5,52.5 Z" fill="url(#carbonFiber)" stroke="#121217" strokeWidth="0.8" />
          <path d="M 35,45 C 36.5,43.5 63.5,43.5 65,45 L 63.2,51.2 C 62,52.8 38,52.8 36.8,51.2 Z" fill="url(#visorGrad)" stroke="#ffffff" strokeWidth="0.3" opacity="0.9" />
          <path d="M 35.5,45.2 C 37,44.2 63,44.2 64.5,45.2 L 63.8,47 C 62.5,46.2 37.5,46.2 36.2,47 Z" fill="#ffffff" opacity="0.4" />
          <line x1="39" y1="46" x2="42" y2="50" stroke="#ffffff" strokeWidth="0.6" opacity="0.3" strokeLinecap="round" />
          <line x1="40.5" y1="46" x2="43.5" y2="50" stroke="#ffffff" strokeWidth="0.3" opacity="0.2" strokeLinecap="round" />

          {/* Muzzle */}
          <path d="M 40.5,54.5 C 40.5,63.5 59.5,63.5 59.5,54.5 C 59.5,51.5 40.5,51.5 40.5,54.5 Z" fill="url(#graphiteGrad)" stroke="#1a1a24" strokeWidth="0.6" />
          <path d="M 48.5,53.8 Q 50,55.2 51.5,53.8" fill="none" stroke="#121217" strokeWidth="0.8" strokeLinecap="round" />
          <ellipse cx="48.2" cy="55.2" rx="0.8" ry="0.5" fill="#121217" />
          <ellipse cx="51.8" cy="55.2" rx="0.8" ry="0.5" fill="#121217" />
          <path d="M 44.5,58 Q 50,60.8 55.5,58" fill="none" stroke="#00F0FF" strokeWidth="0.6" strokeLinecap="round" />

          {/* Hoodie Collar */}
          <path d="M 35,63.5 C 32,71.5 68,71.5 65,63.5 L 59,71 H 41 Z" fill="url(#carbonFiber)" stroke="#121217" strokeWidth="0.8" />
          <circle cx="44" cy="68.5" r="1.3" fill="url(#graphiteGrad)" stroke="#ffffff" strokeWidth="0.3" />
          <circle cx="56" cy="68.5" r="1.3" fill="url(#graphiteGrad)" stroke="#ffffff" strokeWidth="0.3" />
          <path d="M 44,69.5 C 43,72 45,74 44.5,76.5" fill="none" stroke="#1a1a24" strokeWidth="0.8" strokeLinecap="round" />
          <rect x="43.8" y="76.5" width="1.4" height="2.5" rx="0.3" fill="url(#graphiteGrad)" stroke="#ffffff" strokeWidth="0.2" />
          <path d="M 56,69.5 C 57,72 55,74 55.5,76.5" fill="none" stroke="#1a1a24" strokeWidth="0.8" strokeLinecap="round" />
          <rect x="54.8" y="76.5" width="1.4" height="2.5" rx="0.3" fill="url(#graphiteGrad)" stroke="#ffffff" stroke-width="0.2" />
        </g>

        {/* CHARACTER 2: THE HIGH-FIDELITY CYBER SKULL */}
        <g className="char-layer char-skull" opacity="0">
          <ellipse cx="50" cy="76" rx="12" ry="1.8" fill="rgba(0,0,0,0.5)" />
          
          <g stroke="url(#linacreGrad)" strokeWidth="3" strokeLinecap="round" opacity="0.95">
            <line x1="28" y1="28" x2="72" y2="72" />
            <line x1="72" y1="28" x2="28" y2="72" />
          </g>
          <g fill="url(#graphiteGrad)" stroke="#1a1a24" strokeWidth="0.5">
            <circle cx="26" cy="26" r="2.2" /><circle cx="29" cy="27" r="1.8" />
            <circle cx="74" cy="26" r="2.2" /><circle cx="71" cy="27" r="1.8" />
            <circle cx="26" cy="74" r="2.2" /><circle cx="29" cy="73" r="1.8" />
            <circle cx="74" cy="74" r="2.2" /><circle cx="71" cy="73" r="1.8" />
          </g>

          <path d="M 36.5,45 C 36.5,33.5 63.5,33.5 63.5,45 C 63.5,55.5 60.5,56.5 57,58.5 L 56.5,65.5 C 56.5,67 43.5,67 43.5,65.5 L 43,58.5 C 39.5,56.5 36.5,55.5 36.5,45 Z" fill="url(#graphiteGrad)" stroke="#15151f" strokeWidth="0.8" />
          <path d="M 37.5,44.5 C 37.5,34.5 62.5,34.5 62.5,44.5 C 62.5,41 37.5,41 37.5,44.5 Z" fill="url(#specularGrad)" opacity="0.6" />
          <path d="M 37,45 Q 40,43 40,48 Q 40,53 37,51 Z" fill="#121217" opacity="0.3" />
          <path d="M 63,45 Q 60,43 60,48 Q 60,53 63,51 Z" fill="#121217" opacity="0.3" />

          {/* Cap */}
          <path d="M 36,43 C 36,31 64,31 64,43 Z" fill="url(#carbonFiber)" stroke="#121217" strokeWidth="0.6" />
          <path d="M 31.8,42 Q 50,38 68.2,42" fill="none" stroke="url(#linacreGrad)" strokeWidth="1.2" strokeLinecap="round" filter="url(#linacreGlow)" />
          <rect x="42.5" y="42.5" width="15" height="3" rx="0.5" fill="#121217" stroke="#333" strokeWidth="0.3" />
          <circle cx="44.5" cy="44" r="0.4" fill="#FFAA33" />
          <circle cx="46.5" cy="44" r="0.4" fill="#FFAA33" />
          <circle cx="48.5" cy="44" r="0.4" fill="#FFAA33" />
          <circle cx="50.5" cy="44" r="0.4" fill="#FFAA33" />
          <circle cx="52.5" cy="44" r="0.4" fill="#FFAA33" />
          <circle cx="54.5" cy="44" r="0.4" fill="#FFAA33" />
          <circle cx="56.5" cy="44" r="0.4" fill="#FFAA33" />

          {/* Sockets */}
          <polygon points="38.5,46.5 41.5,43.5 46.5,45.5 46.5,49.5 43,51.5 39.5,49.8" fill="#111116" stroke="#252530" strokeWidth="0.4" />
          <polygon points="61.5,46.5 58.5,43.5 53.5,45.5 53.5,49.5 57,51.5 60.5,49.8" fill="#111116" stroke="#252530" strokeWidth="0.4" />
          
          <circle cx="42.8" cy="47.2" r="2.2" fill="none" stroke="#FFAA33" strokeWidth="0.3" strokeDasharray="1.5 1.5" className="glowing-eye" />
          <circle cx="42.8" cy="47.2" r="0.8" fill="#FFAA33" />
          <circle cx="57.2" cy="47.2" r="2.2" fill="none" stroke="#FFAA33" strokeWidth="0.3" strokeDasharray="1.5 1.5" className="glowing-eye" />
          <circle cx="57.2" cy="47.2" r="0.8" fill="#FFAA33" />

          <path d="M 50,50 L 48,53 Q 50,54 52,53 Z" fill="#111116" stroke="#252530" strokeWidth="0.3" />

          {/* Teeth */}
          <rect x="44" y="56" width="12" height="4.5" rx="0.8" fill="#111116" stroke="#1d1d26" strokeWidth="0.4" />
          <rect x="45.2" y="56.2" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
          <rect x="47.2" y="56.2" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
          <rect x="49.2" y="56.2" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
          <rect x="51.2" y="56.2" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
          <rect x="53.2" y="56.2" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
          <rect x="45.2" y="58.3" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
          <rect x="47.2" y="58.3" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
          <rect x="49.2" y="58.3" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
          <rect x="51.2" y="58.3" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
          <rect x="53.2" y="58.3" width="1.6" height="2" rx="0.3" fill="#E2E2EC" />
          <line x1="44" y1="58.1" x2="56" y2="58.1" stroke="#111116" strokeWidth="0.3" />
        </g>

        {/* CHARACTER 3: THE HIGH-FIDELITY CYBER CAT/BEAR */}
        <g className="char-layer char-cat" opacity="0">
          <ellipse cx="50" cy="76" rx="12" ry="1.8" fill="rgba(0,0,0,0.5)" />
          
          <path d="M 37.5,61 Q 50,66.5 62.5,61 L 59.5,68.5 Q 50,71.5 40.5,68.5 Z" fill="url(#darkMetalGrad)" stroke="#ff6b9d" strokeWidth="0.5" />

          {/* Ears */}
          <g>
            <polygon points="35.5,41.5 25.5,21.5 45,35.5" fill="url(#graphiteGrad)" stroke="#1a1a24" strokeWidth="0.6" strokeLinejoin="round" />
            <polygon points="34.2,39 27.5,24.5 42,34.8" fill="url(#pinkGrad)" />
            <line x1="28" y1="26" x2="31" y2="28" stroke="#ffffff" strokeWidth="0.4" opacity="0.8" />
            <line x1="32" y1="31" x2="35" y2="33" stroke="#ffffff" strokeWidth="0.4" opacity="0.8" />
          </g>
          <g>
            <polygon points="64.5,41.5 74.5,21.5 55,35.5" fill="url(#graphiteGrad)" stroke="#1a1a24" strokeWidth="0.6" strokeLinejoin="round" />
            <polygon points="65.8,39 72.5,24.5 58,34.8" fill="url(#pinkGrad)" />
            <line x1="72" y1="26" x2="69" y2="28" stroke="#ffffff" strokeWidth="0.4" opacity="0.8" />
            <line x1="68" y1="31" x2="65" y2="33" stroke="#ffffff" strokeWidth="0.4" opacity="0.8" />
          </g>

          {/* Head Base */}
          <path d="M 34.5,41 C 29,49.2 30.2,60 37,64 C 43.8,67.8 56.2,67.8 63,64 C 69.8,60 71,49.2 65.5,41 C 65.5,38 34.5,38 34.5,41 Z" fill="url(#darkMetalGrad)" stroke="#121217" strokeWidth="0.8" />
          <path d="M 35.5,40.5 C 38,39 62,39 64.5,40.5 Z" fill="url(#specularGrad)" opacity="0.5" />

          {/* Forehead stitches */}
          <g stroke="#ff6b9d" strokeWidth="0.4" strokeLinecap="round" opacity="0.8">
            <line x1="50" y1="38" x2="50" y2="44" />
            <line x1="48" y1="40" x2="52" y2="40" /><line x1="48.5" y1="42.5" x2="51.5" y2="42.5" />
          </g>

          {/* Headphones */}
          <path d="M 31,34.5 C 31,18 69,18 69,34.5" fill="none" stroke="url(#graphiteGrad)" strokeWidth="3" />
          <path d="M 32.5,34 C 32.5,19 67.5,19 67.5,34" fill="none" stroke="url(#specularGrad)" strokeWidth="1" />
          <g>
            <ellipse cx="29.5" cy="41" rx="4.5" ry="8" fill="url(#graphiteGrad)" stroke="#ff6b9d" strokeWidth="0.6" />
            <ellipse cx="27.8" cy="41" rx="2.5" ry="5" fill="url(#carbonFiber)" />
            <rect x="29" y="32" width="1.5" height="3" fill="#ffffff" opacity="0.6" />
          </g>
          <g>
            <ellipse cx="70.5" cy="41" rx="4.5" ry="8" fill="url(#graphiteGrad)" stroke="#ff6b9d" strokeWidth="0.6" />
            <ellipse cx="72.2" cy="41" rx="2.5" ry="5" fill="url(#carbonFiber)" />
            <rect x="69.5" y="32" width="1.5" height="3" fill="#ffffff" opacity="0.6" />
          </g>

          {/* Eye X */}
          <g filter="url(#linacreGlow)">
            <line x1="36.5" y1="46" x2="43.5" y2="53" stroke="url(#pinkGrad)" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="43.5" y1="46" x2="36.5" y2="53" stroke="url(#pinkGrad)" stroke-width="1.8" stroke-linecap="round" />
          </g>
          <g filter="url(#linacreGlow)">
            <line x1="56.5" y1="46" x2="63.5" y2="53" stroke="url(#pinkGrad)" stroke-width="1.8" stroke-linecap="round" />
            <line x1="63.5" y1="46" x2="56.5" y2="53" stroke="url(#pinkGrad)" stroke-width="1.8" stroke-linecap="round" />
          </g>

          <polygon points="49,54.5 51,54.5 50,56" fill="#ff6b9d" />

          {/* Cheek stitches */}
          <g stroke="#ff6b9d" strokeWidth="0.3" strokeLinecap="round" opacity="0.7">
            <line x1="32" y1="53.5" x2="34.5" y2="55.5" /><line x1="34" y1="53" x2="32.5" y2="56" />
            <line x1="68" y1="53.5" x2="65.5" y2="55.5" /><line x1="66" y1="53" x2="67.5" y2="56" />
          </g>

          {/* Mouth */}
          <path d="M 40,58 Q 50,65.5 60,58 Q 50,61 40,58 Z" fill="#111116" stroke="#ff6b9d" strokeWidth="0.6" strokeLinejoin="round" />
          <polygon points="42.8,58.4 44.8,58.4 43.8,61.2" fill="#ffffff" />
          <polygon points="57.2,58.4 55.2,58.4 56.2,61.2" fill="#ffffff" />
        </g>

        {/* FOREGROUND LAYER */}
        <g fill="none" stroke="url(#linacreGrad)" strokeWidth="0.4" opacity="0.8">
          <path d="M 23.5,88.5 C 36,93 64,93 76.5,88.5" />
          <path d="M 23.5,11.5 C 36,7 64,7 76.5,11.5" />
        </g>
        <rect x="42.5" y="87" width="15" height="3.8" rx="0.8" fill="#121217" stroke="url(#linacreGrad)" strokeWidth="0.3" />
        <text x="50" y="89.8" fontFamily="'JetBrains Mono', monospace" fontSize="1.8" fontWeight="900" fill="#00F0FF" textAnchor="middle" letterSpacing="0.2">MORPH.v2</text>`;
    } else {
      emblemJSX = `
        {/* Minimalist Spark Frame */}
        <rect x="12" y="12" width="76" height="76" rx="16" fill="none" stroke="${p}" strokeWidth="2.5" opacity="0.3" />
        <path d="M 50,22 Q 50,50 22,50 Q 50,50 50,78 Q 50,50 78,50 Q 50,50 50,22 Z" fill="url(#linacreGrad)" className="${activeMotion === 'pulse' ? 'd-pulse-path' : ''}" />`;
    }

    return `import React from 'react';

export function LinacreEmblem({ className = 'w-16 h-16' }) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="linacreGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="${glowIntensity}" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="linacreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="${p}" />
          <stop offset="100%" stopColor="${s}" />
        </linearGradient>${extraGradientsJSX}${styleJSX}
      </defs>
      
      <g className="\${activeMotion === 'spin' && '${frame}' !== 'streetwear' ? 'spin-logo-g' : ''}" filter="url(#linacreGlow)">
        \${emblemJSX}
      </g>
    </svg>
  );
};`;
  };

  // Generate Email Signature HTML (Clean tables based HTML for cross-client compatibility)
  const getEmailSignatureHTML = () => {
    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${activeFont.displayFamily || 'sans-serif'}; color: #cdd6f4; background-color: #0d1117; padding: 20px; border-radius: 12px; border: 1px solid ${activeColor.primary}30; max-width: 500px;">
  <tr>
    <td style="vertical-align: top; padding-right: 20px; width: 80px;">
      <!-- Logo Vector Frame embedded cleanly inside table -->
      <div style="width: 70px; height: 70px; border: 1px solid ${activeColor.primary}40; border-radius: 10px; padding: 5px; background-color: #090b0f;">
        ${getSVGCode()}
      </div>
    </td>
    <td style="vertical-align: top; border-left: 1px solid #313244; padding-left: 20px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            <div style="font-size: 16px; font-weight: bold; color: #ffffff; letter-spacing: 0.5px; text-transform: uppercase; font-family: ${activeFont.displayFamily}">${userName}</div>
            <div style="font-size: 12px; color: ${activeColor.primary}; font-weight: 600; margin-top: 2px; font-family: ${activeFont.monoFamily}">${userTitle}</div>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 10px;">
            <div style="font-size: 11px; color: #a6adc8; line-height: 1.4; font-family: ${activeFont.displayFamily}">${userBio}</div>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 12px;">
            <table cellpadding="0" cellspacing="0" border="0" style="font-size: 11px; font-family: ${activeFont.monoFamily}">
              <tr>
                <td style="padding-right: 15px; color: #89b4fa;"><span style="color: ${activeColor.primary};">&gt;</span> <a href="mailto:${userEmail}" style="color: #a6adc8; text-decoration: none;">${userEmail}</a></td>
                <td style="color: #89b4fa;"><span style="color: ${activeColor.primary};">&gt;</span> <a href="${userWebsite}" style="color: #a6adc8; text-decoration: none;">linacre.site</a></td>
              </tr>
              <tr>
                <td style="padding-top: 4px; padding-right: 15px; color: #89b4fa;"><span style="color: ${activeColor.primary};">&gt;</span> <a href="https://${userGithub}" style="color: #a6adc8; text-decoration: none;">github</a></td>
                <td style="padding-top: 4px; color: #89b4fa;"><span style="color: ${activeColor.primary};">&gt;</span> <a href="https://${userLinkedin}" style="color: #a6adc8; text-decoration: none;">linkedin</a></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
  };

  // Helper to copy code to clipboard
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    triggerCopyFeedback(type);
  };

  // Copy Email Signature to clipboard as RICH TEXT (so they can paste straight into Outlook / Gmail!)
  const handleCopyRichTextSignature = () => {
    try {
      const container = document.createElement('div');
      container.innerHTML = getEmailSignatureHTML();
      document.body.appendChild(container);
      
      // Select element contents
      const range = document.createRange();
      range.selectNode(container);
      
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
      }
      
      document.body.removeChild(container);
      triggerCopyFeedback('signature-rich');
    } catch (e) {
      // Fallback
      handleCopy(getEmailSignatureHTML(), 'signature-rich');
    }
  };

  // Trigger browser download for the SVG logo
  const downloadSVGAsset = () => {
    const svgCode = getSVGCode();
    const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = blobURL;
    downloadLink.download = `${userName.toLowerCase().replace(/\s+/g, '_')}_signature_emblem.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="space-y-10 pb-16" id="identity-brand-hub">
      {/* Inject Dynamic Google Fonts on the fly */}
      <style dangerouslySetInnerHTML={{ __html: activeFont.import }} />

      {/* Intro Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-amber-color bg-amber-color/10 px-2.5 py-1 rounded font-semibold border border-amber-color/20">
            Brand Assets & Identity Hub
          </span>
          <span className="text-xs text-muted-foreground">· Dynamic Canvas Engine</span>
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-color animate-pulse" />
          <span>The New Linacre Signature Identity</span>
        </h2>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          Unify your digital footprint across socials, GitHub, and email clients. Customize your interactive vector monogram emblem, swap typography vibes, and download copy-pasteable assets built to represent David Linacre's pristine brand.
        </p>
      </div>

      {/* Main Grid: Designer Left, Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Settings (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-border-color bg-muted/10 dark:bg-[#10141d]/40 rounded-xl p-5 space-y-6 shadow-md">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 pb-2 border-b border-border-color/40">
              <Palette className="w-4 h-4 text-amber-color" />
              <span>Identity Customizer</span>
            </h3>

            {/* Customizer Option 1: Palette choice */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-color" />
                <span>Brand Color Signature</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveColor(c)}
                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-mono flex items-center gap-1.5 transition-all text-left cursor-pointer ${
                      activeColor.id === c.id
                        ? 'bg-muted/50 border-amber-color/80 dark:border-amber-color text-foreground shadow-sm'
                        : 'bg-background/20 border-border-color/60 text-muted-foreground hover:text-foreground hover:bg-muted/20'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.primary }} />
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Customizer Option 2: Dynamic Typography Pairing selection */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-amber-color" />
                <span>Typography & Font Vibe</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {fonts.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFont(f)}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] text-left transition-all cursor-pointer flex flex-col justify-between h-14 ${
                      activeFont.id === f.id
                        ? 'bg-muted/50 border-amber-color/80 dark:border-amber-color text-foreground shadow-sm'
                        : 'bg-background/20 border-border-color/60 text-muted-foreground hover:text-foreground hover:bg-muted/20'
                    }`}
                  >
                    <span className="font-bold text-xs" style={{ fontFamily: f.displayFamily }}>{f.name}</span>
                    <span className="text-[10px] opacity-60 font-mono" style={{ fontFamily: f.monoFamily }}>Abc 123</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Customizer Option 3: Frame choice */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-color" />
                <span>Outer Shield Structure</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {frames.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFrame(f.id)}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono flex items-center justify-between transition-all cursor-pointer ${
                      activeFrame === f.id
                        ? 'bg-muted/50 border-amber-color/80 dark:border-amber-color text-foreground shadow-sm'
                        : 'bg-background/20 border-border-color/60 text-muted-foreground hover:text-foreground hover:bg-muted/20'
                    }`}
                  >
                    <span>{f.name}</span>
                    <ChevronRight className={`w-3 h-3 text-muted-foreground/50 transition-transform ${activeFrame === f.id ? 'translate-x-0.5' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Customizer Option 3.5: Motion and Pulse Mode choice */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-color" />
                <span>Signature Motion & Mode</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'pulse', name: 'Pulsing D-Mode', desc: 'D-shape pulses' },
                  { id: 'spin', name: 'Spinning Orbit', desc: 'Slow rotation' },
                  { id: 'static', name: 'Static Solid', desc: 'Clean lines' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveMotion(m.id)}
                    className={`px-2.5 py-2 rounded-lg border text-[11px] font-mono flex flex-col justify-center gap-0.5 transition-all cursor-pointer text-left h-[52px] ${
                      activeMotion === m.id
                        ? 'bg-muted/50 border-amber-color/80 dark:border-amber-color text-foreground shadow-sm'
                        : 'bg-background/20 border-border-color/60 text-muted-foreground hover:text-foreground hover:bg-muted/20'
                    }`}
                    title={m.desc}
                  >
                    <span className="font-bold">{m.name}</span>
                    <span className="text-[9px] opacity-65 leading-none">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Customizer Option 3.6: Pulse Speed choice (rendered only if motion is pulse) */}
            {activeMotion === 'pulse' && (
              <div className="space-y-3 animate-fade-in">
                <label className="block text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-color" />
                  <span>Emblem Pulse Speed</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'fast', name: 'Fast', desc: '1.0s loop' },
                    { id: 'slow', name: 'Standard', desc: '2.5s loop' },
                    { id: 'breathe', name: 'Breathe', desc: '5.0s loop' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActivePulseSpeed(s.id)}
                      className={`px-2.5 py-2 rounded-lg border text-[11px] font-mono flex flex-col justify-center gap-0.5 transition-all cursor-pointer text-left h-[52px] ${
                        activePulseSpeed === s.id
                          ? 'bg-muted/50 border-amber-color/80 dark:border-amber-color text-foreground shadow-sm'
                          : 'bg-background/20 border-border-color/60 text-muted-foreground hover:text-foreground hover:bg-muted/20'
                      }`}
                      title={s.desc}
                    >
                      <span className="font-bold">{s.name}</span>
                      <span className="text-[9px] opacity-65 leading-none">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customizer Option 4: Glow sliders */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-muted-foreground">Aura Glow Intensity</label>
                <span className="text-[10px] font-mono text-amber-color bg-amber-color/10 px-1.5 py-0.2 rounded">
                  {glowIntensity === 1 ? 'Minimal' : glowIntensity === 5 ? 'Max Overclock' : `Level ${glowIntensity}`}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={glowIntensity}
                onChange={(e) => setGlowIntensity(parseInt(e.target.value))}
                className="w-full accent-amber-color h-1 bg-muted rounded-lg cursor-pointer"
              />
            </div>

            {/* Customizer Option 5: Contact Details for email signatures / badges */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-color" />
                <span>Personalization Metadata</span>
              </label>
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-mono">Display Name</span>
                    <input
                      type="text"
                      placeholder="Name / Brand"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value.toUpperCase())}
                      className="w-full bg-background border border-border-color rounded-lg px-2.5 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-mono">Professional Title</span>
                    <input
                      type="text"
                      placeholder="Title / Subtitle"
                      value={userTitle}
                      onChange={(e) => setUserTitle(e.target.value)}
                      className="w-full bg-background border border-border-color rounded-lg px-2.5 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-mono">Elevator Pitch</span>
                  <textarea
                    placeholder="Short bio for banners"
                    value={userBio}
                    onChange={(e) => setUserBio(e.target.value)}
                    rows={2}
                    className="w-full bg-background border border-border-color rounded-lg p-2.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-mono">Email Address</span>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full bg-background border border-border-color rounded-lg px-2.5 py-1.2 text-[11px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-mono">Personal Website</span>
                    <input
                      type="text"
                      value={userWebsite}
                      onChange={(e) => setUserWebsite(e.target.value)}
                      className="w-full bg-background border border-border-color rounded-lg px-2.5 py-1.2 text-[11px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-color"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Vector Playground (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-border-color bg-[#090b0f] rounded-xl overflow-hidden shadow-lg flex flex-col">
            
            {/* Window bar */}
            <div className="px-4 py-2.5 bg-muted/20 border-b border-border-color/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-color/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-color/30" />
                <span className="text-[10px] font-mono text-muted-foreground ml-2">linacre_interactive_canvas.svg</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-color font-semibold uppercase bg-emerald-color/10 px-1.5 py-0.5 rounded">
                Retina Scalable Vector
              </span>
            </div>

            {/* Dynamic Vector Logo Center Box */}
            <div className="p-8 flex flex-col sm:flex-row items-center justify-center gap-8 bg-gradient-to-br from-background/80 via-[#0b0e14] to-background/50 border-b border-border-color/40 min-h-[300px]">
              
              {/* Customizable SVG dynamic element container */}
              <div className="w-44 h-44 shrink-0 p-3.5 bg-[#0d1117] rounded-2xl border border-border-color/80 shadow-2xl flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-radial from-transparent to-[#0d1117] opacity-60 rounded-2xl" />
                <div 
                  className="w-full h-full relative z-10 transition-all duration-300 group-hover:scale-105"
                  dangerouslySetInnerHTML={{ __html: getSVGCode() }}
                />
                
                {/* Visual grid coordinates lines */}
                <span className="absolute top-2 left-2.5 text-[8px] font-mono text-muted-foreground/30 font-bold select-none">ID: DN_LINACRE</span>
                <span className="absolute bottom-2 right-2.5 text-[8px] font-mono text-muted-foreground/30 font-bold select-none">RESO: SCALABLE</span>
              </div>

              {/* Asset Information list with custom font family rendering live */}
              <div className="space-y-4 text-center sm:text-left flex-1">
                <div className="space-y-1.5">
                  <h4 className="text-lg font-bold text-slate-100 tracking-tight" style={{ fontFamily: activeFont.displayFamily }}>
                    The Linacre Emblem
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    An abstract representation of the modern digital builder. Fuses DevOps pipeline elements, conic-gradient orb systems, and clean terminal brackets to represent code orchestration and AI automation.
                  </p>
                </div>

                {/* Instant Action buttons */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <button
                    onClick={downloadSVGAsset}
                    className="flex items-center gap-1.5 px-3 py-1.8 rounded bg-amber-color text-[#0b0e14] text-xs font-bold cursor-pointer shadow hover:opacity-95 select-none transition-all active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download SVG</span>
                  </button>
                  <button
                    onClick={() => handleCopy(getSVGCode(), 'svg')}
                    className="flex items-center gap-1.5 px-3 py-1.8 rounded bg-muted/60 border border-border-color hover:bg-muted text-foreground text-xs font-mono cursor-pointer select-none transition-all active:scale-95"
                  >
                    {copiedType === 'svg' ? <Check className="w-3.5 h-3.5 text-emerald-color" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'svg' ? 'Copied SVG!' : 'Copy Code'}</span>
                  </button>
                  <button
                    onClick={() => handleCopy(getReactCode(), 'react')}
                    className="flex items-center gap-1.5 px-3 py-1.8 rounded bg-muted/60 border border-border-color hover:bg-muted text-foreground text-xs font-mono cursor-pointer select-none transition-all active:scale-95"
                  >
                    {copiedType === 'react' ? <Check className="w-3.5 h-3.5 text-emerald-color" /> : <Code className="w-3.5 h-3.5" />}
                    <span>React Component</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section: Dynamic badge widgets */}
            <div className="p-5 bg-muted/5 space-y-4">
              <h4 className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-cyan" />
                <span>Integration Badges</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Snippet 1: Markdown badge */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-muted-foreground">GitHub Profile Shield:</span>
                  <div className="flex items-center bg-background border border-border-color/80 rounded-lg overflow-hidden px-2.5 py-1">
                    <input
                      type="text"
                      readOnly
                      value={`[![David Linacre](https://img.shields.io/badge/linacre.site-developer-${activeColor.id === 'crimson' ? 'red' : activeColor.id === 'amber' ? 'amber' : activeColor.id === 'emerald' ? 'emerald' : activeColor.id === 'mono' ? 'lightgrey' : 'cyan'})](https://linacre.site)`}
                      className="w-full bg-transparent text-[10px] font-mono text-muted-foreground focus:outline-none select-all"
                    />
                    <button
                      onClick={() => handleCopy(`[![David Linacre](https://img.shields.io/badge/linacre.site-developer-${activeColor.id === 'crimson' ? 'red' : activeColor.id === 'amber' ? 'amber' : activeColor.id === 'emerald' ? 'emerald' : activeColor.id === 'mono' ? 'lightgrey' : 'cyan'})](https://linacre.site)`, 'markdown')}
                      className="p-1.5 hover:text-foreground text-muted-foreground/60 focus:outline-none cursor-pointer"
                    >
                      {copiedType === 'markdown' ? <Check className="w-3 h-3 text-emerald-color" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Snippet 2: Custom HTML Embedded tag */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-muted-foreground">App Footer Anchor Link:</span>
                  <div className="flex items-center bg-background border border-border-color/80 rounded-lg overflow-hidden px-2.5 py-1">
                    <input
                      type="text"
                      readOnly
                      value={`<a href="${userWebsite}" style="font-family: ${activeFont.monoFamily}; font-size: 11px; color: ${activeColor.primary}; text-decoration: none; border: 1px solid ${activeColor.primary}20; padding: 3px 8px; border-radius: 4px;">&gt; ${userName.toLowerCase().replace(/\s+/g, '')}</a>`}
                      className="w-full bg-transparent text-[10px] font-mono text-muted-foreground focus:outline-none select-all"
                    />
                    <button
                      onClick={() => handleCopy(`<a href="${userWebsite}" style="font-family: ${activeFont.monoFamily}; font-size: 11px; color: ${activeColor.primary}; text-decoration: none; border: 1px solid ${activeColor.primary}20; padding: 3px 8px; border-radius: 4px;">&gt; ${userName.toLowerCase().replace(/\s+/g, '')}</a>`, 'html')}
                      className="p-1.5 hover:text-foreground text-muted-foreground/60 focus:outline-none cursor-pointer"
                    >
                      {copiedType === 'html' ? <Check className="w-3 h-3 text-emerald-color" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Cover & Avatar Card Generator (Modular Layout Picker) */}
      <div className="border border-border-color bg-muted/10 dark:bg-[#10141d]/40 rounded-xl overflow-hidden shadow-md">
        
        {/* Navigation Tabs for dynamic Layout Previews */}
        <div className="px-5 py-3 border-b border-border-color/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeColor.primary }} />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Dynamic Brand Asset Generators
            </h3>
          </div>
          
          <div className="flex bg-background border border-border-color/60 p-1 rounded-lg gap-1 self-start sm:self-auto">
            <button
              onClick={() => setActiveLayout('panoramic')}
              className={`px-3 py-1 text-[10px] font-mono rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                activeLayout === 'panoramic' ? 'bg-amber-color/15 text-amber-color font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              <span>GitHub Banner</span>
            </button>
            <button
              onClick={() => setActiveLayout('avatar')}
              className={`px-3 py-1 text-[10px] font-mono rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                activeLayout === 'avatar' ? 'bg-amber-color/15 text-amber-color font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Social Avatar</span>
            </button>
            <button
              onClick={() => setActiveLayout('card')}
              className={`px-3 py-1 text-[10px] font-mono rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                activeLayout === 'card' ? 'bg-amber-color/15 text-amber-color font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <IdCard className="w-3 h-3" />
              <span>Cyber Keycard</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* 1. PANORAMIC WIDESCREEN BANNER PREVIEW */}
            {activeLayout === 'panoramic' && (
              <motion.div
                key="panoramic"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div className="relative w-full rounded-lg overflow-hidden border border-border-color bg-[#07090d] select-none shadow-inner" style={{ aspectRatio: '16/5', minHeight: '170px' }}>
                  {/* Cyber grid overlay */}
                  <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                  
                  {/* Neon radial backdrop glows */}
                  <div 
                    className="absolute -right-36 -top-36 w-96 h-96 rounded-full blur-[90px] transition-all duration-700 opacity-25"
                    style={{ backgroundColor: activeColor.primary }}
                  />
                  <div 
                    className="absolute -left-36 -bottom-36 w-96 h-96 rounded-full blur-[90px] transition-all duration-700 opacity-25"
                    style={{ backgroundColor: activeColor.primary }}
                  />

                  {/* High-end vector neon path lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" xmlns="http://www.w3.org/2000/svg">
                    <path d="M -10,60 Q 150,130 450,25 T 950,110 T 1400,60" fill="none" stroke={activeColor.primary} strokeWidth="1.8" />
                    <path d="M -20,120 Q 350,35 750,140 T 1250,35" fill="none" stroke={activeColor.secondary} strokeWidth="1" strokeDasharray="6 6" />
                  </svg>

                  {/* Content Overlays */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground/60" style={{ fontFamily: activeFont.monoFamily }}>
                        <span className={activeColor.text}>&gt;</span>
                        <span>{userWebsite.replace('https://', '')}</span>
                        <span className="text-muted-foreground/30">·</span>
                        <span>profile_verified</span>
                      </div>
                      <div className="flex items-center gap-1 bg-[#10141d]/80 border border-slate-800/80 rounded px-2 py-0.5 text-[8px] text-muted-foreground" style={{ fontFamily: activeFont.monoFamily }}>
                        <Shield className="w-2.5 h-2.5 text-emerald-color" />
                        <span>SECURE IDENTITY</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                      <div 
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl border flex items-center justify-center bg-[#0d1117] shrink-0 transition-all shadow-lg"
                        style={{ borderColor: `${activeColor.primary}40` }}
                      >
                        <div className="w-[80%] h-[80%]" dangerouslySetInnerHTML={{ __html: getSVGCode() }} />
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base md:text-2xl font-bold tracking-tight text-slate-100 uppercase" style={{ fontFamily: activeFont.displayFamily }}>
                          {userName || 'DAVID LINACRE'}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full`} style={{ backgroundColor: activeColor.primary }} />
                          <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold" style={{ fontFamily: activeFont.monoFamily }}>
                            {userTitle || 'Full Stack & AI Architect'}
                          </span>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground/75 leading-snug hidden md:block max-w-xl truncate" style={{ fontFamily: activeFont.displayFamily }}>
                          {userBio}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border-color/20 pt-2 text-[8px] sm:text-[9px] text-muted-foreground/50" style={{ fontFamily: activeFont.monoFamily }}>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Globe className="w-2.5 h-2.5 text-muted-foreground/40" />
                          <span>{userWebsite}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Github className="w-2.5 h-2.5 text-muted-foreground/40" />
                          <span>{userGithub}</span>
                        </span>
                      </div>
                      <span className="hidden sm:inline">COMPILER: <span className="text-emerald-color font-bold">ONLINE</span></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. SQUARE SOCIAL PROFILE AVATAR CARD */}
            {activeLayout === 'avatar' && (
              <motion.div
                key="avatar"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center justify-center p-6 bg-[#07090d] border border-border-color rounded-lg min-h-[220px]"
              >
                <div className="relative flex flex-col items-center text-center space-y-4 max-w-sm">
                  {/* Large Outer Profile Ring */}
                  <div className="relative w-28 h-28 rounded-full p-1 border-2 border-dashed border-border-color flex items-center justify-center">
                    {/* Pulsing Backlit Aura */}
                    <div 
                      className="absolute inset-0.5 rounded-full blur-xl opacity-30 animate-pulse"
                      style={{ backgroundColor: activeColor.primary }}
                    />
                    <div className="w-24 h-24 rounded-full bg-[#0d1117] border border-border-color flex items-center justify-center p-3 relative z-10">
                      <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: getSVGCode() }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-100 uppercase" style={{ fontFamily: activeFont.displayFamily }}>
                      {userName}
                    </h4>
                    <p className="text-xs text-amber-color font-mono" style={{ fontFamily: activeFont.monoFamily }}>
                      @{userName.toLowerCase().replace(/\s+/g, '')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. CYBER KEYCARD ID PASS PREVIEW */}
            {activeLayout === 'card' && (
              <motion.div
                key="card"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center p-4 bg-[#07090d] border border-border-color rounded-lg"
              >
                {/* Horizontal badge pass (Golden ratio ID shape) */}
                <div className="w-full max-w-md bg-gradient-to-br from-[#101319] to-[#0a0d13] border border-border-color rounded-xl p-5 relative overflow-hidden shadow-2xl min-h-[190px] flex flex-col justify-between">
                  {/* Subtle Tech accents */}
                  <div className="absolute right-0 top-0 w-24 h-24 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1.2px, transparent 1.2px)', backgroundSize: '10px 10px' }} />
                  <div className="absolute -left-12 -bottom-12 w-32 h-32 rounded-full blur-2xl opacity-15" style={{ backgroundColor: activeColor.primary }} />

                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-border-color/30 pb-3 font-mono text-[9px] text-muted-foreground/70">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-amber-color" />
                      <span>DEVELOPER CREDENTIAL</span>
                    </div>
                    <span className="font-mono text-emerald-color">SECURE_ROOT_LIVE</span>
                  </div>

                  {/* Body Info */}
                  <div className="flex items-center gap-4 py-4">
                    <div className="w-16 h-16 bg-[#0a0c10] border rounded-lg p-2 shrink-0 flex items-center justify-center" style={{ borderColor: `${activeColor.primary}50` }}>
                      <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: getSVGCode() }} />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold tracking-tight text-white uppercase" style={{ fontFamily: activeFont.displayFamily }}>
                        {userName}
                      </h4>
                      <p className="text-[11px] font-mono text-muted-foreground font-semibold" style={{ color: activeColor.primary, fontFamily: activeFont.monoFamily }}>
                        {userTitle}
                      </p>
                      <p className="text-[9px] text-muted-foreground/60 font-mono leading-none" style={{ fontFamily: activeFont.monoFamily }}>
                        REF_ID: 61240D57_SERVER
                      </p>
                    </div>
                  </div>

                  {/* Footer metadata bar */}
                  <div className="border-t border-border-color/30 pt-3 flex items-center justify-between text-[9px] font-mono text-muted-foreground/50" style={{ fontFamily: activeFont.monoFamily }}>
                    <span>VERIFIED VIA: <span className="text-white">AI_STUDY_BUILD</span></span>
                    <span>EXP: PERPETUAL</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Professional Email Signature Builder with Live Gmail/Outlook interactive Preview */}
      <div className="border border-border-color bg-muted/10 dark:bg-[#10141d]/40 rounded-xl overflow-hidden shadow-md">
        <div className="px-5 py-3 border-b border-border-color/60 bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-color" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Embeddable HTML Email Signature Builder
            </h3>
          </div>
          <span className="text-[9px] font-mono text-emerald-color font-semibold uppercase bg-emerald-color/10 px-2 py-0.5 rounded">
            Copy-Paste Ready
          </span>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            Need your signature on all your active client mail threads? Fill in your social tags on the left customizer and copy the styled **Rich Text** below directly into Gmail, Outlook, or Apple Mail, or grab the raw HTML code.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Live Interactive Copy Signature Panel */}
            <div className="md:col-span-7 space-y-3">
              <span className="text-[10px] font-mono text-muted-foreground">Gmail / Outlook Live Preview Box:</span>
              <div className="p-5 bg-[#090b0f] rounded-lg border border-border-color overflow-x-auto min-h-[180px] flex items-center justify-center">
                {/* Embedded HTML container for rendering */}
                <div dangerouslySetInnerHTML={{ __html: getEmailSignatureHTML() }} />
              </div>
            </div>

            {/* Email Actions Panel */}
            <div className="md:col-span-5 flex flex-col justify-center space-y-4">
              <div className="bg-[#10141d]/30 p-4 border border-border-color/40 rounded-lg space-y-2.5">
                <h5 className="font-mono text-xs font-bold text-foreground">Interactive Actions:</h5>
                <p className="text-[11px] text-muted-foreground">
                  The **Copy Rich Text Signature** parses CSS and tables on the fly. Simply click it and then press **Ctrl+V / Cmd+V** in your email signature settings panel!
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handleCopyRichTextSignature}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-amber-color text-[#0b0e14] text-xs font-bold cursor-pointer transition-all active:scale-95"
                  >
                    {copiedType === 'signature-rich' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'signature-rich' ? 'Signature Copied!' : 'Copy Rich Text Signature'}</span>
                  </button>
                  <button
                    onClick={() => handleCopy(getEmailSignatureHTML(), 'signature-html')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-muted/60 hover:bg-muted border border-border-color text-foreground text-xs font-mono cursor-pointer transition-all active:scale-95"
                  >
                    {copiedType === 'signature-html' ? <Check className="w-3.5 h-3.5 text-emerald-color" /> : <Code className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'signature-html' ? 'HTML Code Copied!' : 'Copy raw HTML Signature'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
