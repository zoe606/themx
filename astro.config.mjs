import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import preact from "@astrojs/preact";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://zoe606.github.io",
  base: "/themx",
  integrations: [preact(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
