# Video and Motion Prompts — Linacre.site

Use these for Runway, Pika, After Effects, CapCut, Canva, Figma motion, or AI video tools. Paste the **Master Brand Prompt** first.

---

## 1. 3-Second Logo Sting

### What this is for
Use at the start/end of social videos, screen recordings, tutorials, and launch posts.

### Prompt

> Create a 3-second logo animation for Linacre.site. Start on a deep ink background. A faint amber pulse appears as a thin horizontal line, then draws a minimal hexagon. The Linacre.site hex-pulse mark resolves in the centre with a soft amber glow. Add a tiny terminal cursor blink at the end. Motion should be calm, premium, retro-modern, and subtle. No loud glitch, no spinning, no explosive effects. End on a clean frame that can hold for one second.

### Timing

- 0.0–0.7s: faint pulse line appears.
- 0.7–1.6s: hexagon draws.
- 1.6–2.3s: mark resolves and glows.
- 2.3–3.0s: cursor blink / hold.

### Audio pairing
Use the 3-second audio sting from `audio-brand-prompts.md`.

---

## 2. 8-Second Social Intro

### Prompt

> Create an 8-second intro animation for Linacre.site social videos. Visuals: dark terminal-inspired background, amber hex grid slowly fading in, code/card UI fragments sliding softly into place, central wordmark “Linacre.site”, subtext “Full-Stack & AI Engineering”, small pulse waveform synced to soft retro audio. The motion should build gently then bloom into a small warm reveal, like a tiny chorus lift. Premium, calm, easy listening visual rhythm.

### Use for

- YouTube Shorts,
- TikTok intros,
- Instagram Reels,
- LinkedIn screen-recording intros.

---

## 3. 15-Second Reel Background

### Prompt

> Create a 15-second vertical video background for Linacre.site. Aspect ratio 9:16. Dark amber-coded developer workspace aesthetic. Slow-moving hexagon grid, soft amber radial glow, tiny terminal cursor, subtle waveform/pulse line, occasional clean code-card silhouettes. Leave a safe central area for captions. Motion should be gentle, premium, and loopable. No faces, no robots, no busy backgrounds, no fast glitching.

### Recommended overlay

- Top: category label, e.g. `BUILD NOTE`
- Centre: main caption
- Bottom: Linacre.site mark + CTA

---

## 4. Website Microinteraction Prompt

### What this is for
Use this with a coding assistant to implement tasteful motion.

### Prompt

> Add subtle brand microinteractions to Linacre.site. Use a slow amber pulse on the logo, soft hover lift on cards, thin border glow on focus, terminal cursor blink in hero, and a gentle hexagon line-draw animation for decorative elements. Motion must respect `prefers-reduced-motion`. Keep durations between 150ms and 800ms depending on interaction. Avoid constant distracting animation.

### Accessibility requirement

Always include reduced-motion fallbacks:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 5. Screen Recording Overlay Prompt

### Prompt

> Design a branded overlay for Linacre.site screen recordings. Include a thin amber top bar, small Linacre.site logo, title area, optional chapter label, and subtle dark gradient corners. It should make coding/tutorial videos feel branded without covering important UI. Keep it clean, readable, and minimal.

---

## 6. Motion Rules

Use:

- line drawing,
- pulse glow,
- opacity fades,
- small slide-up reveals,
- waveform sync,
- cursor blink.

Avoid:

- camera shake,
- huge explosions,
- harsh glitch,
- fast zooms,
- busy particle storms,
- animation that makes text hard to read.
