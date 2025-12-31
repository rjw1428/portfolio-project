const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3201;

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - IP: ${req.ip}, User-Agent: ${req.get('User-Agent')}`);
  next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// API endpoint for metrics
app.get('/api/metrics', (req, res) => {
  // In a real application, you would gather and return actual metrics.
  // For now, we'll just return a dummy object.
  res.json({
    dailyVisitors: 123,
    health: 'OK',
  });
});

// For any other request, serve the React app's index.html
// For any other request, serve the React app's index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});
