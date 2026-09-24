'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import InteractiveHeroVisual from './InteractiveHeroVisual';

export interface HeroBannerContent {
  id?: string;
  category?: string;
  badge?: string;
  title?: string;
  highlightWords?: string[];
  description?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  image?: string;
  imageAlt?: string;
}

// Backward compatibility type alias
export type SlideData = HeroBannerContent;

export const DEFAULT_HERO_CONTENT: HeroBannerContent = {
  id: 'hero-banner',
  category: 'Web Development',
  badge: 'Available for Work',
  title: 'Transform your ideas into digital success with us!',
  highlightWords: ['digital success'],
  description: "We're your partner in product design, website creation, and high-performance WebGL architectures for every stage of your business.",
  primaryBtnText: 'Services',
  primaryBtnLink: '/services/web-development',
  secondaryBtnText: 'Our work',
  secondaryBtnLink: '/projects',
  image: '/images/hero/hero01.jpg',
  imageAlt: 'Hero Banner Background'
};

export const DEFAULT_HERO_SLIDES = [DEFAULT_HERO_CONTENT];

interface HeroSliderProps {
  content?: {
    title?: string;
    description?: string;
    badge?: string;
    category?: string;
    image?: string;
    imageAlt?: string;
    primaryBtnText?: string;
    primaryBtnLink?: string;
    secondaryBtnText?: string;
    secondaryBtnLink?: string;
    highlightWords?: string[];
    slides?: HeroBannerContent[];
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

  const words = (slide.title || '').split(' ');

  return (
    <motion.div
      key={slide.id || 'hero'}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      className="max-w-3xl flex flex-col items-start text-left w-full pointer-events-none"
    >
      {/* Pill Badge */}
      {slide.badge && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="inline-flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md text-[11px] sm:text-xs text-gray-300 font-medium mb-4 sm:mb-6 md:mb-8 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span>{slide.badge}</span>
          {slide.category && (
            <>
              <span className="text-white/30">•</span>
              <span className="text-neon-cyan font-space text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">
                {slide.category}
              </span>
            </>
          )}
        </motion.div>
      )}

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
      {slide.description && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300/85 font-sans font-normal leading-relaxed max-w-xl mb-6 sm:mb-8 md:mb-10"
        >
          {slide.description}
        </motion.p>
      )}

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.28 }}
        className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto pointer-events-auto"
      >
        {slide.primaryBtnText && slide.primaryBtnLink && (
          <Link
            href={slide.primaryBtnLink}
            className="group px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl font-space font-bold text-xs sm:text-sm uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all duration-300 shadow-[0_4px_24px_rgba(255,255,255,0.2)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.35)] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{slide.primaryBtnText}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}

        {slide.secondaryBtnText && slide.secondaryBtnLink && (
          <Link
            href={slide.secondaryBtnLink}
            className="px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl font-space font-semibold text-xs sm:text-sm uppercase tracking-wider text-gray-200 hover:text-white border border-white/15 bg-white/[0.04] hover:bg-white/10 backdrop-blur-md transition-all duration-300 active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <span>{slide.secondaryBtnText}</span>
          </Link>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function HeroSlider({ content }: HeroSliderProps) {
  // Use direct properties or fallback to default
  const banner: HeroBannerContent = {
    id: content?.slides?.[0]?.id || 'hero-banner',
    badge: content?.badge ?? content?.slides?.[0]?.badge ?? DEFAULT_HERO_CONTENT.badge,
    category: content?.category ?? content?.slides?.[0]?.category ?? DEFAULT_HERO_CONTENT.category,
    title: content?.title ?? content?.slides?.[0]?.title ?? DEFAULT_HERO_CONTENT.title,
    highlightWords: content?.highlightWords ?? content?.slides?.[0]?.highlightWords ?? DEFAULT_HERO_CONTENT.highlightWords,
    description: content?.description ?? content?.slides?.[0]?.description ?? DEFAULT_HERO_CONTENT.description,
    primaryBtnText: content?.primaryBtnText ?? content?.slides?.[0]?.primaryBtnText ?? DEFAULT_HERO_CONTENT.primaryBtnText,
    primaryBtnLink: content?.primaryBtnLink ?? content?.slides?.[0]?.primaryBtnLink ?? DEFAULT_HERO_CONTENT.primaryBtnLink,
    secondaryBtnText: content?.secondaryBtnText ?? content?.slides?.[0]?.secondaryBtnText ?? DEFAULT_HERO_CONTENT.secondaryBtnText,
    secondaryBtnLink: content?.secondaryBtnLink ?? content?.slides?.[0]?.secondaryBtnLink ?? DEFAULT_HERO_CONTENT.secondaryBtnLink,
    image: content?.image || content?.slides?.[0]?.image || DEFAULT_HERO_CONTENT.image,
    imageAlt: content?.imageAlt || content?.slides?.[0]?.imageAlt || DEFAULT_HERO_CONTENT.imageAlt
  };

  return (
    <section
      className="relative w-full h-screen min-h-[100vh] min-h-[100dvh] bg-[#07060c] text-white flex flex-col justify-center overflow-hidden select-none -mt-20 md:-mt-24 pt-20 md:pt-24"
      aria-label="Hero Banner"
    >
      {/* ========================================================================= */}
      {/* Interactive Hero Visual with Cybernetic Scanner & Energy Arc Hover Effect */}
      {/* ========================================================================= */}
      <InteractiveHeroVisual
        image={banner.image || '/images/hero/hero01.jpg'}
        alt={banner.imageAlt || banner.title || 'Hero Banner Image'}
      />

      {/* ========================================================================= */}
      {/* Foreground Content Area                                                  */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-[105rem] mx-auto px-6 sm:px-8 md:px-12 w-full my-auto pointer-events-none">
        <SlideContent slide={banner} />
      </div>
    </section>
  );
}

export { HeroSlider as HeroBanner };
