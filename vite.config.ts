import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 70, // optional
    open: true  // optional: öffnet automatisch den Browser
  }
});
