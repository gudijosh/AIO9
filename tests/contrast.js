// Contrast of the page palette. Usage: node tests/contrast.js
// Values must match src/app/globals.css, src/data/industries.ts and src/data/devices.ts.
const hex = (h) => { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const [x, y] = [lum(hex(a)), lum(hex(b))].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const INK = '#0A0A12', BONE = '#EFEAE0', AZURE = '#2F63FF', VOLT = '#D4FF3A', FOG = '#A9A7BA', SLATE = '#4D5C70';
// [label, foreground, background, minimum]. 4.5 for reading text, 3 for display type (large).
const pairs = [
  ['bone on ink (text)', BONE, INK, 4.5], ['fog on ink (secondary text)', FOG, INK, 4.5], ['volt on ink (labels)', VOLT, INK, 4.5],
  ['ink on bone (text)', INK, BONE, 4.5], ['slate-600 on bone (secondary text)', SLATE, BONE, 4.5],
  ['ink on volt (button hover)', INK, VOLT, 4.5], ['ink on bone (button)', INK, BONE, 4.5], ['white on azure (submit button)', '#FFFFFF', AZURE, 4.5],
  ['azure on bone (display type only)', AZURE, BONE, 3], ['azure on ink (display type only)', AZURE, INK, 3],
  ...Object.entries({ healthcare: '#17B3A3', hospitality: '#E8794A', realEstate: '#C9A24B', retail: '#E0457B', services: '#7B6CFF', logistics: '#F5A524', farms: '#F2B705', inventory: '#1EA7E8', fleet: '#FF5A4F', agro: '#8BD450' })
    .map(([k, c]) => [`ink on ${k} chip`, INK, c, 4.5]),
];
let bad = 0;
for (const [label, fg, bg, min] of pairs) { const r = ratio(fg, bg); if (r < min) bad++; console.log(`${r < min ? 'FAIL' : 'ok  '} ${r.toFixed(1).padStart(5)}  (min ${min})  ${label}`); }
console.log(bad ? `${bad} pairs below their minimum` : 'all pairs meet their minimum');
process.exit(bad ? 1 : 0);
