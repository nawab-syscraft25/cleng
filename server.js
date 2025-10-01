const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 8888;

// Enable gzip compression
app.use(compression());

// Serve static files from the dist/cleng-v2-2 directory
app.use(express.static(path.join(__dirname, 'dist/cleng-v2-2')));

// Handle SPA routing - return the index file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/cleng-v2-2/index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
