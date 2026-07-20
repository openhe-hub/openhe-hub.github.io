// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';

// Deployed to GitHub Pages.
// - For a user site repo (<username>.github.io): keep base '/'.
// - For a project repo (e.g. "blog"): set site to
//   'https://<username>.github.io' and base to '/blog'.
export default defineConfig({
  site: 'https://hezhewen2004.github.io',
  base: '/',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkMath, remarkReadingTime],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: { light: 'min-light', dark: 'min-dark' },
      defaultColor: false,
    },
  },
});
