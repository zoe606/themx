import type { ThemeDefinition } from "./themeCatalog";
import { contrastText, exportThemeCSS } from "./themeExport";
import { landscapeIllustration } from "./mediaEffect";

const escapeHTML = (value: string) => value.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[char]!));

const decorations: Record<string, string> = {
  "blueprint-technical": `<svg viewBox="0 0 320 280" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M60 72L166 36L258 90V204L153 246L60 190Z M60 72L153 127L258 90 M153 127V246 M166 36V145L60 190 M166 145L258 204"/><path d="M30 72V190 M23 72H37 M23 190H37 M60 262H258 M60 255V269 M258 255V269"/><circle cx="153" cy="127" r="26" stroke-dasharray="4 4"/><text x="12" y="140" font-size="12" fill="currentColor" stroke="none" transform="rotate(-90 12 140)">HEIGHT</text><text x="125" y="278" font-size="12" fill="currentColor" stroke="none">WIDTH</text></svg>`,
  "bauhaus-geometric": `<svg viewBox="0 0 320 280" aria-hidden="true"><rect x="10" y="20" width="140" height="240" fill="var(--tx-secondary)"/><circle cx="165" cy="102" r="80" fill="var(--tx-primary)"/><path d="M175 270L310 82V270Z" fill="var(--tx-accent)"/><rect x="25" y="188" width="170" height="18" fill="var(--tx-text)"/></svg>`,
  "art-nouveau": `<svg viewBox="0 0 280 340" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M24 322V134C24 56 77 18 140 18S256 56 256 134V322 M36 322V134C36 67 81 30 140 30S244 67 244 134V322 M54 305H226"/><path d="M140 305C80 252 76 197 110 155C145 112 145 91 140 58 M140 305C200 252 204 197 170 155C135 112 135 91 140 58 M110 237C65 240 52 203 66 181C86 180 109 202 110 237Z M170 237C215 240 228 203 214 181C194 180 171 202 170 237Z M103 187C61 172 65 136 86 122C108 138 115 160 103 187Z M177 187C219 172 215 136 194 122C172 138 165 160 177 187Z M140 126C113 101 114 78 140 58C166 78 167 101 140 126Z"/><circle cx="140" cy="284" r="8" fill="var(--tx-accent)" stroke="none"/></svg>`,
};

export function buildPreviewDocument(theme: ThemeDefinition, motion = false): string {
  const decoration = decorations[theme.slug];
  const mediaPreview = theme.mediaEffect ? `<figure class="media-comparison" aria-label="Image treatment comparison"><div><p class="eyebrow">Original illustration</p>${landscapeIllustration("original")}</div><div><p class="eyebrow">${theme.mediaEffect.kind === "duotone" ? "Duotone" : "Risograph"} treatment</p>${landscapeIllustration("treated", theme.mediaEffect)}</div><figcaption class="muted">Two image inks: ${theme.mediaEffect.ink1} and ${theme.mediaEffect.ink2}. Text and controls remain unfiltered.</figcaption></figure>` : "";
  const fonts = [...new Set([theme.typography.heading, theme.typography.body])];
  const fontLinks = fonts.filter((font) => !["system-ui", "serif", "sans-serif", "monospace", "Helvetica Neue", "SF Pro Display", "SF Pro Text"].includes(font))
    .map((font) => `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}&display=swap">`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHTML(theme.name)} component demo</title>${fontLinks}<style>
    ${exportThemeCSS(theme).replace(/<\//g, "<\\/")}
    * { box-sizing: border-box; }
    body { margin: 0; padding: 24px; background-color: var(--tx-surface-bg, #fff); background-image: var(--tx-surface-bg-image, none); color: var(--tx-text); font-family: var(--tx-font-body, sans-serif); font-weight: var(--tx-font-body-weight, 400); font-size: 14px; line-height: 1.6; }
    h1, h2, h3, strong { font-family: var(--tx-font-heading, sans-serif); font-weight: var(--tx-font-heading-weight, 700); }
    h1 { font-size: clamp(28px, 5vw, 46px); line-height: 1.2; margin: 14px 0; }
    h2 { font-size: 20px; margin: 0 0 12px; }
    p { margin: 8px 0; }
    .muted { color: var(--tx-text-muted, #555); }
    .eyebrow { font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--tx-text-muted, #555); }
    header, nav, .actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    header { justify-content: space-between; padding-bottom: 20px; border-bottom: 1px solid var(--tx-card-border); }
    a { color: var(--tx-link-color); text-underline-offset: 4px; }
    button, input { font: inherit; }
    button { min-height: 44px; padding: 10px 16px; cursor: pointer; background: var(--tx-card-bg); color: var(--tx-text); border: var(--tx-card-border-width, 1px) solid var(--tx-card-border); border-radius: var(--tx-button-radius, 4px); }
    button[aria-pressed="true"] { border-color: var(--tx-link-color); text-decoration: underline; text-underline-offset: 4px; }
    .primary { background: var(--tx-primary); color: ${contrastText(theme.colors.primary)}; border: 2px solid var(--tx-text); box-shadow: var(--tx-card-shadow); }
    button:hover { box-shadow: var(--tx-card-shadow-hover); }
    :focus-visible { outline: 3px solid var(--tx-text); outline-offset: 4px; }
    .hero { padding: 30px 0; max-width: 680px; }
    .hero p { max-width: 58ch; }
    .hero .actions { margin-top: 18px; }
    .hero-with-art { display: grid; grid-template-columns: 3fr 2fr; gap: 24px; align-items: center; max-width: none; }
    .hero-copy { min-width: 0; }
    .hero-art { color: var(--tx-primary); max-width: 300px; width: 100%; justify-self: center; }
    .hero-art svg { display: block; width: 100%; }
    .media-comparison { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin: 0 0 24px; }
    .media-comparison svg { display: block; width: 100%; border: 1px solid var(--tx-card-border); }
    .media-comparison figcaption { grid-column: 1 / -1; font-size: 12px; }
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
    .card { padding: 20px; background: var(--tx-card-bg); border: var(--tx-card-border-width, 1px) solid var(--tx-card-border); border-radius: var(--tx-card-radius, 8px); box-shadow: var(--tx-card-shadow); backdrop-filter: blur(var(--tx-card-backdrop-blur, 0px)); transition: box-shadow 180ms, border-color 180ms; }
    .card:hover { border-color: var(--tx-card-border-hover); box-shadow: var(--tx-card-shadow-hover); }
    .stat { font-size: 26px; display: block; }
    .workspace { margin-top: 20px; display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px; }
    .project { display: flex; justify-content: space-between; gap: 12px; padding: 12px 0; border-top: 1px solid var(--tx-card-border); }
    form { display: grid; gap: 10px; }
    input { min-height: 44px; width: 100%; padding: 10px; color: var(--tx-text); background: var(--tx-input-bg); border: 1px solid var(--tx-input-border); border-radius: var(--tx-button-radius); }
    .status { min-height: 24px; }
    footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--tx-card-border); }
    .theme-bento-grid .grid { grid-template-columns: 2fr 1fr 1fr; }
    .theme-editorial-magazine .hero { max-width: none; border-bottom: 1px solid var(--tx-card-border); margin-bottom: 20px; }
    .theme-editorial-magazine h1 { max-width: 18ch; }
    .theme-editorial-magazine .card { border-width: 1px 0 0; padding-left: 0; }
    .theme-terminal-developer .eyebrow::before { content: "$ "; }
    .theme-terminal-developer h1 { font-size: clamp(24px, 4vw, 34px); }
    .theme-hand-drawn .hero { border-bottom: 3px dashed var(--tx-text); margin-bottom: 24px; }
    .theme-hand-drawn h1 { font-size: clamp(38px, 7vw, 60px); }
    .theme-hand-drawn .grid .card:nth-child(2) { transform: rotate(-1deg); }
    .theme-collage-scrapbook { background-size: 7px 7px; }
    .theme-collage-scrapbook .eyebrow { display: inline-block; background: var(--tx-accent); color: var(--tx-text); padding: 4px 10px; transform: rotate(-2deg); }
    .theme-collage-scrapbook .grid .card:nth-child(2) { transform: rotate(1deg); }
    .theme-pixel-8bit h1 { font-size: clamp(18px, 3vw, 28px); line-height: 1.7; }
    .theme-pixel-8bit h2 { font-size: 12px; line-height: 1.8; }
    .theme-pixel-8bit .stat { font-size: 20px; }
    .theme-retro-desktop header { padding: 8px; background: var(--tx-primary); color: ${contrastText(theme.colors.primary)}; border: 1px solid var(--tx-text); box-shadow: inset 1px 1px 0 #fff, inset -1px -1px 0 #404040; }
    .theme-retro-desktop button { box-shadow: inset 1px 1px 0 #fff, inset -1px -1px 0 #404040; }
    .theme-retro-desktop button:active, .theme-retro-desktop button[aria-pressed="true"] { box-shadow: inset 1px 1px 0 #404040, inset -1px -1px 0 #fff; }
    .theme-retro-desktop input { box-shadow: inset 1px 1px 0 #808080; }
    .theme-retro-desktop .grid .card > .muted:first-child { background: var(--tx-primary); color: ${contrastText(theme.colors.primary)}; margin: -17px -17px 16px; padding: 3px 8px; font-weight: 700; }
    .theme-blueprint-technical { background-size: 24px 24px; }
    .theme-blueprint-technical .hero { border-bottom: 1px dashed var(--tx-card-border); margin-bottom: 24px; }
    .theme-blueprint-technical h1 { font-size: clamp(26px, 4vw, 38px); }
    .theme-blueprint-technical .eyebrow { color: var(--tx-primary); }
    .theme-bauhaus-geometric h1 { font-size: clamp(32px, 5vw, 52px); letter-spacing: -0.025em; }
    .theme-bauhaus-geometric .grid .card { border-top: 8px solid var(--tx-primary); }
    .theme-bauhaus-geometric .grid .card:nth-child(2) { border-top-color: var(--tx-secondary); }
    .theme-bauhaus-geometric .grid .card:nth-child(3) { border-top-color: var(--tx-accent); }
    .theme-art-nouveau .hero { border-bottom: 1px solid var(--tx-card-border); margin-bottom: 24px; }
    .theme-art-nouveau h1 { font-size: clamp(38px, 6vw, 60px); }
    .theme-art-nouveau .hero-art { max-width: 240px; }
    .theme-art-nouveau .eyebrow { letter-spacing: 0.15em; }
    ${theme.mediaEffect?.kind === "risograph" ? "body { background-size: 8px 8px; }" : ""}
    .theme-kinetic-typography[data-motion="true"] h1 { animation: type-shift 3s ease-in-out infinite alternate; }
    .theme-aurora-ui[data-motion="true"] { background-size: 180% 180%; animation: aurora 8s ease-in-out infinite alternate; }
    @keyframes type-shift { from { transform: translateX(0); letter-spacing: -0.02em; } to { transform: translateX(8px); letter-spacing: 0.02em; } }
    @keyframes aurora { from { background-position: 0% 0%; } to { background-position: 100% 100%; } }
    @media (max-width: 520px) { body { padding: 18px; } .grid, .workspace, .hero-with-art, .media-comparison, .theme-bento-grid .grid { grid-template-columns: 1fr; } .hero-art { max-width: 200px; } .theme-art-nouveau .hero-art { max-width: 180px; } .theme-hand-drawn .card, .theme-collage-scrapbook .card { transform: none !important; } }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
    </style></head><body class="theme-${escapeHTML(theme.slug)} ${theme.layoutPattern ? `theme-${escapeHTML(theme.layoutPattern)}` : ""}" data-motion="${motion}">
    <header><strong>Workspace</strong><nav aria-label="Demo navigation"><button type="button" data-tab="Overview" aria-pressed="true">Overview</button><button type="button" data-tab="Projects" aria-pressed="false">Projects</button><button type="button" data-tab="Team" aria-pressed="false">Team</button></nav></header>
    <main><section class="hero${decoration ? " hero-with-art" : ""}"><div class="hero-copy"><p class="eyebrow">Your work, organized</p><h1>Make room for your next idea.</h1><p class="muted">Plan projects, share progress, and keep your team focused on the work that matters.</p><div class="actions"><button class="primary" type="button" id="add-project">Add a project</button><a href="#invite">Invite your team</a></div><p class="status" id="project-status" role="status"></p></div>${decoration ? `<div class="hero-art">${decoration}</div>` : ""}</section>
    ${mediaPreview}
    <section class="grid" aria-label="Project statistics"><div class="card"><p class="muted">Active projects</p><strong class="stat" id="project-count">12</strong><p>3 ready for review</p></div><div class="card"><p class="muted">Completed tasks</p><strong class="stat">48</strong><p>Updated this week</p></div><div class="card"><p class="muted">Team members</p><strong class="stat">8</strong><p>Working together</p></div></section>
    <section class="workspace"><div class="card"><h2 id="panel-heading">Overview</h2><p class="muted" id="panel-description">Your latest projects and their current status.</p><div class="project"><span>Website refresh</span><span>In progress</span></div><div class="project"><span>Design library</span><span>In review</span></div><div class="project"><span>Product launch</span><span>Planned</span></div></div>
    <div class="card" id="invite"><h2>Invite a teammate</h2><form id="invite-form"><label for="teammate-name">Name</label><input id="teammate-name" name="name" autocomplete="name" required><label for="teammate-email">Email address</label><input id="teammate-email" name="email" type="email" autocomplete="email" required><button class="primary" type="submit">Send demo invite</button><p class="status" id="invite-status" role="status"></p></form><p class="muted">Demo only. No invitation is sent.</p></div></section></main>
    <footer class="muted">Component demo: navigation, buttons, cards, and form states.</footer>
    <script>
    document.getElementById('add-project').addEventListener('click', function() {
      var count = document.getElementById('project-count'); count.textContent = String(Number(count.textContent) + 1);
      document.getElementById('project-status').textContent = 'Demo project added.';
    });
    document.querySelectorAll('[data-tab]').forEach(function(button) { button.addEventListener('click', function() {
      document.querySelectorAll('[data-tab]').forEach(function(tab) { tab.setAttribute('aria-pressed', String(tab === button)); });
      document.getElementById('panel-heading').textContent = button.dataset.tab;
      document.getElementById('panel-description').textContent = { Overview: 'Your latest projects and their current status.', Projects: 'Project deadlines and review status.', Team: 'Your team is working on the projects listed below.' }[button.dataset.tab];
    }); });
    document.getElementById('invite-form').addEventListener('submit', function(event) { event.preventDefault();
      document.getElementById('invite-status').textContent = 'Demo invite ready for ' + document.getElementById('teammate-name').value + '. No invitation was sent.';
    });
    <\/script></body></html>`;
}
