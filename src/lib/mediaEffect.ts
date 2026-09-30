import type { MediaEffect } from "./themeCatalog";

const channels = (hex: string) => hex.slice(1).match(/.{2}/g)!.map((value) => parseInt(value, 16) / 255);

export function mediaFilterDefinition(effect: MediaEffect): string {
  const first = channels(effect.ink1);
  const second = channels(effect.ink2);
  const transfer = (from: number[], to: number[]) => ["R", "G", "B"].map((channel, index) =>
    `<feFunc${channel} type="table" tableValues="${from[index]} ${to[index]}"/>`).join("");
  const grayscale = '<feColorMatrix in="SourceGraphic" type="saturate" values="0" result="gray"/>';
  const treatment = effect.kind === "duotone"
    ? `${grayscale}<feComponentTransfer in="gray">${transfer(first, second)}</feComponentTransfer>`
    : `${grayscale}
      <feComponentTransfer in="gray" result="ink1">${transfer(first, [1, 1, 1])}</feComponentTransfer>
      <feComponentTransfer in="gray" result="ink2">${transfer(second, [1, 1, 1])}</feComponentTransfer>
      <feOffset in="ink2" dx="${effect.offset}" dy="-${effect.offset}" result="shifted"/>
      <feBlend in="ink1" in2="shifted" mode="multiply" result="print"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="7" result="noise"/>
      <feColorMatrix in="noise" type="saturate" values="0" result="grain"/>
      <feComponentTransfer in="grain" result="faint-grain"><feFuncA type="linear" slope="${effect.grainOpacity}"/></feComponentTransfer>
      <feBlend in="print" in2="faint-grain" mode="multiply"/>`;
  return `<filter id="tx-media-effect" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">${treatment}</filter>`;
}

export function exportMediaEffectSVG(effect: MediaEffect): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" aria-hidden="true"><defs>${mediaFilterDefinition(effect)}</defs></svg>`;
}

export function landscapeIllustration(id: string, effect?: MediaEffect): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 440" role="img" aria-labelledby="${id}-title">
    <title id="${id}-title">${effect ? effect.kind === "duotone" ? "Duotone" : "Risograph" : "Grayscale"} landscape illustration</title>
    <defs><linearGradient id="${id}-sky" x1="0%" y1="0%" x2="0%" y2="100%"><stop stop-color="#FFFFFF"/><stop offset="1" stop-color="#999999"/></linearGradient>${effect ? mediaFilterDefinition(effect) : ""}</defs>
    <g${effect ? ' filter="url(#tx-media-effect)"' : ""}>
      <rect width="800" height="440" fill="url(#${id}-sky)"/>
      <circle cx="590" cy="116" r="65" fill="#FFFFFF"/>
      <path d="M0 278L170 112L340 300L500 174L800 330V440H0Z" fill="#999999"/>
      <path d="M0 345L252 199L450 371L660 254L800 310V440H0Z" fill="#555555"/>
      <path d="M0 398Q210 330 430 395T800 362V440H0Z" fill="#222222"/>
      <path d="M340 440L431 394L405 369L444 345L465 371L448 396L540 440Z" fill="#CCCCCC"/>
      <path d="M70 390V251M30 321L70 265L110 321M27 352L70 294L115 352M655 399V276M616 340L655 286L697 340" fill="none" stroke="#111111" stroke-width="12"/>
    </g>
  </svg>`;
}
