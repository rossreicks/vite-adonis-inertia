import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command }) => {
  return {
    base: command === 'serve' ? '' : '/build/',
    publicDir: 'fake_dir_so_nothing_gets_copied',
    build: {
      manifest: false,
      outDir: 'inertia/ssr',
      rollupOptions: {
        input: 'resources/js/ssr.tsx',
        commonjsOptions: {
          include: ['node_modules/**'],
          defaultIsModuleExports: true,
        },
        output: {
          format: 'commonjs',
        },
      },
    },
    ssr: {
      noExternal: ['@inertiajs/react', '@inertiajs/core', 'laravel-vite-plugin'],
    },
    plugins: [react()],
  };
});
