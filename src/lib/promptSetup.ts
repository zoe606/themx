import type { ThemeDefinition, UseCase } from "./themeCatalog";
import { composeTheme, USE_CASE_LABELS } from "./themeCatalog";
import type { PromptConfig } from "./generatePrompt";
import { COMPONENTS, CSS_APPROACHES, FRAMEWORKS, OUTPUT_MODES, recommendedComponents, SKILL_CHOICES, supportsLibrary, TASK_MODES, TONES, UI_LIBRARIES } from "./promptOptions";
import type { OutputMode, SkillChoice, TaskMode, UiLibrary } from "./promptOptions";

export const LAYER_KINDS = ["layout-pattern", "visual-effect", "color-mode"] as const;
export type LayerKind = typeof LAYER_KINDS[number];

export interface PromptSetup {
  version: 1;
  themeSlug: string;
  framework: string;
  cssApproach: string;
  uiLibrary: UiLibrary;
  components: string[];
  tone: string;
  brief: string;
  audience: string;
  useCase: UseCase;
  layoutNotes: string;
  interactionNotes: string;
  layerSlugs: Partial<Record<LayerKind, string>>;
  taskMode: TaskMode;
  outputMode: OutputMode;
  skills: SkillChoice[];
  antislopMode: "during" | "after";
}

export function createPromptSetup(theme: ThemeDefinition): PromptSetup {
  return {
    version: 1, themeSlug: theme.slug, framework: FRAMEWORKS[0], cssApproach: CSS_APPROACHES[0],
    uiLibrary: "custom", components: recommendedComponents(theme.useCases[0]), tone: TONES[0],
    brief: "", audience: "", useCase: theme.useCases[0], layoutNotes: "", interactionNotes: "",
    layerSlugs: {}, taskMode: "build", outputMode: "ui", skills: [], antislopMode: "during",
  };
}

export function resolvePromptSetup(theme: ThemeDefinition, themes: ThemeDefinition[], setup: PromptSetup) {
  const layers = LAYER_KINDS.flatMap((kind) => {
    const layer = themes.find((item) => item.slug === setup.layerSlugs[kind] && item.kind === kind);
    return layer ? [layer] : [];
  });
  const config: PromptConfig = {
    ...setup, themeName: theme.name, themeKind: theme.kind, characteristics: theme.characteristics,
    colors: theme.colors, typography: theme.typography, styleTokens: theme.styleTokens,
    mediaEffect: theme.mediaEffect, avoidFor: theme.avoidFor,
    layoutRules: theme.layoutRules, interactionRules: theme.interactionRules,
    useCase: USE_CASE_LABELS[setup.useCase], layers,
  };
  return { layers, composed: composeTheme(theme, layers), config };
}

export function parsePromptSetup(text: string, theme: ThemeDefinition, themes: ThemeDefinition[]): PromptSetup {
  const value = JSON.parse(text);
  if (!value || typeof value !== "object" || value.version !== 1 || value.themeSlug !== theme.slug) {
    throw new Error("This setup belongs to another theme or an unsupported format.");
  }
  const allowed: Record<string, readonly string[]> = {
    framework: FRAMEWORKS, cssApproach: CSS_APPROACHES, uiLibrary: Object.keys(UI_LIBRARIES),
    tone: TONES, useCase: Object.keys(USE_CASE_LABELS), taskMode: Object.keys(TASK_MODES),
    outputMode: Object.keys(OUTPUT_MODES), antislopMode: ["during", "after"],
  };
  for (const [key, values] of Object.entries(allowed)) {
    if (!values.includes(value[key])) throw new Error(`Invalid ${key} in the saved setup.`);
  }
  for (const key of ["brief", "audience", "layoutNotes", "interactionNotes"]) {
    if (typeof value[key] !== "string") throw new Error(`Invalid ${key} in the saved setup.`);
  }
  if (!Array.isArray(value.components) || value.components.some((item: unknown) => typeof item !== "string" || !COMPONENTS.includes(item as typeof COMPONENTS[number]))) {
    throw new Error("Invalid components in the saved setup.");
  }
  if (!Array.isArray(value.skills) || value.skills.some((item: unknown) => typeof item !== "string" || !Object.keys(SKILL_CHOICES).includes(item))) {
    throw new Error("Invalid skills in the saved setup.");
  }
  if (!supportsLibrary(value.uiLibrary, value.framework) || (value.uiLibrary !== "custom" && value.cssApproach !== "Tailwind")) {
    throw new Error("The saved library is incompatible with its framework or CSS approach.");
  }
  if (!value.layerSlugs || typeof value.layerSlugs !== "object" || Array.isArray(value.layerSlugs)) {
    throw new Error("Invalid design layers in the saved setup.");
  }
  const layerSlugs: PromptSetup["layerSlugs"] = {};
  for (const kind of LAYER_KINDS) {
    const slug = value.layerSlugs[kind];
    if (slug && !themes.some((item) => item.slug === slug && item.kind === kind && item.slug !== theme.slug)) {
      throw new Error("A saved design layer is unavailable in this catalog.");
    }
    if (slug) layerSlugs[kind] = slug;
  }
  return {
    ...createPromptSetup(theme), framework: value.framework, cssApproach: value.cssApproach,
    uiLibrary: value.uiLibrary, components: [...new Set<string>(value.components)], tone: value.tone,
    brief: value.brief, audience: value.audience, useCase: value.useCase,
    layoutNotes: value.layoutNotes, interactionNotes: value.interactionNotes, layerSlugs,
    taskMode: value.taskMode, outputMode: value.outputMode, skills: [...new Set<SkillChoice>(value.skills)],
    antislopMode: value.antislopMode,
  };
}
