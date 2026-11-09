import fs from 'fs';

function findFigures(file) {
  console.log(`\n=================== ${file} ===================`);
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(/<span class="anatomy-fig">([\s\S]*?)<\/span>/gi)];
  matches.forEach((m, i) => {
    console.log(`Figure #${i+1}: ${m[1].trim()}`);
    const pos = m.index;
    const svgStart = content.indexOf('<svg', pos);
    const svgEnd = content.indexOf('</svg>', svgStart);
    if (svgStart !== -1 && svgEnd !== -1) {
      const svg = content.substring(svgStart, svgEnd + 6);
      const dataSteps = [...svg.matchAll(/data-step="([^"]+)"/g)].map(x => x[1]);
      console.log(`  SVG steps:`, dataSteps);
      const openG = (svg.match(/<g\b/g) || []).length;
      const closeG = (svg.match(/<\/g>/g) || []).length;
      console.log(`  <g> tag balance: open=${openG}, close=${closeG}`);
    }
  });
}

findFigures('analisis.html');
findFigures('teknis.html');
findFigures('testing.html');
