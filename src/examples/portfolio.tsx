/** @jsxImportSource react */
import * as React from "react";
import type { UiLibrary } from "../lib/promptOptions";
import { getControls } from "../preview/controls";

export const sampleProjects = [
  { title: "An interface for ideas", category: "Interface", description: "A sample design library with clear categories and reusable components.", shape: "interface" },
  { title: "A small visual identity", category: "Identity", description: "A fictional identity study using a simple mark and a limited palette.", shape: "identity" },
  { title: "A story in type", category: "Editorial", description: "A sample editorial layout with a clear reading order and large display type.", shape: "editorial" },
];

function ProjectArt({ shape }: { shape: string }) {
  return <svg className="project-art" viewBox="0 0 500 300" aria-hidden="true"><rect width="500" height="300" fill="var(--tx-surface-bg)" />{shape === "interface" ? <g><rect x="42" y="35" width="416" height="230" rx="8" fill="var(--tx-card-bg)" stroke="var(--tx-secondary)" /><path d="M42 80H458M144 80V265" stroke="var(--tx-secondary)" /><rect x="166" y="104" width="264" height="57" rx="6" fill="var(--tx-primary)" /><rect x="166" y="182" width="122" height="53" rx="6" fill="var(--tx-secondary)" /><rect x="308" y="182" width="122" height="53" rx="6" fill="var(--tx-accent)" /></g> : shape === "identity" ? <g fill="none" stroke="var(--tx-primary)" strokeWidth="3"><circle cx="250" cy="150" r="93" /><ellipse cx="250" cy="150" rx="144" ry="44" transform="rotate(-35 250 150)" /><circle cx="250" cy="150" r="38" fill="var(--tx-secondary)" stroke="none" /></g> : <g fill="var(--tx-secondary)"><rect x="75" y="50" width="350" height="48" /><rect x="75" y="114" width="202" height="48" fill="var(--tx-primary)" /><path d="M75 194H425M75 211H425M75 228H320" stroke="var(--tx-secondary)" strokeWidth="4" /></g>}</svg>;
}

export function PortfolioExample({ library }: { library: UiLibrary }) {
  const { Button, Card } = getControls(library);
  return <div className="portfolio-shell">
    <header className="portfolio-nav"><a className="demo-brand" href="#top">Galaxy <span>studies</span></a><nav aria-label="Portfolio navigation"><a href="#work">Selected work</a><a href="#about">About this demo</a></nav></header>
    <main id="top"><section className="portfolio-hero"><div><p className="eyebrow">A sample creative portfolio</p><h1>Make room<br />for discovery.</h1><p className="muted">Three design studies. One place to explore their details.</p><a className="hero-link" href="#work">Explore sample work <span aria-hidden="true">↗</span></a></div><div className="theme-art" dangerouslySetInnerHTML={{ __html: "__THEME_ART__" }} /></section>
      <section id="work" aria-labelledby="work-heading"><div className="section-heading"><h2 id="work-heading">Selected work</h2><span className="muted small">Fictional projects, shown as demos</span></div><div className="filter-row" role="group" aria-label="Project categories">{["All", "Interface", "Identity", "Editorial"].map((category) => <Button key={category} type="button" variant="outline" data-project-filter={category} aria-pressed={category === "All"}>{category}</Button>)}</div>
        <div className="portfolio-work">{sampleProjects.map((project, index) => <Card key={project.title} className={`project-card ${index === 0 ? "featured" : ""}`} data-project-category={project.category}><ProjectArt shape={project.shape} /><div className="project-copy"><p className="eyebrow">{project.category} study</p><h3>{project.title}</h3><p className="muted">{project.description}</p><Button type="button" variant="outline" data-project-title={project.title} data-project-description={project.description}>View study</Button></div></Card>)}</div><p id="project-filter-status" className="muted small" role="status">Showing all 3 sample projects.</p>
      </section>
      <section className="portfolio-about" id="about"><p className="eyebrow">About this demo</p><h2>Built to show a design direction.</h2><p className="muted">This portfolio uses sample work. It does not represent a person, studio, or client. The filters and project details are interactive examples.</p></section>
      <dialog id="project-dialog" aria-labelledby="project-dialog-title"><div className="dialog-content"><p className="eyebrow">Sample project</p><h2 id="project-dialog-title" /><p id="project-dialog-description" className="muted" /><p className="small muted">This is fictional portfolio content.</p><form method="dialog"><Button type="submit" variant="outline">Close study</Button></form></div></dialog>
    </main><footer className="demo-footer muted">Galaxy portfolio example · Sample work only.</footer>
  </div>;
}
