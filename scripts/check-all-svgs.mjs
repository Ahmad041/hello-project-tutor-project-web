import fs from 'fs';

function inspectSvg(filename, figName) {
  const content = fs.readFileSync(filename, 'utf8');
  const idx = content.indexOf(figName);
  if (idx === -1) return 'NOT FOUND';
  const start = content.lastIndexOf('<svg', idx);
  const end = content.indexOf('</svg>', idx) + 6;
  return content.slice(start, end);
}

console.log('=== analisis.html Fig 2.1 ===');
const svg21 = inspectSvg('analisis.html', 'Fig 2.1');
console.log('Length:', svg21.length);

console.log('=== analisis.html Fig 2.3 ===');
const svg23 = inspectSvg('analisis.html', 'Fig 2.3');
console.log('Length:', svg23.length);

console.log('=== teknis.html Fig 3.5 ===');
const svg35 = inspectSvg('teknis.html', 'Fig 3.5');
console.log('Length:', svg35.length);

console.log('=== teknis.html Fig 3.7 ===');
const svg37 = inspectSvg('teknis.html', 'Fig 3.7');
console.log('Length:', svg37.length);

console.log('=== testing.html Fig 4.1 ===');
const svg41 = inspectSvg('testing.html', 'Fig 4.1');
console.log('Length:', svg41.length);

console.log('=== testing.html Fig 4.3 ===');
const svg43 = inspectSvg('testing.html', 'Fig 4.3');
console.log('Length:', svg43.length);
