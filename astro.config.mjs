import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { existsSync, readdirSync } from 'node:fs';

// The /writeups index is noindex and left out of the sitemap until the first real writeup exists.
const writeupsDir = 'src/content/writeups';
const hasWriteups = existsSync(writeupsDir) && readdirSync(writeupsDir).some(f => f.endsWith('.md') && !f.startsWith('_'));

export default defineConfig({
  site: 'https://yassine-el-ghazi.github.io',
  output: 'static',
  markdown: { shikiConfig: { theme: 'github-dark-default', wrap: false } },
  integrations: [sitemap({ filter: page => hasWriteups || !page.includes('/writeups') })],
});
