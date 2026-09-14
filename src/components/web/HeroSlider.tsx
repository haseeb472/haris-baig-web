'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

export interface SlideData {
  id: string;
  category: string;
  badge: string;
  title: string;
  highlightWords?: string[];
  description: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  image: string;
  imageAlt: string;
}

export const DEFAULT_HERO_SLIDES: SlideData[] = [
  {
    id: 'web-development',
    category: 'Web Development',
    badge: 'Available for Work',
    title: 'Transform your ideas into digital success with us!',
    highlightWords: ['digital success'],
    description: "We're your partner in product design, website creation, and high-performance WebGL architectures for every stage of your business.",
    primaryBtnText: 'Services',
    primaryBtnLink: '/services/web-development',
    secondaryBtnText: 'Our work',
    secondaryBtnLink: '/projects',
    image: '/images/hero/hero1.png',
    imageAlt: 'Web Development Background'
  },
  {
    id: '3d-art-work',
    category: '3D Art Work',
    badge: 'Available for Work',
    title: 'Crafting Iconic 3D Art & Character Production',
    highlightWords: ['3D Art'],
    description: 'AAA character retopology, high-poly asset modeling, procedural texturing, and expressive cinematic animations tailored for next-gen worlds.',
    primaryBtnText: 'Services',
    primaryBtnLink: '/services/character-dev',
    secondaryBtnText: 'Our work',
    secondaryBtnLink: '/projects',
    image: '/images/hero/hero2.png',
    imageAlt: '3D Art Work Background'
  },
  {
    id: 'mobile-app',
    category: 'Mobile App Development',
    badge: 'Available for Work',
    title: 'Engineered For Touch: High-Performance Mobile Apps',
    highlightWords: ['Mobile Apps'],
    description: 'Fluid cross-platform and native mobile applications with offline-first synchronization, buttery 120fps micro-interactions, and enterprise-grade cloud backends.',
    primaryBtnText: 'Services',
    primaryBtnLink: '/services/ar-vr',
    secondaryBtnText: 'Our work',
    secondaryBtnLink: '/projects',
    image: '/images/hero/hero3.png',
    imageAlt: 'Mobile App Development Background'
  },
  {
    id: 'game-development',
    category: 'Game Development',
    badge: 'Available for Work',
    title: 'Next-Gen Game Worlds Built With AAA Fidelity',
    highlightWords: ['Game Worlds'],
    description: 'Full-cycle game production spanning gameplay mechanics, dynamic physics, multiplayer networking, and cinematic shader pipelines across Unreal Engine & Unity.',
    primaryBtnText: 'Services',
    primaryBtnLink: '/services/game-development',
    secondaryBtnText: 'Our work',
    secondaryBtnLink: '/projects',
    image: '/images/hero/hero4.jpg',
    imageAlt: 'Game Development Background'
  }
];

interface HeroSliderProps {
  content?: {
    slides?: SlideData[];
    autoPlayInterval?: number;
  };
}

/**
 * SlideContent handles smooth entrance and exit animations per slide,
 * including the character-by-character SplitText title reveal.
 */
function SlideContent({ slide }: { slide: SlideData }) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return;

    const letters = titleEl.querySelectorAll('.hero-split-letter');
    if (letters.length === 0) return;

    const anim = gsap.fromTo(
      letters,
      { y: '110%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        stagger: 0.015,
        duration: 0.5,
        ease: 'power3.out',
        delay: 0.12
      }
    );

    return () => {
      anim.kill();
    };
  }, [slide.id]);

  const words = slide.title.split(' ');

  return (
    <motion.div
      key={slide.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      className="max-w-3xl flex flex-col items-start text-left w-full"
    >
      {/* Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="inline-flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md text-[11px] sm:text-xs text-gray-300 font-medium mb-4 sm:mb-6 md:mb-8 shadow-sm"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
        <span>{slide.badge}</span>
        <span className="text-white/30">•</span>
        <span className="text-neon-cyan font-space text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">
          {slide.category}
        </span>
      </motion.div>

      {/* Main Headline (SplitText character-by-character reveal, responsive typography) */}
      <h1
        ref={titleRef}
        className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.85rem] font-space font-extrabold text-white leading-[1.18] sm:leading-[1.12] tracking-tight mb-4 sm:mb-6 overflow-hidden py-1 w-full"
      >
        {words.map((word, wIdx) => {
          const isHighlighted = slide.highlightWords?.some((hw) =>
            word.toLowerCase().includes(hw.toLowerCase())
          );

          return (
            <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.24em]">
              {word.split('').map((char, cIdx) => (
                <span
                  key={cIdx}
                  className={`hero-split-letter inline-block translate-y-[110%] opacity-0 ${
                    isHighlighted
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-[#c084fc] to-neon-blue'
                      : 'text-white'
                  }`}
                  style={{ willChange: 'transform, opacity' }}
                >
                  {char}
                </span>
              ))}
            </span>
          );
        })}
      </h1>

      {/* Subtitle / Description */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300/85 font-sans font-normal leading-relaxed max-w-xl mb-6 sm:mb-8 md:mb-10"
      >
        {slide.description}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.28 }}
        className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto"
      >
        <Link
          href={slide.primaryBtnLink}
          className="group px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl font-space font-bold text-xs sm:text-sm uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all duration-300 shadow-[0_4px_24px_rgba(255,255,255,0.2)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.35)] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{slide.primaryBtnText}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href={slide.secondaryBtnLink}
          className="px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl font-space font-semibold text-xs sm:text-sm uppercase tracking-wider text-gray-200 hover:text-white border border-white/15 bg-white/[0.04] hover:bg-white/10 backdrop-blur-md transition-all duration-300 active:scale-95 flex items-center justify-center cursor-pointer"
        >
          <span>{slide.secondaryBtnText}</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function HeroSlider({ content }: HeroSliderProps) {
  const slides = content?.slides && content.slides.length > 0 ? content.slides : DEFAULT_HERO_SLIDES;
  const slideDuration = content?.autoPlayInterval || 6000; // 6 seconds per slide

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeSlide = slides[currentIndex];

  // Navigation handlers
  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-slide ticker with hover-to-pause
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      goToNextSlide();
    }, slideDuration);

    return () => clearInterval(timer);
  }, [isPaused, slideDuration, goToNextSlide]);

  return (
    <section
      className="relative w-full min-h-[580px] sm:min-h-[640px] md:min-h-[680px] lg:min-h-[720px] xl:min-h-[780px] lg:h-[82vh] lg:max-h-[850px] bg-[#07060c] text-white flex flex-col justify-between overflow-hidden select-none -mt-20 md:-mt-24 pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-10 md:pb-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero Showcase Slider"
    >
      {/* ========================================================================= */}
      {/* Full-width Image Background Layer (Proportional & Never Stretched)        */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={activeSlide.image}
              alt={activeSlide.imageAlt}
              fill
              priority
              quality={95}
              className="w-full h-full pointer-events-none select-none"
              style={{
                objectFit: 'cover',
                objectPosition: 'right center'
              }}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ========================================================================= */}
      {/* Foreground Content Area (Smooth In/Out on slide change)                  */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-[105rem] mx-auto px-6 sm:px-8 md:px-12 w-full my-auto">
        <AnimatePresence mode="wait">
          <SlideContent key={activeSlide.id} slide={activeSlide} />
        </AnimatePresence>
      </div>

      {/* ========================================================================= */}
      {/* Bottom Slider Navigation Controls (Tabs removed, clean buttons retained)   */}
      {/* ========================================================================= */}
      <div className="relative z-20 max-w-[105rem] mx-auto px-6 sm:px-8 md:px-12 w-full mt-6 sm:mt-8 md:mt-10">
        <div className="flex items-center justify-between sm:justify-end gap-4">
          
          {/* Slide index counter */}
          <div className="font-space text-xs font-bold tracking-wider text-gray-400 select-none">
            <span className="text-white text-sm">0{currentIndex + 1}</span>
            <span className="text-white/30 mx-1.5">/</span>
            <span>0{slides.length}</span>
          </div>

          {/* Navigation Controls (Prev / Next Arrows) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={goToPrevSlide}
              aria-label="Previous slide"
              className="p-2.5 sm:p-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/10 hover:border-white/25 text-white active:scale-90 backdrop-blur-md transition-all duration-300 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={goToNextSlide}
              aria-label="Next slide"
              className="p-2.5 sm:p-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/10 hover:border-white/25 text-white active:scale-90 backdrop-blur-md transition-all duration-300 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
