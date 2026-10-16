(function (root) {
  'use strict';
  function validate(spec, answer) {
    const issues = [];
    const titles = Object.fromEntries(spec.nodes.map(n => [n.id, n.title]));
    const names = {end:'oval/terminator',step:'persegi panjang',decision:'diamond',io:'paralelogram'};
    for (const n of spec.nodes) {
      if (answer.kinds[n.id] !== n.kind) issues.push(`${n.title}: gunakan ${names[n.kind]} sesuai fungsi langkah ini.`);
    }
    for (const e of spec.edges) {
      if (answer.edges[e.key] !== e.to) issues.push(`${titles[e.from]} (${e.label || 'Lanjut'}) harus menuju ${titles[e.to]}. ${e.from === 'saved' && e.label === 'Tidak' ? 'Nota hanya boleh muncul setelah simpan berhasil.' : e.from === 'error' ? 'Pesan gagal perlu memberi kesempatan memperbaiki input.' : 'Periksa urutan serta akibat keputusan tersebut.'}`);
    }
    return {issues, total:spec.nodes.length + spec.edges.length};
  }
  function simulate(spec, answer, scenario) {
    const valid = scenario === 'normal' || scenario === 'failed';
    const saved = scenario !== 'failed';
    const trace = []; let current = 'start'; let validated = false; let committed = false; let attempted = false;
    const stop = (message,ok=false) => ({trace,message,ok});
    for (let i=0; i<24; i++) {
      if (!spec.nodes.some(n=>n.id===current)) return stop('Tujuan tidak dikenal. Pilih sambungan yang tersedia.');
      if (current === 'input' && trace.includes('error')) {
        trace.push(current);
        const reason=scenario==='money'?'Pembayaran Rp20.000 kurang dari total Rp24.000. ':scenario==='invalid'?'Jumlah bukan angka, sehingga input tidak valid. ':'File tidak dapat ditulis; transaksi belum berhasil tersimpan. ';
        return stop(reason+'Pesan kesalahan ditampilkan; alur kembali ke input untuk diperbaiki. Nota belum dibuat.', !valid || !saved);
      }
      if (trace.includes(current)) return stop('Alur berputar tanpa mencapai hasil. Periksa sambungan yang kembali ke langkah sebelumnya.');
      trace.push(current);
      if (current === 'calculate' && !trace.includes('input')) return stop('Total dihitung sebelum barang dan pembayaran dimasukkan.');
      if (current === 'valid' && !trace.includes('calculate')) return stop('Lengkapi perhitungan total kandidat sebelum memeriksa stok dan kecukupan uang.');
      if (current === 'save') {
        if (!validated) return stop('Alur mencoba menyimpan sebelum input lolos validasi. Data belum boleh disimpan.');
        attempted = true;
      }
      if (current === 'receipt' && !committed) return stop('Nota muncul meski transaksi belum berhasil tersimpan. Periksa jalur validasi dan hasil penyimpanan.');
      if (current === 'error' && valid && saved) return stop('Kasus normal masuk ke pesan kesalahan. Periksa cabang Ya pada kedua keputusan.');
      if (current === 'error' && valid && !trace.includes('saved')) return stop('Pesan simpan gagal muncul sebelum hasil penyimpanan diperiksa.');
      if (current === 'finish') return stop(committed && trace.includes('receipt') ? 'Simulasi checkout selesai: total Rp24.000, kembali Rp6.000; target stok 18. Nota muncul setelah simpan berhasil.' : 'Alur selesai sebelum checkout berhasil dan nota ditampilkan.', committed && trace.includes('receipt'));
      let label='';
      if (current === 'valid') { validated=valid; label=valid?'Ya':'Tidak'; }
      if (current === 'saved') {
        if (!attempted) return stop('Hasil penyimpanan diperiksa sebelum langkah Simpan transaksi dijalankan.');
        committed=saved; label=saved?'Ya':'Tidak';
      }
      if (current === 'error') label='Perbaiki / coba lagi';
      const target=answer.edges[current+':'+label];
      if (!target) return stop('Sambungan '+(label || 'Lanjut')+' belum dipilih. Lengkapi tujuan langkah terakhir.');
      current=target;
    }
    return stop('Alur terlalu panjang. Periksa sambungan yang berulang.');
  }
  const api={validate,simulate};
  if (typeof module !== 'undefined' && module.exports) module.exports=api;
  else root.CheckoutEngine=api;
})(typeof window !== 'undefined' ? window : globalThis);
