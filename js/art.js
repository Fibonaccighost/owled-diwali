/* art: every illustration in the mela, as inline SVG. Colours come from css/palettes.css (--c is the stall's colour). */
(() => {
'use strict';
const esc = s => String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
const range = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join('');

/* ── the parts every stall shares: posts, back wall, sign, awning, counter, brand tags ── */
function frame(name, brands, inner, opts = {}) {
  const stripes = range(8, i => {
    const x = 20 + i * 40;
    return `<path class="${i % 2 ? 'cr-f' : 'c-f'}" d="M${x} 72h40v44a20 13 0 0 1-40 0z"/>`;
  });
  const bulbs = range(13, i => `<circle class="bulb" cx="${36 + i * 24}" cy="4" r="3.6"/>`);
  const size = name.length > 16 ? 34 : 40;
  const tags = brands.slice(0, 3).map((b, i) => {
    const w = 92, x = 34 + i * 100;
    return `<g transform="translate(${x} 362)"><rect width="${w}" height="30" rx="3" fill="#000"/><rect width="${w}" height="30" rx="3" fill="none" class="c-s" stroke-width="1.5"/>` +
      `<text class="tag-t" x="${w / 2}" y="20" text-anchor="middle" font-size="12" fill="#fff3e2" textLength="${Math.min(w - 12, b.length * 7)}" lengthAdjust="spacingAndGlyphs">${esc(b)}</text></g>`;
  }).join('');
  return `<svg viewBox="0 0 360 420" aria-hidden="true">
    <rect x="28" y="80" width="304" height="340" fill="#120a08"/>
    <rect x="28" y="80" width="304" height="340" fill="url(#shopGlow)"/>
    ${inner}
    <rect x="16" y="66" width="11" height="354" fill="#2f2622"/><rect x="333" y="66" width="11" height="354" fill="#2f2622"/>
    ${stripes}
    <g class="sign-glow"><rect class="sign-box c-s" x="22" y="6" width="316" height="64" rx="4" fill="#000" stroke-width="3"/>
    <text class="sign-t" x="180" y="${size > 36 ? 53 : 51}" text-anchor="middle" font-size="${size}" fill="#fff3e2">${esc(name)}</text></g>
    ${bulbs}
    ${opts.noCounter ? '' : `<rect x="26" y="336" width="308" height="84" fill="#1d1d1d"/><rect class="c-f" x="22" y="330" width="316" height="12"/>${tags}`}
    <rect class="dim" width="360" height="420"/>
  </svg>`;
}

/* ── five shops, each one a different kind of stall ── */
const SHOPS = {
  rangoli(c) {   // a wall of phones playing reels
    const phone = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-23" y="-40" width="46" height="80" rx="6" fill="#000"/><rect x="-20" y="-36" width="40" height="72" rx="3" class="c-f" opacity=".9"/><path d="M-7-11 9 0-7 11z" fill="#fff3e2"/><rect x="-14" y="24" width="20" height="3" fill="#fff3e2"/></g>`;
    return phone(72, 186, -5) + phone(130, 178, 3) + phone(190, 190, -2) + phone(250, 178, 4) + phone(300, 192, -4) +
      phone(100, 276, 3) + phone(162, 282, -3) + phone(226, 276, 2) + phone(286, 284, -2);
  },
  talkies() {   // a single-screen cinema
    const beam = '<path d="M180 122 54 148v128l126 34 126-34V148z" fill="#fff3e2" opacity=".06"/>';
    const seats = range(7, i => `<path d="M${44 + i * 42} 322v-24a14 14 0 0 1 28 0v24z" fill="#000"/>`);
    return beam + `<rect x="50" y="138" width="260" height="146" fill="#000"/><rect x="56" y="144" width="248" height="134" class="c-f"/>` +
      `<circle cx="180" cy="211" r="34" fill="#000"/><path d="M169 192l30 19-30 19z" fill="#fff3e2"/>` +
      range(9, i => `<rect x="${64 + i * 28}" y="147" width="14" height="6" fill="#000" opacity=".45"/><rect x="${64 + i * 28}" y="269" width="14" height="6" fill="#000" opacity=".45"/>`) + seats;
  },
  patakhe() {   // a firecracker stall: rockets on racks and a loudspeaker
    const rocket = (x, y, h, k) => `<g transform="translate(${x} ${y})"><rect x="-10" y="${-h}" width="20" height="${h}" class="${k}"/><rect x="-10" y="${-h + 14}" width="20" height="7" fill="#fff3e2"/><path d="M-10 ${-h}L0 ${-h - 22}L10 ${-h}z" fill="#fff3e2"/><rect x="-1.5" y="0" width="3" height="26" fill="#8a6a3c"/></g>`;
    const burst = (x, y, r, k) => `<g transform="translate(${x} ${y})" class="${k}">${range(10, i => `<rect x="-1.6" y="${-r}" width="3.2" height="${r * .55}" transform="rotate(${i * 36})"/>`)}</g>`;
    return burst(82, 158, 30, 'am-f') + burst(280, 150, 26, 'c-f') + burst(182, 145, 20, 'cr-f') +
      rocket(66, 300, 70, 'c-f') + rocket(108, 300, 92, 're-f') + rocket(150, 300, 62, 'am-f') + rocket(192, 300, 84, 'c-f') + rocket(234, 300, 70, 're-f') + rocket(276, 300, 94, 'am-f') +
      `<rect x="38" y="296" width="284" height="34" fill="#3a2414"/><rect x="38" y="296" width="284" height="5" fill="#5a3a20"/>`;
  },
  chaupal() {   // a creator's set: ring light, phone on a tripod, cushions
    return `<circle cx="118" cy="190" r="50" fill="none" stroke="#fff3e2" stroke-width="10"/><circle cx="118" cy="190" r="50" fill="none" class="c-s" stroke-width="2" opacity=".8"/>` +
      `<rect x="99" y="158" width="38" height="66" rx="5" fill="#000"/><rect x="102" y="162" width="32" height="58" rx="2" class="c-f"/><circle cx="118" cy="182" r="9" fill="#fff3e2"/><path d="M104 216a14 14 0 0 1 28 0z" fill="#fff3e2"/>` +
      `<rect x="115" y="240" width="6" height="56" fill="#3a3a3a"/><path d="M118 292 92 330M118 292l26 38" stroke="#3a3a3a" stroke-width="5"/>` +
      `<path d="M198 146h104a9 9 0 0 1 9 9v38a9 9 0 0 1-9 9h-72l-22 19v-19h-10a9 9 0 0 1-9-9v-38a9 9 0 0 1 9-9z" class="c-f"/><rect x="208" y="162" width="82" height="6" fill="#000"/><rect x="208" y="176" width="54" height="6" fill="#000"/>` +
      `<path d="M212 268a18 18 0 0 1 18-18h54a18 18 0 0 1 18 18v14h-90z" fill="#7d0a20"/><rect x="186" y="280" width="140" height="50" rx="10" class="am-f"/><rect x="194" y="288" width="58" height="34" rx="10" class="c-f"/>`;
  },
  dukaan() {   // a design shop: prints on a line, an easel, paint
    const print = (x, r, k) => `<g transform="translate(${x} 136) rotate(${r})" class="sway"><rect x="-27" y="4" width="54" height="72" fill="#000"/><rect x="-24" y="7" width="48" height="66" class="${k}"/><rect x="-16" y="44" width="30" height="5" fill="#000"/><rect x="-16" y="54" width="20" height="5" fill="#000"/><circle cy="25" r="10" fill="#fff3e2"/><rect x="-3" y="0" width="6" height="9" fill="#8a6a3c"/></g>`;
    const swatch = (x, k) => `<rect x="${x}" y="300" width="24" height="30" class="${k}"/>`;
    return `<path d="M34 136q146 18 292 0" fill="none" stroke="#6a5a4a" stroke-width="2"/>` + print(78, -3, 'c-f') + print(180, 2, 'am-f') + print(282, -2, 're-f') +
      `<path d="M116 330l28-92M216 330l-28-92" stroke="#8a6a3c" stroke-width="6"/><rect x="118" y="226" width="96" height="74" fill="#fff3e2"/><path d="M126 290l26-42 22 26 12-14 20 30z" class="c-f"/><circle cx="192" cy="244" r="8" class="am-f"/>` +
      swatch(40, 'c-f') + swatch(68, 'am-f') + `<rect x="244" y="284" width="42" height="46" fill="#3a3a3a"/><path d="M254 284l-6-46M266 284v-52M276 284l8-44" stroke="#8a6a3c" stroke-width="4"/><path d="M248 238l-4-14 8 2zM266 232l-4-14 8 0zM284 240l0-14 7 4z" class="c-f"/>`;
  },
};

/* ── entrance and exit arches ── */
function arch(top, sub, id) {
  const lights = range(9, i => `<circle class="bulb" cx="${42 + i * 39.5}" cy="${16}" r="4.5"/>`);
  return `<svg viewBox="0 0 400 500" aria-hidden="true"><defs><linearGradient id="archT${id}" x1="0" x2="1"><stop offset=".3" stop-color="#fff3e2"/><stop offset=".72" stop-color="#ff8e3c"/><stop offset="1" stop-color="#df5e76"/></linearGradient></defs>
    <rect x="10" y="40" width="30" height="460" fill="#1d1d1d"/><rect x="360" y="40" width="30" height="460" fill="#1d1d1d"/>
    <rect x="10" y="150" width="30" height="10" class="re-f"/><rect x="360" y="150" width="30" height="10" class="re-f"/><rect x="10" y="300" width="30" height="10" class="am-f"/><rect x="360" y="300" width="30" height="10" class="am-f"/>
    <rect x="0" y="0" width="400" height="134" rx="5" fill="#000" stroke="#cf1134" stroke-width="4"/>${lights}
    <text class="arch-t" x="200" y="88" text-anchor="middle" font-size="58" fill="url(#archT${id})">${esc(top)}</text>
    <text id="${id}Sub" x="200" y="119" text-anchor="middle" font-size="19" font-weight="600" font-family="var(--sans)" fill="#f4bd45">${esc(sub)}</text>
  </svg>`;
}

/* ── the owl who walks the lane, holding the flame from the first scene ── */
const OWL_BODY = (id) => `<defs><radialGradient id="${id}B" cx="50%" cy="40%" r="60%"><stop offset="0" style="stop-color:var(--owl-belly-a)"/><stop offset="1" style="stop-color:var(--owl-belly-b)"/></radialGradient><linearGradient id="${id}G" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--owl-a)"/><stop offset="1" style="stop-color:var(--owl-b)"/></linearGradient></defs>
  <path d="M52 52 40 8l42 30z" style="fill:var(--owl-ear)"/><path d="M148 52l12-44-42 30z" style="fill:var(--owl-ear)"/>
  <ellipse cx="100" cy="120" rx="72" ry="86" fill="url(#${id}G)"/>
  <path d="M34 110c-24 30-16 80 20 86-8-26-10-56-4-84z" style="fill:var(--owl-wing)"/><path d="M166 110c24 30 16 80-20 86 8-26 10-56 4-84z" style="fill:var(--owl-wing)"/>
  <ellipse cx="100" cy="150" rx="44" ry="50" fill="url(#${id}B)"/>
  <circle cx="68" cy="82" r="30" style="fill:var(--cream);stroke:var(--marigold)" stroke-width="5"/><circle cx="132" cy="82" r="30" style="fill:var(--cream);stroke:var(--marigold)" stroke-width="5"/>
  <circle cx="72" cy="84" r="13" fill="#000"/><circle cx="136" cy="84" r="13" fill="#000"/><circle cx="67" cy="79" r="4" fill="#fff"/><circle cx="131" cy="79" r="4" fill="#fff"/>
  <path d="M92 104l8 18 8-18z" style="fill:var(--marigold)"/>`;

const WALKER = `<svg viewBox="0 0 200 262"><g class="bob">${OWL_BODY('wk')}
  <g transform="translate(100 188)"><path class="w-flame" d="M0-46C12-28 15-18 15-11a15 15 0 0 1-30 0c0-7 3-17 15-35z" fill="#ffb02e"/><path class="w-flame" d="M0-30c6 10 8 15 8 20a8 8 0 0 1-16 0c0-5 2-10 8-20z" fill="#fff5c8"/>
  <path d="M-34 0h68a34 24 0 0 1-68 0z" fill="#a4501c"/><ellipse cy="1" rx="34" ry="6" fill="#3a1606"/></g></g>
  <g class="leg a"><rect x="74" y="198" width="11" height="50" style="fill:var(--marigold)"/><rect x="66" y="244" width="30" height="9" rx="4" style="fill:var(--marigold)"/></g>
  <g class="leg b"><rect x="115" y="198" width="11" height="50" style="fill:var(--marigold)"/><rect x="107" y="244" width="30" height="9" rx="4" style="fill:var(--marigold)"/></g>
</svg>`;
const KEEPER = `<svg viewBox="0 0 200 210">${OWL_BODY('kp')}</svg>`;

/* ── scenery ── */
function wheel() {
  const spokes = range(10, i => `<line x1="0" y1="0" x2="0" y2="-120" transform="rotate(${i * 36})" stroke="#4a0916" stroke-width="3"/><circle cy="-120" r="10" transform="rotate(${i * 36})" fill="${['#cf1134', '#f4bd45', '#ff8e3c', '#aa94ff', '#df5e76'][i % 5]}" opacity=".85"/>`);
  return `<svg viewBox="-150 -150 300 340" width="100%"><path d="M0 0-70 190M0 0 70 190" stroke="#3a0a14" stroke-width="8"/><g class="wheel-spin"><circle r="120" fill="none" stroke="#4a0916" stroke-width="4"/><circle r="70" fill="none" stroke="#4a0916" stroke-width="2"/>${spokes}</g></svg>`;
}
const tent = k => `<svg viewBox="0 0 200 150" width="100%"><path d="M100 0 196 80v70H4V80z" fill="#120406"/><path d="M100 0 196 80H4z" fill="${k}" opacity=".35"/><path d="M84 150v-48a16 16 0 0 1 32 0v48z" fill="#f4bd45" opacity=".35"/></svg>`;

function lights(w) {   // one sagging string of bulbs
  const c = ['#f4bd45', '#cf1134', '#fff3e2', '#ff8e3c'];
  const pts = range(9, i => { const t = (i + .5) / 9, y = 6 + Math.sin(t * Math.PI) * 44; return `<circle cx="${t * w}" cy="${y + 5}" r="6" fill="${c[i % 4]}"/><circle cx="${t * w}" cy="${y + 5}" r="14" fill="${c[i % 4]}" opacity=".18"/>`; });
  return `<svg viewBox="0 0 ${w} 76" width="${w}" height="76"><path d="M0 2Q${w / 2} 98 ${w} 2" fill="none" stroke="#4a3a30" stroke-width="2"/>${pts}</svg>`;
}

const PROPS = [
  // balloon seller
  `<svg viewBox="0 0 150 300" width="100%"><path d="M75 300V150" stroke="#8a6a3c" stroke-width="5"/><g class="sway"><path d="M75 150 34 84M75 150 72 54M75 150l42-58" stroke="#fff3e2" stroke-width="1" opacity=".6"/><ellipse cx="34" cy="60" rx="24" ry="30" fill="#cf1134"/><ellipse cx="72" cy="30" rx="24" ry="30" fill="#f4bd45"/><ellipse cx="117" cy="66" rx="24" ry="30" fill="#aa94ff"/></g></svg>`,
  // jalebi cart
  `<svg viewBox="0 0 210 220" width="100%"><path d="M16 60h178M26 60v110M184 60v110" stroke="#5a3a20" stroke-width="6"/><path d="M6 60 30 14h150l24 46z" fill="#cf1134"/><path d="M50 14 40 60h26l8-46zM110 14l6 46h26l-10-46z" fill="#fff3e2"/><rect x="18" y="130" width="174" height="56" fill="#3a2414"/><rect x="18" y="124" width="174" height="10" fill="#f4bd45"/>${range(4, i => `<circle cx="${50 + i * 37}" cy="112" r="14" fill="none" stroke="#ff8e3c" stroke-width="5"/><circle cx="${50 + i * 37}" cy="112" r="6" fill="none" stroke="#ff8e3c" stroke-width="4"/>`)}<circle cx="50" cy="202" r="16" fill="#1d1d1d" stroke="#5a3a20" stroke-width="4"/><circle cx="160" cy="202" r="16" fill="#1d1d1d" stroke="#5a3a20" stroke-width="4"/></svg>`,
  // hanging lanterns
  `<svg viewBox="0 0 150 300" width="100%"><path d="M16 300V20h118" fill="none" stroke="#5a3a20" stroke-width="6"/>${[[56, 40, '#cf1134'], [98, 76, '#f4bd45'], [132, 30, '#ff8e3c']].map(([x, y, k]) => `<g class="sway"><path d="M${x} 20v${y - 20}" stroke="#6a5a4a" stroke-width="2"/><rect x="${x - 17}" y="${y}" width="34" height="46" rx="13" fill="${k}"/><rect x="${x - 17}" y="${y + 19}" width="34" height="8" fill="#000" opacity=".2"/></g>`).join('')}</svg>`,
  // a stack of mithai boxes
  `<svg viewBox="0 0 170 190" width="100%"><path d="M28 190V96h114v94z" fill="#7d0a20"/><rect x="28" y="130" width="114" height="10" fill="#f4bd45"/><path d="M46 96V42h78v54z" fill="#f4bd45"/><rect x="80" y="42" width="10" height="54" fill="#cf1134"/><rect x="62" y="6" width="46" height="36" fill="#fff3e2"/><rect x="62" y="20" width="46" height="8" fill="#cf1134"/></svg>`,
];
const SHOP_GLOW = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><radialGradient id="shopGlow" cx="50%" cy="60%" r="70%"><stop offset="0" stop-color="#ffb060" stop-opacity=".34"/><stop offset="1" stop-color="#ffb060" stop-opacity="0"/></radialGradient></defs></svg>`;

window.OWArt = { frame, SHOPS, arch, WALKER, KEEPER, wheel, tent, lights, PROPS, SHOP_GLOW };
})();
