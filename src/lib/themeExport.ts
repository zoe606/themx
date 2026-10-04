import { TOKEN_TO_CSS } from "./themeStorage";
import type { ThemeDefinition } from "./themeCatalog";
import { exportMediaEffectSVG } from "./mediaEffect";
import type { UiLibrary } from "./promptOptions";

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
  const variables: Record<string, string> = {
    "--tx-surface-bg": theme.colors.background,
    "--tx-font-heading": `${JSON.stringify(theme.typography.heading)}, sans-serif`,
    "--tx-font-body": `${JSON.stringify(theme.typography.body)}, sans-serif`,
  };
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

export function exportLibraryCSS(theme: Pick<ThemeDefinition, "colors" | "typography" | "styleTokens" | "mediaEffect">, library: UiLibrary): string {
  return libraryCSS(theme, library, false);
}

export function exportPreviewCSS(theme: Pick<ThemeDefinition, "colors" | "typography" | "styleTokens" | "mediaEffect">, library: UiLibrary): string {
  return libraryCSS(theme, library, true);
}

function libraryCSS(theme: Pick<ThemeDefinition, "colors" | "typography" | "styleTokens" | "mediaEffect">, library: UiLibrary, runtime: boolean): string {
  const base = exportThemeCSS(theme);
  if (library === "custom") return base;
  const dark = contrastText(theme.colors.background) === "#FFFFFF";
  const card = theme.styleTokens ? "var(--tx-card-bg)" : "var(--tx-surface-bg)";
  const border = theme.styleTokens ? "var(--tx-card-border)" : "var(--tx-text)";
  const input = theme.styleTokens ? "var(--tx-input-border)" : border;
  const radius = theme.styleTokens ? "var(--tx-card-radius)" : "0.5rem";
  const fieldRadius = theme.styleTokens ? "var(--tx-button-radius)" : "0.375rem";
  const mutedText = theme.styleTokens ? "var(--tx-text-muted)" : "var(--tx-text)";
  const inputBg = theme.styleTokens ? "var(--tx-input-bg)" : "var(--tx-surface-bg)";
  if (library === "daisyui") {
    const values: Record<string, string> = {
      "--color-base-100": "var(--tx-surface-bg)", "--color-base-200": card,
      "--color-base-300": card, "--color-base-content": "var(--tx-text)",
      "--color-primary": "var(--tx-primary)", "--color-primary-content": contrastText(theme.colors.primary),
      "--color-secondary": "var(--tx-secondary)", "--color-secondary-content": contrastText(theme.colors.secondary),
      "--color-accent": "var(--tx-accent)", "--color-accent-content": contrastText(theme.colors.accent),
      "--color-neutral": "var(--tx-text)", "--color-neutral-content": "var(--tx-surface-bg)",
      "--color-info": "#2563EB", "--color-info-content": "#FFFFFF",
      "--color-success": "#15803D", "--color-success-content": "#FFFFFF",
      "--color-warning": "#FACC15", "--color-warning-content": "#000000",
      "--color-error": "#B91C1C", "--color-error-content": "#FFFFFF",
      "--radius-selector": fieldRadius, "--radius-field": fieldRadius, "--radius-box": radius,
      "--size-selector": "0.25rem", "--size-field": "0.25rem",
      "--border": theme.styleTokens ? "var(--tx-card-border-width)" : "1px",
      "--depth": "0", "--noise": "0",
    };
    if (runtime) return `${base}\n:root, [data-theme="themx"] {\n  color-scheme: ${dark ? "dark" : "light"};\n${Object.entries(values).map(([key, value]) => `  ${key}: ${value};`).join("\n")}\n}\n`;
    return `${base}\n@plugin "daisyui" {\n  themes: false;\n}\n\n@plugin "daisyui/theme" {\n  name: "themx";\n  default: true;\n  prefersdark: false;\n  color-scheme: ${dark ? "dark" : "light"};\n${Object.entries(values).map(([key, value]) => `  ${key}: ${value};`).join("\n")}\n}\n`;
  }
  const values: Record<string, string> = {
    background: "var(--tx-surface-bg)", foreground: "var(--tx-text)",
    card, "card-foreground": "var(--tx-text)", popover: inputBg, "popover-foreground": "var(--tx-text)",
    primary: "var(--tx-primary)", "primary-foreground": contrastText(theme.colors.primary),
    secondary: "var(--tx-secondary)", "secondary-foreground": contrastText(theme.colors.secondary),
    muted: card, "muted-foreground": mutedText,
    accent: "var(--tx-accent)", "accent-foreground": contrastText(theme.colors.accent),
    destructive: dark ? "#F87171" : "#B91C1C", "destructive-foreground": contrastText(dark ? "#F87171" : "#B91C1C"), border, input, ring: "var(--tx-text)",
    sidebar: "var(--tx-surface-bg)", "sidebar-foreground": "var(--tx-text)",
    "sidebar-primary": "var(--tx-primary)", "sidebar-primary-foreground": contrastText(theme.colors.primary),
    "sidebar-accent": "var(--tx-accent)", "sidebar-accent-foreground": contrastText(theme.colors.accent),
    "sidebar-border": border, "sidebar-ring": "var(--tx-text)",
  };
  if (runtime) return `${base}\n:root {\n  color-scheme: ${dark ? "dark" : "light"};\n  --radius: ${radius};\n${Object.entries(values).map(([key, value]) => `  --${key}: ${value};`).join("\n")}\n}\n`;
  return `${base}\n:root {\n  color-scheme: ${dark ? "dark" : "light"};\n  --radius: ${radius};\n${Object.entries(values).map(([key, value]) => `  --${key}: ${value};`).join("\n")}\n}\n\n@theme inline {\n  --font-sans: var(--tx-font-body);\n${Object.keys(values).map((key) => `  --color-${key}: var(--${key});`).join("\n")}\n  --radius-sm: calc(var(--radius) * 0.6);\n  --radius-md: calc(var(--radius) * 0.8);\n  --radius-lg: var(--radius);\n  --radius-xl: calc(var(--radius) * 1.4);\n}\n`;
}

export function exportThemeJSON(theme: ThemeDefinition, library: UiLibrary = "custom"): string {
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
    uiLibrary: library,
    libraryCSS: library === "custom" ? undefined : exportLibraryCSS(theme, library),
  }, null, 2);
}
