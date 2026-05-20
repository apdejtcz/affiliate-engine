import { Router } from 'express';
import health from './health.js';
import scan from './scan.js';
import integrations from './integrations.js';
import pipeline from './pipeline.js';
import wordpress from './wordpress.js';

const router = Router();

router.use('/healthz', health);
router.use('/scan', scan);
router.use('/integrations', integrations);
router.use('/agent', pipeline);
router.use('/wordpress', wordpress);

export default router;
