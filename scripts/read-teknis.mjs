import fs from 'node:fs';

const html = fs.readFileSync('teknis.html', 'utf8');
const sections = [...html.matchAll(/<section[^>]*id=["']([^"']+)["'][^>]*>(.*?)<\/section>/gs)];

sections.forEach((s, i) => {
  const id = s[1];
  const inner = s[2];
  console.log(`\n--- STEP ${i + 1}: ${id} (length: ${inner.length}) ---`);
  const lines = inner.split('\n').filter(l => l.trim().length > 0).slice(0, 8);
  console.log(lines.join('\n'));
});
