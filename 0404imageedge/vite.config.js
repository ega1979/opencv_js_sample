import { defineConfig } from 'vite';

const base = process.env.NODE_ENV === 'production' ? '/opencv/edge/' : '/';

export default defineConfig({
    base,
    build: {
        outDir: 'dist', // 出力ディレクトリを指定
    },
    define: {
        'global.Module': 'window.Module',
        'process.env': {}
    }
});