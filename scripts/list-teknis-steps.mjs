import fs from 'fs';

const html = fs.readFileSync('teknis.html', 'utf8');
const matches = [...html.matchAll(/<section class="[^"]*arch-card[^"]*" id="([^"]+)">[\s\S]*?<h[23]>([^<]+)<\/h[23]>/gi)];
matches.forEach((m, idx) => {
  console.log(`Step #${idx+1}: id="${m[1]}" - title="${m[2]}"`);
});
