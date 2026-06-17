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
    styleTokens: z
      .object({
        surfaceBg: z.string(),
        surfaceBgImage: z.string(),
        cardBg: z.string(),
        cardBorder: z.string(),
        cardBorderWidth: z.string(),
        cardRadius: z.string(),
        cardShadow: z.string(),
        cardBackdropBlur: z.string(),
        cardBorderHover: z.string(),
        cardShadowHover: z.string(),
        fontHeading: z.string(),
        fontBody: z.string(),
        fontHeadingWeight: z.string(),
        fontBodyWeight: z.string(),
        textMuted: z.string(),
        textSubtle: z.string(),
        linkColor: z.string(),
        buttonRadius: z.string(),
        inputBg: z.string(),
        inputBorder: z.string(),
      })
      .optional(),
  }),
});

export const collections = { themes };
