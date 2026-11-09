const fs = require('fs');

const files = ['game/uat.html', 'game/git-emergency.html', 'tutorial-github.html'];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  console.log(`\n=== ${file} ===`);
  lines.forEach((line, i) => {
    if (/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(line) || /[⬡★➔✔✕✓]/u.test(line)) {
      console.log(`  L${i + 1}: ${line.trim().slice(0, 100)}`);
    }
  });
}
