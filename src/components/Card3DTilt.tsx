import { useState, useRef, MouseEvent, ReactNode } from 'react';

interface Card3DTiltProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number; // max tilt angle in degrees (default 10)
  glare?: boolean;
}

/**
 * Card3DTilt — interactive physics-based 3D card tilt with dynamic holographic sheen.
 * Elevates cards with physical depth, specularity, and smooth cursor tracking.
 */
export default function Card3DTilt({
  children,
  className = '',
  maxTilt = 8,
  glare = true,
}: Card3DTiltProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    // If reduced motion is requested, skip tilt
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(
      `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.018, 1.018, 1.018)`,
    );

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlarePosition({ x: glareX, y: glareY, opacity: 0.18 });
    }
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all duration-200 ease-out will-change-transform ${className}`}
      style={{
        transform: transformStyle || 'perspective(800px) rotateX(0deg) rotateY(0deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}

      {/* Dynamic Specular Holographic Glare */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-xl transition-opacity duration-300"
          style={{
            opacity: glarePosition.opacity,
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(143, 214, 255, 0.35) 0%, rgba(143, 214, 255, 0.08) 35%, transparent 65%)`,
            mixBlendMode: 'screen',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
