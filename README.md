# themx

themx is a static catalog of 36 web design themes. It includes searchable theme cards, browser-local favorites, interactive component previews, theme comparison, a configurable prompt builder, and CSS/JSON exports.

## Local development

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro with the `/themx/` base path.

```sh
npm test
npm run build
npm run check
npm run preview
```

`npm run check` runs tests and the production build. The repository does not have a separate lint command.

## Theme content

Themes are MDX files in `src/data/themes/`. Each theme declares its design type, use cases, unsuitable uses, layout rules, interaction rules, palette, typography, and style tokens. The schema is in `src/content.config.ts`. Static thumbnails are in `public/previews/`.

Design types are visual style, visual effect, layout pattern, color mode, and design system. Reference years are catalog labels, not origin dates.

## Previews and prompts

Live previews run in isolated iframe documents. They show the same sample content with interactive navigation, buttons, cards, and form validation. The form does not send data. Motion examples respect `prefers-reduced-motion`. Previews demonstrate component styling; they do not implement a full design system or a complete 3D scene.

The prompt builder includes the project brief, target users, page purpose, framework, CSS approach, selected components, exact CSS variables, and behavior rules. Optional layers apply in this order:

1. A layout pattern changes content arrangement.
2. A visual effect changes background images, card surfaces, borders, radius, shadows, blur, and optional image filters.
3. A color mode changes palette, surface colors, input colors, and text colors. Translucent card opacity is preserved.

The base typography remains unchanged. The combined preview and exports use the resolved values. CSS exports contain variable declarations. JSON exports contain colors, typography, tokens, CSS variables, and behavior rules. Load the declared fonts and apply the variables to your own components.

Risograph / Print and Duotone include before-and-after image previews. Their optional `mediaEffect` metadata defines two ink colors. Risograph also defines static grain and an ink registration offset. These themes offer an SVG filter export. Add the SVG definition once to your page and apply `filter: var(--tx-media-filter)` to selected images or illustrations. Keep text and controls unfiltered. JSON export and generated prompts include the same filter definition. Color mode layers change interface colors while preserving image ink colors. Selecting another visual effect replaces the previous image treatment.

## Deployment

The GitHub Actions workflow builds the static site and deploys it to GitHub Pages at `/themx/`. Internal links use Astro's configured base path. Comparison selections are stored in the URL, so comparison links can be shared.
