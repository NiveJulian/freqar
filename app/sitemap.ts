import { MetadataRoute } from 'next';
import { fetchProducts } from '@/lib/api-service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://freq.ar';

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/legales`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  try {
    // Fetch a large page size (e.g., 500) to get all products for the sitemap.
    // If the API fails or is not accessible during build/runtime, it won't crash sitemap generation.
    const response = await fetchProducts(1, 500);
    const products = response?.info?.data || [];

    const productUrls = products.map((product: any) => ({
      url: `${baseUrl}/product/${product.id}`,
      lastModified: new Date(product.updatedAt || product.createdAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...routes, ...productUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return routes;
  }
}
