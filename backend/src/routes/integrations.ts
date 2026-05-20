import { Router } from 'express';
import { run, get, query } from '../../db/index.js';

const router = Router();

const INTEGRATIONS = [
  {
    key: 'dataforseo',
    label: 'DataForSEO',
    category: 'seo',
    description: 'SEO data and keyword research',
    website: 'https://dataforseo.com',
    docs: 'https://docs.dataforseo.com',
    fields: ['login', 'password'],
    register_url: 'https://app.dataforseo.com/en/sign-up',
  },
  {
    key: 'cloudflare',
    label: 'Cloudflare',
    category: 'hosting',
    description: 'DNS and CDN management',
    website: 'https://cloudflare.com',
    docs: 'https://developers.cloudflare.com',
    fields: ['api_token', 'zone_id'],
    register_url: 'https://dash.cloudflare.com',
  },
  {
    key: 'google_gsc',
    label: 'Google Search Console',
    category: 'analytics',
    description: 'Monitor Google Search performance',
    website: 'https://search.google.com/search-console',
    docs: 'https://developers.google.com/webmaster-tools',
    fields: ['property_url'],
  },
  {
    key: 'google_ga4',
    label: 'Google Analytics 4',
    category: 'analytics',
    description: 'Web analytics and tracking',
    website: 'https://analytics.google.com',
    docs: 'https://developers.google.com/analytics/devguides',
    fields: ['measurement_id', 'api_secret'],
  },
  {
    key: 'namecheap',
    label: 'Namecheap',
    category: 'domains',
    description: 'Domain registration and management',
    website: 'https://namecheap.com',
    docs: 'https://www.namecheap.com/support/api',
    fields: ['api_key', 'username'],
    register_url: 'https://www.namecheap.com',
  },
  {
    key: 'impact',
    label: 'Impact',
    category: 'affiliate',
    description: 'Affiliate marketing network',
    website: 'https://impact.com',
    docs: 'https://developer.impact.com',
    fields: ['api_key', 'account_id'],
    register_url: 'https://impact.com',
  },
  {
    key: 'awin',
    label: 'Awin',
    category: 'affiliate',
    description: 'Global affiliate network',
    website: 'https://awin.com',
    docs: 'https://api.awin.com',
    fields: ['api_key'],
    register_url: 'https://awin.com',
  },
  {
    key: 'cj',
    label: 'Commission Junction',
    category: 'affiliate',
    description: 'CJ affiliate marketing network',
    website: 'https://cj.com',
    docs: 'https://developers.cj.com',
    fields: ['api_key'],
    register_url: 'https://cj.com',
  },
  {
    key: 'clickbank',
    label: 'ClickBank',
    category: 'affiliate',
    description: 'Digital products affiliate network',
    website: 'https://clickbank.com',
    docs: 'https://developer.clickbank.com',
    fields: ['api_key', 'seller_id'],
    register_url: 'https://clickbank.com',
  },
  {
    key: 'amazon_assoc',
    label: 'Amazon Associates',
    category: 'affiliate',
    description: 'Amazon affiliate program',
    website: 'https://affiliate-program.amazon.com',
    docs: 'https://affiliate-program.amazon.com/en-us/help',
    fields: ['associate_id'],
    register_url: 'https://affiliate-program.amazon.com',
  },
  {
    key: 'convertkit',
    label: 'ConvertKit',
    category: 'email',
    description: 'Email marketing platform',
    website: 'https://convertkit.com',
    docs: 'https://developers.convertkit.com',
    fields: ['api_key', 'api_secret'],
    register_url: 'https://convertkit.com',
  },
  {
    key: 'uptime_robot',
    label: 'Uptime Robot',
    category: 'monitoring',
    description: 'Website monitoring and alerts',
    website: 'https://uptimerobot.com',
    docs: 'https://uptimerobot.com/api',
    fields: ['api_key'],
    register_url: 'https://uptimerobot.com',
  },
  {
    key: 'wordpress',
    label: 'WordPress',
    category: 'publishing',
    description: 'WordPress site publishing',
    website: 'https://wordpress.org',
    docs: 'https://developer.wordpress.org/rest-api',
    fields: ['site_url', 'username', 'app_password'],
    register_url: 'https://wordpress.org/plugins/rest-api',
  },
  {
    key: 'make',
    label: 'Make.com',
    category: 'automation',
    description: 'Workflow automation platform',
    website: 'https://make.com',
    docs: 'https://developer.make.com',
    fields: ['webhook_url'],
    register_url: 'https://make.com',
  },
  {
    key: 'supabase',
    label: 'Supabase',
    category: 'database',
    description: 'PostgreSQL database and backend',
    website: 'https://supabase.com',
    docs: 'https://supabase.com/docs',
    fields: ['project_url', 'api_key'],
    register_url: 'https://supabase.com',
  },
];

// GET /api/integrations
router.get('/', (req, res) => {
  const dbIntegrations = query('SELECT * FROM integrations');
  const dbMap = new Map(dbIntegrations.map((i: any) => [i.key, i]));

  const result = INTEGRATIONS.map((integration) => {
    const dbData = dbMap.get(integration.key);
    return {
      ...integration,
      connected: dbData?.connected || 0,
      config_keys: integration.fields,
      meta: dbData?.meta ? JSON.parse(dbData.meta) : {},
      updated_at: dbData?.updated_at,
    };
  });

  res.json(result);
});

// POST /api/integrations/:key/connect
router.post('/:key/connect', (req, res) => {
  const { key } = req.params;
  const config = req.body;

  const existing = get('SELECT * FROM integrations WHERE key = ?', [key]);
  if (existing) {
    run(
      'UPDATE integrations SET connected = 1, config = ?, updated_at = datetime("now") WHERE key = ?',
      [JSON.stringify(config), key]
    );
  } else {
    run(
      'INSERT INTO integrations (key, label, category, connected, config) VALUES (?, ?, ?, 1, ?)',
      [key, key, 'other', JSON.stringify(config)]
    );
  }

  res.json({
    key,
    connected: true,
    message: `${key} connected successfully`,
  });
});

// DELETE /api/integrations/:key
router.delete('/:key', (req, res) => {
  const { key } = req.params;
  run('UPDATE integrations SET connected = 0, config = "{}" WHERE key = ?', [key]);
  res.json({
    key,
    connected: false,
  });
});

export default router;
