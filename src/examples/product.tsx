/** @jsxImportSource react */
import * as React from "react";
import { useEffect, useState } from "react";
import type { UiLibrary } from "../lib/promptOptions";
import { getControls } from "../preview/controls";

function ProductArt({ view }: { view: string }) {
  return <svg viewBox="0 0 600 620" className="product-art" role="img" aria-label={`Sample overshirt, ${view} view`}><rect width="600" height="620" fill="var(--tx-card-bg)" /><path d="M95 530H505" stroke="var(--tx-card-border)" />{view === "detail" ? <g><rect x="122" y="115" width="356" height="388" rx="12" fill="#344253" /><path d="M205 115V503M395 115V503M122 245H478M122 405H478" stroke="#718092" strokeWidth="2" />{[190, 285, 380, 475].map((y) => <circle key={y} cx="300" cy={y} r="6" fill="#DEE5EC" />)}</g> : <g><path d="M222 95L166 136L79 273L158 319L188 270L181 510H419L412 270L442 319L521 273L434 136L378 95L300 127Z" fill="#344253" stroke="#202D3B" strokeWidth="4" /><path d="M222 95L259 157L300 127L341 157L378 95M300 161V510" fill="none" stroke="#718092" strokeWidth="3" />{view === "front" ? <g><path d="M215 214H272V273H215ZM328 214H385V273H328Z" fill="#405064" stroke="#718092" strokeWidth="2" />{[201, 283, 365, 447].map((y) => <circle key={y} cx="300" cy={y} r="4" fill="#DEE5EC" />)}</g> : <path d="M189 214H411M218 142H382" stroke="#718092" strokeWidth="3" />}</g>}</svg>;
}

export function ProductExample({ library }: { library: UiLibrary }) {
  const { Button, Input, Card, Badge } = getControls(library);
  const [view, setView] = useState("front");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [bag, setBag] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState("");
  const [busy, setBusy] = useState(false);
  const count = Object.values(bag).reduce((total, value) => total + value, 0);
  useEffect(() => { document.documentElement.dataset.demoReady = "true"; }, []);

  const add = (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (!size) { setInvalid("size"); setMessage("Choose an available size."); return; }
    const amount = Number(quantity);
    if (!Number.isInteger(amount) || amount < 1 || amount > 10) { setInvalid("quantity"); setMessage("Choose a quantity from 1 to 10."); return; }
    setInvalid(""); setBusy(true); setMessage("Adding to the demo bag…");
    setTimeout(() => {
      setBag((previous) => ({ ...previous, [size]: (previous[size] ?? 0) + amount }));
      setBusy(false); setMessage(`Added ${amount} sample item${amount === 1 ? "" : "s"} in size ${size}. No purchase was made.`);
    }, 200);
  };

  return <div className="product-shell">
    <header className="product-nav"><a className="demo-brand" href="#product">Field <span>goods / demo</span></a><a href="#demo-bag" className="bag-link">Demo bag <span id="bag-count">{count}</span></a></header>
    <main id="product"><p className="eyebrow">Sample collection / everyday layers</p><div className="product-layout"><section aria-label="Sample product gallery"><div className="product-stage"><ProductArt view={view} /></div><div className="product-thumbnails" role="group" aria-label="Product views">{["front", "back", "detail"].map((item) => <Button key={item} type="button" variant="outline" aria-pressed={view === item} aria-label={`Show ${item} view`} onClick={() => setView(item)}>{item}</Button>)}</div></section>
      <div className="product-details"><Badge variant="outline">Sample product</Badge><h1>The everyday<br />overshirt.</h1><p className="product-price">$48 <span className="muted small">demo price</span></p><p className="muted">A fictional canvas overshirt in graphite. Use the gallery, choose a size, and try the local demo bag.</p><dl className="product-specs"><div><dt>Sample material</dt><dd>Cotton canvas</dd></div><div><dt>Sample color</dt><dd>Graphite</dd></div></dl>
        <form onSubmit={add} noValidate aria-busy={busy}><fieldset aria-describedby="size-note product-message"><legend>Size</legend><div className="size-row">{["S", "M", "L", "XL"].map((item) => <Button key={item} type="button" variant="outline" disabled={item === "M"} aria-pressed={size === item} onClick={() => { setSize(item); setInvalid(""); }}>{item}</Button>)}</div><p id="size-note" className="muted small">M is unavailable in this demo.</p></fieldset><label className="field quantity-field" htmlFor="product-quantity">Quantity<Input id="product-quantity" type="number" min="1" max="10" value={quantity} onChange={(event) => setQuantity(event.currentTarget.value)} aria-invalid={invalid === "quantity"} aria-describedby="product-message" /></label><Button type="submit" className="add-to-bag" disabled={busy}>{busy ? "Adding…" : "Add to demo bag"}</Button><p id="product-message" className="feedback" role="status">{message}</p></form>
        <Card id="demo-bag" className="demo-bag"><div className="section-heading"><h2>Your demo bag</h2><span>{count} {count === 1 ? "item" : "items"}</span></div>{count ? <><ul>{Object.entries(bag).map(([itemSize, amount]) => <li key={itemSize}>{amount} × overshirt / size {itemSize}</li>)}</ul><p className="bag-total">Demo total <strong>${count * 48}</strong></p></> : <p className="muted">Your demo bag is empty.</p>}<Button type="button" variant="outline" disabled={!count} onClick={() => { setBag({}); setMessage("Demo bag cleared."); }}>Clear demo bag</Button></Card><p className="small muted">Sample content only. No checkout, payment, or real stock request.</p>
      </div></div></main><footer className="demo-footer muted">Sample product content · Local demo interactions.</footer>
  </div>;
}
