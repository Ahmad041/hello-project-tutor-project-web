import fs from 'fs';

const content = fs.readFileSync('teknis.html', 'utf8');
const pos = content.indexOf('Fig 3.7');
const svgStart = content.indexOf('<svg', pos);
const svgEnd = content.indexOf('</svg>', svgStart);
console.log(content.slice(svgStart, svgEnd + 6));
