"""Latihan checkout memakai spesifikasi diagram yang sama dengan referensi."""
from html import escape
import json
from diagram_specs import FLOW

def render():
    kinds = {
        'end': 'Oval · mulai/selesai',
        'step': 'Persegi panjang · proses',
        'decision': 'Diamond · keputusan',
        'io': 'Paralelogram · input/output'
    }
    nodes = [{'id': n, 'kind': k, 'title': t, 'subtitle': s} for n, k, t, s, _ in FLOW['nodes']]
    edges = [{'from': a, 'to': b, 'label': l, 'key': a + ':' + l} for a, b, l, _, _ in FLOW['edges']]
    config = json.dumps({'nodes': nodes, 'edges': edges}, ensure_ascii=False).replace('<', '\\u003c')

    rows = []
    for node in nodes:
        n = node['id']
        title = escape(node['title'])
        subtitle = escape(node['subtitle']) if node['subtitle'] else ''
        
        # Shape options for select fallback
        kind_options = '<option value="">Pilih simbol</option>' + ''.join(
            f'<option value="{k}">{v}</option>' for k, v in kinds.items()
        )
        
        # Shape picker buttons with SVG icons
        shape_picker = f'''<div class="checkout-shape-picker" role="group" aria-label="Bentuk simbol untuk {title}">
  <span class="checkout-picker-title">Bentuk Simbol:</span>
  <div class="checkout-shape-buttons">
    <button type="button" class="btn-shape" data-set-shape="end" title="Oval · Mulai / Selesai">
      <svg viewBox="0 0 32 18" aria-hidden="true"><rect x="1" y="1" width="30" height="16" rx="8" fill="none" stroke="currentColor" stroke-width="2"/></svg>
      <span>Oval</span>
    </button>
    <button type="button" class="btn-shape" data-set-shape="step" title="Persegi Panjang · Proses">
      <svg viewBox="0 0 32 18" aria-hidden="true"><rect x="1" y="1" width="30" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/></svg>
      <span>Kotak</span>
    </button>
    <button type="button" class="btn-shape" data-set-shape="decision" title="Diamond · Keputusan">
      <svg viewBox="0 0 32 18" aria-hidden="true"><path d="M16 1L31 9L16 17L1 9Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>
      <span>Diamond</span>
    </button>
    <button type="button" class="btn-shape" data-set-shape="io" title="Paralelogram · Input / Output">
      <svg viewBox="0 0 32 18" aria-hidden="true"><path d="M6 1H31L26 17H1Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>
      <span>Paralel</span>
    </button>
  </div>
  <select class="checkout-kind-select" data-kind="{n}" aria-label="Simbol untuk {title}">{kind_options}</select>
</div>'''

        # Outgoing edges picker
        node_edges = [e for e in edges if e['from'] == n]
        if node_edges:
            edge_fields = ''
            for edge in node_edges:
                label = edge['label'] or 'Lanjut'
                b_class = 'ya' if label == 'Ya' else 'tidak' if label == 'Tidak' else 'retry' if 'Perbaiki' in label or 'coba' in label else 'next'
                choices = '<option value="">Pilih tujuan</option>' + ''.join(
                    f'<option value="{x["id"]}">{escape(x["title"])}</option>' for x in nodes
                )
                edge_fields += f'''<div class="checkout-edge-field" data-edge-key="{escape(edge['key'])}">
  <div class="edge-tag-row">
    <span class="edge-badge badge-{b_class}">{escape(label)}</span>
    <span class="edge-arrow" aria-hidden="true">→</span>
  </div>
  <select class="checkout-edge-select" data-edge="{escape(edge['key'], quote=True)}" aria-label="{title} — {escape(label, quote=True)}">{choices}</select>
</div>'''
            edges_picker = f'''<div class="checkout-edges-picker">
  <span class="checkout-picker-title">Sambungan Keluar:</span>
  {edge_fields}
</div>'''
        else:
            edges_picker = '''<div class="checkout-edges-picker">
  <span class="checkout-picker-title">Sambungan Keluar:</span>
  <p class="edge-terminal-note">Langkah akhir (Terminal) — tidak memiliki sambungan keluar.</p>
</div>'''

        rows.append(f'''<fieldset class="checkout-node" data-node="{n}">
  <legend class="checkout-node-legend">
    <span class="node-id-tag">{n}</span>
    <strong class="node-title-text">{title}</strong>
  </legend>
  <div class="checkout-symbol" aria-hidden="true"></div>
  {f'<p class="node-sub-text">{subtitle}</p>' if subtitle else ''}
  {shape_picker}
  {edges_picker}
</fieldset>''')

    board_html = ''.join(rows)

    return f'''<section class="checkout-game" id="game-checkout" aria-labelledby="checkout-title">
<p class="story-kicker">LATIHAN INTERAKTIF · PIPELINE SIMULASI</p>
<h2 id="checkout-title">Perbaiki alur checkout KasirKita</h2>
<p class="checkout-intro">Diagram latihan ini memiliki beberapa simbol dan sambungan yang sengaja dibuat salah. Perbaiki bentuk simbol dan tujuan sambungan pipa, lalu jalankan simulasi data untuk melihat aliran transaksi Rani secara nyata.</p>
<p class="checkout-guide"><strong>Aturan Alur KasirKita:</strong> Input → Hitung total kandidat → Validasi → Simpan data & stok → Cek hasil simpan → Tampilkan nota. Jalur penanganan gagal menampilkan pesan kesalahan lalu kembali meminta perbaikan input.</p>

<noscript><p>Aktifkan JavaScript untuk bermain. Diagram referensi dan source Mermaid di bawah tetap dapat dibaca.</p></noscript>

<div class="checkout-controls">
  <button type="button" data-checkout="check" class="btn-check">Periksa alur</button>
  <button type="button" data-checkout="hint" class="btn-hint">Petunjuk berikutnya</button>
  <button type="button" data-checkout="reset" class="btn-reset">Ulangi tantangan</button>
  <button type="button" data-checkout="blank" class="btn-blank">Mulai dari kosong</button>
  <a href="#checkout-reference" class="btn-ref">Lihat referensi</a>
</div>

<p class="checkout-status" role="status" aria-live="polite"></p>
<ul class="checkout-issues"></ul>

<!-- PIPA ALUR VISUAL CANVAS -->
<div class="checkout-pipeline-wrap">
  <div class="pipeline-header">
    <div class="pipeline-legend">
      <span class="legend-item"><i class="dot dot-next"></i> Jalur Utama</span>
      <span class="legend-item"><i class="dot dot-ya"></i> Cabang Ya (Benar)</span>
      <span class="legend-item"><i class="dot dot-tidak"></i> Cabang Tidak (Salah)</span>
      <span class="legend-item"><i class="dot dot-retry"></i> Loop Perbaikan</span>
    </div>
    <div class="pipeline-zoom-controls" role="group" aria-label="Kontrol Zoom Kanvas Flowchart">
      <span class="zoom-label">Skala:</span>
      <button type="button" class="btn-zoom" data-zoom="out" title="Perkecil alur (Zoom Out) min 60%">−</button>
      <button type="button" class="btn-zoom-val" data-zoom="reset" title="Klik untuk kembalikan ke skala normal 100%">100%</button>
      <button type="button" class="btn-zoom" data-zoom="in" title="Perbesar alur (Zoom In) maks 130%">+</button>
      <button type="button" class="btn-zoom-fit" data-zoom="fit" title="Sesuaikan agar muat satu layar">⛶ Fit Layar</button>
    </div>
  </div>
  
  <div class="checkout-canvas-viewport">
    <div class="checkout-canvas-container">
      <svg class="checkout-svg-canvas" aria-hidden="true">
        <defs>
          <marker id="arrow-next" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#38bdf8"/>
          </marker>
          <marker id="arrow-ya" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#10b981"/>
          </marker>
          <marker id="arrow-tidak" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#f43f5e"/>
          </marker>
          <marker id="arrow-retry" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#f59e0b"/>
          </marker>
          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#38bdf8" flood-opacity="0.6"/>
          </filter>
        </defs>
        <g class="checkout-wires-group"></g>
        <g class="checkout-token-group"></g>
      </svg>
      <div class="checkout-board">{board_html}</div>
    </div>
  </div>
</div>

<!-- SIMULATOR SKENARIO DATA -->
<div class="checkout-simulator">
  <div class="sim-header">
    <h3>Simulasi Aliran Transaksi KasirKita</h3>
    <span class="sim-badge">Live Token Flow</span>
  </div>
  <p>Pilih salah satu kondisi checkout di bawah, lalu tekan <strong>Jalankan skenario</strong> untuk menyaksikan partikel data melintasi pipa keputusan flowchart-mu.</p>
  
  <div class="sim-controls-grid">
    <div class="sim-input-group">
      <label for="checkout-scenario">Kondisi / Kasus Transaksi:</label>
      <select id="checkout-scenario">
        <option value="normal">Normal · 2 buku @Rp12rb, bayar Rp30.000, simpan berhasil</option>
        <option value="invalid">Input salah · jumlah "abc" (bukan angka)</option>
        <option value="money">Uang kurang · total Rp24.000, bayar Rp20.000</option>
        <option value="failed">Simpan gagal · disk penuh / file data tidak dapat ditulis</option>
      </select>
    </div>
    
    <div class="sim-action-group">
      <button type="button" data-checkout="run" class="btn-run-sim">▶ Jalankan skenario</button>
    </div>
  </div>

  <div class="sim-live-status" style="display:none;" aria-live="polite">
    <div class="token-tracker">
      <span class="tracker-icon">🛒</span>
      <span class="tracker-text">Menyiapkan transaksi...</span>
    </div>
  </div>

  <div class="sim-results-panel">
    <h4>Jejak Langkah Alur:</h4>
    <ol class="checkout-trace" aria-label="Jalur simulasi"></ol>
    <p class="checkout-result" role="status" aria-live="polite"></p>
  </div>
</div>

<!-- REFLEKSI DAN KASUS EKSTRIM -->
<fieldset class="checkout-reflection">
  <legend>Tantangan Refleksi Kasus: Simpan Gagal</legend>
  <p>Jumlah dan uang pelanggan valid, tetapi saat menyimpan, file transaksi tidak dapat ditulis. Apa tindakan yang benar dan apa alasannya?</p>
  <label><input type="radio" name="checkout-answer" value="receipt"> Tampilkan nota karena uang pelanggan cukup dan sudah dibayar.</label>
  <label><input type="radio" name="checkout-answer" value="retry"> Tampilkan kesalahan dan kembali ke input, karena transaksi belum tersimpan di file.</label>
  <label><input type="radio" name="checkout-answer" value="finish"> Selesaikan transaksi langsung karena total belanja sudah dihitung kasir.</label>
  <button type="button" data-checkout="reflect">Periksa alasan</button>
  <p class="checkout-reflection-result" role="status" aria-live="polite"></p>
</fieldset>

<p class="checkout-footer-note">Status alur tersimpan di browser (localStorage) secara otomatis. Latihan ini tidak mengunci materi berikutnya dan berfungsi sebagai sarana pemahaman logika sebelum implementasi kode C.</p>

<script type="application/json" id="checkout-spec">{config}</script>
<script src="assets/js/checkout-engine.js?v=1" defer></script>
<script src="assets/js/checkout-game.js?v=2" defer></script>
</section>'''
