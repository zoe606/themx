const loadedFonts = new Set<string>();

/**
 * Dynamically load a Google Font by injecting a <link> element.
 * Skips fonts that are already loaded or are system fonts.
 */
export function loadGoogleFont(fontName: string, weights: string[] = ["400", "700"]): void {
  // System fonts / already loaded — skip
  if (isSystemFont(fontName) || loadedFonts.has(fontName)) return;

  loadedFonts.add(fontName);

  const family = `${fontName.replace(/ /g, "+")}:wght@${weights.join(";")}`;
  const href = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;

  // Avoid duplicate <link> elements
  if (document.querySelector(`link[href="${href}"]`)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

/** Load both heading and body fonts for a theme */
export function loadThemeFonts(
  heading: string,
  body: string,
  headingWeight: string = "700",
  bodyWeight: string = "400"
): void {
  loadGoogleFont(heading, [headingWeight, "400"]);
  if (body !== heading) {
    loadGoogleFont(body, [bodyWeight, "400", "500"]);
  }
}

const SYSTEM_FONTS = new Set([
  "system-ui",
  "sans-serif",
  "serif",
  "monospace",
  "Helvetica Neue",
  "Helvetica",
  "Arial",
  "SF Pro Display",
  "SF Pro Text",
]);

function isSystemFont(name: string): boolean {
  return SYSTEM_FONTS.has(name);
}
