import { defineConfig } from 'vite';

export default defineConfig({
    define: {
        'global.Module': 'window.Module',
        'process.env': {}
    }
});