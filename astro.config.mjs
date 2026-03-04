import { defineConfig } from 'astro/config';

import icon from "astro-icon";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://nutrifit-app.github.io",
  base: import.meta.env.BASE_PATH,
  server: {
    port: 3000,
  },
  integrations: [icon()],
  vite: {
    plugins: [tailwindcss()]
  }
});