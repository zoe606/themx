import { useEffect, useState } from "preact/hooks";
import { filterThemes, KIND_LABELS, USE_CASE_LABELS } from "../lib/themeCatalog";
import type { ThemeDefinition, ThemeFilters } from "../lib/themeCatalog";

interface Props {
  themes: ThemeDefinition[];
  categories: string[];
  years: number[];
  basePath?: string;
}

export default function ThemeFilter({ themes, categories, years, basePath = "" }: Props) {
  const [filters, setFilters] = useState<ThemeFilters>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem("themx-favorites") ?? "[]");
      if (Array.isArray(stored)) setFavorites(stored.filter((slug): slug is string => typeof slug === "string" && themes.some((theme) => theme.slug === slug)));
    } catch { setStatus("Saved favorites are unavailable in this browser."); }
  }, [themes]);

  const updateFilter = (key: keyof ThemeFilters, value: string | number | undefined) => setFilters((previous) => ({ ...previous, [key]: value }));
  const toggleFavorite = (slug: string) => {
    const next = favorites.includes(slug) ? favorites.filter((item) => item !== slug) : [...favorites, slug];
    setFavorites(next);
    try { localStorage.setItem("themx-favorites", JSON.stringify(next)); setStatus(""); }
    catch { setStatus("Favorites will be kept until you leave this page. Browser storage is unavailable."); }
  };
  const toggleCompare = (slug: string) => {
    if (selected.includes(slug)) setSelected(selected.filter((item) => item !== slug));
    else if (selected.length < 2) setSelected([...selected, slug]);
  };
  const filtered = filterThemes(themes, filters).filter((theme) => !favoritesOnly || favorites.includes(theme.slug));
  const compareURL = `${basePath}/compare?left=${encodeURIComponent(selected[0] ?? "")}&right=${encodeURIComponent(selected[1] ?? "")}`;

  return (
    <div>
      <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label class="grid gap-2 sm:col-span-2 lg:col-span-4">
          <span class="text-sm font-medium">Search themes</span>
          <input class="tx-input" type="search" value={filters.query ?? ""} placeholder="Search names, tags, or uses — try serif, terminal, or dashboard" onInput={(event) => updateFilter("query", event.currentTarget.value)} />
        </label>
        <label class="grid gap-2"><span class="text-sm">Category</span>
          <select class="tx-input capitalize" value={filters.category ?? ""} onChange={(event) => updateFilter("category", event.currentTarget.value)}><option value="">All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select>
        </label>
        <label class="grid gap-2"><span class="text-sm">Design type</span>
          <select class="tx-input" value={filters.kind ?? ""} onChange={(event) => updateFilter("kind", event.currentTarget.value)}><option value="">All types</option>{Object.entries(KIND_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
        </label>
        <label class="grid gap-2"><span class="text-sm">Use case</span>
          <select class="tx-input" value={filters.useCase ?? ""} onChange={(event) => updateFilter("useCase", event.currentTarget.value)}><option value="">All uses</option>{Object.entries(USE_CASE_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
        </label>
        <label class="grid gap-2"><span class="text-sm">Reference year</span>
          <select class="tx-input" value={filters.year ?? ""} onChange={(event) => updateFilter("year", event.currentTarget.value ? Number(event.currentTarget.value) : undefined)}><option value="">All years</option>{years.map((year) => <option key={year}>{year}</option>)}</select>
        </label>
      </div>
      <div class="mb-6 flex flex-wrap items-center gap-4">
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked={favoritesOnly} onChange={(event) => setFavoritesOnly(event.currentTarget.checked)} />Favorites only</label>
        <button type="button" class="tx-button" onClick={() => { setFilters({}); setFavoritesOnly(false); }}>Clear filters</button>
        <p class="text-sm" role="status">{filtered.length} of {themes.length} themes</p>
      </div>
      <div class="glass mb-6 flex flex-wrap items-center gap-3 p-4">
        <span class="mr-auto text-sm">Select two themes to compare ({selected.length}/2).</span>
        {selected.map((slug) => <button type="button" class="tx-button text-sm" key={slug} onClick={() => toggleCompare(slug)}>Remove {themes.find((theme) => theme.slug === slug)?.name}</button>)}
        {selected.length === 2 ? <a class="tx-button text-sm" href={compareURL}>Compare selected themes</a> : <button class="tx-button text-sm" disabled>Compare selected themes</button>}
      </div>
      {status && <p class="mb-4 text-sm" role="status">{status}</p>}
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((theme) => <article key={theme.slug} class="glass glass-hover overflow-hidden">
          <a href={`${basePath}/themes/${theme.slug}`} class="group block">
            <div class="aspect-[4/3] overflow-hidden" style={{ background: "var(--tx-card-bg)" }}>
              <img src={theme.preview} alt={`${theme.name} theme preview`} class="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" width="800" height="600" />
            </div>
            <div class="p-4 pb-2">
              <h3 class="font-semibold">{theme.name}</h3>
              <p class="mt-1 text-xs capitalize" style={{ color: "var(--tx-text-muted)" }}>{KIND_LABELS[theme.kind]} · {theme.category}</p>
              <p class="mt-2 text-sm" style={{ color: "var(--tx-text-muted)" }}>{theme.tagline}</p>
              <p class="mt-3 text-xs" style={{ color: "var(--tx-text-muted)" }}>For {theme.useCases.map((key) => USE_CASE_LABELS[key]).join(", ")}</p>
              <div class="mt-3 flex gap-2" aria-label="Theme palette">
                {[theme.colors.primary, theme.colors.secondary, theme.colors.accent].map((color, index) => <span key={index} class="h-4 w-4 rounded-full" style={{ backgroundColor: color, border: "1px solid var(--tx-card-border)" }} title={color} />)}
              </div>
            </div>
          </a>
          <div class="flex flex-wrap items-center justify-between gap-3 p-4">
            <button type="button" class="tx-button text-sm" aria-pressed={favorites.includes(theme.slug)} aria-label={`Favorite ${theme.name}`} onClick={() => toggleFavorite(theme.slug)}>{favorites.includes(theme.slug) ? "Saved" : "Favorite"}</button>
            <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked={selected.includes(theme.slug)} disabled={selected.length === 2 && !selected.includes(theme.slug)} onChange={() => toggleCompare(theme.slug)} aria-label={`Compare ${theme.name}`} />Compare</label>
          </div>
        </article>)}
      </div>
      {filtered.length === 0 && <p class="py-12 text-center">No themes match your filters. Try a different search or clear the filters.</p>}
    </div>
  );
}
