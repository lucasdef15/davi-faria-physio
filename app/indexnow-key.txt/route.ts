export const dynamic = 'force-dynamic';

const INDEXNOW_KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/;

export function GET() {
  if (process.env.VERCEL_ENV !== 'production') {
    return new Response('IndexNow key not configured.', { status: 404 });
  }

  const key = process.env.INDEXNOW_KEY?.trim();

  if (!key || !INDEXNOW_KEY_PATTERN.test(key)) {
    return new Response('IndexNow key not configured.', {
      status: 404,
    });
  }

  return new Response(key, {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
