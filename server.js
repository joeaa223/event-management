const http = require('http');
const app = require('./backend/app');

// Railway 会自动注入 PORT 环境变量
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});

// 可选：打印错误但不尝试换端口
server.on('error', (error) => {
    console.error('❌ Server error:', error);
});
