const fs = require('fs');
const path = require('path');
const { ICONS } = require('./lucide-dict.js');

const rootDir = path.resolve(__dirname, '..');

let tut = fs.readFileSync(path.join(rootDir, 'tutorial-github.html'), 'utf8');

tut = tut.replace('<span class="pro-tip-icon">💡</span>', `<span class="pro-tip-icon">${ICONS.lightbulb}</span>`);
tut = tut.replace('<span class="pro-tip-icon">⚡</span>', `<span class="pro-tip-icon">${ICONS.zap}</span>`);
tut = tut.replace('<span class="pro-tip-icon">✨</span>', `<span class="pro-tip-icon">${ICONS.sparkles}</span>`);
tut = tut.replace('Merge PR ✓', 'Merge PR');

fs.writeFileSync(path.join(rootDir, 'tutorial-github.html'), tut, 'utf8');
console.log('✓ Modernized tutorial-github.html');
