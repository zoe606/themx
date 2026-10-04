import { useMemo, useState } from "preact/hooks";
import type { ThemeDefinition } from "../lib/themeCatalog";
import { buildPreviewDocument } from "../lib/previewDocument";

interface Props {
  theme: ThemeDefinition;
  viewport?: "desktop" | "mobile";
  showControls?: boolean;
}

export default function LivePreview({ theme, viewport: sharedViewport, showControls = true }: Props) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [motion, setMotion] = useState(false);
  const size = sharedViewport ?? viewport;
  const document = useMemo(() => buildPreviewDocument(theme, motion), [theme, motion]);
  const hasMotion = ["kinetic-typography", "aurora-ui", "astra", "galaxy"].includes(theme.slug);

  return (
    <div>
      {showControls && (
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <h2 class="mr-auto text-lg font-semibold">Live component preview</h2>
          <button class="tx-button" type="button" aria-pressed={size === "desktop"} onClick={() => setViewport("desktop")}>Desktop</button>
          <button class="tx-button" type="button" aria-pressed={size === "mobile"} onClick={() => setViewport("mobile")}>Mobile · 360px</button>
        </div>
      )}
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
      {showControls && <p class="mt-2 text-sm" style={{ color: "var(--tx-text-muted)" }}>Try the navigation, add a project, and submit the demo form. This preview uses the theme's colors and style tokens.</p>}
    </div>
  );
}
