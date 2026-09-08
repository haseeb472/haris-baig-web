import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readDb } from '@/lib/cms';
import { Palette, Gamepad2, Globe, Sparkles, HelpCircle, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import HomeContact from '@/components/web/HomeContact';
import SplitText from '@/components/web/SplitText';
import ProcessSlider from '@/components/web/ProcessSlider';

interface PageProps {
  params: Promise<{ category: string; service: string }>;
}

const CATEGORY_ICONS: Record<string, any> = {
  'art-animation': Palette,
  'game-development': Gamepad2,
  'web-development': Globe
};

export default async function ServiceDetailPage({ params }: PageProps) {
  const { category, service: serviceSlug } = await params;
  const db = readDb();

  const service = db.services.find((s) => s.slug === serviceSlug && s.category === category);
  
  if (!service) {
    notFound();
  }

  const Icon = CATEGORY_ICONS[category] || Sparkles;
  
  // Find related services in same category (excluding current)
  const relatedServices = db.services.filter((s) => s.category === category && s.id !== service.id);

  return (
    <div className="max-w-[105rem] mx-auto px-6 md:px-12 py-16 font-sans space-y-24">
      
      {/* Back Link */}
      <div>
        <Link
          href={`/services/${category}`}
          className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {category.replace('-', ' ')}</span>
        </Link>
      </div>

      {/* Hero Header */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <span className="inline-block text-xs text-neon-purple uppercase font-space font-bold tracking-widest bg-neon-purple/10 px-3 py-1.5 rounded-full border border-neon-purple/20">
            SERVICE DETAILS
          </span>
          
          <SplitText
            text={service.name}
            className="text-3xl sm:text-5xl font-space font-black tracking-tight text-white uppercase"
            as="h1"
          />

          <p className="text-gray-400 text-sm leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Benefits Panel */}
        <div className="rounded-3xl glass-panel p-8 border border-white/5 space-y-6">
          <SplitText
            text="Key Benefits"
            className="font-space font-bold text-white text-sm tracking-wider uppercase"
            as="h3"
          />
          <ul className="space-y-3.5 text-xs text-gray-400">
            {service.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Production Process Slider */}
      <section className="space-y-12">
        <div className="text-left">
          <span className="inline-block mb-3 text-[10px] text-neon-cyan uppercase font-space font-bold tracking-widest bg-neon-cyan/10 px-3 py-1 rounded-full border border-neon-cyan/20">
            WORKFLOW PIPELINE
          </span>
          <SplitText
            text="Production Process"
            className="font-space font-extrabold text-2xl text-white uppercase mt-0"
            as="h3"
          />
          <p className="text-gray-500 text-xs mt-1">Our step-by-step pipeline ensuring highest creative fidelity.</p>
        </div>

        <div className="pt-6">
          <ProcessSlider steps={service.process} category={category} />
        </div>
      </section>

      {/* Service FAQs */}
      {service.faqs.length > 0 && (
        <section className="space-y-12">
          <div>
            <SplitText
              text="Frequently Asked Questions"
              className="font-space font-extrabold text-2xl text-white uppercase"
              as="h3"
            />
            <p className="text-gray-500 text-xs mt-1">Direct answers on delivery, revisions, and source files.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {service.faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-neon-cyan">
                  <HelpCircle className="w-5 h-5" />
                  <h4 className="font-space font-bold text-white text-sm">{faq.q}</h4>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="space-y-12">
          <div>
            <SplitText
              text="Related Capabilities"
              className="font-space font-extrabold text-2xl text-white uppercase"
              as="h3"
            />
            <p className="text-gray-500 text-xs mt-1">Other specialized workflows in this production branch.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedServices.map((rSrv) => (
              <div
                key={rSrv.id}
                className="p-6 rounded-2xl glass-panel border border-white/5 flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-space font-bold text-white text-sm group-hover:text-neon-cyan transition-colors">{rSrv.name}</h4>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mt-1">{category.replace('-', ' ')}</p>
                </div>
                <Link
                  href={`/services/${category}/${rSrv.slug}`}
                  className="p-2 bg-white/5 group-hover:bg-neon-purple/20 text-gray-400 group-hover:text-white border border-white/10 rounded-xl transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
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
