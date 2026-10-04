import type { ThemeDefinition, UseCase } from "./themeCatalog";
import type { UiLibrary } from "./promptOptions";
import { contrastText, exportPreviewCSS } from "./themeExport";
import { exportMediaEffectSVG } from "./mediaEffect";
import { decorations } from "./previewArtwork";
import { getPreviewFontLinks } from "./previewFonts";

export const PREVIEW_PRESETS = { inventory: "Inventory dashboard", product: "Product page", portfolio: "Portfolio" } as const;
export type PreviewPreset = keyof typeof PREVIEW_PRESETS;

export function previewPreset(useCase: UseCase): PreviewPreset {
  if (useCase === "dashboard" || useCase === "developer") return "inventory";
  if (useCase === "ecommerce") return "product";
  return "portfolio";
}

export function buildProjectDocument(theme: ThemeDefinition, markup: string, preset: PreviewPreset, library: UiLibrary, assetBase: string, motion = false): string {
  const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]!));
  const css = exportPreviewCSS(theme, library).replace(/<\//g, "<\\/");
  const filter = theme.mediaEffect ? exportMediaEffectSVG(theme.mediaEffect) : "";
  return `<!doctype html><html lang="en" data-theme="themx"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(theme.name)} ${PREVIEW_PRESETS[preset]} demo</title>
${getPreviewFontLinks(theme)}${library === "custom" ? "" : `<link rel="stylesheet" href="${assetBase}/${library}.css">`}<link rel="stylesheet" href="${assetBase}/layout.css">
<style>${css}:root { --demo-primary-text: ${contrastText(theme.colors.primary)}; } .product-art, .project-art { filter: var(--tx-media-filter); }</style></head>
<body class="theme-${escape(theme.slug)} ${theme.layoutPattern ? `theme-${escape(theme.layoutPattern)}` : ""}" data-preview-library="${library}" data-preview-preset="${preset}" data-motion="${motion}">${filter}<div id="demo-root">${markup.replaceAll("__THEME_ART__", decorations[theme.slug] ?? "")}</div><script src="${assetBase}/${preset}.js"></script></body></html>`;
}
