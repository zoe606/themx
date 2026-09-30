import type { StyleTokens } from "./themeStorage";

export const KIND_LABELS = {
  "visual-style": "Visual style",
  "visual-effect": "Visual effect",
  "layout-pattern": "Layout pattern",
  "color-mode": "Color mode",
  "design-system": "Design system",
} as const;

export const USE_CASE_LABELS = {
  portfolio: "Portfolio",
  saas: "SaaS",
  dashboard: "Dashboard",
  ecommerce: "Ecommerce",
  editorial: "Editorial",
  education: "Education",
  developer: "Developer tools",
  entertainment: "Games & entertainment",
  brand: "Brand & events",
} as const;

export type ThemeKind = keyof typeof KIND_LABELS;
export type UseCase = keyof typeof USE_CASE_LABELS;

export interface ThemeDefinition {
  name: string;
  slug: string;
  category: string;
  kind: ThemeKind;
  year: number;
  tags: string[];
  tagline: string;
  preview: string;
  useCases: UseCase[];
  avoidFor: string[];
  layoutRules: string[];
  interactionRules: string[];
  characteristics: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: { heading: string; body: string };
  styleTokens?: StyleTokens;
  layoutPattern?: string;
}

export function resolveThemeStyle(base: Pick<ThemeDefinition, "colors" | "styleTokens">, layers: ThemeDefinition[]) {
  let colors = { ...base.colors };
  let tokens = base.styleTokens ? { ...base.styleTokens } : undefined;
  for (const layer of layers) {
    if (layer.kind === "color-mode") {
      colors = { ...layer.colors };
      if (tokens && layer.styleTokens) {
        const alpha = tokens.cardBg.match(/^rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)$/)?.[1];
        for (const key of ["surfaceBg", "cardBg", "cardBorder", "cardBorderHover", "textMuted", "textSubtle", "linkColor", "inputBg", "inputBorder"] as const) {
          tokens[key] = layer.styleTokens[key];
        }
        if (alpha) {
          const channels = colors.text.replace("#", "").match(/.{2}/g)!.map((channel) => parseInt(channel, 16));
          tokens.cardBg = `rgba(${channels.join(",")},${alpha})`;
        }
      }
    } else if (layer.kind === "visual-effect" && tokens && layer.styleTokens) {
      for (const key of ["surfaceBgImage", "cardBg", "cardBorder", "cardBorderWidth", "cardRadius", "cardShadow", "cardBackdropBlur", "cardBorderHover", "cardShadowHover"] as const) {
        tokens[key] = layer.styleTokens[key];
      }
    }
  }
  return { colors, styleTokens: tokens };
}

export function composeTheme(base: ThemeDefinition, layers: ThemeDefinition[]): ThemeDefinition {
  const style = resolveThemeStyle(base, layers);
  const layout = layers.filter((layer) => layer.kind === "layout-pattern").at(-1);
  return { ...base, name: [base.name, ...layers.map((layer) => layer.name)].join(" + "),
    ...style, layoutRules: layout?.layoutRules ?? base.layoutRules, layoutPattern: layout?.slug ?? base.layoutPattern,
    interactionRules: [...base.interactionRules, ...layers.flatMap((layer) => layer.interactionRules)] };
}

export interface ThemeFilters {
  query?: string;
  category?: string;
  year?: number;
  kind?: string;
  useCase?: string;
}

export function filterThemes(themes: ThemeDefinition[], filters: ThemeFilters): ThemeDefinition[] {
  const words = (filters.query ?? "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  return themes.filter((theme) => {
    if (filters.category && theme.category !== filters.category) return false;
    if (filters.year && theme.year !== filters.year) return false;
    if (filters.kind && theme.kind !== filters.kind) return false;
    if (filters.useCase && !theme.useCases.includes(filters.useCase as UseCase)) return false;
    const searchable = [theme.name, theme.tagline, KIND_LABELS[theme.kind], ...theme.tags,
      ...theme.useCases.map((key) => USE_CASE_LABELS[key])].join(" ").toLowerCase();
    return words.every((word) => searchable.includes(word));
  });
}
