import fs from 'node:fs';

const html = fs.readFileSync('testing.html', 'utf8');

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

const svg41 = extractSvg('Fig 4.1');
const svg43 = extractSvg('Fig 4.3');

console.log('SVG 4.1 length:', svg41?.length);
console.log('SVG 4.3 length:', svg43?.length);

fs.writeFileSync('scripts/svg41.txt', svg41 || '', 'utf8');
fs.writeFileSync('scripts/svg43.txt', svg43 || '', 'utf8');
console.log('Saved testing SVGs to scripts/');
