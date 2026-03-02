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
}

const categoryColors: Record<string, string> = {
  minimalist: "bg-gray-100 text-gray-700 border-gray-300",
  bold: "bg-red-100 text-red-700 border-red-300",
  elegant: "bg-purple-100 text-purple-700 border-purple-300",
  playful: "bg-yellow-100 text-yellow-700 border-yellow-300",
  corporate: "bg-blue-100 text-blue-700 border-blue-300",
};

export default function ThemeFilter({ themes, categories, years }: Props) {
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
        <span class="text-sm font-medium text-gray-500">Filter:</span>

        {/* Category pills */}
        <button
          onClick={() => setActiveCategory(null)}
          class={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            activeCategory === null
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            class={`rounded-full px-3 py-1 text-sm font-medium capitalize transition-colors ${
              activeCategory === cat
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
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
          class="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm text-gray-600"
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
            href={`/themes/${theme.slug}`}
            class="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
          >
            <div class="aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src={theme.preview}
                alt={`${theme.name} theme preview`}
                class="h-full w-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div class="p-4">
              <div class="mb-2 flex items-center gap-2">
                <h3 class="font-semibold text-gray-900">{theme.name}</h3>
                <span
                  class={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    categoryColors[theme.category] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {theme.category}
                </span>
              </div>
              <p class="text-sm text-gray-500">{theme.tagline}</p>
              <div class="mt-3 flex gap-1.5">
                {[theme.colors.primary, theme.colors.secondary, theme.colors.accent].map(
                  (color) => (
                    <div
                      class="h-4 w-4 rounded-full border border-gray-200"
                      style={`background-color: ${color}`}
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
        <p class="py-12 text-center text-gray-400">No themes match your filters.</p>
      )}
    </div>
  );
}
