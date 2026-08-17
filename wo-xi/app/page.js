'use client';

import { useCallback, useEffect, useState } from 'react';

const SECTIONS = {
  hot: { eyebrow: '实时观察', title: '当前热点', intro: '用多来源新闻呈现此刻最受关注、升温最快的事件。', label: '热度上升' },
  green: { eyebrow: '专题追踪', title: 'Green Finance', intro: '绿色金融、气候投融资与可持续商业的持续监测。', label: '绿色金融' }
};

function timeAgo(date) {
  const mins = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
  return mins < 60 ? `${mins} 分钟前` : mins < 1440 ? `${Math.floor(mins / 60)} 小时前` : `${Math.floor(mins / 1440)} 天前`;
}

export default function Home() {
  const [section, setSection] = useState('hot');
  const [items, setItems] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (kind, quiet = false) => {
    if (!quiet) setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/news?section=${kind}`);
      if (!response.ok) throw new Error('暂时无法连接新闻源');
      const data = await response.json();
      setItems(data.items); setUpdatedAt(data.updatedAt);
    } catch (e) { setError(e.message); } finally { if (!quiet) setLoading(false); }
  }, []);

  useEffect(() => { load(section); const id = setInterval(() => load(section, true), 30 * 60 * 1000); return () => clearInterval(id); }, [section, load]);
  const change = (next) => { setSection(next); setItems([]); };
  const current = SECTIONS[section];

  return <main>
    <header className="nav">
      <a className="brand" href="#top" aria-label="Clearview 首页"><span>◉</span> CLEARVIEW</a>
      <div className="status"><i /> 每 30 分钟更新 {updatedAt && `· ${new Date(updatedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`}</div>
    </header>
    <section className="hero" id="top">
      <p className="eyebrow">新闻不应有门槛</p>
      <h1>看见正在发生的事。</h1>
      <p className="lede">没有算法黑箱，没有冗余噪音。每条信息都附有来源，供你判断、比较与继续追溯。</p>
    </section>
    <nav className="tabs" aria-label="新闻分区">
      {Object.entries(SECTIONS).map(([key, value]) => <button key={key} className={section === key ? 'active' : ''} onClick={() => change(key)}>{key === 'hot' ? '01' : '02'}<span>{value.title}</span></button>)}
    </nav>
    <section className="content">
      <div className="section-head"><div><p className="eyebrow">{current.eyebrow}</p><h2>{current.title}</h2><p>{current.intro}</p></div><button className="refresh" onClick={() => load(section)}>↻ 刷新</button></div>
      <p className="method">排序依据：发布时效、同主题报道密度与来源覆盖。它是聚合排序，不代表事实判断或编辑立场。</p>
      {loading && <div className="loading">正在整理最新报道<span>...</span></div>}
      {error && <div className="error">{error}<button onClick={() => load(section)}>重试</button></div>}
      <div className="feed">
        {items.map((item, index) => <article className="story" key={item.url}>
          <div className="rank">{String(index + 1).padStart(2, '0')}</div>
          <div className="story-body"><div className="story-meta"><span className="pill">{current.label}</span><span>{timeAgo(item.publishedAt)}</span><span>·</span><span>{item.source}</span></div><h3><a href={item.url} target="_blank" rel="noreferrer">{item.title}</a></h3><p>{item.summary}</p><a className="source-link" href={item.url} target="_blank" rel="noreferrer">阅读原文 <b>↗</b></a></div>
        </article>)}
      </div>
      {!loading && !error && items.length === 0 && <div className="loading">暂未找到可展示的报道。</div>}
    </section>
    <footer><span>CLEARVIEW / OPEN NEWS INDEX</span><span>我们显示来源，不替你下结论。</span></footer>
  </main>;
}
