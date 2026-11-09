import fs from 'fs';

['analisis.html', 'teknis.html', 'testing.html'].forEach(file => {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(
    'bg-white/70 dark:bg-black/50 px-3.5 py-1.5 rounded-full backdrop-blur-md',
    'bg-white/95 dark:bg-zinc-900/95 px-3.5 py-1.5 rounded-full backdrop-blur-xl shadow-sm'
  );
  html = html.replace(
    'bg-white/70 dark:bg-black/50 px-3.5 py-1.5 rounded-full backdrop-blur-md',
    'bg-white/95 dark:bg-zinc-900/95 px-3.5 py-1.5 rounded-full backdrop-blur-xl shadow-sm'
  );
  fs.writeFileSync(file, html, 'utf8');
});
console.log('Updated header backdrop opacities.');
