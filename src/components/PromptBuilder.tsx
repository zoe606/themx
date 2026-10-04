import { useEffect, useState } from "preact/hooks";
import { generatePrompt } from "../lib/generatePrompt";
import { KIND_LABELS, USE_CASE_LABELS } from "../lib/themeCatalog";
import type { ThemeDefinition, UseCase } from "../lib/themeCatalog";
import { COMPONENTS, CSS_APPROACHES, FRAMEWORKS, getSkillReferences, OUTPUT_MODES, PROJECT_EXAMPLES, recommendedComponents, SKILL_CHOICES, supportsLibrary, TASK_MODES, TONES, UI_LIBRARIES } from "../lib/promptOptions";
import type { UiLibrary } from "../lib/promptOptions";
import { createPromptSetup, LAYER_KINDS, parsePromptSetup, resolvePromptSetup } from "../lib/promptSetup";
import type { PromptSetup } from "../lib/promptSetup";
import LivePreview from "./LivePreview";
import ThemeExport from "./ThemeExport";

interface Props {
  theme: ThemeDefinition;
  themes: ThemeDefinition[];
}

export default function PromptBuilder({ theme, themes }: Props) {
  const [setup, setSetup] = useState(() => createPromptSetup(theme));
  const [status, setStatus] = useState("");
  const storageKey = `themx-prompt-${theme.slug}`;
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) { setSetup(parsePromptSetup(saved, theme, themes)); setStatus("Saved setup restored from this browser."); }
    } catch { setStatus("Saved setup could not be restored. You can use the default settings."); }
  }, [storageKey]);

  const change = (values: Partial<PromptSetup>) => { setSetup((previous) => ({ ...previous, ...values })); setStatus(""); };
  const { layers, composed, config } = resolvePromptSetup(theme, themes, setup);
  const prompt = generatePrompt(config);
  const skillReferences = getSkillReferences(setup.skills, setup.uiLibrary);
  const isDocument = setup.outputMode === "design-md" || setup.outputMode === "agents-md";
  const outputLabel = isDocument ? "document" : "prompt";
  const filename = setup.outputMode === "design-md" ? "DESIGN.md"
    : setup.outputMode === "agents-md" ? "AGENTS-section.md" : `${theme.slug}-${setup.outputMode}.txt`;

  const changeLibrary = (uiLibrary: UiLibrary) => change({ uiLibrary,
    cssApproach: uiLibrary === "custom" ? setup.cssApproach : "Tailwind",
    skills: uiLibrary === "custom" ? setup.skills.filter((skill) => skill !== "library") : setup.skills,
  });
  const changeFramework = (framework: string) => {
    const compatible = supportsLibrary(setup.uiLibrary, framework);
    change({ framework, ...(compatible ? {} : { uiLibrary: "custom", skills: setup.skills.filter((skill) => skill !== "library") }) });
    if (!compatible) setStatus("Custom components selected. shadcn/ui requires Next.js or React (Vite).");
  };
  const toggleComponent = (component: string) => change({ components: setup.components.includes(component)
    ? setup.components.filter((item) => item !== component) : [...setup.components, component] });
  const copy = async () => {
    try { await navigator.clipboard.writeText(prompt); setStatus(`${isDocument ? "Document" : "Prompt"} copied.`); }
    catch { setStatus("Clipboard is unavailable. Select and copy the output below."); }
  };
  const download = (content: string | Uint8Array, name: string, mime: string) => {
    const body = typeof content === "string" ? content : new Uint8Array(content);
    const url = URL.createObjectURL(new Blob([body], { type: mime }));
    const link = document.createElement("a");
    link.href = url; link.download = name; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Download started.");
  };
  const downloadBundle = async () => {
    try {
      const { createPromptBundle, zipFiles } = await import("../lib/promptBundle");
      download(zipFiles(createPromptBundle(theme, themes, setup)), `${theme.slug}-design-bundle.zip`, "application/zip");
    } catch { setStatus("The bundle could not be created. Download the individual outputs instead."); }
  };
  const save = () => {
    try { window.localStorage.setItem(storageKey, JSON.stringify(setup)); setStatus("Setup saved in this browser. Your brief is not uploaded."); }
    catch { setStatus("Browser storage is unavailable. Download the setup to keep it."); }
  };
  const importSetup = async (file?: File) => {
    if (!file) return;
    try { setSetup(parsePromptSetup(await file.text(), theme, themes)); setStatus("Setup imported. Use Save setup to keep it in this browser."); }
    catch (error) { setStatus(error instanceof Error ? error.message : "This setup could not be imported."); }
  };
  const reset = () => {
    setSetup(createPromptSetup(theme));
    try { window.localStorage.removeItem(storageKey); setStatus("Setup reset."); }
    catch { setStatus("Settings reset. The saved browser setup could not be removed."); }
  };

  return (
    <section class="glass p-6" id="prompt-builder">
      <h2 class="text-lg font-semibold">Prompt Builder</h2>
      <p class="mt-1 text-sm" style={{ color: "var(--tx-text-muted)" }}>Choose your project, UI library, and output. Prompts, documents, and exports use the same resolved theme values.</p>
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <span class="text-sm">Example projects:</span>
        {Object.entries(PROJECT_EXAMPLES).map(([key, example]) => <button class="tx-button" type="button" key={key} onClick={() => change({ brief: example.brief, audience: example.audience, useCase: example.useCase, components: recommendedComponents(example.useCase) })}>{example.label}</button>)}
      </div>
      <div class="mt-6 grid gap-5 sm:grid-cols-2">
        <label class="grid gap-2 sm:col-span-2">
          <span class="text-sm font-medium">Project brief</span>
          <textarea class="tx-input" rows={3} value={setup.brief} placeholder="An inventory dashboard with stock levels, alerts, and recent activity." onInput={(event) => change({ brief: event.currentTarget.value })} />
        </label>
        <label class="grid gap-2">
          <span class="text-sm font-medium">Target users</span>
          <input class="tx-input" value={setup.audience} placeholder="Warehouse operators using tablets" onInput={(event) => change({ audience: event.currentTarget.value })} />
        </label>
        <label class="grid gap-2">
          <span class="text-sm font-medium">Page purpose</span>
          <select class="tx-input" value={setup.useCase} onChange={(event) => { const useCase = event.currentTarget.value as UseCase; change({ useCase, components: recommendedComponents(useCase) }); }}>
            {Object.entries(USE_CASE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label class="grid gap-2">
          <span class="text-sm font-medium">Framework</span>
          <select class="tx-input" value={setup.framework} onChange={(event) => changeFramework(event.currentTarget.value)}>
            {FRAMEWORKS.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label class="grid gap-2">
          <span class="text-sm font-medium">UI library</span>
          <select class="tx-input" value={setup.uiLibrary} onChange={(event) => changeLibrary(event.currentTarget.value as UiLibrary)}>
            {Object.entries(UI_LIBRARIES).map(([value, library]) => <option key={value} value={value} disabled={!supportsLibrary(value as UiLibrary, setup.framework)}>{library.label}</option>)}
          </select>
        </label>
        <p class="text-sm sm:col-span-2" style={{ color: "var(--tx-text-muted)" }}>{UI_LIBRARIES[setup.uiLibrary].description} {setup.framework !== "Next.js" && setup.framework !== "React (Vite)" && "shadcn/ui requires React. Framework-specific ports are not included in this builder."}</p>
        <div class="grid gap-2">
          <label class="text-sm font-medium" for={`prompt-css-${theme.slug}`}>CSS approach</label>
          <select class="tx-input" id={`prompt-css-${theme.slug}`} aria-describedby={setup.uiLibrary !== "custom" ? `prompt-css-help-${theme.slug}` : undefined} value={setup.cssApproach} disabled={setup.uiLibrary !== "custom"} onChange={(event) => change({ cssApproach: event.currentTarget.value })}>
            {CSS_APPROACHES.map((value) => <option key={value}>{value}</option>)}
          </select>
          {setup.uiLibrary !== "custom" && <span class="text-xs" id={`prompt-css-help-${theme.slug}`}>This library requires Tailwind. Existing projects should keep their installed versions until a migration is approved.</span>}
        </div>
        <label class="grid gap-2">
          <span class="text-sm font-medium">Task</span>
          <select class="tx-input" value={setup.taskMode} onChange={(event) => change({ taskMode: event.currentTarget.value as PromptSetup["taskMode"], antislopMode: event.currentTarget.value === "audit" ? "after" : "during" })}>
            {Object.entries(TASK_MODES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label class="grid gap-2">
          <span class="text-sm font-medium">Tone</span>
          <select class="tx-input" value={setup.tone} onChange={(event) => change({ tone: event.currentTarget.value })}>
            {TONES.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label class="grid gap-2">
          <span class="text-sm font-medium">Additional layout requirements</span>
          <textarea class="tx-input" rows={2} value={setup.layoutNotes} placeholder="Keep the stock table visible above the fold." onInput={(event) => change({ layoutNotes: event.currentTarget.value })} />
        </label>
        <label class="grid gap-2 sm:col-span-2">
          <span class="text-sm font-medium">Additional interaction requirements</span>
          <textarea class="tx-input" rows={2} value={setup.interactionNotes} placeholder="Show inline validation and explicit loading, empty, and success states." onInput={(event) => change({ interactionNotes: event.currentTarget.value })} />
        </label>
      </div>
      {!theme.useCases.includes(setup.useCase) && <p class="mt-4 text-sm">This theme is usually used for {theme.useCases.map((key) => USE_CASE_LABELS[key]).join(", ")}. Review its suitability notes for {USE_CASE_LABELS[setup.useCase]}.</p>}
      <fieldset class="mt-6">
        <legend class="text-sm font-medium">Components</legend>
        <p class="mt-1 text-sm" style={{ color: "var(--tx-text-muted)" }}>Changing the page purpose selects suggested components. You can adjust them below.</p>
        <div class="mt-3 flex flex-wrap gap-2">
          {COMPONENTS.map((component) => <button key={component} type="button" class="tx-button" aria-pressed={setup.components.includes(component)} onClick={() => toggleComponent(component)}>{component}</button>)}
        </div>
      </fieldset>
      <fieldset class="mt-6">
        <legend class="text-sm font-medium">Optional design layers</legend>
        <p class="mt-1 text-sm" style={{ color: "var(--tx-text-muted)" }}>Apply a layout, then a surface effect, then a color mode. Fonts stay with the base theme. The output contains one final token set.</p>
        <div class="mt-3 grid gap-4 sm:grid-cols-3">
          {LAYER_KINDS.map((kind) => <label class="grid gap-2" key={kind}>
            <span class="text-sm">{KIND_LABELS[kind]}</span>
            <select class="tx-input w-full" value={setup.layerSlugs[kind] ?? ""} onChange={(event) => change({ layerSlugs: { ...setup.layerSlugs, [kind]: event.currentTarget.value } })}>
              <option value="">Keep base theme</option>
              {themes.filter((item) => item.kind === kind && item.slug !== theme.slug).map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
          </label>)}
        </div>
      </fieldset>
      <div class="mt-6 space-y-6">
        <p class="text-sm font-medium">{composed.name}</p>
        <LivePreview theme={composed} uiLibrary={setup.uiLibrary} useCase={setup.useCase} />
        {layers.length > 0 && <ThemeExport theme={composed} uiLibrary={setup.uiLibrary} idPrefix="combined-theme-export" />}
      </div>
      <fieldset class="mt-6">
        <legend class="text-sm font-medium">Optional skills</legend>
        <p class="mt-1 text-sm" style={{ color: "var(--tx-text-muted)" }}>Include skill references and installation instructions for your coding agent. Selecting a skill here does not install it.</p>
        <div class="mt-3 flex flex-wrap gap-4">
          {Object.entries(SKILL_CHOICES).map(([value, label]) => <label class="flex items-center gap-2" key={value}>
            <input type="checkbox" disabled={value === "library" && setup.uiLibrary === "custom"} checked={setup.skills.includes(value as PromptSetup["skills"][number])} onChange={(event) => change({ skills: event.currentTarget.checked ? [...setup.skills, value as PromptSetup["skills"][number]] : setup.skills.filter((skill) => skill !== value) })} />{label}
          </label>)}
        </div>
        {setup.uiLibrary === "custom" && <p class="mt-2 text-xs">Choose daisyUI or shadcn/ui to include its official skill.</p>}
        {setup.skills.includes("antislop") && <label class="mt-4 grid max-w-xs gap-2"><span class="text-sm">Anti-slop mode</span><select class="tx-input" value={setup.antislopMode} onChange={(event) => change({ antislopMode: event.currentTarget.value as PromptSetup["antislopMode"] })}><option value="during">During implementation</option><option value="after">After implementation / audit</option></select></label>}
        {skillReferences.length > 0 && <ul class="mt-3 space-y-2 text-sm">{skillReferences.map((skill) => <li key={skill.name}><a class="underline" href={skill.url} target="_blank" rel="noreferrer">{skill.name} source and installation</a><p>{skill.purpose}</p></li>)}</ul>}
      </fieldset>
      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        <label class="grid gap-2"><span class="text-sm font-medium">Output</span><select class="tx-input" value={setup.outputMode} onChange={(event) => change({ outputMode: event.currentTarget.value as PromptSetup["outputMode"] })}>{Object.entries(OUTPUT_MODES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <p class="text-sm sm:self-end" style={{ color: "var(--tx-text-muted)" }}>{setup.outputMode === "agents-md" ? "Add this section to the applicable AGENTS.md. Keep existing project instructions and create DESIGN.md from the same setup." : isDocument ? "Download this document directly. The selected theme and layers are already resolved." : "Copy this prompt into your coding assistant. The task mode applies to the UI prompt."}</p>
      </div>
      <div class="mt-5 flex flex-wrap gap-2">
        <button class="tx-button" type="button" onClick={save}>Save setup</button>
        <button class="tx-button" type="button" onClick={() => download(JSON.stringify(setup, null, 2), `${theme.slug}-setup.json`, "application/json")}>Download setup</button>
        <button class="tx-button" type="button" onClick={() => { void downloadBundle(); }}>Download design bundle .zip</button>
        <label class="grid gap-1 text-sm"><span>Import setup</span><input type="file" accept=".json,application/json" class="max-w-full" onChange={(event) => { void importSetup(event.currentTarget.files?.[0]); event.currentTarget.value = ""; }} /></label>
        <button class="tx-button" type="button" onClick={reset}>Reset setup</button>
      </div>
      <div class="mt-6">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 class="text-sm font-medium">Generated {outputLabel}</h3>
          <div class="flex flex-wrap gap-2"><button type="button" class="tx-button" onClick={copy}>Copy {outputLabel}</button><button type="button" class="tx-button" onClick={() => download(prompt, filename, isDocument ? "text/markdown" : "text/plain")}>Download {outputLabel}</button></div>
        </div>
        <pre class="tx-code" data-generated-output><code>{prompt}</code></pre>
        <p class="mt-2 text-sm" role="status">{status}</p>
      </div>
    </section>
  );
}
