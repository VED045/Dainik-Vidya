import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, RefreshCw, AlertTriangle, Clock, BookOpen, Mail } from 'lucide-react'
import { getTop10, getTrends, getMeta, getMyPreferences } from '../services/api'
import Top10Card from '../components/Top10Card'
import ManuscriptArt from '../components/ManuscriptArt'
import { Top10Skeleton, TrendSkeleton } from '../components/Skeleton'
import { StatBar } from '../components/TrendChart'
import { useAuth, useLanguage } from '../App'

function timeAgo(isoString) {
  if (!isoString) return null
  let str = isoString.trim()
  if (!str.endsWith('Z') && !str.includes('+') && !/[+-]\d{2}:\d{2}$/.test(str)) str += 'Z'
  const date = new Date(str)
  if (isNaN(date.getTime())) return null
  const sec = Math.floor((Date.now() - date.getTime()) / 1000)
  if (sec < 60) return 'just now'
  if (sec < 3600) return `${Math.floor(sec / 60)} minutes ago`
  if (sec < 86400) return `${Math.floor(sec / 3600)} hours ago`
  return `${Math.floor(sec / 86400)} days ago`
}

export default function Dashboard() {
  const { auth } = useAuth()
  const { language } = useLanguage()
  const navigate = useNavigate()
  const [top10, setTop10] = useState(null)
  const [trends, setTrends] = useState(null)
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [topN, setTopN] = useState(10)

  const load = async () => {
    setLoading(true); setError(null)
    try {
      const results = await Promise.all([getTop10(language), getTrends(language), getMeta(), auth ? getMyPreferences().catch(() => null) : Promise.resolve(null)])
      setTop10(results[0]); setTrends(results[1]); setMeta(results[2])
      if (results[3]) setTopN(results[3].top_n_preference || 10)
    } catch {
      setError('The latest edition is temporarily unavailable. Please try again in a moment.')
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [language]) // eslint-disable-line react-hooks/exhaustive-deps
  const items = top10?.items?.slice(0, topN) || []
  const categories = Object.entries(trends?.category_counts || {}).filter(([,count]) => count > 0).sort(([,a],[,b]) => b-a).slice(0,8)
  const maxCat = Math.max(...categories.map(([,count]) => count),1)
  const lastUpdated = timeAgo(meta?.lastFetchedAt)
  return <div className="journal-home">
    <div className="edition-intro">
      <div><span className="eyebrow">The daily journal · AI-curated, thoughtfully ranked</span><h1>A world of stories. A little more clarity.</h1></div>
      <p><Clock size={12} />{loading ? 'Preparing your edition…' : lastUpdated ? `Updated ${lastUpdated}` : 'Your daily perspective'}</p>
    </div>
    {error && <div className="journal-error" role="alert"><AlertTriangle size={17} /><span>{error}</span><button onClick={load} className="btn-ghost"><RefreshCw size={13} />Retry</button></div>}
    <div className="journal-columns">
      <aside className="editor-picks" aria-label="Top stories">
        <div className="section-heading"><h2>Editor's Picks</h2><span>Top {topN}</span></div>
        {loading ? [0,1,2].map(i => <div key={i} className="mb-5"><div className="skeleton h-3 w-20 mb-3" /><div className="skeleton h-16" /></div>) :
          items.length ? items.map(item => {
            const content = <><span className="eyebrow">{String(item.rank).padStart(2,'0')} / {item.category}</span><h3>{item.ai_title || item.title}</h3><p>{item.source}{item.url ? ' · Read story ↗' : ''}</p></>
            return item.url ? <a key={item.rank} className="editor-pick" href={item.url} target="_blank" rel="noopener noreferrer">{content}</a> : <article key={item.rank} className="editor-pick">{content}</article>
          }) : <p className="text-xs text-slate-500 leading-relaxed">Your curated stories will appear here when the next edition is ready.</p>}
        <div className="ornament" aria-hidden="true">❧</div>
        <Link to="/news" className="story-link">Explore all news <ArrowRight size={13} /></Link>
      </aside>
      <section className="featured-journal">
        <div className="section-heading"><h2>Featured Journal</h2><span>Stories that matter</span></div>
        <div className="lead-engraving"><ManuscriptArt /><span className="engraving-caption">The pursuit of knowledge, in every edition</span></div>
        {loading ? <Top10Skeleton /> : items.length ? <>
          <Top10Card item={items[0]} featured />
          {items.slice(1).map(item => <Top10Card key={item.rank} item={item} />)}
        </> : <div className="journal-empty"><BookOpen size={28} className="mx-auto mb-4" /><h3>{error ? 'A brief pause in the journal' : 'A new edition awaits'}</h3><p>{error ? 'Please retry to reconnect to the latest stories.' : 'Use Fetch News in the account menu to bring the latest headlines into your journal.'}</p><Link to="/news" className="btn-ghost mt-4">Browse the news archive <ArrowRight size={13} /></Link></div>}
      </section>
      <aside className="journal-sidebar" aria-label="News insights">
        <section className="sidebar-section">
          <div className="section-heading"><h3>The World at a Glance</h3></div>
          <p>A closer look at today's coverage.</p>
          {loading ? <TrendSkeleton /> : categories.length ? <div className="flex flex-col gap-3">{categories.map(([cat,count]) => <StatBar key={cat} label={cat} value={count} max={maxCat} />)}</div> : <p>Coverage insights will appear with the latest edition.</p>}
        </section>
        <section className="sidebar-section">
          <div className="section-heading"><h3>In Conversation</h3></div>
          <p>Follow the topics shaping the day.</p>
          {loading ? <div className="skeleton h-20" /> : <div className="topic-list">{(trends?.trending_keywords || []).slice(0,15).map(({word,count}) => <button key={word} onClick={() => navigate(`/news?q=${encodeURIComponent(word)}`)}>{word}<span>{count}</span></button>)}</div>}
          {!loading && !trends?.trending_keywords?.length && <p>Trending topics will appear here.</p>}
          <Link to="/trends" className="story-link mt-5">Explore the insights <ArrowRight size={12} /></Link>
        </section>
        <section className="digest-note">
          <Mail size={22} className="mx-auto text-primary-500" />
          <span className="eyebrow block mt-3">A letter for the curious</span>
          <h3>Your morning,<br />a little wiser.</h3>
          <p>The day's essential stories, thoughtfully gathered. Delivered at 7 AM IST.</p>
          <Link to="/subscribe" className="btn-primary">Receive the daily digest <ArrowRight size={13} /></Link>
        </section>
      </aside>
    </div>
    {trends && <div className="edition-stats">{[
      ['Articles in the archive',meta?.totalArticles ?? trends.total_articles],['Categories covered',categories.length],['Most covered',trends.most_covered],['Topics in conversation',trends.trending_keywords?.length || 0]
    ].map(([label,value]) => <div key={label}><span>{label}</span><strong>{value ?? '—'}</strong></div>)}</div>}
    <div className="ornament" aria-hidden="true">— ❧ —</div>
  </div>
}
