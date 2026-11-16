// Holiday looks for Randy (holiday guide: docs/RANDY-CHARACTER-SPEC.md §14).
// Owner direction (Nov 16, 2026): a holiday changes Randy's HAT. The face,
// polo and chest logo never change. A light background touch is allowed.
// Slots: background (behind Randy), hat (replaces the standard cap).
import { standardCap } from "./parts.mjs";

const grad = (id, top, bottom) =>
  `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs>`;

// ---------- Christmas: Santa hat ----------
const santaHat = `${grad("santaRed", "#DA2C43", "#9E1027")}
  <path d="M144 158 C140 112 166 78 206 70 C246 64 284 88 300 130 L288 138 C276 106 252 92 232 94 C246 112 254 134 256 158 Z" fill="url(#santaRed)"/>
  <path d="M206 72 C230 70 258 82 276 104" stroke="#F06A7E" stroke-width="2" fill="none" opacity=".5"/>
  <path d="M134 152 C168 140 232 140 266 152 C270 164 266 176 260 180 C228 170 172 170 140 180 C134 176 130 164 134 152 Z" fill="#F7F5F2"/>
  <g fill="#F7F5F2">${[140, 156, 172, 188, 204, 220, 236, 252, 264].map((x, i) => `<circle cx="${x}" cy="${148 - (i % 2) * 2}" r="7"/>`).join("")}</g>
  <path d="M140 176 C172 167 228 167 260 176" stroke="#D9D3CC" stroke-width="2.5" fill="none"/>
  <circle cx="296" cy="140" r="15" fill="#F7F5F2"/><circle cx="292" cy="135" r="6" fill="#fff"/>
  <path d="M283 148 C290 154 302 154 308 146" stroke="#D9D3CC" stroke-width="2" fill="none"/>`;

// ---------- New Year's: party hat ----------
const partyHat = `${grad("partyGold", "#F1D27A", "#B8892E")}
  <defs><clipPath id="cone"><path d="M160 154 L208 42 L242 152 C226 158 176 160 160 154 Z"/></clipPath></defs>
  <path d="M160 154 L208 42 L242 152 C226 158 176 160 160 154 Z" fill="url(#partyGold)"/>
  <g clip-path="url(#cone)" fill="#C2587A" opacity=".9">${[0, 1, 2, 3, 4].map((i) => `<rect x="120" y="${60 + i * 26}" width="160" height="9" transform="rotate(-18 200 ${64 + i * 26})"/>`).join("")}</g>
  <g fill="#fff">${[[196, 78], [214, 112], [188, 128], [222, 140]].map(([x, y]) => `<path d="M${x} ${y - 4} L${x + 1.2} ${y - 1.2} L${x + 4} ${y} L${x + 1.2} ${y + 1.2} L${x} ${y + 4} L${x - 1.2} ${y + 1.2} L${x - 4} ${y} L${x - 1.2} ${y - 1.2} Z"/>`).join("")}</g>
  <path d="M158 152 C176 160 226 158 244 150 L246 158 C226 166 176 168 156 160 Z" fill="#1E1C19"/>
  <g>${[[208, 40, "#FFCEE4"], [200, 34, "#fff"], [216, 34, "#C2587A"], [208, 28, "#FFB3D4"], [200, 44, "#C2587A"], [217, 45, "#fff"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}"/>`).join("")}</g>`;

// ---------- Valentine's: pink cap with a heart ----------
const heartPatch = `<path d="M200 135 C186 126 184 116 190 112 C194 109.5 198 111 200 114.5 C202 111 206 109.5 210 112 C216 116 214 126 200 135 Z" fill="#FFFFFF"/>`;
const valentineCap = standardCap({ crown: "#C2587A", bill: "#A9466A", seam: "#E38AAB", under: "#7E2F4C" }, heartPatch);

// ---------- St. Patrick's: green top hat with buckle ----------
const shamrock = (x, y) => `<g fill="#3E9E5A">${[[-3, -3], [3, -3], [-3, 3], [3, 3]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="3.6"/>`).join("")}</g>`;
const leprechaunHat = `${grad("lepGreen", "#3A9A5C", "#1E6B3A")}
  <path d="M158 156 L165 72 C182 66 218 66 235 72 L242 156 C226 162 174 162 158 156 Z" fill="url(#lepGreen)"/>
  <path d="M160 128 C180 132 220 132 240 128 L241.6 150 C224 155 176 155 158.4 150 Z" fill="#1A1A1A"/>
  <rect x="188" y="131" width="24" height="19" rx="2" fill="none" stroke="#D4A84B" stroke-width="4"/>
  ${shamrock(230, 124)}
  <path d="M124 158 C150 146 250 146 276 158 C278 168 252 175 200 175 C148 175 122 168 124 158 Z" fill="#1E6B3A"/>
  <path d="M136 166 C164 172 236 172 264 166" stroke="#14502A" stroke-width="2" fill="none"/>`;

// ---------- Memorial Day / Veterans Day: navy cap with a flag patch ----------
const flagPatch = (() => {
  const x = 185, y = 112, w = 30, h = 18;
  let stripes = "";
  for (let i = 0; i < 7; i++) stripes += `<rect x="${x}" y="${(y + (i * h) / 7).toFixed(2)}" width="${w}" height="${(h / 14).toFixed(2)}" fill="#B22234"/>`;
  return `<rect x="${x - 1.5}" y="${y - 1.5}" width="${w + 3}" height="${h + 3}" rx="2" fill="#D9D3CC"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff"/>${stripes}<rect x="${x}" y="${y}" width="${w * 0.42}" height="${h * 0.54}" fill="#3C3B6E"/>`;
})();
const navyFlagCap = standardCap({ crown: "#26324F", bill: "#1C2640", seam: "#3D4A6B", under: "#111827" }, flagPatch);

// ---------- July 4th: stars-and-stripes top hat ----------
const stripesHat = `
  <defs><clipPath id="crown4"><path d="M162 156 L167 62 C184 56 216 56 233 62 L238 156 Z"/></clipPath></defs>
  <path d="M162 156 L167 62 C184 56 216 56 233 62 L238 156 Z" fill="#F7F5F2"/>
  <g clip-path="url(#crown4)" fill="#B22234">${[166, 184, 202, 220].map((x) => `<rect x="${x}" y="50" width="9" height="110"/>`).join("")}</g>
  <path d="M163 126 C182 130 218 130 237 126 L238.4 150 C220 155 180 155 161.6 150 Z" fill="#3C3B6E"/>
  <g fill="#fff">${[176, 192, 208, 224].map((x) => `<path d="M${x} 133 L${x + 1.6} 137 L${x + 5.6} 137.3 L${x + 2.5} 140 L${x + 3.5} 144 L${x} 141.8 L${x - 3.5} 144 L${x - 2.5} 140 L${x - 5.6} 137.3 L${x - 1.6} 137 Z"/>`).join("")}</g>
  <path d="M124 158 C150 146 250 146 276 158 C278 168 252 175 200 175 C148 175 122 168 124 158 Z" fill="#1F2A44"/>
  <path d="M136 166 C164 172 236 172 264 166" stroke="#121A2E" stroke-width="2" fill="none"/>`;

// ---------- Halloween: friendly witch hat ----------
const witchHat = `${grad("witch", "#3A3346", "#1E1A26")}
  <path d="M150 156 C160 122 178 74 212 42 C222 36 236 40 240 50 C226 52 220 68 222 86 C230 112 244 138 250 156 Z" fill="url(#witch)"/>
  <path d="M152 144 C180 138 222 138 248 144 L251 158 C222 152 178 152 149 158 Z" fill="#E07A2B"/>
  <rect x="192" y="140" width="16" height="15" rx="2" fill="none" stroke="#F2C14E" stroke-width="3"/>
  <path d="M110 162 C150 144 250 144 290 162 C292 174 252 180 200 180 C148 180 108 174 110 162 Z" fill="#1E1A26"/>
  <path d="M124 168 C160 176 240 176 276 168" stroke="#0E0C12" stroke-width="2" fill="none"/>`;

// ---------- Thanksgiving: autumn knit beanie ----------
const leaf = (x, y, s = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -9 L2.5 -4 L7.5 -6 L5 -1 L9 1.5 L3.5 3.5 L1.5 7.5 L0 5 L-1.5 7.5 L-3.5 3.5 L-9 1.5 L-5 -1 L-7.5 -6 L-2.5 -4 Z" fill="#E9A23B"/>`;
const beanie = `${grad("beanie", "#C4612F", "#9A4521")}
  <path d="M142 166 C138 112 166 84 200 84 C234 84 262 112 258 166 Z" fill="url(#beanie)"/>
  <g stroke="#8A3D1C" stroke-width="1.6" opacity=".55">${[160, 176, 192, 208, 224, 240].map((x) => `<path d="M${x} 96 C${x - 2} 120 ${x - 2} 140 ${x} 150"/>`).join("")}</g>
  <path d="M138 148 C170 138 230 138 262 148 L264 172 C230 164 170 164 136 172 Z" fill="#7E3519"/>
  <path d="M137 160 C170 151 230 151 263 160" stroke="#F2E3C6" stroke-width="3.5" fill="none"/>
  ${leaf(200, 158, 1.1)}
  <g fill="#F2E3C6">${[[200, 80], [192, 74], [208, 74], [200, 68], [189, 84], [211, 84]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7"/>`).join("")}</g>`;

// ---------- Backgrounds ----------
const snowflake = (x, y, r) =>
  `<g stroke="#D98AAE" stroke-width="2.2" stroke-linecap="round"><path d="M${x - r} ${y} L${x + r} ${y} M${x - r / 2} ${y - r * 0.87} L${x + r / 2} ${y + r * 0.87} M${x - r / 2} ${y + r * 0.87} L${x + r / 2} ${y - r * 0.87}"/></g>`;
const snow = [snowflake(62, 98, 9), snowflake(336, 200, 7), snowflake(96, 214, 6), snowflake(350, 90, 6), snowflake(118, 52, 5), snowflake(44, 168, 5)].join("");

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
const fireworks = burst(70, 110, 28, "#C2587A") + burst(330, 120, 24, "#3C3B6E") + burst(334, 46, 14, "#B22234") + burst(80, 40, 14, "#D4A84B");

export const overlays = {
  "new-year": { background: confetti, hat: partyHat },
  valentines: { hat: valentineCap },
  "st-patricks": { hat: leprechaunHat },
  "memorial-day": { hat: navyFlagCap },
  "independence-day": { background: fireworks, hat: stripesHat },
  halloween: { hat: witchHat },
  "veterans-day": { hat: navyFlagCap },
  thanksgiving: { hat: beanie },
  christmas: { background: snow, hat: santaHat },
};
