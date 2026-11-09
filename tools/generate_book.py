import os
import sys
import html
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

print("Menyiapkan generator PDF materi lengkap KasirKita...")

# Helper load SVG
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

# Load lib.h
lib_h_raw = ""
if os.path.exists('files/lib.h'):
    lib_h_raw = open('files/lib.h', encoding='utf-8', errors='ignore').read()

print("Aset gambar dan diagram SVG berhasil diekstrak.")
