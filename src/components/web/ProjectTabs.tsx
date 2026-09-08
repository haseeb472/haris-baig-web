'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TabCategory {
  id: string;
  name: string;
  count?: number;
}

interface ProjectTabsProps {
  categories: TabCategory[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export default function ProjectTabs({
  categories,
  activeCategory,
  onSelectCategory
}: ProjectTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [dragMoved, setDragMoved] = useState(false);

  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    // Account for subpixel differences
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkScroll();

    const handleScroll = () => {
      checkScroll();
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        checkScroll();
      });
      resizeObserver.observe(el);
    }

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkScroll);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [checkScroll, categories]);

  // Center active tab when activeCategory changes
  useEffect(() => {
    const activeBtn = buttonRefs.current.get(activeCategory);
    const container = containerRef.current;
    if (activeBtn && container) {
      const scrollLeft =
        activeBtn.offsetLeft -
        container.clientWidth / 2 +
        activeBtn.clientWidth / 2;
      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth'
      });
    }
  }, [activeCategory]);

  const scrollByAmount = (offset: number) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({
      left: offset,
      behavior: 'smooth'
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    setIsDragging(true);
    setDragMoved(false);
    setStartX(e.pageX - container.offsetLeft);
    setScrollStart(container.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = containerRef.current;
    if (!container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 4) {
      setDragMoved(true);
    }
    container.scrollLeft = scrollStart - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleTabClick = (id: string) => {
    if (dragMoved) {
      setDragMoved(false);
      return;
    }
    onSelectCategory(id);
  };

  return (
    <section className="border-y border-white/5 py-4 md:py-6 relative select-none">
      <div className="relative flex items-center group/slider">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scrollByAmount(-240)}
          aria-label="Previous categories"
          className={`absolute -left-2 sm:-left-3 md:-left-4 z-20 w-8 h-8 md:w-9 md:h-9 rounded-xl glass-panel border border-white/15 bg-bg-dark/95 hover:bg-neon-purple/20 text-gray-300 hover:text-neon-cyan flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer active:scale-90 ${
            canScrollLeft
              ? 'opacity-100 translate-x-0 pointer-events-auto'
              : 'opacity-0 -translate-x-2 pointer-events-none'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Left gradient fade mask */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-r from-bg-dark via-bg-dark/90 to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Scrollable Track - Single line, never wraps, slider ready */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex items-center gap-2.5 overflow-x-auto scrollbar-none scroll-smooth flex-nowrap whitespace-nowrap py-1.5 px-2 w-full touch-pan-x ${
            isDragging ? 'cursor-grabbing select-none' : 'cursor-grab md:cursor-default'
          }`}
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                ref={(el) => {
                  if (el) buttonRefs.current.set(cat.id, el);
                  else buttonRefs.current.delete(cat.id);
                }}
                type="button"
                onClick={() => handleTabClick(cat.id)}
                className={`shrink-0 whitespace-nowrap px-4.5 py-2.5 rounded-xl border text-xs font-bold font-space uppercase transition-all duration-300 cursor-pointer select-none flex items-center gap-2 ${
                  isActive
                    ? 'bg-neon-purple/20 text-neon-cyan border-neon-purple/40 shadow-lg shadow-neon-purple/10 scale-102 ring-1 ring-neon-purple/30'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <span>{cat.name}</span>
                {cat.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-sans font-semibold ${
                      isActive
                        ? 'bg-neon-cyan/20 text-neon-cyan'
                        : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right gradient fade mask */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-bg-dark via-bg-dark/90 to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scrollByAmount(240)}
          aria-label="Next categories"
          className={`absolute -right-2 sm:-right-3 md:-right-4 z-20 w-8 h-8 md:w-9 md:h-9 rounded-xl glass-panel border border-white/15 bg-bg-dark/95 hover:bg-neon-purple/20 text-gray-300 hover:text-neon-cyan flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer active:scale-90 ${
            canScrollRight
              ? 'opacity-100 translate-x-0 pointer-events-auto'
              : 'opacity-0 translate-x-2 pointer-events-none'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
