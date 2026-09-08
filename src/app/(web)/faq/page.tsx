import type { Metadata } from 'next';
import FaqSection from '@/components/web/FaqSection';

export const metadata: Metadata = {
  title: 'FAQ | Frequently Asked Questions | LogicForge Studio',
  description:
    'Explore common questions regarding LogicForge production services, 3D pipelines, Unreal Engine co-production, IP ownership, sprint workflows, and SLA warranties.',
  keywords: [
    'LogicForge FAQ',
    'Game Development FAQ',
    '3D Production Questions',
    'WebGL Architecture',
    'Unreal Engine Co-Production',
    'IP Ownership',
    'Software SLA'
  ],
  openGraph: {
    title: 'FAQ | Frequently Asked Questions | LogicForge Studio',
    description:
      'Everything you need to know about our high-fidelity 3D modeling, real-time gaming engines, WebGL production, and client co-production agreements.',
    url: 'https://logicforge.co/faq',
    siteName: 'LogicForge',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ | Frequently Asked Questions | LogicForge Studio',
    description:
      'Explore common questions regarding LogicForge production services, 3D pipelines, Unreal Engine co-production, IP ownership, sprint workflows, and SLA warranties.'
  }
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is LogicForge different from a typical digital agency or dev shop?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Unlike generic agencies that rely on outsourced templates, LogicForge is founded by former AAA technical artists and systems architects. We build custom mathematical shaders, procedural 3D pipelines, and bespoke WebGL engines.'
      }
    },
    {
      '@type': 'Question',
      name: 'What full-cycle production services does LogicForge offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We deliver end-to-end digital production across Art & Animation (ZBrush sculpting, Substance texturing, custom rigging), Game Engineering (real-time gameplay logic, multiplayer netcodes in Unreal Engine 5 and Unity), and Web Development (bespoke Three.js/WebGL showcases and Next.js architectures).'
      }
    },
    {
      '@type': 'Question',
      name: 'How does LogicForge protect intellectual property (IP) and proprietary concepts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All intellectual property, proprietary lore, characters, 3D assets, source code, and design files created during an engagement belong exclusively to the client upon milestone payment completion. We enforce strict contractual work-for-hire provisions ensuring complete IP ownership transfer.'
      }
    },
    {
      '@type': 'Question',
      name: 'What post-launch maintenance, SLAs, and technical support warranties are provided?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All delivered web architectures and standalone interactive builds include a complimentary 30-day post-launch warranty covering bug fixes and browser patch reconciliations. Extended monthly SLA maintenance packages are available.'
      }
    }
  ]
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-bg-dark text-white font-sans relative">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqSection />
    </div>
  );
}
