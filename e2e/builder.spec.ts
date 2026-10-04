import { readFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";
import { unzipSync, strFromU8 } from "fflate";
import { ready, noHorizontalOverflow } from "./scenarios.mjs";

test("native library previews, composed tokens, and ZIP use the same saved setup", async ({ page }) => {
  await page.goto("themes/astra/");
  await expect(page.locator("astro-island:has(#prompt-builder)")).not.toHaveAttribute("ssr", "");
  const builder = page.locator("#prompt-builder");
  await builder.getByLabel("Project brief", { exact: true }).fill("Warehouse stock for the night shift");
  await builder.getByRole("combobox", { name: "UI library", exact: true }).selectOption("daisyui");
  await builder.getByRole("combobox", { name: "Layout pattern", exact: true }).selectOption("bento-grid");
  await builder.locator("iframe").scrollIntoViewIfNeeded();
  const preview = builder.frameLocator("iframe");
  await ready(preview);
  await expect(preview.locator("body")).toHaveAttribute("data-preview-library", "daisyui");
  const resolved = await preview.getByRole("button", { name: "Update demo stock" }).evaluate((button) => ({
    background: getComputedStyle(button).backgroundColor, radius: getComputedStyle(button).borderRadius,
    primary: getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim(),
  }));
  expect(resolved.background).toBe("rgb(115, 223, 245)");
  expect(resolved.radius).toBe("6px");
  expect(resolved.primary).toBe("#73DFF5");
  expect(await preview.locator(".metric-grid").evaluate((grid) => {
    const tracks = getComputedStyle(grid).gridTemplateColumns.split(" ").map(parseFloat);
    return tracks[0] / tracks[1];
  })).toBeCloseTo(2);
  await builder.getByRole("button", { name: "Save setup", exact: true }).click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("themx-prompt-astra")!));
  const downloadEvent = page.waitForEvent("download");
  await builder.getByRole("button", { name: "Download design bundle .zip" }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("astra-design-bundle.zip");
  const files = unzipSync(await readFile((await download.path())!));
  expect(JSON.parse(strFromU8(files["setup.json"]))).toEqual(saved);
  const tokens = JSON.parse(strFromU8(files["theme.json"]));
  expect(tokens.colors.primary).toBe(resolved.primary);
  expect(strFromU8(files["theme.css"])).toContain(`--tx-primary: ${resolved.primary};`);
  expect(strFromU8(files["theme.css"])).toContain("--color-primary: var(--tx-primary);");
  expect(strFromU8(files["DESIGN.md"])).toContain("Bento");
  expect(strFromU8(files["ui-prompt.txt"])).toContain("Warehouse stock for the night shift");
  await page.reload();
  await expect(builder.getByRole("combobox", { name: "UI library", exact: true })).toHaveValue("daisyui");
  await expect(builder.getByLabel("Project brief", { exact: true })).toHaveValue(saved.brief);
  await builder.getByRole("button", { name: "Reset setup", exact: true }).click();
  await expect(builder.getByRole("combobox", { name: "UI library", exact: true })).toHaveValue("custom");
  await builder.getByLabel("Import setup", { exact: true }).setInputFiles({ name: "setup.json", mimeType: "application/json", buffer: Buffer.from(files["setup.json"]) });
  await expect(builder.getByLabel("Project brief", { exact: true })).toHaveValue(saved.brief);
});

test("purpose switches the native preview and unsupported stacks reset the library", async ({ page }) => {
  await page.goto("themes/enterprise-flat/");
  await expect(page.locator("astro-island:has(#prompt-builder)")).not.toHaveAttribute("ssr", "");
  const builder = page.locator("#prompt-builder");
  await builder.getByRole("combobox", { name: "Framework", exact: true }).selectOption("React (Vite)");
  await builder.getByRole("combobox", { name: "UI library", exact: true }).selectOption("shadcn");
  await builder.getByRole("combobox", { name: "Page purpose", exact: true }).selectOption("ecommerce");
  await builder.locator("iframe").scrollIntoViewIfNeeded();
  const preview = builder.frameLocator("iframe");
  await ready(preview);
  await expect(preview.locator("body")).toHaveAttribute("data-preview-preset", "product");
  expect(await preview.getByRole("button", { name: "Add to demo bag" }).evaluate((button) => getComputedStyle(button).backgroundColor)).toBe("rgb(37, 99, 235)");
  await preview.getByRole("button", { name: "S", exact: true }).click();
  await preview.getByRole("button", { name: "Add to demo bag" }).click();
  await expect(preview.locator("#bag-count")).toHaveText("1");
  await builder.getByRole("combobox", { name: "Framework", exact: true }).selectOption("Astro");
  await expect(builder.getByRole("combobox", { name: "UI library", exact: true })).toHaveValue("custom");
  await expect(builder.getByRole("status").last()).toContainText("shadcn/ui requires Next.js or React");
});

test("optional orbital motion respects reduced motion on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("themes/galaxy/");
  await expect(page.locator("astro-island:has(> [data-theme-preview])")).not.toHaveAttribute("ssr", "");
  const previewSection = page.locator("[data-theme-preview]").first();
  await previewSection.getByLabel("Show motion (respects reduced motion)").check();
  const preview = previewSection.frameLocator("iframe");
  await ready(preview);
  expect(await preview.locator(".orbital-ring").first().evaluate((ring) => getComputedStyle(ring).animationName)).toBe("orbit");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await preview.locator(".orbital-ring").first().evaluate((ring) => getComputedStyle(ring).animationName)).toBe("none");
  await noHorizontalOverflow(page);
  await previewSection.getByRole("button", { name: "Mobile · 360px", exact: true }).click();
  expect(await preview.locator("html").evaluate((html) => html.scrollWidth <= window.innerWidth + 1)).toBe(true);
});
