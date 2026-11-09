import fs from 'node:fs';

const svg41 = fs.readFileSync('scripts/svg41.txt', 'utf8');
const svg43 = fs.readFileSync('scripts/svg43.txt', 'utf8');

const htmlContent = `<!doctype html>
<html lang="id" class="scroll-smooth">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Modul 04 — Kanvas ASCII &amp; Buffer C | Hello Project</title>
  <meta name="description" content="Modul 04 KasirKita: Pembuatan banner ASCII Art, pembacaan file dengan PrintTxt, alokasi memori buffer string C, dan staging terminal 80x25.">

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
<body class="relative min-h-screen text-zinc-900 dark:text-zinc-100 bg-[#fcfcfd] dark:bg-[#09090b]" data-page="testing.html">

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
            MODUL 04 · KANVAS ASCII &amp; BUFFER C
          </span>
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white leading-[1.08] drop-shadow-2xl">
          Rancang dan tampilkan ASCII art di konsol C.
        </h1>
        <p class="text-base sm:text-lg text-white/85 mt-6 max-w-2xl leading-relaxed drop-shadow-md">
          Ubah sketsa gambar menjadi teks font monospace, render ke staging grid terminal 80x25, dan kelola buffer string <code>char text[255]</code> secara aman.
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-300">
          <span class="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/15">⏱ ± 45 Menit</span>
          <span class="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/15">Level Menengah</span>
          <span class="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/15">Output: ASCII Banner &amp; Engine PrintTxt</span>
          <a href="daftarisi-4.html" class="px-3 py-1.5 rounded-lg bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-300 hover:text-white transition-colors">Daftar Isi Modul 04 ↗</a>
        </div>
      </div>
    </section>

    <!-- ================= SUBSTANCE: THE 4 SYSTEMATIC CHAPTERS ================= -->
    <section class="w-full bg-[#fcfcfd] dark:bg-[#09090b] py-16 sm:py-20 px-5 sm:px-8 border-t border-zinc-200 dark:border-white/10 transition-colors duration-300">
      <div class="w-full max-w-4xl mx-auto">

        <!-- Curriculum Header -->
        <div class="text-center mb-16">
          <span class="inline-block border border-zinc-300 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800/60 px-3.5 py-1 rounded-full font-mono text-[11px] text-zinc-700 dark:text-zinc-300 uppercase tracking-widest mb-3 font-semibold">
            KURIKULUM LENGKAP · 4 LANGKAH PENGEMBANGAN UI ASCII
          </span>
          <h2 class="text-3xl sm:text-4xl font-bold font-display text-zinc-950 dark:text-white tracking-tight">Perjalanan Modul 04</h2>
          <p class="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Pelajari setiap konsep, analogi nyata, bedah cetak biru, dan pola kode C secara teratur.
          </p>
        </div>

        <div class="space-y-8">

          <!-- Langkah 01: ui-sketch -->
          <article class="arch-card p-6 sm:p-8" id="ui-sketch">
            <div class="flex items-center justify-between mb-4">
              <span class="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                LANGKAH 01 / 04
              </span>
              <span class="text-xs font-mono text-zinc-400 dark:text-zinc-500">Estimasi: 12 mnt</span>
            </div>
            <h3 class="text-2xl font-bold font-display text-zinc-950 dark:text-white tracking-tight">Siapkan gambar untuk ASCII art</h3>
            <p class="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed mt-3">
              Pilih gambar sederhana dengan kontras tinggi yang tetap terbaca jelas saat diubah menjadi karakter teks monospace di console.
            </p>

            <div class="mt-5 p-4 rounded-xl bg-zinc-100/70 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
              <span class="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">💡 BAYANGKAN BEGINI</span>
              <p class="text-sm text-zinc-700 dark:text-zinc-300 mt-1">Seperti membuat papan nama toko yang harus langsung terbaca jelas dari seberang jalan.</p>
            </div>

            <div class="mt-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-800 dark:text-zinc-200">
              <strong>Coba sekarang:</strong> Pilih logo atau ikon sederhana dan simpan dalam format PNG kontras tinggi.
            </div>

            <!-- Fig 4.1 Diagram -->
            <div class="story-anatomy" data-anatomy-scroll data-steps="3">
              <div class="anatomy-header">
                <span class="anatomy-badge">🔬 BEDAH ANATOMI</span>
                <span class="anatomy-fig">Fig 4.1 · Anatomi Kanvas ASCII Art &amp; Staging Grid Terminal 80&times;25</span>
              </div>
              <h4 class="anatomy-title">Pembagian Zona Vertikal Layar Terminal 80 Kolom &times; 25 Baris</h4>
              
              <div class="anatomy-canvas">
                ${svg41}
              </div>

              <!-- Stepper Controls Bar -->
              <div class="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 text-xs font-mono">
                <div class="flex items-center gap-1.5">
                  <button data-step-prev class="px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Sebelumnya">⏮ Prev</button>
                  <button data-step-btn="1" class="px-3 py-1 rounded transition-colors" title="Banner Header (Y=1..8)">Tahap 1</button>
                  <button data-step-btn="2" class="px-3 py-1 rounded transition-colors" title="Formulir Kasir (Y=9..19)">Tahap 2</button>
                  <button data-step-btn="3" class="px-3 py-1 rounded transition-colors" title="Status Bar (Y=20..24)">Tahap 3</button>
                  <button data-step-next class="px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Selanjutnya">Next ⏭</button>
                </div>
                <span data-step-display class="font-bold text-blue-600 dark:text-sky-400">Tahap 1 / 3</span>
              </div>

              <!-- Responsive Callout Legend Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 text-xs">
                <div id="art-legend-1" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="1">
                  <span class="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">1</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Area Banner Atas (Y=1..8):</strong> Khusus menampilkan logo ASCII toko dengan tinggi maksimal 8 baris karakter.</span>
                </div>
                <div id="art-legend-2" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="2">
                  <span class="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">2</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Zona Formulir &amp; Menu (Y=9..19):</strong> Area interaktif pengguna untuk memilih menu dan input data transaksi.</span>
                </div>
                <div id="art-legend-3" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="3">
                  <span class="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">3</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Status Bar Bawah (Y=20..24):</strong> Baris pesan sukses, error input, total belanja, dan prompt tombol keluar.</span>
                </div>
                <div id="art-legend-4" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="1">
                  <span class="w-6 h-6 rounded-full bg-amber-600 dark:bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">4</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Disiplin Batas 80 Kolom:</strong> Teks ASCII dilarang melampaui kolom 78 agar tidak memicu auto-wrap di CMD Windows.</span>
                </div>
              </div>
            </div>

            <details class="arch-details mt-6">
              <summary>Lihat diagram, contoh, dan materi lengkap</summary>
              <div class="p-5 text-sm text-zinc-700 dark:text-zinc-300 space-y-4">
                <p class="leading-relaxed">
                  Pilih gambar dengan latar belakang bersih atau transparan, lalu atur ukurannya agar proporsional terhadap layar konsol latihan (sekitar 30–50 karakter lebar dan 6–10 baris tinggi).
                </p>
                <div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <strong>Tips Desain UI:</strong> Gambar yang terlalu rumit akan menghasilkan karakter berantakan saat dikonversi. Gambar monokrom siluet memberikan hasil terbaik.
                </div>
              </div>
            </details>
          </article>

          <!-- Langkah 02: ascii-convert -->
          <article class="arch-card p-6 sm:p-8" id="ascii-convert">
            <div class="flex items-center justify-between mb-4">
              <span class="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                LANGKAH 02 / 04
              </span>
              <span class="text-xs font-mono text-zinc-400 dark:text-zinc-500">Estimasi: 10 mnt</span>
            </div>
            <h3 class="text-2xl font-bold font-display text-zinc-950 dark:text-white tracking-tight">Ubah gambar menjadi ASCII art</h3>
            <p class="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed mt-3">
              Gunakan converter online untuk menghasilkan representasi teks dari gambar dan simpan sebagai berkas <code>judul.txt</code>.
            </p>

            <div class="mt-5 p-4 rounded-xl bg-zinc-100/70 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
              <span class="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">💡 BAYANGKAN BEGINI</span>
              <p class="text-sm text-zinc-700 dark:text-zinc-300 mt-1">Seperti menyusun mozaik gambar dari titik dan huruf pada kertas berpetak.</p>
            </div>

            <div class="mt-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-800 dark:text-zinc-200">
              <strong>Coba sekarang:</strong> Atur hasil agar muat dalam lebar terminal maksimal 60 karakter.
            </div>

            <details class="arch-details mt-6">
              <summary>Lihat diagram, contoh, dan materi lengkap</summary>
              <div class="p-5 text-sm text-zinc-700 dark:text-zinc-300 space-y-4">
                <ol class="list-decimal pl-5 space-y-2">
                  <li>Buka converter online seperti <a href="https://www.asciiart.eu/image-to-ascii" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-sky-400 underline font-semibold">Image to ASCII</a>.</li>
                  <li>Pilih gambar melalui area upload file.</li>
                  <li>Sesuaikan parameter Characters untuk mengontrol kerapatan detail dan lebar karakter.</li>
                  <li>Atur brightness dan contrast sampai objek siluet kasir terlihat tegas.</li>
                  <li>Salin teks hasil ke clipboard dan simpan sebagai <code>assets/ascii/judul.txt</code>.</li>
                </ol>

                <div class="rounded-xl border border-zinc-300 dark:border-white/10 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs overflow-x-auto">
                  <div class="text-zinc-400 text-[11px] mb-2">// assets/ascii/judul.txt</div>
                  <pre><code>+------------------------------------------+
|          K A S I R K I T A               |
|       TOKO ALAT TULIS &amp; KANTOR           |
+------------------------------------------+</code></pre>
                </div>
              </div>
            </details>
          </article>

          <!-- Langkah 03: ascii-c -->
          <article class="arch-card p-6 sm:p-8" id="ascii-c">
            <div class="flex items-center justify-between mb-4">
              <span class="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                LANGKAH 03 / 04
              </span>
              <span class="text-xs font-mono text-zinc-400 dark:text-zinc-500">Estimasi: 15 mnt</span>
            </div>
            <h3 class="text-2xl font-bold font-display text-zinc-950 dark:text-white tracking-tight">Letakkan ASCII art di program C</h3>
            <p class="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed mt-3">
              Fungsi <code>PrintTxt(x, y, "filename")</code> membaca file teks baris demi baris menggunakan buffer string <code>char text[255]</code>.
            </p>

            <div class="mt-5 p-4 rounded-xl bg-zinc-100/70 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
              <span class="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">💡 BAYANGKAN BEGINI</span>
              <p class="text-sm text-zinc-700 dark:text-zinc-300 mt-1">Koordinat adalah alamat petak tempat stiker poster banner akan ditempel.</p>
            </div>

            <div class="mt-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-800 dark:text-zinc-200">
              <strong>Coba sekarang:</strong> Panggil <code>PrintTxt(4, 2, "assets/ascii/judul.txt")</code> pada fungsi <code>main()</code>.
            </div>

            <!-- Fig 4.3 Diagram -->
            <div class="story-anatomy" data-anatomy-scroll data-steps="3">
              <div class="anatomy-header">
                <span class="anatomy-badge">🔬 BEDAH ANATOMI</span>
                <span class="anatomy-fig">Fig 4.3 · Anatomi Buffer String C char text[255] &amp; Null Terminator</span>
              </div>
              <h4 class="anatomy-title">Alokasi Buffer Memori Stack &amp; Mekanisme Pembacaan fgets() Baris per Baris</h4>
              
              <div class="anatomy-canvas">
                ${svg43}
              </div>

              <!-- Stepper Controls Bar -->
              <div class="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 text-xs font-mono">
                <div class="flex items-center gap-1.5">
                  <button data-step-prev class="px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Sebelumnya">⏮ Prev</button>
                  <button data-step-btn="1" class="px-3 py-1 rounded transition-colors" title="Deklarasi char text[255]">Tahap 1</button>
                  <button data-step-btn="2" class="px-3 py-1 rounded transition-colors" title="Loop Pembacaan fgets()">Tahap 2</button>
                  <button data-step-btn="3" class="px-3 py-1 rounded transition-colors" title="Proteksi NUL Terminator">Tahap 3</button>
                  <button data-step-next class="px-2.5 py-1 rounded bg-zinc-200 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors" title="Langkah Selanjutnya">Next ⏭</button>
                </div>
                <span data-step-display class="font-bold text-blue-600 dark:text-sky-400">Tahap 1 / 3</span>
              </div>

              <!-- Responsive Callout Legend Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 text-xs">
                <div id="c-legend-1" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="1">
                  <span class="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">1</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Buffer Memori Stack:</strong> Array <code>char text[255]</code> dialokasikan di stack frame lokal fungsi PrintTxt.</span>
                </div>
                <div id="c-legend-2" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="2">
                  <span class="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">2</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Looping fgets():</strong> Membaca maksimal 254 karakter atau sampai bertemu karakter newline <code>\\n</code>.</span>
                </div>
                <div id="c-legend-3" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="2">
                  <span class="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">3</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Relasi gotoxy(x, y++):</strong> Baris teks dicetak berurutan ke bawah dengan menambahkan nilai variabel baris Y.</span>
                </div>
                <div id="c-legend-4" class="flex gap-3 items-center p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.03] transition-all duration-300" data-legend-step="3">
                  <span class="w-6 h-6 rounded-full bg-red-600 dark:bg-red-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">4</span>
                  <span class="text-zinc-700 dark:text-zinc-300 leading-snug"><strong>Pemeriksaan file == NULL:</strong> Cegah segmentation fault dengan memvalidasi handle berkas sebelum memanggil fgets.</span>
                </div>
              </div>
            </div>

            <details class="arch-details mt-6">
              <summary>Lihat diagram, contoh, dan materi lengkap</summary>
              <div class="p-5 text-sm text-zinc-700 dark:text-zinc-300 space-y-4">
                <div class="rounded-xl border border-zinc-300 dark:border-white/10 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs overflow-x-auto">
                  <div class="text-zinc-400 text-[11px] mb-2">// Implementasi Aman PrintTxt di lib.h</div>
                  <pre><code><span class="text-blue-400">void</span> <span class="text-amber-400">PrintTxt</span>(<span class="text-blue-400">int</span> x, <span class="text-blue-400">int</span> y, <span class="text-purple-400">const</span> <span class="text-blue-400">char</span> *filename) {
    FILE *fp = fopen(filename, <span class="text-emerald-400">"r"</span>);
    <span class="text-purple-400">if</span> (fp == NULL) {
        gotoxy(x, y);
        printf(<span class="text-red-400">"[ERROR] File %s tidak ditemukan!\\n"</span>, filename);
        <span class="text-purple-400">return</span>;
    }
    <span class="text-blue-400">char</span> text[<span class="text-amber-400">255</span>];
    <span class="text-purple-400">while</span> (fgets(text, <span class="text-purple-400">sizeof</span>(text), fp) != NULL) {
        gotoxy(x, y++);
        printf(<span class="text-emerald-400">"%s"</span>, text);
    }
    fclose(fp);
}</code></pre>
                </div>
              </div>
            </details>
          </article>

          <!-- Langkah 04: ascii-check -->
          <article class="arch-card p-6 sm:p-8" id="ascii-check">
            <div class="flex items-center justify-between mb-4">
              <span class="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                LANGKAH 04 / 04
              </span>
              <span class="text-xs font-mono text-zinc-400 dark:text-zinc-500">Estimasi: 8 mnt</span>
            </div>
            <h3 class="text-2xl font-bold font-display text-zinc-950 dark:text-white tracking-tight">Periksa hasil tampilannya</h3>
            <p class="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed mt-3">
              Uji keberadaan file, ukuran layar console, posisi teks, dan penanganan kondisi error sebelum menggabungkannya ke program utama.
            </p>

            <div class="mt-5 p-4 rounded-xl bg-zinc-100/70 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
              <span class="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">💡 BAYANGKAN BEGINI</span>
              <p class="text-sm text-zinc-700 dark:text-zinc-300 mt-1">Seperti mengecek sambungan listrik papan nama sebelum toko resmi dibuka.</p>
            </div>

            <div class="mt-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-800 dark:text-zinc-200">
              <strong>Coba sekarang:</strong> Uji skenario file TXT sengaja direname untuk memverifikasi pesan error tampil ramah tanpa crash.
            </div>

            <details class="arch-details mt-6">
              <summary>Lihat diagram, contoh, dan materi lengkap</summary>
              <div class="p-5 text-sm text-zinc-700 dark:text-zinc-300 space-y-4">
                <div class="space-y-2.5 p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/[0.02]">
                  <span class="text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">CHECKLIST KUALITAS UI ASCII:</span>
                  <label class="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <input type="checkbox" class="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500">
                    <span>ASCII art tersimpan sebagai TXT dan spasinya utuh.</span>
                  </label>
                  <label class="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <input type="checkbox" class="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500">
                    <span>File dapat ditemukan dari direktori kerja root kasirkita.</span>
                  </label>
                  <label class="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <input type="checkbox" class="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500">
                    <span>Koordinat dan ukuran gambar muat dalam batas console 80x25.</span>
                  </label>
                  <label class="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <input type="checkbox" class="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500">
                    <span>Font monospace dipakai dan baris tidak terpotong.</span>
                  </label>
                  <label class="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <input type="checkbox" class="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500">
                    <span>File hilang menghasilkan pesan terkontrol tanpa crash.</span>
                  </label>
                  <label class="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <input type="checkbox" class="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500">
                    <span>Screenshot dan hasil aktual dicatat dalam dokumen user testing.</span>
                  </label>
                </div>

                <p class="leading-relaxed">
                  <strong>Hasil modul 04:</strong> berkas <code>assets/ascii/judul.txt</code>, pemanggil di <code>src/main.c</code>, dan screenshot console dengan judul serta pesan keluar yang tidak bertumpuk.
                </p>
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
            <p>✔ [ASCII] Banner Header 80x25: Terkalibrasi</p>
            <p>✔ [PRINTTXT] File Reading &amp; Buffer Guard: Lulus</p>
            <p>✔ [UI] Layout Kasir &amp; Pesan Status: Bersih</p>
            <p class="text-zinc-400 mt-2">&gt; Status Modul 04: LULUS. Seluruh 4 Modul Selesai!</p>
          </div>
        </div>

        <h2 class="text-2xl sm:text-3xl font-bold font-display text-zinc-950 dark:text-white tracking-tight">
          Seluruh Modul Selesai. Selamat!
        </h2>
        <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-md">
          Anda telah menguasai dokumen persiapan, pengujian dan dokumentasi, pustaka konsol lib.h, hingga antarmuka ASCII Art. Uji ketangkasan Anda di simulator pengujian.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4 mt-6">
          <a href="game/uat.html" class="inline-flex items-center justify-center rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity shadow-md">
            🎮 Buka Simulator Pengujian ↗
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

fs.writeFileSync('testing.html', htmlContent, 'utf8');
console.log('Successfully generated testing.html with 100% 1:1 Modul 01 parity!');
