import { MetadataRoute } from 'next';
import { readDb } from '@/lib/cms';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://logicforge.co';
  const db = readDb();

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/about',
    '/faq',
    '/cookies',
    '/privacy',
    '/terms',
    '/services',
    '/projects',
    '/contact'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? (1.0 as const) : (0.8 as const)
  }));

  // 2. Service Category Routes
  const categoryRoutes = [
    'art-animation',
    'game-development',
    'web-development',
    'ar-vr',
    'arch-viz'
  ].map((cat) => ({
    url: `${baseUrl}/services/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }));

  // 3. Service Detail Routes
  const serviceRoutes = db.services.map((srv) => ({
    url: `${baseUrl}/services/${srv.category}/${srv.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6
  }));

  // 4. Project Case Study Routes
  const projectRoutes = db.projects.map((proj) => ({
    url: `${baseUrl}/projects/${proj.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6
  }));

  return [...staticRoutes, ...categoryRoutes, ...serviceRoutes, ...projectRoutes];
}
