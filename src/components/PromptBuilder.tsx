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

  return (
    <div class="rounded-lg border border-gray-200 bg-white p-6">
      <h2 class="text-lg font-semibold text-gray-900">Prompt Builder</h2>
      <p class="mt-1 text-sm text-gray-500">
        Configure your project settings and copy the generated prompt.
      </p>

      <div class="mt-6 grid gap-6 sm:grid-cols-2">
        {/* Framework */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Framework</label>
          <select
            value={framework}
            onChange={(e) => setFramework((e.target as HTMLSelectElement).value)}
            class="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            {FRAMEWORKS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* CSS Approach */}
        <div>
          <label class="block text-sm font-medium text-gray-700">CSS Approach</label>
          <select
            value={cssApproach}
            onChange={(e) => setCssApproach((e.target as HTMLSelectElement).value)}
            class="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            {CSS_APPROACHES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Tone */}
        <div>
          <label class="block text-sm font-medium text-gray-700">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone((e.target as HTMLSelectElement).value)}
            class="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            {TONES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Components multi-select */}
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700">Components</label>
        <div class="mt-2 flex flex-wrap gap-2">
          {COMPONENTS.map((comp) => (
            <button
              key={comp}
              onClick={() => toggleComponent(comp)}
              class={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                selectedComponents.includes(comp)
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {comp}
            </button>
          ))}
        </div>
      </div>

      {/* Generated prompt */}
      <div class="mt-6">
        <div class="flex items-center justify-between">
          <label class="block text-sm font-medium text-gray-700">Generated Prompt</label>
          <button
            onClick={copyToClipboard}
            class="rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
        <pre class="mt-2 max-h-80 overflow-auto rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">{prompt}</pre>
      </div>
    </div>
  );
}
