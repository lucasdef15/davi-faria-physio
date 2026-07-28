import type { MetadataRoute } from 'next';

import { isPreviewDeployment, SITE_URL } from '@/lib/site';

const ALLOW_OPENAI_TRAINING = false;

export default function robots(): MetadataRoute.Robots {
  if (isPreviewDeployment()) {
    return {
      rules: {
        disallow: '/',
        userAgent: '*',
      },
    };
  }

  const rules: MetadataRoute.Robots['rules'] = [
    {
      allow: '/',
      userAgent: '*',
    },
    {
      allow: '/',
      userAgent: 'OAI-SearchBot',
    },
    {
      allow: '/',
      userAgent: 'ChatGPT-User',
    },
    ALLOW_OPENAI_TRAINING
      ? {
          allow: '/',
          userAgent: 'GPTBot',
        }
      : {
          disallow: '/',
          userAgent: 'GPTBot',
        },
  ];

  return {
    host: SITE_URL.origin,
    rules,
    sitemap: new URL('/sitemap.xml', SITE_URL).toString(),
  };
}
