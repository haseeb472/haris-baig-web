import fs from 'fs';
import path from 'path';
import {
  Service,
  Project,
  Blog,
  TeamMember,
  Testimonial,
  FAQ,
  SiteSettings,
  Lead,
  PageComponent,
  Page,
  HeaderNavLink,
  MegaMenuSubLink,
  MegaMenuColumn,
  HeaderSettings,
  FooterLink,
  FooterColumn,
  FooterSettings,
  DatabaseSchema,
  getDefaultHeader,
  getDefaultFooter
} from './cms-types';

export * from './cms-types';

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

export function getItemById<K extends keyof Omit<DatabaseSchema, 'settings' | 'header' | 'footer'>>(
  table: K,
  id: string
): DatabaseSchema[K][number] | undefined {
  const db = readDb();
  const list = db[table] as any[];
  return list.find((item) => item.id === id);
}

export function createItem<K extends keyof Omit<DatabaseSchema, 'settings' | 'newsletter' | 'header' | 'footer'>>(
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

export function updateItem<K extends keyof Omit<DatabaseSchema, 'settings' | 'header' | 'footer'>>(
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

export function deleteItem<K extends keyof Omit<DatabaseSchema, 'settings' | 'header' | 'footer'>>(
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
              { src: "/images/img5.png", alt: "Production asset 5" }
            ]
          }
        },
        {
          id: "home-services",
          type: "ServicesGrid",
          title: "Core Service Matrix",
          enabled: true,
          content: {
            badge: "Disciplines",
            title: "Our Engineering Specializations",
            description: "High-throughput development from single asset texturing to full-scale enterprise metaverse pipelines."
          }
        },
        {
          id: "home-projects",
          type: "FeaturedProjects",
          title: "Selected Case Studies",
          enabled: true,
          content: {
            badge: "Portfolio Highlights",
            title: "Engineered For Global Impact",
            description: "Real production deliverables deployed across gaming, corporate Web3, and industrial simulation."
          }
        },
        {
          id: "home-cta",
          type: "CallToActionBanner",
          title: "Bottom Action Banner",
          enabled: true,
          content: {
            title: "Ready to engineer the impossible?",
            description: "Speak with our technical leads regarding timeline, 3D pipelines, or enterprise engineering requirements.",
            buttonText: "Initiate Discovery Call",
            buttonLink: "/contact"
          }
        }
      ]
    },
    {
      id: "about",
      title: "About Us",
      slug: "/about",
      components: [
        {
          id: "about-hero",
          type: "AboutHero",
          title: "About Page Intro",
          enabled: true,
          content: {
            badge: "Behind LogicForge",
            title: "Pioneering the intersection of Art, Gaming & Web",
            description: "We are a boutique team of senior Unreal Engine artists, WebGL specialists, and full-stack engineers built for uncompromising brands."
          }
        }
      ]
    },
    {
      id: "services-page",
      title: "Services Catalog",
      slug: "/services",
      components: [
        {
          id: "services-hero",
          type: "ServicesCatalogHero",
          title: "Catalog Banner",
          enabled: true,
          content: {
            badge: "Production Capabilities",
            title: "Tailored creative services built to scale",
            description: "Browse our standard and custom pipeline offerings across game development, cinematic art, and high-performance web."
          }
        }
      ]
    },
    {
      id: "contact-page",
      title: "Contact & Discovery",
      slug: "/contact",
      components: [
        {
          id: "contact-hero",
          type: "ContactIntro",
          title: "Contact Page Hero",
          enabled: true,
          content: {
            badge: "Start Conversation",
            title: "Let's build something unforgettable",
            description: "Direct access to our senior engineering partners. Guaranteed response within 24 hours."
          }
        }
      ]
    }
  ];
}
