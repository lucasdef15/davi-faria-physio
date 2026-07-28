import { getStructuredData } from '@/lib/seo';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(getStructuredData(), {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'Content-Type': 'application/ld+json; charset=utf-8',
    },
  });
}
