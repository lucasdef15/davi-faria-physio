import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = getLastModified();

  return [
    {
      changeFrequency: 'monthly',
      priority: 1,
      url: SITE_URL.toString(),
      ...(lastModified ? { lastModified } : {}),
    },
  ];
}

function getLastModified(): Date | undefined {
  const value = process.env.NEXT_PUBLIC_CONTENT_LAST_MODIFIED;

  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? undefined : date;
}
