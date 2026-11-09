import fs from 'fs';

const dump = JSON.parse(fs.readFileSync('scripts/svg_dump.json', 'utf8'));

['analisis', 'teknis', 'testing'].forEach(mod => {
  console.log(`\n================ MODULE: ${mod} ================`);
  dump[mod].forEach((f, i) => {
    console.log(`Fig ${i+1}: ${f.title}`);
    // Print lines containing text or comments
    const lines = f.svg.split('\n');
    lines.forEach((line, lineIdx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('<!--') || trimmed.includes('<text') || trimmed.includes('data-step')) {
        console.log(`  [L${lineIdx}] ${trimmed}`);
      }
    });
  });
});
