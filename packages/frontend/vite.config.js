import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_TARGET = env.VITE_API_URL || 'http://localhost:3000';

  console.log(`🚀 Vite Proxy target: ${API_TARGET}`);

  // --- Configuração do Proxy Centralizada ---
  const proxyConfig = {
    '/api': {
      target: API_TARGET,
      changeOrigin: true,
      secure: false,
    },
  };

  return {
    root: 'src', 
    base: '/',

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@js': path.resolve(__dirname, './src/js'),
        '@css': path.resolve(__dirname, './src/css'),
      },
    },

    // Servidor de Desenvolvimento
    server: {
      host: true,
      port: 5173,
      open: true,
      cors: true,
      proxy: proxyConfig, 
    },

    // Servidor de Preview da Build
    // É aqui que testamos a build antes de ir pro Docker/Nginx
    preview: {
      port: 4173,
      open: true,
      proxy: proxyConfig, 
    },

    build: {
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true,
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            let extType = assetInfo.name.split('.').at(1);
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img';
            }
            return `assets/${extType}/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
    },
  };
});