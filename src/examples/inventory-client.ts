const rows = Array.from(document.querySelectorAll<HTMLTableRowElement>("tr[data-sku]"));
const search = document.querySelector<HTMLInputElement>("#stock-search")!;
const all = document.querySelector<HTMLButtonElement>("#all-stock")!;
const low = document.querySelector<HTMLButtonElement>("#low-stock")!;
const form = document.querySelector<HTMLFormElement>("#stock-form")!;
const quantity = document.querySelector<HTMLInputElement>("#stock-quantity")!;
const message = document.querySelector<HTMLParagraphElement>("#stock-message")!;
const submit = document.querySelector<HTMLButtonElement>("#save-stock")!;
const reset = document.querySelector<HTMLButtonElement>("#reset-stock")!;
let lowOnly = false;

function refresh() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  for (const row of rows) {
    const lowStock = Number(row.dataset.stock) < Number(row.dataset.minimum);
    row.hidden = !(row.textContent!.toLowerCase().includes(query) && (!lowOnly || lowStock));
    if (!row.hidden) visible++;
    row.querySelector<HTMLElement>("[data-stock-value]")!.textContent = row.dataset.stock!;
    const badge = row.querySelector<HTMLElement>(".stock-status")!;
    badge.dataset.low = String(lowStock);
    badge.textContent = lowStock ? "Low stock" : "In stock";
  }
  document.querySelector<HTMLElement>("#stock-total")!.textContent = String(rows.reduce((sum, row) => sum + Number(row.dataset.stock), 0));
  document.querySelector<HTMLElement>("#low-total")!.textContent = String(rows.filter((row) => Number(row.dataset.stock) < Number(row.dataset.minimum)).length);
  document.querySelector<HTMLElement>("#stock-empty")!.hidden = visible > 0;
  document.querySelector<HTMLElement>("#stock-filter-status")!.textContent = `Showing ${visible} of ${rows.length} sample items.`;
  all.setAttribute("aria-pressed", String(!lowOnly));
  low.setAttribute("aria-pressed", String(lowOnly));
}
search.addEventListener("input", refresh);
all.addEventListener("click", () => { lowOnly = false; refresh(); });
low.addEventListener("click", () => { lowOnly = true; refresh(); });
reset.addEventListener("click", () => {
  for (const row of rows) row.dataset.stock = row.dataset.initialStock;
  search.value = ""; lowOnly = false; quantity.value = ""; quantity.removeAttribute("aria-invalid"); message.textContent = "Demo stock reset."; refresh();
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (submit.disabled) return;
  const amount = Number(quantity.value);
  if (quantity.value.trim() === "" || !Number.isSafeInteger(amount) || amount < 0) {
    quantity.setAttribute("aria-invalid", "true"); message.textContent = "Enter a whole number of zero or more."; quantity.focus(); return;
  }
  quantity.removeAttribute("aria-invalid"); submit.disabled = true; reset.disabled = true; form.setAttribute("aria-busy", "true"); message.textContent = "Updating demo stock…";
  const sku = document.querySelector<HTMLSelectElement>("#stock-item")!.value;
  setTimeout(() => {
    rows.find((row) => row.dataset.sku === sku)!.dataset.stock = String(amount);
    refresh(); submit.disabled = false; reset.disabled = false; form.removeAttribute("aria-busy"); message.textContent = "Demo stock updated. No server data changed.";
  }, 200);
});
document.documentElement.dataset.demoReady = "true";
