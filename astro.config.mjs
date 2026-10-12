// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.k-medai.com',
  integrations: [sitemap()],
  build: { format: 'directory' },
  trailingSlash: 'ignore',
  // 기존 Google Sites 주소를 새 주소로 연결
  redirects: {
    '/home': '/',
    '/publication': '/publications/',
    '/teaching': '/course/',
    '/news': '/activity/',
    '/activity/news': '/activity/#news',
    '/activity/seminar': '/activity/#seminar',
    '/activity/physical-lab': '/activity/#physical-lab',
  },
});
