import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yassine-el-ghazi.github.io',
  output: 'static',
  integrations: [sitemap()],
});
