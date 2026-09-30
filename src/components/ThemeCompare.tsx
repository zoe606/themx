import { useEffect, useState } from "preact/hooks";
import type { ThemeDefinition } from "../lib/themeCatalog";
import { KIND_LABELS, USE_CASE_LABELS } from "../lib/themeCatalog";
import LivePreview from "./LivePreview";

export default function ThemeCompare({ themes, basePath }: { themes: ThemeDefinition[]; basePath: string }) {
  const [left, setLeft] = useState(themes[0].slug);
  const [right, setRight] = useState(themes[1].slug);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");
  const [shareURL, setShareURL] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const valid = (slug: string | null) => themes.some((theme) => theme.slug === slug);
    if (valid(params.get("left"))) setLeft(params.get("left")!);
    if (valid(params.get("right"))) setRight(params.get("right")!);
    setReady(true);
  }, [themes]);
  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    url.searchParams.set("left", left);
    url.searchParams.set("right", right);
    window.history.replaceState(null, "", url);
    setShareURL(url.href);
    setStatus("");
  }, [left, right, ready]);
  const pair = [themes.find((theme) => theme.slug === left)!, themes.find((theme) => theme.slug === right)!];
  const copy = async () => {
    try { await navigator.clipboard.writeText(shareURL); setStatus("Comparison link copied."); }
    catch { setStatus("Clipboard is unavailable. Copy the link from the field below."); }
  };

  return (
    <div>
      <div class="mb-6 grid gap-4 sm:grid-cols-2">
        {[left, right].map((slug, index) => <label class="grid gap-2" key={index}>
          <span class="text-sm font-medium">{index === 0 ? "First theme" : "Second theme"}</span>
          <select class="tx-input" value={slug} onChange={(event) => (index === 0 ? setLeft : setRight)(event.currentTarget.value)}>
            {themes.map((theme) => <option key={theme.slug} value={theme.slug}>{theme.name}</option>)}
          </select>
        </label>)}
      </div>
      <div class="mb-5 flex flex-wrap items-center gap-3">
        <button class="tx-button" type="button" aria-pressed={viewport === "desktop"} onClick={() => setViewport("desktop")}>Desktop</button>
        <button class="tx-button" type="button" aria-pressed={viewport === "mobile"} onClick={() => setViewport("mobile")}>Mobile · 360px</button>
        <button class="tx-button sm:ml-auto" type="button" disabled={!ready} onClick={copy}>Copy comparison link</button>
      </div>
      <label class="mb-5 grid gap-2 text-sm">Comparison link<input class="tx-input min-w-0 w-full" readOnly value={shareURL} onFocus={(event) => event.currentTarget.select()} /></label>
      <p class="mb-4 text-sm" role="status">{status}{left === right ? " Both previews use the same theme. Choose another to compare." : ""}</p>
      <div class="grid gap-6 lg:grid-cols-2">
        {pair.map((theme, index) => <section key={index} class="min-w-0">
          <h2 class="text-xl font-semibold">{theme.name}</h2>
          <p class="mb-4 mt-1 text-sm" style={{ color: "var(--tx-text-muted)" }}>{KIND_LABELS[theme.kind]} · {theme.tagline}</p>
          <LivePreview theme={theme} viewport={viewport} showControls={false} />
          <div class="glass mt-4 p-5 text-sm">
            <p><strong>Best for:</strong> {theme.useCases.map((key) => USE_CASE_LABELS[key]).join(", ")}</p>
            <p class="mt-3"><strong>Less suitable for:</strong> {theme.avoidFor.join(" ")}</p>
            <a class="mt-4 inline-block underline" href={`${basePath}/themes/${theme.slug}`}>Details, prompt, and export</a>
          </div>
        </section>)}
      </div>
      <div class="glass mt-8 overflow-x-auto p-5">
        <table class="w-full text-left text-sm">
          <caption class="mb-4 text-left text-lg font-semibold">Style differences</caption>
          <thead><tr><th scope="col" class="p-2">Property</th>{pair.map((theme, index) => <th key={index} scope="col" class="p-2">{theme.name}</th>)}</tr></thead>
          <tbody>{[
            ["Heading font", ...pair.map((theme) => theme.typography.heading)],
            ["Body font", ...pair.map((theme) => theme.typography.body)],
            ["Background", ...pair.map((theme) => theme.colors.background)],
            ["Text", ...pair.map((theme) => theme.colors.text)],
            ["Card radius", ...pair.map((theme) => theme.styleTokens?.cardRadius ?? "Default")],
            ["Card shadow", ...pair.map((theme) => theme.styleTokens?.cardShadow ?? "None")],
            ["Backdrop blur", ...pair.map((theme) => theme.styleTokens?.cardBackdropBlur ?? "None")],
            ["Layout", ...pair.map((theme) => theme.layoutRules.join(" "))],
            ["Interaction", ...pair.map((theme) => theme.interactionRules.join(" "))],
          ].map(([label, ...values]) => <tr key={label} class="border-t" style={{ borderColor: "var(--tx-card-border)" }}><th scope="row" class="p-2 align-top">{label}</th>{values.map((value, index) => <td key={index} class="p-2 align-top">{value}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
