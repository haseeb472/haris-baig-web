'use client';

import SplitText from './SplitText';

const DEFAULT_INDUSTRIES = [
  { name: 'Game Studio Pipelines', desc: 'AAA character retopology, rigged models, and custom VFX mapping.' },
  { name: 'Interactive Marketing', desc: 'Sleek WebGL marketing interfaces, gradient meshes, and game loops.' },
  { name: 'Virtual Architecture', desc: 'Bespoke high-polygon interior simulations and master plans.' },
  { name: 'Industrial AR/VR', desc: 'Metaverse twins and immersive training catalog experiences.' }
];

interface ContentProps {
  content?: {
    subtitle?: string;
    heading?: string;
    industries?: { name: string; desc: string }[];
  };
}

export default function IndustriesServed({ content }: ContentProps) {
  const subtitle = content?.subtitle || 'TARGET SECTORS';
  const heading = content?.heading || 'Industries We Elevate';
  const industries = content?.industries || DEFAULT_INDUSTRIES;

  return (
    <section className="py-24 bg-[#080808] border-t border-white/5 relative z-30">
      <div className="max-w-[105rem] mx-auto px-6 md:px-12">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block mb-8 text-xs text-neon-cyan uppercase font-space font-bold tracking-widest bg-neon-cyan/10 px-3 py-1.5 rounded-full border border-neon-cyan/20">
            {subtitle}
          </span>
          <SplitText
            text={heading}
            className="text-3xl md:text-5xl font-space font-extrabold text-white mt-0"
            as="h3"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {industries.map((ind, i) => (
            <div key={i} className="p-6 rounded-2xl glass-panel border border-white/5 hover:border-white/20 transition-all duration-300 space-y-4">
              <span className="font-space font-extrabold text-xs text-neon-purple">0{i+1} / CATEGORY</span>
              <h4 className="font-space font-bold text-white text-sm">{ind.name}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{ind.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
