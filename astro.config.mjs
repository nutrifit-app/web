import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

import { loadEnv } from "vite";

const { SITE_URL } = loadEnv(process.env.NODE_ENV, process.cwd(), "");
export default defineConfig({
  site: SITE_URL,
  server: {
    port: 3000,
  },
  integrations: [icon()],
  vite: {
    plugins: [tailwindcss()]
  }
});