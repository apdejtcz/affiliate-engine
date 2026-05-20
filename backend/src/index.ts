import 'dotenv/config';
import app from './app.js';
import logger from './lib/logger.js';
import { migrate } from './scripts/migrate.js';

const PORT = parseInt(process.env.PORT || '3000', 10);

// Auto-migrate on startup
try {
  migrate();
  logger.info('Database migration completed');
} catch (err) {
  logger.error(err, 'Database migration failed');
  process.exit(1);
}

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 Backend running on http://localhost:${PORT}`);
  logger.info(`📊 API: http://localhost:${PORT}/api`);
  logger.info(`🏥 Health: http://localhost:${PORT}/health`);
});
