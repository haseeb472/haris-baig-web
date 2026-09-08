'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, HelpCircle, FileText, ChevronRight } from 'lucide-react';
import SplitText from '@/components/web/SplitText';

export interface LegalSection {
  id: string;
  number: string;
  title: string;
  subsections?: {
    heading: string;
    content: ReactNode;
  }[];
  content?: ReactNode;
}

export interface LegalDocLayoutProps {
  badge: string;
  title: string;
  lastUpdated: string;
  description: string;
  sections: LegalSection[];
}

export default function LegalDocLayout({
  badge,
  title,
  lastUpdated,
  description,
  sections
}: LegalDocLayoutProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id || '');
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Set up scroll-spy using scroll listener & getBoundingClientRect for bulletproof accuracy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // offset slightly below sticky point

      let currentId = sections[0]?.id || '';
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            currentId = section.id;
          }
        }
      }
      setActiveSectionId(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // Smooth scroll handler with offset for fixed navbar
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    setActiveSectionId(id);

    const scrollOffset = -160; // offset by 2x header height (160px)
    if (typeof window !== 'undefined' && (window as any).lenis) {
      (window as any).lenis.scrollTo(el, { offset: scrollOffset, duration: 0.8 });
    } else {
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset + scrollOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative w-full bg-bg-dark text-white font-sans py-12 sm:py-16 md:py-20">
      {/* Ambient background glows - safely clipped inside its own layer so parent overflow is visible */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] rounded-full bg-neon-purple/20 blur-[170px]" />
        <div className="absolute bottom-1/3 right-1/10 w-[450px] h-[450px] rounded-full bg-neon-cyan/20 blur-[150px]" />
      </div>

      <div className="max-w-[105rem] mx-auto px-4 sm:px-6 md:px-12 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Header Block */}
        <div className="max-w-4xl space-y-4 text-left border-b border-white/10 pb-8 sm:pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-cyan/20 bg-neon-cyan/10 text-xs font-semibold text-white uppercase tracking-wider">
            <span className="text-neon-cyan font-black text-sm tracking-tighter">::</span>
            <span className="font-space font-bold tracking-widest text-[11px] text-neon-cyan">{badge}</span>
          </div>

          <SplitText
            text={title}
            className="text-3xl sm:text-5xl md:text-6xl font-space font-black tracking-tight text-white uppercase leading-tight"
            as="h1"
          />

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-400 pt-1">
            <span className="font-mono text-neon-cyan/90 font-semibold">{lastUpdated}</span>
            <span className="text-white/20">•</span>
            <span>Official Studio Policy</span>
            <span className="text-white/20">•</span>
            <span>Version 2.4</span>
          </div>

          <p className="text-gray-300 text-sm sm:text-base max-w-3xl leading-relaxed pt-2">
            {description}
          </p>
        </div>

        {/* Mobile Sticky Horizontal Section Navigation Bar (<= 1023px) */}
        <div className="block lg:hidden sticky top-20 z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 py-3 bg-bg-dark/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex gap-2 overflow-x-auto no-scrollbar scrollbar-none touch-pan-x">
            {sections.map((section) => {
              const isActive = activeSectionId === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`shrink-0 whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-space font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/40 shadow-lg shadow-neon-cyan/10'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="font-mono text-[10px] text-neon-purple">{section.number}.</span>
                  <span>{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Left Sticky Card & Right Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT SIDE COLUMN: STICKY "CONTENTS" CARD (Matching Reference Image)       */}
          {/* ========================================================================= */}
          <div
            className="hidden lg:block lg:col-span-4 lg:sticky lg:top-[160px] self-start z-20"
            style={{ top: '160px' }}
          >
            <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-7 space-y-6 shadow-2xl">
              
              {/* Card Title */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-space font-bold uppercase tracking-widest text-neon-cyan">
                    Navigation
                  </span>
                  <h2 className="font-space font-bold text-white text-lg tracking-tight">
                    Contents
                  </h2>
                </div>
                <FileText className="w-5 h-5 text-neon-cyan/80" />
              </div>

              {/* Numbered Titles List */}
              <nav className="space-y-1.5" aria-label="Table of Contents">
                {sections.map((section) => {
                  const isActive = activeSectionId === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`relative w-full text-left py-2.5 px-3 rounded-xl transition-all duration-300 flex items-start gap-3 cursor-pointer group select-none ${
                        isActive
                          ? 'bg-white/5 text-neon-cyan font-bold font-space'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.03] font-medium'
                      }`}
                    >
                      {/* Left vertical glowing line indicator when active */}
                      {isActive && (
                        <motion.div
                          layoutId="activeContentIndicator"
                          className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-neon-cyan to-neon-purple rounded-r-full shadow-[0_0_10px_rgba(255,190,11,0.6)]"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}

                      <span
                        className={`font-mono text-xs font-bold shrink-0 pt-0.5 transition-colors ${
                          isActive ? 'text-neon-cyan' : 'text-gray-500 group-hover:text-neon-cyan'
                        }`}
                      >
                        {section.number}.
                      </span>

                      <span className="text-xs sm:text-sm leading-snug flex-1 font-space">
                        {section.title}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Bottom Card Scoping Callout */}
              <div className="pt-4 border-t border-white/10">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-neon-purple text-xs font-bold font-space uppercase">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Have Legal Questions?</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Our compliance director can review custom enterprise NDAs and bespoke master service agreements.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs text-neon-cyan hover:text-white font-bold pt-1 transition-colors group cursor-pointer"
                  >
                    <span>Contact Legal Desk</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT SIDE COLUMN: CONTENT SECTIONS (NO Accordion, Simple Rich Content)   */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 space-y-16 sm:space-y-20 text-left">
            {sections.map((section, idx) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-40 space-y-6 border-b border-white/10 pb-12 sm:pb-16 last:border-b-0"
              >
                {/* Section Header */}
                <div className="space-y-2">
                  <span className="font-mono text-xs font-bold tracking-wider text-neon-purple uppercase">
                    Section {section.number}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-space font-extrabold text-white tracking-tight">
                    {section.title}
                  </h2>
                </div>

                {/* Direct content if provided */}
                {section.content && (
                  <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-4">
                    {section.content}
                  </div>
                )}

                {/* Subsections if provided */}
                {section.subsections && section.subsections.length > 0 && (
                  <div className="space-y-8 pt-2">
                    {section.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="space-y-3">
                        <h3 className="text-base sm:text-lg font-space font-bold text-white/95 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                          <span>{sub.heading}</span>
                        </h3>
                        <div className="text-gray-300 text-xs sm:text-sm leading-relaxed pl-3.5 border-l border-white/10 space-y-3 font-sans">
                          {sub.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}

            {/* Bottom Inquiries Box */}
            <div className="mt-12 p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-lg">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-neon-cyan" />
                  <h3 className="font-space font-bold text-white text-base sm:text-lg">Need custom terms or white-label SLA?</h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  We frequently co-draft specialized co-production agreements, escrow requirements, and confidential IP schedules.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-space font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Inquire with Legal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
