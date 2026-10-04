import { expect } from "@playwright/test";

export async function ready(page) {
  await expect(page.locator("html")).toHaveAttribute("data-demo-ready", "true");
}

export async function inventoryFlow(page) {
  await ready(page);
  const rows = page.locator("tr[data-sku]:visible");
  await expect(rows).toHaveCount(6);
  await expect(page.locator("#stock-total")).toHaveText("105");
  await page.getByLabel("Search sample stock").fill("not-a-sample-item");
  await expect(rows).toHaveCount(0);
  await expect(page.locator("#stock-empty")).toBeVisible();
  await page.getByLabel("Search sample stock").fill("canvas");
  await expect(rows).toHaveCount(1);
  await page.getByLabel("Search sample stock").fill("");
  await page.getByRole("button", { name: "Low stock only" }).click();
  await expect(rows).toHaveCount(2);
  await page.getByRole("button", { name: "All stock", exact: true }).click();
  await page.getByRole("button", { name: "Update demo stock" }).click();
  await expect(page.getByLabel("New quantity")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#stock-message")).toHaveText("Enter a whole number of zero or more.");
  await page.getByRole("combobox", { name: "Item", exact: true }).selectOption("ST-102");
  await page.getByLabel("New quantity").fill("16");
  await page.getByRole("button", { name: "Update demo stock" }).click();
  await expect(page.locator("#stock-form")).toHaveAttribute("aria-busy", "true");
  await expect(page.getByRole("button", { name: "Reset demo" })).toBeDisabled();
  await expect(page.locator("#stock-message")).toContainText("Demo stock updated");
  await expect(page.locator('tr[data-sku="ST-102"] [data-stock-value]')).toHaveText("16");
  await expect(page.locator("#stock-total")).toHaveText("113");
  await expect(page.locator("#low-total")).toHaveText("1");
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.locator("#stock-total")).toHaveText("105");
  await expect(page.locator("#low-total")).toHaveText("2");
  return ["Search, low-stock filtering, and empty results", "Quantity validation, loading, stock totals, and reset"];
}

export async function productFlow(page) {
  await ready(page);
  await expect(page.getByRole("button", { name: "M", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Show back view" }).click();
  await expect(page.getByRole("img", { name: "Sample overshirt, back view" })).toBeVisible();
  await page.getByRole("button", { name: "Show detail view" }).click();
  await expect(page.getByRole("img", { name: "Sample overshirt, detail view" })).toBeVisible();
  await page.getByRole("button", { name: "Add to demo bag" }).click();
  await expect(page.locator("#product-message")).toHaveText("Choose an available size.");
  await page.getByRole("button", { name: "L", exact: true }).click();
  await page.getByLabel("Quantity", { exact: true }).fill("0");
  await page.getByRole("button", { name: "Add to demo bag" }).click();
  await expect(page.getByLabel("Quantity", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await page.getByLabel("Quantity", { exact: true }).fill("2");
  await page.getByRole("button", { name: "Add to demo bag" }).click();
  await expect(page.getByRole("button", { name: "Adding…" })).toBeDisabled();
  await expect(page.locator("#product-message")).toContainText("Added 2 sample items in size L");
  await expect(page.locator("#bag-count")).toHaveText("2");
  await expect(page.locator(".bag-total strong")).toHaveText("$96");
  await page.getByRole("button", { name: "Clear demo bag" }).click();
  await expect(page.locator("#bag-count")).toHaveText("0");
  await expect(page.getByText("Your demo bag is empty.", { exact: true })).toBeVisible();
  return ["React gallery, available sizes, and validation", "Adding state, demo bag quantities, total, and clear action"];
}

export async function portfolioFlow(page, keyboard = page.keyboard) {
  await ready(page);
  await page.getByRole("button", { name: "Identity", exact: true }).click();
  await expect(page.locator("[data-project-category]:visible")).toHaveCount(1);
  await expect(page.locator("#project-filter-status")).toHaveText("Showing 1 of 3 sample projects.");
  const trigger = page.getByRole("button", { name: "View study" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("#project-dialog-title")).toHaveText("A small visual identity");
  await keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole("button", { name: "Close study" }).click();
  await expect(trigger).toBeFocused();
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.locator("[data-project-category]:visible")).toHaveCount(3);
  return ["Project filters and visible counts", "Project dialog, Escape, close action, and restored keyboard focus"];
}

export const examples = [
  { slug: "astra-inventory", flow: inventoryFlow },
  { slug: "enterprise-product", flow: productFlow },
  { slug: "galaxy-portfolio", flow: portfolioFlow },
];

export async function noHorizontalOverflow(page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
}
