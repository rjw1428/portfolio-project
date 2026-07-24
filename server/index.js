const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3201;
const siteDir = path.join(__dirname, '../src');

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - IP: ${req.ip}, User-Agent: ${req.get('User-Agent')}`);
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
  res.status(404).sendFile(path.join(siteDir, '404.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});
