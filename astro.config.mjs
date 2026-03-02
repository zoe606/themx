import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import preact from "@astrojs/preact";
import mdx from "@astrojs/mdx";

export default defineConfig({
  integrations: [preact(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
