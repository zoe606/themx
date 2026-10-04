import { strToU8, zipSync } from "fflate";
import type { ThemeDefinition } from "./themeCatalog";
import { exportLibraryCSS, exportThemeJSON } from "./themeExport";
import { exportMediaEffectSVG } from "./mediaEffect";
import { generatePrompt } from "./generatePrompt";
import { getSkillReferences, UI_LIBRARIES } from "./promptOptions";
import { resolvePromptSetup } from "./promptSetup";
import type { PromptSetup } from "./promptSetup";

export function createPromptBundle(theme: ThemeDefinition, themes: ThemeDefinition[], setup: PromptSetup): Record<string, string> {
  const { composed, config } = resolvePromptSetup(theme, themes, setup);
  const skills = getSkillReferences(setup.skills, setup.uiLibrary);
  const files: Record<string, string> = {
    "DESIGN.md": generatePrompt({ ...config, outputMode: "design-md" }),
    "AGENTS-section.md": generatePrompt({ ...config, outputMode: "agents-md" }),
    "ui-prompt.txt": generatePrompt({ ...config, outputMode: "ui" }),
    "theme.css": exportLibraryCSS(composed, setup.uiLibrary),
    "theme.json": exportThemeJSON(composed, setup.uiLibrary),
    "setup.json": JSON.stringify(setup, null, 2),
    "SKILLS.md": ["# Supporting skills", "", "Install only the skills you want in the target coding agent. These commands are references and have not been run.", "",
      ...skills.flatMap((skill) => [`## ${skill.name}`, "", skill.purpose, `Source: ${skill.url}`, "", "```sh", skill.install, "```", ""]),
      ...(skills.length ? [] : ["No skills were selected."]),
    ].join("\n"),
    "README.md": ["# themx design bundle", "", `Theme: ${composed.name}`, `UI library: ${UI_LIBRARIES[setup.uiLibrary].label}`, `Task: ${setup.taskMode}`, "",
      "1. Read the target project's existing instructions and installed package versions.",
      "2. Merge DESIGN.md with existing design requirements. Add AGENTS-section.md to the applicable AGENTS.md without replacing unrelated instructions.",
      "3. Merge theme.css into your stylesheet and load the fonts listed in DESIGN.md. Library mappings target Tailwind CSS 4 and daisyUI 5. Preserve other supported color modes.",
      "4. Use ui-prompt.txt with your coding agent. Install optional skills from SKILLS.md only when needed.",
      "5. Import setup.json on the same theme page in themx to restore these choices.", "",
      "This bundle contains design requirements and tokens. It does not include an application or install packages.",
      ...(composed.mediaEffect ? ["Add media-filter.svg once and apply the filter to images only."] : []),
    ].join("\n"),
  };
  if (composed.mediaEffect) files["media-filter.svg"] = exportMediaEffectSVG(composed.mediaEffect);
  return files;
}

export function zipFiles(files: Record<string, string | Uint8Array>): Uint8Array {
  return zipSync(Object.fromEntries(Object.entries(files).map(([name, content]) => [name, typeof content === "string" ? strToU8(content) : content])), { level: 6 });
}
