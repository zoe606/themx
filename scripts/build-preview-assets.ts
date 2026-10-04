import { createElement } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { compile, optimize } from "@tailwindcss/node";
import { build as buildScript } from "esbuild";
import { build as buildReact } from "vite";
import { mkdir, readdir, readFile, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { parse } from "yaml";
import { InventoryExample } from "../src/examples/inventory";
import { ProductExample } from "../src/examples/product";
import { PortfolioExample } from "../src/examples/portfolio";
import { EXAMPLES, resolveExample } from "../src/lib/exampleCatalog";
import { buildProjectDocument } from "../src/lib/projectDocument";
import { createPromptBundle, zipFiles } from "../src/lib/promptBundle";
import { exportLibraryCSS } from "../src/lib/themeExport";
import type { ThemeDefinition } from "../src/lib/themeCatalog";
import type { UiLibrary } from "../src/lib/promptOptions";

const root = process.cwd();
const assets = path.join(root, "public/preview-assets");
await mkdir(assets, { recursive: true });
await mkdir(path.join(root, "src/generated"), { recursive: true });
const themeDirectory = path.join(root, "src/data/themes");
const themes: ThemeDefinition[] = await Promise.all((await readdir(themeDirectory)).filter((file) => file.endsWith(".mdx")).map(async (file) => {
  const source = await readFile(path.join(themeDirectory, file), "utf8");
  return parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)![1]) as ThemeDefinition;
}));
const templates: Record<string, Record<string, string>> = {};
const libraries: UiLibrary[] = ["custom", "daisyui", "shadcn"];
for (const [preset, Component] of Object.entries({ inventory: InventoryExample, product: ProductExample, portfolio: PortfolioExample })) {
  const render = preset === "product" ? renderToString : renderToStaticMarkup;
  templates[preset] = Object.fromEntries(libraries.map((library) => [library, render(createElement(Component, { library }))]));
}
await writeFile(path.join(root, "src/generated/preview-templates.json"), JSON.stringify(templates));

const classes = new Set<string>();
for (const markup of Object.values(templates).flatMap(Object.values)) {
  for (const match of markup.matchAll(/class="([^"]*)"/g)) {
    for (const token of match[1].replaceAll("&amp;", "&").split(/\s+/)) if (token) classes.add(token);
  }
}
const neutral = themes.find((theme) => theme.slug === "enterprise-flat")!;
for (const library of ["daisyui", "shadcn"] as const) {
  const mapping = exportLibraryCSS(neutral, library).replace("themes: false;", "themes: false;\n  include: button, input, card, table, badge;");
  const compiler = await compile(`@import "tailwindcss" source(none);\n${mapping}`, { base: root, onDependency() {} });
  await writeFile(path.join(assets, `${library}.css`), optimize(compiler.build([...classes]), { minify: true }).code);
}
await copyFile(path.join(root, "src/preview/layout.css"), path.join(assets, "layout.css"));
for (const preset of ["inventory", "portfolio"]) {
  await buildScript({ entryPoints: [path.join(root, `src/examples/${preset}-client.ts`)], outfile: path.join(assets, `${preset}.js`), bundle: true, format: "iife", platform: "browser", target: "es2020", minify: true });
}
await buildReact({
  configFile: false, root, logLevel: "error", publicDir: false,
  define: { "process.env.NODE_ENV": '"production"' },
  esbuild: { jsxImportSource: "react", jsx: "automatic" },
  build: { outDir: assets, emptyOutDir: false, lib: { entry: path.join(root, "src/examples/product-client.tsx"), name: "ThemxProductDemo", formats: ["iife"], fileName: () => "product.js" }, minify: true },
});

const notices = [await readFile(path.join(root, "THIRD_PARTY_NOTICES.md"), "utf8")];
for (const dependency of ["daisyui", "tailwindcss", "react", "react-dom", "scheduler", "@radix-ui/react-slot", "@radix-ui/react-compose-refs", "class-variance-authority", "clsx", "tailwind-merge", "fflate"]) {
  const directory = path.join(root, "node_modules", dependency);
  const file = (await readdir(directory)).find((name) => /^license(?:\.|$)/i.test(name));
  if (file) notices.push(`\n## ${dependency}\n\n${await readFile(path.join(directory, file), "utf8")}`);
}
await writeFile(path.join(assets, "LICENSES.txt"), notices.join("\n"));

const manifest: Record<string, { artifactHash: string }> = {};
for (const spec of EXAMPLES) {
  const example = resolveExample(spec, themes);
  const directory = path.join(root, "public/demos", spec.slug);
  await mkdir(path.join(directory, "assets"), { recursive: true });
  const document = buildProjectDocument(example.composed, templates[spec.preset][example.setup.uiLibrary], spec.preset, example.setup.uiLibrary, "./assets");
  const files: Record<string, string | Uint8Array> = {
    ...createPromptBundle(example.theme, themes, example.setup),
    "index.html": document,
    [`source/${spec.preset}.tsx`]: await readFile(path.join(root, `src/examples/${spec.preset}.tsx`), "utf8"),
    [`source/${spec.preset}-client.${spec.preset === "product" ? "tsx" : "ts"}`]: await readFile(path.join(root, `src/examples/${spec.preset}-client.${spec.preset === "product" ? "tsx" : "ts"}`), "utf8"),
    "source/controls.tsx": await readFile(path.join(root, "src/preview/controls.tsx"), "utf8"),
  };
  files["README.md"] = `${String(files["README.md"]).replace("This bundle contains design requirements and tokens. It does not include an application or install packages.", "This example archive includes design requirements, tokens, and a runnable demo. It does not install packages.")}\n\n## Runnable reference example\n\nOpen index.html in a browser. The demo is static and all assets are included. Fonts use Google Fonts with local fallbacks. Sample actions run locally and do not contact a server.\n\nThe source template was produced by the coding agent from the recorded themx prompt, then corrected during browser verification. This is one implementation example, not an independent comparison of AI models. React is used to render the templates at build time. The product example also uses React in the browser. Source templates are built by scripts/build-preview-assets.ts in the themx repository.\n\nShadcn component source and notices are included in source/ui and assets/LICENSES.txt. Package versions are recorded in source/package.json and source/package-lock.json.\n`;
  for (const file of ["layout.css", `${spec.preset}.js`, "LICENSES.txt", ...(example.setup.uiLibrary === "custom" ? [] : [`${example.setup.uiLibrary}.css`])]) files[`assets/${file}`] = await readFile(path.join(assets, file));
  files["source/package.json"] = await readFile(path.join(root, "package.json"), "utf8");
  files["source/package-lock.json"] = await readFile(path.join(root, "package-lock.json"), "utf8");
  files["source/utils.ts"] = await readFile(path.join(root, "src/preview/utils.ts"), "utf8");
  for (const file of await readdir(path.join(root, "src/preview/ui"))) files[`source/ui/${file}`] = await readFile(path.join(root, "src/preview/ui", file), "utf8");
  for (const [name, content] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(directory, name)), { recursive: true });
    await writeFile(path.join(directory, name), content);
  }
  const artifact = createHash("sha256");
  for (const name of Object.keys(files).filter((name) => !name.startsWith("source/")).sort()) artifact.update(name).update(files[name]);
  manifest[spec.slug] = { artifactHash: artifact.digest("hex") };
  await writeFile(path.join(directory, `${spec.slug}.zip`), zipFiles(files));
}
await writeFile(path.join(root, "src/generated/example-manifest.json"), JSON.stringify(manifest, null, 2));
console.log("Prepared native previews and three runnable reference examples.");
