import templates from "../generated/preview-templates.json";
import type { ThemeDefinition } from "./themeCatalog";
import type { UiLibrary } from "./promptOptions";
import { buildProjectDocument } from "./projectDocument";
import type { PreviewPreset } from "./projectDocument";

export function buildNativePreviewDocument(theme: ThemeDefinition, preset: PreviewPreset, library: UiLibrary, motion = false): string {
  const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "/themx";
  return buildProjectDocument(theme, templates[preset][library], preset, library, `${base}/preview-assets`, motion);
}
