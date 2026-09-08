import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/web/Navbar';
import Footer from '@/components/web/Footer';
import CustomCursor from '@/components/ui/CustomCursor';
import SmoothScrollProvider from '@/components/ui/SmoothScrollProvider';
import Chatbot from '@/components/web/Chatbot';
import RootPreloader from '@/components/ui/RootPreloader';

export const metadata: Metadata = {
  title: 'LogicForge | Premium Digital Production, Art & Game Development Agency',
  description:
    'LogicForge is an award-winning creative agency specializing in AAA Game Development, Character Design, 3D Asset Production, VR/AR, and High-Performance Web Development.',
  keywords: [
    'Art',
    'Animation',
    'Game Development',
    '3D Modeling',
    'VR/AR',
    'Web Development',
    'Next.js 15',
    'Three.js Portfolio',
    'LogicForge'
  ],
  metadataBase: new URL('https://logicforge.co'),
  openGraph: {
    title: 'LogicForge | Creative Digital Production Agency',
    description: 'Immersive 3D animations, custom game design, and premium WebGL architectures.',
    url: 'https://logicforge.co',
    siteName: 'LogicForge',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LogicForge Workspace'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LogicForge | Creative Digital Production Agency',
    description: 'Immersive 3D animations, custom game design, and premium WebGL architectures.'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&family=Sora:wght@100..800&family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-bg-dark text-foreground antialiased min-h-screen flex flex-col selection:bg-neon-purple/30 selection:text-white"
        suppressHydrationWarning
      >
        {/* Grain Noise Overlay for High-End Cinematic Aesthetics */}
        <div className="noise-overlay" />
        
        <CustomCursor />
        
        <SmoothScrollProvider>
          <RootPreloader>
            <Navbar />
            {/* Main content viewport wrapper */}
            <main className="flex-1 flex flex-col pt-20 md:pt-24">
              {children}
            </main>
            <Footer />
            <Chatbot />
          </RootPreloader>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
