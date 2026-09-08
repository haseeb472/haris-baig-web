'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles, Send, Palette, Gamepad2, Globe, Smartphone, Landmark, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Case Studies', href: '/projects' },
  { name: 'Contact', href: '/contact' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const pathname = usePathname();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 150);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
  }, [pathname]);

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const linkVariants = {
    closed: { opacity: 0, y: 15 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[99] transition-all duration-300 ${
          scrolled
            ? 'py-4 glass-panel border-b border-white/5 shadow-lg'
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[105rem] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <span className="p-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-space font-bold text-lg flex items-center justify-center shadow-lg group-hover:shadow-neon-purple/50 transition-all duration-300">
              LF
            </span>
            <span className="font-space font-bold text-xl tracking-wider text-white group-hover:text-neon-cyan transition-colors">
              Logic<span className="text-neon-purple">Forge</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              
              if (link.name === 'Services') {
                return (
                  <div
                    key={link.name}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="h-full flex items-center py-2"
                  >
                    <Link
                      href={link.href}
                      className={`relative font-medium text-sm tracking-wide transition-all hover:text-white cursor-pointer ${
                        isActive ? 'text-white font-semibold' : 'text-gray-400'
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute left-0 -bottom-1.5 w-full h-[2px] bg-gradient-to-r from-neon-purple to-neon-blue rounded-full"
                        />
                      )}
                    </Link>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative font-medium text-sm tracking-wide transition-all hover:text-white cursor-pointer ${
                    isActive ? 'text-white font-semibold' : 'text-gray-400'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 -bottom-1.5 w-full h-[2px] bg-gradient-to-r from-neon-purple to-neon-blue rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/contact?tab=quote"
              className="relative overflow-hidden group rounded-xl px-5 py-2.5 font-semibold text-xs tracking-wider uppercase text-white bg-gradient-to-r from-neon-purple to-neon-blue shadow-lg hover:shadow-neon-purple/50 transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <span>Request Quote</span>
              <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {megaMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute top-full left-0 w-full bg-bg-dark/98 backdrop-blur-xl border-b border-white/10 shadow-2xl z-[90] py-10 px-6 md:px-12 pointer-events-auto"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-[105rem] mx-auto grid grid-cols-5 gap-8 text-left">
                {/* Column 1: Art & Animations */}
                <div className="space-y-4">
                  <Link 
                    href="/services/art-animation"
                    onClick={() => setMegaMenuOpen(false)}
                    className="flex items-center gap-2 group/title font-space font-bold text-sm tracking-wide text-white uppercase"
                  >
                    <Palette className="w-4 h-4 text-neon-purple group-hover/title:scale-110 transition-transform" />
                    <span className="group-hover/title:text-neon-purple transition-colors">Art & Animations</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/title:opacity-100 group-hover/title:translate-x-0.5 transition-all text-neon-purple" />
                  </Link>
                  <div className="h-[1px] bg-white/5 w-full" />
                  <ul className="space-y-2.5">
                    <li>
                      <Link 
                        href="/services/art-animation/character-design"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        Character Design
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/services/art-animation/concept-illustration"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        Concept Illustration
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/services/art-animation/cinematic-trailers"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        Cinematic Trailers
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/services/art-animation/vfx-simulation"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        VFX & Simulation
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Game Development */}
                <div className="space-y-4">
                  <Link 
                    href="/services/game-development"
                    onClick={() => setMegaMenuOpen(false)}
                    className="flex items-center gap-2 group/title font-space font-bold text-sm tracking-wide text-white uppercase"
                  >
                    <Gamepad2 className="w-4 h-4 text-neon-cyan group-hover/title:scale-110 transition-transform" />
                    <span className="group-hover/title:text-neon-cyan transition-colors">Game Development</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/title:opacity-100 group-hover/title:translate-x-0.5 transition-all text-neon-cyan" />
                  </Link>
                  <div className="h-[1px] bg-white/5 w-full" />
                  <ul className="space-y-2.5">
                    <li>
                      <Link 
                        href="/services/game-development/aaa-game-development"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        AAA Game Dev
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/services/game-development/gameplay-programming"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        Gameplay Programming
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/services/game-development/multiplayer-systems"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        Multiplayer Systems
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/services/game-development/console-porting"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        Console Porting
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Web Development */}
                <div className="space-y-4">
                  <Link 
                    href="/services/web-development"
                    onClick={() => setMegaMenuOpen(false)}
                    className="flex items-center gap-2 group/title font-space font-bold text-sm tracking-wide text-white uppercase"
                  >
                    <Globe className="w-4 h-4 text-neon-blue group-hover/title:scale-110 transition-transform" />
                    <span className="group-hover/title:text-neon-blue transition-colors">Web Development</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/title:opacity-100 group-hover/title:translate-x-0.5 transition-all text-neon-blue" />
                  </Link>
                  <div className="h-[1px] bg-white/5 w-full" />
                  <ul className="space-y-2.5">
                    <li>
                      <Link 
                        href="/services/web-development/custom-corporate-development"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        Custom Corporate
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/services/web-development/threejs-interactive"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        Three.js Interactive
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/services/web-development/cms-architectures"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        CMS Architectures
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/services/web-development/speed-optimization"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        Speed Optimization
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 4: AR/VR & Metaverse */}
                <div className="space-y-4">
                  <Link 
                    href="/services/ar-vr"
                    onClick={() => setMegaMenuOpen(false)}
                    className="flex items-center gap-2 group/title font-space font-bold text-sm tracking-wide text-white uppercase"
                  >
                    <Smartphone className="w-4 h-4 text-neon-purple group-hover/title:scale-110 transition-transform" />
                    <span className="group-hover/title:text-neon-purple transition-colors">AR/VR & Metaverse</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/title:opacity-100 group-hover/title:translate-x-0.5 transition-all text-neon-purple" />
                  </Link>
                  <div className="h-[1px] bg-white/5 w-full" />
                  <ul className="space-y-2.5">
                    <li>
                      <Link 
                        href="/services/ar-vr/vr-training-simulators"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        VR Training Simulators
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/services/ar-vr/virtual-showrooms"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        Virtual Showrooms
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/services/ar-vr/spatial-catalogs"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        Spatial catalogs
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/services/ar-vr/metaverse-assets"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        Metaverse Assets
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 5: Architectural Viz */}
                <div className="space-y-4">
                  <Link 
                    href="/services/arch-viz"
                    onClick={() => setMegaMenuOpen(false)}
                    className="flex items-center gap-2 group/title font-space font-bold text-sm tracking-wide text-white uppercase"
                  >
                    <Landmark className="w-4 h-4 text-neon-cyan group-hover/title:scale-110 transition-transform" />
                    <span className="group-hover/title:text-neon-cyan transition-colors">Architectural Viz</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/title:opacity-100 group-hover/title:translate-x-0.5 transition-all text-neon-cyan" />
                  </Link>
                  <div className="h-[1px] bg-white/5 w-full" />
                  <ul className="space-y-2.5">
                    <li>
                      <Link 
                        href="/services/arch-viz/real-time-walkthroughs"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        Real-Time Walkthroughs
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/services/arch-viz/interior-cgi-blueprints"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        Interior CGI blueprints
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/services/arch-viz/exterior-renders"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        Exterior Renders
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/services/arch-viz/urban-masterplans"
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                      >
                        Urban Masterplans
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Fullscreen Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[98] bg-bg-dark flex flex-col pt-24 px-8 pb-12 overflow-y-auto"
          >
            <div className="gradient-mesh">
              <div className="mesh-orb-1"></div>
              <div className="mesh-orb-2"></div>
            </div>

            {/* Links List */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex-1 flex flex-col justify-center gap-6 max-w-md mx-auto w-full z-10"
            >
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <motion.div key={link.name} variants={linkVariants}>
                    <Link
                      href={link.href}
                      className={`font-space font-bold text-3xl tracking-wide block hover:text-neon-cyan transition-colors cursor-pointer ${
                        isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue' : 'text-gray-300'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
              
              <motion.hr variants={linkVariants} className="border-white/5 my-4" />

              <motion.div variants={linkVariants} className="flex flex-col gap-4">
                <Link
                  href="/contact?tab=quote"
                  className="w-full text-center rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold py-3.5 tracking-wider uppercase text-sm cursor-pointer shadow-lg shadow-neon-purple/20"
                >
                  Request Quote
                </Link>
              </motion.div>
            </motion.div>

            {/* Mobile Footer Info */}
            <div className="text-center text-xs text-gray-600 mt-auto pt-8 z-10 font-sans">
              <p>© {new Date().getFullYear()} LogicForge Inc. All rights reserved.</p>
              <p className="mt-1 text-gray-500">San Francisco • Tokyo • London</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
