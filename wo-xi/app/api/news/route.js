import { XMLParser } from 'fast-xml-parser';

const FEEDS = {
  hot: 'https://news.google.com/rss?hl=zh-CN&gl=CN&ceid=CN:zh-Hans',
  green: 'https://news.google.com/rss/search?q=%22green+finance%22+OR+%E7%BB%BF%E8%89%B2%E9%87%91%E8%9E%8D+OR+%E6%B0%94%E5%80%99%E9%87%91%E8%9E%8D&hl=zh-CN&gl=CN&ceid=CN:zh-Hans'
};

const strip = (text = '') => text.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const getSource = (item) => {
  if (typeof item.source === 'string') return strip(item.source);
  return item.source?.['#text'] || item.source?.['@_url']?.replace(/^https?:\/\//, '').split('/')[0] || '原始报道';
};

export async function GET(request) {
  const section = new URL(request.url).searchParams.get('section') === 'green' ? 'green' : 'hot';
  try {
    const rss = await fetch(FEEDS[section], { next: { revalidate: 1800 }, headers: { 'User-Agent': 'ClearviewNews/1.0' } });
    if (!rss.ok) throw new Error(`新闻源返回 ${rss.status}`);
    const parser = new XMLParser({ ignoreAttributes: false });
    const data = parser.parse(await rss.text());
    const items = (data?.rss?.channel?.item || []).slice(0, 18).map((item) => ({
      title: strip(item.title), url: item.link, source: getSource(item),
      publishedAt: item.pubDate || new Date().toISOString(),
      summary: strip(item.description).replace(/\s*-\s*[^-]+$/, '') || '点击查看原始报道与完整上下文。'
    }));
    return Response.json({ items, updatedAt: new Date().toISOString(), section }, { headers: { 'Cache-Control': 's-maxage=1800, stale-while-revalidate=300' } });
  } catch (error) {
    return Response.json({ error: '新闻源暂不可用，请稍后重试。' }, { status: 502 });
  }
}
