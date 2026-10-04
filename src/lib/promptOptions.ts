import type { UseCase } from "./themeCatalog";

export const FRAMEWORKS = ["Next.js", "Astro", "React (Vite)", "Vue", "Svelte", "Plain HTML"] as const;
export const CSS_APPROACHES = ["Tailwind", "Vanilla CSS", "CSS Modules"] as const;
export const COMPONENTS = ["Hero", "Navbar", "Footer", "Cards", "Forms", "Buttons", "Tables", "Sidebar"] as const;
export const TONES = ["Professional", "Playful", "Minimal"] as const;

export const UI_LIBRARIES = {
  custom: { label: "Custom / no library", description: "Use your own components with the exported CSS variables." },
  daisyui: { label: "daisyUI", description: "Tailwind CSS 4 and daisyUI 5 components with a custom theme." },
  shadcn: { label: "shadcn/ui", description: "React components with semantic theme tokens and Tailwind CSS 4." },
} as const;
export type UiLibrary = keyof typeof UI_LIBRARIES;

export function supportsLibrary(library: UiLibrary, framework: string): boolean {
  return library !== "shadcn" || framework === "Next.js" || framework === "React (Vite)";
}

export const TASK_MODES = {
  build: "Build new UI",
  update: "Improve existing UI",
  audit: "Audit existing UI",
} as const;
export type TaskMode = keyof typeof TASK_MODES;

export const OUTPUT_MODES = {
  ui: "UI prompt",
  "design-prompt": "Prompt for DESIGN.md",
  "agents-prompt": "Prompt for AGENTS.md",
  "design-md": "DESIGN.md",
  "agents-md": "AGENTS.md section",
} as const;
export type OutputMode = keyof typeof OUTPUT_MODES;

export const SKILL_CHOICES = {
  library: "Official library skill",
  antislop: "Anti-slop",
  "frontend-design": "Frontend Design",
} as const;
export type SkillChoice = keyof typeof SKILL_CHOICES;

interface SkillReference {
  name: string;
  url: string;
  install: string;
  purpose: string;
}

export function getSkillReferences(choices: SkillChoice[], library: UiLibrary): SkillReference[] {
  const references: SkillReference[] = [];
  if (choices.includes("library") && library !== "custom") {
    references.push(library === "daisyui" ? {
      name: "daisyUI", url: "https://daisyui.com/skills/daisyui/",
      install: "npx skills add saadeghi/daisyui",
      purpose: "Use daisyUI components and its custom theme API.",
    } : {
      name: "shadcn/ui", url: "https://ui.shadcn.com/docs/skills",
      install: "npx skills add shadcn/ui",
      purpose: "Read components.json and reuse installed shadcn/ui components.",
    });
  }
  if (choices.includes("antislop")) references.push({
    name: "Anti-slop", url: "https://github.com/miqdadbadjuber/anti-slop",
    install: "npx skills add miqdadbadjuber/anti-slop",
    purpose: "Check content, controls, and decoration against the selected design direction.",
  });
  if (choices.includes("frontend-design")) references.push({
    name: "Frontend Design", url: "https://github.com/anthropics/skills/tree/main/skills/frontend-design",
    install: "npx skills add anthropics/skills --skill frontend-design",
    purpose: "Resolve unspecified visual decisions while preserving the selected theme and tokens.",
  });
  return references;
}

export function recommendedComponents(useCase: UseCase): string[] {
  if (useCase === "dashboard" || useCase === "developer") return ["Sidebar", "Tables", "Forms"];
  if (useCase === "ecommerce") return ["Navbar", "Cards", "Buttons", "Forms"];
  if (useCase === "editorial" || useCase === "education") return ["Navbar", "Footer"];
  return ["Hero", "Navbar", "Cards", "Footer"];
}

export const PROJECT_EXAMPLES = {
  inventory: {
    label: "Inventory dashboard", useCase: "dashboard" as UseCase,
    brief: "An inventory dashboard with searchable stock levels, low-stock alerts, and a form to update stock. Use clearly labeled sample data until a real data source is connected.",
    audience: "Warehouse operators using tablets",
  },
  product: {
    label: "Product page", useCase: "ecommerce" as UseCase,
    brief: "A product page with an image gallery, product details, size selection, and an add-to-cart action. Mark sample product data clearly. Show unavailable sizes and cart feedback.",
    audience: "Shoppers using phones and laptops",
  },
} as const;
