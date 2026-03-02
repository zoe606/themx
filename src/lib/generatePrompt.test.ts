import { describe, it, expect } from "vitest";
import { generatePrompt } from "./generatePrompt";

describe("generatePrompt", () => {
  const baseConfig = {
    themeName: "Neo-Brutalism",
    characteristics: [
      "Thick black borders (2-4px)",
      "Bold, saturated colors",
    ],
    colors: {
      primary: "#FF6B6B",
      secondary: "#4ECDC4",
      accent: "#FFE66D",
      background: "#FFFFFF",
      text: "#2D2D2D",
    },
    typography: { heading: "Space Grotesk", body: "Inter" },
    framework: "Next.js",
    cssApproach: "Tailwind",
    components: ["Hero", "Cards"],
    tone: "Professional",
  };

  it("includes the theme name", () => {
    const result = generatePrompt(baseConfig);
    expect(result).toContain("Neo-Brutalism");
  });

  it("includes selected framework and CSS approach", () => {
    const result = generatePrompt(baseConfig);
    expect(result).toContain("Next.js");
    expect(result).toContain("Tailwind");
  });

  it("includes all characteristics", () => {
    const result = generatePrompt(baseConfig);
    expect(result).toContain("Thick black borders (2-4px)");
    expect(result).toContain("Bold, saturated colors");
  });

  it("includes selected components", () => {
    const result = generatePrompt(baseConfig);
    expect(result).toContain("Hero");
    expect(result).toContain("Cards");
  });

  it("includes color values", () => {
    const result = generatePrompt(baseConfig);
    expect(result).toContain("#FF6B6B");
    expect(result).toContain("#4ECDC4");
  });

  it("includes typography fonts", () => {
    const result = generatePrompt(baseConfig);
    expect(result).toContain("Space Grotesk");
    expect(result).toContain("Inter");
  });

  it("handles empty components array", () => {
    const result = generatePrompt({ ...baseConfig, components: [] });
    expect(result).not.toContain("Generate the following components");
  });

  it("says 'utility classes' only for Tailwind", () => {
    const tailwindResult = generatePrompt(baseConfig);
    expect(tailwindResult).toContain("Tailwind utility classes");

    const vanillaResult = generatePrompt({ ...baseConfig, cssApproach: "Vanilla CSS" });
    expect(vanillaResult).not.toContain("utility classes");
    expect(vanillaResult).toContain("Use Vanilla CSS.");
  });
});
