/* Generates the 16 product illustrations referenced by src/lib/studylink-data.ts.
   Flat ink line-art on a category tint, drawn from the brand palette only.
   Run:  node scripts/gen-product-art.mjs                                     */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const OUT = path.resolve('public/products');
fs.mkdirSync(OUT, { recursive: true });

const THEME = {
  lectures:   { bg: '#EEF6FF', sheet: '#FFFFFF', ink: '#13253A', accent: '#1A70B0' },
  medical:    { bg: '#DCFFEB', sheet: '#FFFFFF', ink: '#004D30', accent: '#007C50' },
  stationery: { bg: '#FFF6CA', sheet: '#FFFFFF', ink: '#13253A', accent: '#877400' },
};

const S = 512;

/* ── glyph builders (128×128 user space, stroked) ───────────────────────── */
const g = {
  book: (t) => `
    <path d="M20 30h34a14 14 0 0 1 14 14v58a10 10 0 0 0-10-10H20z" fill="${t.sheet}" stroke="${t.ink}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M108 30H74a14 14 0 0 0-14 14v58a10 10 0 0 1 10-10h38z" fill="${t.sheet}" stroke="${t.ink}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M64 44v58" stroke="${t.ink}" stroke-width="5" stroke-linecap="round"/>`,
  bookmark: (t) => `<path d="M84 30v34l10-8 10 8V30z" fill="${t.accent}"/>`,
  lines: (t, xs, y0) => xs.map((w, i) =>
    `<path d="M${28} ${y0 + i * 11}h${w}" stroke="${t.accent}" stroke-width="4.5" stroke-linecap="round" opacity="0.55"/>`).join(''),
  pulse: (t) => `<path d="M24 96h16l8-18 12 34 10-24 8 8h26" fill="none" stroke="${t.accent}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  capsule: (t) => `
    <rect x="30" y="52" width="68" height="30" rx="15" fill="${t.sheet}" stroke="${t.ink}" stroke-width="5"/>
    <path d="M64 52v30" stroke="${t.ink}" stroke-width="5"/>
    <path d="M45 52h19v30H45a15 15 0 0 1 0-30z" fill="${t.accent}" opacity="0.85"/>`,
  scalpel: (t) => `
    <path d="M30 96l30-30 22-22a10 10 0 0 1 14 14L74 80 44 110z" fill="${t.sheet}" stroke="${t.ink}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M60 66l22 22" stroke="${t.accent}" stroke-width="5" stroke-linecap="round"/>`,
  microscope: (t) => `
    <path d="M40 104h56" stroke="${t.ink}" stroke-width="6" stroke-linecap="round"/>
    <path d="M52 104V86a24 24 0 0 1 24-24" fill="none" stroke="${t.ink}" stroke-width="5.5" stroke-linecap="round"/>
    <rect x="62" y="24" width="20" height="34" rx="6" transform="rotate(24 72 41)" fill="${t.accent}"/>
    <path d="M46 78h26" stroke="${t.ink}" stroke-width="5" stroke-linecap="round"/>`,
  smile: (t) => `
    <circle cx="64" cy="60" r="30" fill="${t.sheet}" stroke="${t.ink}" stroke-width="5"/>
    <circle cx="54" cy="54" r="4" fill="${t.ink}"/><circle cx="74" cy="54" r="4" fill="${t.ink}"/>
    <path d="M52 70a14 14 0 0 0 24 0" fill="none" stroke="${t.accent}" stroke-width="5" stroke-linecap="round"/>`,
  stack: (t) => `
    <rect x="24" y="76" width="80" height="18" rx="5" fill="${t.sheet}" stroke="${t.ink}" stroke-width="5"/>
    <rect x="30" y="54" width="68" height="18" rx="5" fill="${t.sheet}" stroke="${t.ink}" stroke-width="5"/>
    <rect x="36" y="32" width="56" height="18" rx="5" fill="${t.accent}"/>`,
  stetho: (t) => `
    <path d="M38 26v26a20 20 0 0 0 40 0V26" fill="none" stroke="${t.ink}" stroke-width="6" stroke-linecap="round"/>
    <path d="M58 72v10a22 22 0 0 0 44 0v-8" fill="none" stroke="${t.ink}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="102" cy="60" r="12" fill="${t.accent}"/>
    <circle cx="38" cy="24" r="6" fill="${t.ink}"/><circle cx="78" cy="24" r="6" fill="${t.ink}"/>`,
  hammer: (t) => `
    <path d="M84 28l24 24-30 12z" fill="${t.accent}"/>
    <path d="M78 64L34 108" stroke="${t.ink}" stroke-width="7" stroke-linecap="round"/>
    <circle cx="30" cy="112" r="7" fill="${t.ink}"/>`,
  fork: (t) => `
    <path d="M46 26v40a18 18 0 0 0 36 0V26" fill="none" stroke="${t.ink}" stroke-width="6" stroke-linecap="round"/>
    <path d="M64 84v22" stroke="${t.accent}" stroke-width="8" stroke-linecap="round"/>
    <path d="M52 108h24" stroke="${t.ink}" stroke-width="6" stroke-linecap="round"/>`,
  coat: (t) => `
    <path d="M50 24l14 12 14-12 22 12a10 10 0 0 1 6 9v57a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6V45a10 10 0 0 1 6-9z" fill="${t.sheet}" stroke="${t.ink}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M64 36v72" stroke="${t.ink}" stroke-width="4.5"/>
    <rect x="74" y="66" width="18" height="22" rx="3" fill="${t.accent}" opacity="0.8"/>`,
  penruler: (t) => `
    <path d="M28 92l10-34 40-34a9 9 0 0 1 13 13L57 82z" fill="${t.sheet}" stroke="${t.ink}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M38 58l13 13" stroke="${t.accent}" stroke-width="5" stroke-linecap="round"/>
    <rect x="22" y="98" width="84" height="14" rx="4" fill="${t.accent}"/>
    <path d="M38 98v7M54 98v7M70 98v7M86 98v7" stroke="${t.bg}" stroke-width="3.5" stroke-linecap="round"/>`,
  badge: (t) => `
    <path d="M64 12v20" stroke="${t.ink}" stroke-width="5" stroke-linecap="round"/>
    <rect x="30" y="32" width="68" height="84" rx="10" fill="${t.sheet}" stroke="${t.ink}" stroke-width="5"/>
    <circle cx="64" cy="60" r="13" fill="${t.accent}"/>
    <path d="M44 88h40M50 100h28" stroke="${t.ink}" stroke-width="5" stroke-linecap="round" opacity="0.6"/>`,
  bottle: (t) => `
    <rect x="42" y="18" width="44" height="14" rx="4" fill="${t.ink}"/>
    <rect x="34" y="32" width="60" height="80" rx="12" fill="${t.sheet}" stroke="${t.ink}" stroke-width="5"/>
    <path d="M64 56v32M48 72h32" stroke="${t.accent}" stroke-width="8" stroke-linecap="round"/>`,
};

const ART = {
  'anatomy-notes':     ['lectures',   (t) => g.book(t) + g.bookmark(t)],
  'internal-medicine': ['lectures',   (t) => g.book(t) + g.pulse(t)],
  'pathology':         ['lectures',   (t) => g.microscope(t)],
  'pediatrics':        ['lectures',   (t) => g.smile(t) + `<path d="M28 104h72" stroke="${t.accent}" stroke-width="6" stroke-linecap="round"/>`],
  'pharmacology':      ['lectures',   (t) => g.capsule(t) + g.lines(t, [56, 40], 96)],
  'surgery':           ['lectures',   (t) => g.scalpel(t)],
  'lectures':          ['lectures',   (t) => g.stack(t)],
  'medicines':         ['medical',    (t) => g.bottle(t)],
  'stethoscope':       ['medical',    (t) => g.stetho(t)],
  'stethoscope-pro':   ['medical',    (t) => g.stetho(t) + `<circle cx="102" cy="60" r="20" fill="none" stroke="${t.ink}" stroke-width="4" opacity="0.35"/>`],
  'reflex-hammer':     ['medical',    (t) => g.hammer(t)],
  'tuning-fork':       ['medical',    (t) => g.fork(t)],
  'labcoat-pro':       ['medical',    (t) => g.coat(t)],
  'stationery':        ['stationery', (t) => g.penruler(t)],
  'stationery-set':    ['stationery', (t) => g.penruler(t) + `<rect x="94" y="24" width="12" height="52" rx="6" fill="${t.ink}" opacity="0.75"/>`],
  'id-holder':         ['stationery', (t) => g.badge(t)],
};

function svg(themeKey, glyph) {
  const t = THEME[themeKey];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="${S}" height="${S}">
  <rect width="128" height="128" rx="22" fill="${t.bg}"/>
  <g opacity="0.5">
    <circle cx="112" cy="18" r="26" fill="${t.sheet}" opacity="0.45"/>
    <circle cx="14" cy="116" r="20" fill="${t.sheet}" opacity="0.35"/>
  </g>
  <g stroke-linecap="round" stroke-linejoin="round">${glyph(t)}</g>
</svg>`;
}

let n = 0;
for (const [name, [themeKey, glyph]] of Object.entries(ART)) {
  const markup = svg(themeKey, glyph);
  fs.writeFileSync(path.join(OUT, `${name}.svg`), markup);
  await sharp(Buffer.from(markup)).png({ compressionLevel: 9 }).toFile(path.join(OUT, `${name}.png`));
  n++;
}
console.log(`generated ${n} product illustrations → public/products`);
