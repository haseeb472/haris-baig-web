import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Trophy, Users, ShieldCheck, Sparkles, MessageSquare, Play, Calendar } from 'lucide-react';
import StackedServices from '@/components/web/StackedServices';
import HorizontalGallery from '@/components/web/HorizontalGallery';
import TechMarquee from '@/components/web/TechMarquee';
import HomeContact from '@/components/web/HomeContact';
import HeroGallery from '@/components/web/HeroGallery';
import HeroSplitReveal from '@/components/web/HeroSplitReveal';
import KeyFactsReveal from '@/components/web/KeyFactsReveal';
import SplitText from '@/components/web/SplitText';
import CurvedCarousel3D from '@/components/web/CurvedCarousel3D';
import IndustriesServed from '@/components/web/IndustriesServed';
import StatsBlock from '@/components/web/StatsBlock';
import { readDb } from '@/lib/cms';

const INDUSTRIES = [
  { name: 'Game Studio Pipelines', desc: 'AAA character retopology, rigged models, and custom VFX mapping.' },
  { name: 'Interactive Marketing', desc: 'Sleek WebGL marketing interfaces, gradient meshes, and game loops.' },
  { name: 'Virtual Architecture', desc: 'Bespoke high-polygon interior simulations and master plans.' },
  { name: 'Industrial AR/VR', desc: 'Metaverse twins and immersive training catalog experiences.' }
];

export default function HomePage() {
  const db = readDb();
  const pageData = db.pages.find((p) => p.id === 'home');
  const testimonials = (db.testimonials || []).map((t: any) => ({
    quote: t.content || "",
    author: t.name || "",
    role: t.role || "",
    company: t.company || ""
  }));

  if (!pageData) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center text-white">
        <p className="text-xs uppercase font-space font-bold tracking-widest text-red-400">Database Connection Refused</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-x-clip font-sans">
      {pageData.components.map((comp) => {
        if (!comp.enabled) return null;

        switch (comp.type) {
          case 'HeroSplitReveal':
            return <HeroSplitReveal key={comp.id} content={comp.content} />;
          
          case 'StatsBlock':
            return <StatsBlock key={comp.id} content={comp.content} />;

          case 'HeroGallery':
            return <HeroGallery key={comp.id} content={comp.content} />;

          case 'ServicesGrid':
            return <StackedServices key={comp.id} content={comp.content} />;

          case 'KeyFactsReveal':
            return <KeyFactsReveal key={comp.id} content={comp.content} />;

          case 'TechMarquee':
            return <TechMarquee key={comp.id} />;

          case 'HorizontalGallery':
            return (
              <div key={comp.id} id="works">
                <HorizontalGallery content={comp.content} />
              </div>
            );

          case 'IndustriesServed':
            return <IndustriesServed key={comp.id} content={comp.content} />;



          case 'CurvedCarousel3D':
            const compTestimonials = comp.content?.testimonials 
              ? comp.content.testimonials 
              : testimonials;
            return (
              <section key={comp.id} className="py-24 bg-bg-dark border-t border-white/5 relative overflow-hidden z-30">
                <div className="max-w-[105rem] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">
                  <div className="text-center max-w-3xl mx-auto mb-8">
                    <span className="inline-block mb-8 text-xs text-neon-purple uppercase font-space font-bold tracking-widest bg-neon-purple/10 px-3 py-1.5 rounded-full border border-neon-purple/20">
                      {comp.content?.subtitle || "TESTIMONIALS"}
                    </span>
                    <SplitText
                      text={comp.content?.heading || "What our co-production partners say"}
                      className="text-3xl md:text-5xl font-space font-extrabold text-white mt-0 tracking-tight text-center"
                      as="h3"
                    />
                  </div>
                  <CurvedCarousel3D testimonials={compTestimonials} />
                </div>
              </section>
            );

          case 'HomeContact':
            return <HomeContact key={comp.id} content={comp.content} />;

          default:
            return null;
        }
      })}
    </div>
  );
}
