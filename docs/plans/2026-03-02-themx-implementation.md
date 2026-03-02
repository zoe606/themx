# themx Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a web design theme showcase with filterable catalog and configurable prompt builder, using Astro 5 + Tailwind CSS 4 + Preact.

**Architecture:** Static site with Astro content collections (MDX) for theme data, Astro pages for catalog/detail views, and a Preact island for the interactive prompt builder. Filters are client-side JS islands.

**Tech Stack:** Astro 5, Tailwind CSS 4 (`@tailwindcss/vite`), Preact, MDX, Vitest

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `src/pages/index.astro` (placeholder)

**Step 1: Create Astro project**

Run:
```bash
cd /Users/librantara.erlangga/dev/personal/themx
npm create astro@latest . -- --template minimal --no-install --typescript strict
```

**Step 2: Install dependencies**

Run:
```bash
npm install
npm install @astrojs/preact preact
npm install @astrojs/mdx
npm install tailwindcss @tailwindcss/vite
npm install -D vitest @testing-library/preact jsdom
```

**Step 3: Configure Astro with Tailwind, Preact, and MDX**

Update `astro.config.mjs`:

```javascript
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
```

**Step 4: Create global CSS with Tailwind import**

Create `src/styles/global.css`:

```css
@import "tailwindcss";
```

**Step 5: Verify dev server starts**

Run: `npx astro dev`
Expected: Dev server starts at `http://localhost:4321` without errors.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro project with Tailwind, Preact, and MDX"
```

---

### Task 2: Content Collection Schema

**Files:**
- Create: `src/content.config.ts`

**Step 1: Define the themes collection schema**

Create `src/content.config.ts`:

```typescript
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
  }),
});

export const collections = { themes };
```

**Step 2: Create themes data directory**

Run: `mkdir -p src/data/themes`

**Step 3: Verify build succeeds with empty collection**

Run: `npx astro build`
Expected: Build succeeds (empty collection is fine).

**Step 4: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: define themes content collection schema"
```

---

### Task 3: First Theme MDX File (Neo-Brutalism)

**Files:**
- Create: `src/data/themes/neo-brutalism.mdx`
- Create: `public/previews/` directory (placeholder image)

**Step 1: Create previews directory**

Run: `mkdir -p public/previews`

**Step 2: Create a placeholder preview image**

Generate a simple SVG placeholder at `public/previews/neo-brutalism.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#FFFFFF"/>
  <rect x="40" y="40" width="720" height="120" fill="#FF6B6B" stroke="#000" stroke-width="4"/>
  <text x="400" y="110" text-anchor="middle" font-family="sans-serif" font-size="36" font-weight="bold">Neo-Brutalism</text>
  <rect x="40" y="200" width="220" height="280" fill="#4ECDC4" stroke="#000" stroke-width="4" transform="translate(4,4)"/>
  <rect x="40" y="200" width="220" height="280" fill="#4ECDC4" stroke="#000" stroke-width="4"/>
  <rect x="290" y="200" width="220" height="280" fill="#FFE66D" stroke="#000" stroke-width="4" transform="translate(4,4)"/>
  <rect x="290" y="200" width="220" height="280" fill="#FFE66D" stroke="#000" stroke-width="4"/>
  <rect x="540" y="200" width="220" height="280" fill="#FF6B6B" stroke="#000" stroke-width="4" transform="translate(4,4)"/>
  <rect x="540" y="200" width="220" height="280" fill="#FF6B6B" stroke="#000" stroke-width="4"/>
  <rect x="40" y="520" width="160" height="50" fill="#2D2D2D" stroke="#000" stroke-width="4"/>
  <text x="120" y="552" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#FFF" font-weight="bold">Click Me</text>
</svg>
```

**Step 3: Create the theme MDX file**

Create `src/data/themes/neo-brutalism.mdx`:

```mdx
---
name: "Neo-Brutalism"
slug: "neo-brutalism"
category: "bold"
year: 2025
tags: ["high-contrast", "thick-borders", "raw", "chunky"]
preview: "/previews/neo-brutalism.svg"
tagline: "Raw, bold, unapologetically loud"
colors:
  primary: "#FF6B6B"
  secondary: "#4ECDC4"
  accent: "#FFE66D"
  background: "#FFFFFF"
  text: "#2D2D2D"
typography:
  heading: "Space Grotesk"
  body: "Inter"
characteristics:
  - "Thick black borders (2-4px) on all interactive elements"
  - "Bold, saturated color palette with high contrast"
  - "Visible box shadows offset 4px to bottom-right using black"
  - "Chunky buttons with scale transforms on hover"
  - "Raw, unpolished aesthetic — embrace asymmetry"
  - "Flat design with no gradients, just solid colors"
  - "Large, bold typography for headings"
---

Neo-brutalism takes inspiration from brutalist architecture and the raw aesthetic of early web design, but reinterprets it with modern sensibilities and vibrant colors.

## When to Use

Neo-brutalism works well for creative portfolios, indie projects, developer tools, and any brand that wants to stand out with a bold, unconventional look. It signals confidence and a willingness to break conventions.

## Key Visual Elements

The style is defined by its thick black borders, offset shadows, and saturated color blocks. Unlike traditional brutalism which favors monochrome, neo-brutalism embraces bright, playful colors while maintaining the raw, structural honesty of its predecessor.

## Typography

Use bold, geometric sans-serif fonts for headings (Space Grotesk, Archivo Black) paired with clean body text (Inter, IBM Plex Sans). Headlines should be large and impactful.
```

**Step 4: Verify the content collection loads**

Add a temporary test to `src/pages/index.astro`:

```astro
---
import { getCollection } from "astro:content";
const themes = await getCollection("themes");
---
<html>
<body>
  <p>Themes loaded: {themes.length}</p>
  <p>First theme: {themes[0]?.data.name}</p>
</body>
</html>
```

Run: `npx astro dev` and visit `http://localhost:4321`
Expected: Page shows "Themes loaded: 1" and "First theme: Neo-Brutalism"

**Step 5: Commit**

```bash
git add src/data/themes/neo-brutalism.mdx public/previews/neo-brutalism.svg src/pages/index.astro
git commit -m "feat: add first theme (neo-brutalism) with content collection"
```

---

### Task 4: Base Layout and Header/Footer

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`

**Step 1: Create Header component**

Create `src/components/Header.astro`:

```astro
---
const navLinks = [
  { href: "/", label: "Themes" },
  { href: "/about", label: "About" },
];
---
<header class="border-b border-gray-200 bg-white">
  <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <a href="/" class="text-xl font-bold tracking-tight text-gray-900">
      themx
    </a>
    <nav class="flex gap-6">
      {navLinks.map((link) => (
        <a
          href={link.href}
          class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          {link.label}
        </a>
      ))}
    </nav>
  </div>
</header>
```

**Step 2: Create Footer component**

Create `src/components/Footer.astro`:

```astro
---
const year = new Date().getFullYear();
---
<footer class="border-t border-gray-200 bg-white">
  <div class="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-gray-500">
    <p>&copy; {year} themx. Design trends, ready-to-use prompts.</p>
  </div>
</footer>
```

**Step 3: Create BaseLayout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import "../styles/global.css";

interface Props {
  title: string;
  description?: string;
}

const { title, description = "Web design themes with ready-to-use AI prompts" } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title} | themx</title>
  </head>
  <body class="flex min-h-screen flex-col bg-gray-50 text-gray-900 antialiased">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

**Step 4: Update index page to use layout**

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout title="Home">
  <div class="mx-auto max-w-6xl px-6 py-12">
    <h1 class="text-3xl font-bold">themx</h1>
    <p class="mt-2 text-gray-600">Coming soon.</p>
  </div>
</BaseLayout>
```

**Step 5: Verify layout renders**

Run: `npx astro dev`
Expected: Page renders with header (logo + nav), content, and footer. Tailwind styles applied.

**Step 6: Commit**

```bash
git add src/layouts/ src/components/Header.astro src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add base layout with header and footer"
```

---

### Task 5: Theme Card Component

**Files:**
- Create: `src/components/ThemeCard.astro`

**Step 1: Create the ThemeCard component**

Create `src/components/ThemeCard.astro`:

```astro
---
interface Props {
  name: string;
  slug: string;
  category: string;
  tagline: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const { name, slug, category, tagline, preview, colors } = Astro.props;

const categoryColors: Record<string, string> = {
  minimalist: "bg-gray-100 text-gray-700",
  bold: "bg-red-100 text-red-700",
  elegant: "bg-purple-100 text-purple-700",
  playful: "bg-yellow-100 text-yellow-700",
  corporate: "bg-blue-100 text-blue-700",
};

const badgeClass = categoryColors[category] ?? "bg-gray-100 text-gray-700";
---
<a
  href={`/themes/${slug}`}
  class="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
>
  <div class="aspect-[4/3] overflow-hidden bg-gray-100">
    <img
      src={preview}
      alt={`${name} theme preview`}
      class="h-full w-full object-cover transition-transform group-hover:scale-105"
      loading="lazy"
    />
  </div>
  <div class="p-4">
    <div class="mb-2 flex items-center gap-2">
      <h3 class="font-semibold text-gray-900">{name}</h3>
      <span class={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass}`}>
        {category}
      </span>
    </div>
    <p class="text-sm text-gray-500">{tagline}</p>
    <div class="mt-3 flex gap-1.5">
      {[colors.primary, colors.secondary, colors.accent].map((color) => (
        <div
          class="h-4 w-4 rounded-full border border-gray-200"
          style={`background-color: ${color}`}
          title={color}
        />
      ))}
    </div>
  </div>
</a>
```

**Step 2: Verify by adding a card to index temporarily**

Update `src/pages/index.astro` to render a test card:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import ThemeCard from "../components/ThemeCard.astro";
import { getCollection } from "astro:content";

const themes = await getCollection("themes");
---
<BaseLayout title="Home">
  <div class="mx-auto max-w-6xl px-6 py-12">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {themes.map((theme) => (
        <ThemeCard
          name={theme.data.name}
          slug={theme.data.slug}
          category={theme.data.category}
          tagline={theme.data.tagline}
          preview={theme.data.preview}
          colors={theme.data.colors}
        />
      ))}
    </div>
  </div>
</BaseLayout>
```

Run: `npx astro dev`
Expected: A card renders with the neo-brutalism preview, name, category badge, tagline, and color dots.

**Step 3: Commit**

```bash
git add src/components/ThemeCard.astro src/pages/index.astro
git commit -m "feat: add theme card component"
```

---

### Task 6: Homepage with Hero and Filterable Grid

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/components/ThemeFilter.tsx` (Preact island)

**Step 1: Create the filter component (Preact island)**

Create `src/components/ThemeFilter.tsx`:

```tsx
import { useState } from "preact/hooks";

interface ThemeData {
  name: string;
  slug: string;
  category: string;
  year: number;
  tagline: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface Props {
  themes: ThemeData[];
  categories: string[];
  years: number[];
}

const categoryColors: Record<string, string> = {
  minimalist: "bg-gray-100 text-gray-700 border-gray-300",
  bold: "bg-red-100 text-red-700 border-red-300",
  elegant: "bg-purple-100 text-purple-700 border-purple-300",
  playful: "bg-yellow-100 text-yellow-700 border-yellow-300",
  corporate: "bg-blue-100 text-blue-700 border-blue-300",
};

export default function ThemeFilter({ themes, categories, years }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  const filtered = themes.filter((t) => {
    if (activeCategory && t.category !== activeCategory) return false;
    if (activeYear && t.year !== activeYear) return false;
    return true;
  });

  return (
    <div>
      {/* Filter bar */}
      <div class="mb-8 flex flex-wrap items-center gap-3">
        <span class="text-sm font-medium text-gray-500">Filter:</span>

        {/* Category pills */}
        <button
          onClick={() => setActiveCategory(null)}
          class={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            activeCategory === null
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            class={`rounded-full px-3 py-1 text-sm font-medium capitalize transition-colors ${
              activeCategory === cat
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}

        {/* Year dropdown */}
        <select
          value={activeYear ?? ""}
          onChange={(e) => {
            const val = (e.target as HTMLSelectElement).value;
            setActiveYear(val ? Number(val) : null);
          }}
          class="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm text-gray-600"
        >
          <option value="">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Theme grid */}
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((theme) => (
          <a
            key={theme.slug}
            href={`/themes/${theme.slug}`}
            class="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
          >
            <div class="aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src={theme.preview}
                alt={`${theme.name} theme preview`}
                class="h-full w-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div class="p-4">
              <div class="mb-2 flex items-center gap-2">
                <h3 class="font-semibold text-gray-900">{theme.name}</h3>
                <span
                  class={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    categoryColors[theme.category] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {theme.category}
                </span>
              </div>
              <p class="text-sm text-gray-500">{theme.tagline}</p>
              <div class="mt-3 flex gap-1.5">
                {[theme.colors.primary, theme.colors.secondary, theme.colors.accent].map(
                  (color) => (
                    <div
                      class="h-4 w-4 rounded-full border border-gray-200"
                      style={`background-color: ${color}`}
                      title={color}
                    />
                  )
                )}
              </div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <p class="py-12 text-center text-gray-400">No themes match your filters.</p>
      )}
    </div>
  );
}
```

**Step 2: Build the full homepage**

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import ThemeFilter from "../components/ThemeFilter";
import { getCollection } from "astro:content";

const themes = await getCollection("themes");
const themeData = themes.map((t) => ({
  name: t.data.name,
  slug: t.data.slug,
  category: t.data.category,
  year: t.data.year,
  tagline: t.data.tagline,
  preview: t.data.preview,
  colors: {
    primary: t.data.colors.primary,
    secondary: t.data.colors.secondary,
    accent: t.data.colors.accent,
  },
}));

const categories = [...new Set(themes.map((t) => t.data.category))].sort();
const years = [...new Set(themes.map((t) => t.data.year))].sort((a, b) => b - a);
---
<BaseLayout title="Design Themes & AI Prompts">
  {/* Hero */}
  <section class="border-b border-gray-200 bg-white">
    <div class="mx-auto max-w-6xl px-6 py-16 text-center">
      <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        themx
      </h1>
      <p class="mx-auto mt-4 max-w-xl text-lg text-gray-500">
        Discover trending web design styles. Generate ready-to-use prompts for Claude to build your next project in any style.
      </p>
    </div>
  </section>

  {/* Theme catalog */}
  <section class="mx-auto max-w-6xl px-6 py-12">
    <ThemeFilter
      client:load
      themes={themeData}
      categories={categories}
      years={years}
    />
  </section>
</BaseLayout>
```

**Step 3: Verify homepage renders with filter and cards**

Run: `npx astro dev`
Expected: Hero section with title/tagline, filter bar with category pills and year dropdown, grid of theme cards. Filters should work interactively.

**Step 4: Commit**

```bash
git add src/components/ThemeFilter.tsx src/pages/index.astro
git commit -m "feat: add homepage with hero and filterable theme grid"
```

---

### Task 7: Theme Detail Page (Static Content)

**Files:**
- Create: `src/pages/themes/[slug].astro`
- Create: `src/components/ColorSwatch.astro`

**Step 1: Create ColorSwatch component**

Create `src/components/ColorSwatch.astro`:

```astro
---
interface Props {
  label: string;
  color: string;
}

const { label, color } = Astro.props;
---
<div class="flex flex-col items-center gap-1.5">
  <div
    class="h-12 w-12 rounded-lg border border-gray-200"
    style={`background-color: ${color}`}
  />
  <span class="text-xs font-medium text-gray-500">{label}</span>
  <span class="text-xs text-gray-400">{color}</span>
</div>
```

**Step 2: Create the dynamic theme detail page**

Create `src/pages/themes/[slug].astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import ColorSwatch from "../../components/ColorSwatch.astro";
import { getCollection, render } from "astro:content";

export async function getStaticPaths() {
  const themes = await getCollection("themes");
  return themes.map((theme) => ({
    params: { slug: theme.data.slug },
    props: { theme },
  }));
}

const { theme } = Astro.props;
const { Content } = await render(theme);
const { data } = theme;
---
<BaseLayout title={data.name} description={`${data.name} — ${data.tagline}. Get a ready-to-use AI prompt for this design style.`}>
  {/* Header */}
  <section class="border-b border-gray-200 bg-white">
    <div class="mx-auto max-w-4xl px-6 py-8">
      <a href="/" class="text-sm text-gray-400 hover:text-gray-600">&larr; Back to themes</a>
      <div class="mt-4 flex flex-wrap items-center gap-3">
        <h1 class="text-3xl font-bold text-gray-900">{data.name}</h1>
        <span class="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium capitalize text-gray-600">
          {data.category}
        </span>
        <span class="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
          {data.year}
        </span>
      </div>
      <p class="mt-2 text-lg text-gray-500">{data.tagline}</p>
    </div>
  </section>

  <div class="mx-auto max-w-4xl px-6 py-12">
    {/* Preview */}
    <div class="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <img
        src={data.preview}
        alt={`${data.name} preview`}
        class="w-full"
      />
    </div>

    {/* Color Palette */}
    <div class="mt-10">
      <h2 class="text-lg font-semibold text-gray-900">Color Palette</h2>
      <div class="mt-4 flex flex-wrap gap-6">
        <ColorSwatch label="Primary" color={data.colors.primary} />
        <ColorSwatch label="Secondary" color={data.colors.secondary} />
        <ColorSwatch label="Accent" color={data.colors.accent} />
        <ColorSwatch label="Background" color={data.colors.background} />
        <ColorSwatch label="Text" color={data.colors.text} />
      </div>
    </div>

    {/* Typography */}
    <div class="mt-10">
      <h2 class="text-lg font-semibold text-gray-900">Typography</h2>
      <div class="mt-3 flex gap-8 text-sm text-gray-600">
        <div><span class="font-medium">Heading:</span> {data.typography.heading}</div>
        <div><span class="font-medium">Body:</span> {data.typography.body}</div>
      </div>
    </div>

    {/* Characteristics */}
    <div class="mt-10">
      <h2 class="text-lg font-semibold text-gray-900">Key Characteristics</h2>
      <ul class="mt-3 space-y-2">
        {data.characteristics.map((c) => (
          <li class="flex items-start gap-2 text-sm text-gray-600">
            <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
            {c}
          </li>
        ))}
      </ul>
    </div>

    {/* Tags */}
    <div class="mt-10">
      <h2 class="text-lg font-semibold text-gray-900">Tags</h2>
      <div class="mt-3 flex flex-wrap gap-2">
        {data.tags.map((tag) => (
          <span class="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
            {tag}
          </span>
        ))}
      </div>
    </div>

    {/* MDX Content */}
    <div class="prose prose-gray mt-10 max-w-none">
      <Content />
    </div>

    {/* Prompt Builder placeholder */}
    <div class="mt-12 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-gray-400">
      Prompt builder will go here (Task 8)
    </div>
  </div>
</BaseLayout>
```

**Step 3: Verify the detail page renders**

Run: `npx astro dev` and visit `http://localhost:4321/themes/neo-brutalism`
Expected: Detail page with back link, title, badges, preview image, color swatches, typography, characteristics list, tags, MDX content, and placeholder for prompt builder.

**Step 4: Commit**

```bash
git add src/pages/themes/ src/components/ColorSwatch.astro
git commit -m "feat: add theme detail page with color palette and characteristics"
```

---

### Task 8: Prompt Builder (Preact Island)

**Files:**
- Create: `src/components/PromptBuilder.tsx`
- Create: `src/lib/generatePrompt.ts`
- Create: `src/lib/generatePrompt.test.ts`
- Modify: `src/pages/themes/[slug].astro` (integrate prompt builder)

**Step 1: Write failing test for prompt generation**

Create `src/lib/generatePrompt.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { generatePrompt } from "./generatePrompt";

describe("generatePrompt", () => {
  const baseConfig = {
    themeName: "Neo-Brutalism",
    characteristics: [
      "Thick black borders (2-4px)",
      "Bold, saturated colors",
    ],
    colors: {
      primary: "#FF6B6B",
      secondary: "#4ECDC4",
      accent: "#FFE66D",
      background: "#FFFFFF",
      text: "#2D2D2D",
    },
    typography: { heading: "Space Grotesk", body: "Inter" },
    framework: "Next.js",
    cssApproach: "Tailwind",
    components: ["Hero", "Cards"],
    tone: "Professional",
  };

  it("includes the theme name", () => {
    const result = generatePrompt(baseConfig);
    expect(result).toContain("Neo-Brutalism");
  });

  it("includes selected framework and CSS approach", () => {
    const result = generatePrompt(baseConfig);
    expect(result).toContain("Next.js");
    expect(result).toContain("Tailwind");
  });

  it("includes all characteristics", () => {
    const result = generatePrompt(baseConfig);
    expect(result).toContain("Thick black borders (2-4px)");
    expect(result).toContain("Bold, saturated colors");
  });

  it("includes selected components", () => {
    const result = generatePrompt(baseConfig);
    expect(result).toContain("Hero");
    expect(result).toContain("Cards");
  });

  it("includes color values", () => {
    const result = generatePrompt(baseConfig);
    expect(result).toContain("#FF6B6B");
    expect(result).toContain("#4ECDC4");
  });

  it("includes typography fonts", () => {
    const result = generatePrompt(baseConfig);
    expect(result).toContain("Space Grotesk");
    expect(result).toContain("Inter");
  });

  it("handles empty components array", () => {
    const result = generatePrompt({ ...baseConfig, components: [] });
    expect(result).not.toContain("Generate the following components");
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/generatePrompt.test.ts`
Expected: FAIL — module not found

**Step 3: Implement generatePrompt**

Create `src/lib/generatePrompt.ts`:

```typescript
export interface PromptConfig {
  themeName: string;
  characteristics: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  framework: string;
  cssApproach: string;
  components: string[];
  tone: string;
}

export function generatePrompt(config: PromptConfig): string {
  const lines: string[] = [];

  lines.push(
    `You are building a web application using ${config.framework} with ${config.cssApproach}.`
  );
  lines.push(
    `Apply a ${config.themeName} design style with these characteristics:`
  );

  for (const c of config.characteristics) {
    lines.push(`- ${c}`);
  }

  lines.push("");
  lines.push(
    `Color palette: primary ${config.colors.primary}, secondary ${config.colors.secondary}, accent ${config.colors.accent}, background ${config.colors.background}, text ${config.colors.text}`
  );
  lines.push(
    `Typography: ${config.typography.heading} for headings, ${config.typography.body} for body text`
  );
  lines.push(`Tone: ${config.tone}`);

  if (config.components.length > 0) {
    lines.push("");
    lines.push("Generate the following components in this style:");
    for (const comp of config.components) {
      lines.push(`- ${comp}`);
    }
  }

  lines.push("");
  lines.push(
    `Use ${config.cssApproach} utility classes. Ensure responsive design (mobile-first).`
  );

  return lines.join("\n");
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/generatePrompt.test.ts`
Expected: All 7 tests PASS

**Step 5: Commit prompt generation logic**

```bash
git add src/lib/generatePrompt.ts src/lib/generatePrompt.test.ts
git commit -m "feat: add prompt generation logic with tests"
```

**Step 6: Create the PromptBuilder Preact component**

Create `src/components/PromptBuilder.tsx`:

```tsx
import { useState, useCallback } from "preact/hooks";
import { generatePrompt } from "../lib/generatePrompt";

interface Props {
  themeName: string;
  characteristics: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    heading: string;
    body: string;
  };
}

const FRAMEWORKS = ["Next.js", "Astro", "React (Vite)", "Vue", "Svelte", "Plain HTML"];
const CSS_APPROACHES = ["Tailwind", "Vanilla CSS", "CSS Modules"];
const COMPONENTS = ["Hero", "Navbar", "Footer", "Cards", "Forms", "Buttons", "Tables", "Sidebar"];
const TONES = ["Professional", "Playful", "Minimal"];

export default function PromptBuilder({ themeName, characteristics, colors, typography }: Props) {
  const [framework, setFramework] = useState(FRAMEWORKS[0]);
  const [cssApproach, setCssApproach] = useState(CSS_APPROACHES[0]);
  const [selectedComponents, setSelectedComponents] = useState<string[]>(["Hero", "Cards"]);
  const [tone, setTone] = useState(TONES[0]);
  const [copied, setCopied] = useState(false);

  const toggleComponent = (comp: string) => {
    setSelectedComponents((prev) =>
      prev.includes(comp) ? prev.filter((c) => c !== comp) : [...prev, comp]
    );
  };

  const prompt = generatePrompt({
    themeName,
    characteristics,
    colors,
    typography,
    framework,
    cssApproach,
    components: selectedComponents,
    tone,
  });

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [prompt]);

  return (
    <div class="rounded-lg border border-gray-200 bg-white p-6">
      <h2 class="text-lg font-semibold text-gray-900">Prompt Builder</h2>
      <p class="mt-1 text-sm text-gray-500">
        Configure your project settings and copy the generated prompt.
      </p>

      <div class="mt-6 grid gap-6 sm:grid-cols-2">
        {/* Framework */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Framework</label>
          <select
            value={framework}
            onChange={(e) => setFramework((e.target as HTMLSelectElement).value)}
            class="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            {FRAMEWORKS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* CSS Approach */}
        <div>
          <label class="block text-sm font-medium text-gray-700">CSS Approach</label>
          <select
            value={cssApproach}
            onChange={(e) => setCssApproach((e.target as HTMLSelectElement).value)}
            class="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            {CSS_APPROACHES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Tone */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone((e.target as HTMLSelectElement).value)}
            class="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            {TONES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Components multi-select */}
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700">Components</label>
        <div class="mt-2 flex flex-wrap gap-2">
          {COMPONENTS.map((comp) => (
            <button
              key={comp}
              onClick={() => toggleComponent(comp)}
              class={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                selectedComponents.includes(comp)
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {comp}
            </button>
          ))}
        </div>
      </div>

      {/* Generated prompt */}
      <div class="mt-6">
        <div class="flex items-center justify-between">
          <label class="block text-sm font-medium text-gray-700">Generated Prompt</label>
          <button
            onClick={copyToClipboard}
            class="rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
        <pre class="mt-2 max-h-80 overflow-auto rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
          {prompt}
        </pre>
      </div>
    </div>
  );
}
```

**Step 7: Integrate PromptBuilder into the theme detail page**

In `src/pages/themes/[slug].astro`, replace the placeholder div with:

```astro
    {/* Prompt Builder */}
    <div class="mt-12">
      <PromptBuilder
        client:load
        themeName={data.name}
        characteristics={data.characteristics}
        colors={data.colors}
        typography={data.typography}
      />
    </div>
```

And add the import at the top of the frontmatter:

```astro
import PromptBuilder from "../../components/PromptBuilder";
```

**Step 8: Verify the prompt builder works**

Run: `npx astro dev` and visit `http://localhost:4321/themes/neo-brutalism`
Expected: Prompt builder section renders with dropdowns, component pills, live-updating prompt preview, and working copy button.

**Step 9: Commit**

```bash
git add src/components/PromptBuilder.tsx src/pages/themes/\[slug\].astro
git commit -m "feat: add interactive prompt builder to theme detail page"
```

---

### Task 9: About Page

**Files:**
- Create: `src/pages/about.astro`

**Step 1: Create the about page**

Create `src/pages/about.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout title="About" description="What is themx and how to use the generated prompts">
  <div class="mx-auto max-w-3xl px-6 py-16">
    <h1 class="text-3xl font-bold text-gray-900">About themx</h1>

    <div class="mt-8 space-y-6 text-gray-600 leading-relaxed">
      <p>
        <strong class="text-gray-900">themx</strong> is a curated catalog of web design trends and styles.
        Each theme includes visual previews, color palettes, typography recommendations, and key
        characteristics that define the style.
      </p>

      <p>
        The real power is in the <strong class="text-gray-900">prompt builder</strong>. Configure your
        tech stack and desired components, and themx generates a ready-to-use prompt you can paste
        directly into Claude to build your next project in any design style.
      </p>

      <h2 class="text-xl font-semibold text-gray-900 pt-4">How to Use</h2>

      <ol class="list-decimal list-inside space-y-2">
        <li>Browse themes on the homepage or filter by category and year</li>
        <li>Click a theme to see its details — colors, typography, characteristics</li>
        <li>Use the prompt builder to select your framework, CSS approach, and components</li>
        <li>Click "Copy to Clipboard" and paste the prompt into Claude</li>
        <li>Claude will generate code matching that design style</li>
      </ol>

      <h2 class="text-xl font-semibold text-gray-900 pt-4">Categories</h2>

      <ul class="space-y-2">
        <li><strong>Minimalist</strong> — Clean, whitespace-heavy, typography-focused</li>
        <li><strong>Bold</strong> — High contrast, thick borders, attention-grabbing</li>
        <li><strong>Elegant</strong> — Refined, luxurious, sophisticated effects</li>
        <li><strong>Playful</strong> — Fun, colorful, experimental layouts</li>
        <li><strong>Corporate</strong> — Professional, structured, widely adopted</li>
      </ul>
    </div>
  </div>
</BaseLayout>
```

**Step 2: Verify the about page**

Run: `npx astro dev` and visit `http://localhost:4321/about`
Expected: Clean about page with explanation and usage instructions.

**Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add about page"
```

---

### Task 10: Add Remaining Theme MDX Files

**Files:**
- Create: `src/data/themes/glassmorphism.mdx`
- Create: `src/data/themes/swiss-international.mdx`
- Create: `src/data/themes/bento-grid.mdx`
- Create: `src/data/themes/luxury-dark.mdx`
- Create: `src/data/themes/material-design-3.mdx`
- Create: `src/data/themes/maximalism.mdx`
- Create: `src/data/themes/japandi.mdx`
- Create: `src/data/themes/claymorphism.mdx`
- Create: `src/data/themes/retro-y2k.mdx`
- Create: `src/data/themes/scandinavian-clean.mdx`
- Create: `src/data/themes/art-deco.mdx`
- Create: `src/data/themes/memphis-design.mdx`
- Create: `src/data/themes/enterprise-flat.mdx`
- Create: `src/data/themes/apple-inspired.mdx`
- Create: corresponding SVG placeholders in `public/previews/`

Each theme file follows the same frontmatter schema as neo-brutalism. Here are the specifics for each:

**Glassmorphism** (`elegant`, 2024):
- Colors: primary `#7C3AED`, secondary `#EC4899`, accent `#06B6D4`, bg `#0F172A`, text `#F8FAFC`
- Typography: heading `Poppins`, body `Inter`
- Characteristics: frosted glass effect with backdrop-blur, semi-transparent backgrounds (rgba), subtle borders with low opacity white, layered depth with overlapping glass panels, gradient backgrounds behind glass elements, soft shadows for depth

**Swiss/International** (`minimalist`, 2024):
- Colors: primary `#000000`, secondary `#FF0000`, accent `#0057B7`, bg `#FFFFFF`, text `#1A1A1A`
- Typography: heading `Helvetica Neue`, body `Helvetica Neue`
- Characteristics: strict grid-based layouts, heavy use of whitespace, sans-serif typography only, limited color palette (black, white, one accent), asymmetric but balanced compositions, information hierarchy through scale

**Bento Grid** (`playful`, 2026):
- Colors: primary `#18181B`, secondary `#3B82F6`, accent `#F59E0B`, bg `#FAFAFA`, text `#18181B`
- Typography: heading `Inter`, body `Inter`
- Characteristics: asymmetric grid with varied cell sizes, rounded corners on all grid items, subtle hover animations on cells, mix of text/image/icon cells, clear visual grouping, minimal borders using background contrast

**Luxury Dark** (`elegant`, 2025):
- Colors: primary `#D4AF37`, secondary `#C0C0C0`, accent `#8B0000`, bg `#0A0A0A`, text `#E5E5E5`
- Typography: heading `Playfair Display`, body `Lato`
- Characteristics: dark backgrounds with metallic gold accents, serif headings for sophistication, generous letter-spacing, subtle gradient overlays, thin elegant borders, refined micro-interactions

**Material Design 3** (`corporate`, 2024):
- Colors: primary `#6750A4`, secondary `#625B71`, accent `#7D5260`, bg `#FFFBFE`, text `#1C1B1F`
- Typography: heading `Roboto`, body `Roboto`
- Characteristics: dynamic color theming, rounded shapes (fully rounded buttons), elevation with tonal surfaces, motion and transitions, component-based architecture, accessible contrast ratios

**Step 1: Create all theme MDX files**

Create each MDX file with proper frontmatter matching the schema, unique content in the MDX body describing the style, its history, and usage guidance. Follow the neo-brutalism template.

**Step 2: Create SVG placeholder previews for each theme**

Create an SVG for each theme in `public/previews/` that uses the theme's own colors and visual style to give a rough preview.

**Step 3: Verify all themes load on homepage**

Run: `npx astro dev`
Expected: Homepage grid shows all themes. Each theme's detail page loads correctly.

**Step 4: Verify build succeeds**

Run: `npx astro build`
Expected: Build generates static pages for all themes without errors.

**Step 5: Commit**

```bash
git add src/data/themes/ public/previews/
git commit -m "feat: add all initial theme content (15 themes across 5 categories)"
```

---

### Task 11: Final Polish and Build Verification

**Files:**
- Create: `public/favicon.svg`
- Modify: `package.json` (add scripts)

**Step 1: Create favicon**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#111827"/>
  <text x="16" y="23" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="white">tx</text>
</svg>
```

**Step 2: Add npm scripts**

Ensure `package.json` has:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run"
  }
}
```

**Step 3: Run full test suite**

Run: `npm test`
Expected: All tests pass.

**Step 4: Run production build**

Run: `npm run build`
Expected: Build completes. Static files in `dist/`.

**Step 5: Preview production build**

Run: `npm run preview`
Expected: Site works at `http://localhost:4321`, all pages load, filters work, prompt builder works, copy button works.

**Step 6: Commit**

```bash
git add public/favicon.svg package.json
git commit -m "feat: add favicon and finalize build scripts"
```
