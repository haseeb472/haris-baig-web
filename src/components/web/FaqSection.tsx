'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, ArrowRight, MessageSquare, Sparkles, HelpCircle } from 'lucide-react';
import SplitText from '@/components/web/SplitText';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
}

export interface FaqTopic {
  id: string;
  label: string;
  description: string;
  items: FaqItem[];
}

const FAQ_DATA: FaqTopic[] = [
  {
    id: 'company',
    label: 'About & Studio',
    description: 'Origins, leadership team, studio standards, and how we co-produce with global leaders.',
    items: [
      {
        id: 'c-1',
        question: 'How is LogicForge different from a typical digital agency or dev shop?',
        answer: 'Unlike generic agencies that rely on outsourced templates, LogicForge is founded by former AAA technical artists and systems architects. We build custom mathematical shaders, procedural 3D pipelines, and bespoke WebGL engines. Every asset, quad topology, and web component is engineered from scratch for optimal fidelity, frame rates, and cross-platform longevity.',
        tags: ['Studio', 'Pipeline', 'Quality']
      },
      {
        id: 'c-2',
        question: 'Who leads LogicForge, and what is your team’s background?',
        answer: 'Our studio is led by industry veterans with over 15 years of experience across top gaming studios and creative tech labs in San Francisco and Tokyo. Our multidisciplinary team comprises 3D modelers, Unreal/Unity engineers, GLSL shader artists, and full-stack React/Next.js developers who have shipped titles and enterprise applications with millions of active users.',
        tags: ['Leadership', 'Experience', 'Team']
      },
      {
        id: 'c-3',
        question: 'Where is LogicForge based, and do you collaborate internationally?',
        answer: 'We maintain our primary creative hub in San Francisco, CA, with a co-production studio in Tokyo, Japan. Our distributed infrastructure operates on asynchronous workflows across North American, European, and Asian time zones, enabling seamless collaboration with international brands and studios worldwide.',
        tags: ['Locations', 'Global', 'Timezones']
      },
      {
        id: 'c-4',
        question: 'What core values guide how LogicForge collaborates with co-production partners?',
        answer: 'We operate on three foundational pillars: Absolute Transparency (daily sprint syncs and direct pipeline access), Zero Technical Debt (clean quad topologies and robust netcodes), and Relentless Innovation (embracing real-time rendering, WebGPU, and modern micro-architectures). We treat every partner project as an award-worthy showcase.',
        tags: ['Culture', 'Values', 'Standards']
      }
    ]
  },
  {
    id: 'services',
    label: 'Services & Pipeline',
    description: 'Our full-cycle game development, 3D asset sculpting, and web production capabilities.',
    items: [
      {
        id: 's-1',
        question: 'What full-cycle production services does LogicForge offer?',
        answer: 'We deliver end-to-end digital production across three core pillars: (1) Art & Animation: High-poly ZBrush sculpting, Substance texturing, and custom rigging; (2) Game Engineering: Real-time gameplay logic, multiplayer netcodes, and physics optimization in Unreal Engine 5 and Unity; (3) Web Development: Bespoke Three.js/WebGL interactive showcases, headless CMS backends, and sub-second React/Next.js architectures.',
        tags: ['Services', 'Capabilities', 'Full-Cycle']
      },
      {
        id: 's-2',
        question: 'Can LogicForge embed directly into our internal development sprints?',
        answer: 'Yes. We frequently operate as a specialized co-production unit embedded into client development teams. We adapt to your established Jira/Linear boards, Git repositories, Perforce streams, and CI/CD pipelines, providing transparent daily burndowns and sprint milestone reviews.',
        tags: ['Sprints', 'Co-Production', 'Integration']
      },
      {
        id: 's-3',
        question: 'How do you maintain high visual fidelity while optimizing for web and mobile performance?',
        answer: 'We implement disciplined Level-of-Detail (LOD) hierarchies, texture atlas compression (KTX2, Basis Universal), draw call batching, and custom GLSL vertex shaders. This ensures 60 FPS rendering on mobile GPUs while preserving the micro-surface details and lighting depth of high-end cinematic assets.',
        tags: ['Optimization', 'Performance', 'Shaders']
      },
      {
        id: 's-4',
        question: 'What deliverables are provided at the conclusion of an asset or web project?',
        answer: 'You receive complete source deliverables: production-ready FBX/GLTF/USDZ models with PBR texture sets, master source scene files (Maya, Blender, ZBrush), complete Git repository code with comprehensive documentation, and administrative CMS credentials with full IP ownership transferred.',
        tags: ['Deliverables', 'Handoff', 'Assets']
      }
    ]
  },
  {
    id: 'technology',
    label: 'Platforms & Technology',
    description: 'Toolchains, real-time engines, WebGL frameworks, and technical standards.',
    items: [
      {
        id: 't-1',
        question: 'Which game engines, frameworks, and 3D software do your artists utilize?',
        answer: 'Our 3D department works in ZBrush, Maya, Blender, Substance 3D Painter/Designer, and Houdini. For interactive and gaming projects, we develop in Unreal Engine 5 (Nanite, Lumen) and Unity (URP/HDRP). For the web, we specialize in Next.js 15, Three.js, React Three Fiber, WebGPU, and GSAP animation suites.',
        tags: ['Engines', 'Software', 'Tech Stack']
      },
      {
        id: 't-2',
        question: 'What role does AI actually play in how LogicForge delivers work?',
        answer: 'We leverage proprietary generative models and machine-learning algorithms strictly for rapid ideation, concept exploration, automated UV unwrapping assistance, and synthetic motion-capture refinement. All final production topology, character modeling, custom shaders, and system logic are manually sculpted and coded by human senior artists.',
        tags: ['AI', 'Workflow', 'Innovation']
      },
      {
        id: 't-3',
        question: 'Do you build interactive WebGL and 3D experiences for standard mobile browsers?',
        answer: 'Absolutely. We design interactive 3D web applications that gracefully scale from high-end desktop workstations down to standard mobile smartphones. Our progressive degradation pipelines dynamically adjust shadow cascades, post-processing filters, and polygon budgets based on detected device GPU capabilities.',
        tags: ['WebGL', 'Mobile', 'Responsiveness']
      },
      {
        id: 't-4',
        question: 'How do you guarantee sub-second load times on 3D-heavy web experiences?',
        answer: 'We utilize Draco geometry compression, lazy-loaded Three.js canvas mounts, Web Workers for offloading computational math, and edge CDN distribution for asset caching. Initial critical DOM and hero typography render instantly, while 3D scene buffers stream seamlessly in the background.',
        tags: ['Speed', 'Draco', 'Architecture']
      }
    ]
  },
  {
    id: 'contact',
    label: 'Contact & Engagement',
    description: 'Discovery consultations, quotation timelines, and onboarding workflows.',
    items: [
      {
        id: 'ct-1',
        question: 'How do we kick off a new engagement or request a project quotation?',
        answer: 'You can begin by submitting a project summary through our Contact Hub or scheduling an interactive video discovery call. Within 24-48 hours, our technical director reviews your specifications, drafts a preliminary scoping estimate, and schedules a technical alignment session.',
        tags: ['Onboarding', 'Estimates', 'Discovery']
      },
      {
        id: 'ct-2',
        question: 'What is your typical turnaround time for preliminary scoping and estimates?',
        answer: 'Standard discovery estimates and milestone roadmaps are delivered within 2 business days. For complex enterprise architectural RFPs requiring bespoke shader or engine benchmarking, we provide an in-depth technical proof-of-concept proposal within 5 business days.',
        tags: ['Turnaround', 'Timeline', 'Proposal']
      },
      {
        id: 'ct-3',
        question: 'Can we book an interactive consultation with your lead technical architects?',
        answer: 'Yes. Our Contact Hub features an integrated real-time calendar where prospective partners can book a 30-minute interactive technical scoping session directly with our lead engineers to assess technical feasibility, engine choices, and pipeline budgets.',
        tags: ['Consultation', 'Meeting', 'Direct']
      },
      {
        id: 'ct-4',
        question: 'What communication tools and project tracking do you use during sprints?',
        answer: 'We maintain dedicated client Slack/Discord channels for instantaneous communication, host bi-weekly sprint video demos via Google Meet or Zoom, and provide real-time visibility into development sprint progress through Linear boards or private Git repositories.',
        tags: ['Communication', 'Slack', 'Transparency']
      }
    ]
  },
  {
    id: 'privacy',
    label: 'Privacy & Security',
    description: 'Intellectual property ownership, NDAs, security protocols, and source code privacy.',
    items: [
      {
        id: 'p-1',
        question: 'How does LogicForge protect intellectual property (IP) and proprietary concepts?',
        answer: 'All intellectual property, proprietary lore, characters, 3D assets, source code, and design files created during an engagement belong exclusively to the client upon milestone payment completion. We enforce strict contractual work-for-hire provisions ensuring complete IP ownership transfer.',
        tags: ['IP Ownership', 'Copyright', 'Assets']
      },
      {
        id: 'p-2',
        question: 'Do you sign non-disclosure agreements (NDAs) prior to initial project discussions?',
        answer: 'Yes. We routinely execute mutual NDAs prior to reviewing unreleased concept art, game design documents (GDD), or proprietary tech stacks. We also enforce internal studio-wide NDAs and segmented repository access among our team members on a strict need-to-know basis.',
        tags: ['NDA', 'Confidentiality', 'Legal']
      },
      {
        id: 'p-3',
        question: 'How do you securely store and handle client repositories and production models?',
        answer: 'All production assets and code repositories are hosted on enterprise-grade encrypted cloud storage with two-factor authentication (2FA), role-based access control, and automated daily off-site backups. We do not use client models or codebases to train public machine-learning models.',
        tags: ['Security', 'Encryption', 'Cloud']
      },
      {
        id: 'p-4',
        question: 'What data privacy policies apply to visitors and clients on the LogicForge platform?',
        answer: 'We adhere to GDPR and CCPA standards. We only collect essential project contact information and diagnostic analytics. We never monetize, share, or sell client data to third-party brokers. For full details, review our comprehensive Privacy Policy page.',
        tags: ['GDPR', 'CCPA', 'Compliance']
      }
    ]
  },
  {
    id: 'terms',
    label: 'Terms & Agreements',
    description: 'Billing milestones, revision cycles, licensing parameters, and warranty support.',
    items: [
      {
        id: 'tm-1',
        question: 'What does a standard milestone billing structure look like?',
        answer: 'Engagements are typically structured across staged milestone deliverables (e.g., 30% project initiation & scoping, 35% intermediate beta review / alpha build, 35% final QA approval & source handoff). For continuous co-production sprints, we offer dedicated monthly sprint retainer models.',
        tags: ['Billing', 'Milestones', 'Contracts']
      },
      {
        id: 'tm-2',
        question: 'What is your revision and feedback policy during milestone reviews?',
        answer: 'Each defined milestone includes two rounds of comprehensive iterative feedback at the blockout/wireframe stage and detail pass. This ensures alignment before final high-poly baking or code compilation, preventing scope creep and ensuring timely delivery.',
        tags: ['Revisions', 'Feedback', 'Approval']
      },
      {
        id: 'tm-3',
        question: 'Who owns the final code, 3D assets, and rendered media upon project completion?',
        answer: 'You own 100% of the deliverables upon final settlement. LogicForge retains only the customary portfolio display right to showcase non-confidential visuals in our exhibition reel, unless explicitly agreed otherwise via a white-label or strict NDA clause.',
        tags: ['Ownership', 'Rights', 'Portfolio']
      },
      {
        id: 'tm-4',
        question: 'What post-launch maintenance, SLAs, and technical support warranties are provided?',
        answer: 'All delivered web architectures and standalone interactive builds include a complimentary 30-day post-launch warranty covering bug fixes and browser patch reconciliations. Extended monthly SLA maintenance packages are available for ongoing server monitoring, asset updates, and security patches.',
        tags: ['Warranty', 'SLA', 'Support']
      }
    ]
  }
];

export default function FaqSection() {
  const [activeTab, setActiveTab] = useState<string>('company');
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);
  const faqTopRef = useRef<HTMLDivElement>(null);

  // Tab change handler satisfying:
  // "if user open 4rt accordion from 1st tabs and then user click to the 2nd tab in the left side colum
  // so the recent tab should be close and page will go to the top first then show the accordion of that tabs"
  const handleTabChange = (newTabId: string) => {
    if (newTabId === activeTab && !searchQuery) return;

    // 1. Clear search query if active
    if (searchQuery) setSearchQuery('');

    // 2. Close any open accordion from recent tab
    setOpenAccordion(null);

    // 3. Switch to the new tab
    setActiveTab(newTabId);

    // 4. Smoothly scroll page to the top of the FAQ section first
    if (faqTopRef.current) {
      const scrollOffset = -160; // minus 2x of header height
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.scrollTo(faqTopRef.current, { offset: scrollOffset, duration: 0.8 });
      } else {
        const elementPosition = faqTopRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset + scrollOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    }
  };

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  // Filtered items when search is active
  const isSearching = searchQuery.trim().length > 0;
  const filteredFaqs = isSearching
    ? FAQ_DATA.flatMap((topic) =>
        topic.items
          .filter(
            (item) =>
              item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          )
          .map((item) => ({ ...item, topicLabel: topic.label, topicId: topic.id }))
      )
    : [];

  const currentTopic = FAQ_DATA.find((t) => t.id === activeTab) || FAQ_DATA[0];

  return (
    <section ref={containerRef} className="relative w-full bg-bg-dark text-white font-sans py-12 sm:py-16 md:py-20">
      {/* Ambient background glows - securely clipped in its own absolute layer */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] rounded-full bg-neon-purple/25 blur-[160px]" />
        <div className="absolute bottom-1/3 right-1/10 w-[450px] h-[450px] rounded-full bg-neon-cyan/20 blur-[150px]" />
      </div>

      <div className="max-w-[105rem] mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        
        {/* Scroll anchor target */}
        <div ref={faqTopRef} className="h-0 w-0 -mt-2" aria-hidden="true" />

        {/* Mobile Sticky Horizontal Tabs Bar (<= 1023px) */}
        <div className="block lg:hidden sticky top-20 z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 py-3 bg-bg-dark/95 backdrop-blur-xl border-b border-white/10 mb-8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar scrollbar-none touch-pan-x">
            {FAQ_DATA.map((tab) => {
              const isActive = activeTab === tab.id && !isSearching;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-xl text-xs font-space font-bold uppercase transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/40 shadow-lg shadow-neon-cyan/10'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/10 text-gray-400'
                  }`}>
                    {tab.items.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Left Column (Header + Sticky Tabs) & Right Column (Accordions) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT SIDE COLUMN: HEADER & STICKY TABS (Sticky at 2x header height: 160px) */}
          {/* ========================================================================= */}
          <div
            className="lg:col-span-5 lg:sticky lg:top-[160px] self-start space-y-6 z-20"
            style={{ top: '160px' }}
          >
            
            {/* Header Block matching reference image: ":: FAQ", title, subtitle */}
            <div className="space-y-4 text-left">
              {/* Tag matching ":: FAQ" in reference */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neon-cyan font-space">
                <span className="text-neon-cyan font-black text-sm tracking-tighter">::</span>
                <span className="font-space font-bold tracking-widest text-[12px] text-neon-cyan">FAQ</span>
              </div>

              {/* Title matching "Frequently Asked Question" */}
              <SplitText
                text="Frequently Asked Question"
                className="text-3xl sm:text-4xl md:text-5xl font-space font-black tracking-tight text-white uppercase leading-[1.05]"
                as="h1"
              />

              {/* Subtitle matching "Trusted in more than 100 countries and 4 million customers." */}
              <p className="text-gray-400 text-xs sm:text-sm max-w-md leading-relaxed">
                Trusted by enterprise studios, gaming publishers, and innovative digital brands worldwide.
              </p>

              {/* Quick Search Bar */}
              <div className="pt-2 max-w-sm">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions (e.g. Unreal, NDA, Sprints)..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/30 transition-all font-sans"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs cursor-pointer px-1 py-0.5"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Vertical Tabs Bar matching reference image with left vertical line */}
            <div className="hidden lg:block pt-4">
              <nav className="relative border-l-2 border-white/10 space-y-1" aria-label="FAQ Categories">
                {FAQ_DATA.map((tab) => {
                  const isActive = activeTab === tab.id && !isSearching;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`relative w-full text-left pl-6 pr-4 py-3.5 transition-all duration-300 flex items-center justify-between cursor-pointer group select-none ${
                        isActive
                          ? 'text-neon-cyan font-space font-bold text-base sm:text-lg'
                          : 'text-gray-400 hover:text-white font-space font-medium text-sm sm:text-base'
                      }`}
                    >
                      {/* Vertical Active Line Indicator (Exact placement on left border matching reference) */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute -left-[2px] top-0 bottom-0 w-[3px] bg-neon-cyan shadow-[0_0_12px_rgba(255,190,11,0.8)]"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}

                      <span>{tab.label}</span>

                      <span
                        className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded transition-all ${
                          isActive
                            ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                            : 'bg-white/5 text-gray-500 group-hover:text-gray-300'
                        }`}
                      >
                        0{tab.items.length}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Consultation Callout Box */}
              <div className="mt-8 p-4 rounded-2xl glass-panel border border-white/5 space-y-2 max-w-sm">
                <div className="flex items-center gap-2 text-neon-purple text-xs font-bold font-space uppercase">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Custom Scoping?</span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Have bespoke technical specifications or NDA requirements?
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs text-neon-cyan hover:text-white font-bold pt-1 transition-colors group cursor-pointer"
                >
                  <span>Book Scoping Session</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT SIDE COLUMN: MINIMALIST ACCORDIONS (Matching Reference Image)       */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Search Results Notification */}
            {isSearching && (
              <div className="pb-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neon-cyan font-bold uppercase font-space">
                    Search Results for &ldquo;{searchQuery}&rdquo;
                  </span>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Found {filteredFaqs.length} matching questions across all categories
                  </p>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
                >
                  View all categories
                </button>
              </div>
            )}

            {/* Accordion Container with Animated Transitions on Tab Switch */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isSearching ? `search-${searchQuery}` : activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="divide-y divide-white/10 border-t border-b border-white/10"
              >
                {/* When Search Has No Matches */}
                {isSearching && filteredFaqs.length === 0 && (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <h3 className="font-space font-bold text-white text-lg">No matching questions found</h3>
                    <p className="text-gray-400 text-xs max-w-md mx-auto leading-relaxed">
                      We couldn&apos;t find an answer matching &ldquo;{searchQuery}&rdquo;. Try another term or submit your inquiry to our engineering team.
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 rounded-xl bg-neon-purple/20 text-neon-cyan border border-neon-purple/30 text-xs font-bold font-space uppercase hover:bg-neon-purple/30 transition-all cursor-pointer"
                    >
                      Clear Search & Browse All
                    </button>
                  </div>
                )}

                {/* Render Accordion Items with Clean Minimalist Border Separators */}
                {(isSearching ? filteredFaqs : currentTopic.items).map((item, idx) => {
                  const isOpen = openAccordion === idx;
                  return (
                    <div
                      key={item.id}
                      className={`transition-colors duration-200 ${isOpen ? 'bg-white/[0.02]' : ''}`}
                    >
                      {/* Accordion Header Button */}
                      <button
                        type="button"
                        onClick={() => toggleAccordion(idx)}
                        aria-expanded={isOpen}
                        className="w-full py-5 sm:py-6 text-left flex items-center justify-between gap-6 cursor-pointer select-none group"
                      >
                        <div className="space-y-1.5 flex-1 pr-2">
                          {isSearching && 'topicLabel' in item && (
                            <span className="inline-block text-[9px] font-space font-extrabold uppercase px-2 py-0.5 rounded bg-white/5 text-neon-purple border border-neon-purple/20 mb-1">
                              {(item as any).topicLabel}
                            </span>
                          )}
                          <h3
                            className={`font-space font-bold text-base sm:text-lg md:text-xl transition-colors leading-snug ${
                              isOpen ? 'text-neon-cyan' : 'text-white group-hover:text-neon-cyan'
                            }`}
                          >
                            {item.question}
                          </h3>
                        </div>

                        {/* Chevron matching reference image (in neon-cyan/amber accent) */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 text-neon-cyan ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </button>

                      {/* Accordion Expandable Answer Body */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pb-6 pt-1 text-gray-300 text-xs sm:text-sm leading-relaxed space-y-4">
                              <p className="leading-relaxed font-sans">{item.answer}</p>

                              {/* Tags Row */}
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                                  <span className="text-[10px] text-gray-500 font-mono">Related:</span>
                                  {item.tags.map((tag, tIdx) => (
                                    <span
                                      key={tIdx}
                                      className="text-[10px] font-space font-semibold px-2 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/5"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Bottom Support CTA Box */}
            <div className="mt-12 p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-left">
              <div className="space-y-1.5 max-w-lg">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-neon-cyan" />
                  <h3 className="font-space font-bold text-white text-base sm:text-lg">Still have unanswered questions?</h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Our pipeline architects can review your custom requirements, benchmark frame rates, and deliver an actionable production scope.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-space font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Inquire Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/services"
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-space font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Explore Services
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
