import type { Metadata } from 'next';
import LegalDocLayout, { LegalSection } from '@/components/web/LegalDocLayout';

export const metadata: Metadata = {
  title: 'Terms & Conditions | LogicForge Studio',
  description:
    'Review the official terms of service, production milestone agreements, intellectual property ownership terms, and service warranties for LogicForge engagements.',
  openGraph: {
    title: 'Terms & Conditions | LogicForge Studio',
    description: 'Official terms of service, production agreements, and IP terms for LogicForge clients.',
    url: 'https://logicforge.co/terms',
    siteName: 'LogicForge'
  }
};

const TERMS_SECTIONS: LegalSection[] = [
  {
    id: 'scope-and-services',
    number: '01',
    title: 'Scope & Service Agreements',
    subsections: [
      {
        heading: 'Execution of Statements of Work (SOW)',
        content: (
          <>
            <p>
              These Terms and Conditions govern all creative production, 3D asset engineering, game development, and WebGL architecture services provided by LogicForge Inc. Specific project scopes, milestones, timelines, and budgets are formalized via individual Statements of Work (SOW) executed between LogicForge and the client.
            </p>
            <p>
              In the event of any conflict between these general Terms and an executed SOW, the terms of the specific SOW shall prevail for that project engagement.
            </p>
          </>
        )
      },
      {
        heading: 'Studio Co-Production & Technical Standards',
        content: (
          <>
            <p>
              LogicForge delivers digital assets and systems built to industry standard specifications (e.g., clean quad topology, PBR Substance materials, Unreal Engine 5 Nanite/Lumen compliance, or optimized Three.js WebGL draw calls). All deliverables undergo internal technical QA benchmarks prior to milestone handoff.
            </p>
          </>
        )
      }
    ]
  },
  {
    id: 'ip-rights-deliverables',
    number: '02',
    title: 'Deliverables & Intellectual Property Rights',
    subsections: [
      {
        heading: 'Transfer of Intellectual Property',
        content: (
          <>
            <p>
              Upon receipt of final milestone payment for the applicable SOW, LogicForge assigns and transfers to the client all right, title, and interest in and to the custom deliverables, including 3D meshes, master ZBrush/Blender/Maya source files, textures, rigs, and bespoke codebase components.
            </p>
          </>
        )
      },
      {
        heading: 'Pre-Existing Tools & Portfolio Display Rights',
        content: (
          <>
            <p>
              LogicForge retains ownership of its proprietary base utilities, generic shaders, internal scripts, and development toolkits that were created prior to or independent of the engagement. LogicForge grants the client a perpetual, worldwide, royalty-free license to utilize such tools as embedded within the final deliverables.
            </p>
            <p>
              Unless explicitly restricted via a white-label agreement or strict confidentiality clause in the SOW, LogicForge reserves the standard commercial right to display non-confidential project imagery in its digital portfolio and promotional reels.
            </p>
          </>
        )
      }
    ]
  },
  {
    id: 'milestones-and-billing',
    number: '03',
    title: 'Milestone Payments & Billing',
    subsections: [
      {
        heading: 'Staged Milestone Billing Structure',
        content: (
          <>
            <p>
              Fixed-price projects are structured around defined milestone deliverables (typically 30% initial deposit and kickoff, 35% alpha/blockout approval, and 35% final QA approval and source asset transfer). Invoices are payable within 14 calendar days of issuance unless otherwise stipulated in the SOW.
            </p>
            <p>
              For ongoing co-production embedded sprints, client retainer billing occurs on a bi-weekly or monthly cadence with dedicated senior engineering hours allocated.
            </p>
          </>
        )
      }
    ]
  },
  {
    id: 'revisions-and-scope',
    number: '04',
    title: 'Revisions, Feedback & Scope Variations',
    subsections: [
      {
        heading: 'Iterative Review Rounds',
        content: (
          <>
            <p>
              Each milestone includes up to two rounds of structured consolidated client revisions. To ensure sprint efficiency, client feedback must be submitted within 5 business days of milestone demonstration or deliverable handoff.
            </p>
          </>
        )
      },
      {
        heading: 'Scope Changes & Variation Orders',
        content: (
          <>
            <p>
              Requests that introduce new feature logic, additional character meshes, alternative engine migrations, or structural changes outside the agreed SOW parameters will be documented as a Variation Order with an updated estimate and timeline impact prior to commencement.
            </p>
          </>
        )
      }
    ]
  },
  {
    id: 'warranties-and-liability',
    number: '05',
    title: 'Warranties, Liability & Dispute Resolution',
    subsections: [
      {
        heading: '30-Day Post-Launch Warranty',
        content: (
          <>
            <p>
              LogicForge provides a 30-day post-launch warranty covering defect remediation for custom web builds and standalone interactive engines. This warranty covers software bugs where deliverables deviate from verified SOW requirements on supported browser targets and engine versions.
            </p>
          </>
        )
      },
      {
        heading: 'Limitation of Liability & Governing Law',
        content: (
          <>
            <p>
              To the maximum extent permitted by applicable law, neither party shall be liable for indirect, incidental, or consequential damages. LogicForge’s total aggregate liability arising out of any engagement shall not exceed the total fees paid by the client under the applicable SOW.
            </p>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles.
            </p>
          </>
        )
      }
    ]
  }
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg-dark text-white font-sans">
      <LegalDocLayout
        badge="TERMS OF SERVICE"
        title="Terms & Conditions"
        lastUpdated="Updated March 2026"
        description="These Terms and Conditions define the legal parameters, intellectual property ownership rights, milestone delivery protocols, and warranty commitments governing all engagements with LogicForge Inc."
        sections={TERMS_SECTIONS}
      />
    </div>
  );
}
