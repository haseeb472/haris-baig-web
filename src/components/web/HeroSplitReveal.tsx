'use client';

import HeroSlider, { SlideData } from '@/components/web/HeroSlider';

interface ContentProps {
  content?: {
    tagline?: string;
    heading?: string;
    subheading?: string;
    ctaText1?: string;
    ctaText2?: string;
    slides?: SlideData[];
    autoPlayInterval?: number;
  };
}

export default function HeroSplitReveal({ content }: ContentProps) {
  // Seamlessly renders the new luxury HeroSlider, replacing the previous cards & split text animation
  return <HeroSlider content={content} />;
}
