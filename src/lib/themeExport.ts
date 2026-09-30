import { TOKEN_TO_CSS } from "./themeStorage";
import type { ThemeDefinition } from "./themeCatalog";
import { exportMediaEffectSVG } from "./mediaEffect";

export function contrastText(hex: string): "#000000" | "#FFFFFF" {
  const channels = hex.replace("#", "").match(/.{2}/g)?.map((value) => {
    const channel = parseInt(value, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  if (!channels || channels.length !== 3) return "#000000";
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return luminance > 0.179 ? "#000000" : "#FFFFFF";
}

export function getThemeVariables(theme: Pick<ThemeDefinition, "colors" | "typography" | "styleTokens" | "mediaEffect">): Record<string, string> {
  const variables: Record<string, string> = {};
  if (theme.styleTokens) {
    for (const [key, cssName] of Object.entries(TOKEN_TO_CSS)) {
      const value = theme.styleTokens[key as keyof typeof theme.styleTokens];
      variables[cssName] = key === "fontHeading" || key === "fontBody"
        ? `${JSON.stringify(value)}, sans-serif` : value;
    }
  }
  variables["--tx-text"] = theme.colors.text;
  variables["--tx-primary"] = theme.colors.primary;
  variables["--tx-secondary"] = theme.colors.secondary;
  variables["--tx-accent"] = theme.colors.accent;
  variables["--tx-media-filter"] = theme.mediaEffect ? 'url("#tx-media-effect")' : "none";
  if (theme.mediaEffect) {
    variables["--tx-media-ink-1"] = theme.mediaEffect.ink1;
    variables["--tx-media-ink-2"] = theme.mediaEffect.ink2;
  }
  return variables;
}

export function exportThemeCSS(theme: Pick<ThemeDefinition, "colors" | "typography" | "styleTokens" | "mediaEffect">): string {
  const declarations = Object.entries(getThemeVariables(theme)).map(([key, value]) => `  ${key}: ${value};`);
  return `:root {\n${declarations.join("\n")}\n}\n`;
}

export function exportThemeJSON(theme: ThemeDefinition): string {
  return JSON.stringify({
    name: theme.name,
    slug: theme.slug,
    kind: theme.kind,
    colors: theme.colors,
    typography: theme.typography,
    styleTokens: theme.styleTokens,
    mediaEffect: theme.mediaEffect,
    svgFilter: theme.mediaEffect ? exportMediaEffectSVG(theme.mediaEffect) : undefined,
    cssVariables: getThemeVariables(theme),
    layoutRules: theme.layoutRules,
    layoutPattern: theme.layoutPattern,
    interactionRules: theme.interactionRules,
  }, null, 2);
}
