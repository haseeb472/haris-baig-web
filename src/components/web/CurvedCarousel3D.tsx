'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

interface CurvedCarousel3DProps {
  testimonials: Testimonial[];
}

export default function CurvedCarousel3D({ testimonials }: CurvedCarousel3DProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  
  // We repeat the testimonials to form at least 6 cards for a complete circular cylinder ring
  let duplicatedItems = [...testimonials];
  while (duplicatedItems.length < 6) {
    duplicatedItems = [...duplicatedItems, ...testimonials];
  }
  const items = duplicatedItems;
  const N = items.length;
  const step = 360 / N; // Increment angle per card (e.g. 60 degrees for 6 cards)
  const radius = 640; // Cylinder radius in px - set to 640 to create space/gap (220px) between slides

  // Physics animation references
  const targetRotationRef = useRef(0);
  const displayedRotationRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Configurable physics constants
  const friction = 0.94; // Decay velocity through friction
  const lerpFactor = 0.12; // Spring display interpolation factor

  // Displayed rotation motion value
  const displayedRotateY = useMotionValue(0);

  // Listen to rotation changes to update active indicator dot
  useEffect(() => {
    return displayedRotateY.on('change', (latest) => {
      const normalized = (-latest % 360 + 360) % 360;
      const active = Math.round(normalized / step) % N;
      setActiveIdx(active);
    });
  }, [displayedRotateY, N, step]);

  // physics update loop running on requestAnimationFrame
  useEffect(() => {
    let animFrame: number;

    const updatePhysics = () => {
      // 1. Momentum decay on release (friction decay snap)
      if (!isDraggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.05) {
          targetRotationRef.current += velocityRef.current;
          velocityRef.current *= friction;
        } else if (velocityRef.current !== 0) {
          // Came to rest, snap to nearest card angle
          velocityRef.current = 0;
          const snapped = Math.round(targetRotationRef.current / step) * step;
          targetRotationRef.current = snapped;
        }
      }

      // 2. Spring interpolation (Lerp)
      const diff = targetRotationRef.current - displayedRotationRef.current;
      displayedRotationRef.current += diff * lerpFactor;
      displayedRotateY.set(displayedRotationRef.current);

      animFrame = requestAnimationFrame(updatePhysics);
    };

    animFrame = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animFrame);
  }, [step, friction, lerpFactor]);

  const handleDragStart = () => {
    isDraggingRef.current = true;
    velocityRef.current = 0;
  };

  const handleDrag = (event: any, info: any) => {
    // Add real-time drag delta coordinates
    targetRotationRef.current += info.delta.x * 0.38;
    // Track rolling velocity
    velocityRef.current = info.delta.x * 0.38;
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
  };

  const handleCardClick = (idx: number) => {
    if (isDraggingRef.current) return;

    const current = targetRotationRef.current;
    const targetAngle = -idx * step;
    
    // Find closest rotation angle path
    const diff = ((targetAngle - current) % 360 + 540) % 360 - 180;
    targetRotationRef.current = current + diff;
    velocityRef.current = 0; // stop momentum on direct click
  };

  const handlePrev = () => {
    const current = targetRotationRef.current;
    targetRotationRef.current = Math.round(current / step) * step + step;
    velocityRef.current = 0;
  };

  const handleNext = () => {
    const current = targetRotationRef.current;
    targetRotationRef.current = Math.round(current / step) * step - step;
    velocityRef.current = 0;
  };

  const handleDotClick = (dotIdx: number) => {
    const current = targetRotationRef.current;
    const normalized = (-current % 360 + 360) % 360;
    const currentVirtualIdx = Math.round(normalized / step) % N;
    const targetIdx = dotIdx + (currentVirtualIdx >= testimonials.length ? testimonials.length : 0);
    handleCardClick(targetIdx);
  };

  // Background images matching the visual lookbook look from screenshot
  const bgImages = [
    '/images/img1.png',
    '/images/img2.jpg',
    '/images/img3.png',
    '/images/img4.jpg',
    '/images/img5.jpg',
    '/images/img6.png'
  ];

  // Visual tag pills matching screenshot colors
  const tagLabels = [
    'LOOKBOOK',
    'PHENOMENON',
    'EDITORIAL',
    'CREATIVE',
    'SYSTEMS',
    'PIPELINES'
  ];

  return (
    <div className="w-full flex flex-col items-center select-none py-10 relative">
      
      {/* 3D Scene Wrapper */}
      <div 
        className="w-full h-[620px] flex items-center justify-center relative overflow-visible"
        style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
      >
        {/* Navigation Arrows (Left / Right) placed at the sides */}
        <button
          onClick={handlePrev}
          suppressHydrationWarning
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#111111]/80 hover:bg-[#222222] border border-white/10 hover:border-white/20 text-white hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer z-40"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          suppressHydrationWarning
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#111111]/80 hover:bg-[#222222] border border-white/10 hover:border-white/20 text-white hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer z-40"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Cylinder Cylinder Ring Container - Draggable directly for better hover support */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className="w-full h-full relative flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
          style={{ transformStyle: 'preserve-3d', touchAction: 'none' }}
        >
          {items.map((item, idx) => {
            // Determine relative angle to map position and depth mathematically (using sine and cosine)
            const cardAngle = useTransform(displayedRotateY, (r) => {
              const angle = (r + idx * step) % 360;
              return angle > 180 ? angle - 360 : angle < -180 ? angle + 360 : angle;
            });

            // Calculate polar coordinates (X and Z positions around the cylinder center)
            const x = useTransform(cardAngle, (angle) => {
              return radius * Math.sin(angle * Math.PI / 180);
            });

            const z = useTransform(cardAngle, (angle) => {
              return radius * Math.cos(angle * Math.PI / 180) - radius;
            });

            // Map polar depth coordinates to scale, opacity, z-index, and blur dynamically
            // Set high visibility for side cards so they remain extremely prominent side-by-side in one frame
            const opacity = useTransform(z, [-1.8 * radius, 0], [0.15, 1]);
            const scale = useTransform(z, [-2 * radius, 0], [0.75, 1]);
            const zIndex = useTransform(z, (zVal) => Math.round(zVal) + 500);
            const blur = useTransform(z, [-1.8 * radius, 0], ['blur(6px)', 'blur(0px)']);

            const bgImage = bgImages[idx % bgImages.length];
            const tag = tagLabels[idx % tagLabels.length];

            return (
              <motion.div
                key={idx}
                onClick={() => handleCardClick(idx)}
                className="absolute w-[300px] sm:w-[420px] h-[400px] sm:h-[540px] rounded-[28px] overflow-hidden border border-white/5 p-8 flex flex-col justify-between cursor-pointer pointer-events-auto transition-shadow duration-300 hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] shadow-2xl group left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  x,
                  z,
                  scale,
                  opacity,
                  rotateY: 0, // Flat cards facing the camera directly, no 3D Y-axis rotation (curves in depth position only)
                  zIndex,
                  filter: blur,
                  willChange: 'transform, opacity, filter'
                }}
              >
                {/* Background Image Layer */}
                <div 
                  className="absolute inset-0 bg-cover bg-center scale-100 group-hover:scale-105 transition-transform duration-700 z-0 pointer-events-none"
                  style={{ backgroundImage: `url(${bgImage})` }}
                />
                
                {/* Dark Vignette Overlay for Title Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/30 z-0 pointer-events-none" />

                {/* Content Overlay */}
                <div className="relative z-10 w-full h-full flex flex-col justify-between items-start pointer-events-none">
                  
                  {/* Top: Yellow Tag Pill matching Screenshot */}
                  <span className="px-3 py-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 font-space font-bold uppercase tracking-wider text-[9px] pointer-events-auto">
                    {tag}
                  </span>

                  {/* Middle/Bottom Stack */}
                  <div className="w-full space-y-4 pointer-events-auto">
                    {/* Testimonial Quote */}
                    <p className="text-white text-xs leading-relaxed font-sans italic line-clamp-4">
                      "{item.quote}"
                    </p>

                    {/* Divider */}
                    <div className="h-[1px] w-full bg-white/10" />

                    {/* Author & Citation */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue flex items-center justify-center font-bold text-xs text-white">
                        {item.author[0]}
                      </div>
                      <div>
                        <h4 className="font-space font-bold text-white text-xs uppercase">{item.author}</h4>
                        <p className="text-neon-cyan text-[10px] font-semibold mt-0.5 uppercase tracking-wider">
                          {item.role}, {item.company}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Pagination indicators */}
      <div className="flex gap-2 mt-8 z-40 relative">
        {testimonials.map((_, idx) => {
          const isActive = activeIdx % testimonials.length === idx;
          return (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              suppressHydrationWarning
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                isActive ? 'w-8 bg-white' : 'w-2.5 bg-white/15 hover:bg-white/30'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
