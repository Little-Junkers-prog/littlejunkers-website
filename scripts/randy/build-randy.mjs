// Builds every Randy avatar from ONE master drawing (RANDY-CHARACTER-SPEC §13).
// Seasonal variants only add a layer; the face, cap, logo and proportions never
// change. Output: public/images/brand/randy/<variant>.svg
// Run with `npm run build:randy` after editing this file, then commit the SVGs.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { overlays } from "./seasons.mjs";
import { C, standardCap } from "./parts.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
// Traced from public/images/brand/little-junkers-logo.png (approved raccoon mark).
const RACCOON = fs.readFileSync(path.join(here, "raccoon-path.txt"), "utf8").trim();
const out = path.join(here, "..", "..", "public", "images", "brand", "randy");



const defs = `
<defs>
  <clipPath id="frame"><circle cx="200" cy="200" r="200"/></clipPath>
  <radialGradient id="bg" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="${C.pinkSoft}"/><stop offset="1" stop-color="${C.pink}"/></radialGradient>
  <radialGradient id="skin" cx="46%" cy="40%" r="62%"><stop offset="0" stop-color="#8E5A37"/><stop offset=".7" stop-color="#7A4A2C"/><stop offset="1" stop-color="#5F3820"/></radialGradient>
  <linearGradient id="neck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4E2D19"/><stop offset=".45" stop-color="#6E4227"/><stop offset="1" stop-color="#76472A"/></linearGradient>
  <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2C2926"/><stop offset="1" stop-color="#161412"/></linearGradient>
  <linearGradient id="cap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E2B28"/><stop offset="1" stop-color="#161412"/></linearGradient>
  <linearGradient id="bill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34302C"/><stop offset=".55" stop-color="#1C1A18"/><stop offset="1" stop-color="#0E0D0C"/></linearGradient>
  <linearGradient id="beard" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E1712" stop-opacity=".88"/><stop offset=".35" stop-color="${C.hair}"/></linearGradient>
  <clipPath id="eyeL"><path d="M165 197 Q178 188.5 191 197 Q178 200.5 165 197 Z"/></clipPath>
  <clipPath id="eyeR"><path d="M209 197 Q222 188.5 235 197 Q222 200.5 209 197 Z"/></clipPath>
  <clipPath id="patch"><ellipse cx="200" cy="121" rx="19.5" ry="16.5"/></clipPath>
  <clipPath id="chest"><ellipse cx="254" cy="354" rx="13" ry="11"/></clipPath>
  <path id="raccoon" d="${RACCOON}"/>
</defs>`;


const eye = (cx, clip) => `
  <path d="M${cx - 13} 197 Q${cx} 188.5 ${cx + 13} 197 Q${cx} 200.5 ${cx - 13} 197 Z" fill="#F3ECE6"/>
  <g clip-path="url(#${clip})">
    <circle cx="${cx + 0.5}" cy="196" r="5" fill="#5A3519"/>
    <circle cx="${cx + 0.5}" cy="196" r="2.4" fill="#120C08"/>
    <circle cx="${cx + 2}" cy="194.4" r="1.2" fill="#fff" opacity=".9"/>
    <path d="M${cx - 13} 193 Q${cx} 186 ${cx + 13} 193 L${cx + 13} 196 Q${cx} 189.5 ${cx - 13} 196 Z" fill="#000" opacity=".18"/>
  </g>
  <path d="M${cx - 13.5} 196.6 Q${cx} 187.6 ${cx + 13.5} 196.6" fill="none" stroke="${C.line}" stroke-width="2" stroke-linecap="round"/>
  <path d="M${cx - 10} 201.8 Q${cx} 199.4 ${cx + 10} 201.8" fill="none" stroke="#4A2A17" stroke-width="1.2" opacity=".6"/>`;

// The master portrait, back to front. Overlays are inserted at named slots.
function portrait(o = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="Randy, Little Junkers' digital rental assistant">${defs}
<g clip-path="url(#frame)">
  <rect width="400" height="400" fill="url(#bg)"/>
  ${o.background ?? ""}
  <!-- polo -->
  <path d="M18 420 C24 358 62 330 128 313 C150 307 164 300 170 290 L230 290 C236 300 250 307 272 313 C338 330 376 358 382 420 Z" fill="url(#shirt)"/>
  <path d="M128 313 C110 330 100 360 98 400" stroke="#0F0E0D" stroke-width="1.5" fill="none" opacity=".6"/>
  <path d="M272 313 C290 330 300 360 302 400" stroke="#0F0E0D" stroke-width="1.5" fill="none" opacity=".6"/>
  <!-- neck -->
  <path d="M166 240 L234 240 L237 300 C218 314 182 314 163 300 Z" fill="url(#neck)"/>
  <!-- collar band and flaps -->
  <path d="M164 290 C178 304 222 304 236 290 L240 298 C224 314 176 314 160 298 Z" fill="#232120"/>
  <path d="M166 296 C174 312 186 326 200 336 L186 346 C170 334 156 318 148 306 Z" fill="#2B2826" stroke="#121110" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M234 296 C226 312 214 326 200 336 L214 346 C230 334 244 318 252 306 Z" fill="#2B2826" stroke="#121110" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M200 336 L200 400" stroke="#0F0E0D" stroke-width="1.6"/>
  <circle cx="205" cy="356" r="2.2" fill="#4A4642"/><circle cx="205" cy="378" r="2.2" fill="#4A4642"/>
  <!-- chest mark: approved raccoon logo -->
  <g clip-path="url(#chest)"><g transform="translate(240.2 342.4) scale(0.0215)"><use href="#raccoon" fill="${C.pink}" fill-rule="evenodd"/></g></g>
  ${o.chest ?? ""}
  <!-- ears -->
  <path d="M150 186 C138 182 134 196 137 206 C140 216 147 220 152 218 Z" fill="#74462A"/>
  <path d="M250 186 C262 182 266 196 263 206 C260 216 253 220 248 218 Z" fill="#74462A"/>
  <path d="M146 194 C142 200 143 207 147 211" stroke="#4A2A17" stroke-width="1.4" fill="none"/>
  <path d="M254 194 C258 200 257 207 253 211" stroke="#4A2A17" stroke-width="1.4" fill="none"/>
  <!-- head -->
  <path d="M148 150 C146 186 150 214 159 238 C169 262 185 275 200 276 C215 275 231 262 241 238 C250 214 254 186 252 150 Z" fill="url(#skin)"/>
  <!-- temples (short fade under the cap) -->
  <path d="M148 150 L158 150 C157 166 156 180 155 192 L150 196 C148 182 147 166 148 150 Z" fill="${C.hair}" opacity=".92"/>
  <path d="M252 150 L242 150 C243 166 244 180 245 192 L250 196 C252 182 253 166 252 150 Z" fill="${C.hair}" opacity=".92"/>
  <!-- short hair on top (shows under holiday hats) -->
  ${o.hat ? `<path d="M147 160 C147 118 170 100 200 100 C230 100 253 118 253 160 C240 150 220 146 200 146 C180 146 160 150 147 160 Z" fill="${C.hair}"/>` : ""}
  <!-- shade from the hat -->
  <path d="M149 164 C172 178 228 178 251 164 L251 182 C228 190 172 190 149 182 Z" fill="#000" opacity="${o.hat ? ".1" : ".2"}"/>
  <!-- cheekbone light, jaw shade -->
  <ellipse cx="168" cy="210" rx="10" ry="5" fill="#fff" opacity=".045"/>
  <ellipse cx="232" cy="210" rx="10" ry="5" fill="#fff" opacity=".045"/>
  <!-- brows -->
  <path d="M161 186 C167 177.5 180 174.5 190.5 177.5 L190 180.6 C180 178.2 169 180.2 162.5 188 Z" fill="${C.hair}"/>
  <path d="M239 186 C233 177.5 220 174.5 209.5 177.5 L210 180.6 C220 178.2 231 180.2 237.5 188 Z" fill="${C.hair}"/>
  ${eye(178, "eyeL")}
  ${eye(222, "eyeR")}
  <path d="M163 199 C160 201 159 203.5 159.5 206 M232 199 C235 201 236 203.5 235.5 206" stroke="#4A2A17" stroke-width="1.1" fill="none" opacity=".45" stroke-linecap="round"/>
  <!-- nose -->
  <path d="M203 200 C205 210 208 216 211 219" stroke="#5A341D" stroke-width="1.6" fill="none" opacity=".55" stroke-linecap="round"/>
  <path d="M189 219 C186 225 191 229 196 227.5 C198 229.5 202 229.5 204 227.5 C209 229 214 225 211 219" stroke="#3E2414" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <ellipse cx="200" cy="222" rx="5" ry="2.5" fill="#fff" opacity=".07"/>
  <!-- beard: short, neatly trimmed -->
  <path d="M150 198 C151 238 170 270 200 274 C230 270 249 238 250 198 L244 201 C242 224 235 236 225 242 C212 238 188 238 175 242 C165 236 158 224 156 201 Z" fill="url(#beard)"/>
  <path d="M158 206 C160 226 170 240 180 245" stroke="${C.hair}" stroke-width="2" fill="none" opacity=".35"/>
  <path d="M242 206 C240 226 230 240 220 245" stroke="${C.hair}" stroke-width="2" fill="none" opacity=".35"/>
  <!-- mustache (trimmed above the lip) -->
  <path d="M182 231.5 C188 226.5 196 227 200 229 C204 227 212 226.5 218 231.5 C212 233.4 206 233 200 232.4 C194 233 188 233.4 182 231.5 Z" fill="${C.hair}"/>
  <!-- smile lines -->
  <path d="M189 222 C181 227 177 232 176 236 M211 222 C219 227 223 232 224 236" stroke="#4A2A17" stroke-width="1.4" fill="none" opacity=".4" stroke-linecap="round"/>
  <!-- mouth: warm, open smile with lifted corners -->
  <path d="M176 236.5 C184 257 216 257 224 236.5 C211 241.5 189 241.5 176 236.5 Z" fill="#3A1A12"/>
  <path d="M179 238 C189 242.6 211 242.6 221 238 C219.5 248.5 180.5 248.5 179 238 Z" fill="#F6F2ED"/>
  <path d="M189 252 C195 254.6 205 254.6 211 252 C206 249.4 194 249.4 189 252 Z" fill="#B05F50" opacity=".6"/>
  <path d="M176 236.5 C184 257 216 257 224 236.5" stroke="#2A1510" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M174.5 235 C175.5 236.6 176.5 237.4 178 237.6 M225.5 235 C224.5 236.6 223.5 237.4 222 237.6" stroke="#2A1510" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <path d="M187 258.5 C195 261.5 205 261.5 213 258.5" stroke="#6B3A28" stroke-width="1.4" fill="none" opacity=".55" stroke-linecap="round"/>
  ${o.face ?? ""}
  ${o.hat ?? standardCap()}
  ${o.top ?? ""}
</g>
</svg>
`;
}

fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "default.svg"), portrait());
for (const [name, layers] of Object.entries(overlays)) fs.writeFileSync(path.join(out, `${name}.svg`), portrait(layers));
console.log(`Randy: default + ${Object.keys(overlays).length} seasonal variants written to public/images/brand/randy/`);
