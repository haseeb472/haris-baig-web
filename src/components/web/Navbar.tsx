'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles, Send, Palette, Gamepad2, Globe, Smartphone, Landmark, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeaderSettings, getDefaultHeader } from '@/lib/cms-types';

const defaultHeader = getDefaultHeader();

const getColumnIcon = (iconName?: string) => {
  switch (iconName?.toLowerCase()) {
    case 'palette': return Palette;
    case 'gamepad2':
    case 'gamepad': return Gamepad2;
    case 'globe': return Globe;
    case 'smartphone': return Smartphone;
    case 'landmark': return Landmark;
    default: return Sparkles;
  }
};

export default function Navbar() {
  const [headerData, setHeaderData] = useState<HeaderSettings>(defaultHeader);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const pathname = usePathname();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);

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
    lastScrollY.current = typeof window !== 'undefined' ? window.scrollY : 0;
    if (lastScrollY.current > 40) {
      setScrolled(true);
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show unscrolled header at the top
      if (currentScrollY <= 40) {
        setIsVisible(true);
        setScrolled(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      setScrolled(true);

      // Keep header visible while mobile menu is open
      if (mobileMenuOpen) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const diff = currentScrollY - lastScrollY.current;

      // Threshold to prevent jitter on tiny scroll adjustments
      if (Math.abs(diff) > 6) {
        if (diff > 0 && currentScrollY > 80) {
          // Scrolling down -> hide header smoothly
          setIsVisible(false);
          setMegaMenuOpen(false);
        } else if (diff < 0) {
          // Scrolling up -> reveal header with smooth animation
          setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  // Close menus and restore header visibility on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
    setIsVisible(true);
  }, [pathname]);

  // Sync header configuration with CMS
  useEffect(() => {
    fetch('/api/cms?table=header')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          const item = Array.isArray(data) ? data[0] : data;
          if (item && item.navLinks) {
            setHeaderData((prev) => ({ ...prev, ...item }));
          }
        }
      })
      .catch(() => {});
  }, []);

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
      <motion.header
        initial={{ y: 0 }}
        animate={{
          y: isVisible ? 0 : '-100%',
          opacity: isVisible ? 1 : 0
        }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1]
        }}
        className={`fixed top-0 left-0 w-full z-[99] ${
          scrolled
            ? 'py-3 sm:py-3.5 glass-panel border-b border-white/5 shadow-lg'
            : 'py-4 sm:py-5 bg-transparent border-b border-transparent'
        } transition-[padding,background-color,border-color,box-shadow] duration-300`}
      >
        <div className="max-w-[105rem] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group cursor-pointer py-1">
            <Image
              src={headerData.logo || "/images/icons/brand_logo.svg"}
              alt={headerData.logoAlt || "Fourth Pixel"}
              width={249}
              height={287}
              priority
              className="w-[84px] sm:w-[90px] h-auto object-contain brightness-0 invert drop-shadow-[0_0_12px_rgba(255,255,255,0.15)] group-hover:drop-shadow-[0_0_16px_rgba(34,211,238,0.4)] transition-all duration-300"
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            {headerData.navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const isMegaMenuLink = link.name.toLowerCase() === 'services' && (headerData.megaMenuEnabled ?? true);
              
              if (isMegaMenuLink) {
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
              href={headerData.ctaLink || "/contact?tab=quote"}
              className="relative overflow-hidden group rounded-xl px-5 py-2.5 font-semibold text-xs tracking-wider uppercase text-white bg-gradient-to-r from-neon-purple to-neon-blue shadow-lg hover:shadow-neon-purple/50 transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <span>{headerData.ctaText || "Request Quote"}</span>
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
          {megaMenuOpen && (headerData.megaMenuEnabled ?? true) && headerData.megaMenuColumns && headerData.megaMenuColumns.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute top-full left-0 w-full bg-bg-dark/98 backdrop-blur-xl border-b border-white/10 shadow-2xl z-[90] py-10 px-6 md:px-12 pointer-events-auto"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-[105rem] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-left">
                {headerData.megaMenuColumns.map((col, cIdx) => {
                  const Icon = getColumnIcon(col.iconName);
                  return (
                    <div key={cIdx} className="space-y-4">
                      <Link 
                        href={col.categoryHref || '#'}
                        onClick={() => setMegaMenuOpen(false)}
                        className="flex items-center gap-2 group/title font-space font-bold text-sm tracking-wide text-white uppercase"
                      >
                        <Icon className="w-4 h-4 text-neon-purple group-hover/title:scale-110 transition-transform" />
                        <span className="group-hover/title:text-neon-purple transition-colors">{col.title}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/title:opacity-100 group-hover/title:translate-x-0.5 transition-all text-neon-purple" />
                      </Link>
                      <div className="h-[1px] bg-white/5 w-full" />
                      <ul className="space-y-2.5">
                        {col.links.map((subLink, sIdx) => (
                          <li key={sIdx}>
                            <Link 
                              href={subLink.href}
                              onClick={() => setMegaMenuOpen(false)}
                              className="text-xs text-gray-400 hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-200 transition-transform"
                            >
                              {subLink.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

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
              {headerData.navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <motion.div key={link.name} variants={linkVariants}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
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
                  href={headerData.ctaLink || "/contact?tab=quote"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold py-3.5 tracking-wider uppercase text-sm cursor-pointer shadow-lg shadow-neon-purple/20"
                >
                  {headerData.ctaText || "Request Quote"}
                </Link>
              </motion.div>
            </motion.div>

            {/* Mobile Footer Info */}
            <div className="text-center text-xs text-gray-600 mt-auto pt-8 z-10 font-sans">
              <p>© {new Date().getFullYear()} {headerData.mobileCopyright || "Fourth Pixel Inc. All rights reserved."}</p>
              {headerData.mobileLocations && <p className="mt-1 text-gray-500">{headerData.mobileLocations}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
