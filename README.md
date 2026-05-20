# Affiliate Engine

Affiliate marketing SaaS — AI-powered market scan, trend analysis, domain suggestions, content generation.

**Status:** Full-stack reconstruction from Replit monorepo. 100% local, no dependencies on Replit services.

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Node.js 20+, TypeScript, Express 5, better-sqlite3, OpenAI SDK v4 |
| **Frontend** | React 19, TypeScript, Vite 5, Tailwind CSS v4, shadcn/ui, wouter router |
| **Database** | SQLite (better-sqlite3) |
| **Auth** | JWT (optional, simple) |
| **Ports** | Backend: 3000, Frontend: 5173 |

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/apdejtcz/affiliate-engine.git
cd affiliate-engine
npm run install:all
```

### 2. Configure Environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
JWT_SECRET=change_me_in_production
DATABASE_URL=./db/app.sqlite
MOCK_MODE=false
OPENAI_API_KEY=sk-...  # Required for AI features
WORDPRESS_URL=https://yoursite.com  # Optional
WORDPRESS_USER=admin  # Optional
WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx  # Optional
MAKE_WEBHOOK_URL=https://hook.eu2.make.com/xxxxx  # Optional
```

### 3. Initialize Database

```bash
npm run migrate    # Create all tables
npm run seed       # Insert demo data (optional)
```

### 4. Start Development

```bash
npm run dev
```

This runs both backend and frontend concurrently.

## Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:5173 | React UI |
| **Backend API** | http://localhost:3000/api | REST API |
| **Health Check** | http://localhost:3000/api/healthz | API status |

## Features

### Deep Scan (4-Phase Wizard)
1. **Markets Scan** — Analyze global markets, get recommendations
2. **Market Trends** — Extract trending topics per market
3. **Trend Deep Dive** — Detailed analysis per trend
4. **Domain Generation** — Get domain suggestions + pricing

### Domain Portfolio
- Track idea/purchased/active domains
- SEO setup generation
- Legal compliance checklist
- Affiliate strategy builder
- Content generation with AI
- WordPress publishing

### Integrations (15 services)
- **SEO:** DataForSEO, Google GSC, Google GA4, Cloudflare
- **Domains:** Namecheap
- **Affiliate:** Awin, CJ, Impact, ClickBank, Amazon Associates
- **Email:** ConvertKit
- **Publishing:** WordPress, Make.com
- **Monitoring:** Uptime Robot
- **Database:** Supabase

### AI Pipeline Agent
- 6-step affiliate factory automation
- Trend radar → Market scan → Top markets → Domains → Content → Compliance
- Configurable financial limits (≤$10/year per site)
- System prompt editor with version control

## Hybrid Mode (Offline-First)

The app works **100% offline** with automatic fallback to mock data:

| Scenario | Behavior |
|----------|----------|
| **OPENAI_API_KEY set + internet** | Real AI responses |
| **MOCK_MODE=true** | Always use mock JSON from `/backend/mocks/` |
| **No internet / API timeout** | Auto-fallback to mock (≤3s timeout) |

### Test Offline Mode

```bash
# Option 1: Set MOCK_MODE in backend/.env
MOCK_MODE=true

# Option 2: Disconnect WiFi and refresh UI
# All pages still work with demo data
```

## Project Structure

```
affiliate-engine/
├── backend/
│   ├── src/
│   │   ├── app.ts                    ← Express setup
│   │   ├── index.ts                  ← Entry point (port 3000)
│   │   ├── lib/logger.ts             ← Pino logger
│   │   └── routes/
│   │       ├── index.ts              ← Mount all routers
│   │       ├── health.ts             ← GET /api/healthz
│   │       ├── scan.ts               ← POST /api/scan/* (SSE + AI)
│   │       ├── integrations.ts       ← CRUD /api/integrations/*
│   │       ├── pipeline.ts           ← /api/agent/* (AI agent)
│   │       └── wordpress.ts          ← POST /api/wordpress/publish
│   ├── db/
│   │   ├── index.ts                  ← SQLite wrapper
│   │   └── app.sqlite                ← Database file (gitignored)
│   ├── scripts/
│   │   ├── migrate.ts                ← Create tables
│   │   └── seed.ts                   ← Insert demo data
│   ├── mocks/
│   │   ├── trends.json               ← Mock trends response
│   │   ├── domains.json              ← Mock domains response
│   │   ├── content.json              ← Mock content response
│   │   └── compliance.json           ← Mock legal response
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx                   ← Router + providers
│   │   ├── index.css                 ← Tailwind
│   │   ├── lib/
│   │   │   ├── utils.ts              ← cn() utility
│   │   │   └── api.ts                ← API client + SSE
│   │   ├── hooks/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.tsx     ← Main layout
│   │   │   │   └── Sidebar.tsx       ← Navigation
│   │   │   └── ui/                   ← shadcn/ui components
│   │   └── pages/
│   │       ├── dashboard.tsx
│   │       ├── scan.tsx              ← 4-phase wizard
│   │       ├── scan-history.tsx
│   │       ├── scan-session-detail.tsx
│   │       ├── domeny.tsx            ← Portfolio
│   │       ├── domain-detail.tsx
│   │       ├── integrations.tsx
│   │       ├── pipeline.tsx
│   │       ├── prompt.tsx
│   │       ├── configure.tsx
│   │       ├── install.tsx
│   │       └── not-found.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── components.json                ← shadcn/ui config
│   └── package.json
├── package.json                       ← Root
└── README.md
```

## API Endpoints

### Health Check
```
GET /api/healthz
→ { status: "ok", mode: "online|offline", apis: { openai, wordpress, ... } }
```

### Scan (SSE Streaming + AI)
```
POST /api/scan/markets
POST /api/scan/market-trends
POST /api/scan/trend-deep
POST /api/scan/domains
POST /api/scan/domain-setup
POST /api/scan/content-generate
```

### Scan Sessions (DB)
```
GET    /api/scan/sessions
POST   /api/scan/sessions
GET    /api/scan/sessions/:id
PATCH  /api/scan/sessions/:id
DELETE /api/scan/sessions/:id
```

### Domains (DB)
```
GET    /api/domains?status=idea&market=PL
POST   /api/domains
GET    /api/domains/:id
PATCH  /api/domains/:id
DELETE /api/domains/:id
```

### Integrations (15 services)
```
GET    /api/integrations
POST   /api/integrations/:key/connect
DELETE /api/integrations/:key
```

### WordPress Publishing
```
POST /api/wordpress/publish
→ { id, url, status }
```

### AI Pipeline Agent
```
GET    /api/agent/prompt
GET    /api/agent/config
PUT    /api/agent/config
GET    /api/agent/runs
POST   /api/agent/invoke (SSE)
POST   /api/agent/install
```

## Development

### Backend
```bash
cd backend
npm run dev       # nodemon + ts-node on port 3000
npm run build     # tsc
npm start         # node dist/index.js
```

### Frontend
```bash
cd frontend
npm run dev       # vite on port 5173
npm run build     # vite build
npm run preview   # preview production build
```

## Environment Variables

### Backend (`backend/.env`)
- `PORT` — Server port (default: 3000)
- `NODE_ENV` — development | production
- `LOG_LEVEL` — debug | info | warn | error
- `JWT_SECRET` — Secret for JWT signing
- `DATABASE_URL` — SQLite file path
- `MOCK_MODE` — true | false (always use mock data)
- `OPENAI_API_KEY` — OpenAI API key (required for AI)
- `WORDPRESS_URL`, `WORDPRESS_USER`, `WORDPRESS_APP_PASSWORD` — WordPress integration
- `MAKE_WEBHOOK_URL` — Make.com webhook for automation
- `NAMECHEAP_API_KEY`, `NAMECHEAP_USERNAME` — Domain registration
- `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD` — SEO data

### Frontend (`frontend/.env` or `vite.config.ts`)
- `VITE_API_BASE_URL` — Backend API URL (default: http://localhost:3000)

## UI Language

All UI text is in **Czech (cs)** by default. Interface elements:
- Sidebar navigation
- Buttons, labels, toasts
- Error messages
- Form placeholders

## Database Schema

### Tables
- `agent_config` — AI agent configuration (singleton)
- `conversations` — Chat history (future)
- `messages` — Chat messages (future)
- `domains` — Portfolio of domains
- `integrations` — Connected services
- `scan_sessions` — Scan history
- `pipeline_runs` — AI pipeline execution log

All JSON fields (seo_data, legal_data, affiliate_data, content_data) stored as TEXT, auto-parsed by DB wrapper.

## Testing

### Unit Tests (TBD)
```bash
npm run test
npm run test:coverage
```

### Offline Testing
```bash
# In backend/.env
MOCK_MODE=true

# Or disconnect WiFi and run
npm run dev
```

All pages use mock data when API unavailable.

## Production Build

### Backend
```bash
cd backend
npm run build
npm start          # Runs dist/index.js on port 3000
```

### Frontend
```bash
cd frontend
npm run build
npm run preview    # Preview production build locally
```

## Deployment

### Vercel (Frontend)
```bash
vercel --prod
```

### Railway / Render (Backend)
```bash
# Dockerfile or buildpack configuration
node dist/index.js
```

## License

MIT

## Support

- **Issues:** https://github.com/apdejtcz/affiliate-engine/issues
- **Discussions:** https://github.com/apdejtcz/affiliate-engine/discussions

---

**Generated:** 2026-05-20  
**Version:** 1.0.0  
**Status:** Active Development
