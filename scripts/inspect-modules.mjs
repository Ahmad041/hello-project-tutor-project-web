import fs from 'node:fs';

function inspectFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  console.log(`=== ${file} ===`);
  const stepMatches = [...content.matchAll(/<section[^>]*id=["']([^"']+)["'][^>]*>(.*?)<\/section>/gs)];
  console.log(`Found ${stepMatches.length} sections:`);
  stepMatches.forEach((m, i) => {
    const id = m[1];
    const sectionHtml = m[2];
    const h2Match = sectionHtml.match(/<h[23][^>]*>(.*?)<\/h[23]>/i);
    const title = h2Match ? h2Match[1].replace(/<[^>]+>/g, '').trim() : 'No title';
    console.log(`  [${i + 1}] id="${id}" -> ${title}`);
  });
}

inspectFile('analisis.html');
inspectFile('teknis.html');
inspectFile('testing.html');
