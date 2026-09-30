import type { StyleTokens } from "./themeStorage";
import type { MediaEffect, ThemeDefinition } from "./themeCatalog";
import { resolveThemeStyle } from "./themeCatalog";
import { exportThemeCSS } from "./themeExport";
import { exportMediaEffectSVG } from "./mediaEffect";

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
  brief?: string;
  audience?: string;
  useCase?: string;
  styleTokens?: StyleTokens;
  layoutRules?: string[];
  interactionRules?: string[];
  layers?: ThemeDefinition[];
  mediaEffect?: MediaEffect;
}

export function generatePrompt(config: PromptConfig): string {
  const lines: string[] = [];

  lines.push(
    `You are building a web application using ${config.framework} with ${config.cssApproach}.`
  );
  if (config.brief?.trim()) lines.push(`Project brief: ${config.brief.trim()}`);
  if (config.audience?.trim()) lines.push(`Target users: ${config.audience.trim()}`);
  if (config.useCase) lines.push(`Page purpose: ${config.useCase}`);
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

  if (config.styleTokens) {
    lines.push("", "Use these exact CSS variables for the base theme:");
    lines.push(exportThemeCSS({ colors: config.colors, typography: config.typography,
      styleTokens: config.styleTokens, mediaEffect: config.mediaEffect }).trim());
  }
  if (config.layoutRules?.length) {
    lines.push("", "Layout rules:", ...config.layoutRules.map((rule) => `- ${rule}`));
  }
  if (config.interactionRules?.length) {
    lines.push("", "Interaction rules:", ...config.interactionRules.map((rule) => `- ${rule}`));
  }
  for (const layer of config.layers ?? []) {
    lines.push("", `Add ${layer.name} as a ${layer.kind.replace(/-/g, " ")} layer:`);
    if (layer.kind === "layout-pattern") {
      lines.push("Keep the base colors and typography. Override only the layout.");
      lines.push(...layer.layoutRules.map((rule) => `- ${rule}`));
    } else if (layer.kind === "color-mode") {
      lines.push(`Override the base palette: primary ${layer.colors.primary}, secondary ${layer.colors.secondary}, accent ${layer.colors.accent}, background ${layer.colors.background}, text ${layer.colors.text}.`);
      lines.push("Keep the base layout and typography. Adjust surface and border colors to match this palette.");
    } else {
      lines.push("Keep the base layout, colors, and typography. Override the surface treatment with these values:");
      const tokens = layer.styleTokens;
      if (tokens) {
        lines.push(`Background image: ${tokens.surfaceBgImage}; card background: ${tokens.cardBg}; border: ${tokens.cardBorderWidth} solid ${tokens.cardBorder}; radius: ${tokens.cardRadius}; shadow: ${tokens.cardShadow}; backdrop blur: ${tokens.cardBackdropBlur}.`);
      }
    }
    lines.push(...layer.interactionRules.map((rule) => `- ${rule}`));
  }
  if (config.layers?.length) {
    lines.push("Apply layers in the listed order. Later layer rules override earlier rules only in their stated scope.");
    lines.push("Preserve translucent surface opacity when applying a color mode.");
    lines.push("", "Use these resolved CSS variables for the combined style:");
    lines.push(exportThemeCSS({ ...resolveThemeStyle(config, config.layers), typography: config.typography }).trim());
  }

  const { mediaEffect } = resolveThemeStyle(config, config.layers ?? []);
  if (mediaEffect) {
    lines.push("", `Image treatment: ${mediaEffect.kind}. Use ink colors ${mediaEffect.ink1} and ${mediaEffect.ink2}.`);
    lines.push("Add this SVG filter definition to the page. Apply filter: var(--tx-media-filter) to images and illustrations only. Keep text and controls unfiltered.");
    lines.push(exportMediaEffectSVG(mediaEffect));
  }

  if (config.components.length > 0) {
    lines.push("");
    lines.push("Generate the following components in this style:");
    for (const comp of config.components) {
      lines.push(`- ${comp}`);
    }
  }

  lines.push("");
  if (config.cssApproach === "Tailwind") {
    lines.push("Use Tailwind utility classes. Ensure responsive design (mobile-first).");
  } else {
    lines.push(`Use ${config.cssApproach}. Ensure responsive design (mobile-first).`);
  }
  lines.push("Use semantic HTML, visible keyboard focus, readable text contrast, and labeled form fields.");
  lines.push("Respect prefers-reduced-motion. Keep essential content visible when animations are disabled.");

  return lines.join("\n");
}
