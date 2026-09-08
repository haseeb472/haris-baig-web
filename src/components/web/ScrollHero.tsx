'use client';

import { useState, useEffect, useRef, useMemo, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, RefreshCw, Layers, ZoomIn, Sun, Moon } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ImageItem {
  src: string;
  alt: string;
}

const DEFAULT_IMAGES: ImageItem[] = [
  { src: '/images/img1.png', alt: 'Production asset 1' },
  { src: '/images/img2.jpg', alt: 'Production asset 2' },
  { src: '/images/img3.png', alt: 'Production asset 3' },
  { src: '/images/img4.jpg', alt: 'Production asset 4' },
  { src: '/images/img5.jpg', alt: 'Production asset 5' },
  { src: '/images/img6.png', alt: 'Production asset 6' },
  { src: '/images/img7.jpg', alt: 'Production asset 7' },
  { src: '/images/img8.png', alt: 'Production asset 8' },
  { src: '/images/img9.png', alt: 'Production asset 9' },
  { src: '/images/img10.png', alt: 'Production asset 10' },
  { src: '/images/img11.png', alt: 'Production asset 11' },
  { src: '/images/img12.png', alt: 'Production asset 12' },
  { src: '/images/img13.jpg', alt: 'Production asset 13' },
  { src: '/images/img14.jpg', alt: 'Production asset 14' },
  { src: '/images/img15.jpg', alt: 'Production asset 15' },
  { src: '/images/img16.jpg', alt: 'Production asset 16' },
  { src: '/images/img17.jpg', alt: 'Production asset 17' },
  { src: '/images/img18.jpg', alt: 'Production asset 18' },
  { src: '/images/img19.png', alt: 'Production asset 19' },
  { src: '/images/img20.png', alt: 'Production asset 20' }
];

interface ScrollHeroProps {
  images?: ImageItem[];
}

export default function ScrollHero({ images }: ScrollHeroProps) {
  const displayImages = images && images.length > 0 ? images : DEFAULT_IMAGES;

  // 1. Container refs & Dimension states
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [isMobile, setIsMobile] = useState(false);

  // 2. Interactive Property Controls configuration states
  const [config, setConfig] = useState({
    maxScroll: 3000,
    imageWidth: 90,
    imageHeight: 125,
    background: 'transparent',
    introTitle: 'The future is built on AI.',
    introSubtitle: 'SCROLL TO EXPLORE',
    contentTitle: 'Co-creating the Virtual Edge',
    contentDescription: 'We combine high-fidelity digital production, AAA assets, and real-time frontend WebGL architectures.',
    titleFont: 'Space Grotesk',
    subtitleFont: 'Plus Jakarta Sans',
    contentTitleFont: 'Space Grotesk',
    contentDescFont: 'Plus Jakarta Sans',
    introTitleColor: '#ffffff',
    introSubtitleColor: '#7c3aed', // Purple neon default
    contentTitleColor: '#06b6d4', // Cyan default
    contentDescColor: '#9ca3af'
  });

  const [showConfig, setShowConfig] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1 scroll progress
  const virtualScrollY = useRef(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Detect static bot / renderer to disable interactive scroll loops
  const [isStatic, setIsStatic] = useState(true);

  useEffect(() => {
    setIsStatic(
      typeof window === 'undefined' ||
      /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent)
    );
  }, []);

  // ResizeObserver for tracking container viewport size
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const w = width || window.innerWidth;
        const h = height || window.innerHeight;
        setDimensions({ width: w, height: h });
        setIsMobile(w < 768);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Mouse move listener for smooth multi-plane parallax depth updates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
      
      // Update mouse parallax inside non-blocking transaction
      startTransition(() => {
        setMousePos({ x, y });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Capture wheel/scroll events to drive scroll progress via ScrollTrigger
  useEffect(() => {
    if (isStatic) return;
    gsap.registerPlugin(ScrollTrigger);

    // Find the parent element pinned by HeroSplitReveal (which has class .h-screen)
    const parentElement = containerRef.current?.closest('.h-screen') || containerRef.current;

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: parentElement,
      start: 'top top',
      end: '+=180%', // Match the pin range in HeroSplitReveal
      scrub: 1.2,
      onUpdate: (self) => {
        // self.progress goes smoothly from 0 to 1 as the user scrolls the pin
        startTransition(() => {
          setProgress(self.progress);
        });
      }
    });

    return () => {
      scrollTriggerInstance.kill();
    };
  }, [isStatic]);

  // Memoize scatter coordinates so they remain consistent on re-renders
  const memoizedScatterOffsets = useMemo(() => {
    const N = displayImages.length;
    return Array.from({ length: N }, () => ({
      xMultiplier: Math.random() - 0.5,
      yMultiplier: Math.random() - 0.5,
      rotX: (Math.random() - 0.5) * 30,
      rotY: (Math.random() - 0.5) * 30,
      rotZ: (Math.random() - 0.5) * 50,
      z: (Math.random() - 0.5) * 150
    }));
  }, []);

  // Compute card coordinates for all 4 phases based on viewport size & configs
  const getPhaseCoordinates = (idx: number, phase: number) => {
    const N = displayImages.length;
    const { width: W, height: H } = dimensions;
    const cWidth = isMobile ? config.imageWidth * 0.75 : config.imageWidth;
    const cHeight = isMobile ? config.imageHeight * 0.75 : config.imageHeight;

    switch (phase) {
      case 0: {
        // Phase 1: Scatter (positioned randomly across the viewport)
        const offsets = memoizedScatterOffsets[idx];
        return {
          x: offsets.xMultiplier * (W - cWidth - 40),
          y: offsets.yMultiplier * (H - cHeight - 160),
          z: offsets.z,
          rotateX: offsets.rotX,
          rotateY: offsets.rotY,
          rotateZ: offsets.rotZ
        };
      }
      case 1: {
        // Phase 2: Line (images align horizontally in a straight line)
        const spacing = Math.min(cWidth + (isMobile ? 6 : 12), (W * 0.88) / N);
        const xOffset = (idx - (N - 1) / 2) * spacing;
        return {
          x: xOffset,
          y: 0,
          z: 0,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0
        };
      }
      case 2: {
        // Phase 3: Circle (images arrange into a circular formation)
        const radius = Math.min(W, H) * (isMobile ? 0.32 : 0.36);
        const angle = (idx / N) * 2 * Math.PI;
        return {
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle),
          z: 0,
          rotateX: 0,
          rotateY: 0,
          rotateZ: angle * (180 / Math.PI) - 90
        };
      }
      case 3:
      default: {
        // Phase 4: Arc (rainbow arch centered at the bottom of the canvas)
        const spreadAngle = Math.PI * (isMobile ? 0.6 : 0.75); // Adapt spread for mobile viewport
        const radius = Math.min(W, H) * (isMobile ? 0.42 : 0.46); // Adapt radius for mobile viewport
        const angle = Math.PI + spreadAngle * (idx / (N - 1) - 0.5);
        return {
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle) + radius * 0.85,
          z: -idx * 6, // Stacked depth layers
          rotateX: 12,
          rotateY: 0,
          rotateZ: (angle - Math.PI * 1.5) * (180 / Math.PI) * 0.4
        };
      }
    }
  };

  // Interpolate positions dynamically between phases based on progress (0 to 1)
  const cardPositions = useMemo(() => {
    const N = displayImages.length;
    return Array.from({ length: N }, (_, idx) => {
      // Return static end-state arc values if server-rendering or bot crawls
      if (isStatic) {
        return getPhaseCoordinates(idx, 3);
      }

      // Determine current interval
      if (progress <= 0.33) {
        const t = progress / 0.33;
        const from = getPhaseCoordinates(idx, 0);
        const to = getPhaseCoordinates(idx, 1);
        return {
          x: from.x + (to.x - from.x) * t,
          y: from.y + (to.y - from.y) * t,
          z: from.z + (to.z - from.z) * t,
          rotateX: from.rotateX + (to.rotateX - from.rotateX) * t,
          rotateY: from.rotateY + (to.rotateY - from.rotateY) * t,
          rotateZ: from.rotateZ + (to.rotateZ - from.rotateZ) * t
        };
      } else if (progress <= 0.66) {
        const t = (progress - 0.33) / 0.33;
        const from = getPhaseCoordinates(idx, 1);
        const to = getPhaseCoordinates(idx, 2);
        return {
          x: from.x + (to.x - from.x) * t,
          y: from.y + (to.y - from.y) * t,
          z: from.z + (to.z - from.z) * t,
          rotateX: from.rotateX + (to.rotateX - from.rotateX) * t,
          rotateY: from.rotateY + (to.rotateY - from.rotateY) * t,
          rotateZ: from.rotateZ + (to.rotateZ - from.rotateZ) * t
        };
      } else {
        const t = (progress - 0.66) / 0.34;
        const from = getPhaseCoordinates(idx, 2);
        const to = getPhaseCoordinates(idx, 3);
        return {
          x: from.x + (to.x - from.x) * t,
          y: from.y + (to.y - from.y) * t,
          z: from.z + (to.z - from.z) * t,
          rotateX: from.rotateX + (to.rotateX - from.rotateX) * t,
          rotateY: from.rotateY + (to.rotateY - from.rotateY) * t,
          rotateZ: from.rotateZ + (to.rotateZ - from.rotateZ) * t
        };
      }
    });
  }, [progress, dimensions, isMobile, config.imageWidth, config.imageHeight, isStatic]);

  // Compute text opacities: Intro fades out as arc forms, Content fades in when arc is fully formed
  const introOpacity = isStatic ? 0 : Math.max(0, 1 - (progress - 0.66) / 0.22);
  const contentOpacity = isStatic ? 1 : Math.max(0, (progress - 0.85) / 0.15);

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute inset-0 z-0 select-none overflow-hidden transition-colors duration-500 flex items-center justify-center"
      style={{ backgroundColor: config.background }}
    >
      {/* 3D Scene viewport container */}
      <div 
        className="w-full h-full relative flex items-center justify-center overflow-visible"
        style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
      >
        
        {/* (Text overlays removed to prevent overlapping with banner content) */}

        {/* Floating Developer Settings Control Panel Gear Button */}
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="absolute top-6 right-6 z-40 p-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-black/60 hover:bg-black/80 text-white hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-lg"
          aria-label="Customize scroll hero properties"
        >
          <Settings className="w-5 h-5 animate-[spin_8s_linear_infinite]" />
        </button>

        {/* Dynamic Glassmorphic Settings Sidebar Panel */}
        <AnimatePresence>
          {showConfig && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="absolute right-6 top-24 z-40 w-[300px] max-h-[75%] overflow-y-auto rounded-2xl border border-white/10 bg-black/75 backdrop-blur-xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] scrollbar-none text-white pointer-events-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <h4 className="font-space font-bold text-xs uppercase tracking-wider text-neon-cyan">Hero Configurations</h4>
                <button
                  onClick={() => setShowConfig(false)}
                  className="p-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4 text-[11px] font-sans">
                {/* Scroll Distance Control */}
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Max Scroll Distance ({config.maxScroll}px)</label>
                  <input
                    type="range"
                    min={1000}
                    max={5000}
                    step={100}
                    value={config.maxScroll}
                    onChange={(e) => setConfig(prev => ({ ...prev, maxScroll: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                  />
                </div>

                {/* Card Width & Height Controls */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-400 font-medium">Image Width</label>
                    <input
                      type="range"
                      min={40}
                      max={150}
                      value={config.imageWidth}
                      onChange={(e) => setConfig(prev => ({ ...prev, imageWidth: parseInt(e.target.value) }))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-400 font-medium">Image Height</label>
                    <input
                      type="range"
                      min={60}
                      max={200}
                      value={config.imageHeight}
                      onChange={(e) => setConfig(prev => ({ ...prev, imageHeight: parseInt(e.target.value) }))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                    />
                  </div>
                </div>

                {/* Preset Themes / Background */}
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Background Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={config.background}
                      onChange={(e) => setConfig(prev => ({ ...prev, background: e.target.value }))}
                      className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() => setConfig(prev => ({ ...prev, background: '#FAFAFA', introTitleColor: '#111111', contentDescColor: '#4b5563' }))}
                        className="p-1 px-2 rounded bg-white text-black font-semibold text-[8px] border border-black/10 cursor-pointer"
                      >
                        Light
                      </button>
                      <button
                        onClick={() => setConfig(prev => ({ ...prev, background: 'var(--color-bg-dark)', introTitleColor: '#ffffff', contentDescColor: '#9ca3af' }))}
                        className="p-1 px-2 rounded bg-neutral-900 text-white font-semibold text-[8px] border border-white/10 cursor-pointer"
                      >
                        Dark
                      </button>
                    </div>
                  </div>
                </div>

                {/* Text Customization controls */}
                <div className="space-y-2 border-t border-white/5 pt-3">
                  <h5 className="font-bold text-[9px] uppercase tracking-wider text-purple-400">Intro Texts</h5>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      placeholder="Intro Title"
                      value={config.introTitle}
                      onChange={(e) => setConfig(prev => ({ ...prev, introTitle: e.target.value }))}
                      className="w-full h-7 px-2 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neon-cyan/50 text-[10px]"
                    />
                    <input
                      type="text"
                      placeholder="Intro Subtitle"
                      value={config.introSubtitle}
                      onChange={(e) => setConfig(prev => ({ ...prev, introSubtitle: e.target.value }))}
                      className="w-full h-7 px-2 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neon-cyan/50 text-[10px]"
                    />
                  </div>
                </div>

                <div className="space-y-2 border-t border-white/5 pt-3">
                  <h5 className="font-bold text-[9px] uppercase tracking-wider text-neon-cyan">Content Texts</h5>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      placeholder="Content Title"
                      value={config.contentTitle}
                      onChange={(e) => setConfig(prev => ({ ...prev, contentTitle: e.target.value }))}
                      className="w-full h-7 px-2 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neon-cyan/50 text-[10px]"
                    />
                    <textarea
                      placeholder="Content Description"
                      value={config.contentDescription}
                      onChange={(e) => setConfig(prev => ({ ...prev, contentDescription: e.target.value }))}
                      className="w-full h-12 px-2 py-1 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-neon-cyan/50 text-[10px] resize-none"
                    />
                  </div>
                </div>

                {/* Color pickers */}
                <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-3">
                  <div className="space-y-1">
                    <label className="text-gray-400 font-medium">Intro Subtitle Color</label>
                    <input
                      type="color"
                      value={config.introSubtitleColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, introSubtitleColor: e.target.value }))}
                      className="w-full h-6 rounded border border-white/10 bg-transparent cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-400 font-medium">Content Title Color</label>
                    <input
                      type="color"
                      value={config.contentTitleColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, contentTitleColor: e.target.value }))}
                      className="w-full h-6 rounded border border-white/10 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Image Array Cards */}
        {displayImages.map((img, idx) => {
          const pos = cardPositions[idx];
          const cWidth = isMobile ? config.imageWidth * 0.75 : config.imageWidth;
          const cHeight = isMobile ? config.imageHeight * 0.75 : config.imageHeight;

          // Apply multi-plane stereoscopic mouse parallax offset based on depth (Z)
          // Front items (higher Z) drift more, back items (lower Z) drift less!
          const depthFactor = 1 + (pos.z / 220); // range from 0.3 to 1.7
          const parallaxX = mousePos.x * 50 * depthFactor;
          const parallaxY = mousePos.y * 25 * depthFactor;

          return (
            <motion.div
              key={idx}
              animate={{
                x: pos.x + parallaxX,
                y: pos.y + parallaxY,
                z: pos.z,
                rotateX: pos.rotateX,
                rotateY: pos.rotateY,
                rotateZ: pos.rotateZ
              }}
              transition={{
                type: 'spring',
                stiffness: 30, // lower stiffness for slower, more graceful movements
                damping: 18,   // high damping to reduce bounce
                mass: 1.15
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer pointer-events-auto"
              style={{
                width: cWidth,
                height: cHeight,
                perspective: 600,
                transformStyle: 'preserve-3d',
                willChange: 'transform'
              }}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Inner container to hold 3D flip card rotations */}
              <motion.div
                className="w-full h-full relative"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: hoveredCard === idx ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 18 }}
              >
                
                {/* Front Side: High-Fidelity Image wrapper */}
                <div
                  className="absolute inset-0 w-full h-full rounded-lg overflow-hidden border border-black/5 dark:border-white/5 bg-neutral-200 dark:bg-neutral-800 shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover pointer-events-none"
                    draggable="false"
                  />
                  {/* Glassmorphic border glow highlight */}
                  <div className="absolute inset-0 border border-white/20 rounded-lg pointer-events-none" />
                </div>

                {/* Back Side: Premium Details card */}
                <div
                  className="absolute inset-0 w-full h-full rounded-lg bg-black p-2 flex flex-col justify-between border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-1">
                    <span className="text-[7px] font-space text-neon-cyan font-bold tracking-widest">ASSET #{idx + 1}</span>
                    <Layers className="w-2.5 h-2.5 text-neon-cyan" />
                  </div>

                  <div className="space-y-0.5">
                    <h5 className="text-[8px] font-space font-extrabold text-white leading-none uppercase">LogicForge</h5>
                    <p className="text-[6px] text-gray-400 font-medium uppercase tracking-wide truncate">High-Res Render</p>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
