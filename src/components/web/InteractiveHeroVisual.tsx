'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface InteractiveHeroVisualProps {
  image: string;
  alt: string;
}

export default function InteractiveHeroVisual({ image, alt }: InteractiveHeroVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, relX: 0.5, relY: 0.5 });

  // Full-screen hover and mouse tracking across 100% of the hero section
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        setIsHovered(true);
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const relX = Math.max(0, Math.min(1, x / rect.width));
        const relY = Math.max(0, Math.min(1, y / rect.height));

        setMousePos({ x, y, relX, relY });
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none cursor-crosshair pointer-events-auto z-0"
      aria-label="Interactive Hero Visual"
    >
      {/* 100% Full-Screen Static Container (Zero movement on image or SVG on hover) */}
      <div className="relative w-full h-full overflow-hidden">
        {/* ========================================================================= */}
        {/* 1. 100% FULL-SCREEN IMAGE BOX (Completely static - no tilt, no movement)   */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Image
            src={image}
            alt={alt}
            fill
            priority
            quality={95}
            className="w-full h-full object-cover object-[80%_center] lg:object-[right_center] pointer-events-none"
            sizes="100vw"
          />

          {/* Ambient Vignettes for Seamless Blending with page background & readable text */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07060c] via-[#07060c]/60 lg:via-[#07060c]/25 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07060c] via-transparent to-[#07060c]/40 pointer-events-none" />
        </div>

        {/* ========================================================================= */}
        {/* 2. AMBIENT BLOOM / SHEEN HIGHLIGHT OVER 100% FULL SCREEN                  */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: 'radial-gradient(ellipse at 60% 45%, rgba(34, 211, 238, 0.18) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 80%)',
            mixBlendMode: 'screen',
          }}
        />

        {/* ========================================================================= */}
        {/* 3. 100% SVG CYBERNETIC SCANNER GRID (Fixed SVG, revealed under cursor)   */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 ease-out"
          style={{
            opacity: isHovered ? 1 : 0,
            WebkitMaskImage: `radial-gradient(circle 240px at ${mousePos.x}px ${mousePos.y}px, black 0%, rgba(0,0,0,0.6) 45%, transparent 100%)`,
            maskImage: `radial-gradient(circle 240px at ${mousePos.x}px ${mousePos.y}px, black 0%, rgba(0,0,0,0.6) 45%, transparent 100%)`,
          }}
        >
          {/* 100% Width & Height SVG Cyber Grid Pattern (Stationary, does not move) */}
          <svg className="absolute inset-0 w-full h-full opacity-90 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="artwork-cyber-grid" width="13" height="13" patternUnits="userSpaceOnUse">
                <circle cx="6.5" cy="6.5" r="1.1" fill="#22d3ee" fillOpacity="0.85" />
                <path d="M 13 0 L 0 0 0 13" fill="none" stroke="#06b6d4" strokeWidth="0.45" strokeOpacity="0.32" />
              </pattern>
              <pattern id="artwork-dense-dots" width="6.5" height="6.5" patternUnits="userSpaceOnUse">
                <circle cx="3.25" cy="3.25" r="0.75" fill="#a5f3fc" fillOpacity="0.65" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#artwork-cyber-grid)" />
            <rect width="100%" height="100%" fill="url(#artwork-dense-dots)" opacity="0.6" />
          </svg>

          {/* Glowing Core Spotlight under Cursor */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-transform duration-75"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              width: '280px',
              height: '280px',
              background: 'radial-gradient(circle, rgba(34,211,238,0.5) 0%, rgba(6,182,212,0.22) 35%, rgba(139,92,246,0.1) 60%, transparent 75%)',
              mixBlendMode: 'screen',
              filter: 'blur(7px)',
            }}
          />
        </div>

        {/* ========================================================================= */}
        {/* 4. FUTURISTIC TARGET RETICLE (100% Full Screen)                           */}
        {/* ========================================================================= */}
        {isHovered && (
          <div
            className="absolute pointer-events-none z-[5] transition-transform duration-75"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
            }}
          >
            {/* Orange Target Reticle Ring (as seen in reference design) */}
            <div className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-orange-400/80 shadow-[0_0_8px_rgba(251,146,60,0.5)] animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
