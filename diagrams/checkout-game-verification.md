# Verifikasi game checkout

Halaman: probis.html#game-checkout. Generator memakai diagram_specs.FLOW untuk node, simbol, cabang, dan jawaban; file diagram referensi serta lib.h tidak diubah.

- Build berhasil, 197 tautan lokal/anchor diperiksa tanpa kegagalan. Hash file asli dan URL video tetap sama dengan baseline.
- 14 tes Node lulus: setiap simbol/sambungan salah terdeteksi, empat skenario benar, nota sebelum simpan ditolak, input salah tidak disimpan, alur kosong, siklus, perhitungan dilewati, selesai terlalu dini, dan pesan simpan gagal sebelum percobaan penyimpanan.
- Browser: tantangan awal 14/19 aturan sesuai. Lima perubahan menghasilkan semua aturan sesuai. Skenario normal menghasilkan nota; input salah, uang kurang, dan simpan gagal kembali ke input tanpa nota.
- Browser: jawaban dipulihkan setelah reload; soal alasan benar memberi penjelasan; mulai kosong menghasilkan 0/19; ulangi mengembalikan lima kesalahan. Klik petunjuk dan pemilihan kontrol melalui keyboard berhasil.
- Desktop 1440×900 diperiksa visual. Ponsel 390×844 menghasilkan satu kolom dan pageWidth 375, tanpa overflow halaman. Kontrol memakai select/button native, tidak memerlukan drag.
- Tidak ada error console yang tercatat pada pemeriksaan akhir. Semua hasil adalah simulasi pembelajaran, bukan eksekusi aplikasi C atau perubahan transaksi toko nyata.

MVP memakai node tetap dan pilihan sambungan dalam kasus checkout yang diberikan. Tata letak tidak dinilai; perubahan aturan bisnis di luar kasus latihan tidak diperiksa. Pemahaman peserta belum diuji dengan peserta nyata.
