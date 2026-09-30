import { useState } from "preact/hooks";
import type { ThemeDefinition } from "../lib/themeCatalog";
import { exportThemeCSS, exportThemeJSON } from "../lib/themeExport";

export default function ThemeExport({ theme, idPrefix = "theme-export" }: { theme: ThemeDefinition; idPrefix?: string }) {
  const [format, setFormat] = useState<"css" | "json">("css");
  const [status, setStatus] = useState("");
  const content = format === "css" ? exportThemeCSS(theme) : exportThemeJSON(theme);
  const formatId = `${idPrefix}-${theme.slug}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(content); setStatus("Copied to clipboard."); }
    catch { setStatus("Clipboard is unavailable. Select and copy the text below."); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([content], { type: format === "css" ? "text/css" : "application/json" }));
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
      <div class="my-4 flex flex-wrap gap-3">
        <label class="sr-only" for={formatId}>Export format</label>
        <select class="tx-input" id={formatId} value={format} onChange={(event) => { setFormat(event.currentTarget.value as "css" | "json"); setStatus(""); }}><option value="css">CSS variables</option><option value="json">JSON tokens</option></select>
        <button class="tx-button" type="button" onClick={copy}>Copy {format.toUpperCase()}</button>
        <button class="tx-button" type="button" onClick={download}>Download .{format}</button>
      </div>
      <pre class="tx-code"><code>{content}</code></pre>
      <p class="mt-2 text-sm" role="status">{status}</p>
    </section>
  );
}
