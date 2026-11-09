import fs from 'fs';

function updateHeaderAndTheme(html, modNumber, modLabel) {
  // 1. Ensure module-shared.css is linked in head
  if (!html.includes('assets/css/module-shared.css')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="assets/css/module-shared.css">\n</head>');
  }

  // 2. Remove floating center aside if present
  html = html.replace(/<!-- Top Floating Theme Switcher Capsule -->\s*<aside class="fixed top-5 left-1\/2[\s\S]*?<\/aside>/gi, '');
  // Also remove if without comment
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

// ----------------------------------------------------
// ANALISIS.HTML
// ----------------------------------------------------
let analisis = fs.readFileSync('analisis.html', 'utf8');
analisis = updateHeaderAndTheme(analisis, 2, 'User Testing');

// SVG 2.1 Replacement
const svg21New = `<svg viewBox="0 0 760 270" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Diagram Anatomi Matriks User Testing">
      <defs>
        <pattern id="utGridClean" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#38bdf8" opacity="0.15"/>
        </pattern>
      </defs>

      <!-- Canvas Background with Dot-Grid -->
      <rect width="760" height="270" rx="10" fill="#040914" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1.2"/>
      <rect width="760" height="270" fill="url(#utGridClean)" rx="10"/>

      <!-- Header Baris Tabel -->
      <rect x="15" y="14" width="730" height="36" rx="6" fill="#0c1e38" stroke="rgba(56, 189, 248, 0.45)" stroke-width="1.2"/>
      <text x="30" y="37" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">ID KASUS</text>
      <text x="125" y="37" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">SKENARIO UJI</text>
      <text x="260" y="37" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">INPUT PENGUJI</text>
      <text x="390" y="37" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">EXPECTED RESULT</text>
      <text x="535" y="37" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">ACTUAL RESULT</text>
      <text x="660" y="37" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">STATUS</text>

      <!-- Baris 1: TC-01 Normal (Happy Path) -->
      <g id="ut-step-1" data-step="1">
        <rect x="15" y="58" width="730" height="60" rx="6" fill="#071526" stroke="rgba(56, 189, 248, 0.2)" stroke-width="1"/>
        <rect x="25" y="68" width="80" height="20" rx="4" fill="#0284c7" opacity="0.25"/>
        <text x="32" y="82" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">TC-01</text>
        <text x="32" y="103" fill="#64748b" font-size="9" font-family="monospace">NORMAL</text>
        
        <text x="125" y="80" fill="#f1f5f9" font-size="11" font-weight="600" font-family="monospace">Checkout 2 Barang</text>
        <text x="125" y="100" fill="#94a3b8" font-size="10" font-family="monospace">Bayar pas/lebih (Happy)</text>
        
        <text x="260" y="80" fill="#e2e8f0" font-size="11" font-family="monospace">P001, Qty: 2</text>
        <text x="260" y="100" fill="#94a3b8" font-size="10" font-family="monospace">Bayar: Rp30.000</text>
        
        <text x="390" y="80" fill="#bae6fd" font-size="11" font-family="monospace">Total: Rp24.000</text>
        <text x="390" y="100" fill="#bae6fd" font-size="10" font-family="monospace">Kembali: Rp6.000</text>
        
        <text x="535" y="80" fill="#86efac" font-size="11" font-family="monospace">Total Rp24.000</text>
        <text x="535" y="100" fill="#86efac" font-size="10" font-family="monospace">Struk &amp; Kembalian OK</text>
        
        <rect x="655" y="74" width="68" height="26" rx="5" fill="#064e3b" stroke="#059669" stroke-width="1"/>
        <text x="668" y="91" fill="#6ee7b7" font-size="11" font-weight="700" font-family="monospace">PASS ✓</text>
      </g>

      <!-- Baris 2: TC-02 Negatif (Boundary Attack) -->
      <g id="ut-step-2" data-step="2">
        <rect x="15" y="126" width="730" height="60" rx="6" fill="#071526" stroke="rgba(245, 158, 11, 0.25)" stroke-width="1"/>
        <rect x="25" y="136" width="80" height="20" rx="4" fill="#d97706" opacity="0.25"/>
        <text x="32" y="150" fill="#fbbf24" font-size="11" font-weight="700" font-family="monospace">TC-02</text>
        <text x="32" y="171" fill="#f59e0b" font-size="9" font-family="monospace">NEGATIF</text>
        
        <text x="125" y="148" fill="#f1f5f9" font-size="11" font-weight="600" font-family="monospace">Validasi Qty Minus</text>
        <text x="125" y="168" fill="#94a3b8" font-size="10" font-family="monospace">Bypass input salah</text>
        
        <text x="260" y="148" fill="#fca5a5" font-size="11" font-family="monospace">Qty: -5</text>
        <text x="260" y="168" fill="#94a3b8" font-size="10" font-family="monospace">(Input angka negatif)</text>
        
        <text x="390" y="148" fill="#bae6fd" font-size="11" font-family="monospace">Ditolak sistem</text>
        <text x="390" y="168" fill="#bae6fd" font-size="10" font-family="monospace">Pesan &amp; stok aman</text>
        
        <text x="535" y="148" fill="#86efac" font-size="11" font-family="monospace">Pesan &quot;Qty &gt; 0&quot;</text>
        <text x="535" y="168" fill="#86efac" font-size="10" font-family="monospace">Stok master aman</text>
        
        <rect x="655" y="142" width="68" height="26" rx="5" fill="#064e3b" stroke="#059669" stroke-width="1"/>
        <text x="668" y="159" fill="#6ee7b7" font-size="11" font-weight="700" font-family="monospace">PASS ✓</text>
      </g>

      <!-- Baris 3: TC-03 Defect (File Hilang / Crash) -->
      <g id="ut-step-3" data-step="3">
        <rect x="15" y="194" width="730" height="62" rx="6" fill="#180a0e" stroke="rgba(239, 68, 68, 0.4)" stroke-width="1"/>
        <rect x="25" y="204" width="80" height="20" rx="4" fill="#dc2626" opacity="0.25"/>
        <text x="32" y="218" fill="#f87171" font-size="11" font-weight="700" font-family="monospace">TC-03</text>
        <text x="32" y="239" fill="#ef4444" font-size="9" font-family="monospace">DEFECT</text>
        
        <text x="125" y="216" fill="#f1f5f9" font-size="11" font-weight="600" font-family="monospace">File TXT Hilang</text>
        <text x="125" y="236" fill="#94a3b8" font-size="10" font-family="monospace">Simulasi file corrupt</text>
        
        <text x="260" y="216" fill="#e2e8f0" font-size="11" font-family="monospace">Rename judul.txt</text>
        <text x="260" y="236" fill="#94a3b8" font-size="10" font-family="monospace">Saat program load</text>
        
        <text x="390" y="216" fill="#bae6fd" font-size="11" font-family="monospace">Pesan error ramah</text>
        <text x="390" y="236" fill="#bae6fd" font-size="10" font-family="monospace">Keluar terkontrol</text>
        
        <text x="535" y="216" fill="#fca5a5" font-size="11" font-weight="700" font-family="monospace">Program crash</text>
        <text x="535" y="236" fill="#fca5a5" font-size="10" font-family="monospace">Segmentation fault</text>
        
        <rect x="655" y="210" width="68" height="26" rx="5" fill="#7f1d1d" stroke="#ef4444" stroke-width="1"/>
        <text x="668" y="227" fill="#fca5a5" font-size="11" font-weight="700" font-family="monospace">FAIL ✕</text>
      </g>

      <!-- Topmost Solid Circular Pin Badges (Image 2 Standard) -->
      <!-- Pin 1: Blue in Header ID Kasus -->
      <g>
        <circle cx="95" cy="32" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="95" y="36" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">1</text>
      </g>
      <!-- Pin 2: Blue in Header Skenario Uji -->
      <g>
        <circle cx="218" cy="32" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="218" y="36" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">2</text>
      </g>
      <!-- Pin 3: Blue in Header Expected Result -->
      <g>
        <circle cx="500" cy="32" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="500" y="36" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">3</text>
      </g>
      <!-- Pin 4: Red in Header Status & Defect -->
      <g>
        <circle cx="715" cy="32" r="9.5" fill="#dc2626" stroke="#fca5a5" stroke-width="1.2"/>
        <text x="715" y="36" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">4</text>
      </g>
    </svg>`;

// Replace Fig 2.1 SVG
const f21Start = analisis.indexOf('<svg', analisis.indexOf('Fig 2.1'));
const f21End = analisis.indexOf('</svg>', f21Start) + 6;
analisis = analisis.substring(0, f21Start) + svg21New + analisis.substring(f21End);

// SVG 2.3 Replacement
const svg23New = `<svg viewBox="0 0 760 270" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Diagram Anatomi Arsitektur Standalone C">
      <defs>
        <pattern id="archGridClean" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#38bdf8" opacity="0.15"/>
        </pattern>
        <marker id="archArrowHead" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 1 2 L 8 5 L 1 8 z" fill="#38bdf8"/>
        </marker>
      </defs>

      <!-- Canvas Background -->
      <rect width="760" height="270" rx="10" fill="#040914" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1.2"/>
      <rect width="760" height="270" fill="url(#archGridClean)" rx="10"/>

      <!-- 1. KOTAK KIRI: STANDALONE C RUNTIME (STEP 1) -->
      <g id="arch-step-1" data-step="1">
        <rect x="20" y="16" width="350" height="238" rx="8" fill="#071526" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.2" stroke-dasharray="5 3"/>
        <text x="36" y="38" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">1. RUNTIME STANDALONE (WINDOWS C)</text>

        <!-- Executable Card -->
        <rect x="34" y="50" width="322" height="74" rx="6" fill="#0b1e38" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1"/>
        <text x="48" y="72" fill="#ffffff" font-size="12" font-weight="700" font-family="monospace">build/latihan.exe</text>
        <text x="48" y="90" fill="#94a3b8" font-size="10" font-family="monospace">• Proses native Windows 64-bit (GCC MinGW)</text>
        <text x="48" y="106" fill="#94a3b8" font-size="10" font-family="monospace">• Zero Server &amp; Zero External DBMS</text>

        <!-- Library Card lib.h -->
        <rect x="34" y="136" width="322" height="102" rx="6" fill="#0b1e38" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1"/>
        <text x="48" y="158" fill="#ffffff" font-size="12" font-weight="700" font-family="monospace">include/lib.h (Modular Interface)</text>
        <text x="48" y="178" fill="#38bdf8" font-size="10" font-family="monospace">gotoxy(x,y) &bull; PrintTxt(x,y,f)</text>
        <text x="48" y="196" fill="#38bdf8" font-size="10" font-family="monospace">borderLine &bull; scanInputString</text>
        <line x1="48" y1="206" x2="340" y2="206" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        <text x="48" y="224" fill="#94a3b8" font-size="10" font-family="monospace">Abstraksi grafis terminal User32 API</text>

        <!-- Pin 1: Blue in Executable Card -->
        <circle cx="334" cy="72" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="334" y="76" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">1</text>
        <!-- Pin 3: Blue in lib.h Card -->
        <circle cx="334" cy="158" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="334" y="162" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">3</text>
      </g>

      <!-- 2. KOTAK KANAN ATAS: PERSISTENSI FILE TXT (STEP 2) -->
      <g id="arch-step-2" data-step="2">
        <rect x="400" y="16" width="340" height="238" rx="8" fill="#071526" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.2"/>
        <text x="416" y="38" fill="#38bdf8" font-size="11" font-weight="700" font-family="monospace">2. PERSISTENSI DATA LOKAL (.TXT)</text>

        <!-- Data Store Card -->
        <rect x="414" y="50" width="312" height="96" rx="6" fill="#0b1e38" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1"/>
        <text x="428" y="72" fill="#ffffff" font-size="12" font-weight="700" font-family="monospace">File Storage Direktori Proyek</text>
        <text x="428" y="92" fill="#e2e8f0" font-size="10" font-family="monospace">📄 <tspan fill="#38bdf8" font-weight="700">assets/ascii/judul.txt</tspan> (Banner Header)</text>
        <text x="428" y="110" fill="#e2e8f0" font-size="10" font-family="monospace">📄 <tspan fill="#fbbf24" font-weight="700">data/penjualan.txt</tspan> (Jurnal Transaksi)</text>
        <text x="428" y="128" fill="#94a3b8" font-size="10" font-family="monospace">• Format teks murni (CSV/Tab delimited)</text>

        <!-- Connecting Flow Arrow: exe to data storage -->
        <path d="M 356 87 C 378 87, 388 98, 408 98" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" fill="none" marker-end="url(#archArrowHead)"/>

        <!-- Pin 2: Blue in File Storage Card -->
        <circle cx="704" cy="72" r="9.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1.2"/>
        <text x="704" y="76" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">2</text>
      </g>

      <!-- 3. KOTAK KANAN BAWAH: ERROR GUARD (STEP 3) -->
      <g id="arch-step-3" data-step="3">
        <!-- Error Guard Card -->
        <rect x="414" y="156" width="312" height="82" rx="6" fill="#180a0e" stroke="rgba(239, 68, 68, 0.4)" stroke-width="1"/>
        <text x="428" y="178" fill="#f87171" font-size="11" font-weight="700" font-family="monospace">VALIDASI GUARD: if (file == NULL)</text>
        <text x="428" y="198" fill="#fca5a5" font-size="10" font-family="monospace">Tolak pembacaan buffer jika file hilang!</text>
        <text x="428" y="216" fill="#94a3b8" font-size="10" font-family="monospace">Cegah Crash / Segmentation Fault di Sidang</text>

        <!-- Pin 4: Red in Error Guard Card -->
        <circle cx="704" cy="178" r="9.5" fill="#dc2626" stroke="#fca5a5" stroke-width="1.2"/>
        <text x="704" y="182" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="700">4</text>
      </g>
    </svg>`;

const f23Start = analisis.indexOf('<svg', analisis.indexOf('Fig 2.3'));
const f23End = analisis.indexOf('</svg>', f23Start) + 6;
analisis = analisis.substring(0, f23Start) + svg23New + analisis.substring(f23End);

fs.writeFileSync('analisis.html', analisis, 'utf8');
console.log('Updated analisis.html successfully!');
