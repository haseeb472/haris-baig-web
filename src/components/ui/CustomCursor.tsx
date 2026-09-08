'use client';

import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      setDotPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  // Smooth lagging ring effect
  useEffect(() => {
    let animationFrameId: number;

    const updateRing = () => {
      setPosition((prev) => {
        const dx = cursorRef.current.x - prev.x;
        const dy = cursorRef.current.y - prev.y;
        // Ease calculation
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      animationFrameId = requestAnimationFrame(updateRing);
    };

    animationFrameId = requestAnimationFrame(updateRing);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Ring */}
      <div
        className="custom-cursor hidden md:block"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovered ? '50px' : '20px',
          height: isHovered ? '50px' : '20px',
          borderColor: isHovered ? 'var(--color-neon-purple)' : 'color-mix(in srgb, var(--color-neon-purple) 50%, transparent)',
          backgroundColor: isHovered ? 'color-mix(in srgb, var(--color-neon-purple) 10%, transparent)' : 'transparent',
          boxShadow: isHovered ? '0 0 15px color-mix(in srgb, var(--color-neon-purple) 40%, transparent)' : 'none',
        }}
      />
      {/* Center Dot */}
      <div
        className="custom-cursor-dot hidden md:block"
        style={{
          left: `${dotPosition.x}px`,
          top: `${dotPosition.y}px`,
          backgroundColor: isHovered ? 'var(--color-neon-cyan)' : 'var(--color-neon-blue)',
        }}
      />
    </>
  );
}
