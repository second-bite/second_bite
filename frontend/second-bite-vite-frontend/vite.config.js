import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path     from 'path'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Inspired by https://vite.dev/config/server-options
    server: {
      proxy: {
        '/recommend': {
          target: env.VITE_RECOMMENDATION_URL,
          changeOrigin: true,
          secure: false,
        }
      }
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV)
    },
  })
}