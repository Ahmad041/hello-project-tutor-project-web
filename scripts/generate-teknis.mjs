import fs from 'node:fs';

const svg31 = fs.readFileSync('scripts/svg31.txt', 'utf8');
const svg35 = fs.readFileSync('scripts/svg35.txt', 'utf8');
const svg37 = fs.readFileSync('scripts/svg37.txt', 'utf8');

const htmlContent = `<!doctype html>
<html lang="id" class="scroll-smooth">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Modul 03 — Pustaka Grafis lib.h | Hello Project</title>
  <meta name="description" content="Modul 03 KasirKita: Manipulasi console Windows, fungsi gotoxy, border visual, kursor, dan input buffer dengan arsitektur UI Modul 01.">

  <!-- Google Fonts: Inter & Space Grotesk -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">

  <!-- Zero-FOUC Theme Initializer -->
  <script>
    (function() {
      const saved = localStorage.getItem('kasirkita-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    })();
  </script>

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
            mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
          },
          colors: {
            zinc: {
              925: '#111114',
              950: '#09090b',
            }
          }
        }
      }
    };
  </script>

  <style>
    /* ================= DUAL-THEME TOKENS (1:1 MODUL 01 PARITY) ================= */
    :root {
      --sc-canvas: #fcfcfd;
      --sc-surface: rgba(255, 255, 255, 0.94);
      --sc-ink: #18181b;
      --sc-ink-soft: #71717a;
      --sc-accent: #2563eb;
      --sc-accent-ink: #ffffff;
      --sc-hairline: rgba(228, 228, 231, 0.85);
      --sc-hairline-strong: rgba(161, 161, 170, 0.4);
      --sc-font-display: "Space Grotesk", "Inter", system-ui, sans-serif;
      --sc-font-text: "Inter", system-ui, sans-serif;
      --sc-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
    }

    html.dark {
      --sc-canvas: #09090b;
      --sc-surface: rgba(18, 18, 21, 0.82);
      --sc-ink: #f4f4f5;
      --sc-ink-soft: #a1a1aa;
      --sc-accent: #38bdf8;
      --sc-accent-ink: #09090b;
      --sc-hairline: rgba(255, 255, 255, 0.08);
      --sc-hairline-strong: rgba(255, 255, 255, 0.16);
    }

    /* Architectural Cards for Chaptered Curriculum */
    .arch-card {
      background: var(--sc-surface);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--sc-hairline);
      border-radius: 16px;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02);
      transition: border-color 200ms ease, box-shadow 200ms ease, background-color 300ms ease;
    }
    .dark .arch-card {
      box-shadow: 0 10px 30px -4px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }
    .arch-card:hover {
      border-color: var(--sc-hairline-strong);
    }

    /* Clean Collapsible Details Drawer */
    .arch-details {
      background: rgba(244, 244, 245, 0.6);
      border: 1px solid rgba(228, 228, 231, 0.8);
      border-radius: 12px;
      overflow: hidden;
      transition: all 200ms ease;
    }
    .dark .arch-details {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .arch-details > summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      background: rgba(244, 244, 245, 0.9);
      color: #18181b;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      list-style: none;
      transition: background-color 200ms ease;
    }
    .dark .arch-details > summary {
      background: rgba(255, 255, 255, 0.03);
      color: #f4f4f5;
    }
    .arch-details > summary::-webkit-details-marker { display: none; }
    .arch-details > summary::after {
      content: "Detail Teknis ▾";
      font-size: 11px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      padding: 4px 10px;
      border-radius: 6px;
      background: #e4e4e7;
      color: #3f3f46;
      font-weight: 600;
      transition: all 200ms ease;
    }
    .dark .arch-details > summary::after {
      background: rgba(255, 255, 255, 0.08);
      color: #d4d4d8;
    }
    .arch-details[open] > summary::after {
      content: "Tutup ▴";
      background: #18181b;
      color: #ffffff;
    }
    .dark .arch-details[open] > summary::after {
      background: #ffffff;
      color: #09090b;
    }
  </style>

  <link rel="stylesheet" href="assets/css/module-shared.css">
</head>
<body class="relative min-h-screen text-zinc-900 dark:text-zinc-100 bg-[#fcfcfd] dark:bg-[#09090b]" data-page="teknis.html">

  <!-- ================= TOP READING PROGRESS BAR ================= -->
  <span data-sc-progress class="fixed top-0 left-0 right-0 h-[3px] bg-zinc-900 dark:bg-white z-50 origin-left scale-x-0 transition-transform duration-75"></span>

  <!-- ================= TOP THEME TOGGLE CAPSULE (FLOATING & ACCESSIBLE) ================= -->
  <aside class="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-full border border-zinc-200 dark:border-white/10 bg-white/85 dark:bg-zinc-900/80 p-1.5 backdrop-blur-xl shadow-sm dark:shadow-2xl transition-colors duration-300" aria-label="Pengalih Mode Tampilan">
    <button id="theme-btn-light" type="button" class="flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all focus:outline-none focus:ring-1 focus:ring-zinc-400" aria-label="Beralih ke Mode Terang">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
      <span>Terang</span>
    </button>
    <button id="theme-btn-dark" type="button" class="flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all focus:outline-none focus:ring-1 focus:ring-zinc-400" aria-label="Beralih ke Mode Gelap">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 0 1 1-9-9Z"/></svg>
      <span>Gelap</span>
    </button>
  </aside>

  <!-- ================= TOP NAV CHROME ================= -->
  <header class="fixed top-5 left-5 right-5 sm:left-8 sm:right-8 z-40 flex items-center justify-between pointer-events-none">
    <a href="index.html" class="pointer-events-auto flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-white/90 bg-black/40 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10 hover:border-white/30 transition-colors">
      <span>⬡ HELLO PROJECT</span>
    </a>
    <a href="daftarModul.html" class="pointer-events-auto text-xs font-mono font-medium text-white/90 bg-black/40 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10 hover:border-white/30 transition-colors">
      <span>Daftar Modul ↗</span>
    </a>
  </header>

  <main id="top" class="w-full flex flex-col">

    <!-- ================= HERO SECTION (ATMOSPHERIC GRADIENT BENCHMARK) ================= -->
    <section class="relative bg-zinc-950 text-white pt-32 pb-24 px-5 sm:px-8 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-zinc-950/80 to-zinc-950 pointer-events-none"></div>
      
      <div class="relative max-w-4xl mx-auto z-10">
        <div class="inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/50 px-3 py-1 backdrop-blur-md mb-6">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="font-mono text-[11px] uppercase tracking-[0.16em] text-white font-semibold">
            MODUL 03 · PUSTAKA GRAFIS LIB.H
          </span>
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white leading-[1.08] drop-shadow-2xl">
          Gunakan lib.h untuk tampilan dan input konsol.
        </h1>
        <p class="text-base sm:text-lg text-white/85 mt-6 max-w-2xl leading-relaxed drop-shadow-md">
          Pelajari penataan folder proyek C, fungsi gotoxy Windows, pembuatan border ASCII, dan pembacaan input buffer string dengan proteksi NUL terminator.
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-300">
          <span class="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/15">⏱ ± 60 Menit</span>
          <span class="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/15">Level Menengah</span>
          <span class="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/15">Output: Header Modular &amp; UI Terminal</span>
          <a href="daftarisi-3.html" class="px-3 py-1.5 rounded-lg bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-300 hover:text-white transition-colors">Daftar Isi Modul 03 ↗</a>
        </div>
      </div>
    </section>

    <!-- ================= SUBSTANCE: THE 7 SYSTEMATIC CHAPTERS ================= -->
    <section class="w-full bg-[#fcfcfd] dark:bg-[#09090b] py-16 sm:py-20 px-5 sm:px-8 border-t border-zinc-200 dark:border-white/10 transition-colors duration-300">
      <div class="w-full max-w-4xl mx-auto">

        <!-- Curriculum Header -->
        <div class="text-center mb-16">
          <span class="inline-block border border-zinc-300 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800/60 px-3.5 py-1 rounded-full font-mono text-[11px] text-zinc-700 dark:text-zinc-300 uppercase tracking-widest mb-3 font-semibold">
            KURIKULUM LENGKAP · 7 LANGKAH REKAYASA PUSTAKA C
          </span>
          <h2 class="text-3xl sm:text-4xl font-bold font-display text-zinc-950 dark:text-white tracking-tight">Perjalanan Modul 03</h2>
          <p class="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Pelajari setiap konsep, analogi nyata, bedah cetak biru, dan pola kode C secara teratur.
          </p>
        </div>

        <div class="space-y-8">

          <!-- Langkah 01: Folder -->
          <article class="arch-card p-6 sm:p-8" id="folder">
            <div class="flex items-center justify-between mb-4">
              <span class="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                LANGKAH 01 / 07
              </span>
              <span class="text-xs font-mono text-zinc-400 dark:text-zinc-500">Estimasi: 10 mnt</span>
            </div>
            <h3 class="text-2xl font-bold font-display text-zinc-950 dark:text-white tracking-tight">Siapkan struktur folder</h3>
            <p class="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed mt-3">
              Pisahkan file C, header library, ASCII art, dan executable agar proses build MinGW rapi dan terisolasi.
            </p>

            <div class="mt-5 p-4 rounded-xl bg-zinc-100/70 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
              <span class="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">💡 BAYANGKAN BEGINI</span>
              <p class="text-sm text-zinc-700 dark:text-zinc-300 mt-1">Seperti menyediakan rak berbeda untuk alat dan bahan kerja di bengkel.</p>
            </div>

            <div class="mt-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-800 dark:text-zinc-200">
              <strong>Coba sekarang:</strong> Buat folder <code>kasirkita</code>, lalu subfolder <code>src</code>, <code>include</code>, <code>data</code>, <code>assets/ascii</code>, dan <code>build</code>.
            </div>

            <!-- Fig 3.1 Diagram -->
            <div class="story-anatomy" data-anatomy-scroll data-steps="3">
              <div class="anatomy-header">
                <span class="anatomy-badge">🔬 BEDAH ANATOMI</span>
                <span class="anatomy-fig">Fig 3.1 · Anatomi Struktur Folder &amp; Pipeline Build C</span>
              </div>
              <h4 class="anatomy-title">Pemisahan Direktori Source Code, Header, Data TXT &amp; Build Artifacts</h4>
              
              <div class="anatomy-canvas">
                ${svg31}
              </div>

              <!-- Stepper Controls Bar -->
              <div class="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 text-xs font-mono">
                <div class="flex items-center gap-1.5">
                  <button data-step-prev class="px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Sebelumnya">⏮ Prev</button>
                  <button data-step-btn="1" class="px-3 py-1 rounded transition-colors" title="Source & Header">Tahap 1</button>
                  <button data-step-btn="2" class="px-3 py-1 rounded transition-colors" title="Data & Assets">Tahap 2</button>
                  <button data-step-btn="3" class="px-3 py-1 rounded transition-colors" title="Build & Compile">Tahap 3</button>
                  <button data-step-next class="px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Selanjutnya">Next ⏭</button>
                </div>
                <span data-step-display class="font-bold text-blue-600 dark:text-sky-400">Tahap 1 / 3</span>
              </div>

              <!-- Responsive Callout Legend Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 text-xs">
                <div id="dir-legend-1" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="1">
                  <span class="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">1</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Direktori include/ &amp; src/:</strong> Memisahkan deklarasi fungsi pustaka dengan implementasi logika utama kasir.</span>
                </div>
                <div id="dir-legend-2" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="2">
                  <span class="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">2</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Direktori data/ &amp; assets/:</strong> Wadah file persistensi transaksi dan seni ASCII terpisah dari binary.</span>
                </div>
                <div id="dir-legend-3" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="3">
                  <span class="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">3</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Direktori build/:</strong> Tempat penyimpanan file output hasil kompilasi executable (.exe).</span>
                </div>
                <div id="dir-legend-4" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="3">
                  <span class="w-6 h-6 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">4</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Working Directory Rule:</strong> Program wajib dieksekusi dari root folder proyek agar path relatif <code>assets/...</code> terbaca.</span>
                </div>
              </div>
            </div>

            <details class="arch-details mt-6">
              <summary>Lihat diagram, contoh, dan materi lengkap</summary>
              <div class="p-5 text-sm text-zinc-700 dark:text-zinc-300 space-y-4">
                <div class="overflow-x-auto rounded-xl border border-zinc-200 dark:border-white/10 shadow-sm">
                  <table class="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr class="border-b border-zinc-200 dark:border-white/10 bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-bold">
                        <th class="p-3">Folder</th>
                        <th class="p-3">Isi</th>
                        <th class="p-3">Penjelasan</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-200 dark:divide-white/5 text-zinc-600 dark:text-zinc-400">
                      <tr><td class="p-3 font-mono text-blue-600 dark:text-sky-400">kasirkita/</td><td class="p-3">Root proyek</td><td class="p-3">Folder utama; jalankan perintah kompilasi dan eksekusi dari sini</td></tr>
                      <tr><td class="p-3 font-mono text-blue-600 dark:text-sky-400">kasirkita/src/</td><td class="p-3">main.c</td><td class="p-3">Program utama C yang memanggil fungsi lib.h</td></tr>
                      <tr><td class="p-3 font-mono text-blue-600 dark:text-sky-400">kasirkita/include/</td><td class="p-3">lib.h</td><td class="p-3">Header bantuan console Windows</td></tr>
                      <tr><td class="p-3 font-mono text-blue-600 dark:text-sky-400">kasirkita/assets/ascii/</td><td class="p-3">judul.txt</td><td class="p-3">Gambar ASCII untuk header toko</td></tr>
                      <tr><td class="p-3 font-mono text-blue-600 dark:text-sky-400">kasirkita/build/</td><td class="p-3">latihan.exe</td><td class="p-3">Hasil kompilasi executable</td></tr>
                    </tbody>
                  </table>
                </div>

                <div class="rounded-xl border border-zinc-300 dark:border-white/10 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs overflow-x-auto">
                  <div class="text-zinc-400 text-[11px] mb-2">// Perintah Kompilasi Terminal PowerShell / CMD</div>
                  <pre><code>gcc src/main.c -Iinclude -o build/latihan.exe
.\\build\\latihan.exe</code></pre>
                </div>
              </div>
            </details>
          </article>

          <!-- Langkah 02: lib-intro -->
          <article class="arch-card p-6 sm:p-8" id="lib-intro">
            <div class="flex items-center justify-between mb-4">
              <span class="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                LANGKAH 02 / 07
              </span>
              <span class="text-xs font-mono text-zinc-400 dark:text-zinc-500">Estimasi: 12 mnt</span>
            </div>
            <h3 class="text-2xl font-bold font-display text-zinc-950 dark:text-white tracking-tight">Kenali isi lib.h</h3>
            <p class="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed mt-3">
              Library membantu menata tampilan dan input di console Windows dengan fungsi abstraksi User32/Kernel32.
            </p>

            <div class="mt-5 p-4 rounded-xl bg-zinc-100/70 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
              <span class="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">💡 BAYANGKAN BEGINI</span>
              <p class="text-sm text-zinc-700 dark:text-zinc-300 mt-1">Seperti kotak alat mekanik: pilih kunci pas yang sesuai jenis baut.</p>
            </div>

            <div class="mt-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-800 dark:text-zinc-200">
              <strong>Coba sekarang:</strong> Buka header dan temukan fungsi untuk memindahkan kursor: <code>gotoxy(x, y)</code>.
            </div>

            <details class="arch-details mt-6">
              <summary>Lihat diagram, contoh, dan materi lengkap</summary>
              <div class="p-5 text-sm text-zinc-700 dark:text-zinc-300 space-y-4">
                
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/60 shadow-sm">
                  <div>
                    <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">BAHAN DOWNLOAD</span>
                    <h4 class="font-bold text-zinc-900 dark:text-white text-sm mt-0.5">Library lib.h</h4>
                    <p class="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Header C berisi fungsi bantuan untuk tampilan dan input console Windows.</p>
                  </div>
                  <a href="files/lib.h" download class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-semibold text-xs hover:opacity-90 transition-opacity shrink-0 shadow-sm">
                    <span>Unduh Library lib.h</span>
                    <span>↓</span>
                  </a>
                </div>

                <div class="overflow-x-auto rounded-xl border border-zinc-200 dark:border-white/10 shadow-sm">
                  <table class="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr class="border-b border-zinc-200 dark:border-white/10 bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-bold">
                        <th class="p-3">Kelompok</th>
                        <th class="p-3">Fungsi</th>
                        <th class="p-3">Kegunaan</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-200 dark:divide-white/5 text-zinc-600 dark:text-zinc-400">
                      <tr><td class="p-3 font-semibold text-zinc-900 dark:text-zinc-200">Posisi &amp; Teks</td><td class="p-3 font-mono text-blue-600 dark:text-sky-400">gotoxy, gotoPrintString, gotoPrintChar</td><td class="p-3">Menempatkan teks atau karakter pada koordinat (x, y)</td></tr>
                      <tr><td class="p-3 font-semibold text-zinc-900 dark:text-zinc-200">Bingkai</td><td class="p-3 font-mono text-blue-600 dark:text-sky-400">borderLine, borderDoubleLine, borderClear</td><td class="p-3">Menggambar atau menghapus garis tepi kotak menu</td></tr>
                      <tr><td class="p-3 font-semibold text-zinc-900 dark:text-zinc-200">Area &amp; Kursor</td><td class="p-3 font-mono text-blue-600 dark:text-sky-400">clearArea, hideCursor, showCursor</td><td class="p-3">Membersihkan area teks dan mengatur visibilitas kursor</td></tr>
                      <tr><td class="p-3 font-semibold text-zinc-900 dark:text-zinc-200">Input Buffer</td><td class="p-3 font-mono text-blue-600 dark:text-sky-400">scanInputString, scanInputInt, scanInputFormatPrice</td><td class="p-3">Membaca teks, bilangan bulat, dan nominal rupiah berformat</td></tr>
                    </tbody>
                  </table>
                </div>

                <p class="leading-relaxed">
                  <code>lib.h</code> adalah header bantuan console Windows yang diberikan untuk latihan. File ini berisi definisi fungsi, bukan hanya deklarasi. Gunakan satu file C untuk latihan awal dan include header ini satu kali.
                </p>
              </div>
            </details>
          </article>

          <!-- Langkah 03: lib-review -->
          <article class="arch-card p-6 sm:p-8" id="lib-review">
            <div class="flex items-center justify-between mb-4">
              <span class="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                LANGKAH 03 / 07
              </span>
              <span class="text-xs font-mono text-zinc-400 dark:text-zinc-500">Estimasi: 15 mnt</span>
            </div>
            <h3 class="text-2xl font-bold font-display text-zinc-950 dark:text-white tracking-tight">Periksa sebelum memakai</h3>
            <p class="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed mt-3">
              Periksa logika penanganan tombol BACKSPACE pada fungsi input agar pengguna bisa menghapus karakter tanpa merusak memori buffer.
            </p>

            <div class="mt-5 p-4 rounded-xl bg-zinc-100/70 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
              <span class="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">💡 BAYANGKAN BEGINI</span>
              <p class="text-sm text-zinc-700 dark:text-zinc-300 mt-1">Seperti menguji fungsi penghapus pada pensil sebelum mulai menggambar.</p>
            </div>

            <div class="mt-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-800 dark:text-zinc-200">
              <strong>Coba sekarang:</strong> Periksa apakah blok <code>else if (ch == 8)</code> sudah memundurkan kursor dan mengurangi indeks.
            </div>

            <details class="arch-details mt-6">
              <summary>Lihat diagram, contoh, dan materi lengkap</summary>
              <div class="p-5 text-sm text-zinc-700 dark:text-zinc-300 space-y-4">
                
                <div class="rounded-xl border border-zinc-300 dark:border-white/10 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs overflow-x-auto">
                  <div class="text-zinc-400 text-[11px] mb-2">// Koreksi Bug Backspace pada lib.h (Karakter ASCII 8)</div>
                  <pre><code><span class="text-purple-400">else if</span> (ch == <span class="text-amber-400">8</span>) { <span class="text-zinc-500">// Tombol BACKSPACE ditekan</span>
    <span class="text-purple-400">if</span> (i &gt; <span class="text-amber-400">0</span>) {
        i--;
        printf(<span class="text-emerald-400">"\\b \\b"</span>); <span class="text-zinc-500">// Mundur 1 char, timpa spasi, mundur lagi</span>
    }
}</code></pre>
                </div>

                <div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <strong>Penting untuk Ujian Sidang:</strong> Empat fungsi input (<code>scanInputString</code>, <code>scanInputInt</code>, <code>scanInputFloat</code>, <code>scanInputFormatPrice</code>) harus menerapkan penanganan backspace yang sama agar terminal tidak mencetak karakter sampah saat pengguna salah ketik.
                </div>
              </div>
            </details>
          </article>

          <!-- Langkah 04: lib-setup -->
          <article class="arch-card p-6 sm:p-8" id="lib-setup">
            <div class="flex items-center justify-between mb-4">
              <span class="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                LANGKAH 04 / 07
              </span>
              <span class="text-xs font-mono text-zinc-400 dark:text-zinc-500">Estimasi: 8 mnt</span>
            </div>
            <h3 class="text-2xl font-bold font-display text-zinc-950 dark:text-white tracking-tight">Siapkan latihan pertama</h3>
            <p class="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed mt-3">
              Buat <code>src/main.c</code> minimal untuk memverifikasi compiler GCC dapat menemukan header <code>include/lib.h</code> tanpa peringatan.
            </p>

            <div class="mt-5 p-4 rounded-xl bg-zinc-100/70 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
              <span class="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">💡 BAYANGKAN BEGINI</span>
              <p class="text-sm text-zinc-700 dark:text-zinc-300 mt-1">Siapkan meja dan alat sebelum mulai merakit mesin kasir.</p>
            </div>

            <div class="mt-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-800 dark:text-zinc-200">
              <strong>Coba sekarang:</strong> Simpan <code>src/main.c</code> dan <code>include/lib.h</code>, lalu compile dari root project.
            </div>

            <details class="arch-details mt-6">
              <summary>Lihat diagram, contoh, dan materi lengkap</summary>
              <div class="p-5 text-sm text-zinc-700 dark:text-zinc-300 space-y-4">
                
                <div class="rounded-xl border border-zinc-300 dark:border-white/10 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs overflow-x-auto">
                  <div class="text-zinc-400 text-[11px] mb-2">// src/main.c · Template Kompilasi Pertama</div>
                  <pre><code><span class="text-purple-400">#include</span> <span class="text-emerald-400">&lt;stdio.h&gt;</span>
<span class="text-purple-400">#include</span> <span class="text-emerald-400">&lt;stdlib.h&gt;</span>
<span class="text-purple-400">#include</span> <span class="text-emerald-400">&lt;windows.h&gt;</span>
<span class="text-purple-400">#include</span> <span class="text-emerald-400">"lib.h"</span>

<span class="text-blue-400">int</span> <span class="text-amber-400">main</span>() {
    system(<span class="text-emerald-400">"cls"</span>);
    gotoxy(<span class="text-amber-400">10</span>, <span class="text-amber-400">5</span>);
    printf(<span class="text-emerald-400">"Halo KasirKita! lib.h siap digunakan.\\n"</span>);
    getch();
    <span class="text-purple-400">return</span> <span class="text-amber-400">0</span>;
}</code></pre>
                </div>
              </div>
            </details>
          </article>

          <!-- Langkah 05: lib-position -->
          <article class="arch-card p-6 sm:p-8" id="lib-position">
            <div class="flex items-center justify-between mb-4">
              <span class="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                LANGKAH 05 / 07
              </span>
              <span class="text-xs font-mono text-zinc-400 dark:text-zinc-500">Estimasi: 12 mnt</span>
            </div>
            <h3 class="text-2xl font-bold font-display text-zinc-950 dark:text-white tracking-tight">Atur posisi teks</h3>
            <p class="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed mt-3">
              Setiap elemen antarmuka kasir ditempatkan pada koordinat kolom X dan baris Y console Windows secara presisi.
            </p>

            <div class="mt-5 p-4 rounded-xl bg-zinc-100/70 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
              <span class="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">💡 BAYANGKAN BEGINI</span>
              <p class="text-sm text-zinc-700 dark:text-zinc-300 mt-1">Seperti memilih nomor kotak baris dan kolom pada kertas berpetak matematika.</p>
            </div>

            <div class="mt-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-800 dark:text-zinc-200">
              <strong>Coba sekarang:</strong> Tempatkan teks judul di <code>(4, 5)</code> dan field input kasir di <code>(4, 10)</code>.
            </div>

            <!-- Fig 3.5 Diagram -->
            <div class="story-anatomy" data-anatomy-scroll data-steps="3">
              <div class="anatomy-header">
                <span class="anatomy-badge">🔬 BEDAH ANATOMI</span>
                <span class="anatomy-fig">Fig 3.5 · Matriks Grid Layar Console Windows (gotoxy)</span>
              </div>
              <h4 class="anatomy-title">Sistem Koordinat 80 Kolom &times; 25 Baris Terminal Windows</h4>
              
              <div class="anatomy-canvas">
                ${svg35}
              </div>

              <!-- Stepper Controls Bar -->
              <div class="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 text-xs font-mono">
                <div class="flex items-center gap-1.5">
                  <button data-step-prev class="px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Sebelumnya">⏮ Prev</button>
                  <button data-step-btn="1" class="px-3 py-1 rounded transition-colors" title="Posisi Input (4, 10)">Tahap 1</button>
                  <button data-step-btn="2" class="px-3 py-1 rounded transition-colors" title="Posisi Banner (4, 5)">Tahap 2</button>
                  <button data-step-btn="3" class="px-3 py-1 rounded transition-colors" title="Posisi Kursor (18, 10)">Tahap 3</button>
                  <button data-step-next class="px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Selanjutnya">Next ⏭</button>
                </div>
                <span data-step-display class="font-bold text-blue-600 dark:text-sky-400">Tahap 1 / 3</span>
              </div>

              <!-- Responsive Callout Legend Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 text-xs">
                <div id="pos-legend-1" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="1">
                  <span class="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">1</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Titik Origin (0,0):</strong> Sudut kiri paling atas layar terminal console Windows.</span>
                </div>
                <div id="pos-legend-2" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="2">
                  <span class="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">2</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Sumbu X (Kolom):</strong> Bergerak horizontal ke kanan dari indeks 0 s.d. 79 karakter.</span>
                </div>
                <div id="pos-legend-3" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="1">
                  <span class="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">3</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Sumbu Y (Baris):</strong> Bergerak vertikal KE BAWAH dari indeks 0 s.d. 24 baris.</span>
                </div>
                <div id="pos-legend-4" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="3">
                  <span class="w-6 h-6 rounded-full bg-red-600 dark:bg-red-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">4</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Batas Aman Buffer:</strong> Menulis melebihi batas 80x25 akan memicu auto-scroll yang merusak layout visual antarmuka.</span>
                </div>
              </div>
            </div>

            <details class="arch-details mt-6">
              <summary>Lihat diagram, contoh, dan materi lengkap</summary>
              <div class="p-5 text-sm text-zinc-700 dark:text-zinc-300 space-y-4">
                <div class="rounded-xl border border-zinc-300 dark:border-white/10 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs overflow-x-auto">
                  <div class="text-zinc-400 text-[11px] mb-2">// Latihan Menata Posisi Teks dengan gotoxy</div>
                  <pre><code>gotoxy(<span class="text-amber-400">4</span>, <span class="text-amber-400">5</span>);
printf(<span class="text-emerald-400">"KASIRKITA - TOKO ALAT TULIS"</span>);

gotoxy(<span class="text-amber-400">4</span>, <span class="text-amber-400">10</span>);
printf(<span class="text-emerald-400">"Nama Produk: [                   ]"</span>);

gotoxy(<span class="text-amber-400">18</span>, <span class="text-amber-400">10</span>); <span class="text-zinc-500">// Kursor tepat di dalam kotak kurung</span></code></pre>
                </div>
              </div>
            </details>
          </article>

          <!-- Langkah 06: lib-border -->
          <article class="arch-card p-6 sm:p-8" id="lib-border">
            <div class="flex items-center justify-between mb-4">
              <span class="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                LANGKAH 06 / 07
              </span>
              <span class="text-xs font-mono text-zinc-400 dark:text-zinc-500">Estimasi: 10 mnt</span>
            </div>
            <h3 class="text-2xl font-bold font-display text-zinc-950 dark:text-white tracking-tight">Kenali bingkai dan area</h3>
            <p class="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed mt-3">
              Gambar bingkai tepi ganda, bersihkan area pesan status, dan kelola kursor kedip terminal.
            </p>

            <div class="mt-5 p-4 rounded-xl bg-zinc-100/70 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
              <span class="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">💡 BAYANGKAN BEGINI</span>
              <p class="text-sm text-zinc-700 dark:text-zinc-300 mt-1">Seperti menyiapkan papan pengumuman kayu dengan garis pembatas informasi.</p>
            </div>

            <div class="mt-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-800 dark:text-zinc-200">
              <strong>Coba sekarang:</strong> Gambar bingkai ganda dari <code>(2, 1)</code> sampai <code>(62, 16)</code> dan sembunyikan kursor saat menu tampil.
            </div>

            <details class="arch-details mt-6">
              <summary>Lihat diagram, contoh, dan materi lengkap</summary>
              <div class="p-5 text-sm text-zinc-700 dark:text-zinc-300 space-y-4">
                <div class="rounded-xl border border-zinc-300 dark:border-white/10 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs overflow-x-auto">
                  <div class="text-zinc-400 text-[11px] mb-2">// Latihan Bingkai dan Manajemen Kursor</div>
                  <pre><code>hideCursor();
borderDoubleLine(<span class="text-amber-400">2</span>, <span class="text-amber-400">1</span>, <span class="text-amber-400">60</span>, <span class="text-amber-400">15</span>);
gotoPrintString(<span class="text-amber-400">5</span>, <span class="text-amber-400">3</span>, <span class="text-emerald-400">"MENU UTAMA KASIR"</span>);
getch();
showCursor();</code></pre>
                </div>
              </div>
            </details>
          </article>

          <!-- Langkah 07: lib-input -->
          <article class="arch-card p-6 sm:p-8" id="lib-input">
            <div class="flex items-center justify-between mb-4">
              <span class="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                LANGKAH 07 / 07
              </span>
              <span class="text-xs font-mono text-zinc-400 dark:text-zinc-500">Estimasi: 18 mnt</span>
            </div>
            <h3 class="text-2xl font-bold font-display text-zinc-950 dark:text-white tracking-tight">Pilih fungsi input</h3>
            <p class="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed mt-3">
              Sesuaikan fungsi pembacaan input dengan tipe data teks string, kuantitas bilangan bulat, atau nominal harga.
            </p>

            <div class="mt-5 p-4 rounded-xl bg-zinc-100/70 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
              <span class="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">💡 BAYANGKAN BEGINI</span>
              <p class="text-sm text-zinc-700 dark:text-zinc-300 mt-1">Seperti menyediakan lubang koin yang hanya menerima koin dan kotak formulir yang menerima kertas.</p>
            </div>

            <div class="mt-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-800 dark:text-zinc-200">
              <strong>Coba sekarang:</strong> Gunakan <code>scanInputString</code> untuk nama barang dan <code>scanInputInt</code> untuk kuantitas stok.
            </div>

            <!-- Fig 3.7 Diagram -->
            <div class="story-anatomy" data-anatomy-scroll data-steps="3">
              <div class="anatomy-header">
                <span class="anatomy-badge">🔬 BEDAH ANATOMI</span>
                <span class="anatomy-fig">Fig 3.7 · Anatomi Alokasi Buffer String &amp; NUL Terminator</span>
              </div>
              <h4 class="anatomy-title">Alokasi Buffer Memori Karakter C char input[50] &amp; Batas Mutlak \\0</h4>
              
              <div class="anatomy-canvas">
                ${svg37}
              </div>

              <!-- Stepper Controls Bar -->
              <div class="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 text-xs font-mono">
                <div class="flex items-center gap-1.5">
                  <button data-step-prev class="px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Sebelumnya">⏮ Prev</button>
                  <button data-step-btn="1" class="px-3 py-1 rounded transition-colors" title="Alokasi Buffer [0]..[49]">Tahap 1</button>
                  <button data-step-btn="2" class="px-3 py-1 rounded transition-colors" title="Masukan Karakter Keystroke">Tahap 2</button>
                  <button data-step-btn="3" class="px-3 py-1 rounded transition-colors" title="Penutup Mutlak \\0">Tahap 3</button>
                  <button data-step-next class="px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Selanjutnya">Next ⏭</button>
                </div>
                <span data-step-display class="font-bold text-blue-600 dark:text-sky-400">Tahap 1 / 3</span>
              </div>

              <!-- Responsive Callout Legend Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 text-xs">
                <div id="buf-legend-1" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="1">
                  <span class="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">1</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Alokasi Array Buffer:</strong> Ukuran array <code>char input[50]</code> harus cukup menampung string + 1 byte terminator.</span>
                </div>
                <div id="buf-legend-2" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="2">
                  <span class="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">2</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Penulisan Karakter:</strong> Setiap ketukan tombol keyboard mengisi indeks array secara berurutan ('B', 'u', 'k', 'u').</span>
                </div>
                <div id="buf-legend-3" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="2">
                  <span class="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">3</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Koreksi Backspace:</strong> Tombol backspace memundurkan indeks <code>i--</code> dan mencetak karakter escape '\\b \\b'.</span>
                </div>
                <div id="buf-legend-4" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="3">
                  <span class="w-6 h-6 rounded-full bg-red-600 dark:bg-red-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">4</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>NUL Terminator Guard (\\0):</strong> Wajib mengunci akhir string dengan karakter byte 0 untuk mencegah pembacaan memori liar.</span>
                </div>
              </div>
            </div>

            <details class="arch-details mt-6">
              <summary>Lihat diagram, contoh, dan materi lengkap</summary>
              <div class="p-5 text-sm text-zinc-700 dark:text-zinc-300 space-y-4">
                <div class="rounded-xl border border-zinc-300 dark:border-white/10 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs overflow-x-auto">
                  <div class="text-zinc-400 text-[11px] mb-2">// Latihan scanInputString dengan Batas Buffer</div>
                  <pre><code><span class="text-blue-400">char</span> namaBarang[<span class="text-amber-400">50</span>];
gotoxy(<span class="text-amber-400">4</span>, <span class="text-amber-400">10</span>);
printf(<span class="text-emerald-400">"Masukkan Nama: "</span>);
scanInputString(namaBarang, <span class="text-amber-400">49</span>); <span class="text-zinc-500">// Maks 49 char, byte ke-50 otomatis didedikasikan untuk '\\0'</span></code></pre>
                </div>
              </div>
            </details>
          </article>

        </div>

      </div>
    </section>

    <!-- ================= ACT 05 · COMMITMENT: RESOLVED CLOSE ================= -->
    <section id="close-section" class="w-full bg-[#fcfcfd] dark:bg-[#09090b] py-20 px-5 sm:px-8 border-t border-zinc-200 dark:border-white/10 transition-colors duration-300">
      <div class="w-full max-w-xl mx-auto flex flex-col items-center text-center p-8 rounded-3xl border border-zinc-300 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl">
        
        <!-- Terminal Status Card -->
        <div class="w-full bg-zinc-950 text-left rounded-xl p-4 font-mono text-xs text-zinc-300 border border-zinc-800 mb-6 shadow-inner">
          <div class="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-800">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            <span class="text-[11px] text-zinc-500 ml-2">kasirkita-audit.exe</span>
          </div>
          <div class="space-y-1 text-emerald-400">
            <p>✔ [INCLUDE] Header lib.h Terpasang: Valid</p>
            <p>✔ [GOTOXY] Koordinat Terminal 80x25: Presisi</p>
            <p>✔ [BUFFER] NUL Terminator &amp; Backspace: Aman</p>
            <p class="text-zinc-400 mt-2">&gt; Status Modul 03: LULUS. Siap melanjutkan ke Modul 04.</p>
          </div>
        </div>

        <h2 class="text-2xl sm:text-3xl font-bold font-display text-zinc-950 dark:text-white tracking-tight">
          Pustaka Konsol Selesai.
        </h2>
        <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-md">
          Anda telah menguasai pengaturan kursor, bingkai, dan input buffer aman. Lanjutkan ke kanvas tampilan ASCII Art pada Modul 04.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4 mt-6">
          <a href="testing.html" class="inline-flex items-center justify-center rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity shadow-md">
            Lanjut ke Modul 04 (ASCII Art) ➔
          </a>
          <a href="daftarModul.html" class="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-white/20 bg-white/60 dark:bg-zinc-800/60 px-6 py-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
            Buka Daftar Modul ↗
          </a>
        </div>

      </div>
    </section>

  </main>

  <!-- ================= SCRIPTS ================= -->
  <!-- 1. Surgical Anatomy Scrollytelling Engine -->
  <script src="assets/js/anatomy-scroll.js"></script>

  <!-- 2. Dual-Theme Toggle & Reading Progress Orchestration -->
  <script>
    // Theme Management (Zero-FOUC & Reactive)
    (function initThemeToggle() {
      const btnLight = document.getElementById('theme-btn-light');
      const btnDark = document.getElementById('theme-btn-dark');

      function updateButtons(isDark) {
        if (!btnLight || !btnDark) return;
        if (isDark) {
          btnDark.classList.add('bg-zinc-800', 'text-white', 'shadow-sm');
          btnDark.classList.remove('text-zinc-400');
          btnLight.classList.remove('bg-zinc-200', 'text-zinc-900', 'shadow-sm');
          btnLight.classList.add('text-zinc-400');
        } else {
          btnLight.classList.add('bg-zinc-200', 'text-zinc-900', 'shadow-sm');
          btnLight.classList.remove('text-zinc-600');
          btnDark.classList.remove('bg-zinc-800', 'text-white', 'shadow-sm');
          btnDark.classList.add('text-zinc-600');
        }
      }

      function setTheme(isDark) {
        if (isDark) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('kasirkita-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('kasirkita-theme', 'light');
        }
        updateButtons(isDark);
      }

      const initialDark = document.documentElement.classList.contains('dark');
      updateButtons(initialDark);

      if (btnLight) btnLight.addEventListener('click', () => setTheme(false));
      if (btnDark) btnDark.addEventListener('click', () => setTheme(true));
    })();

    // Reading Progress Bar
    (function initReadingProgress() {
      const bar = document.querySelector('[data-sc-progress]');
      if (!bar) return;
      function update() {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const p = total > 0 ? window.scrollY / total : 0;
        bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, p)) + ')';
      }
      window.addEventListener('scroll', update, { passive: true });
      update();
    })();
  </script>
</body>
</html>
`;

fs.writeFileSync('teknis.html', htmlContent, 'utf8');
console.log('Successfully generated teknis.html with 100% 1:1 Modul 01 parity!');
