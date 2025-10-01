const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 8888;

// Enable gzip compression
app.use(compression());

// Serve static files from the dist/cleng-v2-2/browser directory
const staticPath = path.join(__dirname, 'dist/cleng-v2-2/browser');
console.log('Serving static files from:', staticPath);
app.use(express.static(staticPath));

// Handle SPA routing - return the index file for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(staticPath, 'index.html');
  console.log('Serving index file from:', indexPath);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error loading the application');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
