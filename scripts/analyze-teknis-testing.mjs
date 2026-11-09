import fs from 'fs';

const dump = JSON.parse(fs.readFileSync('scripts/svg_dump.json', 'utf8'));

console.log('=== TEKNIS FIGURES ===');
dump.teknis.forEach((f, i) => {
  console.log(`\nFig ${i+1}: ${f.title}`);
  const lines = f.svg.split('\n');
  lines.forEach((l, idx) => {
    const t = l.trim();
    if (t.startsWith('<!--') || t.includes('<text') || t.includes('data-step') || t.includes('<g')) {
      console.log(`  [${idx}] ${t}`);
    }
  });
});

console.log('\n=== TESTING FIG 4.1 ===');
const f41 = dump.testing[0];
console.log(`Fig 1: ${f41.title}`);
f41.svg.split('\n').forEach((l, idx) => {
  const t = l.trim();
  if (t.startsWith('<!--') || t.includes('<text') || t.includes('data-step') || t.includes('<g')) {
    console.log(`  [${idx}] ${t}`);
  }
});
