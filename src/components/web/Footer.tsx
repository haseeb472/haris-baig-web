'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Send, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram, Github, CheckCircle2 } from 'lucide-react';
import { FooterSettings, getDefaultFooter } from '@/lib/cms-types';

const defaultFooter = getDefaultFooter();

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [footerData, setFooterData] = useState<FooterSettings>(defaultFooter);

  useEffect(() => {
    fetch('/api/cms?table=footer')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          const item = Array.isArray(data) ? data[0] : data;
          if (item && item.columns) {
            setFooterData((prev) => ({ ...prev, ...item }));
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

  const col1 = footerData.columns?.[0] || defaultFooter.columns[0];
  const col2 = footerData.columns?.[1] || defaultFooter.columns[1];

  return (
    <footer className="relative bg-[#070707] border-t border-white/5 pt-20 pb-10 overflow-hidden font-sans">
      <div className="gradient-mesh opacity-10">
        <div className="mesh-orb-2 bottom-0 right-0"></div>
      </div>

      <div className="max-w-[105rem] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo & Intro */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group cursor-pointer py-1">
              <Image
                src={footerData.logo || "/images/icons/brand_logo.svg"}
                alt="Fourth Pixel"
                width={249}
                height={287}
                className="w-[84px] sm:w-[90px] h-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.35)] transition-all duration-300"
              />
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              {footerData.aboutText}
            </p>
            <div className="flex items-center gap-4">
              {footerData.socialLinks?.linkedin && (
                <a href={footerData.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-neon-purple/20 text-gray-400 hover:text-white rounded-lg transition-all border border-white/5 cursor-pointer">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {footerData.socialLinks?.twitter && (
                <a href={footerData.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-neon-purple/20 text-gray-400 hover:text-white rounded-lg transition-all border border-white/5 cursor-pointer">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {footerData.socialLinks?.facebook && (
                <a href={footerData.socialLinks.facebook} target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-neon-purple/20 text-gray-400 hover:text-white rounded-lg transition-all border border-white/5 cursor-pointer">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {footerData.socialLinks?.instagram && (
                <a href={footerData.socialLinks.instagram} target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-neon-purple/20 text-gray-400 hover:text-white rounded-lg transition-all border border-white/5 cursor-pointer">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {footerData.socialLinks?.github && (
                <a href={footerData.socialLinks.github} target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-neon-purple/20 text-gray-400 hover:text-white rounded-lg transition-all border border-white/5 cursor-pointer">
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 1 Navigation */}
          <div>
            <h4 className="font-space text-white font-bold text-sm tracking-wider uppercase mb-6">{col1.title}</h4>
            <ul className="space-y-3.5 text-xs text-gray-400">
              {col1.links.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:text-neon-cyan transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 Services */}
          <div>
            <h4 className="font-space text-white font-bold text-sm tracking-wider uppercase mb-6">{col2.title}</h4>
            <ul className="space-y-3.5 text-xs text-gray-400">
              {col2.links.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:text-neon-purple transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div className="space-y-6">
            <h4 className="font-space text-white font-bold text-sm tracking-wider uppercase mb-2">{footerData.newsletterTitle}</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              {footerData.newsletterSubtitle}
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

        {/* Mid section: Badges & Contact */}
        <div className="border-t border-white/5 py-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-8 text-[11px] font-space font-semibold text-gray-500 uppercase tracking-widest">
            {(footerData.badges || []).map((badge, idx) => (
              <span key={idx}>{badge}</span>
            ))}
          </div>
          <div className="flex gap-4 text-xs text-gray-400">
            {footerData.contactInfo?.address && (
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-neon-purple" /> {footerData.contactInfo.address}</span>
            )}
            {footerData.contactInfo?.phone && (
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-neon-purple" /> {footerData.contactInfo.phone}</span>
            )}
          </div>
        </div>

        {/* Bottom copyright & legal links */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} {footerData.copyrightText}</p>
          <div className="flex gap-6">
            {(footerData.legalLinks || []).map((legal, idx) => (
              <Link key={idx} href={legal.href} className="hover:text-white transition-colors">{legal.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
