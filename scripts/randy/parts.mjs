// Shared pieces of the Randy master drawing.

export const C = {
  pink: "#FFCEE4",
  pinkSoft: "#FFF5FB",
  shirt: "#1E1C19",
  line: "#2A1A10",
  hair: "#16110E",
};

// Standard black work cap with the approved raccoon mark. `colors` lets a
// holiday recolor the same cap; `patch` replaces the front mark.
export function standardCap(colors = {}, patch) {
  const crown = colors.crown ?? "url(#cap)";
  const bill = colors.bill ?? "url(#bill)";
  const seam = colors.seam ?? "#3B3733";
  const under = colors.under ?? "#0A0908";
  return `
  <!-- cap -->
  <path d="M141 156 C139 106 168 84 200 84 C232 84 261 106 259 156 Z" fill="${crown}"/>
  <path d="M170 92 C162 108 160 132 162 154 M230 92 C238 108 240 132 238 154 M200 86 L200 100" stroke="${seam}" stroke-width="1.3" fill="none"/>
  <circle cx="200" cy="85" r="3.6" fill="${seam}"/>
  <!-- cap patch: approved raccoon mark (unless a holiday supplies its own) -->
  <ellipse cx="200" cy="121" rx="21.5" ry="18.5" fill="#121110" opacity=".55"/>
  ${patch ?? `<g clip-path="url(#patch)"><g transform="translate(179.2 103.2) scale(0.0325)"><use href="#raccoon" fill="${C.pink}" fill-rule="evenodd"/></g></g>`}
  <!-- bill -->
  <path d="M136 153 C168 145 232 145 264 153 C266 163 253 175 200 177 C147 175 134 163 136 153 Z" fill="${bill}"/>
  <path d="M146 166 C168 172 232 172 254 166 C246 174 228 176.5 200 176.5 C172 176.5 154 174 146 166 Z" fill="${under}"/>
  <path d="M146 155.5 C172 150 228 150 254 155.5" stroke="#45403B" stroke-width="1.2" fill="none"/>
`;
}

