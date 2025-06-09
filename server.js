const http = require('http');

const app = require('./backend/app');

// Use Railway's PORT environment variable or fallback to 3000
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);

server.listen(port, host, () => {
    console.log(`Server running on ${host}:${port}`);
});
