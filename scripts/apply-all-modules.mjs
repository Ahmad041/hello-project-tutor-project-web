import fs from 'fs';

function updateHeaderAndTheme(html, modNumber) {
  // 1. Ensure module-shared.css is linked in head
  if (!html.includes('assets/css/module-shared.css')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="assets/css/module-shared.css">\n</head>');
  }

  // 2. Remove floating center aside if present
  html = html.replace(/<!-- Top Floating Theme Switcher Capsule -->\s*<aside class="fixed top-5 left-1\/2[\s\S]*?<\/aside>/gi, '');
  html = html.replace(/<aside class="fixed top-5 left-1\/2 -translate-x-1\/2 z-50[\s\S]*?<\/aside>/gi, '');

  // 3. Update header to include theme switcher on right
  const targetHeaderRegex = /<header class="fixed top-5 left-5 right-5 sm:left-8 sm:right-8 z-40 flex items-center justify-between pointer-events-none">[\s\S]*?<\/header>/i;
  
  const newHeader = `<header class="fixed top-5 left-5 right-5 sm:left-8 sm:right-8 z-40 flex items-center justify-between pointer-events-none">
    <a href="index.html" class="pointer-events-auto flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-zinc-900 dark:text-white bg-white/70 dark:bg-black/50 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-zinc-200 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/30 transition-colors shadow-sm">
      <span>⬡ HELLO PROJECT</span>
      <span class="text-blue-600 dark:text-sky-400 font-normal">/ MODUL 0${modNumber}</span>
    </a>
    <div class="pointer-events-auto flex items-center gap-2">
      <!-- Theme Switcher Capsule (Top-Right Aligned) -->
      <aside class="flex items-center gap-1 rounded-full border border-zinc-200 dark:border-white/10 bg-white/85 dark:bg-zinc-900/80 p-1 backdrop-blur-xl shadow-sm transition-colors duration-300" aria-label="Pengalih Mode Tampilan">
        <button id="theme-btn-light" type="button" class="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all focus:outline-none focus:ring-1 focus:ring-zinc-400" aria-label="Beralih ke Mode Terang">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <span class="hidden sm:inline">Terang</span>
        </button>
        <button id="theme-btn-dark" type="button" class="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all focus:outline-none focus:ring-1 focus:ring-zinc-400" aria-label="Beralih ke Mode Gelap">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <span class="hidden sm:inline">Gelap</span>
        </button>
      </aside>
      <a href="daftarModul.html" class="text-xs font-mono font-medium text-zinc-900 dark:text-white bg-white/70 dark:bg-black/50 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-zinc-200 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/30 transition-colors shadow-sm">
        <span>Daftar Modul ↗</span>
      </a>
    </div>
  </header>`;

  html = html.replace(targetHeaderRegex, newHeader);
  return html;
}

function replaceSvgByFigure(html, figIdentifier, newSvg) {
  const figPos = html.indexOf(figIdentifier);
  if (figPos === -1) {
    console.warn(`Figure identifier not found: ${figIdentifier}`);
    return html;
  }
  const svgStart = html.indexOf('<svg', figPos);
  const svgEnd = html.indexOf('</svg>', svgStart) + 6;
  return html.substring(0, svgStart) + newSvg + html.substring(svgEnd);
}

// ==========================================
// 1. TEKNIS.HTML
// ==========================================
console.log('Processing teknis.html...');
let teknis = fs.readFileSync('teknis.html', 'utf8');
teknis = updateHeaderAndTheme(teknis, 3);

// Fig 3.1
const svg31New = `<svg viewBox="0 0 760 270" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Diagram Anatomi Struktur Folder C">
      <defs>
        <pattern id="fldGridClean" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#38bdf8" opacity="0.15"/>
        </pattern>
        <marker id="fldArrowHead" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 1 2 L 8 5 L 1 8 z" fill="#38bdf8"/>
        </marker>
      </defs>

      <!-- Background -->
      <rect width="760" height="270" rx="10" fill="#040914" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1.2"/>
      <rect width="760" height="270" fill="url(#fldGridClean)" rx="10"/>

      <!-- 1. KOTAK KIRI: DIRECTORY TREE (STEP 1) -->
      <g id="fld-step-1" data-step="1">
        <rect x="20" y="16" width="350" height="238" rx="8" fill="#071526" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.2"/>
        <text x="36" y="38" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">1. STRUKTUR DIREKTORI kasirkita/</text>

        <!-- File items -->
        <rect x="34" y="52" width="322" height="40" rx="6" fill="#0b1e38" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1"/>
        <text x="48" y="75" fill="#ffffff" font-size="12" font-weight="700" font-family="monospace">📁 src/main.c</text>
        <text x="170" y="75" fill="#94a3b8" font-size="10" font-family="monospace">(Source code alur utama)</text>

        <rect x="34" y="100" width="322" height="40" rx="6" fill="#0b1e38" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1"/>
        <text x="48" y="123" fill="#ffffff" font-size="12" font-weight="700" font-family="monospace">📁 include/lib.h</text>
        <text x="180" y="123" fill="#94a3b8" font-size="10" font-family="monospace">(Header fungsi grafis)</text>

        <rect x="34" y="148" width="322" height="40" rx="6" fill="#0b1e38" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1"/>
        <text x="48" y="171" fill="#ffffff" font-size="12" font-weight="700" font-family="monospace">📁 assets/ascii/</text>
        <text x="170" y="171" fill="#94a3b8" font-size="10" font-family="monospace">(File TXT banner visual)</text>

        <rect x="34" y="196" width="322" height="46" rx="6" fill="#052e16" stroke="rgba(34, 197, 94, 0.4)" stroke-width="1"/>
        <text x="48" y="217" fill="#6ee7b7" font-size="12" font-weight="700" font-family="monospace">📁 build/latihan.exe</text>
        <text x="48" y="233" fill="#94a3b8" font-size="10" font-family="monospace">Target binary hasil kompilasi GCC</text>

        <!-- Pin 1: Blue in src/main.c -->
        <circle cx="334" cy="72" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="334" y="76" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">1</text>
        <!-- Pin 2: Blue in include/lib.h -->
        <circle cx="334" cy="120" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="334" y="124" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">2</text>
        <!-- Pin 3: Blue in assets/ascii -->
        <circle cx="334" cy="168" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="334" y="172" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">3</text>
      </g>

      <!-- 2. KOTAK KANAN: BUILD PIPELINE (STEP 2) -->
      <g id="fld-step-2" data-step="2">
        <rect x="400" y="16" width="340" height="136" rx="8" fill="#071526" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.2"/>
        <text x="416" y="38" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">2. PIPELINE BUILD GCC MINGW-W64</text>

        <!-- Compiler Command Card -->
        <rect x="414" y="52" width="312" height="90" rx="6" fill="#0b1e38" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1"/>
        <text x="426" y="72" fill="#38bdf8" font-size="10" font-weight="700" font-family="monospace">gcc -std=c17 -Wall -Wextra</text>
        <text x="426" y="90" fill="#fbbf24" font-size="10" font-weight="700" font-family="monospace">-Iinclude src/main.c</text>
        <text x="426" y="108" fill="#6ee7b7" font-size="10" font-weight="700" font-family="monospace">-o build/latihan.exe -luser32</text>
        <text x="426" y="130" fill="#94a3b8" font-size="10" font-family="monospace">Kompilasi C17 + Link API Windows User32</text>

        <!-- Connecting Flow Arrow: src/main.c to compiler -->
        <path d="M 356 72 C 378 72, 388 88, 410 88" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" fill="none" marker-end="url(#fldArrowHead)"/>

        <!-- Pin 4: Blue in Compiler Box -->
        <circle cx="704" cy="72" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="704" y="76" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">4</text>
      </g>

      <!-- 3. KOTAK KANAN BAWAH: EXECUTION WARNING (STEP 3) -->
      <g id="fld-step-3" data-step="3">
        <rect x="400" y="158" width="340" height="96" rx="8" fill="#180a0e" stroke="rgba(239, 68, 68, 0.4)" stroke-width="1.2"/>
        <text x="416" y="178" fill="#f87171" font-size="11" font-weight="700" font-family="monospace">ZONA KRITIS: ROOT DIRECTORY RUN</text>
        <text x="416" y="196" fill="#fca5a5" font-size="10" font-family="monospace">Jalankan .\\build\\latihan.exe dari root project!</text>
        <text x="416" y="214" fill="#94a3b8" font-size="10" font-family="monospace">Jika dijalankan dari dalam folder /build, path relatif</text>
        <text x="416" y="230" fill="#f87171" font-size="10" font-weight="700" font-family="monospace">assets/ascii/judul.txt akan NOT FOUND!</text>
      </g>
    </svg>`;
teknis = replaceSvgByFigure(teknis, 'Fig 3.1', svg31New);

// Fig 3.5
const svg35New = `<svg viewBox="0 0 760 270" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Diagram Anatomi Koordinat Console 80x25">
      <defs>
        <pattern id="conGridClean" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.8" fill="#38bdf8" opacity="0.12"/>
        </pattern>
        <marker id="conArrowHead" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 1 2 L 8 5 L 1 8 z" fill="#38bdf8"/>
        </marker>
      </defs>

      <!-- Canvas Background -->
      <rect width="760" height="270" rx="10" fill="#040914" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1.2"/>
      <rect width="760" height="270" fill="url(#conGridClean)" rx="10"/>

      <!-- Console Window Bezel (Retro Terminal) -->
      <rect x="50" y="32" width="670" height="200" rx="8" fill="#030712" stroke="#38bdf8" stroke-width="2"/>
      
      <!-- Terminal Window Bar -->
      <rect x="50" y="32" width="670" height="24" rx="8" fill="#0f172a"/>
      <circle cx="68" cy="44" r="4" fill="#ef4444"/>
      <circle cx="82" cy="44" r="4" fill="#f59e0b"/>
      <circle cx="96" cy="44" r="4" fill="#10b981"/>
      <text x="115" y="48" fill="#94a3b8" font-family="monospace" font-size="10">Command Prompt Windows - 80 Kolom x 25 Baris</text>

      <!-- 1. ORIGIN & SUMBU KOORDINAT (STEP 1) -->
      <g id="gxy-step-1" data-step="1">
        <!-- Origin Point (0,0) -->
        <circle cx="65" cy="70" r="7" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="78" y="74" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">ORIGIN (0, 0)</text>

        <!-- Axis X (Horizontal) -->
        <line x1="65" y1="20" x2="650" y2="20" stroke="#38bdf8" stroke-width="1.8"/>
        <path d="M 650 20 L 640 16 L 640 24 Z" fill="#38bdf8"/>
        <text x="230" y="16" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">SUMBU X (KOLOM: 0 s.d. 79) ➔ KE KANAN</text>

        <!-- Axis Y (Vertical) -->
        <line x1="26" y1="70" x2="26" y2="220" stroke="#fbbf24" stroke-width="1.8"/>
        <path d="M 26 220 L 22 210 L 30 210 Z" fill="#fbbf24"/>
        <text x="-165" y="18" fill="#fbbf24" font-size="10" font-weight="700" font-family="monospace" transform="rotate(-90)">SUMBU Y (BARIS: 0..24) ➔ KE BAWAH</text>

        <!-- Pin 1: Origin Point Badge -->
        <circle cx="185" cy="70" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="185" y="74" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">1</text>
        <!-- Pin 2: Sumbu X Badge -->
        <circle cx="510" cy="12" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="510" y="16" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">2</text>
        <!-- Pin 3: Sumbu Y Badge -->
        <circle cx="26" cy="56" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="26" y="60" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">3</text>
      </g>

      <!-- 2. TARGET POSISI GOTOXY (STEP 2) -->
      <g id="gxy-step-2" data-step="2">
        <!-- Sample Point 1: KASIRKITA (4, 3) -->
        <rect x="90" y="88" width="160" height="32" rx="5" fill="#0b1e38" stroke="#38bdf8" stroke-width="1"/>
        <circle cx="102" cy="104" r="4" fill="#38bdf8"/>
        <text x="114" y="102" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">KASIRKITA</text>
        <text x="114" y="114" fill="#94a3b8" font-size="9" font-family="monospace">gotoxy(4, 3)</text>

        <!-- Sample Point 2: Label Input (4, 5) -->
        <rect x="90" y="132" width="220" height="32" rx="5" fill="#0b1e38" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
        <circle cx="102" cy="148" r="4" fill="#fbbf24"/>
        <text x="114" y="146" fill="#e2e8f0" font-size="10" font-family="monospace">&gt; Nama produk: [_______]</text>
        <text x="114" y="158" fill="#94a3b8" font-size="9" font-family="monospace">gotoPrintString(4, 5)</text>
      </g>

      <!-- 3. ZONA BAHAYA X >= 80 (STEP 3) -->
      <g id="gxy-step-3" data-step="3">
        <!-- Danger Zone: Right edge X >= 80 -->
        <rect x="620" y="56" width="95" height="170" rx="4" fill="rgba(239, 68, 68, 0.15)" stroke="rgba(239, 68, 68, 0.5)" stroke-dasharray="3 3"/>
        <text x="632" y="140" fill="#fca5a5" font-size="10" font-weight="700" font-family="monospace" transform="rotate(90, 632, 140)">ZONA BAHAYA (X ≥ 80)</text>

        <!-- Pin 4: Red in Danger Zone -->
        <circle cx="690" cy="75" r="9.5" fill="#dc2626" stroke="#fca5a5" stroke-width="1.2"/>
        <text x="690" y="79" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">4</text>
      </g>
    </svg>`;
teknis = replaceSvgByFigure(teknis, 'Fig 3.5', svg35New);

// Fig 3.7
const svg37New = `<svg viewBox="0 0 760 270" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Diagram Anatomi Buffer Input C">
      <defs>
        <pattern id="inpGridClean" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#38bdf8" opacity="0.15"/>
        </pattern>
        <marker id="inpArrowHead" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 1 2 L 8 5 L 1 8 z" fill="#38bdf8"/>
        </marker>
      </defs>

      <!-- Background -->
      <rect width="760" height="270" rx="10" fill="#040914" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1.2"/>
      <rect width="760" height="270" fill="url(#inpGridClean)" rx="10"/>

      <!-- Header Label -->
      <text x="25" y="34" fill="#38bdf8" font-size="12" font-weight="700" font-family="monospace">STRUKTUR ARRAY MEMORI: scanInputString(x, y, buffer, maxChar = 49)</text>

      <!-- 1. MEMORY CELLS & CAPACITY (STEP 1) -->
      <g id="inp-step-1" data-step="1">
        <g transform="translate(25, 50)">
          <!-- Cell 0 -->
          <rect x="0" y="0" width="54" height="60" rx="5" fill="#0b1e38" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="27" y="32" text-anchor="middle" fill="#ffffff" font-size="18" font-weight="700" font-family="monospace">'B'</text>
          <text x="27" y="50" text-anchor="middle" fill="#64748b" font-size="10" font-family="monospace">[0]</text>

          <!-- Cell 1 -->
          <rect x="62" y="0" width="54" height="60" rx="5" fill="#0b1e38" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="89" y="32" text-anchor="middle" fill="#ffffff" font-size="18" font-weight="700" font-family="monospace">'u'</text>
          <text x="89" y="50" text-anchor="middle" fill="#64748b" font-size="10" font-family="monospace">[1]</text>

          <!-- Cell 2 -->
          <rect x="124" y="0" width="54" height="60" rx="5" fill="#0b1e38" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="151" y="32" text-anchor="middle" fill="#ffffff" font-size="18" font-weight="700" font-family="monospace">'k'</text>
          <text x="151" y="50" text-anchor="middle" fill="#64748b" font-size="10" font-family="monospace">[2]</text>

          <!-- Cell 3 -->
          <rect x="186" y="0" width="54" height="60" rx="5" fill="#0b1e38" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="213" y="32" text-anchor="middle" fill="#ffffff" font-size="18" font-weight="700" font-family="monospace">'u'</text>
          <text x="213" y="50" text-anchor="middle" fill="#64748b" font-size="10" font-family="monospace">[3]</text>

          <!-- Ellipsis -->
          <rect x="248" y="0" width="70" height="60" rx="5" fill="#071526" stroke="rgba(255,255,255,0.1)" stroke-dasharray="2 2"/>
          <text x="283" y="36" text-anchor="middle" fill="#64748b" font-size="18" font-family="monospace">...</text>

          <!-- Cell 48: Last Char Allowed -->
          <rect x="326" y="0" width="60" height="60" rx="5" fill="#0b1e38" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="356" y="32" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="700" font-family="monospace">'A'</text>
          <text x="356" y="50" text-anchor="middle" fill="#64748b" font-size="10" font-family="monospace">[48]</text>

          <!-- Total Allocation Box -->
          <rect x="490" y="0" width="220" height="60" rx="5" fill="#071b33" stroke="rgba(56, 189, 248, 0.4)"/>
          <text x="504" y="24" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">TOTAL KAPASITAS: 50 BYTE</text>
          <text x="504" y="42" fill="#94a3b8" font-size="10" font-family="monospace">Maksimum Karakter: 49 Huruf</text>
        </g>

        <!-- Pin 1: Array Char Badge -->
        <circle cx="210" cy="74" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="210" y="78" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">1</text>
      </g>

      <!-- 2. PAYLOAD INPUT PENGGUNA (STEP 2) -->
      <g id="inp-step-2" data-step="2">
        <rect x="25" y="130" width="345" height="116" rx="6" fill="#071526" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1"/>
        <text x="38" y="152" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">1. PAYLOAD INPUT PENGGUNA</text>
        <text x="38" y="172" fill="#e2e8f0" font-size="10" font-family="monospace">• Karakter disimpan berturut-turut di memori</text>
        <text x="38" y="190" fill="#e2e8f0" font-size="10" font-family="monospace">• maxChar = kapasitas_array - 1</text>
        <text x="38" y="208" fill="#94a3b8" font-size="10" font-family="monospace">• Tombol BACKSPACE wajib menggeser pointer index</text>
        <text x="38" y="226" fill="#38bdf8" font-size="10" font-family="monospace">  dan menulis '\\0' di posisi lama!</text>

        <!-- Pin 2: maxChar Payload Badge -->
        <circle cx="340" cy="150" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="340" y="154" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">2</text>
      </g>

      <!-- 3. NUL TERMINATOR & DANGER GUARD (STEP 3) -->
      <g id="inp-step-3" data-step="3">
        <!-- Cell 49: Null Terminator '\\0' -->
        <g transform="translate(25, 50)">
          <rect x="394" y="0" width="70" height="60" rx="5" fill="#2a0c1a" stroke="#f43f5e" stroke-width="2"/>
          <text x="429" y="32" text-anchor="middle" fill="#fda4af" font-size="16" font-weight="700" font-family="monospace">'\0'</text>
          <text x="429" y="50" text-anchor="middle" fill="#f43f5e" font-size="10" font-family="monospace">[49]</text>
        </g>

        <!-- Guard Danger Card -->
        <rect x="390" y="130" width="345" height="116" rx="6" fill="#180a0e" stroke="rgba(239, 68, 68, 0.4)" stroke-width="1"/>
        <text x="404" y="152" fill="#f87171" font-size="11" font-weight="700" font-family="monospace">2. BAHAYA BUFFER OVERFLOW</text>
        <text x="404" y="172" fill="#fca5a5" font-size="10" font-family="monospace">⚠️ Jika maxChar &gt;= kapasitas buffer:</text>
        <text x="404" y="190" fill="#fca5a5" font-size="10" font-family="monospace">Karakter akan menimpa memori stack variabel lain!</text>
        <text x="404" y="208" fill="#94a3b8" font-size="10" font-family="monospace">• Tanpa '\\0', printf membaca memori liar (sampah)</text>
        <text x="404" y="226" fill="#f87171" font-size="10" font-family="monospace">• Selalu cadangkan 1 byte mutlak untuk NUL</text>

        <!-- Pin 3: NUL Terminator Badge -->
        <circle cx="454" cy="74" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="454" y="78" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">3</text>

        <!-- Pin 4: Red in Buffer Overflow Guard -->
        <circle cx="704" cy="150" r="9.5" fill="#dc2626" stroke="#fca5a5" stroke-width="1.2"/>
        <text x="704" y="154" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">4</text>
      </g>
    </svg>`;
teknis = replaceSvgByFigure(teknis, 'Fig 3.7', svg37New);

fs.writeFileSync('teknis.html', teknis, 'utf8');
console.log('Updated teknis.html successfully!');

// ==========================================
// 2. TESTING.HTML
// ==========================================
console.log('Processing testing.html...');
let testing = fs.readFileSync('testing.html', 'utf8');
testing = updateHeaderAndTheme(testing, 4);

// Fig 4.1
const svg41New = `<svg viewBox="0 0 760 270" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Diagram Anatomi Kanvas ASCII Art">
      <defs>
        <pattern id="ascGridClean" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#38bdf8" opacity="0.15"/>
        </pattern>
      </defs>

      <!-- Canvas Background -->
      <rect width="760" height="270" rx="10" fill="#040914" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1.2"/>
      <rect width="760" height="270" fill="url(#ascGridClean)" rx="10"/>

      <!-- Console Window Outer Bezel -->
      <rect x="50" y="18" width="660" height="234" rx="8" fill="#030712" stroke="#38bdf8" stroke-width="2"/>
      
      <!-- Window Title Bar -->
      <rect x="50" y="18" width="660" height="26" rx="8" fill="#0f172a"/>
      <circle cx="68" cy="31" r="4" fill="#ef4444"/>
      <circle cx="82" cy="31" r="4" fill="#f59e0b"/>
      <circle cx="96" cy="31" r="4" fill="#10b981"/>
      <text x="110" y="35" fill="#94a3b8" font-family="monospace" font-size="10">Layout Windows Terminal &middot; 80 Kolom x 25 Baris (Monospace)</text>

      <!-- 1. ZONA BANNER ASCII HEADER (Y: 1..8) (STEP 1) -->
      <g id="asc-step-1" data-step="1">
        <rect x="62" y="52" width="636" height="66" rx="6" fill="#0b1e38" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.2"/>
        <text x="74" y="72" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">1. ZONA BANNER ASCII (assets/ascii/judul.txt)</text>
        <text x="74" y="90" fill="#6ee7b7" font-size="10" font-family="monospace">+----------------------------------------------------------+</text>
        <text x="74" y="104" fill="#6ee7b7" font-size="10" font-family="monospace">|                 KASIRKITA &middot; TOKO ALAT TULIS               |</text>

        <!-- Pin 1: Blue in Header ASCII Zone -->
        <circle cx="676" cy="72" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="676" y="76" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">1</text>
      </g>

      <!-- 2. ZONA WORKSPACE & MENU TRANSAKSI (Y: 9..24) (STEP 2) -->
      <g id="asc-step-2" data-step="2">
        <rect x="62" y="126" width="410" height="74" rx="6" fill="#071526" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1"/>
        <text x="74" y="146" fill="#ffffff" font-size="11" font-weight="700" font-family="monospace">2. ZONA FORMULIR &amp; TRANSAKSI (KASIR)</text>
        <text x="74" y="166" fill="#94a3b8" font-size="10" font-family="monospace">&gt; [1] Transaksi Baru    &gt; [3] Kelola Barang</text>
        <text x="74" y="184" fill="#94a3b8" font-size="10" font-family="monospace">&gt; [2] Cetak Struk Nota  &gt; [4] Keluar Program</text>

        <!-- 4. ZONA STATUS & PROMPT BAR (Y: 20..24) -->
        <rect x="62" y="208" width="636" height="32" rx="5" fill="#0b1e38" stroke="rgba(251, 191, 36, 0.4)" stroke-width="1"/>
        <text x="74" y="228" fill="#fbbf24" font-size="10" font-weight="700" font-family="monospace">3. STATUS BAR: [F1] Bantuan  |  [Esc] Batalkan  |  Pilih menu [1-4]: _</text>

        <!-- Pin 2: Blue in Workspace Menu Zone -->
        <circle cx="446" cy="146" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="446" y="150" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">2</text>
        <!-- Pin 3: Blue in Status Bar -->
        <circle cx="676" cy="223" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="676" y="227" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">3</text>
      </g>

      <!-- 3. ZONA INTEGRITAS SPASI / GUARD (STEP 3) -->
      <g id="asc-step-3" data-step="3">
        <rect x="484" y="126" width="214" height="74" rx="6" fill="#180a0e" stroke="rgba(239, 68, 68, 0.4)" stroke-width="1"/>
        <text x="496" y="146" fill="#f87171" font-size="10" font-weight="700" font-family="monospace">4. PRESERVASI SPASI KIRI</text>
        <text x="496" y="164" fill="#fca5a5" font-size="9" font-family="monospace">&#9888;&#65039; DILARANG TRIM SPASI!</text>
        <text x="496" y="178" fill="#94a3b8" font-size="9" font-family="monospace">Spasi membentuk gambar.</text>
        <text x="496" y="190" fill="#fca5a5" font-size="9" font-family="monospace">Jika di-trim, art miring/patah.</text>

        <!-- Pin 4: Red in Space Preservation Guard -->
        <circle cx="676" cy="146" r="9.5" fill="#dc2626" stroke="#fca5a5" stroke-width="1.2"/>
        <text x="676" y="150" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">4</text>
      </g>
    </svg>`;
testing = replaceSvgByFigure(testing, 'Fig 4.1', svg41New);

// Fig 4.3
const svg43New = `<svg viewBox="0 0 760 270" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Diagram Anatomi Buffer C fgets">
      <defs>
        <pattern id="bufGridClean" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#38bdf8" opacity="0.15"/>
        </pattern>
      </defs>

      <!-- Canvas Background -->
      <rect width="760" height="270" rx="10" fill="#040914" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1.2"/>
      <rect width="760" height="270" fill="url(#bufGridClean)" rx="10"/>

      <!-- 1. TOP: Array Buffer Memory Container (STEP 1) -->
      <g id="buf-step-1" data-step="1">
        <rect x="20" y="16" width="720" height="96" rx="8" fill="#071526" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.2"/>
        <text x="36" y="36" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">STRUKTUR ARRAY MEMORI C: char text[255] (Kapasitas Buffer fgets)</text>

        <!-- Memory Cells Row -->
        <g transform="translate(34, 48)">
          <!-- Cell 0 -->
          <rect x="0" y="0" width="46" height="52" rx="4" fill="#0b1e38" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="23" y="26" text-anchor="middle" fill="#f1f5f9" font-size="15" font-weight="700" font-family="monospace">+</text>
          <text x="23" y="40" text-anchor="middle" fill="#64748b" font-size="9" font-family="monospace">[0]</text>

          <!-- Cell 1 -->
          <rect x="52" y="0" width="46" height="52" rx="4" fill="#0b1e38" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="75" y="26" text-anchor="middle" fill="#f1f5f9" font-size="15" font-weight="700" font-family="monospace">-</text>
          <text x="75" y="40" text-anchor="middle" fill="#64748b" font-size="9" font-family="monospace">[1]</text>

          <!-- Cell 2 -->
          <rect x="104" y="0" width="46" height="52" rx="4" fill="#0b1e38" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="127" y="26" text-anchor="middle" fill="#f1f5f9" font-size="15" font-weight="700" font-family="monospace">K</text>
          <text x="127" y="40" text-anchor="middle" fill="#64748b" font-size="9" font-family="monospace">[2]</text>

          <!-- Cell 3 -->
          <rect x="156" y="0" width="46" height="52" rx="4" fill="#0b1e38" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="179" y="26" text-anchor="middle" fill="#f1f5f9" font-size="15" font-weight="700" font-family="monospace">a</text>
          <text x="179" y="40" text-anchor="middle" fill="#64748b" font-size="9" font-family="monospace">[3]</text>

          <!-- Ellipsis -->
          <rect x="208" y="0" width="46" height="52" rx="4" fill="#071526" stroke="rgba(255,255,255,0.1)" stroke-dasharray="2 2"/>
          <text x="231" y="28" text-anchor="middle" fill="#64748b" font-size="15" font-family="monospace">...</text>

          <!-- Cell 252: Last Char -->
          <rect x="260" y="0" width="52" height="52" rx="4" fill="#0b1e38" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="286" y="26" text-anchor="middle" fill="#f1f5f9" font-size="15" font-weight="700" font-family="monospace">+</text>
          <text x="286" y="40" text-anchor="middle" fill="#64748b" font-size="9" font-family="monospace">[252]</text>

          <!-- Cell 253: Newline \\n -->
          <rect x="318" y="0" width="56" height="52" rx="4" fill="#1e1b4b" stroke="#818cf8" stroke-width="1.5"/>
          <text x="346" y="26" text-anchor="middle" fill="#c7d2fe" font-size="13" font-weight="700" font-family="monospace">\\n</text>
          <text x="346" y="40" text-anchor="middle" fill="#a5b4fc" font-size="9" font-family="monospace">[253]</text>

          <!-- Cell 254: Null Terminator \\0 -->
          <rect x="380" y="0" width="56" height="52" rx="4" fill="#2a0c1a" stroke="#f43f5e" stroke-width="2"/>
          <text x="408" y="26" text-anchor="middle" fill="#fda4af" font-size="13" font-weight="700" font-family="monospace">\\0</text>
          <text x="408" y="40" text-anchor="middle" fill="#f43f5e" font-size="9" font-family="monospace">[254]</text>

          <!-- Total Indicator Box -->
          <rect x="448" y="0" width="220" height="52" rx="4" fill="#071b33" stroke="rgba(56, 189, 248, 0.4)"/>
          <text x="460" y="20" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">TOTAL: 255 BYTE</text>
          <text x="460" y="36" fill="#94a3b8" font-size="10" font-family="monospace">Payload Teks Maksimal: 253 Char</text>
        </g>

        <!-- Pin 1 Badge (in Buffer Header, right-aligned) -->
        <circle cx="704" cy="74" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="704" y="78" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">1</text>
      </g>

      <!-- 2. BOTTOM LEFT: Integritas String C (\\n & \\0) (STEP 2) -->
      <g id="buf-step-2" data-step="2">
        <rect x="20" y="124" width="350" height="130" rx="8" fill="#071526" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.2"/>
        <text x="34" y="142" fill="#ffffff" font-size="11" font-weight="700" font-family="monospace">1. INTEGRITAS STRING C (\\n &amp; \\0)</text>

        <!-- Sub-row Newline -->
        <rect x="34" y="152" width="322" height="42" rx="5" fill="#0b1e38" stroke="rgba(129, 140, 248, 0.3)" stroke-width="1"/>
        <text x="44" y="169" fill="#a5b4fc" font-size="10" font-weight="700" font-family="monospace">Newline: '\\n' (ASCII 10)</text>
        <text x="44" y="184" fill="#94a3b8" font-size="9" font-family="monospace">fgets menyertakan enter dari baris file TXT.</text>
        <circle cx="334" cy="173" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="334" y="177" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">2</text>

        <!-- Sub-row Null Terminator -->
        <rect x="34" y="202" width="322" height="42" rx="5" fill="#0b1e38" stroke="rgba(244, 63, 94, 0.3)" stroke-width="1"/>
        <text x="44" y="219" fill="#fda4af" font-size="10" font-weight="700" font-family="monospace">Null Terminator: '\\0' (ASCII 0)</text>
        <text x="44" y="234" fill="#94a3b8" font-size="9" font-family="monospace">Pembatas wajib agar printf berhenti membaca.</text>
        <circle cx="334" cy="223" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="334" y="227" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">3</text>
      </g>

      <!-- 3. BOTTOM RIGHT: Guard Buffer Overflow & Null Pointer (STEP 3) -->
      <g id="buf-step-3" data-step="3">
        <rect x="390" y="124" width="350" height="130" rx="8" fill="#180a0e" stroke="rgba(239, 68, 68, 0.4)" stroke-width="1.2"/>
        <text x="404" y="142" fill="#f87171" font-size="11" font-weight="700" font-family="monospace">2. GUARD BUFFER OVERFLOW &amp; FILE NULL</text>

        <!-- Sub-row Pointer Check -->
        <rect x="404" y="152" width="322" height="42" rx="5" fill="#2a0c14" stroke="rgba(239, 68, 68, 0.3)" stroke-width="1"/>
        <text x="414" y="169" fill="#fca5a5" font-size="10" font-weight="700" font-family="monospace">&#9888;&#65039; POINTER CHECK: if (file == NULL) return;</text>
        <text x="414" y="184" fill="#94a3b8" font-size="9" font-family="monospace">Cegah Crash / SegFault jika file TXT tidak ada.</text>

        <!-- Sub-row Sizing Safe -->
        <rect x="404" y="202" width="322" height="42" rx="5" fill="#2a0c14" stroke="rgba(239, 68, 68, 0.3)" stroke-width="1"/>
        <text x="414" y="219" fill="#fca5a5" font-size="10" font-weight="700" font-family="monospace">&#128737;&#65039; SIZING SAFE: fgets(text, sizeof(text), f)</text>
        <text x="414" y="234" fill="#94a3b8" font-size="9" font-family="monospace">Batas 255 byte cegah stack memory smash.</text>
        <circle cx="704" cy="223" r="9.5" fill="#dc2626" stroke="#fca5a5" stroke-width="1.2"/>
        <text x="704" y="227" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">4</text>
      </g>
    </svg>`;
testing = replaceSvgByFigure(testing, 'Fig 4.3', svg43New);

fs.writeFileSync('testing.html', testing, 'utf8');
console.log('Updated testing.html successfully!');
