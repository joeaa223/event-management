const http = require('http');
const app = require('./backend/app');

// 使用 Railway 提供的 PORT 环境变量
const port = process.env.PORT || 3000;

// 添加调试信息
console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    RAILWAY_STATIC_URL: process.env.RAILWAY_STATIC_URL
});

const server = http.createServer(app);

// 先尝试关闭可能存在的服务器
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use. Please check if another instance is running.`);
        process.exit(1); // 退出进程，让 Railway 重新启动
    } else {
        console.error('❌ Server error:', error);
    }
});

server.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});
