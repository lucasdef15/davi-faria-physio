import type { MetadataRoute } from 'next';

import { getContentLastModified, isPreviewDeployment, SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  if (isPreviewDeployment()) {
    return [];
  }

  const lastModified = getContentLastModified(process.env.NEXT_PUBLIC_CONTENT_LAST_MODIFIED);

  return [
    {
      changeFrequency: 'monthly',
      priority: 1,
      url: SITE_URL.toString(),
      ...(lastModified ? { lastModified } : {}),
    },
  ];
}
