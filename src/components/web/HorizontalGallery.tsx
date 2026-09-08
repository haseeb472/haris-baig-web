'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Folder, Calendar, Award } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Project } from '@/lib/cms';
import SplitText from '@/components/web/SplitText';

interface ContentProps {
  content?: {
    subtitle?: string;
    heading?: string;
    description?: string;
    projects?: any[];
  };
}

export default function HorizontalGallery({ content }: ContentProps) {
  const subtitle = content?.subtitle || "CO-PRODUCTION HIGHLIGHTS";
  const heading = content?.heading || "Case Study Exhibition";
  const description = content?.description || "Scroll vertically to traverse the gallery horizontally. Review interactive details, tech stacks, and production metrics.";

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (content?.projects) {
      setProjects(content.projects);
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/cms?table=projects');
        const data = await res.json();
        setProjects(data || []);
      } catch (err) {
        console.error('Failed to load projects for horizontal scroll:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [content?.projects]);

  useEffect(() => {
    if (projects.length === 0) return;

    // Register GSAP plugins inside client side hook
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const track = trackRef.current;
    const progressLine = progressLineRef.current;
    const progressText = progressTextRef.current;

    if (!container || !track) return;

    // Wait until images and elements are fully rendered to retrieve scrollWidth
    const timer = setTimeout(() => {
      const totalWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = totalWidth - viewportWidth;

      if (scrollDistance <= 0) return;

      // Define horizontal animation timeline
      const tl = gsap.timeline();

      tl.to(track, {
        x: -scrollDistance,
        ease: 'none',
      });

      // Synchronize progress bar scale
      tl.to({}, {
        onUpdate: function () {
          const progress = this.progress(); // Float 0 -> 1
          if (progressLine) {
            gsap.to(progressLine, { scaleX: progress, transformOrigin: 'left center', duration: 0.1 });
          }
          if (progressText) {
            progressText.innerText = `${Math.round(progress * 100)}%`;
          }
        }
      }, 0);

      // Create ScrollTrigger pin session
      const st = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${scrollDistance}`,
        pin: true,
        scrub: true, // Perfect synchronicity to prevent boundary clashing snaps
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tl,
      });

      // Force recalculation of all triggers on the page in order
      ScrollTrigger.refresh();

      // Cleanup timeline on unmount
      return () => {
        st.kill();
      };
    }, 150);

    return () => clearTimeout(timer);
  }, [projects]);

  if (loading || projects.length === 0) {
    return (
      <div className="h-screen w-full bg-bg-dark flex items-center justify-center flex-col gap-4">
        <div className="w-8 h-8 border-2 border-t-neon-cyan border-white/10 rounded-full animate-spin" />
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-space font-bold">
          Assembling Creative Track...
        </span>
      </div>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-[620px] h-screen w-full bg-bg-dark overflow-hidden select-none z-10"
    >
      {/* Background Glowing Vector Accents */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-25">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon-purple/20 blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neon-cyan/20 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-noise opacity-[0.02]" />
      </div>

      {/* Main Sticky Pane Viewport */}
      <div className="h-full w-full flex flex-col justify-between py-6 sm:py-8 md:py-10 relative z-10">
        
        {/* Top Header Text Overlay */}
        <div className="max-w-[105rem] mx-auto px-6 md:px-12 w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-purple/20 bg-neon-purple/10 text-xs font-semibold text-white uppercase tracking-wider mb-3 sm:mb-4">
              <Sparkles className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
              <span>{subtitle}</span>
            </div>
            <SplitText
              text={heading}
              className="text-2xl sm:text-4xl md:text-5xl font-space font-black tracking-tight text-white uppercase leading-none mt-0"
              as="h2"
            />
          </div>
          <p className="text-gray-400 text-xs w-full md:max-w-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Horizontal Card Track Container with added space above */}
        <div ref={trackRef} className="flex gap-6 sm:gap-8 md:gap-10 px-[10vw] items-center w-max mt-4 sm:mt-6 md:mt-8 mb-2">
          {projects.map((project, idx) => (
            <HorizontalGalleryCard key={project.id} project={project} index={idx} />
          ))}
        </div>

        {/* Bottom Interactive Progress Bar */}
        <div className="max-w-[105rem] mx-auto px-6 md:px-12 w-full flex items-center justify-between gap-8 pt-2">
          {/* Progress Indicators */}
          <div className="flex items-center gap-4 flex-1">
            <span className="font-space font-extrabold text-xs text-gray-500">01</span>
            <div className="h-[2px] bg-white/10 flex-1 relative rounded-full overflow-hidden">
              <div
                ref={progressLineRef}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-purple to-neon-cyan w-full scale-x-0"
              />
            </div>
            <span className="font-space font-extrabold text-xs text-gray-500">
              {projects.length < 10 ? `0${projects.length}` : projects.length}
            </span>
          </div>

          <span
            ref={progressTextRef}
            className="font-space font-black text-sm tracking-wider text-neon-cyan bg-neon-cyan/5 border border-neon-cyan/15 px-3 py-1.5 rounded-xl min-w-[60px] text-center"
          >
            0%
          </span>
        </div>

      </div>
    </section>
  );
}

function HorizontalGalleryCard({ project, index }: { project: Project; index: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLAnchorElement>(null);

  // Dynamic 3D Card Hover Parallax tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const maxTilt = 8; // Degrees
    const tiltX = -(y / (rect.height / 2)) * maxTilt;
    const tiltY = (x / (rect.width / 2)) * maxTilt;

    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <Link
      href={`/projects/${project.slug}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)',
        willChange: 'transform'
      }}
      className="relative w-[80vw] sm:w-[320px] md:w-[380px] lg:w-[420px] xl:w-[450px] h-[340px] sm:h-[380px] md:h-[420px] lg:h-[460px] xl:h-[490px] max-h-[56vh] rounded-3xl overflow-hidden glass-panel border border-white/5 hover:border-white/20 transition-all duration-300 shadow-2xl flex-shrink-0 group cursor-pointer flex flex-col justify-end p-5 sm:p-6 md:p-8"
    >

      {/* Card Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out scale-100 group-hover:scale-105 z-0"
        style={{ backgroundImage: `url(${project.image})` }}
      />
      
      {/* Background Gradient Blends */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-1 group-hover:via-black/60 transition-all duration-300" />
      <div className="absolute inset-0 bg-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-2" />

      {/* Details Box */}
      <div className="relative z-10 space-y-3 sm:space-y-4 text-left">
        
        {/* Meta Stats Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="text-[8px] sm:text-[9px] font-space font-extrabold uppercase bg-neon-purple/20 text-neon-purple px-2.5 py-1 rounded-md border border-neon-purple/30 tracking-wider">
            {project.category}
          </span>
          <span className="text-[8px] sm:text-[9px] font-space font-extrabold uppercase bg-neon-cyan/20 text-neon-cyan px-2.5 py-1 rounded-md border border-neon-cyan/30 tracking-wider">
            {project.year}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-xl md:text-2xl font-space font-black text-white uppercase group-hover:text-neon-cyan transition-colors duration-300 line-clamp-1">
          {project.name}
        </h3>

        {/* Short Description */}
        <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed font-sans group-hover:text-white transition-colors duration-300">
          {project.description}
        </p>

        {/* Stacks & Tech details */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Client: {project.client}
          </span>
          
          {/* Animated Slide Button */}
          <div
            className="btn-premium-slide h-7 sm:h-8 px-3 sm:px-4 rounded-lg bg-white/5 border border-white/10 group-hover:bg-gradient-to-r group-hover:from-neon-purple group-hover:to-neon-blue text-white transition-all text-[9px] sm:text-[10px] font-bold uppercase tracking-wider inline-flex items-center justify-center"
          >
            <span className="btn-premium-slide-text gap-1.5">
              Launch Case <ArrowRight className="w-3 h-3" />
            </span>
            <span className="btn-premium-slide-back gap-1.5">
              Launch Case <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
