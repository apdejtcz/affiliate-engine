import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser';
import logger from './lib/logger.js';
import router from './routes/index.js';

const app = express();

// Middleware
app.use(pinoHttp({ logger }));
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api', router);

// Health check (basic, no logging)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
