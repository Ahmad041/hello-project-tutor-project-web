import os
import fitz

pdf_path = 'KasirKita_Panduan_Lengkap.pdf'
temp_path = 'KasirKita_Panduan_Lengkap_temp.pdf'

doc = fitz.open(pdf_path)

toc = [
    [1, 'Kata Pengantar & Ringkasan Eksekutif', 2],
    [1, 'Daftar Isi Lengkap', 3],
    [1, 'BAB 1: Pendahuluan & Siklus Hidup Proyek (SDLC)', 6],
    [2, '1.1 Mengenal Hello Project & KasirKita', 6],
    [2, '1.2 Siklus Hidup Perangkat Lunak (SDLC)', 6],
    [2, '1.3 Peta Jalan Pembelajaran (Roadmap)', 7],
    [1, 'BAB 2: Modul 01 — Dokumen Persiapan & Rekayasa Kebutuhan', 8],
    [2, '2.1 Menemukan Masalah Nyata & Menentukan Tema Proyek', 8],
    [2, '2.2 Analisis Platform: Desktop Console C vs Web', 8],
    [2, '2.3 Arsitektur Standalone Offline vs Sistem Terintegrasi', 9],
    [2, '2.4 Menetapkan Batasan Cakupan (Scope)', 9],
    [2, '2.5 Prinsip Pemisahan Data: Entitas Master vs Transaksi', 10],
    [2, '2.6 Ekstraksi Kebutuhan & Identifikasi Atribut Data', 11],
    [2, '2.7 Activity Plan (AP): Format Rencana Kerja', 11],
    [1, 'BAB 3: Analisis Proses Bisnis, Pemodelan Data & DFD (Probis)', 13],
    [2, '3.1 Analisis Proses Bisnis: Kondisi As-Is vs To-Be', 13],
    [2, '3.2 Diagram Alir Transaksi Penjualan (Flowchart Checkout)', 13],
    [2, '3.3 Pemodelan Konseptual: ERD Awal Berbasis Nota Fisik', 14],
    [2, '3.4 Normalisasi Basis Data Fisik (PDM: 1NF, 2NF, 3NF)', 15],
    [2, '3.5 Denormalisasi Terkontrol (Total & Unit Price)', 16],
    [2, '3.6 Data Flow Diagram (DFD: Level 0 & Level 1)', 17],
    [2, '3.7 Kamus Data Komprehensif (Data Dictionary)', 18],
    [2, '3.8 Desain Penyimpanan Berkas Teks (.txt) pada Bahasa C', 21],
    [2, '3.9 Matriks Fitur & Kriteria Keberhasilan', 21],
    [1, 'BAB 4: Modul 02 — Dokumen After (Pengujian & Serah Terima)', 23],
    [2, '4.1 Metodologi User Acceptance Testing (UAT) Kasir', 23],
    [2, '4.2 Matriks Skenario UAT: Kasus Positif, Negatif, & Batas', 23],
    [2, '4.3 Pelacakan Cacat (Bug Hunter & Defect Management)', 25],
    [2, '4.4 Panduan Penyusunan Proposal Proyek Perangkat Lunak', 26],
    [2, '4.5 Product Documentation (Spesifikasi Teknis & Database)', 27],
    [2, '4.6 User Guide / User Manual KasirKita', 27],
    [2, '4.7 Format Laporan Akhir & Checklist Serah Terima', 28],
    [1, 'BAB 5: Modul 03 — Pemrograman Console Windows dengan lib.h', 29],
    [2, '5.1 Arsitektur Antarmuka Console Windows API & Peran lib.h', 29],
    [2, '5.2 Standar Struktur Folder Proyek C di IntelliJ IDEA', 29],
    [2, '5.3 Persiapan Compiler MinGW-w64 & Konfigurasi Standar C17', 30],
    [2, '5.4 Sistem Koordinat Console Windows (Grid 80x25)', 31],
    [2, '5.5 Pustaka Fungsi Posisi & Teks (gotoxy, gotoPrintString)', 31],
    [2, '5.6 Pustaka Fungsi Bingkai & Area (borderLine, clearArea)', 31],
    [2, '5.7 Manajemen Visibilitas Kursor & Jendela', 32],
    [2, '5.8 Pembacaan File Teks Eksternal (PrintTxt)', 32],
    [2, '5.9 Pustaka Fungsi Input Interaktif Khusus', 32],
    [2, '5.10 Analisis Masalah Kritis & Solusi Bug Fixes lib.h Asli', 33],
    [1, 'BAB 6: Referensi Lengkap API lib.h (18 Fungsi)', 35],
    [2, '6.1 Dokumentasi Detail Seluruh Fungsi Console Windows', 35],
    [2, '6.2 Tabel Konstanta Keyboard & Tombol Panah Navigasi', 39],
    [2, '6.3 Contoh Program Menu Console Lengkap Siap Eksekusi', 40],
    [1, 'BAB 7: Modul 04 — Desain UI/UX Terminal Console & ASCII Art', 43],
    [2, '7.1 Prinsip Desain UI/UX Antarmuka Teks (TUI)', 43],
    [2, '7.2 Persiapan & Sketsa Gambar untuk ASCII Art', 43],
    [2, '7.3 Panduan Konversi Citra ke Karakter via ASCIIArt.eu', 43],
    [2, '7.4 Teknik Integrasi ASCII Art pada Program C (Escaping Rules)', 44],
    [2, '7.5 Desain Tata Letak Layar Kasir: Form & Struk Nota', 45],
    [2, '7.6 Simulator Terminal Studio 80x25 & Uji Keterbacaan', 46],
    [1, 'BAB 8: Modul Kolaborasi — Manajemen Tim dengan Git & GitHub', 47],
    [2, '8.1 Urgensi Sistem Kontrol Versi (VCS) dalam Kerja Kelompok', 47],
    [2, '8.2 Memahami 4 Wilayah Kerja Git (Working, Staging, Local, Remote)', 47],
    [2, '8.3 Setup Identitas & Inisialisasi Repository Bersama', 48],
    [2, '8.4 Strategi Feature Branching: Bekerja Paralel Tanpa Tabrakan', 48],
    [2, '8.5 Rutinitas Harian: Aturan Emas Push, Pull, dan Commit', 48],
    [2, '8.6 Anatomi & Resolusi Merge Conflict dengan Kepala Dingin', 49],
    [2, '8.7 Standar Pull Request (PR) & Praktik Terbaik Code Review', 50],
    [2, '8.8 Template .gitignore Standar C di IntelliJ IDEA', 50],
    [2, '8.9 Git Emergency Cheat Sheet & Penanganan Kondisi Darurat', 51],
    [1, 'BAB 9: Lampiran & Kode Sumber Referensi', 53],
    [2, '9.1 Kode Lengkap Header lib.h Terkoreksi (Production-Ready)', 53],
    [2, '9.2 Skrip Build Otomatis PowerShell & Batch', 57],
    [2, '9.3 Glosarium Istilah Rekayasa Perangkat Lunak & Pemrograman C', 57]
]

doc.set_toc(toc)
doc.save(temp_path)
doc.close()

if os.path.exists(temp_path):
    os.replace(temp_path, pdf_path)
    print("Bookmarks / Outline navigation PDF berhasil disematkan!")
