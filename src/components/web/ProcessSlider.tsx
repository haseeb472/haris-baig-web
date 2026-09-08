'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  step: string;
  title: string;
  desc: string;
  image?: string;
}

interface ProcessSliderProps {
  steps: Step[];
  category: string;
}

const CATEGORY_IMAGES: Record<string, string[]> = {
  'art-animation': [
    '/images/img9.png',
    '/images/img10.png',
    '/images/img11.png',
    '/images/img12.png'
  ],
  'game-development': [
    '/images/img13.jpg',
    '/images/img14.jpg',
    '/images/img15.jpg',
    '/images/img16.jpg'
  ],
  'web-development': [
    '/images/img17.jpg',
    '/images/img18.jpg',
    '/images/img19.png',
    '/images/img20.png'
  ]
};

export default function ProcessSlider({ steps, category }: ProcessSliderProps) {
  const N = steps.length;
  const extendedSteps = [...steps, ...steps, ...steps];
  
  const [activeIdx, setActiveIdx] = useState(N); // Start at first item of middle set
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['art-animation'];

  // Snap back index instantly to middle set when reaching boundaries to loop infinitely
  const handleTransitionEnd = () => {
    if (activeIdx >= 2 * N || activeIdx < N) {
      setTransitionEnabled(false);
      setActiveIdx((((activeIdx % N) + N) % N) + N);
    }
  };

  // Re-enable transitions after snapping index with a brief delay to ensure layout reflow
  useEffect(() => {
    if (!transitionEnabled) {
      const timer = setTimeout(() => {
        setTransitionEnabled(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled]);

  const handlePrev = () => {
    if (!transitionEnabled) return;
    setActiveIdx((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!transitionEnabled) return;
    setActiveIdx((prev) => prev + 1);
  };

  const handleCardClick = (idx: number) => {
    if (!transitionEnabled) return;
    setActiveIdx(idx);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
      {/* Left Column: Vertical Progress Line & Content */}
      <div className="lg:col-span-5 flex flex-col justify-between h-full">
        <div className="flex gap-8 items-start min-h-[220px]">
          {/* Vertical Dynamic Progress Bar Track */}
          <div className="relative w-[3px] h-[180px] bg-white/10 rounded-full shrink-0">
            {/* Smoothly growing filled indicator overlay */}
            <div 
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-neon-purple to-neon-blue rounded-full transition-all duration-1000 ease-out"
              style={{
                height: `${((activeIdx % N) / (N - 1)) * 100}%`
              }}
            />
            {/* Interactive stage dots along the progress path */}
            <div className="absolute inset-0 flex flex-col justify-between items-center py-0.5">
              {steps.map((_, idx) => {
                const isPassedOrActive = (activeIdx % N) >= idx;
                return (
                  <div 
                    key={idx} 
                    onClick={() => handleCardClick(idx + N)}
                    className={`w-3 h-3 rounded-full border-2 transition-all duration-500 cursor-pointer ${
                      isPassedOrActive 
                        ? 'bg-white border-white scale-110 shadow-[0_0_8px_#ffffff]' 
                        : 'bg-bg-dark border-white/20 hover:border-white/50'
                    }`} 
                  />
                );
              })}
            </div>
          </div>

          {/* Text content block */}
          <div className="flex-1 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx % N}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={{
                  initial: { opacity: 0 },
                  animate: { opacity: 1, transition: { duration: 0.3 } },
                  exit: { opacity: 0, transition: { duration: 0.3 } }
                }}
                className="flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  {/* Tagline: Animate first (delay: 0.1s, y: 30 -> 0) */}
                  <motion.span
                    variants={{
                      initial: { y: 30, opacity: 0 },
                      animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut', delay: 0.1 } },
                      exit: { y: -30, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }
                    }}
                    className="text-[10px] text-neon-purple uppercase font-space font-bold tracking-widest block"
                  >
                    0{(activeIdx % N) + 1} / PIPELINE STAGE
                  </motion.span>

                  {/* Heading: Animate second (delay: 0.5s, y: 30 -> 0) */}
                  <motion.h3
                    variants={{
                      initial: { y: 30, opacity: 0 },
                      animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut', delay: 0.5 } },
                      exit: { y: -30, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }
                    }}
                    className="text-3xl sm:text-4xl font-space font-extrabold text-white leading-tight uppercase"
                  >
                    {steps[activeIdx % N].title}
                  </motion.h3>

                  {/* Description: Animate first (delay: 0.15s, y: 30 -> 0) */}
                  <motion.p
                    variants={{
                      initial: { y: 30, opacity: 0 },
                      animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut', delay: 0.15 } },
                      exit: { y: -30, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }
                    }}
                    className="text-gray-400 text-xs leading-relaxed max-w-sm"
                  >
                    {steps[activeIdx % N].desc}
                  </motion.p>
                </div>

                {/* Explore Button CTA: Animate first (delay: 0.2s, y: 30 -> 0) */}
                <motion.div
                  variants={{
                    initial: { y: 30, opacity: 0 },
                    animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 } },
                    exit: { y: -30, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }
                  }}
                  className="pt-6"
                >
                  <button className="px-5 py-2.5 rounded-lg border border-white/20 text-[10px] uppercase font-space font-bold tracking-widest text-white hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer">
                    EXPLORE
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Counter and Navigation Controls */}
        <div className="flex items-center gap-6 mt-8 pl-[34px]">
          <span className="font-space font-bold text-xs text-white/50">
            <span className="text-white">0{(activeIdx % N) + 1}</span> / 0{N}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-all bg-white/5 hover:bg-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-all bg-white/5 hover:bg-white/10 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Sliding Preview Cards */}
      <div className="lg:col-span-7 overflow-hidden w-full pt-14 pb-8">
        <div
          className="flex gap-8"
          style={{
            transform: `translateX(-${activeIdx * 312}px) translateZ(0)`, // Force 3D hardware acceleration!
            transition: transitionEnabled ? 'transform 1000ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
            willChange: 'transform'
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedSteps.map((step, idx) => {
            const isActive = (((activeIdx % N) + N) % N) === (idx % N);
            return (
              <div 
                key={idx} 
                className={`flex flex-col shrink-0 items-start transition-all duration-1000 ease-out ${
                  isActive ? 'origin-left z-10 opacity-100' : 'origin-center z-0 opacity-30 grayscale'
                }`}
                style={{
                  transform: `scale(${isActive ? 1.1 : 0.85}) translateZ(0)`, // GPU accelerated scale
                  backfaceVisibility: 'hidden',
                  willChange: 'transform'
                }}
              >
                {/* Floating title above the card */}
                <div className="mb-4 font-space font-bold text-xs text-white uppercase tracking-wide">
                  {step.title}
                </div>
                
                {/* Card body frame */}
                <div
                  onClick={() => handleCardClick(idx)}
                  className="relative rounded-3xl overflow-hidden cursor-pointer w-[280px] h-[380px] transition-all duration-1000"
                  style={{
                    backgroundImage: `url(${step.image || images[idx % images.length]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  {/* Dark overlay for inactive cards */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-black/40 transition-opacity duration-1000" />
                  )}
                  {/* Subtle Ambient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
