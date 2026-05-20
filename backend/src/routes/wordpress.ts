import { Router } from 'express';
import { get, run } from '../../db/index.js';

const router = Router();

// POST /api/wordpress/publish
router.post('/publish', async (req, res) => {
  const { domain_id, title, content, status, slug } = req.body;

  try {
    // Get WordPress credentials from integrations
    const wpIntegration = get('SELECT * FROM integrations WHERE key = ?', ['wordpress']);

    if (!wpIntegration || !(wpIntegration as any).connected) {
      // Return mock response
      return res.json({
        id: 1,
        url: 'https://example.com/?p=1',
        status: status || 'draft',
        message: 'WordPress not connected - mock response',
      });
    }

    const config = JSON.parse((wpIntegration as any).config);
    const siteUrl = config.site_url;
    const username = config.username;
    const appPassword = config.app_password;

    // Create Basic Auth header
    const auth = Buffer.from(`${username}:${appPassword}`).toString('base64');

    const postData = {
      title: { raw: title },
      content: { raw: content },
      status: status || 'draft',
      slug,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${siteUrl}/wp-json/wp/v2/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(postData),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`);
      }

      const data = await response.json();

      // Update domain with published URL
      if (domain_id) {
        run('UPDATE domains SET wp_published_url = ?, status = ? WHERE id = ?', [
          data.link,
          'active',
          domain_id,
        ]);
      }

      res.json({
        id: data.id,
        url: data.link,
        status: data.status,
      });
    } catch (err) {
      clearTimeout(timeout);
      // Fallback to mock
      res.json({
        id: 1,
        url: 'https://example.com/?p=1',
        status: status || 'draft',
        message: 'WordPress connection failed - mock response',
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to publish' });
  }
});

export default router;
