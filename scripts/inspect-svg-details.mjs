import fs from 'fs';

function getFigures(file) {
  const content = fs.readFileSync(file, 'utf8');
  const figures = [];
  const matches = [...content.matchAll(/<span class="anatomy-fig">([\s\S]*?)<\/span>/gi)];
  matches.forEach((m, idx) => {
    const title = m[1].trim();
    const pos = m.index;
    const svgStart = content.indexOf('<svg', pos);
    const svgEnd = content.indexOf('</svg>', svgStart);
    if (svgStart !== -1 && svgEnd !== -1) {
      const svg = content.substring(svgStart, svgEnd + 6);
      figures.push({ title, svg });
    }
  });
  return figures;
}

const data = {
  analisis: getFigures('analisis.html'),
  teknis: getFigures('teknis.html'),
  testing: getFigures('testing.html')
};

fs.writeFileSync('scripts/svg_dump.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Saved svg_dump.json');
