import { useState, useEffect } from "preact/hooks";
import type { StyleTokens } from "../lib/themeStorage";
import { getStoredTheme } from "../lib/themeStorage";

interface Props {
  themeName: string;
  themeSlug: string;
  tokens: StyleTokens;
}

export default function ApplyThemeButton({ themeName, themeSlug, tokens }: Props) {
  const [applied, setApplied] = useState(false);

  // Check if this theme is already applied
  useEffect(() => {
    const stored = getStoredTheme();
    if (stored && stored.slug === themeSlug) {
      setApplied(true);
    }
  }, [themeSlug]);

  // Listen for apply/reset events to update button state
  useEffect(() => {
    const onApply = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setApplied(detail?.slug === themeSlug);
    };
    const onReset = () => setApplied(false);

    window.addEventListener("themx:apply", onApply);
    window.addEventListener("themx:reset", onReset);
    return () => {
      window.removeEventListener("themx:apply", onApply);
      window.removeEventListener("themx:reset", onReset);
    };
  }, [themeSlug]);

  const handleClick = () => {
    if (applied) {
      // Reset
      window.dispatchEvent(new CustomEvent("themx:reset"));
    } else {
      // Apply
      window.dispatchEvent(
        new CustomEvent("themx:apply", {
          detail: { name: themeName, slug: themeSlug, tokens },
        })
      );
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.625rem 1.25rem",
        borderRadius: "var(--tx-button-radius)",
        fontSize: "0.875rem",
        fontWeight: 600,
        fontFamily: "var(--tx-font-body)",
        border: applied ? "var(--tx-card-border-width) solid var(--tx-card-border)" : "none",
        background: applied ? "transparent" : "var(--tx-link-color)",
        color: applied ? "var(--tx-text)" : "#FFFFFF",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      {applied ? (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Applied — Click to Reset
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <path d="M2 4.5h12M2 8h12M2 11.5h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          Apply This Theme
        </>
      )}
    </button>
  );
}
