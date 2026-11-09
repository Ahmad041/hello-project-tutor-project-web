# -*- coding: utf-8 -*-
import os
import sys
import html
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

from pdf_builder.cover_and_intro import get_cover_and_intro
from pdf_builder.bab01_intro import get_bab01_intro
from pdf_builder.modul01_persiapan import get_modul01_persiapan
from pdf_builder.modul01_probis import get_modul01_probis
from pdf_builder.modul02_dokumen_after import get_modul02_dokumen_after
from pdf_builder.modul03_lib_h import get_modul03_lib_h
from pdf_builder.modul03_dokumentasi_api import get_modul03_dokumentasi_api
from pdf_builder.modul04_ascii_ui import get_modul04_ascii_ui
from pdf_builder.modul_github import get_modul_github
from pdf_builder.lampiran import get_lampiran

print("[1/4] Memuat aset diagram...")

def load_clean_svg(path):
    if not os.path.exists(path):
        return f"<div class='missing-diagram'>Diagram file not found: {path}</div>"
    soup = BeautifulSoup(open(path, encoding='utf-8').read(), 'html.parser')
    svg = soup.find('svg')
    if not svg:
        return f"<div class='missing-diagram'>SVG element not found in: {path}</div>"
    svg['width'] = '100%'
    if 'height' in svg.attrs:
        del svg['height']
    svg['style'] = 'max-width: 100%; height: auto; display: block; margin: 0 auto;'
    return str(svg)

svg_flowchart = load_clean_svg('diagrams/flowchart-checkout.html')
svg_erd_awal = load_clean_svg('diagrams/erd-awal.html')
svg_pdm_norm = load_clean_svg('diagrams/pdm-normalisasi.html')
svg_pdm_denorm = load_clean_svg('diagrams/pdm-denormalisasi.html')

probis_soup = BeautifulSoup(open('probis.html', encoding='utf-8').read(), 'html.parser')
dfd_svgs = [s for s in probis_soup.find_all('svg') if 'DFD' in s.get('aria-label', '')]
if dfd_svgs:
    dfd_svg = dfd_svgs[0]
    dfd_svg['width'] = '100%'
    if 'height' in dfd_svg.attrs:
        del dfd_svg['height']
    dfd_svg['style'] = 'max-width: 100%; height: auto; display: block; margin: 0 auto;'
    svg_dfd = str(dfd_svg)
else:
    svg_dfd = ""

print("[2/4] Menggabungkan seluruh bab ke dalam HTML...")

css = """
@page {
  size: A4;
  margin: 24mm 16mm 22mm 16mm;
}
@page:first {
  margin: 0;
}
* {
  box-sizing: border-box;
}
body {
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
  color: #1e293b;
  line-height: 1.6;
  font-size: 9.6pt;
  margin: 0;
  padding: 0;
}
.cover-page {
  page-break-after: always;
  background: linear-gradient(145deg, #070d18 0%, #0e1b2f 50%, #162a47 100%);
  color: #f8fafc;
  padding: 70px 50px;
  min-height: 1080px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.cover-top {
  border-left: 5px solid #38bdf8;
  padding-left: 24px;
}
.cover-series {
  font-size: 11pt;
  font-weight: 700;
  color: #38bdf8;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.cover-title {
  font-size: 34pt;
  font-weight: 900;
  line-height: 1.15;
  margin: 0 0 14px 0;
  color: #ffffff;
}
.cover-subtitle {
  font-size: 12.5pt;
  font-weight: 400;
  color: #94a3b8;
  line-height: 1.5;
  max-width: 620px;
}
.cover-meta {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 8px;
  padding: 20px 24px;
}
.cover-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  font-size: 9.5pt;
  color: #cbd5e1;
}
.cover-meta-item strong {
  color: #38bdf8;
  display: block;
  font-size: 8pt;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 2px;
}
.cover-footer {
  font-size: 9pt;
  color: #64748b;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 15px;
  display: flex;
  justify-content: space-between;
}
.chapter-break {
  page-break-before: always;
  padding-top: 12px;
}
.module-badge {
  display: inline-block;
  background: #2563eb;
  color: #ffffff;
  font-weight: 700;
  font-size: 8pt;
  padding: 4px 10px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 10px;
}
.badge-gold { background: #d97706; }
.badge-emerald { background: #059669; }
.badge-purple { background: #7c3aed; }
.badge-indigo { background: #4f46e5; }
.badge-slate { background: #475569; }
.badge-cyan { background: #0891b2; }

h1.chapter-title {
  font-size: 20pt;
  font-weight: 800;
  color: #0f172a;
  margin-top: 0;
  margin-bottom: 8px;
  border-bottom: 2.5px solid #2563eb;
  padding-bottom: 8px;
}
h2 {
  font-size: 13.5pt;
  font-weight: 700;
  color: #1e293b;
  margin-top: 22px;
  margin-bottom: 8px;
  border-left: 4px solid #3b82f6;
  padding-left: 8px;
}
h3 {
  font-size: 11pt;
  font-weight: 700;
  color: #334155;
  margin-top: 16px;
  margin-bottom: 6px;
}
p {
  margin-top: 0;
  margin-bottom: 10px;
  text-align: justify;
}
.callout {
  padding: 12px 16px;
  border-radius: 6px;
  margin: 12px 0;
  font-size: 9.2pt;
  page-break-inside: avoid;
}
.callout-info {
  background: #f0f7ff;
  border-left: 4px solid #0284c7;
  color: #0c4a6e;
}
.callout-tip {
  background: #f0fdf4;
  border-left: 4px solid #16a34a;
  color: #14532d;
}
.callout-warning {
  background: #fffbeb;
  border-left: 4px solid #d97706;
  color: #78350f;
}
.callout-danger {
  background: #fef2f2;
  border-left: 4px solid #dc2626;
  color: #7f1d1d;
}
.table-wrap {
  margin: 12px 0;
  page-break-inside: avoid;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 8.8pt;
  margin-bottom: 6px;
}
th {
  background: #1e293b;
  color: #f8fafc;
  text-align: left;
  padding: 7px 10px;
  border: 1px solid #334155;
  font-weight: 600;
}
td {
  padding: 6px 10px;
  border: 1px solid #cbd5e1;
  vertical-align: top;
}
tr:nth-child(even) td {
  background: #f8fafc;
}
.code-box {
  background: #0b1120;
  border-radius: 6px;
  margin: 12px 0;
  overflow: hidden;
  page-break-inside: avoid;
  border: 1px solid #1e293b;
}
.code-header {
  background: #1e293b;
  color: #94a3b8;
  padding: 5px 12px;
  font-size: 8pt;
  font-weight: 600;
  font-family: 'Consolas', 'Courier New', monospace;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #334155;
}
pre {
  margin: 0;
  padding: 10px 14px;
  color: #f1f5f9;
  font-family: 'Consolas', 'Cascadia Code', 'Courier New', monospace;
  font-size: 8.4pt;
  line-height: 1.42;
  white-space: pre-wrap;
  word-break: break-word;
}
.diagram-container {
  background: #090e17;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 14px;
  margin: 14px 0;
  page-break-inside: avoid;
  text-align: center;
}
.diagram-caption {
  color: #94a3b8;
  font-size: 8pt;
  margin-top: 8px;
  text-align: center;
}
.checklist {
  list-style: none;
  padding-left: 0;
  margin: 10px 0;
}
.checklist li {
  position: relative;
  padding-left: 22px;
  margin-bottom: 6px;
  font-size: 9.3pt;
}
.checklist li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: 900;
}
.cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 12px 0;
  page-break-inside: avoid;
}
.card-item {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px 14px;
  background: #f8fafc;
}
.card-item h4 {
  margin: 0 0 6px 0;
  color: #0f172a;
  font-size: 9.8pt;
}
.card-item p {
  margin: 0;
  font-size: 8.8pt;
  color: #475569;
}
.toc-list {
  list-style: none;
  padding-left: 0;
}
.toc-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dotted #cbd5e1;
  padding: 5px 0;
  font-size: 9.2pt;
}
.toc-item.level-1 {
  font-weight: 700;
  color: #0f172a;
  border-bottom: 1px solid #94a3b8;
  margin-top: 10px;
}
.toc-item.level-2 {
  padding-left: 18px;
  color: #334155;
}
"""

html_body = f"""<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>KasirKita - Buku Panduan Lengkap</title>
  <style>{css}</style>
</head>
<body>
  {get_cover_and_intro()}
  {get_bab01_intro()}
  {get_modul01_persiapan()}
  {get_modul01_probis(svg_flowchart, svg_erd_awal, svg_pdm_norm, svg_pdm_denorm, svg_dfd)}
  {get_modul02_dokumen_after()}
  {get_modul03_lib_h()}
  {get_modul03_dokumentasi_api()}
  {get_modul04_ascii_ui()}
  {get_modul_github()}
  {get_lampiran()}
</body>
</html>
"""

html_path = 'kasirkita_materi_lengkap.html'
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_body)

print(f"[3/4] File HTML naskah berhasil ditulis: {html_path} ({os.path.getsize(html_path):,} bytes)")

print("[4/4] Merender PDF menggunakan Playwright Chromium...")

header_html = """<div style="font-size: 7.5pt; font-family: 'Segoe UI', Arial, sans-serif; color: #64748b; width: 100%; padding: 0 16mm; display: flex; justify-content: space-between; border-bottom: 0.5px solid #e2e8f0; padding-bottom: 3px;">
  <span>KasirKita · Hello Project (Project Guide Vol. 01)</span>
  <span>Buku Panduan Lengkap Rekayasa Perangkat Lunak C17</span>
</div>"""

footer_html = """<div style="font-size: 7.5pt; font-family: 'Segoe UI', Arial, sans-serif; color: #64748b; width: 100%; padding: 0 16mm; display: flex; justify-content: space-between; border-top: 0.5px solid #e2e8f0; padding-top: 3px;">
  <span>© 2026 Hello Project · Hak Cipta Dilindungi</span>
  <span>Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span></span>
</div>"""

pdf_output_path = 'KasirKita_Panduan_Lengkap.pdf'

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('file:///' + os.path.abspath(html_path).replace('\\', '/'), wait_until='networkidle')
    page.pdf(
        path=pdf_output_path,
        format='A4',
        print_background=True,
        display_header_footer=True,
        header_template=header_html,
        footer_template=footer_html,
        margin={
            'top': '22mm',
            'bottom': '20mm',
            'left': '16mm',
            'right': '16mm'
        }
    )
    browser.close()

print(f"SUKSES! Dokumen PDF berhasil diciptakan: {pdf_output_path} ({os.path.getsize(pdf_output_path):,} bytes)")
