import type { StyleTokens } from "./themeStorage";
import type { MediaEffect, ThemeDefinition, ThemeKind } from "./themeCatalog";
import { resolveThemeStyle } from "./themeCatalog";
import { exportLibraryCSS } from "./themeExport";
import { exportMediaEffectSVG } from "./mediaEffect";
import { getSkillReferences, supportsLibrary, UI_LIBRARIES } from "./promptOptions";
import type { OutputMode, SkillChoice, TaskMode, UiLibrary } from "./promptOptions";

export interface PromptConfig {
  themeName: string;
  themeKind?: ThemeKind;
  characteristics: string[];
  colors: ThemeDefinition["colors"];
  typography: ThemeDefinition["typography"];
  framework: string;
  cssApproach: string;
  components: string[];
  tone: string;
  brief?: string;
  audience?: string;
  useCase?: string;
  avoidFor?: string[];
  styleTokens?: StyleTokens;
  layoutRules?: string[];
  interactionRules?: string[];
  layoutNotes?: string;
  interactionNotes?: string;
  layers?: ThemeDefinition[];
  mediaEffect?: MediaEffect;
  uiLibrary?: UiLibrary;
  taskMode?: TaskMode;
  outputMode?: OutputMode;
  skills?: SkillChoice[];
  antislopMode?: "during" | "after";
}

export function resolvePromptDesign(config: PromptConfig) {
  const layers = config.layers ?? [];
  const layout = layers.filter((layer) => layer.kind === "layout-pattern").at(-1);
  return {
    ...resolveThemeStyle(config, layers), typography: config.typography,
    layoutRules: layout?.layoutRules ?? config.layoutRules ?? [],
    interactionRules: [...new Set([...(config.interactionRules ?? []), ...layers.flatMap((layer) => layer.interactionRules)])],
  };
}

function libraryInstructions(library: UiLibrary): string[] {
  if (library === "custom") return [
    "Use the CSS variables in your own components. Apply the heading and body font variables to their respective elements.",
  ];
  const shared = [
    "The mapping targets Tailwind CSS 4. Merge it into the existing Tailwind stylesheet after its imports.",
    "Read installed package versions first. Ask before migrating an existing project to a different major version.",
    "Use library components for controls. Apply the --tx-* surface, shadow, blur, and font values where the library tokens do not cover them.",
    "This export describes one selected color mode. Preserve any other supported modes and scope these tokens to the intended mode.",
  ];
  return library === "daisyui" ? [...shared,
    "Use daisyUI 5 component classes such as btn, input, card, and table. Activate the custom theme with data-theme=\"themx\".",
    "Keep status colors separate from brand accents. Preserve existing themes when merging the example plugin configuration.",
    "Reference: https://daisyui.com/docs/themes/",
  ] : [...shared,
    "Read components.json and reuse installed shadcn/ui components. Use semantic classes such as bg-background and text-foreground.",
    "Merge the tokens with existing :root or color-mode selectors. Preserve unrelated chart tokens and component configuration.",
    "Reference: https://ui.shadcn.com/docs/theming",
  ];
}

function skillInstructions(config: PromptConfig, session = true): string[] {
  const references = getSkillReferences(config.skills ?? [], config.uiLibrary ?? "custom");
  if (!references.length) return [];
  const lines = ["", "## Supporting skills", "Use these skills if they are installed in the target agent. If unavailable, report that and follow the supplied design requirements. Installation commands are references for the user; do not run them automatically."];
  for (const skill of references) {
    lines.push(`- ${skill.name}: ${skill.url}`, `  Purpose: ${skill.purpose}`, `  Install: ${skill.install}`);
  }
  if (config.skills?.includes("antislop")) {
    const mode = config.antislopMode ?? (config.taskMode === "audit" ? "after" : "during");
    lines.push(session ? `Use antislop ${mode} for this session.` : `Suggested session instruction: "Use antislop ${mode} for this session."`);
    lines.push("The chosen theme and layers are intentional. Check their purpose and implementation. If a skill rule conflicts with them, identify the conflict and ask the user to keep or change the named element.");
  }
  if (config.skills?.includes("frontend-design")) lines.push("Use Frontend Design only for unspecified decisions. Keep the chosen theme, typography, and resolved tokens.");
  return lines;
}

function designSections(config: PromptConfig): string[] {
  const design = resolvePromptDesign(config);
  const layers = config.layers ?? [];
  const library = config.uiLibrary ?? "custom";
  const lines = [
    "## Project", `Project brief: ${config.brief?.trim() || "Not specified"}`,
    `Target users: ${config.audience?.trim() || "Not specified"}`,
    `Page purpose: ${config.useCase || "Not specified"}`,
    `Framework: ${config.framework}`, `CSS approach: ${config.cssApproach}`,
    `UI library: ${UI_LIBRARIES[library].label}`, `Tone: ${config.tone}`,
    "", "## Visual direction", `Base theme: ${config.themeName}${config.themeKind ? ` (${config.themeKind})` : ""}`,
    ...config.characteristics.map((rule) => `- ${rule}`),
  ];
  if (layers.length) {
    lines.push("", "Selected layers:");
    for (const layer of layers) lines.push(`- ${layer.name}: ${layer.kind.replace(/-/g, " ")}`);
    lines.push("The selected layout replaces the base layout rules. The selected visual effect replaces base surface treatments. The selected color mode replaces the palette. Base typography stays unchanged.");
  }
  lines.push("", "## Resolved style",
    "Use this final token set. It already includes the selected layers. These values take precedence over conflicting base characteristics.",
    `Color palette: primary ${design.colors.primary}, secondary ${design.colors.secondary}, accent ${design.colors.accent}, background ${design.colors.background}, text ${design.colors.text}`,
    `Typography: ${design.typography.heading} for headings, ${design.typography.body} for body text`,
    "Load the declared fonts with the required weights. Use system fallbacks when a font is unavailable.",
    "```css", exportLibraryCSS(design, library).trim(), "```",
    ...libraryInstructions(library),
    "", "## Layout", ...design.layoutRules.map((rule) => `- ${rule}`),
    "", "## Interaction", ...design.interactionRules.map((rule) => `- ${rule}`));
  if (config.layoutNotes?.trim() || config.interactionNotes?.trim()) {
    lines.push("", "## Additional user requirements",
      "These explicit requirements take precedence over general layout and interaction defaults. Report any conflict with exact tokens before changing them.");
    if (config.layoutNotes?.trim()) lines.push(`Layout: ${config.layoutNotes.trim()}`);
    if (config.interactionNotes?.trim()) lines.push(`Interaction: ${config.interactionNotes.trim()}`);
  }
  if (config.avoidFor?.length || layers.some((layer) => layer.avoidFor.length)) {
    lines.push("", "## Suitability notes", "Use these limitations to assess the chosen page purpose. Explain any mismatch before applying an unsuitable treatment.");
    for (const reason of config.avoidFor ?? []) lines.push(`- ${config.themeName}: ${reason}`);
    for (const layer of layers) for (const reason of layer.avoidFor) lines.push(`- ${layer.name}: ${reason}`);
  }
  if (design.mediaEffect) lines.push("", "## Image treatment",
    `Image treatment: ${design.mediaEffect.kind}. Use ink colors ${design.mediaEffect.ink1} and ${design.mediaEffect.ink2}.`,
    "Add this SVG filter definition once. Apply filter: var(--tx-media-filter) to images and illustrations only. Keep text and controls unfiltered.",
    "```svg", exportMediaEffectSVG(design.mediaEffect), "```");
  if (config.components.length) {
    lines.push("", "## Components");
    if ((config.outputMode ?? "ui") === "ui" && config.taskMode !== "audit") lines.push("Generate the following components in this style:");
    lines.push(...config.components.map((component) => `- ${component}`));
  }
  lines.push("", "## Quality requirements",
    "Choose section order and visual emphasis from the real content and page purpose. Add only sections needed for the task.",
    "Use supplied content. Label sample data. Do not invent testimonials, customer logos, statistics, or compliance claims.",
    "Every interactive control must perform its declared action or be clearly labeled as a demo.",
    "Include loading, empty, error, success, disabled, and focus states where applicable.",
    "Use semantic HTML, visible keyboard focus, readable text contrast, and labeled form fields.",
    "Ensure responsive design (mobile-first). Preserve reading order and avoid horizontal page overflow.",
    "Respect prefers-reduced-motion. Keep essential content visible when animations are disabled.");
  return lines;
}

export function generatePrompt(config: PromptConfig): string {
  const library = config.uiLibrary ?? "custom";
  if (!supportsLibrary(library, config.framework)) throw new Error("shadcn/ui requires Next.js or React (Vite). Use a framework-specific port for other frameworks.");
  if (library !== "custom" && config.cssApproach !== "Tailwind") throw new Error("The selected UI library requires Tailwind.");
  const output = config.outputMode ?? "ui";
  const mode = config.taskMode ?? "build";
  if (output === "agents-md") return [
    "## UI design", "For UI work, read DESIGN.md and the existing project instructions before editing.",
    "Follow the chosen theme, final tokens, layout, and interaction rules in DESIGN.md. Report conflicts instead of silently replacing the design direction.",
    `Use ${UI_LIBRARIES[library].label} with ${config.framework} and ${config.cssApproach}. Reuse existing components and installed packages.`,
    "Inspect the target repository for actual commands and file locations. Run the relevant checks before claiming completion.",
    "Keep changes scoped to the requested UI work. Preserve unrelated behavior and user changes.",
    "If DESIGN.md is missing, obtain the selected design direction before making visual decisions.",
    ...skillInstructions(config, false),
  ].join("\n");
  const sections = designSections(config);
  if (output === "design-md") return ["# Design direction", "", ...sections, ...skillInstructions(config, false)].join("\n");
  if (output === "design-prompt") return [
    "Create or update DESIGN.md for the target project using the design data below.",
    "Read existing project and design documents first. Preserve unrelated requirements. Explain conflicts with the selected direction.",
    "Document the project purpose, users, final tokens, fonts, library mapping, layout, interactions, and quality requirements. Mark unspecified fields clearly.",
    "Keep the document in plain English. Do not implement application code or invent product facts.",
    "", ...sections, ...skillInstructions(config, false),
  ].join("\n");
  if (output === "agents-prompt") return [
    "Add a scoped UI design section to the target project's applicable AGENTS.md.",
    "Read the existing AGENTS.md, DESIGN.md, package scripts, and relevant code first. Preserve existing instructions and unrelated sections.",
    "Reference DESIGN.md for visual direction. Use actual repository commands and file paths. Do not invent them.",
    "If DESIGN.md is missing, propose its content from the supplied data and report the missing file. Do not add a reference that claims it already exists.",
    "Keep the addition in plain English. Do not implement application code.",
    "", ...sections, ...skillInstructions(config, false),
  ].join("\n");
  const opening = mode === "audit" ? [
    "Audit the existing UI against the supplied design requirements. Do not edit files or install packages.",
    "Read the scoped implementation. Report concrete findings with file references, impact, and proposed corrections. Separate verified issues from assumptions.",
  ] : mode === "update" ? [
    `Improve the existing UI using ${config.framework} with ${config.cssApproach}.`,
    "Read the scoped implementation and project instructions first. Reuse existing components. Preserve unrelated behavior, routes, data access, and user changes.",
  ] : [`You are building a web application using ${config.framework} with ${config.cssApproach}.`,
    "Read existing project instructions and reuse installed components where available."];
  const ending = ["", "## Verification", "Check representative desktop and mobile widths, keyboard interaction, and relevant component states. Run available project checks and report what was actually verified."];
  if (config.cssApproach === "Tailwind") ending.push("Use Tailwind utility classes with the declared tokens.");
  else ending.push(`Use ${config.cssApproach}.`);
  if (!config.brief?.trim() || !config.audience?.trim()) ending.push("Product context is incomplete. Label assumptions and treat the result as a draft until the missing context is supplied.");
  return [...opening, "", ...sections, ...skillInstructions(config), ...ending].join("\n");
}
