import type { Metadata } from 'next';
import LegalDocLayout, { LegalSection } from '@/components/web/LegalDocLayout';

export const metadata: Metadata = {
  title: 'Cookie Policy | LogicForge Studio',
  description:
    'Read how LogicForge uses cookies, local storage, and WebGL diagnostic caching to optimize your interactive 3D web experience and safeguard data privacy.',
  openGraph: {
    title: 'Cookie Policy | LogicForge Studio',
    description: 'Learn how LogicForge uses cookies and browser storage for optimal web performance.',
    url: 'https://logicforge.co/cookies',
    siteName: 'LogicForge'
  }
};

const COOKIE_SECTIONS: LegalSection[] = [
  {
    id: 'what-are-cookies',
    number: '01',
    title: 'What Are Cookies?',
    subsections: [
      {
        heading: 'Definition & Core Purpose',
        content: (
          <>
            <p>
              Cookies are small text files that websites place on your device when you browse online. They are widely utilized by web platforms to ensure functional operation, remember your preferences, and provide analytical telemetry about how visitors interact with the site.
            </p>
            <p>
              In addition to standard HTTP cookies, LogicForge may utilize modern browser storage mechanisms—such as <code className="text-neon-cyan bg-white/5 px-1.5 py-0.5 rounded font-mono text-xs">localStorage</code> and IndexedDB—to cache compressed 3D WebGL scene buffers, Draco geometry, and texture assets. This prevents redundant multi-megabyte downloads on subsequent visits and ensures instant 60 FPS rendering.
            </p>
          </>
        )
      },
      {
        heading: 'Session vs. Persistent Cookies',
        content: (
          <>
            <ul className="list-disc list-inside space-y-1.5 text-gray-300 pl-2">
              <li>
                <strong>Session Cookies:</strong> Temporary cookies that remain active only while your browser tab is open. They are automatically cleared when you terminate your browser session.
              </li>
              <li>
                <strong>Persistent Cookies:</strong> Remain stored on your device until they expire or are manually deleted. They allow our website to remember your preferred UI theme, volume settings, and 3D graphics fidelity preferences.
              </li>
            </ul>
          </>
        )
      }
    ]
  },
  {
    id: 'cookies-personal-info',
    number: '02',
    title: 'Cookies and Personal Information',
    subsections: [
      {
        heading: 'Data Association & Identification Limits',
        content: (
          <>
            <p>
              Cookies do not necessarily identify you directly by name or contact information. However, certain cookie identifiers, device fingerprints, or IP logs may be combined with diagnostic records that could potentially identify a returning visitor or enterprise network.
            </p>
            <p>
              Where cookie information is considered personal data under applicable global privacy legislation (such as the EU GDPR or California CCPA), LogicForge handles such data strictly in accordance with our comprehensive Privacy Policy and statutory data minimization guidelines.
            </p>
          </>
        )
      },
      {
        heading: 'Categories of Cookies We Deploy',
        content: (
          <div className="space-y-4 pt-1">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="font-space font-bold text-white text-xs uppercase text-neon-cyan">Strictly Necessary Cookies</span>
              <p className="text-gray-400 text-xs leading-relaxed">
                Essential for core navigation, authentication security, and CSRF protection on forms and the client inquiry portal. These cannot be disabled.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="font-space font-bold text-white text-xs uppercase text-neon-purple">Performance &amp; WebGL Diagnostics</span>
              <p className="text-gray-400 text-xs leading-relaxed">
                Collect anonymous telemetry on render times, frame drops, GPU shader compilation errors, and asset load bottlenecks to optimize 3D experience performance.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="font-space font-bold text-white text-xs uppercase text-white">Functional Preferences</span>
              <p className="text-gray-400 text-xs leading-relaxed">
                Store sound state (mute/unmute on 3D scenes), high-contrast accessibility options, and language preferences.
              </p>
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: 'managing-disabling-cookies',
    number: '03',
    title: 'Managing and Disabling Cookies',
    subsections: [
      {
        heading: 'Browser Configuration Controls',
        content: (
          <>
            <p>
              You can manage, restrict, or disable cookies at any time through your individual web browser settings. Most modern browsers allow you to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-300 pl-2">
              <li>View all cookies and storage records stored on your device</li>
              <li>Delete all existing cookies or remove cookies on a per-domain basis</li>
              <li>Block third-party tracking cookies by default</li>
              <li>Allow or block cookies exclusively from selected trusted domains</li>
              <li>Configure notifications to prompt you whenever a cookie is requested</li>
            </ul>
            <p className="pt-2 text-xs text-amber-300/80 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
              <strong>Notice:</strong> If you completely disable cookies or browser storage, certain interactive WebGL features, 3D real-time shader previews, or form submission state may experience degraded performance or require re-initialization on each page load.
            </p>
          </>
        )
      }
    ]
  },
  {
    id: 'data-security',
    number: '04',
    title: 'Data Security & Storage Standards',
    subsections: [
      {
        heading: 'Safeguards & Encryption',
        content: (
          <>
            <p>
              LogicForge takes rigorous technical and organizational measures to safeguard all diagnostic information collected through our web properties. All web traffic and cookie transmissions are protected via modern TLS 1.3 encryption.
            </p>
            <p>
              However, because no digital transmission across the public Internet can be guaranteed as 100% impenetrable, we minimize our data collection footprint to strictly what is essential for application stability and user experience.
            </p>
          </>
        )
      },
      {
        heading: 'Children’s Privacy Safeguards',
        content: (
          <>
            <p>
              LogicForge does not knowingly deploy tracking cookies to collect personal information from children under the age of 13. If we become aware that personal information or telemetry from a minor has been recorded without verifiable parental consent, we take immediate corrective steps to purge such data from our systems.
            </p>
          </>
        )
      }
    ]
  },
  {
    id: 'contact-us',
    number: '05',
    title: 'Contact Us & Policy Updates',
    subsections: [
      {
        heading: 'Policy Revisions & Inquiry Channels',
        content: (
          <>
            <p>
              We periodically update this Cookie Policy to reflect changes in our WebGL technologies, privacy regulations, or operational practices. The revised version will always be indicated by the &ldquo;Updated&rdquo; timestamp at the top of this document.
            </p>
            <p>
              If you have questions regarding our use of cookies or local storage caching mechanisms, please contact our engineering and compliance leads:
            </p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1 text-xs mt-3">
              <p className="text-white font-bold font-space">LogicForge Technical Compliance</p>
              <p className="text-gray-400">Email: <span className="text-neon-cyan">security@logicforge.co</span></p>
              <p className="text-gray-400">Website: <span className="text-gray-300">https://logicforge.co</span></p>
              <p className="text-gray-400">Hours: Monday – Friday, 9:00 AM – 6:00 PM PST</p>
            </div>
          </>
        )
      }
    ]
  }
];

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-bg-dark text-white font-sans">
      <LegalDocLayout
        badge="COOKIE POLICY & STORAGE"
        title="Cookie Policy"
        lastUpdated="Updated March 2026"
        description="This Cookie Policy explains how LogicForge Inc. utilizes cookies, browser local storage, and 3D WebGL asset caching to improve site performance, remember user settings, and ensure reliable security."
        sections={COOKIE_SECTIONS}
      />
    </div>
  );
}
