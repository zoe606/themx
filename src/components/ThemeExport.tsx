import { useState } from "preact/hooks";
import type { ThemeDefinition } from "../lib/themeCatalog";
import { exportThemeCSS, exportThemeJSON } from "../lib/themeExport";
import { exportMediaEffectSVG } from "../lib/mediaEffect";

type ExportFormat = "css" | "json" | "svg";

export default function ThemeExport({ theme, idPrefix = "theme-export" }: { theme: ThemeDefinition; idPrefix?: string }) {
  const [selectedFormat, setFormat] = useState<ExportFormat>("css");
  const [status, setStatus] = useState("");
  const format = selectedFormat === "svg" && !theme.mediaEffect ? "css" : selectedFormat;
  const content = format === "svg" && theme.mediaEffect ? exportMediaEffectSVG(theme.mediaEffect)
    : format === "css" ? exportThemeCSS(theme) : exportThemeJSON(theme);
  const formatId = `${idPrefix}-${theme.slug}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(content); setStatus("Copied to clipboard."); }
    catch { setStatus("Clipboard is unavailable. Select and copy the text below."); }
  };
  const download = () => {
    const mimeTypes = { css: "text/css", json: "application/json", svg: "image/svg+xml" };
    const url = URL.createObjectURL(new Blob([content], { type: mimeTypes[format] }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${theme.slug}.${format}`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Download started.");
  };

  return (
    <section class="glass p-6">
      <h2 class="text-lg font-semibold">Export style</h2>
      <p class="mt-1 text-sm" style={{ color: "var(--tx-text-muted)" }}>Use the CSS variables in your stylesheet, or download the colors, fonts, and tokens as JSON. Load the listed fonts separately.</p>
      {theme.mediaEffect && <p class="mt-2 text-sm" style={{ color: "var(--tx-text-muted)" }}>For image treatment, add the exported SVG filter definition once to your page and apply <code>filter: var(--tx-media-filter)</code> to images only. JSON includes the same filter definition.</p>}
      <div class="my-4 flex flex-wrap gap-3">
        <label class="sr-only" for={formatId}>Export format</label>
        <select class="tx-input" id={formatId} value={format} onChange={(event) => { setFormat(event.currentTarget.value as ExportFormat); setStatus(""); }}><option value="css">CSS variables</option><option value="json">JSON tokens</option>{theme.mediaEffect && <option value="svg">SVG filter</option>}</select>
        <button class="tx-button" type="button" onClick={copy}>Copy {format.toUpperCase()}</button>
        <button class="tx-button" type="button" onClick={download}>Download .{format}</button>
      </div>
      <pre class="tx-code"><code>{content}</code></pre>
      <p class="mt-2 text-sm" role="status">{status}</p>
    </section>
  );
}
