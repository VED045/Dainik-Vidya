# Dainik Vidya · Daily News Intelligence

<p align="center">
  <img src="frontend/public/favicon.svg" width="76" alt="Dainik Vidya emblem: an illuminated open journal" />
</p>

<p align="center">
  <strong>Read the day with more clarity.</strong><br />
  A calm, AI-assisted news journal that gathers reporting, removes repetition, and helps readers understand the conversations shaping the day.
</p>

<p align="center">
  <a href="#quick-start">Quick start</a> ·
  <a href="#how-it-works">How it works</a> ·
  <a href="#api-reference">API reference</a> ·
  <a href="#deployment">Deployment</a>
</p>

![Dainik Vidya interface](frontend/src/assets/hero.png)

> **Read original reporting.** Dainik Vidya is a discovery and synthesis tool. Every story links back to its source; use that source for the complete report and context.

## Why Dainik Vidya

The modern news feed asks readers to sift through repeated headlines, noisy notifications, and disconnected updates. Dainik Vidya turns that stream into an editorial daily edition:

| For readers | In practice |
| --- | --- |
| **A considered daily brief** | A curated Top 10, story context, topic tags, and source links. |
| **Useful perspective** | Category coverage, trending keywords, an AI overview, and seven-day history. |
| **A personal reading space** | Sign in, set topics/language, save stories, and get a personalised feed. |
| **A calmer interface** | Parchment typography, high contrast, responsive layouts, and a warm evening edition. |

## Product features

- **Hybrid news intake** from RSS feeds, full-page content previews, and NewsAPI.
- **Duplicate control** with URL hashing and title-similarity checks.
- **AI enrichment** for a ranked set of new stories: concise titles, summaries, keywords, categories, and importance scores.
- **Top 10 and trend analytics** created per day and language.
- **Filters and search** by date, source, category, topic, and language: English, Hindi, Marathi, and Telugu.
- **Reader accounts** using JWT authentication, with bookmarks, preferences, and email-digest controls.
- **Responsive editorial UI** built for desktop and mobile, with reduced-motion support.

## How it works

~~~mermaid
flowchart LR
  A[RSS feeds] --> D[Ingestion]
  B[NewsAPI] --> D
  D --> E[URL + title deduplication]
  E --> F[Category ranking & sports cap]
  F --> G[Gemini enrichment]
  G --> H[(MongoDB Atlas)]
  H --> I[Top 10 + trends]
  I --> J[FastAPI]
  J --> K[React journal]
  I --> L[Optional SMTP digest]
~~~

### Daily pipeline

1. **Collect** articles from RSS feeds and NewsAPI.
2. **Store** them with a unique URL hash. A MongoDB TTL index removes news records after seven days.
3. **Deduplicate** recent articles by title similarity.
4. **Rank** stories by category, recency, and importance; sports coverage is capped so it cannot dominate the edition.
5. **Enrich** only the highest-priority new stories with Gemini to control cost and rate limits.
6. **Publish** the daily Top 10, trends, metadata, and optional email digest.

The built-in scheduler targets **7:00 AM IST** and **2:00 PM IST** by default. Readers can also ask for a manual refresh in the app.

> [!IMPORTANT]
> The scheduler runs inside FastAPI. A sleeping free-tier Render service cannot execute its in-process scheduled jobs. Use an always-on API or external job trigger for dependable timed editions.

## Architecture

~~~
┌─────────────────────────────────────────────────────────────────┐
│                         Reader's browser                          │
│  React 19 · Vite · Tailwind · React Router · Recharts · Lucide  │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS / JSON
┌───────────────────────────────▼─────────────────────────────────┐
│                         FastAPI application                       │
│ Auth · News · Search · Bookmarks · Preferences · Trends · Jobs  │
└───────────────┬───────────────────────────────┬─────────────────┘
                │                               │
        ┌───────▼────────┐              ┌───────▼────────────┐
        │ MongoDB Atlas  │              │ Feeds · NewsAPI ·  │
        │ articles/users │              │ Gemini · SMTP      │
        └────────────────┘              └────────────────────┘
~~~

### Repository guide

~~~
.
├── backend/
│   ├── main.py                 # App lifespan, health, pipeline trigger routes
│   ├── database.py             # Motor client, connection checks, database indexes
│   ├── routes/                 # Auth, news, search, bookmarks, trends, preferences
│   ├── services/               # Fetching, AI, curation, email, pipeline orchestration
│   ├── scheduler/jobs.py       # 7 AM + 2 PM IST APScheduler jobs
│   └── .env.example            # Backend environment-variable template
├── frontend/
│   ├── public/favicon.svg      # Dainik Vidya browser icon
│   ├── src/components/         # Editorial cards, charts, navigation, lamp
│   ├── src/pages/              # Journal, feed, trends, auth, preferences
│   └── src/services/api.js     # Axios API client and bearer-token handling
└── render.yaml                 # Render backend service definition
~~~

## Quick start

### Requirements

- Python **3.10+**
- Node.js **18+**
- MongoDB locally or a MongoDB Atlas deployment
- Gemini and NewsAPI credentials for the complete ingestion workflow

### 1. Run the API

~~~powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
# Fill in backend/.env — never commit it.
uvicorn main:app --reload --port 8000
~~~

Explore the API interactively at <http://localhost:8000/docs>.

### 2. Run the journal

~~~powershell
cd frontend
npm install
# Create .env.local with VITE_API_URL=http://localhost:8000 if required.
npm run dev
~~~

Open the local address Vite prints, normally <http://localhost:5173>.

### 3. Create the first edition

~~~powershell
Invoke-RestMethod -Method Post http://localhost:8000/fetch-news
~~~

The API queues work in the application process and returns immediately. Follow the backend terminal for the pipeline summary.

## Environment variables

Create <code>backend/.env</code> from <code>backend/.env.example</code>.

| Variable | Required | Purpose |
| --- | :---: | --- |
| <code>MONGODB_URI</code> | Yes | MongoDB connection string; use a URL-encoded Atlas URI in production. |
| <code>GEMINI_API_KEY</code> | For AI | Gemini credentials for article enrichment. |
| <code>GEMINI_MODEL</code> | No | Defaults to Gemini 2.5 Flash. |
| <code>NEWS_API_KEY</code> | For NewsAPI | Enables NewsAPI alongside RSS sources. |
| <code>JWT_SECRET</code> | Yes in production | Long, unique secret used to sign reader tokens. |
| <code>FRONTEND_URL</code> | Yes in production | Allowed deployed frontend origin for CORS. |
| <code>SMTP_HOST</code>, <code>SMTP_PORT</code> | For email | SMTP host and port. |
| <code>SMTP_USER</code>, <code>SMTP_PASS</code> | For email | SMTP credentials; use an app password for Gmail. |
| <code>FROM_EMAIL</code> | For email | Visible sender for the digest. |
| <code>SCHEDULER_HOUR</code>, <code>SCHEDULER_MINUTE</code> | No | Morning IST schedule; defaults to 07:00. |
| <code>SCHEDULER_HOUR_2</code>, <code>SCHEDULER_MINUTE_2</code> | No | Afternoon IST schedule; defaults to 14:00. |
| <code>MAX_SCRAPER_ARTICLES</code> | No | RSS article limit per run; defaults to 100. |
| <code>MAX_NEWS_API_ARTICLES</code> | No | NewsAPI limit per run; defaults to 50. |
| <code>MAX_AI_ARTICLES</code> | No | Highest-ranked new stories sent to AI; defaults to 15. |
| <code>GEMINI_RPM</code> | No | Gemini requests/minute; defaults to 12. |

Create <code>frontend/.env.local</code> for local development:

~~~dotenv
VITE_API_URL=http://localhost:8000
~~~

> [!CAUTION]
> Never put database URIs, SMTP credentials, Gemini/NewsAPI keys, or the JWT secret in a Vite environment variable. Any variable beginning with <code>VITE_</code> is exposed to the browser bundle.

## API reference

All endpoints return JSON. JWT-protected routes require an <code>Authorization: Bearer &lt;access_token&gt;</code> header.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| <code>GET</code> | <code>/health</code> | Public | Deployment health check. |
| <code>POST</code> | <code>/auth/signup</code> | Public | Create an account and receive a JWT. |
| <code>POST</code> | <code>/auth/login</code> | Public | Sign in and receive a JWT. |
| <code>GET</code> | <code>/news</code> | Public | Paginated feed with category, topic, source, date, and language filters. |
| <code>GET</code> | <code>/news/{article_id}</code> | Public | Get one stored article. |
| <code>GET</code> | <code>/news/sources</code> | Public | List available sources. |
| <code>GET</code> | <code>/news/categories/counts</code> | Public | Return category counts for a date range/language. |
| <code>GET</code> | <code>/top10?language=en</code> | Public | Return the latest AI-curated daily Top 10. |
| <code>GET</code> | <code>/trends?language=en</code> | Public | Return topics, themes, counts, and daily overview. |
| <code>GET</code> | <code>/trends/history?days=7</code> | Public | Return recent trend snapshots. |
| <code>GET</code> | <code>/search?q=climate</code> | Public | Search stored titles, summaries, keywords, and sources. |
| <code>GET</code> | <code>/meta</code> | Public | Show last pipeline run and collection totals. |
| <code>POST</code> | <code>/bookmark</code> | JWT | Save an article for the current reader. |
| <code>GET</code> | <code>/bookmark</code> or <code>/bookmarks</code> | JWT | List the current reader’s saved stories. |
| <code>DELETE</code> | <code>/bookmark/{bookmark_id}</code> | JWT | Remove an owned bookmark. |
| <code>DELETE</code> | <code>/bookmark/article/{article_id}</code> | JWT | Remove an owned bookmark by article ID. |
| <code>GET/PUT</code> | <code>/me/preferences</code> | JWT | Read or update reading preferences. |
| <code>GET</code> | <code>/me/feed</code> | JWT | Return a personalised news feed. |
| <code>POST</code> | <code>/me/subscribe</code> | JWT | Enable the current reader’s digest. |
| <code>POST</code> | <code>/me/unsubscribe</code> | JWT | Disable the current reader’s digest. |
| <code>POST</code> | <code>/fetch-news</code> | Public* | Start ingestion and curation. |
| <code>GET</code> | <code>/pipeline/status</code> | Public* | Inspect stored article/processing counts. |

*Before production, protect operational endpoints such as <code>/fetch-news</code>, <code>/trigger-pipeline</code>, and <code>/pipeline/status</code> with authentication or a scheduler-only secret.

<details>
<summary><strong>Example: filter the feed</strong></summary>

~~~http
GET /news?category=technology&language=en&date_from=2026-10-07&date_to=2026-10-08&page=1&limit=10
~~~
</details>

<details>
<summary><strong>Example: log in and bookmark a story</strong></summary>

~~~http
POST /auth/login
Content-Type: application/json

{"email":"reader@example.com","password":"your-password"}
~~~

~~~http
POST /bookmark
Authorization: Bearer <access_token>
Content-Type: application/json

{"articleId":"<mongo-object-id>"}
~~~
</details>

## Deployment

Current production topology:

~~~
Vercel (React frontend) ──HTTPS──> Render (FastAPI + scheduler) ──> MongoDB Atlas
~~~

### Vercel: frontend

1. Import the repository and select **frontend** as the root directory.
2. Add <code>VITE_API_URL=https://your-api.onrender.com</code>.
3. Deploy. Vite includes <code>public/favicon.svg</code> automatically.

### Render: backend

This repository includes [render.yaml](render.yaml). It installs backend requirements, starts Uvicorn, and exposes <code>/health</code> as the health check.

Set all secrets in Render’s environment dashboard. In MongoDB Atlas, allow the service network to connect, copy the current Driver connection string exactly, and URL-encode special characters in database credentials.

### Free-tier sleep behaviour

Render’s free web services may sleep after inactivity. The Vercel frontend remains available, but the first API visitor can experience a cold start. More importantly, an in-process scheduler does not run while the API is asleep.

For reliable twice-daily editions, choose one of these options:

1. Use an always-on Render instance.
2. Use an external scheduler/worker to call a protected pipeline endpoint.
3. Move lengthy ingestion to a dedicated job platform while keeping the reader-facing API serverless or always-on.

## Security checklist

- [ ] Set a strong, unique <code>JWT_SECRET</code> in production.
- [ ] Keep <code>backend/.env</code> and <code>frontend/.env.local</code> out of Git.
- [ ] Store credentials only in Vercel/Render environment settings.
- [ ] Use a least-privilege MongoDB user and restricted Atlas network access.
- [ ] Protect manual pipeline and status endpoints before public launch.
- [ ] Keep <code>FRONTEND_URL</code> aligned with the exact deployed Vercel origin.
- [ ] Use SMTP app passwords rather than mailbox passwords.

## Commands

| Location | Command | Purpose |
| --- | --- | --- |
| frontend | <code>npm run dev</code> | Start the Vite development server. |
| frontend | <code>npm run build</code> | Produce the production frontend bundle. |
| frontend | <code>npm run lint</code> | Run ESLint. |
| backend | <code>uvicorn main:app --reload --port 8000</code> | Run FastAPI locally. |

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Visualisation | Recharts |
| Icons | Lucide React + custom SVG favicon |
| API | Python, FastAPI, Pydantic |
| Database | MongoDB Atlas via Motor/PyMongo |
| Collection | feedparser, Requests, BeautifulSoup, lxml, NewsAPI |
| AI | Google Gemini, with pipeline provider/fallback support |
| Scheduling | APScheduler in Asia/Kolkata timezone |
| Email | SMTP via Python smtplib |
| Hosting | Vercel frontend + Render backend |

---

<p align="center">
  <strong>DAINIK VIDYA · दैनिक विद्या</strong><br />
  Many voices. A considered perspective.
</p>
