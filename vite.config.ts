// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: ['dompurify'],  // Pre-bundle for faster dev
    exclude: []  // No exclusions
  }
});