import { createRoot, hydrateRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
  resolve: async (name) => {
    const pages = import.meta.glob('./Pages/**/*.tsx');

    return resolvePageComponent(`./Pages/${name}.tsx`, pages);
  },
  setup({ el, App, props }) {
    // createRoot(el).render(<App {...props} />);
    hydrateRoot(el, <App {...props} />);
  },
});
