import type { ThemeDefinition } from "./themeCatalog";

export function getPreviewFontLinks(theme: Pick<ThemeDefinition, "typography" | "styleTokens">): string {
  const fonts = new Map<string, Set<string>>();
  for (const [font, weight] of [[theme.typography.heading, theme.styleTokens?.fontHeadingWeight ?? "700"], [theme.typography.body, theme.styleTokens?.fontBodyWeight ?? "400"]]) {
    const weights = fonts.get(font) ?? new Set<string>();
    weights.add(weight);
    fonts.set(font, weights);
  }
  const systemFonts = ["system-ui", "serif", "sans-serif", "monospace", "Georgia", "Times New Roman", "Courier New", "Helvetica Neue", "SF Pro Display", "SF Pro Text"];
  return [...fonts].filter(([font]) => !systemFonts.includes(font))
    .map(([font, weights]) => `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@${[...weights].sort((a, b) => Number(a) - Number(b)).join(";")}&display=swap">`).join("");
}
