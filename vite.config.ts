import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  // Sanitize VITE_SUPABASE_URL if it contains a REST subpath or trailing slashes
  if (process.env.VITE_SUPABASE_URL) {
    process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL
      .trim()
      .replace(/^["']|["']$/g, '')
      .replace(/\/+$/, '')
      .replace(/\/rest\/v1\/?.*$/, '')
      .replace(/\/auth\/v1\/?.*$/, '')
      .replace(/\/+$/, '');
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://aexzqynhtgpjwlwuzsmm.supabase.co';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_rD5txt1BR3IX0dNc9Nxang_ijTT6ML5';

  return {
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseKey),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
