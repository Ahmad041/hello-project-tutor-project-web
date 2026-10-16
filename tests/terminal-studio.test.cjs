const { test } = require('node:test');
const assert = require('node:assert/strict');

// Terminal Grid Logic Engine
function createTerminalGrid(cols = 80, rows = 25) {
  const buffer = Array.from({ length: rows }, () => Array(cols).fill(' '));

  return {
    cols,
    rows,
    buffer,
    setChar(x, y, char) {
      if (x >= 0 && x < cols && y >= 0 && y < rows) {
        buffer[y][x] = char[0] || ' ';
      }
    },
    drawString(x, y, str) {
      for (let i = 0; i < str.length; i++) {
        this.setChar(x + i, y, str[i]);
      }
    },
    drawBorder(x, y, w, h, style = 'double') {
      const chars = {
        single: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
        double: { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
        block:  { tl: '█', tr: '█', bl: '█', br: '█', h: '█', v: '█' },
      }[style] || chars.double;

      for (let i = 0; i < w; i++) {
        this.setChar(x + i, y, chars.h);
        this.setChar(x + i, y + h - 1, chars.h);
      }
      for (let j = 0; j < h; j++) {
        this.setChar(x, y + j, chars.v);
        this.setChar(x + w - 1, y + j, chars.v);
      }
      this.setChar(x, y, chars.tl);
      this.setChar(x + w - 1, y, chars.tr);
      this.setChar(x, y + h - 1, chars.bl);
      this.setChar(x + w - 1, y + h - 1, chars.br);
    },
    render() {
      return buffer.map(row => row.join('')).join('\n');
    },
    generateCode(commands) {
      let code = '// Kode C KasirKita (lib.h) - Di-generate dari Terminal Studio\n';
      code += '#include <stdio.h>\n#include "lib.h"\n\nvoid drawUI() {\n';
      for (const cmd of commands) {
        if (cmd.type === 'border') {
          const fn = cmd.style === 'single' ? 'borderLine' : 'borderDoubleLine';
          code += `    ${fn}(${cmd.x}, ${cmd.y}, ${cmd.w}, ${cmd.h});\n`;
        } else if (cmd.type === 'text') {
          code += `    gotoPrintString(${cmd.x}, ${cmd.y}, "${cmd.text}");\n`;
        } else if (cmd.type === 'cursor') {
          code += `    ${cmd.visible ? 'showCursor' : 'hideCursor'}();\n`;
        }
      }
      code += '}\n';
      return code;
    }
  };
}

test('terminal grid has exact 80x25 console dimensions', () => {
  const grid = createTerminalGrid();
  assert.equal(grid.cols, 80);
  assert.equal(grid.rows, 25);
  assert.equal(grid.buffer.length, 25);
  assert.equal(grid.buffer[0].length, 80);
});

test('terminal grid draws gotoxy text correctly', () => {
  const grid = createTerminalGrid();
  grid.drawString(10, 5, 'KASIRKITA');
  assert.equal(grid.buffer[5][10], 'K');
  assert.equal(grid.buffer[5][18], 'A');
  assert.equal(grid.buffer[5][9], ' ');
});

test('terminal grid draws double border correctly', () => {
  const grid = createTerminalGrid();
  grid.drawBorder(2, 1, 10, 5, 'double');
  assert.equal(grid.buffer[1][2], '╔');
  assert.equal(grid.buffer[1][11], '╗');
  assert.equal(grid.buffer[5][2], '╚');
  assert.equal(grid.buffer[5][11], '╝');
  assert.equal(grid.buffer[1][5], '═');
  assert.equal(grid.buffer[3][2], '║');
});

test('terminal studio code generator produces valid C lib.h function calls', () => {
  const grid = createTerminalGrid();
  const code = grid.generateCode([
    { type: 'cursor', visible: false },
    { type: 'border', x: 2, y: 1, w: 60, h: 15, style: 'double' },
    { type: 'text', x: 6, y: 3, text: 'MENU UTAMA KASIR' }
  ]);
  assert.match(code, /#include "lib\.h"/);
  assert.match(code, /hideCursor\(\);/);
  assert.match(code, /borderDoubleLine\(2, 1, 60, 15\);/);
  assert.match(code, /gotoPrintString\(6, 3, "MENU UTAMA KASIR"\);/);
});
