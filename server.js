const http = require('http');

const app = require('./backend/app');

// Create HTTP server
const server = http.createServer(app);

// Check if running on Vercel
if (process.env.VERCEL) {
  // Export the server for Vercel
  module.exports = app;
} else {
  // Local development
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
