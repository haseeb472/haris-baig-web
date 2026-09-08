import type { Metadata } from 'next';
import LegalDocLayout, { LegalSection } from '@/components/web/LegalDocLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | LogicForge Studio',
  description:
    'Learn how LogicForge protects client confidential data, adheres to GDPR and CCPA standards, enforces strict non-disclosure protections, and manages digital security.',
  openGraph: {
    title: 'Privacy Policy | LogicForge Studio',
    description: 'Learn how LogicForge protects client confidential data, intellectual property, and adherence to global privacy laws.',
    url: 'https://logicforge.co/privacy',
    siteName: 'LogicForge'
  }
};

const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: 'information-we-collect',
    number: '01',
    title: 'Information We Collect',
    subsections: [
      {
        heading: 'Client Project Data & Scoping Details',
        content: (
          <>
            <p>
              When you engage LogicForge for digital production, character sculpting, game development, or WebGL architectures, we collect direct specifications including technical design documents (GDD), brand guidelines, proprietary artwork, and communication records provided via our Contact Hub, discovery sessions, or client Slack channels.
            </p>
            <p>
              We treat all client-provided production files and game lore with the highest classification of confidentiality, whether or not an explicit mutual Non-Disclosure Agreement (NDA) has already been countersigned.
            </p>
          </>
        )
      },
      {
        heading: 'Technical Telemetry & Web Analytics',
        content: (
          <>
            <p>
              When you browse our digital showcases or interactive 3D web environments, our servers automatically collect diagnostic telemetry such as browser user-agent, detected GPU capabilities (for WebGL frame-rate benchmarking), screen dimensions, operating system, and IP address.
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 pl-2">
              <li>Hardware GPU tier detection to adjust dynamic LOD and shader cascades</li>
              <li>Anonymized session duration and interaction engagement metrics</li>
              <li>Network latency diagnostics to optimize global asset CDN delivery</li>
            </ul>
          </>
        )
      }
    ]
  },
  {
    id: 'how-we-use-data',
    number: '02',
    title: 'How We Use & Protect Data',
    subsections: [
      {
        heading: 'Service Delivery & Co-Production Workflows',
        content: (
          <>
            <p>
              We utilize client contact and project data solely to estimate project scope, coordinate sprint milestones, provision repository access, and fulfill contractual deliverables.
            </p>
            <p className="p-4 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20 text-neon-cyan text-xs">
              <strong>Zero Model-Training Guarantee:</strong> LogicForge strictly guarantees that client code, 3D assets, concept art, dialogue trees, and production topologies are NEVER used to train, fine-tune, or benchmark public or proprietary artificial intelligence or machine-learning models without explicit written client consent.
            </p>
          </>
        )
      },
      {
        heading: 'Data Encryption & Enterprise Storage Standards',
        content: (
          <>
            <p>
              All confidential repositories, high-poly model bakes, and communication records are encrypted both in transit (TLS 1.3 / HTTPS) and at rest utilizing AES-256 standards on SOC 2 Type II certified cloud infrastructure. Access is restricted via role-based access controls (RBAC) and hardware-backed two-factor authentication (2FA).
            </p>
          </>
        )
      }
    ]
  },
  {
    id: 'ip-security-ndas',
    number: '03',
    title: 'Intellectual Property & NDA Security',
    subsections: [
      {
        heading: 'Work-for-Hire & IP Transfer',
        content: (
          <>
            <p>
              Under our standard Master Service Agreements, all work created by LogicForge—including character models, textures, shaders, animations, and source code—is executed under a work-for-hire provision. Upon completion and settlement of project milestones, all rights, title, and ownership transfer exclusively to the client.
            </p>
          </>
        )
      },
      {
        heading: 'Internal Non-Disclosure Enforcements',
        content: (
          <>
            <p>
              Every studio artist, technical director, and contractor at LogicForge is bound by strict, perpetual non-disclosure agreements. Development branches and Perforce streams are compartmentalized so that only authorized project team members have access to your proprietary materials.
            </p>
          </>
        )
      }
    ]
  },
  {
    id: 'user-rights-gdpr-ccpa',
    number: '04',
    title: 'Your Rights Under GDPR & CCPA',
    subsections: [
      {
        heading: 'Global Privacy Rights',
        content: (
          <>
            <p>
              Regardless of your geographic location, LogicForge provides international privacy protections conforming to the European Union General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA/CPRA).
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 pl-2">
              <li><strong>Right to Access:</strong> You may request a machine-readable copy of any personal information we store.</li>
              <li><strong>Right to Erasure:</strong> You may request immediate deletion of personal records and project inquiries from our active databases.</li>
              <li><strong>Right to Non-Discrimination:</strong> We do not sell, rent, or monetize client or visitor data to third-party data brokers.</li>
            </ul>
          </>
        )
      }
    ]
  },
  {
    id: 'contact-dpo',
    number: '05',
    title: 'Contact & Data Protection Officer',
    subsections: [
      {
        heading: 'Direct Inquiries & Compliance Requests',
        content: (
          <>
            <p>
              For privacy verification requests, NDA execution before initial scoping, or to exercise your statutory data rights, contact our Data Protection Officer directly:
            </p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1 text-xs">
              <p className="text-white font-bold font-space">LogicForge Legal &amp; Data Privacy Office</p>
              <p className="text-gray-400">Email: <span className="text-neon-cyan">privacy@logicforge.co</span></p>
              <p className="text-gray-400">Physical Hub: 500 Howard Street, Suite 400, San Francisco, CA 94105</p>
              <p className="text-gray-400">Response Window: Within 24-48 business hours</p>
            </div>
          </>
        )
      }
    ]
  }
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg-dark text-white font-sans">
      <LegalDocLayout
        badge="PRIVACY & DATA POLICY"
        title="Privacy Policy"
        lastUpdated="Updated March 2026"
        description="This Privacy Policy outlines how LogicForge Inc. collects, protects, encrypts, and handles your digital information, intellectual property, and proprietary studio assets when accessing our website, services, and co-production pipelines."
        sections={PRIVACY_SECTIONS}
      />
    </div>
  );
}
