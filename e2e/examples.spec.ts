import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { examples, ready, noHorizontalOverflow } from "./scenarios.mjs";
import { unzipSync, strFromU8 } from "fflate";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

for (const example of examples) {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    test(`${example.slug} works at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`demos/${example.slug}/`);
      await ready(page);
      await noHorizontalOverflow(page);
      const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(accessibility.violations).toEqual([]);
      await example.flow(page);
      await noHorizontalOverflow(page);
      expect(errors).toEqual([]);
    });
  }
  test(`${example.slug} has a current report and a runnable downloadable bundle`, async ({ page, request }, testInfo) => {
    await page.goto(`examples/${example.slug}/`);
    await expect(page.locator("main[data-example-status]")).toHaveAttribute("data-example-status", "verified");
    const archive = await request.get(`demos/${example.slug}/${example.slug}.zip`);
    expect(archive.ok()).toBe(true);
    const files = unzipSync(await archive.body());
    expect(strFromU8(files["index.html"])).toContain('./assets/');
    expect(strFromU8(files["setup.json"])).toContain('"brief":');
    expect(strFromU8(files["README.md"])).toContain("not an independent comparison of AI models");
    for (const name of ["DESIGN.md", "AGENTS-section.md", "ui-prompt.txt", "theme.css", "theme.json", "assets/LICENSES.txt"]) expect(files[name]).toBeDefined();
    await page.setViewportSize({ width: 360, height: 800 });
    await noHorizontalOverflow(page);
    const directory = testInfo.outputPath("unpacked-example");
    for (const [name, content] of Object.entries(files)) {
      const file = path.join(directory, name);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, content);
    }
    await page.goto(pathToFileURL(path.join(directory, "index.html")).href);
    await ready(page);
    await example.flow(page);
    await noHorizontalOverflow(page);
  });
}
