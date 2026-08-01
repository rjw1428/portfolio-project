const path = require('path');

try { process.loadEnvFile(path.join(__dirname, '.env')); } catch (_) {}

const express = require('express');
const crypto = require('crypto');
const { PostHog, setupExpressErrorHandler } = require('posthog-node');

const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY;
const POSTHOG_HOST = process.env.POSTHOG_HOST;

if (!POSTHOG_API_KEY && process.env.NODE_ENV !== 'production') {
  console.error(
    'POSTHOG_API_KEY variable required by PostHog is missing or un-configured, ' +
      'this causes events to be silently missed. ' +
      'This error stops appearing once POSTHOG_API_KEY is configured'
  );
}

const posthog = POSTHOG_API_KEY
  ? new PostHog(POSTHOG_API_KEY, {
      host: POSTHOG_HOST || 'https://us.i.posthog.com',
      enableExceptionAutocapture: true,
    })
  : null;

const EXPERIENCE_PAGES = {
  '/01-departures.html': 'departures',
  '/02-blueprint.html': 'blueprint',
  '/03-telemetry.html': 'telemetry',
  '/04-voyage.html': 'voyage',
  '/05-arcade.html': 'arcade',
  '/06-gridiron.html': 'gridiron',
};

// Docker Desktop NATs every inbound connection to the same gateway address, so
// req.ip can't distinguish visitors. Identity comes from a first-party cookie:
// a random anonymous id issued on first visit. Bots that ignore cookies get a
// fresh id per request instead of merging with anyone.
const DID_COOKIE = 'rw_did';
const BOT_UA = /bot|crawler|spider|crawling|scan|monitor|curl|wget|python|go-http|headless/i;

function getDistinctId(req, res) {
  if (req.distinctId) return req.distinctId;
  const clientId = req.headers['x-posthog-distinct-id'];
  const cookieId = (req.headers.cookie || '').match(/(?:^|;\s*)rw_did=(anon_[\w-]+)/)?.[1];
  let id = clientId || cookieId;
  if (!id) {
    id = 'anon_' + crypto.randomUUID();
    res.append('Set-Cookie', `${DID_COOKIE}=${id}; Max-Age=31536000; Path=/; SameSite=Lax; Secure`);
  }
  req.distinctId = id;
  return id;
}

const app = express();
// Behind nginx-proxy-manager; without this req.ip is the docker NAT address —
// identical for every client — so all PostHog visitors collapse into one person.
app.set('trust proxy', true);
const port = process.env.PORT || 3201;
const siteDir = path.join(__dirname, '../public');

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - IP: ${req.ip}, User-Agent: ${req.get('User-Agent')}`);

  if (posthog) {
    const distinctId = getDistinctId(req, res);
    const referrer = req.get('Referer') || null;
    const userAgent = req.get('User-Agent') || null;
    const bot = BOT_UA.test(userAgent || '');
    res.on('finish', () => {
      const experience = EXPERIENCE_PAGES[req.path];
      if (experience) {
        posthog.capture({
          distinctId,
          event: 'experience_served',
          properties: { experience, referrer, user_agent: userAgent, bot },
        });
      } else if (req.path === '/gallery.html') {
        posthog.capture({
          distinctId,
          event: 'gallery_viewed',
          properties: { referrer, user_agent: userAgent, bot },
        });
      }
    });
  }

  next();
});

// API endpoint for metrics
app.get('/api/metrics', (req, res) => {
  res.json({
    health: 'OK',
    uptimeSeconds: Math.round(process.uptime()),
  });
});

// Static site: the shell is index.html; experiences are plain pages.
// HTML revalidates on every visit (pages change during iteration);
// the og image can cache for a day.
app.use(
  express.static(siteDir, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else if (filePath.endsWith('.png') || filePath.endsWith('.svg')) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    },
  })
);

// Anything unmatched is a real 404 — this is not a SPA.
app.use((req, res) => {
  if (posthog) {
    posthog.capture({
      distinctId: getDistinctId(req, res),
      event: 'page_not_found',
      properties: {
        path: req.path,
        method: req.method,
        referrer: req.get('Referer') || null,
        user_agent: req.get('User-Agent') || null,
        bot: BOT_UA.test(req.get('User-Agent') || ''),
      },
    });
  }
  res.status(404).sendFile(path.join(siteDir, '404.html'));
});

if (posthog) {
  setupExpressErrorHandler(posthog, app);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});

async function shutdown() {
  if (posthog) await posthog.shutdown();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
