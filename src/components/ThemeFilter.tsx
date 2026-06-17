import { useState } from "preact/hooks";

interface ThemeData {
  name: string;
  slug: string;
  category: string;
  year: number;
  tagline: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface Props {
  themes: ThemeData[];
  categories: string[];
  years: number[];
  basePath?: string;
}

const categoryColors: Record<string, string> = {
  minimalist: "bg-white/10 text-white/80 border-white/20",
  bold: "bg-red-500/20 text-red-300 border-red-500/30",
  elegant: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  playful: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  corporate: "bg-blue-500/20 text-blue-300 border-blue-500/30",
};

export default function ThemeFilter({ themes, categories, years, basePath = "" }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  const filtered = themes.filter((t) => {
    if (activeCategory && t.category !== activeCategory) return false;
    if (activeYear && t.year !== activeYear) return false;
    return true;
  });

  return (
    <div>
      {/* Filter bar */}
      <div class="mb-8 flex flex-wrap items-center gap-3">
        <span class="text-sm font-medium" style={{ color: "var(--tx-text-subtle)" }}>Filter:</span>

        {/* Category pills */}
        <button
          onClick={() => setActiveCategory(null)}
          class="rounded-full px-3 py-1 text-sm font-medium transition-colors"
          style={{
            borderRadius: "var(--tx-button-radius)",
            background: activeCategory === null ? "var(--tx-link-color)" : "var(--tx-card-bg)",
            color: activeCategory === null ? "#fff" : "var(--tx-text-muted)",
            border: activeCategory === null ? "none" : "var(--tx-card-border-width) solid var(--tx-card-border)",
          }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            class="rounded-full px-3 py-1 text-sm font-medium capitalize transition-colors"
            style={{
              borderRadius: "var(--tx-button-radius)",
              background: activeCategory === cat ? "var(--tx-link-color)" : "var(--tx-card-bg)",
              color: activeCategory === cat ? "#fff" : "var(--tx-text-muted)",
              border: activeCategory === cat ? "none" : "var(--tx-card-border-width) solid var(--tx-card-border)",
            }}
          >
            {cat}
          </button>
        ))}

        {/* Year dropdown */}
        <select
          value={activeYear ?? ""}
          onChange={(e) => {
            const val = (e.target as HTMLSelectElement).value;
            setActiveYear(val ? Number(val) : null);
          }}
          class="rounded-lg px-3 py-1 text-sm backdrop-blur"
          style={{
            background: "var(--tx-input-bg)",
            border: "1px solid var(--tx-input-border)",
            color: "var(--tx-text)",
            borderRadius: "var(--tx-button-radius)",
          }}
        >
          <option value="">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Theme grid */}
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((theme) => (
          <a
            key={theme.slug}
            href={`${basePath}/themes/${theme.slug}`}
            class="glass glass-hover group block overflow-hidden transition-shadow"
          >
            <div class="aspect-[4/3] overflow-hidden" style={{ background: "var(--tx-card-bg)" }}>
              <img
                src={theme.preview}
                alt={`${theme.name} theme preview`}
                class="h-full w-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div class="p-4">
              <div class="mb-2 flex items-center gap-2">
                <h3 class="font-semibold" style={{ color: "var(--tx-text)" }}>{theme.name}</h3>
                <span
                  class={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                    categoryColors[theme.category] ?? "bg-white/10 text-white/80 border-white/20"
                  }`}
                >
                  {theme.category}
                </span>
              </div>
              <p class="text-sm" style={{ color: "var(--tx-text-subtle)" }}>{theme.tagline}</p>
              <div class="mt-3 flex gap-1.5">
                {[theme.colors.primary, theme.colors.secondary, theme.colors.accent].map(
                  (color) => (
                    <div
                      key={color}
                      class="h-4 w-4 rounded-full"
                      style={{ backgroundColor: color, border: "1px solid var(--tx-card-border)" }}
                      title={color}
                    />
                  )
                )}
              </div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <p class="py-12 text-center" style={{ color: "var(--tx-text-subtle)" }}>No themes match your filters.</p>
      )}
    </div>
  );
}
