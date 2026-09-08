'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Target, Eye, Sparkles, Award, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import AboutReverseReveal from '@/components/web/AboutReverseReveal';
import SplitText from '@/components/web/SplitText';

const DEFAULT_VALUES = [
  { title: "Visual Fidelity", desc: "We push limits in lighting, PBR layering, clean topologies, and responsive rendering frames.", icon: "Trophy" },
  { title: "Engineering Rigor", desc: "We optimize CPU draws, implement robust netcode replications, and compile strict code architectures.", icon: "ShieldCheck" },
  { title: "Creative Freedom", desc: "We empower global digital artists and developers to execute design prototypes without barriers.", icon: "Heart" }
];

const TEAM = [
  {
    name: 'Sarah Vance',
    role: 'Founder & Creative Director',
    bio: 'Former Art Director at Sony Interactive Entertainment. Sarah has over 15 years of digital design, concept illustration, and game production experience.',
    img: '/images/img4.jpg',
    linked: 'https://linkedin.com'
  },
  {
    name: 'Keiji Tanaka',
    role: 'Lead Systems Architect',
    bio: 'Expert in high-end game engine optimization, network synchronization, and WebGL particle systems. Shipped multiple multiplayer cross-platform titles.',
    img: '/images/img5.jpg',
    linked: 'https://linkedin.com'
  }
];

const TIMELINE = [
  { year: '2020', title: 'Studio Inception', desc: 'LogicForge founded with a core team of 5 designers, working on freelance character sculpts.' },
  { year: '2022', title: 'Game Engine Integration', desc: 'Opened our game dev branch specializing in Unreal Engine 5 multiplayer netcodes.' },
  { year: '2024', title: 'Creative WebGL launch', desc: 'Introduced 3D browser capabilities, winning our first Awwwards Honorable Mention.' },
  { year: '2026', title: 'Enterprise scale', desc: 'Scaling to 45+ global artists, providing full-cycle digital production pipelines.' }
];

export default function AboutPage() {
  const [components, setComponents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/cms?table=pages')
      .then((res) => res.json())
      .then((data) => {
        const page = data.find((p: any) => p.id === 'about');
        if (page) {
          setComponents(page.components);
        }
      });
  }, []);

  const heroComp = components.find((c) => c.type === 'AboutHero');
  const valuesComp = components.find((c) => c.type === 'AboutValues');
  const revealComp = components.find((c) => c.type === 'AboutReverseReveal');

  const heroTagline = heroComp?.content?.tagline || "OUR STORY";
  const heroHeading = heroComp?.content?.heading || "Architecting virtual futures";
  const heroDesc = heroComp?.content?.description || "At LogicForge, we merge high-end 3D artistry with sophisticated engine programming. We believe that digital experiences shouldn’t just function—they should immerse.";

  const isHeroEnabled = heroComp ? heroComp.enabled : true;

  const missionTitle = valuesComp?.content?.missionTitle || "Our Mission";
  const missionDesc = valuesComp?.content?.missionDesc || "To provide enterprise game studios, corporations, and startups with next-generation digital media assets, interactive 3D WebGL experiences, and optimized game engine pipelines that redefine the visual landscape.";
  const visionTitle = valuesComp?.content?.visionTitle || "Our Vision";
  const visionDesc = valuesComp?.content?.visionDesc || "To bridge the gap between creative visual artistry and computer engineering, developing a cohesive ecosystem where spatial compute, gaming assets, and custom frontend systems mesh flawlessly.";
  
  const valuesList = valuesComp?.content?.values || DEFAULT_VALUES;
  const timelineList = valuesComp?.content?.timeline || TIMELINE;
  const teamList = valuesComp?.content?.team || TEAM;

  return (
    <div className="w-full bg-bg-dark overflow-hidden select-none">
      
      {/* Top Section Layout Margins wrapper */}
      <div className="max-w-[105rem] mx-auto px-6 md:px-12 pt-16 font-sans space-y-24">
        
        {/* Hero Banner */}
        {isHeroEnabled && (
          <section className="relative py-12 text-center max-w-4xl mx-auto space-y-8">
            <div className="gradient-mesh opacity-10">
              <div className="mesh-orb-1 top-0 left-0"></div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
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

        {(!valuesComp || valuesComp.enabled) && (
          <>
            {/* Values (Mission & Vision) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-3xl glass-panel border border-white/5 p-8 md:p-12 space-y-6">
                <div className="w-12 h-12 rounded-xl bg-neon-purple/20 text-neon-purple flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-space font-extrabold text-2xl text-white">{missionTitle}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {missionDesc}
                </p>
              </div>

              <div className="rounded-3xl glass-panel border border-white/5 p-8 md:p-12 space-y-6">
                <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 text-neon-cyan flex items-center justify-center">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="font-space font-extrabold text-2xl text-white">{visionTitle}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {visionDesc}
                </p>
              </div>
            </section>

            {/* Core Values List */}
            <section className="space-y-12">
              <div className="text-center">
                <SplitText
                  text={valuesComp?.content?.heading || "Our Core Values"}
                  className="font-space font-extrabold text-2xl md:text-3xl text-white uppercase"
                  as="h3"
                />
                <p className="text-gray-500 text-xs mt-2">The principles guiding our collaborative co-creation process.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {valuesList.map((val: any, idx: number) => {
                  const IconComp = (LucideIcons as any)[val.icon] || LucideIcons.Sparkles;
                  return (
                    <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-300 space-y-3">
                      <IconComp className="w-8 h-8 text-neon-purple" />
                      <h4 className="font-space text-white font-bold text-sm">{val.title}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed">{val.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* Journey Timeline */}
        <section className="space-y-16 pb-12">
          <div className="text-center">
            <span className="inline-block mb-6 text-xs text-neon-cyan uppercase font-space font-bold tracking-widest bg-neon-cyan/10 px-3 py-1.5 rounded-full border border-neon-cyan/20">
              CHRONOLOGY
            </span>
            <SplitText
              text="Our Journey Timeline"
              className="text-3xl font-space font-extrabold text-white mt-0"
              as="h3"
            />
          </div>

          <div className="relative border-l border-white/10 ml-4 md:ml-32 space-y-12">
            {timelineList.map((item: any, idx: number) => (
              <div key={idx} className="relative pl-8 md:pl-12 group">
                {/* Year Label Float left */}
                <span className="absolute -left-4 md:-left-28 top-1.5 font-space font-black text-2xl text-neon-purple group-hover:text-neon-cyan transition-colors">
                  {item.year}
                </span>
                
                {/* Dot */}
                <div className="absolute -left-1.5 top-3.5 h-3.5 w-3.5 rounded-full bg-bg-dark border-2 border-neon-purple group-hover:border-neon-cyan transition-all" />

                <div className="p-6 rounded-2xl glass-panel border border-white/5 transition-all duration-300">
                  <h4 className="font-space font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Pinned Scale Reveal Section (Reverse Zoom on scroll) */}
      {(!revealComp || revealComp.enabled) && <AboutReverseReveal content={revealComp?.content} />}

      {/* Bottom Section Layout Margins wrapper */}
      <div className="max-w-[105rem] mx-auto px-6 md:px-12 py-24 font-sans space-y-24 relative z-30 bg-bg-dark">
        
        {/* Leadership Team */}
        <section className="pt-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {teamList.map((member: any, idx: number) => (
              <div key={idx} className="rounded-3xl glass-panel border border-white/5 overflow-hidden flex flex-col">
                <div
                  className="w-full h-80 bg-cover bg-center"
                  style={{ backgroundImage: `url(${member.img})` }}
                />
                <div className="p-8 space-y-4 bg-bg-dark">
                  <div>
                    <h4 className="font-space font-extrabold text-xl text-white">{member.name}</h4>
                    <p className="text-neon-cyan text-xs font-semibold mt-0.5">{member.role}</p>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{member.bio}</p>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <a
                      href={member.linked}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-white hover:text-neon-cyan font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Connect on LinkedIn</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Badges / Awards Achievements */}
        <section className="py-12 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-wrap items-center justify-around gap-8 text-center text-xs">
          <div className="space-y-2">
            <Award className="w-8 h-8 text-neon-purple mx-auto" />
            <p className="text-white font-bold uppercase tracking-wider text-[10px]">CSS Design Awards</p>
            <p className="text-gray-500 font-semibold">Best UI/UX Studio 2025</p>
          </div>
          <div className="space-y-2">
            <Award className="w-8 h-8 text-neon-cyan mx-auto" />
            <p className="text-white font-bold uppercase tracking-wider text-[10px]">Awwwards</p>
            <p className="text-gray-500 font-semibold">Honorable Mention x3</p>
          </div>
          <div className="space-y-2">
            <Award className="w-8 h-8 text-neon-purple mx-auto" />
            <p className="text-white font-bold uppercase tracking-wider text-[10px]">Clutch</p>
            <p className="text-gray-500 font-semibold">Top Creative Production agency</p>
          </div>
        </section>

      </div>

    </div>
  );
}
