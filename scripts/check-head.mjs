import fs from 'fs';

['analisis.html', 'teknis.html', 'testing.html'].forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  console.log(`\n=== ${file} HEAD CHECK ===`);
  console.log('has module-shared.css:', html.includes('assets/css/module-shared.css'));
  console.log('has theme-btn-light:', html.includes('id="theme-btn-light"'));
  console.log('has theme-btn-dark:', html.includes('id="theme-btn-dark"'));
  console.log('has data-sc-progress:', html.includes('data-sc-progress'));
  console.log('has centered aside:', html.includes('top-5 left-1/2'));
});
