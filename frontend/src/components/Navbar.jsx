import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme, useAuth, useLanguage, useFilters } from '../App'
import { BookOpen, Sun, Moon, Menu, X, RefreshCw, LogOut, LogIn, Settings, Filter, User, ChevronDown, Bookmark, Mail, Search } from 'lucide-react'
import { fetchLatestNews, getNewsSources } from '../services/api'
import toast from 'react-hot-toast'

const links = [{ to: '/', label: 'The Daily Journal' }, { to: '/news', label: 'All News' }, { to: '/trends', label: 'Trends & Insights' }]
export default function Navbar() {
  const { dark, toggle } = useTheme()
  const { auth, setAuth } = useAuth()
  const { language, setLanguage } = useLanguage()
  const { dateFilter, setDateFilter, specificDay, setSpecificDay, sourceFilter, setSourceFilter, category } = useFilters()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [running, setRunning] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [sources, setSources] = useState([])
  const navRef = useRef(null)
  useEffect(() => { getNewsSources().then(d => setSources(d.sources || [])).catch(() => {}) }, [])
  useEffect(() => {
    const close = e => {
      if ((e.type === 'keydown' && e.key === 'Escape') || (e.type === 'mousedown' && navRef.current && !navRef.current.contains(e.target))) {
        setFiltersOpen(false); setProfileOpen(false); setOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close) }
  }, [])
  const handleTrigger = async () => {
    setRunning(true)
    try { await fetchLatestNews(); toast.success('Fetching latest news! Check back in ~2 minutes.') }
    catch { toast.error('Could not reach the backend.') }
    finally { setTimeout(() => setRunning(false), 3500) }
  }
  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user'); setAuth(null); setProfileOpen(false); setOpen(false)
    toast.success('Logged out successfully')
  }
  const guardedNav = (action, path) => {
    if (auth) navigate(path)
    else { sessionStorage.setItem('redirectAfterLogin', action); toast('Please log in to continue', { icon: '🔒' }); navigate('/login') }
    setProfileOpen(false); setOpen(false)
  }
  const accountActions = <>
    {auth && <button onClick={() => guardedNav('preferences','/preferences')}><Settings size={14} />Preferences</button>}
    <button onClick={() => guardedNav('subscribe','/subscribe')}><Mail size={14} />Daily digest</button>
    <button onClick={handleTrigger} disabled={running}><RefreshCw size={14} className={running ? 'animate-spin' : ''} />{running ? 'Fetching…' : 'Fetch News'}</button>
    {auth ? <button onClick={handleLogout}><LogOut size={14} />Log out</button> : <button onClick={() => guardedNav('login','/login')}><LogIn size={14} />Log in / Create account</button>}
  </>
  const today = new Intl.DateTimeFormat('en-IN', { timeZone:'Asia/Kolkata', weekday:'long', day:'numeric', month:'long', year:'numeric' }).format(new Date())
  return <nav ref={navRef} className="journal-nav" aria-label="Main navigation">
    <a href="#main-content" className="skip-link">Skip to content</a>
    <div className="utility-bar"><span><BookOpen size={12} /><span className="hidden sm:inline">Independent sources. Intelligent perspective.</span><span className="sm:hidden">News, thoughtfully curated.</span></span><div className="utility-actions"><button onClick={toggle} aria-label={dark ? 'Switch to parchment theme' : 'Switch to evening theme'} title="Toggle theme">{dark ? <Sun size={12} /> : <Moon size={12} />}<span className="hidden sm:inline">{dark ? 'Day edition' : 'Evening edition'}</span></button><button onClick={() => guardedNav('login', auth ? '/preferences' : '/login')}>{auth ? 'My account' : 'Reader sign in'}</button></div></div>
    <div className="masthead">
      <div className="masthead-note">Knowledge is timeless.<br />Stay curious, every day.<span>Your daily perspective</span></div>
      <Link to="/" className="masthead-brand" aria-label="Dainik Vidya home"><span className="brand-emblem"><BookOpen size={23} strokeWidth={1} /></span><span className="brand-name">DAINIK VIDYA</span><span className="brand-hindi" lang="hi">दैनिक विद्या</span></Link>
      <div className="masthead-right"><Link to="/subscribe" className="btn-ghost text-xs"><Mail size={14} />The daily digest</Link></div>
    </div>
    <div className="edition-rule"><span>A journal for the curious</span><span>❧ &nbsp; {today} &nbsp; ❧</span><span>Daily news intelligence</span></div>
    <div className="navigation-row">
      <div className="navigation-links">{links.map(({to,label}) => <Link key={to} to={to} className={`nav-link ${pathname===to ? 'active' : ''}`} aria-current={pathname===to ? 'page' : undefined}>{label}</Link>)}<button onClick={() => guardedNav('bookmark','/bookmarks')} className={`nav-link ${pathname==='/bookmarks' ? 'active' : ''}`}><Bookmark size={13} />Saved Stories</button></div>
      <button className="mobile-toggle" onClick={() => setOpen(v => !v)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation">{open ? <X size={18} /> : <Menu size={18} />}Sections</button>
      <div className="nav-tools">
        <Link to="/news" className="btn-ghost" aria-label="Search the news" title="Search the news"><Search size={16} /></Link>
        <div className="relative">
          <button className="btn-ghost" onClick={() => { setFiltersOpen(v => !v); setProfileOpen(false) }} aria-label="Filter news" aria-expanded={filtersOpen} aria-controls="news-filters"><Filter size={15} /><span className="hidden sm:inline text-xs">Filters{sourceFilter || dateFilter!=='today' || category!=='all' ? ' •' : ''}</span><ChevronDown size={12} /></button>
          {filtersOpen && <div id="news-filters" className="nav-popover filter-popover">
            <label htmlFor="nav-date">Date range</label><select id="nav-date" value={dateFilter} onChange={e => { setDateFilter(e.target.value); setSpecificDay('') }}>
              <option value="today">Today</option><option value="3days">Last 3 days</option><option value="7days">Last 7 days</option>
            </select>
            {dateFilter === '7days' && <><label htmlFor="nav-day">Specific day</label><select id="nav-day" value={specificDay} onChange={e => setSpecificDay(e.target.value)}><option value="">All days</option>{Array.from({length:8},(_,i) => <option key={i} value={String(i)}>{i===0 ? 'Today' : i===1 ? 'Yesterday' : `${i} days ago`}</option>)}</select></>}
            <label htmlFor="nav-source">Source</label><select id="nav-source" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}><option value="">All sources</option>{sources.map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>}
        </div>
        <select value={language} onChange={e => setLanguage(e.target.value)} aria-label="News language"><option value="en">EN</option><option value="hi">HI</option><option value="mr">MR</option><option value="te">TE</option></select>
        <div className="relative"><button className="btn-ghost" onClick={() => { setProfileOpen(v => !v); setFiltersOpen(false) }} aria-label="Reader account menu" aria-expanded={profileOpen} aria-controls="reader-menu"><User size={16} /></button>{profileOpen && <div id="reader-menu" className="nav-popover account-popover">{accountActions}</div>}</div>
      </div>
    </div>
    {open && <div id="mobile-navigation" className="mobile-menu">{links.map(({to,label}) => <Link key={to} to={to} onClick={() => setOpen(false)} className="flex items-center">{label}</Link>)}<button className="flex items-center gap-2" onClick={() => guardedNav('bookmark','/bookmarks')}><Bookmark size={14} />Saved Stories</button><div className="mobile-account">{accountActions}</div></div>}
  </nav>
}
