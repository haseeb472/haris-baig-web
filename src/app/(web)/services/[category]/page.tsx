import Link from 'next/link';
import { readDb } from '@/lib/cms';
import * as LucideIcons from 'lucide-react';
import { Sparkles, ArrowRight, ArrowUpRight, HelpCircle } from 'lucide-react';
import HomeContact from '@/components/web/HomeContact';
import SplitText from '@/components/web/SplitText';

interface PageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_META: Record<string, { name: string; desc: string; icon: any }> = {
  'art-animation': { name: 'Art & Animation', desc: 'Premium 2D/3D art pipelines, organic character details, and rigging models.', icon: LucideIcons.Palette },
  'game-development': { name: 'Game Development', desc: 'AAA quality programming, server netcodes, gameplay loops, and frame profile tuning.', icon: LucideIcons.Gamepad2 },
  'web-development': { name: 'Web Development', desc: 'Bespoke corporate platforms, Next.js static generation, and interactive WebGL canvas widgets.', icon: LucideIcons.Globe },
  'app-development': { name: 'App Development', desc: 'Premium native and cross-platform mobile apps for iOS and Android built on robust rendering architectures.', icon: LucideIcons.Smartphone },
  'cms-integration': { name: 'CMS & Database Solutions', desc: 'Tailored headless CMS architectures and database sync pipelines for dynamic content editing.', icon: LucideIcons.Layers },
  'qa-testing': { name: 'QA & Automated Testing', desc: 'Comprehensive manual and automated testing audits to guarantee zero regressions and bug-free releases.', icon: LucideIcons.CheckSquare },
  'shopify-commerce': { name: 'Shopify & E-Commerce', desc: 'High-performance bespoke Shopify Plus storefronts, headless e-commerce architectures, and conversion checkouts.', icon: LucideIcons.ShoppingBag },
  'ar-vr': { name: 'AR / VR solutions', desc: 'Spatial computing catalogs, interactive retail showrooms, and digital twins.', icon: LucideIcons.Smartphone },
  'arch-viz': { name: 'Architectural Visualization', desc: 'Fly-through walkthrough rendering, high-polygon interior blueprints, and environment assets.', icon: LucideIcons.Landmark }
};

export default async function ServiceCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const db = readDb();
  
  const servicesPage = db.pages.find((p: any) => p.id === 'services');
  const heroComp = servicesPage?.components?.find((c: any) => c.type === 'ServicesHero');
  const categories = heroComp?.content?.categories;

  let meta;
  if (categories && Array.isArray(categories)) {
    const matched = categories.find((cat: any) => cat.id === category);
    if (matched) {
      meta = {
        name: matched.name,
        desc: matched.desc,
        icon: (LucideIcons as any)[matched.icon] || LucideIcons.Sparkles
      };
    }
  }

  if (!meta) {
    const staticMeta = CATEGORY_META[category];
    meta = staticMeta ? {
      name: staticMeta.name,
      desc: staticMeta.desc,
      icon: staticMeta.icon
    } : {
      name: 'Production Service',
      desc: 'Bespoke creative digital production services optimized for enterprise performance.',
      icon: Sparkles
    };
  }

  const Icon = meta.icon;

  // Filter matching services
  const matchedServices = db.services.filter((s) => s.category === category);
  
  // Filter matching projects
  const matchedProjects = db.projects.filter((p) => {
    if (category === 'art-animation') return p.category.includes('art') || p.category.includes('asset') || p.category.includes('character');
    if (category === 'game-development') return p.category.includes('game') || p.category.includes('dev');
    if (category === 'web-development') return p.category.includes('web') || p.category.includes('code');
    if (category === 'ar-vr') return p.category.includes('ar') || p.category.includes('vr');
    return false;
  });

  // Filter matching FAQs
  const matchedFaqs = db.faqs.filter((f) => f.category.toLowerCase() === category.replace('-', ' '));

  return (
    <div className="max-w-[105rem] mx-auto px-6 md:px-12 py-16 font-sans space-y-24">
      
      {/* Category Hero banner */}
      <section className="relative py-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-12 border-b border-white/5 pb-16">
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-purple/20 bg-neon-purple/10 text-xs font-semibold text-white uppercase tracking-wider">
            <Icon className="w-3.5 h-3.5 text-neon-cyan" />
            <span>Mega-Capability</span>
          </div>
          
          <SplitText
            text={meta.name}
            className="text-4xl sm:text-6xl font-space font-black tracking-tight text-white uppercase"
            as="h1"
          />
          
          <p className="text-gray-400 text-sm leading-relaxed">
            {meta.desc}
          </p>
        </div>

        <div className="p-8 rounded-3xl glass-panel border-white/5 text-center flex-shrink-0 min-w-[240px]">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Production scale</p>
          <p className="text-3xl font-space font-black text-neon-cyan mt-1">AAA STANDARD</p>
          <p className="text-[10px] text-gray-400 mt-4 uppercase">24h Turnaround consultation</p>
        </div>
      </section>

      {/* Services Subcategories Grid */}
      <section className="space-y-12">
        <div>
          <SplitText
            text="Individual Services"
            className="font-space font-extrabold text-2xl text-white uppercase"
            as="h3"
          />
          <p className="text-gray-500 text-xs mt-1">Explore our deep specialization sub-disciplines.</p>
        </div>

        {matchedServices.length === 0 ? (
          <div className="py-12 text-center glass-panel rounded-3xl border-dashed">
            <p className="text-gray-500 text-xs">More specific service pages under production. Contact our Creative Directors.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {matchedServices.map((service) => (
              <div
                key={service.id}
                className="group p-6 sm:p-8 rounded-3xl glass-panel border-white/5 hover:border-neon-purple/30 transition-all duration-300 flex flex-col justify-between h-72"
              >
                <div className="space-y-4">
                  <h4 className="font-space font-extrabold text-xl text-white group-hover:text-neon-cyan transition-colors">
                    {service.name}
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-end">
                  <Link
                    href={`/services/${category}/${service.slug}`}
                    className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-space font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Service details</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Portfolio Projects */}
      {matchedProjects.length > 0 && (
        <section className="space-y-12">
          <div>
            <SplitText
              text="Completed Projects"
              className="font-space font-extrabold text-2xl text-white uppercase"
              as="h3"
            />
            <p className="text-gray-500 text-xs mt-1">Realized assets and setups built for this service segment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matchedProjects.map((project) => (
              <div
                key={project.id}
                className="group relative h-80 rounded-2xl overflow-hidden glass-panel flex flex-col justify-end p-6 border-white/5"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                
                <div className="relative z-10 space-y-3">
                  <h4 className="font-space font-extrabold text-lg text-white group-hover:text-neon-cyan transition-colors line-clamp-1">
                    {project.name}
                  </h4>
                  <p className="text-[10px] text-neon-purple font-bold uppercase tracking-wider">{project.stats || 'AAA Quality'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Specific FAQs list */}
      {matchedFaqs.length > 0 && (
        <section className="space-y-12">
          <div>
            <SplitText
              text="Category FAQs"
              className="font-space font-extrabold text-2xl text-white uppercase"
              as="h3"
            />
            <p className="text-gray-500 text-xs mt-1">Common questions answered by our production leads.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {matchedFaqs.map((faq) => (
              <div key={faq.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-neon-cyan">
                  <HelpCircle className="w-5 h-5" />
                  <h4 className="font-space font-bold text-white text-sm">{faq.question}</h4>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed pl-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Inquiry Form */}
      <HomeContact initialType="quote" />

    </div>
  );
}
