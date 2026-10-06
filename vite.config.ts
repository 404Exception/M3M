import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const whatsappNumber = env.DEFAULT_WHATSAPP_NUMBER || env.WHATSAPP_NUMBER || env.VITE_WHATSAPP_NUMBER || '';
  const phoneNumber = env.DEFAULT_PHONE_NUMBER || env.PHONE_NUMBER || env.VITE_PHONE_NUMBER || '';

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_DEFAULT_WHATSAPP_NUMBER': JSON.stringify(whatsappNumber),
      'import.meta.env.VITE_DEFAULT_PHONE_NUMBER': JSON.stringify(phoneNumber),
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || process.cwd(), '.'),
      },
    },
    server: {
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
