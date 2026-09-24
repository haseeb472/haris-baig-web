export * from './cms-types';
import fs from 'fs';
import path from 'path';

// --- DATA TYPES & INTERFACES ---

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

export interface FooterSettings {
  logo: string;
  aboutText: string;
  columns: {
    title: string;
    links: FooterLink[];
  }[];
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

const dbFilePath = path.join(process.cwd(), 'src/data/db.json');

// --- DATABASE FUNCTIONS ---

export function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(dbFilePath)) {
      throw new Error(`Database file not found at ${dbFilePath}`);
    }
    const fileContents = fs.readFileSync(dbFilePath, 'utf8');
    const db = JSON.parse(fileContents) as any;
    if (!db.pages) {
      db.pages = getDefaultPages();
      fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2), 'utf8');
    }
    if (!db.header) {
      db.header = getDefaultHeader();
    }
    if (!db.footer) {
      db.footer = getDefaultFooter();
    }
    return db as DatabaseSchema;
  } catch (error) {
    console.error('Error reading JSON CMS database:', error);
    // Fallback default structure
    return {
      services: [],
      projects: [],
      blogs: [],
      team: [],
      testimonials: [],
      faqs: [],
      settings: {
        siteName: "Fourth Pixel",
        logo: "/images/icons/brand_logo.svg",
        contactEmail: "hello@logicforge.co",
        contactPhone: "",
        address: "",
        socialLinks: {},
        aboutSummary: ""
      },
      header: getDefaultHeader(),
      footer: getDefaultFooter(),
      leads: [],
      newsletter: [],
      pages: getDefaultPages()
    };
  }
}

export function writeDb(data: DatabaseSchema): boolean {
  try {
    // Ensure data directory exists
    const dir = path.dirname(dbFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing JSON CMS database:', error);
    return false;
  }
}

// Generic CRUD helpers
export function getItems<K extends keyof DatabaseSchema>(table: K): DatabaseSchema[K] {
  const db = readDb();
  return db[table];
}

export function getItemBySlug<K extends 'services' | 'projects'>(
  table: K,
  slug: string
): DatabaseSchema[K][number] | undefined {
  const db = readDb();
  const list = db[table] as any[];
  return list.find((item) => item.slug === slug);
}

export function getItemById<K extends keyof Omit<DatabaseSchema, 'settings'>>(
  table: K,
  id: string
): DatabaseSchema[K][number] | undefined {
  const db = readDb();
  const list = db[table] as any[];
  return list.find((item) => item.id === id);
}

export function createItem<K extends keyof Omit<DatabaseSchema, 'settings' | 'newsletter'>>(
  table: K,
  item: Omit<DatabaseSchema[K][number], 'id'>
): DatabaseSchema[K][number] {
  const db = readDb();
  const list = db[table] as any[];
  
  const prefix = table.substring(0, 3).toLowerCase();
  const newId = `${prefix}-${Date.now()}`;
  
  const newItem = { id: newId, ...item };
  list.push(newItem);
  
  const ok = writeDb(db);
  if (!ok) throw new Error('Failed to persist new item to database');
  return newItem as any;
}

export function updateItem<K extends keyof Omit<DatabaseSchema, 'settings'>>(
  table: K,
  id: string,
  updatedData: Partial<DatabaseSchema[K][number]>
): DatabaseSchema[K][number] | undefined {
  const db = readDb();
  const list = db[table] as any[];
  const index = list.findIndex((item) => item.id === id);
  
  if (index === -1) return undefined;
  
  const updatedItem = { ...list[index], ...updatedData };
  list[index] = updatedItem;
  
  const ok = writeDb(db);
  if (!ok) throw new Error('Failed to persist updated item to database');
  return updatedItem;
}

export function deleteItem<K extends keyof Omit<DatabaseSchema, 'settings'>>(
  table: K,
  id: string
): boolean {
  const db = readDb();
  const list = db[table] as any[];
  const initialLength = list.length;
  
  db[table] = list.filter((item) => item.id !== id) as any;
  
  if (db[table].length === initialLength) return false;
  
  const ok = writeDb(db);
  if (!ok) throw new Error('Failed to persist delete operation to database');
  return true;
}

export function updateSettings(settings: Partial<SiteSettings>): SiteSettings {
  const db = readDb();
  db.settings = { ...db.settings, ...settings };
  writeDb(db);
  return db.settings;
}

export function updateHeader(header: Partial<HeaderSettings>): HeaderSettings {
  const db = readDb();
  db.header = { ...getDefaultHeader(), ...(db.header || {}), ...header };
  writeDb(db);
  return db.header;
}

export function updateFooter(footer: Partial<FooterSettings>): FooterSettings {
  const db = readDb();
  db.footer = { ...getDefaultFooter(), ...(db.footer || {}), ...footer };
  writeDb(db);
  return db.footer;
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

export function addNewsletterEmail(email: string): boolean {
  const db = readDb();
  if (db.newsletter.some((n) => n.email.toLowerCase() === email.toLowerCase())) {
    return false; // Already subscribed
  }
  db.newsletter.push({ email, date: new Date().toISOString() });
  writeDb(db);
  return true;
}

export function getDefaultPages(): Page[] {
  return [
    {
      id: "home",
      title: "Home Page",
      slug: "/",
      components: [
        {
          id: "home-hero",
          type: "HeroSplitReveal",
          title: "Hero Split Reveal Banner",
          enabled: true,
          content: {
            tagline: "LOGICFORGE PRODUCTION",
            heading: "We shape immersive realities",
            subheading: "LogicForge is a next-generation production studio bridging high-fidelity 3D assets, Unreal Engine architectures, and premium frontend WebGL technologies.",
            ctaText1: "Explore Work",
            ctaText2: "Get Quote",
            images: [
              { src: "/images/img1.png", alt: "Production asset 1" },
              { src: "/images/img2.jpg", alt: "Production asset 2" },
              { src: "/images/img3.png", alt: "Production asset 3" },
              { src: "/images/img4.jpg", alt: "Production asset 4" },
              { src: "/images/img5.jpg", alt: "Production asset 5" },
              { src: "/images/img6.png", alt: "Production asset 6" },
              { src: "/images/img7.jpg", alt: "Production asset 7" },
              { src: "/images/img8.png", alt: "Production asset 8" },
              { src: "/images/img9.png", alt: "Production asset 9" },
              { src: "/images/img10.png", alt: "Production asset 10" },
              { src: "/images/img11.png", alt: "Production asset 11" },
              { src: "/images/img12.png", alt: "Production asset 12" },
              { src: "/images/img13.jpg", alt: "Production asset 13" },
              { src: "/images/img14.jpg", alt: "Production asset 14" },
              { src: "/images/img15.jpg", alt: "Production asset 15" },
              { src: "/images/img16.jpg", alt: "Production asset 16" },
              { src: "/images/img17.jpg", alt: "Production asset 17" },
              { src: "/images/img18.jpg", alt: "Production asset 18" },
              { src: "/images/img19.png", alt: "Production asset 19" },
              { src: "/images/img20.png", alt: "Production asset 20" }
            ]
          }
        },
        {
          id: "home-stats",
          type: "StatsBlock",
          title: "Stats Indicators Grid",
          enabled: true,
          content: {}
        },
        {
          id: "home-gallery",
          type: "HeroGallery",
          title: "Flipping Gallery Cards",
          enabled: true,
          content: {
            subtitle: "CREATIVE VAULT",
            heading: "Flipping Exhibition Gallery",
            cards: [
              { front: '/images/img9.png', back: '/images/img10.png', width: 'w-[80vw] sm:w-[460px]', height: 'h-[380px] sm:h-[550px]', num: '(001)' },
              { front: '/images/img11.png', back: '/images/img12.png', width: 'w-[85vw] sm:w-[680px]', height: 'h-[320px] sm:h-[400px]', num: '(002)' },
              { front: '/images/img13.jpg', back: '/images/img14.jpg', width: 'w-[80vw] sm:w-[460px]', height: 'h-[380px] sm:h-[550px]', num: '(003)' },
              { front: '/images/img15.jpg', back: '/images/img16.jpg', width: 'w-[85vw] sm:w-[680px]', height: 'h-[320px] sm:h-[400px]', num: '(004)' },
              { front: '/images/img17.jpg', back: '/images/img18.jpg', width: 'w-[80vw] sm:w-[460px]', height: 'h-[380px] sm:h-[550px]', num: '(005)' }
            ]
          }
        },
        {
          id: "home-services",
          type: "ServicesGrid",
          title: "Capabilities Grid",
          enabled: true,
          content: {
            subtitle: "OUR CAPABILITIES",
            heading: "We forge digital boundaries"
          }
        },
        {
          id: "home-facts",
          type: "KeyFactsReveal",
          title: "Studio Key Facts Column Reveal",
          enabled: true,
          content: {
            subtitle: "WHO WE ARE",
            heading: "Studio Metrics & Showcase",
            layer1Title: "WHO WE ARE",
            layer3Title: "Key Metrics / Showcase"
          }
        },
        {
          id: "home-marquee",
          type: "TechMarquee",
          title: "Tech Stack Infinite Marquee",
          enabled: true,
          content: {}
        },
        {
          id: "home-portfolio",
          type: "HorizontalGallery",
          title: "Portfolio Timeline",
          enabled: true,
          content: {
            subtitle: "CREATIVE WORKS",
            heading: "Featured Projects Showcase",
            projects: [
              { id: "prj-1", title: "Chronos Zero: Cinematic Trailer", category: "Art & Animation", year: "2025", client: "APEX GAMES GROUP", description: "A high-fidelity cinematic game trailer showcasing custom environment art and motion-capture animations.", image: "/images/img9.png" },
              { id: "prj-2", title: "Neo-Tokyo 2099", category: "Game Development", year: "2028", client: "VORTEX STUDIOS", description: "An open-world multiplayer action game set in a futuristic cybernetic city. Custom shaders, dynamic lighting, and fully rigged characters.", image: "/images/img11.png" },
              { id: "prj-3", title: "Alpha-VR Showroom", category: "AR-VR", year: "2025", client: "APEX MOTORS CORP", description: "Virtual reality interactive showroom built for high-end luxury vehicle visualization, showcasing PBR texturing and custom lighting.", image: "/images/img13.jpg" }
            ]
          }
        },
        {
          id: "home-sectors",
          type: "IndustriesServed",
          title: "Target Industries Grid",
          enabled: true,
          content: {
            subtitle: "TARGET SECTORS",
            heading: "Industries We Elevate",
            industries: [
              { name: 'Game Studio Pipelines', desc: 'AAA character retopology, rigged models, and custom VFX mapping.' },
              { name: 'Interactive Marketing', desc: 'Sleek WebGL marketing interfaces, gradient meshes, and game loops.' },
              { name: 'Virtual Architecture', desc: 'Bespoke high-polygon interior simulations and master plans.' },
              { name: 'Industrial AR/VR', desc: 'Metaverse twins and immersive training catalog experiences.' }
            ]
          }
        },

        {
          id: "home-testimonials",
          type: "CurvedCarousel3D",
          title: "3D Cylinder Testimonials",
          enabled: true,
          content: {
            subtitle: "TESTIMONIALS",
            heading: "What our co-production partners say",
            testimonials: [
              { quote: "LogicForge delivered unmatched environment models and animations for our upcoming action RPG. Their attention to topology, PBR mapping, and rigging saved us months of production time.", author: "Julian Thorne", role: "VP of Product", company: "Galactic Studios" },
              { quote: "The WebGL VR showroom developed by LogicForge took our digital product launch to a completely new dimension. Exceptional visual fidelity and flawless scroll performance.", author: "Aria Cheng", role: "Creative Lead", company: "Evo Car Group" }
            ]
          }
        },
        {
          id: "home-contact",
          type: "HomeContact",
          title: "Contact Portal Form",
          enabled: true,
          content: {
            subtitle: "TRANSMISSION PORTAL",
            heading: "Commence Digital Query",
            description: "Have an enterprise project or design concept in mind? Fill out the inquiry sheet or request a quote and our creative directors will respond within 24 hours to schedule a consultation.",
            email: "hello@logicforge.co",
            phone: "+1 (800) 555-LOGIC",
            locations: "San Francisco Head Office: 800 Space Park Ave, San Francisco, CA 94103\nTokyo Studio: 2-Chrome-11 Roppongi, Minato City, Tokyo 106-6108",
            labelName: "Your Name *",
            labelEmail: "Email Address *",
            labelPhone: "Phone Number",
            labelCategory: "Interest Category",
            labelDetails: "Project Details *",
            submitText: "SEND MESSAGE"
          }
        }
      ]
    },
    {
      id: "about",
      title: "About Us Page",
      slug: "/about",
      components: [
        {
          id: "about-hero",
          type: "AboutHero",
          title: "About Page Banner",
          enabled: true,
          content: {
            tagline: "OUR STORY",
            heading: "Architecting virtual futures",
            description: "At LogicForge, we merge high-end 3D artistry with sophisticated engine programming. We believe that digital experiences shouldn’t just function—they should immerse."
          }
        },
        {
          id: "about-values",
          type: "AboutValues",
          title: "Mission & Vision Values",
          enabled: true,
          content: {
            heading: "Core Values"
          }
        },
        {
          id: "about-reveal",
          type: "AboutReverseReveal",
          title: "Reverse Scroll Reveal Banner",
          enabled: true,
          content: {
            image: "/images/img6.png"
          }
        }
      ]
    },
    {
      id: "projects-page",
      title: "Projects Page",
      slug: "/projects",
      components: [
        {
          id: "projects-hero",
          type: "ProjectsHero",
          title: "Projects Page Banner",
          enabled: true,
          content: {
            tagline: "OUR WORK",
            heading: "Your Vision Realized.",
            description: "This page showcases a clean, professional layout designed to build trust through transparency and proven results. We shape immersive realities with highest creative fidelity."
          }
        }
      ]
    },
    {
      id: "contact",
      title: "Contact Page",
      slug: "/contact",
      components: [
        {
          id: "contact-hero",
          type: "ContactHero",
          title: "Contact Page Banner",
          enabled: true,
          content: {
            tagline: "CONNECT WITH US",
            heading: "Initiate Transmission",
            description: "Have a project query, technical requirement, or collaboration proposal? Fill out the portal below."
          }
        }
      ]
    },
    {
      id: "services",
      title: "Services Hub Page",
      slug: "/services",
      components: [
        {
          id: "services-hero",
          type: "ServicesHero",
          title: "Services Page Banner",
          enabled: true,
          content: {
            tagline: "PRODUCTION CAPABILITIES",
            heading: "End-to-End Digital Pipelines",
            description: "We provide premium art, animation, game dev, and WebGL frontend architectures."
          }
        }
      ]
    }
  ];
}
