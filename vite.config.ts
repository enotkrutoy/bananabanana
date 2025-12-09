import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // 1. Load env file based on `mode` in the current working directory.
  // Using path.resolve('.') instead of process.cwd() to avoid type issues.
  const root = path.resolve('.');
  
  // This is crucial for Vercel build environments
  const env = loadEnv(mode, root, '');
  
  // 2. Prioritize system variables (Vercel) > .env file
  const apiKey = process.env.API_KEY || env.API_KEY;
  const theme = process.env.THEME || env.THEME || 'dark';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(root, "./src"),
      },
    },
    define: {
      // 3. Inject variables into client code.
      // JSON.stringify is mandatory.
      'process.env.API_KEY': JSON.stringify(apiKey || ''),
      'process.env.THEME': JSON.stringify(theme)
    },
    build: {
      rollupOptions: {
        output: {
          // 4. Optimization: separate vendor and heavy libs
          manualChunks: {
            vendor: ['react', 'react-dom', 'zustand'],
            xyflow: ['@xyflow/react'],
            genai: ['@google/genai'],
            ui: ['lucide-react', 'clsx', 'tailwind-merge']
          }
        }
      },
      // Increase chunk size limit to avoid warnings
      chunkSizeWarningLimit: 1000
    }
  };
});