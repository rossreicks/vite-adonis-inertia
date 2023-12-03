import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command }) => {
  return {
    base: command === 'serve' ? '' : '/build/',
    publicDir: 'fake_dir_so_nothing_gets_copied',
    build: {
      manifest: true,
      outDir: 'public/build',
      rollupOptions: {
        input: 'resources/js/app.tsx',
      },
    },
    plugins: [react()],
  };
});
