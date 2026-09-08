'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SplitTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div';
  delay?: number;
}

export default function SplitText({ text, className = '', as = 'h2', delay = 0 }: SplitTextProps) {
  const headingRef = useRef<any>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const letters = el.querySelectorAll('.split-letter');
    if (letters.length === 0) return;

    const anim = gsap.to(letters, {
      y: 0,
      opacity: 1,
      stagger: 0.02, // Premium staggered letter spacing trigger
      duration: 0.5,
      ease: 'power2.out',
      delay: delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 90%', // Triggers early as element enters viewport
        toggleActions: 'play none none none',
      }
    });

    return () => {
      anim.kill();
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
    };
  }, [delay, text]);

  const Tag = as;
  const words = text.split(' ');

  return (
    <Tag ref={headingRef} className={`${className} overflow-hidden py-1`}>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.22em]">
          {word.split('').map((char, cIdx) => (
            <span 
              key={cIdx} 
              className="split-letter inline-block translate-y-[105%] opacity-0"
              style={{ willChange: 'transform, opacity' }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
