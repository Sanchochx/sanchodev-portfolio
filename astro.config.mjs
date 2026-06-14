import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import vercel from '@astrojs/vercel';

const SITE_URL = 'https://sanchodev-portfolio.vercel.app';

export default defineConfig({
  site: SITE_URL,
  output: 'server',

  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
    icon({ include: { 'material-symbols': ['*'] } }),
  ],

  adapter: vercel(),
});