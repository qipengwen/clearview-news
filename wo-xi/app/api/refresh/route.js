import { NextResponse } from 'next/server';

// Vercel Cron calls this route twice per hour. It requests the news endpoint so
// the latest RSS response is generated before a reader opens the site.
export async function GET(request) {
  const url = new URL(request.url);
  const section = url.searchParams.get('section') === 'green' ? 'green' : 'hot';
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const newsUrl = new URL('/api/news', url.origin);
  newsUrl.searchParams.set('section', section);
  const response = await fetch(newsUrl, { cache: 'no-store' });
  return Response.json({ refreshed: response.ok, section, at: new Date().toISOString() }, { status: response.ok ? 200 : 502 });
}
