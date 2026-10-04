# themx

themx is a static catalog of 38 web design themes. It includes searchable theme cards, browser-local favorites, interactive component previews, theme comparison, a configurable prompt builder, design documents, and CSS/JSON exports. Astra and Galaxy add two space-themed visual directions.

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

The prompt builder includes the project brief, target users, page purpose, framework, CSS approach, UI library, selected components, exact CSS variables, suitability notes, and behavior rules. Suggested components follow the page purpose. Inventory dashboard and product page examples provide editable starting points. Optional layers apply in this order:

1. A layout pattern changes content arrangement.
2. A visual effect changes background images, card surfaces, borders, radius, shadows, blur, and optional image filters.
3. A color mode changes palette, surface colors, input colors, and text colors. Translucent card opacity is preserved.

The base typography remains unchanged. Prompts, documents, previews, and exports use the resolved values. Prompts contain one final token set. Additional user requirements remain separate from theme defaults. Load the declared fonts and apply the variables to your components.

Choose custom components, daisyUI, or shadcn/ui as the base. Library mappings target Tailwind CSS 4 and daisyUI 5. shadcn/ui is available for Next.js and React (Vite). Vue, Svelte, Astro, and plain HTML can use custom components or daisyUI. Framework-specific shadcn ports are not included. Selecting a library sets the required CSS approach. Changing to an incompatible framework resets the library to custom components and explains why.

CSS exports include the selected library's semantic token mapping. JSON exports include colors, typography, tokens, CSS variables, behavior rules, and library CSS when selected. Merge library mappings into the target stylesheet after its imports. Preserve existing themes and package versions. The live preview demonstrates themx components, not installed daisyUI or shadcn/ui components.

## Prompt and document outputs

The UI prompt supports building new UI, improving existing UI, and auditing existing UI. Audit prompts request findings without edits. Other outputs generate prompts for DESIGN.md and AGENTS.md, a downloadable DESIGN.md, or an AGENTS.md section. The AGENTS.md section references DESIGN.md. Add it to existing project instructions rather than replacing them. Commands and code paths must come from the target repository.

Optional supporting skills include the selected library's official skill, Anti-slop, and Frontend Design. Outputs include source links, installation references, and usage instructions. themx does not install skills or claim they are active. Anti-slop has an explicit during/after choice. Frontend Design resolves unspecified choices while preserving the selected theme. Skill conflicts with intentional theme choices must be reported.

Use Save setup to keep the builder configuration in this browser. Saving is explicit and does not upload the project brief. Download setup exports JSON that can be imported on the same theme page. Reset setup removes only that theme's saved prompt setup. Favorites and the applied site theme remain separate.

The tests use jsdom localStorage. This keeps browser tests independent of Node's own Web Storage implementation.

Risograph / Print and Duotone include before-and-after image previews. Their optional `mediaEffect` metadata defines two ink colors. Risograph also defines static grain and an ink registration offset. These themes offer an SVG filter export. Add the SVG definition once to your page and apply `filter: var(--tx-media-filter)` to selected images or illustrations. Keep text and controls unfiltered. JSON export and generated prompts include the same filter definition. Color mode layers change interface colors while preserving image ink colors. Selecting another visual effect replaces the previous image treatment.

## Deployment

The GitHub Actions workflow builds the static site and deploys it to GitHub Pages at `/themx/`. Internal links use Astro's configured base path. Comparison selections are stored in the URL, so comparison links can be shared.
