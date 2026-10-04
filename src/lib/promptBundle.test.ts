import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { strFromU8, unzipSync } from "fflate";
import { describe, expect, it } from "vitest";
import { EXAMPLES, resolveExample } from "./exampleCatalog";
import { createPromptBundle, zipFiles } from "./promptBundle";
import { resolvePromptSetup } from "./promptSetup";
import { exportLibraryCSS, exportThemeJSON } from "./themeExport";
import type { ThemeDefinition } from "./themeCatalog";

const directory = path.join(process.cwd(), "src/data/themes");
const themes = readdirSync(directory).filter((file) => file.endsWith(".mdx")).map((file) => {
  const source = readFileSync(path.join(directory, file), "utf8");
  return parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)![1]) as ThemeDefinition;
});
const unpack = (files: Record<string, string>) => Object.fromEntries(Object.entries(unzipSync(zipFiles(files))).map(([name, bytes]) => [name, strFromU8(bytes)]));

describe("downloadable design bundles", () => {
  it.each(EXAMPLES)("restores the recorded setup and tokens for $slug", (spec) => {
    const example = resolveExample(spec, themes);
    const files = unpack(createPromptBundle(example.theme, themes, example.setup));
    expect(Object.keys(files).sort()).toEqual(["AGENTS-section.md", "DESIGN.md", "README.md", "SKILLS.md", "setup.json", "theme.css", "theme.json", "ui-prompt.txt"].sort());
    expect(JSON.parse(files["setup.json"])).toEqual(example.setup);
    expect(files["theme.css"]).toBe(exportLibraryCSS(example.composed, example.setup.uiLibrary));
    expect(files["theme.json"]).toBe(exportThemeJSON(example.composed, example.setup.uiLibrary));
    for (const name of ["ui-prompt.txt", "DESIGN.md"]) expect(files[name]).toContain(example.theme.name);
    expect(files["AGENTS-section.md"]).toContain("read DESIGN.md");
    expect(files["ui-prompt.txt"]).toContain(example.setup.brief);
    expect(files["SKILLS.md"]).toContain("https://github.com/miqdadbadjuber/anti-slop");
    expect(files["README.md"]).toContain("without replacing unrelated instructions");
  });

  it("keeps composed image filters and library tokens together in an imported bundle", () => {
    const example = resolveExample(EXAMPLES[0], themes);
    const setup = { ...example.setup, layerSlugs: { "layout-pattern": "bento-grid", "visual-effect": "duotone", "color-mode": "dark-mode" } };
    const { composed } = resolvePromptSetup(example.theme, themes, setup);
    const files = unpack(createPromptBundle(example.theme, themes, setup));
    const json = JSON.parse(files["theme.json"]);
    expect(json.svgFilter).toBe(files["media-filter.svg"]);
    expect(json.colors).toEqual(composed.colors);
    expect(files["theme.css"]).toContain('--tx-media-filter: url("#tx-media-effect");');
    expect(files["DESIGN.md"]).toContain(files["theme.css"].trim());
    expect(files["ui-prompt.txt"]).toContain("Bento");
  });
});
