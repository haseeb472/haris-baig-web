'use client';

import HeroSlider, { HeroBannerContent } from '@/components/web/HeroSlider';

interface ContentProps {
  content?: Record<string, any>;
}

export default function HeroSplitReveal({ content }: ContentProps) {
  // Seamlessly renders the new luxury HeroSlider, replacing the previous cards & split text animation
  return <HeroSlider content={content} />;
}
