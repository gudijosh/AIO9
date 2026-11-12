// Contrast check for the six app themes. Usage: node contrast.js
const hex = (h) => { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const [x, y] = [lum(hex(a)), lum(hex(b))].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const T = {
  healthcare: { accent: '#0B7A70', on: '#FFFFFF', ink: '#0B7A70', win: '#FFFFFF', chrome: '#F1FAF8', chromeText: '#12332F', text: '#12332F', muted: '#4C6964', side: '#F1FAF8', sideText: '#4C6964', tileInk: '#0B6B62', soft: '#DFF3EF', warnText: '#96560A', warnBg: '#FBEFD9' },
  hospitality: { accent: '#E8794A', on: '#24140E', ink: '#F29A72', win: '#221712', chrome: '#2C1E17', chromeText: '#F6EAE2', text: '#F6EAE2', muted: '#C9B2A5', side: '#1B120D', sideText: '#C9B2A5', tileInk: '#9A3F14', soft: '#4A2A1C', warnText: '#FFB59A', warnBg: '#4A2A1C' },
  realEstate: { accent: '#1F6B4A', on: '#FFFFFF', ink: '#1F6B4A', win: '#FFFFFF', chrome: '#123B2A', chromeText: '#EAF4EE', text: '#15281F', muted: '#53665C', side: '#123B2A', sideText: '#B9D3C5', tileInk: '#1F6B4A', soft: '#E2F0E8', warnText: '#8A5F12', warnBg: '#F6ECD6' },
  retail: { accent: '#C42B5C', on: '#FFFFFF', ink: '#B3204F', win: '#FFFFFF', chrome: '#FFF5F8', chromeText: '#3A1524', text: '#2B1320', muted: '#73525F', side: '#FFF5F8', sideText: '#73525F', tileInk: '#B3204F', soft: '#FCE6ED', warnText: '#96560A', warnBg: '#FBEFD9' },
  services: { accent: '#4B3FBF', on: '#FFFFFF', ink: '#4B3FBF', win: '#FFFFFF', chrome: '#F6F5FD', chromeText: '#1B1838', text: '#1B1838', muted: '#5B5778', side: '#221D4E', sideText: '#B8B3E0', tileInk: '#4338B0', soft: '#EBE9FB', warnText: '#96560A', warnBg: '#FBEFD9' },
  logistics: { accent: '#F5A524', on: '#17130A', ink: '#F8B84E', win: '#171A1F', chrome: '#0F1215', chromeText: '#EEF1F4', text: '#EEF1F4', muted: '#A3ADB8', side: '#0F1215', sideText: '#A3ADB8', tileInk: '#855400', soft: '#3A2E17', warnText: '#FF8A6B', warnBg: '#3F221B' },
};
let bad = 0;
for (const [name, t] of Object.entries(T)) {
  const pairs = { 'on/accent': [t.on, t.accent], 'ink/win': [t.ink, t.win], 'ink/soft': [t.ink, t.soft], 'text/win': [t.text, t.win], 'muted/win': [t.muted, t.win], 'chromeText/chrome': [t.chromeText, t.chrome], 'sideText/side': [t.sideText, t.side], 'white/tileInk': ['#FFFFFF', t.tileInk], 'tileInk/cream': [t.tileInk, '#F6F3EC'], 'warn': [t.warnText, t.warnBg] };
  const out = Object.entries(pairs).map(([k, [a, b]]) => { const r = ratio(a, b); if (r < 4.5) bad++; return `${k} ${r.toFixed(1)}${r < 4.5 ? ' !!' : ''}`; });
  console.log(name.padEnd(12), out.join(' | '));
}
console.log(bad ? `${bad} pairs below 4.5` : 'all pairs >= 4.5');
