'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Globe, Smartphone, Layers, CheckSquare, ShoppingBag, 
  ArrowRight, Check, ShieldCheck, Database, 
  TrendingUp, Play, ChevronLeft, ChevronRight, Sparkles 
} from 'lucide-react';
import SplitText from '@/components/web/SplitText';

const SERVICES_DATA = [
  {
    num: '01',
    category: 'web-development',
    name: 'Web Development',
    title: 'High-Performance Web Architectures',
    desc: 'We engineer bespoke frontend applications utilizing Next.js React Server Components and dynamic WebGL layers. We reject templates, building optimized, accessible, and indexable web platforms that load instantly.',
    bulletTitle: 'Key Technical Specs',
    bullets: [
      'Next.js 15 & React Server Components (RSC)',
      'Sub-second page speeds and performance index',
      'WebGL canvas models & hardware-accelerated shaders',
      'Edge CDN routing with automated deployment triggers'
    ],
    ctaText: 'Explore Web Portfolio',
    ctaLink: '/services/web-development',
    accentColor: 'var(--color-neon-purple)',
    cardBg: '#150a24',
    mockupType: 'web'
  },
  {
    num: '02',
    category: 'app-development',
    name: 'App Development',
    title: 'Cross-Platform Mobile Applications',
    desc: 'Fluid native-feel mobile app production for iOS and Android. Built with React Native or Flutter, our apps provide offline-first state synchronization, local SQLite caching, and native hardware API integrations.',
    bulletTitle: 'Core Capabilities',
    bullets: [
      'React Native & Flutter unified codebase',
      'Native modules and background workers',
      'Local SQLite & database syncing pipelines',
      'Automated TestFlight & Google Play submissions'
    ],
    ctaText: 'Request App Spec',
    ctaLink: '/services/app-development',
    accentColor: 'var(--color-neon-cyan)',
    cardBg: '#110820',
    mockupType: 'app'
  },
  {
    num: '03',
    category: 'cms-integration',
    name: 'Headless CMS',
    title: 'Dynamic Content Management',
    desc: 'Decouple your web experience to empower editing teams. We build secure headless CMS architectures using Strapi or Sanity, integrated via Webhooks to push automated Incremental Static Regeneration (ISR) updates.',
    bulletTitle: 'CMS Integrations',
    bullets: [
      'Strapi, Sanity, and Contentful setups',
      'Bespoke block schemas and nested page builders',
      'On-demand webhook triggers and automated builds',
      'Granular admin controls and database migrations'
    ],
    ctaText: 'View Headless Demos',
    ctaLink: '/services/cms-integration',
    accentColor: 'var(--color-neon-cyan)',
    cardBg: '#180b2c',
    mockupType: 'cms'
  },
  {
    num: '04',
    category: 'qa-testing',
    name: 'QA & Automation',
    title: 'Zero-Regression Testing Audits',
    desc: 'Prevent software downtime and design regressions. We write robust end-to-end integration test suites in Playwright and Cypress, combined with continuous load stress testing and CI/CD pipelines.',
    bulletTitle: 'Verification Specs',
    bullets: [
      'Playwright & Cypress E2E automated suites',
      'Visual regression checks across viewports',
      'High-traffic load profiling and CDN auditing',
      'GitHub Actions automated deployment validation'
    ],
    ctaText: 'Request QA Audit',
    ctaLink: '/services/qa-testing',
    accentColor: 'var(--color-neon-purple)',
    cardBg: '#130922',
    mockupType: 'qa'
  },
  {
    num: '05',
    category: 'shopify-commerce',
    name: 'Shopify Commerce',
    title: 'Conversion-Engine Stores',
    desc: 'Headless e-commerce stores built on Shopify Hydrogen and Oxygen. We create custom storefronts, subscription setups, and payment gateway connections that increase customer checkout conversions.',
    bulletTitle: 'Shopify Features',
    bullets: [
      'Headless Shopify commerce (Hydrogen)',
      'High-converting bespoke cart components',
      'Subscription integrations & ERP synchronization',
      'Custom pixel tagging and analytics triggers'
    ],
    ctaText: 'Shopify Storefronts',
    ctaLink: '/services/shopify-commerce',
    accentColor: 'var(--color-neon-cyan)',
    cardBg: '#0e0618',
    mockupType: 'shopify'
  }
];

interface ContentProps {
  content?: {
    subtitle?: string;
    heading?: string;
    description?: string;
    services?: any[];
  };
}

export default function StackedServices({ content }: ContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileSliderRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const subtitle = content?.subtitle || "OUR CORE EXPERTISE";
  const heading = content?.heading || "Production-Grade Software Solutions";
  const description = content?.description || "We build clean, robust, and optimized software systems tailored to your technical requirements. Scroll to explore our development capabilities.";

  const services = content?.services || SERVICES_DATA;
  
  const totalSteps = services.length - 1;
  const stepHeight = 80; // vh per transition step
  const holdHeight = 60; // vh static hold buffer at the end
  const scrollHeight = totalSteps * stepHeight + holdHeight;
  const maxProgress = (totalSteps * stepHeight) / scrollHeight;

  // Handle mobile slider wheel scrolling horizontally
  const handleMobileWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!mobileSliderRef.current) return;
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
      mobileSliderRef.current.scrollLeft += e.deltaY * 0.9;
    }
  };

  // Scroll mobile slider to specific index
  const scrollToSlide = (idx: number) => {
    if (!mobileSliderRef.current) return;
    const container = mobileSliderRef.current;
    const cards = container.querySelectorAll('.service-slide-card');
    if (cards[idx]) {
      const card = cards[idx] as HTMLElement;
      const leftOffset = card.offsetLeft - container.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
      container.scrollTo({
        left: Math.max(0, leftOffset),
        behavior: 'smooth'
      });
      setActiveSlide(idx);
    }
  };

  const handleMobileScroll = () => {
    if (!mobileSliderRef.current) return;
    const container = mobileSliderRef.current;
    const cards = container.querySelectorAll('.service-slide-card');
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    cards.forEach((cardEl, idx) => {
      const card = cardEl as HTMLElement;
      const cardLeft = card.offsetLeft - container.offsetLeft;
      const cardRight = cardLeft + card.clientWidth;
      if (containerCenter >= cardLeft && containerCenter <= cardRight) {
        setActiveSlide(idx);
      }
    });
  };

  return (
    <section className="relative w-full bg-bg-dark font-sans">
      {/* ========================================================================= */}
      {/* RESPONSIVE SLIDER LAYOUT (Screen Size <= 1023px - Tablets, Mobiles)        */}
      {/* ========================================================================= */}
      <div className="block lg:hidden py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="space-y-4 text-left">
          <span className="inline-block text-xs text-neon-cyan uppercase font-space font-bold tracking-widest bg-neon-cyan/10 px-3 py-1.5 rounded-full border border-neon-cyan/20">
            {subtitle}
          </span>
          <SplitText
            text={heading}
            className="text-2xl sm:text-4xl font-space font-extrabold tracking-tight text-white leading-tight"
            as="h2"
          />
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xl">
            {description}
          </p>

          {/* Quick Category Jump Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none pt-4 pb-1">
            {services.map((srv, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToSlide(idx)}
                className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-xl border text-[11px] font-bold font-space uppercase transition-all duration-300 cursor-pointer ${
                  activeSlide === idx
                    ? 'bg-neon-purple/20 text-neon-cyan border-neon-purple/40 shadow-lg shadow-neon-purple/10'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {srv.num} {srv.name}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Slider Track with mouse-wheel & touch swipe */}
        <div
          ref={mobileSliderRef}
          onWheel={handleMobileWheel}
          onScroll={handleMobileScroll}
          className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar scrollbar-none snap-x snap-mandatory py-2 px-1 w-full touch-pan-x"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {services.map((service, idx) => (
            <div
              key={idx}
              className="service-slide-card w-[86vw] sm:w-[580px] md:w-[640px] shrink-0 snap-center rounded-[28px] glass-panel border border-white/10 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl transition-all duration-300"
              style={{ backgroundColor: service.cardBg }}
            >
              {/* Subtle Ambient Glow */}
              <div 
                className="absolute -right-20 -top-20 w-52 h-52 rounded-full opacity-15 blur-3xl pointer-events-none" 
                style={{ background: `radial-gradient(circle, ${service.accentColor} 0%, transparent 70%)` }}
              />

              {/* Card Top Tab */}
              <div className="w-full flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span 
                    className="font-space font-black text-xs tracking-wider uppercase bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg"
                    style={{ color: service.accentColor }}
                  >
                    {service.num}
                  </span>
                  <span className="font-space font-extrabold text-xs sm:text-sm uppercase tracking-widest text-white">
                    {service.name}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">SPEC-L{service.num}</span>
              </div>

              {/* Card Content */}
              <div className="space-y-4 pt-5 text-left">
                <h3 className="font-space font-extrabold text-lg sm:text-2xl text-white tracking-tight leading-snug">
                  {service.title}
                </h3>

                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  {service.desc}
                </p>

                {/* Key Technical Specs */}
                <div className="space-y-2 pt-2">
                  <h4 className="font-space font-bold text-[10px] sm:text-xs uppercase tracking-wider text-gray-400">
                    {service.bulletTitle}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                    {service.bullets.map((bullet: string, bIdx: number) => (
                      <li key={bIdx} className="flex items-center gap-2">
                        <span className="p-0.5 rounded bg-white/5 text-neon-cyan flex-shrink-0">
                          <Check className="w-3.5 h-3.5" style={{ color: service.accentColor }} />
                        </span>
                        <span className="line-clamp-1">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual Mockup Display (Properly sized and framed, never cut off) */}
                <div className="w-full h-[220px] sm:h-[250px] rounded-2xl bg-black/80 border border-white/10 p-3 sm:p-4 mt-4 overflow-hidden flex items-center justify-center relative shadow-inner">
                  <MockupDisplay type={service.mockupType} />
                </div>

                {/* CTA Link Button */}
                <div className="pt-3">
                  <Link
                    href={service.ctaLink}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-neon-purple/20 border border-white/15 text-white font-space font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
                  >
                    <span>{service.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: service.accentColor }} />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Slider Navigation Controls (Prev/Next & Dots) */}
        <div className="flex items-center justify-between pt-2 px-2">
          <span className="font-space font-bold text-xs text-gray-400">
            <span className="text-neon-cyan font-black">0{activeSlide + 1}</span> / 0{services.length}
          </span>

          <div className="flex items-center gap-2">
            {services.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlide === idx ? 'w-8 bg-neon-cyan' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToSlide(Math.max(0, activeSlide - 1))}
              disabled={activeSlide === 0}
              aria-label="Previous service"
              className="p-2 rounded-xl glass-panel border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-white/30 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollToSlide(Math.min(services.length - 1, activeSlide + 1))}
              disabled={activeSlide === services.length - 1}
              aria-label="Next service"
              className="p-2 rounded-xl glass-panel border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-white/30 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* DESKTOP STACKED SCROLL LAYOUT (Screen Size >= 1024px)                     */}
      {/* ========================================================================= */}
      <div 
        ref={containerRef} 
        className="hidden lg:block relative w-full overflow-visible mb-24 md:mb-32"
        style={{ height: `${scrollHeight}vh` }}
      >
        {/* Sticky viewport container */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-20 flex flex-col justify-start pt-20 xl:pt-24">
          
          {/* Background Orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5 z-0">
            <div className="mesh-orb-1 top-1/4 left-1/10" />
            <div className="mesh-orb-2 bottom-1/4 right-1/10" />
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
            {/* Header Section */}
            <div className="max-w-3xl mb-8 text-left">
              <span className="inline-block mb-3 text-xs text-neon-cyan uppercase font-space font-bold tracking-widest bg-neon-cyan/10 px-3 py-1.5 rounded-full border border-neon-cyan/20">
                {subtitle}
              </span>
              <SplitText
                text={heading}
                className="text-2xl md:text-4xl font-space font-extrabold mt-0 tracking-tight text-white leading-tight"
                as="h2"
              />
              <p className="text-gray-400 text-xs md:text-sm mt-2 leading-relaxed max-w-xl">
                {description}
              </p>
            </div>
          </div>

          {/* Cards Stack Area */}
          <div className="relative w-full flex-1 max-w-7xl mx-auto px-6 md:px-12 overflow-visible">
            {services.map((service, idx) => {
              const divisor = Math.max(1, services.length - 1);
              const start = ((idx - 1) / divisor) * maxProgress;
              const end = (idx / divisor) * maxProgress;
              
              // Cards slide up from the bottom of the viewport
              const y = useTransform(
                scrollYProgress,
                [0, Math.max(0, start), Math.min(maxProgress, end), 1],
                ["100vh", "100vh", "0vh", "0vh"]
              );

              return (
                <motion.div
                  key={idx}
                  className="absolute left-6 right-6 md:left-12 md:right-12"
                  style={{
                    top: `${idx * 44}px`, // folder tab height offsets
                    zIndex: idx + 1,
                    y: idx === 0 ? "0vh" : y
                  }}
                >
                  <div 
                    className="w-full rounded-[24px] md:rounded-[32px] glass-panel border border-white/5 shadow-2xl flex flex-col h-[52vh] md:h-[55vh] justify-between relative overflow-hidden"
                    style={{ backgroundColor: service.cardBg }}
                  >
                    {/* Floating subtle radial glow */}
                    <div 
                      className="absolute -right-24 -top-24 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none" 
                      style={{ background: `radial-gradient(circle, ${service.accentColor} 0%, transparent 70%)` }}
                    />

                    {/* Top Tab Header */}
                    <div className="w-full h-[50px] border-b border-white/5 bg-white/[0.01] px-6 md:px-8 flex items-center justify-between flex-shrink-0 z-10">
                      <div className="flex items-center gap-3">
                        <span 
                          className="font-space font-black text-[10px] sm:text-xs tracking-wider uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg"
                          style={{ color: service.accentColor }}
                        >
                          {service.num}
                        </span>
                        <span className="font-space font-extrabold text-[10px] sm:text-xs uppercase tracking-widest text-white/90">
                          {service.name}
                        </span>
                      </div>
                      <span className="text-[9px] text-gray-600 font-mono hidden sm:inline">CAPABILITY // SPEC-L{service.num}</span>
                    </div>

                    {/* Body Content Area */}
                    <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row gap-6 lg:gap-10 items-center justify-between overflow-hidden">
                      {/* Left Column: Details */}
                      <div className="flex-1 space-y-4 text-left max-w-2xl overflow-y-auto pr-1">
                        <h3 className="font-space font-extrabold text-xl md:text-2xl lg:text-3xl text-white tracking-tight leading-tight">
                          {service.title}
                        </h3>

                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                          {service.desc}
                        </p>

                        <div className="space-y-2 pt-1">
                          <h4 className="font-space font-bold text-[10px] md:text-xs uppercase tracking-wider text-gray-300">
                            {service.bulletTitle}
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] md:text-xs text-gray-400">
                            {service.bullets.map((bullet: string, bIdx: number) => (
                              <li key={bIdx} className="flex items-center gap-2">
                                <span className="p-0.5 rounded bg-white/5 text-neon-cyan flex-shrink-0">
                                  <Check className="w-3 h-3" style={{ color: service.accentColor }} />
                                </span>
                                <span className="line-clamp-1">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2">
                          <Link
                            href={service.ctaLink}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-space font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-lg hover:shadow-black/50"
                          >
                            <span>{service.ctaText}</span>
                            <ArrowRight className="w-3.5 h-3.5" style={{ color: service.accentColor }} />
                          </Link>
                        </div>
                      </div>

                      {/* Right Column: Visual Mockup */}
                      <div className="w-full lg:w-[380px] xl:w-[440px] h-[200px] lg:h-[95%] rounded-2xl bg-black/60 border border-white/5 p-4 flex items-center justify-center relative overflow-hidden shadow-inner flex-shrink-0">
                        <MockupDisplay type={service.mockupType} />
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

function MockupDisplay({ type }: { type: string }) {
  switch (type) {
    case 'web':
      return (
        <div className="w-full h-full flex flex-col rounded-xl overflow-hidden bg-[#0d0d0d] font-mono text-[10px] text-gray-400 border border-white/10 p-3.5">
          {/* Mockup Header tab */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <span className="text-[9px] text-gray-500">AppRouter.tsx</span>
            <div className="w-4" />
          </div>
          {/* Mockup Code Lines */}
          <div className="flex-1 space-y-1.5 overflow-hidden text-left leading-relaxed">
            <p className="text-gray-600">// Next.js React Server Component</p>
            <p><span className="text-[#a3e635]">import</span> {"{ readDb }"} <span className="text-[#a3e635]">from</span> <span className="text-[#4ade80]">"@/lib/cms"</span>;</p>
            <p><span className="text-[#a3e635]">export default async function</span> <span className="text-[#4ade80]">Page</span>() {"{"}</p>
            <p className="pl-4">const data = <span className="text-[#a3e635]">await</span> readDb();</p>
            <p className="pl-4">const services = data.services;</p>
            <p className="pl-4"><span className="text-[#a3e635]">return</span> (</p>
            <p className="pl-8 text-gray-500">&lt;<span className="text-[#4ade80]">section</span> className="grid gap-6"&gt;</p>
            <p className="pl-12 text-[#a3e635]">{"{services.map((srv) => ("}</p>
            <p className="pl-16 text-gray-500">&lt;<span className="text-[#4ade80]">Card</span> key={"{srv.id}"} data={"{srv}"} /&gt;</p>
            <p className="pl-12 text-[#a3e635]">{"}))}"}</p>
            <p className="pl-8 text-gray-500">&lt;/<span className="text-[#4ade80]">section</span>&gt;</p>
            <p className="pl-4">);</p>
            <p>{"}"}</p>
          </div>
          {/* Status Indicator */}
          <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-500">
            <span className="flex items-center gap-1 text-[#a3e635]"><ShieldCheck className="w-3 h-3" /> TypeScript Compiled</span>
            <span>UTF-8</span>
          </div>
        </div>
      );

    case 'app':
      return (
        <div className="w-[180px] h-[95%] border-4 border-gray-800 rounded-[32px] bg-bg-dark p-2.5 flex flex-col justify-between shadow-2xl relative">
          {/* Speaker / Notch */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-gray-800 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-camera rounded-full opacity-60 ml-3" />
          </div>

          <div className="flex-1 flex flex-col justify-between mt-3 text-left font-sans select-none">
            {/* Top Stat */}
            <div className="flex justify-between items-center text-[8px] text-gray-500 font-bold tracking-wider px-1">
              <span>9:41 AM</span>
              <div className="flex items-center gap-1">
                <span>5G</span>
                <div className="w-3.5 h-2 border border-gray-500 rounded-sm flex items-center p-0.5"><div className="w-full h-full bg-gray-500" /></div>
              </div>
            </div>

            {/* Dashboard Card */}
            <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-2.5 space-y-2">
              <span className="text-[7px] text-gray-500 uppercase font-extrabold tracking-wider">Metrics</span>
              <p className="text-sm font-bold text-white leading-none mt-0">$4,892.10</p>
              <div className="flex items-center gap-1 text-[8px] text-[#4ade80]">
                <TrendingUp className="w-2.5 h-2.5" />
                <span>+12.4% this week</span>
              </div>
            </div>

            {/* Micro Charts Grid */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-[#a3e635]/10 border border-[#a3e635]/20 rounded-lg p-1.5 text-center">
                <span className="text-[6px] text-gray-500 block uppercase font-bold">Conversion</span>
                <span className="text-[9px] font-bold text-[#a3e635]">3.42%</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-1.5 text-center">
                <span className="text-[6px] text-gray-500 block uppercase font-bold">Retention</span>
                <span className="text-[9px] font-bold text-white">98.2%</span>
              </div>
            </div>

            {/* UI List mock */}
            <div className="mt-2 space-y-1.5 flex-1 overflow-hidden">
              <span className="text-[7px] text-gray-500 uppercase font-extrabold tracking-wider px-1 block">Active Sessions</span>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue flex items-center justify-center text-[7px] text-white font-bold">S</div>
                  <div className="leading-tight">
                    <p className="text-[8px] text-white font-bold">Sarah V.</p>
                    <p className="text-[6px] text-gray-500">Creative Dev</p>
                  </div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              </div>
            </div>

            {/* Footer Nav Bar */}
            <div className="w-full flex justify-around border-t border-white/10 pt-2 text-[8px] text-gray-500 font-bold">
              <span className="text-[#a3e635]">Home</span>
              <span>Data</span>
              <span>Account</span>
            </div>
          </div>
        </div>
      );

    case 'cms':
      return (
        <div className="w-full h-full flex flex-col rounded-xl overflow-hidden bg-[#0d0d0d] font-sans text-[10px] text-gray-400 border border-white/10 p-3.5">
          {/* Header Dashboard tab */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3.5">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#4ade80]" />
              <span className="text-[10px] text-white font-bold font-space uppercase tracking-wider">CMS Admin Panel</span>
            </div>
            <span className="text-[8px] bg-[#4ade80]/15 border border-[#4ade80]/25 px-1.5 py-0.5 rounded text-[#4ade80] font-bold">Synced Live</span>
          </div>

          <div className="flex-1 space-y-3 text-left">
            <div className="space-y-1">
              <label className="text-[7px] text-gray-500 uppercase font-extrabold tracking-wider block">Document Title</label>
              <div className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-white font-semibold">
                LogicForge Immersive Realities
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[7px] text-gray-500 uppercase font-extrabold tracking-wider block">slug prefix</label>
                <div className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-gray-500 font-mono">
                  /services/web-dev
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[7px] text-gray-500 uppercase font-extrabold tracking-wider block">Publish Status</label>
                <div className="w-full bg-[#a3e635]/10 border border-[#a3e635]/30 rounded-lg px-2.5 py-2 text-[#a3e635] font-bold text-center flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-pulse" />
                  <span>PUBLISHED</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[7px] text-gray-500 uppercase font-extrabold tracking-wider block">Content Schema Blocks</label>
              <div className="border border-dashed border-white/10 rounded-lg p-2.5 text-center text-gray-500 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-white/20 transition-all">
                <span className="text-[8px] font-bold text-white">+ Add Layout Block</span>
                <span className="text-[6px]">Hero split, Gallery, Services, Stats grid support</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'qa':
      return (
        <div className="w-full h-full flex flex-col rounded-xl overflow-hidden bg-[#0d0d0d] font-mono text-[9px] text-gray-400 border border-white/10 p-3.5">
          {/* Header tab */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3 text-left">
            <span className="text-white font-bold uppercase tracking-wider font-space text-[10px]">Test Runner</span>
            <span className="text-gray-500 font-bold uppercase text-[8px]">Playwright Run: #2429</span>
          </div>

          {/* Test lines list */}
          <div className="flex-1 space-y-2 text-left overflow-hidden">
            <div className="flex items-center justify-between text-gray-500">
              <span>$ npx playwright test --project=chromium</span>
              <span>Running...</span>
            </div>
            
            <div className="flex items-center gap-2 text-[#a3e635]">
              <span>✔</span>
              <span>[chromium] › homepage.spec.ts:12 › Load hero reveal banner</span>
              <span className="ml-auto text-[8px] text-gray-600">(152ms)</span>
            </div>

            <div className="flex items-center gap-2 text-[#a3e635]">
              <span>✔</span>
              <span>[chromium] › contact.spec.ts:32 › Submit inquiry lead form</span>
              <span className="ml-auto text-[8px] text-gray-600">(412ms)</span>
            </div>

            <div className="flex items-center gap-2 text-[#a3e635]">
              <span>✔</span>
              <span>[chromium] › payment.spec.ts:74 › Checkout headless gateway</span>
              <span className="ml-auto text-[8px] text-gray-600">(890ms)</span>
            </div>

            <div className="flex items-center gap-2 text-[#a3e635]">
              <span>✔</span>
              <span>[chromium] › api.spec.ts:182 › CMS database connection fetch</span>
              <span className="ml-auto text-[8px] text-gray-600">(54ms)</span>
            </div>
          </div>

          {/* Verification Box */}
          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[8px]">PASS</span>
              <span className="text-[10px] text-white font-bold font-space">42 / 42 passed</span>
            </div>
            <span className="text-[8px] text-gray-500">Duration: 1.5s</span>
          </div>
        </div>
      );

    case 'shopify':
      return (
        <div className="w-full h-full flex flex-col rounded-xl overflow-hidden bg-[#0d0d0d] font-sans text-[10px] text-gray-400 border border-white/10 p-3.5">
          {/* Header tab */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3 text-left">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#a3e635]" />
              <span className="text-[10px] text-white font-bold font-space uppercase tracking-wider">E-Commerce Checkout</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-ping" />
          </div>

          <div className="flex-1 flex flex-col justify-between text-left space-y-3">
            {/* Product card mock */}
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-2.5">
              <div className="flex items-center gap-2.5">
                {/* Simulated product photo */}
                <div className="w-10 h-10 rounded-lg bg-cover bg-center border border-white/10" style={{ backgroundImage: 'url(/images/img1.png)' }} />
                <div className="leading-tight">
                  <p className="text-[10px] text-white font-bold">AAA Custom Rig Model</p>
                  <p className="text-[8px] text-gray-500 font-semibold uppercase">Category: Gaming Asset</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white font-bold">$180.00</p>
                <p className="text-[8px] text-gray-500">Qty: 1</p>
              </div>
            </div>

            {/* Calculations Box */}
            <div className="space-y-1.5 text-xs text-gray-500 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">$180.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-[#a3e635] font-bold">FREE</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2 font-bold text-white text-sm">
                <span>Total Balance</span>
                <span className="text-[#a3e635] font-black">$180.00</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <div className="w-full rounded-xl py-2.5 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-space font-bold uppercase text-[9px] tracking-wider text-center flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-lg transition-all">
              <Play className="w-3 h-3 text-[#a3e635]" />
              <span>Complete Shopify Payment</span>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
