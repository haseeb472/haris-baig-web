'use client';

import { Cpu, Gamepad2, Globe, Layers, Database, Code, Terminal, Infinity } from 'lucide-react';

const TECHS = [
  { name: 'Unreal Engine 5', icon: Gamepad2 },
  { name: 'Unity 3D', icon: Terminal },
  { name: 'Three.js / WebGL', icon: Globe },
  { name: 'React 19 / Next.js 15', icon: Code },
  { name: 'ZBrush Sculpting', icon: Layers },
  { name: 'Substance PBR', icon: Database },
  { name: 'Blender Artistry', icon: Cpu },
  { name: 'Framer Motion', icon: Infinity },
];

export default function TechMarquee() {
  // Double the list to make it loop seamlessly
  const doubledTechs = [...TECHS, ...TECHS, ...TECHS];

  return (
    <div className="w-full py-10 bg-[#080808] border-y border-white/5 overflow-hidden relative select-none">
      <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-bg-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-bg-dark to-transparent z-10 pointer-events-none" />
      
      <div className="flex w-max gap-12 animate-marquee whitespace-nowrap">
        {doubledTechs.map((tech, i) => {
          const Icon = tech.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3.5 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-neon-cyan hover:border-neon-cyan/40 transition-all duration-300"
            >
              <Icon className="w-5 h-5 text-neon-purple" />
              <span className="font-space font-medium text-sm tracking-wider uppercase">{tech.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
