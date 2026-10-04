/** @jsxImportSource react */
import * as React from "react";
import type { UiLibrary } from "../lib/promptOptions";
import { getControls } from "../preview/controls";

export const sampleStock = [
  { sku: "ST-101", name: "Canvas tote", category: "Bags", stock: 24, minimum: 10 },
  { sku: "ST-102", name: "Notebook", category: "Stationery", stock: 8, minimum: 12 },
  { sku: "ST-103", name: "Desk tray", category: "Workspace", stock: 17, minimum: 8 },
  { sku: "ST-104", name: "Travel pouch", category: "Bags", stock: 5, minimum: 10 },
  { sku: "ST-105", name: "Pen set", category: "Stationery", stock: 32, minimum: 15 },
  { sku: "ST-106", name: "Cable organizer", category: "Workspace", stock: 19, minimum: 8 },
];

export function InventoryExample({ library }: { library: UiLibrary }) {
  const { Button, Input, Card, Badge, Table, Thead, Tbody, Tr, Th, Td } = getControls(library);
  return <div className="inventory-shell">
    <aside className="inventory-sidebar" aria-label="Inventory sections"><a className="demo-brand" href="#summary">Relay <span>inventory</span></a><p className="muted small">Sample workspace</p><nav aria-label="Inventory navigation"><a href="#summary">Overview</a><a href="#stock">Stock levels</a><a href="#adjustment">Adjust stock</a></nav><p className="sidebar-note muted">Demo data only.<br />Changes stay on this page.</p></aside>
    <main className="inventory-main">
      <header className="demo-heading" id="summary"><div><p className="eyebrow">Inventory / overview</p><h1>Keep stock<br />in view.</h1><p className="muted">Find an item, check its threshold, and update its demo stock.</p></div><div className="theme-art" dangerouslySetInnerHTML={{ __html: "__THEME_ART__" }} /></header>
      <section className="metric-grid" aria-label="Sample inventory summary"><Card><span className="muted">Sample items</span><strong className="metric" id="item-total">{sampleStock.length}</strong></Card><Card><span className="muted">Units in demo stock</span><strong className="metric" id="stock-total">{sampleStock.reduce((total, item) => total + item.stock, 0)}</strong></Card><Card><span className="muted">Below threshold</span><strong className="metric" id="low-total">{sampleStock.filter((item) => item.stock < item.minimum).length}</strong></Card></section>
      <div className="inventory-work">
        <Card id="stock"><div className="section-heading"><h2>Stock levels</h2><Button id="reset-stock" variant="outline" type="button">Reset demo</Button></div><label className="field" htmlFor="stock-search">Search sample stock<Input id="stock-search" type="search" placeholder="Name, SKU, or category" /></label><div className="filter-row" role="group" aria-label="Stock filter"><Button id="all-stock" variant="outline" aria-pressed="true" type="button">All stock</Button><Button id="low-stock" variant="outline" aria-pressed="false" type="button">Low stock only</Button></div>
          <p id="stock-scroll-help" className="table-scroll-help muted small">Scroll horizontally to see all columns.</p><div className="table-scroll" role="region" aria-label="Sample stock table" aria-describedby="stock-scroll-help" tabIndex={0}><Table><caption className="muted">Sample stock. Thresholds are demo values.</caption><Thead><Tr><Th scope="col">Item</Th><Th scope="col">Stock</Th><Th scope="col">Status</Th></Tr></Thead><Tbody>{sampleStock.map((item) => <Tr key={item.sku} data-sku={item.sku} data-stock={item.stock} data-initial-stock={item.stock} data-minimum={item.minimum}><Td><strong>{item.name}</strong><span className="small muted block">{item.sku} · {item.category}</span></Td><Td data-stock-value>{item.stock}</Td><Td><Badge variant="outline" className="stock-status" data-low={item.stock < item.minimum}>{item.stock < item.minimum ? "Low stock" : "In stock"}</Badge></Td></Tr>)}</Tbody></Table></div>
          <p id="stock-empty" className="empty-state" hidden>No sample items match your filters.</p><p className="muted small" id="stock-filter-status" role="status">Showing all {sampleStock.length} sample items.</p>
        </Card>
        <Card id="adjustment"><p className="eyebrow">Local demo action</p><h2>Adjust stock</h2><p className="muted">Set a new quantity for one sample item.</p><form id="stock-form" noValidate><label className="field" htmlFor="stock-item">Item<select id="stock-item" className="control demo-select">{sampleStock.map((item) => <option value={item.sku} key={item.sku}>{item.name}</option>)}</select></label><label className="field" htmlFor="stock-quantity">New quantity<Input id="stock-quantity" type="number" min="0" step="1" aria-describedby="stock-message" placeholder="Enter a whole number" /></label><Button type="submit" id="save-stock">Update demo stock</Button><p id="stock-message" className="feedback" role="status" /></form><p className="small muted">No server data is changed.</p></Card>
      </div>
      <footer className="demo-footer muted">Astra inventory example · All items and quantities are sample data.</footer>
    </main>
  </div>;
}
