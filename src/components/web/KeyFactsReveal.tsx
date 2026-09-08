'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const DEFAULT_FACTS = [
  { title: "Awwwards Aesthetics", desc: "We develop bespoke high-fidelity creative layouts that captivate at first sight.", icon: "Trophy" },
  { title: "Modular Pipeline", desc: "Dynamic scaling of development sprints using industry-compliant tech artists.", icon: "Users" },
  { title: "Enterprise Quality", desc: "Clean quad topologies, robust network netcodes, and sub-second web indexing.", icon: "ShieldCheck" },
  { title: "24/7 AI Sync", desc: "A live chatbot synchronized directly with local services and settings databases.", icon: "MessageSquare" }
];

const FEATURED_PROJECTS = [
  {
    id: 'proj-1',
    title: 'Solana Sandbox',
    desc: 'High-performance interactive 3D virtual environment with real-time assets.',
    date: 'OCTOBER 2025',
    image: '/images/img1.png'
  },
  {
    id: 'proj-2',
    title: 'Neon Odyssey',
    desc: 'AAA cinematic character designs, high-poly assets, and custom GLSL shader layers.',
    date: 'DECEMBER 2025',
    image: '/images/img2.jpg'
  },
  {
    id: 'proj-3',
    title: 'Ethereal Space',
    desc: 'Next-gen architectural rendering and WebGL browser optimization pipelines.',
    date: 'FEBRUARY 2026',
    image: '/images/img3.png'
  }
];

interface ContentProps {
  content?: {
    subtitle?: string;
    heading?: string;
    description1?: string;
    description2?: string;
    facts?: { title: string; desc: string; icon: string }[];
    projects?: { title: string; desc: string; date: string; image: string }[];
    projectsSubtitle?: string;
    projectsHeading?: string;
  };
}

export default function KeyFactsReveal({ content }: ContentProps) {
  const subtitle = content?.subtitle || "WHO WE ARE";
  const heading = content?.heading || "Architecting next-generation creative systems.";
  const description1 = content?.description1 || "LogicForge was founded by industry-leading art directors and engine programmers. We reject generic templates. We construct customized virtual assets and robust web frameworks that captivate target audiences and scale workflows.";
  const description2 = content?.description2 || "Our artists utilize procedural ZBrush sculpting and Substance metallic workflows, while our tech department replicates network logic and optimizes browser rendering frames.";
  
  const facts = content?.facts || DEFAULT_FACTS;
  const projects = content?.projects || FEATURED_PROJECTS;
  const projectsSubtitle = content?.projectsSubtitle || "PORTFOLIO SHOWCASE";
  const projectsHeading = content?.projectsHeading || "Co-production Masterpieces";

  const containerRef = useRef<HTMLDivElement>(null);
  const whoWeAreRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const stripContainerRef = useRef<HTMLDivElement>(null);
  const factsSliderRef = useRef<HTMLDivElement>(null);

  const [activeFactSlide, setActiveFactSlide] = useState(0);
  const [activeProjectSlide, setActiveProjectSlide] = useState(0);

  const scrollFactTo = (idx: number) => {
    if (!factsSliderRef.current) return;
    const container = factsSliderRef.current;
    const cards = container.querySelectorAll('.fact-card');
    const targetIdx = Math.max(0, Math.min(idx, cards.length - 1));
    if (cards[targetIdx]) {
      const card = cards[targetIdx] as HTMLElement;
      const leftOffset = card.offsetLeft - container.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
      container.scrollTo({
        left: Math.max(0, leftOffset),
        behavior: 'smooth'
      });
      setActiveFactSlide(targetIdx);
    }
  };

  const handleFactScroll = () => {
    if (!factsSliderRef.current) return;
    const container = factsSliderRef.current;
    const cards = container.querySelectorAll('.fact-card');
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    cards.forEach((cardEl, idx) => {
      const card = cardEl as HTMLElement;
      const cardLeft = card.offsetLeft - container.offsetLeft;
      const cardRight = cardLeft + card.clientWidth;
      if (containerCenter >= cardLeft && containerCenter <= cardRight) {
        setActiveFactSlide(idx);
      }
    });
  };

  const scrollProjectTo = (idx: number) => {
    if (!cardsGridRef.current) return;
    const container = cardsGridRef.current;
    const cards = container.querySelectorAll('.project-card');
    const targetIdx = Math.max(0, Math.min(idx, cards.length - 1));
    if (cards[targetIdx]) {
      const card = cards[targetIdx] as HTMLElement;
      const leftOffset = card.offsetLeft - container.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
      container.scrollTo({
        left: Math.max(0, leftOffset),
        behavior: 'smooth'
      });
      setActiveProjectSlide(targetIdx);
    }
  };

  const handleProjectScroll = () => {
    if (!cardsGridRef.current) return;
    const container = cardsGridRef.current;
    const cards = container.querySelectorAll('.project-card');
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    cards.forEach((cardEl, idx) => {
      const card = cardEl as HTMLElement;
      const cardLeft = card.offsetLeft - container.offsetLeft;
      const cardRight = cardLeft + card.clientWidth;
      if (containerCenter >= cardLeft && containerCenter <= cardRight) {
        setActiveProjectSlide(idx);
      }
    });
  };

  const renderHeadingLetters = (text: string) => {
    const words = text.split(' ');
    return words.map((word, wIdx) => (
      <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.22em] overflow-hidden align-bottom leading-none">
        {word.split('').map((char, cIdx) => (
          <span 
            key={cIdx} 
            className="projects-heading-letter inline-block translate-y-[105%] opacity-0"
            style={{ willChange: 'transform, opacity' }}
          >
            {char}
          </span>
        ))}
      </span>
    ));
  };

  useEffect(() => {
    // Register GSAP plugins inside client side hook
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const whoWeAre = whoWeAreRef.current;
    const content = contentRef.current;
    const cardsGrid = cardsGridRef.current;
    const stripContainer = stripContainerRef.current;

    if (!container || !whoWeAre || !content || !cardsGrid || !stripContainer) return;

    const strips = stripContainer.children;
    const cards = cardsGrid.querySelectorAll('.project-card');
    const subtitleEl = content.querySelector('.projects-subtitle');
    const headingLetters = content.querySelectorAll('.projects-heading-letter');

    // Create GSAP ScrollTrigger timeline
    const tl = gsap.timeline();

    // Set initial state of cards (invisible and scaled down)
    tl.set(cards, { opacity: 0, scale: 0.85 }, 0);
    tl.set(subtitleEl, { opacity: 0, y: 15 }, 0);
    tl.set(headingLetters, { y: '105%', opacity: 0 }, 0);

    // 1. Entrance Cover: Scale up from bottom to top (origin bottom, stagger end)
    tl.to(strips, {
      scaleY: 1,
      transformOrigin: 'center bottom',
      stagger: {
        each: 0.08,
        from: 'end' // Reverses the stagger order so bottom rises first
      },
      ease: 'none',
      duration: 1
    }, 0)
    // 2. Entrance Reveal: Set content opacity to 1 instantly behind covered strips
    .set(content, {
      opacity: 1
    }, 1.0)
    // 3. Entrance Reveal: Scale down to top (origin top, stagger end)
    .to(strips, {
      scaleY: 0,
      transformOrigin: 'center top',
      stagger: {
        each: 0.08,
        from: 'end'
      },
      ease: 'none',
      duration: 1
    }, 1.0)
    // 4. Staggered text letters reveal (starting at 2.0, AFTER strips animation has completed)
    .to(subtitleEl, {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: 0.4
    }, 2.0)
    .to(headingLetters, {
      y: '0%',
      opacity: 1,
      stagger: 0.02,
      ease: 'power2.out',
      duration: 0.4
    }, 2.0)
    // 5. Cards Staggered Zoom-In Entrance: starts at 2.4 (after text animation starts and settles)
    .to(cards, {
      opacity: 1,
      scale: 1,
      stagger: 0.15,
      ease: 'power2.out',
      duration: 0.5
    }, 2.4);

    // Pin the viewport to play transition
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=200%', // Set back to standard scroll depth for entrance animation only
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
      className="relative h-screen w-full bg-bg-dark overflow-hidden select-none border-t border-white/5 z-20"
    >
      {/* Layer 1: Starting Backdrop (WHO WE ARE Company Introduction) */}
      <div 
        ref={whoWeAreRef}
        className="absolute inset-0 w-full h-full flex items-center justify-center z-10 px-4 sm:px-6 md:px-12 py-8 sm:py-12 md:py-16 bg-cover bg-center overflow-y-auto md:overflow-hidden no-scrollbar"
        style={{ backgroundImage: 'url(/images/img19.png)' }}
      >
        {/* Dark overlay to ensure white text readability */}
        <div className="absolute inset-0 bg-bg-dark/85 z-0 pointer-events-none" />
        
        <div className="max-w-[105rem] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center relative z-10 my-auto">
          <div className="space-y-4 sm:space-y-6 text-left">
            <span className="inline-block text-xs text-neon-purple uppercase font-space font-bold tracking-widest bg-neon-purple/10 px-3 py-1.5 rounded-full border border-neon-purple/20">
              {subtitle}
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-space font-extrabold text-white leading-tight">
              {heading}
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 sm:line-clamp-none">
              {description1}
            </p>
            <p className="text-gray-400 text-xs leading-relaxed hidden sm:block">
              {description2}
            </p>
            <div className="pt-1 sm:pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs text-neon-cyan hover:text-white font-bold transition-colors cursor-pointer"
              >
                Read our company journey
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Timelines / Strengths Grid / Mobile Slider */}
          <div className="w-full">
            <div 
              ref={factsSliderRef}
              onScroll={handleFactScroll}
              className="flex md:grid md:grid-cols-2 gap-4 sm:gap-6 text-left overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar scrollbar-none py-2 px-1 w-full touch-pan-x"
              style={{
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {facts.map((fact, idx) => {
                const IconComp = (LucideIcons as any)[fact.icon] || LucideIcons.Sparkles;
                return (
                  <div 
                    key={idx} 
                    className="fact-card p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 space-y-3 shrink-0 w-[80vw] max-w-[280px] sm:max-w-[320px] md:w-auto md:max-w-none snap-center"
                  >
                    <IconComp className="w-7 h-7 sm:w-8 sm:h-8 text-neon-purple" />
                    <h4 className="font-space text-white font-bold text-sm">{fact.title}</h4>
                    <p className="text-gray-400 sm:text-gray-500 text-xs leading-relaxed">{fact.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Mobile Slider Controls for Facts (<= 767px) */}
            <div className="flex md:hidden items-center justify-center gap-3 mt-3">
              <button
                type="button"
                onClick={() => scrollFactTo(activeFactSlide - 1)}
                disabled={activeFactSlide === 0}
                aria-label="Previous fact"
                className="p-1.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1.5">
                {facts.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollFactTo(idx)}
                    aria-label={`Go to fact slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeFactSlide === idx
                        ? 'w-5 bg-neon-purple'
                        : 'w-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => scrollFactTo(activeFactSlide + 1)}
                disabled={activeFactSlide === facts.length - 1}
                aria-label="Next fact"
                className="p-1.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Layer 2: 5 Horizontal Transition Wipe Strips rising from the bottom */}
      <div 
        ref={stripContainerRef} 
        className="stripes-container absolute inset-0 pointer-events-none flex flex-col w-full h-dvh z-30"
      >
        <div className="stripe-item flex-1 w-full h-full bg-[#d2d2d2] origin-bottom scale-y-0" style={{ transformOrigin: 'center bottom', willChange: 'transform', paddingBottom: '1px' }} />
        <div className="stripe-item flex-1 w-full h-full bg-[#d2d2d2] origin-bottom scale-y-0" style={{ transformOrigin: 'center bottom', willChange: 'transform', marginTop: '-1px', paddingBottom: '1px' }} />
        <div className="stripe-item flex-1 w-full h-full bg-[#d2d2d2] origin-bottom scale-y-0" style={{ transformOrigin: 'center bottom', willChange: 'transform', marginTop: '-1px', paddingBottom: '1px' }} />
        <div className="stripe-item flex-1 w-full h-full bg-[#d2d2d2] origin-bottom scale-y-0" style={{ transformOrigin: 'center bottom', willChange: 'transform', marginTop: '-1px', paddingBottom: '1px' }} />
        <div className="stripe-item flex-1 w-full h-full bg-[#d2d2d2] origin-bottom scale-y-0" style={{ transformOrigin: 'center bottom', willChange: 'transform', marginTop: '-1px', paddingBottom: '1px' }} />
      </div>

      {/* Layer 3: Pinned Concrete-Grey Content Sheet */}
      <div
        ref={contentRef}
        className="absolute inset-0 w-full h-full bg-cover bg-center text-white opacity-0 z-25 flex flex-col justify-between py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12"
        style={{ backgroundImage: 'url(/images/bg-002.jpg)' }}
      >
        {/* Dark overlay to ensure white text readability */}
        <div className="absolute inset-0 bg-bg-dark/80 z-0 pointer-events-none" />

        <div className="max-w-[105rem] mx-auto w-full h-full flex flex-col justify-center items-center relative z-10 space-y-3 sm:space-y-4 my-auto">
          
          {/* Heading and Subtitle Block */}
          <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
            <span className="projects-subtitle inline-block text-[10px] text-neon-cyan uppercase font-space font-bold tracking-widest bg-neon-cyan/10 px-3.5 py-1.5 rounded-full border border-neon-cyan/20 opacity-0 transform translate-y-3">
              {projectsSubtitle}
            </span>
            <h3 className="font-space font-black text-2xl sm:text-3xl md:text-5xl text-white uppercase tracking-tight text-center leading-none">
              {renderHeadingLetters(projectsHeading)}
            </h3>
          </div>

          {/* Project Cards Grid / Mobile Slider */}
          <div className="w-full max-w-[105rem] relative">
            <div 
              ref={cardsGridRef}
              onScroll={handleProjectScroll}
              className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar scrollbar-none py-2 px-2 w-full touch-pan-x"
              style={{
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {projects.map((proj, idx) => (
                <div 
                  key={idx}
                  className="project-card relative group rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all duration-500 cursor-pointer flex flex-col h-[320px] sm:h-[360px] md:h-[400px] justify-end p-6 sm:p-8 shrink-0 w-[84vw] sm:w-[360px] md:w-auto snap-center"
                >
                  {/* Background Image of the project card */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 z-0"
                    style={{ backgroundImage: `url(${proj.image})` }}
                  />
                  
                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

                  {/* Content Block */}
                  <div className="relative z-20 space-y-2 sm:space-y-3 text-left">
                    <span className="text-[10px] text-neon-cyan font-bold uppercase tracking-wider bg-neon-cyan/10 px-2 py-0.5 rounded border border-neon-cyan/20">
                      {proj.date}
                    </span>
                    <h4 className="font-space font-extrabold text-lg sm:text-xl text-white group-hover:text-neon-cyan transition-colors">
                      {proj.title}
                    </h4>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                      {proj.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Slider Controls for Projects (<= 767px) */}
            <div className="flex md:hidden items-center justify-center gap-3 mt-3">
              <button
                type="button"
                onClick={() => scrollProjectTo(activeProjectSlide - 1)}
                disabled={activeProjectSlide === 0}
                aria-label="Previous project"
                className="p-1.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5">
                {projects.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollProjectTo(idx)}
                    aria-label={`Go to project slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeProjectSlide === idx
                        ? 'w-6 bg-neon-cyan'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => scrollProjectTo(activeProjectSlide + 1)}
                disabled={activeProjectSlide === projects.length - 1}
                aria-label="Next project"
                className="p-1.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Footer hint */}
          <div className="text-center text-[10px] text-gray-400 font-space font-bold tracking-wider pt-1">
            SCROLL DOWN TO TRAVERSE TO PORTFOLIO EXTRAS →
          </div>

        </div>
      </div>
    </div>
  );
}
