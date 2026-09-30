import { useState } from "preact/hooks";
import { generatePrompt } from "../lib/generatePrompt";
import { composeTheme, KIND_LABELS, USE_CASE_LABELS } from "../lib/themeCatalog";
import type { ThemeDefinition, ThemeKind } from "../lib/themeCatalog";
import LivePreview from "./LivePreview";
import ThemeExport from "./ThemeExport";

interface Props {
  theme: ThemeDefinition;
  themes: ThemeDefinition[];
}

const FRAMEWORKS = ["Next.js", "Astro", "React (Vite)", "Vue", "Svelte", "Plain HTML"];
const CSS_APPROACHES = ["Tailwind", "Vanilla CSS", "CSS Modules"];
const COMPONENTS = ["Hero", "Navbar", "Footer", "Cards", "Forms", "Buttons", "Tables", "Sidebar"];
const TONES = ["Professional", "Playful", "Minimal"];
const LAYER_KINDS: ThemeKind[] = ["layout-pattern", "visual-effect", "color-mode"];

export default function PromptBuilder({ theme, themes }: Props) {
  const [framework, setFramework] = useState(FRAMEWORKS[0]);
  const [cssApproach, setCssApproach] = useState(CSS_APPROACHES[0]);
  const [selectedComponents, setSelectedComponents] = useState<string[]>(["Hero", "Cards"]);
  const [tone, setTone] = useState(TONES[0]);
  const [brief, setBrief] = useState("");
  const [audience, setAudience] = useState("");
  const [useCase, setUseCase] = useState<string>(theme.useCases[0]);
  const [layoutNotes, setLayoutNotes] = useState("");
  const [interactionNotes, setInteractionNotes] = useState("");
  const [layerSlugs, setLayerSlugs] = useState<Record<string, string>>({});
  const [copyStatus, setCopyStatus] = useState("");

  const layers = LAYER_KINDS.flatMap((kind) => {
    const layer = themes.find((item) => item.slug === layerSlugs[kind] && item.kind === kind);
    return layer ? [layer] : [];
  });
  const composed = composeTheme(theme, layers);
  const prompt = generatePrompt({
    themeName: theme.name,
    characteristics: theme.characteristics,
    colors: theme.colors,
    typography: theme.typography,
    styleTokens: theme.styleTokens,
    layoutRules: [...theme.layoutRules, ...(layoutNotes.trim() ? [layoutNotes.trim()] : [])],
    interactionRules: [...theme.interactionRules, ...(interactionNotes.trim() ? [interactionNotes.trim()] : [])],
    framework, cssApproach, components: selectedComponents, tone, brief, audience,
    useCase: USE_CASE_LABELS[useCase as keyof typeof USE_CASE_LABELS],
    layers,
  });

  const toggleComponent = (component: string) => {
    setSelectedComponents((previous) => previous.includes(component)
      ? previous.filter((item) => item !== component) : [...previous, component]);
    setCopyStatus("");
  };
  const copyToClipboard = async () => {
    try { await navigator.clipboard.writeText(prompt); setCopyStatus("Prompt copied."); }
    catch { setCopyStatus("Clipboard is unavailable. Select and copy the prompt below."); }
  };

  return (
    <section class="glass p-6" id="prompt-builder">
      <h2 class="text-lg font-semibold">Prompt Builder</h2>
      <p class="mt-1 text-sm" style={{ color: "var(--tx-text-muted)" }}>Describe your project and choose components. The prompt includes exact style tokens, layout rules, and interaction requirements.</p>
      <div class="mt-6 grid gap-5 sm:grid-cols-2" onInput={() => setCopyStatus("")} onChange={() => setCopyStatus("")}>
        <label class="grid gap-2 sm:col-span-2">
          <span class="text-sm font-medium">Project brief</span>
          <textarea class="tx-input" rows={3} value={brief} placeholder="An inventory dashboard with stock levels, alerts, and recent activity." onInput={(event) => setBrief(event.currentTarget.value)} />
        </label>
        <label class="grid gap-2">
          <span class="text-sm font-medium">Target users</span>
          <input class="tx-input" value={audience} placeholder="Warehouse operators using tablets" onInput={(event) => setAudience(event.currentTarget.value)} />
        </label>
        <label class="grid gap-2">
          <span class="text-sm font-medium">Page purpose</span>
          <select class="tx-input" value={useCase} onChange={(event) => setUseCase(event.currentTarget.value)}>
            {Object.entries(USE_CASE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label class="grid gap-2">
          <span class="text-sm font-medium">Framework</span>
          <select class="tx-input" value={framework} onChange={(event) => setFramework(event.currentTarget.value)}>
            {FRAMEWORKS.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label class="grid gap-2">
          <span class="text-sm font-medium">CSS approach</span>
          <select class="tx-input" value={cssApproach} onChange={(event) => setCssApproach(event.currentTarget.value)}>
            {CSS_APPROACHES.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label class="grid gap-2">
          <span class="text-sm font-medium">Tone</span>
          <select class="tx-input" value={tone} onChange={(event) => setTone(event.currentTarget.value)}>
            {TONES.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label class="grid gap-2">
          <span class="text-sm font-medium">Additional layout requirements</span>
          <textarea class="tx-input" rows={2} value={layoutNotes} placeholder="Keep the stock table visible above the fold." onInput={(event) => setLayoutNotes(event.currentTarget.value)} />
        </label>
        <label class="grid gap-2 sm:col-span-2">
          <span class="text-sm font-medium">Additional interaction requirements</span>
          <textarea class="tx-input" rows={2} value={interactionNotes} placeholder="Show inline validation and explicit loading, empty, and success states." onInput={(event) => setInteractionNotes(event.currentTarget.value)} />
        </label>
      </div>
      <fieldset class="mt-6">
        <legend class="text-sm font-medium">Components</legend>
        <div class="mt-3 flex flex-wrap gap-2">
          {COMPONENTS.map((component) => <button key={component} type="button" class="tx-button" aria-pressed={selectedComponents.includes(component)} onClick={() => toggleComponent(component)}>{component}</button>)}
        </div>
      </fieldset>
      <fieldset class="mt-6">
        <legend class="text-sm font-medium">Optional design layers</legend>
        <p class="mt-1 text-sm" style={{ color: "var(--tx-text-muted)" }}>Apply a layout, then a surface effect, then a color mode. Later layers override values within their scope. Fonts stay with the base theme.</p>
        <div class="mt-3 grid gap-4 sm:grid-cols-3">
          {LAYER_KINDS.map((kind) => <label class="grid gap-2" key={kind}>
            <span class="text-sm">{KIND_LABELS[kind]}</span>
            <select class="tx-input w-full" value={layerSlugs[kind] ?? ""} onChange={(event) => { setLayerSlugs((previous) => ({ ...previous, [kind]: event.currentTarget.value })); setCopyStatus(""); }}>
              <option value="">Keep base theme</option>
              {themes.filter((item) => item.kind === kind && item.slug !== theme.slug).map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
          </label>)}
        </div>
      </fieldset>
      {layers.length > 0 && <div class="mt-6 space-y-6">
        <p class="text-sm font-medium">{composed.name}</p>
        <LivePreview theme={composed} />
        <ThemeExport theme={composed} idPrefix="combined-theme-export" />
      </div>}
      <div class="mt-6">
        <div class="mb-3 flex items-center justify-between gap-4">
          <h3 class="text-sm font-medium">Generated prompt</h3>
          <button type="button" class="tx-button" onClick={copyToClipboard}>Copy prompt</button>
        </div>
        <pre class="tx-code"><code>{prompt}</code></pre>
        <p class="mt-2 text-sm" role="status">{copyStatus}</p>
      </div>
    </section>
  );
}
