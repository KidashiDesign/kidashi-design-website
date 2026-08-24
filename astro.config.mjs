import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.kidashidesign.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
