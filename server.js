const http = require('http');
const app = require('./backend/app');

let port = process.env.PORT || 3000;

console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    RAILWAY_STATIC_URL: process.env.RAILWAY_STATIC_URL
});

function startServer(portToUse) {
    const server = http.createServer(app);

    server.listen(portToUse, () => {
        console.log(`✅ Server running on port ${portToUse}`);
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`❌ Port ${portToUse} is already in use.`);
            if (portToUse !== 3000) {
                console.log('🔁 Trying to use port 3000 instead...');
                startServer(3000); // 尝试另一个端口
            } else {
                console.error('❌ Both ports are in use. Exiting...');
                process.exit(1);
            }
        } else {
            console.error('❌ Server error:', error);
            process.exit(1);
        }
    });

    process.on('SIGTERM', () => {
        console.log('SIGTERM received, closing server');
        server.close(() => {
            console.log('HTTP server closed');
            process.exit(0);
        });
    });
}

startServer(port);

