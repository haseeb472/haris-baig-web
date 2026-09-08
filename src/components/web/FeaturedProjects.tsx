'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, X, ExternalLink, Award, Calendar, FolderOpen, User } from 'lucide-react';
import { Project } from '@/lib/cms';
import SplitText from '@/components/web/SplitText';

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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
        projects.filter((p) => {
          if (activeCategory === 'art') return p.category.includes('art') || p.category.includes('asset') || p.category.includes('character');
          if (activeCategory === 'game') return p.category.includes('game');
          if (activeCategory === 'vr') return p.category.includes('ar') || p.category.includes('vr');
          return false;
        })
      );
    }
  }, [activeCategory, projects]);

  return (
    <section className="py-24 bg-bg-dark relative overflow-hidden font-sans">
      <div className="max-w-[105rem] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="inline-block mb-8 text-xs text-neon-purple uppercase font-space font-bold tracking-widest bg-neon-purple/10 px-3 py-1.5 rounded-full border border-neon-purple/20">
              CREATIVE WORKS
            </span>
            <SplitText
              text="Featured Case Studies"
              className="text-3xl md:text-5xl font-space font-extrabold mt-0 tracking-tight text-white"
              as="h2"
            />
          </div>
          
          {/* Category Chips */}
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scrollbar-none flex-nowrap md:flex-wrap pb-1 max-w-full">
            {[
              { id: 'all', name: 'All Work' },
              { id: 'art', name: 'Art & Animation' },
              { id: 'game', name: 'Game Dev' },
              { id: 'vr', name: 'AR / VR' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold font-space uppercase transition-all duration-300 border cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white border-transparent shadow-lg shadow-neon-purple/25'
                    : 'text-gray-400 border-white/5 bg-white/5 hover:text-white hover:border-white/20'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-3xl border-dashed">
            <p className="text-gray-500 text-sm">No portfolio items found in this category.</p>
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative h-80 rounded-2xl overflow-hidden glass-panel border border-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer shadow-lg flex flex-col justify-end p-6"
              >
                {/* Image Background */}
                <div className="absolute inset-0 bg-[#121212] z-0">
                  {/* If hovered and video exists, render video, else show default image */}
                  {hoveredId === project.id && project.video ? (
                    <video
                      src={project.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover transition-opacity duration-500 scale-105"
                    />
                  ) : (
                    <div 
                      className="w-full h-full bg-cover bg-center opacity-70 group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${project.image || '/images/img8.png'})` }}
                    />
                  )}
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-1" />
                </div>

                {/* Content Side */}
                <div className="relative z-10 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-[9px] bg-neon-purple/20 text-neon-cyan border border-neon-purple/30 rounded px-2 py-0.5 font-bold uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-space font-extrabold text-lg text-white group-hover:text-neon-cyan transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-2 mt-1 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {project.stats && (
                    <div className="text-[10px] text-neon-cyan font-semibold uppercase tracking-wider flex items-center gap-1.5 pt-2">
                      <Award className="w-3.5 h-3.5" />
                      <span>{project.stats}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Case Study Dialog Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-3xl glass-panel border border-white/10 overflow-y-auto flex flex-col shadow-2xl relative animate-scale-up">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute right-6 top-6 z-10 p-2 text-gray-400 hover:text-white bg-black/50 hover:bg-black/80 border border-white/10 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner Media Block */}
            <div className="w-full h-80 md:h-[400px] relative bg-[#121212]">
              {selectedProject.video ? (
                <video
                  src={selectedProject.video}
                  autoPlay
                  controls
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${selectedProject.image})` }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent" />
            </div>

            {/* Details Box */}
            <div className="p-8 md:p-12 space-y-8 bg-bg-dark flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                  <h3 className="font-space font-extrabold text-2xl md:text-4xl text-white">
                    {selectedProject.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedProject.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-white/5 border border-white/10 text-gray-300 rounded px-2.5 py-1 font-bold uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedProject.stats && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border border-neon-purple/30 text-center flex-shrink-0 min-w-[150px]">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Metric Result</p>
                    <p className="text-xl font-space font-black text-neon-cyan mt-1">{selectedProject.stats}</p>
                  </div>
                )}
              </div>

              {/* Grid Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Text Description */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="font-space font-bold text-white text-sm tracking-wider uppercase">Case Study Narrative</h4>
                  <p className="text-gray-400 text-xs leading-relaxed whitespace-pre-wrap">
                    {selectedProject.description}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    By combining state-of-the-art WebGL renders, robust logic, and interactive mechanics, LogicForge built an end-to-end framework that set benchmarks for speed and design fidelity. Our technical directors oversaw retopology and asset performance.
                  </p>
                </div>

                {/* Meta details list */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 text-xs h-fit">
                  <h4 className="font-space font-bold text-white text-xs tracking-wider uppercase mb-2">Specifications</h4>
                  
                  <div className="flex items-center gap-3">
                    <User className="w-4.5 h-4.5 text-neon-purple" />
                    <div>
                      <p className="text-[10px] text-gray-500">CLIENT</p>
                      <p className="text-white font-bold">{selectedProject.client}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4.5 h-4.5 text-neon-cyan" />
                    <div>
                      <p className="text-[10px] text-gray-500">COMPLETED YEAR</p>
                      <p className="text-white font-bold">{selectedProject.year}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-4.5 h-4.5 text-neon-purple" />
                    <div>
                      <p className="text-[10px] text-gray-500">CATEGORY</p>
                      <p className="text-white font-bold capitalize">{selectedProject.category.replace('-', ' ')}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <Link
                      href={`/projects/${selectedProject.slug}`}
                      className="w-full px-4 py-2.5 rounded-xl bg-neon-purple hover:bg-neon-blue text-white font-bold text-center text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-neon-purple/20"
                    >
                      <span>Full Case Study</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Close Case Study
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
