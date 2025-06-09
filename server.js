const http = require('http');
const app = require('./backend/app');

// 使用 Railway 提供的 PORT 环境变量，如果不可用则使用 3000
const port = process.env.PORT || 3000;

// 添加调试信息
console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    RAILWAY_STATIC_URL: process.env.RAILWAY_STATIC_URL
});

const server = http.createServer(app);

// 添加错误处理
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use. Trying to use port 3000 instead...`);
        // 尝试使用备用端口
        server.listen(3000, () => {
            console.log(`✅ Server running on port 3000`);
        });
    } else {
        console.error('❌ Server error:', error);
        process.exit(1);
    }
});

// 添加优雅关闭处理
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

// 启动服务器
server.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});
