import fs from 'fs';

function inspectAnatomies(file) {
  const content = fs.readFileSync(file, 'utf8');
  console.log(`\n================ ${file} ================`);
  const regex = /<div class="story-anatomy"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
  // Let's find every occurrence of anatomy-fig
  const figs = [...content.matchAll(/<span class="anatomy-fig">([^<]+)<\/span>/gi)];
  figs.forEach((f, i) => {
    console.log(`Figure #${i+1}: ${f[1]}`);
    const pos = f.index;
    const svgStart = content.indexOf('<svg', pos);
    const svgEnd = content.indexOf('</svg>', svgStart);
    if (svgStart !== -1 && svgEnd !== -1) {
      console.log(`  SVG length: ${svgEnd - svgStart + 6}`);
      const svgContent = content.slice(svgStart, svgEnd + 6);
      // Check data-step in this svg
      const steps = [...svgContent.matchAll(/data-step="(\d+)"/g)].map(m => m[1]);
      console.log(`  data-steps found:`, steps);
      // Check open vs close g tags
      const openG = (svgContent.match(/<g\b/g) || []).length;
      const closeG = (svgContent.match(/<\/g>/g) || []).length;
      console.log(`  <g> tags: open=${openG}, close=${closeG}`);
    }
  });
}

inspectAnatomies('analisis.html');
inspectAnatomies('teknis.html');
inspectAnatomies('testing.html');
