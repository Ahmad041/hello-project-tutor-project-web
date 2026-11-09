import fs from 'fs';

const files = ['analisis.html', 'teknis.html', 'testing.html'];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  console.log(`\n================ ${file} ================`);
  
  // Check data-step tags
  const stepMatches = [...content.matchAll(/data-step="(\d+)"/g)];
  console.log('data-step count:', stepMatches.length, 'values:', stepMatches.map(m => m[1]));
  
  // Check unclosed tags or g tags
  const openG = (content.match(/<g\b[^>]*data-step/g) || []).length;
  console.log('Open <g data-step> tags:', openG);
  
  // Check anatomy callouts
  const hasCallouts = content.includes('anatomy-callouts');
  console.log('Has anatomy-callouts:', hasCallouts);
  
  // Check details
  const detailsCount = (content.match(/<details/g) || []).length;
  console.log('Details count:', detailsCount);
}
