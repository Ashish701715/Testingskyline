import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        target: "es2022"
    },
    esbuild: {
        supported: {
            'top-level-await': true
        },
    },
    server: {
        hmr: {
            overlay: false,
        },
    },
    plugins: [
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});

