'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/web/SplitText';

const CARDS = [
  { 
    front: '/images/img9.png', 
    back: '/images/img10.png',
    width: 'w-[75vw] sm:w-[320px] md:w-[380px] lg:w-[420px] xl:w-[460px]',
    height: 'h-[260px] sm:h-[300px] md:h-[360px] lg:h-[400px] xl:h-[440px]',
    num: '(001)'
  },
  { 
    front: '/images/img11.png', 
    back: '/images/img12.png',
    width: 'w-[85vw] sm:w-[400px] md:w-[480px] lg:w-[540px] xl:w-[600px]',
    height: 'h-[220px] sm:h-[250px] md:h-[290px] lg:h-[330px] xl:h-[360px]',
    num: '(002)'
  },
  { 
    front: '/images/img13.jpg', 
    back: '/images/img14.jpg',
    width: 'w-[75vw] sm:w-[320px] md:w-[380px] lg:w-[420px] xl:w-[460px]',
    height: 'h-[260px] sm:h-[300px] md:h-[360px] lg:h-[400px] xl:h-[440px]',
    num: '(003)'
  },
  { 
    front: '/images/img15.jpg', 
    back: '/images/img16.jpg',
    width: 'w-[85vw] sm:w-[400px] md:w-[480px] lg:w-[540px] xl:w-[600px]',
    height: 'h-[220px] sm:h-[250px] md:h-[290px] lg:h-[330px] xl:h-[360px]',
    num: '(004)'
  },
  { 
    front: '/images/img17.jpg', 
    back: '/images/img18.jpg',
    width: 'w-[75vw] sm:w-[320px] md:w-[380px] lg:w-[420px] xl:w-[460px]',
    height: 'h-[260px] sm:h-[300px] md:h-[360px] lg:h-[400px] xl:h-[440px]',
    num: '(005)'
  }
];

interface ContentProps {
  content?: {
    subtitle?: string;
    heading?: string;
    description?: string;
    cards?: { front: string; back: string; width: string; height: string; num: string }[];
  };
}

export default function HeroGallery({ content }: ContentProps) {
  const subtitle = content?.subtitle || "GALLERY";
  const heading = content?.heading || "LogicForge Digital Production";
  const description = content?.description || "3D ARTISTRY • REAL-TIME ENGINES • WEBGL EXPERIENCE";
  const cards = content?.cards || CARDS;
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register GSAP plugins inside client side hook
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const track = trackRef.current;

    if (!container || !track) return;

    const getScrollDistance = () => {
      if (!track) return 0;
      const lastChild = track.lastElementChild as HTMLElement;
      if (!lastChild) return Math.max(0, track.scrollWidth - window.innerWidth);

      const paddingRight = parseFloat(window.getComputedStyle(track).paddingRight) || 0;
      const lastChildEnd = lastChild.offsetLeft + lastChild.offsetWidth + paddingRight;
      return Math.max(0, lastChildEnd - window.innerWidth);
    };

    let st: ScrollTrigger | null = null;
    let tl: gsap.core.Timeline | null = null;

    const initScroll = () => {
      const scrollDistance = getScrollDistance();
      if (scrollDistance <= 0) return;

      tl = gsap.timeline();
      tl.to(track, {
        x: () => -getScrollDistance(),
        ease: 'none',
        invalidateOnRefresh: true
      });

      st = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: () => `+=${getScrollDistance()}`,
        pin: true,
        scrub: 1, // Smooth scrub to prevent snapping and overshoots
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tl,
      });

      ScrollTrigger.refresh();
    };

    // Wait until layout stabilizes
    const timer = setTimeout(initScroll, 150);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (st) st.kill();
      if (tl) tl.kill();
    };
  }, [cards]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[520px] md:min-h-[600px] h-screen w-full bg-bg-dark overflow-hidden select-none border-t border-white/5"
    >
      {/* Sticky centered layout */}
      <div className="h-full w-full flex flex-col justify-center py-4 sm:py-8 md:py-10 relative z-10">
        
        {/* Gallery Title Area */}
        <div className="max-w-[105rem] mx-auto px-6 md:px-12 w-full text-center space-y-0">
          <span className="inline-block mb-2 sm:mb-4 text-[10px] text-neon-purple uppercase font-space font-bold tracking-widest bg-neon-purple/10 px-3.5 py-1.5 rounded-full border border-neon-purple/20">
            {subtitle}
          </span>
          <SplitText
            text={heading}
            className="text-2xl sm:text-4xl md:text-5xl font-space font-black text-white uppercase tracking-tight mt-0"
            as="h3"
          />
          <p className="text-[10px] sm:text-xs text-neon-cyan uppercase font-space font-bold tracking-widest mt-2 sm:mt-4">
            {description}
          </p>
        </div>

        {/* Horizontal Card Track with proper top space and responsive card sizes */}
        <div
          ref={trackRef}
          className="flex gap-6 sm:gap-12 md:gap-16 px-[10vw] sm:px-[15vw] items-center w-max mt-4 sm:mt-8 md:mt-12 mb-2"
        >
          {cards.map((card, idx) => (
            <div key={idx} className="flex flex-col items-start gap-3 flex-shrink-0">
              <GalleryCard 
                front={card.front} 
                width={card.width} 
                height={card.height} 
                back={card.back}
              />
              <span className="font-space text-gray-500 text-[10px] sm:text-xs font-bold tracking-widest px-2">
                {card.num}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function GalleryCard({ 
  front, 
  width, 
  height,
  back
}: { 
  front: string; 
  width: string; 
  height: string; 
  back?: string;
}) {
  return (
    <div className={`${width} ${height} relative rounded-2xl overflow-hidden glass-panel border border-white/5`}>
      <div 
        className="w-full h-full bg-cover bg-center opacity-85 transition-transform duration-700 ease-out hover:scale-105"
        style={{ backgroundImage: `url(${front})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
}
