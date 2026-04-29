import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

const SITE_URL = 'https://sanchodev-portfolio.pages.dev';

export default defineConfig({
  site: SITE_URL,
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
    // Resuelve íconos en tiempo de build (SVG inline, sin runtime ni JS).
    // Set declarado: material-symbols (vía @iconify-json/material-symbols).
    icon({ include: { 'material-symbols': ['*'] } }),
  ],
});
