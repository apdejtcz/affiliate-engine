import { run, get } from '../../db/index.js';
import logger from '../lib/logger.js';

export function seed() {
  logger.info('Seeding database...');

  try {
    // Check if agent_config exists
    const existingConfig = get('SELECT * FROM agent_config WHERE id = ?', ['singleton']);
    if (!existingConfig) {
      const defaultConfig = {
        model: 'gpt-4o-mini',
        provider: 'openai',
        max_cost_usd_per_site: 10,
        max_domain_price_usd: 15,
        blocked_countries: ['DE', 'FR'],
        preferred_tlds: ['.com', '.pl', '.es', '.online'],
        target_segments: ['loans', 'insurance', 'travel'],
        trend_weights: {
          epc_weight: 40,
          volume_weight: 30,
          competition_weight: 30,
        },
      };
      run(
        'INSERT INTO agent_config (id, data) VALUES (?, ?)',
        ['singleton', JSON.stringify(defaultConfig)]
      );
      logger.info('✅ Agent config seeded');
    }

    // Check if scan_sessions exist
    const existingSessions = get('SELECT COUNT(*) as count FROM scan_sessions');
    if ((existingSessions as any)?.count === 0) {
      run(
        'INSERT INTO scan_sessions (name, status, blocked_countries, preferred_tlds) VALUES (?, ?, ?, ?)',
        [
          'Demo Scan PL',
          'done',
          JSON.stringify(['DE', 'FR']),
          JSON.stringify(['.com', '.pl']),
        ]
      );
      logger.info('✅ Demo scan session seeded');
    }

    // Check if domains exist
    const existingDomains = get('SELECT COUNT(*) as count FROM domains');
    if ((existingDomains as any)?.count === 0) {
      const domains = [
        {
          name: 'pozyczkipl',
          tld: '.com',
          market: 'PL',
          language: 'pl',
          segment: 'loans',
          keyword_local: 'pożyczki',
          price_usd: 8.99,
          cpc_usd: 2.5,
          epc_usd: 35,
          score: 82,
          status: 'idea',
        },
        {
          name: 'segurosya',
          tld: '.com',
          market: 'ES',
          language: 'es',
          segment: 'insurance',
          keyword_local: 'seguros',
          price_usd: 9.99,
          cpc_usd: 3.2,
          epc_usd: 45,
          score: 88,
          status: 'idea',
        },
        {
          name: 'przelomytravel',
          tld: '.pl',
          market: 'PL',
          language: 'pl',
          segment: 'travel',
          keyword_local: 'podróże',
          price_usd: 7.99,
          cpc_usd: 1.8,
          epc_usd: 28,
          score: 75,
          status: 'idea',
        },
      ];

      for (const domain of domains) {
        run(
          `INSERT INTO domains (name, tld, market, language, segment, keyword_local, price_usd, cpc_usd, epc_usd, score, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            domain.name,
            domain.tld,
            domain.market,
            domain.language,
            domain.segment,
            domain.keyword_local,
            domain.price_usd,
            domain.cpc_usd,
            domain.epc_usd,
            domain.score,
            domain.status,
          ]
        );
      }
      logger.info('✅ Demo domains seeded');
    }

    logger.info('✅ Seeding completed');
  } catch (err) {
    logger.error(err, 'Seeding failed');
    throw err;
  }
}
