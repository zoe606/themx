import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const themes = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/data/themes" }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    category: z.enum(["minimalist", "bold", "elegant", "playful", "corporate"]),
    year: z.number(),
    tags: z.array(z.string()),
    preview: z.string(),
    tagline: z.string(),
    colors: z.object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string(),
      background: z.string(),
      text: z.string(),
    }),
    typography: z.object({
      heading: z.string(),
      body: z.string(),
    }),
    characteristics: z.array(z.string()),
    examples: z
      .array(
        z.object({
          src: z.string(),
          label: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = { themes };
