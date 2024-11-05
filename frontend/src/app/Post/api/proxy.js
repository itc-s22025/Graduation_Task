import { createProxyMiddleware } from 'http-proxy-middleware';

export default createProxyMiddleware({
    target: 'https://firebasestorage.googleapis.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api/proxy': '', // '/api/proxy'を取り除く
    },
});
