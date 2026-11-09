import fs from 'fs';
const text = fs.readFileSync('project.html', 'utf8');
const lines = text.split('\n');
lines.forEach((l, i) => {
  if (l.includes('<nav') || l.includes('<section') || l.includes('<header') || l.includes('data-sc-act') || l.includes('arch-card')) {
    console.log(`L${i+1}: ${l.trim().slice(0, 80)}`);
  }
});
