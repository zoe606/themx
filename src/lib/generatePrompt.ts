export interface PromptConfig {
  themeName: string;
  characteristics: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  framework: string;
  cssApproach: string;
  components: string[];
  tone: string;
}

export function generatePrompt(config: PromptConfig): string {
  const lines: string[] = [];

  lines.push(
    `You are building a web application using ${config.framework} with ${config.cssApproach}.`
  );
  lines.push(
    `Apply a ${config.themeName} design style with these characteristics:`
  );

  for (const c of config.characteristics) {
    lines.push(`- ${c}`);
  }

  lines.push("");
  lines.push(
    `Color palette: primary ${config.colors.primary}, secondary ${config.colors.secondary}, accent ${config.colors.accent}, background ${config.colors.background}, text ${config.colors.text}`
  );
  lines.push(
    `Typography: ${config.typography.heading} for headings, ${config.typography.body} for body text`
  );
  lines.push(`Tone: ${config.tone}`);

  if (config.components.length > 0) {
    lines.push("");
    lines.push("Generate the following components in this style:");
    for (const comp of config.components) {
      lines.push(`- ${comp}`);
    }
  }

  lines.push("");
  if (config.cssApproach === "Tailwind") {
    lines.push("Use Tailwind utility classes. Ensure responsive design (mobile-first).");
  } else {
    lines.push(`Use ${config.cssApproach}. Ensure responsive design (mobile-first).`);
  }

  return lines.join("\n");
}
