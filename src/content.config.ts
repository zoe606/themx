import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/);

const themes = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/data/themes" }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    kind: z.enum(["visual-style", "visual-effect", "layout-pattern", "color-mode", "design-system"]),
    useCases: z.array(z.enum(["portfolio", "saas", "dashboard", "ecommerce", "editorial", "education", "developer", "entertainment", "brand"])).nonempty(),
    avoidFor: z.array(z.string()).nonempty(),
    layoutRules: z.array(z.string()).nonempty(),
    interactionRules: z.array(z.string()).nonempty(),
    category: z.enum(["minimalist", "bold", "elegant", "playful", "corporate"]),
    year: z.number(),
    tags: z.array(z.string()),
    preview: z.string(),
    tagline: z.string(),
    colors: z.object({
      primary: hexColor,
      secondary: hexColor,
      accent: hexColor,
      background: hexColor,
      text: hexColor,
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
