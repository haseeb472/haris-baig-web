'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, ArrowRight, Sparkles, Award, FolderOpen, Calendar, User } from 'lucide-react';
import { Project } from '@/lib/cms';
import SplitText from '@/components/web/SplitText';
import ProjectTabs from '@/components/web/ProjectTabs';

const CATEGORIES = [
  { id: 'all', name: 'All Case Studies' },
  { id: 'art-animation', name: 'Art & Animation' },
  { id: 'game-development', name: 'Game Development' },
  { id: 'web-development', name: 'Web Development' },
  { id: 'ar-vr', name: 'AR/VR & Metaverse' },
  { id: 'arch-viz', name: 'Architectural Viz' }
];

export default function ProjectsListingPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/cms?table=projects');
        const data = await res.json();
        setProjects(data || []);
        setFilteredProjects(data || []);
      } catch (err) {
        console.error('Failed to load portfolio projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((p) => p.category === activeCategory)
      );
    }
  }, [activeCategory, projects]);

  return (
    <div className="min-h-screen bg-bg-dark text-white font-sans relative pb-24">
      {/* Background Glowing Vector Accents */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-neon-purple/15 blur-[180px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-neon-blue/15 blur-[180px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-[105rem] mx-auto px-6 md:px-12 py-12 relative z-10 space-y-16">
        
        {/* Hero Section matching description */}
        <section className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-purple/20 bg-neon-purple/10 text-xs font-semibold text-white uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
            <span>Our Work</span>
          </div>
          
          <SplitText
            text="Our Work. Your Vision Realized."
            className="text-4xl sm:text-6xl font-space font-black tracking-tight text-white uppercase leading-none mt-2"
            as="h1"
          />

          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl">
            This showcase displays a clean, professional timeline of our shipped projects, designed to build trust through transparency and proven results. We merge advanced WebGL render architectures with AAA visual models to execute spatial interactive blueprints.
          </p>
        </section>

        {/* Categories horizontal filter pills with single-line scrollable slider */}
        <ProjectTabs
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Project grid loading/render states */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="aspect-[4/3] rounded-3xl bg-white/5 animate-pulse border border-white/10" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-24 text-center glass-panel border border-dashed border-white/10 rounded-3xl">
              <p className="text-gray-500 text-sm">No portfolio items found in this segment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative flex flex-col rounded-3xl overflow-hidden glass-panel border border-white/5 hover:border-white/15 transition-all duration-500 shadow-xl cursor-pointer"
                >
                  {/* Card Thumbnail Area with 1.33:1 aspect ratio */}
                  <div className="w-full aspect-[4/3] relative bg-[#121212] overflow-hidden border-b border-white/5">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-90"
                      style={{ backgroundImage: `url(${project.image || '/images/img8.png'})` }}
                    />
                    {hoveredId === project.id && project.video && (
                      <video
                        src={project.video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                      />
                    )}
                    {/* Shadow overlay vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                    
                    {/* Category overlay label */}
                    <span className="absolute top-4 left-4 z-20 text-[9px] bg-bg-dark/80 text-neon-cyan border border-white/10 rounded-md px-2 py-0.5 font-bold uppercase tracking-wider">
                      {project.category.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Details under/inside the card */}
                  <div className="p-6 space-y-4 bg-bg-dark flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4 text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-neon-purple" />
                          {project.year}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-neon-cyan" />
                          Client: {project.client}
                        </span>
                      </div>

                      <h3 className="font-space font-extrabold text-xl text-white group-hover:text-neon-cyan transition-colors uppercase leading-tight line-clamp-1">
                        {project.name}
                      </h3>
                      
                      <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed font-sans mt-1">
                        {project.description}
                      </p>
                    </div>

                    {/* Launch case action button */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      {project.stats ? (
                        <div className="text-[10px] text-neon-cyan font-bold uppercase tracking-wider flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-neon-purple animate-pulse" />
                          <span>{project.stats}</span>
                        </div>
                      ) : (
                        <div />
                      )}
                      
                      <div className="btn-premium-slide h-8 px-4.5 rounded-lg bg-white/5 border border-white/10 group-hover:bg-gradient-to-r group-hover:from-neon-purple group-hover:to-neon-blue text-white transition-all text-[10px] font-bold uppercase tracking-wider flex items-center justify-center">
                        <span className="btn-premium-slide-text gap-1">
                          Launch Case <ArrowRight className="w-3 h-3" />
                        </span>
                        <span className="btn-premium-slide-back gap-1">
                          Launch Case <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* CTA Contact Hub Section */}
        <section className="glass-panel p-8 md:p-12 rounded-3xl border border-neon-purple/20 bg-gradient-to-r from-neon-purple/10 via-transparent to-neon-blue/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-2 relative z-10 max-w-xl text-center md:text-left">
            <h3 className="font-space font-black text-2xl md:text-3xl text-white uppercase">
              Start Your Own Venture
            </h3>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
              Have an enterprise project, concept blueprint, or AAA modeling inquiry? Hire our studio developers and spatial designers. Let's bring your co-production realities to life.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3.5 rounded-xl bg-neon-purple hover:bg-neon-blue text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-neon-purple/20 cursor-pointer whitespace-nowrap relative z-10 hover:scale-102"
          >
            Commence Query
          </Link>
        </section>

      </div>
    </div>
  );
}
