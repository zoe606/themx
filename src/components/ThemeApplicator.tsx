import { useState, useEffect, useCallback } from "preact/hooks";
import type { StyleTokens, StoredTheme } from "../lib/themeStorage";
import {
  getStoredTheme,
  setStoredTheme,
  clearStoredTheme,
  applyTokensToDOM,
  removeTokensFromDOM,
} from "../lib/themeStorage";
import { loadThemeFonts } from "../lib/loadFont";

interface ApplyDetail {
  name: string;
  slug: string;
  tokens: StyleTokens;
}

export default function ThemeApplicator() {
  const [active, setActive] = useState<StoredTheme | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayColor, setOverlayColor] = useState("#0F172A");

  // On mount, restore theme from localStorage
  useEffect(() => {
    const stored = getStoredTheme();
    if (stored) {
      applyTokensToDOM(stored.tokens);
      loadThemeFonts(
        stored.tokens.fontHeading,
        stored.tokens.fontBody,
        stored.tokens.fontHeadingWeight,
        stored.tokens.fontBodyWeight
      );
      setActive(stored);
    }
  }, []);

  const applyTheme = useCallback((detail: ApplyDetail) => {
    const { name, slug, tokens } = detail;

    // Set overlay color to target theme's background
    setOverlayColor(tokens.surfaceBg);
    setOverlayVisible(true);

    // Load fonts while overlay is showing
    loadThemeFonts(
      tokens.fontHeading,
      tokens.fontBody,
      tokens.fontHeadingWeight,
      tokens.fontBodyWeight
    );

    // After overlay fades in, swap the vars
    setTimeout(() => {
      applyTokensToDOM(tokens);
      const stored: StoredTheme = { name, slug, tokens };
      setStoredTheme(stored);
      setActive(stored);

      // Fade out overlay
      setTimeout(() => {
        setOverlayVisible(false);
      }, 200);
    }, 350);
  }, []);

  const resetTheme = useCallback(() => {
    // Overlay with default glassmorphism bg
    setOverlayColor("#0F172A");
    setOverlayVisible(true);

    setTimeout(() => {
      removeTokensFromDOM();
      clearStoredTheme();
      setActive(null);

      setTimeout(() => {
        setOverlayVisible(false);
      }, 200);
    }, 350);
  }, []);

  // Listen for custom events from ApplyThemeButton
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ApplyDetail>).detail;
      if (detail) applyTheme(detail);
    };
    window.addEventListener("themx:apply", handler);
    return () => window.removeEventListener("themx:apply", handler);
  }, [applyTheme]);

  // Listen for reset events
  useEffect(() => {
    const handler = () => resetTheme();
    window.addEventListener("themx:reset", handler);
    return () => window.removeEventListener("themx:reset", handler);
  }, [resetTheme]);

  return (
    <>
      {/* Transition overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          backgroundColor: overlayColor,
          opacity: overlayVisible ? 1 : 0,
          pointerEvents: overlayVisible ? "all" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Floating indicator */}
      {active && (
        <div
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 0.75rem 0.5rem 1rem",
            borderRadius: "9999px",
            fontSize: "0.8125rem",
            fontWeight: 500,
            background: "var(--tx-card-bg)",
            border: "var(--tx-card-border-width) solid var(--tx-card-border)",
            backdropFilter: "blur(var(--tx-card-backdrop-blur))",
            WebkitBackdropFilter: "blur(var(--tx-card-backdrop-blur))",
            boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
            color: "var(--tx-text)",
          }}
        >
          <span>{active.name}</span>
          <button
            onClick={resetTheme}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.25rem 0.625rem",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: 500,
              background: "var(--tx-link-color)",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      )}
    </>
  );
}
