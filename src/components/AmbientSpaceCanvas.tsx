import { useEffect, useRef } from 'react';

interface Particle3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
}

/**
 * AmbientSpaceCanvas — a high-performance 3D starfield & cyber mesh canvas.
 * Renders floating 3D neon nodes with perspective projection and subtle mouse physics.
 */
export default function AmbientSpaceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect user's reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let width = 0;
    let height = 0;
    let animId = 0;
    let mouseX = -9999;
    let mouseY = -9999;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Initialize 3D particles in a spherical bounding space
    const count = Math.min(Math.floor(width / 24), 75);
    const radius = Math.min(width, height) * 0.45;
    const particles: Particle3D[] = [];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = radius * Math.cbrt(Math.random());

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        vz: (Math.random() - 0.5) * 0.2,
        size: 1 + Math.random() * 1.5,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    const focal = 600;
    let rotY = 0;
    let rotX = 0;

    let isVisible = !document.hidden;

    const render = () => {
      animId = 0;
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = Math.min(height * 0.35, 320);

      rotY += 0.0018;
      rotX += 0.0006;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Project particles to 2D
      const projected: Array<{ px: number; py: number; pz: number; size: number; alpha: number }> =
        [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Bounce within sphere bounds
        if (Math.abs(p.x) > radius) p.vx *= -1;
        if (Math.abs(p.y) > radius) p.vy *= -1;
        if (Math.abs(p.z) > radius) p.vz *= -1;

        // Rotate in 3D around Y and X axes
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        // Camera perspective projection
        const scale = focal / (focal + z2 + radius * 0.8);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;

        // Subtle mouse push
        const dx = px - mouseX;
        const dy = py - mouseY;
        const dist = Math.hypot(dx, dy);
        let mxPush = 0;
        let myPush = 0;
        if (dist < 120 && dist > 0) {
          const force = (1 - dist / 120) * 16;
          mxPush = (dx / dist) * force;
          myPush = (dy / dist) * force;
        }

        const alpha = Math.max(0.12, Math.min(0.85, (z2 + radius) / (radius * 2)));
        projected.push({
          px: px + mxPush,
          py: py + myPush,
          pz: z2,
          size: p.size * scale,
          alpha,
        });
      }

      // Draw faint cyber constellation lines
      const maxDist = 95;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dist = Math.hypot(p1.px - p2.px, p1.py - p2.py);
          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.16 * Math.min(p1.alpha, p2.alpha);
            ctx.strokeStyle = `rgba(143, 214, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // Draw glowing particle nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        ctx.fillStyle = `rgba(143, 214, 255, ${p.alpha * 0.7})`;
        ctx.shadowColor = 'rgba(143, 214, 255, 0.4)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.px, p.py, Math.max(0.8, p.size), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (!isVisible && animId) {
        cancelAnimationFrame(animId);
        animId = 0;
      } else if (isVisible && !animId) {
        animId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
      aria-hidden="true"
    />
  );
}
