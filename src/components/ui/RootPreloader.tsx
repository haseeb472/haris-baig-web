'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function RootPreloader({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [isLoaderFinished, setIsLoaderFinished] = useState(false);
  const [shouldRenderLoader, setShouldRenderLoader] = useState(true);

  useEffect(() => {
    // 1. Lock native document body scroll and add class on mount
    document.body.style.overflow = 'hidden';
    document.body.classList.add('preloading');
    
    // Stop Lenis smooth scroll globally (repeatedly check until Lenis initializes)
    let lenisTimer = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.stop();
        clearInterval(lenisTimer);
      }
    }, 50);

    // 2. Start preloader progress increments
    let current = 0;
    const progressTimer = setInterval(() => {
      const step = Math.floor(Math.random() * 8) + 4; // Organic loading speed
      current = Math.min(100, current + step);
      setProgress(current);

      if (current >= 100) {
        clearInterval(progressTimer);
        
        // Hold on 100% briefly, then fade out preloader screen
        setTimeout(() => {
          setIsLoaderFinished(true);
          
          // Restore body scrolling
          document.body.style.overflow = ''; 
          if (typeof window !== 'undefined' && (window as any).lenis) {
            (window as any).lenis.start();
          }

          // Recalculate ScrollTriggers in correct DOM order once mounted
          setTimeout(() => {
            gsap.registerPlugin(ScrollTrigger);
            ScrollTrigger.refresh();
          }, 150);

          setTimeout(() => {
            setShouldRenderLoader(false);
            // Fade in navbar/header ONLY after the loader screen has completely finished fading out
            document.body.classList.remove('preloading');
          }, 650);
        }, 400);
      }
    }, 60);

    return () => {
      clearInterval(lenisTimer);
      clearInterval(progressTimer);
      document.body.style.overflow = '';
      document.body.classList.remove('preloading');
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.start();
      }
    };
  }, []);

  return (
    <>
      {/* Dynamic Preloader Screen */}
      {shouldRenderLoader && (
        <div
          className={`fixed inset-0 w-screen h-screen bg-bg-dark z-[99999] flex flex-col items-center justify-center transition-opacity duration-600 ease-out select-none ${
            isLoaderFinished ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Logo Brand Icon */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <Image
              src="/images/icons/brand_logo.svg"
              alt="Fourth Pixel"
              width={249}
              height={287}
              priority
              className="w-[90px] sm:w-[105px] h-auto object-contain brightness-0 invert drop-shadow-[0_0_30px_rgba(255,255,255,0.25)] animate-pulse"
            />
          </div>

          {/* Horizontal Progress Bar */}
          <div className="w-56 sm:w-64 h-1 bg-white/10 rounded-full overflow-hidden relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
            <div
              className="h-full bg-gradient-to-r from-neon-purple to-neon-blue rounded-full transition-all duration-150 ease-out shadow-[0_0_10px_rgba(6,182,212,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress Percentage label */}
          <span className="text-[10px] font-space text-gray-400 mt-3.5 tracking-widest font-bold animate-pulse">
            {progress}%
          </span>
        </div>
      )}

      {/* Render layout and children only after loading is completed */}
      {isLoaderFinished && children}
    </>
  );
}
