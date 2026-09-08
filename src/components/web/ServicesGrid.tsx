'use client';

import Link from 'next/link';
import { Palette, Gamepad2, Globe, Sparkles, Smartphone, Landmark, ArrowUpRight, Layers, CheckSquare, ShoppingBag } from 'lucide-react';
import SplitText from '@/components/web/SplitText';

const SERVICES = [
  {
    name: 'Art & Animation',
    slug: 'art-animation',
    icon: Palette,
    desc: 'Bespoke 2D/3D concept art, organic character modeling, AAA environment texturing, and rich cinematic animation rigging.',
    bullet: 'Character Design • Concept Art • Rigging'
  },
  {
    name: 'Game Development',
    slug: 'game-development',
    icon: Gamepad2,
    desc: 'Full-cycle production inside Unreal Engine 5 & Unity. Multiplayer replication pipelines, custom lighting shaders, and QA profiling.',
    bullet: 'Unreal Engine • C++ • Unity • QA Profiling'
  },
  {
    name: 'Web Development',
    slug: 'web-development',
    icon: Globe,
    desc: 'High-performance responsive web applications built using Next.js, headless architectures, interactive WebGL layers, and secure cloud API systems.',
    bullet: 'Next.js • TypeScript • WebGL Canvas'
  },
  {
    name: 'App Development',
    slug: 'app-development',
    icon: Smartphone,
    desc: 'Bespoke native and cross-platform mobile apps for iOS and Android built on Flutter or React Native, optimized for offline speed and native features.',
    bullet: 'React Native • Flutter • iOS & Android'
  },
  {
    name: 'CMS Integration',
    slug: 'cms-integration',
    icon: Layers,
    desc: 'Dynamic content editing systems integrated via headless platforms like Strapi, Sanity, or Contentful to empower editing control.',
    bullet: 'Headless CMS • Sanity • Strapi • Contentful'
  },
  {
    name: 'QA & Testing',
    slug: 'qa-testing',
    icon: CheckSquare,
    desc: 'Rigorous manual and automated test suites in Cypress/Playwright and load profiling tests to guarantee zero regressions.',
    bullet: 'Cypress • Playwright • Manual Audits'
  },
  {
    name: 'Shopify & E-Commerce',
    slug: 'shopify-commerce',
    icon: ShoppingBag,
    desc: 'Conversion-optimized custom Shopify Plus themes, Hydrogen headless e-commerce, and smooth payment checkout flows.',
    bullet: 'Shopify Plus • Liquid • Headless Commerce'
  },
  {
    name: 'AR / VR & XR Solutions',
    slug: 'ar-vr',
    icon: Sparkles,
    desc: 'Immersive cross-platform spatial computing experiences, virtual catalog showrooms, and digital twin virtualization.',
    bullet: 'Metaverse • Digital Twins • Virtual Catalog'
  },
  {
    name: 'Architectural Visualization',
    slug: 'arch-viz',
    icon: Landmark,
    desc: 'High-end photorealistic architectural visualizations, fly-through walkthrough animations, and modular asset development.',
    bullet: 'Interior rendering • Master Plan walk'
  }
];

interface ContentProps {
  content?: {
    subtitle?: string;
    heading?: string;
    description?: string;
  };
}

export default function ServicesGrid({ content }: ContentProps) {
  const subtitle = content?.subtitle || "OUR CAPABILITIES";
  const heading = content?.heading || "Comprehensive Digital Production mega-architecture";
  const description = content?.description || "We provide specialized teams to scale digital media art pipelines and program high-performance interactive architectures.";

  return (
    <section className="pt-24 pb-32 bg-[#080808] border-t border-white/5 relative overflow-hidden font-sans">
      <div className="gradient-mesh opacity-5">
        <div className="mesh-orb-2 top-0 left-0"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="inline-block mb-8 text-xs text-neon-cyan uppercase font-space font-bold tracking-widest bg-neon-cyan/10 px-3 py-1.5 rounded-full border border-neon-cyan/20">
            {subtitle}
          </span>
          <SplitText
            text={heading}
            className="text-3xl md:text-5xl font-space font-extrabold mt-0 tracking-tight text-white leading-tight"
            as="h2"
          />
          <p className="text-gray-400 text-sm mt-4 leading-relaxed max-w-xl">
            {description}
          </p>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl glass-panel border border-white/5 hover:border-white/20 p-8 flex flex-col justify-between h-96 transition-all duration-500 overflow-hidden"
              >
                {/* Floating Mesh Glowing Sphere on Hover */}
                <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-radial-gradient from-neon-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

                <div className="space-y-6">
                  {/* Icon Block */}
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neon-purple group-hover:text-neon-cyan group-hover:border-neon-cyan/30 transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-space font-extrabold text-xl text-white group-hover:text-neon-cyan transition-colors">
                      {srv.name}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-4">
                      {srv.desc}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    {srv.bullet}
                  </p>
                  
                  <Link
                    href={`/services/${srv.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-white group-hover:text-neon-cyan font-bold transition-all cursor-pointer"
                  >
                    <span>Explore Service</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
