import { Router, Response } from 'express';
import { run, get, query } from '../../db/index.js';

const router = Router();

// Helper: SSE headers
function startSSE(res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
}

function sendEvent(res: Response, data: unknown) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

// POST /api/scan/markets (SSE)
router.post('/markets', (req, res) => {
  startSSE(res);

  sendEvent(res, { type: 'start' });
  sendEvent(res, {
    type: 'chunk',
    content: 'Analyzuji globální trhy...',
  });

  // Mock response
  const output = {
    markets: [
      {
        iso: 'PL',
        name: 'Poland',
        name_native: 'Polska',
        language: 'pl',
        internet_penetration: 85,
        bureaucracy_score: 2,
        competition_score: 35,
        affiliate_freedom_score: 90,
        epc_potential_score: 75,
        total_score: 82,
        best_segments: ['loans', 'insurance', 'dating'],
        notes: 'Velký trh, nízká regulace',
        recommended: true,
      },
      {
        iso: 'ES',
        name: 'Spain',
        name_native: 'España',
        language: 'es',
        internet_penetration: 92,
        bureaucracy_score: 3,
        competition_score: 45,
        affiliate_freedom_score: 85,
        epc_potential_score: 78,
        total_score: 79,
        best_segments: ['travel', 'gambling', 'ecommerce'],
        notes: 'Vysoký potenciál EPC',
        recommended: true,
      },
    ],
    scan_date: new Date().toISOString(),
    total_scanned: 50,
    recommended_count: 10,
  };

  sendEvent(res, { type: 'done', output });
  res.end();
});

// POST /api/scan/market-trends (SSE)
router.post('/market-trends', (req, res) => {
  startSSE(res);

  sendEvent(res, { type: 'start' });
  sendEvent(res, {
    type: 'chunk',
    content: 'Vyhledávám trendující témata...',
  });

  const output = {
    market: 'PL',
    language: 'pl',
    trends: [
      {
        id: 1,
        name: 'online loans',
        name_local: 'pożyczki online',
        category: 'finance',
        search_est: 50000,
        epc_usd: 35,
        commission_pct: 15,
        trend_score: 85,
        competition: 'high',
        direction: 'stable',
        why: 'Vysoká poptávka po online půjčkách',
      },
    ],
  };

  sendEvent(res, { type: 'done', output });
  res.end();
});

// POST /api/scan/trend-deep (SSE)
router.post('/trend-deep', (req, res) => {
  startSSE(res);
  sendEvent(res, { type: 'start' });

  const output = {
    trend: 'online loans',
    trend_local: 'pożyczki online',
    market: 'PL',
    language: 'pl',
    search_volume_est: 50000,
    competition_score: 65,
    epc_usd: 35,
    commission_pct: 15,
    affiliate_programs: [
      { name: 'Vivus', url: 'https://vivus.pl', commission_pct: 20, epc_usd: 40 },
    ],
    content_angles: ['Porovnání půjček', 'Kalkulačka'],
    domain_keywords: ['pożyczki online', 'szybka pożyczka'],
    why_now: 'Sezonní nárůst',
    risk_level: 'medium',
  };

  sendEvent(res, { type: 'done', output });
  res.end();
});

// POST /api/scan/domains (SSE)
router.post('/domains', (req, res) => {
  startSSE(res);
  sendEvent(res, { type: 'start' });

  const output = {
    domains: [
      {
        name: 'pozyczkipl',
        tld: '.com',
        full_domain: 'pozyczkipl.com',
        market: 'PL',
        language: 'pl',
        segment: 'loans',
        keyword_local: 'pożyczki',
        price_usd: 8.99,
        cpc_usd: 2.5,
        epc_usd: 35,
        score: 82,
        buy_url: 'https://www.namecheap.com/domains/registration/results/?domain=pozyczkipl.com',
        available_note: 'Ověřit dostupnost',
      },
    ],
    total: 1,
  };

  sendEvent(res, { type: 'done', output });
  res.end();
});

// POST /api/scan/domain-setup (SSE)
router.post('/domain-setup', (req, res) => {
  startSSE(res);
  sendEvent(res, { type: 'start' });

  const output = {
    seo: {
      title: 'Nejlepší Pożyczki Online 2025',
      meta_description: 'Porovnaj nejlepsze půjčky online',
      og_title: 'Pożyczki Online',
      og_description: 'Najdź najlepszou pożyczkę',
      h1: 'Nejlepší Pożyczki Online v ČR',
      keywords: ['pożyczki online', 'chwilówki'],
    },
    legal: {
      gdpr_required: true,
      cookie_consent: true,
      affiliate_disclosure: true,
      privacy_policy_required: true,
      country_specific_notes: 'GDPR povinné',
    },
    affiliate: {
      recommended_networks: ['Awin', 'CJ'],
      programs: ['Vivus', 'Ferratum'],
      content_strategy: 'Porovnání a kalkulačky',
      monetization_notes: 'EPC 20-50 USD',
    },
  };

  sendEvent(res, { type: 'done', output });
  res.end();
});

// POST /api/scan/content-generate (SSE)
router.post('/content-generate', (req, res) => {
  startSSE(res);
  sendEvent(res, { type: 'start' });

  const output = {
    h1: 'Nejlepší Pożyczki Online 2025 — Porovnaj a Vyber',
    intro: 'Hledáš rychlou pożyczkę online? Porovnaj nabídky nejlepszych pożyczkodawcù v ČR.',
    sections: [
      {
        heading: 'Jak vybrat nejlepší pożyczkę?',
        body: 'Při výběru pożyczky věnuj pozornost RRSO...',
      },
    ],
    faq: [
      {
        q: 'Jak rychle dostanu peníze?',
        a: 'Většina pożyczkodawcù převede prostředky během 15 minut.',
      },
    ],
    cta: 'Porovnaj nyní a vyber nejlepší nabídku!',
    affiliate_disclosure: 'Stránka obsahuje afiliační links. Můžeme získat provizi.',
    word_count: 850,
    language: 'cs',
  };

  sendEvent(res, { type: 'done', output });
  res.end();
});

// CRUD: Scan Sessions
router.get('/sessions', (req, res) => {
  const sessions = query('SELECT * FROM scan_sessions ORDER BY created_at DESC');
  res.json(sessions);
});

router.post('/sessions', (req, res) => {
  const { name, status, blocked_countries, preferred_tlds, max_price_usd } = req.body;
  const result = run(
    `INSERT INTO scan_sessions (name, status, blocked_countries, preferred_tlds, max_price_usd)
     VALUES (?, ?, ?, ?, ?)`,
    [
      name,
      status || 'running',
      JSON.stringify(blocked_countries || []),
      JSON.stringify(preferred_tlds || []),
      max_price_usd || 10,
    ]
  );
  res.json({ id: result.lastInsertRowid });
});

router.get('/sessions/:id', (req, res) => {
  const session = get('SELECT * FROM scan_sessions WHERE id = ?', [req.params.id]);
  if (!session) return res.status(404).json({ error: 'Not found' });
  res.json(session);
});

router.patch('/sessions/:id', (req, res) => {
  const { name, status, blocked_countries, preferred_tlds } = req.body;
  const updates = [];
  const params = [];

  if (name !== undefined) {
    updates.push('name = ?');
    params.push(name);
  }
  if (status !== undefined) {
    updates.push('status = ?');
    params.push(status);
  }
  if (blocked_countries !== undefined) {
    updates.push('blocked_countries = ?');
    params.push(JSON.stringify(blocked_countries));
  }
  if (preferred_tlds !== undefined) {
    updates.push('preferred_tlds = ?');
    params.push(JSON.stringify(preferred_tlds));
  }

  params.push(req.params.id);
  run(`UPDATE scan_sessions SET ${updates.join(', ')}, updated_at = datetime('now') WHERE id = ?`, params);
  res.json({ success: true });
});

router.delete('/sessions/:id', (req, res) => {
  run('DELETE FROM scan_sessions WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

export default router;
