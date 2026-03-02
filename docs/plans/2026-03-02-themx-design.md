# themx Design Document

**Date:** 2026-03-02
**Status:** Approved

## Overview

themx is a web design theme/style showcase that catalogs trending web design styles (neo-brutalism, minimalism, glassmorphism, etc.) organized by category and year. Each theme includes static visual previews, detailed descriptions, and a configurable prompt builder that generates ready-to-use prompts for Claude to reproduce that design style in new projects.

## Tech Stack

- **Framework:** Astro 5 (static site generation)
- **Styling:** Tailwind CSS 4
- **Interactive islands:** Preact (for prompt builder component)
- **Content:** Astro Content Collections with MDX files
- **Hosting:** Static deployment (TBD)

## Architecture: Flat Catalog

### Pages

- **`/`** — Homepage with hero section, filterable grid of theme cards. Filters by category and year. Cards show: preview thumbnail, theme name, category badge, tagline.
- **`/themes/[slug]`** — Theme detail page with large preview image(s), full description, color palette swatches, characteristics list, and the configurable prompt builder.
- **`/about`** — What themx is and how to use the generated prompts.

### Why Flat Catalog

- Plays to Astro's strengths (static pages per theme = great SEO and shareability)
- Each theme gets its own URL for bookmarking/sharing
- Simple architecture, scales well with more themes
- Prompt builder is a focused interactive island on the detail page

## Theme Data Model

Each theme is an MDX file in `src/content/themes/` with this frontmatter:

```yaml
name: "Neo-Brutalism"
slug: "neo-brutalism"
category: "bold"            # minimalist | bold | elegant | playful | corporate
year: 2025
tags: ["high-contrast", "thick-borders", "raw", "chunky"]
preview: "./previews/neo-brutalism.png"
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
  - "Thick black borders (2-4px)"
  - "Bold, saturated colors"
  - "Visible box shadows offset to one side"
  - "Chunky buttons with hover transforms"
  - "Raw, unpolished aesthetic"
```

MDX body contains the detailed description of the style.

### Initial Theme List

| Category | Themes |
|----------|--------|
| Bold | Neo-Brutalism, Maximalism, Retro/Y2K |
| Minimalist | Swiss/International, Japandi, Scandinavian Clean |
| Elegant | Glassmorphism, Luxury Dark, Art Deco |
| Playful | Bento Grid, Claymorphism, Memphis Design |
| Corporate | Enterprise Flat, Material Design 3, Apple-inspired |

## Configurable Prompt Builder

A Preact island on each theme detail page that builds a copy-ready prompt.

### Configuration Options

| Option | Type | Values |
|--------|------|--------|
| Framework | Select | Astro, Next.js, plain HTML, React (Vite), Vue, Svelte |
| CSS approach | Select | Tailwind, vanilla CSS, CSS Modules |
| Components | Multi-select | Hero, Navbar, Footer, Cards, Forms, Buttons, Tables, Sidebar |
| Color override | Optional | Tweak the theme's default colors |
| Tone | Select | Professional, Playful, Minimal |

### Generated Prompt Format

```
You are building a web application using {framework} with {css_approach}.
Apply a {theme_name} design style with these characteristics:
{characteristics list}
Color palette: {colors}
Typography: {typography}

Generate the following components in this style:
{selected components list}

Use {css_approach} utility classes. Ensure responsive design (mobile-first).
```

### UX

- User adjusts options, prompt preview updates in real-time
- "Copy to Clipboard" button
- Prompt is displayed in a styled code block

## Visual Design

### Site Theme

Clean, neutral base that doesn't compete with theme previews. White/light gray background, crisp typography, generous whitespace. The themes are the star — the site is the frame.

### Homepage

- Clean hero: "themx" logo, tagline, subtle gradient or animated accent
- Horizontal pill filter bar: categories + year dropdown
- Responsive grid of theme cards with hover effects
- Cards link to detail pages

### Theme Detail Page

- Large preview image at top
- Theme name + category + year badges
- Description section (from MDX body)
- Key characteristics list
- Color palette swatches (rendered from frontmatter)
- Prompt builder section (interactive Preact island)

### Responsive

Mobile-first. Cards stack to single column on mobile. Prompt builder remains usable on small screens.

## Audience

Start as a personal tool, designed well enough to go public. Clean design, good SEO per-theme, shareable URLs.
