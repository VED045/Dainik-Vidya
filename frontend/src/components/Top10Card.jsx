import { ArrowUpRight, TrendingUp } from 'lucide-react'
export default function Top10Card({ item, featured = false }) {
  const content = <>
    <div className="story-meta"><span className="story-category">{item.category || 'Daily dispatch'}</span><span>{item.source}</span><span className="story-number">{String(item.rank || 1).padStart(2, '0')}</span></div>
    <h2>{item.ai_title || item.title}</h2>
    {item.ai_title && item.title && item.ai_title !== item.title && <p className="original-title">Original: {item.title}</p>}
    <p className={featured ? 'story-summary drop-cap' : 'story-summary'}>{item.summary}</p>
    {item.importance_reason && <div className="story-context"><TrendingUp size={14} /><p>{item.importance_reason}</p></div>}
    {item.keywords?.length > 0 && <div className="story-keywords">{item.keywords.map(kw => <span key={kw}>#{kw}</span>)}</div>}
    <div className={`story-link ${item.url ? 'read-button' : ''}`}>{item.url ? <>Read the full story <ArrowUpRight size={14} /></> : 'Source link unavailable'}</div>
  </>
  const className = `editorial-story ${featured ? 'featured-story' : ''}`
  return item.url
    ? <a href={item.url} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>
    : <article className={className}>{content}</article>
}
