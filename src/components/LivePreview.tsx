import { useId, useMemo, useState } from "preact/hooks";
import type { ThemeDefinition, UseCase } from "../lib/themeCatalog";
import { buildNativePreviewDocument } from "../lib/nativePreviewDocument";
import { PREVIEW_PRESETS, previewPreset } from "../lib/projectDocument";
import type { PreviewPreset } from "../lib/projectDocument";
import { UI_LIBRARIES } from "../lib/promptOptions";
import type { UiLibrary } from "../lib/promptOptions";

interface Props {
  theme: ThemeDefinition;
  viewport?: "desktop" | "mobile";
  showControls?: boolean;
  uiLibrary?: UiLibrary;
  useCase?: UseCase;
}

export default function LivePreview({ theme, viewport: sharedViewport, showControls = true, uiLibrary, useCase }: Props) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [motion, setMotion] = useState(false);
  const [selectedLibrary, setLibrary] = useState<UiLibrary>("custom");
  const [selectedPreset, setPreset] = useState<PreviewPreset>(() => previewPreset(theme.useCases[0]));
  const id = useId();
  const library = uiLibrary ?? selectedLibrary;
  const preset = useCase ? previewPreset(useCase) : selectedPreset;
  const size = sharedViewport ?? viewport;
  const document = useMemo(() => buildNativePreviewDocument(theme, preset, library, motion), [theme, preset, library, motion]);
  const hasMotion = ["kinetic-typography", "aurora-ui", "astra", "galaxy"].includes(theme.slug);

  return (
    <div data-theme-preview>
      {showControls && (
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <h2 class="mr-auto text-lg font-semibold">Live component preview</h2>
          <button class="tx-button" type="button" aria-pressed={size === "desktop"} onClick={() => setViewport("desktop")}>Desktop</button>
          <button class="tx-button" type="button" aria-pressed={size === "mobile"} onClick={() => setViewport("mobile")}>Mobile · 360px</button>
        </div>
      )}
      {showControls && <div class="mb-4 flex flex-wrap gap-4">
        <label class="grid gap-1 text-sm" for={`${id}-library`}>Preview library<select class="tx-input" id={`${id}-library`} value={library} disabled={uiLibrary !== undefined} onChange={(event) => setLibrary(event.currentTarget.value as UiLibrary)}>{Object.entries(UI_LIBRARIES).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}</select></label>
        <label class="grid gap-1 text-sm" for={`${id}-preset`}>Preview example<select class="tx-input" id={`${id}-preset`} value={preset} disabled={useCase !== undefined} onChange={(event) => setPreset(event.currentTarget.value as PreviewPreset)}>{Object.entries(PREVIEW_PRESETS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      </div>}
      {hasMotion && <label class="mb-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={motion} onChange={(event) => setMotion(event.currentTarget.checked)} />Show motion (respects reduced motion)</label>}
      <div class="preview-frame" style={{ background: theme.colors.background }}>
        <iframe
          title={`${theme.name} ${size} interactive component preview`}
          sandbox="allow-scripts allow-forms"
          srcDoc={document}
          style={{ width: size === "mobile" ? "360px" : "100%", height: size === "mobile" ? "1240px" : "830px" }}
          loading="lazy"
        />
      </div>
      {showControls && <p class="mt-2 text-sm" style={{ color: "var(--tx-text-muted)" }}>Try the sample controls. daisyUI uses compiled library classes; shadcn/ui uses React components from the New York registry. The three example layouts demonstrate styling with the selected tokens. All content is demo data.</p>}
    </div>
  );
}
