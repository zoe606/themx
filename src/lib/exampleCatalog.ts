import type { ThemeDefinition } from "./themeCatalog";
import { createPromptSetup, resolvePromptSetup } from "./promptSetup";
import type { PromptSetup } from "./promptSetup";

export const EXAMPLES = [
  {
    slug: "astra-inventory", title: "Astra inventory dashboard", themeSlug: "astra", preset: "inventory",
    summary: "Search stock, filter low quantities, and update one sample item.",
    setup: { framework: "Plain HTML", cssApproach: "Tailwind", uiLibrary: "daisyui", useCase: "dashboard", components: ["Sidebar", "Tables", "Forms", "Buttons"],
      brief: "Build a responsive inventory dashboard called Relay. Include a navigation sidebar, a searchable sample stock table, a low-stock filter, and a form that updates a sample quantity. Derive summary counts from the sample dataset. Include validation, empty results, loading, and success feedback. Label all data as demo content and keep changes local to the page.",
      audience: "Warehouse operators using tablets and laptops", layoutNotes: "Keep stock levels prominent. Use one orbital illustration beside the heading. Stack panels on phones and keep wide tables in a labeled scroll region.", interactionNotes: "Search and filters must update the table. Validate whole-number quantities. Provide a reset action and visible confirmation for local demo updates.", skills: ["library", "antislop"],
    } as Partial<PromptSetup>,
  },
  {
    slug: "enterprise-product", title: "Enterprise Flat product page", themeSlug: "enterprise-flat", preset: "product",
    summary: "Switch product views, choose an available size, and update a local demo bag.",
    setup: { framework: "React (Vite)", cssApproach: "Tailwind", uiLibrary: "shadcn", useCase: "ecommerce", components: ["Navbar", "Cards", "Buttons", "Forms"],
      brief: "Build a sample product page for Field Goods with a fictional graphite canvas overshirt. Include front, back, and detail illustrations, size selection with M unavailable, a quantity field, and a local demo bag. Use a clearly labeled $48 demo price. Include missing-size and invalid-quantity feedback, an adding state, a success message, an empty bag, and a clear-bag action. Do not include checkout or real stock claims.",
      audience: "Shoppers using phones and laptops", layoutNotes: "Use a two-column product layout with a larger gallery on the left. Stack gallery and details on phones. Keep product facts and choices near the add action.", interactionNotes: "All gallery views must change the illustration. Keep unavailable sizes disabled. Make bag totals match the selected quantities. Use React state and installed shadcn/ui controls.", skills: ["library", "antislop"],
    } as Partial<PromptSetup>,
  },
  {
    slug: "galaxy-portfolio", title: "Galaxy creative portfolio", themeSlug: "galaxy", preset: "portfolio",
    summary: "Filter fictional design studies and open keyboard-accessible project details.",
    setup: { framework: "Plain HTML", cssApproach: "Vanilla CSS", uiLibrary: "custom", useCase: "portfolio", components: ["Hero", "Navbar", "Cards", "Buttons", "Footer"],
      brief: "Build a sample portfolio called Galaxy Studies with three fictional design projects: an interface library, a visual identity, and an editorial layout. Use a large asymmetric introduction with an orbital illustration. Include category filters and a project-details dialog. Label the portfolio as sample work. Do not invent clients, testimonials, awards, or performance statistics.",
      audience: "Visitors exploring design work on phones and laptops", layoutNotes: "Give the interface project more space than the other studies. Keep the reading order continuous on mobile. Use opaque project panels and one static nebula near the orbital art.", interactionNotes: "Filters must hide unrelated projects and report the visible count. The detail dialog must support keyboard close and restore focus. Keep orbital motion optional.", skills: ["antislop", "frontend-design"],
    } as Partial<PromptSetup>,
  },
] as const;

export function resolveExample(example: typeof EXAMPLES[number], themes: ThemeDefinition[]) {
  const theme = themes.find((item) => item.slug === example.themeSlug);
  if (!theme) throw new Error(`Example theme is missing: ${example.themeSlug}`);
  const setup = { ...createPromptSetup(theme), ...example.setup, taskMode: "build", outputMode: "ui" } as PromptSetup;
  return { ...example, theme, setup, ...resolvePromptSetup(theme, themes, setup) };
}
