// --- DATA TYPES & INTERFACES (CLIENT SAFE - NO FS/NODE DEPENDENCIES) ---

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: 'art-animation' | 'asset-production' | 'character-dev' | 'environment-design' | 'arch-viz' | 'game-art' | 'vfx' | 'game-development' | 'ar-vr' | 'web-development';
  description: string;
  features: string[];
  benefits: string[];
  process: { step: string; title: string; desc: string; image?: string }[];
  faqs: { q: string; a: string }[];
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  client: string;
  year: string;
  image: string;
  video?: string;
  tags: string[];
  stats?: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  social: { linkedin?: string; twitter?: string };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  video?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SiteSettings {
  siteName: string;
  logo: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    github?: string;
  };
  aboutSummary: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: 'contact' | 'quote';
  serviceCategory?: string;
  message: string;
  resumeUrl?: string;
  date: string;
  status: 'new' | 'contacted' | 'resolved';
}

export interface PageComponent {
  id: string;
  type: string;
  title: string;
  enabled: boolean;
  content: Record<string, any>;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  components: PageComponent[];
}

export interface HeaderNavLink {
  name: string;
  href: string;
}

export interface MegaMenuSubLink {
  title: string;
  href: string;
}

export interface MegaMenuColumn {
  title: string;
  categoryHref: string;
  iconName?: string;
  links: MegaMenuSubLink[];
}

export interface HeaderSettings {
  logo: string;
  logoAlt: string;
  navLinks: HeaderNavLink[];
  ctaText: string;
  ctaLink: string;
  megaMenuEnabled?: boolean;
  megaMenuColumns?: MegaMenuColumn[];
  mobileCopyright?: string;
  mobileLocations?: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterSettings {
  logo: string;
  aboutText: string;
  columns: FooterColumn[];
  newsletterTitle: string;
  newsletterSubtitle: string;
  badges: string[];
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    github?: string;
  };
  copyrightText: string;
  legalLinks: FooterLink[];
}

export interface DatabaseSchema {
  services: Service[];
  projects: Project[];
  blogs: Blog[];
  team: TeamMember[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  settings: SiteSettings;
  header: HeaderSettings;
  footer: FooterSettings;
  leads: Lead[];
  newsletter: { email: string; date: string }[];
  pages: Page[];
}

export function getDefaultHeader(): HeaderSettings {
  return {
    logo: "/images/icons/brand_logo.svg",
    logoAlt: "Fourth Pixel",
    navLinks: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Services", href: "/services" },
      { name: "Case Studies", href: "/projects" },
      { name: "Contact", href: "/contact" }
    ],
    ctaText: "Request Quote",
    ctaLink: "/contact?tab=quote",
    megaMenuEnabled: true,
    megaMenuColumns: [
      {
        title: "Art & Animations",
        categoryHref: "/services/art-animation",
        iconName: "Palette",
        links: [
          { title: "Character Design", href: "/services/art-animation/character-design" },
          { title: "Concept Illustration", href: "/services/art-animation/concept-illustration" },
          { title: "Cinematic Trailers", href: "/services/art-animation/cinematic-trailers" },
          { title: "VFX & Simulation", href: "/services/art-animation/vfx-simulation" }
        ]
      },
      {
        title: "3D Production",
        categoryHref: "/services/game-development",
        iconName: "Gamepad2",
        links: [
          { title: "Asset Production", href: "/services/game-development/3d-asset-production" },
          { title: "Environment Modeling", href: "/services/game-development/environment-modeling" },
          { title: "Hard Surface Models", href: "/services/game-development/hard-surface" },
          { title: "Texturing & Shading", href: "/services/game-development/texturing-shading" }
        ]
      },
      {
        title: "Web Development",
        categoryHref: "/services/web-development",
        iconName: "Globe",
        links: [
          { title: "Custom Corporate", href: "/services/web-development/custom-corporate-development" },
          { title: "Three.js Interactive", href: "/services/web-development/threejs-interactive" },
          { title: "CMS Architectures", href: "/services/web-development/cms-architectures" },
          { title: "Speed Optimization", href: "/services/web-development/speed-optimization" }
        ]
      },
      {
        title: "AR/VR & Metaverse",
        categoryHref: "/services/ar-vr",
        iconName: "Smartphone",
        links: [
          { title: "VR Training Simulators", href: "/services/ar-vr/vr-training-simulators" },
          { title: "Virtual Showrooms", href: "/services/ar-vr/virtual-showrooms" },
          { title: "Spatial Catalogs", href: "/services/ar-vr/spatial-catalogs" },
          { title: "Metaverse Assets", href: "/services/ar-vr/metaverse-assets" }
        ]
      },
      {
        title: "Architectural Viz",
        categoryHref: "/services/arch-viz",
        iconName: "Landmark",
        links: [
          { title: "Real-Time Walkthroughs", href: "/services/arch-viz/real-time-walkthroughs" },
          { title: "Interior CGI Blueprints", href: "/services/arch-viz/interior-cgi-blueprints" },
          { title: "Exterior Renders", href: "/services/arch-viz/exterior-renders" },
          { title: "Urban Masterplans", href: "/services/arch-viz/urban-masterplans" }
        ]
      }
    ],
    mobileCopyright: "Fourth Pixel Inc. All rights reserved.",
    mobileLocations: "San Francisco • Tokyo • London"
  };
}

export function getDefaultFooter(): FooterSettings {
  return {
    logo: "/images/icons/brand_logo.svg",
    aboutText: "We blend high-end art design, gaming engines, and premium web architectures to create interactive digital experiences that scale globally.",
    columns: [
      {
        title: "Company",
        links: [
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" },
          { label: "Our Services", href: "/services" },
          { label: "Case Studies", href: "/projects" },
          { label: "FAQ Hub", href: "/faq" },
          { label: "Contact Hub", href: "/contact" }
        ]
      },
      {
        title: "Services",
        links: [
          { label: "Art & Animation", href: "/services/art-animation" },
          { label: "Game Development", href: "/services/game-development" },
          { label: "Web Development", href: "/services/web-development" },
          { label: "AR/VR & Metaverse", href: "/services/ar-vr" },
          { label: "Architectural Viz", href: "/services/arch-viz" }
        ]
      }
    ],
    newsletterTitle: "Subscribe",
    newsletterSubtitle: "Get the latest creative tech news, game development strategies, and interactive project updates.",
    badges: [
      "Clutch Rated 4.9★",
      "Google Certified Partner",
      "Awwwards Honorable Mention",
      "Upwork Top Rated Plus"
    ],
    contactInfo: {
      address: "800 Space Park Ave, San Francisco, CA 94103",
      phone: "+1 (800) 555-LOGIC",
      email: "hello@logicforge.co"
    },
    socialLinks: {
      facebook: "https://facebook.com/logicforge",
      twitter: "https://twitter.com/logicforge",
      linkedin: "https://linkedin.com/company/logicforge",
      instagram: "https://instagram.com/logicforge",
      github: "https://github.com/logicforge"
    },
    copyrightText: "Fourth Pixel Inc. All rights reserved.",
    legalLinks: [
      { label: "FAQ", href: "/faq" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" }
    ]
  };
}
