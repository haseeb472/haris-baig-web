'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export const DEFAULT_STATS = [
  { value: '150+', label: 'Shipped Projects' },
  { value: '25+', label: 'Creative Awards' },
  { value: '98%', label: 'Retention Rate' },
  { value: '45+', label: 'Global Artists' }
];

interface CounterProps {
  value: string;
  duration?: number;
  trigger: boolean;
}

function Counter({ value, duration = 2, trigger }: CounterProps) {
  const [displayNumber, setDisplayNumber] = useState('0');

  // Match: prefix (e.g. $, #), number (e.g. 150, 4.9, 1,000), suffix (e.g. +, %, M)
  const match = value.match(/^([^0-9.]*)([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)(.*)$/);

  useEffect(() => {
    if (!trigger) return;

    if (!match) {
      setDisplayNumber(value);
      return;
    }

    const rawNumStr = match[2].replace(/,/g, '');
    const targetNum = parseFloat(rawNumStr);
    const hasDecimals = rawNumStr.includes('.');
    const decimalPlaces = hasDecimals ? rawNumStr.split('.')[1].length : 0;
    const hasCommas = match[2].includes(',');

    if (isNaN(targetNum)) {
      setDisplayNumber(value);
      return;
    }

    let startTimestamp: number | null = null;
    let animFrameId: number;

    // Quartic ease-out for ultra smooth deceleration
    const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const easedProgress = easeOutQuart(progress);
      const current = easedProgress * targetNum;

      if (hasDecimals) {
        setDisplayNumber(current.toFixed(decimalPlaces));
      } else if (hasCommas) {
        setDisplayNumber(Math.floor(current).toLocaleString());
      } else {
        setDisplayNumber(Math.floor(current).toString());
      }

      if (progress < 1) {
        animFrameId = requestAnimationFrame(step);
      } else {
        if (hasDecimals) {
          setDisplayNumber(targetNum.toFixed(decimalPlaces));
        } else if (hasCommas) {
          setDisplayNumber(Math.floor(targetNum).toLocaleString());
        } else {
          setDisplayNumber(Math.floor(targetNum).toString());
        }
      }
    };

    animFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameId);
  }, [trigger, value, duration]);

  if (!match) {
    return <span>{value}</span>;
  }

  const prefix = match[1];
  const suffix = match[3];

  return (
    <span className="inline-flex items-baseline">
      {prefix && <span className="text-neon-purple mr-0.5">{prefix}</span>}
      <span>{trigger ? displayNumber : '0'}</span>
      {suffix && <span className="text-neon-purple ml-0.5">{suffix}</span>}
    </span>
  );
}

interface StatsBlockProps {
  content?: {
    stats?: { value: string; label: string }[];
  };
}

export default function StatsBlock({ content }: StatsBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-40px' });
  const displayStats = content?.stats && content.stats.length > 0 ? content.stats : DEFAULT_STATS;

  return (
    <section
      ref={containerRef}
      className="relative z-10 -mt-10 py-10 bg-bg-dark/80 backdrop-blur-md border-y border-white/5 overflow-hidden"
    >
      {/* Subtle top glow accent */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-neon-purple/30 to-transparent pointer-events-none" />

      <div className="max-w-[105rem] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {displayStats.map((stat: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="text-center group"
            >
              <p className="text-3xl md:text-5xl font-space font-black text-white tracking-tight flex items-center justify-center">
                <Counter value={stat.value} trigger={isInView} duration={2.2} />
              </p>
              <p className="text-[10px] text-neon-cyan uppercase font-space font-bold tracking-widest mt-2 transition-colors duration-300 group-hover:text-white">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
