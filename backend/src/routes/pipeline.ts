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

// GET /api/agent/prompt
router.get('/prompt', (req, res) => {
  res.json({
    version: '2.5-affiliate-factory',
    system_prompt:
      'Jsi AI asistent pro stavbu afiliačních webů. Tvůj cíl: vytvořit automatizovanou továrnu 100+ webů/rok.',
    behavior_rules: [
      'Max náklady: ≤$10/rok na web',
      'Cílový EPC: $15-150',
      'Zaměr: niche weby s vysokým EPC',
    ],
    pipeline_steps: [
      'trend_radar - Identifikuj trendy',
      'scan_world - Analyzuj trhy',
      'select_top_markets - Vyber top trhy',
      'generate_domains - Generuj domény',
      'generate_site - Vytvoř obsah',
      'compliance_pack - Právní soupravy',
    ],
    changelog: [
      { version: '2.5', date: '2026-05-20', changes: 'Initial release' },
    ],
  });
});

// GET /api/agent/config
router.get('/config', (req, res) => {
  let config = get('SELECT * FROM agent_config WHERE id = ?', ['singleton']);
  if (!config) {
    config = {
      id: 'singleton',
      data: JSON.stringify({
        model: 'gpt-4o-mini',
        provider: 'openai',
        max_cost_usd_per_site: 10,
        max_domain_price_usd: 15,
        blocked_countries: ['DE', 'FR'],
        preferred_tlds: ['.com', '.pl', '.es'],
      }),
    };
  }

  try {
    const data = JSON.parse((config as any).data);
    res.json(data);
  } catch {
    res.json((config as any).data);
  }
});

// PUT /api/agent/config
router.put('/config', (req, res) => {
  const config = req.body;
  run(
    'UPDATE agent_config SET data = ?, updated_at = datetime("now") WHERE id = ?',
    [JSON.stringify(config), 'singleton']
  );
  res.json(config);
});

// GET /api/agent/runs
router.get('/runs', (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const runs = query(
    'SELECT * FROM pipeline_runs ORDER BY created_at DESC LIMIT ?',
    [limit]
  );
  res.json(runs);
});

// GET /api/agent/runs/:id
router.get('/runs/:id', (req, res) => {
  const run = get('SELECT * FROM pipeline_runs WHERE id = ?', [req.params.id]);
  if (!run) return res.status(404).json({ error: 'Not found' });
  res.json(run);
});

// POST /api/agent/invoke (SSE)
router.post('/invoke', (req, res) => {
  const { step, market, topic, constraints } = req.body;

  startSSE(res);
  sendEvent(res, { type: 'start', step });
  sendEvent(res, { type: 'chunk', content: `Spouštím krok: ${step}...` });

  // Mock response
  const output = {
    step,
    market: market || 'PL',
    topic: topic || 'loans',
    result: 'Mock output from pipeline',
  };

  // Store in DB
  run(
    'INSERT INTO pipeline_runs (step, market, topic, output, status) VALUES (?, ?, ?, ?, ?)',
    [step, market || null, topic || null, JSON.stringify(output), 'done']
  );

  sendEvent(res, { type: 'done', output });
  res.end();
});

// POST /api/agent/install
router.post('/install', (req, res) => {
  const { agent_name, provider, model } = req.body;

  const agentJson = {
    name: agent_name,
    version: '2.5-affiliate-factory',
    provider,
    model: model || 'gpt-4o-mini',
    system_prompt: 'Global Affiliate Factory Agent',
  };

  const makeScenarioJson = {
    name: `Affiliate Engine - ${agent_name}`,
    steps: [
      { name: 'Trend Radar', action: 'POST /api/agent/invoke?step=trend_radar' },
      { name: 'Scan World', action: 'POST /api/agent/invoke?step=scan_world' },
    ],
  };

  res.json({
    success: true,
    agent_json: agentJson,
    make_scenario_json: makeScenarioJson,
  });
});

export default router;
