import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  const openaiKey = !!process.env.OPENAI_API_KEY;
  const wordpressUrl = !!process.env.WORDPRESS_URL;
  const makeWebhook = !!process.env.MAKE_WEBHOOK_URL;
  const namecheapKey = !!process.env.NAMECHEAP_API_KEY;

  res.json({
    status: 'ok',
    mode: openaiKey ? 'online' : 'offline',
    apis: {
      openai: openaiKey,
      wordpress: wordpressUrl,
      make: makeWebhook,
      namecheap: namecheapKey,
    },
  });
});

export default router;
