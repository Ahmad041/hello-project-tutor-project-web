import fs from 'node:fs';

const html = fs.readFileSync('teknis.html', 'utf8');

function extractSvg(figId) {
  const figIdx = html.indexOf(figId);
  if (figIdx === -1) {
    console.error(`Figure ${figId} not found`);
    return null;
  }
  const svgStart = html.indexOf('<svg', figIdx);
  const svgEnd = html.indexOf('</svg>', svgStart) + 6;
  return html.slice(svgStart, svgEnd);
}

const svg31 = extractSvg('Fig 3.1');
const svg35 = extractSvg('Fig 3.5');
const svg37 = extractSvg('Fig 3.7');

console.log('SVG 3.1 length:', svg31?.length);
console.log('SVG 3.5 length:', svg35?.length);
console.log('SVG 3.7 length:', svg37?.length);

fs.writeFileSync('scripts/svg31.txt', svg31 || '', 'utf8');
fs.writeFileSync('scripts/svg35.txt', svg35 || '', 'utf8');
fs.writeFileSync('scripts/svg37.txt', svg37 || '', 'utf8');
console.log('Saved SVGs to scripts/');
