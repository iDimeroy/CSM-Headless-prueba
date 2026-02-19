import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  // For SSR: add an adapter like @astrojs/node if deploying to a Node server.
  // For local dev, Astro's built-in dev server handles SSR natively.
});
