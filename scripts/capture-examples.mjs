import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { strict as assert } from "node:assert";
import { examples, ready, noHorizontalOverflow } from "../e2e/scenarios.mjs";

const base = process.env.THEMX_CAPTURE_URL ?? "http://127.0.0.1:16945/themx/";
const manifest = JSON.parse(await readFile("src/generated/example-manifest.json", "utf8"));
const results = {};
await mkdir("public/examples", { recursive: true });
const browser = await chromium.launch();
try {
  for (const example of examples) {
    const checks = new Set();
    const viewports = [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 390, height: 844 }];
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: "reduce" });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(new URL(`demos/${example.slug}/`, base).href);
      await ready(page);
      await noHorizontalOverflow(page);
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      assert.deepEqual(axe.violations, [], `${example.slug} accessibility at ${viewport.width}px`);
      for (const check of await example.flow(page)) checks.add(check);
      await noHorizontalOverflow(page);
      await page.reload();
      await ready(page);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `public/examples/${example.slug}-${viewport.name}.png`, fullPage: true, animations: "disabled" });
      assert.deepEqual(errors, [], `${example.slug} browser errors`);
      await context.close();
    }
    results[example.slug] = {
      capturedAt: new Date().toISOString(), artifactHash: manifest[example.slug].artifactHash,
      browser: `Chromium ${browser.version()}`,
      checks: [...checks, "No horizontal page overflow at 1440px and 390px", "No browser runtime errors", "Automated WCAG A/AA checks at both viewports"],
      axeViolations: 0,
      viewports: viewports.map(({ width, height }) => ({ width, height })),
      review: [],
    };
    console.log(`Captured and checked ${example.slug}.`);
  }
  await writeFile("src/data/example-results.json", `${JSON.stringify(results, null, 2)}\n`);
} finally {
  await browser.close();
}
