import { NextResponse } from 'next/server';

export async function GET(request) {
  const url = new URL(request.url);
  const requestedSection = url.searchParams.get('section');
  const sections = requestedSection === 'all'
    ? ['hot', 'green']
    : [requestedSection === 'green' ? 'green' : 'hot'];

  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const results = await Promise.all(sections.map(async (section) => {
    const newsUrl = new URL('/api/news', url.origin);
    newsUrl.searchParams.set('section', section);
    const response = await fetch(newsUrl, { cache: 'no-store' });
    return { section, refreshed: response.ok };
  }));

  const ok = results.every((result) => result.refreshed);

  return Response.json(
    { refreshed: ok, results, at: new Date().toISOString() },
    { status: ok ? 200 : 502 }
  );
}
