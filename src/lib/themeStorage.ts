export interface StyleTokens {
  surfaceBg: string;
  surfaceBgImage: string;
  cardBg: string;
  cardBorder: string;
  cardBorderWidth: string;
  cardRadius: string;
  cardShadow: string;
  cardBackdropBlur: string;
  cardBorderHover: string;
  cardShadowHover: string;
  fontHeading: string;
  fontBody: string;
  fontHeadingWeight: string;
  fontBodyWeight: string;
  textMuted: string;
  textSubtle: string;
  linkColor: string;
  buttonRadius: string;
  inputBg: string;
  inputBorder: string;
}

export interface StoredTheme {
  name: string;
  slug: string;
  tokens: StyleTokens;
}

const STORAGE_KEY = "themx-applied-theme";

export function getStoredTheme(): StoredTheme | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredTheme;
  } catch {
    return null;
  }
}

export function setStoredTheme(theme: StoredTheme): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
}

export function clearStoredTheme(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Map StyleTokens keys to --tx-* CSS custom property names */
export const TOKEN_TO_CSS: Record<keyof StyleTokens, string> = {
  surfaceBg: "--tx-surface-bg",
  surfaceBgImage: "--tx-surface-bg-image",
  cardBg: "--tx-card-bg",
  cardBorder: "--tx-card-border",
  cardBorderWidth: "--tx-card-border-width",
  cardRadius: "--tx-card-radius",
  cardShadow: "--tx-card-shadow",
  cardBackdropBlur: "--tx-card-backdrop-blur",
  cardBorderHover: "--tx-card-border-hover",
  cardShadowHover: "--tx-card-shadow-hover",
  fontHeading: "--tx-font-heading",
  fontBody: "--tx-font-body",
  fontHeadingWeight: "--tx-font-heading-weight",
  fontBodyWeight: "--tx-font-body-weight",
  textMuted: "--tx-text-muted",
  textSubtle: "--tx-text-subtle",
  linkColor: "--tx-link-color",
  buttonRadius: "--tx-button-radius",
  inputBg: "--tx-input-bg",
  inputBorder: "--tx-input-border",
};

/** Apply style tokens to the document root */
export function applyTokensToDOM(tokens: StyleTokens): void {
  const root = document.documentElement;
  for (const [key, cssVar] of Object.entries(TOKEN_TO_CSS)) {
    const value = tokens[key as keyof StyleTokens];
    // Font names need wrapping in quotes for CSS font-family
    if (key === "fontHeading" || key === "fontBody") {
      root.style.setProperty(cssVar, `'${value}', sans-serif`);
    } else {
      root.style.setProperty(cssVar, value);
    }
  }
  // Also set the text color from the theme's background context
  // We derive --tx-text from the surface bg brightness
  const bg = tokens.surfaceBg;
  const isLight = isLightColor(bg);
  root.style.setProperty("--tx-text", isLight ? "#1a1a1a" : "#F8FAFC");
}

/** Remove all --tx-* inline overrides so CSS defaults take over */
export function removeTokensFromDOM(): void {
  const root = document.documentElement;
  for (const cssVar of Object.values(TOKEN_TO_CSS)) {
    root.style.removeProperty(cssVar);
  }
  root.style.removeProperty("--tx-text");
}

/** Simple heuristic: parse hex color and check perceived brightness */
function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  // Relative luminance approximation
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}
