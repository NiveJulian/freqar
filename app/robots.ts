import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout/', '/failure/', '/pending/', '/success/', '/api/'],
    },
    sitemap: 'https://freq.ar/sitemap.xml',
  };
}
