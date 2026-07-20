import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  ChevronRight,
  CircleUserRound,
  Code2,
  Copy,
  Download,
  FileImage,
  Github,
  Image as ImageIcon,
  LayoutTemplate,
  Link2,
  Mail,
  Palette,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Type,
  WandSparkles,
} from 'lucide-react';
import { getEmblemSVG } from '../lib/emblemRenderer';

type PreviewMode = 'banner' | 'avatar' | 'social';

type PaletteOption = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  description: string;
};

type FontOption = {
  id: string;
  name: string;
  display: string;
  mono: string;
  sample: string;
};

const PALETTES: PaletteOption[] = [
  {
    id: 'cyber',
    name: 'CyberBlue',
    primary: '#22D3EE',
    secondary: '#34D399',
    description: 'The site default — electric cyan with clean green energy.',
  },
  {
    id: 'ocean',
    name: 'Ocean Signal',
    primary: '#38BDF8',
    secondary: '#2DD4BF',
    description: 'Cool blue and teal for a calmer technical identity.',
  },
  {
    id: 'matrix',
    name: 'Green Matrix',
    primary: '#2DD4BF',
    secondary: '#A3E635',
    description: 'High-energy mint and lime without the usual neon clutter.',
  },
  {
    id: 'violet',
    name: 'Ultraviolet',
    primary: '#818CF8',
    secondary: '#22D3EE',
    description: 'Indigo and cyan for AI experiments and creative systems.',
  },
  {
    id: 'mono',
    name: 'Ice Mono',
    primary: '#E2F7FA',
    secondary: '#7DD3FC',
    description: 'Restrained icy neutrals for formal and minimal assets.',
  },
];

const FRAMES = [
  { id: 'dl-geo', name: 'Geometric DL', description: 'Primary brand mark' },
  { id: 'dl-terminal', name: 'Terminal DL', description: 'Developer identity' },
  { id: 'dl-crest', name: 'Cyber Crest', description: 'Sharper social mark' },
  { id: 'brackets', name: 'Code Prompt', description: 'Simple technical icon' },
  { id: 'circle', name: 'Signal Orb', description: 'Soft compact avatar' },
  { id: 'minimal', name: 'Minimal Spark', description: 'Quiet, abstract option' },
];

const FONTS: FontOption[] = [
  {
    id: 'cyber',
    name: 'Space Grotesk',
    display: '"Space Grotesk", "Inter", sans-serif',
    mono: '"JetBrains Mono", monospace',
    sample: 'Modern / clear / technical',
  },
  {
    id: 'neotech',
    name: 'Orbit System',
    display: '"Orbitron", "Space Grotesk", sans-serif',
    mono: '"Share Tech Mono", "JetBrains Mono", monospace',
    sample: 'Futuristic / display-led',
  },
  {
    id: 'brutalist',
    name: 'Technical Sans',
    display: '"Plus Jakarta Sans", "Inter", sans-serif',
    mono: '"Fira Code", "JetBrains Mono", monospace',
    sample: 'Practical / product-focused',
  },
];

const safeStorage = {
  get(key: string, fallback: string) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // The studio remains usable when browser storage is disabled.
    }
  },
};

function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function contrastRatio(hex1: string, hex2: string) {
  const luminance = (hex: string) => {
    const clean = hex.replace('#', '');
    const values = [0, 2, 4].map((index) => parseInt(clean.slice(index, index + 2), 16) / 255);
    const [r, g, b] = values.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const a = luminance(hex1);
  const b = luminance(hex2);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function downloadText(content: string, filename: string, type = 'image/svg+xml;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

async function svgToPng(svg: string, filename: string, width: number, height: number) {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Could not render this SVG.'));
    image.src = url;
  });
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is not supported in this browser.');
  context.drawImage(image, 0, 0, width, height);
  URL.revokeObjectURL(url);
  const pngUrl = canvas.toDataURL('image/png');
  const anchor = document.createElement('a');
  anchor.href = pngUrl;
  anchor.download = filename;
  anchor.click();
}

export default function IdentityHub() {
  const savedPalette = safeStorage.get('linacre_brand_color', 'cyber');
  const initialPalette = savedPalette === 'amber' ? 'cyber' : savedPalette;

  const [paletteId, setPaletteId] = useState(initialPalette);
  const [frame, setFrame] = useState(safeStorage.get('linacre_brand_frame', 'dl-geo'));
  const [fontId, setFontId] = useState(safeStorage.get('linacre_brand_font', 'cyber'));
  const [motionMode, setMotionMode] = useState(safeStorage.get('linacre_brand_motion', 'pulse'));
  const [glow, setGlow] = useState(Number(safeStorage.get('linacre_brand_glow', '2')));
  const [name, setName] = useState(safeStorage.get('linacre_brand_name', 'DAVID LINACRE'));
  const [title, setTitle] = useState(safeStorage.get('linacre_brand_title', 'Software engineer · useful tools · AI systems'));
  const [bio, setBio] = useState(safeStorage.get('linacre_brand_bio', 'Building practical software, open-source tools, and reliable automation systems.'));
  const [email, setEmail] = useState(safeStorage.get('linacre_brand_email', 'david@linacre.site'));
  const [website, setWebsite] = useState(safeStorage.get('linacre_brand_website', 'https://www.linacre.site'));
  const [previewMode, setPreviewMode] = useState<PreviewMode>('banner');
  const [copied, setCopied] = useState<string | null>(null);

  const palette = PALETTES.find((option) => option.id === paletteId) || PALETTES[0];
  const activeFont = FONTS.find((option) => option.id === fontId) || FONTS[0];

  useEffect(() => {
    safeStorage.set('linacre_brand_color', palette.id);
    safeStorage.set('linacre_brand_frame', frame);
    safeStorage.set('linacre_brand_font', activeFont.id);
    safeStorage.set('linacre_brand_motion', motionMode);
    safeStorage.set('linacre_brand_pulse_speed', 'slow');
    safeStorage.set('linacre_brand_glow', String(glow));
    safeStorage.set('linacre_brand_name', name);
    safeStorage.set('linacre_brand_title', title);
    safeStorage.set('linacre_brand_bio', bio);
    safeStorage.set('linacre_brand_email', email);
    safeStorage.set('linacre_brand_website', website);
    window.dispatchEvent(new Event('linacre-identity-updated'));
  }, [palette, frame, activeFont, motionMode, glow, name, title, bio, email, website]);

  const emblem = useMemo(
    () => getEmblemSVG(frame, palette.primary, palette.secondary, motionMode, 'slow', glow, []),
    [frame, palette, motionMode, glow],
  );

  const bannerSvg = useMemo(() => {
    const safeName = xmlEscape(name || 'DAVID LINACRE');
    const safeTitle = xmlEscape(title || 'Software engineer · useful tools · AI systems');
    const safeWebsite = xmlEscape(website.replace(/^https?:\/\//, '') || 'linacre.site');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="320" viewBox="0 0 1280 320" style="width:100%;height:100%;display:block">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#030c14"/><stop offset="0.55" stop-color="#061520"/><stop offset="1" stop-color="#08202a"/></linearGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${palette.primary}"/><stop offset="1" stop-color="${palette.secondary}"/></linearGradient>
    <radialGradient id="aura"><stop stop-color="${palette.primary}" stop-opacity=".18"/><stop offset="1" stop-color="${palette.primary}" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="${palette.primary}" stroke-opacity=".08"/></pattern>
  </defs>
  <rect width="1280" height="320" fill="url(#bg)"/>
  <rect width="1280" height="320" fill="url(#grid)"/>
  <circle cx="160" cy="160" r="230" fill="url(#aura)"/>
  <path d="M760 274h120l34-30h170l34 30h162" fill="none" stroke="${palette.secondary}" stroke-opacity=".24" stroke-width="2"/>
  <circle cx="914" cy="244" r="4" fill="${palette.primary}"/><circle cx="1084" cy="244" r="4" fill="${palette.secondary}"/>
  <rect x="58" y="46" width="228" height="228" rx="38" fill="#081c28" fill-opacity=".9" stroke="${palette.primary}" stroke-opacity=".22"/>
  <svg x="82" y="70" width="180" height="180" viewBox="0 0 100 100">${emblem}</svg>
  <text x="342" y="78" fill="${palette.secondary}" font-family="JetBrains Mono, monospace" font-size="15" font-weight="700" letter-spacing="1.5">CYBERBLUE / VERIFIED IDENTITY</text>
  <text x="338" y="145" fill="#ecfeff" font-family="Space Grotesk, Inter, sans-serif" font-size="52" font-weight="700" letter-spacing="-1.5">${safeName}</text>
  <text x="342" y="187" fill="#9ab7c3" font-family="Inter, sans-serif" font-size="22">${safeTitle}</text>
  <rect x="342" y="218" width="238" height="38" rx="19" fill="#082330" stroke="${palette.primary}" stroke-opacity=".65"/>
  <text x="363" y="243" fill="${palette.primary}" font-family="JetBrains Mono, monospace" font-size="14" font-weight="700">${safeWebsite}</text>
  <circle cx="1090" cy="268" r="5" fill="${palette.secondary}"/>
  <text x="1107" y="273" fill="${palette.secondary}" font-family="JetBrains Mono, monospace" font-size="13" font-weight="700">AVAILABLE / ONLINE</text>
</svg>`;
  }, [emblem, name, title, website, palette]);

  const avatarSvg = useMemo(() => `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" style="width:100%;height:100%;display:block">
  <defs><linearGradient id="avatarBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#030c14"/><stop offset="1" stop-color="#0a2632"/></linearGradient><radialGradient id="avatarAura"><stop stop-color="${palette.primary}" stop-opacity=".22"/><stop offset="1" stop-color="${palette.primary}" stop-opacity="0"/></radialGradient></defs>
  <rect width="512" height="512" rx="108" fill="url(#avatarBg)"/>
  <circle cx="256" cy="256" r="245" fill="url(#avatarAura)"/>
  <rect x="44" y="44" width="424" height="424" rx="92" fill="none" stroke="${palette.primary}" stroke-opacity=".38" stroke-width="3"/>
  <svg x="96" y="96" width="320" height="320" viewBox="0 0 100 100">${emblem}</svg>
</svg>`, [emblem, palette]);

  const socialSvg = useMemo(() => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" style="width:100%;height:100%;display:block">
  <defs><linearGradient id="socialBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#030c14"/><stop offset=".6" stop-color="#061520"/><stop offset="1" stop-color="#0a2932"/></linearGradient><pattern id="socialGrid" width="54" height="54" patternUnits="userSpaceOnUse"><path d="M54 0H0V54" fill="none" stroke="${palette.primary}" stroke-opacity=".07"/></pattern></defs>
  <rect width="1200" height="630" fill="url(#socialBg)"/><rect width="1200" height="630" fill="url(#socialGrid)"/>
  <rect x="70" y="135" width="330" height="330" rx="72" fill="#081c28" stroke="${palette.primary}" stroke-opacity=".3"/>
  <svg x="110" y="175" width="250" height="250" viewBox="0 0 100 100">${emblem}</svg>
  <text x="470" y="190" fill="${palette.secondary}" font-family="JetBrains Mono, monospace" font-size="17" font-weight="700">LINACRE / USEFUL SOFTWARE</text>
  <text x="462" y="272" fill="#ecfeff" font-family="Space Grotesk, Inter, sans-serif" font-size="57" font-weight="700">${xmlEscape(name)}</text>
  <text x="470" y="320" fill="${palette.primary}" font-family="JetBrains Mono, monospace" font-size="21">${xmlEscape(title)}</text>
  <text x="470" y="377" fill="#9ab7c3" font-family="Inter, sans-serif" font-size="20">${xmlEscape(bio).slice(0, 92)}</text>
  <rect x="470" y="420" width="285" height="46" rx="23" fill="#082330" stroke="${palette.primary}" stroke-opacity=".7"/>
  <text x="494" y="450" fill="${palette.primary}" font-family="JetBrains Mono, monospace" font-size="16" font-weight="700">${xmlEscape(website.replace(/^https?:\/\//, ''))}</text>
</svg>`, [emblem, name, title, bio, website, palette]);

  const currentAsset = previewMode === 'banner'
    ? { svg: bannerSvg, width: 1280, height: 320, name: 'linacre-github-banner' }
    : previewMode === 'avatar'
      ? { svg: avatarSvg, width: 512, height: 512, name: 'linacre-avatar' }
      : { svg: socialSvg, width: 1200, height: 630, name: 'linacre-social-card' };

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1_600);
  };

  const cssTokens = `:root {
  --brand-primary: ${palette.primary};
  --brand-secondary: ${palette.secondary};
  --brand-background: #030c14;
  --brand-surface: #081c28;
  --brand-text: #ecfeff;
  --brand-muted: #9ab7c3;
  --brand-gradient: linear-gradient(135deg, ${palette.primary}, ${palette.secondary});
}`;

  const applyCyberPreset = () => {
    setPaletteId('cyber');
    setFrame('dl-geo');
    setFontId('cyber');
    setMotionMode('pulse');
    setGlow(2);
  };

  const copyThemeLink = () => {
    const url = new URL('/identity', window.location.origin);
    url.searchParams.set('brand_color', palette.id);
    url.searchParams.set('brand_font', activeFont.id);
    url.searchParams.set('brand_frame', frame);
    url.searchParams.set('brand_motion', motionMode);
    url.searchParams.set('brand_glow', String(glow));
    url.searchParams.set('brand_name', name);
    copy(url.toString(), 'link');
  };

  const darkContrast = contrastRatio(palette.primary, '#030c14');

  return (
    <div className="space-y-10 pb-12" id="identity-brand-studio">
      <section className="relative overflow-hidden rounded-3xl border border-border-color bg-[var(--linacre-panel)] p-6 shadow-[var(--linacre-card-shadow)] sm:p-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-color">
              <ShieldCheck className="h-4 w-4" /> Identity Studio v6
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
              One identity. Every useful asset.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Choose a palette and mark once, preview the result in real formats, then export production-ready SVG or PNG assets. No sprawling controls and no guesswork.
            </p>
          </div>
          <button
            onClick={applyCyberPreset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-color px-4 py-3 font-mono text-xs font-bold text-[#031018] shadow-[0_0_28px_rgba(34,211,238,.2)] hover:bg-amber-glow"
          >
            <WandSparkles className="h-4 w-4" /> Apply CyberBlue preset
          </button>
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,.82fr)_minmax(0,1.18fr)]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Palette className="h-4 w-4 text-amber-color" />
              <h2 className="font-display text-base font-bold text-foreground">1. Colour system</h2>
            </div>
            <div className="space-y-2">
              {PALETTES.map((option) => {
                const active = option.id === palette.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setPaletteId(option.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${active ? 'bg-muted/40 text-foreground' : 'border-border-color bg-background/20 text-muted-foreground hover:bg-muted/20'}`}
                    style={active ? { borderColor: option.primary, boxShadow: `0 0 0 1px ${option.primary}22` } : undefined}
                  >
                    <span className="flex shrink-0 -space-x-1">
                      <span className="h-8 w-8 rounded-full border-2 border-[var(--linacre-panel)]" style={{ background: option.primary }} />
                      <span className="h-8 w-8 rounded-full border-2 border-[var(--linacre-panel)]" style={{ background: option.secondary }} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-xs font-bold">{option.name}</span>
                      <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">{option.description}</span>
                    </span>
                    {active && <Check className="h-4 w-4 shrink-0" style={{ color: option.secondary }} />}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-border-color bg-[#030c14] p-3 font-mono text-[10px]">
              <span className="text-[#9ab7c3]">Contrast on dark</span>
              <span className={darkContrast >= 4.5 ? 'text-emerald-color' : 'text-error'}>
                {darkContrast.toFixed(2)}:1 · {darkContrast >= 4.5 ? 'AA pass' : 'Large text only'}
              </span>
            </div>
          </section>

          <section className="rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-color" />
              <h2 className="font-display text-base font-bold text-foreground">2. Mark and motion</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {FRAMES.map((option) => {
                const active = option.id === frame;
                const preview = getEmblemSVG(option.id, palette.primary, palette.secondary, 'static', 'slow', 1, []);
                return (
                  <button
                    key={option.id}
                    onClick={() => setFrame(option.id)}
                    className={`rounded-xl border p-3 text-left transition-all ${active ? 'bg-muted/40' : 'border-border-color bg-background/20 hover:bg-muted/20'}`}
                    style={active ? { borderColor: palette.primary } : undefined}
                  >
                    <span className="mx-auto block h-12 w-12" dangerouslySetInnerHTML={{ __html: preview }} />
                    <span className="mt-2 block font-mono text-[10px] font-bold text-foreground">{option.name}</span>
                    <span className="mt-0.5 block text-[9px] text-muted-foreground">{option.description}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Motion</label>
                <div className="flex rounded-xl border border-border-color bg-background/30 p-1">
                  {[
                    ['static', 'Static'],
                    ['pulse', 'Pulse'],
                    ['spin', 'Orbit'],
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setMotionMode(id)}
                      className={`flex-1 rounded-lg px-2 py-2 font-mono text-[10px] font-bold ${motionMode === id ? 'text-[#031018]' : 'text-muted-foreground hover:text-foreground'}`}
                      style={motionMode === id ? { background: palette.primary } : undefined}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <label htmlFor="brand-glow">Glow</label><span style={{ color: palette.primary }}>{glow}/4</span>
                </div>
                <input id="brand-glow" type="range" min="0" max="4" value={glow} onChange={(event) => setGlow(Number(event.target.value))} className="w-full" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Type className="h-4 w-4 text-amber-color" />
              <h2 className="font-display text-base font-bold text-foreground">3. Type and profile</h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {FONTS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFontId(option.id)}
                  className={`rounded-xl border p-3 text-left ${option.id === activeFont.id ? 'bg-muted/40' : 'border-border-color bg-background/20'}`}
                  style={option.id === activeFont.id ? { borderColor: palette.primary } : undefined}
                >
                  <span className="block text-xs font-bold text-foreground" style={{ fontFamily: option.display }}>{option.name}</span>
                  <span className="mt-1 block text-[9px] text-muted-foreground">{option.sample}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Display name</span>
                <input value={name} onChange={(event) => setName(event.target.value.toUpperCase())} className="h-11 w-full rounded-xl border border-border-color bg-background/40 px-3 font-mono text-xs text-foreground focus:border-amber-color focus:outline-none" />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Professional line</span>
                <input value={title} onChange={(event) => setTitle(event.target.value)} className="h-11 w-full rounded-xl border border-border-color bg-background/40 px-3 text-xs text-foreground focus:border-amber-color focus:outline-none" />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Short bio</span>
                <textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={3} className="w-full resize-none rounded-xl border border-border-color bg-background/40 p-3 text-xs leading-5 text-foreground focus:border-amber-color focus:outline-none" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email</span>
                  <input value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 w-full rounded-xl border border-border-color bg-background/40 px-3 font-mono text-[10px] text-foreground focus:border-amber-color focus:outline-none" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Website</span>
                  <input value={website} onChange={(event) => setWebsite(event.target.value)} className="h-11 w-full rounded-xl border border-border-color bg-background/40 px-3 font-mono text-[10px] text-foreground focus:border-amber-color focus:outline-none" />
                </label>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-5 lg:sticky lg:top-24">
          <section className="overflow-hidden rounded-2xl border border-border-color bg-[var(--linacre-panel)] shadow-[var(--linacre-card-shadow)]">
            <div className="flex flex-col justify-between gap-3 border-b border-border-color bg-muted/20 p-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 px-1 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <LayoutTemplate className="h-4 w-4 text-amber-color" /> Live export preview
              </div>
              <div className="flex rounded-xl border border-border-color bg-background/40 p-1" role="tablist" aria-label="Asset preview">
                {[
                  ['banner', 'GitHub', Github],
                  ['avatar', 'Avatar', CircleUserRound],
                  ['social', 'Social', ImageIcon],
                ].map(([id, label, Icon]) => (
                  <button
                    key={id as string}
                    onClick={() => setPreviewMode(id as PreviewMode)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 font-mono text-[10px] font-bold ${previewMode === id ? 'text-[#031018]' : 'text-muted-foreground hover:text-foreground'}`}
                    style={previewMode === id ? { background: palette.primary } : undefined}
                  >
                    <Icon className="h-3.5 w-3.5" /> {label as string}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#020a11] p-4 sm:p-6">
              <motion.div
                key={`${previewMode}-${palette.id}-${frame}-${fontId}`}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mx-auto overflow-hidden rounded-xl border border-white/10 shadow-2xl ${previewMode === 'avatar' ? 'max-w-sm' : 'w-full'}`}
                style={{ aspectRatio: `${currentAsset.width}/${currentAsset.height}` }}
                dangerouslySetInnerHTML={{ __html: currentAsset.svg }}
              />
            </div>

            <div className="grid gap-2 border-t border-border-color p-4 sm:grid-cols-3">
              <button onClick={() => downloadText(currentAsset.svg, `${currentAsset.name}.svg`)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-color px-3 py-2.5 font-mono text-[10px] font-bold text-[#031018] hover:bg-amber-glow">
                <Download className="h-4 w-4" /> SVG
              </button>
              <button onClick={() => svgToPng(currentAsset.svg, `${currentAsset.name}.png`, currentAsset.width, currentAsset.height)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-color bg-muted/20 px-3 py-2.5 font-mono text-[10px] font-bold text-foreground hover:border-amber-color/50">
                <FileImage className="h-4 w-4" /> PNG
              </button>
              <button onClick={() => copy(currentAsset.svg, 'asset')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-color bg-muted/20 px-3 py-2.5 font-mono text-[10px] font-bold text-foreground hover:border-amber-color/50">
                {copied === 'asset' ? <Check className="h-4 w-4 text-emerald-color" /> : <Copy className="h-4 w-4" />} {copied === 'asset' ? 'Copied' : 'Copy code'}
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-base font-bold text-foreground">Export the full asset set</h2>
                <p className="mt-1 text-[11px] text-muted-foreground">Exact dimensions, transparent-safe SVG, and crisp PNG rendering.</p>
              </div>
              <ShieldCheck className="h-5 w-5 text-emerald-color" />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { label: 'Logo SVG', note: 'Scalable mark', icon: Sparkles, action: () => downloadText(emblem, 'linacre-emblem.svg') },
                { label: 'GitHub banner', note: '1280 × 320 PNG', icon: Github, action: () => svgToPng(bannerSvg, 'linacre-github-banner.png', 1280, 320) },
                { label: 'Social card', note: '1200 × 630 PNG', icon: ImageIcon, action: () => svgToPng(socialSvg, 'linacre-social-card.png', 1200, 630) },
                { label: 'Avatar', note: '512 × 512 PNG', icon: CircleUserRound, action: () => svgToPng(avatarSvg, 'linacre-avatar.png', 512, 512) },
              ].map((asset) => (
                <button key={asset.label} onClick={asset.action} className="group flex items-center gap-3 rounded-xl border border-border-color bg-background/25 p-3 text-left hover:border-amber-color/45 hover:bg-muted/20">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-color/10 text-amber-color"><asset.icon className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1"><span className="block font-mono text-[10px] font-bold text-foreground">{asset.label}</span><span className="mt-0.5 block text-[9px] text-muted-foreground">{asset.note}</span></span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-amber-color" />
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border-color bg-[var(--linacre-panel)] p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><Code2 className="h-4 w-4 text-amber-color" /><h2 className="font-display text-base font-bold text-foreground">Brand tokens</h2></div>
              <button onClick={() => copy(cssTokens, 'tokens')} className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-amber-color hover:text-amber-glow">
                {copied === 'tokens' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied === 'tokens' ? 'Copied' : 'Copy CSS'}
              </button>
            </div>
            <pre className="overflow-x-auto rounded-xl border border-border-color bg-[#020a11] p-4 font-mono text-[10px] leading-5 text-[#9ab7c3]">{cssTokens}</pre>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button onClick={copyThemeLink} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-color px-3 py-2.5 font-mono text-[10px] font-bold text-foreground hover:border-amber-color/50">
                {copied === 'link' ? <Check className="h-4 w-4 text-emerald-color" /> : <Link2 className="h-4 w-4" />} {copied === 'link' ? 'Theme link copied' : 'Copy theme link'}
              </button>
              <button onClick={applyCyberPreset} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-color px-3 py-2.5 font-mono text-[10px] font-bold text-foreground hover:border-amber-color/50">
                <RefreshCw className="h-4 w-4" /> Reset to system default
              </button>
            </div>
          </section>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Github, title: 'GitHub', text: 'Use the wide banner and geometric DL mark. Keep README headers short and useful.' },
          { icon: Mail, title: 'Email and documents', text: `Use ${email} and the CyberBlue palette on a plain dark or white surface.` },
          { icon: ImageIcon, title: 'Social profiles', text: 'Use the square avatar at small sizes and the 1200 × 630 card for shared links.' },
        ].map((rule) => (
          <div key={rule.title} className="rounded-2xl border border-border-color bg-muted/10 p-5">
            <rule.icon className="h-5 w-5 text-amber-color" />
            <h2 className="mt-4 font-display text-base font-bold text-foreground">{rule.title}</h2>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{rule.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
