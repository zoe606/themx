import { useState } from "preact/hooks";
import type { ThemeDefinition } from "../lib/themeCatalog";
import { exportLibraryCSS, exportThemeJSON } from "../lib/themeExport";
import { exportMediaEffectSVG } from "../lib/mediaEffect";
import { UI_LIBRARIES } from "../lib/promptOptions";
import type { UiLibrary } from "../lib/promptOptions";

type ExportFormat = "css" | "json" | "svg";

export default function ThemeExport({ theme, idPrefix = "theme-export", uiLibrary }: { theme: ThemeDefinition; idPrefix?: string; uiLibrary?: UiLibrary }) {
  const [selectedFormat, setFormat] = useState<ExportFormat>("css");
  const [selectedLibrary, setLibrary] = useState<UiLibrary>("custom");
  const library = uiLibrary ?? selectedLibrary;
  const [status, setStatus] = useState("");
  const format = selectedFormat === "svg" && !theme.mediaEffect ? "css" : selectedFormat;
  const content = format === "svg" && theme.mediaEffect ? exportMediaEffectSVG(theme.mediaEffect)
    : format === "css" ? exportLibraryCSS(theme, library) : exportThemeJSON(theme, library);
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
    link.download = `${theme.slug}${library === "custom" || format === "svg" ? "" : `-${library}`}.${format}`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Download started.");
  };

  return (
    <section class="glass p-6">
      <h2 class="text-lg font-semibold">Export style</h2>
      <p class="mt-1 text-sm" style={{ color: "var(--tx-text-muted)" }}>Choose a library mapping or use the CSS variables in your own components. JSON includes the same mapping. Load the listed fonts separately.</p>
      {theme.mediaEffect && <p class="mt-2 text-sm" style={{ color: "var(--tx-text-muted)" }}>For image treatment, add the exported SVG filter definition once to your page and apply <code>filter: var(--tx-media-filter)</code> to images only. JSON includes the same filter definition.</p>}
      <div class="my-4 flex flex-wrap gap-3">
        <label class="sr-only" for={`${formatId}-library`}>Export target</label>
        <select class="tx-input" id={`${formatId}-library`} value={library} disabled={uiLibrary !== undefined} onChange={(event) => { setLibrary(event.currentTarget.value as UiLibrary); setStatus(""); }}>{Object.entries(UI_LIBRARIES).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}</select>
        <label class="sr-only" for={formatId}>Export format</label>
        <select class="tx-input" id={formatId} value={format} onChange={(event) => { setFormat(event.currentTarget.value as ExportFormat); setStatus(""); }}><option value="css">CSS variables</option><option value="json">JSON tokens</option>{theme.mediaEffect && <option value="svg">SVG filter</option>}</select>
        <button class="tx-button" type="button" onClick={copy}>Copy {format.toUpperCase()}</button>
        <button class="tx-button" type="button" onClick={download}>Download .{format}</button>
      </div>
      {library !== "custom" && <p class="mb-3 text-sm">This mapping targets Tailwind CSS 4{library === "daisyui" ? " and daisyUI 5" : ""}. Merge it into the existing stylesheet after its imports. The live preview uses themx components.</p>}
      <pre class="tx-code"><code>{content}</code></pre>
      <p class="mt-2 text-sm" role="status">{status}</p>
    </section>
  );
}
