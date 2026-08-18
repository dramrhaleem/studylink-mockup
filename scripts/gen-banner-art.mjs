/* Generates promo banner plates and the two bookstore marks.
   Brand palette only; artwork is abstract so no unlicensed photography and no
   product claim is implied by the image itself.                              */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const OUT = path.resolve('public/banners');
fs.mkdirSync(OUT, { recursive: true });

const W = 900, H = 400;

/** الوصلة — العنصر الشكلي من العلامة، مقصوص عمدًا (قاعدة السوبرجرافيك). */
const linkGlyph = (c, o) => `
  <g opacity="${o}" fill="none" stroke="${c}" stroke-width="26" stroke-linecap="round">
    <path d="M300 150h-70a75 75 0 0 0 0 150h70"/>
    <path d="M420 150h70a75 75 0 0 1 0 150h-70"/>
    <path d="M320 225h80"/>
  </g>`;

const dots = (c, o) => `
  <defs><pattern id="d" width="34" height="34" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="2" fill="${c}" opacity="${o}"/>
  </pattern></defs>
  <rect width="${W}" height="${H}" fill="url(#d)"/>`;

function banner({ from, to, glyph, glyphOpacity = 0.16, dotColor = '#FFFFFF' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${dots(dotColor, 0.07)}
  <circle cx="${W - 90}" cy="70" r="150" fill="#FFFFFF" opacity="0.05"/>
  <circle cx="70" cy="${H - 50}" r="110" fill="#FFFFFF" opacity="0.04"/>
  <g transform="translate(300 30) scale(1.05)">${linkGlyph(glyph, glyphOpacity)}</g>
</svg>`;
}

const BANNERS = {
  'home-banner-1':            { from: '#13253A', to: '#0A5C94', glyph: '#4595D7' },
  'home-banner-2':            { from: '#0A5C94', to: '#1A70B0', glyph: '#CFE8FF' },
  'home-banner-3':            { from: '#003520', to: '#007C50', glyph: '#C6F1D8' },
  'library-harvard-banner-1': { from: '#13253A', to: '#304156', glyph: '#4595D7' },
  'library-harvard-banner-2': { from: '#00426F', to: '#1A70B0', glyph: '#CFE8FF' },
  'library-berlin-banner-1':  { from: '#08192C', to: '#1D5C8D', glyph: '#A4D4FF' },
};

function storeMark(letter, from, to, ink = '#FFFFFF') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="256" height="256">
  <defs><linearGradient id="g" x1="1" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>
  </linearGradient></defs>
  <rect width="128" height="128" rx="30" fill="url(#g)"/>
  <path d="M30 92h68" stroke="${ink}" stroke-width="6" stroke-linecap="round" opacity="0.5"/>
  <text x="64" y="76" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="58" font-weight="700" fill="${ink}">${letter}</text>
</svg>`;
}

const MARKS = {
  'harvard-logo': storeMark('H', '#13253A', '#304156'),
  'berlin-logo':  storeMark('B', '#0A5C94', '#1A70B0'),
};

let n = 0;
for (const [name, cfg] of Object.entries(BANNERS)) {
  const markup = banner(cfg);
  fs.writeFileSync(path.join(OUT, `${name}.svg`), markup);
  await sharp(Buffer.from(markup)).png({ compressionLevel: 9 }).toFile(path.join(OUT, `${name}.png`));
  n++;
}
for (const [name, markup] of Object.entries(MARKS)) {
  fs.writeFileSync(path.join(OUT, `${name}.svg`), markup);
  await sharp(Buffer.from(markup)).png({ compressionLevel: 9 }).toFile(path.join(OUT, `${name}.png`));
  n++;
}
console.log(`generated ${n} banner/mark assets → public/banners`);
