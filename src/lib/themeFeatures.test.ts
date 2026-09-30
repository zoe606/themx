import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { h } from "preact";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { composeTheme, filterThemes } from "./themeCatalog";
import type { ThemeDefinition } from "./themeCatalog";
import { contrastText, exportThemeCSS, exportThemeJSON } from "./themeExport";
import { generatePrompt } from "./generatePrompt";
import ThemeFilter from "../components/ThemeFilter";
import ThemeCompare from "../components/ThemeCompare";
import ThemeExport from "../components/ThemeExport";
import PromptBuilder from "../components/PromptBuilder";

const base: ThemeDefinition = {
  name: "Editorial", slug: "editorial", category: "elegant", kind: "visual-style", year: 2026,
  tags: ["serif", "reading"], tagline: "Readable articles", preview: "/themx/previews/editorial.svg",
  useCases: ["editorial", "portfolio"], avoidFor: ["Dense dashboards"],
  layoutRules: ["Use a readable article column."], interactionRules: ["Underline links."],
  characteristics: ["Serif headings"],
  colors: { primary: "#222222", secondary: "#555555", accent: "#AA3300", background: "#FFFFFF", text: "#222222" },
  typography: { heading: "Georgia", body: "Inter" },
  styleTokens: {
    surfaceBg: "#FFFFFF", surfaceBgImage: "none", cardBg: "#FFFFFF", cardBorder: "#222222",
    cardBorderWidth: "1px", cardRadius: "0", cardShadow: "none", cardBackdropBlur: "0px",
    cardBorderHover: "#AA3300", cardShadowHover: "none", fontHeading: "Georgia", fontBody: "Inter",
    fontHeadingWeight: "700", fontBodyWeight: "400", textMuted: "#555555", textSubtle: "#666666",
    linkColor: "#AA3300", buttonRadius: "0", inputBg: "#FFFFFF", inputBorder: "#222222",
  },
};
const terminal: ThemeDefinition = { ...base, name: "Terminal", slug: "terminal", category: "minimalist",
  tags: ["monospace", "cli"], useCases: ["developer", "dashboard"] };
const bento: ThemeDefinition = { ...base, name: "Bento", slug: "bento-grid", kind: "layout-pattern",
  layoutRules: ["Use varied cell sizes."] };
const glass: ThemeDefinition = { ...base, name: "Glass", slug: "glassmorphism", kind: "visual-effect",
  styleTokens: { ...base.styleTokens!, cardRadius: "1rem", cardBackdropBlur: "16px", cardBg: "rgba(255,255,255,0.1)" } };
const dark: ThemeDefinition = { ...base, name: "Dark", slug: "dark-mode", kind: "color-mode",
  colors: { ...base.colors, background: "#111111", text: "#FFFFFF" },
  styleTokens: { ...base.styleTokens!, surfaceBg: "#111111", cardBg: "#222222", textMuted: "#BBBBBB", cardRadius: "2rem" } };
const themes = [base, terminal, bento, glass, dark];

beforeEach(() => { localStorage.clear(); window.history.replaceState(null, "", "/themx/compare"); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("catalog filtering", () => {
  it("matches all search words across names, tags, and readable use-case labels", () => {
    expect(filterThemes([base, terminal], { query: "  TERMINAL developer tools  " })).toEqual([terminal]);
    expect(filterThemes([base, terminal], { query: "serif reading" })).toEqual([base]);
    expect(filterThemes([base, terminal], { query: "serif cli" })).toEqual([]);
  });
  it("combines search, category, kind, use case, and year", () => {
    expect(filterThemes(themes, { query: "serif", category: "elegant", kind: "layout-pattern", useCase: "portfolio", year: 2026 })).toEqual([bento]);
    expect(filterThemes(themes, { useCase: "education" })).toEqual([]);
    expect(filterThemes(themes, { year: 2020 })).toEqual([]);
  });
});

describe("layer composition and exports", () => {
  it("applies layer scopes and order without changing the base theme", () => {
    const result = composeTheme(base, [bento, glass, dark]);
    expect(result.layoutRules).toEqual(bento.layoutRules);
    expect(result.layoutPattern).toBe("bento-grid");
    expect(result.typography).toEqual(base.typography);
    expect(result.colors).toEqual(dark.colors);
    expect(result.styleTokens?.fontHeading).toBe("Georgia");
    expect(result.styleTokens?.cardRadius).toBe("1rem");
    expect(result.styleTokens?.cardBackdropBlur).toBe("16px");
    expect(result.styleTokens?.cardBg).toBe("rgba(255,255,255,0.1)");
    expect(base.styleTokens?.cardRadius).toBe("0");
    expect(base.colors.background).toBe("#FFFFFF");
  });
  it("exports the same resolved values in CSS and JSON", () => {
    const result = composeTheme(base, [glass, dark]);
    const css = exportThemeCSS(result);
    const json = JSON.parse(exportThemeJSON(result));
    expect(css).toContain('--tx-font-heading: "Georgia", sans-serif;');
    expect(css).toContain("--tx-card-radius: 1rem;");
    expect(css).toContain("--tx-text: #FFFFFF;");
    expect(json.cssVariables["--tx-card-radius"]).toBe("1rem");
    expect(json.styleTokens).toEqual(result.styleTokens);
    expect(json.colors).toEqual(result.colors);
  });
  it("chooses readable black or white button text", () => {
    expect(contrastText("#FFFFFF")).toBe("#000000");
    expect(contrastText("#000000")).toBe("#FFFFFF");
    expect(contrastText("#FF6B6B")).toBe("#000000");
    expect(contrastText("#7C3AED")).toBe("#FFFFFF");
  });
});

describe("project prompts", () => {
  it("includes the project brief, users, exact tokens, and behavior rules", () => {
    const prompt = generatePrompt({ themeName: base.name, characteristics: base.characteristics, colors: base.colors,
      typography: base.typography, styleTokens: base.styleTokens, brief: "  Inventory dashboard  ", audience: "Warehouse operators",
      useCase: "Dashboard", layoutRules: base.layoutRules, interactionRules: base.interactionRules,
      framework: "Astro", cssApproach: "Vanilla CSS", components: ["Tables"], tone: "Professional" });
    expect(prompt).toContain("Project brief: Inventory dashboard");
    expect(prompt).toContain("Target users: Warehouse operators");
    expect(prompt).toContain("--tx-card-radius: 0;");
    expect(prompt).toContain("Use a readable article column.");
    expect(prompt).toContain("Underline links.");
    expect(prompt).toContain("prefers-reduced-motion");
  });
  it("describes each layer's scope in the same order as composition", () => {
    const prompt = generatePrompt({ themeName: base.name, characteristics: base.characteristics, colors: base.colors,
      typography: base.typography, framework: "Astro", cssApproach: "Tailwind", components: [], tone: "Minimal", layers: [bento, glass, dark] });
    expect(prompt.indexOf("Add Bento")).toBeLessThan(prompt.indexOf("Add Glass"));
    expect(prompt.indexOf("Add Glass")).toBeLessThan(prompt.indexOf("Add Dark"));
    expect(prompt).toContain("Keep the base colors and typography. Override only the layout.");
    expect(prompt).toContain("Override the base palette");
  });
  it("uses the same final variables as the combined preview and export", () => {
    const layers = [bento, glass, dark];
    const prompt = generatePrompt({ themeName: base.name, characteristics: base.characteristics, colors: base.colors,
      typography: base.typography, styleTokens: base.styleTokens, framework: "Astro", cssApproach: "Tailwind",
      components: ["Cards"], tone: "Minimal", layers });
    const finalCSS = exportThemeCSS(composeTheme(base, layers)).trim();
    expect(prompt.split("Use these resolved CSS variables for the combined style:")[1]).toContain(finalCSS);
    expect(finalCSS).toContain("--tx-card-bg: rgba(255,255,255,0.1);");
  });
});

describe("catalog controls", () => {
  it("searches, combines filters, and clears an empty result", () => {
    render(h(ThemeFilter, { themes: [base, terminal], categories: ["elegant", "minimalist"], years: [2026], basePath: "/themx" }));
    fireEvent.input(screen.getByRole("searchbox"), { target: { value: "terminal" } });
    expect(screen.queryByRole("heading", { name: "Editorial" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Terminal" })).toBeTruthy();
    fireEvent.change(screen.getByRole("combobox", { name: "Use case" }), { target: { value: "editorial" } });
    expect(screen.getByText(/No themes match/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getAllByRole("heading")).toHaveLength(2);
  });
  it("persists favorites and restores them on the next visit", async () => {
    const props = { themes: [base, terminal], categories: ["elegant"], years: [2026] };
    const first = render(h(ThemeFilter, props));
    fireEvent.click(screen.getByRole("button", { name: "Favorite Editorial" }));
    expect(JSON.parse(localStorage.getItem("themx-favorites")!)).toEqual(["editorial"]);
    first.unmount();
    render(h(ThemeFilter, props));
    await waitFor(() => expect(screen.getByRole("button", { name: "Favorite Editorial" }).getAttribute("aria-pressed")).toBe("true"));
    fireEvent.click(screen.getByRole("checkbox", { name: "Favorites only" }));
    expect(screen.queryByRole("heading", { name: "Terminal" })).toBeNull();
  });
  it("creates a comparison link for exactly two selected themes", () => {
    render(h(ThemeFilter, { themes, categories: ["elegant"], years: [2026], basePath: "/themx" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Compare Editorial" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Compare Terminal" }));
    expect(screen.getByRole("link", { name: "Compare selected themes" }).getAttribute("href")).toBe("/themx/compare?left=editorial&right=terminal");
    expect((screen.getByRole("checkbox", { name: "Compare Bento" }) as HTMLInputElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Remove Editorial" }));
    expect((screen.getByRole("checkbox", { name: "Compare Bento" }) as HTMLInputElement).disabled).toBe(false);
  });
});

describe("comparison controls", () => {
  it("loads shared selections, updates both viewport sizes, and changes the share URL", async () => {
    window.history.replaceState(null, "", "/themx/compare?left=terminal&right=dark-mode");
    render(h(ThemeCompare, { themes, basePath: "/themx" }));
    await waitFor(() => expect((screen.getByRole("combobox", { name: "First theme" }) as HTMLSelectElement).value).toBe("terminal"));
    expect(screen.getByTitle("Dark desktop interactive component preview")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Mobile · 360px" }));
    expect(screen.getByTitle("Terminal mobile interactive component preview").style.width).toBe("360px");
    expect(screen.getByTitle("Dark mobile interactive component preview").style.width).toBe("360px");
    fireEvent.change(screen.getByRole("combobox", { name: "Second theme" }), { target: { value: "editorial" } });
    await waitFor(() => expect(window.location.search).toBe("?left=terminal&right=editorial"));
  });
  it("ignores unknown slugs in a shared comparison", async () => {
    window.history.replaceState(null, "", "/themx/compare?left=missing&right=missing");
    render(h(ThemeCompare, { themes, basePath: "/themx" }));
    await waitFor(() => expect(window.location.search).toBe("?left=editorial&right=terminal"));
  });
});

describe("prompt builder and export controls", () => {
  it("keeps base and combined export controls separately labeled", () => {
    render(h("div", {}, h(ThemeExport, { theme: base }), h(PromptBuilder, { theme: base, themes })));
    fireEvent.change(screen.getByRole("combobox", { name: "Visual effect" }), { target: { value: "glassmorphism" } });
    const exports = screen.getAllByRole("combobox", { name: "Export format", exact: true });
    expect(exports).toHaveLength(2);
    expect(exports[0].id).not.toBe(exports[1].id);
    fireEvent.change(exports[1], { target: { value: "json" } });
    expect((exports[0] as HTMLSelectElement).value).toBe("css");
    expect((exports[1] as HTMLSelectElement).value).toBe("json");
  });
  it("updates the brief and renders a composed preview and export", () => {
    const { container } = render(h(PromptBuilder, { theme: base, themes }));
    fireEvent.input(screen.getByRole("textbox", { name: "Project brief" }), { target: { value: "Inventory dashboard" } });
    expect(container.querySelector("pre")?.textContent).toContain("Project brief: Inventory dashboard");
    fireEvent.change(screen.getByRole("combobox", { name: "Layout pattern" }), { target: { value: "bento-grid" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Visual effect" }), { target: { value: "glassmorphism" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Color mode" }), { target: { value: "dark-mode" } });
    const frame = screen.getByTitle("Editorial + Bento + Glass + Dark desktop interactive component preview") as HTMLIFrameElement;
    expect(frame.srcdoc).toContain("--tx-card-radius: 1rem;");
    expect(frame.srcdoc).toContain("--tx-text: #FFFFFF;");
    expect(frame.srcdoc).toContain('theme-bento-grid');
    expect(container.querySelectorAll("pre")[1].textContent).toContain("Add Dark");
  });
  it("shows a usable fallback when the clipboard is denied", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) } });
    render(h(ThemeExport, { theme: base }));
    fireEvent.click(screen.getByRole("button", { name: "Copy CSS" }));
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("Select and copy"));
    fireEvent.change(screen.getByRole("combobox", { name: "Export format" }), { target: { value: "json" } });
    expect(JSON.parse(document.querySelector("pre")!.textContent!).slug).toBe("editorial");
  });
});
