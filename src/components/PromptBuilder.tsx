import { useState, useCallback } from "preact/hooks";
import { generatePrompt } from "../lib/generatePrompt";

interface Props {
  themeName: string;
  characteristics: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    heading: string;
    body: string;
  };
}

const FRAMEWORKS = ["Next.js", "Astro", "React (Vite)", "Vue", "Svelte", "Plain HTML"];
const CSS_APPROACHES = ["Tailwind", "Vanilla CSS", "CSS Modules"];
const COMPONENTS = ["Hero", "Navbar", "Footer", "Cards", "Forms", "Buttons", "Tables", "Sidebar"];
const TONES = ["Professional", "Playful", "Minimal"];

export default function PromptBuilder({ themeName, characteristics, colors, typography }: Props) {
  const [framework, setFramework] = useState(FRAMEWORKS[0]);
  const [cssApproach, setCssApproach] = useState(CSS_APPROACHES[0]);
  const [selectedComponents, setSelectedComponents] = useState<string[]>(["Hero", "Cards"]);
  const [tone, setTone] = useState(TONES[0]);
  const [copied, setCopied] = useState(false);

  const toggleComponent = (comp: string) => {
    setSelectedComponents((prev) =>
      prev.includes(comp) ? prev.filter((c) => c !== comp) : [...prev, comp]
    );
  };

  const prompt = generatePrompt({
    themeName,
    characteristics,
    colors,
    typography,
    framework,
    cssApproach,
    components: selectedComponents,
    tone,
  });

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [prompt]);

  const selectStyle = {
    background: "var(--tx-input-bg)",
    border: "1px solid var(--tx-input-border)",
    color: "var(--tx-text)",
  };

  return (
    <div class="glass p-6">
      <h2 class="text-lg font-semibold" style={{ color: "var(--tx-text)" }}>Prompt Builder</h2>
      <p class="mt-1 text-sm" style={{ color: "var(--tx-text-subtle)" }}>
        Configure your project settings and copy the generated prompt.
      </p>

      <div class="mt-6 grid gap-6 sm:grid-cols-2">
        {/* Framework */}
        <div>
          <label class="block text-sm font-medium" style={{ color: "var(--tx-text-muted)" }}>Framework</label>
          <select
            value={framework}
            onChange={(e) => setFramework((e.target as HTMLSelectElement).value)}
            class="mt-1 w-full rounded-lg px-3 py-2 text-sm backdrop-blur"
            style={selectStyle}
          >
            {FRAMEWORKS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* CSS Approach */}
        <div>
          <label class="block text-sm font-medium" style={{ color: "var(--tx-text-muted)" }}>CSS Approach</label>
          <select
            value={cssApproach}
            onChange={(e) => setCssApproach((e.target as HTMLSelectElement).value)}
            class="mt-1 w-full rounded-lg px-3 py-2 text-sm backdrop-blur"
            style={selectStyle}
          >
            {CSS_APPROACHES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Tone */}
        <div>
          <label class="block text-sm font-medium" style={{ color: "var(--tx-text-muted)" }}>Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone((e.target as HTMLSelectElement).value)}
            class="mt-1 w-full rounded-lg px-3 py-2 text-sm backdrop-blur"
            style={selectStyle}
          >
            {TONES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Components multi-select */}
      <div class="mt-6">
        <label class="block text-sm font-medium" style={{ color: "var(--tx-text-muted)" }}>Components</label>
        <div class="mt-2 flex flex-wrap gap-2">
          {COMPONENTS.map((comp) => (
            <button
              key={comp}
              onClick={() => toggleComponent(comp)}
              class="rounded-full px-3 py-1 text-sm font-medium transition-colors"
              style={{
                borderRadius: "var(--tx-button-radius)",
                background: selectedComponents.includes(comp) ? "var(--tx-link-color)" : "var(--tx-card-bg)",
                color: selectedComponents.includes(comp) ? "#fff" : "var(--tx-text-subtle)",
                border: selectedComponents.includes(comp) ? "none" : "var(--tx-card-border-width) solid var(--tx-card-border)",
              }}
            >
              {comp}
            </button>
          ))}
        </div>
      </div>

      {/* Generated prompt */}
      <div class="mt-6">
        <div class="flex items-center justify-between">
          <label class="block text-sm font-medium" style={{ color: "var(--tx-text-muted)" }}>Generated Prompt</label>
          <button
            onClick={copyToClipboard}
            class="rounded-lg px-4 py-1.5 text-sm font-medium transition-colors hover:opacity-80"
            style={{
              background: "var(--tx-link-color)",
              color: "#fff",
              borderRadius: "var(--tx-button-radius)",
            }}
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
        <pre
          class="mt-2 max-h-80 overflow-auto rounded-lg p-4 text-sm leading-relaxed"
          style={{
            background: "rgba(0,0,0,0.3)",
            color: "var(--tx-text-muted)",
          }}
        >{prompt}</pre>
      </div>
    </div>
  );
}
