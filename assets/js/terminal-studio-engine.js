/**
 * terminal-studio-engine.js — Engine Simulasi Terminal Console 80x25
 * Mendukung pengujian koordinat gotoxy, border box, dan ASCII art staging untuk lib.h
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TerminalStudioEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  const BORDER_STYLES = {
    single: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│', label: 'Single Line (borderLine)' },
    double: { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║', label: 'Double Line (borderDoubleLine)' },
    block:  { tl: '█', tr: '█', bl: '█', br: '█', h: '█', v: '█', label: 'Block Solid' }
  };

  const CONSOLE_COLORS = [
    { code: 0x07, name: 'Default Abu-Abu', hex: '#cbd5e1' },
    { code: 0x0A, name: 'Hijau Terminal', hex: '#4ade80' },
    { code: 0x0B, name: 'Cyan Neon', hex: '#38bdf8' },
    { code: 0x0E, name: 'Kuning Emas', hex: '#fde047' },
    { code: 0x0C, name: 'Merah Peringatan', hex: '#f87171' },
    { code: 0x0D, name: 'Magenta / Pink', hex: '#f472b6' },
    { code: 0x0F, name: 'Putih Terang', hex: '#ffffff' }
  ];

  const ASCII_PRESETS = {
    logo: ` _  __          _       _  ___ _        
| |/ /__ _ ___ (_)_ __ | |/ (_) |_ __ _ 
| ' // _\` / __|| | '__|| ' /| | __/ _\` |
| . \\ (_| \\__ \\| | |   | . \\| | || (_| |
|_|\\_\\__,_|___/|_|_|   |_|\\_\\_|\\__\\__,_|`,
    nota: `========================================
           STRUK KASIRKITA              
        Toko Alat Tulis Rani            
========================================
Item: 2x Buku Tulis A5        Rp  24.000
----------------------------------------
TOTAL:                        Rp  24.000
TUNAI:                        Rp  30.000
KEMBALIAN:                    Rp   6.000
========================================`,
    dialog: `+--------------------------------------+
|            KONFIRMASI                |
|  Simpan transaksi penjualan tunai?   |
|         [ Y / Ya ]   [ T / Batal ]   |
+--------------------------------------+`
  };

  function createGrid(cols = 80, rows = 25) {
    const buffer = Array.from({ length: rows }, () => Array(cols).fill(' '));
    const colorBuffer = Array.from({ length: rows }, () => Array(cols).fill(0x07));

    return {
      cols,
      rows,
      buffer,
      colorBuffer,

      clear() {
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            buffer[y][x] = ' ';
            colorBuffer[y][x] = 0x07;
          }
        }
      },

      setChar(x, y, char, color = 0x07) {
        if (x >= 0 && x < cols && y >= 0 && y < rows) {
          buffer[y][x] = char[0] || ' ';
          colorBuffer[y][x] = color;
        }
      },

      drawString(x, y, str, color = 0x07) {
        for (let i = 0; i < str.length; i++) {
          this.setChar(x + i, y, str[i], color);
        }
      },

      drawBorder(x, y, w, h, style = 'double', color = 0x07) {
        const chars = BORDER_STYLES[style] || BORDER_STYLES.double;
        for (let i = 0; i < w; i++) {
          this.setChar(x + i, y, chars.h, color);
          this.setChar(x + i, y + h - 1, chars.h, color);
        }
        for (let j = 0; j < h; j++) {
          this.setChar(x, y + j, chars.v, color);
          this.setChar(x + w - 1, y + j, chars.v, color);
        }
        this.setChar(x, y, chars.tl, color);
        this.setChar(x + w - 1, y, chars.tr, color);
        this.setChar(x, y + h - 1, chars.bl, color);
        this.setChar(x + w - 1, y + h - 1, chars.br, color);
      },

      drawAsciiArt(startX, startY, asciiText, color = 0x07) {
        const lines = asciiText.split('\n');
        lines.forEach((line, lineIdx) => {
          this.drawString(startX, startY + lineIdx, line, color);
        });
      },

      renderLines() {
        return buffer.map((row, y) => ({
          text: row.join(''),
          colors: colorBuffer[y]
        }));
      },

      generateC(commands) {
        let code = '// ========================================================\n';
        code += '// KASIRKITA - Generated C UI Code with lib.h\n';
        code += '// Salin fungsi ini ke dalam proyek IntelliJ IDEA Anda\n';
        code += '// ========================================================\n';
        code += '#include <stdio.h>\n#include <windows.h>\n#include "lib.h"\n\n';
        code += 'void renderKasirScreen() {\n';
        code += '    system("cls");\n';
        code += '    hideCursor();\n';

        for (const cmd of commands) {
          if (cmd.type === 'border') {
            const fn = cmd.style === 'single' ? 'borderLine' : 'borderDoubleLine';
            code += `    ${fn}(${cmd.x}, ${cmd.y}, ${cmd.w}, ${cmd.h});\n`;
          } else if (cmd.type === 'text') {
            code += `    gotoPrintString(${cmd.x}, ${cmd.y}, "${cmd.text.replace(/"/g, '\\"')}");\n`;
          } else if (cmd.type === 'ascii') {
            code += `    // Cetak ASCII Art pada koordinat (${cmd.x}, ${cmd.y})\n`;
            code += `    PrintTxt("${cmd.filename || 'assets/ascii/art.txt'}");\n`;
          } else if (cmd.type === 'cursor') {
            code += `    ${cmd.visible ? 'showCursor' : 'hideCursor'}();\n`;
          }
        }

        code += '}\n';
        return code;
      }
    };
  }

  return {
    BORDER_STYLES,
    CONSOLE_COLORS,
    ASCII_PRESETS,
    createGrid
  };
});
