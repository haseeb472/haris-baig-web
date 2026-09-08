'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Send, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram, Github, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [settings, setSettings] = useState<any>({
    siteName: "LogicForge",
    email: "hello@logicforge.co",
    phone: "+1 (800) 555-LOGIC",
    address: "San Francisco, CA",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    github: "https://github.com",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com"
  });

  useEffect(() => {
    fetch('/api/cms?table=settings')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          const item = Array.isArray(data) ? data[0] : data;
          if (item) {
            setSettings((prev: any) => ({ ...prev, ...item }));
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'newsletter', email })
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setSubscribed(true);
        setEmail('');
      } else {
        setError(data.error || 'Failed to subscribe.');
      }
    } catch (err) {
      setLoading(false);
      setError('Connection error.');
    }
  };

  return (
    <footer className="relative bg-[#070707] border-t border-white/5 pt-20 pb-10 overflow-hidden font-sans">
      <div className="gradient-mesh opacity-10">
        <div className="mesh-orb-2 bottom-0 right-0"></div>
      </div>

      <div className="max-w-[105rem] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo & Intro */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <span className="p-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-space font-bold text-lg flex items-center justify-center">
                LF
              </span>
              <span className="font-space font-bold text-xl tracking-wider text-white">
                {settings.siteName.split(/(Forge)/gi).map((part: string, idx: number) => 
                  part.toLowerCase() === 'forge' ? <span key={idx} className="text-neon-purple">{part}</span> : part
                )}
              </span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              We blend high-end art design, gaming engines, and premium web architectures to create interactive digital experiences that scale globally.
            </p>
            <div className="flex items-center gap-4">
              <a href={settings.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-neon-purple/20 text-gray-400 hover:text-white rounded-lg transition-all border border-white/5 cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href={settings.twitter} target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-neon-purple/20 text-gray-400 hover:text-white rounded-lg transition-all border border-white/5 cursor-pointer">
                <Twitter className="w-4 h-4" />
              </a>
              <a href={settings.facebook} target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-neon-purple/20 text-gray-400 hover:text-white rounded-lg transition-all border border-white/5 cursor-pointer">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={settings.github} target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-neon-purple/20 text-gray-400 hover:text-white rounded-lg transition-all border border-white/5 cursor-pointer">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-space text-white font-bold text-sm tracking-wider uppercase mb-6">Company</h4>
            <ul className="space-y-3.5 text-xs text-gray-400">
              <li><Link href="/" className="hover:text-neon-cyan transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-neon-cyan transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-neon-cyan transition-colors">Our Services</Link></li>
              <li><Link href="/projects" className="hover:text-neon-cyan transition-colors">Case Studies</Link></li>
              <li><Link href="/faq" className="hover:text-neon-cyan transition-colors">FAQ Hub</Link></li>
              <li><Link href="/contact" className="hover:text-neon-cyan transition-colors">Contact Hub</Link></li>
            </ul>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="font-space text-white font-bold text-sm tracking-wider uppercase mb-6">Services</h4>
            <ul className="space-y-3.5 text-xs text-gray-400">
              <li><Link href="/services/art-animation" className="hover:text-neon-purple transition-colors">Art & Animation</Link></li>
              <li><Link href="/services/game-development" className="hover:text-neon-purple transition-colors">Game Development</Link></li>
              <li><Link href="/services/web-development" className="hover:text-neon-purple transition-colors">Web Development</Link></li>
              <li><Link href="/services/ar-vr" className="hover:text-neon-purple transition-colors">AR/VR & Metaverse</Link></li>
              <li><Link href="/services/arch-viz" className="hover:text-neon-purple transition-colors">Architectural Viz</Link></li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div className="space-y-6">
            <h4 className="font-space text-white font-bold text-sm tracking-wider uppercase mb-2">Subscribe</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Get the latest creative tech news, game development strategies, and interactive project updates.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2.5 text-xs">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Subscription confirmed successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    suppressHydrationWarning
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    suppressHydrationWarning
                    className="absolute right-2 top-2 p-1.5 rounded-lg bg-neon-purple hover:bg-neon-blue text-white transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {error && <span className="text-[10px] text-red-400 px-1">{error}</span>}
              </form>
            )}
          </div>
        </div>

        {/* Mid section: Badges */}
        <div className="border-t border-white/5 py-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-8 text-[11px] font-space font-semibold text-gray-500 uppercase tracking-widest">
            <span>Clutch Rated 4.9★</span>
            <span>Google Certified Partner</span>
            <span>Awwwards Honorable Mention</span>
            <span>Upwork Top Rated Plus</span>
          </div>
          <div className="flex gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-neon-purple" /> {settings.address}</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-neon-purple" /> {settings.phone}</span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} {settings.siteName} Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
