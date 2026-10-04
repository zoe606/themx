const projects = Array.from(document.querySelectorAll<HTMLElement>("[data-project-category]"));
const filters = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-project-filter]"));
for (const button of filters) button.addEventListener("click", () => {
  let visible = 0;
  for (const project of projects) {
    project.hidden = button.dataset.projectFilter !== "All" && project.dataset.projectCategory !== button.dataset.projectFilter;
    if (!project.hidden) visible++;
  }
  for (const filter of filters) filter.setAttribute("aria-pressed", String(filter === button));
  document.querySelector("#project-filter-status")!.textContent = `Showing ${visible} of ${projects.length} sample projects.`;
});
const dialog = document.querySelector<HTMLDialogElement>("#project-dialog")!;
for (const button of document.querySelectorAll<HTMLButtonElement>("[data-project-title]")) button.addEventListener("click", () => {
  document.querySelector("#project-dialog-title")!.textContent = button.dataset.projectTitle!;
  document.querySelector("#project-dialog-description")!.textContent = button.dataset.projectDescription!;
  dialog.showModal();
});
document.documentElement.dataset.demoReady = "true";
