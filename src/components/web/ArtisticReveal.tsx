'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ContentProps {
  content?: {
    word1?: string;
    word2?: string;
    imageUrl?: string;
  };
}

export default function ArtisticReveal({ content }: ContentProps) {
  const word1 = content?.word1 || "ARTISTIC";
  const word2 = content?.word2 || "EXPRESSIONS";
  const imageUrl = content?.imageUrl || "/images/img7.jpg";

  const containerRef = useRef<HTMLDivElement>(null);
  const textLeftRef = useRef<HTMLDivElement>(null);
  const textRightRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useLayoutEffect(() => {
    // Register GSAP plugins inside client-side hook
    gsap.registerPlugin(ScrollTrigger);

    let refreshTimer: NodeJS.Timeout;

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const textLeft = textLeftRef.current;
      const textRight = textRightRef.current;
      const imageWrapper = imageWrapperRef.current;
      const imageInner = imageInnerRef.current;

      if (!container || !textLeft || !textRight || !imageWrapper || !imageInner) return;

      const isMobileVal = window.innerWidth < 768;

      // Set initial state of CSS variables to 0 (full screen)
      gsap.set(imageWrapper, {
        '--clip-top': '0%',
        '--clip-right': '0%',
        '--clip-bottom': '0%',
        '--clip-left': '0%',
        '--clip-round': '0px'
      });

      // Create GSAP ScrollTrigger timeline
      const tl = gsap.timeline();

      // Animate text converging to center and becoming fully visible
      tl.to(textLeft, {
        x: '0vw',
        opacity: 1,
        force3D: true,
        ease: 'none'
      }, 0)
      .to(textRight, {
        x: '0vw',
        opacity: 1,
        force3D: true,
        ease: 'none'
      }, 0)
      // Shrink the clipPath of image wrapper to become a centered card
      .to(imageWrapper, {
        '--clip-top': isMobileVal ? '25%' : '22%',
        '--clip-right': isMobileVal ? '15%' : '32%',
        '--clip-bottom': isMobileVal ? '25%' : '22%',
        '--clip-left': isMobileVal ? '15%' : '32%',
        '--clip-round': isMobileVal ? '24px' : '32px',
        ease: 'none'
      }, 0)
      // Animate the image scale to zoom in slightly for parallax
      .to(imageInner, {
        scale: 1.12,
        ease: 'none'
      }, 0);

      // Pin the viewport until image shrinks
      const st = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=150%', // Pin scroll distance
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tl,
      });

      // Recalculate ScrollTriggers in correct DOM order after layout settles
      refreshTimer = setTimeout(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      }, 350);
    }, containerRef);

    return () => {
      ctx.revert();
      if (refreshTimer) clearTimeout(refreshTimer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full bg-bg-dark overflow-hidden flex items-center justify-center select-none border-t border-white/5 z-20"
    >
      {/* Local Stylesheet for Re-render Proof Initial States */}
      <style dangerouslySetInnerHTML={{ __html: `
        .artistic-text-left-init {
          transform: translateX(-45vw);
          opacity: 0.15;
          will-change: transform, opacity;
        }
        .artistic-text-right-init {
          transform: translateX(45vw);
          opacity: 0.15;
          will-change: transform, opacity;
        }
        .artistic-image-wrapper-init {
          clip-path: inset(
            var(--clip-top, 0%) 
            var(--clip-right, 0%) 
            var(--clip-bottom, 0%) 
            var(--clip-left, 0%) 
            round 
            var(--clip-round, 0px)
          );
          will-change: clip-path;
        }
        @media (max-w: 767px) {
          .artistic-text-left-init {
            transform: translateX(-35vw);
          }
          .artistic-text-right-init {
            transform: translateX(35vw);
          }
        }
      `}} />

      {/* Absolute Header/Subtitle */}
      <div className="absolute top-12 left-0 right-0 flex justify-center z-30 pointer-events-none">
        <span className="inline-block text-[10px] text-neon-purple uppercase font-space font-bold tracking-widest bg-neon-purple/10 px-3.5 py-1.5 rounded-full border border-neon-purple/20">
          CO-PRODUCTION REVEAL
        </span>
      </div>

      {/* Centering Wrapper for Shrinking Image Mask (Starts Full Screen) */}
      <div 
        ref={imageWrapperRef}
        className="absolute inset-0 w-full h-full artistic-image-wrapper-init z-10 overflow-hidden pointer-events-none"
        suppressHydrationWarning
      >
        <div
          ref={imageInnerRef}
          className="w-full h-full bg-cover bg-center scale-100 pointer-events-auto"
          style={{
            backgroundImage: `url(${imageUrl})`,
            willChange: 'transform'
          }}
        />
        {/* Subtle Ambient Vignette inside the image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-10" />
      </div>

      {/* Stacked Text Panel on Top of the image */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none overflow-hidden">
        {/* Top Word (word1) - starts left, slides to center */}
        <div 
          ref={textLeftRef}
          className="font-space font-black text-6xl sm:text-8xl md:text-[9rem] lg:text-[11rem] tracking-tighter text-white uppercase leading-none select-none artistic-text-left-init"
        >
          {word1}
        </div>
        {/* Bottom Word (word2) - starts right, slides to center */}
        <div 
          ref={textRightRef}
          className="font-space font-black text-6xl sm:text-8xl md:text-[9rem] lg:text-[11rem] tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue uppercase leading-none select-none artistic-text-right-init -mt-2 sm:-mt-6"
        >
          {word2}
        </div>
      </div>

      {/* Absolute Footer Hint */}
      <div className="absolute bottom-12 left-0 right-0 text-center text-[10px] text-gray-500 font-space font-bold tracking-wider z-30 pointer-events-none">
        SCROLL DOWN TO REVEAL VISUALS →
      </div>
    </div>
  );
}
