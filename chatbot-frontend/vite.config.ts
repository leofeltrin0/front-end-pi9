import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const useMock = env.VITE_USE_MOCK === 'true';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
      },
    },
    server: useMock ? {} : {
      proxy: {
        '/models': 'http://localhost:8000',
        '/chat': 'http://localhost:8000',
        '/download': 'http://localhost:8000', // Se a rota de download começar com /download
        // Se houver outros endpoints da API, adicione-os aqui
      }
    }
  }
})
