// Seasonal layers for Randy (holiday guide: docs/RANDY-CHARACTER-SPEC.md §14).
// Each variant adds ONE accessory and, at most, a light background touch.
// Slots: background (behind Randy), chest (on the polo), face, top (in front of all).
// Never cover the face, the cap or either raccoon mark.

const PIN = { x: 142, y: 352 }; // wearer's right chest; the logo is on the wearer's left
// Pins are drawn at 1.7x so they still read in the 44px chat button.
const big = (svg) => `<g transform="translate(${PIN.x} ${PIN.y}) scale(1.7) translate(${-PIN.x} ${-PIN.y})">${svg}</g>`;

const pinShadow = `<ellipse cx="${PIN.x + 1}" cy="${PIN.y + 2}" rx="12" ry="10" fill="#000" opacity=".25"/>`;

const heartPin = `${pinShadow}
  <path d="M${PIN.x} ${PIN.y + 9} C${PIN.x - 12} ${PIN.y} ${PIN.x - 11} ${PIN.y - 9} ${PIN.x - 5} ${PIN.y - 10} C${PIN.x - 2} ${PIN.y - 10.5} ${PIN.x} ${PIN.y - 8} ${PIN.x} ${PIN.y - 6} C${PIN.x} ${PIN.y - 8} ${PIN.x + 2} ${PIN.y - 10.5} ${PIN.x + 5} ${PIN.y - 10} C${PIN.x + 11} ${PIN.y - 9} ${PIN.x + 12} ${PIN.y} ${PIN.x} ${PIN.y + 9} Z" fill="#E86A9A" stroke="#B8436F" stroke-width="1"/>
  <ellipse cx="${PIN.x - 5}" cy="${PIN.y - 5}" rx="2.5" ry="1.6" fill="#fff" opacity=".55"/>`;

const leaf = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#3E8E4E"/>`;
const shamrockPin = `${pinShadow}
  <path d="M${PIN.x} ${PIN.y} Q${PIN.x + 3} ${PIN.y + 7} ${PIN.x + 7} ${PIN.y + 11}" stroke="#2E6E3B" stroke-width="2" fill="none" stroke-linecap="round"/>
  ${leaf(PIN.x - 4, PIN.y - 4, 4.6)}${leaf(PIN.x + 4, PIN.y - 4, 4.6)}${leaf(PIN.x - 4.5, PIN.y + 3, 4.6)}${leaf(PIN.x + 4.5, PIN.y + 3, 4.6)}
  <circle cx="${PIN.x}" cy="${PIN.y}" r="2" fill="#2E6E3B"/>`;

const flagPin = (() => {
  const x = PIN.x - 11, y = PIN.y - 7, w = 22, h = 14;
  let stripes = "";
  for (let i = 0; i < 7; i++) stripes += `<rect x="${x}" y="${y + (i * h) / 7}" width="${w}" height="${h / 7 / 2}" fill="#B22234"/>`;
  return `<rect x="${x - 1}" y="${y - 1}" width="${w + 2}" height="${h + 2}" rx="1.5" fill="#C9A44A"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff"/>${stripes}
  <rect x="${x}" y="${y}" width="${w * 0.42}" height="${h * 0.54}" fill="#3C3B6E"/>`;
})();

const pumpkinPin = `${pinShadow}
  <ellipse cx="${PIN.x}" cy="${PIN.y + 1}" rx="11" ry="8.5" fill="#E07A2B"/>
  <path d="M${PIN.x - 4} ${PIN.y - 6} C${PIN.x - 7} ${PIN.y} ${PIN.x - 7} ${PIN.y + 4} ${PIN.x - 4} ${PIN.y + 9} M${PIN.x + 4} ${PIN.y - 6} C${PIN.x + 7} ${PIN.y} ${PIN.x + 7} ${PIN.y + 4} ${PIN.x + 4} ${PIN.y + 9}" stroke="#B85A1B" stroke-width="1.2" fill="none"/>
  <path d="M${PIN.x} ${PIN.y - 7} C${PIN.x} ${PIN.y - 10} ${PIN.x + 2} ${PIN.y - 12} ${PIN.x + 4} ${PIN.y - 12}" stroke="#3E6B2E" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;

const autumnLeafPin = `${pinShadow}
  <path d="M${PIN.x} ${PIN.y - 11} L${PIN.x + 3} ${PIN.y - 5} L${PIN.x + 9} ${PIN.y - 7} L${PIN.x + 6} ${PIN.y - 1} L${PIN.x + 11} ${PIN.y + 2} L${PIN.x + 4} ${PIN.y + 4} L${PIN.x + 2} ${PIN.y + 9} L${PIN.x} ${PIN.y + 6} L${PIN.x - 2} ${PIN.y + 9} L${PIN.x - 4} ${PIN.y + 4} L${PIN.x - 11} ${PIN.y + 2} L${PIN.x - 6} ${PIN.y - 1} L${PIN.x - 9} ${PIN.y - 7} L${PIN.x - 3} ${PIN.y - 5} Z" fill="#C8651B" stroke="#8E4512" stroke-width=".8" stroke-linejoin="round"/>
  <path d="M${PIN.x} ${PIN.y - 8} L${PIN.x} ${PIN.y + 12}" stroke="#8E4512" stroke-width="1.2"/>`;

// Pink-and-white knit scarf for the winter holidays (keeps the cap and logos visible).
const scarf = `
  <path d="M158 282 C178 300 222 300 242 282 L248 300 C226 320 174 320 152 300 Z" fill="#FFCEE4"/>
  <path d="M155 291 C176 309 224 309 245 291" stroke="#fff" stroke-width="4" fill="none" opacity=".9"/>
  <path d="M164 300 L190 306 L184 372 L160 368 Z" fill="#FFCEE4"/>
  <path d="M163 318 L188 322 M162 338 L187 342 M161 356 L185 360" stroke="#fff" stroke-width="4"/>
  <path d="M160 368 L160 376 M165 369 L165 377 M170 370 L170 378 M175 370 L175 378 M180 371 L180 379" stroke="#FFCEE4" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M152 300 C174 320 226 320 248 300" stroke="#E7A9C4" stroke-width="1.5" fill="none"/>`;

const snowflake = (x, y, r) =>
  `<g stroke="#D98AAE" stroke-width="2.2" stroke-linecap="round"><path d="M${x - r} ${y} L${x + r} ${y} M${x - r / 2} ${y - r * 0.87} L${x + r / 2} ${y + r * 0.87} M${x - r / 2} ${y + r * 0.87} L${x + r / 2} ${y - r * 0.87}"/></g>`;
const snow = [snowflake(62, 98, 9), snowflake(336, 82, 7), snowflake(96, 214, 6), snowflake(318, 196, 9), snowflake(118, 52, 5), snowflake(286, 40, 6), snowflake(44, 168, 5), snowflake(356, 150, 5)].join("");

const confettiColors = ["#C2587A", "#D4A84B", "#FFFFFF", "#FFB3D4", "#1E1C19"];
const confetti = [
  [58, 96, 20], [92, 60, 70], [120, 128, -30], [70, 180, 45], [44, 236, 10], [102, 252, -60],
  [300, 54, 30], [336, 106, -20], [310, 168, 60], [352, 210, 15], [284, 236, -45], [262, 40, 80],
].map(([x, y, a], i) => `<rect x="${x}" y="${y}" width="8" height="4" rx="1" fill="${confettiColors[i % confettiColors.length]}" transform="rotate(${a} ${x + 4} ${y + 2})" opacity=".9"/>`).join("");

const burst = (x, y, r, color) => {
  let rays = "";
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    rays += `M${(x + Math.cos(a) * r * 0.35).toFixed(1)} ${(y + Math.sin(a) * r * 0.35).toFixed(1)} L${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)} `;
  }
  return `<path d="${rays}" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity=".85"/>`;
};
const fireworks = burst(72, 92, 30, "#C2587A") + burst(328, 104, 26, "#3C3B6E") + burst(318, 34, 16, "#B22234") + burst(96, 30, 14, "#D4A84B");

export const overlays = {
  "new-year": { background: confetti },
  valentines: { chest: big(heartPin) },
  "st-patricks": { chest: big(shamrockPin) },
  "memorial-day": { chest: big(flagPin) },
  "independence-day": { background: fireworks, chest: big(flagPin) },
  halloween: { chest: big(pumpkinPin) },
  "veterans-day": { chest: big(flagPin) },
  thanksgiving: { chest: big(autumnLeafPin) },
  "winter-holidays": { background: snow, chest: scarf },
};
