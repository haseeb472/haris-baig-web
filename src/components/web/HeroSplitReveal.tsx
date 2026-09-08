'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Dynamically load WebGL Scene to keep server builds clean
const ScrollHero = dynamic(() => import('@/components/web/ScrollHero'), {
  ssr: false
});

interface ContentProps {
  content?: {
    tagline?: string;
    heading?: string;
    subheading?: string;
    ctaText1?: string;
    ctaText2?: string;
    images?: { src: string; alt: string }[];
  };
}

export default function HeroSplitReveal({ content }: ContentProps) {
  const tagline = content?.tagline || "LOGICFORGE PRODUCTION";
  const heading = content?.heading || "We shape immersive realities";
  const subheading = content?.subheading || "LogicForge is a next-generation production studio bridging high-fidelity 3D assets, Unreal Engine architectures, and premium frontend WebGL technologies.";
  const ctaText1 = content?.ctaText1 || "Explore Work";
  const ctaText2 = content?.ctaText2 || "Get Quote";

  const heroRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const centerContentRef = useRef<HTMLDivElement>(null);

  // GSAP Pinning and Panel Reveal Animations (Initialized immediately on mount)
  useEffect(() => {
    // Register GSAP plugins inside client side hook
    gsap.registerPlugin(ScrollTrigger);

    const hero = heroRef.current;
    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;
    const centerContent = centerContentRef.current;

    if (!hero || !leftPanel || !rightPanel || !centerContent) return;

    // Set initial states for center content to prevent flash of unstyled content (FOUC)
    gsap.set(centerContent, {
      opacity: 0,
      scale: 0.8,
      y: 40,
      filter: 'blur(10px)',
      transformPerspective: 1000
    });

    // Create GSAP ScrollTrigger Timeline
    const tl = gsap.timeline();

    // Configure the translations and scales using hardware-accelerated transforms
    tl.to(leftPanel, {
      x: '-60vw',
      opacity: 0.05,
      force3D: true,
      ease: 'power2.inOut'
    }, 0)
    .to(rightPanel, {
      x: '60vw',
      opacity: 0.05,
      force3D: true,
      ease: 'power2.inOut'
    }, 0)
    .to(centerContent, {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      force3D: true,
      ease: 'power2.out'
    }, 0.1);

    // Create the pinning trigger wrapper
    const pinTrigger = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: '+=180%', // Pinned scroll distance equal to 180% of viewport height
      pin: true,
      scrub: 1.2, // Smooth scrubbing easing lag
      anticipatePin: 1,
      invalidateOnRefresh: true,
      animation: tl,
    });

    return () => {
      // Clean up GSAP instances
      pinTrigger.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden bg-bg-dark font-sans"
    >
      {/* Scroll-driven interactive image array hero banner */}
      <ScrollHero images={content?.images} />

      {/* Ambient Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-bg-dark/40 z-1 pointer-events-none" />

      {/* Centering Flexbox Wrapper */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        {/* Center Content Block (Reveals as panels split) */}
        <div
          ref={centerContentRef}
          className="w-full max-w-3xl px-6 text-center flex flex-col items-center gap-8 opacity-0 scale-[0.8] pointer-events-auto"
          style={{
            willChange: 'transform, opacity, filter'
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-purple/20 bg-neon-purple/10 text-xs font-semibold text-white uppercase tracking-wider select-none">
            <Sparkles className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
            <span>{tagline}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-space font-black text-white leading-tight uppercase select-none">
            {heading.split(/(immersive)/gi).map((part, i) => 
              part.toLowerCase() === 'immersive' ? (
                <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-[#a78bfa] to-neon-blue">
                  {part}
                </span>
              ) : part
            )}
          </h2>

          <p className="max-w-xl text-xs md:text-sm text-gray-400 font-medium leading-relaxed select-none">
            {subheading}
          </p>

          {/* CTA Slide Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="#works"
              className="btn-premium-slide px-6 h-12 rounded-xl font-space font-bold uppercase tracking-wider text-xs text-white bg-gradient-to-r from-neon-purple to-neon-blue shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/50 transition-all duration-300 cursor-pointer"
            >
              <span className="btn-premium-slide-text gap-2">
                {ctaText1} <ArrowRight className="w-4 h-4" />
              </span>
              <span className="btn-premium-slide-back gap-2">
                {ctaText1} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link
              href="/contact"
              className="btn-premium-slide px-6 h-12 rounded-xl font-space font-bold uppercase tracking-wider text-xs text-gray-300 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 transition-all cursor-pointer"
            >
              <span className="btn-premium-slide-text">{ctaText2}</span>
              <span className="btn-premium-slide-back">{ctaText2}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Left overlapping text panel */}
      <div
        ref={leftPanelRef}
        className="absolute left-0 w-1/2 h-full flex items-center justify-end pr-1 sm:pr-2 md:pr-4 z-20 pointer-events-none select-none"
        style={{ willChange: 'transform' }}
      >
        <h1 className="text-[clamp(2.4rem,10vw,12.5rem)] font-space font-black text-white leading-none uppercase tracking-tighter sm:tracking-tight whitespace-nowrap">
          LOGIC
        </h1>
      </div>

      {/* Right overlapping text panel */}
      <div
        ref={rightPanelRef}
        className="absolute right-0 w-1/2 h-full flex items-center justify-start pl-1 sm:pl-2 md:pl-4 z-20 pointer-events-none select-none"
        style={{ willChange: 'transform' }}
      >
        <h1 className="text-[clamp(2.4rem,10vw,12.5rem)] font-space font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue leading-none uppercase tracking-tighter sm:tracking-tight whitespace-nowrap">
          FORGE
        </h1>
      </div>
    </div>
  );
}
