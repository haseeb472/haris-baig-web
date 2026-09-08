'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ContentProps {
  content?: {
    image?: string;
  };
}

export default function AboutReverseReveal({ content }: ContentProps) {
  const bgImage = content?.image || '/images/img6.png';

  const containerRef = useRef<HTMLDivElement>(null);
  const textLeftRef = useRef<HTMLDivElement>(null);
  const textRightRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register GSAP plugins inside client side hook
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const textLeft = textLeftRef.current;
    const textRight = textRightRef.current;
    const image = imageRef.current;

    if (!container || !textLeft || !textRight || !image) return;

    // Create GSAP ScrollTrigger timeline
    const tl = gsap.timeline();

    // Synchronize horizontal text movement with card width/height shrink
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
    .to(image, {
      width: '85vw',
      maxWidth: '500px',
      height: '340px',
      borderRadius: '24px',
      force3D: true,
      ease: 'none'
    }, 0);

    // Pin the viewport until card shrinks and reveals text
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=120%', // Pin scroll distance
      pin: true,
      scrub: true, // Perfect synchronicity to prevent boundary clashing snaps
      anticipatePin: 1,
      invalidateOnRefresh: true,
      animation: tl,
    });

    // Timeout guarantees dynamic components above have finished mounting and creating triggers
    const timer = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      st.kill();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full bg-bg-dark overflow-hidden flex flex-col justify-between py-16 select-none border-t border-white/5 z-20"
    >
      {/* Top Text Panel - Starts shifted left and fanned out */}
      <div className="w-full flex justify-center z-10">
        <div
          ref={textLeftRef}
          className="font-space font-black text-6xl sm:text-8xl md:text-[10rem] lg:text-[12rem] tracking-tighter text-white uppercase text-center w-full leading-none"
          style={{ 
            transform: 'translateX(-40vw)', 
            opacity: 0.1,
            willChange: 'transform, opacity' 
          }}
        >
          CREATIVE
        </div>
      </div>

      {/* Centering Wrapper for Shrinking Showcase Image */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div
          ref={imageRef}
          className="w-full h-full max-w-full rounded-none overflow-hidden shadow-2xl relative pointer-events-auto"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: 'width, height, border-radius'
          }}
        >
          {/* Subtle Ambient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Bottom Text Panel - Starts shifted right and fanned out */}
      <div className="w-full flex justify-center z-10">
        <div
          ref={textRightRef}
          className="font-space font-black text-6xl sm:text-8xl md:text-[10rem] lg:text-[12rem] tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue uppercase text-center w-full leading-none"
          style={{ 
            transform: 'translateX(40vw)', 
            opacity: 0.1,
            willChange: 'transform, opacity' 
          }}
        >
          LEADERSHIP
        </div>
      </div>
    </div>
  );
}
