import { defineConfig } from 'vite';

const base = process.env.NODE_ENV === 'production' ? '/opencv/face/' : '/';

export default defineConfig({
    base,
    build: {
        outDir: 'dist', // 出力ディレクトリを指定
    },
    assetsInclude: ['**/*.xml'],
    define: {
        'global.Module': 'window.Module',
        'process.env': {}
    }
});