'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import SplitText from '@/components/web/SplitText';

const CATEGORIES = [
  {
    id: 'art-animation',
    name: 'Art & Animation',
    icon: 'Palette',
    desc: 'Character modeling, high-poly ZBrush sculpting, concept sketching, and ARKit blendshape rigs.',
    services: ['Character Design', 'Environment Art', 'Concept Art', 'Cinematic Animation']
  },
  {
    id: 'game-development',
    name: 'Game Development',
    icon: 'Gamepad2',
    desc: 'Full-cycle production using Unreal Engine 5 & Unity. Replicated multiplayer networks and GPU optimizations.',
    services: ['Unreal Engine 5', 'Unity 3D Prototyping', 'Multiplayer Netcode', 'Shader Optimizations']
  },
  {
    id: 'web-development',
    name: 'Web Development',
    icon: 'Globe',
    desc: 'Premium Next.js architectures, static/dynamic deployments, customized content dashboards, and interactive WebGL canvas frames.',
    services: ['Corporate Applications', 'Interactive WebGL Portals', 'Local Database CMS', 'SEO Speed Tuning']
  },
  {
    id: 'app-development',
    name: 'App Development',
    icon: 'Smartphone',
    desc: 'Bespoke native and cross-platform mobile apps for iOS and Android built on Flutter or React Native, optimized for speed and device features.',
    services: ['React Native Apps', 'Flutter Multi-Platform', 'Offline Sync Systems', 'Store Deployments']
  },
  {
    id: 'cms-integration',
    name: 'CMS & Database Solutions',
    icon: 'Layers',
    desc: 'Tailored headless CMS architectures and database sync pipelines to empower editorial control and dynamic content updates.',
    services: ['Headless CMS Integrations', 'Bespoke Schema Models', 'Dynamic Block Editing', 'Static Rebuild Webhooks']
  },
  {
    id: 'qa-testing',
    name: 'QA & Automated Testing',
    icon: 'CheckSquare',
    desc: 'Comprehensive manual audits and automated Cypress/Playwright integration tests to ensure zero regressions.',
    services: ['Automated End-to-End Tests', 'Manual QA Audits', 'Load & Performance Tuning', 'CI/CD Test Sync']
  },
  {
    id: 'shopify-commerce',
    name: 'Shopify & E-Commerce',
    icon: 'ShoppingBag',
    desc: 'High-converting custom Shopify Plus themes, Hydrogen headless e-commerce setups, and payment gateway connections.',
    services: ['Shopify Plus Themes', 'Headless Hydrogen commerce', 'Subscription Gateways', 'Conversion Tuning']
  },
  {
    id: 'ar-vr',
    name: 'AR / VR & Metaverse',
    icon: 'Smartphone',
    desc: 'Virtual catalogs, 3D retail showrooms, digital twins, and immersive virtual avatar engines.',
    services: ['XR Applications', 'WebGL Showrooms', 'Spatial Compute Renders', 'Metaverse Avatars']
  },
  {
    id: 'arch-viz',
    name: 'Architectural Visualization',
    icon: 'Landmark',
    desc: 'Photorealistic walkthroughs, interior/exterior lighting renders, master plans, and custom model assets.',
    services: ['Interior Fly-throughs', 'Exterior Lighting', 'Bespoke Asset Pipelines', 'Master Plans']
  }
];

export default function ServicesHubPage() {
  const [components, setComponents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/cms?table=pages')
      .then((res) => res.json())
      .then((data) => {
        const page = data.find((p: any) => p.id === 'services');
        if (page) {
          setComponents(page.components);
        }
      });
  }, []);

  const heroComp = components.find((c) => c.type === 'ServicesHero');
  const heroTagline = heroComp?.content?.tagline || "PRODUCTION HUB";
  const heroHeading = heroComp?.content?.heading || "Creative Services Architecture";
  const heroDesc = heroComp?.content?.description || "We architect digital media assets and program robust interactive platforms. Select a capability category below to view detailed production processes.";
  const isHeroEnabled = heroComp ? heroComp.enabled : true;

  return (
    <div className="max-w-[105rem] mx-auto px-6 md:px-12 py-16 font-sans space-y-20">
      
      {/* Header */}
      {isHeroEnabled && (
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-purple/20 bg-neon-purple/10 text-xs font-semibold text-white uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
            <span>{heroTagline}</span>
          </motion.div>

          <SplitText
            text={heroHeading}
            className="text-4xl sm:text-6xl font-space font-black tracking-tight text-white uppercase"
            as="h1"
            delay={0.2}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-400 text-sm md:text-base leading-relaxed"
          >
            {heroDesc}
          </motion.p>
        </section>
      )}

      {/* Grid of Categories */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {(heroComp?.content?.categories || CATEGORIES).map((cat: any, idx: number) => {
          const Icon = (LucideIcons as any)[cat.icon] || LucideIcons.Sparkles;
          return (
            <div
              key={cat.id}
              className="group rounded-3xl glass-panel border border-white/5 hover:border-white/20 p-6 sm:p-8 transition-all duration-500 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neon-purple group-hover:text-neon-cyan group-hover:border-neon-cyan/30 transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-space font-extrabold text-xs text-gray-500 uppercase tracking-widest">
                    CAPABILITY 0{idx + 1}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-space font-extrabold text-2xl text-white group-hover:text-neon-cyan transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                {/* Sub-services list */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {cat.services.map((sub: string, sIdx: number) => (
                    <span
                      key={sIdx}
                      className="text-[10px] bg-white/5 border border-white/10 text-gray-400 rounded-lg px-2.5 py-1"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 mt-8 flex justify-end">
                <Link
                  href={`/services/${cat.id}`}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-neon-purple/20 text-white font-space font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                >
                  <span>Explore category</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </section>

    </div>
  );
}
